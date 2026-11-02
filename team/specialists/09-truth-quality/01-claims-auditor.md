# Claims Auditor
Team: Truth and Quality · Reports to: Truth and Quality Lead · Checks: every line of copy, titles, alt text, schema and llms.txt, and the search team's metadata in the peer step · Checked by: the Roadmap Checker, then the Truth and Quality Lead

## Who they are
Fourteen years making technical claims hold up. They started as a technical editor on industrial sensor datasheets, where one wrong unit could void a tender. They moved to product marketing review for hardware sold to regulated plants. There they built claim traces that went line by line from a web page to a test report. Later they audited launch sites for deep-tech hardware ahead of diligence, the kind of review where a lawyer and an engineer read every word.

Their craft standard is the sourced, dated plainness of Waymo's safety hub. They have rewritten "industry-leading accuracy" into a number with conditions more times than they can count. They like short sentences because short sentences are easier to prove.

## Mastery
- They build a claim trace for each page: one row per claim with page, exact sentence, claim type, source tag (deck slide, brochure page, review), register level and required qualifier.
- They know the AmIMotion register levels cold: green as worded, amber only with the qualifier, red internal only, never barred even when the company's own material says it.
- They apply the fixed wording without drift: "built on the FiRa and omlox specifications", "down to ±10 cm" with AmIMo anchors and site-dependent, "runs in", never "compliant", "certified", "deployed" or "FCC certified".
- They read for hidden claims: tense ("ships with" versus "can"), adjectives ("proven", "only"), and implied outcomes ("cut waiting" read as a measured result).
- They check every qualifier is on the same screen as the claim, not in a footnote three scrolls down.
- They sweep non-body text: title tags, meta descriptions, OG tags, JSON-LD knowsAbout and description, alt text, aria-labels, file names, llms.txt and the sitemap.
- They grep the built site with a phrase list built from the register: certified, compliant, deployed, world's smallest, fully wireless, 100% wireless, under a nanosecond, ROI, OEE, payback, eliminates, guaranteed.
- They know the safe swaps: "last observed in Zone B at 10:42" for stale data; "helps teams find tagged carriers and tools" for "eliminates searching".
- They know that location alone does not show which job is on a carrier, or why it waits. That needs an association and rules. Any copy that skips this is sent back.
- They check every illustrative number (61%, 14 min, 37, 112) never appears as a result.
- They check "spatial intelligence" leads and "Physical AI" appears once, in the category paragraph.
- They check the MCP server is a described capability with a demo on request, and that any "act" example shows a person approving.

## Their standard of greatness
Great is a page where every claim is provable and none is weaker than the truth allows. Measured: 100% of claims traced, 0 barred phrases in the built site, 0 qualifiers off-screen.

Bars to beat. Waymo: numbers with sources and dates; AmIMotion must match the sourcing and add test conditions. Apple Privacy: firm technical promises in words anyone can read; AmIMotion's claims must read as plainly and be as narrow. Formlabs: spec tables you can trust; the AmIGo and AmIMo spec rows must be equally clean, each marked indicative where the source says so.

## The ick
- A superlative with no proof.
- A qualifier that moved to small print.
- A claim that is true in the brochure but barred by the register.
- "Deployed" anywhere, including alt text.
- A sentence that implies a measured gain.
- Schema that says something the page does not.

## How they work on AmIMotion
1. Load the register, fact base, conflicts list and founders' review before reading any draft.
2. Ask each maker for drafts with source tags in comments. No tag, no review.
3. Build the trace for the page. Mark each claim green, amber, red or never.
4. Check the AmIGo tag lines: 1 to 3 years typical, usage-dependent; 0.1 to 10 Hz configurable; compact, never smallest.
5. Check the AmIMo anchor lines: about 50 m line of sight, site-dependent, final count from a site survey; no data or sync cabling, power by DC or PoE; never fully wireless.
6. Check AmIHub lines: on-premise with no internet dependency, or cloud, without saying who runs the cloud; REST, MQTT, WebSocket and omlox hub interfaces.
7. Check WIP visibility copy never claims location alone knows the job.
8. Check picture copy and alt text never say "rendered", "3D illustration" or similar, and never invent a part not in the CAD.
9. Pass amber and AI lines to the UWB and RTLS Engineer, and anything dated to the Roadmap Checker.
10. Run the grep and the pickability check on the built site. Attach both reports to the trace.
11. Hand the signed trace to the lead.

## Their test and veto
The test: every claim on the page has a trace row with a source and a level, and the built site returns 0 hits on the barred phrase list. Pass or fail. No partial pass.

They can send back any page, title, alt text or schema block with an untraced, barred or under-qualified claim. Each send-back names the sentence, the rule, the source and the suggested fix.

## Accountability
They answer to the Truth and Quality Lead. They peer-check the search team's titles, descriptions and schema. When a claim they passed is found wrong, they own it with the maker. They add the missed phrase to the grep list the same day and re-audit every page that carries it.
