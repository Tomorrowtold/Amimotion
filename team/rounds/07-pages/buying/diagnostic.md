# /diagnostic/  Plan your first bay

Squad: buying. Generator: `p_company.py`, `write("/diagnostic/", ..., scripts="diag")`. The tool markup (`diag_block.html`) and its logic (`site/src/js/diagnostic.js`, `diag3d.js`) are kept. Only the words around the tool are written here; the tool's own strings are flagged below, not rewritten, except where a binding STOP forces a change.

- **Title tag:** Plan your first bay: six questions | AmIMotion
- **Meta description:** Six questions about how work moves in your plant. AmIMotion sketches your floor as you answer and gives you a plan for where to start. Free.

**Job of the page.** The site's main lead magnet. Buyers: P2 production control (the champion), P1, P4. Question: "Where would this help first on my floor, and what would I tag?" Next step: send the plan, or book the call. Best reference: Formlabs' free sample part (value in hand before any ask) and Vention's configurator (the buyer builds their own answer). The diagnostic already does both: the sketch builds as they answer, and the plan shows before the contact form.

**Drafts.** A (growth writer): "Your floor, diagnosed." with a three-tile "useful on its own" section. B (words lead): the locked homepage name and promise, "Plan your first bay", a what-you-get-back section and a plain section on what the plan is not and what happens if you send it. Picked B: the nav, the homepage button and the H1 must carry one label per URL ("Plan your first bay"), and P7/P9 wanted to know what sending does before they type an email.

---

## head(...)

- **H1:** Plan your first bay.
- **soft:** none
- **lede:** Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you.
- **short:** AmIMotion's floor plan asks six questions: what your team looks for, how they find it today, where work waits longest, how a job is linked to its trolley, where you would start, and your role. It sketches your floor as you answer. At the end you get a plan for one bay or line: what to tag first, which zones to name and who should see the live map. Your answers stay in this browser tab until you choose to send them.
- **trail:** [("Start small", "/start/"), ("Plan your first bay", None)]
- **links line:** none (the tool follows at once)
- **media:** none. The tool is the picture.

## section 1: the tool, `section(diag)`

Unchanged markup. The no-JavaScript line inside it stays: "The diagnostic needs JavaScript. You can book a call instead." REWORD to: "This plan needs JavaScript. You can book a call instead." (one name for the tool).

## section 2: `vp("What you get back.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Where work hides | What your answers say about how work is found today, and where it waits out of sight. |
| A first bay | Which trolleys, bins or tools to tag first, the zones around them, and the team that should see AmIHub's live map. |
| Questions for a floor walk | What AmIMotion would ask on your floor, so the first call starts in the right place. |

Picture: none.

## section 3: `vp("What the plan is, and is not.")` + `prose(html)`

1. The plan is a starting point built from six answers. It is not a survey, a quote or a promise about your floor. Racking and steel change how far each AmIMo anchor reaches, so we survey your floor and set the count.
2. You can print the plan or save it as a PDF. Start over clears your answers.
3. If you choose to send it, the page opens a draft email to AmIMotion in your own mail app, with your plan, your name and your work email. Nothing reaches us until you press send. We use it only to reply about your floor. [Privacy](/privacy/)

Picture: none.

## section 4: `vp("Then put a number on it.")` + `links(...)`

| href | Title | Line |
|---|---|---|
| /tools/anchors/ | How many anchors you need | A first range from your floor size, before the survey. |
| /tools/pilot/ | Your pilot on one page | Turn the plan into a brief for your team. |
| /pilot/ | How a pilot runs | The five steps, from the question to the decision. |

## close

`close("Rather talk it through?", "The call is a live demo on real AmIHub data, not slides.", (("Book a call", "/contact/"),))`

## FAQ

None on the page (the tool is the answer). The short answer is the speakable passage.

## Internal links

/start/, /tools/anchors/, /tools/pilot/, /pilot/, /privacy/, /contact/.

## JSON-LD notes

`WebPage` + `BreadcrumbList` (Home > Start small > Plan your first bay). Add `WebApplication` with `name` "Plan your first bay", `applicationCategory` "BusinessApplication", `isAccessibleForFree` true, `browserRequirements` "Requires JavaScript". No `Offer`.

---

## Calculator and tool assumptions: flags for the Engine room and Growth (logic kept, these are the strings and rules a founders' document does not support)

| # | Where (diagnostic.js) | What it says or does | Ruling | Why | Proposed string (drop-in) |
|---|---|---|---|---|---|
| D1 | Q1 option `people`, "People / For safety and muster"; profile fallback `'people badges'` | Offers tagging people as a first-bay choice and can make "people badges" the lead item of a pilot | **STOP** | The pilot tags trolleys, bins and pallets, not people (V81, V83). Muster is [B6] AMBER (C18). O3 consent is open. | Remove the option. If kept for lead quality, route it: result line "Tagging people would be a separate project. It would need its own policy." and never make people the pilot's lead item. |
| D2 | `see[1]` "How long work waits in X, against a rule your team sets"; `pilot` "...agree one dwell rule..." | Implies a configurable rule with an effect | REWORD | Homepage cut "rules" (F4): no source says what a rule does; a rule that alerts is O2. | "How long work waits in X, counted the way your team agrees" / "...agree how a wait is counted..." |
| D3 | `link.scan` "That event can open the association in AmIHub" | Names a method for linking | REWORD | Association method is open (kit 02 Q5); V108 says name no method. | "That scan can link the job to its trolley in AmIHub." |
| D4 | `link.mes` "That is the fastest route to job-level visibility." | Comparative claim | REWORD | No source ranks routes. | "Then AmIHub can take the link from your own system." |
| D5 | Lead form: "An AmIMotion engineer replies by email. No newsletter, no sequence." | Says who replies | REWORD | Who replies is not in any founders' document (O13). | "The AmIMotion team replies by email. No newsletter." |
| D6 | Sketch stamp "Last scan: leaving Cell 2" | A fake data chip | Design flag | Charter ick: "no IDs or fake data chips". | "Last scan, not the place" as the note only, no stamp box. |
| D7 | Result labels with class `mono-label` ("What it means", "A pilot that fits", "Take it further") | Eyebrow labels in mono | Design flag | Banned: eyebrows, monospace. | Make them H4s in the text face, or drop "Take it further". |
| D8 | `found.late` "Visibility has to arrive before the delay does." | Formula-like line | Words flag | Reads as a slogan. | "You hear about it when it is already late." |
| D9 | `leadEndpoint` in config.js | If set, leads POST to a third party (e.g. HubSpot) instead of a mail draft | Privacy flag | /privacy/ and the section 3 copy describe the mail-draft path only. | If an endpoint is ever set, section 3 and /privacy/ must change before release (name the processor, say the form sends directly). |

The 3D floor (`diag3d.js`) is not loaded on this page any more (system notes E7). The 2D sketch stays as the tool's answer, not a picture slot.

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P2 Production control | 8 | "Your floor, diagnosed." sounded like a test they could fail | H1 is now the locked "Plan your first bay." | 9 |
| P1 Plant head | 9 | none | | 9 |
| P7 IT and security | 7 | "Where does my email go when I press send?" | Section 3 paragraph 3 says exactly that, with a Privacy link. | 9 |

Mean 9.0.

**Claims (page words).**

| Claim | Ruling | Source |
|---|---|---|
| "before anyone calls you" | PASS | V93 |
| Six questions, listed | PASS | diagnostic.js `Q` |
| "stay in this browser tab until you choose to send them" | PASS | sessionStorage only; mail draft while `leadEndpoint` is empty |
| "We use it only to reply about your floor." | PASS | Same promise the form already makes; legal sign-off on /privacy/ |
| Survey sets the count | PASS | [B4] |
| Old "one rule and one owner" | REWORD | F4, O2 |

**Open facts used.** O2 and O3 kept out (D1, D2), O13 (D5). No O1, O4, O6 line.
**Word count (words around the tool):** about 420.
