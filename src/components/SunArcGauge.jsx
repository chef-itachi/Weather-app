import { hhmm } from '../lib/weather.js';

export default function SunArcGauge({ sunrise, sunset, current, isDay }) {
  const t = (iso) => new Date(iso).getTime();
  let progress = 0.5;
  try {
    const sr = t(sunrise), ss = t(sunset), now = t(current);
    if (isDay) progress = Math.min(1, Math.max(0, (now - sr) / (ss - sr)));
    else progress = now < sr ? 1 : 0;
  } catch (e) {
    // fall back to default progress
  }

  const cx = 100, cy = 100, r = 78;
  const angle = Math.PI - progress * Math.PI;
  const mx = cx + r * Math.cos(angle);
  const my = cy - r * Math.sin(angle);

  const ticks = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI - (i / 8) * Math.PI;
    const x1 = cx + (r - 6) * Math.cos(a);
    const y1 = cy - (r - 6) * Math.sin(a);
    const x2 = cx + (r + 6) * Math.cos(a);
    const y2 = cy - (r + 6) * Math.sin(a);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8A6A42" strokeWidth="1.5" />;
  });

  return (
    <svg viewBox="0 0 200 118" className="w-full max-w-[280px]">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke="#193440" strokeWidth="3" fill="none" />
      {ticks}
      <circle cx={mx} cy={my} r={isDay ? 8 : 6} fill={isDay ? '#D99A56' : '#F5EFE3'} />
      {isDay && <circle cx={mx} cy={my} r="13" fill="#D99A56" opacity="0.25" />}
      <text x={cx - r} y={cy + 18} fontFamily="JetBrains Mono" fontSize="10" fill="#5FB3AE" textAnchor="start">
        {hhmm(sunrise)}
      </text>
      <text x={cx + r} y={cy + 18} fontFamily="JetBrains Mono" fontSize="10" fill="#5FB3AE" textAnchor="end">
        {hhmm(sunset)}
      </text>
    </svg>
  );
}
