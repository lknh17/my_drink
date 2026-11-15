import { useMemo, type CSSProperties } from "react";

export interface WorldTerroirMarker {
  id: string;
  label: string;
  subLabel?: string;
  coord: [number, number];
  colorHex?: string;
  badge?: string;
}

export interface WorldTerroirBelt {
  id: string;
  label: string;
  northLat: number;
  southLat: number;
  colorHex?: string;
  opacity?: number;
}

export interface WorldTerroirBeltMapProps {
  markers: WorldTerroirMarker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (markerId: string) => void;
  belts?: WorldTerroirBelt[];
  showLatitudeGuides?: boolean;
  title?: string;
  subtitle?: string;
  accentHex?: string;
  className?: string;
}

const W = 960;
const H = 440;
const MAP_TOP = 42;
const MAP_BOTTOM = 400;
const xOf = (lng: number) => ((lng + 180) / 360) * W;
const yOf = (lat: number) => MAP_TOP + ((90 - lat) / 180) * (MAP_BOTTOM - MAP_TOP);

const CONTINENTS = [
  // North America + Greenland
  "M20 116L49 83 91 67 124 76 154 62 193 77 221 103 210 128 231 147 215 175 190 185 174 215 151 216 136 192 105 181 84 155 48 150Z",
  "M246 56L294 42 329 65 315 94 279 101 253 82Z",
  // South America
  "M226 220L267 207 300 225 315 257 301 292 286 335 257 379 236 350 231 306 211 267Z",
  // Europe + UK / Scandinavia
  "M425 120L448 105 473 111 490 99 512 112 503 134 470 145 448 139Z M425 113L416 102 420 88 430 92Z M474 96L485 67 506 60 522 85 510 106Z",
  // Africa + Madagascar
  "M420 170L459 143 513 153 545 186 529 231 511 284 480 329 451 297 439 251 410 211Z M553 260L564 238 570 279 557 306Z",
  // Asia including Arabia, India, SE Asia, China, Korea, Japan
  "M507 122L548 105 586 90 628 93 661 75 716 83 759 105 819 107 876 129 913 161 887 183 846 174 811 192 774 180 739 197 713 185 687 210 662 196 633 218 601 206 581 177 548 184 524 160Z",
  "M552 177L579 184 588 218 566 231 548 206Z",
  "M620 205L645 214 656 252 638 278 619 247 605 222Z",
  "M677 216L700 224 713 251 739 262 756 283 738 294 716 271 692 261Z",
  "M751 265L764 279 757 315 746 296Z",
  "M838 164L849 149 856 170 848 190Z",
  "M873 142L881 128 887 154 879 174Z",
  // Australia, Tasmania, New Zealand
  "M744 306L780 282 831 286 863 316 846 353 809 368 770 356 746 332Z M824 378L837 374 833 391Z M900 355L910 336 916 359 907 379Z",
];

function labelLayout(markers: WorldTerroirMarker[]) {
  const lanes = new Map<string, number>();
  return markers.map((marker) => {
    const [lng, lat] = marker.coord;
    const region = lng > 65 ? "asia" : lng > -20 ? "emea" : "americas";
    const band = `${region}-${Math.round(lat / 12)}`;
    const lane = lanes.get(band) ?? 0;
    lanes.set(band, lane + 1);
    const right = lng < 120;
    const dx = right ? 22 + lane * 7 : -22 - lane * 7;
    const dy = ((lane % 3) - 1) * 18 - (lat > 35 ? 8 : 0);
    return { marker, x: xOf(lng), y: yOf(lat), labelX: xOf(lng) + dx, labelY: yOf(lat) + dy, right };
  });
}

export function WorldTerroirBeltMap({
  markers,
  selectedMarkerId = null,
  onSelectMarker,
  belts = [],
  showLatitudeGuides = true,
  title = "世界风土与纬度带",
  subtitle,
  accentHex = "#35685F",
  className = "",
}: WorldTerroirBeltMapProps) {
  const laidOut = useMemo(() => labelLayout(markers), [markers]);
  return (
    <section className={`zw-world-belt-map ${className}`.trim()} style={{ "--world-accent": accentHex } as CSSProperties}>
      <header><div><span>WORLD TERROIR ATLAS</span><h2>{title}</h2></div>{subtitle && <p>{subtitle}</p>}</header>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}地理地图`}>
        <defs>
          <pattern id="world-grid" width="80" height="44" patternUnits="userSpaceOnUse"><path d="M80 0H0v44" fill="none" stroke="#31534b" strokeOpacity=".09" /></pattern>
          <filter id="world-pin-shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".28" /></filter>
        </defs>
        <rect width={W} height={H} rx="18" className="world-ocean" />
        <rect y={MAP_TOP} width={W} height={MAP_BOTTOM - MAP_TOP} fill="url(#world-grid)" />
        {belts.map((belt) => {
          const top = yOf(belt.northLat);
          const bottom = yOf(belt.southLat);
          return <g key={belt.id}><rect x="0" y={top} width={W} height={bottom - top} fill={belt.colorHex ?? accentHex} opacity={belt.opacity ?? .12} /><text x="14" y={top + 17} className="world-belt-label">{belt.label} · {belt.northLat}°—{belt.southLat}°</text></g>;
        })}
        <g className="world-land">{CONTINENTS.map((d, index) => <path key={index} d={d} />)}</g>
        {showLatitudeGuides && ([23.5, 0, -23.5] as const).map((lat) => <g key={lat}><line x1="0" x2={W} y1={yOf(lat)} y2={yOf(lat)} className={lat === 0 ? "world-lat equator" : "world-lat"} /><text x="944" y={yOf(lat) - 5} textAnchor="end" className="world-lat-label">{lat === 23.5 ? "北回归线 23.5°N" : lat === 0 ? "赤道 0°" : "南回归线 23.5°S"}</text></g>)}
        <g className="world-pins">
          {laidOut.map(({ marker, x, y, labelX, labelY, right }, index) => {
            const active = selectedMarkerId === marker.id;
            const color = marker.colorHex ?? accentHex;
            return <g key={marker.id} className={active ? "active" : ""} role="button" tabIndex={0} onClick={() => onSelectMarker?.(marker.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelectMarker?.(marker.id); }}>
              <path d={`M${x} ${y}L${labelX} ${labelY}`} stroke={color} />
              {active && <circle cx={x} cy={y} r="13" fill="none" stroke={color} className="world-pin-pulse" />}
              <circle cx={x} cy={y} r={active ? 8 : 6} fill={color} stroke="#fff" strokeWidth="3" filter="url(#world-pin-shadow)" />
              <circle cx={labelX} cy={labelY} r="10" fill={color} />
              <text x={labelX} y={labelY + 4} textAnchor="middle" className="world-pin-no">{index + 1}</text>
              <text x={labelX + (right ? 15 : -15)} y={labelY - 2} textAnchor={right ? "start" : "end"} className="world-pin-label">{marker.label}</text>
              {(marker.badge || marker.subLabel) && <text x={labelX + (right ? 15 : -15)} y={labelY + 12} textAnchor={right ? "start" : "end"} className="world-pin-sub">{marker.badge ?? marker.subLabel}</text>}
            </g>;
          })}
        </g>
      </svg>
    </section>
  );
}
