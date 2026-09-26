import { Button } from "@/components/ui";
import { band, links } from "@/lib/content";

/* The live homepage's blue band ("Contact a dedicated team member"), styled as gather.ai's mint call-to-action band.
   Black type on the brand blue keeps contrast above 7:1. */
export function Band() {
  return <section className="band" data-tone="light" aria-labelledby="band-title">
    <div className="wrap band-inner">
      <p className="label label--center" data-fade><span className="label-dot label-dot--ink" aria-hidden="true" />Fawkes &amp; Reece</p>
      <h2 id="band-title" data-heading>{band}</h2>
      <div data-fade><Button href={links.contact}>Contact</Button></div>
    </div>
  </section>;
}
