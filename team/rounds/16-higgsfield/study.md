# How the best sites use pictures and films, and how AmIMotion beats them

Visual research lead, round 16. 2 Nov 2026.

**Method.** I looked through the scroll captures (desktop 1440x900 + phone 390x844) of all ~100 reference sites in `team/rounds/10-harvest/caps/`. Then I ran a live Playwright inventory on 44 of the strongest visual sites. It lists every `<video>` (src, natural size, duration, autoplay/loop/muted/controls, screen position) and every image larger than 250x250, in a desktop pass and a phone pass. I also took file weights with HEAD requests. Screen numbers ("s3") count viewports from the top, starting at s1. Some captures were blocked: Tesla (Akamai), Dyson (Cloudflare), Framework (Cloudflare), Ultrahuman desktop and Nothing (region gate). For those I used the phone pass or left them out. The contact sheet is at `/mnt/project-files/website-top/higgsfield/study-board.jpg`, with 28 moments labelled by site, screen and law. It is not in git because it holds third-party imagery.

**The short version.** The very best (Apple, Figure, SpaceX, 1X, Helion, Zipline) use **few, large, edited visuals**. Each one has **one job**. They are **cut separately for phone**, and the **interface or mechanism sits on or next to the real object**. The weaker industrial sites (Symbotic, Exotec, Verkada, Boston Dynamics, Augury) use stock-looking people, render cards and carousels. Their pictures decorate the page instead of carrying the argument. No site in the 100 hands a real film over to a live product state. That is our opening.

---

## 1. The 20 laws

Each law is a rule we can follow, backed by the examples it came from.

**L1. One subject, one job, one screen.** Each screen holds one image that makes one point. *AirTag s1* is only the tag on white with "What was lost is now sound". *Rivian s2-s8* gives one vehicle per screen on flat grey with a giant model name behind it. Rule: if a screen needs two pictures to make its point, it is two screens.

**L2. The hero is a muted, full-bleed film loop of 11-17 s with the headline in its calm third.** Measured: *Figure s1* is 13.0 s at 1920x1080 (3.9 MB). *Helion s1* is 16.5 s. *Waymo s1* is 11.1 s webm (1.8 MB). *Rivian s1* is 15 s. *Agility s1* is a 19.4 s product cut-down. *Hadrian s1* is 11 s and does not loop: it ends on a held frame. All are autoplay+muted+loop+playsinline with no controls. The outliers are an ambient 133 s planet rotation (*SpaceX s1*, Mars) and Vention's 32 s reel, which feels long. Rule: hero loop of 12-16 s, 3-4 shots, no controls, and a separate "Watch the film" button for the long cut with sound.

**L3. Cut a separate vertical master for phone. Never just centre-crop the 16:9.** *Figure* ships `homepage-01-mobile.mp4` at 1536x2730 (9:16) next to the 1920x1080 desktop file. *Vention* ships 1080x1920 next to 3840x1560. *SpaceX* ships 1080x1080 and 720x1080 phone cuts. *Skydio* ships 1080x1350 for phone. The counter-example is *Helion*: a 1920x1080 file covers a 394x852 phone box, so about 75% of the frame is cropped away and the machine is lost. Rule: every film is framed for 16:9 and 9:16 at the shoot. With Higgsfield, generate the vertical as its own shot, not a crop.

**L4. "What it is" = the product alone, on seamless ground, with hard, simple light.** *AirTag s1-s3*, *Rivian s2* (vehicle on #9a9a9a with an R1S wordmark bigger than the car), *Teenage Engineering s1* (one spotlight, a shadow that runs for four screens), *1X s1* (three NEO bodies on warm white), *Anduril s3* (each product in its own environment tile). Rule: the AmIGo tag, AmIMo anchor and AmIHub each get one hero still on seamless ground with a real shadow, from CAD or a real photo.

**L5. "What it does" = the product in real use, in a real place, at working height.** *Figure s2* (robot on a patio, people on the sofa behind, late sun). *Agility s5* (Digit among real totes in a real plant). *Gecko s1* (a worker in a hard hat flying a drone at a tank). *Oura s1* (ring on a real hand). *1X s3* (NEO pushing a vacuum: no face, only the job). Rule: the trolley, the rack, the epoxy floor and the supervisor's hand are our product shot. Put the tag *on the job*, slightly soft, never posed to camera.

**L6. Put the interface on or beside the object. The screen proves the claim.** *AirTag s9* ("Cold. Warm. Warmer. Hot." with an iPhone arrow saying 20 ft beside a Watch). *Vision Pro s4* (a real man in a real living room, app icons composited into the room). *Skydio s4* (DFR Command map next to the drone). *Lumafield s7* (the CT-scanned part in false colour with the defect list). Rule: every AmIMotion film ends on, or hands over to, the live map or AmIHub screen. A film without the interface is only atmosphere.

**L7. Show the mechanism with abstract animation, not footage.** *Helion s3-s5* uses two magenta plasmoids that collide and compress over three pinned screens, one sentence each. *AirPods s3, s7* uses chromatic sound rings around a silhouette dancer. *AirTag s7* "How does it work?" is a 4.5 s 576x576 webm of soft rings (0.9 MB). Rule: the timing-and-anchor mechanism is drawn in the browser (SVG/three.js), stepped by scroll. It is never an AI film of glowing waves.

**L8. Put the number on the picture.** *Waymo s2*: "over 10X safer than an average human driver" sits on a dark interior shot of the empty driver's seat. *Lumafield s3*: 350% / 120 / 85% / $18M sit on a black band right under the CT imagery. *AirPods s10*: "2x more / 4x more" sits above a macro of the mic mesh. Rule: our proof numbers (metres, seconds, hours of wait found) sit on a dimmed frame of the exact moment they measure.

**L9. People act and never pose. Nobody looks at the lens, and faces are often partial.** *Figure s2*, *Gecko s1*, *Zipline s7* (a family at a table, mid-laugh, not facing camera), *SpaceX s4* (astronaut in three-quarter profile), *1X s2* (a man's head cropped at the brow, arm around the robot). The weak sites are the opposite: *Exotec s7* (a smiling woman at a laptop), *Symbotic s5* (a shopping trolley on a laptop) and *Verkada s9* read as stock. Rule: workers are mid-task, three-quarter or from behind, hands busy, and no smile at camera.

**L10. Use one or two macro shots per page to carry craft and trust.** *Hadrian s2* (coolant spraying off a spindle). *Figure s1* (black glove in shallow focus). *AirPods s10* (mic mesh). *Machina s1* (tool tip forming sheet metal). *Lumafield s7* (CT cross-section). Rule: one macro of the AmIGo tag on a steel rail (dust, scuffed powder coat, focus falling off), and one of the anchor's mount on a concrete column.

**L11. Keep one grade across the whole page. Brand colour lives in the light, not in overlays.** *Figure* is all warm-grey daylight. *1X* keeps a single periwinkle backdrop on every screen. *SpaceX* is blue-hour cyan and black on every screen. *Hadrian* is navy with orange accents in both the footage and the UI. The failure is *Formlabs*: an orange printer, cool office stock and saturated material swatches mixed on one page. Rule: our grade is neutral daylight, slightly warm highlights, grey-green shadows, with no teal/orange push. Our accent colour appears only in the UI layer.

**L12. Count your visuals. The best use 4-12 unique pictures per page, all large.** Measured: *Figure* has 3 films + 1 still on a 5-screen page. *SpaceX* has 2 films + 4 stills on 6.4 screens. *1X* has 1 film + 2 stills. *AirTag* has about 10 stills + 3 small loops on 16 screens. The weaker pages spray tiles: *Vention* 38 images, *Rivian* 32, *Skydio* 26, *Boston Dynamics* 16 small cards. Rule: home page at most 10 unique visuals, each at least 60% of the viewport width on desktop.

**L13. Text never fights the picture.** The headline goes in the empty third of the frame, or on its own colour field next to it. *SpaceX s2* (text in the sky right of the tower), *Figure s1-s3* (small caps lower-left, image untouched), *Vision Pro s8* (centred white type on a dark, low-detail cabin), *Oura s1* (serif on a flat peach wall, hand on the right). Rule: compose every shot with a planned text zone. Use a bottom-edge scrim only, no full-frame darkening, and never put text over a face or the product.

**L14. The poster is the first frame, and the first frame must work as a still.** Every autoplay hero above loads a poster or `#t=0.001` (*Waymo*). The page reads before any video plays. *Hadrian s1* ends on its last frame, which works as the end state. Rule: frame 0 of each film is composed as our best still, and the last frame matches frame 0 so the loop is seamless (or the film is meant to hold on its end frame).

**L15. Click-to-play films are separate assets, labelled with place and condition.** *Waymo s3* shows a row of 4K films titled "SAN FRANCISCO - DAY, Red Light Runner" and "PHOENIX - NIGHT, Hail" (15-40 s, 5-63 MB, controls, loaded only on click). *Redwood s5* shows partner videos (VW, Panasonic, BMW) with controls. Rule: AmIMotion "Scenarios": real or Higgsfield films titled "PUNE - NIGHT SHIFT, trolley left at inspection", each with its measured outcome.

**L16. Proof imagery is specific and named.** *Form Energy s2* shows the real Factory 1 in Weirton, WV from the air. *Formlabs s5* shows Tesla Giga Nevada. *Agility s5* shows GXO. *Waymo s5* shows the live US city map. *Anduril* names the facility (Arsenal-1). Rule: proof shots carry a caption with place, date and number. If an image is AI-made, it never pretends to be a named customer site.

**L17. Brand moments use kinetic type + a cut-out product + a small photo chip.** *Zipline s3-s5*: huge condensed "DELIVERY THAT SAVES YOU TIME", the drone cut out and hanging from a cable, and a thumb-sized photo of a customer set inside the type line. It is the most memorable non-film move in the set. Rule: use this once, for our line "Where work is. Where it waits.", with the CAD tag cut out and a tiny real-floor chip.

**L18. Pin one hero object and scrub it with scroll. Do it once per page.** *Teenage Engineering s1-s6* (the product's shadow keeps growing for five screens until the copy jokes about it). *Helion s3-s5* (fusion steps pinned). *AirPods s6-s8* (rings expand around "The best thing you've never heard"). Apple product pages scrub image sequences. Rule: one pinned sequence on the home page (Move 2 below), never three.

**L19. Weight discipline: the hero costs 1-5 MB, and everything below the fold lazy-loads.** Measured: *Waymo* hero 1.8 MB webm with a 0.8 MB low-res alternate. *AirTag* loop 0.9 MB. *Figure* 3.5-5.4 MB per 13-16 s 1080p film. *SpaceX* landing loop 2.7 MB. Overweight cases: *Hadrian* 8.9 MB and 10.9 MB for 31 s, *Vention* 15 MB, *SpaceX* Mars 10.8 MB, *Ultrahuman* 19 MB vertical, *Form Energy* an 8 MB PNG screenshot. Rule: hero at most 3 MB (H.264 + AV1/webm, 1080p, 24 fps, CRF about 28), phone cut at most 2.5 MB, stills in AVIF/WebP at 2x, `preload="none"` below the fold.

**L20. Render-card mosaics and stock read as "vendor". Real light reads as "maker".** *Boston Dynamics*, *Symbotic*, *Exotec* and *Verkada* build their pages from small cards with stock or flat renders, and none of their images carries an argument. *Vention* is the exception that works: its 3D factory floor (*Vention s2*) is a real product render of the actual configurator. Rule: renders only where the render is the product (CAD, the map, the planner). Everything about people and place is photographic.

---

## 2. Patterns by page job

| Job | What the best do | Best 2-3 | AmIMotion: Higgsfield + CAD |
|---|---|---|---|
| **Hero** | Full-bleed muted loop of 12-16 s, 3-4 shots, headline in the calm third, "Watch the film" for the long cut, vertical phone cut | Figure s1, SpaceX s1-2, Helion s1 | Seedance 2.5, 13 s, 3 shots: (1) wide aisle, a supervisor walks to a parked WIP trolley (as in ref e142); (2) macro, a hand on the handle with the tag soft on the rail; (3) slow push to the trolley in place. The last frame dissolves to the live map (Move 1). Separate 9:16 generation. |
| **Problem** | Shows the cost in human terms; quiet, slightly cold; often a number on the frame | Waymo s2 (empty driver seat + 10X), Augury s1 (dark plant + "industry can't run without you"), Gecko s1 | A still: a supervisor at the end of a long rack row at 06:10, looking down an empty aisle, handheld clipboard. Overlay: "Average WIP trolley search: 14 min" (our measured figure, sourced). Nano Banana Pro, 35 mm, practical light. |
| **Mechanism** | Abstract, stepped, pinned, one sentence per step; no live action | Helion s3-5, AirTag s7, AirPods s3 | No AI footage here. SVG/three.js: the CAD anchor on a column, the tag on a trolley, timing lines that become a dot on the floor plan. Scroll-stepped over 3 screens. Our real CAD gives the exact geometry. |
| **Product** | Seamless ground, single light, real shadow, then one macro; UI next to the object | AirTag s1-3 + s9, Rivian s2, Teenage Eng. s1 | CAD renders of AmIGo/AmIMo/AmIHub on warm-grey seamless with a raking key light. Then a Nano Banana macro of the tag on scuffed yellow powder coat. Then the AmIHub screen beside it showing "Trolley T-114, Bay 3, waiting 42 min". |
| **Proof** | Numbers on the image; named place/date; click-to-play scenario films | Waymo s3 + safety hub, Lumafield s3, Form Energy s2 | Scenario cards: a 6-8 s muted loop per scenario (real pilot footage when we have it, Higgsfield until then, labelled "reconstruction"). Each card has the measured result set large. The number counts up when the card enters view. |
| **Industry / use case** | One environment photo per industry, same grade, no people posing | Skydio s2 (DFR / Security / Inspection / Mapping tiles), Gecko s5 (Pulp & Paper, Defense, Oil & Gas), Anduril s3 | 4-6 tiles: auto components, pharma, electronics, warehousing, aerospace MRO. Each is a Nano Banana wide at working height with the trolley/bin/pallet visible. Hovering plays a 3 s loop. |
| **Pricing / pilot** | Show the thing you get (sample part, kit); hands, a box, a schedule | Formlabs (free sample part), Ather s6 (book a test ride with the product visible), AirTag "Starting at $29" next to the product | Photo of the pilot kit laid out on a grey workbench: 20 tags, 4 anchors, 1 hub, a tape measure, a printed bay plan. A still, not a film, so it can be studied. |
| **About / people** | Real team in real space, often at work, one group shot at most | Form Energy s3 (crew in hi-vis on the floor), Machina s4 (team between yellow robots), 1X s2 | Real photographs only. No AI faces of real people, ever. Founders on a customer's floor, mid-conversation, three-quarter angle. |
| **Contact / CTA** | Calm closing image; product or place at rest; one button | Figure footer (blurred robot behind the form), Teenage Eng. ("LIFE IS FANTASTIC! $399 AGREE!"), Hadrian s4 | The last frame of the hero, now still: the trolley parked, the tag soft, slight blur behind "Book a call". It closes the loop the page opened. |

---

## 3. Video specifics

- **Loop lengths measured.** Hero loops: 11.1 s (Waymo), 13.0 s (Figure), 15 s (Rivian), 16.5 s (Helion), 19.4 s (Agility). UI/mechanism loops: 1.6 s (Ather Halo), 4.5 s (AirTag), 5.3-7.7 s (Rivian feature tiles), 6.3 s (1X). Ambient exceptions: SpaceX Mars 133 s. **Our numbers:** hero 12-14 s, scenario cards 6-8 s, UI and mechanism loops 3-5 s.
- **Apple's in-view clips.** Apple product pages do not use `autoplay`. *Vision Pro* has 27 unique clips on a 36-screen page and *AirPods Pro* 13. Each clip runs 2.5-8 s (Vision Pro median about 6 s, range 3-21 s), is started by script when it enters view, plays once or loops, and has a visible pause button (accessibility). Use this pattern for our mechanism/UI clips: play on view, pause off view, add a pause control.
- **Videos behind numbers.** *Dexterity* puts a short loop behind each stat (`stat-3.mp4`, `stat-4.mp4`, ...), which is L8 in motion.
- **Cut rhythm.** The best heroes hold each shot for 3-5 s (Figure: three shots in 13 s; ref e142: 4.5 s + 4.5 s). Fast cuts under 2 s read as advertising. Use hard cuts on motion, never dissolves inside a loop. The one dissolve is the loop seam or the handover to UI.
- **Camera motion.** It is slow and motivated: a dolly back with the subject (e142 shot 1), a follow at walking pace (e142 shot 2), a slow push-in (Figure s3), a locked-off wide (SpaceX landing). Avoid drone sweeps, orbits and speed ramps; they read "AI demo". One move per shot.
- **First/last frame.** Compose frame 0 as the poster (L14). For seamless loops, the last 0.5 s returns to the frame-0 composition, or cut the loop on a matching action. Export the poster as AVIF from frame 0, not a separate still, so there is no visible jump.
- **Sound.** Always muted autoplay. Sound only on the click-to-play long film (Waymo, AirPods "Watch the film"). Never a sound toggle on the hero.
- **Where films beat stills.** Things that are about time and motion: work moving, a trolley waiting, the hero's mood, scenario proof. Motion is our subject (work in motion vs work waiting), so the hero has to be a film.
- **Where stills beat films.** Product identity (L4), pilot kit, industry tiles at rest, people/about, anything with a number to read. Lumafield and AirTag show that a still beside a UI explains better than a video does. Stills also win on phone data budgets.
- **How the best avoid "stock".** (1) They shoot their own product in every frame (Figure, 1X, Agility): no generic shots. (2) One location language and one grade per page (L11). (3) Partial faces, people at work, not looking at camera (L9). (4) Imperfect real places: Hadrian's coolant mist, Gecko's dented tank, SpaceX's sooty tower. (5) Captions with place and condition (Waymo "PHOENIX - NIGHT"). Stock always fails at least three of these.

---

## 4. What makes AI imagery read as real or fake

**From ref e142 (Seedance, 9 s, two shots).** What works: the 50 mm spherical look and natural grain. Repeating racking with believable perspective. Painted yellow aisle lines with real wear. Mixed clerestory daylight and overhead LED. The back-follow at walking pace in shot 2. The trolley load (machined housings) stays steady while it moves. The tag stays soft. Shot 2 is the most real-looking AI shot in our library, because the subject faces away and the motion is simple.

What gives it away, or is a risk: (a) a **logo-like orange wordmark** appeared on her chest even though the prompt banned logos. Ban "embroidery, chest print, badge text" explicitly. (b) In shot 1 she **talks to herself and her eyes drift toward the lens** (frames 2-3). The "smiles slightly to herself" direction becomes acting. (c) The handle on the trolley **changes shape between frames 1 and 4**, so continuity of props is the main weak point. (d) The front load of housings is **too clean and too identical**, like a duplicated asset. (e) The light on her face is "beauty" soft, while the plant light is top-down and harsher.

**Concrete prompt rules (Nano Banana Pro stills, Seedance 2.x/Kling 3.0 films):**
1. **Name the camera and lens physically:** "cinema camera, 35 mm or 50 mm spherical, T2.8, 1/50 shutter, 24 fps, fine natural grain". Never "8K, hyperreal, ultra-detailed": those words make it look glossy and plastic.
2. **Light from real sources, with direction and colour temperature:** "high clerestory daylight from camera left, overhead 5000K LED bays, slight green spill from the epoxy floor". Faces get the same light as the room. No "cinematic lighting" or "soft studio light" in a plant.
3. **Ask for wear and imperfection explicitly:** "scuffed yellow powder coat, chipped floor paint at the rack foot, dust on top of the housings, one carton slightly crushed, shrink-wrap catching light". Vary the parts: "housings with small casting variations, a few with blue protective caps".
4. **People:** "mid-task, three-quarter back or profile, does not look at the camera, does not speak, neutral face, small natural movements". At most one emotional beat per shot, written as an action ("exhales and lets go of the handle"), not a feeling ("relieved").
5. **Wardrobe with nothing written on it:** "plain navy work jacket with no embroidery, no chest print, no badge text, plain blue lanyard with a blank white card". Repeat the wardrobe word-for-word in every shot prompt, and use a reference image for the face and outfit.
6. **Lock the props:** describe the trolley once as a spec ("two-tier steel WIP trolley, 1200x800 mm, rounded tubular push handle on the short end, four grey castors") and reuse that exact text in every prompt. Add the CAD render of the AmIGo tag as an image reference, so the tag's shape stays correct.
7. **Camera motion:** one move per shot, said with speed ("dolly back at walking pace", "locked-off", "slow 10-percent push-in over 4 s"). No orbits, no drone, no speed ramps, no whip pans.
8. **Shot length:** 4-5 s per shot, at most 2-3 shots per generation. Hard cuts written as "HARD CUT at 4.5 s". Longer single shots drift in faces and props.
9. **India-specific realism:** "Pune / Chakan auto-component plant, mixed-age workforce, safety shoes, hi-vis vests on some, steel racking with orange beams, rolling shutter doors, a ceiling fan over the office mezzanine". Real Indian plants are busier and less pristine than Western reference shoots, and that difference is what makes ours read as real.
10. **Negatives that matter:** "no text, signs, labels, numbers or logos; no screens; no glowing effects; nobody looks at camera; no warped hands; no duplicated identical parts; no lens flare; no shallow-focus beauty bokeh on the background workers".
11. **Grade in post, not in the prompt:** generate neutral, then apply one LUT across all assets (L11). Add 35 mm grain at 3-4% in post so every asset matches.
12. **Review gate:** frame-step every film for hand/handle continuity, text that appeared anyway, eye-lines to the lens, and repeated faces in the background. Reject on any one of them.

---

## 5. Where AmIMotion goes beyond all 100: moves to build in the browser

No site among the 100 hands a real film over to a live product state. Vision Pro composites UI into a filmed room, but as baked video. Waymo shows sensor views, but as separate clips. Each move below uses our three assets together: ultra-real Higgsfield footage, real CAD geometry and the live map/UI.

1. **Film-to-map handover (hero).** The 13 s hero ends on a locked-off high wide of the aisle with the trolley parked. On the last frame, a WebGL plane fades the footage to a top-down orthographic view (camera solved from the shot). The floor becomes our live map, and the trolley becomes the dot "T-114, waiting 42 min", in the same place in frame. The real world becomes the product with no cut.
2. **Scroll-scrubbed "work waits" film.** A 6 s Seedance shot of a trolley left in a bay, sped up so 2 hours pass (light moves across the floor, people pass by). The film is encoded as all-keyframe H.264 or an image sequence and scrubbed by scroll. The wait counter in the corner is live text tied to scroll position ("0 min ... 118 min"). Apple scrubs products; nobody scrubs *time*.
3. **CAD tag composited into real footage, with the real shape.** The AmIGo CAD model is tracked onto the trolley rail in the film (we plate the shot with a clean rail, then render the tag in three.js in the browser with a matched camera). Hover or tap and the tag goes from soft to sharp, and a thin callout reads its last ping. It is the actual product, not an AI guess, inside photoreal footage.
4. **Real-to-model x-ray slider.** A drag handle splits the frame: left is the photoreal plant still (Nano Banana), right is the same view as our clean CAD/twin model, with anchors on columns and coverage drawn on the floor. It works like Lumafield's CT view, but for a whole bay, and it shows exactly where the hardware goes.
5. **Scenario films that answer from the live data.** Each scenario card (L15) plays a 6-8 s muted loop. When it ends, the card turns into a tiny live query panel: "Ask: which trolleys waited at inspection over 1 hour?", answered from the demo dataset in the same frame. Footage asks the question; the product answers it.
6. **Phone-native vertical with the map in the thumb zone.** The 9:16 hero (L3) is shot with the subject in the top 60%. The bottom 40% is a live map strip that pans in sync with the camera move in the footage, using pre-solved camera keyframes. The film and the map share one screen as one piece.
7. **Timing lines drawn over real columns.** In the mechanism section, a still of a real column with an AmIMo anchor (CAD composited in), and SVG timing lines drawn in perspective between the anchors in the photo. The step-by-step explanation (L7) happens *inside* the photograph, not in an abstract diagram next to it.
8. **"Your floor" handover at the CTA.** The visitor drops in their bay size and trolley count. The closing still re-renders with that number of trolleys in CAD on the same photoreal floor, and the map below updates. The final image is the visitor's own plant.

**Build notes.** Use three.js for the plane/ortho handover and the CAD tag. Camera solve via a Blender export of the shot's focal length and path. Moves 1-3 need the footage generated with a **locked-off or simple dolly camera and a clean, unoccluded floor area** where the UI lands, so the Higgsfield shot list must plan for it. Lazy-load everything after the hero; target an LCP poster under 150 KB.

---

## 6. Contact sheet

`/mnt/project-files/website-top/higgsfield/study-board.jpg` (local copy `team/rounds/16-higgsfield/study-board.jpg`, not committed): 28 crops, each labelled site, screen and law. Rows: Apple AirTag/AirPods, Vision Pro/Figure, 1X/SpaceX, Zipline/Helion, Waymo/Anduril/Teenage Engineering, Agility/Gecko/Hadrian/Rivian, Skydio/Lumafield/Vention/Oura.

## Appendix: inventory highlights (live, 2 Nov 2026)

| Site | Screens | Videos (autoplay) | Large imgs | Hero film | Phone strategy |
|---|---|---|---|---|---|
| Figure | 4.9 | 3 (+3 mobile) | 1 | 13.0 s 1080p, 3.9 MB | 1536x2730 separate cut |
| SpaceX | 6.4 | 2 | 4 | 133 s Mars 10.8 MB; landing 12.9 s 2.7 MB | 1080x1080 / 720x1080 cuts |
| Vention | 17.6 | 1 (+ vertical) | 38 | 31.7 s 3840x1560, 15 MB | 1080x1920 cut, 14 MB |
| Waymo | 11.2 | 1 loop + 5 click films | 20 | 11.1 s webm 1.8 MB | 600x354 low-res alternate |
| Helion | 13.1 | 2 | 11 | 16.5 s 1080p | none (center-crop, loses subject) |
| Hadrian | 3.8 | 3 | 1 | 11 s no loop 3.6 MB; 31 s loops 9-11 MB | cover-crop |
| Rivian | 18.2 | 7 | 32 | 15 s 1440x810 (Cloudinary f_auto) | cover-crop |
| Agility | 8.1 | 1 | 13 | 19.4 s 720p H.265, 3.4 MB | same file |
| Skydio | 7.4 | 1 (+ vertical) | 26 | 35.2 s 720p | 1080x1350 cut |
| AirTag | 16.2 | 3 small loops | ~10 (CSS) | none (still hero) | stills re-laid |
| 1X | 3.3 | 1 HLS | 2 | 6.3 s 720p via m3u8 | HLS adaptive |
| Redwood | 6.9 | 3 loops + 6 click films | 15 | full-life-cycle .mov loop | — |
| Apple Vision Pro | 36.3 | 27 in-view clips (JS play) | 66 | none (still + clips) | same clips, re-laid |
| Apple AirPods Pro | 32.4 | 13 in-view clips, 2.5-7.9 s | 52 | 'Watch the film' button | same clips |
| Dexterity | 5.1 | 5 loops (hero + 3 stat videos) | 2 | hero loop | same files |
| Formlabs | 6.1 | 3 tiny loops | 12 | still | — |
| Boston Dynamics / Symbotic / Oura / Nothing / Teenage Eng. | 6-11 | 0 | 5-16 | stills only | — |
