# /tools/anchors/  How many anchors you need

Squad: buying. Generator: `p_company.py`, `write("/tools/anchors/", ..., scripts="tools")`. The form markup (`rng`, `seg`) and the estimator logic in `site/src/js/tools.js` are kept. Words only.

- **Title tag:** How many anchors you need: a first estimate | AmIMotion
- **Meta description:** A first range of AmIMo anchors from your floor size and racking, before a site survey. The assumptions sit next to the answer. Runs in your browser.

**Job of the page.** Buyers: P5 OT engineer ("Will coverage hold around our steel?"), P9 ("How much hardware are we talking about?"), P2. Question: "Roughly how many anchors would our floor take?" Next step: book the call that leads to a survey. Best reference: Vention's configurator (instant bill of materials) and Waymo's habit of putting the condition next to every number. The estimator gives the number at once and shows every assumption beside it.

**Drafts.** A: tool plus a one-line caveat. B: tool, then the three assumptions in plain words, then what the survey adds that no estimator can. Picked B: P5 distrusts any number without its method, and the method is the honest part.

---

## head(...)

- **H1:** How many anchors?
- **soft:** A first range, before the survey.
- **lede:** Enter your floor and what stands on it. You get a range to plan a budget around. An AmIMotion site survey sets the real count.
- **short:** AmIMotion sets the final anchor count from a site survey, because racking and steel change how far each AmIMo anchor reaches. This estimator gives a first range from your floor size, ceiling height and racking. It lays a planning grid over the floor: about 25 m apart for an open hall, 18 m with some racking and 12 m with dense high racking. Each AmIMo anchor reaches about 50 m around it in clear line of sight.
- **trail:** [("Start small", "/start/"), ("How many anchors you need", None)]
- **media:** none (the tool sits directly below)

## section 1: the tool (markup kept; strings below)

Form, unchanged labels: "Floor length", "Floor width", "Ceiling height", "What is on the floor?" (Some racking / Open hall / Dense high racking), "Position needed" (3D, with height / 2D, floor only).

Output strings:
- `out-name`: "First range" (was "First budget range")
- Lines: "Floor area", "Planning grid", "Floor type", and **"Lowest count this tool gives"** (was "Fewest in view for this mode"; see flag A2)
- Note: "A planning estimate from this page's own grid. It is not a quote and not an AmIMotion specification. Angle of arrival can mean fewer anchors. Aisles between high racks can mean more. The survey sets the count."
- `btns`: ("Book a call", "/contact/"), ("Anchor planning, explained", "/learn/anchor-planning/")

## section 2: `vp("How the estimate works.", lede="Three assumptions, all of them this page's own.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| A grid over your floor | The tool lays a square grid over the floor and counts its corners. The grid is about 25 m for an open hall, 18 m with some racking and 12 m with dense high racking. These spacings are planning assumptions, not a figure from an AmIMotion datasheet. |
| A range, not a number | It shows a fifth under and a quarter over that count, so you can plan a budget around it. It never gives fewer than 4 anchors for 3D or 3 for 2D. |
| Tall halls | Above 10 m, the grid closes by a tenth. AmIMo anchors are recommended at 3 to 8 m up, so a tall hall is where the survey matters most. |

Picture: none.

## section 3: `vp("What the survey adds.")` + `split(None, paras, media=still("amimo"))`

Paragraphs:
1. Each AmIMo anchor reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count.
2. An AmIMo anchor records when each pulse arrives and the angle it came from. Time and angle together can mean fewer anchors than timing alone.
3. Each anchor needs only power, from DC or PoE. It syncs over the air and sends its data to AmIHub over Wi-Fi, so there is no data or sync cable to run. Ethernet is also an option.
4. With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor.

Picture: AmIMo anchor. Source: CAD render `amimo_rj45.png` (`still("amimo")`). Alt: "The AmIMo anchor, a dark grey box with a network port."

## section 4: `faq([...])`

1. **How many anchors does a UWB system need?** It depends on the floor. Each AmIMo anchor reaches about 50 m in clear line of sight, but racking, steel and ceiling height change that. AmIMotion sets the final count from a site survey. This tool gives a first range to plan a budget around.
2. **Do AmIMo anchors need data cables?** No data or sync cable. Anchors sync over the air and send their data to AmIHub over Wi-Fi. They need only power, from DC or PoE. Ethernet is also an option.
3. **How high do anchors go?** On a column or wall, 3 to 8 m up is recommended.

## close

`close("Get the real count.", "An AmIMotion survey of your floor sets the anchor plan. It starts with a call.", (("Book a call", "/contact/"),))`

## Internal links

/start/, /contact/, /learn/anchor-planning/, /products/amimo/ (on "AmIMo anchor" in section 3, label "AmIMo anchor"), /technology/ (on "time and angle", label "How it locates a tag"), /specs/ (FAQ 3, "Specifications").

## JSON-LD notes

`WebApplication` (name "How many anchors you need", `isAccessibleForFree` true, `applicationCategory` "BusinessApplication") + `FAQPage` (three) + `BreadcrumbList` (Home > Start small > How many anchors you need).

---

## Calculator assumptions a founders' document does not support (logic kept; flagged)

| # | In tools.js | Ruling | Why | Proposal |
|---|---|---|---|---|
| A1 | `GRID = { open: 25, mixed: 18, dense: 12 }` | AMBER, flag | No founders' document gives a spacing. [B4] gives only "~50 m line-of-sight coverage radius" and "final anchor counts come from a site survey". The page now says the grids are its own assumption. | Founders to confirm or replace the three spacings. |
| A2 | `min = dim === '3d' ? 4 : 3` | **Conflict** | [B4]: "Time-of-flight + angle: fewer anchors, works with as few as two in view." A floor of 4 (3D) and 3 (2D) is the TDoA rule, not AmIMo's. Shown as a product fact ("Fewest in view for this mode") it contradicts the brochure. | Label changed to "Lowest count this tool gives" so it is the tool's rule, not a product claim. Engine room may keep 4/3 as a conservative budget floor. Do not label it "in view". |
| A3 | `if (H > 10) g *= 0.9` | AMBER, flag | No source. [B4] recommends mounting at 3 to 8 m; the slider goes to 20 m ceilings. | Keep, disclosed in section 2. |
| A4 | Range `0.8 ×` to `1.25 ×` | Tool convention | No source; disclosed in section 2 as "a fifth under and a quarter over". | Keep. |
| A5 | Old short answer "~50 m in line of sight (indicative, site-dependent)" | PASS | [B4], K03 AMBER with survey caveat | Kept in plain words. |

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P5 OT engineer | 7 | "Fewest in view: 4 anchors" vs the product page's "as few as two" | A2: relabelled as the tool's floor, and the angle-of-arrival line added. | 9 |
| P9 Procurement | 8 | "First budget range" sounded like a price | Output renamed "First range"; note says "not a quote". | 9 |
| P2 Production control | 9 | none | | 9 |

Mean 9.0.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| ~50 m in clear line of sight, survey sets the count | PASS | K03 AMBER with its condition, [B4], V59, V60 |
| "Time and angle together can mean fewer anchors" | PASS on AMBER | [B4] highlights, V55 |
| DC or PoE, over-the-air sync, Wi-Fi backhaul, Ethernet option | PASS | [B4], F8 |
| 3 to 8 m recommended | PASS | [B4] |
| Down to ±10 cm, depends on floor | PASS | charter, V61, V62 |
| "Fewest in view for this mode" | REWORD | conflicts with [B4] (A2) |
| "Plan a site survey" button to /contact/ | REWORD to "Book a call" | One label per URL |

**Open facts used.** O8, O9 not used (Ethernet line is F8, stated in [B4]). None of O1 to O4, O6.
**Word count:** about 610.
