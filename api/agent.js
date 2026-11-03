// /api/agent on Vercel: one file per route (shared handler in _handler.js, which Vercel does not expose)
export { GET, POST, OPTIONS } from './_handler.js';
