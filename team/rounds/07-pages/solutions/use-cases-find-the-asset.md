# /use-cases/find-the-asset/  (nav: Where is that trolley?, line "Find it from a screen")

Generator: `p_solutions.py`, UC row "find-the-asset". Head media changes from `film(1)` to a model-hall still (README, decision 1). No `tone="dark"`.

- **Title tag:** Find a trolley or tool from a screen
- **Meta description (129):** Find a tagged trolley, tool or bin on AmIMotion's live map instead of walking the hall. You see where it was last seen, and when.

## Page

### head(...)
- **H1:** "Where is that trolley?" / soft: "Look it up."
- **Lede:** Today someone walks the hall to find it. With an AmIGo tag on it, the trolley is a place on AmIHub's map.
- **short:** With AmIMotion, every tagged trolley, bin, tool and fixture shows on one live map in AmIHub. AmIMo anchors place each tag down to ±10 cm, depending on your floor. You see where it is, or where it was last seen and when. Finding one starts with a search, not a walk.
- **trail:** [("Use cases", "/use-cases/"), ("Where is that trolley?", None)]
- **links line:** Tools and vehicles (/solutions/assets/)
- **media:** `slot(brief, "wide", alt)`, P-UC1-01. The homepage screen 2 still, recut 16:9: camera A, `--state after`, isolate pass, border `0.25,0.95,0.30,0.85`. The press line on the left, the racks on the right. Everything pale except one trolley stopped behind the racks, on a blue floor tint. Its one blue trail runs from the press and ends where it stands. No UI, no phone, no numbers.
  Alt: the homepage screen 2 alt, "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped."

### section 1
- `vp("Today,", "and with AmIMotion.")`
- `tiles([...], cols=2)`:
  - **Today.** A worker needs one trolley. Nobody knows where it is. Someone walks the hall, calls stores and checks a clipboard. Then walks again.
  - **With AmIMotion.** The worker looks it up in AmIHub. The map shows the zone, and when the trolley was last seen. The worker walks straight there.

### section 2
- `vp("How a trolley", "stays findable.")`
- `steps([...])`:
  1. **It moves.** The AmIGo tag sends a short UWB pulse as the trolley moves. Nobody scans it.
  2. **Anchors hear it.** AmIMo anchors on your columns record when each pulse arrives, and the angle it came from.
  3. **AmIHub places it.** AmIHub works out where the tag is and puts it on the live map.
  4. **It stops.** The tag sleeps. AmIHub keeps its last-seen place and time.

### section 3
- `vp("Measure the walk", "first.", lede="Count how long your team spends searching today. Then you can show what AmIMotion changed, in your own numbers, not ours.")`
- `tiles([...], cols=3)`:
  - **Who searches.** Supervisors, material coordinators, drivers. Count the people who go looking.
  - **How often.** Count the searches in one shift, for one kind of thing: trolleys, fixtures or bins.
  - **How long.** Time a few searches from the first question to the find. That is your baseline.
- `more([("Time spent searching", "/tools/search-time/"), ("Measure before you claim", "/learn/pilot-baseline/")])`

### section 4
- `faq([...], "Common questions.")`
  - **Does anyone scan the trolley to find it?** No. AmIMo anchors hear its AmIGo tag whenever it moves. At rest, AmIHub keeps its last-seen place.
  - **What if a tag goes quiet?** AmIHub shows where and when it was last seen. It does not guess where the trolley is now.
  - **What else can carry a tag?** Bins, kit racks, fixtures, tool carts, forklifts and tuggers. Each one gets its own AmIGo tag in AmIHub.
  - **How close does it place the trolley?** Down to ±10 cm with AmIMo anchors. How close depends on your floor, so the survey checks it.

### section 5
- `vp("Other jobs,", "same tags.")`
- `links([...])`:
  - /use-cases/station-to-station/ · Station to station · "Every entry and exit, timed."
  - /use-cases/amr-hand-off/ · The hand-off · "What the robot brought, and when."
  - /use-cases/ask-your-plant/ · Ask your floor · "AI assistants and MCP."

### close
- Custom: `close("What does searching cost you?", "Put in your own figures. AmIMotion assumes no savings.", (("Time spent searching", "/tools/search-time/"),))`

## Internal links
/solutions/assets/, /tools/search-time/, /learn/pilot-baseline/, the three other use cases.

## JSON-LD notes
- WebPage, `description` = meta. Drop the VideoObject while the film is held.
- BreadcrumbList: Home > Use cases > Where is that trolley?
- FAQPage, four rows.

## Checks
- **Job:** P4 supervisor, from homepage screen 2's link "Where is that trolley?". Question: "will this save me the walk?" Next: the search-time calculator. Reference: Apple AirTag (one find, one screen). We beat it on the baseline section: no reference page asks the buyer to measure before believing.
- **Drafts:** A (factory-floor voice) kept today's film page with the before and after. B (answer writer) added the steps and the baseline. **Merged**: A's before and after (it says back in one read), B's steps and baseline. The page moves from about 130 words to about 470.
- **Readers:** P4 supervisor 9 → 9. P2 production control 8 → 9 (asked "how do I show the boss it helped?": section 3). P1 plant head 8 → 9 (lost on the cartoon film poster: replaced by the model-hall still).
- **Claims:** "Then walks again" PASS (homepage "The second walk", V11, a question of habit, no claim). "records when each pulse arrives, and the angle it came from" PASS on AMBER (V55). "AmIHub keeps its last-seen place and time" PASS (V51). "AmIMotion assumes no savings" PASS (the calculator's own description). No phone (O1).
- **Open facts used:** O1 safe line. Not O2, O3, O4, O6.
- **Words:** about 470 visible.
