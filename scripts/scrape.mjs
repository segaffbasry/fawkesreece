// Refreshes the homepage content from fawkesandreece.co.uk into content/home.json and downloads the photography
// into public/media. Run with `npm run scrape`. Copy is kept verbatim; only whitespace is normalised.
import { mkdir, writeFile, access } from "node:fs/promises";
import { parse } from "node-html-parser";

const SITE = "https://fawkesandreece.co.uk";
const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" };
const get = async (path) => {
  const res = await fetch(path.startsWith("http") ? path : SITE + path, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.text();
};
const clean = (s) => s.replace(/ /g, " ").replace(/\s+/g, " ").trim();
const text = (node) => clean(node?.text ?? "");
// Cloudflare hides e-mail addresses; the first byte is the XOR key.
const cfDecode = (hex) => { const key = parseInt(hex.slice(0, 2), 16); let out = ""; for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key); return out; };

const home = parse(await get("/"));

/* Hero: the slider caption. */
const hero = {
  title: text(home.querySelector(".tp-caption h1, h1")),
  lede: "Supplying White Collar, Blue Collar and Executive Search to all areas of construction, house building, rail and infrastructure nationwide.",
};
const lede = home.querySelectorAll("h1 ~ *, .tp-caption").map(text).find((t) => t.startsWith("Supplying"));
if (lede) hero.lede = lede;

/* Navigation: the main menu tree. */
const navRoot = home.querySelector("nav ul, #navigation ul");
const nav = navRoot.childNodes.filter((n) => n.tagName === "LI").map((li) => {
  const a = li.querySelector("a");
  return { label: text(a), href: a.getAttribute("href"), children: li.querySelectorAll("ul a").map((c) => ({ label: text(c), href: c.getAttribute("href") })) };
});

/* The three homepage tabs: What We Do, Why Fawkes & Reece, What Our Clients Say. */
const panes = home.querySelectorAll(".tab-pane");
const whatPane = panes[0];
const whatWeDo = {
  intro: text(whatPane.querySelector("p")),
  items: whatPane.querySelectorAll("h4").map((h) => ({ title: text(h), body: text(h.nextElementSibling) })),
};
const why = {
  paragraphs: panes[1].querySelectorAll("p").map(text).filter(Boolean),
  // The five values sit in one heading, separated by the brand symbol image.
  values: text(panes[1].querySelector("h3")).split(/\s+/).filter(Boolean),
};
const testimonials = panes[2].querySelectorAll("li.titledesc").map((li) => {
  const credit = text(li.querySelector("h6"));
  const [name, ...rest] = credit.split(/\s+[-–]\s+/);
  return { name, role: rest.join(" – "), credit, quote: li.querySelectorAll("dd p").map(text).filter(Boolean) };
});
const band = text(home.querySelector(".textbar"));

/* Featured jobs: the carousel on the live homepage, enriched from each job's JSON-LD. */
const featuredJobs = [];
for (const box of home.querySelectorAll("li.job-summary").slice(0, 12)) {
  const link = box.querySelector("h3 a");
  if (!link) continue;
  const url = link.getAttribute("href");
  if (featuredJobs.some((j) => j.url === url)) continue;
  const fields = {};
  box.querySelectorAll(".row p strong").forEach((s) => {
    const key = text(s).replace(":", "").toLowerCase();
    let value = "";
    for (let n = s.nextSibling; n && n.tagName !== "STRONG" && n.tagName !== "BR"; n = n.nextSibling) value += n.text;
    fields[key] = clean(value);
  });
  const detail = await get(url);
  const ld = detail.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let posted = null;
  if (ld) { const m = ld[1].match(/"datePosted":"([^"]+)"/); posted = m?.[1] ?? null; }
  // The description nests <p> inside <p class='description'>, which HTML parsers split, so cut it out by position.
  const start = detail.indexOf("<p class='description'>");
  const body = start < 0 ? "" : detail.slice(start, detail.indexOf("<div id='KA_ApplyBlock'>", start));
  const firstLines = [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => clean(parse(m[1]).text)).filter(Boolean).slice(0, 2);
  featuredJobs.push({
    title: text(link), url, location: fields.location, salary: fields.salary, contract: fields.contract, type: fields.type,
    reference: fields.reference, posted, category: url.split("/jobs/job/")[1].split("/").slice(0, -2).join("/") || null, summary: firstLines,
  });
}

/* Sectors: every card on /sectors, with the live site's own filtered job link. */
const sectorsDoc = parse(await get("/sectors"));
const sectors = sectorsDoc.querySelectorAll(".wpb_text_column h2").map((h) => {
  const row = h.closest(".vc_inner");
  const img = row?.querySelector("img");
  const cta = h.parentNode.querySelector("a");
  const src = img?.getAttribute("src") ?? null;
  return {
    title: text(h),
    body: text(h.nextElementSibling),
    href: cta ? new URL(cta.getAttribute("href"), SITE).href : null,
    cta: text(cta),
    image: src ? src.replace(/-\d+x\d+(\.\w+)$/, "$1") : null,
    alt: img?.getAttribute("alt") ?? "",
  };
}).filter((s) => s.href);

/* Clients page: "Why companies choose Fawkes & Reece". */
const clientsDoc = parse(await get("/clients"));
const whyHeading = clientsDoc.querySelectorAll("p").find((p) => text(p).startsWith("Why companies choose"));
const reasons = whyHeading?.nextElementSibling?.querySelectorAll("li").map(text).filter(Boolean) ?? [];

/* Offices and contact from /contacts. */
const contactDoc = parse(await get("/contacts"));
const phones = contactDoc.querySelectorAll('a[href^="tel:"]').map((a) => {
  const m = text(a).replace(/\.$/, "").match(/^(.*?)\s*\((.*)\)$/);
  return { office: m[2], phone: m[1], tel: a.getAttribute("href").replace(/\s/g, "") };
});
const emailNode = contactDoc.querySelector("[data-cfemail]");
const email = emailNode ? cfDecode(emailNode.getAttribute("data-cfemail")) : null;

const legal = [
  { label: "Terms", href: `${SITE}/terms` },
  { label: "Privacy Notice", href: `${SITE}/disclaimer` },
  { label: "Modern Slavery", href: `${SITE}/modern-slavery-human-trafficking` },
];
const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/fawkes&reece" },
  { name: "X", href: "https://twitter.com/FawkesandReece" },
  { name: "Facebook", href: "https://www.facebook.com/fawkesandreece" },
];

/* Photography: the homepage slides plus the sector cards, full size. */
const media = ["slider23_1.jpg", "slider23_2.jpg", "ThinkstockPhotos-476266625.jpg", "Constrcution-Workers.jpg", "Construction-Workers-2.jpg"];
const accreditations = [
  { file: "image-7-1-1.png", alt: "REC Corporate Member" },
  { file: "image-2.png", alt: "FT 1000 Europe's Fastest Growing Companies" },
  { file: "image-1-1.png", alt: "Recruiter Fast 50" },
  { file: "HOT100_2024_Logo2.png", alt: "Recruiter Hot 100 2024" },
];
await mkdir("public/media", { recursive: true });
const download = async (url) => {
  const name = url.split("/").pop();
  const dest = `public/media/${name}`;
  try { await access(dest); return `/media/${name}`; } catch {}
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return `/media/${name}`;
};
const photos = {};
for (const file of media) photos[file] = await download(`${SITE}/wp-content/uploads/${file}`);
for (const s of sectors) if (s.image) s.image = await download(s.image);
for (const a of accreditations) a.src = await download(`${SITE}/wp-content/uploads/${a.file}`);

await mkdir("content", { recursive: true });
const data = { scrapedAt: new Date().toISOString().slice(0, 10), hero, nav, whatWeDo, why, band, testimonials, featuredJobs, sectors, reasons, phones, email, legal, socials, photos, accreditations };
await writeFile("content/home.json", JSON.stringify(data, null, 2) + "\n");
console.log(`nav ${nav.length} · what we do ${whatWeDo.items.length} · testimonials ${testimonials.length} · featured jobs ${featuredJobs.length} · sectors ${sectors.length} · reasons ${reasons.length} · offices ${phones.length}`);
