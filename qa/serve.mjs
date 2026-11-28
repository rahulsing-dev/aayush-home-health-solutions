// Minimal static server for the browser QA suite: node qa/serve.mjs <dir> <port>
// Serves clean URLs (/about -> about.html) and the site's 404.html, like the production host. Local use only.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(process.argv[2]), port = +process.argv[3];
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain','.avif':'image/avif','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.json':'application/json','.mp4':'video/mp4'};
const notFound = (r) => { r.writeHead(404, {'content-type':'text/html'}); r.end(fs.readFileSync(path.join(root, '404.html'))); };
http.createServer((q, r) => {
  let u;
  try { u = decodeURIComponent(q.url.split('?')[0]); } catch { return notFound(r); }
  const f = path.join(root, u);
  // Never serve anything outside the site folder (e.g. /../package.json).
  if (f !== root && !f.startsWith(root + path.sep)) return notFound(r);
  const file = [f, f + '.html', path.join(f, 'index.html')].find((x) => fs.existsSync(x) && fs.statSync(x).isFile());
  if (!file) return notFound(r);
  r.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(r);
}).listen(port, '127.0.0.1');
