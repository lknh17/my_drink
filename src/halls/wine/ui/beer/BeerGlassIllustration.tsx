import { useId } from "react";
import type { BeerGlassId } from "../../types";

export interface BeerGlassIllustrationProps {
  glassware: BeerGlassId;
  srmColorHex: string;
  beerName?: string;
  photoUrl?: string;
  className?: string;
}

const GLASS_PATHS: Record<BeerGlassId, string> = {
  "pilsner-flute": "M54 13H146L136 184Q132 205 112 210H88Q68 205 64 184Z",
  "weizen-vase": "M58 12H142Q127 62 139 105Q148 144 130 190Q124 207 100 210Q76 207 70 190Q52 144 61 105Q73 62 58 12Z",
  tulip: "M52 20Q70 8 100 15Q130 8 148 20Q135 48 140 92Q145 145 118 170V198H143V210H57V198H82V170Q55 145 60 92Q65 48 52 20Z",
  "trappist-chalice": "M43 26Q100 4 157 26Q150 116 113 151V195H148V210H52V195H87V151Q50 116 43 26Z",
  "nonic-pint": "M48 13H152L144 82Q159 103 143 124L136 201Q100 214 64 201L57 124Q41 103 56 82Z",
  "shaker-pint": "M50 12H150L135 207H65Z",
  snifter: "M48 27Q100 5 152 27Q155 111 119 148Q111 157 110 172V198H145V210H55V198H90V172Q89 157 81 148Q45 111 48 27Z",
  stange: "M72 10H128L124 207H76Z",
};

export function BeerGlassIllustration({
  glassware,
  srmColorHex,
  beerName = "精酿啤酒",
  className = "",
}: BeerGlassIllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const path = GLASS_PATHS[glassware];
  const clipId = `beer-clip-${uid}`;
  const glowId = `beer-glow-${uid}`;
  const liquidId = `beer-liquid-${uid}`;
  return (
    <figure className={`beer-glass-photo ${className}`.trim()}>
      <svg className="beer-glass-svg" viewBox="0 0 200 224" role="img" aria-label={`${beerName}，${glassware} 杯型`}>
        <defs>
          <clipPath id={clipId}><path d={path} /></clipPath>
          <linearGradient id={liquidId} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".24" />
            <stop offset=".18" stopColor={srmColorHex} />
            <stop offset=".78" stopColor={srmColorHex} />
            <stop offset="1" stopColor="#160d08" stopOpacity=".7" />
          </linearGradient>
          <filter id={glowId}><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <ellipse cx="100" cy="195" rx="57" ry="13" fill={srmColorHex} opacity=".22" filter={`url(#${glowId})`} />
        <g clipPath={`url(#${clipId})`}>
          <rect x="35" y="38" width="130" height="175" fill={`url(#${liquidId})`} />
          <path d="M38 39Q55 28 72 37T106 36T140 37T166 34V58H35Z" fill="#fffdf5" />
          <path d="M38 48Q65 58 92 48T148 50" fill="none" stroke="#eadfc5" strokeWidth="5" opacity=".85" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
            <circle key={n} className={`beer-bubble beer-bubble--${n % 4}`} cx={70 + (n * 19) % 67} cy={178 - n * 14} r={2 + (n % 2)} fill="none" stroke="#fff7d6" strokeWidth="1.5" opacity=".8" />
          ))}
          <path d="M76 55V180" stroke="#fff" strokeWidth="7" opacity=".16" strokeLinecap="round" />
        </g>
        <path d={path} fill="none" stroke="#5d5048" strokeWidth="3" />
        <path d={path} fill="none" stroke="#fff" strokeWidth="1" opacity=".65" transform="translate(-2 -1)" />
      </svg>
      <figcaption>{beerName}</figcaption>
    </figure>
  );
}
