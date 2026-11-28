# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for Aayush Home Health Solutions (home nursing, Bangalore), built with Astro 7 + strict TypeScript, plain CSS, no CMS/database, ~14 KB of client JS. Deployed on **Cloudflare Pages** (`netlify.toml` is kept but unused). A push to the deployed branch triggers a production build, so commit/push only with the owner's go-ahead.

Planning docs: `PROJECT_ROADMAP.md` (phased modernisation plan + cross-cutting acceptance criteria in §5) and `PROJECT_PROGRESS.md` (status; update it at the end of every phase). `docs/CONTENT-AUDIT.md` is the register of verified vs. placeholder content.

## Commands

Node >= 22.12.

```bash
npm run dev          # http://localhost:4321
npm run build        # -> dist/
npm run preview      # serve dist/
npm run typecheck    # astro check (expect 0 errors / 0 warnings / 0 hints)
npm test             # vitest run (tests/**/*.test.ts)
npx vitest run tests/lib.test.ts          # single file
npx vitest run -t "treats a 2xx reply"    # single test by name
npm run test:links   # post-build checker; requires a fresh `npm run build`
npm run verify       # typecheck + test + build + test:links — must pass before any change is considered done
```

Browser QA (optional; Python + Playwright + Chromium): `sh qa/run.sh` (on Windows: `PYTHON=python sh qa/run.sh`). It builds two sites — `dist/` (demo mode; a form key in `.env` is ignored for it) and `dist-ep/` (fake endpoint `https://forms.test/submit`) — serves them on ports 4321/4322 via `qa/serve.mjs`, then runs `functional.py`, `axe.py` (WCAG A/AA, must be 0 violations) and `screenshots.py` (overflow check at 320–1440 px, output in `qa/screenshots/`).

`scripts/check-links.mjs` enforces on every built page: title, meta description, canonical without `.html`, exactly one `<h1>`, no duplicate ids, every `<img>` has alt, every internal href/src/#fragment resolves, sitemap entries exist.

## Architecture

**Single sources of truth — data drives the UI, don't hard-code business facts in components:**
- `src/config/site.ts` — name, phones (first = primary), email, WhatsApp (`whatsappHref()`), `offices`, `socialLinks`, `enquiryPackages`, form endpoint config. JSON-LD (`components/ui/Seo.astro`) and the Privacy Policy derive the address from `offices[0]` via `streetAddress`/`addressOneLine`; a unit test guards against drift.
- `src/config/navigation.ts` — header/footer nav; service links are generated from services.
- `src/content/services.ts` (services, `serviceCategories`, `careSituations`), `pages.ts`, `faqs.ts` (`faqCategories`; each FAQ has a `category`, optional `points`/`links`), `testimonials.ts` — typed content (types in `src/lib/types.ts`). Blog posts are Markdown in `src/content/blog/` (schema in `src/content.config.ts`): front matter `category` (an id from `src/content/blog-categories.ts`), optional `image` (`src` file name + `alt`), `services` (service slugs) and `featured` (lead story on /blog); unknown topics, service slugs or image files fail the build. Reading time is computed (`readingMinutes` in `lib/format.ts`).

**Count-driven layouts:** there are 13 services (owner's list, Nov 2026; grouped by `serviceCategories` in `services.ts`) and one office (Bangalore). Components adapt to the array sizes — more than one service enables the nav dropdown (two columns above 6), the form's service picker and the home "Explore all" link; `featured: true` picks the home page cards (the first is the large photo card) and, past 7 services, the footer links; a service without a photo shows its icon on its page; more offices switch to multi-office layouts/headings; a non-empty `enquiryPackages` reveals the Package field. Preserve this behaviour when editing those components.

**Blog drafts:** always list posts via `getPublishedPosts()` in `src/content/blog.ts`, never `getCollection('blog')` directly. `draft: true` removes a post from every listing, the sitemap, and the build (its URL 404s).

**Layering:** `src/pages/*` (file-based routes) compose `components/sections/*`, which read from `content/` and `config/`, inside `layouts/BaseLayout.astro`. Framework-free logic lives in `src/lib/` (validation, submit, paths, format) so it is unit-testable — keep it free of Astro imports. Path alias `@/*` → `src/*`.

**URLs:** `build.format: 'file'` + `trailingSlash: 'never'` → `/about` is built as `about.html`. At build time `Astro.url.pathname` is `/about.html`, so use `cleanPath()` (`src/lib/paths.ts`) for canonical URLs and active-link detection. Existing URLs are live and indexed and must keep working. `SITE_URL` env sets the canonical origin.

**Forms (`src/lib/submit.ts`, `components/forms/ContactForms.astro`):** three honest outcomes — `demo` (no endpoint: nothing sent, UI says so, no network request), `sent`, `error`. A 2xx reply with `{"success": false}` is an error, never "sent". Setting only `PUBLIC_WEB3FORMS_ACCESS_KEY` (Web3Forms; the older `PUBLIC_FORM_ACCESS_KEY` is still read as a fallback) takes the form live; `PUBLIC_FORM_ENDPOINT` overrides the endpoint. The payload is built by `buildPayload()` (readable keys, empty optional fields omitted). The Web3Forms honeypot (`botcheck` checkbox) is never sent: a ticked one is dropped client-side. One form with an enquiry/booking switch; the service field is `components/forms/ServicePicker.astro`, a select-only combobox that mirrors a hidden native `<select>` (the submitted value and the `?service=` target). Required: service, name, phone, area; booking also requires a start date. `PUBLIC_*` vars are baked in at build time and are public — never put secrets in them.

**Images:** photos live in `src/assets/images/` (site photography) or `src/assets/gallery/` (the team's own photos and the About page clip; originals with the crop applied to each are kept in `docs/media-originals/`, which is git-ignored and local only because the repo is public and client consent is unconfirmed) and are referenced from content files by file name only (an `ImageSlot` with `src`, `alt`, `ratio`, optional `position` focal point). `components/ui/Media.astro` resolves them via `import.meta.glob`, emits AVIF/WebP `<picture>` at 480–1600 px (never upscaling), takes a per-use `sizes` prop, and renders a labelled placeholder when `src` is empty. An unknown file name throws at build. Short silent clips (`VideoSlot`, MP4 + poster in `src/assets/gallery/`) render through `components/ui/VideoCard.astro`: `preload="none"`, play only while on screen, a pause button, no autoplay for reduced-motion/data-saver users. `public/` holds only the logo SVG, favicons, `og-default.jpg` and `_headers`; regenerate the icons/share image after a logo change with `node scripts/generate-brand-assets.mjs`.

**Styling:** design tokens in `src/styles/tokens.css` (colours, fonts, spacing); globals in `global.css`; otherwise Astro scoped styles. Fonts are self-hosted via `@fontsource-variable` (Fraunces headings, Inter body).

## Rules that matter here

- **Content integrity:** never invent testimonials, credentials, statistics, services or claims. **No draft/placeholder badges, labels or "[Placeholder]" text anywhere in the UI** (owner's instruction, 28 Nov 2026): write finished-looking copy and log anything unconfirmed in `docs/CONTENT-AUDIT.md` instead; the owner reviews it. Placeholder reviews must be `sample: true` in `src/content/testimonials.ts` and rendered only via `visibleTestimonials`, which keeps them to the dev server (they carry no visible label, so they must never reach a build); real reviews' headlines must be verbatim excerpts (unit-tested).
- **No dead controls:** don't add UI that does nothing (e.g. search without a backend).
- **Mobile-first acceptance criteria (every change):** no horizontal scroll from 320 px; tap targets ≥ 44×44 px; body text ≥ 16 px; a call/WhatsApp action reachable in one tap from any scroll position (`components/layout/ContactDock.astro` below 1100 px); visible labels and correct `type`/`inputmode`/`autocomplete` on form fields.
- Remove unused code/imports/assets in the same change that makes them unused; avoid new dependencies.
- Adding analytics requires updating the Privacy Policy (it states no tracking is used).
