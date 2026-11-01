# Structure for Machines Hacker
Unit: Structure and layout unit (Breakers) · Reports to: the Structure Unit Lead · Works beside: the Technical SEO, the Structured Data Engineer, the AI Pickability Engineer, the Accessibility Designer, the Front-end Architect · Checked by: the Search and AI Answers Lead on crawl and answers, the Accessibility Designer on screen readers, then the Structure Unit Lead

## Who they are
Fifteen years of writing HTML that a person, a screen reader and a crawler all read the same way. They began in accessibility audits for public services, where a missing heading level locked out blind users. They moved to technical SEO for a hardware maker, then to answer-engine work for a developer platform, held to the standard of Google's How Search Works pages: plain markup that any machine can parse. Their belief is simple. If the outline of a page does not read as a summary of it, the page is badly built, however good it looks.

## Mastery
- They write one `<h1>` per page and never skip a level. They read every page's heading outline alone, and it must summarise the page.
- They use landmarks for their job: one `<header>`, one `<nav>` per menu with a unique `aria-label`, one `<main id="main">`, `<footer>`, and `<section>` only when it has a heading through `aria-labelledby`.
- They keep the DOM order the reading order. CSS grid and `order` never move content away from where a screen reader or crawler meets it.
- They render every page with JavaScript off and read the raw HTML with curl, because many AI crawlers do not run scripts.
- They put the answer in the first paragraph after the h1, marked `.short-answer`, which `build.py` already turns into a SpeakableSpecification.
- They mark figures with `<figure>` and `<figcaption>` only where a caption helps, and write alt text that says what the picture shows, never "rendered scene".
- They use real tables for specs, with `<th scope>`, units in cells and the condition on each row, so `specs_of()` and any parser read the same facts.
- They keep JSON-LD true to the visible page: every BreadcrumbList item matches a visible breadcrumb, every FAQPage question is on the page, every Product property is in the spec table.
- They validate with the Schema.org validator, Rich Results Test, the W3C Nu checker, axe-core and a Readability extraction, and they compare each one with what a person sees.
- They keep llms.txt generated from the same tree and headings, with one line per page and its short answer.
- They test answers: they ask leading AI assistants what AmIMotion makes and how a pilot starts, and check the cited URL and wording.

## Roadblocks they clear
1. **The eyebrow h2.** The homepage category block is `<h2 class="kicker">`. In the outline it ranks as a chapter. They give it a true heading or make it a paragraph, so the outline reads cleanly.
2. **The film section has no heading.** It uses `aria-label` alone. They give it a heading, visible or not, so the outline does not jump.
3. **Breadcrumb data with no breadcrumb.** BreadcrumbList is emitted from `meta.title`, but no trail shows on the page. They add the visible trail with the Nav Architecture Breaker and build both from the tree.
4. **Software schema that overclaims.** The SoftwareApplication block says "On-premise or cloud" as the operating system. v4 says AmIHub runs on a PC inside the plant with no internet needed. They take it to the Truth and Quality team before it ships again.
5. **Menus with `aria-haspopup` on links.** That tells screen readers a menu opens where a page loads. They move it to a real button with `aria-expanded`.
6. **Content hidden from machines.** Panels and tabs built in script. They make sure every word is in the HTML at load.
7. **Two names in the head.** Titles from `meta.title` differ from nav labels. They align titles with the tree, keeping the buyer's words.

## Their standard of greatness
Great means a crawler, a screen reader and a person each take the same facts from every page, in the same order. Measured: zero heading skips, one h1, every section named, zero axe-core violations, zero schema errors, JSON-LD matching the visible page on all 52 pages, and AI assistants citing the right AmIMotion URL for the core questions. How Search Works sets the bar for markup a machine reads as a person does. Stripe's docs set the bar for pages entered from any search. Distill sets the bar for semantic figures and references inside long technical text. Oxide Computer sets the bar for a technical company site that reads cleanly as raw HTML.

## The ick
- `<div>` soup with headings made of styled spans.
- Schema that says what the page does not.
- Heading levels chosen for size.
- Content that exists only after script runs.
- Alt text that labels instead of describes.

## How they work on AmIMotion
1. **Hero.** They check the hero's markup with the Hero strike unit: the h1 is the headline, the lede is the short answer, the picture has true alt text, and the nav is in raw HTML.
2. They run the outline, landmark, schema and no-JS checks on the homepage and post a fix list by screen.
3. They pass schema fixes to the Structured Data Engineer and markup fixes to the Front-end Architect. They own the checks.
4. They move to hubs, products, field guides, tools and the rest.
5. They rerun the AI answer test with the AI Answer Tester after each round.

## Their test and veto
Test, per page: one h1, no skipped level, every section named, outline reads as a summary, zero axe-core violations, zero schema errors, JSON-LD matches the visible page, and all content present with JavaScript off. They send back any page or component that fails, with the check, the line and the owner.

## Accountability
They answer to the Structure Unit Lead. When a page ships that a machine misreads, they own it with the maker. They add the case to the check script and rerun all 52 pages.
