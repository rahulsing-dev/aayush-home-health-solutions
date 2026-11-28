# Photos

Site photography lives here; the team's own photos (About page gallery and clip) live in
`src/assets/gallery/`, with the untouched originals in `docs/media-originals/`. Both folders work the
same way. At build time each one is automatically resized into
small AVIF/WebP files for phones and larger ones for desktops, so you can drop in the
original high-resolution file; there is no need to resize or compress it by hand.

## Add or replace a photo

1. Put the file in this folder (JPG, PNG, WebP or AVIF).
2. In the content file, set `src` to the file name, for example in `src/content/services.ts`:

   ```ts
   image: { src: 'home-nursing.webp', alt: 'A nurse reading with an elderly woman at home', ratio: '4 / 3', width: 1200, height: 900 }
   ```

- `ratio` is the shape of the frame; the photo is cropped to fill it. Keep the existing ratio so the layout does not change.
- Supply photos at least 1200 px wide where possible (smaller files are never upscaled).
- Always write meaningful `alt` text that describes the photo for people who cannot see it.
- A misspelt file name stops the build with a clear error, so a broken image can never go live.

The logo is different: it stays at `public/images/aayush-home-health-solutions.svg`. After
changing the logo, run `node scripts/generate-brand-assets.mjs` to rebuild the favicon,
home-screen icon and social-share image.
