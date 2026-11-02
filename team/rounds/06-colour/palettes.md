# AmIMotion colour, round 6

Colour cell: Creative Director (chair), Brand system designer, Colour scientist, Accessibility designer, Hero strike unit (unit lead, first-second designer, benchmark tester). 2 Nov 2026.

**Brief, as it now stands.** Shiv: "fresh colors i mean electric indigo, electric blue, sky blue, white." That replaced the earlier brief mid-round. All five palettes are variations inside that family. Every one is light-first, keeps the logo mark at #66a5fa, passes WCAG 2.2 AA for every text pair, and keeps located and waiting apart for colour-blind readers. There is no glow and no decorative gradient.

**Recommendation: Sky Ground** (section 5). Runner-up: Indigo Lead.

Files
- `palettes-compare.png`: the five side by side. The top row is the 1440 hero and the bottom row is the sample section. Palette names appear on the sheet only.
- `final/skyground-*.png`, `final/indigo-*.png`: the final two at full size, with hero and section at 1440x900 and 390x844.
- `frames/<id>-r<n>.html`: one copy of `02-design/frame/hero.html` per palette and round, plus the sample section. `img/`: the retinted hardware still and film still for each frame. `shots/`: every shot from every round.
- `palettes/final-five.json`: every token of the five as shipped in the frames. `palettes/r1-blue.json`, `r2.json`, `r3.json`: the rounds.
- `research/ref-palettes.json`: sampled reference palettes. `research/contrast-final.txt`: the full pair table. `research/cvd-skyground.png`: the winner's section under deuteranopia, protanopia, tritanopia and greyscale.
- Tools: `tools/capture.js` (live reference captures), `tools/sample.py` (pixel sampling), `tools/colour.py` (WCAG, APCA, OKLCH, Machado 2009 colour-blindness simulation), `tools/build.py` (the frames and image retints), `tools/shoot.js`, `tools/montage.py`.
- Out of git (`.gitignore`): `research/refs/` (26 live captures), `research/refs-board.png` and `research/review/`.

Not touched: `site/`, `03-hero-film/` (contact sheet read only) and the 02-design files (read only).

---

## 1. Research: what fresh looks like in Nov 2026

Live first screens at 1440x900 (Playwright, 2 Nov 2026), 26 sites: the 10 named best-in-class sites plus 16 from the reference library. Each palette was taken from computed CSS and from the pixels (8-level quantised share, plus the most chromatic colour with at least 0.3% of the pixels).

| Site | Ground (sampled) | Ink | Accent (sampled) | Read |
|---|---|---|---|---|
| Vercel | #fafafa, 94% of the screen | #171717 | link #0072f5 | White and black only. Blue appears only on links. |
| Apple AirTag | #f5f5f7, 80% | #1d1d1f | none | A cool off-white with one object. |
| Things (Cultured Code) | #f2f5f7 | #303336 | app blue #2f7bf6 | A faint cool blue-grey ground. The closest to "sky", and very fresh. |
| Helion | body #eef2f5, hero dark | #1c2b44 navy | none | Navy ink on a cool ground. |
| Stripe | #ffffff, 65% | #061b31 navy | #533afd indigo, plus a gradient | Electric indigo on white is Stripe's action colour. We take the indigo and refuse the gradient. |
| Mercury | dark photo | | #5464ec indigo button | Indigo used as the action colour. |
| Waymo | #000 / #fff | #23233c | #1c74ec electric blue | Electric blue as the one action. |
| Ramp | #ffffff, 90% | #070707 | #e4f424 lime | One loud accent on white. |
| Linear, Anduril, Nothing, Teenage Engineering, Resend, Oxide, Lumafield, Apple home | 76 to 99% near-black | | | Dark by default. In this category, fresh-and-light is the open space. |
| Oura, Zipline, CFS | #f4e4dc, #f7f4e8, #ccc8c3 | | | Warm cream and blush. That reads as wellness, and it was the round-2 "palette-cream" tell. Dropped. |

Takeaways. (1) Light products that feel fresh in 2026 are white or cool off-white. None is warm stone. (2) Electric indigo (#533afd, #5464ec) has become the premium action colour of software, not of hardware. No industrial or robotics site in the library uses it, so it is ours to take. (3) Every one of them keeps the accent to one job.

The first pass, done before the new direction, was warm and neutral: Porcelain, Aluminium, Sky wash, Mineral and Iris. It was dropped because it falls outside the family. Its tokens are kept in `palettes/r0-warm-dropped.json` for the record only. One finding carried over: a deeper located blue plus a lighter, yellower waiting colour beats the current #66a5fa and #f0a43a pair for colour-blind readers (section 3).

## 2. The five palettes (as shot)

Common rules in all five:
- The logo mark stays #66a5fa.
- The hardware render's paper is retinted to the page ground (section 4).
- **Action and located are separated by job.** Indigo is used for actions (button, link) and blue for state (located).

| | Ground | Surface | Ink / ink-soft | Action (button, link) | Located | Waiting | Hall floor / machines / shadow |
|---|---|---|---|---|---|---|---|
| **1. Pure Electric**: true white, black ink, electric blue for every action | #ffffff | #f3f6fc | #0a0c14 / #4b5163 | button ink #0a0c14, link #1559ff | #1f6bff | #ffb020, edge #a86d00 | #ffffff / #eceff4 / #c9d0db |
| **2. Indigo Lead**: white page, electric-indigo type and actions, solid sky surfaces | #ffffff | #e8f1ff | #1e1a6b / #4a4780 | #4b3df0 (hover #3a2cd6), white text | #1f6bff | #ffb020, edge #a86d00 | #ffffff / #e6eefb / #c2cde3 |
| **3. Sky Ground**: the page is a pale sky, white is the raised surface, indigo-navy ink, electric-indigo actions | #f0f6ff | #ffffff | #0b1238 / #3d4870 | #4b3df0 (hover #3a2cd6), white text | #1f6bff | #ffb020, edge #a86d00 | #f0f6ff / #ffffff / #c3d3ec |
| **4. Indigo Band**: white hero, then deep-indigo bands where sky blue and amber read at full strength | #ffffff; band #1c1667 | #f4f6fb | #0c0b1f / #4b4a60; on band #ffffff / #c9c6ec | hero button ink, link #4338ca; on band a white button, link #a9cdff | #66a5fa (on the band) | #ffb020 | #ffffff / #e9ecf3 / #c4c9d6 |
| **5. Duotone**: no black anywhere. Indigo ink on white, solid sky blocks, hot coral for waiting. *The direction nobody in industrial tech uses.* | #ffffff | #d9e9ff | #2a1a8f / #4a4380 | #4a2cf5, white text | #1f6bff | #ff5c4d coral | #ffffff / #e3eeff / #b9c8ea |

All five share hardware #3a3d42, the darkest object on the page. Every palette also has a pressed tone, an ink-hover tone and a focus colour (the focus colour is the link colour); see the JSON.

### Contrast (WCAG 2.2 ratio, APCA Lc in `research/contrast-final.txt`)

| Pair | Pure Electric | Indigo Lead | Sky Ground | Indigo Band | Duotone |
|---|---|---|---|---|---|
| ink on ground | 19.52 | 14.84 | 16.70 | 19.39 | 12.78 |
| ink-soft on ground | 7.91 | 8.39 | 8.19 | 8.58 | 8.73 |
| ink-soft on surface | 7.30 | 7.37 | 8.90 | band: 9.39 | 7.09 |
| link on ground | 5.38 | 6.51 | 5.99 | 7.90 | 7.07 |
| link on surface | 4.97 | 5.72 | 6.51 | band: 9.46 | 5.74 |
| button text on button | 19.52 | 6.51 | 6.51 | 15.44 | 7.07 |
| focus ring on ground (3:1 needed) | 5.38 | 6.51 | 5.99 | 7.90 | 7.07 |
| located mark on ground (1.4.11, 3:1 needed) | 4.56 | 4.56 | 4.20 | **2.52 on white**, 6.12 on the band | 4.56 |
| waiting edge on ground (1.4.11) | 4.33 | 4.33 | 3.98 | band: 8.44 | 3.05 (coral fill) |
| hardware on ground | 17.0+ | 10.90 | 10.04 | 17.0+ | 17.0+ |

Every text pair passes AA, and the ink-soft pairs pass AAA. **One label rule:** text placed *on* a located fill is white (4.56:1 on #1f6bff), never ink (3.3 to 4.3:1, which fails). Text on a waiting fill is ink (8 to 10:1).

## 3. Located and waiting for colour-blind readers

Simulation: Machado, Oliveira and Fernandes 2009 at severity 1.0, in linear sRGB. dE is OKLab distance ×100. dL is the gap in lightness, the cue that survives greyscale and glare.

| Pair | Normal dE / dL | Deuteranopia | Protanopia | Tritanopia |
|---|---|---|---|---|
| Current: #66a5fa and #f0a43a | 29 / 6 | 30 / 9 | 27 / **1** | 26 / 6 |
| **#1f6bff and #ffb020** (Pure Electric, Indigo Lead, Sky Ground) | 46 / 24 | 46 / 25 | 39 / 15 | 29 / 19 |
| #66a5fa and #ffb020 (Indigo Band) | 32 / 10 | 33 / 12 | 29 / **2** | 25 / 8 |
| #1f6bff and #ff5c4d coral (Duotone) | 40 / 11 | 36 / 13 | 28 / **3** | 34 / 5 |

**Waiting is amber (#ffb020), not coral.** Coral looks fresher next to indigo, and it is the only waiting fill that reaches 3:1 on white by itself. Under protanopia, though, red loses its light, and coral falls to the same lightness as electric blue (dL 3). Amber stays on the yellow side of the blue-yellow axis that protanopes and deuteranopes keep, and it is 15 to 25 L lighter than electric blue. So the two marks differ in hue *and* in lightness, and they still separate in greyscale. Coral also reads as "error", and a waiting trolley is not a fault.

Amber at 1.8:1 on white does not meet 3:1 by itself. It therefore carries a 1.5 px edge in #a86d00 (4.3:1), which keeps it inside WCAG 1.4.11. The rule from round 2 stays: waiting is a filled shape and located is a line or trail, so shape tells them apart first.

The located blue is now **electric blue #1f6bff** (4.56:1 on white) instead of #66a5fa (2.52:1). A located trail is now a compliant graphic. #66a5fa stays the logo mark only.

`research/cvd-skyground.png` shows the winner's section under all three simulations and in greyscale: trail and pad stay apart in every view. **Finding from that sheet:** under deuteranopia and protanopia, the electric-indigo button turns the same blue as the located trail. This is acceptable because the button is a labelled control and the trail is a line on a map, so they never stand in for each other. It is also the reason there must never be a blue-filled *state* chip that looks like a button.

## 4. Retinting the pictures

- **Hardware still** (`build.py`, `retint_hero`). This is a white balance in linear light from the old paper (#f5f5f2) to the new ground. It is weighted by a smoothstep on linear lightness (0.12 to 0.5), so the paper lands exactly on the ground token and the contact shadow takes the ground's tint (a shadow on sky paper is sky-grey), while the tag's own dark grey keeps its neutral value. The first try was a lightness-cubed shift. It left a neutral-grey shadow on the sky ground that read as dirt, so it was replaced in round 2. The alpha from `hero_images.py` is kept, so no rectangle shows (measured: ground 240,246,255 on both sides of the image edge in Sky Ground). For the production ladder, the Render team should run the same retint on the 8K master, or run `render_hardware.py --page <src> <dst> '#f0f6ff'` followed by `hero_images.py --ground '#f0f6ff'`. The full `--page` divide would put about a 10% blue cast on the tag, so use the weighted version.
- **Film still** (frame 1 of `03-hero-film/contact-sheet.jpg`, the "after" state). Neutral tones go through per-channel curves that map the old floor, machines and shadow (#f5f6f1, #e4e4e0, #c4c4bc) to the palette's hall tones. Trails and pads are found by a chroma mask and recoloured to the palette's located and waiting colours, with their shading kept. This is a sample only; the 1600-px frames give a sharper result.

## 5. Committee: three killed, two reworked, one chosen

**Killed in writing**

1. **Pure Electric. Killed.** It is clean and correct, and it is exactly the brief Shiv gave before this one ("blue and black with a hint of white"). But on the sheet its hero is the current site with the stone removed: white, black type, a black button. Shiv asked for *colour* this time, and here the colour arrives only on a link. Its electric-blue located (#1f6bff) and its amber state pair were carried into the survivors.
2. **Indigo Band. Killed.** The band is beautiful, and on it #66a5fa reads at 6.1:1. But the palette makes the site dark in half its sections, against a light-first brief. Its hero is the same white-and-black as Pure Electric. #66a5fa as located fails 1.4.11 on the white sections (2.52:1). One deep-indigo band may come back later as a component, for a single proof or quote section. Not as the palette.
3. **Duotone. Killed.** It is the most original of the five: indigo ink everywhere, sky blocks, coral. Nobody in industrial tech looks like this, and that is why it was made. It fails on the reasons in section 3. Coral and electric blue merge in lightness under protanopia (dL 3). Indigo body text (#2a1a8f) reads as violet over a long paragraph. Indigo type on white with an indigo button is also the look of Stripe and Mercury, so the first screen reads as fintech, not as hardware. With amber in place of coral and near-black ink, it turns into Indigo Lead. That is where it went.

**Reworked**

*Indigo Lead*
- r1: ground #fcfcff, surface #ebf3ff, ink #17123f, waiting coral #ff5c4d.
- r2: waiting moved to amber #ffb020 with edge #a86d00, which fixes protanopia (dL 3 → 15). The ground became true white, because #fcfcff only looked grubby next to white UI.
- r3: the ink went from #17123f, which read as black, to electric-deep indigo #1e1a6b (14.84:1), so the H1 itself carries the indigo. The surface went to solid sky #e8f1ff. The section ground now equals the hall floor (white), so the film still has no edge.

*Sky Ground*
- r1: a white page with an electric-blue button. Located was #1f6bff and so was the button, so blue meant two things.
- r2: actions moved to electric indigo #4b3df0, so the split is now action = indigo, state = blue. The ink became indigo-navy #0b1238. The hardware retint was rebuilt as a linear-light white balance, so the shadow turns sky-grey instead of dirty grey.
- r3: the section sits on the sky ground, not the white surface, so the hall floor (#f0f6ff) runs into the page the way the tag does. White is kept for raised things: cards, the open menu, form fields.

**Chosen: Sky Ground.**

1. It is the only palette whose *first screen* is fresh colour, before any button is read. The whole page is sky, the type is indigo-navy and the action is electric indigo. Shiv's four words all show in one screen, and none of them is a gradient or a glow.
2. The tag is the darkest object, sitting on pale sky. It reads heavier and more premium on #f0f6ff than on white (10.0:1), and the cool ground matches the cool blue of the trails in the film.
3. The ground chroma is 0.014 in OKLCH. That is air, not a signal, so located (#1f6bff, 4.2:1, always a line plus a dot) is still the only *saturated* blue on the page. This answers the round-2 objection to Blueprint (a blue ground dilutes "blue = located"). That ground had a blue-grey cast. This one is a white with a hint of sky, and the state is a different, electric blue.
4. White as the *raised* tone, rather than a darker surface, inverts the usual light system. Cards and the menu glow white without any glow effect. An off-white ground also glares less on a phone in a bright plant than pure white does. That was the round-2 reason for not using #ffffff, and #f0f6ff keeps it.

Indigo Lead stays the runner-up if Shiv wants a true white page: same states, same action colour, same retint rules.

### Winner tokens (Sky Ground)

```css
--ground:#f0f6ff;   /* oklch(97.1% 0.014 258) page, and the hall floor */
--surface:#ffffff;  /* raised: cards, open menu, fields */
--pressed:#e3eeff;
--ink:#0b1238;      /* oklch(20.4% 0.074 270) 16.7:1 */
--ink-soft:#3d4870; /* 8.19:1 on ground */
--ink-hover:#1c2350;
--action:#4b3df0;   /* electric indigo: the one button, links, focus. 5.99:1 on ground, white text 6.51:1 */
--action-hover:#3a2cd6;
--on-action:#ffffff;
--brand:#66a5fa;    /* logo mark only */
--located:#1f6bff;  /* electric blue: state only, line + dot, 4.2:1 on ground, white label 4.56:1 */
--waiting:#ffb020;  /* amber: state only, filled shape */
--waiting-edge:#a86d00; /* 3.98:1, keeps the pad inside 1.4.11 */
--hardware:#3a3d42; /* render reference, never a UI colour */
```

### Hall film retint for the winner (for the Film team, `03-hero-film/grade_film.py`)

- **Floor = #f0f6ff**, the page ground exactly, so the film has no edge on the page. This is the "white floor": it reads as white with a breath of sky.
- **Machines, racks and trolleys = pure white #ffffff.** They sit one step *lighter* than the floor, so they read as clean white objects standing on a sky floor. That is the same inversion as the page's white surfaces.
- **Shadow and AO = #c3d3ec**, a sky-grey that is cooler than the current #c9c7c1, so no warm-grey dirt remains.
- **Trails = electric blue #1f6bff** at the current width. It is darker than #66a5fa, so it holds on a white floor (4.2:1).
- **Waiting pads = amber #ffb020**, with the pad's own shading as the edge.
- The hardware stays at #3a3d42 and neutral: no blue in the grade on the tags themselves.

The sample still is `img/skyground-r3-hall.webp`, shown in `final/skyground-section-1440x900.png`.

### Open
- The design system's tokens in `02-design/DESIGN_SYSTEM.md` and `frame/hero.html` are not changed. That waits for Shiv's yes.
- The production ladder of the hardware still needs the weighted retint run on the 8K master (Render team).
- The source logo SVG's wordmark (#70afff) remains unmanaged. The wordmark stays ink, and the mark stays #66a5fa.
