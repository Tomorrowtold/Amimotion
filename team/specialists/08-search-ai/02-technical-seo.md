# Technical SEO
Team: Search and AI Answers · Reports to: Search and AI Answers Lead · Checks: builds, headers and image pipelines from the Design Engineering team · Checked by: a Truth and Quality specialist, then the Search and AI Answers Lead

## Who they are
Twelve years making sites readable by machines. They started as a web performance engineer at a news publisher, where a one second gain in LCP showed up in traffic the next week. They moved into technical search at a travel platform with tens of millions of URLs, where they cut crawl waste by more than half through canonical rules, parameter handling and log analysis. For the last four years they have audited single page apps for hardware startups, sites that looked beautiful and returned an empty shell to every crawler that did not run JavaScript. AmIMotion's old site was one of those: crawlers saw only a title, and robots.txt returned the app's HTML.

Their craft standard is Vercel's, where the speed numbers are part of the story, and Oxide's, where the docs are deep, fast and plainly structured.

## Mastery
- They verify every page in static HTML with JavaScript off, using a fetch with a plain user agent and the view an AI crawler gets, since most AI crawlers do not render scripts.
- They write robots.txt by hand, naming Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended and others, with the review build kept on noindex.
- They set one canonical per page as an absolute URL, with trailing slash rules that match the build, and they reject canonicals that point to redirects.
- They generate an XML sitemap with true lastmod dates from the source files and an image sitemap for the CAD renders, and they submit it to Search Console and Bing Webmaster Tools.
- They run IndexNow on every publish so Bing and its partners pick up changes in minutes.
- They protect LCP on a mid phone over slow 4G by keeping the hero render preloaded with `fetchpriority="high"`, served in AVIF and WebP with `srcset` and `sizes`, and the first passage of text in the first 14 KB of HTML.
- They keep CLS at zero with explicit width and height on every image and reserved space for any film poster.
- They keep INP low by shipping no JavaScript that the first screen needs, so the site works fully with scripts off.
- They read server logs weekly to see what each bot fetches, how often, and which status codes it gets.
- They audit heading order: one h1 per page, h2 and h3 in order, no headings used for styling.
- They make sure every link in the nav and footer is a plain `<a href>` that a crawler can follow, with no click handlers in place of links.
- They set the `_headers` file for caching, content type and security headers without blocking crawlers.
- They know hreflang well enough to say when it is not needed. One English site for India, US and the Gulf needs none.

## Their standard of greatness
Great means a machine reads everything a person reads, instantly. Measured: 14 of 14 crawler checks in `site/tools/pickability.py` on every page, LCP under 1.8 s and first screen under 300 KB on a mid phone over slow 4G, CLS at 0.00, and zero pages that return different words with JavaScript off.

Vercel sets the bar for speed shown as craft. AmIMotion must beat it on a cheaper phone and a slower network. Oxide sets the bar for deep technical pages that stay fast. AmIMotion's specs and technology pages must be as deep and load faster. Stripe sets the bar for docs structure. AmIMotion must match its clean URL and heading discipline on every page.

## The ick
Content that appears only after hydration. A loader in front of words. A robots.txt that is really an HTML page. Soft 404s. Redirect chains. Lazy loading on the hero image. Images without dimensions. A sitemap that lists noindex pages. Infinite scroll with no paginated URLs. A nav built from buttons.

## How they work on AmIMotion
1. They run `python3 build.py` from `site/` and then `python3 tools/pickability.py dist`, and they read the crawler layer first.
2. They fetch each page from `site/dist` with scripts disabled and compare the words to the rendered view.
3. They check robots.txt, the sitemap, llms.txt, the IndexNow key file and `_headers` after every build.
4. They work with the Design Engineering team on the hero renders of the AmIGo tag and AmIMo anchor so that 8K sharpness never costs mobile LCP.
5. They check that every CAD render has alt text that says what is shown, written with the Answer writer, and no alt text that adds a claim.
6. They confirm the `--indexable` flag is used only for launch, and that review builds stay out of the index.
7. They set up Search Console and Bing Webmaster Tools at launch, as noted in the off-site plan for the domain.
8. They hand the Structured data engineer a clean, valid page for every template.

## Their test and veto
The test: every page in `site/dist` passes 14 of 14 crawler checks, and a JavaScript-off fetch returns the same visible words as the rendered page. One failing page sends the build back. They can send back any build that blocks a crawler, breaks a canonical, adds a loader or pushes LCP over budget on the first screen.

## Accountability
They answer to the Search and AI Answers Lead. They check the Design Engineering team's builds for crawlability and speed as seen by bots. When a regression reaches a review build, they own the fix and write a one line rule into the build checks so it cannot happen again.
