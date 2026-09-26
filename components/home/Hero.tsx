"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { bezier } from "@/components/motion";
import { Button, reducedMotion } from "@/components/ui";
import { hero, links, photos } from "@/lib/content";

// Split where the live slider caption reads naturally as two lines.
const titleLines = ["A Specialist Recruiter", "for the Built Environment"];

/* Full-bleed hero after gather.ai: the photograph fills the screen under a black gradient, the headline sits bottom
   left in large light type and the lede and button sit bottom right. It opens on black (the preloader's colour);
   on `intro:done` the photo fades up and settles (gather's 1.5 s block rise), and the headline lines rise out of
   their masks (gather's 0.7 s text appear, delay 0.3 s). */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = (s: string) => el.querySelectorAll<HTMLElement>(s);
    const ctx = gsap.context(() => {
      if (reducedMotion()) return;
      const text = bezier(.08, .78, .56, 1), rise = bezier(.16, 1, .39, 1.01);
      gsap.set(q(".hero-photo"), { opacity: 0, scale: 1.08 });
      gsap.set(q(".hero-line > span"), { yPercent: 110 });
      gsap.set(q("[data-hero]"), { opacity: 0, y: 42 });
      const play = () => gsap.timeline()
        .to(q(".hero-photo"), { opacity: 1, scale: 1, duration: 1.5, ease: rise }, .1)
        .to(q(".hero-line > span"), { yPercent: 0, duration: .9, ease: text, stagger: .12 }, .3)
        .to(q("[data-hero]"), { opacity: 1, y: 0, duration: .7, ease: text, stagger: .1, clearProps: "transform" }, .55);
      if (document.documentElement.dataset.intro === "done") play();
      else document.addEventListener("intro:done", play, { once: true });
      // On the way out the photograph drifts and the copy lifts away.
      gsap.to(q(".hero-media"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(q(".hero-inner"), { y: -60, opacity: .2, ease: "none", scrollTrigger: { trigger: el, start: "center center", end: "bottom top", scrub: true } });
      return () => document.removeEventListener("intro:done", play);
    }, el);
    return () => ctx.revert();
  }, []);

  return <section className="hero" id="top" ref={ref} data-tone="dark" aria-labelledby="hero-title">
    <div className="hero-media" aria-hidden="true">
      <div className="hero-photo duo">
        <Image src={photos["slider23_1.jpg"]} alt="" fill priority sizes="100vw" />
      </div>
    </div>
    <div className="wrap hero-inner">
      <h1 id="hero-title" className="hero-title">{titleLines.map((line) => <span className="hero-line" key={line}><span>{line}</span></span>)}</h1>
      <div className="hero-side">
        <p className="hero-lede" data-hero><span className="hero-hook" aria-hidden="true">↳</span>{hero.lede}</p>
        <div data-hero><Button tone="glass" href={links.jobs}>Job Search</Button></div>
      </div>
    </div>
  </section>;
}
