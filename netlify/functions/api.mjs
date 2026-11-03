// Netlify Functions (v2): every /api/* request goes to the inbound agent server.
import { handle } from '../../server/agent-server.js';
export default (request, context) => handle(request, { ...process.env }, { waitUntil: context.waitUntil?.bind(context) });
export const config = { path: '/api/*' };
