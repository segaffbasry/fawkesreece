import { Carousel } from "@/components/Carousel";
import { Arrow, Button, Label } from "@/components/ui";
import { featuredJobs, formatDate, links } from "@/lib/content";

// "construction-management" → "Construction Management": the position segment of the live job URL.
const position = (slug: string | null) => slug ? slug.split("/").pop()!.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : null;

/* Featured Jobs from the live homepage, laid out as gather.ai's "What's new" row: heading on the left, square arrows
   on the right and a row of cards that scrolls sideways. Each card opens the job on fawkesandreece.co.uk. */
export function Jobs() {
  return <section className="section jobs" data-tone="light" aria-labelledby="jobs-title">
    <div className="wrap section-head">
      <div>
        <Label>Job Search</Label>
        <h2 className="section-title" id="jobs-title" data-heading>Featured Jobs</h2>
      </div>
    </div>
    <div className="wrap">
      <Carousel label="featured jobs" controlsId="jobs-controls">
        {featuredJobs.map((job) => <li key={job.url} className="job-card" data-card>
          <a href={job.url} className="job-link">
            <span className="job-top"><span className="chip">{job.contract}</span>{position(job.category) && <span className="job-position">{position(job.category)}</span>}</span>
            <span className="job-title">{job.title}</span>
            <dl className="job-meta">
              <div><dt>Location</dt><dd>{job.location}</dd></div>
              <div><dt>Salary</dt><dd>{job.salary}</dd></div>
              {job.type && <div><dt>Type</dt><dd>{job.type}</dd></div>}
            </dl>
            <span className="job-foot"><span>Posted: {formatDate(job.posted)}</span><span className="job-more">Read more<Arrow /></span></span>
          </a>
        </li>)}
      </Carousel>
      <div className="section-cta" data-fade><Button href={links.jobs}>Browse all jobs</Button></div>
    </div>
  </section>;
}
