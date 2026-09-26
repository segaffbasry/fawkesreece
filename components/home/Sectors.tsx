import Image from "next/image";
import { Arrow, Label } from "@/components/ui";
import { links, sectors } from "@/lib/content";

/* gather.ai's full-bleed story panels, one per sector from /sectors on the live site. Photos sit under a black
   gradient in the blue duotone; each panel opens the live site's own job search filtered to that sector. */
export function Sectors() {
  return <section className="sectors" data-tone="dark" aria-labelledby="sectors-title">
    <div className="wrap sectors-head">
      <Label><a href={links.sectors} id="sectors-title">Sectors</a></Label>
    </div>
    <ul className="sector-grid">
      {sectors.map((s) => <li key={s.title} className="sector">
        <a href={s.href!} className="sector-link">
          <span className="sector-photo duo" data-image><Image src={s.image!} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 25vw" data-parallax /></span>
          <span className="sector-copy">
            <span className="sector-title">{s.title}</span>
            <span className="sector-body">{s.body}</span>
            <span className="sector-cta">{s.cta}<Arrow /></span>
          </span>
        </a>
      </li>)}
    </ul>
  </section>;
}
