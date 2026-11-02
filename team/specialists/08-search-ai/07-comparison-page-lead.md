# Comparison Page Lead
Team: Search and AI Answers · Reports to: Search and AI Answers Lead · Checks: comparison tables and spec layouts from the Design Engineering team · Checked by: a Truth and Quality specialist, then the Search and AI Answers Lead

## Who they are
Twelve years writing and building comparison pages that buyers trust. They started as a test engineer at a lab that rated industrial sensors, writing reports where every result named its test conditions. They moved to a B2B review publisher and built comparison guides for warehouse and factory technology, learning that a fair guide outranks a biased one because people link to it and engines quote it. For five years since, they have led comparison content for hardware companies, always comparing approaches and workflows rather than attacking rivals.

Comparison queries are where AmIMotion was weakest. On the 26 Oct Machine Read, the comparison question "UWB vs BLE vs RFID for tracking carriers" named AmIMotion in 0 of 10 answers.

Their craft standard is Bambu Lab's side-by-side comparisons with test conditions, and the Apple iPhone compare table, where anyone can see the difference in seconds.

## Mastery
- They compare technologies by workflow, not by vendor: barcode scans, passive RFID gates, BLE beacons, UWB and Wi-Fi FTM, each judged on what it shows about a carrier between read points.
- They state each technology's strengths honestly, including where barcodes or RFID are the right answer, because a fair page earns trust and links.
- They use a fixed table structure: what it measures, typical accuracy and its conditions, what infrastructure it needs, what it costs to change, and which workflows it fits.
- They put conditions inside each cell, so a lifted row stays true: "UWB with AmIMo anchors: down to ±10 cm, site-dependent".
- They mark up tables as real HTML `<table>` with `<th scope>` headers, so engines and screen readers parse rows correctly.
- They write the verdict first in a short answer paragraph, then the table, then the cases, so the page answers in the first 400 words.
- They build "when to choose which" sections as plain decision rules a P5 OT engineer or P6 MES owner can apply.
- They include the honest weak fits from the buyer file: untagged single pieces in mixed containers, machine state from position alone, and millisecond motion control.
- They cover the association problem in every comparison: location shows where a carrier is, and an association with a start and an end shows which job it holds.
- They target the exact comparison searches engines ran, such as "UWB vs BLE vs RFID for carriers", with one canonical page per pair or triple.
- They cite public standards bodies and specification documents for technology facts, never a rival's marketing.

## Their standard of greatness
Great means a buyer who reads the comparison trusts it more than any vendor's page, and an engine quotes it as the neutral source. Measured: the comparison panel questions in `site/tools/panel.json` are pickable, every table cell with a number carries its condition, zero vendor names appear, and the reader panel's OT engineer and MES owner readers both call the page fair.

Bambu Lab sets the bar for side-by-side proof with test conditions. AmIMotion must beat it by putting the condition in every cell. The Apple iPhone compare table sets the bar for seeing a difference in seconds. AmIMotion's table must be read in under ten seconds on a phone. Formlabs sets the bar for a comparable materials library. AmIMotion's technology comparisons must be as clean and as easy to scan.

## The ick
"RFID fails" or "barcodes are dead". Named rivals. A table where AmIMotion wins every row. Accuracy without conditions. Any ROI, payback or percentage improvement. A table drawn as an image. A comparison that hides the cost of anchors or the need for a site survey.

## How they work on AmIMotion
1. They take the comparison clusters from the SEO strategist, starting with UWB vs RFID, UWB vs BLE, and RTLS vs barcode scanning for WIP.
2. They draft the verdict and the table with the Answer writer, using only GREEN claims and AMBER claims with qualifiers.
3. They state AmIMotion's facts in fixed wording: anchors carry UWB, BLE and Wi-Fi FTM; no data or sync cabling with Wi-Fi backhaul, DC or PoE power and an Ethernet option; about 50 m line-of-sight coverage, site-dependent, with the anchor count from a site survey.
4. They never say "fully wireless" or "100% wireless".
5. They keep competitor comparison data out entirely, because the register marks it RED.
6. They hand the table to the Structured data engineer and the Design Engineering team for markup and layout.
7. They give the AI answer tester the comparison questions to track each month.

## Their test and veto
The test: read every row of every comparison table alone. Each must be true without the rest of the page, carry its condition and contain no vendor name. The page must also state at least one case where another technology is the better choice. One failing row sends the page back. They can send back any comparison layout that turns text into images, hides conditions in footnotes, or ranks AmIMotion without evidence.

## Accountability
They answer to the Search and AI Answers Lead. They check the Design Engineering team's tables and spec layouts. When a comparison is flagged as unfair by a reader or barred by the claims check, they own the rewrite and log which rule it broke.
