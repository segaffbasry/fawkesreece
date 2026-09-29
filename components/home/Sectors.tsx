"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Button, Label, reducedMotion } from "@/components/ui";
import { links, sectors } from "@/lib/content";

/* Sectors as a sideways row that never holds the page (client feedback: the pinned scroll made you scroll through
   the whole section to get past it). Arrows, swipe, trackpad and keyboard move the row; the counter and progress
   bar follow. Each card opens the live site's own job search filtered to that sector. */
export function Sectors() {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ current: 1, progress: 0, start: true, end: false });
  useEffect(() => {
    const el = track.current; if (!el) return;
    const update = () => {
      const max = Math.max(1, el.scrollWidth - el.clientWidth);
      const p = el.scrollLeft / max;
      setState({ current: Math.min(sectors.length, 1 + Math.round(p * (sectors.length - 1))), progress: p, start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const step = (direction: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector<HTMLElement>(".sector");
    el.scrollBy({ left: direction * ((card?.offsetWidth ?? 400) + 20), behavior: reducedMotion() ? "auto" : "smooth" });
  };

  return <section className="section sectors" data-tone="light" aria-labelledby="sectors-title">
    <div className="wrap sectors-head">
      <div>
        <Label>Sectors</Label>
        <h2 className="section-title" id="sectors-title" data-heading>Sectors</h2>
      </div>
      <div className="sectors-meta">
        <span className="sector-count" aria-hidden="true">{String(state.current).padStart(2, "0")} / {String(sectors.length).padStart(2, "0")}</span>
        <span className="sector-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(.125, state.progress)})` }} /></span>
        <div className="sector-arrows">
          <button className="square-button" onClick={() => step(-1)} disabled={state.start} aria-label="Previous sectors"><Arrow direction="left" /></button>
          <button className="square-button" onClick={() => step(1)} disabled={state.end} aria-label="Next sectors"><Arrow /></button>
        </div>
      </div>
    </div>
    <ul className="sector-track" ref={track} tabIndex={0} aria-label="Sectors">
      {sectors.map((s, i) => <li key={s.title} className="sector" data-card>
        <a href={s.href!} className="sector-link">
          <span className="sector-photo"><Image src={s.image!} alt="" fill sizes="(max-width: 900px) 80vw, 30vw" /></span>
          <span className="sector-index">{String(i + 1).padStart(2, "0")}</span>
          <span className="sector-title">{s.title}</span>
          <span className="sector-body">{s.body}</span>
          <span className="sector-cta">{s.cta}<Arrow /></span>
        </a>
      </li>)}
    </ul>
    <div className="wrap sectors-foot" data-fade><Button href={links.sectors}>Sectors</Button></div>
  </section>;
}
