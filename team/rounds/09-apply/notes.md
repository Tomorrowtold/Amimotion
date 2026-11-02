# Round 09: round 07 copy applied to the site build

2 Nov 2026. Branch `claude/project-thread-lg8bk2`, committed locally, not pushed. Inputs: `team/rounds/07-pages/{product,solutions,buying,learn}` (copy and READMEs), `team/rounds/08-pictures/stills-index.md`, `team/rounds/05-inner-pages/system-notes.md`.

## What was applied

| Group | Generator | Pages | Notes |
|---|---|---|---|
| Product (9) | `p_platform.py` (now also /technology/, /specs/, /developers/, /what-is-amimotion/, /industrial-spatial-intelligence/; `p_eval.py` removed) | /platform/, /products/amigo/, /products/amimo/, /products/amihub/, /technology/, /specs/, /developers/, /what-is-amimotion/, /industrial-spatial-intelligence/ | Copy word for word. og images on AmIGo and AmIMo now use the `/assets/home/` ladders. /what-is-amimotion/ facts list uses the F3 line in place of the association fact. `pair` ladder on /specs/. |
| Solutions (12) | `p_solutions.py` | /solutions/, /solutions/wip/, /solutions/assets/, /industries/ + 3, /use-cases/ + 4 | README decisions 1 to 5 applied: no films or VideoObject on the use-case pages, no `tone`, nav-label crumbs, the two custom closes, one canonical answer per panel question. Slot codes P-SOL-01 to P-UC4-01 kept. |
| Buying (15) | `p_company.py` | /start/, /pilot/, /how-to-buy/, /diagnostic/, /tools/ + 3, /contact/, /company/, /trust/, /trust/people/, /privacy/, /films/, /404 | Tool form markup kept, its strings changed as each file says (anchors: "First range", "Lowest count this tool gives"; search: "Full-time people, at 8 h a day"). Body links added where the files name them. |
| Learn (18) | `p_learn.py` = `learn/learn_pages.py` | /learn/ + 14 guides, /glossary/, /faq/, /resources/ | /resources/, /faq/, /glossary/, `FAQS` and `TERMS` deleted from `p_company.py`. 39 terms. /films/ not in /resources/. |

Binding STOPs in the tools:
- `tools.js` T1 to T4: the pilot brief now lists "The zones that matter, named in your own words.", "Who on your team acts when work waits too long.", "How to count a wait that runs past shift end." and, when no link exists, "How a job is linked to its trolley, in AmIHub or from your own system." No time limit, no "limit is passed".
- `diagnostic.js` D1 to D7 (and D8): the People option, its map dots and the "people badges" lead are gone; "counted the way your team agrees" / "agree how a wait is counted"; "That scan can link the job to its trolley in AmIHub."; "Then AmIHub can take the link from your own system."; "The AmIMotion team replies by email. No newsletter."; the "Last scan: leaving Cell 2" stamp box is gone (note "Last scan, not the place" only); the mono labels are `h4` in the text face and "Take it further" is dropped; D8 "You hear about it when it is already late." The no-JS line says "This plan needs JavaScript." D9 needs no change while `leadEndpoint` is empty.

Site-wide:
- "tens of picoseconds": no longer anywhere in `site/` (it lived only in the old /platform/ know-more).
- Share images: no page points at a retired `/assets/img/` still. The build's default `og` (and Product image fallback) was `/assets/img/og.jpg`, a file that does not exist; it is now `/assets/home/og-home.jpg`.
- VideoObject: none on any page (the four use-case films are out; /films/ has no `<video>` yet, see below).
- `entity.json`: the association fact ("...through an association with a start and an end", V108) is replaced by "Location alone does not show which job is on a carrier. You link each carrier to its job, in AmIHub or from your own system." It feeds llms.txt and llms-full.txt.
- JSON-LD (`build.py`): BreadcrumbList now follows the visible trail (Home > Start small > How a pilot runs, not the URL folders); AboutPage on /company/ and /what-is-amimotion/, ContactPage on /contact/, CollectionPage on the four hubs and /tools/; WebApplication on the three tools and /diagnostic/; DefinedTerm on /industrial-spatial-intelligence/; Organization gains `founder` (Kaushal Kukkar, Founder and CEO), `employee` (plus Vivek Dham, CTO) and a sales `contactPoint`, and loses `areaServed` (regions open).
- `tools/panel.json`: U25 accepts `FiRa.*specification|built on`; B03 accepts `built on|specification`; B05 accepts `typical|depends on (your|the) (floor|site)|site-dependent`.

Pictures:
- `lib.py` gains `STILLS["pair"]` (the ladder is in `/assets/home/`) and `hall()` / `hallslot()`: a slot names its round 08 base and becomes the AVIF/WebP ladder as soon as `site/src/assets/hall/<base>-1600.webp` exists. `build.py` now ships `assets/hall`. Every base in the stills index is wired (solutions P-codes, product heads and sections, buying heads and sections, learn L02, L04 to L07; the /use-cases/ cards use the nearest 4:3 cuts: hall-find-43, hall-path-43, hall-dropoff-43, hall-ask-43). Alts follow the index, including the new "find" alt (note 1) and the P-SOL-03 bins.
- Shipping now: `pair` on /specs/, /company/ and /learn/rtls/ (L01); the plain CAD stills on the AmIGo and AmIMo 4:3 sections (index note 2).
- At the time of writing `site/src/assets/hall/` is empty, so every hall picture is still its reserved slot. Re-run `python3 tools/pagegen/run.py && python3 build.py` once the ladders land; no code change is needed.

## Not applied, or applied differently, and why

1. **Three titles over 65 with the suffix** (`write()` asserts it). Trimmed: "AmIHub software: live map, zone events and open APIs", "AmIHub for developers: REST, MQTT, WebSocket and MCP", "What is industrial spatial intelligence?".
2. **"certified" FAQ questions on /trust/ and /how-to-buy/.** The crawler bars a bare "certified" (2 barred claims). Reworded as the learn squad did, then to "Does AmIMotion hold a formal certification?" on /trust/, /how-to-buy/ and /specs/, so four near-identical omlox answers stop crowding out /learn/omlox/ for U16 "What is omlox?". /specs/ also drops its last sentence "AmIHub has an omlox hub interface." (the Interfaces row already says it). Answers otherwise unchanged.
3. **/tools/ section 1** is rendered as linked points (`tiles`) instead of a related-pages `links()` nav: same words, but the crawler reads nav as navigation and the page fell to 224 words. Now 290.
4. **/films/**: the hero film needs a 4:5 or 1:1 entry in `film()` and the video files, which are not in `site/src/assets/home/hero-film/` yet (posters only). The head keeps a 1:1 slot naming the film; no VideoObject until the `<video>` exists. /films/ also stays held (V103).
5. **/privacy/** "Last updated: [date set at release]" ships as "Last updated: 2 November 2026." Change it at release.
6. **How-to-buy parts row**: the fourth card ("Survey and plan") has no picture; `cards()` takes it as a text card.
7. **JSON-LD items not built**: ItemList nodes on the hubs, the Product `@id` references from /platform/ and /specs/, HowTo on /pilot/, transcript VideoObject on /films/. Optional in the READMEs; left for the Search lead.
8. **Founder facts** (all READMEs' blocked lists): the safe lines ship; nothing invented.

## Measurements

From `site/`: `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`.

| Check | Result |
|---|---|
| Pages built | 55 |
| Barred claims | 0 |
| Unbranded questions pickable | 38/38 |
| Branded questions answerable | 9/10 (B02 "What does AmIMotion do?" ranks the learn squad's short certification answers first on the single token "AmIMotion"; same 9/10 the learn squad reported) |
| Canonical answer pages that exist | 48/48 |
| Crawler checks | 731/756 (round 05: 687; learn squad scratch run: 703) |
| Site files | 7/8 (robots does not welcome AI crawlers: review build, by design) |
| Pages under 250 words | none except /404 (lowest: /learn/ 278, /tools/ 290) |
| Horizontal scroll, 390 and 1440 | none on all 55 pages; no page errors (Playwright, Chrome) |
| JS off | /platform/, /solutions/wip/, /pilot/, /tools/anchors/: H1 and body text show, 0 elements at opacity 0, `<details>` open on click, no overflow at 390 |
| Tools | /tools/pilot/ brief shows T1 to T4; /diagnostic/ runs six questions to a result with the new strings, no errors |
