/**
 * Framework-free form validation. Used by the browser script and by unit tests.
 * Server-side validation is NOT provided by this static site; if you add a backend,
 * re-validate there as well (never trust client-side checks alone).
 */

export type FormKind = 'enquiry' | 'booking';

export interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  date: string; // yyyy-mm-dd or ''
  package: string;
  message: string;
  /** Honeypot: must stay empty. Bots tend to fill every field. */
  website: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export interface ValidationOptions {
  kind: FormKind;
  allowedServices: string[];
  /** Required only when the package field is shown. */
  allowedPackages?: string[];
  /** Injectable "today" (yyyy-mm-dd) to keep tests deterministic. */
  today?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MESSAGE_MAX = 1000;

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Accepts common Indian formats: 9876543210, +91 98765 43210, 080-1234 5678 … (10–13 digits). */
export function isValidPhone(value: string): boolean {
  if (!/^\+?[0-9\s\-()]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export function validateForm(values: FormValues, opts: ValidationOptions): FormErrors {
  const errors: FormErrors = {};
  const today = opts.today ?? todayISO();
  const v = (k: keyof FormValues) => (values[k] ?? '').trim();

  if (v('fullName').length < 2) errors.fullName = 'Please enter your full name.';
  else if (v('fullName').length > 100) errors.fullName = 'Name is too long (100 characters maximum).';

  if (!v('email')) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(v('email'))) errors.email = 'Please enter a valid email address, such as name@example.com.';

  if (!v('phone')) errors.phone = 'Please enter a phone number we can reach you on.';
  else if (!isValidPhone(v('phone'))) errors.phone = 'Please enter a valid phone number (10 to 13 digits).';

  if (v('city').length < 2) errors.city = 'Please enter your city.';

  if (!v('service')) errors.service = 'Please choose the service you need.';
  else if (!opts.allowedServices.includes(v('service'))) errors.service = 'Please choose a service from the list.';

  if (v('date')) {
    if (!isValidISODate(v('date'))) errors.date = 'Please enter a valid date.';
    else if (v('date') < today) errors.date = 'Please choose today or a future date.';
  } else if (opts.kind === 'booking') {
    errors.date = 'Please choose your preferred start date.';
  }

  if (opts.allowedPackages && opts.allowedPackages.length > 0 && v('package') && !opts.allowedPackages.includes(v('package'))) {
    errors.package = 'Please choose a package from the list.';
  }

  if (v('message').length > MESSAGE_MAX) errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;

  return errors;
}

/** True when the honeypot was filled in — treat as spam and drop silently. */
export const isSpam = (values: FormValues) => (values.website ?? '').trim() !== '';
