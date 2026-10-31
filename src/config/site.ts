/**
 * Central business configuration. Everything here is VERIFIED against the previous
 * website screenshots unless explicitly marked `CONFIRM`.
 * Edit this file to change contact details, offices, and site-wide settings.
 */
import type { Office } from '../lib/types';

export const site = {
  name: 'Aayush Home Health Solutions',
  shortName: 'Aayush',
  tagline: 'Caring with compassion',
  description:
    'Aayush Home Health Solutions is a Bangalore-based home health service agency offering high quality home nursing services to elderly persons and patients in the comfort of their own homes.',
  foundedLabel: 'February 2020',
  foundedYear: 2020,
  locale: 'en-IN',
} as const;

export const contact = {
  /** First entry is shown in the header. Both numbers appeared on the previous site. */
  phones: [
    { display: '+91 70130 50751', tel: '+917013050751' },
    { display: '+91 93247 75722', tel: '+919324775722' },
  ],
  email: 'enquiry@aayushhomehealth.com',
  availability: 'We are reachable 24/7',
} as const;

export const offices: Office[] = [
  {
    id: 'bangalore',
    name: 'Bangalore Office',
    addressLines: [
      '#14, Ground Floor, 8th Cross, KSR Main Road, Sri Vijayalaxmi Layout,',
      'Near Kanaka Sarovara Lake Gate,',
      "Horamavu Agara, Horamavu,",
      'Bangalore – 560043',
    ],
    contacts: [],
  },
];

/** No social profiles could be verified from the screenshots. Add `{ label, href }` entries to show them in the footer. */
export const socialLinks: { label: string; href: string }[] = [];

/**
 * Enquiry "package" options. The previous site had a "Select a Package" field but its
 * options were not visible in the screenshots. While this list is empty the field is hidden.
 * CONFIRM with the business, then add e.g. ['Option A', 'Option B'].
 */
export const enquiryPackages: string[] = [];

/** Form delivery settings. See README → "Contact form delivery". */
export const forms = {
  endpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT ?? '').trim(),
  accessKey: (import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '').trim(),
} as const;

/** Toggle visible "placeholder / confirm" badges on unverified content. */
export const showDraftFlags = (import.meta.env.PUBLIC_SHOW_DRAFT_FLAGS ?? 'true') !== 'false';

/** Telephone helper: "+91 70130 50751" -> "tel:+917013050751". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
