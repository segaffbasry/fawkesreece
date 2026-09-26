"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { lenisLerp } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitLines } from "@/lib/split";

// Easing families from gather.ai's Framer appear effects (see lib/ease.ts). Text uses the first, blocks the second.
const EASE_TEXT = "text", EASE_RISE = "rise";
let easesRegistered = false;

/* Smooth scroll, the five reveal moves and anchor links. See the motion table in README.md. */
export function usePageMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!easesRegistered) {
      // gsap has no cubic-bezier parser, so the two curves are registered as functions.
      easesRegistered = true;
      gsap.registerEase(EASE_TEXT, bezier(.08, .78, .56, 1));
      gsap.registerEase(EASE_RISE, bezier(.16, 1, .39, 1.01));
    }
    const root = document.documentElement;
    const reduced = reducedMotion();

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: lenisLerp, wheelMultiplier: 1 });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (root.classList.contains("is-loading")) lenis.stop();
    }
    const resume = () => lenis?.start();
    document.addEventListener("intro:done", resume);

    const reverts: (() => void)[] = [];
    const late = (el: Element) => el.closest("[data-late]") ? .7 : 1;
    const ready = (el: Element) => el.setAttribute("data-ready", "");

    const ctx = gsap.context(() => {
      /* 1. Headings: the whole phrase fades and rises once. */
      document.querySelectorAll<HTMLElement>("[data-heading]").forEach((el) => {
        ready(el);
        if (reduced) return;
        const k = late(el);
        gsap.set(el, { opacity: 0, y: 42 * k });
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: .9 * k, ease: EASE_TEXT, clearProps: "transform" }) });
      });

      /* 2. Paragraphs: each line slides up out of its own mask. */
      document.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
        if (reduced) { ready(el); return; }
        const k = late(el);
        const split = splitLines(el);
        ready(el);
        gsap.set(split.lines, { yPercent: 105 });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(split.lines, { yPercent: 0, duration: .8 * k, ease: EASE_TEXT, stagger: .06 * k, delay: .1, onComplete: split.revert }) });
        reverts.push(split.revert);
      });

      /* 3. Labels and buttons: a short fade in from the left. */
      document.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
        ready(el);
        if (reduced) return;
        const k = late(el);
        gsap.set(el, { opacity: 0, x: -10 * k });
        ScrollTrigger.create({ trigger: el, start: "top 94%", once: true, onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: .6 * k, ease: EASE_TEXT, delay: .15, clearProps: "transform" }) });
      });

      /* 4. Cards: batched, rising together with a small stagger. */
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach(ready);
      if (!reduced && cards.length) {
        gsap.set(cards, { opacity: 0, y: 60 });
        ScrollTrigger.batch(cards, { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1 * late(batch[0]), ease: EASE_RISE, stagger: .08, clearProps: "transform" }) });
      }

      /* 5. Images: the frame clips open, and the photo inside drifts ~10% against the scroll. */
      document.querySelectorAll<HTMLElement>("[data-image]").forEach((el) => {
        ready(el);
        if (reduced) return;
        gsap.set(el, { clipPath: "inset(10% 6% 10% 6%)" });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 * late(el), ease: EASE_RISE, clearProps: "clipPath" }) });
      });
      if (!reduced) document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: el.parentElement, scrub: true, start: "top bottom", end: "bottom top" } });
      });
    });

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      const id = link.getAttribute("href") ?? "";
      const target = id === "#top" || id === "#" ? null : document.querySelector<HTMLElement>(id);
      if (id !== "#top" && !target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target ?? 0, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
      if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
    };
    document.addEventListener("click", onClick);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("intro:done", resume);
      window.removeEventListener("load", refresh);
      ctx.revert();
      reverts.forEach((revert) => revert());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); setLenis(null);
    };
  }, []);
}

/* Focus trap for full-screen overlays: Tab cycles inside, Esc closes, focus returns to the trigger, scroll pauses. */
export function focusOverlay(container: HTMLElement, close: () => void) {
  const previous = document.activeElement as HTMLElement | null;
  getLenis()?.stop();
  document.documentElement.classList.add("has-overlay");
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null);
  requestAnimationFrame(() => focusable()[0]?.focus());
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("keydown", handleKey);
    document.documentElement.classList.remove("has-overlay");
    getLenis()?.start();
    previous?.focus();
  };
}

/* CSS cubic-bezier(x1, y1, x2, y2) as an easing function (Newton–Raphson on x, then y). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1, b = (p1: number, p2: number) => 3 * p2 - 6 * p1, c = (p1: number) => 3 * p1;
  const at = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t: number, p1: number, p2: number) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);
  return (x: number) => {
    if (x <= 0 || x >= 1) return x <= 0 ? 0 : 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (at(t, x1, x2) - x) / s; }
    return at(Math.min(1, Math.max(0, t)), y1, y2);
  };
}
