#!/usr/bin/env node
// Local dev server: serves this folder AND proxies /api to the new-api backend,
// so the site and API share one origin (same as production behind nginx).
//   node dev-server.js                      -> http://localhost:8088  ->  backend http://127.0.0.1:3000
//   PORT=8090 BACKEND=http://127.0.0.1:3000 node dev-server.js
// Mirrors the nginx rules in docs-internal/new-api-integration.md (/oauth/*, /user/reset, /wallet).
const http = require('http'), fs = require('fs'), path = require('path'), url = require('url');
const PORT = Number(process.env.PORT || 8088);
const BACKEND = new url.URL(process.env.BACKEND || 'http://127.0.0.1:3000');
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8' };

function proxy(req, res) {
  const headers = Object.assign({}, req.headers); // keep Host/Origin as the browser sent them (new-api checks Origin == Host)
  headers['x-forwarded-for'] = req.socket.remoteAddress;
  headers['x-forwarded-proto'] = 'http';
  const p = http.request({ hostname: BACKEND.hostname, port: BACKEND.port || 80, path: req.url, method: req.method, headers }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  p.on('error', (e) => {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Backend unreachable at ' + BACKEND.origin + ' (' + e.code + ')' }));
  });
  req.pipe(p);
}

function serveFile(file, res) {
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('404 Not Found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(buf);
  });
}

http.createServer((req, res) => {
  const u = new url.URL(req.url, 'http://x');
  let p = decodeURIComponent(u.pathname);
  if (p.startsWith('/api/')) return proxy(req, res);
  if (/^\/oauth\/[a-z0-9_-]+$/i.test(p)) p = '/oauth-callback.html';
  else if (p === '/user/reset') p = '/reset.html';
  else if (p === '/wallet') { res.writeHead(302, { location: '/account.html' }); return res.end(); }
  else if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || /[\\/]\.git[\\/]|[\\/]node_modules[\\/]/.test(file)) { res.writeHead(403); return res.end('403'); }
  serveFile(file, res);
}).listen(PORT, () => console.log('CodeFlux site  http://localhost:' + PORT + '   (API -> ' + BACKEND.origin + ')'));
