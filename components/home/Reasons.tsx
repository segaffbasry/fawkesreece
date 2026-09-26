import { Button, Label, Plus } from "@/components/ui";
import { links, reasons } from "@/lib/content";

/* "Why companies choose Fawkes & Reece" from the live Clients page, as a ruled two-column list. */
export function Reasons() {
  return <section className="section reasons" data-tone="light" aria-labelledby="reasons-title">
    <div className="wrap reasons-inner">
      <div className="reasons-head">
        <Label>Clients</Label>
        <h2 className="section-title" id="reasons-title" data-heading>Why companies choose Fawkes &amp; Reece</h2>
        <div data-fade><Button href={links.clients}>Clients</Button></div>
      </div>
      <ul className="reason-list">{reasons.map((r) => <li key={r} data-card><Plus className="reason-plus" /><span>{r}</span></li>)}</ul>
    </div>
  </section>;
}
