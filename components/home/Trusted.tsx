import { clients } from "@/lib/content";

/* gather.ai's "Trusted by" strip. Fawkes & Reece publishes no client logos, so the names are set in type: the
   companies whose directors are quoted on the homepage. The strip drifts slowly (paused for reduced motion). */
export function Trusted() {
  return <section className="trusted" data-tone="light" aria-labelledby="trusted-title">
    <div className="wrap trusted-inner">
      <h2 className="label" id="trusted-title" data-fade><span className="label-dot" aria-hidden="true" />Trusted by</h2>
      <div className="marquee">
        <ul className="sr-only">{clients.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((copy) => <ul key={copy}>{clients.map((c) => <li key={c}>{c}</li>)}</ul>)}
        </div>
      </div>
    </div>
  </section>;
}
