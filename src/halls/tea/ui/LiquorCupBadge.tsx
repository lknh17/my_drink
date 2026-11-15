import { useEffect, useId, useState, type ReactNode } from "react";
import { assetUrl } from "../../../lib/assetUrl";
import type {
  TeaCategoryId,
  TeaWareCategoryId,
  TeaWareItem,
} from "../types";

export type LiquorCupSize = "xs" | "sm" | "md" | "lg" | "xl";

const CUP_DIMENSIONS: Record<LiquorCupSize, number> = {
  xs: 22,
  sm: 34,
  md: 52,
  lg: 72,
  xl: 112,
};

function clampChannel(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function parseHexRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }
  return [197, 216, 109];
}

function mixRgb(
  rgb: [number, number, number],
  target: [number, number, number],
  ratio: number,
): string {
  const r = clampChannel(rgb[0] * (1 - ratio) + target[0] * ratio);
  const g = clampChannel(rgb[1] * (1 - ratio) + target[1] * ratio);
  const b = clampChannel(rgb[2] * (1 - ratio) + target[2] * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export interface LiquorCupBadgeProps {
  liquorColorHex: string;
  size?: LiquorCupSize;
  label?: string;
  interactive?: boolean;
  className?: string;
}

/**
 * Top-down Jingdezhen white porcelain tasting cup rendering realistic tea liquor optics:
 * - Glazed porcelain lip & inner white cup wall
 * - Luminous porcelain-reflected center
 * - True body liquor ring + translucent golden/jade meniscus glow
 * - Subtle window surface specular arc
 */
export function LiquorCupBadge({
  liquorColorHex,
  size = "md",
  label,
  interactive = false,
  className = "",
}: LiquorCupBadgeProps) {
  const rawUid = useId().replace(/:/g, "");
  const px = CUP_DIMENSIONS[size];
  const baseRgb = parseHexRgb(liquorColorHex);

  // Center reflects warm white porcelain floor; mid-ring shows true liquor depth; rim shows glowing meniscus
  const centerLuminous = mixRgb(baseRgb, [254, 252, 244], 0.44);
  const midBody = mixRgb(baseRgb, [255, 255, 255], 0.05);
  const deepPool = mixRgb(baseRgb, [24, 16, 12], 0.16);
  const meniscusGlow = mixRgb(baseRgb, [250, 236, 188], 0.32);

  const gradLiquorId = `cup-liq-${rawUid}`;
  const gradRimId = `cup-rim-${rawUid}`;

  return (
    <span
      className={`tea-liquor-cup${interactive ? " interactive" : ""} ${className}`.trim()}
      style={{ width: px, height: px }}
      title={label}
      aria-label={label ?? "白瓷茶盏汤色"}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={gradRimId} cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="72%" stopColor="#F4F5F0" />
            <stop offset="93%" stopColor="#E1DFD5" />
            <stop offset="100%" stopColor="#CBC6B8" />
          </radialGradient>

          <radialGradient id={gradLiquorId} cx="46%" cy="44%" r="54%">
            <stop offset="0%" stopColor={centerLuminous} />
            <stop offset="48%" stopColor={midBody} />
            <stop offset="79%" stopColor={deepPool} />
            <stop offset="93%" stopColor={meniscusGlow} />
            <stop offset="100%" stopColor="#F7F5EE" stopOpacity="0.92" />
          </radialGradient>
        </defs>

        {/* Outer porcelain lip */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={`url(#${gradRimId})`}
          stroke="#BFB8A7"
          strokeWidth="1.4"
        />

        {/* Subtle celadon-white inner porcelain wall */}
        <circle
          cx="50"
          cy="50"
          r="42.5"
          fill="#FAF9F4"
          stroke="#E6E2D6"
          strokeWidth="0.9"
        />

        {/* Tea liquor pool */}
        <circle cx="50" cy="50" r="38.5" fill={`url(#${gradLiquorId})`} />

        {/* Delicate meniscus ring */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={meniscusGlow}
          strokeWidth="1.2"
          opacity="0.72"
        />

        {/* Surface window reflection crescent */}
        {px >= 30 && (
          <>
            <path
              d="M 27 36 A 26 26 0 0 1 62 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={px >= 70 ? "2.6" : "3.2"}
              strokeLinecap="round"
              opacity="0.58"
            />
            <circle cx="67" cy="29" r="1.9" fill="#FFFFFF" opacity="0.52" />
          </>
        )}
      </svg>
    </span>
  );
}

export interface SongRunningHeadProps {
  volumeTag: string;
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export function SongRunningHead({
  volumeTag,
  title,
  subtitle,
  rightSlot,
}: SongRunningHeadProps) {
  return (
    <header className="tea-running-head">
      <div className="tea-running-head-left">
        <span className="tea-fishtail">〖 {volumeTag} 〗</span>
        <div>
          <h2 className="tea-running-title">{title}</h2>
          {subtitle && <p className="tea-running-sub">{subtitle}</p>}
        </div>
      </div>
      {rightSlot && <div className="tea-running-head-right">{rightSlot}</div>}
    </header>
  );
}

export interface TeaEditorialPhotoProps {
  id: string;
  photoUrl?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  accentHex?: string;
  kind?: "tea" | "mountain" | "teaware";
  wareCategory?: TeaWareCategoryId;
  height?: number | string;
  caption?: string;
}

function renderWareSilhouette(wareCategory?: TeaWareCategoryId, stroke = "#35685F") {
  switch (wareCategory) {
    case "zisha":
      return (
        <g stroke={stroke} strokeWidth="2" fill="none" opacity="0.34">
          {/* Classic Yixing Xishi / Shipiao Teapot Silhouette */}
          <ellipse cx="195" cy="116" rx="46" ry="33" fill={stroke} fillOpacity="0.08" />
          <path d="M 165 86 Q 195 76 225 86" />
          <circle cx="195" cy="79" r="5" />
          <path d="M 149 112 Q 124 98 118 88 Q 132 94 151 102" />
          <path d="M 241 104 Q 268 102 266 122 Q 264 138 239 130" />
          <path d="M 164 147 L 226 147" />
        </g>
      );
    case "gaiwan":
      return (
        <g stroke={stroke} strokeWidth="2" fill="none" opacity="0.34">
          {/* Three-Talent Porcelain Gaiwan */}
          <path d="M 146 98 Q 195 148 244 98 Z" fill={stroke} fillOpacity="0.07" />
          <path d="M 152 94 Q 195 75 238 94" />
          <rect x="187" y="77" width="16" height="6" rx="2" />
          <ellipse cx="195" cy="138" rx="44" ry="8" />
        </g>
      );
    case "jianzhan":
      return (
        <g stroke={stroke} strokeWidth="2.2" fill="none" opacity="0.36">
          {/* Song Dynasty Jianzhan Tenmoku Bowl */}
          <path d="M 142 88 L 172 138 L 218 138 L 248 88 Z" fill={stroke} fillOpacity="0.1" />
          <rect x="178" y="138" width="34" height="7" />
          <line x1="162" y1="96" x2="178" y2="128" strokeDasharray="3 3" />
          <line x1="195" y1="94" x2="195" y2="132" strokeDasharray="3 3" />
          <line x1="228" y1="96" x2="212" y2="128" strokeDasharray="3 3" />
        </g>
      );
    case "kettle":
      return (
        <g stroke={stroke} strokeWidth="2" fill="none" opacity="0.34">
          {/* Boiling Silver/Iron Kettle with Overhand Handle */}
          <path d="M 162 88 Q 162 48 195 48 Q 228 48 228 88" />
          <rect x="156" y="88" width="78" height="50" rx="18" fill={stroke} fillOpacity="0.08" />
          <path d="M 156 108 Q 132 102 128 88" />
          <circle cx="195" cy="83" r="4" />
        </g>
      );
    case "chaozhou":
      return (
        <g stroke={stroke} strokeWidth="1.9" fill="none" opacity="0.36">
          {/* Chaozhou Hand-Pulled Mengchen Pot + Pinming Trio on Tea Boat */}
          <ellipse cx="195" cy="142" rx="68" ry="11" fill={stroke} fillOpacity="0.06" />
          <ellipse cx="172" cy="118" rx="28" ry="20" fill={stroke} fillOpacity="0.1" />
          <path d="M 154 100 Q 172 93 190 100" />
          <circle cx="172" cy="94" r="3.5" />
          <path d="M 144 114 Q 128 106 125 98" />
          <path d="M 200 110 Q 214 108 213 122 Q 212 130 199 126" />
          {/* Three small Ruochen porcelain cups */}
          <path d="M 222 124 Q 225 138 232 138 Q 239 138 242 124 Z" fill={stroke} fillOpacity="0.09" />
          <path d="M 238 116 Q 241 130 248 130 Q 255 130 258 116 Z" fill={stroke} fillOpacity="0.09" />
        </g>
      );
    default:
      return (
        <g stroke={stroke} strokeWidth="1.9" fill="none" opacity="0.34">
          {/* Ru-Kiln Celadon Cup & Tray */}
          <path d="M 156 92 Q 164 136 195 136 Q 226 136 234 92 Z" fill={stroke} fillOpacity="0.09" />
          <ellipse cx="195" cy="92" rx="39" ry="7" />
          <ellipse cx="195" cy="140" rx="50" ry="6" />
        </g>
      );
  }
}

/**
 * High-res photo plate with graceful Song-dynasty botanical / mountain ink-wash / teaware
 * museum specimen fallback whenever `/photos/<id>.jpg` is missing or fails to load.
 */
export function TeaEditorialPhoto({
  id,
  photoUrl,
  title,
  subtitle,
  badge,
  accentHex = "#35685F",
  kind = "tea",
  wareCategory,
  height = 240,
  caption,
}: TeaEditorialPhotoProps) {
  const resolvedSrc = assetUrl(photoUrl || `/photos/${id}.jpg`);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [resolvedSrc]);

  return (
    <div
      className="tea-photo-frame"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      {!imgError ? (
        <>
          <img
            src={resolvedSrc}
            alt={title}
            loading="lazy"
            className="tea-photo-img"
            onError={() => setImgError(true)}
          />
          {caption && (
            <div className="tea-photo-caption-bar">
              <span>{caption}</span>
              {badge && <span style={{ opacity: 0.86 }}>{badge}</span>}
            </div>
          )}
        </>
      ) : (
        <div className="tea-photo-fallback" aria-label={`${title} 宋韵图谱写意卡`}>
          <svg
            className="tea-photo-fallback-art"
            viewBox="0 0 320 200"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {/* Distant Song-dynasty ink-wash mist mountains */}
            <path
              d="M 0 155 Q 58 102 118 134 T 236 112 T 320 138 L 320 200 L 0 200 Z"
              fill={accentHex}
              opacity="0.11"
            />
            <path
              d="M 0 172 Q 82 128 158 152 T 320 144 L 320 200 L 0 200 Z"
              fill="#35685F"
              opacity="0.1"
            />

            {kind === "tea" && (
              <g stroke="#35685F" strokeWidth="1.6" fill="none" opacity="0.34">
                {/* Botanical Camellia sinensis: One bud, two leaves (一芽二叶) */}
                <path d="M 168 158 Q 198 118 232 64" />
                <path
                  d="M 232 64 Q 244 42 254 34 Q 252 56 232 64 Z"
                  fill="#588B57"
                  fillOpacity="0.22"
                />
                <path
                  d="M 212 94 Q 178 72 164 82 Q 178 108 212 94 Z"
                  fill={accentHex}
                  fillOpacity="0.18"
                />
                <path
                  d="M 194 120 Q 232 106 248 118 Q 228 140 194 120 Z"
                  fill="#35685F"
                  fillOpacity="0.16"
                />
              </g>
            )}

            {kind === "mountain" && (
              <g stroke="#35685F" strokeWidth="1.2" fill="none" opacity="0.28">
                {/* Topographic contour lines & misty peaks */}
                <path d="M 110 138 L 176 62 L 242 138" strokeWidth="1.8" />
                <path d="M 148 142 L 214 78 L 274 142" />
                <ellipse cx="185" cy="148" rx="88" ry="14" strokeDasharray="4 3" />
                <ellipse cx="185" cy="148" rx="58" ry="8" strokeDasharray="3 3" />
              </g>
            )}

            {kind === "teaware" && renderWareSilhouette(wareCategory, accentHex)}
          </svg>

          <div className="tea-photo-fallback-top">
            <span className="tea-photo-fallback-kicker">
              {kind === "tea"
                ? "MINGDIAN BOTANICAL FOLIO · 茗典茶谱"
                : kind === "mountain"
                  ? "TERROIR TOPOGRAPHY · 名山风土"
                  : "TEAWARE CABINET · 器道图谱"}
            </span>
            {badge && <span className="tea-cinnabar-seal vertical">{badge.slice(0, 4)}</span>}
          </div>

          <div className="tea-photo-fallback-bottom">
            <div>
              <strong className="tea-photo-fallback-title">{title}</strong>
              {subtitle && <span className="tea-photo-fallback-sub">{subtitle}</span>}
            </div>
            {kind === "tea" && (
              <LiquorCupBadge liquorColorHex={accentHex} size="sm" label={`${title} 标准汤色`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Resolves a free-form `brewing.vessel` string (e.g. "白瓷盖碗 (110ml)" or "朱泥水平壶")
 * to the best matching `TeaWareItem` id in `teaware`.
 */
export function resolveMatchingWareId(
  vesselText: string,
  teaware: TeaWareItem[],
  fallbackCategory?: TeaCategoryId,
): string | null {
  if (!teaware.length) return null;
  const clean = vesselText.trim().toLowerCase();

  // 1. Exact ID or name inclusion
  const direct = teaware.find(
    (w) =>
      w.id.toLowerCase() === clean ||
      clean.includes(w.name.toLowerCase()) ||
      w.name.toLowerCase().includes(clean),
  );
  if (direct) return direct.id;

  // 2. Keyword category inference
  let inferredCat: TeaWareCategoryId | null = null;
  if (/朱泥|潮州|工夫|手拉|孟臣|水平壶/.test(vesselText)) {
    inferredCat =
      teaware.some((w) => w.category === "chaozhou") && /潮州|手拉|工夫/.test(vesselText)
        ? "chaozhou"
        : "zisha";
  } else if (/紫砂|石瓢|西施|仿古|段泥|紫泥|井栏/.test(vesselText)) {
    inferredCat = "zisha";
  } else if (/建盏|兔毫|油滴|鹧鸪|铁胎/.test(vesselText)) {
    inferredCat = "jianzhan";
  } else if (/汝窑|青瓷|龙泉|哥窑|弟窑|天青/.test(vesselText)) {
    inferredCat = "celadon";
  } else if (/银壶|铁壶|煮茶|老茶煲|陶壶煮/.test(vesselText)) {
    inferredCat = "kettle";
  } else if (/盖碗|白瓷|青花|玻璃杯|三才/.test(vesselText)) {
    inferredCat = "gaiwan";
  }

  if (inferredCat) {
    const byCatAndTea = fallbackCategory
      ? teaware.find(
          (w) => w.category === inferredCat && w.bestForCategories.includes(fallbackCategory),
        )
      : undefined;
    if (byCatAndTea) return byCatAndTea.id;
    const byCat = teaware.find((w) => w.category === inferredCat);
    if (byCat) return byCat.id;
  }

  // 3. Fallback by bestForCategories
  if (fallbackCategory) {
    const byTeaCat = teaware.find((w) => w.bestForCategories.includes(fallbackCategory));
    if (byTeaCat) return byTeaCat.id;
  }

  return teaware[0]?.id ?? null;
}
