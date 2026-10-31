# Content audit: what is verified and what needs confirmation

**Verified** = taken from the screenshots of the previous website. **Placeholder / draft** = written for this rebuild or missing from the screenshots; marked with a yellow badge on the site (unless `PUBLIC_SHOW_DRAFT_FLAGS=false`).

## Verified (carried over)
- Company name, tagline ("Caring with compassion"), Bangalore base, founding in February 2020.
- Hero messages ("Your Home, Our Care"; "A Home Away From Home") and their body text.
- Service description for Home Nursing (the business's only service).
- About text, Founder & CEO profile (Santosh Kumar Singh).
- "Why Aayush" three points; Career intro text; Contact form fields (name, email, city, phone, date, services required, description).
- Two testimonials (Kanchana Seshadri, Pankaj Kumar) with one spelling fix: "decease" → "disease".
- Two blog titles/dates (20 June 2020) and their opening lines.
- Phone numbers +91 7013050751 (header) and +91 9324775722 (footer), enquiry@aayushhomehealth.com, "We are reachable 24/7".
- Office address: Bangalore (the only office).
- FAQ answers #1–5, built only from facts above.

## Placeholder / draft: needs the business's input
| Where | What is needed |
|---|---|
| FAQs "How quickly can care start?" and "How are charges determined?" | Real answers. |
| "How it works" (Home, service pages, Why Aayush) | Draft 4-step journey; confirm or replace the real onboarding process. |
| Blog post bodies | Only opening lines were visible. Paste the original full articles (restore from the Wayback archive), then set `draft: false`. |
| Enquiry "Select a Package" | Package names were not visible; field is hidden until `enquiryPackages` is filled. |
| "Book a Service" tab | Old tab content was not captured; implemented as a booking-request form (preferred start date required). Confirm the intended workflow. |
| Career → Current openings | No openings were visible; page shows an empty state with an email link. |
| Privacy Policy | Draft template; bracketed items + legal review required. |
| Social links | None verified; footer shows none. |
| Logo | Stand-in mark and wordmark; supply the original artwork. |
| All photography | Intentionally empty placeholders (see `public/images/README.md`). The old site's "Promoter background" photo and testimonial photo need replacing/consent. |

## Decisions to confirm
1. Which phone number is primary? (Header showed 7013050751; footer 9324775722.) The header uses the first entry in `contact.phones`.
2. May the testimonials continue to be published? Names are shown as on the old site; the label "Client family" was added from the testimonials' own wording.
3. Statements such as "background verified" and "affordable cost" come from the old site's own text; ensure they remain accurate.
