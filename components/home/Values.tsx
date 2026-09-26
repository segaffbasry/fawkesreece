import Image from "next/image";
import { Arrow, Label } from "@/components/ui";
import { photos, why } from "@/lib/content";

/* "Why Fawkes & Reece" as gather.ai's dark See → Think → Act strip: the statement top left, the five values in a
   row joined by arrows, and the tab's three paragraphs beneath. */
export function Values() {
  const [lead, ...paragraphs] = why.paragraphs;
  return <section className="values" data-tone="dark" aria-labelledby="values-title">
    <div className="values-photo duo" aria-hidden="true"><Image src={photos["Construction-Workers-2.jpg"]} alt="" fill sizes="100vw" data-parallax /></div>
    <div className="wrap values-inner">
      <Label>Why Fawkes &amp; Reece</Label>
      <h2 className="values-title" id="values-title" data-heading>{lead.replace(/:$/, "")}</h2>
      <ol className="value-row">
        {why.values.map((value, i) => <li key={value} data-card>
          <span className="value-name">{value}</span>
          {i < why.values.length - 1 && <Arrow className="value-arrow" />}
        </li>)}
      </ol>
      <div className="value-notes">{paragraphs.map((p) => <p key={p} data-lines>{p}</p>)}</div>
    </div>
  </section>;
}
