import Image from "next/image";
import { Label } from "@/components/ui";
import { imagery, why } from "@/lib/content";

/* "Why Fawkes & Reece", rebuilt light and visual (client feedback: the dark strip felt old school). The five values
   are photo cards from the company's own library: ambition, investing in people, charity work, projects delivered
   and the team celebrating. The tab's three paragraphs sit beneath. */
export function Values() {
  const [lead, ...paragraphs] = why.paragraphs;
  return <section className="section values" data-tone="light" aria-labelledby="values-title">
    <div className="wrap values-head">
      <Label>Why Fawkes &amp; Reece</Label>
      <h2 className="section-title" id="values-title" data-heading>{lead.replace(/:$/, "")}</h2>
    </div>
    <ol className="wrap value-cards">
      {why.values.map((value, i) => <li key={value} className="value-card" data-card>
        <Image src={imagery.values[i].src} alt={imagery.values[i].alt} fill sizes="(max-width: 760px) 70vw, 20vw" />
        <span className="value-num" aria-hidden="true">0{i + 1}</span>
        <span className="value-name">{value}</span>
      </li>)}
    </ol>
    <div className="wrap value-notes">{paragraphs.map((p) => <p key={p} data-lines>{p}</p>)}</div>
  </section>;
}
