// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical production URL. Override at build time with SITE_URL.
const SITE_URL = process.env.SITE_URL || 'https://www.aayushhomehealth.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' }, // /about -> about.html (clean URLs on Netlify/Cloudflare/Vercel)
  integrations: [
    sitemap({
      // The HTML site map and 404 are not useful in sitemap.xml
      filter: (page) => !page.includes('/site-map') && !page.includes('/404'),
    }),
  ],
  prefetch: { prefetchAll: false },
});
