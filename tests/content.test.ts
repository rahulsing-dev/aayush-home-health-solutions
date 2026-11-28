import { describe, expect, it } from 'vitest';
import { careSituations, serviceCategories, services } from '../src/content/services';
import { faqs, careerFaqs, faqCategories, faqId, faqsIn } from '../src/content/faqs';
import { blogCategories } from '../src/content/blog-categories';
import { readdirSync, readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { about, career, applyMessage, whyAayush } from '../src/content/pages';
import { testimonials } from '../src/content/testimonials';

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
  it('every service belongs to a known category, and every category id is unique and URL-safe', () => {
    const ids = serviceCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const s of services) expect(ids, `${s.slug} has unknown category "${s.category}"`).toContain(s.category);
  });
  it('the live Home Nursing URL is kept, and the home page has a featured service to lead with', () => {
    expect(services.some((s) => s.slug === 'home-nursing')).toBe(true);
    expect(services.some((s) => s.featured)).toBe(true);
  });
  it('care situations only point to services that exist', () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const c of careSituations) {
      expect(c.services.length).toBeGreaterThan(0);
      for (const slug of c.services) expect(slugs.has(slug), `${c.title} -> ${slug}`).toBe(true);
    }
  });
  it('the services FAQ names every service', () => {
    for (const s of services) expect(faqs[0].a).toContain(s.title);
  });
  it('FAQs have non-empty questions/answers and no placeholder text', () => {
    for (const f of [...faqs, ...careerFaqs]) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(5);
      expect(f.a).not.toMatch(/\[placeholder/i);
    }
  });
  it('every FAQ sits in a known topic, every topic has questions, and question ids are unique', () => {
    const ids = faqCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(faqsIn(id).length, `topic "${id}" has no questions`).toBeGreaterThan(0);
    }
    for (const f of faqs) expect(ids, `"${f.q}" has unknown topic "${f.category}"`).toContain(f.category);
    for (const list of [faqs, careerFaqs]) {
      const qIds = list.map((f) => faqId(f.q));
      expect(new Set(qIds).size).toBe(qIds.length);
      for (const id of qIds) expect(id).toMatch(/^faq-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
  it('FAQ links are internal and do not invent prices or payment terms', () => {
    for (const f of faqs) {
      for (const l of f.links ?? []) expect(l.href).toMatch(/^\//);
      expect([f.a, ...(f.points ?? [])].join(' ')).not.toMatch(/₹|\brs\.?\s?\d|per (day|hour|month)|\bupi\b|credit card|refund/i);
    }
  });
  it('testimonials have a quote, an author and a unique URL-safe id', () => {
    for (const t of testimonials) { expect(t.quote.length).toBeGreaterThan(20); expect(t.author).toBeTruthy(); expect(t.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/); }
    expect(new Set(testimonials.map((t) => t.id)).size).toBe(testimonials.length);
  });
  it('real testimonials quote their headline word for word (no invented wording)', () => {
    for (const t of testimonials.filter((t) => !t.sample)) expect(t.quote.toLowerCase()).toContain(t.highlight.toLowerCase().replace(/[.!?]$/, ''));
  });
  it('Why Aayush quotes real reviews word for word, and features reasons for the home page', () => {
    expect(whyAayush.familyWords.length).toBeGreaterThan(0);
    for (const x of whyAayush.familyWords) {
      const t = testimonials.find((t) => t.id === x.testimonial);
      expect(t, `unknown testimonial "${x.testimonial}"`).toBeDefined();
      expect(t!.sample, `${x.testimonial} is a sample review`).toBeFalsy();
      expect(t!.quote).toContain(x.excerpt);
    }
    expect(whyAayush.reasons.filter((r) => r.featured).length).toBeGreaterThanOrEqual(2);
  });
  it('job openings have unique URL-safe ids, a location and requirements', () => {
    const ids = career.openings.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const o of career.openings) {
      expect(o.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(o.location.length).toBeGreaterThan(0);
      expect(o.requirements.length).toBeGreaterThan(0);
    }
    for (const f of careerFaqs) expect(f.a.length).toBeGreaterThan(5);
  });
  it('the WhatsApp apply message names the role', () => {
    expect(applyMessage('Nursing Aid')).toContain('apply for the Nursing Aid position');
    expect(applyMessage()).not.toContain('undefined');
  });
});

describe('About page and founder message', () => {
  const assetExists = (name: string) =>
    existsSync(new URL(`../src/assets/gallery/${name}`, import.meta.url)) || existsSync(new URL(`../src/assets/images/${name}`, import.meta.url));

  it('every gallery photo, clip and poster file exists', () => {
    for (const g of about.gallery) {
      if (g.kind === 'photo') expect(assetExists(g.image.src ?? ''), g.image.src).toBe(true);
      if (g.kind === 'video') {
        expect(assetExists(g.video.src), g.video.src).toBe(true);
        expect(assetExists(g.video.poster), g.video.poster).toBe(true);
      }
    }
    for (const img of [about.headerImage, about.founder.image]) {
      expect(assetExists(img.src ?? ''), img.src).toBe(true);
    }
  });
  it('no photo appears twice on /about (header and gallery)', () => {
    const srcs = [about.headerImage.src, ...about.gallery.flatMap((g) => (g.kind === 'photo' ? [g.image.src] : []))];
    expect(new Set(srcs).size).toBe(srcs.length);
  });
  it('gallery media are described and captioned, and every quote is attributed', () => {
    for (const g of about.gallery) {
      if (g.kind === 'photo') { expect(g.image.alt.length).toBeGreaterThan(15); expect(g.caption.length).toBeGreaterThan(3); }
      if (g.kind === 'video') { expect(g.video.label.length).toBeGreaterThan(15); expect(g.caption.length).toBeGreaterThan(3); }
      if (g.kind === 'quote') { expect(g.quote.text.length).toBeGreaterThan(10); expect(g.quote.author.length).toBeGreaterThan(2); }
    }
    expect(about.heritageQuote.translation).toBeTruthy();
  });
  it('the founder message is present and has no draft or placeholder wording', () => {
    expect(about.founder.message.length).toBeGreaterThan(0);
    for (const t of [about.headline, about.founder.quote, ...about.founder.message]) {
      expect(t).not.toMatch(/placeholder|lorem|\bdraft\b|\btbd\b/i);
    }
  });
});

describe('blog', () => {
  const dir = new URL('../src/content/blog/', import.meta.url);
  const posts = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => ({ f, text: readFileSync(new URL(f, dir), 'utf8') }));

  it('blog topics have unique, URL-safe ids', () => {
    const ids = blogCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it('post file names are URL-safe and posts have no placeholder or draft wording', () => {
    for (const { f, text } of posts) {
      expect(f).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.md$/);
      expect(text, f).not.toMatch(/\[placeholder|lorem ipsum|\btbd\b/i);
    }
  });
  it('internal links in posts point to pages that exist', () => {
    const slugs = new Set(posts.map((p) => p.f.replace(/\.md$/, '')));
    const serviceSlugs = new Set(services.map((s) => s.slug));
    const pages = new Set(['/', '/services', '/about', '/why-aayush', '/testimonials', '/career', '/blog', '/faqs', '/contact', '/privacy-policy']);
    for (const { f, text } of posts) {
      for (const [, href] of text.matchAll(/\]\((\/[^)#?\s]*)/g)) {
        const ok = pages.has(href) || (href.startsWith('/blog/') && slugs.has(href.slice(6))) || (href.startsWith('/services/') && serviceSlugs.has(href.slice(10)));
        expect(ok, `${f} links to ${href}`).toBe(true);
      }
    }
  });
});
