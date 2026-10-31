import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root=process.argv[2], port=+process.argv[3];
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);let f=path.join(root,u);
 const tryf=[f,f+'.html',path.join(f,'index.html')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());
 if(!tryf){r.writeHead(404,{'content-type':'text/html'});r.end(fs.readFileSync(path.join(root,'404.html')));return}
 r.writeHead(200,{'content-type':types[path.extname(tryf)]||'application/octet-stream'});fs.createReadStream(tryf).pipe(r)}).listen(port,'127.0.0.1');
