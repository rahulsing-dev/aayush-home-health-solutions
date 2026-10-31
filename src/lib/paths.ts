/**
 * Normalises Astro.url.pathname to the clean public URL path.
 * Static builds use `build.format: 'file'`, so Astro reports "/about.html" and "/index.html"
 * at build time; visitors (and search engines) should only ever see "/about" and "/".
 */
export function cleanPath(pathname: string): string {
  const p = pathname.replace(/(?:\/index)?\.html$/, '').replace(/\/+$/, '');
  return p === '' ? '/' : p;
}
