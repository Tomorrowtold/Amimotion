# Learn squad, round 07

Eighteen pages: /learn/ plus its 14 guides, /glossary/, /faq/ and /resources/. Each page has its own .md file in this folder: `learn.md`, `learn-<slug>.md`, `glossary.md`, `faq.md` and `resources.md`. Each file holds the title tag, meta description, H1, lede, short answer, every section in order with its picture source, the FAQ, the closing line, internal links, JSON-LD notes and a checks block.

`learn_pages.py` is the single source behind all 18 pages and their .md files, written in lib.py blocks (head, read, faq, related, tiles, steps, close, slot and still). `checks.py` holds the loop records for each page. To regenerate the .md files, run `python3 learn_pages.py --md`.

## Applying it (owner: whoever lands round 07)

1. Copy `learn_pages.py` over `site/tools/pagegen/p_learn.py`.
2. Delete the /resources/, /faq/ and /glossary/ `write()` calls, plus `FAQS` and `TERMS`, from `p_company.py`. Each page must be written once.
3. From `site/`, run `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`.

Tested on a scratch copy of today's site:
- All 18 pages pass 14 of 14 crawler checks. Before: /learn/, /resources/ and /learn/alternatives/ were under 250 words, nine pages had no figure with its condition, and /faq/ failed the stand-alone sentences check.
- Barred claims: 0.
- Unbranded questions pickable: 38 of 38.
- Branded questions answerable: 7 of 10 before, 9 of 10 after. The FAQ now answers "What is an AmIMo anchor?" and "What is AmIHub?".
- Site-wide crawler checks: 703 of 756, up from 687.
- No lifted sentence on any of the 18 pages starts with "It", "This" or a similar word.
- No banned word, "compliant", "deployed", "Physical AI" or decorative dash in page copy.
- A render of /learn/uwb-rtls-india/ at 1440 and 390 wide looked clean.

## Pages and final reader scores

Each page was read by three kit 09 personas. The squad read them cold against each profile.

| Page | Words | Final scores | Mean |
|---|---|---|---|
| /learn/ | 278 | 9, 9, 9 | 9.0 |
| /learn/rtls/ | 539 | 9, 9, 9 | 9.0 |
| /learn/uwb-vs-rfid/ | 706 | 9, 9, 9 | 9.0 |
| /learn/alternatives/ | 497 | 9, 9, 9 | 9.0 |
| /learn/uwb-rtls-india/ | 743 | 9, 9, 9 | 9.0 |
| /learn/accuracy/ | 544 | 9, 9, 9 | 9.0 |
| /learn/anchor-planning/ | 619 | 9, 9, 9 | 9.0 |
| /learn/omlox/ | 445 | 9, 9, 9 | 9.0 |
| /learn/wip-visibility/ | 473 | 9, 9, 9 | 9.0 |
| /learn/dwell-time/ | 578 | 9, 9, 9 | 9.0 |
| /learn/association/ | 603 | 9, 9, 9 | 9.0 |
| /learn/location-data-quality/ | 512 | 9, 9, 9 | 9.0 |
| /learn/mcp-location-data/ | 467 | 9, 9, 9 | 9.0 |
| /learn/value-without-mes/ | 420 | 9, 9, 9 | 9.0 |
| /learn/pilot-baseline/ | 414 | 9, 9, 9 | 9.0 |
| /glossary/ | 1016 | 9, 9, 9 | 9.0 |
| /faq/ | 692 | 9, 9, 9 | 9.0 |
| /resources/ | 357 | 9, 9, 9 | 9.0 |

The mean is 9.0 on all 18 pages. The first-round means ran from 7.7 to 8.7. Each page's .md file names the line that lost each reader and the fix.

## STOPs applied (binding)

- **/learn/uwb-rtls-india/**: "one of the few Indian companies" is cut as an unverified superlative. The competitor line now states only what kit 09 states: HID acquired Sewio in 2024, and Ubisense, KINEXON, Pozyx and Zebra are RTLS suppliers. No comparison is made, because K03 marks the [D8] comparison RED.
- **/learn/association/**:
  - AmIHub no longer claims to record a link's start, end and owner (V108).
  - "Job unknown" as a display is cut.
  - "One carrier can hold several links" is cut (O10).
  - "Does not change a job's status" is cut, because [B6] has work orders that close on completion.
- **/learn/value-without-mes/**: "AmIMotion pilots often start this way" is cut. It had no source.
- **/learn/value-without-mes/ and /learn/pilot-baseline/**: the claim that AmIHub measures search counts is fixed. AmIHub gives position and time in each zone, and the team counts searches.
- **/learn/mcp-location-data/**: the copy no longer says data "does not leave the site". The MCP server runs where AmIHub runs, and where the assistant runs is IT's choice.
- **/faq/**:
  - The entity paragraph with "Physical AI" no longer sits in the head, because the footer already carries it.
  - The question "Is AmIMotion FiRa or omlox certified?" is now "Does AmIMotion hold FiRa or omlox certification?", because the crawler bars a bare "certified".
  - "Without re-instrumenting" is cut.

## Blocked, or waiting on a founder fact

All of these ship the safe line from open-facts.md for now. O1, O2, O3, O4 and O6 stay out.

- **O7**, how a wait open at shift end is counted. /learn/dwell-time/ ships "we agree how to count a wait that runs past shift end". Add the default when a founder states it.
- **O8**, outage and rejoin behaviour. Only the dark-anchor alert ships, on /learn/location-data-quality/.
- **O10**, the MES job number and one carrier holding several jobs. /learn/association/ says this is "settled during scoping".
- **O12**, who installs. /learn/uwb-rtls-india/ says only "local engineers on site".
- **O15**, whether approval is always on. The MCP guide ships the homepage line: "needs a person's approval. You can require it from a supervisor."
- **F8 release check.** If /specs/ lacks the Ethernet row from [B4], cut "with an Ethernet option" from /learn/uwb-rtls-india/, /learn/anchor-planning/, /faq/ and /glossary/.

## Asks to other teams

- **Search (tools/panel.json):** B03 still expects the word "compliant", which the founders' review retired. Change that fact to `built on|specification`.
- **Structure (lib.py):** add a `terms()` block. The glossary keeps its raw dl/dt/dd markup because build.py reads that markup into DefinedTermSet. A CollectionPage or ItemList for /learn/ would also help.
- **Any squad:** the glossary now has 39 terms, not 34. Update any line that says "34 terms".
- **Realism lab:** this squad reserves picture slots L01 to L08 with their own codes, so no P-number shifts. Each brief and camera is in the .md files.
  - L01: grade the CAD render pair_scale.png to the page ground.
  - L02 to L05, L07 and L08: crops from model-hall camera A.
  - L06: a new close camera C on one trolley's top rail.
  - The India guide uses the shipped still("amigo").
- **/resources/** leaves out /films/, which stays held (V103). Add it back when the films clear.
