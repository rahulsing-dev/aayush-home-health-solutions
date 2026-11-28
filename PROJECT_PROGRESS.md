# Project Progress

Tracks the work defined in [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md). Update this file at the end of every phase.

**Legend:** ✅ Done · 🔄 In progress · ⏳ Pending · ⛔ Blocked (waiting on owner input) · ➖ Not needed

## Phase overview

| # | Phase | Priority | Status |
|---|---|---|---|
| 1 | Audit and architecture review | — | ✅ Done (28 Nov 2026) |
| 2 | Critical fixes and conversion foundations | Critical | ✅ Code complete (28 Nov 2026). **Owner action pending:** Web3Forms key + redeploy |
| 3 | UI/UX strategy and design system | High | ⏳ Next |
| 4 | Homepage redesign | High | ⏳ Pending |
| 5 | Contact, forms and conversion optimisation | High | ⏳ Pending |
| 6 | Services and service pages | High | ⛔ Needs D4 |
| 7 | Trust-building sections | Medium–High | ⛔ Needs D5–D7 |
| 8 | SEO and local search | High | ⏳ Pending |
| 9 | Performance, accessibility and security | Medium | ⏳ Pending |
| 10 | Testing, bug fixes and deployment | Release gate | 🔄 Continuous |

> ℹ️ Since Phase 2 the work has gone page by page rather than phase by phase (Home, Services, About, Why Aayush, Blog and FAQs, Contact, Career, a full-site audit and a pre-production cleanup); see the change log below. The phase statuses in this table have not been re-assessed against their acceptance criteria.

> ⚠️ **Nothing from Phases 1–2 is deployed or committed yet.** The work is in the local working tree and passes every check. It goes live only after a commit and push trigger a Cloudflare Pages build, which happens with your go-ahead.

---

## Phase 2: Critical fixes and conversion foundations (code complete)

| Task | Status | Notes |
|---|---|---|
| Form delivery via **Web3Forms** | ✅ Code / ⏳ Owner | Setting only `PUBLIC_FORM_ACCESS_KEY` takes the forms live (endpoint defaults to Web3Forms). A `{"success": false}` reply is now shown as an error, never as "sent". **Owner:** get a key at web3forms.com with the Gmail address, add it in Cloudflare Pages → Settings → Variables and Secrets, redeploy. Steps are in the README. |
| Remove the public "demo mode" note | ✅ Automatic | Disappears once the key is set; nothing to change in code |
| WhatsApp click-to-chat (+91 70130 50751) | ✅ | `contact.whatsapp` and `whatsappHref()` in `site.ts`; links in the top bar, mobile menu, contact page, footer, CTA band, and service page (pre-filled message naming the service) |
| Sticky mobile action bar (Call · WhatsApp · Enquire) | ✅ | New `ContactDock.astro`; below 1100 px; omits "Enquire" on `/contact`; slides away while a form field is focused (keyboard open); 52 px tap targets; WCAG AA colours |
| Desktop floating WhatsApp button | ✅ | ≥ 1100 px, with tooltip and descriptive accessible name |
| Top bar hidden on phones | ✅ | Showed only "We are reachable 24/7"; the dock replaces it, freeing 40 px above the fold |
| Address mismatch fixed | ✅ | JSON-LD and the Privacy Policy are now built from `offices[0]`; the outdated "#4, Sai Enclave…" address is gone. A unit test guards against drift |
| Responsive image pipeline | ✅ | Photos moved to `src/assets/images/`; `Media.astro` outputs AVIF/WebP `<picture>` at 480–1600 px with per-use `sizes`; never upscales. **Homepage photos on a 390 px phone: ≈ 1.9 MB → ≈ 107 KB** |
| Nested logo links fixed | ✅ | `Logo.astro` no longer contains a link; max `<a>` nesting depth is now 1 |
| Footer logo readable | ✅ | Light variant shows the logo on a white tile (was dark blue on navy) |
| Logo SVG optimisation | ➖ | 120 KB raw but only ≈ 28 KB over the wire (compressed); a lossless trim would save ~2 KB. The SVG optimiser crashes on this auto-traced file. Ask for the designer's original vector if one exists |
| Favicon, apple-touch-icon, og:image from the real logo | ✅ | `scripts/generate-brand-assets.mjs` (re-runnable). Replaced the generic stand-in favicon. `og:image` + `summary_large_image` on all pages; logo and image added to the JSON-LD |
| Cleanup | ✅ | Removed: 2 unused raster logos, the stand-in favicon, 4 unused imports (`astro check` hints 4 → 0), commented-out code (testimonials block → `showTestimonialsOnHome` flag; sample job), unused `verified` fields, 4 unused CSS utilities, a stray blank line |
| Placeholder alt text on the Why Aayush image | ✅ | Now describes the photo |
| README, `.env.example`, image README | ✅ | Updated for Cloudflare Pages + Web3Forms, the image workflow, WhatsApp and the logo |
| Browser QA working locally | ✅ | Playwright installed; QA server now serves AVIF/WebP/PNG/JPEG; added 360 px and 320 px viewports; `PYTHON=python sh qa/run.sh` works on Windows |

### Phase 2 test results (28 Nov 2026)

| Check | Result |
|---|---|
| `astro check` | 0 errors, 0 warnings, 0 hints |
| Vitest | **24/24** (6 new: provider `success:false`, non-JSON replies, `from_name`, WhatsApp link, address derivation, new email) |
| Build + link/SEO checker | 15 pages, 698 internal links/assets, all pass |
| Browser functional (Chromium) | **58/58** |
| axe-core (WCAG 2.0/2.1 A+AA + best practice), 15 pages × desktop + mobile | **0 violations** |
| Horizontal overflow, 14 pages × 6 widths (320, 360, 390, 768, 1024, 1440) | **None** |
| Visual review | Home (top + footer) and contact (typing state) at 390 px; service page at 1440 px |

**Bugs found and fixed during Phase 2 testing**
1. The new, longer email address caused horizontal scrolling at 320 px (footer) and 360–390 px (career page button). Fixed with a global rule that lets email links wrap; the career button now reads "Email your introduction", with the address shown underneath.
2. axe `region`: the desktop WhatsApp button sat outside any landmark. Fixed by wrapping the shortcuts in a labelled `<aside>`.

### Not yet verified (needs the real environment)
- A real form submission arriving in the Gmail inbox (needs the Web3Forms key).
- WhatsApp opening the app on a real Android phone and iPhone.
- The bar's behaviour above the on-screen keyboard on real devices (emulated only).

---

## Phase 1: Audit (complete)

- ✅ Reviewed the live site: it is this repository's Astro build, behind Cloudflare, with **forms in demo mode in production**
- ✅ Reviewed the full codebase (86 tracked files); baseline: `astro check` 0/0/4 hints, Vitest 18/18, 15 pages, 699 links OK
- ✅ **Email changed** from `enquiry@aayushhomehealth.com` to `aayushhomehealthsolutions@gmail.com` (single source `src/config/site.ts`; verified on all 15 pages, including mailto links, JSON-LD and form fallback text)
- ✅ `PROJECT_ROADMAP.md` and `PROJECT_PROGRESS.md` created

---

## Owner inputs

| # | Item | Status |
|---|---|---|
| D1 | WhatsApp number | ✅ +91 70130 50751 |
| D2 | Hosting | ✅ Cloudflare Pages → Web3Forms (integration done). ⏳ **Access key needed**: set `PUBLIC_WEB3FORMS_ACCESS_KEY` |
| D3 | Primary phone | ✅ +91 70130 50751 |
| D4 | Full service list and what Home Nursing includes | ✅ List received (13 services, handwritten brief). ⏳ Confirm each new service's scope/description (see `docs/CONTENT-AUDIT.md`) |
| D5 | Testimonial publishing permission | ⏳ |
| D6 | Confirm "background verified", the 24–48 h start and pricing FAQ answers, "How it works" | ⏳ |
| D7 | Real photos (team, high-resolution founder), registrations/credentials | ⏳ |
| D8 | Analytics preference | ⏳ (recommend Cloudflare Web Analytics, cookie-free) |
| D9 | Google Business Profile link, social profiles, localities served | ⏳ |
| D10 | Keep the old `enquiry@` mailbox forwarding? | ⏳ |

## Housekeeping
- Earlier uncommitted work (blog draft handling: `src/content/blog.ts` + 8 files) is still uncommitted alongside the Phase 1–2 changes; recommend committing it as a separate baseline commit first.
- `netlify.toml` is unused on Cloudflare Pages. It is kept for now in case of a host change; it can be deleted on request.

## Change log

| Date | Change | Key files |
|---|---|---|
| 27 Nov 2026 | Email replaced site-wide | `src/config/site.ts`, `docs/CONTENT-AUDIT.md` |
| 28 Nov 2026 | Audit completed; roadmap and progress tracker created | `PROJECT_ROADMAP.md`, `PROJECT_PROGRESS.md` |
| 28 Nov 2026 | Phase 2: Web3Forms delivery, WhatsApp, ContactDock, address fix, responsive images, logo/brand assets, cleanup, QA tooling | `src/config/site.ts`, `src/lib/submit.ts`, `src/components/layout/ContactDock.astro`, `src/components/ui/{Media,Logo,Seo,Icon}.astro`, `src/assets/images/`, `scripts/generate-brand-assets.mjs`, `tests/lib.test.ts`, `qa/` |
| 28 Nov 2026 | Career page redesigned from the owner's Nursing Aid brief (hero, featured role with requirements and apply actions, benefits, eligibility checklist, apply steps, applicant FAQs, CTA); home "Join our team" turned into a "We are hiring" card. Both fall back to the general message when `career.openings` is empty | `src/pages/career.astro`, `src/pages/index.astro`, `src/content/{pages,faqs}.ts`, `src/lib/types.ts`, `src/components/sections/{CtaBand,FaqList}.astro`, `src/components/ui/Icon.astro`, `src/styles/global.css`, `tests/content.test.ts` |
| 28 Nov 2026 | Services redesign from the owner's 13-service brief: new `/services` page (hero, group shortcuts, grouped catalogue with sticky group headings, "Not sure where to start?" finder, "The Aayush standard", How it works, CTA); reusable `ServiceTile`; home "Our services" turned into a lead card + six featured cards + "Explore all 13 services"; service pages show group, related services and an icon panel when no photo; two-column Services dropdown, featured-only footer list, services FAQ derived from the list. New copy flagged `verified: false` | `src/content/services.ts`, `src/lib/types.ts`, `src/components/ui/{ServiceTile,Icon}.astro`, `src/components/sections/{ServiceHighlights,ServiceCatalogue,CareFinder,ServicePromise}.astro` (replace `ServiceCards`), `src/components/layout/{PageHeader,Header,Footer}.astro`, `src/pages/{index,services/index,services/[slug]}.astro`, `src/content/{pages,faqs}.ts`, `src/styles/{tokens,global}.css`, `tests/content.test.ts`, `qa/functional.py` |
| 28 Nov 2026 | All draft badges and placeholder labels removed site-wide at the owner's request: `DraftBadge` component, `showDraftFlags` / `PUBLIC_SHOW_DRAFT_FLAGS`, `verified` flags on services and FAQs, the Privacy Policy draft notice and "[Placeholder]" notes (its placeholder-only Sharing/Retention sections removed). Unconfirmed content is tracked only in `docs/CONTENT-AUDIT.md` | `src/components/ui/DraftBadge.astro` (deleted), `src/components/sections/{CareFinder,FaqList,Process}.astro`, `src/pages/{index,career,contact,privacy-policy,services/index,services/[slug]}.astro`, `src/content/{services,faqs}.ts`, `src/config/site.ts`, `src/env.d.ts`, `.env.example`, `src/styles/*`, `tests/content.test.ts` |
| 28 Nov 2026 | About page redesign and home "A Message from Our Founder": team gallery reviewed (7 of 10 photos + the clip used; watermarks cropped; renamed; clip 1.7 MB → 380 KB, silent, lazy); new header collage, story facts, "Moments of care" bento gallery with quotes and a clip, Taittiriya Upanishad band, founder pull quote and Navy badge, restyled ethos cards; home About block replaced by the founder message. Founder message wording awaits the founder's approval (`docs/CONTENT-AUDIT.md`) | `src/pages/{about,index}.astro`, `src/components/sections/{FounderMessage,CareGallery}.astro`, `src/components/ui/{QuoteBlock,VideoCard,Media,Icon}.astro`, `src/content/pages.ts`, `src/lib/types.ts`, `src/assets/gallery/`, `docs/media-originals/`, `tests/content.test.ts` |
| 28 Nov 2026 | Home hero redesign: owner's photo renamed `nurse-helping-elderly-woman-rise-from-wheelchair.jpg` and cropped per breakpoint (4:3 phone/desktop, 16:10 tablet, subjects kept in frame); headline with gradient accent and drawn underline, shorter lead, Enquiry + Explore services CTAs, 24/7 call line; tilted plate, tagline chip and service-count card; CSS-only entrance motion (photo unveiled, never faded, for LCP), off for reduced motion. `Media` now also offers a photo's own width when it falls between the 480/800/1200/1600 steps | `src/components/sections/Hero.astro`, `src/components/ui/Media.astro`, `src/content/pages.ts`, `src/assets/images/`, `docs/CONTENT-AUDIT.md` |
| 28 Nov 2026 | Why Aayush redesign: `/why-aayush` now has a split header (team photo, verified-staff chip, 24/7 card, Enquiry + Services CTAs), six tone-coded strength cards with verified "proof" chips, a "Timely help, from the very first call" band (call + WhatsApp), a founder card plus two verbatim family quotes, How it works and the CTA. The home "Why Aayush" section is now a two-column pitch: 24/7 card, "Why choose Aayush?" button and call link beside the four `featured` reasons. Removed the soldier stock photo (`service-led-ethos.webp`). New copy logged in `docs/CONTENT-AUDIT.md` | `src/pages/{why-aayush,index}.astro`, `src/components/sections/{WhyGrid,WhyHighlights}.astro`, `src/content/pages.ts`, `src/lib/types.ts`, `tests/content.test.ts` |
| 28 Nov 2026 | Blog and FAQs redesign. **Blog:** typed topics, cover photos and related services in the post front matter (validated at build), computed reading time; `/blog` with a featured lead story, a topic filter (`?topic=` links, JS-only, hidden without JS) and a FAQ strip; new `PostCard` (photo, topic badge, date, reading time) on home (now 3 posts), `/blog` and related articles; article page with lifted cover photo, byline, numbered contents (collapsible on phones, sticky on desktop with section highlighting), reading typography, "not medical advice" note, "Care that can help" service tiles, related articles and `BlogPosting` JSON-LD. Four new practical guides; the two existing posts tightened (duplicated COVID sections shortened, off-list nursing tasks replaced with links to real services). **FAQs:** 27 questions in six topics, header search (accent/apostrophe-insensitive, live result count, empty state with call/WhatsApp), topic shortcuts (grid on phones, sticky sidebar with active topic on desktop), deep links (`/faqs#faq-…` opens the question), smooth CSS expand/collapse, steps and links in answers, `FAQPage` JSON-LD. New copy logged in `docs/CONTENT-AUDIT.md`. QA: Vitest 42/42, functional 74/74, axe 0 violations (17 pages × 2), no overflow at 320–1440 px | `src/content/{blog,blog-categories,faqs}.ts`, `src/content.config.ts`, `src/content/blog/*.md`, `src/components/ui/{PostCard,Icon}.astro`, `src/components/sections/{BlogCards,FaqList}.astro`, `src/pages/{blog/index,blog/[slug],faqs,index}.astro`, `src/lib/{format,types}.ts`, `tests/*.test.ts`, `qa/{functional,axe,screenshots}.py` |
| 28 Nov 2026 | Contact & booking redesign + Web3Forms: `/contact` rebuilt (fact chips, gradient form card, navy "Prefer to talk?" card, "What happens next" steps, privacy note). One form with an enquiry/booking switch (native radios), numbered sections, refined fields (leading icons, focus rings, error icons, Today/Tomorrow date picks, notes counter). New `ServicePicker`: accessible select-only combobox over a hidden native select, services grouped and colour-coded by category, popover on desktop (flips/scrolls clear of the sticky header), bottom sheet on phones. Submission: loading state, duplicate-submit guard, 20 s timeout, 429 handling, success panel with summary, error with kept details and "Try again". Web3Forms: `PUBLIC_WEB3FORMS_ACCESS_KEY` (old name still read), readable payload (`buildPayload`), `botcheck` honeypot; email made optional. QA: Vitest 46/46, functional 101/101, axe 0 violations (incl. open picker), no overflow 320–1440 px. **Live Web3Forms submission not yet verified: access key needed (D2)** | `src/components/forms/{ContactForms,ServicePicker,Field}.astro`, `src/pages/{contact,privacy-policy}.astro`, `src/lib/{submit,validation,format}.ts`, `src/config/site.ts`, `src/env.d.ts`, `src/styles/tokens.css`, `src/content/faqs.ts`, `.env.example`, `tests/lib.test.ts`, `qa/{functional.py,run.sh}`, `README.md`, `CLAUDE.md`, `docs/CONTENT-AUDIT.md` |
| 28 Nov 2026 | **Full-site consistency audit** (every page at 390 px and 1440 px, plus a tap-target audit). Fixed: section eyebrows rendered grey and oversized inside `SectionHead` (a `.section-head p` rule overrode `.eyebrow`); "How it works" now uses the shared centred heading with an eyebrow and its own labelled section; the testimonial slider no longer shows the same review twice when every card fits (plain row; it still loops when cards overflow); /about no longer repeats two gallery photos in its header (inset removed, all 7 team photos used once, unit-tested); wrong alt texts on four stock photos (wheelchair described as a walker, a note-taking nurse as holding hands, a notebook as a tablet); office section heading now sits beside the single office card, with a "Get directions" link; the footer's single office address moved under "Recent articles"; every interactive element is at least 44 px tall on phones and tablets (footer lists, breadcrumbs, arrow links, site map). Consistency: "reachable 24/7 by phone, WhatsApp and email" everywhere; the FAQ "How do I arrange care?" uses the "How it works" steps; blog wording is "articles" throughout; the two older posts use sentence-case headings and colon titles like the newer ones; the site map is built from the navigation config; breadcrumb styles live in one place (`global.css`). Copy: light copy-edits of the carried-over About, Home Nursing, "Home Away From Home" and career text; the contact page's demo notice and a Privacy Policy line rewritten for visitors (all logged in `docs/CONTENT-AUDIT.md`). Cleanup: unused `founder-portrait-old.png` moved to `docs/media-originals/`. QA: `astro check` 0/0/0, Vitest 47/47, 31 pages and all links pass, functional 101/101, axe 0 violations, no overflow at 320–1440 px. **Note:** a local `.env` now holds the Web3Forms key, so a plain `sh qa/run.sh` builds `dist/` in live mode and its demo-mode tests fail; run it as `PUBLIC_WEB3FORMS_ACCESS_KEY= PYTHON=python sh qa/run.sh` | `src/styles/global.css`, `src/components/sections/{Process,OfficeCards,TestimonialSlider,ServiceHighlights,ServicePromise,FeatureBand,CtaBand}.astro`, `src/components/layout/{Footer,PageHeader}.astro`, `src/pages/{index,about,contact,career,why-aayush,site-map,privacy-policy,services/index,services/[slug],blog/[slug]}.astro`, `src/content/{pages,services,faqs}.ts`, `src/content/blog/{a-home-away-from-home,in-home-care-the-best-choice-for-your-beloved}.md`, `tests/content.test.ts`, `docs/{CONTENT-AUDIT.md,media-originals/README.md}` |
| 28 Nov 2026 | **Pre-production codebase audit and cleanup** (no visible change: all 48 page screenshots at 1440/768/390 px are pixel-identical to the pre-cleanup build, and the built HTML differs only by one removed script tag). Removed the unused `prefetch` setting in `astro.config.mjs`, which shipped a 2.5 KB prefetch script to every page that never ran (no link opts in), so JS fell from 16.7 KB to 14.2 KB. Security: `npm audit fix` within the existing version ranges (`package.json` unchanged; Astro 7.3.8 → 7.4.13, zod, undici, fast-uri patched) took `npm audit` from 4 findings (2 high, 2 moderate; all build-time only) to 0; Astro 7.4 also stops emitting unused full-size image copies (245 → 229 output files); structured data now goes through `jsonLd()` (`src/lib/format.ts`), which escapes `<` so content can never close its script tag (unit-tested); the local QA server (`qa/serve.mjs`) refuses paths outside the site folder and serves MP4 correctly. `qa/run.sh` builds its demo-mode site with the form variables blanked, so a key in a local `.env` no longer breaks the demo-mode tests. `.vscode/` (personal editor settings) is git-ignored. Docs: README brought up to date (Cloudflare Pages deployment section, `git clone` + `npm ci` setup, current architecture tree, blog front matter incl. the required `category`, QA usage, current test results), and stale lines fixed in `CLAUDE.md`, `docs/CONTENT-AUDIT.md` and the images README. Audited and kept on purpose: every export, icon, CSS class and dependency is in use; `netlify.toml` (kept by decision), the planning docs, `docs/design-references/` (cited as content sources), `docs/media-originals/`, the full spacing-token scale. Checks: clean `npm ci` + `npm run verify` in a fresh copy (0/0/0, Vitest 48/48, 31 pages, 2,825 links), functional 101/101, axe 0 violations, no overflow or console errors at 320–1440 px. | `astro.config.mjs`, `package-lock.json`, `src/lib/format.ts`, `src/components/ui/Seo.astro`, `src/pages/{faqs,blog/[slug]}.astro`, `tests/lib.test.ts`, `qa/{serve.mjs,run.sh}`, `.gitignore`, `README.md`, `CLAUDE.md`, `docs/CONTENT-AUDIT.md`, `src/assets/images/README.md` |
| 28 Nov 2026 | Footer redesign (mobile first): brand block with tagline, short verified description and a "reachable 24/7" pill; Services and Company/Help link groups side by side on phones; "Get in touch" with whole-row tappable call/WhatsApp/email links and the office address; four columns on desktop, brand-gradient top rule and soft glow; "Recent articles" and the duplicate "Home" link removed to declutter; multi-office row kept. Blog: articles read "Blog by Rahul" (also in structured data); the caregiver article's team photo replaced by the owner's supplied image (renamed `health-worker-comforting-elderly-woman-at-home.jpg`, metadata stripped, 904 KB → 168 KB source; served as AVIF/WebP 480–1600 px). QA: functional 105/105, axe 0 violations, no overflow at 320–1440 px | `src/components/layout/Footer.astro`, `src/content.config.ts`, `src/pages/blog/[slug].astro`, `src/content/blog/looking-after-yourself-as-a-family-caregiver.md`, `src/content/blog.ts`, `qa/functional.py`, `docs/CONTENT-AUDIT.md` |
