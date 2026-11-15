export function BaijiuPorcelainCup({
  hue = "#F4E8C4",
  title = "白酒品鉴杯",
  size = 220,
}: {
  hue?: string;
  title?: string;
  size?: number;
}) {
  return (
    <figure className="baijiu-cup-figure" style={{ width: size }}>
      <div
        className="baijiu-cup"
        role="img"
        aria-label={`${title}：定窑羊脂白瓷盅，酒液清亮并有挂杯泪珠`}
        style={{ "--liquor-hue": hue, width: size, height: size } as React.CSSProperties}
      >
        <span className="baijiu-cup-rim" />
        <span className="baijiu-cup-liquor" />
        <span className="baijiu-cup-shimmer" />
        <span className="baijiu-cup-tears" />
      </div>
      <figcaption>定窑羊脂白瓷 · 晶亮微黄 · 酒泪挂杯</figcaption>
    </figure>
  );
}
