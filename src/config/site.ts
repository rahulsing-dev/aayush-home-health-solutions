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
  /** The first entry is the primary number (header, mobile action bar, structured data). Confirmed by the owner, Nov 2026. */
  phones: [
    { display: '+91 70130 50751', tel: '+917013050751' },
    { display: '+91 93247 75722', tel: '+919324775722' },
  ],
  email: 'aayushhomehealthsolutions@gmail.com',
  availability: 'We are reachable 24/7',
  /** WhatsApp number (digits only, with country code). Confirmed by the owner, Nov 2026. */
  whatsapp: { display: '+91 70130 50751', number: '917013050751' },
} as const;

/** Default message pre-filled when a visitor taps a WhatsApp button. */
export const whatsappDefaultMessage = 'Hello Aayush Home Health, I would like to know more about home nursing care.';

/** WhatsApp click-to-chat link (opens the app on phones, WhatsApp Web on desktop). */
export const whatsappHref = (message: string = whatsappDefaultMessage) =>
  `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const offices: Office[] = [
  {
    id: 'bangalore',
    name: 'Bangalore Office',
    /** How the address is displayed, line by line. The last line holds the city and PIN code. */
    addressLines: [
      '#14, Ground Floor, 8th Cross, KSR Main Road, Sri Vijayalaxmi Layout,',
      'Near Kanaka Sarovara Lake Gate,',
      'Horamavu Agara, Horamavu,',
      'Bangalore – 560043',
    ],
    locality: 'Bangalore',
    region: 'Karnataka',
    postalCode: '560043',
    contacts: [],
  },
];

/** Street part of an address (every display line except the final "City – PIN" line), as one string. */
export const streetAddress = (office: Office) =>
  office.addressLines.slice(0, -1).map((l) => l.trim().replace(/,$/, '')).join(', ');

/** Full address on one line, e.g. for the Privacy Policy. */
export const addressOneLine = (office: Office) => office.addressLines.map((l) => l.trim().replace(/,$/, '')).join(', ');

/** No social profiles could be verified from the screenshots. Add `{ label, href }` entries to show them in the footer. */
export const socialLinks: { label: string; href: string }[] = [];

/**
 * Enquiry "package" options. The previous site had a "Select a Package" field but its
 * options were not visible in the screenshots. While this list is empty the field is hidden.
 * CONFIRM with the business, then add e.g. ['Option A', 'Option B'].
 */
export const enquiryPackages: string[] = [];

/** Web3Forms (https://web3forms.com) delivers form submissions by email; it works on any static host. */
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Form delivery settings. See README → "Contact form delivery".
 * Setting only PUBLIC_WEB3FORMS_ACCESS_KEY (a Web3Forms access key) is enough to go live.
 * PUBLIC_FORM_ACCESS_KEY is still read as an older name for the same key.
 * PUBLIC_FORM_ENDPOINT overrides the endpoint for a different provider or your own API.
 * With neither a key nor an endpoint, the form runs in demo mode and says clearly that nothing was sent.
 */
const accessKey = (import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? '').trim() || (import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '').trim();
export const forms = {
  endpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT ?? '').trim() || (accessKey ? WEB3FORMS_ENDPOINT : ''),
  accessKey,
} as const;

/** Telephone helper: "+91 70130 50751" -> "tel:+917013050751". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
