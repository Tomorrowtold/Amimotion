# AmIMotion website

The website for www.amimotion.com: 58 pages, the homepage, Ask AmIMotion and the lead form.

## Go live
**Start with [GO_LIVE.md](GO_LIVE.md).** It is the eight-step guide to put the site live in AmIMotion's own AWS account, with a test address first. The AWS kit is in `aws/` (details in `aws/README.md`). The launch build is `bash vercel-build.sh`, which writes the finished site to `studio/out/` and runs the checks.

## Change the site with Codex
1. Clone this repo, open Terminal in its folder and run `./setup.sh` once. It checks Python and Codex and builds the site.
2. Run `./start.sh` (or open this folder in the Codex app) and say what to change, for example "make the homepage hero shorter".
3. Run `./preview.sh` to see the site at http://localhost:8000.

Codex reads `AGENTS.md` first, so it already knows the company, the claims rules, the design rules and how the site is built.

## Inside
- `site/` the inner pages; `studio/` the homepage and the launch build (`studio/out/`). Edit, then build with `python3 tools/pagegen/run.py && python3 build.py` inside `site/`.
- `AGENTS.md` the standing brief.
- `docs/skills/` design and review playbooks. The private fact base and claims register stay out of this public repo.
- `extras/` version 9 (photographs and motion) and the scripts behind it.
- `server/`, `functions/`, `site/src/js/agent*.js`, `magnets.js`, `site/src/desk/` the inbound agent: Ask AmIMotion, the inner-page magnets and the founders' lead desk. Setup: `docs/inbound-agent.md`.
- `aws/` the hosting kit for AmIMotion's own AWS account. `GO_LIVE.md` is the guide.
