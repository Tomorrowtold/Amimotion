// Local run of the whole site with the agent: serves studio/out (or site/dist) and /api/* on http://localhost:8787
//   node server/dev.js            (reads ANTHROPIC_API_KEY and the rest from the environment, if set)
// Leads go to server/.leads/ as JSON, standing in for the KV store, so /desk/ works locally with DESK_TOKEN=dev.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handle } from './agent-server.js';
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.SITE_DIR || [path.join(here, '../studio/out'), path.join(here, '../site/dist')].find((p) => fs.existsSync(p));
const PORT = +process.env.PORT || 8787, STORE = path.join(here, '.leads');
const kv = { // a tiny stand-in for a Cloudflare KV namespace
  async put(k, v) { fs.mkdirSync(STORE, { recursive: true }); fs.writeFileSync(path.join(STORE, k.replace(/[^\w.-]/g, '_') + '.json'), v); },
  async get(k) { try { return fs.readFileSync(path.join(STORE, k.replace(/[^\w.-]/g, '_') + '.json'), 'utf8'); } catch { return null; } },
  async list({ prefix }) { let f = []; try { f = fs.readdirSync(STORE); } catch {} return { keys: f.filter((x) => x.startsWith(prefix.replace(':', '_'))).map((x) => ({ name: x.replace(/\.json$/, '').replace('_', ':') })) }; },
};
const env = { ...process.env, LEADS: kv, DESK_TOKEN: process.env.DESK_TOKEN || 'dev' };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.txt': 'text/plain', '.xml': 'application/xml', '.bin': 'application/octet-stream', '.mesh': 'application/octet-stream' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname.startsWith('/api/')) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await handle(new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) }), env, {});
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); return;
  }
  let f = path.join(ROOT, decodeURIComponent(url.pathname)); if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end(fs.existsSync(path.join(ROOT, '404.html')) ? fs.readFileSync(path.join(ROOT, '404.html')) : 'Not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`AmIMotion with the agent: http://localhost:${PORT}  (site: ${ROOT}; engine: ${env.ANTHROPIC_API_KEY ? 'claude' : 'local'})`));
