# /how-to-buy/  How to buy

Squad: buying. Generator: `p_company.py`, `write("/how-to-buy/", ...)`.

- **Title tag:** How to buy: call, NDA pack, survey, pilot | AmIMotion
- **Meta description:** What you buy from AmIMotion and in what order: a call with a live demo, the NDA pack with prices, a site survey, then a pilot in one bay or line.

**Job of the page.** Buyers: P9 procurement and finance ("What is being purchased and what obligations follow?"), P8 group operations (repeatable, not locked in), P11 promoter (who is behind it). Next step: book the call. Best reference: Mercury's and Ramp's "how it works" pages and Oxide's buying page: the supplier, the parts, the order of steps and the support path, stated flat. No prices may appear (K03 NEVER), so the page earns trust by saying exactly when prices arrive and what they will cover.

**Drafts.** A (words specialist): four steps only. B (procurement-minded buyer-truth writer): four steps, what you buy, then procurement's four questions answered, then FAQ. Picked B: A left P9 with every question still open.

---

## head(...)

- **H1:** How to buy.
- **soft:** Four steps, in order.
- **lede:** AmIMotion sells one system, from one team, under one contract. Here is what you buy and how it reaches your floor.
- **short:** You buy AmIGo tags, AmIMo anchors and AmIHub from AmIMotion, plus our survey and an anchor plan for your floor. It happens in four steps. First, a call with a live demo on real AmIHub data. Second, the NDA pack with datasheets, architecture, prices and pilot options. Third, a site survey and a pilot in one bay or line. Fourth, growth plant-wide on the same AmIHub. One contract and one support line cover every layer.
- **trail:** [("Start small", "/start/"), ("How to buy", None)]
- **links line:** How a pilot runs `/pilot/` · Your pilot on one page `/tools/pilot/`
- **media:** none (head without picture; the parts row below carries the pictures).

## section 1: `vp("Four steps.")` + `steps(...)`

| # | Heading | Text |
|---|---|---|
| 1 | A call | The call is a live demo on real AmIHub data, not slides. Bring one flow where people walk to find work. |
| 2 | The NDA pack | After the first call, AmIMotion shares datasheets, architecture, prices and pilot options under NDA. |
| 3 | Survey and pilot | We survey your floor and set the anchor count. A pilot follows one flow in one bay or line. |
| 4 | Grow | Then grow plant-wide on the same AmIHub, without re-fitting the first bay. |

Picture: none.

## section 2: `vp("What you buy.", lede="Three parts, and the work to fit them to your floor.")` + `cards(items, cols=4)` (parts row)

| href | Picture | Title | Line |
|---|---|---|---|
| /products/amigo/ | `still("amigo")`, CAD render `amigo_hero.png` | AmIGo tag | One on each trolley, bin, pallet or tool in scope. One battery lasts 1 to 3 years, depending on use. |
| /products/amimo/ | `still("amimo")`, CAD render `amimo_rj45.png` | AmIMo anchor | Fixed to a column or wall, 3 to 8 m up. It needs only power, from DC or PoE. |
| /products/amihub/ | `slot(...)`: camera A hero poster crop of the inspection bay (model-hall still, `build_hall.py`, camera A, crop on the queue), alt "A model factory floor with paths in blue and waits in amber." Never called AmIHub's screen (O5). | AmIHub | Works out where each tag is. Runs on an industrial PC inside your plant, with no internet needed, or in the cloud. |
| /pilot/ | none (text card) | Survey and plan | An AmIMotion survey of your floor and an anchor plan for it, so the anchor count fits your racking and steel. |

If `cards()` cannot take a card without a picture, the fourth item becomes a sentence under the row: "Plus our survey and an anchor plan for your floor."

## section 3: `vp("What procurement asks.")` + `tiles(items, cols=2)`

| Heading | Text |
|---|---|
| Who is the supplier? | AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. It is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO. |
| Who supports it? | One contract and one support line cover every layer. AmIMotion designs and builds the tags, the anchors and AmIHub in India, with local stock and local engineers on your site. |
| Are we tied to one supplier? | AmIMotion is built on the FiRa and omlox specifications. Your MES, ERP and WMS connect to AmIHub through open REST, MQTT, WebSocket and omlox hub interfaces. Your team or your integrator can build on it at any layer. |
| What will the quote cover? | Prices are in the NDA pack, after the first call. If you need hardware, services and software on separate lines, say so on the call. |

Picture: none.

## section 4: `vp("Bring these to the call.", lede="Four answers make the first AmIMotion call useful.")` + `tiles(items, cols=4)` + `more(...)`

| Heading | Text |
|---|---|
| One flow | Where people walk to find work today. |
| Its size | Roughly how big the bay or line is. |
| Its owner | The person on the floor who would act on the map. |
| Its jobs | How a job is linked to its trolley today, if it is. |

`more([("Your pilot on one page", "/tools/pilot/"), ("How many anchors you need", "/tools/anchors/")])`

## section 5: `faq([...])`

1. **What does AmIMotion cost?** After the first call, we share datasheets, architecture, prices and pilot options under NDA. The cost depends on your floor, so it follows the survey and the anchor plan.
2. **Can we buy through our integrator?** Your team or your integrator can build on AmIMotion at any layer, through open interfaces. Tell us on the first call who else will be involved.
3. **Is AmIMotion certified to FiRa or omlox?** AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification.
4. **Where is AmIMotion made?** Designed and built in India, on NXP Trimension UWB silicon. AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru.

## close

Default company close: `close("Talk to the team.", "Tell us the flow you want to see. We walk through it with you.", (("Book a call", "/contact/"),))`

## Internal links

/start/, /pilot/, /tools/pilot/, /tools/anchors/, /products/amigo/, /products/amimo/, /products/amihub/, /contact/ (close), /company/ (on "Kaushal Kukkar" line, label "About us"), /developers/ (on "open ... interfaces", label "For developers").

## JSON-LD notes

`WebPage` + `BreadcrumbList` (Home > Start small > How to buy) + `FAQPage` (four questions). The Organization node is referenced by `@id`, not repeated. No `Offer` or `PriceSpecification` (no prices may be published).

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P9 Procurement | 7 | "What recurs after the pilot?" | Not in any founders' document (O12). The quote tile now tells them how to ask for separate lines. Logged. | 8 (blocked on O12) |
| P8 Group operations | 8 | "Open interfaces" alone felt vague | Named REST, MQTT, WebSocket, omlox hub and the specifications line. | 9 |
| P11 Promoter or MD | 8 | Wanted to know a founder is reachable | O13 is open. The leaders line is the safe one. | 9 |

Mean 8.7. Blockers: O12 (what recurs, who installs), O13 (founder on the call).

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| Four steps: call, NDA pack, survey and pilot, scale | PASS | [B8] "How an engagement runs" |
| NDA pack contents | PASS | F13 (reference results left out on purpose) |
| Battery 1 to 3 years, depending on use | PASS | K03 AMBER with qualifier |
| 3 to 8 m, DC or PoE | PASS | [B4] |
| AmIHub on-prem, no internet, or cloud | PASS | K03 GREEN, C21 wording |
| "Survey and plan ... so the anchor count fits" | PASS | [B4], [B8] step 3 |
| Leaders line | PASS | V95 exact, only the two names allowed |
| One contract, one support line; local stock and engineers | PASS | [B8] |
| Interfaces line | PASS | K03 GREEN, V67, F9 |
| "say so on the call" (separate lines) | PASS | Invites a request; promises no format. [CW] packaging is a recommendation, not stated as AmIMotion's |
| "Integrator can build at any layer" | PASS | [B2], V91. Who commissions is O14, not stated |
| "Certified" | Never used | K03 NEVER |
| Old meta "One contract." only | REWORD | Too thin for P9; new meta names the four steps |

**Open facts used.** O12, O13, O14 safe lines. No O1 to O4 or O6 line.
**Word count:** about 560.
