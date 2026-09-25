# Haley Custom Homes

Marketing site for Haley Custom Homes, a Denver luxury custom home builder. Next.js 14 (App Router),
Tailwind, Framer Motion, Lenis. Every page is statically generated; the one server route is
`/api/contact`, which sends inquiries by SMTP.

The design, copy and interaction decisions live in [`docs/`](docs/). Build from those, not from memory.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in SMTP values, or use Docker + Mailhog below
npm run dev                  # http://localhost:3000
```

With Docker (includes a Mailhog SMTP sandbox at http://localhost:8025):

```bash
docker compose up dev
```

## Content (the template boundary)

Everything client-specific lives in `content/`. Re-skinning the template for another builder means
replacing these files and the media, with no component changes:

| File                        | Holds                                                          |
| --------------------------- | -------------------------------------------------------------- |
| `content/site.config.ts`    | Business name, contact info, service areas, SEO defaults       |
| `content/copy.config.ts`    | Every headline, label and paragraph, keyed by page and section |
| `content/projects.json`     | Portfolio projects                                             |
| `content/testimonials.json` | Client quotes                                                  |
| `content/awards.json`       | Awards and marks                                               |
| `content/faq.json`          | Contact page questions                                         |

All of it is validated with Zod (`src/lib/schema.ts`) at build time. A bad edit fails the build with the
exact file and field.

### Sources and open items

- Projects are the six on Haley's Houzz profile, matched to the asset folders by comparing each Houzz
  cover photo (see `scripts/process-media.py`). Location and completion year come from Houzz. Square
  footage and build duration are not published, so they are omitted (the schema allows them once known).
- Haley's own average build duration is not published; the FAQ answer is framed around the national
  12-month average without inventing a Haley figure.
- The contact map needs a Mapbox public token (`NEXT_PUBLIC_MAPBOX_TOKEN`). Without it the map panel shows
  the office address.

## Media

Type: Bodoni Moda (SIL Open Font License, via `next/font/google`) and Switzer (Indian Type Foundry,
ITF Free Font License, self-hosted from `src/fonts`).

The raw asset library (`assets/`, ~570 MB) is not committed. `npm run media` (Python, needs Pillow and
`imageio-ffmpeg`) builds the optimized images, blur placeholders (`src/lib/media.generated.json`),
recolored logo and award marks, and the hero video into `public/`. Choose which photos appear in
`scripts/process-media.py`.

## Quality gates

| Command             | What it runs                                                                          |
| ------------------- | ------------------------------------------------------------------------------------- |
| `npm run typecheck` | TypeScript, strict                                                                    |
| `npm run lint`      | ESLint (Next + jsx-a11y)                                                              |
| `npm test`          | Vitest: content schemas, grid module, rail math, rate limit                           |
| `npm run test:e2e`  | Playwright: every Fixes-spec acceptance check, axe WCAG 2.1 AA, overflow at 10 widths |

Husky runs lint-staged and a type-check before each commit. GitHub Actions (`.github/workflows/ci.yml`)
runs all of the above, plus Lighthouse CI (Performance 90, Accessibility 100, Best Practices 95,
SEO 100) against the production build, with the form test posting to a Mailhog service.

## Environment variables

Server-only. Never prefix these with `NEXT_PUBLIC_`.

| Name                                                   | Purpose                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Sending account (an app password, not a login password)                         |
| `CONTACT_TO_ADDRESS`                                   | Where inquiries land. For the demo, not Haley's real inbox                      |
| `CONTACT_FROM_ADDRESS`                                 | Optional sender; defaults to `SMTP_USER`                                        |
| `SITE_ENV`                                             | Set to `production` only on Haley's final domain. Anything else sends `noindex` |

## Deploy

Vercel, zero config. Set the variables above in the project settings. The demo stays `noindex` until
`SITE_ENV=production`. To self-host, use `docker/Dockerfile.prod`. It needs a small Node process for the
contact route.
