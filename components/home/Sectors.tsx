"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Button, Label } from "@/components/ui";
import { links, sectors } from "@/lib/content";

/* Sectors as a horizontal scroll. On desktop the section pins and the cards travel sideways as you scroll down,
   with a progress bar and counter. On touch screens, narrow screens and with reduced motion it is a native sideways
   swipe. Light ground and natural-colour photographs (client feedback: the dark panels felt heavy and dated).
   Each card opens the live site's own job search filtered to that sector. */
export function Sectors() {
  const ref = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const track = el.querySelector<HTMLElement>(".sector-track")!;
    const bar = el.querySelector<HTMLElement>(".sector-progress span")!;
    const show = (p: number) => { bar.style.transform = `scaleX(${p})`; setCurrent(Math.min(sectors.length, 1 + Math.round(p * (sectors.length - 1)))); };
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      el.classList.add("is-pinned");
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const tween = gsap.to(track.children, {
        x: () => -distance(), ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (self) => show(self.progress) },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); el.classList.remove("is-pinned"); gsap.set(track.children, { clearProps: "transform" }); };
    });
    // Without the pin, the bar and counter follow the native sideways scroll.
    const onScroll = () => { if (!el.classList.contains("is-pinned")) show(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)); };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => { mm.revert(); track.removeEventListener("scroll", onScroll); };
  }, []);

  return <section className="sectors" ref={ref} data-tone="light" aria-labelledby="sectors-title">
    <div className="wrap sectors-head">
      <div>
        <Label>Sectors</Label>
        <h2 className="section-title" id="sectors-title" data-heading>Sectors</h2>
      </div>
      <div className="sectors-meta" aria-hidden="true">
        <span className="sector-count">{String(current).padStart(2, "0")} / {String(sectors.length).padStart(2, "0")}</span>
        <span className="sector-progress"><span /></span>
      </div>
    </div>
    <ul className="sector-track" tabIndex={0} aria-label="Sectors">
      {sectors.map((s, i) => <li key={s.title} className="sector">
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
