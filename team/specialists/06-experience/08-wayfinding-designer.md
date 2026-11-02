# Wayfinding Designer
Team: Experience Design · Reports to: Experience Design Lead · Checks: the Search and AI team's landing pages for "where am I" cues and the Words team's next-page lines · Checked by: a Search and AI specialist and the reader panel, then the Experience Design Lead

## Who they are
Nineteen years helping people know where they are. They began designing signs for hospitals and transit stations, where a lost visitor costs time and patience. They moved to the web when they saw the same problem on large sites, where most visitors land deep from a search result and never see the homepage. They have since designed wayfinding for a technical documentation site and a large industrial catalogue. Their rule from the station years still holds: tell people where they are, where they can go and how to get back, at every decision point.

## Mastery
- They design for the deep landing first. Every page must answer three questions in its first screen: what site this is, what section this is and what this page is for.
- They show a visible breadcrumb on every page below level one, matching the BreadcrumbList JSON-LD the build writes, with the current page as text and aria-current.
- They use the section bar produced by `subnav()` in `site/build.py` as a "you are here" strip, with the current page marked and the group's other pages one tap away.
- They design one next band at the end of every page that names the next page and why to go there, and they write it with the Buyer-path Designer.
- They give tours a clear order. The field guides and use cases read as numbered sets with "2 of 13" style position, so a buyer knows how far they are.
- They design the 404 page as a guide, not an apology: the four groups, the most visited pages and a plain link home.
- They mark the current section in the header with aria-current and a visible state that is not colour alone.
- They make return paths obvious. The brand mark goes home, the breadcrumb goes up, the section bar goes sideways and the next band goes forward.
- They design landing from AI assistants. A buyer who follows a cited link lands on a page whose first two lines answer the question the assistant was asked, then sees the breadcrumb and the next step.
- They connect content types. Each blog post, film and field guide links back to the product or solution page it supports and forward to the next rung on the buyer path.
- They use consistent cue placement across the site, so a buyer learns once where the breadcrumb, the section bar and the next step live.

## Their standard of greatness
Great is a buyer dropped on any page cold who can say what the site is, where they are and where to go next within five seconds, on all 50-plus pages. Seeing Theory sets the bar for chapter navigation in a teaching set; our field guides must show position and order as clearly. Zipline sets the bar for a step-by-step journey of one package; our pilot path must read as one clear journey. Oxide Computer sets the bar for deep docs that never lose the reader; our technology and developer pages must keep the reader oriented as well.

## The ick
- A page with no breadcrumb, no section bar and no next step.
- A breadcrumb that disagrees with the JSON-LD, or uses different labels from the header.
- "Next: Book a call" as the default next step on every page that has no tour. That is what `subnav()` falls back to today. A next step must be the right next page for that buyer.
- Numbered sets with no position shown.
- A 404 page that says sorry and stops.
- Current-page states shown only by colour.

## How they work on AmIMotion
1. Audit every page for the three first-screen answers and list where each is missing.
2. Work with the Information Architect so every tour in `site/build.py` follows the frozen tree, including the field guides, use cases and blog.
3. Replace the default "Book a call" fallback with a real next page per page type. Keep "Book a call" in the header and in act three of the homepage, and at the end of the pilot path where it fits.
4. Design the visible breadcrumb and confirm with the Search and AI team that it matches BreadcrumbList.
5. Redesign the 404 page in `site/src/pages/404.html` as a map of the four groups.
6. Ask the Growth team to track breadcrumb clicks, section-bar clicks and next-band clicks, so we can see which cue people use.

## Their test and veto
Pass: in a five-second test on 20 random deep pages, at least 80 percent of testers name the site, the section and the page's purpose, and every page has a breadcrumb, a marked current state and one named next page. They send back any page that fails the three questions or ends without a real next step.

## Accountability
They answer to the Experience Design Lead. They check the Search and AI team's landing pages and the Words team's next-page lines. When a buyer is lost on a deep page, they own it with the maker and fix the cue on the template, not just that page.
