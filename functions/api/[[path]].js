// Cloudflare Pages Functions: every /api/* request goes to the inbound agent server.
// Deploy from the repo root: `npx wrangler pages deploy studio/out` picks up this folder.
import { handle } from '../../server/agent-server.js';
export const onRequest = ({ request, env, waitUntil }) => handle(request, env, { waitUntil });
