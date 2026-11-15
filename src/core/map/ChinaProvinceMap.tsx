import { useEffect, useMemo, useRef, useState } from "react";
import {
  ADCODE_TO_PROVINCE,
  PROVINCE_META,
  type ProvinceId,
} from "../types";
import { assetUrl } from "../../lib/assetUrl";
import { SouthChinaSea } from "./Inset";

export interface ChinaMapMarker {
  id: string;
  label: string;
  subLabel?: string;
  coord: [number, number];
  province?: ProvinceId;
  colorHex?: string;
  badge?: string;
  active?: boolean;
}

export interface ChinaMapLegendItem {
  id: string;
  label: string;
  colorHex: string;
  count?: number;
  active?: boolean;
}

export interface ChinaProvinceMapProps {
  provinceColors?: Partial<Record<ProvinceId, string>>;
  provinceBadges?: Partial<Record<ProvinceId, string>>;
  selectedProvince?: ProvinceId | "all";
  highlightedProvinces?: ProvinceId[];
  onSelectProvince?: (province: ProvinceId | "all") => void;
  markers?: ChinaMapMarker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (markerId: string) => void;
  legendItems?: ChinaMapLegendItem[];
  onSelectLegend?: (legendId: string) => void;
  defaultFillHex?: string;
  showProvinceLabels?: boolean;
  showSouthChinaSeaInset?: boolean;
  title?: string;
  subtitle?: string;
  height?: number | string;
  className?: string;
}

interface GeoFeature {
  properties?: {
    name?: string;
    adcode?: number | string;
    center?: [number, number];
    centroid?: [number, number];
    adchar?: string;
  };
  geometry?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface BBox {
  west: number;
  east: number;
  south: number;
  north: number;
}

const CHINA_BBOX: BBox = {
  west: 73.0,
  east: 135.6,
  south: 17.6,
  north: 54.0,
};

const SVG_W = 860;
const SVG_H = 600;
const PAD = 22;

const prefectureCache = new Map<ProvinceId, GeoFeature[]>();

function computeFeatureBBox(features: GeoFeature[]): BBox | null {
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;

  const visitRing = (ring: number[][]) => {
    for (const pt of ring) {
      const lng = pt[0];
      const lat = pt[1];
      if (lng < west) west = lng;
      if (lng > east) east = lng;
      if (lat < south) south = lat;
      if (lat > north) north = lat;
    }
  };

  for (const f of features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "Polygon") {
      (g.coordinates as number[][][]).forEach(visitRing);
    } else if (g.type === "MultiPolygon") {
      (g.coordinates as number[][][][]).forEach((poly) => poly.forEach(visitRing));
    }
  }

  if (!Number.isFinite(west) || east <= west || north <= south) return null;
  const padLng = Math.max(0.45, (east - west) * 0.1);
  const padLat = Math.max(0.35, (north - south) * 0.1);
  return {
    west: west - padLng,
    east: east + padLng,
    south: south - padLat,
    north: north + padLat,
  };
}

function makeProjector(bbox: BBox) {
  const midLatRad = (((bbox.north + bbox.south) / 2) * Math.PI) / 180;
  const cosLat = Math.cos(midLatRad);
  const spanX = (bbox.east - bbox.west) * cosLat;
  const spanY = bbox.north - bbox.south;
  const availW = SVG_W - PAD * 2;
  const availH = SVG_H - PAD * 2;
  const scale = Math.min(availW / spanX, availH / spanY);
  const offsetX = (SVG_W - spanX * scale) / 2;
  const offsetY = (SVG_H - spanY * scale) / 2;

  return (lng: number, lat: number): [number, number] => {
    const x = offsetX + (lng - bbox.west) * cosLat * scale;
    const y = offsetY + (bbox.north - lat) * scale;
    return [x, y];
  };
}

function buildRingSvgPath(ring: number[][], project: (lng: number, lat: number) => [number, number]): string {
  if (ring.length < 3) return "";
  let d = "";
  for (let i = 0; i < ring.length; i += 1) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

function buildGeometrySvgPath(
  geom: GeoFeature["geometry"],
  project: (lng: number, lat: number) => [number, number],
): string {
  if (!geom) return "";
  if (geom.type === "Polygon") {
    return (geom.coordinates as number[][][])
      .map((ring) => buildRingSvgPath(ring, project))
      .join("");
  }
  if (geom.type === "MultiPolygon") {
    return (geom.coordinates as number[][][][])
      .flatMap((poly) => poly.map((ring) => buildRingSvgPath(ring, project)))
      .join("");
  }
  return "";
}

export function ChinaProvinceMap({
  provinceColors = {},
  provinceBadges = {},
  selectedProvince = "all",
  highlightedProvinces,
  onSelectProvince,
  markers = [],
  selectedMarkerId = null,
  onSelectMarker,
  legendItems = [],
  onSelectLegend,
  defaultFillHex = "#EAE5D9",
  showProvinceLabels = true,
  showSouthChinaSeaInset = true,
  title,
  subtitle,
  height = 520,
  className = "",
}: ChinaProvinceMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [chinaFeatures, setChinaFeatures] = useState<GeoFeature[]>([]);
  const [prefectureFeatures, setPrefectureFeatures] = useState<GeoFeature[]>([]);
  const [zoomedToProvince, setZoomedToProvince] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    title: string;
    detail?: string;
  } | null>(null);

  // Load 34 provincial outlines from china-100000-full.json
  useEffect(() => {
    let cancelled = false;
    fetch(assetUrl("data/china-100000-full.json"))
      .then((r) => r.json())
      .then((fc: { features?: GeoFeature[] }) => {
        if (cancelled) return;
        setChinaFeatures(Array.isArray(fc?.features) ? fc.features : []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // Lazily load provincial *-full.json when a specific province is selected
  useEffect(() => {
    if (!selectedProvince || selectedProvince === "all") {
      setPrefectureFeatures([]);
      setZoomedToProvince(false);
      return;
    }
    const meta = PROVINCE_META[selectedProvince];
    if (!meta) return;

    const cached = prefectureCache.get(selectedProvince);
    if (cached) {
      setPrefectureFeatures(cached);
      return;
    }

    let cancelled = false;
    fetch(assetUrl(`data/${meta.geoJsonFile}`))
      .then((r) => r.json())
      .then((fc: { features?: GeoFeature[] }) => {
        if (cancelled) return;
        const feats = Array.isArray(fc?.features) ? fc.features : [];
        prefectureCache.set(selectedProvince, feats);
        setPrefectureFeatures(feats);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [selectedProvince]);

  const highlightSet = useMemo(
    () => (highlightedProvinces ? new Set(highlightedProvinces) : null),
    [highlightedProvinces],
  );

  const activeBBox = useMemo<BBox>(() => {
    if (zoomedToProvince && selectedProvince !== "all" && prefectureFeatures.length > 0) {
      return computeFeatureBBox(prefectureFeatures) ?? CHINA_BBOX;
    }
    return CHINA_BBOX;
  }, [zoomedToProvince, selectedProvince, prefectureFeatures]);

  const project = useMemo(() => makeProjector(activeBBox), [activeBBox]);

  const renderedProvinces = useMemo(() => {
    const out: {
      key: string;
      provId?: ProvinceId;
      name: string;
      shortName: string;
      d: string;
      labelPt?: [number, number];
      fill: string;
      opacity: number;
      isSelected: boolean;
    }[] = [];

    chinaFeatures.forEach((feat, idx) => {
      if (feat.properties?.adchar === "JD" || feat.properties?.adcode === "100000_JD") return;
      const adcode = String(feat.properties?.adcode ?? "");
      const provId = ADCODE_TO_PROVINCE[adcode];
      const meta = provId ? PROVINCE_META[provId] : undefined;
      const d = buildGeometrySvgPath(feat.geometry, project);
      if (!d) return;

      const isSelected = Boolean(provId && selectedProvince === provId);
      const fill = (provId && provinceColors[provId]) || defaultFillHex;

      let opacity = 0.92;
      if (selectedProvince !== "all" && !isSelected) {
        opacity = zoomedToProvince ? 0.22 : 0.45;
      } else if (highlightSet && provId && !highlightSet.has(provId)) {
        opacity = 0.38;
      }

      const centerCoord = feat.properties?.centroid ?? feat.properties?.center ?? meta?.centroid;
      const labelPt = centerCoord ? project(centerCoord[0], centerCoord[1]) : undefined;

      out.push({
        key: `prov-${adcode || idx}`,
        provId,
        name: meta?.name ?? feat.properties?.name ?? "",
        shortName: meta?.shortName ?? feat.properties?.name ?? "",
        d,
        labelPt,
        fill,
        opacity,
        isSelected,
      });
    });

    return out;
  }, [
    chinaFeatures,
    project,
    provinceColors,
    defaultFillHex,
    selectedProvince,
    zoomedToProvince,
    highlightSet,
  ]);

  const renderedSubPaths = useMemo(() => {
    if (selectedProvince === "all" || prefectureFeatures.length === 0) return [];
    return prefectureFeatures
      .map((f, i) => {
        const centerCoord = f.properties?.centroid ?? f.properties?.center;
        return {
          key: `sub-${selectedProvince}-${i}`,
          name: f.properties?.name ?? "",
          d: buildGeometrySvgPath(f.geometry, project),
          labelPt: centerCoord ? project(centerCoord[0], centerCoord[1]) : undefined,
        };
      })
      .filter((item) => Boolean(item.d));
  }, [selectedProvince, prefectureFeatures, project]);

  const projectedMarkers = useMemo(() => {
    return markers
      .map((m) => {
        const [x, y] = project(m.coord[0], m.coord[1]);
        const visible = x >= -20 && x <= SVG_W + 20 && y >= -20 && y <= SVG_H + 20;
        return { marker: m, x, y, visible };
      })
      .filter((item) => item.visible);
  }, [markers, project]);

  function updatePointerTooltip(
    e: React.MouseEvent,
    tipTitle: string,
    tipDetail?: string,
  ) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHoverInfo({
      x: Math.min(rect.width - 220, Math.max(12, e.clientX - rect.left + 14)),
      y: Math.max(12, e.clientY - rect.top - 16),
      title: tipTitle,
      detail: tipDetail,
    });
  }

  return (
    <div
      ref={wrapRef}
      className={`zw-prov-map-wrap ${className}`.trim()}
      style={{
        height: typeof height === "number" ? `${Math.min(height, 540)}px` : height,
        maxWidth: typeof height === "number" ? `${Math.min(height, 540) * 4 / 3}px` : undefined,
        marginInline: "auto",
      }}
      data-testid="china-province-map"
      onMouseLeave={() => setHoverInfo(null)}
    >
      {(title || selectedProvince !== "all") && (
        <div className="zw-prov-toolbar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {title && (
              <span
                className="zw-search-badge"
                style={{ fontWeight: 600, padding: "0.24rem 0.6rem" }}
              >
                {title}
              </span>
            )}
            {subtitle && (
              <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                {subtitle}
              </span>
            )}
          </div>

          {selectedProvince !== "all" && (
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                type="button"
                className={`zw-chip${zoomedToProvince ? " on" : ""}`}
                onClick={() => setZoomedToProvince((v) => !v)}
              >
                {zoomedToProvince
                  ? "🌏 还原全国视野"
                  : `🔍 聚焦${PROVINCE_META[selectedProvince]?.shortName ?? ""}市州边界`}
              </button>
              {onSelectProvince && (
                <button
                  type="button"
                  className="zw-chip"
                  onClick={() => {
                    setZoomedToProvince(false);
                    onSelectProvince("all");
                  }}
                >
                  ✕ 取消选省
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="zw-prov-map-svg"
        role="img"
        aria-label={title ?? "中国34省级行政区风土地图"}
        onClick={(e) => {
          if (e.target === e.currentTarget && selectedProvince !== "all" && onSelectProvince) {
            setZoomedToProvince(false);
            onSelectProvince("all");
          }
        }}
      >
        <g className="zw-prov-polygons">
          {renderedProvinces.map((p) => {
            const badgeText = p.provId ? provinceBadges[p.provId] : undefined;
            return (
              <path
                key={p.key}
                d={p.d}
                fill={p.fill}
                fillOpacity={p.opacity}
                className={`zw-prov-path${p.isSelected ? " selected" : ""}`}
                data-province={p.provId}
                onMouseMove={(e) =>
                  updatePointerTooltip(
                    e,
                    p.name,
                    badgeText ?? (p.provId ? "点击查看本省产区与代表风物" : undefined),
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (p.provId && onSelectProvince) {
                    onSelectProvince(selectedProvince === p.provId ? "all" : p.provId);
                  }
                }}
              />
            );
          })}
        </g>

        {renderedSubPaths.length > 0 && (
          <g className="zw-prov-prefectures">
            {renderedSubPaths.map((sp) => <path key={sp.key} d={sp.d} className="zw-prov-subpath" />)}
            {zoomedToProvince && renderedSubPaths.map((sp) => sp.labelPt && (
              <text
                key={`city-${sp.key}`}
                x={sp.labelPt[0]}
                y={sp.labelPt[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className="zw-prov-city-label"
              >
                {sp.name}
              </text>
            ))}
          </g>
        )}

        {showProvinceLabels && !zoomedToProvince && (
          <g className="zw-prov-labels">
            {renderedProvinces.map((p) => {
              if (!p.labelPt || !p.shortName) return null;
              if (p.provId === "hk" || p.provId === "mo") return null;
              return (
                <text
                  key={`lbl-${p.key}`}
                  x={p.labelPt[0]}
                  y={p.labelPt[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="zw-prov-label"
                >
                  {p.shortName}
                </text>
              );
            })}
          </g>
        )}

        <g className="zw-prov-markers">
          {projectedMarkers.map(({ marker, x, y }, markerIndex) => {
            const isSelected = selectedMarkerId === marker.id || Boolean(marker.active);
            const pinColor = marker.colorHex ?? "#A6402C";
            const labelX = markerIndex % 2 === 0 ? 11 : -11;
            const labelY = markerIndex % 3 === 0 ? -12 : markerIndex % 3 === 1 ? 16 : -17;
            return (
              <g
                key={marker.id}
                transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
                style={{ cursor: "pointer" }}
                data-testid={`prov-map-marker-${marker.id}`}
                onMouseMove={(e) =>
                  updatePointerTooltip(e, marker.label, marker.subLabel ?? marker.badge)
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMarker?.(marker.id);
                }}
              >
                {isSelected && <circle className="zw-prov-marker-pulse" r={14} fill="none" stroke={pinColor} strokeWidth={2} />}
                <circle r={isSelected ? 11.5 : 9} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={2.5} />
                <circle
                  r={isSelected ? 9 : 6.5}
                  fill="#292F2C"
                  stroke={pinColor}
                  strokeWidth={isSelected ? 3 : 2.5}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={labelX > 0 ? "start" : "end"}
                  className="zw-prov-marker-label"
                >
                  {marker.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {legendItems.length > 0 && (
        <div className="zw-prov-legend" role="group" aria-label="地图着色图例">
          {legendItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`zw-chip${item.active ? " on" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
              onClick={() => onSelectLegend?.(item.id)}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: item.colorHex,
                  display: "inline-block",
                }}
              />
              <span>
                {item.label}
                {typeof item.count === "number" ? ` (${item.count})` : ""}
              </span>
            </button>
          ))}
        </div>
      )}

      {showSouthChinaSeaInset && <SouthChinaSea visible={!zoomedToProvince} />}

      {hoverInfo && (
        <div
          className="zw-prov-tooltip"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          <strong style={{ display: "block", fontFamily: "var(--font-serif)" }}>
            {hoverInfo.title}
          </strong>
          {hoverInfo.detail && (
            <span style={{ color: "var(--ink-muted)", fontSize: "0.75rem" }}>
              {hoverInfo.detail}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
