# Aayush Home Health Solutions — Website

A modern, fast, accessible rebuild of the Aayush Home Health Solutions website (home nursing services; Bangalore office). It was rebuilt from screenshots of the previous WordPress site, which is used **only as a content reference**, not as a design template.

> **Read this first — status of the content**
> Everything taken from the old site is kept. Anything that could not be verified is clearly marked **"Placeholder — confirm"** on the page (yellow badge) and listed in [`docs/CONTENT-AUDIT.md`](docs/CONTENT-AUDIT.md). All images are intentionally empty, labelled placeholders. The contact forms run in **demo mode** (they do **not** deliver anything) until you configure a form endpoint — see [Contact form delivery](#contact-form-delivery).

---

## 1. Technology stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro 7** (static output) | Ships plain HTML/CSS with ~9 KB of JavaScript. Excellent SEO and performance, no server to run or patch, trivially cheap to host. |
| Language | **TypeScript** (strict) | Typed content and config catch mistakes (e.g. a service missing a field) at build time. |
| Styling | Plain **CSS with design tokens** (`src/styles/tokens.css`) + Astro scoped component styles | No CSS framework to learn or upgrade; re-theme by editing one file. |
| Fonts | **Fraunces** (headings) + **Inter** (body), self-hosted via `@fontsource-variable` | No third-party font requests (privacy + speed). Warm serif conveys compassion; Inter is highly readable. |
| Blog | Astro **content collection** (Markdown files) | Add a post by adding one `.md` file. No database. |
| Forms | Vanilla TS validation + pluggable HTTP endpoint | No backend to maintain; works with Formspree, Web3Forms, Getform or your own API. |
| Tests | **Vitest** (unit), build-output checker, Playwright + axe-core (browser QA, in `qa/`) | See [Testing](#7-testing). |
| Hosting | Any static host. **Recommended: Netlify or Cloudflare Pages** | Free tiers, HTTPS, form add-ons, automatic deploys from Git. |

**No CMS or database is used**, deliberately: the site is small and content changes are infrequent. Content lives in typed files (`src/content/`) and Markdown, and the structure makes it straightforward to plug in a headless CMS later (see [Customization](#5-customization-guide)).

## 2. Architecture overview

```
src/
├─ config/
│  ├─ site.ts            ← business name, phones, email, offices, form settings, feature flags
│  └─ navigation.ts      ← header/footer navigation (service links auto-generated)
├─ content/
│  ├─ services.ts        ← the services (add one → page, nav, footer, form option all appear)
│  ├─ pages.ts           ← hero, about, founder, why-Aayush, process, testimonials, career
│  ├─ faqs.ts            ← FAQ questions/answers
│  └─ blog/*.md          ← blog posts (Markdown + front matter)
├─ components/
│  ├─ ui/                ← Icon, Logo, Media (image/placeholder), SectionHead, DraftBadge, Seo
│  ├─ layout/            ← Header (with mobile menu + dropdown), Footer, PageHeader
│  ├─ sections/          ← Hero, ServiceCards, WhyGrid, Process, Testimonials, FaqList, CtaBand, …
│  └─ forms/             ← Field, ContactForms (tabs + validation + submission UI)
├─ layouts/BaseLayout.astro   ← <head>/SEO, skip link, header, footer, reveal animation
├─ lib/                  ← validation.ts, submit.ts, format.ts, paths.ts, types.ts (framework-free, unit-tested)
├─ pages/                ← one file per route (file-based routing, clean URLs)
└─ styles/               ← tokens.css (design tokens), global.css (reset, type, buttons, utilities)
public/                  ← favicon, robots helpers, _headers (security + caching), images/
scripts/check-links.mjs  ← post-build link / SEO / structure checker
tests/                   ← Vitest unit tests
qa/                      ← Playwright + axe browser QA suite (optional, Python)
```

**Routing** is file-based. Sitemap: `/`, `/services`, `/services/[slug]`, `/about`, `/why-aayush`, `/testimonials`, `/career`, `/blog`, `/blog/[slug]`, `/faqs`, `/contact`, `/privacy-policy`, `/site-map`, plus `404`, `robots.txt`, `sitemap-index.xml`. URLs are clean (`/about`, not `/about.html`).

**Separation of concerns:** pages compose *sections*; sections read *content*; content and business facts live in `content/` and `config/`; look and feel lives in `styles/tokens.css`. Logic that matters (validation, submission) is in `lib/` with no framework dependencies so it is unit-testable.

### Pages carried over from the old site
Home (hero, services, about, why Aayush, testimonials, career, blogs, contact) · Services (Home Nursing) · About Us (with founder profile) · Why Aayush · Testimonials · Career · Blogs · FAQs · Contact Us ("Make an Enquiry" and "Book a Service" tabs) · footer with the Bangalore office address and recent posts · Site Map. **Added:** Privacy Policy (draft template), custom 404.
**Dropped on purpose:** the header search box (there was no search backend, and the brief forbids controls that do nothing) and the full-screen photographic menu overlay (replaced by an accessible dropdown/mobile menu). The two hero "slides" became a single hero plus a "A Home Away From Home" feature band (no sliders).

## 3. Local setup

**Prerequisites:** [Node.js](https://nodejs.org) **22.12 or newer** (includes npm). Check with `node -v`.

```bash
# 1. Extract the ZIP and open a terminal in the project folder
cd aayush-website

# 2. Install dependencies
npm install

# 3. (Optional) create your local environment file
cp .env.example .env        # Windows: copy .env.example .env

# 4. Start the development server (http://localhost:4321, hot reload)
npm run dev
```

## 4. Production build, deployment and operations

```bash
npm run build      # outputs the static site to ./dist
npm run preview    # serves ./dist locally at http://localhost:4321 to check the production build
npm run verify     # typecheck + unit tests + build + link/SEO check (run before every deploy)
```

The output in `dist/` is plain static files; **there is nothing to "start" in production**, so just upload/serve the folder.

### Environment variables
| Variable | Purpose |
|---|---|
| `SITE_URL` | Public URL used for canonical links, `sitemap.xml`, `robots.txt`. Default `https://www.aayushhomehealth.com`. |
| `PUBLIC_FORM_ENDPOINT` | Where the contact forms POST. Empty = demo mode. |
| `PUBLIC_FORM_ACCESS_KEY` | Optional public key sent as `access_key` (Web3Forms style). |
| `PUBLIC_SHOW_DRAFT_FLAGS` | `false` hides the yellow "placeholder" badges once content is confirmed. |

`PUBLIC_*` values are embedded in the browser bundle by design. Never put a secret in them.

### Recommended hosting: Netlify (or Cloudflare Pages)
1. Push this folder to a Git repository (GitHub/GitLab).
2. In Netlify: **Add new site → Import from Git**, choose the repo. Settings are read from `netlify.toml` (build `npm run build`, publish `dist`, Node 22).
3. Under **Site configuration → Environment variables**, add `SITE_URL` (your real domain) and, once ready, `PUBLIC_FORM_ENDPOINT` etc. Redeploy.
4. Add your custom domain under **Domain management**; HTTPS is automatic.
5. `public/_headers` already applies security headers and long-term caching for hashed assets (works on Netlify and Cloudflare Pages). For Cloudflare Pages use build command `npm run build`, output `dist`, and set `NODE_VERSION=22`.

Because the site is static, every content change = edit a file → commit → the host rebuilds and redeploys automatically.

### Contact form delivery
The site has **no server**, so form delivery needs an external endpoint. Out of the box the forms **validate and then display "Demo mode: nothing was sent"** and show the phone number/email. This is deliberate: the site never claims an enquiry was delivered unless a real endpoint accepted it.

To go live (≈10 minutes):
1. Create a free account with a form backend, e.g. **Formspree** (gives an endpoint like `https://formspree.io/f/xxxx`) or **Web3Forms** (endpoint `https://api.web3forms.com/submit` plus a public access key).
2. Set `PUBLIC_FORM_ENDPOINT` (and `PUBLIC_FORM_ACCESS_KEY` if the service needs one) in your host's environment variables and redeploy.
3. **Submit a real test enquiry from the live site and confirm it arrives in the inbox.** The code path was tested against a mocked endpoint (success, HTTP 500, network failure), but not against a real provider, because no credentials exist. Please also confirm spam handling and the destination address in your provider's dashboard.

The payload is JSON: `fullName, email, phone, city, service, date, package, message, formType, subject` (+ `access_key`). A hidden honeypot field silently discards basic bot submissions. If you later need server-side validation, rate limiting or a database, point `PUBLIC_FORM_ENDPOINT` at your own API; the client keeps working.

## 5. Customization guide

| I want to… | Do this |
|---|---|
| **Change phone / email / office** | Edit `src/config/site.ts`. Header, footer, contact page, CTAs and structured data all update. The site currently lists the **Bangalore office only**; adding more offices to the `offices` array switches the layouts and headings to the multi-office versions. |
| **Add a service** | Append an object to `src/content/services.ts`. It gets its own page `/services/<slug>`, footer link, a card on Home/Services and an option in the contact forms. The business currently offers **Home Nursing only**, so the site shows one wide service card and a plain *Services* nav link; as soon as a second service exists, the nav dropdown, a two-column card grid and the form's service picker appear automatically. |
| **Edit page text** | Home/About/Why/Testimonials/Career copy: `src/content/pages.ts`. FAQs: `src/content/faqs.ts`. Page-specific text sits at the top of each file in `src/pages/`. |
| **Add a blog post** | Create `src/content/blog/my-post.md` with front matter (`title`, `description`, `date`); the body is Markdown. It appears on `/blog`, the home page, footer and sitemap. Set `draft: true` only if the text is still pending. |
| **Add a page** | Create `src/pages/my-page.astro` using `BaseLayout` + `PageHeader` (copy `faqs.astro`), then add it to `src/config/navigation.ts`. |
| **Replace image placeholders** | Put the file in `public/images/`, then set `src` on the matching `image` object (see `public/images/README.md`). Keep the `ratio`. |
| **Use the real logo** | Put it in `public/` and set `logoSrc` in `src/components/ui/Logo.astro` (currently a stand-in wordmark/mark). |
| **Change the colours / fonts / spacing** | Edit `src/styles/tokens.css`. Every component uses these variables. |
| **Add enquiry "packages"** | Add strings to `enquiryPackages` in `src/config/site.ts`; a Package field appears automatically. |
| **Add job openings** | Add objects to `career.openings` in `src/content/pages.ts`. |
| **Add social links** | Add `{ label, href }` to `socialLinks` in `src/config/site.ts`. |
| **Hide the yellow placeholder badges** | Set `PUBLIC_SHOW_DRAFT_FLAGS=false`. |
| **Add a CMS later** | Replace the arrays/Markdown in `src/content/` with data fetched from a headless CMS (Decap, Sanity, Contentful, Storyblok…) in the same shape; components stay unchanged. |
| **Add analytics** | Add the provider's script in `BaseLayout.astro`, **and update the Privacy Policy** (it currently states no tracking is used). |

## 6. Configuration requirements before going live

1. **Form endpoint** (above). Until then, forms are demo-only.
2. **Replace placeholders** listed in `docs/CONTENT-AUDIT.md`: FAQ answers (speed of start, pricing), blog article bodies, the "How it works" process, enquiry packages, career openings, and all images.
3. **Privacy Policy** is a draft template. Have it reviewed (India's DPDP Act, 2023) and fill the bracketed items.
4. **Confirm** which phone number is primary (two appeared on the old site), whether the testimonials may still be published.
5. **Real logo** and photography. Add Open Graph/social share image if wanted.
6. Set `SITE_URL` to the final domain and submit `https://<domain>/sitemap-index.xml` to Google Search Console.

## 7. Testing

```bash
npm run typecheck     # astro check (TypeScript + Astro templates): 0 errors, 0 warnings
npm test              # Vitest: validation, submission logic, path normalisation, content integrity
npm run build && npm run test:links   # every internal link/asset/anchor resolves; SEO + structure checks
npm run verify        # all of the above in one go
sh qa/run.sh          # optional browser QA (needs Python + Playwright): functional, a11y, responsive
```

**What was tested (and results)**
- **Build/typecheck:** clean install → typecheck → tests → build → link check all pass; 15 pages built.
- **Unit tests (18):** every validation rule, honeypot, "demo/sent/error" submission outcomes, path normalisation, content integrity.
- **Link & SEO checker:** 627 internal links/assets resolve; every page has a title, meta description, canonical (no `.html`), one `<h1>`, no duplicate ids, no `<img>` without alt; every sitemap entry exists. (The checker was verified to fail on a deliberately broken link.)
- **Browser functional tests (58 checks, Chromium):** form validation messages, focus moves to first error, error clearing, demo-mode honesty (no network request made), honeypot, success/HTTP-500/network-failure paths against a mocked endpoint, request payload, tabs incl. arrow/Home keys, `#book-a-service` and `?service=` deep links, mobile menu (open, fills the viewport, scroll lock, Esc, navigation), scope checks (Home Nursing is the only service, Bangalore the only office, removed URLs return 404), active-link state, custom 404, FAQ accordion by keyboard, `robots.txt`, `sitemap-index.xml`.
- **Accessibility (axe-core, WCAG 2.0/2.1 A + AA + best practice) across all 15 pages at desktop and mobile widths:** 0 violations after fixes.
- **Responsive/visual:** every page rendered and visually reviewed at 1440, 1024, 768 and 390 px; automated check for horizontal overflow and console errors: none.
- **Performance:** whole site ≈ 0.9 MB; ~9 KB JavaScript; ~19 KB CSS (single file); self-hosted fonts (browsers download only the Latin subset); no images yet (placeholders).

Bugs found and fixed through this testing: canonical/active-link detection broke under static `.html` output; the mobile menu collapsed because of `backdrop-filter` on its parent; both mobile-menu icons rendered at once; process step cards misaligned; email wrapping mid-word in the contact sidebar; heading-order, landmark and accessible-name issues.

**Not tested / limitations (be aware)**
- Real form delivery to a live provider (no credentials; see above).
- Real device testing, Safari/Firefox and screen-reader (NVDA/VoiceOver) walkthroughs; testing was Chromium-based. axe-core catches only part of accessibility issues.
- Lighthouse/Core Web Vitals on the deployed site (re-check after real images are added; use `loading="lazy"`, which `Media.astro` already does, and appropriately sized files).
- Content accuracy beyond the screenshots (the Wayback archive could not be accessed).
- `Intl` date formatting and fonts are standard, but the site was not tested on very old browsers.
