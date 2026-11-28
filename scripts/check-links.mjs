#!/usr/bin/env node
/**
 * Post-build link & asset checker. Scans every HTML file in dist/ and verifies that
 * each internal href/src resolves to a built file, that #fragments exist on the target
 * page, and that every page has a <title>, meta description, canonical, one <h1>, and no
 * duplicate ids. Usage: npm run build && npm run test:links
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
if (!fs.existsSync(DIST)) { console.error('dist/ not found. Run `npm run build` first.'); process.exit(2); }

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

/** "/about" -> dist/about.html ; "/" -> dist/index.html ; "/blog" -> dist/blog.html or dist/blog/index.html */
function resolveRoute(route) {
  const clean = route.replace(/\/+$/, '') || '/';
  const candidates = clean === '/' ? ['index.html'] : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`];
  return candidates.map((c) => path.join(DIST, c)).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
}
const ids = new Map(); // file -> Set(ids)
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

const problems = [];
let linkCount = 0;
for (const file of htmlFiles) {
  const rel = path.relative(DIST, file);
  const html = fs.readFileSync(file, 'utf8');
  const is404 = rel === '404.html';

  // ---- SEO / structure ----
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${rel}: missing meta description`);
  if (!is404 && !/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) problems.push(`${rel}: missing canonical`);
  if (/<link rel="canonical" href="[^"]*\.html"/.test(html)) problems.push(`${rel}: canonical ends in .html`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) problems.push(`${rel}: expected exactly one <h1>, found ${h1s}`);
  const seen = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) { if (seen.has(m[1])) problems.push(`${rel}: duplicate id "${m[1]}"`); seen.add(m[1]); }
  // A bare `alt` (how Astro writes alt="") is a valid, intentionally empty alt for decorative images.
  for (const m of html.matchAll(/<img\b(?![^>]*\salt(?:=|[\s>]))[^>]*>/g)) problems.push(`${rel}: <img> without alt: ${m[0].slice(0, 60)}`);

  // ---- Links & assets ----
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url)) continue;
    if (!url.startsWith('/') && !url.startsWith('#')) continue;
    linkCount++;
    const [noHash, hash] = url.split('#');
    const p = noHash.split('?')[0];
    const target = p === '' ? file : (path.extname(p) && !p.endsWith('.html') ? path.join(DIST, p) : resolveRoute(p));
    if (!target || !fs.existsSync(target)) { problems.push(`${rel}: broken link "${url}"`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`${rel}: missing anchor "#${hash}" on ${path.relative(DIST, target)}`);
  }
}

// Every page in sitemap.xml should exist, and robots.txt must exist.
const sm = path.join(DIST, 'sitemap-0.xml');
if (fs.existsSync(sm)) {
  for (const m of fs.readFileSync(sm, 'utf8').matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)) {
    if (!resolveRoute(m[1] || '/')) problems.push(`sitemap-0.xml: ${m[1]} has no built page`);
  }
} else problems.push('sitemap-0.xml missing');
if (!fs.existsSync(path.join(DIST, 'robots.txt'))) problems.push('robots.txt missing');

console.log(`Checked ${htmlFiles.length} pages and ${linkCount} internal links/assets.`);
if (problems.length) { console.error(`\n${problems.length} problem(s):\n - ` + problems.join('\n - ')); process.exit(1); }
console.log('All checks passed.');
