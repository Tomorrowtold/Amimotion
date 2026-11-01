# AmIMotion design system, round 2

Design cell: Creative Director (chair), Brand system designer, Typographer, Colour scientist, Vibe-code detector. Unit leads read: Hero strike, Structure. 1 Nov 2026.

Built frame: `frame/hero.html`. Final shots: `frame/shots/hero-1440x900.png`, `hero-390x844.png`, `hero-2560x1440.png`. Rounds: `frame/shots/r1-*`, `r2-*`, `r3-*` (r3 is the same as `hero-*`), plus `r3-768x1024-menu-open.png`.
Copy source: `rounds/01-homepage-story/homepage-v5.md`, screen 0 (nav, section 4) and screen 1 (hero). `homepage-final.md` was committed while this round ran (19:23). Its nav bar and screen 1 match v5 word for word, so the frame matches the locked copy.

Status: **the system is ready for the builders. The hero is not ready for committee.** The picture slot is empty because `rounds/02-design/renders/` does not exist yet. Until a camera A render goes in, 58% of the first screen is a flat stone panel. Nobody should score this frame against AirTag before the render is in.

---

## 1. Research

Live captures at 1440 x 900 are in `research/ref-*.png` (Playwright, 1 Nov 2026). Computed type was read from each page.

| Reference | What it does in the first screen | What we take | What we refuse |
|---|---|---|---|
| Apple AirTag | Off-white ground #f5f5f7. One object. Headline about 80 px at 1440, tight tracking, ink #1d1d1f. | Large, tight display type. One object. Calm ground. | Concentric rings behind the object (banned on our site). Centred hero. |
| Anduril | Full-bleed footage. Huge grotesque in caps (Helvetica Now Display). Nav centred, sparse. | Picture at full bleed. Confident scale. A grotesque with an industrial voice. | Tracked caps, mono "EST. 2017" micro-labels, and type laid over footage. |
| Vention | Dark ground. Inter 72 px left. Two buttons. Logo wall. | Words on the left. | Inter, which reads as default. Two buttons. Four-line headline. Dark ground. |
| Linear, Mercury, Formlabs | Dark heroes with custom grotesques (Inter Display, Arcadia, Supreme). | One family with tight optical display cuts. | Dark-by-default. |

Takeaway: every strong reference owns one typeface voice and one ground, and gives the picture most of the screen. None of the four is light *and* industrial. That is the gap we take: a light page with an engineering grotesque at scale, and a hall render at full bleed.

## 2. Three candidates, two killed

Board: `research/candidates.html` and `research/candidates-1440.png` (the same hero copy in all three).

| | A. Studio white | B. Hall stone (**kept**) | C. Blueprint |
|---|---|---|---|
| Ground / ink | #ffffff / #1d1d1f | #f5f5f2 / #16181b | #eef1f4 / #0f1a2a |
| Type | Inter Tight + Inter | Mona Sans: wide semibold display, regular text | IBM Plex Sans + Plex Mono for figures |
| Verdict | **Killed.** It matches Apple's ground and the Inter that Vention and Linear already use, so next to them it looks like a copy and reads smaller. Pure white glares on a phone in a bright plant (the Colour scientist's sun test). | **Kept.** The ground sits one step from the model hall's floor, so a render runs into the page with no edge. The type is a grotesque with an engineering voice, it is open-licence, and nobody in the category uses it. | **Killed.** A blue-tinted ground weakens "blue means located", because blue would then be everywhere. Plex reads as IBM's voice. Plex Mono for figures is the "technical costume" the charter bans. |

Rework inside B (3 rounds):
1. Round 1 used ground #f6f4ef, the hall floor exactly. The taste inspector flagged it as **palette-cream** (OKLCH chroma 0.007, hue 89), the third-wave tell. Round 3 moved to stone #f5f5f2 (chroma 0.004, hue 106). Contrast with the hall floor is 1.01:1, so a render still sits within one tone. *Action for the Realism lab: grade the hall floor to #f5f5f2.*
2. The display width was tested at 100, 112.5 and 125. 125 breaks "Where work is." across three lines in the 5-column measure. 100 looks like any grotesque. 112.5 is kept.
3. Weights: 600 display, 400 text and 500 for nav and button. That is three, the Typographer's limit.

## 3. Tokens

All tokens live on `:root` in `frame/hero.html`. Pages use the semantic names only and never a raw hex.

### 3.1 Colour

| Token | Value | OKLCH | Use | Ban |
|---|---|---|---|---|
| `--ground` | #f5f5f2 | 96.9% 0.004 106 | Page | — |
| `--surface` | #ebebe7 | 93.9% 0.005 107 | One step down: picture slot, open menu, any block that needs a ground | Not for cards with shadows |
| `--pressed` | #e1e1dc | 90.8% 0.007 107 | Pressed state on surface | — |
| `--ink` | #16181b | 20.8% 0.007 258 | Headlines, nav, the one button's fill | — |
| `--ink-soft` | #4a4e55 | 42.3% 0.013 262 | Lede and body | Never lighter than this for text |
| `--ink-hover` | #2b2e33 | 30.0% 0.010 261 | Button hover | — |
| `--on-ink` | #f5f5f2 | | Text on the button | — |
| `--hardware` | #3a3d42 | 35.9% 0.010 261 | Reference grey for grading renders: the AmIGo and AmIMo are the darkest objects in any picture | Not a UI colour |
| `--link`, `--focus` | #1a56a8 | 46.3% 0.145 258 | Text links, focus ring. Derived from the brand hue. | — |
| `--located` | #66a5fa | 71.6% 0.141 256 | **State only**: where a thing is (trails, located marks, the logo mark) | Never text, never decoration, never a button |
| `--waiting` | #f0a43a | 77.6% 0.146 71 | **State only**: how long it has waited | Never text, never decoration, never a button |

There is no line or border token. Structure comes from fill steps only.

Measured pairs (WCAG 2.2 ratio, APCA Lc; script `research/tools/colour.py`):

| Pair | WCAG | APCA | Pass |
|---|---|---|---|
| ink on ground | 16.28:1 | 98.5 | body AAA |
| ink on surface | 14.88:1 | 92.6 | AAA |
| ink-soft on ground | 7.65:1 | 82.8 | AAA, Lc above 75 |
| ink-soft on surface | 6.99:1 | 76.8 | AA, Lc above 75 |
| link on ground | 6.54:1 | 78.2 | AA, Lc above 75 (the first try, #1f5fb8, scored Lc 73.9 and was darkened) |
| link on surface | 5.98:1 | 72.3 | AA. Use for links of 18 px and up only. |
| on-ink on ink (button) | 16.28:1 | 100 | AAA |
| on-ink on ink-hover | 12.4:1 | 96 | AAA |
| focus ring on ground | 6.54:1 | — | above 3:1 (non-text) |
| hardware on ground | 9.98:1 | 89.2 | the darkest object reads heaviest |
| located on ground | 2.31:1 | 43.2 | **Below 3:1.** A fill or mark only, at 3 px stroke or 24 px area or larger, always with a shape or ink label so colour is never the only signal |
| waiting on ground | 1.91:1 | 34.4 | **Below 3:1.** Same rule. On light pictures amber needs a shape (the tinted trolley), never a thin line |
| located on hardware | 4.32:1 | | Good on the dark tag |
| waiting on hardware | 5.23:1 | | Good on the dark tag |
| ink on located / ink on waiting | 7.05:1 / 8.53:1 | | Ink labels on state fills pass |

Located (L 71.6) and waiting (L 77.6) differ in hue but only 6 points in lightness. Under deuteranopia they could merge. **Rule:** waiting is always a filled shape and located a line or trail, so shape tells them apart and colour confirms it. The AmIHub screens still need the full three-way simulation (Colour scientist, open).

Dark theme is not shipped in this frame. Shiv's direction is light. The token names are ready for one, and it is a separate piece of work with the same pair table.

### 3.2 Type

**Family: Mona Sans** (GitHub, SIL OFL 1.1, from Google Fonts' variable build v4). The licence is `fonts/OFL.txt`.
Why: it is a strong grotesque with a width axis, so a single family gives a wide, engineered display cut and a normal text cut. It has the industrial weight of Anduril's Helvetica Now without the licence. No one in the category uses it, and it is not the Inter that half the reference library runs on. The "pair" is two cuts of one family, which keeps the Typographer's one-family, three-weight rule.

Files (static instances made with fontTools, subset to Latin plus ± ° × – — ’ “ ” … − € ©, with kern, liga, tnum, pnum and frac kept):

| File | Instance | Size | Role |
|---|---|---|---|
| `fonts/MonaSans-Display-SemiBold-W112.woff2` | wdth 112.5, wght 600 | 13.9 KB | Display, h2, h3. Preloaded. |
| `fonts/MonaSans-Text-Regular.woff2` | wdth 100, wght 400 | 13.8 KB | Lede, body |
| `fonts/MonaSans-Text-Medium.woff2` | wdth 100, wght 500 | 13.6 KB | Nav, button |
| `fonts/MonaSans-VF-latin.woff2` | full variable, source | 98 KB | Source only, never shipped |

The first screen loads 41 KB of fonts, inside the 60 KB budget. `font-display: swap` is set, with Arial or Liberation fallbacks metric-matched from measured widths: display `size-adjust 103.2%`, text `103.4%`, with ascent and descent overrides. Measured swap shift at 1440 (`research/tools/fb.js`): H1, lede and nav move 0 px. The button narrows by 3 px, with its right edge fixed, so the CLS contribution is 0.

Six sizes, fluid with `clamp()`:

| Token | 390 px | 1440 px | 2560 px | Leading | Tracking |
|---|---|---|---|---|---|
| `--size-display` | 46 px (fitted to the width: `min(4.5rem, (100vw - 2 margins) / 7.6)`) | 77 px | 118 px | 1.0 | -0.025em |
| `--size-h2` | 30 px | 51 px | 72 px | 1.05 | -0.02em |
| `--size-h3` | 22 px | 31 px | 36 px | 1.2 | -0.01em |
| `--size-lede` | 17 px | 22 px | 29 px | 1.5 | 0 |
| `--size-body` | 16 px | 17 px | 19 px | 1.55 | 0 |
| `--size-small` | 14 px | 16 px | 18 px | 1.0 (nav) or 1.4 | 0 |

Rules: sentence case everywhere and no uppercase labels. Headlines break by meaning: the H1 is two sentences on two lines, each `nowrap`. A sweep from 320 to 3840 px found no overflow and no third line. Use `tabular-nums` for changing figures, never monospace. Use a true ± sign.

**Open type fault (honest):** in Mona Sans the capital I has no serifs. In body text "AmIMotion" reads as "AmlMotion" (see the lede in every shot). The brand's own wordmark has the same fault, but it should not be repeated in running text. The fixes, in order: (1) the Typographer draws a serifed I as `ss01` in a renamed OFL derivative (the Reserved Font Name rule means it cannot be called "Mona Sans"), about half a day; (2) the copy team writes the name in the lede once at most. Until one is done, the Typographer's sign-off is pending.

### 3.3 Space

8-point base with a 4-point half step: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128.
Section rhythm, three sizes only: `--rhythm-s` 48–96, `--rhythm-m` 64–160, `--rhythm-l` 96–224 (fluid). No inline padding patches (backlog: the `style="padding-top:0"` sections).

### 3.4 Grid: one ratio, 5 : 7

12 columns, `--margin` 20–112 px (56 at 1440), `--gutter` 16–40 px. **Every two-part split is 5 columns : 7 columns.** No 6/6 split, and no 5fr 6fr next to 5fr 7fr (structure backlog).
Why 5 : 7: it is 1 : 1.4, which is very close to 1 : √2, the ratio of the A-series drawing sheets the founders' CAD is printed on. It gives the picture the larger share, as every reference does, and it leaves the words a measure of 46 to 64 characters for the lede.
On the hero: words take columns 1 to 5. The picture takes 6 to 12 and bleeds past the right margin to the screen edge. The first nav link starts on column 6, so the nav and the picture's left edge share one vertical line (measured: both at x = 619 at 1440 and x = 1100 at 2560).
The hero stacks below 1024 px: words first, then the picture at 1:1 (the film's phone crop). The bar switches to logo, Book a call and Menu below 1024 px, because the full links collide with the button between 761 and 980 px (found in the round 2 sweep).

### 3.5 Radii: two values

`--radius-control: 6px` for the button, the menu summary and the focus ring. `--radius-picture: 0`, so pictures meet the page or the screen edge square, like a print. Nothing is pill-shaped.

### 3.6 Motion

- Nothing moves on load. There is no intro, no fade-in, no `opacity: 0` waiting for JS, and no reveal-on-scroll. The H1 is the LCP and paints with the first frame.
- Feedback only: hover colour and press scale 0.97, 120 ms, `cubic-bezier(.2,0,0,1)`. Transform and colour only.
- One moving picture per screen at most: the hero film (9 s, muted, loop, plays only in view, poster first). No parallax and no scroll-jacking.
- `prefers-reduced-motion: reduce` turns off every transition, and the film shows its poster.
- The menu is a native `<details>`. It opens with JS off and has no animation.

### 3.7 Components in this frame

- **The bar.** It has a logo lockup, four plain links to the hub URLs, and one button, "Book a call". There are no icons, no chevrons, no hairline under the bar and no sticky glass. The logo lockup puts the mark in brand blue and the wordmark in ink, from the brand file's own paths. *Flag for committee:* the source SVG's wordmark is #70afff, which is a second, unmanaged blue. Ink is used here, so blue appears only in the mark.
- **The one button.** A flat ink fill, named for its action, with a 6 px radius and a focus ring 3 px off the edge. The site has no other button style.
- **Hero.** It has H1, the lede and the picture, with no buttons in the hero (v4 spec) and no numbers. The words are anchored to the floor of the screen and the rest sits above them. This is deliberate: the words stand on the same floor line as the hall in the picture.

## 4. Vibe-code checklist: results per round

The computed-style census is `research/tools/census.js`, run at 1440, 390 and 2560. The width sweep is `research/tools/sweep.js`, 320 to 3840 in 10 px steps. The taste-skill inspector is `docs/skills/taste-skill/scripts/inspect.mjs`, run at 1440, 768 and 390.

| Check | R1 | R2 | R3 (final) |
|---|---|---|---|
| backdrop-filter / box-shadow / gradient / text-shadow / filter | 0 / 0 / 0 / 0 / 0 | 0 | 0 |
| Uppercase, positive tracking, italic, monospace | 0 | 0 | 0 |
| 1 px borders, pills, rings | 0 | 0 | 0 |
| Eyebrows or kickers, chips, generic icons (SVG outside the logo) | 0 | 0 | 0 |
| Elements hidden at opacity 0, animations | 0 | 0 | 0 |
| Buttons in hero | 0 | 0 | 0 |
| Faces / weights / text colours | 2 / 3 / 3 | same | same |
| Radii in use | 6 px only | same | same |
| Nav links wrapping to 3 lines | **FAIL** (nav outside grid) | fixed | — |
| Phone bar: Menu dropped to second row | **FAIL** | fixed | — |
| Nav and picture columns misaligned | — | **FAIL** (hero had no right margin track, 24 px off) | fixed, shared edge |
| Horizontal scroll 320–350 px | — | **FAIL** (H1 nowrap at 48 px) | fixed (H1 size fitted to the width) |
| Nav collides with button 770–980 px | — | **FAIL** | fixed (bar switches at 1024) |
| Tablet 768: H1 hidden under picture with fallback font | — | **FAIL** (inspector caught it) | fixed (stack below 1024, fallbacks matched) |
| Fallback faces not loading on Linux (`local("Arial")` only) | — | **FAIL** | fixed (adds Liberation and Arimo names) |
| Inspector `palette-cream` | WARN | WARN | **cleared** (stone ground) |
| Menu sheet half-height over picture | — | — | fixed (sheet fills screen) |

Inspector R3: **4 FAIL, 3 WARN.** They are listed here so nobody reads "0":
- `few-pictures`, `no-footage`, `still-page`, `hero-void`: all come from the empty render slot. This frame is not allowed a drawing or stock image, and motion on load is banned. They clear only when the camera A poster and film go in. **They are real until then.**
- `edge-text` and `covered-text` at 768 and 390: the inspector reads the closed `<details>` menu sheet. With the sheet open (`shots/r3-768x1024-menu-open.png`) the links sit on the 30 px margin and nothing covers them. Judged a false positive, and re-check it on the built site.
- `off-centre` (56 left, 72 right): the inspector measures the button's label, not its fill. The fill's right edge is on the 56 px margin. False positive.

## 5. What is still open, with owners

1. **The render.** `renders/render_hardware.py` appeared during this round, but no PNG has been rendered yet. Realism lab: the camera A poster at 4:5 1600 x 2000 and 3200 x 4000, with the floor graded to #f5f5f2 and the hardware neutral at #3a3d42. Until then the frame cannot go to committee.
2. **The serifed I** (Typographer), or a copy rule (Head of Words).
3. **Located vs waiting under colour-vision simulation** on AmIHub screens (Colour scientist).
4. **The wordmark colour** #70afff vs #66a5fa in the source logo (Brand system designer, to the founders' brand file).
5. **The width and weight of the phone hero.** At 390 the lede runs 7 lines and the picture starts at 439 px, so the phone's first screen is words-heavy. The Hero copy-fit editor should test whether the 1:1 crop goes above the lede on the phone.

## Fix: the capital I (1 Nov 2026)

Mona Sans draws capital I as a bare stem, so "AmIMotion" read as "AmlMotion". `tools/serif_I.py` gives I short slab serifs, scaled to each cut's stem weight, and saves renamed copies as "AmI Sans" (the OFL reserves the name "Mona Sans" for unmodified files). The site uses `fonts/AmISans*.woff2` only. Nothing else in the fonts changed.
