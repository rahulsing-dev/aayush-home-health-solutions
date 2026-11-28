import { describe, expect, it, vi } from 'vitest';
import { isSpam, isValidISODate, isValidPhone, validateForm, type FormValues } from '../src/lib/validation';
import { buildPayload, submitForm } from '../src/lib/submit';
import { jsonLd, readingMinutes, slugify } from '../src/lib/format';

const base: FormValues = {
  fullName: 'Asha Rao', email: 'asha@example.com', phone: '+91 98765 43210', city: 'Bangalore',
  service: 'Home Nursing', date: '', package: '', message: '', botcheck: '',
};
const opts = { kind: 'enquiry' as const, allowedServices: ['Home Nursing'], today: '2026-10-09' };

describe('validateForm', () => {
  it('accepts a valid enquiry', () => expect(validateForm(base, opts)).toEqual({}));
  it('reports every missing required field', () => {
    const e = validateForm({ ...base, fullName: '', email: '', phone: '', city: '', service: '' }, opts);
    expect(Object.keys(e).sort()).toEqual(['city', 'fullName', 'phone', 'service']);
  });
  it('treats email as optional but checks it when given', () => {
    expect(validateForm({ ...base, email: '' }, opts).email).toBeUndefined();
    expect(validateForm({ ...base, email: 'nope@' }, opts).email).toBeTruthy();
  });
  it('rejects malformed email', () => expect(validateForm({ ...base, email: 'nope@' }, opts).email).toBeTruthy());
  it('rejects unknown service values', () => expect(validateForm({ ...base, service: 'Hacked' }, opts).service).toBeTruthy());
  it('rejects past dates but allows today', () => {
    expect(validateForm({ ...base, date: '2026-10-08' }, opts).date).toBeTruthy();
    expect(validateForm({ ...base, date: '2026-10-09' }, opts).date).toBeUndefined();
  });
  it('requires a date for bookings only', () => {
    expect(validateForm(base, { ...opts, kind: 'booking' }).date).toBeTruthy();
    expect(validateForm({ ...base, date: '2026-11-01' }, { ...opts, kind: 'booking' }).date).toBeUndefined();
  });
  it('limits message length', () => expect(validateForm({ ...base, message: 'x'.repeat(1001) }, opts).message).toBeTruthy());
  it('validates packages only when configured', () => {
    expect(validateForm({ ...base, package: 'zzz' }, opts).package).toBeUndefined();
    expect(validateForm({ ...base, package: 'zzz' }, { ...opts, allowedPackages: ['A'] }).package).toBeTruthy();
  });
});

describe('helpers', () => {
  it('validates phones', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('+91 98765-43210')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('98765abc10')).toBe(false);
  });
  it('validates ISO dates', () => {
    expect(isValidISODate('2026-02-30')).toBe(false);
    expect(isValidISODate('2026-02-28')).toBe(true);
  });
  it('detects honeypot spam (Web3Forms botcheck)', () => {
    expect(isSpam({ ...base, botcheck: 'on' })).toBe(true);
    expect(isSpam(base)).toBe(false);
  });
});

describe('submitForm', () => {
  it('is demo mode without an endpoint and never calls fetch', async () => {
    const f = vi.fn();
    expect(await submitForm('enquiry', base, { endpoint: '', fetchImpl: f as never })).toEqual({ status: 'demo' });
    expect(f).not.toHaveBeenCalled();
  });
  it('reports sent on 2xx and strips the honeypot', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const r = await submitForm('booking', base, { endpoint: 'https://x.test', accessKey: 'k', fetchImpl: f as never });
    expect(r.status).toBe('sent');
    const body = JSON.parse(f.mock.calls[0][1].body);
    expect(body.access_key).toBe('k');
    expect(body.request_type).toBe('Service booking');
    expect('botcheck' in body).toBe(false);
  });
  it('reports errors for non-2xx and network failures', async () => {
    const bad = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    expect((await submitForm('enquiry', base, { endpoint: 'https://x.test', fetchImpl: bad as never })).status).toBe('error');
    const down = vi.fn().mockRejectedValue(new Error('offline'));
    expect((await submitForm('enquiry', base, { endpoint: 'https://x.test', fetchImpl: down as never })).status).toBe('error');
  });
});

import { cleanPath } from '../src/lib/paths';
describe('cleanPath', () => {
  it('strips .html, index and trailing slashes', () => {
    expect(cleanPath('/index.html')).toBe('/');
    expect(cleanPath('/')).toBe('/');
    expect(cleanPath('/about.html')).toBe('/about');
    expect(cleanPath('/services/home-nursing.html')).toBe('/services/home-nursing');
    expect(cleanPath('/blog/')).toBe('/blog');
    expect(cleanPath('/blog/index.html')).toBe('/blog');
  });
});

describe('submitForm provider responses', () => {
  it('treats a 2xx reply with { success: false } as an error, never as sent', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ success: false, message: 'Invalid key' }) });
    expect((await submitForm('enquiry', base, { endpoint: 'https://x.test', accessKey: 'k', fetchImpl: f as never })).status).toBe('error');
  });
  it('reports sent for { success: true } and for non-JSON 2xx bodies', async () => {
    const ok = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
    expect((await submitForm('enquiry', base, { endpoint: 'https://x.test', fetchImpl: ok as never })).status).toBe('sent');
    const html = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.reject(new SyntaxError('not json')) });
    expect((await submitForm('enquiry', base, { endpoint: 'https://x.test', fetchImpl: html as never })).status).toBe('sent');
  });
  it('labels Web3Forms notifications when an access key is used', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await submitForm('enquiry', base, { endpoint: 'https://x.test', accessKey: 'k', fetchImpl: f as never });
    expect(JSON.parse(f.mock.calls[0][1].body).from_name).toBe('Aayush Home Health website');
  });
  it('treats 429 (rate limited) and timeouts as errors', async () => {
    const limited = vi.fn().mockResolvedValue({ ok: false, status: 429 });
    const r = await submitForm('enquiry', base, { endpoint: 'https://x.test', accessKey: 'k', fetchImpl: limited as never });
    expect(r.status === 'error' && r.message).toMatch(/wait a minute/);
    const hang = vi.fn((_u: string, init: RequestInit) => new Promise((_, reject) => init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })))));
    const t = await submitForm('enquiry', base, { endpoint: 'https://x.test', timeoutMs: 20, fetchImpl: hang as never });
    expect(t.status === 'error' && t.message).toMatch(/too long/);
  });
});

describe('buildPayload (Web3Forms body)', () => {
  it('uses readable keys, a descriptive subject, and leaves out empty optional fields', () => {
    const p = buildPayload('booking', { ...base, email: '', date: '2026-11-30', message: 'Mornings please' }, 'k');
    expect(p).toEqual({
      subject: 'Booking request: Home Nursing – Asha Rao',
      request_type: 'Service booking',
      name: 'Asha Rao',
      phone: '+91 98765 43210',
      area: 'Bangalore',
      service: 'Home Nursing',
      preferred_date: '30 November 2026 (Monday)',
      notes: 'Mornings please',
      access_key: 'k',
      from_name: 'Aayush Home Health website',
    });
  });
  it('passes the email through as the reply-to and omits Web3Forms keys without an access key', () => {
    const p = buildPayload('enquiry', base);
    expect(p.email).toBe('asha@example.com');
    expect(p.request_type).toBe('General enquiry');
    expect('access_key' in p || 'from_name' in p).toBe(false);
  });
});

import { addressOneLine, contact, offices, streetAddress, whatsappHref } from '../src/config/site';
describe('business details', () => {
  it('builds a WhatsApp click-to-chat link for the configured number with an encoded message', () => {
    expect(contact.whatsapp.number).toMatch(/^91\d{10}$/);
    expect(whatsappHref('Hi & hello')).toBe(`https://wa.me/${contact.whatsapp.number}?text=Hi%20%26%20hello`);
    expect(whatsappHref()).toContain('?text=Hello');
  });
  it('derives the structured-data street address from the displayed address (no drift)', () => {
    const o = offices[0];
    expect(streetAddress(o)).toBe('#14, Ground Floor, 8th Cross, KSR Main Road, Sri Vijayalaxmi Layout, Near Kanaka Sarovara Lake Gate, Horamavu Agara, Horamavu');
    expect(o.addressLines.at(-1)).toContain(o.postalCode);
    expect(o.addressLines.at(-1)).toContain(o.locality);
    expect(addressOneLine(o)).toBe(`${streetAddress(o)}, ${o.addressLines.at(-1)}`);
  });
  it('uses the current business email address', () => {
    expect(contact.email).toBe('aayushhomehealthsolutions@gmail.com');
  });
});

describe('format helpers', () => {
  it('estimates reading time from the words, ignoring comments and link URLs', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('word '.repeat(1000))).toBe(5);
    const linked = `${'word '.repeat(398)} [two words](/a/very/long/url/that/is/not/read)`;
    expect(readingMinutes(linked)).toBe(2);
    expect(readingMinutes(`<!-- ${'hidden '.repeat(5000)} -->
${'word '.repeat(200)}`)).toBe(1);
  });
  it('slugifies questions into URL-safe ids, dropping apostrophes', () => {
    expect(slugify('How quickly can care start?')).toBe('how-quickly-can-care-start');
    expect(slugify('Do you care for people living with dementia or Alzheimer’s?')).toBe('do-you-care-for-people-living-with-dementia-or-alzheimers');
    expect(slugify("  We don't live with our parent.  ")).toBe('we-dont-live-with-our-parent');
  });
  it('jsonLd escapes "<" so data can never close its <script> element, and stays valid JSON', () => {
    const data = { name: 'A </script><script>alert(1)</script> B', n: 1 };
    const out = jsonLd(data);
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual(data);
  });
});
