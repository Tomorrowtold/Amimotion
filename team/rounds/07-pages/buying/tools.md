# /tools/  Planning tools

Squad: buying. Generator: `p_company.py`, `write("/tools/", ...)`.

- **Title tag:** Free planning tools for your first bay | AmIMotion
- **Meta description:** Four free AmIMotion tools that run in your browser: plan your first bay, estimate anchors, count time spent searching, and write a one-page pilot brief.

**Job of the page.** A hub for people who prefer to work alone before a call (kit 09 section 5: 61% of B2B buyers prefer rep-free buying, Gartner 2025; internal context only, not quoted on the page). Buyers: P2, P3, P5. Question: "Which tool answers my question?" Next step: open one tool. Best reference: Vention's and Formlabs' tool hubs: each tool named by the question it answers, with what goes in and what comes out.

**Drafts.** A: a plain list of four links. B: the list by the question each answers, then a short "what these tools are not" so nobody mistakes an estimate for a quote. Picked B: the honest limits are what make P3 trust the numbers, and the page needs an answer passage to be quoted.

---

## head(...)

- **H1:** Plan it before the call.
- **soft:** none
- **lede:** Four free tools. They run in your browser, ask for no sign-up and send nothing unless you choose to.
- **short:** AmIMotion offers four free planning tools. Plan your first bay asks six questions and gives back a plan for where to start. How many anchors you need gives a first range from your floor size, before a survey. Time spent searching turns your own figures into hours a year. Your pilot on one page writes a brief to share with your team. Each one runs in your browser.
- **trail:** [("Start small", "/start/"), ("Tools", None)]
- **links line:** none
- **media:** none

## section 1: `vp("Pick the question you have.")` + `links(...)`

| href | Title (nav label) | Line |
|---|---|---|
| /diagnostic/ | Plan your first bay | Where would location help first? Six questions, and a plan comes back. |
| /tools/anchors/ | How many anchors you need | How much hardware might one bay take? A first range, before the survey. |
| /tools/search-time/ | Time spent searching | What does looking for trolleys cost today? Your own numbers, multiplied out. |
| /tools/pilot/ | Your pilot on one page | How do I explain it to my team? A brief to share. |

## section 2: `vp("What these tools are not.")` + `prose(html)`

1. They are planning aids, built from your answers and a few stated assumptions. None of them is a quote, a survey or a forecast of savings. Each AmIMotion tool shows its assumptions next to its answer.
2. The real anchor count comes from an AmIMotion survey of your floor. The real change in search time comes from a pilot that measures it, against a baseline set before it starts.
3. Nothing you type is stored by this site. A brief you download is a file on your own device. If you email a result, it goes from your own mail app.

## section 3: `vp("Then measure it.")` + `links(...)`

| href | Title | Line |
|---|---|---|
| /learn/pilot-baseline/ | Measure before you claim | Set the baseline before the tags go on. |
| /pilot/ | How a pilot runs | One flow, one bay, five steps. |

## close

`close("Rather talk it through?", "The call is a live demo on real AmIHub data, not slides.", (("Book a call", "/contact/"),))`

## FAQ

None.

## Internal links

/start/, /diagnostic/, /tools/anchors/, /tools/search-time/, /tools/pilot/, /learn/pilot-baseline/, /pilot/, /contact/.

## JSON-LD notes

`CollectionPage` + `ItemList` of the four tools (each item a `WebApplication`, `isAccessibleForFree` true) + `BreadcrumbList` (Home > Start small > Tools). Note: /tools/ is not itself a nav item; its crumb label is "Tools".

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P2 Production control | 9 | none | | 9 |
| P3 IE lead | 8 | "No savings are assumed" appeared only on one tool | Section 2 now says it for all four. | 9 |
| P5 OT engineer | 9 | none | | 9 |

Mean 9.0.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| "run in your browser ... send nothing unless you choose to" | PASS | tools.js and diagnostic.js: no network call while `leadEndpoint` is empty |
| "Each tool shows its assumptions next to its answer" | PASS on condition | True only once the anchor and search-time pages carry the assumption tiles written in this round |
| Survey sets the count | PASS | [B4] |
| Pilot measures change against a baseline | PASS | [CW] measurement (method, not a result), V78 |
| Old "Diagnose your floor" label | REWORD | One label per URL: "Plan your first bay" |

**Open facts used.** none.
**Word count:** about 300.
