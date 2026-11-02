# /trust/people/  People and privacy

Squad: buying. Generator: `p_company.py`, `write("/trust/people/", ...)`.

- **Title tag:** People and privacy: what a pilot tags | AmIMotion
- **Meta description:** An AmIMotion pilot tags trolleys, bins and pallets, not people. The tag goes on the trolley, not on the person pushing it. Here is what the map shows.

**Job of the page.** Buyers: P4 supervisor ("Is this watching me?"), P10 EHS, P1 (labour relations), P7. Question: "Does this track our people?" Next step: bring the hard questions to the call. Best reference: Apple Privacy: one plain promise per screen, in the reader's words, with the control named beside it. Our promise is narrower and therefore believable: the pilot tags things, not people.

**Drafts.** A (current stub): four locked lines. B (reader-panel lead): what the map shows, who sees what, and a plain section on tagging people as a separate project. Picked B: the stub was 60 words and left P4's question ("can my boss see who moved it?") unanswered.

---

## head(...)

- **H1:** People and privacy.
- **soft:** The tag goes on the trolley.
- **lede:** An AmIMotion pilot follows work, not workers. Here is what it tags, what the map shows and who decides.
- **short:** An AmIMotion pilot tags trolleys, bins and pallets, not people. The AmIGo tag goes on the trolley, not on the person pushing it. AmIHub's map shows where tagged things are and how long they have waited. Tagging people would be a separate project. It would need its own policy. You set who sees what, by role, and how long the map keeps its history.
- **trail:** [("About us", "/company/"), ("People and privacy", None)]
- **media:** none

## section 1: `vp("What the map shows.")` + `split(None, paras, media=slot(...))`

Paragraphs:
1. AmIHub shows where each tagged trolley, bin or pallet is, and how long it has waited in a zone. It shows where a tag was last seen, and when.
2. In the AmIMotion pilot, no person carries a tag. So no person is on the map, and the map does not show who pushed a trolley.
3. Why it waited is for your team to say. A long wait shows where to look in the flow. It does not say who is to blame.

Picture: `slot(brief, "photo", alt, "Realism lab")`. Shows: camera A full frame, everything pale, no trails, only the three trolleys in the inspection queue on amber. No people in the hall (as in every hall still). Source: model-hall still, `build_hall.py`, camera A, homepage screen 4 scene, 4:3 crop on the queue. Alt: "The model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited."

## section 2: `vp("Who sees what.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Access by role | You set who sees what, by role. Each system and each AI assistant gets its own access, and every request is logged. |
| History you set | You also set how long the map keeps its history. |
| Inside your plant | AmIHub can run on an industrial PC inside your plant, with no internet needed. |

Picture: none.

## section 3: `vp("If you ever want to tag people.")` + `prose(html)`

1. It is never part of an AmIMotion WIP pilot. Tagging people would be a separate project, outside the pilot. It would need its own policy. Talk to us about it before anything is tagged.
2. In India, a location tied to a named person is personal data under the Digital Personal Data Protection Act, 2023. Your own policy would need to cover it.

Picture: none.

## section 4: `faq([...])`

1. **Does AmIMotion track workers?** The AmIMotion pilot tags trolleys, bins and pallets, not people. The tag goes on the trolley, not on the person pushing it. Tagging people would be a separate project. It would need its own policy.
2. **Can a supervisor see who moved a trolley?** No. The map shows where the trolley went and when. No person carries a tag in the pilot, so the map does not show who pushed it.
3. **Who decides how long the history is kept?** You do. You set how long the map keeps its history.
4. **Does a tag on a forklift track its driver?** Forklifts are not part of the WIP pilot. If you tag vehicles later, the map shows the vehicle, and your policy decides how that history is used.

## close

`close("Bring the hard questions to the call.", "Ask who sees what, and how long it is kept. AmIMotion answers on the call, with AmIHub open.", (("Book a call", "/contact/"),))`

## Internal links

/company/ (crumb, nav places this page under About us), /trust/ ("Trust and data", in section 2 tile 1), /privacy/ (section 3, "Privacy"), /pilot/ (section 3, "How a pilot runs"), /contact/.

## JSON-LD notes

`WebPage` + `BreadcrumbList` (Home > About us > People and privacy) + `FAQPage` (four).

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P4 Supervisor | 8 | "Can my boss see who moved it?" | FAQ 2 and section 1 paragraph 2 | 9 |
| P10 EHS lead | 7 | Wanted the consent rule for badges | O3: no founders' consent policy. Shipped the V83 line plus the DPDP fact. Logged. | 8 (blocked on O3) |
| P1 Plant head | 9 | none | | 9 |

Mean 8.7. Blocker: O3.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| Pilot tags trolleys, bins and pallets, not people | PASS | V81, [CW] cohort of carriers |
| Separate project, own policy | PASS | V83 given line, exact |
| "No person is on the map ... does not show who pushed a trolley" | PASS on inference | Follows from no person tagged; claims no feature. If the plant links operator IDs from MES, it is the plant's data, not the map's. |
| "It does not say who is to blame." | PASS | States a limit; K04 "Why it waited is for your team to say" |
| Roles, history, on-prem | PASS | F1, F11, K03 GREEN |
| DPDP sentence | PASS (law) | DPDP Act 2023 s.2(t) "personal data". A statement of law, not a product claim. Legal sign-off with /privacy/. |
| "with people's consent", "No one is tagged without their consent" | STOP | O3 |
| Forklift FAQ | PASS | Pilot scope [CW]; claims nothing about people |
| Badges for muster or restricted zones | Kept out | [B6] AMBER, C18; a people use with no policy |

**Open facts used.** O3 kept out (safe line only). No O1, O2, O4, O6.
**Word count:** about 500.
