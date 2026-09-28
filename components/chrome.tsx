"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badges } from "@/components/Badges";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Button, Plus, SocialIcon, reducedMotion } from "@/components/ui";
import { email, legal, links, nav, phones, socials } from "@/lib/content";
import type { brandIcons } from "@/lib/brand-icons";

/* Full-screen menu. A black sheet wipes down from the top, then the groups rise in. Closing plays it in reverse.
   Every group from the live header is here; the links go to fawkesandreece.co.uk. */
function Menu({ open, close }: { open: boolean; close: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(1);
  const group = nav[active];

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .8, ease: "power3.inOut" }, 0)
      .fromTo(el.querySelectorAll("[data-m]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .035 }, .38);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.4).reverse();
  }, [open, close]);

  // The sub-list for the chosen group rises in on its own when the group changes.
  useEffect(() => {
    const el = root.current; if (!el || !open || reducedMotion()) return;
    gsap.fromTo(el.querySelectorAll(".menu-sub li"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: "power3.out", stagger: .03, overwrite: true });
  }, [active, open]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" inert={!open} data-lenis-prevent>
    <div className="menu-top">
      <a href="#top" className="menu-logo" onClick={close} aria-label="Fawkes & Reece, back to top"><Logo /></a>
      <button className="menu-close" onClick={close}><span>Close</span><span className="menu-x" aria-hidden="true" /></button>
    </div>
    <div className="menu-body">
      <nav className="menu-main" aria-label="Main">
        <ul>{nav.map((item, index) => <li key={item.label} data-m>
          {item.children.length
            ? <button className={`menu-link ${index === active ? "is-active" : ""}`} aria-expanded={index === active} aria-controls="menu-sub" onClick={() => setActive(index)}>{item.label}<Plus className="menu-plus" mono /></button>
            : <a className="menu-link" href={item.href}>{item.label}<Arrow direction="up-right" /></a>}
        </li>)}</ul>
      </nav>
      <div className="menu-side">
        <div className="menu-sub" id="menu-sub" key={group.label}>
          <p className="label" data-m><span className="label-dot" aria-hidden="true" />{group.label}</p>
          <ul>
            {/* The group's own page leads, unless the live menu already lists it as a child (About › About Us). */}
            {!group.children.some((c) => c.href === group.href) && <li><a href={group.href}>{group.label}<Arrow /></a></li>}
            {group.children.map((child) => <li key={child.href}><a href={child.href}>{child.label}<Arrow /></a></li>)}
          </ul>
        </div>
        <div className="menu-contact" data-m>
          <p className="label"><span className="label-dot" aria-hidden="true" />Candidate Zone</p>
          <ul className="menu-utility">
            <li><a href={links.candidates}>Candidate Zone</a></li>
            <li><a href={links.savedJobs}>Saved jobs</a></li>
            <li><a href={links.register}>Register</a></li>
          </ul>
          <a className="menu-email" href={`mailto:${email}`}>{email}</a>
          <a className="menu-phone" href={phones[0].tel}>{phones[0].office} – {phones[0].phone}</a>
          <Socials />
        </div>
      </div>
    </div>
  </div>;
}

/* Frameless header. Its colour follows the section underneath, it hides on the way down and returns on the way up. */
function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const bar = header.current; if (!bar) return;
    let last = window.scrollY, frame = 0;
    const tone = () => {
      const probe = bar.offsetHeight / 2;
      const section = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).find((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
      bar.dataset.tone = section?.dataset.tone ?? "light";
    };
    const update = () => {
      frame = 0;
      const y = window.scrollY, delta = y - last;
      tone();
      bar.classList.toggle("is-scrolled", y > 40);
      if (y < 120) { bar.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      bar.classList.toggle("is-hidden", delta > 0);
      last = y;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    const reveal = () => bar.classList.remove("is-hidden");
    bar.addEventListener("focusin", reveal);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    return () => { bar.removeEventListener("focusin", reveal); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); cancelAnimationFrame(frame); };
  }, []);

  // The header joins the hero entrance after the preloader hands over.
  useEffect(() => {
    const bar = header.current; if (!bar || reducedMotion()) return;
    const items = bar.querySelectorAll("[data-hero-header]");
    const play = () => gsap.fromTo(items, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .08, delay: .15, clearProps: "all" });
    if (document.documentElement.dataset.intro === "done") return;
    gsap.set(items, { opacity: 0 });
    document.addEventListener("intro:done", play, { once: true });
    return () => document.removeEventListener("intro:done", play);
  }, []);

  return <><header className="site-header" ref={header} data-tone="dark">
    <a href="#top" className="brand" aria-label="Fawkes & Reece, back to top"><Logo /></a>
    <button className="menu-toggle" data-hero-header aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
      <span className="menu-lines" aria-hidden="true"><span /><span /></span><span className="menu-word">Menu</span>
    </button>
    <div className="header-actions" data-hero-header>
      <Badges className="header-badges" />
      <a className="header-link" href={links.jobs}>Jobs</a>
      <a className="header-link" href={links.contact}>Contact</a>
      <Button tone="blue" href={links.register}>Register</Button>
    </div>
  </header>
  {/* Outside the header: the header slides with a transform, which would re-anchor a fixed child. */}
  <Menu open={open} close={close} /></>;
}

function Socials() {
  return <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} aria-label={`Fawkes & Reece on ${s.name}`}><SocialIcon name={s.name as keyof typeof brandIcons} /></a></li>)}</ul>;
}

/* Footer: gather.ai's dark closing block, filled with the live site's offices, groups and legal links. */
function Footer() {
  const groups = nav.filter((item) => item.children.length);
  const singles = nav.filter((item) => !item.children.length);
  return <footer className="site-footer" id="contact" data-tone="dark" data-late>
    <div className="wrap footer-top">
      <a href="#top" className="footer-logo" aria-label="Fawkes & Reece, back to top"><Logo /></a>
      <div className="footer-ctas" data-fade>
        <Button tone="blue" href={links.jobs}>Search jobs</Button>
        <Button tone="glass" href={links.contact}>Contact us</Button>
      </div>
    </div>
    <div className="wrap footer-offices" data-fade>
      <p className="label"><span className="label-dot" aria-hidden="true" />Our offices</p>
      <ul>{phones.map((p) => <li key={p.office}><span>{p.office}</span><a href={p.tel}>{p.phone}</a></li>)}</ul>
      <a className="footer-email" href={`mailto:${email}`}>{email}</a>
    </div>
    <div className="wrap footer-columns">
      {groups.map((group) => <div key={group.label} className="footer-column">
        <h2><a href={group.href}>{group.label}</a></h2>
        <ul>{group.children.map((c) => <li key={c.href}><a href={c.href}>{c.label}</a></li>)}</ul>
      </div>)}
      <div className="footer-column">
        <h2>Fawkes &amp; Reece</h2>
        <ul>{singles.map((s) => <li key={s.href}><a href={s.href}>{s.label}</a></li>)}<li><a href={links.candidates}>Candidate Zone</a></li></ul>
      </div>
    </div>
    <div className="wrap footer-bottom">
      <Badges className="footer-badges" />
      <Socials />
      <p className="footer-legal">© {new Date().getFullYear()} Fawkes &amp; Reece Recruitment Group{legal.map((l) => <span key={l.href}> · <a href={l.href}>{l.label}</a></span>)}</p>
    </div>
  </footer>;
}

export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main">{children}</main>
    <Footer />
  </>;
}
