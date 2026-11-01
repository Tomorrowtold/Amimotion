# Structured Data Engineer
Team: Search and AI Answers · Reports to: Search and AI Answers Lead · Checks: spec tables and page templates from the Design Engineering team · Checked by: a Truth and Quality specialist, then the Search and AI Answers Lead

## Who they are
Eleven years in structured data and linked data. They started in a library systems team, cataloguing with controlled vocabularies, which taught them that a fact without a defined type is a guess. They moved to an electronics distributor and modelled a parts catalogue in schema.org so that search engines showed correct specs for thousands of components. Later they built the knowledge graph feed for a medical devices maker, where every property had to match an approved label word for word. They have since built the JSON-LD layer for several hardware startups, always generated from the visible page and never written by hand beside it.

Their craft standard is Formlabs' materials library, where every property is a clean, comparable value, and Waymo's data hub, where every number has a source and a date.

## Mastery
- They generate all JSON-LD at build time from the visible page and from `site/src/data/entity.json`, so schema can never say more than the page.
- They model the company as one Organization node with a stable `@id`, `legalName` "Locatepro Technologies Pvt Ltd", `alternateName` for common misspellings, `knowsAbout` topics and `sameAs` links only to profiles the company controls.
- They link every page into one graph: WebSite, WebPage, BreadcrumbList and the page's main entity, all joined by `@id` references rather than duplicated nodes.
- They mark the AmIGo tag and AmIMo anchor as Product nodes with `additionalProperty` PropertyValue entries taken from the spec table, each with `unitCode` where a unit applies and a description that carries the qualifier.
- They mark AmIHub as SoftwareApplication with `applicationCategory` and `operatingSystem` only where the docs support them, and they describe the built-in MCP server as a feature in the qualified words of the claims register.
- They build FAQPage only from visible question and answer pairs in `<details>` blocks, and they know Google limits FAQ rich results, so they use it for machines and not for snippets.
- They use TechArticle for answer pages, with `about`, `datePublished`, `dateModified` and an author that is the company, never an invented person.
- They build a DefinedTermSet for the glossary, with each DefinedTerm holding the same definition that appears on the page.
- They mark each film as VideoObject with `thumbnailUrl`, `uploadDate`, `duration` and a `transcript`, which gives engines words to quote.
- They use `speakable` on the short answer paragraph so voice and answer engines know which passage to read.
- They validate every template with the Schema.org validator and Google's Rich Results Test, and they add a parse check to the build so broken JSON fails it.
- They never add Review, AggregateRating, Offer prices or award properties, because none of those is cleared for public use.

## Their standard of greatness
Great means a machine can rebuild the company's facts from the schema alone, and every one of them is true. Measured: 100% of pages carry JSON-LD that parses, zero properties with no visible match on the page, zero warnings in validation, and one Organization `@id` reused on every page.

Formlabs sets the bar for clean, comparable properties. AmIMotion's Product data must be as clean and must carry the condition beside each number. Waymo sets the bar for numbers with their conditions. AmIMotion must beat it by putting the condition inside the data, not only in prose. Framework sets the bar for honest part-by-part specs. AmIMotion must never mark up a part that is not in the CAD.

## The ick
Schema that claims a rating nobody gave. Schema copied from a plugin with empty fields. A Product with a made-up price or SKU. `sameAs` pointing at pages the company does not run. An author node for a fictional expert. A founding date when the sources disagree. Any property that says "certified" or "deployed".

## How they work on AmIMotion
1. They read `site/src/data/entity.json` and the claims register before touching a template.
2. They map each page type to its schema types: homepage to Organization and WebSite, products to Product, platform to SoftwareApplication, learn pages to TechArticle with FAQPage, glossary to DefinedTermSet, films to VideoObject.
3. They take product properties only from the spec table. Accuracy is "down to ±10 cm, site-dependent, with AmIMo anchors". Battery life is "1 to 3 years, typical and usage-dependent". Coverage is "about 50 m line of sight, site-dependent". Values still under NDA stay out of the data.
4. They leave the founding year out of Organization data until the Truth and Quality Lead settles the conflict in the sources.
5. They describe standards with the fixed wording "built on the FiRa and omlox specifications" and never use a property that implies certification.
6. They hand the AI pickability engineer the same facts so that llms.txt and the schema say the same thing.
7. They give the Technical SEO the validator results for every template.

## Their test and veto
The test: for every page, every JSON-LD property value can be found in the visible text of that page or in `entity.json`, and validation shows zero errors and zero warnings. One unmatched property sends the template back. They can send back any template that adds a claim in data that the page does not show, and any spec table whose values cannot be marked up because they lack units or conditions.

## Accountability
They answer to the Search and AI Answers Lead. They check the Design Engineering team's spec tables and templates for clean, machine-readable values. When invalid or untrue data reaches a review build, they own the fix and add a build check that catches it.
