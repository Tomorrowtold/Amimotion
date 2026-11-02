# /use-cases/ask-your-plant/  (nav: Ask your floor, line "AI assistants and MCP")

Generator: `p_solutions.py`, UC row "ask-your-plant". Head media changes from `film(4)` to a model-hall still. No `tone="dark"`. URL kept; label is the nav label.

- **Title tag:** Ask your floor: AI assistants over MCP
- **Meta description (148):** Ask an AI assistant where tagged work is and how long it has waited, answered from AmIHub's live map over MCP. Any change needs a person's approval.

## Page

### head(...)
- **H1:** "Ask your floor a question." / soft: "The live map answers."
- **Lede:** Ask in plain words. An AI assistant answers from AmIHub's live map. Asking changes nothing.
- **short:** AmIHub, AmIMotion's software, has an MCP server built in. MCP is an open standard that lets AI assistants use other software. Any assistant that supports MCP can ask AmIHub where tagged work is and how long it has waited, and answer from the live map. Asking changes nothing. Any change needs a person's approval. Every request is logged. We show it live on a call.
- **trail:** [("Use cases", "/use-cases/"), ("Ask your floor", None)]
- **links line:** Trust and data (/trust/) · For developers (/developers/)
- **media:** `slot(brief, "wide", alt)`, P-UC4-01. The homepage screen 4 still at 16:9: camera A, full frame, isolate pass. Everything pale, no trails. Only the three trolleys in the inspection queue keep their amber. No answer card, no data.
  Alt: the homepage screen 4 alt, "The same model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited."

### section 1
- `vp("Today,", "and with AmIMotion.")`
- `tiles([...], cols=2)`:
  - **Today.** Questions travel one radio call at a time. Where is it? How long has it sat there? Someone goes to look, and the answer is old when it arrives.
  - **With AmIMotion.** A supervisor asks: which trolleys have waited at inspection for more than an hour? The assistant reads AmIHub's live map and answers with those trolleys.

### section 2
- `vp("Questions it can answer", "from the map.", lede="Each answer comes from what AmIHub already holds: live positions, zones, waits and history.")`
- `tiles([...], cols=3)`:
  - **Which trolleys have waited at inspection for more than an hour?** AmIHub answers from its zones and the wait of each tagged trolley.
  - **Where was the gauge cart last seen?** AmIHub answers from live location, with the time it was last seen.
  - **What came through the dock door this morning?** AmIHub answers from the zone entries in that time window.

### section 3
- `vp("Asking changes nothing.", "Acting needs a person.")`
- `tiles([...], cols=3)`:
  - **Its own access.** Each assistant gets its own access to AmIHub: read-only, or only the actions you allow.
  - **A person approves.** Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor.
  - **Every request logged.** AmIHub logs every request an assistant makes: who asked, what was called and what changed.

### section 4
- `vp("It can stay", "inside your plant.")`
- `split(None, paras, (), media)`:
  - "The MCP server is part of AmIHub, so it can run on a PC inside your plant. If the assistant runs inside your network too, nothing has to leave it."
  - "The same tools are open over REST and MQTT, so your own software can ask the same questions."
  - extra: `more([("Trust and data", "/trust/"), ("For developers", "/developers/")])`
  - media: none. (A real AmIHub capture goes here only on the day one may be shown, O5. Until then the section runs as copy only; `split` with `media=None` gives the copy column.)

### section 5
- `faq([...], "Common questions.")`
  - **Can AI assistants query factory location data through MCP?** Yes, with AmIMotion. AmIHub has an MCP server built in, so any assistant that supports MCP can read live positions, zones and waits. Asking changes nothing. Any change needs a person's approval, and every request is logged. We show it live on a call.
  - **What is MCP?** Model Context Protocol, an open standard that lets AI assistants use other software. AmIHub has an MCP server built in.
  - **Can the assistant act on its own?** Not without a person. Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor.
  - **Which assistants work with it?** Any assistant that supports MCP. Each one gets its own access to AmIHub.
  - **Does our data leave the plant?** It does not have to. AmIHub can run inside your plant. If the assistant runs inside your network too, nothing has to leave it.

### section 6
- `vp("Other jobs,", "same tags.")`
- `links([...])`: Where is that trolley? · Station to station · The hand-off, each with its one line.

### close
- Custom: `close("See it answer on real data.", "On a short call we show an AI assistant working on real AmIHub data.", (("Book a call", "/contact/"),))`

## Internal links
/trust/, /developers/, /learn/mcp-location-data/ (FAQ 1, link text from its nav label or page title), the three other use cases, /contact/.

## JSON-LD notes
- WebPage, `description` = meta. `mentions` AmIHub (SoftwareApplication @id). VideoObject removed while film 4 is held.
- BreadcrumbList: Home > Use cases > Ask your floor.
- FAQPage, five rows.

## Checks
- **Job:** P7 IT and security, P8 digital sponsor and P4 supervisor, from homepage screen 4. Question: "what can it answer, and what stops it acting on its own?" Next: Book a call (the demo is the proof; K03 AMBER needs "We show it live on a call"). Reference: Stripe docs for scoped access; assistant connector docs list what a tool may read. We beat them by putting the three controls in one row a security lead can quote.
- **Drafts:** A (engineer voice) led with access and logs. B (factory-floor voice) led with the supervisor's question. **Picked B's order** (the job first), A's controls as section 3.
- **Readers:** P7 IT 8 → 9 (asked where the data goes: section 4). P4 supervisor 8 → 9 (lost on old "chat panel beside the map": a UI we may not show, O5; cut). P8 group operations 9 → 9.
- **Claims:** MCP lines PASS exact from the homepage (V36 to V45, F5). "who asked, what was called and what changed" PASS ([B7]). "The same tools are open over REST and MQTT" PASS ([B7] "Same tools available over REST and MQTT"). Example questions PASS: they are questions, not shown answers; each maps to a [B7] tool family (zones and fences, live location, history). Assistant brand names from [B7] left out (no partner names). Old "Shown in a live demo." kept as "We show it live on a call." (V41). Old "highlights the answer" cut (a UI claim). Old "Not in the setup we show" REWORD to V38 (O15 kept as worded).
- **Open facts used:** O5 (no AmIHub screen), O15 safe line. Not O1, O2, O3, O4, O6.
- **Words:** about 600 visible.
