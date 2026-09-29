# Fawkes & Reece homepage

A private prospect demo: the fawkesandreece.co.uk homepage rebuilt in Next.js with the company's own logo, colours,
copy and photography. The layout and motion follow gather.ai. Only the homepage is rebuilt; every other link goes
to the live site.

## Run locally

`npm install`, then `npm run dev` (http://127.0.0.1:3021). `npm run build` and `npm start` for production.
`npm run typecheck` checks TypeScript.

| Script | What it does |
| --- | --- |
| `npm run scrape` | Refreshes `content/home.json` and `public/media` from the live site |
| `npm run logo` | Rebuilds the vector logo (`lib/logo.ts`, `public/brand/*.svg`) |
| `npm run badges` | Rebuilds the accreditation marks (`public/badges`, `lib/rec-logo.ts`); needs Python 3 + Pillow |

## Content (all from fawkesandreece.co.uk, copy verbatim)

| Section | Source | Count |
| --- | --- | --- |
| Hero | Homepage slider caption and photo | 1 |
| Trusted by | Client companies named in the homepage testimonials | 14 |
| What We Do | Homepage "What We Do" tab | 3 |
| Featured Jobs | Homepage featured-jobs carousel, each job enriched from its page | 6 |
| Sectors | /sectors cards, each linking to the live site's filtered job search (`/jobs/?jc=…`) | 8 |
| Blue band | Homepage "Contact a dedicated team member" band | 1 |
| Why Fawkes & Reece | Homepage "Why" tab: 5 values and 3 paragraphs | 1 |
| Why companies choose | /clients list | 9 |
| Testimonials | Homepage "What Our Clients Say" tab | 19 |
| Footer | /contacts offices and email, header menu groups, legal links | 9 offices |

The featured jobs are a snapshot from the live site on the date in `content/home.json`.

## Brand

- **Palette:** black #000 (the logo's tile), blue #00A2E5 (FAWKES), green #99CA3C (+ REECE) and white. Greys are black/white mixes. #00AA4F appears only in the plus overlap.
- **Logo:** the company only publishes a 280 px GIF. `scripts/logo.mjs` measures its parts and resets the Gotham wordmark in Montserrat SemiBold, the closest open match (pixel IoU 0.72 against the GIF). The plus uses the official symbol's proportions.
- **Type:** Montserrat is the display face (gather.ai's font, and the Gotham match). Raleway, the live site's font, is used for the body. Both are self-hosted.
- **Photography:** all photos are shown in natural colour. After client feedback, the earlier duotone read as dark and dated. The intro collage, service cards and value cards use photos from the live site's media library (`imagery` in `lib/content.ts`): the London office and team, a McLaren project shot, team charity and awards photos, and the site's own construction stock.
- **Accreditations:** these are in the header (desktop) and footer, as transparent single-colour marks that take the colour of the section behind them.
  - **REC:** the official vector logo from rec.uk.com.
  - **Recruiter HOT 100 2024:** the 600 px 2024 seal.
  - **Recruiter FAST 50 and FT 1000:** no public high-resolution files exist (the FT 1000 seal is licensed through Statista), so these are the live site's own copies, keyed to transparent.

## How it works

- **Preloader** (`components/Loader.tsx`): one GSAP timeline of about 1.8 s.
  - **Build:** the plus assembles (blue upright, green crossbar, then the overlap square), FAWKES rises letter by letter, and + REECE wipes in.
  - **Exit:** after a short hold, the lockup flies into the header logo position as the black ground fades out.
  - **Handover:** `intro:done` fires at the start of the exit, so the hero and header entrances overlap it. `is-loading` and `data-intro` are managed there.
  - **Safeguards:** an inline script hides the page before first paint and hands it over at 2.4 s whatever happens. The preloader is skipped with reduced motion and hidden without JS.
- **Smooth scroll:** Lenis in lerp mode (0.125, measured on gather.ai), driven by the GSAP ticker and synced with ScrollTrigger. It is stopped during the preloader and the menu.
- **Header:** no bar. Its colour follows the section underneath (`data-tone`), it hides on scroll down and returns on scroll up.
- **Menu:** full-screen, a GSAP timeline in and reversed out. It traps focus, closes on Esc and returns focus to the trigger.
- **Sectors:** a sideways row of cards that never holds the page. A pinned version was tried, and dropped after client feedback that it forced you to scroll through the whole section. Arrows, swipe, trackpad and keyboard move it, and a counter and progress bar follow.
- **Values:** five photo cards (one per value) on a light ground. Each card's blue or green bar grows on hover.
- **Copied interaction:** gather.ai's button (`.btn`). A fill parked off the left edge sweeps across while changing colour, and the label flips. Positions, sizes and the 215 ms curve were sampled frame by frame and written as CSS `linear()` (`--ease-sweep`).

### Reveal moves (`components/motion.tsx`)

| Target | Move | Timing |
| --- | --- | --- |
| `[data-heading]` | The whole phrase fades and rises 42 px | 0.9 s, gather text curve `cubic-bezier(.08,.78,.56,1)` |
| `[data-lines]` | Each line slides up out of its mask | 0.8 s, 0.06 s stagger, same curve |
| `[data-fade]` | Labels and buttons fade in from 10 px left | 0.6 s |
| `[data-card]` | Batched rise of 60 px | 1.1 s, gather block curve `cubic-bezier(.16,1,.39,1.01)` |
| `[data-image]` / `[data-parallax]` | Clip-open plus ±5% drift | 1.2 s / scrubbed |

Everything plays once. Sections marked `[data-late]` run at 70%. Reduced motion shows everything with no movement.

## Private demo settings

- `robots: noindex, nofollow` on every route. There is no sitemap.
- PostHog EU with 25/50/75/100 scroll-depth events (`lib/posthog.ts`). The key can be overridden with `NEXT_PUBLIC_POSTHOG_KEY`. No visible tracking UI.
