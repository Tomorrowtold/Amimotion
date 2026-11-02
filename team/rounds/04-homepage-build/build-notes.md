# Homepage build, round 04

Experience Design, Design Engineering and the Engine room. 2 Nov 2026. Branch `claude/project-thread-lg8bk2`, not deployed.
Shots: `shots/home-{1440,390,2560}-full.png` and `shots/home-<size>-first-screen.png` (Playwright, Chromium, DPR 1, every lazy image scrolled into view first).

## 1. What changed

**Homepage (`site/src/pages/index.html`).** Rebuilt from `homepage-final.md`, screens 1 to 7, word for word. No word was changed, added or cut; none of the "ships if confirmed" lines from `open-facts.md` is used. The hero is `frame/hero.html` round 5 exactly: same grid, the same `clamp()` sizes, the tag on the page, H1, tag, lede order on phones and portrait screens, and the same 800 to 7680 px AVIF and WebP ladder (copied to `site/src/assets/home/`). Screens 2 to 6 use one pattern: a heading row, then a 5:7 split (screen 3 flips it to 7:5), and full-width frames for the camera A full-frame stills. Everything is on one ground. There are no dark flips, cards, icons, eyebrows, glass, glow or reveals, and nothing moves on load.

**Pictures.**
- The hero is the approved AmIGo still.
- Screen 5 is about hardware, so it uses the founders' CAD studio stills of AmIGo (`amigo_hero`) and AmIMo (`amimo_rj45`). They are flattened onto the page ground with `render_hardware.py --page`, cropped to 3:2 and cut with `tools/hero_images.py`. Their alt text is the locked alt without the clause that the interim picture cannot show: "screwed to the rail of a trolley" and "fixed to a steel column". Each clause returns with its in-context render.
- Screens 2, 3, 4 and 6 and the AmIHub slot on screen 5 call for model-hall stills or a real capture, and none of those exists. Each is a plain `--surface` block at its final aspect ratio: 4:3 for the close crops, 16:9 for camera A full frame (the 8K hall frame), and 3:2 for AmIHub. Each block has an HTML comment that names the asset, its brief, its locked alt text and its owner.
- Nothing is drawn in code. The old AI-made intro (`assets/intro/`) is no longer copied to `dist/`, and `hero.js` is not loaded.
- "Ground-coloured" was read as `--surface`, the design system's slot ground. A `--ground` block would not be visible on the page.

**Hero film hook.** An HTML comment in the hero figure gives the exact `<video>` block to swap in: a 1:1 phone source, AV1 and H.264 sources, a poster, the locked alt as an aria-label, and `preload="none"`. `.picture.film` in `home.css` holds the same grid area as a 4:5 box (1:1 on phones), so nothing around it moves. `FILM_JS` (inline, 330 bytes) plays a `video[data-hero-film]` only while it is in view, and never with reduced motion. With JS off, the poster stays. Until the film exists, the script does nothing.

**Type, tokens, nav and footer, sitewide.**
- `site/src/css/core.css` holds the design-system tokens (scoped to `.ds`, so they cannot collide with `site.css`), the AmI Sans faces (the serifed-I files only) with metric-matched fallbacks, the bar, its panels, the phone sheet and the footer.
- `site/src/data/nav.json` is now the single nav tree from homepage-final.md. `build.py` renders the bar, panels, phone sheet, footer role lines and columns, section bars (`TOURS`), visible breadcrumbs, BreadcrumbList JSON-LD and llms.txt (four sections in nav order) from it. One label per URL.
- Panels are native `<details>`, so they open on click or tap with JS off and a closed panel is out of the tab order. A 400-byte inline script keeps one panel open at a time and closes on Escape or an outside click.
- The bar is in the page flow on every page, never sticky, so it cannot cover a focused item. The inner-page sub-nav moved into the flow too.

**Homepage CSS and scripts.** `core.css` and `home.css` are inlined on the homepage: 12.1 KB minified, no render-blocking request and no `site.css`. The homepage loads no external script.

**Inner pages.**
- They keep their own look. They link `site.css`, then `core.css`.
- `site.css` went from 77.4 KB to 57.4 KB. `tools/prune_css.py` drops every selector that no built page or script can match, and removes sitewide all `backdrop-filter` (glass), `.hero-glow`, the `km-glow` and the `.js [data-reveal]` opacity-0 hiding.
- Scene pictures now ship AVIF first (511 KB for the set, against 780 KB of WebP) through `<picture>`.

**Truth and wording, sitewide.**
- The "Simulation" film label is gone from `lib.film()`, so it is off all four use-case pages and /films/. The /trust/ line "Films carry a Simulation label" is cut, and "Renders" became "Pictures".
- "Rendered scene:" is gone from every scene alt text.
- SoftwareApplication `operatingSystem` "On-premise or cloud" is now the locked line "Runs on an industrial PC inside your plant, with no internet needed".
- In `entity.json`:
  - `long` is the footer entity paragraph word for word, so the Organization description, llms.txt and the footer are one text.
  - `short` and the homepage meta description are the hero's first two sentences.
  - The fact "Runs in manufacturing, robotics and warehousing sites" was removed, because homepage-final.md records that line as stopped (A46, C34).
- `theme-color` is now the ground #f5f5f2. The share image is a 1200 x 630 crop of the hero still (`assets/home/og-home.jpg`), until the film poster exists.

**Checks tooling.** `pickability.py` now reads `<footer>` as site chrome, as it already read `<nav>` and `<header>`, because extractors drop repeated chrome. Before this change the locked footer paragraph (four sentences start with "It") failed 43 pages on the "sentences stand alone" heuristic. The entity, misspelling and barred-claim checks still read the chrome, so the canonical-description check still passes on /.

**The diagnostic.** /diagnostic/ was built by cutting markup out of the old homepage. That markup is now `tools/pagegen/diag_block.html`.

## 2. Stubs created

These pages are nav targets that homepage-final.md defines and the site did not have. Each is built in `p_company.py` from locked homepage lines only, so they make no new claim:
- `/start/` (the Start small hub: the locked pilot line and every child link with its nav line)
- `/how-to-buy/` (call, NDA pack, survey, pilot, using the locked screen 6 lines. One plain line is new: "We survey your floor and set the anchor count.", the same claim as [B4] and the homepage)
- `/trust/people/` (the locked screen 6 people lines)

Every other nav, footer and in-page URL already had a page. The build now has 55 pages.

## 3. Faults fixed, by backlog id

The backlog files carry no numbers. Ids here are file prefix plus line order: S = structure, P = patrol, E = engine.

| Id | Fault | Status |
|---|---|---|
| S1 | Section names disagree (homepage, TOURS, header) | Fixed. One tree in nav.json feeds all of them |
| S2 | BreadcrumbList uses meta titles; no visible breadcrumb | Fixed for JSON-LD and visible crumb links (nav labels). The current-page crumb text still comes from pagegen |
| S3 | /start/ missing | Fixed (stub) |
| S4 | Hover menus, aria-haspopup on links, eyebrow labels, icons, "Times every pulse" | Fixed. Click or tap `<details>`, no icons or eyebrows, nav lines from homepage-final |
| S5 | Homepage h2.kicker, film with no heading, dark/light flips | Fixed on the homepage. One ground, every screen has an h2 |
| S6 | Inline `style="padding-top:0"` on homepage sections | Fixed on the homepage. Pagegen `section(flush=True)` still emits it on inner pages |
| S7 | site.css 77 KB; mixed grid ratios; mood gradients; six button types | Homepage fixed (12.1 KB inline, 5:7 only, one button plus one surface variant). site.css trimmed to 57.4 KB. Inner pages keep the old grids and buttons |
| S9 | SoftwareApplication "On-premise or cloud" | Fixed (see 1). Also flagged to Truth and Quality: [B5] does describe a cloud deployment, the homepage does not offer it, and nobody should pick quietly |
| P1 | /how-to-buy/, /start/, /trust/people/ missing | Fixed (stubs) |
| P2 | Old header labels, icons, eyebrows | Fixed sitewide |
| P3 | `.hero-glow` | Removed sitewide |
| P4 | Category h2.kicker | Gone with the old homepage |
| P5 | Hero lede differs | Fixed, locked lede |
| P6 | Two hero buttons | Fixed, no buttons in the hero |
| P7 | Hero picture WebP only 900/1600, soft at 4K/8K | Fixed. AVIF and WebP, 800 to 7680 |
| E1 | AI-made intro.json hero turn | Not used and not shipped. Source files remain in `src/assets/intro/` for history |
| E2 | "Simulation" labels and aria-label | Removed sitewide |
| E4 | No AVIF; nothing to 8K | Fixed on the homepage and for scene pictures. Product images under `assets/img/` are still WebP only |
| E5 | 77 KB render-blocking CSS, 9 backdrop-filter, glow fade, dark hero | Homepage: no CSS request. Sitewide: 0 backdrop-filter, no glow |
| E6 | `[data-reveal]` hides blocks at opacity 0 | Removed sitewide. JS-off census on /: 0 elements at opacity 0 |
| E7 | Menus dead without JS | Fixed. Panels and phone sheet are `<details>`. "Know more" buttons on inner pages still need JS |

## 4. Faults left, with owners

1. **Pictures.** Camera A stills for screens 2, 3, 4 and 6, the AmIHub capture or its poster fallback, and in-context AmIGo-on-trolley and AmIMo-on-column renders. Five reserved blocks, about 40 % of the page height at 1440. Owner: Realism lab (model hall), founders for the AmIHub capture.
2. **Hero film.** The hook is ready. Owner: Film Director with the hero film team (`team/rounds/03-hero-film/`).
3. **Diagnostic in place.** "Plan your first bay" is a plain link to /diagnostic/. homepage-final.md asks it to open over the screen 6 frame and load its code only then. Owner: Growth Lead with the Engine room no-JS and critical-path hackers.
4. **LCP element.** The hero image wins LCP, though the spec asks for the H1. They paint within the same frame budget. Owner: Engine room, poster frame and LCP hacker.
5. **Pickability on the homepage.** "A number with its condition in the first 400 words" fails. The first figure ("1 to 3 years, depending on use") is word 462, and the locked order cannot change. Owner: Search and AI Answers Lead with the Head of Words. The three stubs are under 250 words. Owner: Experience Design.
6. **Inner pages.** They still use Inter Tight, pill buttons, the old grids and next-band endings with an `nb-kicker` eyebrow (S8). /films/ is held at release until films need no stamp (V103), and whether films 01 to 04 qualify is unchecked. `/trust/` and `/pilot/` mention "the time limit for each" zone (open fact O2). Owners: Structure unit, Film Director, Truth and Quality.
7. **Physical AI.** The footer carries "Physical AI" on every page. /industrial-spatial-intelligence/ also uses it, so it appears twice there. Owner: Head of Words.
8. **Caching.** No hashed asset names; 7-day cache (E8). Owner: Engine room build and edge hackers.
9. **Truth flags.** The AmIHub cloud deployment is in [B5] but not on the homepage (S9). The llms fact "association with a start and an end" names a start/end record, which V108 keeps off the homepage. Owner: Truth and Quality Lead.

## 5. Measurements

Served by `python3 -m http.server` from `site/dist`, uncompressed, Chromium via Playwright (`require('playwright')`, `chromium.launch()`). Scripts are in the session scratchpad and are reproduced in the method notes below.

**First screen weight.** Every response before any scroll.

| Screen | KB | What loads |
|---|---|---|
| 390 x 844 @2 | 128.7 | HTML 47.6 (14.0 gzip), 3 fonts 40.5, hero AVIF 1600 16.9, screen 5 tag still 23.8 (lazy, near the fold) |
| 390 x 844 @3 | 142.7 | the same with the 2400 hero |
| 1440 x 900 @1 | 104.8 | HTML, fonts, hero 1600 |
| 1440 x 900 @2 | 118.8 | hero 2400 |
| 2560 x 1440 @2 | 217.0 | hero 5120 |
| 3840 x 2160 @2 | 291.5 | hero 7680 |

All are under 300 KB uncompressed. With gzip on the HTML, each falls by about 34 KB.

**LCP and CLS.** Emulated slow 4G (CDP `Network.emulateNetworkConditions`: 562.5 ms latency, 1.44 Mbps down, 675 kbps up), 4x CPU (`Emulation.setCPUThrottlingRate`), cache off, 3 runs each.

| Viewport | LCP (ms) | FCP (ms) | CLS | LCP element |
|---|---|---|---|---|
| 390 x 844 @2 | 1560 / 1568 / 1532 | 816 / 816 / 832 | 0.0059 | hero IMG |
| 1440 x 900 @1 | 1580 / 1576 / 1520 | 816 / 856 / 896 | 0.00004 | hero IMG |

**Other checks.**
- **CSS.** The homepage's CSS is 12.1 KB inline, against a 30 KB target. There is no external stylesheet or script on /.
- **JS off.** The H1 and every screen render. There are 0 elements at opacity 0, 142 plain links, and the nav panels open on click.
- **Horizontal scroll.** None from 320 to 3840 px in 10 px steps. The 320 and 330 px bar overflow found on the first sweep was fixed with a narrow-phone bar rule.
- **Console errors.** None on /, /products/amigo/ or /solutions/wip/.
- **`build.py`.** 55 pages built.
- **`pickability.py dist`.**
  - crawler checks 697/756, against 682/714 before; the 3 new stubs add 42 checks
  - site files 7/8 (robots welcomes AI crawlers only on `--indexable`, by design)
  - unbranded questions pickable 38/38
  - branded questions answerable 7/10 (unchanged)
  - barred claims 0
  - canonical description present on /, /what-is-amimotion/, /company/ and llms.txt
- **Homepage on pickability.** 13/14. The one fail is item 5 in section 4.
- **Banned words.** `grep -ri simulation dist` finds nothing in HTML or TXT. Nothing on the site uses `assets/intro`.

## 6. Scores

Scored 1 to 10 against the best reference first page in the library (AirTag, AirPods Pro, Anduril, Vention, Form Energy), on the full page, not only the hero. Any score under 9 goes back, with the reason that blocks it.

| Lead | Score | Reason | What blocks 9 |
|---|---|---|---|
| Creative Director | 7 | The hero is the approved frame and the page holds one ground and one grid. But four large empty slots read as an unfinished page next to AirTag's wall-to-wall product pictures. | Model hall stills in screens 2, 3, 4 and 6, and the hero film |
| Head of Words | 9 | Every line is locked and exact, headlines break by meaning, and the IT block is set smaller as asked. | None from the build. Screen 2's H2 runs 4 lines on a 390 phone, which no locked line can avoid |
| Buyer Truth Lead | 7 | Readers get the words, but "where it waits" is still never shown, and screens 2 to 4 ask the reader to imagine the floor. | Camera A pictures, then a cold reader pass on this build |
| Product Render Director | 8 | The CAD stills sit on the page cleanly and sharp, and no part is invented. They are studio shots where the brief asks for the tag on a trolley and the anchor on a column. | In-context renders; the blind 2AFC test |
| Film Director | 6 | There is no film. The hook is clean and costs nothing, but the hero is a still where the story asks for the scene. | The 9 s film |
| Experience Design Lead | 8 | One tree, one label per URL in the bar, panels, sheet, footer, crumbs, JSON-LD and llms.txt. Click/tap panels work with JS off. Stubs close every dead link. | Inner pages still look like the old site under the new bar. The diagnostic does not yet open in place. Tree test not run |
| Design Engineering Lead | 9 | 105 to 292 KB first screen, LCP 1.52 to 1.58 s on slow 4G with 4x CPU, CLS ≤ 0.006, 12 KB CSS inline, no script, works with JS off, no overflow from 320 to 3840. | None under the budget. Watch: LCP lands on the image, not the H1, and there are no hashed assets |
| Search and AI Answers Lead | 8 | The entity text is one paragraph everywhere, the meta matches the hero, llms.txt follows nav order, BreadcrumbList uses nav labels, and SoftwareApplication is truthful. | The homepage misses the number-with-condition heuristic (locked order). The stubs are thin. `operatingSystem` holds a sentence, not an OS |
| Truth and Quality Lead | 9 | No word changed. The stopped "Runs in ..." fact is removed. The interim alts drop the clauses the pictures cannot show. "Simulation" and "Rendered" are gone. | Ruling needed on the cloud deployment ([B5]) and on the start/end association fact in llms.txt |
| Lead Magnet and Growth Lead | 7 | "Plan your first bay" is in every panel, first in the phone sheet, and has its own block on screen 6. But it leaves the page instead of opening in place. | The in-place diagnostic, loaded on click |
| **Mean** | **7.8** | | |

Under 9 (sent back with the reasons above): Creative Director, Buyer Truth, Product Render, Film, Experience Design, Search and AI, and Growth. Five of the seven are blocked by the missing pictures and film. Those are owned outside this build, and the slots and the hook are ready for them.

## Method notes

- Weight: Playwright `response.body()` summed after `networkidle`, per viewport and DPR.
- LCP and CLS: `PerformanceObserver` for `largest-contentful-paint` and `layout-shift`, read after load plus 1.5 s and one scroll.
- Sweep: viewport width from 320 to 3840 in 10 px steps, comparing `scrollWidth` with `innerWidth`.
- Rebuild: from `site/`, run `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`. After a page loses classes, run `python3 tools/prune_css.py dist src/css/site.css`.
