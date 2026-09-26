import { Label, Plus } from "@/components/ui";
import { whatWeDo } from "@/lib/content";

/* gather.ai's statement block: a label on the left, a large statement on the right, then three columns split by
   hairlines. Copy is the "What We Do" tab from the live homepage. */
export function WhatWeDo() {
  return <section className="section what" data-tone="light" aria-labelledby="what-title">
    <div className="wrap statement">
      <Label>What We Do</Label>
      <h2 className="statement-text" id="what-title" data-heading>{whatWeDo.intro}</h2>
    </div>
    <ol className="wrap columns">
      {whatWeDo.items.map((item, i) => <li key={item.title} className="column" data-card>
        <span className="column-icon" aria-hidden="true"><Plus mono /><span>0{i + 1}</span></span>
        <h3>{item.title}</h3>
        <p data-lines>{item.body}</p>
      </li>)}
    </ol>
  </section>;
}
