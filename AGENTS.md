# AmIMotion website studio

You are working on the AmIMotion marketing website with Shiv (GTM for AmIMotion), who builds it for AmIMotion's founders. Use Shiv's name or they/them. Shiv works with you through Codex and prefers short answers, shows not tells, and short go-aheads ("build it", "start") mean proceed on your recommendation.

## The company
AmIMotion (Locatepro Technologies, Bengaluru) makes ultra-wideband indoor positioning for factories and warehouses: AmIGo tags, AmIMo anchors and AmIHub software with a built-in MCP server. Category: "Industrial Spatial Intelligence". Entry point: work-in-progress visibility (where work is, where it waits). Founders: CEO Kaushal Kukkar, CTO Vivek Dham, Sumeer Bhatara. Say "manufacturing", not "automotive". Pronounced "Ammy-Motion".

## How the site is built
- `site/src/pages/**` hand-written pages (the homepage is `site/src/pages/index.html`), `site/src/partials/` header and footer, `site/src/css/site.css`, `site/src/js/` (site.js menus, reveals, scroll scenes; hero.js the scroll-driven hero; diagnostic.js the lead magnet).
- Most inner pages are generated: edit `site/tools/pagegen/p_*.py` (helpers in lib.py; `write()` keeps descriptions at most 160 characters and titles at most 65), then run `python3 tools/pagegen/run.py`.
- `python3 build.py` builds `site/dist` (front matter, partials, section bars, JSON-LD, llms.txt, sitemap). `--share` makes relative links; `--indexable` is only for launch.
- Picture slots: `<div class="card ph mood-X"><p class="ph-brief"><b>Pxx</b> brief…` placeholders. `site/src/data/scenes.json` maps a code to a picture in `site/src/assets/scene/` (stem, alt text, object-position); build.py swaps it in. Briefs stay hidden as the shot list.
- Always run from `site/`: `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`. Pickability must report 0 barred claims.
- Preview: `./preview.sh` from the top folder (http://localhost:8000).

## Rules that never move
- Claims follow the claims register (kept privately by Shiv) and the founders' review (29 Oct 2026): "built on the FiRa and omlox specifications" (never "compliant" or "certified"); "down to ±10 cm" with AmIMo anchors, site-dependent; "runs in", never "deployed"; no "under a nanosecond"; Wi-Fi FTM "device support confirmed per site"; no phone-location claim; never "FCC certified". Milestones are plans, not facts.
- No customer, prospect, backer or partner names in public copy, and no backers strip. Shiv holds the list privately; if unsure, leave a name out. AmIHub screenshots need the founders' permission before they appear.
- Hardware is dark grey with an embossed lowercase "amimotion"; show it only from real photos or the CAD. Films carry a small "Simulation" label. Never write "3D illustration", "rendered" or similar about pictures, on a page or in alt text.
- Design: black and white interface, colour only from pictures; brand blue #66a5fa for located, amber #f0a43a for waiting. Homepage: value propositions only, short copy, no jargon, the diagnostic as the main lead magnet. No sound, no sphere, no arcs or glowing rings, no IDs or fake data chips. Headlines two lines at most; no eyebrows, monospace, gradients or glass pills. Fast first load.
- Keep all 50+ pages. Never name design sources (agencies, brands, repos) in shipped files.
- Ask Shiv before deploying anywhere public.

## Quality loop
Read and follow the playbooks in `docs/skills/` (amimotion-taste-review/SKILL.md first, then pro-design and taste-skill) before any design change. After a change: build, open the page at 1440 and 390 wide, look at it yourself, check overflow and console errors, then report in two or three sentences.

## History
This folder holds version 8 (29 Oct 2026, the six-section homepage). `extras/site-v9-photos-motion.tgz` has version 9 (scroll-scrubbed hero, six-size type scale, CAD product photographs, line-mask motion) in case Shiv wants any of it back; `extras/photo-scenes/` has the Blender scripts that made those photographs.
