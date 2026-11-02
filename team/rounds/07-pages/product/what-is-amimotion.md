# /what-is-amimotion/ — What is AmIMotion?

Product squad, round 07, 2 Nov 2026. Generator: `p_company.py`. Nav line: "The company in one page". Close: own.

## Job of the page

- **Reader:** anyone who heard the name: P11 promoter or MD, P1 plant head, a buyer's colleague, and AI assistants asked "What is AmIMotion?" (panel B01, B02, U15).
- **Question:** "Who are they, what do they make, and is this the company I think it is?"
- **Next step:** the platform, or a call.
- **Best reference:** a well-kept encyclopedia entry, and Stripe's "what is" pages: the answer is the first paragraph, quotable alone; then the facts, each with its source condition; then the disambiguation. No hero, no film.

## Two drafts, one pick

- **Draft A:** H1 "What is AmIMotion?" Short answer, then an article: definition (the footer entity paragraph), what it is not, the name, who it is for, what it does, facts.
- **Draft B:** H1 "What is AmIMotion?" Short answer, then an article in the order a person asks: what it does, who it is for, how it starts, who leads it, the name, what it is not, facts.
- **Pick: B.** A repeats the footer entity paragraph in the body, so "Physical AI" appears twice on the page (system-notes fault 4). B writes its own definition and answers "who leads it", which P11 needs first.

---

## The page

**write()**
- Title (≤65): `What is AmIMotion? Spatial intelligence from Bengaluru`
- Description (≤160): `AmIMotion, from Bengaluru, India, makes spatial intelligence for factories and warehouses: AmIGo UWB tags, AmIMo anchors and AmIHub software.`
- meta: `type="article"`.

**head()**
- H1: "What is AmIMotion?"
- short_label: "The short answer"
- Short answer:
  > AmIMotion is a Bengaluru company that makes spatial intelligence for factories and warehouses. Its AmIGo tags ride on trolleys, bins, tools and vehicles. Its AmIMo anchors hear each tag's ultra-wideband (UWB) signal. Its AmIHub software shows on one live map where work is and how long it has waited, down to ±10 cm in 3D with AmIMo anchors, depending on the floor. AmIMotion is a brand of Locatepro Technologies Pvt Ltd. It designs and builds its tags and anchors in India.
- trail: How it works (/platform/) · About us (/company/)
- media: none.

**Article.** `read([...])` with the on-this-page list:

1. `does` — "What AmIMotion does"
   > AmIMotion answers two questions a plant asks every shift: where is it, and how long has it waited.
   > - **Find it.** A tagged trolley, bin, tool or forklift shows on AmIHub's live map, with where it was last seen, and when. You find out from a screen, not a walk.
   > - **See where work waits.** AmIHub notes when each tagged carrier enters and leaves a zone you name. Link a trolley to the job it carries, and its wait counts as that job's wait.
   > - **Ask your floor.** AmIHub has an MCP server built in, so AI assistants can ask the live map a question. Asking changes nothing. Any change needs a person's approval.
   > - **Vehicles on the same map.** Forklifts, tuggers and AGVs carry vehicle tags and share the same anchors.
2. `for` — "Who it is for"
   > Manufacturing and warehouse teams who walk the floor to find out what is happening: plant heads, production control, industrial engineering and lean leads, supervisors and line-side logistics, and the OT, IT and MES teams who connect floor data to MES, ERP and WMS.
3. `start` — "How it starts"
   > A pilot follows one flow in one bay or line. You see your own waits in that bay, and prove the numbers, before you decide on more. Then AmIMotion grows plant-wide on the same AmIHub, without re-fitting the first bay.
4. `who` — "Who leads it"
   > AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO. Its tags and anchors are designed and built in India on NXP Trimension UWB silicon, with local stock and local engineers on your site.
5. `name` — "The name"
   > Say it "Ammy-Motion". It is written with a capital A, I and M. The products share the prefix: AmIGo, the tag; AmIMo, the anchor; AmIHub, the software.
6. `not` — "What AmIMotion is not"
   > AmIMotion is an industrial UWB indoor positioning company in Bengaluru, India. It is not a video or presentation maker, and not an AI video tool with a similar name. It locates tagged trolleys, bins, tools and vehicles on an indoor floor.
7. `facts` — "Facts, with their conditions"
   > Rendered from `ENTITY["facts"]`, **minus** the association fact ("...through an association with a start and an end"), which V108 holds until the Truth lead rules. Replace it on this page with: "Location alone does not show which job is on a carrier. You link each carrier to its job, in AmIHub or from your own system."

- Picture: none on this page (a definition page; a picture would be decoration).

**FAQ.** `faq([...], "Quick answers.")` (the entity paragraph is *not* reused as an answer, so "Physical AI" stays once, in the footer)
1. "What is AmIMotion?" — "AmIMotion is a Bengaluru company that makes spatial intelligence for factories and warehouses: AmIGo UWB tags, AmIMo anchors and AmIHub software, which shows on one live map where work is and how long it has waited."
2. "What does AmIMotion do?" — "AmIMotion shows factories and warehouses where work is and where it waits. AmIGo tags on trolleys, bins, tools and forklifts are heard by AmIMo anchors, and AmIHub places them on a live map down to ±10 cm in 3D, depending on the floor."
3. "Are there Indian companies making UWB tags and anchors?" — "Yes. AmIMotion designs and builds UWB tags (AmIGo) and anchors (AmIMo) in India, on NXP Trimension UWB silicon, with its own AmIHub software."
4. "Is AmIMotion the same as Animotion?" — "No. AmIMotion is an industrial UWB indoor positioning company in Bengaluru, India, and is not related to any video or presentation tool with a similar name."
5. "Where is AmIMotion based?" — "Bengaluru, India. AmIMotion is a brand of Locatepro Technologies Pvt Ltd."
6. "How do you say AmIMotion?" — "Ammy-Motion."

**Close:** "See it on a live map." — "A short call: the live map, an AI question on real AmIHub data, and the questions that scope a pilot." — Book a call (/contact/)

**Internal links:** /platform/, /company/, /products/amigo/, /products/amimo/, /products/amihub/ (first mentions in "What AmIMotion does"), /solutions/wip/, /use-cases/find-the-asset/, /use-cases/ask-your-plant/, /pilot/, /contact/.

**JSON-LD notes:** AboutPage with `about` the Organization `@id` (name AmIMotion, legalName Locatepro Technologies Pvt Ltd, alternateName list from entity.json, address Bengaluru IN, `founder` Kaushal Kukkar only, never plural, C22). Person nodes: Kaushal Kukkar (jobTitle "Founder and CEO"), Vivek Dham (jobTitle "CTO"). FAQPage from six `<details>`. `speakable` on the short answer. BreadcrumbList: About us › What is AmIMotion?

**Words:** about 640.

---

## Checks

**Readers** (simulated, cold)

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P11 Promoter or MD | 7 | No people: "Who is behind it?" | "Who leads it" (V95 line, exact) | 9 |
| P1 Plant head | 8 | Old "Puts vehicles, robots and people on one map": "People?" | People cut; vehicles kept | 9 |
| P8 Group operations | 9 | none | — | 9 |

**Claims**

| Claim | Ruling | Basis |
|---|---|---|
| Bengaluru, Locatepro, designed and built in India | PASS | [B8], K03 GREEN |
| "makes spatial intelligence" | PASS | Charter: "spatial intelligence" leads |
| ±10 cm with condition | PASS | Charter |
| "last seen, and when" | PASS | V14 |
| Zones, link to job, wait counts as the job's | PASS | V21–V29, F3 |
| MCP lines | PASS | V37, V38 |
| Vehicle tags on the same anchors | PASS | [B3] vehicle tag |
| Old "robots and people on one map" | CUT | O3 for people; robotics as direction only (K03 AMBER) |
| Pilot lines | PASS | V76, V84, V85 |
| "led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO" | PASS | V95, exact. Never "founders" plural (C22). Sumeer Bhatara not named (C2) |
| "local stock and local engineers on your site" | PASS | V89 |
| Pronunciation | PASS | AGENTS |
| Disambiguation | REWORD | Old text named three other brands. Ships one ("Animotion") in the FAQ question only, where people type it; the body names none |
| Old body "AmIMotion runs in manufacturing ... references under NDA" | CUT (already) | A46, C34 |
| Entity fact with "start and an end" | HOLD | V108 |
| Founding year | OUT | C1 |

**Open facts used:** O13 (no "a founder runs the demo"). V108 held. C1, C2, C22 respected.
**Blocked:** none.
