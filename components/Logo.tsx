import { logoBox, logoFawkes, logoMark, logoReece } from "@/lib/logo";

/* The vector lockup rebuilt in scripts/logo.mjs. Every part is its own element so the preloader can assemble it:
   the plus's two bars and overlap, then each letter. `mono` renders one colour for the menu and footer. */
export function Logo({ mono, className = "", title = "Fawkes & Reece" }: { mono?: string; className?: string; title?: string }) {
  const { x, y, w, h } = logoBox;
  return <svg className={`logo ${className}`} viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={title}>
    <g className="logo-fawkes" fill={mono ?? "var(--blue)"}>{logoFawkes.map((l, i) => <path key={i} className="logo-letter" d={l.d} />)}</g>
    <g className="logo-mark">
      <rect className="logo-v" {...rect(logoMark.vertical)} fill={mono ?? "var(--blue)"} />
      <rect className="logo-h" {...rect(logoMark.horizontal)} fill={mono ?? "var(--green)"} />
      <rect className="logo-o" {...rect(logoMark.overlap)} fill={mono ?? "var(--overlap)"} />
    </g>
    <g className="logo-reece" fill={mono ?? "var(--green)"}>{logoReece.map((l, i) => <path key={i} className="logo-letter" d={l.d} />)}</g>
  </svg>;
}

const rect = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x, y: b.y, width: b.w, height: b.h });
