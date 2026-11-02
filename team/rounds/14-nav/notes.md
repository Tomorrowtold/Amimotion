# Round 14: the nav

Owners: Experience Design lead, Structure unit (Nav Architecture Breaker), Search and AI Answers, Engine room, Hero strike.
Brief (Shiv): rework the nav completely, work out how it splits for our audiences, make it easy, quick and good to look at.
Take the best of what exists and add what nobody has done.

Files: `site/src/data/nav.json` (the one tree), `site/build.py` (`header_html`, `section_of`, `nav_pic`, `ask_form`,
`roles_html`, the `assets/ask.json` block), `site/src/css/core.css` (the nav section), `site/src/js/nav.js` (new),
`site/src/assets/nav/` (13 stills cut from existing CAD renders by `tools/thumbs.py`). Tools: `tools/research.js`
(live reference capture), `tools/thumbs.py`, `tools/shoot.js` (every shot in `shots/`).

## 1. Research

Live captures, 2 Nov 2026, at 1440 and 390, closed and open, with frames at 60, 120, 240 and 600 ms after the open
(`research/*.jpg`, labels and bar heights in `research/research.json`). The 100 references in `sites.py` and the round
10 harvest (`10-harvest/caps`, M13 picks) were read first.

| Site | What it does | What we take | What we leave |
|---|---|---|---|
| Apple global nav | 44 px bar of nouns. Hover opens a full-width flyout: a big first column, small columns beside it. The page blurs behind. On a phone it is a full-screen list in big type. Moving between flyouts is instant, with no second animation. | Big type for the main line. Instant switching once a panel is open. A full-screen phone list in display type. | The blur (glass). The hover-only feel. |
| Apple iPhone local nav | A sticky product bar with a Buy pill. | Already built as our `.local` bar (M13). This round keeps it as it is. | — |
| Stripe | One panel that changes height and content as you move between sections. Columns with a one-line description under each link. | The morph: a new panel opens from the old panel's height. A line under each label (we already had it). | Thirty-five links. Gradients. |
| Rivian | The vehicles panel shows product renders as cards next to a plain list. | Real product pictures inside the panel. | Cards so large they push the list aside. |
| Samsara | Industrial. Products, Solutions, Resources, About. Dims the page behind an open panel. | A flat dim, not blur, keeps the eye on the panel. Sorting by industry. | Four nested menus with a dozen links each. |
| Vercel, Linear | A hover highlight that slides between the bar items. Prefetch. | A gliding hover mark. Prefetch on hover (M17). | Dark themes, a second sign-up button. |
| Notion, Figma | Illustrated cards in the panel. Phone sheets that unfold one section at a time. | Phone sections that unfold one at a time. | Illustrations (we have CAD renders). |
| Anduril, Nothing, Raycast, Arc, Framer | A plain wordmark and a few words, or a menu that is all type. | Restraint. | Hiding the map behind one button on desktop. |

What none of them do: (a) answer a question in the menu from the site's own pages, (b) let you start from your job
without a quiz, (c) mark where you are with the same mark the product uses. We are a location product, so (c) uses the
located-blue dot: the dot a tag gets on the AmIHub map.

## 2. The bifurcation

The buyer panel (kit 09, `specialists/03-reader-panel/`) splits in three ways that matter for the nav:

1. **By intent.** Some readers want to **understand** (what is it, does it fit my floor). Others want to **decide**
   (how do I start, who are these people). The four agreed sections already fall into these two groups: How it works
   and Where it helps are for understanding. Start small and About us are for deciding.
2. **By side of the committee.** The **floor side** is the plant head, production and planning, IE and lean, the
   supervisor, group ops, finance, the MD and EHS. They ask what the system is, where it helps and what the first
   step costs. The **review side** is OT and maintenance, MES and ERP, IT and security, and developers and
   integrators. They ask how it locates, what happens when a tag goes quiet, the specs, the data and the API. Both
   sides visit the same sections, but they look for different rows.
3. **By role.** Twelve roles, each with one or two pages to start from (`nav.json` roles, homepage screen 7).

**Decision.** We keep the four agreed sections, their labels and every URL. The split happens in three places, so no
reader has to answer a quiz:

- **The bar splits in two.** How it works · Where it helps | Start small · About us. A hairline separates the two
  pairs, then Ask, then the one button, Book a call.
- **Each panel splits by side** (`nav.json` `groups`, in item order). The first group serves the floor side, the
  later groups serve the review side or the numbers:
  - How it works: *The system* (AmIGo tag, AmIMo anchor, AmIHub, Ask your floor) | *For the technical review*
    (How it locates a tag, When a tag goes quiet, Specifications, Trust and data, For developers)
  - Where it helps: *By problem* (Work in progress, Where is that trolley?, Tools and vehicles, How waits are timed,
    Which job is on the trolley?) | *By industry* (Manufacturing, Warehousing, Robotics and AMRs)
  - Start small: *Your first steps* (How a pilot runs, How to buy, Plan your first bay) | *Your numbers* (anchors,
    search time, pilot on one page, Measure before you claim) | *Read and watch* (Field guides, Films)
  - About us: *The company* (What is AmIMotion?, What is spatial intelligence?, People and privacy) | *Answers*
    (Questions, Glossary, Book a call)
- **Entry by role sits inside Ask.** Before you type, the Ask panel lists "Start from your job" with all twelve roles,
  each linked to its page under the nav label. On a phone the same list is the fifth fold of the sheet. Nobody is
  asked who they are, and the role list lives in one place.

Group names are plain headings in ink at 15 px over a hairline, at the same weight as the rows under them. They are
not small grey eyebrows (the nav designer's ick). Labels did not change. The only order change is in Where it helps:
Tools and vehicles moved up into *By problem*. The footer, llms.txt and the sheet follow automatically.

## 3. Three concepts

**A. "I am a… / I want to…" (sentence nav).** The bar is one sentence with two pickers: *I am a [plant head] and I
want to [start a pilot]*. The panels below reorder for the chosen role, and the choice is remembered.
**Killed.** It puts two choices in front of the first link (Hick's law), and the Experience lead's bar is "route a
plant head and an OT engineer apart without a quiz". Reordering per role means two readers see two different sites,
which breaks WCAG 3.2.6 (consistent help). It also breaks one label per URL, because intent phrases replace page
labels, and crawlers see pickers instead of links. *Kept from it:* the role map, as the empty state of Ask (no quiz,
same labels).

**B. "Ask first" (command bar).** On desktop the bar is a single field plus Book a call. The map hides behind ⌘K.
Answers come from the site with no backend.
**Killed.** It hides the map from readers who browse and do not yet know our words. First-click success then depends
on vocabulary: "WIP" finds a glossary entry, not the page. On a phone the keyboard covers half the screen. Crawlers
and llms.txt need the link tree, not a field. *Kept from it:* Ask as a second control, with answers from the FAQs,
short answers and glossary, opened by "/" or ⌘K, plus deep links that jump to the question on the page.

**C. "Lineup and preview" (the winner).** Four sections and one button, the bar split in two, panels split by side, a
**live preview still** of the row under the pointer or focus (CAD renders and model hall crops already in
`assets/`), the located dot for "you are here" and "you are pointing at", the Stripe morph, a full-height phone sheet
with picture rows and unfolding sections, and a thumb dock. A and B were folded into it as described above.

## 4. What was built (desktop)

- **Bar, 56 px.** Logo | How it works · Where it helps ‖ Start small · About us | Ask `/` · Book a call. A blue dot
  marks the current section (`aria-current="true"` on its summary, so the mark is a shape and an attribute, not colour
  alone). A white pill glides between the section names under a mouse (nav.js; without JS it is a plain hover). The
  layout does not move when a panel opens.
- **Panels.** Each is a native `<details>` with a `<summary>`. It opens on click, tap or keyboard with JS off, and all
  its links are in the server HTML. Columns: hub link in display type with the closing line ("Not sure where to start?
  Plan your first bay.") | the groups | the **preview**: a 4:3 still with the label and line of the row in hand. It
  changes on pointer-over and on keyboard focus. With JS off it shows the first still. A row under the pointer or
  focus gets the located dot. The page behind dims to 14 % ink: a flat fill, not blur.
- **Motion.** First open: the panel reveals from the bar down by `clip-path` in 180 ms, and its three columns fade up
  6 px at 0, 20 and 40 ms (done by 200 ms). Moving to another panel morphs from the old panel's height (`--from`, set
  by nav.js, the same keyframe) in 180 ms. Close is instant. Preview stills cross-fade in 140 ms. Hover intent: 110 ms
  to open the first panel on a mouse, 0 ms to move along the bar, 240 ms grace to leave. A click pins a panel that
  hover opened. Touch and keyboard use click only. `prefers-reduced-motion` turns it all off (existing global rule).
  Frames: `shots/motion-d-open-*` and `motion-d-morph-*` at 0, 30 … 180 ms, with the animations paused and stepped.
- **Ask.** A summary in the bar with a `/` hint. Open it, or press `/` or ⌘K / Ctrl+K anywhere. The input takes focus,
  and the empty state is "Start from your job". Typing scores `assets/ask.json` (built by build.py from every public
  page: nav label + nav line + short answer or description, every FAQ question and answer on the site, every glossary
  term; 286 entries, 59 KB, fetched on first focus and cached). The best match **reads in place**: question, answer,
  source page. Four more follow, one line per question. FAQ links carry a text fragment (`#:~:text=`), so the page
  opens on the question. Down and Up move through the results, Enter opens the top one, and a polite status line
  announces the count. When nothing matches: "No page answers that yet. Book a call and ask the team." Tested on 30
  buyer questions (cost, Wi-Fi, battery, accuracy, steel racking, MCP, SAP, data residency, people tracking, omlox …):
  a sensible first answer for 27.
- **Prefetch.** A link in the bar, its panels or the sheet is prefetched when the pointer rests on it (M17).
- **Machines.** Same tree, same labels: one label per URL across header, sheet, footer and breadcrumbs (checked by
  script over `dist`). The only second form is the closing sentence "Plan your first bay." with its full stop, which
  predates this round. Visible breadcrumbs match BreadcrumbList on all 54 pages that have them. `data-nav-id` sits on
  every bar and panel link. Header, nav and footer text is chrome to the pickability extractor, so the answer scores
  did not move.

## 5. What was built (phone, ≤1023 px)

- **Bar, 52 px:** logo · Book a call · Menu.
- **Sheet:** full height, fixed. The bar stays on top (it switches to fixed with matching body padding, so nothing
  shifts), the page behind is `inert` and does not scroll. Order: an Ask field, the four sections as folds in display
  type (+ turns to ×), with your current section already unfolded, each holding its hub link, the group names and
  rows, a fifth fold "Start from your job", and the closing line. Groups whose every row has a still (The system, By
  problem, By industry, Your first steps) show 72 px picture rows. Pictures in closed folds are never fetched. While
  you type in Ask, the folds give way to the answers.
- **Dock:** once the first screen (or the homepage hero runway) is behind you, a 64 px bottom bar slides in: Menu ·
  Ask · Book a call, all in thumb reach. Menu turns to Close while the sheet is open. Ask opens the sheet with the field
  focused. Without JS the dock does not appear and the top Menu works on its own.
- Phone motion: the sheet fades up 6 px in 180 ms, and a fold's body in 160 ms (`shots/motion-p-open-*`).

## 6. Accessibility and no-JS

The disclosure pattern uses native details/summary. nav.js keeps `aria-expanded` on every panel summary and on the
dock Menu button. There is no `role="menu"`. Focus stays on the summary when a panel opens, and Tab goes into it.
Escape closes the panel and returns focus to its summary (or to the dock button). Focus leaving a desktop panel closes
it, and so does a click outside. Ask moves focus into its field on open (a search disclosure). Tap targets are 36 px in
the bar, 44 px in the sheet and 48 px in the dock. Focus rings are the system ring; the Ask field shows focus as its
2 px underline turning focus-blue. With JS off: every panel and the phone sheet open and close, all links work, and Ask
and the dock are hidden (`.no-js`), because the roles stay in the footer. Checked with a keyboard script
(`tools/keyboard.js`; Ask questions in `tools/asktest.js`, both against a server on :8141): Tab → Enter opens → Tab into the hub → Escape closes with focus back; ⌘K →
type → arrows → Escape. CLS while loading and opening two panels: 0.001.

## 7. Weight

| | Before | After |
|---|---|---|
| Nav CSS (minified, inlined) | ~3.6 KB | 10.7 KB, 2.9 KB gz |
| Nav JS | 0.9 KB inline on every page | 8.8 KB, 3.5 KB gz, external, deferred, cached once |
| Header HTML per page | ~10 KB | 26.8 KB, 5.4 KB gz (four panels, the sheet with the same tree, twelve role rows) |
| Whole /technology/ page, gz | 20.9 KB | 24.7 KB |
| Pictures | 0 | 13 WebP stills, 640×480, 7–14 KB each, lazy: only an open panel's stills load |
| ask.json | — | 59 KB, fetched only when Ask is focused |

CSS + JS comes to 6.4 KB gzipped (19.5 KB minified). That is over the ~12 KB brief if the brief means minified, and
inside it if it means transfer. The JS is shipped with comments and indentation stripped by build.py; nothing is
mangled. Next cut if needed: drop the SYN table and the glide (about 1 KB).

## 8. Checks

`python3 tools/pagegen/run.py && python3 build.py && python3 tools/pickability.py dist`: 56 pages. Crawler 746/770,
site files 7/8, unbranded 38/38, branded 9/10, canonical 48/48, barred claims 0. All identical to before this round
(the failures that remain predate it). One label per URL: clean, apart from the pre-existing closing sentence.
Breadcrumbs: 54/54 match JSON-LD. No console errors on desktop or phone.

## 9. Shots (`shots/`)

`d1440-closed`, `d1440-open-1…4` (each panel), `d1440-preview-hover` (Warehousing previewed), `d1440-ask-empty`,
`d1440-ask-answer`, `d1440-ask-answer-2`, `d1440-keyboard`, `d1440-nojs-open`, `home-1440-closed`,
`home-1024-closed`, `home-1024-open`, `home-390-closed`, `p390-closed`, `p390-open` (sheet, current section
unfolded), `p390-open-section` (all folded), `p390-dock`, `p390-ask`, `p390-nojs-open`, `motion-d-open-00…06`,
`motion-d-morph-00…06`, `motion-p-open-0…4`.

## 10. Open

- A tree test with the reader panel on the new group names ("For the technical review", "By problem") before launch.
- If render job R8 lands its camera-A crops, swap the hall stills in `tools/thumbs.py` and rerun it.
- The local bar (`.local`, inner pages) is unchanged. It still owns per-page sections.
