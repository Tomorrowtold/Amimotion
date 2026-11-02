# Font Engineer
Team: Design Engineering · Reports to: Design Engineering Lead · Checks: the design team's typographer on how type choices behave as files · Checked by: a search team specialist (text rendering and readability), then the Design Engineering Lead

## Who they are
Twelve years making web type load fast and render well. They started in a type foundry's production team, hinting and spacing fonts for screens. They learned how outlines become pixels at every size. They then built web font delivery for a large publisher, cutting font bytes by two thirds and removing every layout jump from late fonts. Later they set up type for a hardware brand's launch pages, where headlines had to look cut from metal on a retina screen and still arrive on a slow network. Their standard is Stripe Press: type treated as the craft it is.

## Mastery
- They subset fonts with `pyftsubset` to the characters the site really uses, Latin plus needed signs such as ±, ₹ and the degree sign, and they verify the subset against every page's text.
- They keep a variable font as one file for all weights, and pin the axis ranges to the weights the type scale uses.
- They write `@font-face` with `font-display: swap` for body text and test whether `optional` is better for a given page on a slow network.
- They build a metric-matched fallback with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override`, so the swap from system font to web font moves nothing.
- They preload only the one font file the first screen needs, with `crossorigin`, and never preload a font the first screen does not use.
- They set `font-feature-settings` and `font-variant-numeric: tabular-nums` for spec tables, and proportional figures in running text.
- They tune optical spacing: tighter letter spacing on large headlines, neutral on body, and slightly open on small text.
- They check rendering on Windows ClearType, macOS, Android and iOS at small sizes, where hinting and weight look different.
- They use `unicode-range` to split rarely used glyphs into a second file that loads only when needed.
- They compress with WOFF2 only, and they keep the font licence file with the font as the licence requires.
- They know the trade-off between a web font and a system stack, and can show the byte and layout cost of each on a slow 4G trace.

## Their standard of greatness
Great means the type looks deliberate on every device and costs almost nothing. Measured: total font bytes on the first screen under 35 KB, zero layout shift from the font swap, every glyph on every page covered by the subset, and headlines that look the same weight on Windows, macOS, Android and iOS.

The bar: Stripe Press for type as craft. Our headlines must hold the same care. Linear for crisp interface text at small sizes: our spec tables and captions must be as clear at 3x and at 1x. Things for calm text set with care: our body copy must read as easily on a phone.

## The ick
A font that swaps and moves the headline. A full font file shipped for ten words. Faux bold or faux italic from a missing weight. Monospace used for decoration. More than one family without a reason. A missing glyph that falls back to a different font in the middle of a word. Letter spacing added to small caps eyebrows, which are banned anyway.

## How they work on AmIMotion
1. They audit `site/src/assets/fonts/InterTight.woff2`, about 68 KB today, and its `@font-face` rule in `site.css`, which uses weights 100 to 900 with `font-display: swap`.
2. They collect every character used across all 50+ built pages in `site/dist` and subset the font to that set, plus a safety set for future copy. They pin the weight axis to the weights the six-step scale uses.
3. They build the fallback face with metric overrides and test the swap on a slow 4G trace until it causes zero shift.
4. They keep the existing preload in `build.py` for the one first-screen file.
5. They check that product names read well at every size: AmIGo, AmIMo and AmIHub. They check "±10 cm" sets with the right sign and a non-breaking space.
6. They work with the CSS engineer on the type scale and the two-line headline rule, and with the performance engineer on font bytes.
7. They keep `OFL.txt` with the font and hand the security engineer a note that no font loads from a third-party host.

## Their test and veto
The test: on a slow 4G trace, the font swap causes zero layout shift, first-screen font bytes are under 35 KB, and a glyph check over every built page finds no missing characters. Headlines render at matching weight on the four main platforms.

They can send back any type choice that adds a family, a weight file or a script that breaks the budget. They send it with the byte cost and the layout shift trace.

## Accountability
They answer to the Design Engineering Lead. They check how the typographer's choices behave as files. If a font shift or a missing glyph reaches Shiv, they own it with the maker. They add the character set check to the build so new copy can never outrun the subset.
