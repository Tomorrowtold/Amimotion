# /tools/pilot/  Your pilot on one page

Squad: buying. Generator: `p_company.py`, `write("/tools/pilot/", ..., scripts="tools")`. Form markup and the brief builder in `site/src/js/tools.js` are kept. Words only, plus one binding STOP on the brief's own strings (below).

- **Title tag:** Your pilot on one page: a brief to share | AmIMotion
- **Meta description:** Three answers become a one-page AmIMotion pilot brief: what you need to see, where you start and how jobs link to trolleys. Copy, download or email it.

**Job of the page.** Buyers: P2 production control, the champion who must win a committee (kit 09 section 5: "every asset has to work when a champion forwards it"). Question: "How do I explain this pilot to my plant head, IT and finance?" Next step: send the brief, then book the call. Best reference: Pitch's and Linear's shareable one-pagers, and Stripe's habit of making the artefact the product. Here the brief is the artefact.

**Drafts.** A: tool and a one-line note. B: tool, then who the brief is for, then the points it asks you to settle in plain words. Picked B: the champion needs to know each reader's question is covered before they forward it.

---

## head(...)

- **H1:** Your pilot on one page.
- **soft:** none
- **lede:** Three answers become a brief you can send to your plant head, IT and finance. It is written in your browser.
- **short:** AmIMotion's pilot planner turns three answers into a one-page brief. You choose what you need to understand, where you would begin and how work is linked to trolleys today. The brief lists what to settle before hardware arrives, such as the zones that matter and who acts when work waits too long. Copy it, download it as a text file or open it as an email. Nothing leaves your browser until you send it.
- **trail:** [("Start small", "/start/"), ("Your pilot on one page", None)]
- **media:** none

## section 1: the tool (markup kept)

Labels kept: "What do you need to understand?" (Find tagged trolleys: Where a trolley was last seen. / Link trolleys to jobs: Which job is on which trolley, and where. / See where work waits: Zones, visits and how long work sits.), "Where would you begin?" (One production bay / One line-side flow / One tools or fixtures area / Not sure yet), "How is work linked to trolleys today?" (Not defined yet / Manual or scanned / A record in our MES or ERP / Not needed).

Output: "Your brief"; buttons "Download", "Copy", "Email it". Note: "Written in this browser. It is not a quote, a feasibility result or a commitment. Email it opens your own mail app."

## section 2: `vp("Who the brief is for.", lede="A pilot needs more than one yes.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Your plant head | What the AmIMotion pilot asks, where it runs and what you decide at the end. |
| IT and OT | Where the anchors go and what they need. Each AmIMo anchor needs only power, and AmIHub can run on an industrial PC inside your plant, with no internet needed. |
| Finance and procurement | What is in scope, so the prices in the NDA pack can be read against it. |

Picture: none.

## section 3: `vp("What the brief asks you to settle.")` + `prose(html)` as a plain list, then one line

- The zones that matter, named in your own words.
- Who on your team acts when work waits too long.
- How to count a wait that runs past shift end.
- A baseline, measured before you compare anything.
- How a job is linked to its trolley, in AmIHub or from your own system, if you need job-level waits.

Then: "Until a job is linked to its trolley, AmIHub shows a trolley's wait, not a job's wait."

## section 4: `vp("Read with the brief.")` + `links(...)`

| href | Title | Line |
|---|---|---|
| /pilot/ | How a pilot runs | The five steps the brief starts. |
| /learn/pilot-baseline/ | Measure before you claim | How to set the baseline. |
| /learn/association/ | Which job is on the trolley? | Linking trolleys to jobs. |

## close

`close("Bring the brief to the call.", "The AmIMotion call is a live demo on real AmIHub data, not slides.", (("Book a call", "/contact/"),))`

## FAQ

None.

## Internal links

/start/, /pilot/, /learn/pilot-baseline/, /learn/association/, /contact/.

## JSON-LD notes

`WebApplication` ("Your pilot on one page", free) + `BreadcrumbList` (Home > Start small > Your pilot on one page).

---

## Brief-builder strings (tools.js `make()`): binding STOP and rewordings

The page copy above describes the brief as it must read. The current JS does not match, and two lines are stopped.

| # | Current string | Ruling | Why | Replacement |
|---|---|---|---|---|
| T1 | "The zones that matter and the time limit for each." | **STOP** | O2: no zone time limits (system notes section 1, build notes item 6) | "The zones that matter, named in your own words." |
| T2 | "Who looks when a limit is passed." | **STOP** | O2 (a limit that triggers a look is the alert claim) | "Who on your team acts when work waits too long." (F10) |
| T3 | "How a job gets linked to a trolley (a scan at loading is the simplest start)." | REWORD | Association method is open (kit 02 Q5, V108) | "How a job is linked to its trolley, in AmIHub or from your own system." |
| T4 | (missing) | ADD | V80: agree how to count a wait past shift end | "How to count a wait that runs past shift end." |
| T5 | "A baseline: searches per shift and minutes per search, measured before tags go on." | PASS | [CW] baseline method | Keep. |
| T6 | Footer "Made in the browser on amimotion.com. Not a quote or a feasibility result." | PASS | | Keep. |

**Release condition:** /tools/pilot/ does not ship until T1 and T2 are changed in `site/src/js/tools.js`. This squad may not edit `site/`; owner Engine room.

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P2 Production control | 8 | The brief said "time limit"; their plant head would ask what happens at the limit | T1, T2 STOP; the page now lists the five points as they will read | 9 |
| P1 Plant head (as receiver) | 9 | none | | 9 |
| P7 IT and security (as receiver) | 8 | Wanted to see the network ask in the brief | IT and OT tile names power only and AmIHub inside the plant | 9 |

Mean 9.0.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| "Nothing leaves your browser until you send it." | PASS | tools.js: Download makes a local Blob, Copy uses the clipboard, Email opens `mailto:` |
| Anchor needs only power | PASS | [B4] |
| AmIHub on an industrial PC, no internet | PASS | K03 GREEN |
| Who acts / shift-end / baseline | PASS on AMBER | F10, V80, V78 |
| Trolley's wait vs job's wait | PASS | K03 NEVER, V29 |
| Time limit per zone | STOP | O2 |

**Open facts used.** O2 kept out; O7 safe line. No O1, O3, O4, O6.
**Word count:** about 470.
