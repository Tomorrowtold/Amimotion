# Hero review, round 5

Hero strike unit (all ten profiles), scored by the ten committee leads. 1 to 2 Nov 2026.
Starting point: r4 (`frame/shots/hero-r4-*`), the first frame with a CAD render of AmIGo. End point: `frame/hero.html` as it stands now, shot as `frame/shots/hero-final-<size>.png`.

What changed, in one line: the tag now sits on the page itself. Its studio paper is flattened into the stone ground and made transparent, so there is one ground, no panel and no box on the phone; the tag is bigger, sharp to 8K, and the words come first at every size. The locked hero words are unchanged (homepage-final.md offers no alternative hero line, so none was taken).

## 1. Reference captures used

Live first screens, captured 1 Nov 2026 with Playwright (Chromium, DPR 1, a phone user agent at 390), after load plus 3.5 s, cookie banners accepted where a button allowed. Files: `research/hero-refs/<site>-<size>.png`, numbers in `research/hero-refs/captures.json`. Bytes are everything loaded in that window on an unthrottled line, so they are an upper bound on each site's first screen, not a lab figure. LCP is Chromium's own entry.

| Site | Why it is in the set | 1440 first screen | Phone first screen | Bytes loaded (1440) | LCP (1440) |
|---|---|---|---|---|---|
| Apple AirTag (required) | The bar for one object read in a glance | Product name, a two-line headline centred, the tag on the page's own white with no box. Concentric rings behind it (banned for us). | Headline, then the tag, then copy below. | 1,360 KB | 1.16 s |
| Anduril (required) | The bar for terse industrial confidence | Full-bleed dark footage, a four-line tracked-caps statement laid over it, micro labels ("EST. 2017"). | The same statement fills the phone. No product visible. | Streaming video; not a fair figure | 1.52 s |
| Vention (required) | Closest buyer (manufacturing automation) | Dark gradient, a four-line H1 at 72 px, two buttons, a software screenshot with a 3D cell, a logo wall. | Three-line H1, paragraph, two full-width buttons. Picture below the fold. | 22 MB | 2.48 s |
| Apple AirPods Pro (chosen) | Strongest light first screen in the library: one huge image, words low | A full-bleed photograph; the product line and one sentence at the bottom left; a Buy pill. | Photograph first, words under it. | 8.3 MB | 1.12 s |
| Form Energy (chosen) | Strongest industrial explainer first screen | Aerial factory photograph full bleed, two-line condensed caps H1, a paragraph over the photo. | Same, stacked; the H1 holds the first screen. | 22 MB | 0.59 s |
| Teenage Engineering (chosen) | Strongest single-object hardware first screen | One product, lit on black, no headline at all, a sparse icon nav. | The product alone. | 1.6 MB | 0.96 s |

Nothing (nothing.tech) was captured too and dropped: a store-locator dialog covers its first screen at every size.

What the set says about a first screen:
1. Every one of the six owns **one ground**. AirTag's tag sits on the page itself; AirPods and Form Energy run a photograph edge to edge; Teenage Engineering lights its object on the page's black. None puts a picture in a box of a different tone beside the words. r4 did.
2. The object is **big and alone**. AirTag's tag fills about a third of the screen height; Teenage Engineering's fills half.
3. On the phone the **words come first** (AirTag, Vention, Form Energy) or the photograph is the whole message (AirPods). None opens on a plain grey square.
4. They are **heavy**. The lightest, Teenage Engineering, loads 1.6 MB; AirTag 1.4 MB. Our budget is 300 KB. This is where we win outright.

## 2. r4 scored by the committee

Scored 1 to 10 against the best reference first screen for the job (AirTag at 1440 and 390, AirPods Pro at 2560), on `frame/shots/hero-r4-*.png`. Each lead gives one reason and one fix.

| Lead | 1440 | 390 | 2560 | Reason | One concrete fix |
|---|---|---|---|---|---|
| Creative Director | 6 | 4 | 5 | Two grounds on one screen. The render's paper (#e8e8e6, measured) is a grey panel beside the stone page, so the eye reads "picture in a box", the thing AirTag never does. At 1440 the H1 starts at y 439 with 350 px of empty stone above it. | Put the tag on the page itself: flatten the paper to #f5f5f2 so there is one ground. |
| Head of Words | 7 | 6 | 7 | The words are right and locked. But on the phone the visitor scrolls past 390 px of grey before the first word, and at 2560 the lede runs to the bottom edge with 100 px left. The H1 must be the first thing read. | Phone order H1, tag, lede. Words block centred on the tag, not pinned to the floor. |
| Buyer Truth Lead | 6 | 5 | 6 | Readers see a dark box and a promise about a floor. Nothing on screen says "small" except the words. The tag at 450 px in an 820 px grey panel looks like a router on a table. | Show the tag larger and alone on the page, so "a small tag" is the object they look at. |
| Product Render Director | 6 | 5 | 4 | The render is good. The presentation hurts it: the paper panel reads as a backdrop photo pasted on a web page, and at 2560 @2x the 2400 px file is stretched to 2920 device px, so the deboss is soft. | Re-frame closer, render a 7680 master, and serve 3840 and 7680 by srcset. |
| Film Director | 6 | 5 | 6 | No film yet, so judged as a poster. One object, calm, no motion: correct. The grey box at the top of the phone reads as a video that has not loaded. | Remove the box: a picture with no edge can never look like a loading player. |
| Experience Design Lead | 7 | 5 | 7 | Nav is clean: four words, one button. The phone shows the button, then a grey box, then the H1 at y 478. The first screen spends its best space on nothing. | H1 directly under the bar on the phone. |
| Design Engineering Lead | 8 | 8 | 6 | 220 KB at 1440 @2x and 2560 @2x, 62 KB on the phone @2x, works with JS off. But 164 KB of the 220 KB is grey paper, and the 2560 @2x screen gets an undersized file. | Crop to the tag and let the page be the paper: the same picture at 1/5 of the bytes. |
| Search and AI Answers Lead | 8 | 8 | 8 | H1 and the canonical first sentence are real text in the HTML, readable with JS off. The alt text is accurate. The image is the LCP element instead of the H1 the spec asks for. | Keep the H1 first in source and preload nothing but the display font. (LCP owner: Design Engineering.) |
| Truth and Quality Lead | 9 | 9 | 9 | Only the founders' CAD, no part added, words as locked, no claim beyond the lede's sources. The one note is the deboss reads darker than a photo would (render notes say so). | None on truth. Keep the picture CAD-only. |
| Lead Magnet and Growth Lead | 7 | 6 | 7 | Zero bytes of growth code in the first screen, as the charter asks. On the phone the visitor must scroll before knowing what this is, which costs the diagnostic its first visitors. | Same as Experience Design: H1 first on the phone. |
| **Mean** | **7.0** | **6.1** | **6.5** | | |

The four known faults, judged:
1. **Paper panel.** Real and the biggest fault. Measured: panel #e8e8e6 against ground #f5f5f2, a 1.12:1 luminance step, enough to draw a rectangle across 51 % of the screen.
2. **Tag small in the slot.** Real. The tag is about 550 x 350 px in an 821 x 811 px slot at 1440: two thirds of the width but under a third of the slot's area, and the rest of the slot is grey paper.
3. **H1 low at 1440.** Real. The words are pinned to the floor; H1 top at y 439 of 900, with nothing above it but stone.
4. **Phone grey box first.** Real. The H1 starts at y 478 of 844, below a 390 x 390 grey square.

## 3. Three hero compositions

All three use only the CAD render and the locked words. Built as pages in `research/hero-r5/candidate-a.html`, `-b.html`, `-c.html` and shot at all three sizes (`research/hero-r5/cand-{a,b,c}-<size>.png`). All three already use the first fix every lead asked for: the render's paper is flattened to the page ground (`render_hardware.py --page`), so none of them has a panel.

**A. The tag on the page (kept).** Words in columns 1 to 5 as one block, centred on the tag. The tag sits on the stone ground itself, large, its contact shadow falling on the page, no frame. On the phone: H1, then the tag, then the lede, all inside the first screen.

**B. AirTag grammar, centred stack (killed).** H1 centred at the top, the tag centred under it, the lede centred under the tag.
Why it died:
1. It is Apple's layout. Next to the AirTag page it reads as a copy and loses, because Apple owns that grammar and has the better object (a polished disc with a logo, against our textured box).
2. A 47-word lede does not centre. Centred, it runs three ragged lines at 1440 that the eye has to find the start of each time (Head of Words: "read that twice" risk on every line start).
3. The stack pushes the lede to the bottom edge: last line at y 832 of 900 at 1440, and y 759 of 768 at 1366 x 768, where the tag also shrinks to 511 px. The composer's ick list names "a centred hero" for this reason.

**C. The tag at life size (killed; the idea nobody in the category has tried).** The tag is drawn at its real length, 86 mm, using CSS millimetres, so "a small tag" is proven by the object on your own screen. Words left, the tag alone on the right at true size.
Why it died:
1. CSS millimetres are not physical. A CSS mm is 96/25.4 px, which matches real size only on a 96 dpi screen at 100 % zoom. On the 390 phone the 86 mm picture box drew at 422 CSS px, wider than the screen (page scroll width 406 px), and on a 27-inch 2560 monitor the tag drew at about 75 real mm. A size claim that is wrong on most screens is a truth fault (Truth and Quality would stop it: it implies a fact the page cannot keep).
2. At 1440 and 2560 the life-size tag is a stamp in a sea of stone (the tag is 325 px: 23 % of the width at 1440, 13 % at 2560). The first fixation has nowhere to land after the H1, the opposite of the AirTag lesson.
3. It needs a caption ("actual size") to be understood. Captions are banned.

What A takes from the dead ideas: from B, the rule that the object and the words share one calm ground with no box (AirTag's real lesson, not its centring). From C, the size truth: A never claims a scale, and the lede's "small" is carried by the words, not by a ruler.

## 4. Rework of A, round by round

Every round re-shot at 1440 x 900, 390 x 844 and 2560 x 1440 (`frame/shots/hero-r5a-*` to `hero-r5e-*`). Each round ends with the width sweep (`research/tools/sweep-r5.js`: 320 to 3840 px in 10 px steps plus 11 named devices, 364 sizes; fails on horizontal scroll, an H1 line wider than its column, text over the tag, the H1 under the bar, or the phone lede below the fold) and the weight run (`research/tools/weight.js`).

**r5a. One ground.** Candidate A built into `frame/hero.html` on the existing 2400 px still, flattened with the new `render_hardware.py --page`. Found on the shot: the image rectangle still showed as a faint box, because AVIF and WebP decode the ground one level off (245,246,241 against 245,245,242) and the contact shadow ran to the crop edge. Fixed in the round: `tools/hero_images.py` now writes the still with alpha, transparent wherever it equals the page, feathered at the crop edge. Measured after: 245,245,242 on both sides of the edge. Left open: the tag soft at 2x (a 1,480 px crop upscaled), a faint light halo round the tag, the words split around the centre line.

**r5b. Bigger tag, no slot.** A new still (`amigo_page`, camera 0.37 m instead of 0.47 m, same rig and lens) rendered natively at 3840 x 2560. Because the paper is now transparent, the picture no longer needs a slot: it runs from column 5 to the screen edge and the tag is placed by its own mass, not by a box. On the phone the still is 152 vw wide and runs past both screen edges, so the tag is 340 px instead of 250. Words became one block centred on the tag (grid rows `1fr auto auto 1fr`). The halo was found to be fit error (paper brighter than the sweep next to a dark object, which light cannot do) and clamped in `page_grade`.

**r5c. 8K master.** The 7680 x 5120 master rendered as four overlapping tiles and stitched (a single 8K frame overran the Cycles time limit twice; see `renders/notes.md`). Web ladder now 800, 1600, 2400, 3840, 7680 in AVIF and WebP. The 3840 and 7680 AVIFs at q 74 instead of 62, because q 62 smoothed the spark-erosion grain into flat grey at 100 %. At 8K the deboss shows its lit inner walls, which the round 4 notes listed as a fault. Portrait monitors (aspect 4:5 or taller) now get the stacked layout; `sizes` updated to match.

**r5d. Large screens.** At 3840 x 2160 the hero was capped at 1,600 px tall, so the composition sat in the top three quarters with stone below. The cap is removed. The H1 and lede now grow with the screen past the design-system maximum (`max(var(--size-display), min(4.2vw, 11rem))`, lede to 2.375 rem), so at 3840 the words do not shrink to a caption beside the tag.

**r5e. The tag at full size, and the 2560 budget.** At 1440 the tag was 533 px, no bigger than in r4. The still now draws at 115 % of its column with a -5 % offset (the transparent margin may run under the words; the tag itself never does, which the sweep checks at every size), so the tag is 612 px at 1440 and 1,090 px at 2560, sitting between the lede's right edge and the nav button's right edge. A 5120 step was added to the ladder, because at 2560 @2x the browser skipped from 3840 to the 7680 file: 2560 @2x now loads 186 KB instead of 260 KB.

## 5. Final scores

The final frame is `frame/hero.html`, shot as `frame/shots/hero-final-<size>.png` (identical to r5e).

| Lead | 1440 | 390 | 2560 | Reason | What still blocks a 10, and the owner |
|---|---|---|---|---|---|
| Creative Director | 9 | 9 | 9 | One ground, one object, one line. Next to AirTag it is calmer (no rings), and next to Teenage Engineering the object is as big and as alone. It looks made for each size. | A camera A film or poster that shows *where work waits*, so the first screen says the promise and not only the product. Owner: Realism lab with the Film Director. |
| Head of Words | 9 | 9 | 9 | Locked copy, untouched. H1 is the first thing read at every size, two lines everywhere from 320 to 3840. The lede holds a 34 em measure on desktop. | The phone lede runs 7 lines; a cold-reader test of "read that twice" has not been run on this frame. Owner: Buyer Truth panel. |
| Buyer Truth Lead | 8 | 8 | 8 | Readers now see the small tag they are told about, and the words come first on the phone. But the picture shows a tag, not a floor or a wait. "Where it waits" is carried by words only. | The one-second flash test with the nine readers on this frame, and the camera A still or film that shows waiting work. Owners: Buyer Truth Lead (test), Realism lab (picture). |
| Product Render Director | 8 | 8 | 8 | It now reads as a product photographed on the page, sharp at 8K, with the deboss walls resolved. The CAD is untouched. | No blind 2AFC test yet, surfaces too clean (no gate mark or sink), plastic colour uncalibrated. Owner: Realism lab render reviewer; founders for one photo of a real part. |
| Film Director | 7 | 7 | 7 | As a poster it is right: still, calm, no glow, nothing that could look like a stalled player. But the locked spec puts the 9 s camera A film in this place, and the film does not exist. | The film. Until it ships, the hero is a product still where the story asks for a scene. Owner: Film Director with the hero film technical director. |
| Experience Design Lead | 9 | 9 | 9 | Four words and one button in the bar, nothing competing in the hero, H1 straight under the bar on the phone. | The nav wordmark reads "AmlMotion" because the company's own logo has a bare I. Not ours to redraw. Owner: Brand system designer, with the founders. |
| Design Engineering Lead | 9 | 9 | 9 | 73 KB (phone @2x) to 260 KB (3840 @2x), all under 300 KB. LCP 0.76 to 0.78 s over emulated slow 4G with 4x CPU (3 runs each, `research/tools/lcp4g.js`). CLS 0.00006. Complete with JS off. | A field-style trace on a real mid Android phone from India, and LCP on the H1 as the spec asks (the image wins LCP at every size, though it lands at the same time). Owner: Poster frame and LCP hacker. |
| Search and AI Answers Lead | 9 | 9 | 9 | H1 and the canonical first sentence are the first text in the HTML, readable with JS off. Alt text says exactly what the picture shows. | The page title and description are still the frame's, not the final meta from the search team. Owner: Search and AI Answers team. |
| Truth and Quality Lead | 10 | 10 | 10 | Words as locked. Picture from the founders' CAD only, no part added; the flattening changes the paper, not the product. No scale claimed. | None. |
| Lead Magnet and Growth Lead | 9 | 9 | 9 | Zero growth code in the first screen. The visitor knows what this is before scrolling, so the diagnostic gets warm visitors. | The diagnostic entry (in the menu sheet only) is not yet tested for first-click from this hero. Owner: Experience Design with Growth. |
| **Mean** | **8.7** | **8.7** | **8.7** | | |

Under 9: Buyer Truth (8), Product Render (8), Film (7). By the charter's rule the hero goes back to step 1 for those three reasons. All three are owned outside this unit: the camera A picture or film (Realism lab, Film), the reader flash test (Buyer Truth), and the render blind test (Realism lab). The composition, the type, the weight and the build are not what blocks them.

## 6. Measured first-screen weight (final)

Served over local http, every resource loaded counted (`research/tools/weight.js`). AVIF is what Chromium picks; WebP is the fallback for browsers without AVIF.

| Screen | Image picked | Image | HTML + CSS | Fonts | Total | With WebP instead |
|---|---|---|---|---|---|---|
| 390 x 844 @2 | 1600 | 16.9 KB | 15.9 KB | 40.5 KB | **73 KB** | 103 KB |
| 390 x 844 @3 | 2400 | 30.9 KB | 15.9 KB | 40.5 KB | **87 KB** | 142 KB |
| 1440 x 900 @1 | 1600 | 16.9 KB | 15.9 KB | 40.5 KB | **73 KB** | 103 KB |
| 1440 x 900 @2 | 2400 | 30.9 KB | 15.9 KB | 40.5 KB | **87 KB** | 142 KB |
| 2560 x 1440 @2 | 5120 | 129.1 KB | 15.9 KB | 40.5 KB | **186 KB** | 275 KB |
| 3840 x 2160 @2 | 7680 | 203.5 KB | 15.9 KB | 40.5 KB | **260 KB** | 483 KB (over budget; only an 8K screen on a browser with no AVIF) |
| 1440 x 900 @2, JS off | 2400 | same | | | **87 KB**, complete | |

r4 for comparison: 62 KB (phone @2), 220 KB (1440 @2 and 2560 @2), of which 164 KB was the grey paper.

## 7. Files

- `frame/hero.html`: the final frame.
- `frame/img/amigo-page-{800,1600,2400,3840,5120,7680}.{avif,webp}`: the ladder, RGBA, transparent where the picture is the page. The r4 `amigo-*` files are removed.
- `frame/shots/hero-r5a-*` to `hero-r5e-*`, `hero-final-*`.
- `renders/render_hardware.py`: new shot `amigo_page`, `--page`, `--stitch`, `--crop`, `--tag`, single-tile rendering. `renders/amigo_page.png`: the flattened 8K master scaled to 2400 for the contact sheet. The full 7680 x 5120 master is reproducible with the commands in `renders/notes.md` (not committed: 30 MB).
- `tools/hero_images.py`: the ladder cutter.
- `research/hero-refs/`: reference captures and `captures.json`. `research/hero-r5/`: the three candidates and their shots.
- `research/tools/sweep-r5.js`, `weight.js`, `lcp4g.js`: the checks.
