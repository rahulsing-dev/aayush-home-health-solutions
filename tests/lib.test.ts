import { describe, expect, it, vi } from 'vitest';
import { isSpam, isValidISODate, isValidPhone, validateForm, type FormValues } from '../src/lib/validation';
import { submitForm } from '../src/lib/submit';

const base: FormValues = {
  fullName: 'Asha Rao', email: 'asha@example.com', phone: '+91 98765 43210', city: 'Bangalore',
  service: 'Home Nursing', date: '', package: '', message: '', website: '',
};
const opts = { kind: 'enquiry' as const, allowedServices: ['Home Nursing'], today: '2026-10-09' };

describe('validateForm', () => {
  it('accepts a valid enquiry', () => expect(validateForm(base, opts)).toEqual({}));
  it('reports every missing required field', () => {
    const e = validateForm({ ...base, fullName: '', email: '', phone: '', city: '', service: '' }, opts);
    expect(Object.keys(e).sort()).toEqual(['city', 'email', 'fullName', 'phone', 'service']);
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
  it('detects honeypot spam', () => expect(isSpam({ ...base, website: 'http://spam' })).toBe(true));
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
    expect(body.formType).toBe('Book a Service');
    expect('website' in body).toBe(false);
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
