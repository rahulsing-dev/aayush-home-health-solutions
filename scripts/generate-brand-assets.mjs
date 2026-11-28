#!/usr/bin/env node
/**
 * Regenerates the favicon, Apple touch icon and default social-share (Open Graph) image
 * from the master logo. Run after replacing the logo or the hero photo:
 *   node scripts/generate-brand-assets.mjs
 * Uses `sharp`, which Astro already installs for image optimisation (no extra dependency).
 */
import sharp from 'sharp';

const LOGO = 'public/images/aayush-home-health-solutions.svg';
const HERO = 'src/assets/images/home-hero.webp';
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// The logo is tall: the house-and-hands mark sits above the "Aayush" wordmark.
// The mark (top ~60%) alone is used where space is tiny (favicon, home-screen icon).
const full = await sharp(LOGO, { density: 288 }).png().toBuffer();
const { width, height } = await sharp(full).metadata();
// The wordmark's tallest letters rise beside the swoosh, so a straight crop is not enough:
// keep everything above the swoosh's centre line plus the swoosh's elliptical outline.
// (Measured on the 352×535 logo; `k` scales to the rendered size.)
const k = width / 352;
const cropH = Math.round(height * 0.6);
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${cropH}">` +
    `<rect width="${width}" height="${200 * k}"/>` +
    `<ellipse cx="${175 * k}" cy="${200 * k}" rx="${158 * k}" ry="${118 * k}"/></svg>`,
);
// Separate pipelines: sharp would otherwise apply trim() before extract().
const top = await sharp(full).extract({ left: 0, top: 0, width, height: cropH }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
const mark = await sharp(top).trim().png().toBuffer();

/** Centre `img` on a white square of `size` px with `pad` px of breathing room. */
const square = async (img, size, pad) =>
  sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: await sharp(img).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: WHITE }).toBuffer(), gravity: 'center' }])
    .png({ compressionLevel: 9 });

await (await square(mark, 48, 2)).toFile('public/favicon-48.png');
await (await square(mark, 180, 18)).toFile('public/apple-touch-icon.png');

// 1200x630 share image: full logo on white (left) beside the hero photo (right).
const logoPanel = await sharp(full).resize({ height: 540 }).toBuffer();
const photo = await sharp(HERO).resize(760, 630, { fit: 'cover', position: 'attention' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: WHITE } })
  .composite([
    { input: logoPanel, left: Math.round((440 - (await sharp(logoPanel).metadata()).width) / 2), top: 45 },
    { input: photo, left: 440, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-default.jpg');

console.log('Wrote public/favicon-48.png, public/apple-touch-icon.png, public/og-default.jpg');
