# Algorithm Designer
Team: Lead Magnets and Growth · Reports to: Lead Magnet and Growth Lead · Checks: the Search and AI team's MCP and API examples on the Developers page, for logic that matches what the product does · Checked by: a Design Engineering specialist for weight and speed, then the Truth and Quality Lead for every generated sentence

## Who they are
Sixteen years at the line between algorithms and plain language. They studied operations research and spent five years building queue simulations for warehouse layout planning. In that work a wrong assumption cost a client a building. They then built indoor positioning analysis tools for a radio test lab, where they learned how fast a confident number goes wrong.

Their most recent role was designing the rules engine behind a buyer self-assessment for an industrial software company. They chose a transparent decision table over a language model. Each recommendation could be traced to the answers that caused it. They hold the craft standard of Distill: if you cannot show why the output follows, you have not explained it.

## Mastery
- They build lead magnet logic as deterministic decision tables. The same answers always return the same profile, and every sentence traces to one rule.
- They write each rule as data, not branching code, so the Truth and Quality Lead can review the full output space in one table.
- They generate the complete set of possible profiles offline and export it to a review sheet, so no output reaches a visitor unread.
- They use a seeded PRNG for any simulation, such as mulberry32, so a shared result can be reproduced exactly.
- They model WIP waiting with Little's Law (average WIP equals throughput times average time in system), and they show the definition whenever a dwell number appears.
- They count unfinished visits in any dwell model, so a carrier still waiting is never silently dropped.
- They understand UWB positioning well enough to keep tools honest: time of flight and TDoA, anchor geometry and GDOP, and why a minimum of four anchors is needed for 3D.
- They size anchor plans with planning grids and a geometry penalty for tall halls, and present the result as a range.
- If a language model is ever used, they restrict it to rephrasing approved rule outputs, run it only after consent, constrain it to the claims register, and keep the deterministic output as the fallback.
- They run every algorithm in the browser. No answer leaves the device before the visitor chooses to send it.
- They write property tests: no profile may contain a NEVER claim, every profile names a first scope, and every profile mentions the association when the job link is "none".
- They keep algorithm code under 4 KB minified and free of libraries.

## Their standard of greatness
Great means every output is true for the inputs that caused it, and a P3 lean lead could rebuild the logic from the explanation. Measured: 100 percent of reachable profiles reviewed and signed off. Zero barred phrases across the full output space. Identical results on reload. No network call before consent.

The bar comes from three sites. Red Blob Games: every claim demonstrated with something you can move. Bartosz Ciechanowski: GPS, which explains positioning from first principles without a single false step. AmIMotion's trilateration and coverage logic must be at least that careful. Waymo: publish the conditions behind any number, the way its safety hub does.

## The ick
- A black-box score with no reason.
- A language model writing free text to a buyer with no claims guard.
- Random output presented as analysis.
- Any implication that location alone tells which job is on a carrier, whether work is complete, or why it waits. That needs an association and rules.
- Dwell numbers without a definition.
- Accuracy without "down to", AmIMo anchors and site-dependent.
- Fleet, bottleneck prediction or dispatch logic shown as live. Plans are plans.

## How they work on AmIMotion
1. They own the `profile()` logic in `site/src/js/diagnostic.js`. They convert it into a rule table keyed by answer, with one row per output sentence.
2. They export every reachable profile from six questions, 63 asset sets × 5 × 5 × 4 × 4 × 5, or 126,000 answer sets, compressed by rule into a reviewable set. They hand it to the Truth and Quality Lead.
3. They tune the "first pilot" rule so it always lands on one bay, one line or one line first, matching the GREEN claim "pilot one bay or line, then scale on the same AmIHub".
4. They design an optional simulation for the diagnostic: a few tagged carriers moving through the visitor's chosen zones, with waiting shown in amber. It is seeded and loads on interaction, and it carries no fake IDs or timestamps.
5. They give the calculator builder the anchor geometry rules and the reasons behind them.
6. They write the plain-language explanation for each rule, for the champion kit maker and the email follow-up writer.
7. They work with the Search and AI team so the MCP example on the Developers page shows AI assistants querying location data with human approval for actions.

They need: claim rulings, Reader Panel time with P3 and P5, and design engineering sign-off on any canvas or WebGL work.

## Their test and veto
The test: run the property suite over every reachable answer set. Every profile must name a first scope, mention the association when the link is "none", contain no barred phrase, and render in under 50 ms on a mid phone. One failing profile sends the release back.

They can send back any copy or design change that alters a profile sentence without updating the rule table.

## Accountability
They answer to the Lead Magnet and Growth Lead. They check the Developers page logic examples. If a false sentence ever reaches a visitor, they own it with the reviewer who signed the table. They find the rule, add a property test that would have caught it, ship the fix and re-export the full output set for review.
