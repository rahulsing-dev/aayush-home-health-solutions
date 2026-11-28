# Aayush Home Health Solutions — Website

A modern, fast, accessible rebuild of the Aayush Home Health Solutions website (13 home health services; Bangalore office), deployed on **Cloudflare Pages**. It was rebuilt from screenshots of the previous WordPress site, which is used **only as a content reference**, not as a design template.

> **Read this first — status of the content**
> Everything taken from the old site is kept. Anything that could not be verified is listed in [`docs/CONTENT-AUDIT.md`](docs/CONTENT-AUDIT.md) for the owner to review (nothing is flagged on the site itself). The contact forms run in **demo mode** (they do **not** deliver anything) until a Web3Forms access key is configured — see [Contact form delivery](#contact-form-delivery).
>
> The modernisation plan and its status live in [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md) and [`PROJECT_PROGRESS.md`](PROJECT_PROGRESS.md).

---

## 1. Technology stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro 7** (static output) | Ships plain HTML/CSS with ~14 KB of JavaScript in total (most pages load far less). Excellent SEO and performance, no server to run or patch, trivially cheap to host. |
| Language | **TypeScript** (strict) | Typed content and config catch mistakes (e.g. a service missing a field) at build time. |
| Styling | Plain **CSS with design tokens** (`src/styles/tokens.css`) + Astro scoped component styles | No CSS framework to learn or upgrade; re-theme by editing one file. |
| Fonts | **Fraunces** (headings) + **Inter** (body), self-hosted via `@fontsource-variable` | No third-party font requests (privacy + speed). Warm serif conveys compassion; Inter is highly readable. |
| Blog | Astro **content collection** (Markdown files) | Add a post by adding one `.md` file. No database. |
| Forms | Vanilla TS validation + **Web3Forms** delivery (pluggable endpoint) | No backend to maintain; submissions arrive by email. Any JSON endpoint (Formspree, your own API) can be swapped in. |
| Images | `astro:assets` + `sharp` (bundled with Astro) | Photos in `src/assets/images/` and `src/assets/gallery/` are resized to AVIF/WebP at several widths at build time; phones download ~95% less. |
| Contact shortcuts | `ContactDock.astro` | Sticky Call · WhatsApp · Enquire bar on phones/tablets; floating WhatsApp button on desktop. |
| Tests | **Vitest** (unit), build-output checker, Playwright + axe-core (browser QA, in `qa/`) | See [Testing](#7-testing). |
| Hosting | **Cloudflare Pages** (any static host works) | Free tier, HTTPS, automatic deploys from Git. `netlify.toml` is kept only in case of a move to Netlify. |

**No CMS or database is used**, deliberately: the site is small and content changes are infrequent. Content lives in typed files (`src/content/`) and Markdown, and the structure makes it straightforward to plug in a headless CMS later (see [Customization](#5-customization-guide)).

## 2. Architecture overview

```
src/
├─ config/
│  ├─ site.ts            ← business name, phones, email, WhatsApp, offices, social links, form settings
│  └─ navigation.ts      ← header/footer navigation (service links auto-generated)
├─ content/
│  ├─ services.ts        ← the services, their groups and the "Not sure where to start?" suggestions
│  ├─ pages.ts           ← hero, about, founder, why-Aayush, process, career
│  ├─ testimonials.ts    ← reviews (real + dev-only samples), home-slider toggle
│  ├─ faqs.ts            ← FAQ topics, questions/answers, career FAQs
│  ├─ blog.ts            ← published-post helpers (always list posts through getPublishedPosts())
│  ├─ blog-categories.ts ← blog topics
│  └─ blog/*.md          ← blog posts (Markdown + front matter)
├─ content.config.ts     ← blog front-matter schema (validated at build)
├─ components/
│  ├─ ui/                ← Icon, Logo, Media, VideoCard, SectionHead, ServiceTile, PostCard, QuoteBlock, Seo, …
│  ├─ layout/            ← Header (mobile menu + dropdown), Footer, PageHeader, ContactDock
│  ├─ sections/          ← Hero, ServiceHighlights, ServiceCatalogue, WhyGrid, Process, TestimonialSlider, FaqList, CtaBand, …
│  └─ forms/             ← Field, ServicePicker, ContactForms (enquiry/booking form, validation, submission UI)
├─ layouts/BaseLayout.astro   ← <head>/SEO, skip link, header, footer, contact dock, reveal animation
├─ lib/                  ← validation.ts, submit.ts, format.ts, paths.ts, types.ts (framework-free, unit-tested)
├─ pages/                ← one file per route (file-based routing, clean URLs)
├─ styles/               ← tokens.css (design tokens), global.css (reset, type, buttons, utilities)
└─ assets/
   ├─ images/            ← site photography (optimised automatically at build time; see its README)
   └─ gallery/           ← the team's own photos and the About page clip
public/                  ← logo SVG, favicon + touch icon, og-default.jpg (share image), _headers (security + caching)
scripts/generate-brand-assets.mjs ← rebuilds favicon / touch icon / share image from the logo
scripts/check-links.mjs  ← post-build link / SEO / structure checker
tests/                   ← Vitest unit tests
qa/                      ← Playwright + axe browser QA suite (optional, Python)
```

**Routing** is file-based. Sitemap: `/`, `/services`, `/services/[slug]`, `/about`, `/why-aayush`, `/testimonials`, `/career`, `/blog`, `/blog/[slug]`, `/faqs`, `/contact`, `/privacy-policy`, `/site-map`, plus `404`, `robots.txt`, `sitemap-index.xml`. URLs are clean (`/about`, not `/about.html`).

**Separation of concerns:** pages compose *sections*; sections read *content*; content and business facts live in `content/` and `config/`; look and feel lives in `styles/tokens.css`. Logic that matters (validation, submission) is in `lib/` with no framework dependencies so it is unit-testable.

### Pages carried over from the old site
Home (hero, services, founder message, why Aayush, testimonials, career, blog, contact) · Services (13 services, each with its own page) · About Us (with founder profile) · Why Aayush · Testimonials · Career · Blog · FAQs · Contact Us (one form with a "Make an enquiry / Book a service" switch) · footer with the Bangalore office address and recent articles · Site Map. **Added:** Privacy Policy (not yet legally reviewed), custom 404.
**Dropped on purpose:** the header search box (there was no search backend, and the brief forbids controls that do nothing) and the full-screen photographic menu overlay (replaced by an accessible dropdown/mobile menu). The two hero "slides" became a single hero plus a "A Home Away From Home" feature band (no sliders).

## 3. Local setup

**Prerequisites:** [Node.js](https://nodejs.org) **22.12 or newer** (includes npm). Check with `node -v`.

```bash
# 1. Get the code and open a terminal in the project folder
git clone <repository-url> aayush-home-health-solutions
cd aayush-home-health-solutions

# 2. Install dependencies exactly as locked (the same versions the production build uses)
npm ci

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
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | **Web3Forms access key. Setting this alone takes the form live.** Empty (and no endpoint) = demo mode. (`PUBLIC_FORM_ACCESS_KEY`, the older name, is still read as a fallback.) |
| `PUBLIC_FORM_ENDPOINT` | Optional. Overrides the endpoint (defaults to Web3Forms when an access key is set), e.g. for Formspree or your own API. |

`PUBLIC_*` values are embedded in the browser bundle by design. Never put a secret in them.

### Hosting: Cloudflare Pages
The site is deployed on Cloudflare Pages, connected to the Git repository: **a push to the deployed branch triggers a production build**, so push only when a change is ready to go live.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variables | `NODE_VERSION=22` (Node 22.12 or newer), `SITE_URL` (only if the domain differs from the default), `PUBLIC_WEB3FORMS_ACCESS_KEY` (see below) |

- Set variables under **Workers & Pages → (project) → Settings → Variables and Secrets**. `PUBLIC_*` values are read at build time, so **redeploy after changing one**.
- `public/_headers` applies security headers and long-term caching for hashed assets. Unknown URLs get the custom `404.html` automatically; no redirect rules are needed.
- HTTPS and the custom domain are managed in the Cloudflare dashboard.
- Moving to Netlify instead? `netlify.toml` already holds the equivalent settings (build `npm run build`, publish `dist`, Node 22).

Because the site is static, every content change = edit a file → commit → push → Cloudflare rebuilds and redeploys automatically.

### Contact form delivery
The site has **no server**, so form delivery needs an external endpoint. Out of the box the forms **validate and then display "Demo mode: nothing was sent"** and show the phone number/email. This is deliberate: the site never claims an enquiry was delivered unless a real endpoint accepted it.

To go live on **Cloudflare Pages** (≈10 minutes):
1. Go to [web3forms.com](https://web3forms.com), enter **aayushhomehealthsolutions@gmail.com** and request an access key (free plan: 250 submissions/month). The key arrives by email. It is a *public* key by design and is safe in browser code.
2. In the Cloudflare dashboard: **Workers & Pages → (this project) → Settings → Variables and Secrets**, under **Environment variables** (type: plain text, not a secret, because it is read at build time by `npm run build`) add `PUBLIC_WEB3FORMS_ACCESS_KEY` = the key for the **Production** environment (and Preview, if wanted).
3. **Redeploy** (Deployments → Retry deployment, or push a commit). `PUBLIC_*` values are baked in at build time, so the change only takes effect after a new build. The "demo mode" notice on `/contact` disappears automatically.
4. **Submit a real test enquiry from the live site and confirm it arrives in the inbox.** The code path was tested against a mocked endpoint (success, HTTP 500, network failure), but not against a real provider, because no credentials exist. Please also confirm spam handling and the destination address in your provider's dashboard.

The form `fetch()`es JSON to `https://api.web3forms.com/submit`: `subject, request_type, name, phone` plus `email` (the reply-to), `area, service, preferred_date, package, notes` when filled in, and `access_key, from_name` when a key is set. A non-2xx reply, a timeout (20 s) or a 2xx reply of `{"success": false}` is shown to the visitor as an error (details kept, "Try again" button, phone/WhatsApp alternatives), never as "sent". The Web3Forms honeypot (`botcheck`, a hidden checkbox) silently discards basic bot submissions without a request. For local testing put the key in `.env` (git-ignored; see `.env.example`). If you later need server-side validation, rate limiting or a database, point `PUBLIC_FORM_ENDPOINT` at your own API; the client keeps working.

## 5. Customization guide

| I want to… | Do this |
|---|---|
| **Change phone / email / office** | Edit `src/config/site.ts`. Header, footer, contact page, CTAs and structured data all update. The site currently lists the **Bangalore office only**; adding more offices to the `offices` array switches the layouts and headings to the multi-office versions. |
| **Add a service** | Append an object to `src/content/services.ts`. It gets its own page `/services/<slug>`, footer link, a card on Home/Services and an option in the contact forms. Give it a `category` (one of `serviceCategories`) and an `icon`; set `featured: true` to show it on the home page, Leave `image.src` empty to show the service icon instead of a photo. The nav dropdown, form picker and footer adapt to the number of services automatically. |
| **Edit page text** | Home/About/Why/Career copy: `src/content/pages.ts`. FAQs: `src/content/faqs.ts`. Testimonials: `src/content/testimonials.ts`. Page-specific text sits at the top of each file in `src/pages/`. |
| **Add a blog post** | Create `src/content/blog/my-post.md` with front matter: `title`, `description`, `date` and `category` (a topic id from `src/content/blog-categories.ts`), optionally `image` (`src` + `alt`), `services` (service slugs) and `featured`. The body is Markdown; an unknown topic, service or image file stops the build with a clear error. It appears on `/blog`, the home page, footer and sitemap. Set `draft: true` only if the text is still pending. |
| **Add a page** | Create `src/pages/my-page.astro` using `BaseLayout` + `PageHeader` (copy `faqs.astro`), then add it to `src/config/navigation.ts`. |
| **Add or replace a photo** | Put the file in `src/assets/images/`, then set `src` to its file name on the matching `image` object (see `src/assets/images/README.md`). Keep the `ratio`. |
| **Change the logo** | Replace `public/images/aayush-home-health-solutions.svg`, then run `node scripts/generate-brand-assets.mjs` to rebuild the favicon, touch icon and share image. |
| **Change the WhatsApp number or message** | Edit `contact.whatsapp` and `whatsappDefaultMessage` in `src/config/site.ts`. Every WhatsApp button updates. |
| **Change the colours / fonts / spacing** | Edit `src/styles/tokens.css`. Every component uses these variables. |
| **Add enquiry "packages"** | Add strings to `enquiryPackages` in `src/config/site.ts`; a Package field appears automatically. |
| **Add job openings** | Add objects to `career.openings` in `src/content/pages.ts`. |
| **Add social links** | Add `{ label, href }` to `socialLinks` in `src/config/site.ts`. |
| **Add a CMS later** | Replace the arrays/Markdown in `src/content/` with data fetched from a headless CMS (Decap, Sanity, Contentful, Storyblok…) in the same shape; components stay unchanged. |
| **Add analytics** | Add the provider's script in `BaseLayout.astro`, **and update the Privacy Policy** (it currently states no tracking is used). |

## 6. Configuration requirements before going live

1. **Form endpoint** (above). Until then, forms are demo-only.
2. **Confirm or replace the items** listed in `docs/CONTENT-AUDIT.md` (e.g. the "How it works" process, enquiry packages, career openings).
3. **Privacy Policy** has not had a legal review. Have it reviewed (India's DPDP Act, 2023) and add sections on data sharing and retention.
4. **Confirm** whether the two real testimonials may still be published (they are shown on the home page and `/testimonials`; `showTestimonialsOnHome` in `src/content/testimonials.ts` hides the home slider). **Replace or delete the five sample reviews** (`sample: true`) with real, permitted ones. They have no visible label, so they appear only in `npm run dev`; every build shows the real reviews only. Testimonial photos are shown square: use square images of at least 800 × 800 px.
5. **Own photography** (team, founder in high resolution) would strengthen trust; the current photos include stock images.
6. Set `SITE_URL` to the final domain and submit `https://<domain>/sitemap-index.xml` to Google Search Console.

## 7. Testing

```bash
npm run typecheck     # astro check (TypeScript + Astro templates): 0 errors, 0 warnings
npm test              # Vitest: validation, submission logic, path normalisation, content integrity
npm run build && npm run test:links   # every internal link/asset/anchor resolves; SEO + structure checks
npm run verify        # all of the above in one go
sh qa/run.sh          # optional browser QA (needs Python + Playwright): functional, a11y, responsive
                      # Windows: PYTHON=python sh qa/run.sh
```
`qa/run.sh` builds a demo-mode site in `dist/` (any form key in `.env` is ignored for it) and a site pointed at a fake endpoint in `dist-ep/`, serves them on ports 4321 and 4322, then runs `functional.py`, `axe.py` and `screenshots.py` (output in `qa/screenshots/`). Stop any dev server on port 4321 first.

**What was tested (and results, last full run 28 Nov 2026)**
- **Build/typecheck:** clean install (`npm ci`) → typecheck (0 errors, 0 warnings, 0 hints) → tests → build → link check all pass; 31 pages built.
- **Unit tests (48):** every validation rule, honeypot, "demo/sent/error" submission outcomes, Web3Forms payload, timeout and rate-limit handling, path normalisation, structured-data escaping, content integrity.
- **Dependencies:** `npm audit` reports 0 known vulnerabilities.
- **Link & SEO checker:** 2,825 internal links/assets resolve; every page has a title, meta description, canonical (no `.html`), one `<h1>`, no duplicate ids, no `<img>` without alt; every sitemap entry exists. (The checker was verified to fail on a deliberately broken link.)
- **Browser functional tests (101 checks, Chromium):** form validation messages, focus moves to first error, error clearing, demo-mode honesty (no network request made), honeypot, service picker (mouse, keyboard incl. Home/End/typeahead/Tab/Esc, outside click, phone bottom sheet with scroll lock), loading state and duplicate-submit guard, success panel, `{success:false}`/HTTP-500/network-failure paths with retry against a mocked endpoint, request payload, enquiry/booking switch, `#book-a-service` and `?service=` deep links, mobile menu (open, fills the viewport, scroll lock, Esc, navigation), services checks (all 13 listed in 4 groups, dropdown, group shortcuts, card "Enquire" pre-selects the service), scope checks (Bangalore the only office, removed URLs return 404), active-link state, custom 404, FAQ accordion by keyboard, `robots.txt`, `sitemap-index.xml`.
- **Accessibility (axe-core, WCAG 2.0/2.1 A + AA + best practice) across every page at desktop and mobile widths:** 0 violations.
- **Responsive/visual:** every page rendered and visually reviewed at 1440, 768 and 390 px; automated horizontal-overflow check at 320, 360, 390, 768, 1024 and 1440 px, and console-error check: none. Every interactive element is at least 44 px tall on phones.
- **Performance:** ~14 KB JavaScript in total (each page loads only what it uses); self-hosted fonts (browsers download only the Latin subset). Photos are served as responsive AVIF/WebP: a 390 px phone downloads ≈ 107 KB of images on the home page (was ≈ 1.9 MB before Phase 2).

Bugs found and fixed through this testing: canonical/active-link detection broke under static `.html` output; the mobile menu collapsed because of `backdrop-filter` on its parent; both mobile-menu icons rendered at once; process step cards misaligned; email wrapping mid-word in the contact sidebar; heading-order, landmark and accessible-name issues.

**Not tested / limitations (be aware)**
- Real form delivery to a live provider (no credentials; see above).
- Real device testing, Safari/Firefox and screen-reader (NVDA/VoiceOver) walkthroughs; testing was Chromium-based. axe-core catches only part of accessibility issues.
- Lighthouse/Core Web Vitals on the deployed site (re-check after real images are added; use `loading="lazy"`, which `Media.astro` already does, and appropriately sized files).
- Content accuracy beyond the screenshots (the Wayback archive could not be accessed).
- `Intl` date formatting and fonts are standard, but the site was not tested on very old browsers.
