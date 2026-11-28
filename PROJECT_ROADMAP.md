# Aayush Home Health Solutions: Website Modernisation Roadmap

**Last updated:** 28 November 2026
**Live site:** https://www.aayushhomehealth.com
**Progress tracker:** [`PROJECT_PROGRESS.md`](PROJECT_PROGRESS.md)
**Content verification register:** [`docs/CONTENT-AUDIT.md`](docs/CONTENT-AUDIT.md)

---

## 1. Executive summary

The audit found that **the live website is already this repository's Astro rebuild**. It is deployed behind Cloudflare and it is *not* the old WordPress site. The foundation is sound: a fast static site, typed content, tests, a link/SEO checker and good accessibility basics. This project should **evolve that codebase, not rewrite it**.

The site is losing business today for four reasons:

1. **Enquiry forms do not deliver anything.** Production runs in "demo mode". Every form a visitor submits is discarded, and the contact page publicly says *"the online forms are running in demo mode"*. This is the most damaging issue.
2. **There is no WhatsApp contact, and mobile has no persistent call button.** For Indian home-care enquiries, WhatsApp and a one-tap call are the main conversion paths. On mobile, the header phone icon is the only always-visible contact action.
3. **Mobile pages are heavy.** The homepage downloads about 2 MB of photos that display at about 600 px but are 5,000–8,000 px originals (one is 7952 × 5304 px). On a 4G phone this badly slows first load.
4. **The business address is inconsistent.** The structured data (what Google reads) and the Privacy Policy use an old address, *#4, Sai Enclave…*. The visible footer and contact page show *#14, Ground Floor, 8th Cross…*. Mismatched name, address and phone (NAP) details weaken local search ranking.

The design is clean and accessible but generic and template-like: repeated icon-in-a-circle cards, gradient blobs and an "eyebrow" label on every section. Its contact hierarchy is also desktop-first. The redesign phases address this.

---

## 2. Audit findings (Phase 1, complete)

### 2.1 Architecture and technology

| Area | Finding | Verdict |
|---|---|---|
| Framework | Astro 7.3.8, static output, `build.format: 'file'`, clean URLs | Keep |
| Language | TypeScript strict; `astro check` 0 errors / 0 warnings / 4 hints (unused imports) | Keep, clean hints |
| Styling | Plain CSS with design tokens (`src/styles/tokens.css`) and scoped component styles | Keep; refresh the tokens |
| Fonts | Fraunces + Inter, self-hosted via Fontsource | Keep |
| Content | Typed TS files (`src/content/*.ts`) and a Markdown blog collection | Keep |
| JavaScript | About 9 KB total (menu, tabs, form validation, scroll reveal) | Excellent |
| Images | Served raw from `/public/images`, with no resizing or responsive `srcset` | **Fix (critical for mobile)** |
| Forms | Client validation, honeypot, pluggable endpoint; **no endpoint configured** | **Fix (critical)** |
| Tests | Vitest 18/18 pass; link checker: 15 pages, 699 links OK; Python Playwright + axe QA suite (Playwright not installed locally) | Keep; extend |
| Hosting | `netlify.toml` and `public/_headers` exist; the live site sits behind Cloudflare. The actual host (Netlify or Cloudflare Pages) needs confirming | Confirm |
| Dependencies | 4 runtime packages, 4 dev packages; `sharp` is already installed with Astro | Lean |

**Pages:** `/`, `/services`, `/services/home-nursing`, `/about`, `/why-aayush`, `/testimonials`, `/career`, `/blog`, `/blog/[slug]` (2 posts), `/faqs`, `/contact`, `/privacy-policy`, `/site-map`, `/404`, plus `robots.txt` and `sitemap-index.xml`. These URLs are live and indexed, so **they must all be preserved**.

### 2.2 Problems found, by area

**Conversion and contact (critical)**
- The forms are in demo mode in production, so submissions are lost. There is a public "Setup note: demo mode" box on `/contact`.
- There is no WhatsApp link anywhere.
- There is no sticky mobile action bar. Below 1100 px the "Make an Enquiry" header button is hidden, leaving only a small phone icon.
- On mobile, the top bar spends 40 px showing only "We are reachable 24/7", with no tappable action.
- The form asks for 7–8 fields and makes **email and city mandatory**. Phone is the key field for care enquiries, and a required email adds friction.
- The "Make an Enquiry" and "Book a Service" tabs collect almost the same fields. The choice adds a decision without adding value.
- The homepage hero leads with a 60-word paragraph before the call-to-action buttons.

**SEO and local search**
- The LocalBusiness JSON-LD in `src/components/ui/Seo.astro` hard-codes the **old address**. The Privacy Policy also hard-codes it. Both should come from `src/config/site.ts`.
- There is no `og:image` or Twitter image, so links shared on WhatsApp or Facebook have no preview picture.
- Structured data is limited: LocalBusiness on the homepage only, with no BreadcrumbList, Service or BlogPosting markup.
- The service page title is just "Home Nursing", with no "Bangalore" or local-intent wording.
- There is no link to a Google Business Profile (`sameAs`) and no map.
- The favicon is a generic stand-in mark, not the Aayush logo.

**Performance (mobile)**
- Photos are 5462–7952 px wide: `home-away-from-home.webp` is 1.06 MB, `responsive-communication.webp` 848 KB and `carefully-selected-staff.webp` 908 KB.
- The logo SVG is 120 KB (an auto-traced vector) and loads in both the header and the footer.
- The founder portrait is a 394 × 343 PNG displayed in a 4:5 frame up to about 460 px wide, so it is upscaled and blurry, and cropped.

**Accessibility and HTML validity**
- Nested links: `Header.astro` and `Footer.astro` wrap `<Logo/>` in `<a href="/">`, and `Logo.astro` contains its own `<a>`. Nested `<a>` is invalid HTML and confuses screen readers.
- The footer logo is a dark-blue (#075096) logo on a navy (#102a43) footer, which is very low contrast. The `logo--light` variant does nothing (`filter: none`).
- Alt text on the "Why Aayush" image still says *"Placeholder representing the founder's service background"* although a real image is now used.
- The existing axe-core audit reported 0 violations at the original build. It needs re-running after these changes and real-device screen-reader checks.

**Security**
- `_headers` has the basics (nosniff, frame options, referrer, permissions) but no Content-Security-Policy and no HSTS.
- The forms have client-side validation and a honeypot only. When the endpoint goes live, the provider's spam protection and server-side checks must be enabled.

**Code quality and maintenance**
- Unused files and code: `public/images/aayush-logo.jpg` and `aayush-transparent-logo.png` are not referenced. There are unused `DraftBadge` imports in `Process.astro`, `BlogCards.astro` and `blog/[slug].astro`, an unused `Testimonials` import and a commented-out testimonials block in `index.astro`, unused `verified` fields on `hero` and `homeAwayFromHome`, a commented-out sample job in `pages.ts`, and a stray blank line before the frontmatter in `Logo.astro`.
- The README is outdated. It says *"All images are intentionally empty placeholders"*, but real images are now present.
- Uncommitted work exists: blog-draft handling (`src/content/blog.ts` and 8 modified files). It is coherent and builds cleanly, and it should be committed as the baseline before redesign work starts.

**Content that needs the owner's confirmation** (we must not invent claims)
- The FAQ answers "care can usually begin within 24–48 hours" and the pricing answer are marked `verified: true` in code, but `docs/CONTENT-AUDIT.md` still lists them as needing real answers.
- The blog article bodies were written during the rebuild. They mention *"monitoring health parameters, administering prescribed medication, wound care, post-operative support"*, which are not in the verified service description. The post dates were changed from the original 20 June 2020.
- Testimonials are hidden on the homepage (commented out) but still published on `/testimonials` and linked in the navigation. Publishing permission is still unconfirmed.
- The Privacy Policy is publicly visible as a draft with `[Placeholder]` text.
- Which phone number is primary, and which one is on WhatsApp?
- "Background verified" staff comes from the old site and needs reconfirming.

### 2.3 Strengths to preserve
- Honest content handling: unverified content is flagged and the forms never fake a "sent" message.
- A single source of truth for business details (`src/config/site.ts`), navigation and services.
- A good accessibility base: skip link, focus styles, ARIA tabs, keyboard-accessible menu, reduced-motion support.
- A very small JavaScript payload and no runtime framework.
- An automated link, SEO and structure checker that runs in `npm run verify`.

---

## 3. Recommended implementation order (and why it differs from the brief)

The brief proposed 10 phases in a fixed order. Based on the audit I recommend this sequence:

| Order | Phase | Priority | Why here |
|---|---|---|---|
| 1 | **Audit and architecture review** | Done | (complete) |
| 2 | **Critical fixes and conversion foundations** *(new)* | **Critical** | The site is losing enquiries **today**. Form delivery, WhatsApp, the mobile call bar, NAP consistency and image weight are small, low-risk changes with the largest business impact. They don't depend on the redesign. |
| 3 | UI/UX strategy and design system | High | Every later redesign phase builds on these tokens and components. |
| 4 | Homepage redesign | High | This is the most-visited page and the main landing page from search. |
| 5 | Contact, enquiry form and conversion optimisation | High | It depends on the design system and a working endpoint from Phase 2. |
| 6 | Services and individual service pages | High | **Blocked on owner input**: the confirmed list of services. |
| 7 | Trust-building (About, team, testimonials, credentials) | Medium–High | **Blocked on owner input**: photos, permissions, credentials. |
| 8 | SEO and local search | High | Content must be stable before the metadata and schema are tuned. |
| 9 | Performance, accessibility and security hardening | Medium | This is the final hardening pass; the big performance win already lands in Phase 2. |
| 10 | Testing, bug fixes and deployment | Continuous, then a release gate | Testing runs every phase; this is the final sign-off. |

**Mobile-first responsiveness (the brief's Phase 7) is not a separate phase.** It is an acceptance criterion for *every* phase (see §5), because building mobile last is the outcome the brief asks us to avoid.

The site stays deployable after every phase: each phase ends with `npm run verify` passing.

---

## 4. Phase details

### Phase 1: Website audit and architecture review ✅
- **Outcome:** This document, `PROJECT_PROGRESS.md`, and the requested email change (`enquiry@aayushhomehealth.com` → `aayushhomehealthsolutions@gmail.com`, verified on all 15 built pages, including the mailto links, JSON-LD and the form fallback text).
- **Status:** Complete.

---

### Phase 2: Critical fixes and conversion foundations ✅ (code complete, 28 Nov 2026)
**Priority:** Critical. **Status:** All tasks done and tested; see `PROJECT_PROGRESS.md`. Going live needs the Web3Forms access key and a deploy. The Netlify option below no longer applies (hosting confirmed as Cloudflare Pages).

**Current problems:** Forms in demo mode; no WhatsApp; no persistent mobile CTA; NAP mismatch; about 2 MB of images; nested links; invisible footer logo; dead files.

**Proposed improvements**
1. **Live form delivery.** Connect the existing `PUBLIC_FORM_ENDPOINT` mechanism to a real provider:
   - If the site is hosted on **Netlify**: use *Netlify Forms*. There is no third-party account, submissions appear in the Netlify dashboard, and email notifications go to the Gmail address.
   - If it is on **Cloudflare Pages**: use *Web3Forms*. It is free, delivers straight to the Gmail inbox, and its public access key is safe in client code.
   - Remove the public "demo mode" box once a real submission has been confirmed to arrive.
2. **WhatsApp click-to-chat.** Add a `whatsapp` entry to `src/config/site.ts` and a `wa.me/<number>?text=<prefilled message>` link. The message is pre-filled per page, for example *"Hi, I'd like to know about Home Nursing"*.
3. **Mobile sticky action bar** (below 1100 px): **Call · WhatsApp · Enquire**, fixed at the bottom with `env(safe-area-inset-bottom)` padding and 48 px+ tap targets. It hides on `/contact` to avoid duplication. On desktop, a single floating WhatsApp button appears at bottom-right. One component (`ContactDock.astro`) covers both.
4. **NAP consistency.** Build the JSON-LD address and the Privacy Policy address from `offices[0]` in `site.ts`, and delete the hard-coded old address.
5. **Image pipeline.** Move photos to `src/assets/images/` and render them through `astro:assets` (`<Picture>` with AVIF/WebP at about 480/800/1200 px widths and proper `sizes`). Extend `Media.astro` so content files keep their current shape. Target: under 350 KB of images on the homepage.
6. **Logo.** Fix the nested `<a>`: `Logo.astro` becomes just the image, and the callers provide the link. Add a light (white) footer variant. Optimise the 120 KB SVG, or ask for the original artwork.
7. **Cleanup.** Remove the unused imports, the commented-out blocks and the unused `verified` fields. Fix the "Placeholder…" alt text. Generate the favicon, `apple-touch-icon` and a 1200 × 630 `og:image` from the real logo, then delete the unused raster logo copies. Update the outdated README sections.

**Pages/components affected:** `config/site.ts`, `layouts/BaseLayout.astro`, `ui/Seo.astro`, `ui/Logo.astro`, `ui/Media.astro`, `layout/Header.astro`, `layout/Footer.astro`, `pages/contact.astro`, `pages/privacy-policy.astro`, `content/*.ts` (image imports), new `ui/ContactDock.astro`, `public/` assets.

**Technical notes**
- `sharp` is already installed (via Astro), so the image work needs **no new dependency**.
- WhatsApp links use `https://wa.me/91XXXXXXXXXX` (digits only), `rel="noopener"`, and an accessible label such as "Chat on WhatsApp".
- The dock must not cover form submit buttons or the footer's legal links. Add `padding-bottom` on `body` while the dock is visible.

**Expected outcome:** Every enquiry reaches the inbox. Every mobile page has a one-tap call/WhatsApp path. The homepage weighs about 80% less. Local SEO details are consistent.

**Dependencies:** Owner decisions D1–D3 (§6). The image, NAP and cleanup work can start immediately.

**Completion criteria**
- [ ] A test submission from the deployed preview arrives in `aayushhomehealthsolutions@gmail.com`
- [ ] The WhatsApp link opens a chat with the correct number on Android and iOS
- [ ] The sticky bar works at 360, 390 and 414 px, causes no horizontal scroll and covers no content
- [ ] JSON-LD address = footer address = contact page address
- [ ] Homepage image transfer under 350 KB at 390 px width
- [ ] No nested `<a>`; `astro check` shows 0 hints; `npm run verify` passes

---

### Phase 3: UI/UX strategy and design system
**Priority:** High

**Current problems:** A generic template feel (gradient blobs, an eyebrow label on every section, identical icon-circle cards in five places). The palette doesn't follow the real logo. The visual hierarchy is the same everywhere, so nothing stands out.

**Proposed direction** ("calm, competent, local"):
- **Palette** taken from the actual logo: deep blue `#075096` (primary), sky blue `#027CC9` (secondary), and the logo's red `#ED1C24` reserved for *emergency/call* emphasis only. Warm off-white backgrounds replace clinical grey. All text pairs meet WCAG AA contrast.
- **Typography:** keep Fraunces and Inter, already self-hosted, so there is no new dependency. Use a tighter type scale with a mobile body size of 17 px, and use Fraunces only for H1/H2.
- **Photography first:** fewer, larger, real images, with no icon grids where a sentence will do.
- **Components:** Button (primary / secondary / call / WhatsApp), Card (one style, not five), SectionHead (eyebrow made optional), ContactDock, InfoList, Callout, Accordion.
- **Motion:** keep the existing reveal and add only micro-interactions (button press, accordion), all respecting `prefers-reduced-motion`.

**Affected:** `styles/tokens.css`, `styles/global.css`, `components/ui/*`, plus card styles currently duplicated in `ServiceCards`, `WhyGrid`, `BlogCards`, `about.astro` and `career.astro`.

**Implementation:** Refactor the tokens first, then consolidate the duplicated card CSS into a shared `.card` pattern. Add a small internal `/styleguide` page (`noindex`, excluded from the sitemap) for review.

**Expected outcome:** A recognisable Aayush look and less CSS to maintain.

**Dependencies:** Phase 2 (logo variants).

**Completion criteria:** Tokens documented; the styleguide page renders all components at mobile and desktop widths; contrast checked; no visual regressions on existing pages.

---

### Phase 4: Homepage redesign
**Priority:** High

**Current problems:** The hero opens with a long paragraph; the CTAs sit below it; the trust strip repeats facts; there are 10 stacked sections with similar weight; the blog appears above the final CTA; the career block takes prime space.

**Proposed structure (mobile order)**
1. **Hero:** an H1 that names the service and city (*"Home nursing care in Bangalore, in the comfort of your home"*, using the verified tagline "Your Home, Our Care" as supporting text). One sentence of support, then **Call**, **WhatsApp** and **Enquire** buttons. The hero image is resized for mobile.
2. **Trust facts:** a compact single row (24/7, background-verified staff*, Bangalore-based, since February 2020). *Only if confirmed (D6).
3. **Who we help:** situations families recognise, such as elderly parents living alone or long-term conditions like Alzheimer's. These come from the verified testimonial content and the service text, written as needs rather than as medical claims.
4. **Home Nursing service:** what's included (verified highlights only) and a link to the service page.
5. **How it works:** the 4 steps (pending owner confirmation).
6. **Why Aayush:** the founder's Navy background as a story with a photo, not as a card.
7. **Testimonials:** shown only if permission is confirmed (D5).
8. **FAQ preview:** 3–4 questions, linking to `/faqs`.
9. **Final CTA**, then the footer. The blog and careers move to a lighter footer-adjacent band.

**Affected:** `pages/index.astro`, `sections/Hero`, `TrustStrip`, `ServiceCards`, `WhyGrid`, `Process`, `Testimonials`, `FaqList`, `CtaBand`.

**Expected outcome:** A visitor understands *what* (home nursing), *where* (Bangalore), *why trust us* and *how to contact* within the first screen and a half on mobile.

**Dependencies:** Phases 2 and 3; owner inputs D5 and D6 for some sections.

**Completion criteria:** At 390 × 844 the H1 and at least one contact button are visible without scrolling; LCP under 2.5 s on simulated 4G; axe shows 0 violations; no horizontal scroll from 320 px upward.

---

### Phase 5: Contact, enquiry forms and conversion optimisation
**Priority:** High

**Current problems:** Two near-identical tabbed forms; required email and city; no "how urgent" field; the desktop-first layout puts the phone details in a sidebar that drops below the form on mobile.

**Proposed improvements**
- **One form, phone-first:** Name\*, Phone\*, Area/locality\*, *Who needs care?* (Self / Parent / Spouse / Other), *When do you need care?* (Immediately / Within a week / Planning ahead), Email (optional) and a message.
- **Preserve deep links:** `/contact#book-a-service`, `/contact#make-an-enquiry` and `?service=` keep working. The "book" link preselects "Immediately/Within a week" and shows the preferred-start-date field.
- **Mobile layout:** the Call/WhatsApp cards come **first**, then the form.
- **Success state:** a "Thank you" message plus *"For urgent needs, call now"* with a tap-to-call button.
- **Embedded enquiry block:** a short version of the form (name and phone) on the service pages.
- Update `lib/validation.ts` and the unit tests for the new required-field rules.

**Affected:** `forms/ContactForms.astro` (simplified), `forms/Field.astro` (adds radio/segmented control), `lib/validation.ts`, `lib/submit.ts`, `tests/lib.test.ts`, `qa/functional.py`, `pages/contact.astro`, `pages/services/[slug].astro`.

**Expected outcome:** Fewer abandoned forms and better-qualified leads (urgency is known before the call back).

**Dependencies:** Phase 2 (live endpoint), Phase 3.

**Completion criteria:** All validation unit tests pass; functional QA passes at 390 px; a real test submission is received; the form can be completed one-handed on a phone with the correct mobile keyboards (`inputmode`).

---

### Phase 6: Services and individual service pages
**Priority:** High (content-blocked)

**Current problems:** Only one verified service (Home Nursing). The brief asks for "clear service categories", but we **must not invent services**.

**Proposed improvements**
- **When the owner confirms more services** (for example, elderly care attendants, post-hospital recovery support, or nursing procedures such as the wound care and medication assistance mentioned in the blog drafts): add each to `content/services.ts`. The architecture automatically creates the page, the navigation dropdown, the card grid and the form option.
- **If Home Nursing remains the only service:** enrich its page with *"What our nurses can help with"* (owner-confirmed tasks), *"Care arrangements"* (continued / fixed-period, male or female staff, both verified), service-specific FAQs and the embedded enquiry form.
- Each service page gets a unique title and meta description, a BreadcrumbList and Service JSON-LD, and related links.

**Affected:** `content/services.ts`, `lib/types.ts` (adds optional `tasks`, `faqs` and `arrangements` fields), `pages/services/[slug].astro`, `pages/services/index.astro`.

**Dependencies:** Owner input D4 (service list and what each includes); Phase 3.

**Completion criteria:** Every listed service is owner-verified; each page has a unique H1, title and description; the page renders and converts on mobile.

---

### Phase 7: Trust-building (About, team, testimonials, credentials)
**Priority:** Medium–High (content-blocked)

**Current problems:** The testimonials' status is unclear (hidden on the homepage, live on `/testimonials`); there is no team or nurse information; there are no registrations or credentials; the founder photo is low resolution; it is unclear whether the "Why Aayush" stock photos are representative.

**Proposed improvements**
- **About:** a founder story with a high-resolution photo, the Navy background and a timeline (February 2020 founding, all verified).
- **Team:** a section only if the owner provides real staff or nurse information and photos with consent. Otherwise describe the selection and training *process* using the verified "trained in nursing and soft skills" statement.
- **Testimonials:** with permission, restore them to the homepage. Add Google review links if a Google Business Profile exists. **Never fabricate.** If permission is refused, remove `/testimonials` and add a 301 redirect to `/about`.
- **Credentials:** a section only for verifiable items (company registration, staff qualifications).

**Affected:** `pages/about.astro`, `pages/testimonials.astro`, `pages/why-aayush.astro`, `content/pages.ts`, `sections/Testimonials.astro`.

**Dependencies:** Owner inputs D5–D7.

**Completion criteria:** Every claim on these pages is traceable to `docs/CONTENT-AUDIT.md` as verified.

---

### Phase 8: SEO and local search optimisation
**Priority:** High

**Proposed improvements**
- Change `LocalBusiness` to the more specific `MedicalBusiness` type. Build its address, phone, email and opening hours from config. Add `sameAs` for the Google Business Profile and social profiles once provided, and `geo` only if verified.
- `BreadcrumbList` on all inner pages, `Service` on service pages, `BlogPosting` on posts.
- A default `og:image` (1200 × 630 branded) and per-page overrides; `twitter:card=summary_large_image`.
- Title and description rewrite, for example: *"Home Nursing Services in Bangalore | Aayush Home Health"* and *"Home Nurse at Home in Horamavu, Bangalore | Aayush"*.
- Area pages (for example Horamavu, Kalyan Nagar, Ramamurthy Nagar) **only if** the owner confirms the service areas **and** each page has genuinely unique content. Thin "doorway" pages hurt rankings.
- Internal linking between blog posts and the service page; an author and date on posts.
- Off-site items (owner action, guided by us): claim and verify the Google Business Profile with the *identical* name, address and phone; submit the sitemap in Google Search Console.
- **Analytics** (decision D8): Cloudflare Web Analytics (cookie-free, no consent banner) for traffic. Tracking call, WhatsApp and form clicks needs an event-capable tool, which requires a Privacy Policy update.

**Affected:** `ui/Seo.astro`, `layouts/BaseLayout.astro`, all pages (titles/descriptions), `astro.config.mjs` (sitemap `lastmod`), `public/og-default.jpg`.

**Dependencies:** Content stable (Phases 4–7); owner inputs D8 and D9.

**Completion criteria:** Google Rich Results Test passes for every schema type; all pages have unique titles and descriptions; the link checker is extended to validate JSON-LD parsing.

---

### Phase 9: Performance, accessibility and security hardening
**Priority:** Medium

- **Performance:** Lighthouse mobile ≥ 95 for performance on the homepage, contact and service pages; preload the Latin subset of Inter; verify CLS is 0 with the responsive images; logo under 20 KB.
- **Accessibility:** WCAG 2.2 AA. Tap targets ≥ 44 px, visible focus, a form error summary, a real screen-reader pass (TalkBack on Android, which most of the audience uses, and VoiceOver), and zoom to 200% without loss of content.
- **Security headers** in `public/_headers`: a Content-Security-Policy (`default-src 'self'`, hashes for the two inline scripts, `connect-src` for the form endpoint, `frame-ancestors 'none'`), `Strict-Transport-Security`, and `Cross-Origin-Opener-Policy`. Run `npm audit`. Confirm form-provider spam protection (hCaptcha or Turnstile only if spam appears).
- **Privacy:** finalise the Privacy Policy against the DPDP Act 2023, with legal review recommended, and remove the draft banner.

**Completion criteria:** Lighthouse mobile ≥ 95/100/100/100 on the key pages; axe 0 violations on all pages at 390 px and 1280 px; securityheaders.com grade A; `npm audit` shows no high-severity issues.

---

### Phase 10: Testing, bug fixes and deployment
**Priority:** Continuous, then a release gate

- **Every phase:** `npm run verify` (typecheck, unit tests, build, link/SEO check).
- **Browser QA:** install Playwright for the existing Python suite (`qa/`). Run the functional, axe and responsive screenshots at **320, 360, 390, 414, 768, 1024 and 1440 px**.
- **Real devices:** at least one Android (Chrome) and one iPhone (Safari), checking calls, WhatsApp, form submission and the sticky bar.
- **Deployment:** preview deploys per branch. **Production deploys, DNS and hosting configuration changes happen only after your explicit confirmation.**
- **Post-launch:** confirm form delivery live; monitor Search Console coverage for 2 weeks.

**Completion criteria:** All automated checks green; device checklist signed off; a live test enquiry received; rollback plan documented (re-deploy the previous build from the host's deploy history).

---

## 5. Cross-cutting acceptance criteria (every phase)

**Mobile-first**
- Designed and reviewed at 390 px first, then 360, 320, tablet and desktop
- No horizontal scrolling from 320 px upward
- Tap targets ≥ 44 × 44 px, with ≥ 8 px between adjacent targets
- Body text ≥ 16 px (target 17 px), line length ≤ 75 characters
- A call or WhatsApp action is reachable in one tap from any scroll position
- Forms use the correct `type`/`inputmode`/`autocomplete`, and labels stay visible (no placeholder-only labels)

**Content integrity**
- No invented testimonials, credentials, statistics or services. Every new claim is logged in `docs/CONTENT-AUDIT.md`.

**Engineering**
- `npm run verify` passes; existing URLs keep working; no unnecessary dependencies; unused code is removed in the same change that makes it unused.

---

## 6. Decisions and inputs needed from the business owner

| # | Needed | Blocks | Default if no answer |
|---|---|---|---|
| D1 | ~~Which number is on WhatsApp?~~ ✅ **+91 70130 50751** | Phase 2 | — |
| D2 | ~~Hosting?~~ ✅ **Cloudflare Pages**, so Web3Forms. ⏳ Owner still needs to create the access key and set `PUBLIC_WEB3FORMS_ACCESS_KEY` | Phase 2 (forms) | Forms stay in demo mode |
| D3 | ~~Primary phone?~~ ✅ **+91 70130 50751** | Phase 2 | — |
| D4 | The **full list of services**, and what Home Nursing includes (for example medication, wound care, post-operative support) | Phases 6, 4 | Home Nursing only, verified text only |
| D5 | Permission to keep publishing the **two testimonials**; any Google reviews | Phases 4, 7 | Kept on `/testimonials`, hidden from the homepage (current state) |
| D6 | Confirm "**background verified** staff", the "24–48 hour start" and the pricing FAQ answers, and the 4-step "How it works" | Phases 4, 5 | Kept as currently published |
| D7 | Real photos (team, founder in high resolution) with consent; any registrations or certifications | Phase 7 | Existing photos |
| D8 | Analytics preference (cookie-free traffic-only, or event tracking with a policy update) | Phase 8 | Cloudflare Web Analytics, if hosted on Cloudflare |
| D9 | Google Business Profile link; social profiles; **localities served** | Phase 8 | No area pages, no `sameAs` |
| D10 | Will the old `enquiry@aayushhomehealth.com` mailbox stay active? Printed materials and old links may still use it | — | Recommend keeping it forwarding to Gmail |

---

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Changing URLs loses search ranking | Every existing URL is preserved; any removal gets a 301 redirect via `_redirects` |
| Invented content damages trust or creates legal exposure | Content register plus owner sign-off; draft flags until verified |
| A form provider outage loses leads | The phone and WhatsApp alternatives are always visible; the error state shows them |
| Redesign regressions | Phase-by-phase delivery; `npm run verify` plus screenshot comparison at each step |
| A Gmail address looks less official than a domain email | Owner's decision; keep domain mail forwarding (D10) |
