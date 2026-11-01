# AmIMotion Website (for Codex)

The AmIMotion website, ready to build with Codex. No API key needed: Codex uses your own sign-in.

## Start
1. Clone this repo, open Terminal in its folder and run `./setup.sh` once. It checks Python and Codex and builds the site.
2. Run `./start.sh` (or open this folder in the Codex app) and say what to change, for example "make the homepage hero shorter".
3. Run `./preview.sh` to see the site at http://localhost:8000.

Codex reads `AGENTS.md` first, so it already knows the company, the claims rules, the design rules and how the site is built.

## Inside
- `site/` the website (version 8, the six-section homepage). Edit, then build with `python3 tools/pagegen/run.py && python3 build.py` inside `site/`.
- `AGENTS.md` the standing brief.
- `docs/skills/` design and review playbooks. The private fact base and claims register stay out of this public repo.
- `extras/` version 9 (photographs and motion) and the scripts behind it.
- `./publish-build.sh` makes the launch build in `site/dist` (check with the founders before it goes live).
