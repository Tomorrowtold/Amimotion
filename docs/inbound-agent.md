# Inbound agent: setup for AmIMotion

Everything here runs in AmIMotion's own accounts. Nothing depends on anyone else's.

## What it is

- **Ask AmIMotion**, a guide on every page except the homepage. Visitors ask in plain words. It answers only from AmIMotion's own facts and the site's own pages, and it names the page it used. It can also work things out with them: an anchor estimate, the hours lost to searching, a pilot brief, a first-bay plan, what the site survey will check, a sketch of the MES or ERP data exchange, what to tag, who in their company must agree, and questions to a sample plant (always labelled Simulation).
- **Six lead magnets** on 42 inner pages, each matched to what that page is about. Every one gives the visitor something they can use straight away, and every one can send it to an engineer in one step.
- **Visitor memory.** The guide remembers the visitor's floor across pages, but only in their own browser, until they choose to send it. They can see everything it remembers and clear it with one button.
- **The lead desk** at `/desk/`, for the founders. Every lead arrives with a grade (A to D), a fit score and an intent score based on the ideal customer profile in the founders' kit. It also shows what the visitor did on the site, any objections they raised with the honest answer to each, the best questions for the first call, and a draft reply. Nothing reaches a visitor until a founder presses "Open in email".
- **The claims gate.** Every reply is checked before a visitor sees it. Barred wording is rewritten, for example "certified", ROI or savings figures, "install in days", customer names, prices, or planned features described as available.

Without an Anthropic key, all of this still works. The guide answers from the site's own pages and tools, with no AI model.

## Run it on your computer

```
npm install
./publish-build.sh          # builds the site into studio/out
node server/dev.js          # http://localhost:8787 , lead desk at /desk/ (key: dev)
node server/test.js         # 15 checks, no network or key needed
```

## Put it live on Cloudflare Pages (about 20 minutes)

1. Create a Cloudflare account in AmIMotion's name, then sign in from this folder: `npx wrangler login`.
2. Create the leads store with `npx wrangler kv namespace create amimotion-leads`. Paste the id it prints into `wrangler.toml` (the commented `kv_namespaces` lines), and remove the `#` signs.
3. Build and deploy:
   ```
   ./publish-build.sh
   npx wrangler pages deploy studio/out --project-name amimotion
   ```
   The `functions/` folder goes up with the site automatically. That folder is the agent.
4. Add the settings in Cloudflare › Workers & Pages › amimotion › Settings › Variables and secrets. Mark each key as a **secret**:

| Name | What it does | Needed? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Lets the guide and the lead desk use Claude. Create the key at console.anthropic.com and set a **monthly spend limit** first (start at $100). | Recommended |
| `DESK_TOKEN` | The key that opens `/desk/`. Use a long random phrase. | Yes |
| `ALLOWED_ORIGINS` | `https://amimotion.com,https://www.amimotion.com` | Yes, once the domain is live |
| `LEAD_WEBHOOK` | A Slack or Teams incoming webhook. Posts one line per new lead. | Optional |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Emails the full lead summary to sales@ (resend.com, after you verify the domain). | Optional |
| `HUBSPOT_TOKEN` | A HubSpot private app with contacts and notes write access. Each lead becomes a contact, with the full lead summary as a note. | Optional |
| `ANTHROPIC_MODEL`, `AGENT_EFFORT` | Default `claude-opus-5-5` at `low` effort, for fast replies. | Leave as is |

5. Deploy once more so the settings apply, then open `/api/health`. It lists which parts are switched on (names only, never the values).
6. Open `/desk/`, enter your `DESK_TOKEN`, and press "Show a sample lead" to see what a lead looks like.

**Spend and abuse:** each visitor can ask 40 questions every 10 minutes and send 6 leads. Add a Cloudflare rate-limiting rule on `/api/*` as well. The Anthropic spend limit is the hard ceiling.

## Netlify instead

`netlify deploy --dir studio/out --functions netlify/functions --prod`, with the same settings under Site configuration › Environment variables. Netlify has no KV store, so leads arrive by webhook, email or HubSpot, and `/desk/` explains this when it opens.

## Where things are

| File | What |
|---|---|
| `site/src/js/agent-core.js` | The facts the guide may use, the rules it follows, the claims gate, the tools, lead scoring and the lead summary. **Edit the facts and rules here only.** |
| `site/src/js/agent.js`, `agent.css` | The guide in the page, visitor memory, and the "send to an engineer" form |
| `site/src/js/magnets.js` | The six magnets. Which page shows which magnet is set in `MAGNETS` in `site/build.py`. |
| `site/src/desk/index.html` | The lead desk |
| `server/agent-server.js` | `/api/agent`, `/api/lead`, `/api/desk`, `/api/mcp` (sample plant), `/api/health` |
| `functions/`, `netlify/`, `wrangler.toml` | The hosting adapters |

## For the founders to decide

- **Wording:** the claims register (kit file 03) says "FiRa and omlox compliant". The founders' review of 29 Oct says "built on the FiRa and omlox specifications". The guide uses the founders' review wording. Please confirm.
- **People:** who replies to A leads, and how quickly.
- **Privacy:** the consent wording on the form, and who owns privacy questions.
