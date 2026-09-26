"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Arrow, reducedMotion } from "@/components/ui";

/* A native horizontal scroller (scroll-snap, swipe and keyboard friendly) with gather.ai's square prev / next
   buttons. The buttons move one card at a time and disable at either end. */
export function Carousel({ label, children, controlsId }: { label: string; children: ReactNode; controlsId: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  useEffect(() => {
    const el = track.current; if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const step = (direction: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: direction * ((card?.offsetWidth ?? 320) + gap), behavior: reducedMotion() ? "auto" : "smooth" });
  };
  return <div className="carousel">
    <div className="carousel-controls" id={controlsId}>
      <button className="square-button" onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><Arrow direction="left" /></button>
      <button className="square-button" onClick={() => step(1)} disabled={edge.end} aria-label={`Next ${label}`}><Arrow /></button>
    </div>
    <ul className="carousel-track" ref={track} aria-label={label} tabIndex={0}>{children}</ul>
  </div>;
}
