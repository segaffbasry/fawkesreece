import { Carousel } from "@/components/Carousel";
import { QuoteCard } from "@/components/home/QuoteCard";
import { Arrow, Label } from "@/components/ui";
import { links, testimonials } from "@/lib/content";

/* All nineteen testimonials from the live homepage's "What Our Clients Say" tab, in gather.ai's card row. */
export function Testimonials() {
  return <section className="section testimonials" data-tone="light" data-late aria-labelledby="testimonials-title">
    <div className="wrap section-head">
      <div>
        <Label>What Our Clients Say</Label>
        <h2 className="section-title" id="testimonials-title" data-heading>Don’t take our word for it, see what our clients had to say!</h2>
      </div>
    </div>
    <div className="wrap">
      <Carousel label="testimonials" controlsId="testimonials-controls">
        {testimonials.map((t) => <li key={t.credit} className="quote-card" data-card>
          <QuoteCard t={t} />
        </li>)}
      </Carousel>
      <div className="section-cta" data-fade><a className="text-link" href={links.track}>What Our Clients Say<Arrow /></a></div>
    </div>
  </section>;
}
