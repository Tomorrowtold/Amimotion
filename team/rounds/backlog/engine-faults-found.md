# Site faults found by the Engine room while profiling (1 Nov 2026)

- Hero turn (site/src/assets/intro/intro.json): 72 frames made with AI tools (Higgsfield), "Illustrative render"; breaks the CAD-only picture rule; ~1.6 MB per width. Replace with CAD renders.
- "Simulation" film-label spans on use-case pages; closing film aria-label says "simulation". Remove (Shiv 1 Nov) and replace any film that would need one.
- film03.mp4 and film04.mp4 over 3 MB; H.264 only; JPEG posters 61-91 KB.
- No AVIF; WebP only at 900/1600 fixed in build.py scenes(); nothing up to 8K.
- site.css 77 KB render-blocking; 9 backdrop-filter (glass) rules; .hero-glow fade 1.2 s; homepage hero dark vs light brand direction.
- .js [data-reveal] hides 20 homepage blocks at opacity 0 (0.9 s fade); blank if JS fails.
- "Know more" buttons and phone menu dead without JS; diagnostic needs three.js (687 KB).
- 7-day cache, no content-hashed filenames.
- Tools: ffmpeg, Node 22, Chrome, Pillow 12.3 present; avifenc/cjxl missing (pip pillow-avif or libavif needed).
