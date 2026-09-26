"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { reducedMotion } from "@/components/ui";
import { logoBox, logoFawkes, logoMark, logoReece } from "@/lib/logo";

/* The opening moment: Fawkes & Reece signs its name. Everything runs on one GSAP timeline (about 1.8 s):
   build  0.10–0.95  the plus assembles (blue upright drops, green crossbar crosses, the overlap square lands),
                     FAWKES rises letter by letter, then + REECE wipes in from the left
   hold   0.95–1.20
   exit   1.20–1.80  the lockup flies into the header logo position while the black ground fades to the hero,
                     whose own entrance starts at 1.20 on `intro:done`, so the two overlap.
   The ground is black because the hero opens on black before its photograph fades up. */
// REECE starts at x 73 in the logo's space; the wipe opens from just before it.
const WIPE_X = 70;

export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let announced = false;
    const handover = () => {
      if (announced) return;
      announced = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // While the lockup is in flight the header keeps its own logo hidden; it appears the moment the lockup lands.
    const land = () => { handover(); delete root.dataset.logo; el.style.display = "none"; };
    // The inline script in the layout already decided: no loader for reduced motion (or it has timed out).
    if (reducedMotion() || !root.classList.contains("is-loading")) { land(); return; }

    root.dataset.logo = "flying";
    const q = <T extends Element>(s: string) => el.querySelectorAll<T>(s);
    const lockup = el.querySelector<SVGSVGElement>(".loader-logo")!;
    const target = document.querySelector<HTMLElement>(".site-header .brand");

    const tl = gsap.timeline({ onComplete: land });
    tl.set(q(".logo-v"), { transformOrigin: "50% 0%", scaleY: 0 })
      .set(q(".logo-h"), { transformOrigin: "0% 50%", scaleX: 0 })
      .set(q(".logo-o"), { transformOrigin: "50% 50%", scale: 0 })
      .set(q(".loader-fawkes .logo-letter"), { opacity: 0, y: 14 })
      .set(el.querySelector(".loader-wipe"), { attr: { width: 0 } })
      // Build
      .to(q(".logo-v"), { scaleY: 1, duration: .38, ease: "power3.out" }, .1)
      .to(q(".logo-h"), { scaleX: 1, duration: .38, ease: "power3.out" }, .24)
      .to(q(".logo-o"), { scale: 1, duration: .22, ease: "back.out(2)" }, .5)
      .to(q(".loader-fawkes .logo-letter"), { opacity: 1, y: 0, duration: .42, ease: "power3.out", stagger: .045 }, .3)
      .to(el.querySelector(".loader-wipe"), { attr: { width: logoBox.x + logoBox.w - WIPE_X + 1 }, duration: .5, ease: "power2.inOut" }, .45)
      // Hold, then hand over: the hero and header start their entrance now.
      .call(handover, [], 1.2)
      // Exit: the lockup scales into the header logo's box as the ground fades.
      .to(el, { backgroundColor: "rgba(0,0,0,0)", duration: .6, ease: "power2.inOut" }, 1.2);
    if (target) {
      const from = lockup.getBoundingClientRect(), to = target.getBoundingClientRect();
      tl.to(lockup, { x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width, transformOrigin: "0 0", duration: .6, ease: "power3.inOut" }, 1.2);
    } else {
      tl.to(lockup, { opacity: 0, duration: .5 }, 1.2);
    }
    return () => { tl.kill(); root.classList.remove("is-loading"); delete root.dataset.logo; };
  }, []);

  const { x, y, w, h } = logoBox;
  const rect = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x, y: b.y, width: b.w, height: b.h });
  return <div className="loader" ref={ref} aria-hidden="true">
    <svg className="loader-logo" viewBox={`${x} ${y} ${w} ${h}`}>
      <defs><clipPath id="loader-wipe"><rect className="loader-wipe" x={WIPE_X} y={y} width={x + w - WIPE_X + 1} height={h} /></clipPath></defs>
      <g className="loader-fawkes" fill="var(--blue)">{logoFawkes.map((l, i) => <path key={i} className="logo-letter" d={l.d} />)}</g>
      <rect className="logo-v" {...rect(logoMark.vertical)} fill="var(--blue)" />
      <rect className="logo-h" {...rect(logoMark.horizontal)} fill="var(--green)" />
      <rect className="logo-o" {...rect(logoMark.overlap)} fill="var(--overlap)" />
      <g clipPath="url(#loader-wipe)" fill="var(--green)">{logoReece.map((l, i) => <path key={i} d={l.d} />)}</g>
    </svg>
  </div>;
}
