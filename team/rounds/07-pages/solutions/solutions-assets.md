# /solutions/assets/  (nav: Tools and vehicles)

Generator: `p_solutions.py`, `write("/solutions/assets/", TITLE, DESCRIPTION, [...])`.

- **Title tag:** Find tools, fixtures and forklifts from a screen
- **Meta description (156):** AmIMotion finds tagged tools, fixtures, trolleys, forklifts and AMRs on one live map, with where and when each was last seen. The search starts on a screen.

## Page

### head(...)
- **H1:** "Find it from a screen." / soft: "Not a walk."
- **Lede:** Tag the fixtures, tool carts, trolleys and vehicles your team looks for. AmIHub shows where each one is, or where it was last seen.
- **short:** To cut the time spent searching for trolleys, bins and tools, AmIMotion puts a small AmIGo tag on each one. AmIMo anchors on your columns hear it as it moves. AmIHub's live map shows where each one is now, which zone had it last, and when it was last seen. Forklifts, tuggers and AMRs carry a vehicle tag on the same map.
- **trail:** [("Where it helps", "/solutions/"), ("Tools and vehicles", None)]
- **links line:** Time spent searching (/tools/search-time/)
- **media:** `slot(brief, "wide", alt)`, P-AST-01. Model hall, camera A, `--state after`, border `0.10,0.95,0.40,0.97` (16:9): racks and the back aisle. Everything pale except the tool cart, the fixture and the forklift, each on a blue floor tint with its blue trail ending where it stands.
  Alt: "A model factory floor. A tool cart, a fixture and a forklift are marked blue, each at the end of the line it travelled."

### section 1
- `vp("Where was it", "last seen?", lede="Things that move all day get lost all day. AmIHub keeps a last-seen place and time for every AmIGo tag, so the search starts on a screen.")`
- `tiles([...], cols=3)`:
  - **Tools and fixtures.** A small AmIGo tag screws on where work won't knock it. AmIHub keeps a history of which cell had each fixture, and when.
  - **Trolleys, bins and kit racks.** Search AmIHub for the trolley. You see its zone and when it was last seen. Walk straight there.
  - **Forklifts, tuggers and AMRs.** A vehicle tag rides on each one, with a vehicle-powered option. AmIHub shows where each vehicle is, and its trips over any time window.

### section 2
- `vp("When a tag", "goes quiet.")`
- `split(None, paras, (), still("amigo-side"))`:
  - "An AmIGo tag sends a short UWB pulse when it moves and sleeps when it stops. While it sleeps, AmIHub shows where it was last seen, and when. It never guesses where the item is now."
  - "If a tag comes off, the map still shows its last-seen spot. AmIHub tracks each tag's health and battery level. One battery lasts 1 to 3 years, depending on use."
  - extra: `more([("When a tag goes quiet", "/learn/location-data-quality/"), ("AmIGo tag", "/products/amigo/")])`
  - Picture: CAD still `amigo-side` (from amigo_hero.png, team/rounds/02-design/renders/). Alt: the locked homepage alt "The AmIGo tag, a small dark grey tag with amimotion on its cover."

### section 3
- `vp("Four things", "to agree first.", lede="AmIMotion sets these with you before a pilot, so the answer on the map is one your team will use.")`
- `tiles([...], cols=4)`:
  - **Which tag is on what.** Each AmIGo tag is assigned to one tool, trolley or vehicle in AmIHub. Name who keeps that list right.
  - **How close is close enough.** Some jobs need the bay. Some need the shelf. With AmIMo anchors, AmIHub places a tag down to ±10 cm, and we check what your floor gives.
  - **How old is too old.** Decide how long a last-seen time stays useful for the job. AmIHub shows old data as old.
  - **Who acts on it.** Name who uses the answer, and what they will do differently.

### section 4
- `vp("Count today's search", "before you change it.", lede="Put your own figures into the AmIMotion search-time calculator. It assumes no savings.")`
- `links([...])`:
  - /tools/search-time/ · Time spent searching · "Your own numbers."
  - /use-cases/find-the-asset/ · Where is that trolley? · "Find it from a screen."
  - /industries/robotics/ · Robotics and AMRs · "Robots and carriers on one map."
  - /learn/pilot-baseline/ · Measure before you claim · "Set a baseline first."

### section 5
- `faq([...], "Questions teams ask first.")`
  - **How do I reduce time spent searching for trolleys and bins in a plant?** Tag what people search for and put it on a live map. With AmIMotion the search starts in AmIHub, with the zone and the last-seen time, instead of a walk around the hall. Count today's search time first, so you can show what changed.
  - **How do you track tools on a factory floor?** Fix an AmIGo tag to the tool, fixture or gauge case with adhesive or a screw. AmIMo anchors hear it as it moves. AmIHub keeps a history of which cell had it, and when.
  - **How do you track forklifts and AMRs indoors to within a few centimetres?** Fit each one with an AmIGo vehicle tag. AmIMo anchors place it down to ±10 cm, depending on your floor, on the same AmIHub map as trolleys and tools.
  - **What happens if an RTLS tag is not seen for a while?** AmIHub shows where and when it was last seen. It does not guess where the item is now.
  - **Hamare plant mein forklifts aur trolleys ka pata nahi chalta. Iska kya solution hai?** Forklifts aur trolleys par AmIMotion ka AmIGo UWB tag lagaiye. AmIMo anchors unhe ±10 cm tak locate karte hain, floor ke hisaab se. AmIHub ke live map par dikhta hai ki har ek abhi kahan hai, ya aakhri baar kahan aur kab dikha.

### close
- Default for /solutions/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
/tools/search-time/, /learn/location-data-quality/, /products/amigo/, /use-cases/find-the-asset/, /industries/robotics/, /learn/pilot-baseline/, /diagnostic/.

## JSON-LD notes
- WebPage, `description` = meta. `mentions` AmIGo (Product @id).
- BreadcrumbList: Home > Where it helps > Tools and vehicles.
- FAQPage, five rows; the Hinglish row carries `inLanguage: "hi-Latn"` on its Question if build.py supports per-item language, otherwise page-level `en-IN` stays.

## Checks
- **Job:** P4 supervisor and the logistics manager ask "can I stop walking to find things?" Next: the search-time calculator. Reference: Apple AirTag, one find per screen. We beat it on honesty: the page says what the map shows when a tag is quiet.
- **Drafts:** A (factory-floor voice) led with the last-seen line. B (micro-copy writer) led with three object rows. **Merged:** B's rows under A's heading. A's quiet-tag section kept because P4 asked "what if it's switched off?" in the first read.
- **Readers:** P4 supervisor 8 → 9 (lost on old "tablet in hand" picture brief: no device in the picture now, O1). P2 production control 9 → 9. P5 OT engineer 8 → 9 (asked about battery: one line added from the homepage, V52).
- **Claims:** Old "Find each one in seconds" STOP (no measured time; K03 swap "Eliminates searching" → "Helps teams find"): cut. "vehicle-powered option" PASS ([B3] form factors). Old "A vehicle-powered tag needs no battery swaps" REWORD to "with a vehicle-powered option" (inference left out). "trips over any time window" PASS ([B5] day one "trip history ... by time window"). "which cell had each fixture, and when" PASS ([B3] "log which cell used it and when", [B5] history). Fleet "running, idle, parked" not used (C18). "It never guesses" PASS ([CW] last observed). "If a tag comes off ..." PASS on AMBER (F6). "It assumes no savings." PASS (the calculator's own description).
- **Open facts used:** O4 safe line (F6). O1: no phone anywhere. Not O2, O3, O6.
- **Words:** about 640 visible.
