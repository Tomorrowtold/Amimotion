# Higgsfield prompt pack: AmIMotion films and stills

Round 16 · revision 3 · film and picture direction · for Shiv to paste into Higgsfield by hand (Chrome on the Mac), one item at a time · 2 Nov 2026

## At a glance

- **Budget: 300 credits, no Unlimited.** Planned spend **294 credits**: films 180 (six Kling 3.0 clips of 5 s at 4K, 30 each) and stills 114 (Nano Banana Pro at 2K, 2 each, one image per run). 6 credits stay in reserve. The strict run order with a running total is at the end; stop when it says stop.
- **3 films:** F1 homepage film (11 s seamless loop, separate 16:9 and 9:16 masters, ends top-down for the hand-over to the live map), F2 /solutions/wip/ (queue at inspection), F6 homepage #waits (scroll-scrubbed waiting time-lapse). F3, F4, F5 and F7 are written but deferred; their pages get a still instead.
- **36 page stills + 3 close-ups**, each unique to its page, plus **3 reference plates** (C0 plant, C1 supervisor, C5 trolley) that are never placed.
- **Every item has its settings line directly above its prompt.** Set the controls, paste the prompt block, generate. Sound OFF on every clip.

## Study alignment

Checked against `team/rounds/16-higgsfield/study.md` (how the 100 reference sites use pictures and films). What changed, law by law:

- **Hero film (L2, L14, L19).** F1 is now an 11 s muted loop (study range 11-17 s; one more second of the ground clip makes it 12 if the edit wants it). Frame 0 is the poster and the last frame is the same frame, because the top-down clip F1-T starts and ends on one keyframe and is used at both ends of the edit. Encode target <= 3 MB (16:9) and <= 2.5 MB (9:16), poster AVIF <= 150 KB.
- **Phone master (L3).** F1 gets its own 9:16 generation (F1-T-9x16, F1-G-9x16) with the subject in the upper 60% and calm floor in the lower 40% for the map strip (Move 6). Under the budget, F2 and F6 are 16:9 only, composed crop-safe (story inside the centre 45%).
- **People act, never pose (L9, prompt rule 4).** Every person prompt now says *does not speak*, *neutral face*, *does not look at the camera*. The reference's "smiles slightly to herself, relieved" became an action: *exhales*. Faces get only the room light: *no beauty light*.
- **Wardrobe (prompt rule 5).** e142 grew a chest wordmark despite the ban. The jacket is now *a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text*, repeated word for word in every prompt, and the closing block bans embroidery, chest print and badge text on any clothing.
- **Props locked (prompt rule 6).** The trolley is one spec sentence reused verbatim in every prompt (*two-tier steel WIP trolley, about 1200 by 800 mm, one rounded tubular push handle across its short end, four grey castors*), the closing block says the handle never changes shape, and the load varies (*small casting variations, a few with blue protective caps*) so parts do not look cloned.
- **Real light and wear (prompt rules 1-3).** Camera named physically (lens, T-stop, 1/50 shutter, 24 fps); light from real sources (*clerestory daylight from camera left, 5000K LED bays, green-grey bounce from the epoxy*); wear written in (*scuffed rack feet, chipped floor paint, dust on the housings*); India detail (*rolling shutter doors, a ceiling fan over the office mezzanine, mixed-age workforce, plain lime hi-vis on some*).
- **Moves 1-3 (study section 5).** F1-T is locked off with clear floor round the parked trolley, so the map can take over in the same frame (Move 1). F6 is one locked-off time-lapse with clear floor for the live wait counter (Move 2). P-contact, P-products-amigo and P-trust-people leave a clean, sharp rail for the real CAD tag (Move 3); P-home-close is the top-down ground for the 'your floor' simulator (Move 8).
- **One grade per page (L11, prompt rule 11).** Prompts ask for neutral daylight; one LUT goes over every asset in post, plus 3-4% 35 mm grain. Grade: neutral-cool highlights (to sit on the #f0f6ff page), grey-green shadows, no teal-orange. Brand colour (blue, amber) lives only in the UI layer.
- **Text-safe third (L13).** Every item names its text zone. No text over a face or the trolley; bottom-edge scrim only.
- **Close-ups (L10).** Three macros where pages lacked craft: M-solutions-wip (hand on the handle), M-industries (the part itself), M-products-amimo (cable to a concrete column, CAD composite). More macros are the first thing to add when credits allow.
- **Visual counts (L12).** placements.md lists visuals before and after per page. Many guide pages stay at 1-2 visuals; that is the next round's gap, not filled with filler here. The homepage is at the top of the 10-visual limit; one model-hall repeat should go.
- **Mechanism (L7).** No AI footage of how UWB works; /technology/ keeps its line drawing and the browser draws timing.
- **Where we did not follow the study, and why.**
  - *Orange rack beams* (rule 9): rejected. Amber is the site's 'waiting' colour, so the racking stays grey per the continuity bible.
  - *Numbers on pictures* (L8) such as the study's "14 min" example: only figures already on the site may be set on a frame; no new figure is invented.
  - *About page = real photographs* (pattern table): P-company shows hands only, no face; real team photographs stay owed.
  - *Pilot kit photo* (pattern table): deferred. It needs the real hardware readable, so it is a CAD composite job for the render team, not Higgsfield.
  - *AmIHub screen inside footage*: never. UI is drawn by the browser over locked-off frames, not generated.
  - *"Ultra-realistic" opening line*: kept from the proven reference prompt; the study's banned words (8K, hyperreal, ultra-detailed) are not used.

## Hard rules (every item)

- The AmIGo tag and AmIMo anchor are never drawn by AI in a readable way. At most *a small dark tag on the trolley's top rail, soft in focus*. Where the product must read, the prompt leaves a clean empty spot and we composite the real CAD render (`site/src/assets/home/amigo-*.avif`, `amimo-page-*.avif`, the CAD stills) in post or in the browser.
- No text, signs, labels, numbers, logos, screens or UI in any frame. No glow. No brand marks on clothing. No customer or partner names.
- Tags go on things, never on people; nothing implies a person is followed.
- No claim beyond the site copy: no robot dispatched by software, no map on a screen, nothing implying job identity is automatic.
- Daylight, bright, not moody. No large orange or amber objects; the yellow aisle lines stay.
- These are illustrative scenes of a generic plant, never presented as a customer site.
- Reject a take for any one of: readable text or a logo, a chest mark, an eye-line to the lens, someone talking, a handle that changes shape, a readable device, repeated background faces (study rule 12).

## Continuity bible

**Structure (from `ref_e142_prompt.txt`).** One opening style line (camera, lens, T-stop, shutter, grain, colour, mood); `SHOT n - a to b seconds:` with camera height and one move; `HARD CUT at x seconds.` between shots; the closing negative block. Under the budget every Kling clip is one 5 s shot, and the hard cuts happen in the edit.

**The plant:** *a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor*. Supporting details: roof trusses, grey castors, stacks of empty grey plastic crates, dark granite inspection tables, painted yellow rectangles for queues and staging lanes, machined aluminium housings on every shelf.

**The trolley (verbatim in every prompt):** *a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps*.

**The people (nobody looks at the camera; nobody speaks):**
- Supervisor, the lead: *a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card*. Plate C1.
- Production planner (PPC): *a production planner, an Indian man in his late twenties, slim, with short black hair and thin rimless glasses, wearing a plain unbranded light blue full-sleeve shirt with no chest print tucked into charcoal trousers, black safety shoes, a plain blue lanyard with a blank white card*.
- Plant head: *the plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card*.
- Field engineer (AmIMotion; the green visitor lanyard marks the supplier): *a field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card*.
- Operators: *plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering*.

**Lenses:** 50mm at chest height is the house shot (the reference); 35mm for rooms and wides; 85-100mm macro for hands and composite plates. One camera move per shot: locked off, dolly back at walking pace, or a slow push-in.

### Reference plates (make first; upload as image references)

#### C0 · Plant world plate  ·  2 credits

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

An empty main aisle at mid-morning inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. The aisle runs straight away from the camera between two rows of racking; a cross aisle meets it halfway. Three loaded trolleys stand parked along the right-hand rack. Roof trusses and steel columns recede into a gentle haze. Camera at chest height, level, centred on the aisle. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

#### C1 · Supervisor (the recurring lead)  ·  2 credits

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:4 · Resolution 2K · Images per run 1 · Image references: ref_e142_sheet.jpg (face and build only; the jacket's chest mark is a known fault, do not copy it) · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 85mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Full-length three-quarter profile of a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card. She walks along a rack aisle inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, looking ahead along the aisle and slightly to her left, one hand loose at her side. The jacket front is completely plain navy fabric.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

#### C5 · The trolley (prop sheet)  ·  2 credits

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0, frame 1 of ref_e142_sheet.jpg (the trolley); add amigo-side CAD render as a second reference only if the model keeps inventing a device · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

One loaded trolley parked on its own on the grey epoxy floor of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, seen from a three-quarter front angle at handle height, the rounded tubular push handle clearly on its short end, nothing fixed to its rails. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

## A. Films

Kling 3.0, 4K mode, 5 s, Sound OFF, 30 credits per clip. Each clip starts from a Nano Banana Pro keyframe (2 credits), which also gives the poster. Nothing here uses Seedance.

### F1 · / (homepage)

- **Slot:** site/src/pages/index.html, section.spec: the existing figure.film (data-src /assets/home/hero-film/hall, today the 9 s model-hall film). F1 plays first; on its last frame the figure hands over (Move 1) to the model-hall film and live map in the same frame. The model film stays as the reduced-motion fallback.
- **Why here:** The homepage film: the visitor sees a real floor first, from above, then the search on the ground, then the same view from above becomes our map. Moved from #waits (round 16 brief) to the existing film slot because the study's hero law (L2, L6) wants the one full-bleed film to hand over to the product; #waits gets the scrubbed time-lapse F6 instead.
- **Purpose:** Where work is, where it waits: from above, one trolley waits out of sight; on the ground, the supervisor searches the wrong rows; from above again, the floor turns into the live map.
- **Model:** Kling 3.0, 4K, two 5 s clips per orientation (top-down clip used twice in the edit)  ·  **Credits:** 120 = 16:9 (30 + 30) + 9:16 (30 + 30). Keyframes 4 x 2 = 8, counted with the stills.
- **Length and aspect:** 11 s on the page. Separate 9:16 master (study L3); never a centre crop.
- **First frame / poster:** the bay from above, one trolley parked behind a rack, the aisle busy (works as the poster and as the map's twin).
- **Last frame:** identical to the first frame (seamless loop); on the site this is where the live map takes over.
- **UI landing (Moves 1-3):** Locked-off shots 1 and 3. The UI (trolley dot, wait time, zone outline) lands on the clear floor around the parked trolley. The model-hall camera must be matched to this framing for the handover.
- **Text zone:** Headline in the top-left third over the racking roofs (no faces, no trolley there). Phone: text sits over the calm bottom 40%, or the live map strip takes it (Move 6).
- **CAD composite:** No for the master. Move 3 in the browser can place the CAD tag on the parked trolley's rail in shots 1 and 3.
- **Edit and encode:** Edit (11 s, hard cuts, seamless loop): F1-T 0.0-3.0 s (aisle only) -> HARD CUT -> F1-G 0.0-5.0 s (the search on the ground) -> HARD CUT -> F1-T 2.0-5.0 s (from above, she walks past the gap). Because F1-T starts and ends on the same keyframe, the film's last frame is its first frame (L14) and the loop is seamless; that same top-down frame is where the live map takes over (Move 1). Same edit for the 9:16 master. Encode: 1080p, 24 fps, H.264 CRF ~28 plus AV1; target <= 3 MB for 16:9 and <= 2.5 MB for 9:16; poster = AVIF of frame 0, <= 150 KB.

**F1-T-kf · keyframe for F1-T  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A locked-off high view from about eleven metres up, looking almost straight down onto one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: two rack rows, the main aisle with its yellow lines running across the frame, and, in a gap behind the far rack row, one loaded trolley parked and still. The floor around the parked trolley is clear and unoccluded. A few small figures in plain workwear in the main aisle. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F1-T · Top-down clip, 16:9 (used for shot 1 and shot 3)  ·  30 credits**

```
Model: Kling 3.0 · Mode 4k · Sound OFF · Aspect 16:9 · Duration 5 s · Start frame F1-T-kf · End frame F1-T-kf · Multi-shot OFF · Cost 30 credits
```

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 5 seconds: a locked-off high view from about eleven metres up, looking almost straight down onto one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: two rack rows, the main aisle with its yellow lines running across the frame, and, in a gap behind the far rack row, one loaded trolley parked and still. The floor around the parked trolley is clear and unoccluded. In the first two seconds a few small figures in plain workwear walk along the main aisle and pass the end of the gap without turning. From the third second a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card, small in the frame, walks along the main aisle, past the end of the gap without turning, and on out of frame. The camera does not move. The last frame matches the first frame.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

**F1-G-kf · keyframe for F1-G  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C1 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor at chest height. A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card walks toward the camera in the centre of the aisle, mid-step, glancing off to her left down a rack row, searching.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F1-G · Ground clip, 16:9 (shot 2)  ·  30 credits**

```
Model: Kling 3.0 · Mode 4k · Sound OFF · Aspect 16:9 · Duration 5 s · Start frame F1-G-kf · End frame none · Multi-shot OFF · Cost 30 credits
```

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 50mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 5 seconds: a medium shot at chest height in the main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card walks toward the camera at a brisk pace, glancing left down one rack row and then right down another, searching. She does not speak. The camera dollies back at her walking pace. At a cross aisle she slows, looks down the wrong row, then walks on, her eyes off to the side of the frame.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

**F1-T-9x16-kf · keyframe for F1-T-9x16  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 9:16 · Resolution 2K · Images per run 1 · Image references: C0, C5, F1-T-kf · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Vertical frame. A locked-off high view from about eleven metres up, looking almost straight down onto one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: two rack rows, the main aisle with its yellow lines running across the frame, and, in a gap behind the far rack row, one loaded trolley parked and still. The floor around the parked trolley is clear and unoccluded, the main aisle running up the frame, the parked trolley in the upper half, the lower 40% clear epoxy floor. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F1-T-9x16 · Top-down clip, 9:16 phone master  ·  30 credits**

```
Model: Kling 3.0 · Mode 4k · Sound OFF · Aspect 9:16 · Duration 5 s · Start frame F1-T-9x16-kf · End frame F1-T-9x16-kf · Multi-shot OFF · Cost 30 credits
```

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 5 seconds: framed for a vertical 9:16 screen, a locked-off high view from about eleven metres up, looking almost straight down onto one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: two rack rows, the main aisle with its yellow lines running across the frame, and, in a gap behind the far rack row, one loaded trolley parked and still. The floor around the parked trolley is clear and unoccluded, with the main aisle running up the frame and the parked trolley in the upper half; the lower 40% of the frame is calm, clear epoxy floor. In the first two seconds a few small figures pass along the aisle without turning; from the third second a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card, small in the frame, walks past the gap without turning and out of frame. The camera does not move. The last frame matches the first frame.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

**F1-G-9x16-kf · keyframe for F1-G-9x16  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 9:16 · Resolution 2K · Images per run 1 · Image references: C0, C1, F1-G-kf · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Vertical frame. A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card walks toward the camera in the main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, head and shoulders in the upper third, mid-step, glancing down a rack row.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F1-G-9x16 · Ground clip, 9:16 phone master  ·  30 credits**

```
Model: Kling 3.0 · Mode 4k · Sound OFF · Aspect 9:16 · Duration 5 s · Start frame F1-G-9x16-kf · End frame none · Multi-shot OFF · Cost 30 credits
```

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 50mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 5 seconds: framed for a vertical 9:16 screen, a medium shot of a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card, her head and shoulders in the upper third, walking toward the camera in the main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, glancing down one rack row, then another, searching. She does not speak. The camera dollies back at her walking pace.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

**Negative / avoid** (only if a negative field is shown; the prompt already carries the core): text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text (poster):** One bay of a plant from above: a loaded trolley parked out of sight behind a rack row. On the floor, a supervisor searches the wrong rows. From above again, she walks past it.

### F2 · /solutions/wip/

- **Slot:** site/tools/pagegen/p_solutions.py, write('/solutions/wip/') head(media=...): replaces pic('P-WIP-01') as the full-bleed head film. Move the hall-wip model still into 'Queued is not finished.', where it replaces the reused hall-waits-43.
- **Why here:** The WIP page's decision is 'is my queue real?'. A real inspection queue that never shrinks makes the model still that follows read as the answer.
- **Purpose:** Queued is not finished: trolleys arrive at inspection faster than one part is checked, and the queue never empties.
- **Model:** Kling 3.0, 4K, one 5 s clip, start and end frames  ·  **Credits:** 30 (keyframes 2 x 2 = 4, counted with the stills)
- **Length and aspect:** 5 s on the page. 16:9 only. Crop-safe: the queue and the inspector sit inside the centre 45% of the width, so a 4:5 or 1:1 crop keeps the story.
- **First frame / poster:** the inspector at the granite table, two trolleys waiting in the yellow rectangle (one part in work, the rest waiting).
- **Last frame:** identical to the first frame (the queue never shrinks: the point of the page).
- **UI landing (Moves 1-3):** Shots 1 and 3 locked off. The amber 'waiting' outline and wait times can be drawn in the browser on the yellow rectangle.
- **Text zone:** Headline in the top third over the station's back wall; keep the yellow rectangle and the trolleys clear of text.
- **CAD composite:** No.
- **Edit and encode:** Plays as a 5 s loop with a 0.5 s dissolve at the seam (study: the one allowed dissolve is the loop seam). Encode <= 1.5 MB.

**F2-A · keyframe for F2  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

An open inspection station inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, seen at shoulder height. In the background an inspector in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering checks one machined aluminium housing on a dark granite table with a steel height gauge. In the foreground a painted yellow rectangle on the floor holds two loaded trolleys, waiting. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F2-B · end frame for F2  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C5, F2-A · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The same locked-off view of the inspection station inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: the inspector still on the same housing at the granite table, and now three loaded trolleys waiting in the painted yellow rectangle; nobody else in frame. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F2 · Queue clip, 16:9  ·  30 credits**

```
Model: Kling 3.0 · Mode 4k · Sound OFF · Aspect 16:9 · Duration 5 s · Start frame F2-A · End frame F2-B · Multi-shot OFF · Cost 30 credits
```

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 5 seconds: a locked-off medium-wide shot at shoulder height across an open inspection station inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. In the background an inspector in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering checks one machined aluminium housing with a steel height gauge at a dark granite table. In the foreground a painted yellow rectangle on the floor marks a queue with two loaded trolleys waiting inside it. An operator, seen only from the shoulders down, rolls a third trolley in, parks it behind the other two and walks out of frame. The inspector never looks up from the same single part. The camera does not move.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

**Negative / avoid** (only if a negative field is shown; the prompt already carries the core): text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text (poster):** An inspection station. One part is checked at a granite table while loaded trolleys wait in a marked queue in front of it; one leaves, another arrives, the queue stays.

### F6 · / (homepage)

- **Slot:** site/src/pages/index.html, section.waits (#waits, 'See where work waits.'): the pinned full-bleed picture behind the heading (today hall-waits-1600.webp), scrubbed by scroll (Move 2). Encode all-keyframe H.264 (or an AVIF/WebP image sequence); the wait time is live page text tied to scroll position. hall-waits stays as the reduced-motion and no-JS picture.
- **Why here:** #waits is where the homepage says a wait is visible while it is still a wait. Scrubbing time on one parked trolley makes the wait felt, not read (study Move 2: nobody scrubs time).
- **Purpose:** Work waits: about two hours pass in eight seconds and one trolley never moves.
- **Model:** Kling 3.0, 4K, one 5 s clip, start and end frames  ·  **Credits:** 30 (keyframes 2 x 2 = 4, counted with the stills)
- **Length and aspect:** 5 s on the page. 16:9 only. Crop-safe: trolley and counter zone inside the centre 45%; on phones the pinned frame crops to the trolley side.
- **First frame / poster:** morning, the trolley just parked.
- **Last frame:** two hours later, the trolley still there (both work as stills).
- **UI landing (Moves 1-3):** Locked off. The wait counter and an amber zone outline land on the clear floor right of the trolley.
- **Text zone:** Heading in the top-right third over the racking; the trolley sits left of centre, the counter on the floor to its right.
- **CAD composite:** Optional: the browser can place the AmIGo CAD on the rail (Move 3).
- **Edit and encode:** Encode all-keyframe H.264 (or a 60-frame AVIF/WebP sequence) for scroll scrubbing; <= 3 MB. The wait counter is live text, never in the footage.

**F6-A · keyframe for F6  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Morning inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, seen at chest height across a bay: one loaded trolley parked beside an inspection station a little left of centre, clear floor around it, low morning daylight patches on the floor to the right. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F6-B · end frame for F6  ·  2 credits**

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C5, F6-A · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The same view two hours later: the same loaded trolley in exactly the same place beside the inspection station, the daylight patches now higher and further left on the floor and racking, the inspector in a different position. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**F6 · Waiting time-lapse, 16:9 (scrubbed by scroll)  ·  30 credits**

```
Model: Kling 3.0 · Mode 4k · Sound OFF · Aspect 16:9 · Duration 5 s · Start frame F6-A · End frame F6-B · Multi-shot OFF · Cost 30 credits
```

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 5 seconds: a single locked-off time-lapse shot at chest height inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, looking across a bay to one loaded trolley parked beside an inspection station, a little left of centre. About two hours pass in five seconds: patches of clerestory daylight slide slowly across the epoxy floor and up the racking, shadows turn, operators and other trolleys pass as brief soft streaks in the aisle, the inspector at the station changes position. The parked trolley never moves, and the clear floor around it stays clear. The camera never moves.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

**Negative / avoid** (only if a negative field is shown; the prompt already carries the core): text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text (poster):** A loaded trolley stands parked beside an inspection station while the daylight moves across the floor and people pass. It does not move.

## B. Stills and close-ups

Nano Banana Pro, 2K, one image per run, 2 credits. Aspect follows the slot: 16:9 full-bleed heads, 3:2 side heads and cards, 4:5 the pilot offer, 4:3 body splits, learn heads and close-ups.

### P-company · /company/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/company/'), section 'How we work.': new split media (3:2). Leaves the CAD pair head and the part cards as they are. Real team photographs are still owed for this page (study: About = real people only); this still shows no identifiable face.
- **Purpose:** Designed in Bengaluru, built in India: the reader must feel a careful local team at work, not a reseller.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A bright engineering workroom in Bengaluru on a monsoon morning: tall windows along one wall look out onto wet green rain trees, plain white walls, a long light-wood bench. Close over the bench: two pairs of engineers' hands, one in a plain white shirt cuff and one in a plain grey sleeve, spread a large paper floor plan drawn only in thin grey lines with no writing on it; one hand traces an aisle with a pencil. A steel ruler, a coil of cable and small hand tools lie beside it. Window daylight falls across the bench. Faces are out of frame.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus laptops, monitors, circuit boards, product prototypes, whiteboard writing, faces.

**Alt text:** Two engineers' hands tracing an aisle on a paper floor plan, on a bench by tall windows with rain trees outside.

### P-diagnostic · /diagnostic/  ·  4 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/diagnostic/') head(media=...): new head still beside the H1 (3:2, eager).
- **Purpose:** Plan your first bay: the reader must picture choosing one bay with a colleague, which is what the six questions do.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Sits beside the H1 (side still); keep the left third calm (railing and air) if the layout ever overlays.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: C1 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card and a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card stand at a steel mezzanine railing above the shop floor of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. She points down toward one bay, where an inspection station and a few loaded steel trolleys stand in a patch of daylight; he follows her gesture, one hand on the rail. Both are seen from behind and a little to the side, the floor spread out below them, the chosen bay sharp, the rest of the floor softer. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A plant head and a supervisor at a mezzanine railing, looking down at one bay of the shop floor as she points to it.

### P-how-to-buy · /how-to-buy/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/how-to-buy/'), section 'What you buy.': the fourth card ('Survey and plan', /pilot/), whose picture is empty today (3:2, card size).
- **Purpose:** The survey is part of what you buy: the reader must see that people come to the floor before any price is final.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: C1 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card and a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card walk slowly side by side down a main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, both looking up toward the tops of the racking and the steel columns. He carries a rolled sheet of plain paper and a folded aluminium step ladder; she points up at a column. Seen from behind at a three-quarter angle, at chest height.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A field engineer and a supervisor walk a plant aisle together, looking up at the racking and columns.

### P-industrial-spatial-intelligence · /industrial-spatial-intelligence/  ·  2 credits

- **Slot:** site/tools/pagegen/p_platform.py, write('/industrial-spatial-intelligence/') head(media=hallslot('hall-ask')): replaces the hall-ask head, which /use-cases/ask-your-plant/ already uses (16:9).
- **Purpose:** The category page: the reader must see a floor as a space where many things move and wait at once, the thing spatial intelligence reads.
- **Model and size:** Nano Banana Pro, 16:9, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Full-bleed head: headline in the top third over the roof trusses; the floor activity stays in the lower two thirds.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A high view from about eleven metres up, looking 45 degrees down across a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor in late morning, the real twin of an architect's model. Long rows of racking, a press line, an inspection area and a staging lane fill the frame. Many things move at once: operators push loaded steel trolleys, a forklift carries a pallet, a tugger pulls three trolleys along the main aisle. At the inspection area a few loaded trolleys stand still. Everything is sharp from front to back; pale bands of clerestory daylight cross the floor. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A large plant seen from high above: trolleys, a forklift and a tugger moving along the aisles while a few trolleys stand still at inspection.

### P-industries-manufacturing · /industries/manufacturing/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/industries/manufacturing/'), section 'Inspection is where queues hide.': replaces pic('P-MFG-02'), the reused hall-waits-43 (4:3).
- **Purpose:** For a plant head: queues hide outside the room where the measuring happens.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Outside the glass-walled inspection room of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. Three loaded steel work-in-progress trolleys with rounded tubular push handles stand parked in a row along the glass wall beside the door, waiting. Through the glass, soft in focus, an inspector in plain grey-blue workwear measures one housing at a dark granite table. The camera is at handle height, looking along the row of trolleys toward the door. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus measuring-machine screens, printed reports.

**Alt text:** Three loaded trolleys wait in a row outside a glass-walled inspection room, while one part is measured inside.

### P-industries-robotics · /industries/robotics/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/industries/robotics/'), section 'A shared map, beside the robots' own.': new split media (4:3).
- **Purpose:** For a robotics lead: robots, forklifts and hand-pushed trolleys share one aisle, and only some of them are on the robot map.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A cross aisle inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor at hip height. A low, flat, plain grey autonomous mobile robot with its lights off tows a loaded steel trolley across the frame from left to right. On the far side a forklift waits at the painted stop line, and behind it an operator in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering pushes a second trolley by hand. Daylight from the clerestory, everything moving slowly. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus robot status lights, lidar glow, displays on the robot.

**Alt text:** A low grey robot tows a loaded trolley across an aisle while a forklift waits and an operator pushes another trolley by hand.

### P-industries-warehousing · /industries/warehousing/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/industries/warehousing/'), section 'Dock to stock, timed.': new split media (4:3).
- **Purpose:** For a warehouse head: pallets stand in staging after the dock, and nobody times how long.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The covered dock of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. Two roller shutters stand open onto a bright overcast yard where a plain white truck body with no markings is backed up. Inside, four shrink-wrapped pallets of plain brown cartons stand in a painted yellow staging rectangle; a forklift reverses away from them toward the racking. Even daylight from the open doors mixes with the clerestory light. Camera at chest height from inside the building.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus printed carton labels, truck branding, number plates.

**Alt text:** Four wrapped pallets stand in a marked staging lane inside an open dock while a forklift drives away.

### P-learn-accuracy · /learn/accuracy/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='accuracy', pic='bay') head(media=pic(...)): replaces hall-bay, which /learn/anchor-planning/ keeps (16:9).
- **Purpose:** Test where your floor is hardest: the reader must see a measurement taken in a steel-heavy aisle, by a person.
- **Model and size:** Nano Banana Pro, 16:9, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Full-bleed head: text in the upper-right third over the receding racks; the engineer and plumb bob lower left.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A narrow aisle between tall steel racks loaded with steel bar stock inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, a parked forklift at the far end. In the foreground a field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card kneels on the floor and lowers a brass plumb bob on a string from the top rail of a loaded steel trolley toward a small cross of yellow tape on the grey floor, checking where the trolley truly stands. Low camera at knee height, the plumb bob and tape cross sharp, the racks receding softly. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A field engineer kneels in a narrow steel-racked aisle, lowering a plumb bob from a trolley rail to a taped cross on the floor.

### P-learn-alternatives · /learn/alternatives/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='alternatives', pic=None): new head media (4:3).
- **Purpose:** Scan, checkpoint or location: the reader must recognise the scan they do today, and what it does not see.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A station desk at the end of a machining cell inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. Close on an operator's hand in a plain grey-blue sleeve lifting a plain grey pistol-grip barcode scanner, with no screen, from its holster on the desk edge. Beside the desk stands a loaded steel trolley; behind it the aisle runs on, soft, with another trolley moving away out of reach. Shallow depth of field. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus scanner screens, barcode labels, printed travellers.

**Alt text:** At a station desk, an operator lifts a handheld scanner from its holster beside a loaded trolley.

### P-learn-association · /learn/association/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='association', pic='trolley') head(media=pic(...)): replaces the stand-in (hall-waits-43) on the L06 slot (4:3).
- **Purpose:** A tag knows the trolley, a link knows the job: the reader must see the job paperwork and the trolley as two separate things.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** Optional: the tag on the top rail may be replaced by the AmIGo CAD (amigo-side), kept soft.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C1, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 85mm lens at T2, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Close on the hands of a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card sliding a folded plain white paper job sheet, with no visible writing, into a clear plastic sleeve fixed to the side of a loaded steel trolley inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. Her navy jacket cuff is in frame. Above, on the trolley's top rail, a small dark tag sits soft and out of focus. Machined housings fill the background shelves. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus readable paperwork, barcodes, QR codes.

**Alt text:** A supervisor slides a folded job sheet into a sleeve on the side of a loaded trolley.

### P-learn-dwell-time · /learn/dwell-time/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='dwell-time', pic='queue') head(media=pic(...)): replaces the stand-in (hall-waits-43) on the L02 slot (4:3).
- **Purpose:** Dwell runs from zone entry to zone exit: the reader must see the moment a trolley crosses into a zone.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Floor level inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, the camera about 20 cm above the grey epoxy. The front castor wheels of a loaded steel trolley roll across a painted yellow line into a marked area beside a parts-washing station. Only the operator's shoes and lower legs in dark trousers are in frame behind the trolley. Slight motion in the wheels, the yellow line sharp, the station soft beyond. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** Floor-level view of a loaded trolley's wheels rolling across a painted yellow line into a marked zone.

### P-learn-location-data-quality · /learn/location-data-quality/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='location-data-quality', pic='laststop') head(media=pic(...)): replaces hall-find-43, which /tools/search-time/ and the use-case cards also show (4:3).
- **Purpose:** When a tag goes quiet, the map shows where it was last seen: the reader must see a trolley left somewhere quiet and out of the way.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A loaded steel trolley parked out of the way under a steel mezzanine staircase inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, among stacks of empty grey plastic crates. It stands in open shade, still and readable, while the bright main aisle runs past beyond the stair. No people. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A loaded trolley parked out of the way under a staircase, among stacks of empty crates.

### P-learn-pilot-baseline · /learn/pilot-baseline/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='pilot-baseline', pic=None): new head media (4:3).
- **Purpose:** Measure today first: the reader must see the honest, slightly tedious way a baseline starts, by hand.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A production planner, an Indian man in his late twenties, slim, with short black hair and thin rimless glasses, wearing a plain unbranded light blue full-sleeve shirt with no chest print tucked into charcoal trousers, black safety shoes, a plain blue lanyard with a blank white card stands beside an inspection queue inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, holding a plain grey clipboard with its paper turned toward him and a small stainless analogue stopwatch whose face points away from the camera. He watches two loaded steel trolleys waiting in a painted yellow rectangle. Seen in profile at chest height. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus visible stopwatch dial, readable clipboard.

**Alt text:** A production planner times waiting trolleys by hand, with a clipboard and a stopwatch, beside an inspection queue.

### P-learn-uwb-rtls-india · /learn/uwb-rtls-india/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='uwb-rtls-india', pic='amigo') head(media=pic(...)): replaces the amigo CAD still, which /products/ and /how-to-buy/ also show (3:2).
- **Purpose:** How to choose in India: the reader must feel the supplier will be on the floor in person, in Indian weather, on Indian plants.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Side still: no overlay; the bright doorway is the calm upper third.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card and a field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card walk side by side from a wet concrete yard through the tall open doorway into a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, talking, both looking ahead and to each other. Behind them, monsoon clouds, a rain tree and a coconut palm beyond the plant's boundary wall. The camera is inside, at chest height, the doorway bright and the plant interior soft around it.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A plant head and a field engineer walk in from a wet yard through the plant's open doorway, talking.

### P-learn-uwb-vs-rfid · /learn/uwb-vs-rfid/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='uwb-vs-rfid'), section 'Trolleys and WIP specifically': new split media (4:3). The hall-before head stays.
- **Purpose:** A checkpoint sees a doorway, not the floor: the reader must see the one moment a gate would catch.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A wide plain steel doorway between two halls of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. An operator in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering, seen from behind, pushes a loaded steel trolley through it into the next hall; beyond the doorway the second hall opens up with its own racks and stations in daylight. Camera at chest height a few metres behind. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus RFID gate panels, readers, beacons, signage over the door.

**Alt text:** An operator pushes a loaded trolley through a wide doorway from one hall into the next.

### P-learn-wip-visibility · /learn/wip-visibility/  ·  2 credits

- **Slot:** site/tools/pagegen/p_learn.py, guide(slug='wip-visibility', pic='queue') head(media=pic(...)): replaces the stand-in (hall-waits-43) on the L02 slot (4:3).
- **Purpose:** Where each job is, and how long it waited: the reader must see a cell where some work moves and some stands.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

From the edge of a mezzanine, looking down at about 45 degrees into a machining cell of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor with four stations. Five loaded steel trolleys: two move with operators in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering, three stand still beside stations. Deep focus, daylight from the clerestory. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** Looking down into a machining cell: two trolleys move with operators while three stand still beside stations.

### P-products-amigo · /products/amigo/  ·  4 credits

- **Slot:** site/tools/pagegen/p_platform.py, write('/products/amigo/'), section 'Speaks when it moves.' split('Where the battery life comes from.', media=still('amigo-side')): replaces the reused amigo-side CAD with this plate plus the CAD composite (3:2). This is the owed 'amigo_trolley' shot.
- **Purpose:** The tag in its real place: the reader must see how small it is on a real trolley.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** YES. Composite the AmIGo CAD render (site/src/assets/home/amigo-side-*.avif, or the round 11 amigo render at the matching angle) on the empty rail spot; match key light from upper left, add a soft contact shadow, grain-match.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 100mm macro lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A tight close-up of the top tubular rail of a loaded steel work-in-progress trolley parked in an aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. In the centre of the frame the rail has a clean, flat, empty steel mounting area, sharp, lit softly from the upper left by clerestory daylight. The machined aluminium housings on the shelf below and the plant behind fall softly out of focus. Nothing is fixed to the rail. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus any device, box or sticker on the rail.

**Alt text:** An AmIGo tag fixed to the top rail of a loaded steel trolley on a plant floor.

### P-products-amimo · /products/amimo/  ·  2 credits

- **Slot:** site/tools/pagegen/p_platform.py, write('/products/amimo/'), section 'Every floor starts with a survey.' hallslot('hall-bay-32', ...) ('Where AmIMo anchors go.'): replaces the reused hall-bay-32 (3:2).
- **Purpose:** Where an anchor lives: the reader must see a real column, 3 to 8 m up, above the racking, with only power to run.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** YES. Composite the AmIMo CAD (amimo-3q or amimo-page render) on the column face where the conduit ends; match light from the clerestory side, add contact shadow.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Looking up at a plain grey-painted steel column inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, about six metres up. The column face in the centre of the frame is clean and flat with nothing mounted, and a single grey conduit runs down its side. Beyond it, the tops of the racking and the roof trusses, with clerestory daylight. No people.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus any box, bracket, antenna or lamp on the column.

**Alt text:** An AmIMo anchor fixed high on a steel column above the racking, with one conduit running down to it.

### P-products-amihub · /products/amihub/  ·  2 credits

- **Slot:** site/tools/pagegen/p_platform.py, write('/products/amihub/'), section 'Inside your plant. Or in the cloud.': new split media (4:3). The hall-waits head stays (O5: never a fake AmIHub screen).
- **Purpose:** AmIHub can run inside your plant: the reader (often IT) must see a closed cabinet on site, not a cloud diagram.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A small, clean electrical room off the shop floor of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: pale grey walls, cable trays overhead, a row of closed grey steel cabinets with solid doors. A field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card closes one cabinet door and turns the latch, seen from behind and a little to the side. Daylight comes in from the open door to the shop floor.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus status LEDs, blinking lights, rack screens, cable labels.

**Alt text:** A field engineer closes a grey steel cabinet in a plant's electrical room just off the shop floor.

### P-solutions-assets · /solutions/assets/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/solutions/assets/'), section 'Where was it last seen?': new split media (4:3). The hall-assets head stays.
- **Purpose:** Tools and fixtures go missing: the reader must recognise the empty place on the shelf.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A fixture store inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: heavy machined steel fixtures sit on grey steel shelving. One shelf position at eye level is empty, a clean rectangle in the faint dust where a fixture should be. A maintenance technician in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering stands at the shelf, one hand on its edge, looking at the gap, seen in three-quarter back.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A technician looks at an empty place on a fixture shelf where a fixture should be.

### P-solutions · /solutions/  ·  4 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/solutions/'), section 'Start with the question your team asks most.': replaces pic('P-SOL-02'), the stand-in hall-waits-43 (4:3).
- **Purpose:** Two questions, one system: the reader must see the two questions a supervisor asks, where is it and how long has it waited.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C1, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card stands at the junction of two aisles inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, seen from behind and to the side. Down one aisle, far off, a loaded trolley is moving; down the other, close by, two loaded trolleys stand waiting at a station. She looks from one to the other. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A supervisor at a junction of two aisles looks from a moving trolley to two trolleys waiting at a station.

### P-start · /start/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/start/'), section 'What a first bay proves.': replaces the reused amimo CAD still (3:2).
- **Purpose:** Start small on purpose: the reader must see how modest the first step is, two people pacing out one bay.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: C1 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Early morning in one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, before the shift is busy. A field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card pushes a plain measuring wheel along the yellow line at the edge of the bay, its counter turned away from the camera; a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card walks beside him and points toward the inspection station at the bay's end. Seen in three-quarter back at chest height, the rest of the plant quiet and soft.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus visible counter digits.

**Alt text:** A field engineer and a supervisor pace out one bay along its yellow line, early in the morning.

### P-technology · /technology/  ·  2 credits

- **Slot:** site/tools/pagegen/p_platform.py, write('/technology/'), section 'Steel and racking.': replaces the stand-in (hall-waits-32) in 'What they do to the signal.' (4:3).
- **Purpose:** Steel and racking shape the signal: the reader must see how much steel a real floor holds, without any drawn radio.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A canyon of tall steel racking inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, packed with steel bar stock and steel bins, seen from low in the aisle. A forklift mast stands parked at the far end. Clerestory daylight catches the steel edges in thin highlights. No people.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus drawn signal waves, rings, beams.

**Alt text:** A narrow aisle between tall steel racks packed with bar stock and steel bins, a forklift parked at the far end.

### P-tools-anchors · /tools/anchors/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/tools/anchors/'), section 'What the survey adds.': replaces the reused amimo CAD still (3:2).
- **Purpose:** The estimate is a range; the survey sets the count: the reader must see the survey as a person measuring their own columns.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: C1 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card stands on a short rolling steel platform ladder beside a grey steel column inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, aiming a plain grey laser distance meter up the column, its face turned away from the camera. A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card holds the ladder rail and looks up with him. Seen from a low three-quarter angle, the racking tops and roof trusses above.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus red laser beam drawn as a line, glowing dot, meter display.

**Alt text:** A field engineer on a platform ladder measures up a steel column while a supervisor steadies the ladder.

### P-tools-pilot · /tools/pilot/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/tools/pilot/') head(media=...): new head still beside the H1 (3:2).
- **Purpose:** The brief goes to the plant head, IT and finance: the reader must picture the plant head reading their one page.
- **Model and size:** Nano Banana Pro, 3:2, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Side still: no overlay; the right third is the soft floor through the glass.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 3:2 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card stands at the glass wall of his office above the shop floor of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, reading a single printed sheet held up in one hand, its blank back toward the camera. The floor below is soft through the glass. Seen in profile, window light on his face and the paper.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus readable paper, computer monitors in the office.

**Alt text:** A plant head reads a single printed sheet at his office window above the shop floor.

### P-tools-search-time · /tools/search-time/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/tools/search-time/'), section 'Count it for real.': replaces hallslot('hall-find-43'), which /learn/location-data-quality/ also used (4:3).
- **Purpose:** Searching costs time: the reader must recognise the small, everyday search their people do.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

An operator in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering stands on tiptoe at the end of a rack row inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, one hand on the upright, looking over a row of low bins into the next aisle, searching. Seen from behind and to the side at chest height. The aisle beyond him is long and empty.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** An operator on tiptoe at the end of a rack row, looking over the bins into the next aisle.

### P-trust-people · /trust/people/  ·  2 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/trust/people/'), section 'What the map shows.': replaces hallslot('hall-ask-43') (4:3).
- **Purpose:** The tag goes on the trolley, not the person: the reader (and the union) must see the tag on the thing and the person left anonymous.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** YES. Composite the AmIGo CAD (amigo-side or amigo-top render) on the empty rail spot, sharp; match light and add a contact shadow.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

An operator's hands and forearms in plain grey-blue sleeves rest on the rounded tubular handle of a loaded steel trolley inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor; the operator is cropped at the shoulders and never seen. On the trolley's top rail, near the handle, a clean flat empty mounting spot sits in sharp focus. Housings and aisle soft behind. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus any badge, wristband or device on the person.

**Alt text:** An AmIGo tag on the top rail of a trolley, beside the hands of the person pushing it. The tag is on the trolley, not on the person.

### P-use-cases · /use-cases/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/use-cases/') head: replaces the reused hall-find-43 head picture (4:3). The four cards below keep their model-hall crops.
- **Purpose:** Four jobs, one live map: the reader must see four kinds of errand crossing one junction, and pick theirs.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Head: text, if overlaid, in the top third over the racking; the junction sits in the lower two thirds.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A busy aisle junction inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, seen from slightly above at about three metres. Four errands cross at once: an operator pushes a loaded steel trolley, a technician pulls a plain grey tool cart, a low grey mobile robot with its lights off tows a trolley, and a tugger with three trolleys waits to cross. Everyone in plain workwear, everyone looking where they are going. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** An aisle junction where a trolley, a tool cart, a towing robot and a tugger cross at the same time.

### P-use-cases-find-the-asset · /use-cases/find-the-asset/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/use-cases/find-the-asset/'), section 'Today, and with AmIMotion.': new split media (4:3).
- **Purpose:** Today: the walk and the calls to stores. The reader must recognise the stores counter conversation.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The stores counter of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: a production planner, an Indian man in his late twenties, slim, with short black hair and thin rimless glasses, wearing a plain unbranded light blue full-sleeve shirt with no chest print tucked into charcoal trousers, black safety shoes, a plain blue lanyard with a blank white card leans at the hatch, asking; inside, the storekeeper in plain grey-blue workwear has turned to look along his shelves of bins and shakes his head slightly. Seen from the side at chest height.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus bin labels, ledger books with writing.

**Alt text:** A planner at the stores hatch asks after something while the storekeeper turns to look along his shelves.

### P-use-cases-station-to-station · /use-cases/station-to-station/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/use-cases/station-to-station/'), section 'Today, and with AmIMotion.': new split media (4:3).
- **Purpose:** Each move between stations gets a time: the reader must see the trolley in the gap between two stations, where nothing is scanned.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Side view at hip height inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: an operator in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering rolls a loaded steel trolley out of one machining station toward the next along a yellow-lined aisle. Both stations are in frame, the trolley in the gap between them; slight motion blur in the wheels. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** An operator rolls a loaded trolley along the aisle from one machining station to the next.

### P-use-cases-amr-hand-off · /use-cases/amr-hand-off/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/use-cases/amr-hand-off/'), section 'Today, and with AmIMotion.': new split media (4:3).
- **Purpose:** What the robot brought, and when: the reader must see an operator checking a drop-off by eye, today.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A drop-off point beside a line-side station inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. A low, flat, plain grey mobile robot with its lights off has just stopped with a loaded steel trolley hitched behind it. An operator in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering walks over and bends to look at the parts on the trolley's shelves. Camera at chest height, three-quarter angle. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus robot lights, robot screens, floor stickers with codes.

**Alt text:** A towing robot has stopped at a drop-off point; an operator bends to look at what the trolley brought.

### P-use-cases-ask-your-plant · /use-cases/ask-your-plant/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/use-cases/ask-your-plant/'), section 'Today, and with AmIMotion.': new split media (4:3).
- **Purpose:** Today a question means a phone call and a walk: the reader must recognise the call they make every shift.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text in a split; no overlay. Keep the upper third calm so a caption or crop never cuts a face or the trolley.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A production planner, an Indian man in his late twenties, slim, with short black hair and thin rimless glasses, wearing a plain unbranded light blue full-sleeve shirt with no chest print tucked into charcoal trousers, black safety shoes, a plain blue lanyard with a blank white card stands at the glass partition of a mezzanine office above a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, a phone held to his ear with its screen against his face and unseen, his other hand on the partition frame, looking down at the floor below. Seen in profile.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps; plus phone screen, monitors behind him.

**Alt text:** A planner on a phone call at a mezzanine window, looking down at the shop floor.

### P-home-close · / (homepage)  ·  4 credits

- **Slot:** site/src/pages/index.html, section.close ('See it on real data.'): full-bleed background under the closing call to action and the ground for the 'your floor' simulator (Move 8). Replaces film F7 under the budget; light drift can be added in the browser.
- **Purpose:** The page ends where the visitor's own floor begins: a real bay from above, empty enough for their trolleys to be drawn onto it.
- **Model and size:** Nano Banana Pro, 16:9, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Closing headline in the top third over the rack tops; the aisle and queue rectangle stay free for the simulator.
- **CAD composite:** Yes, in the browser: the simulator draws CAD trolleys and tags; nothing is drawn by AI.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Straight down from about twelve metres onto one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor in daylight: the tops of two rack rows, the main aisle with its yellow lines, an inspection station and an empty painted queue rectangle; the floor clear. Nothing moves; no people in the bay.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** One bay of a plant seen straight from above in daylight: rack tops, the main aisle, an inspection station and an empty queue area.

### P-contact · /contact/  ·  4 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/contact/') head(media=...): new full-bleed head still under 'Book a call.' (replaces film F5 under the budget).
- **Purpose:** The last decision: the trolley found and at rest in the light, the calm image the study prescribes for a call to action.
- **Model and size:** Nano Banana Pro, 16:9, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Headline and button in the left third; the trolley sits centre-right.
- **CAD composite:** YES (Move 3): composite the AmIGo CAD (site/src/assets/home/amigo-side-*.avif) on the clean rail centre, or render it in the browser with a matched camera.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 50mm lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The bright main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor at handle height: one loaded trolley stands at rest in the centre of the frame in the daylight, nobody touching it, the clean flat centre of its top rail sharp and clear. Further down the aisle, soft, the supervisor walks away with her back to the camera. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A loaded trolley at rest in a bright plant aisle, its top rail clean, while a supervisor walks away down the aisle.

### P-pilot · /pilot/  ·  4 credits

- **Slot:** site/tools/pagegen/p_company.py, write('/pilot/') head(..., media=render('bay-45'), offer=True): replaces the bay-45 render beside the offer, 4:5 (replaces film F3 under the budget). bay-45 stays on the homepage.
- **Purpose:** One bay before you commit: the plant at rest, one bay in light, the people who will run the pilot standing in it.
- **Model and size:** Nano Banana Pro, 4:5, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Sits beside the offer text; no overlay. Calm lower third of floor.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:5 · Resolution 2K · Images per run 1 · Image references: C0, C1 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 35mm lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

A high view from a mezzanine walkway about eight metres up, looking down into a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. The floor is calm and slightly soft; in the upper middle one bay - an inspection station, its queue and four loaded trolleys - sits in a clean patch of clerestory daylight. In that bay, small in the frame, a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card, a field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card and the plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card stand together beside a grey steel column, seen from above and behind. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A plant floor from above, with one inspection bay in daylight where a supervisor, a field engineer and the plant head stand together.

### P-industries · /industries/  ·  4 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/industries/') head(media=pic('P-IND-01')): replaces the reused hall-all head (replaces film F4 under the budget).
- **Purpose:** Different floors, one plant: a calm shift change in a building that holds machining, stores and dock.
- **Model and size:** Nano Banana Pro, 16:9, 2K (export the AVIF/WebP ladder 800-2400); second take planned
- **Text zone:** Headline in the top third over the roof and clerestory; the people stay in the lower two thirds.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 16:9 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 24mm lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

The main aisle of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor at shift change, a wide view at eye height: two calm streams of operators in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering pass each other, loaded trolleys parked at the stations, a forklift waiting at a cross aisle. Far down the aisle, beyond the machining hall, the open dock with shrink-wrapped pallets in a staging lane and a low grey robot with its lights off. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** Shift change in a large plant: two streams of operators pass along the main aisle, with the dock and its pallets far beyond.

### M-solutions-wip · /solutions/wip/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/solutions/wip/'), section 'Tag. Locate. Link. Then time the wait.': new close-up beside the steps (4:3).
- **Purpose:** Craft and touch: the hand that moves the work.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text; no overlay.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C1, C5 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 100mm macro lens at T2.8, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Extreme close-up of the supervisor's hand, the cuff of a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text at the edge of frame, closing round the rounded tubular push handle of a loaded trolley inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. Scuffed brushed steel, a fingerprint on the tube, the machined housings beyond falling out of focus. Every trolley in the frame is a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A supervisor's hand closes round the steel handle of a loaded trolley.

### M-industries · /industries/  ·  2 credits

- **Slot:** site/tools/pagegen/p_solutions.py, write('/industries/'), section 'What changes from floor to floor.': new close-up (4:3).
- **Purpose:** The part on every floor: the reader must see the real component, not a box.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text; no overlay.
- **CAD composite:** No.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: none · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 100mm macro lens at T4, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Extreme close-up of a machined aluminium housing held in a worker's gloved hand inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor: the rough grey casting skin meets a bright machined face, a blue protective cap in one bore, a thin film of coolant catching the clerestory light.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** A gloved hand holds a machined aluminium housing with a blue protective cap in one bore.

### M-products-amimo · /products/amimo/  ·  2 credits

- **Slot:** site/tools/pagegen/p_platform.py, write('/products/amimo/'), section 'What you run to it. Power, and nothing else.': new close-up (4:3).
- **Purpose:** Power and nothing else: the reader must see one cable reaching a clean mounting spot on a real column.
- **Model and size:** Nano Banana Pro, 4:3, 2K (export the AVIF/WebP ladder 800-2400)
- **Text zone:** Beside text; no overlay.
- **CAD composite:** YES. Composite the AmIMo CAD (amimo-3q or amimo-a render) on the empty area where the cable ends; rake the key light to match; contact shadow.

```
Model: Nano Banana Pro · Unlimited OFF · Aspect 4:3 · Resolution 2K · Images per run 1 · Image references: C0 · Cost 2 credits
```

```text
Ultra-realistic documentary photograph, shot on a full-frame cinema camera with a 100mm macro lens at T5.6, 1/50 shutter, fine natural grain, true-to-life neutral daylight colour, bright and airy with soft open shadows, calm and human.

Close-up of the face of a cast concrete column inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor, about six metres up: rough concrete with formwork marks, two drilled anchor holes and a single grey power cable in a short conduit ending at a clean, empty flat area in the centre of the frame. Clerestory light rakes across the surface.

A real photograph, not a render or illustration. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People are mid-task and do not speak, faces neutral and lit only by the room light. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no extra wheels or handles.
```

**Negative / avoid:** text, letters, numbers, signage, floor stencils with words, logos, brand marks, embroidery, chest prints, badge text, hi-vis lettering, safety posters, screens, monitors, displays, phone screens, UI, holograms, glow, light beams drawn as graphics, lens flare, neon, orange or amber colour casts, orange rack beams, dark moody grade, teal-orange grade, beauty lighting, people looking into the lens, people talking, posed smiles, stock-photo handshake, readable devices on trolleys or columns, warped hands, extra fingers, melting metal, duplicated identical parts, a trolley handle that changes shape, floating objects, CGI gloss, plastic skin, 8K or hyperreal look, drone sweeps, orbits, speed ramps.

**Alt text:** An AmIMo anchor mounted on a concrete column, with a single power cable running to it.

## Page inventory (all 56 pages)

| # | Page | Treatment | Item(s) | Visuals before -> after | Note |
|---|---|---|---|---|---|
| 1 | `/` | Film F1 (film slot) + film F6 (#waits) + still (#close) | F1, F6, P-home-close | 6 -> 7 | Homepage already holds ~11 visuals; design engineering should retire one model-hall repeat to stay at or under 10 (L12). |
| 2 | `/company/` | Still | P-company | 4 -> 5 |  |
| 3 | `/contact/` | Still (head) | P-contact | 0 -> 1 | Was film F5; deferred under the budget. |
| 4 | `/developers/` | Text-only (deliberate) | - | 0 -> 0 | Interfaces page; no screen may be shown. |
| 5 | `/diagnostic/` | Still (head) | P-diagnostic | 0 -> 1 |  |
| 6 | `/faq/` | Text-only (deliberate) | - | 0 -> 0 | Answer page. |
| 7 | `/films/` | Model-hall (keep) | - | 1 -> 1 | Add F1/F2/F6 posters with poster() once they ship. |
| 8 | `/glossary/` | Text-only (deliberate) | - | 0 -> 0 |  |
| 9 | `/how-to-buy/` | Still (card) | P-how-to-buy | 3 -> 4 | Fills the empty fourth card. |
| 10 | `/industrial-spatial-intelligence/` | Still (head) | P-industrial-spatial-intelligence | 1 -> 1 |  |
| 11 | `/industries/` | Still (head) + macro | P-industries, M-industries | 4 -> 5 | Was film F4; deferred. |
| 12 | `/industries/manufacturing/` | Still | P-industries-manufacturing | 3 -> 3 | Head keeps hall-mfg. |
| 13 | `/industries/robotics/` | Still | P-industries-robotics | 2 -> 3 | Head keeps hall-robot. |
| 14 | `/industries/warehousing/` | Still | P-industries-warehousing | 1 -> 2 | Head keeps hall-wh. |
| 15 | `/learn/` | Model-hall/CAD tiles (keep) | - | 15 -> 15 | Index tiles stay model crops so no guide's still repeats here. |
| 16 | `/learn/accuracy/` | Still (head) | P-learn-accuracy | 1 -> 1 |  |
| 17 | `/learn/alternatives/` | Still (head) | P-learn-alternatives | 0 -> 1 |  |
| 18 | `/learn/anchor-planning/` | Model-hall (keep) | - | 1 -> 1 | hall-bay shows anchors on columns, which a photo must not draw. |
| 19 | `/learn/association/` | Still (head) | P-learn-association | 1 -> 1 |  |
| 20 | `/learn/dwell-time/` | Still (head) | P-learn-dwell-time | 1 -> 1 |  |
| 21 | `/learn/location-data-quality/` | Still (head) | P-learn-location-data-quality | 1 -> 1 |  |
| 22 | `/learn/mcp-location-data/` | Text-only (deliberate) | - | 0 -> 0 | AI and software; no honest picture without a screen. |
| 23 | `/learn/omlox/` | Text-only (deliberate) | - | 0 -> 0 | A standard. |
| 24 | `/learn/pilot-baseline/` | Still (head) | P-learn-pilot-baseline | 0 -> 1 |  |
| 25 | `/learn/rtls/` | CAD (keep) | - | 1 -> 1 | The CAD pair introduces the two devices. |
| 26 | `/learn/uwb-rtls-india/` | Still (head) | P-learn-uwb-rtls-india | 1 -> 1 |  |
| 27 | `/learn/uwb-vs-rfid/` | Still (body) | P-learn-uwb-vs-rfid | 1 -> 2 | Head keeps hall-before. |
| 28 | `/learn/value-without-mes/` | Text-only (deliberate) | - | 0 -> 0 | An argument about data order. |
| 29 | `/learn/wip-visibility/` | Still (head) | P-learn-wip-visibility | 1 -> 1 |  |
| 30 | `/pilot/` | Still (head, 4:5) | P-pilot | 2 -> 2 | Was film F3; deferred. |
| 31 | `/platform/` | Model-hall/CAD (keep) | - | 4 -> 4 | System page; hall-all and CAD carry it. |
| 32 | `/privacy/` | Text-only (deliberate) | - | 0 -> 0 | Legal. |
| 33 | `/products/amigo/` | Still + CAD composite | P-products-amigo | 5 -> 5 | All other pictures stay CAD. |
| 34 | `/products/amihub/` | Still (body) | P-products-amihub | 1 -> 2 | Head keeps the hall-waits model (O5). |
| 35 | `/products/amimo/` | Still + macro, both CAD composites | P-products-amimo, M-products-amimo | 6 -> 7 | All other pictures stay CAD. |
| 36 | `/products/` | CAD (keep) | - | 4 -> 4 | The family render is the page. |
| 37 | `/resources/` | Text-only (deliberate) | - | 0 -> 0 |  |
| 38 | `/solutions/assets/` | Still (body) | P-solutions-assets | 2 -> 3 | Head keeps hall-assets. |
| 39 | `/solutions/` | Still (body) | P-solutions | 7 -> 7 |  |
| 40 | `/solutions/wip/` | Film F2 (head) + macro | F2, M-solutions-wip | 2 -> 3 | hall-wip moves to 'Queued is not finished.' |
| 41 | `/specs/` | CAD (keep) | - | 1 -> 1 | Figures page. |
| 42 | `/start/` | Still (body) | P-start | 2 -> 2 | Head keeps hall-bay. |
| 43 | `/technology/` | Still (body) | P-technology | 3 -> 3 | Head keeps the line drawing; the mechanism is never AI footage (L7). |
| 44 | `/tools/anchors/` | Still (body) | P-tools-anchors | 1 -> 1 |  |
| 45 | `/tools/` | Text-only (deliberate) | - | 0 -> 0 |  |
| 46 | `/tools/pilot/` | Still (head) | P-tools-pilot | 0 -> 1 |  |
| 47 | `/tools/search-time/` | Still (body) | P-tools-search-time | 1 -> 1 |  |
| 48 | `/trust/` | Text-only (deliberate) | - | 0 -> 0 | Any picture would imply a customer site. |
| 49 | `/trust/people/` | Still + CAD composite | P-trust-people | 1 -> 1 |  |
| 50 | `/use-cases/amr-hand-off/` | Still (body) | P-use-cases-amr-hand-off | 4 -> 5 |  |
| 51 | `/use-cases/ask-your-plant/` | Still (body) | P-use-cases-ask-your-plant | 4 -> 5 |  |
| 52 | `/use-cases/find-the-asset/` | Still (body) | P-use-cases-find-the-asset | 4 -> 5 |  |
| 53 | `/use-cases/` | Still (head) | P-use-cases | 4 -> 4 |  |
| 54 | `/use-cases/station-to-station/` | Still (body) | P-use-cases-station-to-station | 5 -> 6 |  |
| 55 | `/what-is-amimotion/` | Text-only (deliberate) | - | 0 -> 0 | Facts page for AI answers. |
| 56 | `/404.html` | Text-only (deliberate) | - | 0 -> 0 |  |

## Run order and credit ledger (strict; stop at 300)

Run top to bottom. Tick each line, note the take kept, and stop if the running total would pass 300. If a clip misses, do not re-run it from the budget; tell the film director and use the reserve only on F1.

| Step | Item | What | Credits | Running total |
|---|---|---|---|---|
| 1 | C1 | Supervisor plate (Nano Banana Pro 2K) | 2 | 2 |
| 2 | C5 | Trolley plate | 2 | 4 |
| 3 | C0 | Plant world plate | 2 | 6 |
| 4 | F1-T-kf | F1 top-down keyframe 16:9 | 2 | 8 |
| 5 | F1-G-kf | F1 ground keyframe 16:9 | 2 | 10 |
| 6 | F1-T | F1 top-down clip 16:9 (Kling 3.0 4K 5 s) | 30 | 40 |
| 7 | F1-G | F1 ground clip 16:9 (Kling 3.0 4K 5 s) | 30 | 70 |
| 8 | F1-T-9x16-kf | F1 top-down keyframe 9:16 | 2 | 72 |
| 9 | F1-G-9x16-kf | F1 ground keyframe 9:16 | 2 | 74 |
| 10 | F1-T-9x16 | F1 top-down clip 9:16 | 30 | 104 |
| 11 | F1-G-9x16 | F1 ground clip 9:16 | 30 | 134 |
| 12 | P-contact | Contact head still | 2 | 136 |
| 13 | P-diagnostic | Diagnostic head still | 2 | 138 |
| 14 | F2-A | F2 first frame | 2 | 140 |
| 15 | F2-B | F2 last frame | 2 | 142 |
| 16 | F2 | F2 queue clip (Kling 3.0 4K 5 s) | 30 | 172 |
| 17 | F6-A | F6 first frame (morning) | 2 | 174 |
| 18 | F6-B | F6 last frame (two hours later) | 2 | 176 |
| 19 | F6 | F6 waiting time-lapse clip (Kling 3.0 4K 5 s) | 30 | 206 |
| 20 | P-products-amigo | AmIGo rail plate (CAD composite) | 2 | 208 |
| 21 | P-home-close | Homepage closing / simulator ground | 2 | 210 |
| 22 | P-company | Page still | 2 | 212 |
| 23 | P-how-to-buy | Page still | 2 | 214 |
| 24 | P-industrial-spatial-intelligence | Page still | 2 | 216 |
| 25 | P-industries-manufacturing | Page still | 2 | 218 |
| 26 | P-industries-robotics | Page still | 2 | 220 |
| 27 | P-industries-warehousing | Page still | 2 | 222 |
| 28 | P-learn-accuracy | Page still | 2 | 224 |
| 29 | P-learn-alternatives | Page still | 2 | 226 |
| 30 | P-learn-association | Page still | 2 | 228 |
| 31 | P-learn-dwell-time | Page still | 2 | 230 |
| 32 | P-learn-location-data-quality | Page still | 2 | 232 |
| 33 | P-learn-pilot-baseline | Page still | 2 | 234 |
| 34 | P-learn-uwb-rtls-india | Page still | 2 | 236 |
| 35 | P-learn-uwb-vs-rfid | Page still | 2 | 238 |
| 36 | P-learn-wip-visibility | Page still | 2 | 240 |
| 37 | P-products-amimo | Page still | 2 | 242 |
| 38 | P-products-amihub | Page still | 2 | 244 |
| 39 | P-solutions-assets | Page still | 2 | 246 |
| 40 | P-solutions | Page still | 2 | 248 |
| 41 | P-start | Page still | 2 | 250 |
| 42 | P-technology | Page still | 2 | 252 |
| 43 | P-tools-anchors | Page still | 2 | 254 |
| 44 | P-tools-pilot | Page still | 2 | 256 |
| 45 | P-tools-search-time | Page still | 2 | 258 |
| 46 | P-trust-people | Page still | 2 | 260 |
| 47 | P-use-cases | Page still | 2 | 262 |
| 48 | P-use-cases-find-the-asset | Page still | 2 | 264 |
| 49 | P-use-cases-station-to-station | Page still | 2 | 266 |
| 50 | P-use-cases-amr-hand-off | Page still | 2 | 268 |
| 51 | P-use-cases-ask-your-plant | Page still | 2 | 270 |
| 52 | P-pilot | Page still | 2 | 272 |
| 53 | P-industries | Page still | 2 | 274 |
| 54 | M-solutions-wip | Close-up | 2 | 276 |
| 55 | M-industries | Close-up | 2 | 278 |
| 56 | M-products-amimo | Close-up | 2 | 280 |
| 57 | P-contact | Second take (hero-critical) | 2 | 282 |
| 58 | P-diagnostic | Second take (hero-critical) | 2 | 284 |
| 59 | P-home-close | Second take (hero-critical) | 2 | 286 |
| 60 | P-products-amigo | Second take (hero-critical) | 2 | 288 |
| 61 | P-pilot | Second take (hero-critical) | 2 | 290 |
| 62 | P-industries | Second take (hero-critical) | 2 | 292 |
| 63 | P-solutions | Second take (hero-critical) | 2 | 294 |
| | | **Reserve (F1 retake of one clip, if needed)** | 6 | 300 |

**Top 10 to generate first:** C1 supervisor plate, C5 trolley plate, C0 plant plate, F1 16:9 (two keyframes + two clips), F1 9:16 (two keyframes + two clips), P-contact, P-diagnostic, F2 (two frames + clip), F6 (two frames + clip), P-products-amigo.

## Deferred films (written, not in this budget)

Run these only if more credits arrive. Each would be one Kling 3.0 clip per shot (30 credits per 5 s at 4K) from the keyframe given.

### F3 · /pilot/ (deferred; still in its place: P-pilot)

- **Purpose:** One bay before you commit: the plant at rest, one bay in light, and the people who will run the pilot standing in it.
- **Alt text:** A plant floor from above, with one inspection bay in daylight. In the bay, a supervisor, a field engineer and the plant head stand together beside a steel column.

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 4 seconds: a locked-off high wide shot from a mezzanine walkway, about eight metres up, looking down across a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. The whole floor is calm; in the centre one bay - an inspection station, its queue and four loaded trolleys - sits in a clean patch of clerestory daylight. Operators move quietly in other bays. The camera does not move.

HARD CUT at 4 seconds.

SHOT 2 - 4 to 8 seconds: a locked-off medium shot at chest height inside that bay, beside a plain grey steel column whose face is clean, with nothing mounted on it. A field engineer, an Indian man in his early thirties with a short trimmed beard, wearing a plain, unbranded olive-grey work jacket with no embroidery, no chest print and no badge text over a plain dark grey t-shirt, khaki work trousers and grey safety shoes, a plain green visitor lanyard with a blank white card looks up the column toward its top. Beside him, a production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card gestures along the bay's flow, from the station to the queue. The plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card steps in from behind, hands in his pockets, and listens. All three are in profile or three-quarter back and do not speak; the bay's trolleys stand behind them.

HARD CUT at 8 seconds.

SHOT 3 - 8 to 12 seconds: the same locked-off high wide shot as shot 1, identical framing. Down in the lit bay three small figures stand by the column. In the last second the frame matches the first frame of shot 1.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

### F4 · /industries/ (deferred; still in its place: P-industries)

- **Purpose:** Different floors, one plant: a calm shift change, then the supervisor and plant head walk from the machining hall toward the dock.
- **Alt text:** Shift change in a large plant: operators come and go along the main aisle. A supervisor and the plant head walk toward the dock, past pallets, a towing robot and a tugger.

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 4 seconds: a locked-off wide shot at eye height from the end of the main aisle inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor at shift change. Two calm streams of operators in plain grey-blue work shirts and dark trousers with no markings, mixed ages, safety shoes, a few in plain lime hi-vis vests with no lettering pass each other, one coming in and one going out; loaded trolleys stand parked at the stations, a forklift waits at a cross aisle with its forks a little raised. Nobody hurries.

HARD CUT at 4 seconds.

SHOT 2 - 4 to 8 seconds: a medium shot at chest height, the camera following at walking pace along a wide cross aisle that joins the machining hall to the stores and dock. A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card and the plant head, an Indian man in his early fifties with short hair greying at the temples and a neat grey moustache, wearing a plain unbranded white full-sleeve shirt with no chest print, cuffs folded back once, dark navy trousers and black safety shoes, a plain blue lanyard with a blank white card walk side by side away from the camera, her back three-quarters to the camera; they do not speak. Ahead of them shrink-wrapped pallets stand in a painted staging lane, a low grey mobile robot with its lights off tows a trolley across the aisle, and a tugger with three trolleys passes behind.

HARD CUT at 8 seconds.

SHOT 3 - 8 to 12 seconds: the same locked-off wide shot as shot 1, identical framing; the two streams of operators continue, and in the last second the frame matches the first frame of shot 1.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

### F5 · /contact/ (deferred; still in its place: P-contact)

- **Purpose:** The supervisor finds the trolley in seconds: she knows where it is, walks straight to it, rolls it out, and the trolley comes to rest in the light.
- **Alt text:** A supervisor at a cross aisle walks straight down one rack row, finds a loaded trolley parked behind the racks and rolls it out into the aisle, where it comes to rest.

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 50mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 4 seconds: a medium shot at chest height inside a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor. A production supervisor, an Indian woman in her mid-thirties with her hair tied back in a low bun, wearing a plain, unbranded navy blue work jacket with no embroidery, no chest print and no badge text over a plain grey shirt, dark work trousers and black safety shoes, a plain blue lanyard with a blank white card stands at a cross aisle holding a slim tablet low against her hip, its plain matte grey back toward the camera and its face never seen. She lowers it, nods once, turns and walks decisively down one rack row. She does not speak. The camera pans with her and holds her back three-quarters as she goes.

HARD CUT at 4 seconds.

SHOT 2 - 4 to 8 seconds: the same woman walks round the end of a rack row and reaches a loaded trolley parked in a gap behind it. She puts her hand on its rounded tubular push handle and exhales, her face turned toward the trolley, then grips the handle and rolls the trolley out of the gap toward the aisle, unhurried, her back three-quarters to the camera. The camera dollies back with her. A small dark tag on the trolley's top rail stays soft in focus.

HARD CUT at 8 seconds.

SHOT 3 - 8 to 12 seconds: a locked-off medium shot at handle height in the bright main aisle: she parks the trolley in the centre of the frame, lets go of the handle and walks out of frame to the right. The trolley stands at rest in the daylight; the clean, flat centre of its top rail is sharp and unoccluded. The frame holds.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```

### F7 · / (homepage) (deferred; still in its place: P-home-close)

- **Purpose:** A real bay from above, empty enough for the visitor's own trolleys to be drawn onto it.
- **Alt text:** One bay of a plant seen straight from above in daylight: rack tops, the main aisle, an inspection station and an empty queue area.

```text
Ultra-realistic live-action cinematic footage, shot on a cinema camera with a 35mm spherical lens at T2.8, 1/50 shutter, 24 fps, fine natural grain, true-to-life neutral daylight colour, bright and airy, calm and human.

SHOT 1 - 0 to 12 seconds: a single locked-off top-down view from about twelve metres up, looking straight down onto one bay of a large, working Indian automotive-component plant with grey epoxy floor, painted yellow aisle lines with real wear, tall grey pallet racking stocked with machined aluminium housings, plain grey steel columns, rolling shutter doors and a ceiling fan over the office mezzanine, lit by high clerestory daylight from camera left and overhead 5000K LED bays, and a faint green-grey bounce from the epoxy floor in daylight: the tops of two rack rows, the main aisle with its yellow lines, an inspection station and a painted queue rectangle. The floor of the aisle and the queue rectangle are clear and empty. Very little moves: daylight patches drift slowly across the floor, one operator crosses the far end of the aisle once and leaves. The camera never moves, and the last frame matches the first.

Every trolley in every shot is the same: a two-tier steel work-in-progress trolley, about 1200 by 800 mm, brushed steel frame, one rounded tubular push handle across its short end, four grey castors, loaded with machined aluminium housings that show small casting variations, a few with blue protective caps; its handle never changes shape. Real wear everywhere: scuffed paint on the rack feet, chipped floor paint at the aisle edges, a little dust on top of the housings. People act and do not speak: neutral faces, small natural movements, believable gait, consistent face and wardrobe in every shot. One camera move per shot, no orbits, no drone moves, no speed ramps. No text, signs, labels, numbers or logos anywhere; no embroidery, chest print or badge text on any clothing. No screens or interfaces. No glowing effects or graphics. No lens flare. Nobody looks at the camera. No warped hands or limbs, no melting objects, no duplicated identical parts, no shallow-focus beauty bokeh on background workers.
```
