# /products/amimo/ — AmIMo anchor

Product squad, round 07, 2 Nov 2026. Generator: `p_platform.py`.

## Job of the page

- **Buyer:** P5 OT and maintenance (mounting, power, cabling, steel), P7 IT (Wi-Fi backhaul), P9 procurement (what has to be installed).
- **Question:** "What do I have to run to each anchor, how many do I need, and where do they go?"
- **Next step:** get a first anchor estimate from /tools/anchors/, which gives value before anyone calls.
- **Best reference:** Apple AirTag tech specs for the honest table; Vention's product pages for "what you need to install it" stated before features. Infrastructure buyers want the install answer first.

## Two drafts, one pick

- **Draft A:** H1 "AmIMo." / "Anchors that need only power." Leads on cabling, then radios, then survey, then specs.
- **Draft B:** H1 "Hear every tag." / "From 3 to 8 m up." Leads on placement.
- **Pick: A, reworded to "AmIMo anchor." / "It needs only power."** The install answer is the strongest fact AmIMo has (no sync cable, Wi-Fi backhaul) and it is what P5 asks first. B's H1 is a nav strapline, not a sentence a buyer acts on. A's "Anchors that need only power" was read by P7 as "fully wireless", so the lede now names the Ethernet option and PoE at once.

---

## The page

**write()**
- Title (≤65): `AmIMo UWB anchor: power only, no sync cable, 3D angle`
- Description (≤160): `AmIMo is AmIMotion's UWB anchor. It times each tag pulse and reads its angle, syncs over the air, sends data over Wi-Fi and needs only DC or PoE power.`
- meta: `type="product", product="AmIMo", category="UWB anchor"`, `og="/assets/home/amimo-page-1200.webp"` (was the old `/assets/img/amimo-a-1600.webp`).

**head()**
- H1: "AmIMo anchor." / soft: "It needs only power."
- Lede: "Fixed to a column or wall 3 to 8 m up, AmIMo hears each tag's pulse and the angle it came from. It syncs over the air, so there is no sync cable to run."
- trail: Specifications (#specs) · How many anchors you need (/tools/anchors/)
- media: `still("amimo", eager=True)`. Source: CAD render `amimo_rj45.png` (ladder `/assets/home/amimo-page`). Alt: "The AmIMo anchor, a dark grey box with a network port."

**Section 1.** `section(vp("AmIMo, in short."), short answer, figures([...]))`
- Heading: "AmIMo, in short."
- Short answer:
  > AmIMo is AmIMotion's UWB anchor. It records when each AmIGo pulse arrives and reads the angle it came from, in 3D, so fewer anchors fix a position. AmIMo keeps time with the other anchors over the air, sends its data to AmIHub over Wi-Fi, with an Ethernet option, and needs only power, from DC or PoE. Each AmIMo anchor reaches about 50 m in clear line of sight. A site survey sets how many your floor needs.
- Figures (4):
  - "3D" — "Angle of arrival" — "Direction as well as time"
  - "About 50 m" — "Reach in line of sight" — "Site-dependent. The survey sets the count"
  - "DC or PoE" — "Power" — "With Wi-Fi backhaul, no data or sync cable"
  - "3 to 8 m" — "Mounting height" — "Recommended. Wall, column, ceiling or pole"

**Section 2.** `section(vp("What you run to it.", "Power, and nothing else."), split(None, paras, media=slot(...), flip=True), km(...))`
- Heading: "What you run to it." / "Power, and nothing else."
- Body:
  > AmIMo needs only power, from a DC adapter or PoE. It keeps time with the other anchors over the air, with no sync cable. It sends its data to AmIHub over Wi-Fi, so it needs no separate data cable. Ethernet is also an option.
  >
  > You set each AmIMo up from a phone app. AmIHub finds each anchor on its own and raises an alert if one goes dark.
- Picture: `slot(..., "photo")` 4:3.
  - **Shows:** AmIMo fixed to a steel column by its own flanged tab, seen from below at 70 mm, RJ45 port facing down as the CAD gives it, one plain power cable (a DC install). Column paint flat, background soft.
  - **Source:** CAD render, new shot `amimo_column` in `render_hardware.py` (owed; column is a plain painted I-section, no bracket the CAD lacks). Owner: Product Render.
  - **Alt:** "The AmIMo anchor, a dark grey box with a network port, fixed to a steel column." (homepage, locked)
- Know more, summary "Where and how anchors mount.":
  - "On a column, wall or ceiling, or on a pole, 3 to 8 m up."
  - "Set up from a phone app. AmIHub finds each anchor itself."
  - "Each anchor reaches about 50 m in line of sight. Steel and racking set the final count."
  - "Prefer a wired network? Ethernet is also an option."
  - link: How it locates a tag (/technology/)

**Section 3.** `section(vp("Three radios.", "One anchor."), tiles([...], 3))`
- Heading: "Three radios." / "One anchor."
- Points:
  - "UWB" — "AmIGo tags on carriers, tools and vehicles, down to ±10 cm in 3D with AmIMo anchors, depending on your floor."
  - "BLE ranging" — "Zone-level presence for BLE devices and beacons that carry no UWB tag."
  - "Wi-Fi FTM" — "Ranging with compatible Wi-Fi devices, from the same AmIMo anchors. Device support is confirmed for each site."
- Picture: none.

**Section 4.** `section(vp("Every floor starts with a survey.", lede=...), split("Where AmIMo anchors go.", paras, items, media=slot(...)), links([...]))`
- Heading: "Every floor starts with a survey."
- Lede: "Racking, ceiling height and steel decide where anchors go. Floor area alone does not."
- split h3: "Where AmIMo anchors go."
- Body: "Each AmIMo reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count."
- Items:
  - "High on columns or walls, 3 to 8 m up, clear of moving vehicles."
  - "Spread around the area a tag moves in, not in one straight line."
  - "Where the angle helps, as few as two anchors in view can fix a position."
  - "Over dense racking, the survey measures the steel first."
- Picture: `slot(..., "still")` 3:2.
  - **Shows:** the whole model hall pale, one bay (inspection station and its queue) in full colour with its trails, its waits and the two AmIMo blocks on its columns.
  - **Source:** model-hall still, `build_hall.py` camera A, t = 0.0, the homepage screen 6 frame (bay mask on). Owner: Realism lab.
  - **Alt:** "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors." (homepage, locked)
- Related: How many anchors you need (/tools/anchors/) "A first estimate, before the survey" · Anchor planning (/learn/anchor-planning/) "What sets the count on a real floor" · How it locates a tag (/technology/) "Steel, racking, signal and outages"

**Section 5.** `section(vp("AmIMo, in detail."), spec([...], note), id="specs")`
- Heading: "AmIMo, in detail."
- Spec rows:
  - UWB radio — IEEE 802.15.4z HRP, with a 3D angle-of-arrival antenna array
  - Positioning modes — UL-TDoA, DL-TDoA, two-way ranging and 3D AoA, chosen per zone in AmIHub
  - Additional ranging — BLE ranging; Wi-Fi FTM (IEEE 802.11mc). Device support confirmed per site
  - Coverage — About 50 m line-of-sight radius, indicative and site-dependent
  - Synchronisation — Over the air; no sync cable
  - Backhaul — Wi-Fi 2.4 / 5 GHz to AmIHub; Ethernet option
  - Power — DC adapter or PoE
  - Tag capacity — Hundreds of active tags per anchor cell (UL-TDoA), indicative
  - Mounting — 3 to 8 m recommended; wall, column, ceiling and pole brackets
  - Operating temperature — −20 °C to +60 °C, typical; indoor and sheltered outdoor
  - Commissioning — Phone app; found by AmIHub on its own
  - Silicon — NXP Trimension UWB
- Note: "Indicative values. Coverage and spacing change with ceiling height, racking and metal. The final count comes from a site survey. Full datasheets are shared under NDA."

**FAQ.** `faq([...], "Questions about AmIMo.")`
1. "What is an AmIMo anchor?" — "AmIMo is AmIMotion's UWB anchor. It times each tag pulse and reads its 3D angle of arrival. It offers BLE ranging and Wi-Fi FTM from the same unit, and needs only DC or PoE power, with no data or sync cable."
2. "Does an RTLS anchor need data cabling?" — "Not AmIMo. It syncs over the air and sends its data to AmIHub over Wi-Fi, with an Ethernet option. Each AmIMo anchor still needs power, from DC or PoE."
3. "How far does one AmIMo anchor reach?" — "About 50 m in clear line of sight, indicative and site-dependent. Racking, machines and steel shorten it, so a site survey sets the count."
4. "How many AmIMo anchors does a floor need?" — "It depends on the accuracy you need, the ceiling height and how much racking blocks the view. Where the angle helps, as few as two anchors in view can fix a position. A site survey sets the count."
5. "What happens if an anchor loses power?" — "AmIHub raises an alert when an AmIMo anchor goes dark, so your team knows which one to check."

**Close:** "Plan the anchors for one bay." — "Enter your floor and racking, and get a first range of AmIMo anchors before the survey." — How many anchors you need (/tools/anchors/)

**Internal links:** /products/amigo/, /products/amihub/, /technology/, /tools/anchors/, /learn/anchor-planning/, /specs/.

**JSON-LD notes:** Product (AmIMo, brand AmIMotion, category "UWB anchor", image the amimo-page ladder, `additionalProperty` from spec rows). No Offer. FAQPage from five `<details>`. BreadcrumbList: How it works › AmIMo anchor.

**Words:** about 600. AmIMo named in every passage.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P5 OT engineer | 7 | No line on power loss: "What happens when an anchor drops?" | FAQ 5 (dark-anchor alert). Recovery time stays out | 8 (O8) |
| P7 IT and security | 8 | Draft H1 "Anchors that need only power" read as fully wireless | Lede and short answer name Wi-Fi backhaul, Ethernet option, PoE together | 9 |
| P9 Procurement | 9 | none ("What you run to it" is the install answer) | — | 9 |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| Arrival time and 3D angle; fewer anchors | PASS | [B4] highlights, V55 |
| "as few as two anchors in view", with "where the angle helps" | PASS | [B4] "works with as few as two in view"; V96 uses it |
| Over-the-air sync, no sync cable | PASS | F8 |
| Wi-Fi backhaul, "no separate data cable", Ethernet option | PASS | F8, C20; never "fully wireless" |
| "It needs only power." / "Power, and nothing else." | PASS | [B4] "Power only — DC adapter or PoE"; the Ethernet option is stated in the same section (C20) |
| About 50 m line of sight + survey | PASS | K03 AMBER with qualifier |
| Phone app, auto-discovery, dark-anchor alert | PASS | V63, V64 |
| BLE ranging for beacons with no UWB tag | PASS | [B4] three radios |
| Wi-Fi FTM: "phones and laptops can be positioned without any tag" | REWORD | No phone-location claim (AGENTS). Ships "compatible Wi-Fi devices ... confirmed for each site" |
| DL-TDoA "phones and privacy-first" | REWORD | Mode named in the spec only, no phone |
| Hundreds of tags per anchor cell | PASS | [B4], marked indicative (K03 AMBER pattern) |
| −20 to +60 °C, indoor and sheltered outdoor | PASS | [B4] |
| "not in one straight line" | PASS | Survey method, no figure. Same as the shipped page |
| What happens to positions in an outage, rejoin time | **OUT** | O8. FAQ 5 answers only the alert |

**Open facts used:** O8 (safe line only), O9 (no "same port" line). 
**Blocked:** P5 at 8 on outage recovery (O8). Ships the safe line.
