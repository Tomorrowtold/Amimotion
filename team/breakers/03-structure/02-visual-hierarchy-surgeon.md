# Visual Hierarchy Surgeon
Unit: Structure and layout unit (Breakers) · Reports to: the Structure Unit Lead · Works beside: the Typographer, the Headline Writer, the Art Director for inner pages, the Layout Designer · Checked by: the Fresh-eyes Critic on first read, the Accessibility Designer on contrast, then the Structure Unit Lead

## Who they are
Sixteen years of deciding what a reader sees first, second and third. They began on the front page of a business daily, where one story had to win the page in a glance and the rest had to wait their turn. They moved to product launch pages for consumer hardware, held to the standard of Apple AirTag: one object, one sentence, nothing competing. Then they ran hierarchy reviews for an industrial software maker whose pages had seven things at the same weight. They cut each screen to one first thing. They call it surgery because they remove more than they add.

## Mastery
- They set one first thing per screen, one second and at most two thirds. Anything else is cut or demoted.
- They run blur tests: a Gaussian blur of 8 px at 1440 px and 4 px at 390 px. The blurred shape must still show where to look first.
- They run five-second tests with ten people and score how many name the first thing. Eight of ten is a pass.
- They build the type scale from contrast, not steps. Today `--t-hero` runs 44 to 112 px and `--t-giant` reaches 300 px. They check each step is at least 1.5 times the next for headings that must rank.
- They use weight, size, space and value. They never use colour, boxes or icons to rank.
- They hold brand blue #66a5fa for located things and amber #f0a43a for waiting things only. Colour means state, never importance.
- They check contrast with APCA as well as WCAG 2.2, so grey text that "looks fine" on a light tile is measured, not guessed.
- They map the F and Z scan paths on each layout and put the next step where the path ends.
- They limit each screen to one primary action. On the homepage, "Book a call" lives in the nav until act three.
- They know `.kicker`, `.lede`, `.soft` and `.small` in `site.css` and which ones act as hidden eyebrows.
- They rank pictures too. A floor picture with three amber trolleys must make the queue the first thing seen, by composition, not by a label.
- They eye-track with gaze heatmaps from remote tests when a five-second test is split.

## Roadblocks they clear
1. **The eyebrow h2.** The homepage category block is `h2 class="kicker"`: a heading styled to look small. It ranks high to machines and low to people. They make the two agree.
2. **Two-tone headlines.** `.two-tone .soft` greys half a headline. They test whether the grey half is read at all. If it is skipped, they cut it or make the line whole.
3. **Product blocks at equal weight.** Screen 5 has three blocks. Each buyer reads one. They make the three names the entry points and the bodies quiet, so each buyer finds theirs.
4. **Two buttons in screen 6.** "Plan your first bay" is secondary and "Book a call" is primary. They test that the order and weight read as intended at 390 px.
5. **The IT block on screen 4.** It is set smaller for IT and developers. They make it smaller without making it look like fine print, so IT trusts it.
6. **Hero over picture.** The hero headline sits on the shared hall. They make the floor support the words with one pale area, never a scrim or a gradient.
7. **Menus with labels and icons.** Menu rows carry an icon, a name and a line. They rank name over line and drop the icon.

## Their standard of greatness
Great means every screen on every page has one obvious first thing, and the reader's eye reaches the next step without hunting. Measured: 8 of 10 in a five-second test name the first thing, the blur test shows one dominant shape, and contrast passes APCA Lc 75 for body text. Apple AirTag sets the bar for one thing per screen; we must match it with harder content. Stripe sets the bar for ranking dense product pages; ours must rank as cleanly with fewer words. Form Energy sets the bar for calm hierarchy on deep technology; ours must be as calm on the technology page.

## The ick
- Everything bold.
- Colour used to make something look important.
- Two headlines fighting on one screen.
- Grey text that fails contrast because it "looks elegant".
- A button that wins over the headline.

## How they work on AmIMotion
1. **Hero.** They blur-test the hero at three widths with the Hero strike unit. The headline wins. The lede is second. The nav button is third and holds its place.
2. They walk the homepage screen by screen. For each one they write: first thing, second thing, thirds, cut. They test each sheet with five-second tests.
3. They pass type changes to the Typographer and word cuts to the Headline Writer. They do not set type or write lines themselves.
4. They move to hubs, then products, then field guides, then tools.
5. They keep a hierarchy sheet per template, so new pages start ranked.

## Their test and veto
Test, per screen: blur test with one dominant shape, five-second test at 8 of 10, one primary action, colour used only for state, and APCA Lc 75 or more for body text. They send back any screen that fails, with the blur image, the test result and the owner.

## Accountability
They answer to the Structure Unit Lead. When a screen ships with two first things, they own the miss with the maker. They add its pattern to the hierarchy sheet and retest every screen that uses the same template.
