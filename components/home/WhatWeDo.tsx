import Image from "next/image";
import { Label, Plus } from "@/components/ui";
import { imagery, whatWeDo } from "@/lib/content";

/* The first section after the hero, made visual (client feedback): the statement sits beside a collage of the
   London office and team, and each service card leads with a photograph. Copy is the live "What We Do" tab. */
export function WhatWeDo() {
  return <section className="section what" data-tone="light" aria-labelledby="what-title">
    <div className="wrap intro">
      <div className="intro-copy">
        <Label>What We Do</Label>
        <h2 className="statement-text" id="what-title" data-heading>{whatWeDo.intro}</h2>
      </div>
      <div className="intro-collage">
        <figure className="intro-photo intro-photo--main" data-image><Image src={imagery.office.src} alt={imagery.office.alt} fill sizes="(max-width: 760px) 90vw, 45vw" data-parallax /></figure>
        <figure className="intro-photo intro-photo--inset" data-image><Image src={imagery.team.src} alt={imagery.team.alt} fill sizes="(max-width: 760px) 50vw, 22vw" /></figure>
        <span className="intro-plus" aria-hidden="true"><Plus /></span>
      </div>
    </div>
    <ol className="wrap services">
      {whatWeDo.items.map((item, i) => <li key={item.title} className="service" data-card>
        <span className="service-photo"><Image src={imagery.services[i].src} alt={imagery.services[i].alt} fill sizes="(max-width: 760px) 90vw, 30vw" /></span>
        <span className="column-icon" aria-hidden="true"><Plus mono /><span>0{i + 1}</span></span>
        <h3>{item.title}</h3>
        <p data-lines>{item.body}</p>
      </li>)}
    </ol>
  </section>;
}
