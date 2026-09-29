import data from "@/content/home.json";

// Everything on the homepage comes from fawkesandreece.co.uk via scripts/scrape.mjs (content/home.json).
// Copy is verbatim. This module only types it and derives the few lists the layout needs.

export const site = "https://fawkesandreece.co.uk";

export type Job = (typeof data.featuredJobs)[number];
export type Sector = (typeof data.sectors)[number];
export type Testimonial = (typeof data.testimonials)[number];

export const hero = data.hero;
export const nav = data.nav;
export const whatWeDo = data.whatWeDo;
export const why = data.why;
export const band = data.band;
export const featuredJobs = data.featuredJobs;
export const sectors = data.sectors;
export const reasons = data.reasons;
export const testimonials = data.testimonials;
export const phones = data.phones;
export const email = data.email;
export const legal = data.legal;
export const socials = data.socials;
export const photos = data.photos;
export const accreditations = data.accreditations;
export const scrapedAt = data.scrapedAt;

// The client companies named in the homepage testimonial credits, in the order they first appear there.
export const clients = ["Sir Robert McAlpine", "McLaren Group", "Countryside Properties", "Telford Homes", "Winvic", "ISG Agility", "Coinford", "VINCI Construction UK", "Domis Construction", "VolkerFitzpatrick", "Lovell", "Wain Homes", "Kier Construction", "Higgins Partnerships"];

// Top-level links from the live header, plus the utility links shown above it on the live site.
export const links = {
  jobs: `${site}/jobs`,
  register: `${site}/jobs/profile`,
  candidates: `${site}/candidates`,
  savedJobs: `${site}/jobs/saved-jobs`,
  contact: `${site}/contacts`,
  values: `${site}/about-us/our-values`,
  clients: `${site}/clients`,
  track: `${site}/about-us/our-track-record`,
  sectors: `${site}/sectors`,
};

// "2026-09-25" → "25 September 2026", as the live job listings print it (day first for en-GB).
export const formatDate = (iso: string | null) => iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

// Photography chosen for each block, all from the live site's media library (content/home.json → photos).
export const imagery = {
  // The London office reception with the Fawkes & Reece wall, and the team in the office.
  office: { src: photos["IMG_2638-scaled.jpg"], alt: "Reception at the Fawkes & Reece London office" },
  team: { src: photos["IMG_2675-scaled.jpg"], alt: "The Fawkes & Reece team in the London office" },
  // One per "What We Do" service, in order.
  services: [
    { src: photos["McLaren-Construction-Nile-Street.jpg"], alt: "McLaren Construction's Nile Street tower under construction" },
    { src: photos["agreement-3489902-scaled.jpg"], alt: "Two people shaking hands across a desk" },
    { src: photos["ThinkstockPhotos-dv1961032-1-scaled.jpg"], alt: "Construction workers reviewing plans on a platform beside a crane" },
  ],
  // One per core value, in order: Ambition, Invest, Care, Deliver, Succeed.
  values: [
    { src: photos["8gg2ne_utcm-ng-scaled.jpg"], alt: "Tower cranes above a high-rise under construction" },
    { src: photos["IMG_2811-scaled.jpg"], alt: "Fawkes & Reece consultants holding their REC qualification certificates" },
    { src: photos["e1919b70-3d0d-4989-a37d-0502dfd2271c.jpg"], alt: "The Fawkes & Reece team at an RSPCA charity event" },
    { src: photos["architecture-1541086-scaled.jpg"], alt: "Cranes over a residential scheme under construction" },
    { src: photos["IMG_3092-scaled.jpg"], alt: "The Fawkes & Reece team at an awards evening" },
  ],
};
