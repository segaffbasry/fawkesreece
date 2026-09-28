import { recDotPaths, recDots, recLetters, recViewBox } from "@/lib/rec-logo";

/* The four accreditations shown on fawkesandreece.co.uk, as transparent single-colour marks that take the text
   colour of wherever they sit (white over the hero, black on light sections). Built by scripts/badges.py. */
const masks = [
  { key: "hot100", label: "Recruiter HOT 100 companies 2024", src: "/badges/hot100-2024.png", ratio: 1 },
  { key: "fast50", label: "Recruiter FAST 50", src: "/badges/fast50.png", ratio: 152 / 200 },
  { key: "ft1000", label: "FT 1000: Europe's Fastest Growing Companies", src: "/badges/ft1000.png", ratio: 276 / 92 },
];

export function Badges({ className = "" }: { className?: string }) {
  return <ul className={`badges ${className}`} aria-label="Accreditations">
    <li className="badge-rec" aria-label="REC Corporate Member">
      <svg viewBox={recViewBox} aria-hidden="true">
        <g opacity=".6">{recDots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="currentColor" />)}{recDotPaths.map((d, i) => <path key={i} d={d} fill="currentColor" />)}</g>
        <path d={recLetters} fill="currentColor" />
      </svg>
      <span aria-hidden="true">Corporate<br />Member</span>
    </li>
    {masks.map((m) => <li key={m.key} className={`badge badge--${m.key}`} role="img" aria-label={m.label} style={{ aspectRatio: m.ratio, WebkitMaskImage: `url(${m.src})`, maskImage: `url(${m.src})` }} />)}
  </ul>;
}
