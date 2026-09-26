"use client";

import { useId, useState } from "react";
import type { Testimonial } from "@/lib/content";

// Quotes longer than this are clamped to keep the row even; "Read more" opens the full text in place.
const LONG = 420;

export function QuoteCard({ t }: { t: Testimonial }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const long = t.quote.join(" ").length > LONG;
  return <figure>
    <span className="quote-mark" aria-hidden="true">“</span>
    <blockquote id={id} className={long && !open ? "is-clamped" : undefined}>{t.quote.map((p, i) => <p key={i}>{p}</p>)}</blockquote>
    {long && <button className="quote-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? "Read less" : "Read more"}</button>}
    <figcaption><strong>{t.name}</strong><span>{t.role}</span></figcaption>
  </figure>;
}
