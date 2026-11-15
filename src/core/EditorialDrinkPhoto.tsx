import { useEffect, useState, type CSSProperties } from "react";
import { assetUrl } from "../lib/assetUrl";

export type EditorialPhotoAspectRatio = "4/3" | "3/4" | "16/9" | "1/1";
export type EditorialPhotoFallbackKind =
  | "bottle"
  | "porcelain-cup"
  | "beer-glass"
  | "wine-decanter"
  | "coffee-cherry"
  | "craft-workshop";

export interface EditorialDrinkPhotoProps {
  src?: string | null;
  alt: string;
  aspectRatio?: EditorialPhotoAspectRatio;
  fit?: "cover" | "contain";
  accentHex?: string;
  badge?: string;
  caption?: string;
  warmFilter?: boolean;
  fallbackKind?: EditorialPhotoFallbackKind;
  className?: string;
}

const RATIOS: Record<EditorialPhotoAspectRatio, string> = {
  "4/3": "4 / 3",
  "3/4": "3 / 4",
  "16/9": "16 / 9",
  "1/1": "1 / 1",
};

function FallbackIllustration({
  kind,
  accent,
  label,
}: {
  kind: EditorialPhotoFallbackKind;
  accent: string;
  label: string;
}) {
  const common = { fill: "none", stroke: accent, strokeWidth: 4, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label={`${label} 暂无实拍图`}>
      <defs>
        <linearGradient id="editorial-paper" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fffdf7" />
          <stop offset="1" stopColor="#e8dfcf" />
        </linearGradient>
        <filter id="editorial-grain">
          <feTurbulence baseFrequency=".8" numOctaves="3" seed="6" type="fractalNoise" />
          <feComposite in="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <rect width="320" height="240" fill="url(#editorial-paper)" />
      <circle cx="160" cy="112" r="82" fill={accent} opacity=".08" />
      {kind === "bottle" && <g {...common}><path d="M139 42h42v34l13 17v94c0 9-7 16-16 16h-36c-9 0-16-7-16-16V93l13-17z" /><path d="M126 111h68M145 134h30v42h-30z" /></g>}
      {kind === "porcelain-cup" && <g {...common}><ellipse cx="151" cy="106" rx="66" ry="20" /><path d="M86 106l12 61c5 25 101 25 106 0l12-61" /><path d="M216 119c37-6 38 43 5 45" /><path d="M117 87c10-17 4-29 0-39M154 83c11-18 4-31 0-44" /></g>}
      {kind === "beer-glass" && <g {...common}><path d="M105 61h104l-12 132c-1 9-8 15-17 15h-46c-9 0-16-6-17-15z" /><path d="M108 79c25-24 45 7 64-8 20-16 31 2 34 8" /><path d="M124 106h66M128 129h58" /></g>}
      {kind === "wine-decanter" && <g {...common}><path d="M149 35h28l-7 67c2 18 67 36 67 70 0 30-37 39-75 39s-76-9-76-39c0-34 65-52 67-70z" /><path d="M105 167c31 13 83 13 113-1" /></g>}
      {kind === "coffee-cherry" && <g {...common}><path d="M161 75c-6-27 16-43 37-48" /><path d="M177 48c15-16 42-8 47 8-18 5-36 5-47-8z" /><ellipse cx="133" cy="129" rx="45" ry="58" /><ellipse cx="187" cy="129" rx="45" ry="58" /><path d="M160 77v108" /></g>}
      {kind === "craft-workshop" && <g {...common}><path d="M59 190h202M81 190V98l79-54 79 54v92" /><path d="M113 190v-61h94v61M112 112h96" /><path d="M147 129v61M174 129v61" /><path d="M83 96h154" /></g>}
      <text x="160" y="225" textAnchor="middle" fill="#5c5a53" fontSize="11" letterSpacing="2">CURATORIAL PLACEHOLDER</text>
    </svg>
  );
}

export function EditorialDrinkPhoto({
  src,
  alt,
  aspectRatio = "4/3",
  fit = "cover",
  accentHex = "#A6402C",
  badge,
  caption,
  warmFilter = true,
  fallbackKind = "bottle",
  className = "",
}: EditorialDrinkPhotoProps) {
  const resolvedSrc = src ? assetUrl(src) : "";
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [resolvedSrc]);

  return (
    <figure
      className={`zw-editorial-photo${warmFilter ? " warm" : ""} ${className}`.trim()}
      style={{ "--photo-accent": accentHex, "--photo-ratio": RATIOS[aspectRatio] } as CSSProperties}
    >
      <div className="zw-editorial-photo-mat">
        {resolvedSrc && !error ? (
          <img src={resolvedSrc} alt={alt} style={{ objectFit: fit }} onError={() => setError(true)} />
        ) : (
          <FallbackIllustration kind={fallbackKind} accent={accentHex} label={alt} />
        )}
        {badge && <span className="zw-editorial-photo-badge">{badge}</span>}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
