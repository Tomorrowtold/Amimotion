# /start/  Start small

Squad: buying. Generator: `p_company.py`, `write("/start/", ...)`. Maps onto lib.py blocks as written below.

- **Title tag:** Start small: one bay first | AmIMotion
- **Meta description:** Start with one bay. AmIMotion pilots follow one flow in one bay or line, then grow plant-wide on the same AmIHub. Plan the first bay here.

**Job of the page.** Buyer: P1 plant head, with P2 and P11 close behind. Question: "How do I begin without betting the plant?" Next step: Plan your first bay, or read How a pilot runs. Best reference for a hub of next steps: Linear's and Stripe's "get started" pages, which give three doors by situation, not a list of everything. We do the same: three doors, then the tools, then the reading.

**Drafts.** A (Head of Words line): a hub that repeats the nav list with longer lines. B (buyer-truth writer): three doors by where the reader is today, then what a first bay proves. Picked B: A is the nav again, and a hub that only repeats the nav gives AI assistants nothing to quote.

---

## head(...)

- **H1:** Start with one bay.
- **soft (second line):** Then grow on the same AmIHub.
- **lede:** AmIMotion starts small on purpose. One flow, in one bay or line, measured on your own floor before anyone talks about more.
- **short (the speakable answer):** AmIMotion pilots start in one bay or one line. You choose the flow. The pilot times today's waits first, so you have a baseline. You see your own waits in one bay, and prove the numbers, before you decide on more. Then you grow plant-wide on the same AmIHub, without re-fitting the first bay.
- **trail:** [("Start small", None)]
- **links line (actions):** Plan your first bay `/diagnostic/` · How a pilot runs `/pilot/`
- **media:** `slot(brief, "wide", alt, "Realism lab")`
  - Shows: the whole model hall pale, one bay (the inspection station and its queue) in full colour with its trails, its waits and the two AmIMo anchors on its columns.
  - Source: model-hall still, `build_hall.py`, camera A locked, full frame, the homepage screen 6 scene ("one bay in colour"), 16:9 crop centred on the inspection bay.
  - Alt: "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors."

## section 1: `vp("Three ways in.", lede="Pick the one that fits where you are today.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Not sure where to start | Plan your first bay. Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you. |
| You know the flow | Read how an AmIMotion pilot runs: the five steps, what we bring, what your team does and what you decide at the end. |
| Others need to say yes | Your pilot on one page turns three answers into a brief you can send to your plant head, IT and finance. |

Then `more([("Plan your first bay", "/diagnostic/"), ("How a pilot runs", "/pilot/"), ("Your pilot on one page", "/tools/pilot/")])`.

Picture: none.

## section 2: `vp("Your numbers, before the call.", lede="Three AmIMotion tools that run in your browser. Nothing you enter leaves it unless you send it.")` + `links(...)`

| href | Title (nav label forced) | Line |
|---|---|---|
| /tools/anchors/ | How many anchors you need | A first range from your floor size and racking, before the survey. |
| /tools/search-time/ | Time spent searching | Your own figures, multiplied out into hours a year. No savings assumed. |
| /tools/pilot/ | Your pilot on one page | Three answers, one brief to share with your team. |

Picture: none.

## section 3: `vp("What a first bay proves.")` + `split(None, paras, media=still("amimo"))`

Paragraphs:
1. A pilot follows one flow in one bay or line. AmIGo tags ride on the trolleys, bins or pallets in that flow. AmIMo anchors on the bay's columns hear them. AmIHub shows where each one is and how long it has waited.
2. Before it starts, we agree how to count a wait that runs past shift end. We also agree who on your team acts when work waits too long.
3. When the bay has shown its numbers, AmIMotion grows plant-wide on the same AmIHub. The first bay is not re-fitted.

Picture: the AmIMo anchor. Source: CAD render `amimo_rj45.png` (lib `still("amimo")`, page-graded ladder). Alt: "The AmIMo anchor, a dark grey box with a network port."

## section 4: `vp("Read before you plan.")` + `links(...)`

| href | Title | Line |
|---|---|---|
| /learn/pilot-baseline/ | Measure before you claim | Why the baseline comes first, and how to set one. |
| /how-to-buy/ | How to buy | Call, NDA pack, survey, pilot. |
| /trust/people/ | People and privacy | What an AmIMotion pilot tags, and why it is not people. |
| /learn/ | Field guides | Plain answers, one per page. |

Picture: none.

## close

`close("Not sure which bay?", "Six questions about how work moves in your plant. AmIMotion gives you a plan back before anyone calls you.", (("Plan your first bay", "/diagnostic/"),))`

## FAQ

None (a hub; the answers live on /pilot/ and /how-to-buy/).

## Internal links

/diagnostic/, /pilot/, /tools/pilot/, /tools/anchors/, /tools/search-time/, /learn/pilot-baseline/, /how-to-buy/, /trust/people/, /learn/.

## JSON-LD notes

`CollectionPage` with `about` = the Organization `@id`; `ItemList` of the nine Start small nav items in nav order; `BreadcrumbList` (Home > Start small). WebPage description = the short answer's first two sentences. No FAQPage.

---

## Checks

**Readers (cold read, simulated panel from kit 09; a thinking tool, not research).**

| Reader | Round 1 | Line that lost them | Fix | Round 2 |
|---|---|---|---|---|
| P1 Plant head | 8 | "AmIMotion starts small on purpose." read as a slogan with nothing behind it | Kept, but the lede now finishes the thought: "measured on your own floor before anyone talks about more." | 9 |
| P2 Production control | 8 | Section 3 first draft said "AmIHub flags long waits": where does the flag go? | Cut. Replaced with the locked F10 line on who acts. | 9 |
| P11 Promoter or MD | 9 | none | | 9 |

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| Pilots start in one bay or line, then scale on the same AmIHub | PASS | K03 GREEN, [B8] |
| "The pilot times today's waits first" / baseline | PASS | homepage V78, V79 |
| "You see your own waits ... before you decide on more." | PASS | V84 (no stop right) |
| "without re-fitting the first bay" | PASS | [B8] "no re-instrumentation", V85 |
| Wait past shift end / who acts | PASS on AMBER | V80, F10 |
| "Nothing you enter leaves it unless you send it." | PASS | tools.js: no network calls; contact and diagnostic are mailto drafts while `leadEndpoint` is empty |
| First draft "AmIHub flags long waits" | STOP | O2 |

**Open facts used.** O2 safe line (F10). No O1, O3, O4, O6 line.
**Word count of page copy:** about 330.
