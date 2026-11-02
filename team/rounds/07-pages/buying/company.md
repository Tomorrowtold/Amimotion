# /company/  About us

Squad: buying. Generator: `p_company.py`, `write("/company/", ...)`.

- **Title tag:** About AmIMotion: spatial intelligence from Bengaluru
- **Meta description:** AmIMotion, a brand of Locatepro Technologies, designs and builds UWB tags, anchors and AmIHub software in Bengaluru. Led by Kaushal Kukkar and Vivek Dham.

**Job of the page.** Buyers: P11 promoter or MD ("Indian engineering that shows up"), P9 ("a young supplier's staying power"), P1. Question: "Who is behind this, and can I trust them in my bay?" Next step: book the call. Best reference: Oxide Computer's and Framework's about pages: what the company makes, how it works, and what it will not do, with no traction theatre. AmIMotion cannot show customers, results, funding, founding year or bios (K03 RED, C1 to C4, C22), so the page wins on plainness and on its refusals.

**Drafts.** A (words lead): "Every position has an age." principles page. B (buyer-truth): who it is, who leads it, what it makes, how it works, what it will not claim. Picked B and kept one A idea (a position without its age is not an answer) inside "What we will not claim": P11 wanted a who, and A had none.

---

## head(...)

- **H1:** Designed in Bengaluru.
- **soft:** Built in India.
- **lede:** AmIMotion makes the tags, the anchors and the software that show where work is in a plant, and where it waits. One team builds all three.
- **short:** AmIMotion is spatial intelligence for factories and warehouses. It is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. AmIMotion designs and builds AmIGo tags, AmIMo anchors and AmIHub software, on NXP Trimension UWB silicon. It is built on the FiRa and omlox specifications. AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.
  (Not the footer entity paragraph: that one carries "Physical AI", which may appear once per page and is already in the footer.)
- **trail:** [("About us", None)]
- **links line:** What is AmIMotion? `/what-is-amimotion/` · How to buy `/how-to-buy/`
- **media:** `slot(brief, "still", alt, "Realism lab")`
  - Shows: AmIGo and AmIMo side by side at true scale on a white cove.
  - Source: CAD render `team/rounds/02-design/renders/pair_scale.png`, to be cut into an AVIF/WebP ladder with `team/rounds/02-design/tools/hero_images.py` and added to `STILLS` as `"pair"`.
  - Alt: "The AmIGo tag and the AmIMo anchor side by side, both dark grey with amimotion on the cover."
  - (Replaces the old brief for a team photo "to be supplied": no real photo exists, and people are not invented.)

## section 1: `vp("Who leads it.")` + `prose(html)`

1. AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.
2. AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. The tags, the anchors and AmIHub are designed and built in India, with local stock and local engineers on your site.

Picture: none.

## section 2: `vp("What we make.")` + `cards(items, cols=3)`

| href | Picture | Title (nav label) | Line |
|---|---|---|---|
| /products/amigo/ | `still("amigo")`, CAD render `amigo_hero.png` | AmIGo tag | Rides on what moves. Sends a short UWB pulse when it moves and sleeps when it stops. |
| /products/amimo/ | `still("amimo")`, CAD render `amimo_rj45.png` | AmIMo anchor | Hears every tag. Fixed to a column or wall, it needs only power. |
| /products/amihub/ | `slot(...)`: camera A hero poster crop (model-hall still, `build_hall.py`, camera A, full frame), alt "A model factory floor with paths in blue and waits in amber." | AmIHub | One live map. Runs on an industrial PC inside your plant, with no internet needed. |

## section 3: `vp("How we work.")` + `tiles(items, cols=4)`

| Heading | Text |
|---|---|
| One team, every layer | AmIMotion designs the tags, the anchors and AmIHub. One contract and one support line cover every layer. |
| Made in India | Designed and built in India, with local stock and local engineers on your site. |
| Open by design | Built on the FiRa and omlox specifications. AmIHub connects through open REST, MQTT, WebSocket and omlox hub interfaces, so your team or your integrator can build on it. |
| One bay first | Every AmIMotion pilot starts with one bay or line. Then it grows plant-wide on the same AmIHub, without re-fitting the first bay. |

Picture: none.

## section 4: `vp("What we will not claim.", lede="A position is only useful when you know what it can and cannot tell you.")` + `prose(html)`

1. A position shows where a trolley is, and AmIHub says when it was last seen. It does not show which job the trolley carries until that job is linked to it. It does not say why work waited. That is for your team to say.
2. This site names no customer and shows no customer result. AmIMotion is built on the FiRa and omlox specifications, and claims no formal certification.

## section 5: `links(...)`

| href | Title | Line |
|---|---|---|
| /what-is-amimotion/ | What is AmIMotion? | The company in one page. |
| /industrial-spatial-intelligence/ | What is spatial intelligence? | The category. |
| /trust/ | Trust and data | Where your data lives. |
| /how-to-buy/ | How to buy | Call, NDA pack, survey, pilot. |

## close

Default company close: `close("Talk to the team.", "Tell us the flow you want to see. We walk through it with you.", (("Book a call", "/contact/"),))`

## Internal links

/what-is-amimotion/, /industrial-spatial-intelligence/, /trust/, /how-to-buy/, /products/amigo/, /products/amimo/, /products/amihub/, /contact/.

## JSON-LD notes

`AboutPage` + `BreadcrumbList` (Home > About us). Organization (by `@id`, description = entity `long`): `legalName` "Locatepro Technologies Pvt Ltd", `address` `addressLocality` "Bengaluru", `addressCountry` "IN", `founder` Person "Kaushal Kukkar"; `employee` Person "Vivek Dham" `jobTitle` "CTO"; Kaushal `jobTitle` "Founder and CEO". **No** `foundingDate` (C1), no `numberOfEmployees`, no `award` (K03 AMBER, written approval needed), no third person (C2, C22).

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P11 Promoter or MD | 7 | "Who are these people?" with names and nothing more | Bios are barred (C3, C4) and the brief allows the one line only. Added "local engineers on your site" next to it. Logged as a founder fact. | 8 (blocked on bios, C3/C4) |
| P9 Procurement | 8 | "Designed in Bengaluru. Built in India." felt like a tagline | Kept (the H1 is the company's own claim, [B8]); the lede now says what it makes in one sentence. | 9 |
| P1 Plant head | 9 | none | | 9 |

Mean 8.7. Blocker: approved bios (kit 02 C3, C4, Q15).

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| Leaders line | PASS | V95 exact; only these two names (squad brief; C22) |
| Brand of Locatepro Technologies Pvt Ltd, Bengaluru | PASS | [B8] |
| Designed and built in India, NXP Trimension | PASS | K03 GREEN |
| Built on the FiRa and omlox specifications | PASS | charter |
| Old stats "Engineers on site", "From one team", "Open" | REWORD into tiles | Figures-as-chips ick; "Engineers on site" merged into [B8] "local engineers on your site" |
| Old head short = entity `long` | REWORD | "Physical AI" would appear twice on the page |
| "nothing is dispatched on location alone" (old) | Cut | Implies a dispatch feature (K03 NEVER on dispatch) |
| "This site names no customer and shows no customer result." | PASS | True of the site; K03 RED on names |
| Founding year, team size, awards, bios | Kept out | C1, C3, C4, K03 AMBER |

**Open facts used.** none of O1 to O15; company facts C1 to C4, C22 kept out.
**Word count:** about 520.
