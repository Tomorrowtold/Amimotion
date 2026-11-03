// Vercel Functions: every /api/* request goes to the inbound agent server (same handler as Cloudflare and Netlify).
// Secrets (ANTHROPIC_API_KEY, DESK_TOKEN, HUBSPOT_*, ...) are set in Vercel > Project > Settings > Environment Variables.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { handle } from '../server/agent-server.js';

// The agent reads the site's passages (/assets/agent/kb.json). Read the built copy bundled with the function
// (vercel.json includeFiles) so it also works behind Vercel's preview protection; fall back to a normal fetch.
const ASSETS = {
  async fetch(url) {
    const p = new URL(url).pathname;
    try { return new Response(await readFile(join(process.cwd(), 'studio/out', p)), { headers: { 'content-type': 'application/json' } }); }
    catch { return fetch(url); }
  },
};
const run = (request) => handle(request, { ...process.env, ASSETS }, {});
export const GET = run, POST = run, OPTIONS = run;
