import { describe, expect, it } from 'vitest';
import { services } from '../src/content/services';
import { faqs } from '../src/content/faqs';
import { testimonials } from '../src/content/pages';

describe('content integrity', () => {
  it('service slugs are unique, URL-safe, and have content', () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of services) {
      expect(s.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(s.description.length).toBeGreaterThan(0);
      expect(s.highlights.length).toBeGreaterThan(0);
      expect(s.image.alt.length).toBeGreaterThan(5);
    }
  });
  it('FAQs have non-empty questions/answers and placeholders are flagged unverified', () => {
    for (const f of faqs) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(5);
      if (f.a.includes('[Placeholder]')) expect(f.verified).toBe(false);
    }
  });
  it('testimonials have a quote and an author', () => {
    for (const t of testimonials) { expect(t.quote.length).toBeGreaterThan(20); expect(t.author).toBeTruthy(); }
  });
});
