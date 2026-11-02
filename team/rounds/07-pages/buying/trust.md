# /trust/  Trust and data

Squad: buying. Generator: `p_company.py`, `write("/trust/", ...)`.

- **Title tag:** Trust and data: where your data lives | AmIMotion
- **Meta description:** Where AmIMotion's data lives and who can read it: AmIHub inside your plant or in the cloud, TLS, roles, API keys, audit logs, and what each claim rests on.

**Job of the page.** Buyers: P7 IT and security ("Where does data go? How is it authenticated?"), P6 MES owner, P8, P5. Question: "Can we let this onto our network, and can we believe the numbers?" Next step: take the questions to the call. Best reference: Apple Privacy (short, plain controls, each one a sentence) and Samsara's and Verkada's trust centres (where data lives, who can read it, how it is logged). We add what the reference sites rarely do: what each claim on the site rests on.

**Drafts.** A (current): "Clear claims. Clear boundaries." claims first, security second. B (truth lead with an IT specialist): security first, because the nav line promises "Where your data lives", then the claims. Picked B: the nav label sets the reader's question, and P7 arrives from the homepage's "Trust and data" link under the MCP paragraph.

---

## head(...)

- **H1:** Trust and data.
- **soft:** Where your data lives.
- **lede:** AmIHub can run inside your plant with no internet needed. This page says who can read what, and what each claim on this site rests on.
- **short:** AmIMotion's AmIHub runs on an industrial PC inside your plant, with no internet needed, or in the cloud. Every interface uses TLS. You set who sees what, by role. Each system and AI assistant gets its own API key and scope, and every request is logged. You set how long the map keeps its history. The figures on this site, such as down to ±10 cm with AmIMo anchors, come from AmIMotion's own published specifications and depend on your floor.
- **trail:** [("How it works", "/platform/"), ("Trust and data", None)]
- **links line:** For developers `/developers/` · People and privacy `/trust/people/`
- **media:** none

## section 1: `vp("Where it runs.")` + `tiles(items, cols=2)`

| Heading | Text |
|---|---|
| Inside your plant | AmIHub runs on an industrial PC inside your plant, with no internet needed. Positions, zones and history do not have to leave your network. |
| In the cloud | AmIHub can also run in the cloud. The same access controls, audit logs and history settings apply in both. |

Picture: none.

## section 2: `vp("Who can read it.")` + `tiles(items, cols=3)`

| Heading | Text |
|---|---|
| Encrypted in transit | AmIHub uses TLS on every interface, from REST and MQTT to the MCP server. |
| Access by role | You set who sees what, by role. Each system and each AI assistant gets its own API key and scope. |
| Every request logged | AmIHub keeps an audit log. For an AI assistant, it records who asked, what was called and what changed. |
| History you set | You also set how long the map keeps its history. |
| A person approves changes | Asking changes nothing. Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor. We show it live on a call. |
| Firmware over the air | AmIHub updates anchor and tag firmware over the air. |

Picture: none.

## section 3: `vp("What the claims rest on.", lede="Every figure on this site has a source and a condition.")` + `tiles(items, cols=2)`

| Heading | Text |
|---|---|
| Product figures | They come from AmIMotion's own published specifications and are indicative. Down to ±10 cm needs AmIMo anchors and depends on your floor. A battery life of 1 to 3 years depends on use. Final datasheets are shared under NDA. |
| Standards | AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification. |
| What a position cannot tell you | A position does not show which job a trolley carries until the job is linked to it. It does not show that work is done, or why it waited. Those need your links, your zones and your team. |
| Customers | This site names no customer and shows no customer result. |

Picture: none.

## section 4: `faq([...])`

1. **Does AmIHub need the internet?** No. AmIHub runs on an industrial PC inside your plant, with no internet needed. It can also run in the cloud.
2. **Can an AI assistant change anything in AmIHub?** Asking changes nothing. Each assistant gets its own access: read-only, or only the actions you allow. Any change, such as raising a work order, needs a person's approval, and you can require it from a supervisor. Every request it makes is logged. AmIMotion shows it live on a call.
3. **Is AmIMotion FiRa or omlox certified?** AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification.
4. **Does the pilot track people?** No. The AmIMotion pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy.

## section 5: `links(...)`

| href | Title | Line |
|---|---|---|
| /developers/ | For developers | Interfaces, events and the MCP server. |
| /specs/ | Specifications | Every figure and its condition. |
| /trust/people/ | People and privacy | What a pilot tags, and why. |
| /privacy/ | Privacy | What this website collects, and what it does not. |

## close

Default company close: `close("Talk to the team.", "Tell us the flow you want to see. We walk through it with you.", (("Book a call", "/contact/"),))`

## Internal links

/platform/ (crumb), /developers/, /specs/, /trust/people/, /privacy/, /contact/; in body: /use-cases/ask-your-plant/ ("Ask your floor", on the approval tile), /learn/association/ (on "linked to it").

## JSON-LD notes

`WebPage` + `BreadcrumbList` (Home > How it works > Trust and data) + `FAQPage` (four).

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P7 IT and security | 8 | Old "A cloud tenant, with the hosting region and terms set in your contract": which region? | No source; cut (C21). Cloud tile now states only what [B5] says applies in both. | 9 |
| P6 MES owner | 9 | none | | 9 |
| P8 Group operations | 8 | "Pictures and films ... are not customer sites" read as a disclaimer | Tile cut (no cautions anywhere, Shiv 1 Nov). Pictures need none. | 9 |

Mean 9.0.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| On-prem PC, no internet; or cloud | PASS | K03 GREEN; who runs the cloud not said (C21) |
| "do not have to leave your network" | PASS on AMBER | [B5] no internet dependency, [B7] "Agent traffic never has to leave your network". Old "stay on your site" was stronger than the source. |
| Same controls in both | PASS | [B5] "Role-based access, audit logs and data retention policies in both" |
| TLS on every interface, including MCP | PASS | [B5] "TLS everywhere" |
| Roles, API keys, per-assistant scope | PASS | [B5], [B7], F1 |
| Audit log: who asked, what was called, what changed | PASS | [B7] |
| History setting | PASS | F11 |
| Approval lines | PASS | V38, F5, V39 ("We show it live on a call") |
| OTA firmware | PASS | [B5] |
| Old "Release notes and the update process are in the detailed pack" | Cut | No source names release notes in the pack |
| Old "References: Ask on a call which references can speak to your kind of floor" | STOP (already cut in system notes) | A46, C34 |
| Old "Interfaces ... Connectors and responsibilities are confirmed per site" | Moved to /developers/ | Keeps this page on data |
| Old "Analytics and AI ... claims no robot control" | Cut | The approval tile covers it; robot control is never raised (K03 NEVER) |
| Zone time limits or alerts | Kept out | O2 |

**Open facts used.** O15 (approval lines unchanged). No O1 to O4, O6.
**Word count:** about 620.
