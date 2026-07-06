import { seededRandom } from "./utils/seededRandom";

export default function StarField({ seed }) {
  const count = 14 + Math.floor(seededRandom(seed) * 6);
  const dots = Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(seed * 3 + i);
    const r2 = seededRandom(seed * 7 + i + 1);
    const r3 = seededRandom(seed * 11 + i + 2);
    return {
      cx: (r1 * 180 + 10).toFixed(1),
      cy: (r2 * 300 + 15).toFixed(1),
      r: (0.6 + r3 * 1.4).toFixed(2),
      delay: (r3 * 3).toFixed(2),
    };
  });

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 200 330"
      preserveAspectRatio="none"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          className="fill-white animate-pulse"
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          style={{ animationDelay: `${d.delay}s` }}
        />
      ))}
    </svg>
  );
}
