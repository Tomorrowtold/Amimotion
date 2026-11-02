# /learn/mcp-location-data/

**Title tag:** Can AI assistants query factory location data? | AmIMotion
**Meta description (147):** Yes, through MCP. AmIHub has a built-in MCP server, so AI assistants can query live positions and zones, with logged calls and a person's approval.
**H1:** Can AI assistants query location data? / Yes, through MCP.
**Lede:** How an assistant reads the floor, and what keeps it in check.

## Head

**The short answer** (speakable, the quotable paragraph):

Yes. AmIHub, AmIMotion's location software, has a built-in MCP (Model Context Protocol) server. An MCP-capable AI assistant can ask it for live positions, zones and history from the factory floor, where AmIGo tags are located down to ±10 cm in 3D, depending on the site. Each assistant gets its own credentials and tool scope, every call is logged, and any change needs a person's approval. AmIMotion shows this in a live demo, and the setup for your site is confirmed during scoping.

Picture: none.

## Sections (read() article, on-this-page list on the left)

### What MCP is

Model Context Protocol is an open standard that lets AI assistants use other software in a consistent way. An MCP server describes the tools it offers, and the assistant decides when to call them. AmIHub's MCP server offers location tools.

Picture: none.

### What people ask

Examples of questions an assistant can answer from AmIHub:
- “Which forklifts have been idle for more than an hour, and where are they?”
- “What entered the inspection queue on the night shift?”
- “Where is trolley 14, and which job is on it?”The last one needs the trolley linked to its job in AmIHub.

Picture: none.

### The tools AmIHub describes

AmIMotion groups AmIHub's MCP tools into live location, history, zones and fences, trackables and work orders. Example tool names include `get_live_locations`, `get_fence_events` and `count_idle_assets`. The same tools are available over REST and MQTT.

Picture: none.

### Access, logs and approval

Each assistant gets its own credentials and tool scope, so it reads only what you allow. Every call is logged. Any change, such as raising a work order in AmIHub, needs a person's approval, and you can require it from a supervisor.

Picture: none.

### Where it runs

The MCP server runs where AmIHub runs: on a PC inside your plant, or in the cloud. What an assistant then does with an answer depends on where that assistant runs, which your IT team chooses. Settle both with your IT team when an AmIMotion pilot is scoped.

Picture: none.

## Common follow-ups (faq block, FAQPage JSON-LD)

**Can the assistant act on its own?**
No. Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor.

**Which assistants work with it?**
Any MCP-capable client. Each one gets its own credentials and tool scope.

**Is it available today?**
The MCP server is built into AmIHub and shown in a live demo. The setup for your site is confirmed during scoping.

**Does location data leave the plant?**
AmIHub and its MCP server can run on a PC inside your plant with no internet dependency. Where an assistant runs is your IT team's choice.

## Read next (related block)

- [Ask your floor](/use-cases/ask-your-plant/): A supervisor asks a plain question.
- [AmIHub](/products/amihub/): Interfaces and the MCP server.
- [When a tag goes quiet](/learn/location-data-quality/): Last seen, never a guess.

## Close

Default close for this part of the site: "Questions about your own floor?" / "An engineer answers them on a short call, with the live map open." / [Book a call](/contact/)

## Internal links

/learn/location-data-quality/, /products/amihub/, /use-cases/ask-your-plant/, /learn/ (breadcrumb), /contact/ (close)

## JSON-LD notes

type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.

## Checks

**Job of the page.** P8, P7 and P6: can an AI assistant read our floor, safely? Next: Ask your floor, AmIHub.
**Reference.** Stripe: a capability shown plainly, with its limits next to it.
**Drafts.** A: old page. B: yes-first answer, the tool families from [B7], guardrails, where it runs. Picked B: it names the tools a developer looks for.

**Readers** (kit 09 profiles, read cold):

| Reader | Round 1 | Line that lost them | Fix | Final |
|---|---|---|---|---|
| P7 IT / network | 7 | “On-premise, the location data does not leave the site” ignored where the assistant runs. | Now: the MCP server runs inside the plant; where the assistant runs is IT's choice. | 9 |
| P8 Digital transformation | 9 | None. | none needed | 9 |
| P2 Production manager | 8 | “write actions” is developer talk. | “Any change, such as raising a work order, needs a person's approval.” | 9 |

Final mean: 9.0

**Claim rulings:**

| Claim | Ruling | Source |
|---|---|---|
| “down to ±10 cm in 3D with AmIMo anchors, depending on the site” | PASS | K03 GREEN with qualifier, [B1] [B3]; charter fixed wording |
| “built on the FiRa and omlox specifications” / “claims no formal certification” | PASS | Charter fixed wording; [FR] 29 Oct replaces K03's “compliant” |
| Built-in MCP server, any MCP-capable client | PASS on AMBER | [B7]; K03 AMBER: demo on request, site setup confirmed in scoping |
| Per-assistant credentials and tool scope; every call logged | PASS | [B7] |
| Any change needs a person's approval; can require a supervisor | PASS (reworded) | V38, F5; O15 noted |
| Tool families and example tool names | PASS on AMBER | [B7]; fleet family left out (C18) |
| Assistant product names | Left out | No partner or brand names |

**Open facts used:** O15: “needs a person's approval” ships as on the homepage.
