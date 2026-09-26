// Easing curves measured on gather.ai (Framer). The same values are CSS variables in app/globals.css.

// Framer appear effect on gather.ai headings and paragraphs: tween, 0.7 s, delay 0.3 s, y 42 → 0.
// Source: window.__framer__appearAnimationsContent on https://gather.ai/ (id "1wbpvez").
export const easeText = "cubic-bezier(.08,.78,.56,1)";

// Framer appear effect on gather.ai's large blocks: tween, 1.5 s, delay 0.1 s, y 100 → 0 (id "lfbxue").
export const easeRise = "cubic-bezier(.16,1,.39,1.01)";

// Lenis on gather.ai runs in lerp mode (no duration). One 500 px wheel step covered 64% in 144 ms and 80% in
// 207 ms; solving 1 − e^(−60·lerp·t) for those samples gives lerp ≈ 0.12–0.13.
export const lenisLerp = 0.125;
