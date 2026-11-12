// AWS Lambda (Function URL behind CloudFront): every /api/* request goes to the same inbound agent server
// as Vercel, Cloudflare and Netlify. Secrets (ANTHROPIC_API_KEY, HUBSPOT_TOKEN, DESK_TOKEN, ...) are set in
// Lambda > Configuration > Environment variables, never in this repo.
import { readFile } from 'node:fs/promises';
import { handle } from './server/agent-server.js';

// The agent reads the site's passages (/assets/agent/kb.json); deploy.sh bundles the built copy under site/.
const ASSETS = {
  async fetch(url) {
    const p = new URL(url).pathname;
    try { return new Response(await readFile(new URL('./site' + p, import.meta.url)), { headers: { 'content-type': 'application/json' } }); }
    catch { return new Response('{}', { status: 404, headers: { 'content-type': 'application/json' } }); }
  },
};

export const handler = async (event) => {
  const h = event.headers || {};
  // CloudFront does not pass the visitor's Host to a Function URL; the edge function copies it into x-site-host
  const host = h['x-site-host'] || h['x-forwarded-host'] || h.host;
  const url = `https://${host}${event.rawPath || '/'}${event.rawQueryString ? '?' + event.rawQueryString : ''}`;
  const method = event.requestContext?.http?.method || 'GET';
  const headers = new Headers();
  for (const [k, v] of Object.entries(h)) if (v != null) headers.set(k, v);
  if (event.cookies?.length) headers.set('cookie', event.cookies.join('; '));
  let body;
  if (event.body != null && !['GET', 'HEAD'].includes(method)) body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
  const res = await handle(new Request(url, { method, headers, body }), { ...process.env, ASSETS }, {});
  const out = Buffer.from(await res.arrayBuffer());
  const rh = {};
  res.headers.forEach((v, k) => { rh[k] = v; });
  return { statusCode: res.status, headers: rh, body: out.toString('base64'), isBase64Encoded: true };
};
