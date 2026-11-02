# /pilot/  How a pilot runs

Squad: buying. Generator: `p_company.py`, `write("/pilot/", ...)`.

- **Title tag:** How a pilot runs: one flow, one bay | AmIMotion
- **Meta description:** An AmIMotion pilot follows one flow in one bay or line. It times today's waits first, surveys the hard places and ends in a decision on your numbers.

**Job of the page.** Buyers: P1 plant head (is it worth funding, can it support a rollout decision), P3 IE lead (is the measurement honest), P9 procurement (what is the effort and the obligation), P5 OT (what does the survey test). Question: "What exactly happens, what do we bring, and what do we decide at the end?" Next step: write the brief (Your pilot on one page) or book the call. Best reference: Formlabs' sample-part page and Stripe's docs pages: the whole process in order, with nothing hidden behind a form. We do the same with five numbered steps and a who-does-what split.

**Drafts.** A (words specialist): narrative, "a pilot worth running", one long section. B (buyer-truth lead): five steps, then who does what, then what the pilot leaves out, then FAQ. Picked B and took A's line "the numbers at the end mean something" for the lede: B answers P9's question about effort on the page, and steps map to the `steps()` block.

---

## head(...)

- **H1:** How a pilot runs.
- **soft:** One flow, one bay.
- **lede:** An AmIMotion pilot answers one question on one part of your floor. It measures today first, so the numbers at the end mean something.
- **short:** An AmIMotion pilot follows one flow in one bay or line. You choose the flow. The pilot times today's waits first, over a window you choose. That is your baseline. AmIMotion surveys your floor and sets the anchor count. AmIGo tags go on the trolleys, bins and pallets in that flow, not on people. Your team uses the live map during the shift. You see your own waits in one bay, and prove the numbers, before you decide on more.
- **trail:** [("Start small", "/start/"), ("How a pilot runs", None)]
- **links line:** Your pilot on one page `/tools/pilot/` · Plan your first bay `/diagnostic/`
- **media:** `slot(brief, "wide", alt, "Realism lab")`
  - Shows: camera A, the whole hall pale, the inspection bay in full colour: one trolley inside the station on blue, three trolleys in the queue on amber, the two AmIMo anchors on the bay's columns.
  - Source: model-hall still, `build_hall.py`, camera A, homepage screen 6 scene, 16:9. (Replaces the old brief of an engineer and a production lead at a column: the hall has no people, and a real survey photo does not exist.)
  - Alt: "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors."

## section 1: `vp("Five steps, in order.", lede="Each step has to hold before the next one starts.")` + `steps(...)`

| # | Heading | Text |
|---|---|---|
| 1 | The question | You choose one flow, such as trolleys from the press to inspection. We agree the bay, the zones that matter and the trolleys in scope. |
| 2 | Today, measured | The pilot times today's waits first, over a window you choose. That is your baseline. Before it starts, we agree how to count a wait that runs past shift end. |
| 3 | Survey and install | We survey your floor and set the anchor count. The survey looks at your columns, your power points, your racking and your steel, because each changes how far an AmIMo anchor reaches. |
| 4 | Used by people | Your team finds trolleys and sees waits on AmIHub's live map during the shift. We also agree who on your team acts when work waits too long. |
| 5 | A decision | You see your own waits in one bay, and prove the numbers, before you decide on more. If you go on, you grow plant-wide on the same AmIHub, without re-fitting the first bay. |

Picture: none.

## section 2: `vp("Who does what.", lede="So you know the effort before you say yes.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| AmIMotion brings | Our survey and an anchor plan for your floor. AmIGo tags and AmIMo anchors for one bay or line. AmIHub, running on an industrial PC inside your plant or in the cloud. Local engineers on your site. |
| You bring | One flow you want to see. A person on the floor who owns it. Power at each anchor point, from DC or PoE. The zones that matter, named in your own words. |
| Your team does | Walks the survey with us. Names the trolleys in scope. Uses the live map in the shift. Joins the review and decides on the numbers. |

Picture: none.

## section 3: `vp("What the pilot leaves out.")` + `split(None, paras, media=still("amigo"))`

Paragraphs:
1. The pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy.
2. A plant-wide rollout and a second plant are their own steps, planned after the bay. A second plant gets its own survey.
3. Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited.
4. Duration and price depend on the bay, the number of tags and the anchor plan. After the first call, AmIMotion shares datasheets, architecture, prices and pilot options under NDA.

Picture: AmIGo tag. Source: CAD render `amigo_hero.png` (lib `still("amigo")`). Alt: "The AmIGo tag, a small dark grey tag with amimotion on its cover."

## section 4: `faq([...], "Questions teams ask first.")`

1. **What does an AmIMotion pilot involve?** One flow in one bay or line, chosen by you. AmIMotion surveys the floor and sets the anchor count. AmIGo tags go on the trolleys, bins or pallets in that flow. The pilot times today's waits first, as a baseline. Your team uses the live map in the shift. You see your own waits, and prove the numbers, before you decide on more.
2. **How long does a pilot take, and what does it cost?** It depends on the bay, the number of tags and the anchor plan, so AmIMotion does not publish a standard length or price. After the first call, we share datasheets, architecture, prices and pilot options under NDA.
3. **What if we can't link jobs to trolleys yet?** Start with where each trolley is and how long it waits. Link each trolley to the job it carries later, in AmIHub or from your own system. Until that link exists, AmIHub shows a trolley's wait, not a job's wait.
4. **How is success judged?** You agree it before the pilot starts: the baseline, how a wait is counted, and who acts when work waits too long. At the end you compare the bay's numbers with that baseline.
5. **Will the steel and racking in our bay be a problem?** Racking and steel change how far each AmIMo anchor reaches, so we survey your floor and set the count. With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor, and the pilot shows it on yours.

## close

`close("Put your pilot on one page.", "Three answers become an AmIMotion pilot brief your plant head, IT and finance can read.", (("Your pilot on one page", "/tools/pilot/"),))`

## Internal links

/start/, /tools/pilot/, /diagnostic/, and in body copy: /learn/pilot-baseline/ (on "baseline" in step 2), /learn/association/ (FAQ 3, "Link each trolley to the job it carries"), /technology/ (FAQ 5), /trust/people/ (section 3 paragraph 1).

## JSON-LD notes

`WebPage` + `BreadcrumbList` (Home > Start small > How a pilot runs) + `FAQPage` (the five questions, read from the `<details>`). Optional `HowTo` from the five steps with no `totalTime`, no `estimatedCost` (no duration or price may appear, K03 NEVER).

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P1 Plant head | 7 | Wanted the right to stop after the bay. | Not fixable: O6 (no founders' document gives a stop right). Shipped the safe V84 line. Logged. | 8 (blocked on O6 only) |
| P3 IE lead | 8 | "How is success judged?" first draft said "agreed KPIs": which ones? | Rewritten to name the three things agreed: baseline, how a wait is counted, who acts. | 9 |
| P9 Procurement | 8 | "Who installs the anchors?" | Not stated in any founders' document (O12). "Local engineers on your site" is the safe line. Logged. | 8 (blocked on O12 only) |
| P5 OT engineer | 9 | none after step 3 named columns, power, racking and steel | | 9 |

Mean 8.5. Only blockers are missing founder facts O6 and O12.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| One flow, one bay or line | PASS | K03 GREEN, [B8] |
| Baseline, "over a window you choose" | PASS | V78, V79 |
| Shift-end wait / who acts | PASS on AMBER | V80, F10 |
| "The zones that matter" (old page added "and the time limit for each") | Time limit STOP | O2 |
| Survey looks at columns, power, racking, steel | PASS | [B4] "Coverage and spacing vary with ceiling height, racking and metal density; final anchor counts come from a site survey" |
| AmIHub on an industrial PC or cloud | PASS | K03 GREEN; who runs the cloud not said (C21) |
| "Local engineers on your site" | PASS | [B8], V89 |
| "Fixes tags to the trolleys ... adhesive, screw or cradle" (old page, team duty) | REWORD to "Names the trolleys in scope" | Who fits tags is O12; "cradle" not in [B3] |
| "AmIHub on a PC in your plant, or in the cloud" as "What you get" | REWORD to "running on", no supply claim | O12 (who supplies the PC) |
| Separate scopes: rollout, second plant | PASS | [CW] separate scopes (states a limit, claims nothing) |
| No duration or price | PASS | K03 NEVER on durations and prices |
| Down to ±10 cm with condition | PASS | charter, V61, V62 |
| "Until that link exists, AmIHub shows a trolley's wait, not a job's wait." | PASS | K03 NEVER (location alone does not show the job) |
| Old short answer "accurate down to ±10 cm in 3D, measured on your floor" | REWORD | Needs "with these anchors" and "depends on your floor" |
| "You can stop after the bay" | STOP | O6 |

**Open facts used.** O2 (safe line), O6 (safe line, blocker logged), O7 (shift-end line), O12 (safe line, blocker logged). No O1, O3, O4 line.
**Word count:** about 720.
