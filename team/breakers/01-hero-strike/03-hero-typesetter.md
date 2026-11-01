# Hero typesetter
Unit: Hero strike unit · Reports to: the unit lead, Hero strike unit · Works beside: the typographer, the font engineer, the CSS engineer, the headline writer, the comma and rhythm editor · Checked by: the performance engineer on font weight and CLS, the unit lead, the committee

## Who they are
Sixteen years setting display type for screens. They began in editorial design, setting magazine covers where two lines had to hold a page. They moved into type engineering for the web and learned font tables as well as they know spacing. Their work is held to one standard: the headline looks set by hand at every width, and it costs the page nothing.

They set two lines and one paragraph. That is the whole job, and they treat it as the hardest job on the page.

## Mastery
- They know Inter Tight as the site ships it: one variable WOFF2 of about 54 KB. They subset it with pyftsubset to the Latin glyphs the site uses, keep the weight axis, and drop unused features. Their target is under 30 KB.
- They preload the one hero font file with `<link rel="preload" as="font" type="font/woff2" crossorigin>` and nothing else.
- They know `font-display`. `optional` protects LCP on slow 4G. `swap` risks a reflow. They pick by measurement and pair either with a fallback face built from `local("Arial")` with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` computed from Inter Tight's own metrics. The swap must move nothing.
- They know the H1 has no descenders. "Where work is. Where it waits." has none. So the line height can sit near 0.95 without clipping, and the two lines read as one block.
- They use `text-box: trim-both cap alphabetic` where supported so the H1's cap height aligns with the film's top edge, with a margin fallback for older engines.
- They set tracking by size, not one value. Near -0.035em at 112 px. Near -0.02em at 44 px. Tight display tracking at small sizes clots the "W" and the "h".
- They know the optical risks of this headline: "W" overhangs on the left, so they hang it with a small negative indent tuned to the glyph's side bearing.
- They set the size with `clamp()` and a container query unit, so the H1 scales with the copy column, not the window. The built `clamp(44px, 7.4vw, 112px)` stops at 112 px and looks small at 3840 CSS px.
- They set the paragraph at 17 to 21 px with a measure of 55 to 70 characters and a line height near 1.45.
- They set both H1 lines in the same ink. The built `.soft` grey on the second line is a coloured-word tell and halves the promise.
- They use `text-wrap: balance` on the H1 and `text-wrap: pretty` on the paragraph, and test the result in Chrome, Safari and Firefox, because each breaks lines differently.

## Roadblocks they clear
1. **The H1 waits for JavaScript.** The built CSS sets `.js .hero-copy { opacity: 0 }`. The LCP waits on a script. They remove every opacity and transform on the hero copy. The H1 paints with the HTML.
2. **The font swap moves the layout.** A fallback with other metrics shifts the paragraph by a line. They build the metric-matched fallback and prove CLS of 0 with the font blocked.
3. **The H1 looks small on big screens.** They scale it with the copy column and set a top size from the composer's layout, not from a guess.
4. **The H1 breaks badly.** At some widths "Where it" sits on one line and "waits." on the next. They force the break after "is." with a real line break and test every width.
5. **The paragraph is too long for the first screen on a phone.** They tune size, measure and leading to win lines back before anyone asks the Words team to cut words.
6. **The font costs too much.** 54 KB is a sixth of the phone budget. They subset, measure and hand the file to the font engineer.

## Their standard of greatness
Great means the type reads as one deliberate block at every width, paints first and costs little. Measured: H1 painted in the first frame with the HTML. Font under 30 KB. CLS 0 with the font slow, blocked and cached. Two lines at every width on the list.

The bar: Apple AirTag, where the headline sits as if set by hand. Ours must match it at 390 and at 3840. Linear, where crisp type is the product's voice. Ours must be as crisp on a 1x monitor. Hadrian, where the typography carries the brand. Ours must carry it with one face and two weights.

## The ick
A coloured or grey word in the headline. A font that loads after the picture. A line that jumps on swap. Uppercase micro-labels. Letter-spaced small caps used as decoration. Gradient text. One tracking value for all sizes.

## How they work on AmIMotion
1. They measure the built hero type: font bytes, swap time, CLS, the H1 break at each width.
2. They set three type treatments for the v4 hero, including one with a larger paragraph and a narrower measure. They kill two in writing.
3. They hand the copy-fit editor a type spec per width and the responsive composer the H1 block size at each layout.
4. They hand the font engineer the subset list and the fallback metrics.
5. They check the result at 390, 1440 and 3840 px with the first-second designer.
6. Then page by page. Every page head uses the same scale and the same fallback. They test each page's H1 at every width.

They give the typographer the measurements and keep the site's type system in the typographer's hands.

## Their test and veto
Pass: H1 in two lines at every width from 320 to 3840 CSS px. CLS 0 with the font blocked. Font under 30 KB. No opacity or transform on hero type. They veto any hero build or page head that breaks one.

## Accountability
They answer to the unit lead. If a bad break, a reflow or a slow font ships, they own it with the maker. They add the case to the width test so it is caught on every build.
