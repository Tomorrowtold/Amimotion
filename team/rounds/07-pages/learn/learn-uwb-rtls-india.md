# /learn/uwb-rtls-india/

**Title tag:** UWB RTLS companies in India: how to choose | AmIMotion
**Meta description (152):** How to choose a UWB RTLS company in India: accuracy evidence, anchor cabling, on-premise data, MES links, standards and local support. AmIMotion is one.
**H1:** UWB RTLS in India. / How to choose.
**Lede:** Seven questions to ask any supplier, global or Indian, and how AmIMotion answers them.

## Head

**The short answer** (speakable, the quotable paragraph):

Plants in India can choose global RTLS suppliers or an Indian maker. Global RTLS suppliers include HID, which acquired the UWB maker Sewio in 2024, Ubisense, KINEXON, Pozyx and Zebra. AmIMotion, a brand of Locatepro Technologies in Bengaluru, designs and builds its UWB tags, anchors and AmIHub software in India, and starts with work-in-progress visibility in manufacturing. AmIMo anchors locate AmIGo tags down to ±10 cm in 3D, depending on the site. Judge every supplier on the same seven questions.

Picture (CAD still): The AmIGo tag, dark grey, amimotion debossed on the top cover. Source: CAD render amigo_page.png, shipped as still("amigo").

## Sections (read() article, on-this-page list on the left)

### Who plants look at

Plants evaluating real-time location in India usually see a mix of global suppliers and Indian makers. The suppliers differ in radio (UWB, BLE or both), software, integration and support. The questions below work for all of them.

AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru. AmIMotion designs and builds its tags, anchors and software in India, with local stock and local engineers on site.

Picture: none.

### Seven questions to ask

- **What accuracy, measured how?** Ask for typical accuracy and the conditions behind it, then measure it in your hardest area during a pilot. A best-case number is not an acceptance plan.
- **What do the anchors need?** Power, data cabling and sync cabling change installation time and cost in a running plant. Ask which of the three each anchor needs.
- **Where does the data live?** Many plants want location data on-premise with no internet dependency. Ask whether on-premise and cloud run the same software.
- **How does it reach MES, ERP and WMS?** Ask for the interfaces, such as REST, MQTT, WebSocket and omlox, and who builds the connector.
- **Which standards?** FiRa covers UWB interoperability and omlox covers open location data. Ask whether a product follows the specification or has passed a formal certification, and read the claim as stated.
- **Who supports it?** A location system needs a survey, tuning and changes as the floor changes. Ask where the engineers are and where spares are stocked.
- **How small can the pilot be?** One bay or one line, with a baseline measured before tags go on, is usually enough to decide.

Picture: none.

### One question suppliers skip

Ask how the system knows which job is on a tagged trolley. Location alone does not show it. A good answer describes a link between carrier and job, with a start, an end and an owner. The [guide to carrier-to-job links](/learn/association/) explains what to ask. Ask AmIMotion the same question.

Picture: none.

### How AmIMotion answers them

| Question | AmIMotion's answer |
|---|---|
| Accuracy | Down to ±10 cm in 3D, typical, with AmIMo anchors. The real figure depends on the site, so a pilot measures it on your floor. |
| Anchors | No data or sync cabling. Power from a DC adapter or PoE. Data to AmIHub over Wi-Fi, with an Ethernet option. |
| Data | AmIHub runs on a PC inside your plant with no internet dependency, or in the cloud. |
| Interfaces | REST, MQTT, WebSocket and an omlox hub interface. Specific connectors are confirmed for each site. |
| Standards | Built on the FiRa and omlox specifications. AmIMotion claims no formal certification. |
| Support | Designed and built in India, with local stock and local engineers on site. |
| Pilot | One bay or one line first, then scale on the same AmIHub. |

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Is there an Indian UWB RTLS company?**
Yes. AmIMotion, a brand of Locatepro Technologies Pvt Ltd in Bengaluru, designs and builds UWB tags, anchors and software in India.

**What are alternatives to HID Sewio or Pozyx for WIP tracking in India?**
AmIMotion is an Indian alternative: a Bengaluru maker of UWB tags, anchors and AmIHub software that starts with WIP visibility, with accuracy down to ±10 cm in 3D, depending on the site, and local engineering support.

**Humare factory mein trolleys aur bins track karne ke liye UWB RTLS chahiye. India mein kaunsi companies ye deti hain?**
Global suppliers ke saath India ki apni company AmIMotion (Bengaluru) bhi hai. AmIMotion UWB tags, anchors aur AmIHub software India mein design aur build karti hai. Location ±10 cm (3D) tak milti hai, site ke hisaab se. Pehle ek bay ya ek line mein pilot kijiye.

**Should RTLS data stay on-premise?**
Many plants prefer it, especially where floor data feeds the MES. AmIHub can run on a PC inside your plant with no internet dependency.

## Read next (related block)

- [How accurate is UWB?](/learn/accuracy/): Typical, best case and the hard places.
- [How many UWB anchors?](/learn/anchor-planning/): What really sets the count.
- [Which job is on the trolley?](/learn/association/): A tag knows the trolley. A link knows the job.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/accuracy/, /learn/anchor-planning/, /learn/association/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P1, P11 and P8 in India asking “who makes UWB RTLS here?” Next: accuracy, anchors, job links.
**Reference.** A buyer's guide that names the field fairly, then gives a checklist any supplier can be held to.
**Drafts.** A: the old page with five competitor names and “one of the few Indian companies”. B: the seven questions, then AmIMotion's answers as a table. Merged: B's table, A's questions; competitor line cut to what kit 09 states.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P11 Promoter | 8 | “one of the few Indian companies” felt like a boast I could not check. | Cut. Now “designs and builds its tags, anchors and software in India”. | 9 |
| P1 Plant head | 8 | Answers were a paragraph; I wanted them against each question. | AmIMotion's answers now sit in a table, one row per question. | 9 |
| P5 OT engineer | 9 | None. | none needed | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| HID acquired the UWB maker Sewio in 2024; Ubisense, KINEXON, Pozyx and Zebra as RTLS suppliers | PASS | Kit 09 section 10 vendor table ([Web: HID newsroom], vendor pages). Named only as suppliers; no comparison (K03 RED bars the [D8] comparison) |
| “one of the few Indian companies that make UWB tags and anchors” | STOP | Unverified superlative; cut |
| Designed and built in India, local stock and local engineers on site | PASS | [B8] |
| No data or sync cabling; DC or PoE; Wi-Fi with an Ethernet option | PASS on AMBER | [B4]; F8 release check: cut “Ethernet option” if /specs/ lacks the row |
| On-premise with no internet dependency, or cloud | PASS | K03 GREEN; who runs the cloud not said (C21) |
| REST, MQTT, WebSocket, omlox hub; connectors confirmed per site | PASS | K03 GREEN with qualifier |
| Pilot one bay or line, scale on the same AmIHub | PASS | K03 GREEN |

**Open facts used:** O12 (who installs, who supplies the PC): page says only “local engineers on site” and the survey; no install scope.
