# Haley Custom Homes: Technical Architecture and Engineering Standards

Companion to the six design and content documents. Those decide what the site looks like and says. This one decides how the codebase is structured, how quality is enforced before anything ships, and how the project runs in development versus production. Claude Code should treat this as equally binding, not a suggestion to adapt.

## Why this document exists

A speculative demo built once and handed off doesn't need much engineering discipline, but this project has two lives: it has to hold up under Haley's or their provider's technical review if the pitch is accepted, and it becomes the base for a resellable $10k-plus template afterward. Both of those futures require a codebase a second engineer can open, understand, and safely extend without breaking anything, not a pile of components that happen to render correctly today.

## Repository structure

```
haley-custom-homes/
├── src/
│   ├── app/                      # Next.js App Router routes
│   │   ├── (site)/               # Route group for the main marketing site
│   │   │   ├── page.tsx          # Home
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── process/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx             # Root layout: fonts, nav, footer, cookie notice
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # Primitive, content-agnostic pieces: Button, Badge, Accordion
│   │   ├── sections/               # Page-section components: Hero, ProcessHighlight, Testimonials
│   │   └── layout/                 # Nav, MobileMenuOverlay, Footer, SkipLink
│   ├── lib/
│   │   ├── content.ts              # Typed loaders that read and validate the content/ files
│   │   ├── animation.ts            # Shared easing curve, motion variants
│   │   └── schema.ts               # Zod schemas for every content/ data file
│   └── hooks/                       # useScrollProgress, useReducedMotion, etc.
├── content/                          # Every client-specific value lives here, see the Build Spec
│   ├── site.config.ts
│   ├── copy.config.ts
│   ├── projects.json
│   ├── testimonials.json
│   ├── awards.json
│   └── faq.json
├── public/
│   ├── images/
│   ├── video/
│   └── fonts/
├── tests/
│   ├── unit/                        # Vitest: content schema validation, utility functions
│   └── e2e/                         # Playwright: nav, filter tabs, form submission, accessibility
├── docker/
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
├── .github/workflows/ci.yml
├── docker-compose.yml
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

The `content/` directory sits at the project root, outside `src/`, on purpose: it is the one directory a future template buyer needs to replace entirely, and keeping it structurally separate from application code makes that boundary physically obvious rather than something a new implementer has to infer.

## Content validation (directly serves the template-resale goal)

Every file in `content/` is validated against a Zod schema in `src/lib/schema.ts` at build time, not just typed and trusted. If a future template buyer, or Damian himself, edits `projects.json` and leaves out a required field or mistypes a budget range value, the build fails immediately with a clear error naming the exact file and field, rather than shipping a broken page silently. This is a small amount of upfront work that turns "swap in your own content" from a fragile manual process into a build step that either passes or tells you exactly what's wrong.

## TypeScript and code standards

- TypeScript strict mode on, no `any` in application code. If a third-party type is genuinely missing, isolate it in a single declared type in `src/lib/types.ts` rather than suppressing the error inline.
- ESLint, extending `eslint-config-next` plus the accessibility plugin (`eslint-plugin-jsx-a11y`), since decorative-icon and generic-pattern discipline is a design requirement here, not just a code-quality one, and a11y linting catches missing alt text, unlabeled form fields, and interactive divs before they ship.
- Prettier for formatting, no debate over style in review, the formatter decides.
- Husky plus lint-staged: every commit runs type-checking, linting, and formatting on staged files before it's allowed to land. This is the cheapest possible quality gate and it catches most mistakes before they ever reach a pull request.

## Testing

- **Unit tests (Vitest):** the content schema validators, and any non-trivial utility function (the comparison slider's drag-to-percentage math, the scroll-progress calculation for the process page rail). Vitest over Jest here specifically because it runs faster against a Vite-adjacent toolchain and needs less configuration for a project this size.
- **End-to-end tests (Playwright):** the handful of flows that actually matter on a five-page site: the nav opening and closing, the Portfolio filter tabs switching and re-filtering, the contact form completing a full submission and showing the confirmation state, and the comparison slider responding to both drag and the mobile tap-to-toggle fallback. Playwright over Cypress here because its accessibility tree inspection integrates directly with the next item.
- **Automated accessibility checks:** `axe-core` run against every route inside the Playwright suite, checking for the WCAG 2.1 AA baseline (contrast, labeling, keyboard operability) on every build, not just at a one-time manual audit before launch.

## Performance and quality budget

Lighthouse CI runs against the production build in the pipeline described below, with enforced minimums: Performance 90+, Accessibility 100, Best Practices 95+, SEO 100. A site whose entire pitch is premium craft has no excuse for a slow or inaccessible build, and catching a regression (an unoptimized image, a blocking script) in CI before it ships is the only reliable way to hold that bar over time rather than promising to check manually.

## Dependency and security hygiene

- Dependabot (or an equivalent scheduled `npm audit` job) enabled on the repository, checking for known vulnerabilities in dependencies weekly.
- The site is almost entirely static with one deliberate exception, the `/api/contact` serverless route, which is where the real security surface lives. Its SMTP credentials are stored as Vercel environment variables, never committed to the repository, never shipped to the client bundle (the route runs server-side only). Rate-limit that one route (a simple IP-based limit is enough at this volume) so it can't be used to spam an email account, and validate every field server-side before sending, not just in the client-side form, since a client-side check alone can always be bypassed by anyone posting to the endpoint directly.

## CI/CD pipeline (GitHub Actions)

On every pull request:
1. Install dependencies.
2. Type-check the whole project.
3. Lint.
4. Run unit tests.
5. Run the production build (`next build`), which verifies both the static pages and the `/api/contact` route build successfully, and produces the artifact the next two steps test against.
6. Run Lighthouse CI against the built output.
7. Run the Playwright end-to-end suite, including the `axe-core` accessibility checks, against the built output. The contact form's end-to-end test posts to a test SMTP sandbox (Mailhog, Ethereal, or similar), never a real inbox, in CI.

A pull request that fails any of these does not merge. On merge to `main`, Vercel's own Git integration handles the deploy, GitHub Actions' job here is to gate what's allowed to reach `main`, not to perform the deploy itself.

## Docker

The site doesn't need a container to run on Vercel, but Docker still earns its place here for two reasons: a reproducible local development environment regardless of what's installed on Damian's own machine, and a self-hostable option for a future template buyer whose own team wants to run this outside Vercel entirely.

**`docker/Dockerfile.dev`:** a single-stage Node image that installs dependencies and runs `next dev`, with the project directory bind-mounted so file edits hot-reload without rebuilding the image.

**`docker/Dockerfile.prod`:** because the `/api/contact` route needs a server, not just a static file host, this is a single-stage Node image (not the nginx-only two-stage build a pure static export would allow): it installs dependencies, runs `next build`, and runs `next start`, serving both the static pages and the one live API route. A future self-hosting buyer needs a small always-on Node process for this reason, they can't drop the output onto a plain static file host the way a fully static export would have allowed. This is the direct tradeoff for owning the contact form instead of using a third-party form service, and it's worth it, but it should be stated plainly rather than left implicit.

**`docker-compose.yml`:** one `dev` service running `Dockerfile.dev`, exposing port 3000 with the bind mount described above, plus the SMTP sandbox service (Mailhog) so local form testing never touches a real inbox. Add a `preview` service running `Dockerfile.prod` only when someone specifically wants to test the production container locally before deploying it.

## Development versus production

- **Environment variables:** almost every page is still static, with no server and nothing to keep secret, but the `/api/contact` route is a real server-side function, and that's where its SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_TO_ADDRESS`) belong, as plain (non-`NEXT_PUBLIC_`-prefixed) environment variables, since that prefix is what would ship a value to the client bundle, and these must never reach it. `.env.local` for development points at a local SMTP sandbox (Mailhog or Ethereal) so testing never touches a real inbox; `.env.production` points at the real account's credentials.
- **Dev server:** `next dev`, fast refresh, unminified output, source maps on, the SMTP sandbox above.
- **Production build:** `next build`, minified, images optimized at build time via `next/image`, the real SMTP credentials and destination address, the cookie consent notice and any analytics active, `robots.txt` allowing indexing.
- **The Vercel live-demo deployment is a staging environment, not production, even though it's publicly reachable.** It should carry a `noindex` meta tag (or a `robots.txt` disallow scoped to that deployment) so it never gets indexed under a temporary Vercel URL while this is still a speculative, unapproved pitch to Haley, and it should point `/api/contact` at a throwaway or personal inbox, not Haley's real one, until the pitch is accepted. Remove the `noindex` and switch to Haley's real address only on the final production domain, after Haley accepts and the site is actually theirs.

## Monitoring and analytics

Skip a full application-monitoring stack (Sentry and similar) for version one, a static five-page marketing site with no backend has little that needs runtime error tracking, and adding it now is complexity the project doesn't need yet. For traffic and conversion visibility, use Vercel Analytics or Plausible rather than a heavier tool, both are privacy-respecting enough to match the minimal, single-button cookie consent notice already specified in the Design System document rather than requiring a more invasive tracking disclosure to justify their presence.
