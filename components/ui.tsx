import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { brandIcons } from "@/lib/brand-icons";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The copied interaction: gather.ai's "Explore Gather AI" / "Request a Demo" button. A fill parked off the left edge
   sweeps across on hover while it changes colour and the label flips. Structure mirrors Framer's
   Button Wrapper › Button Fill + Text. Timing lives in .btn in app/globals.css. */
type ButtonProps = { tone?: "dark" | "light" | "glass" | "blue"; children: ReactNode } & ComponentPropsWithoutRef<"a">;
export function Button({ tone = "dark", children, className = "", ...rest }: ButtonProps) {
  return <a className={`btn btn--${tone} ${className}`} {...rest}><span className="btn-fill" aria-hidden="true" /><span className="btn-label">{children}</span></a>;
}

/* Section label: a small dot and uppercase caption, as gather.ai marks each section. The dot is the brand green. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label ${className}`} data-fade><span className="label-dot" aria-hidden="true" />{children}</p>;
}

export function Arrow({ direction = "right", className = "" }: { direction?: "right" | "left" | "up-right"; className?: string }) {
  const rotate = direction === "left" ? 180 : direction === "up-right" ? -45 : 0;
  return <svg className={`arrow ${className}`} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}><path d="M1 9h15M10 3l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>;
}

/* The brand plus, drawn from the official symbol's proportions (bars 15/64 of the mark). */
export function Plus({ className = "", mono = false }: { className?: string; mono?: boolean }) {
  return <svg className={`plus ${className}`} viewBox="0 0 64 64" aria-hidden="true">
    <rect x="25" y="0" width="15" height="64" fill={mono ? "currentColor" : "var(--blue)"} />
    <rect x="0" y="25" width="64" height="15" fill={mono ? "currentColor" : "var(--green)"} />
    {!mono && <rect x="25" y="25" width="15" height="15" fill="var(--overlap)" />}
  </svg>;
}

export function SocialIcon({ name }: { name: keyof typeof brandIcons }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d={brandIcons[name]} fill="currentColor" /></svg>;
}
