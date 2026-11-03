# Put the site on Vercel

The repo is ready for Vercel: `vercel.json` sets the build (`bash vercel-build.sh`, output `studio/out`),
the security headers and the agent API (`api/<route>.js (shared code in api/_handler.js)`, the same server as Cloudflare and Netlify).

1. vercel.com > Add New > Project > Import `tomorrowtold/amimotion`. Leave every setting as it is (Framework: Other). Deploy.
2. Every push to `main` updates the live address (`amimotion.vercel.app` or similar). Other branches get preview links.
3. Optional, in Project > Settings > Environment Variables (never paste these into a chat):
   - `ANTHROPIC_API_KEY` turns on Claude for "Ask the guide" (without it the guide answers from the site's own pages).
   - `DESK_TOKEN` opens the founders' lead desk at /desk/.
   - `LEAD_WEBHOOK`, `HUBSPOT_TOKEN` or `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_ID`, `RESEND_API_KEY` + `LEAD_EMAIL_TO`: where leads go.
     The full list is at the top of `server/agent-server.js`. Vercel has no KV store bound, so leads arrive by webhook, HubSpot or email.
   - `ALLOWED_ORIGINS` once a real domain is added.
4. Domain: Project > Settings > Domains > add amimotion.com and follow the DNS lines Vercel shows.
5. Ownership: move the project to AmIMotion's own Vercel team when they have one (Project > Settings > General > Transfer).

Build locally the same way: `bash vercel-build.sh`, then serve `studio/out`.
