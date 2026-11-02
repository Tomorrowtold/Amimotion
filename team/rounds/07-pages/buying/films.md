# /films/  Films

Squad: buying. Generator: `p_company.py`, `write("/films/", ...)`.

- **Title tag:** Films: one floor, in motion | AmIMotion
- **Meta description:** Short AmIMotion films of one model factory floor from above: where tagged trolleys, tools and vehicles went, and where work waits. Muted, no autoplay.

**Job of the page.** Readers: P1 and P11 (the forwardable cut, kit 09 section 5 "consensus creation"), P2. Question: "Can I show this to my team in under a minute?" Next step: book the call. Best reference: Waymo's and Helion's film pages: one mechanism per film, no talking heads, the frame doing the explaining; and Apple AirTag's habit of one idea per screen.

**Release hold (V103, system notes section 5 item 2).** The four old films (`film(1)` to `film(4)`: find the asset, AMR hand-off, station to station, ask your plant) stay off this page. They show cartoon workers and glowing screens, and would need a label. /films/ ships with the one film that needs none: the hero film cut from the model hall.

**Drafts.** A: keep the four-film grid and hold the page. B: ship the page now with the hero film, a plain account of what the colours mean, and a text version of the film. Picked B: it gives the nav item a working page today, makes no plan look live, and the text version serves screen readers and AI assistants (a muted film has no captions to read).

---

## head(...)

- **H1:** Films.
- **soft:** One floor, in motion.
- **lede:** Short films of one model factory floor, seen from above. Each one shows a single idea, with no sound and nothing to read.
- **short:** AmIMotion's films show one model factory floor from above. Blue lines show where tagged trolleys, tools and vehicles went. Amber marks the trolleys and pallets that are waiting. The first film runs nine seconds: the same floor before and after AmIMotion, from scan ticks at three desks to every path and wait on one live map.
- **trail:** [("Start small", "/start/"), ("Films", None)]
- **media:** `film(...)` full width below the head: the hero film.
  - Shows: the homepage hero film, 9 s, muted, loops when played, camera A locked.
  - Source: `team/rounds/03-hero-film/film/hall-4x5-av1.mp4` and `hall-4x5-h264.mp4` (1:1 crop on phones: `hall-1x1-*`), posters `poster-1x1-*.avif/webp`. Engine room to add it to `film()` as a new entry (it is 4:5, not 16:9; the block needs a 4:5 ratio or the 1:1 cut). Poster first, `preload="none"`, controls, no autoplay.
  - Alt / `aria-label`: "A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. Three trolleys at inspection and one pallet in a staging lane are marked amber because they are waiting."

## section 1: `vp("What you are looking at.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Blue | Where a tagged thing went. An AmIGo tag sends a short UWB pulse as it moves, and AmIMo anchors on the columns hear it. |
| Amber | Where work waits. AmIHub notes when each trolley or pallet enters a zone and when it leaves, so you see a wait while it is still a wait. |
| Pale | Everything nobody has tagged. |

Picture: none.

## section 2: `vp("The nine seconds, in words.")` + `prose(html)`

1. The film opens on the floor as AmIMotion shows it. Blue trails run behind every moving thing: the tugger's train, the forklift, an AMR, a trolley leaving the press. Three trolleys in the inspection queue and one pallet in the staging lane stand on amber.
2. At two seconds the colour goes. This is the floor as most plants see it. At three checkpoint desks, a short blue tick appears as a trolley passes. Nothing marks the path between desks. One trolley passes a desk, turns behind the racks and stops. No mark follows it.
3. Then the ticks join into lines, one kind of thing at a time: trolleys, bins and a fixture, the tool cart, the forklift and tugger, the AMR. The three trolleys and the pallet take their amber again. At nine seconds the frame is back where it began.

Picture: none.

## section 3: `vp("The same stories, on their own pages.")` + `links(...)`

| href | Title (nav label) | Line |
|---|---|---|
| /use-cases/find-the-asset/ | Where is that trolley? | The one that turned behind the racks. |
| /solutions/wip/ | Work in progress | The three trolleys waiting at inspection. |
| /use-cases/ask-your-plant/ | Ask your floor | A question, answered from the live map. |
| /technology/ | How it locates a tag | How a pulse becomes a place. |

## close

`close("See it on your own floor.", "The AmIMotion call is a live demo on real AmIHub data, not slides.", (("Book a call", "/contact/"),))`

## FAQ

None.

## Internal links

/start/, /use-cases/find-the-asset/, /solutions/wip/, /use-cases/ask-your-plant/, /technology/, /contact/.

## JSON-LD notes

`VideoObject`: `name` "Where work is. Where it waits.", `description` = the alt text, `thumbnailUrl` the 1600 poster, `contentUrl` the H.264 file, `duration` "PT9S", `uploadDate` set at release, `publisher` Organization `@id`. `transcript` = section 2's three paragraphs (schema.org `transcript` on VideoObject). `BreadcrumbList` (Home > Start small > Films). Remove the four old `VideoObject`s with the old films.

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P1 Plant head | 8 | "Four short films about one plant" (old) when only one plays | Page now promises one film and lists no future titles | 9 |
| P11 Promoter or MD | 9 | none | | 9 |
| P2 Production control | 9 | none | | 9 |

Mean 9.0.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| Film content and alt | PASS | homepage V7, V8 (AMR shown for location only) |
| Pulse on motion, anchors on columns | PASS | V50, V4 |
| Zone entry and exit | PASS | V21 |
| "the floor as most plants see it" | PASS on AMBER | [CW] "Between scans at each checkpoint, work moves and waits out of sight" (V10). Names no technology as failing (K03 NEVER on "fail"). |
| No "Simulation", "rendered", "3D illustration" | PASS | Shiv 1 Nov; AGENTS.md. "Model factory floor" is the homepage's own alt wording. |
| "More films will follow" | Not written | Plans are plans; no future titles shown |
| Old four films | Held | V103 |

**Open facts used.** none.
**Word count:** about 520.
