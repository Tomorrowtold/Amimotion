# AmIMotion studio site (v1)

Studio-grade homepage on the locked homepage copy (team/rounds/01-homepage-story/homepage-final.md on branch claude/project-thread-lg8bk2).

- Hero: the AmIGo tag rendered live in WebGL from the founders' CAD (top and bottom covers, quantised to 540 KB). Loaded only after first paint and idle, skipped on Save-Data or 2G; a CAD render image shows until then.
- Floor: one custom shader (raw WebGL, no library) over the model-hall render. Scroll sweeps "before" (paths and waits removed) into "after" from an anchor; the cursor is a lens that looks through it.
- Start with one bay: same shader, one bay in colour.
- Kinetic line reveals, wheel smoothing, magnetic buttons, locating cursor. Reduced motion falls back to static pictures.

Open studio/v1/index.html through any static server (e.g. `npx serve studio/v1`).
