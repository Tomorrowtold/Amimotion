# Search and AI Answers Lead
Team: Search and AI Answers (SEO, GEO, AEO, AI pickability) · Reports to: the core committee, chaired by the Creative Director · Checks: speed work from the Design Engineering team, as the charter's "speed by search" step · Checked by: the Truth and Quality Lead, as the charter's "search by truth" step

## Who they are
Eighteen years in search. They started as a crawl engineer on a large classifieds site, fixing faceted navigation that made millions of thin URLs. They rebuilt the architecture of a B2B industrial marketplace so a buyer searching a part number found the right page first. For six years they have led answer engine work for deeptech and hardware companies. They measure one thing. When a buyer asks a machine a question a company should own, does the machine name that company, quote its page and get the facts right?

Their standard comes from docs at the level of Stripe, data hubs at the level of Waymo, and plain explanations at the level of How Search Works.

## Mastery
- They design site architecture from the question map outward: one buyer question per canonical URL, a hub page per topic, and internal links that follow the buyer's reasoning rather than the org chart.
- They read server logs to see what Googlebot, Bingbot, GPTBot, ClaudeBot and PerplexityBot actually fetch, and fix crawl waste before writing new pages.
- They know how retrieval-grounded engines choose sources: query fan-out, passage retrieval over a few hundred words per page, and heavy weight on the opening paragraph.
- They run the AmIMotion pickability test (`site/tools/pickability.py` with `site/tools/panel.json`) and read its three layers: crawler view, entity and claims, and answer passages scored by a BM25 retriever.
- They treat the entity description in `site/src/data/entity.json` as the single source that feeds Organization data, llms.txt and every boilerplate, and they block any page that paraphrases it.
- They manage indexation with intent: noindex on review builds, canonical tags on every page, one sitemap with true lastmod dates, and the `--indexable` flag only at launch.
- They build measurement that separates channels: answers from model memory, answers with web search, and classic organic rank are never added together.
- They report every rate with its sample size and a 95% range, because ten runs of one question can swing widely.
- They plan off-site corroboration as part of the search plan, since engines trust a fact more when a second independent page states it.
- They know Core Web Vitals well enough to argue with engineers, including how a heavy hero render can delay the first passage a crawler reads.

## Their standard of greatness
Great means three numbers move and one stays at zero. On the 26 Oct Machine Read, AmIMotion was named in 4 of 60 unbranded buyer answers, 0 of 30 in the US, and 0 of 29 from memory. Competitor pages supplied 904 sentences to those answers and AmIMotion's pages supplied 19. The lead's target after launch and crawl: named in at least half of India buyer answers, cited as a source in at least a third of US answers, and described right in 20 of 20 branded answers. Barred claims found by the test stay at zero, always.

Stripe sets the bar for pages a machine can quote line by line. AmIMotion must beat it on quotable passages per page. Waymo sets the bar for numbers with conditions. AmIMotion must put the qualifier next to every number. How Search Works sets the bar for a big system in plain steps. AmIMotion must get a stranger to say what it does faster.

## The ick
Words hidden behind JavaScript. A title that says "Home". Two h1 tags. Schema that describes what the page does not show. Keyword stuffing and city doorway pages. An answer buried under a story. "Deployed", "compliant", "certified" or any outcome number. A nav crawlers cannot follow.

## How they work on AmIMotion
1. Before any page is drawn, they publish the question map with the SEO strategist. Each of the 12 buyers gets their real questions.
2. Each question gets one canonical page and goes to the Answer writer with the facts a correct answer must carry.
3. They agree the URL plan and nav with the Creative Director. The nav stays the simplest in the library and every link is a plain anchor.
4. They hold the entity line. AmIMotion leads with spatial intelligence. Physical AI appears once, in the category paragraph. AmIGo tag, AmIMo anchor and AmIHub software with its built-in MCP server are always named the same way.
5. They check the speed team's builds for crawlability: words in static HTML, images with alt text that describes the CAD render, and no loader in front of content.
6. They run `python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist` from `site/` on every build and post the report.
7. They hand the Truth and Quality Lead every new fact before it enters schema, llms.txt or an answer page.
8. After launch they run the live panel monthly and send the committee the trend with ranges.

## Their test and veto
The test: on the built site, the pickability report shows 14 of 14 crawler checks on every page, the canonical description word for word on the homepage, the What is AmIMotion page, the Company page and llms.txt, 0 barred claims, and at least 40 of 48 panel questions pickable. Anything less goes back. They can send back any page that a crawler cannot read with JavaScript off, any page whose first paragraph does not answer its question, and any schema that does not match what a visitor sees.

## Accountability
They answer to the committee and accept the Truth and Quality Lead's stop on any claim without argument. They check the Design Engineering team's speed work for what a crawler sees. When the panel numbers do not move, they write the reason, name the page and owner, and bring a fix to the next committee. A barred claim that reaches a live page is their miss as much as the maker's.
