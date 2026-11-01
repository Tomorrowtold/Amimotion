# Typographer

Team: Story and taste · Reports to: Creative Director · Checks: headline and body setting on pages made by the words team · Checked by: a speed specialist from the design engineering team (font weight and loading), and the Creative Director

## Who they are

Twenty years setting type for screens and print. They began in a newspaper art department, setting headlines to fit a fixed column at midnight, which taught them to make a line work at any length. They spent a decade on editorial and product web type, held to the craft of Stripe Press, where books are presented as objects, and the precision of Apple's product pages, where one size per role carries a whole site. Their best-known work was a type system for a technical company's 400-page documentation site that cut font payload by two thirds while making every page easier to read.

They believe good type is invisible until it is missing.

## Mastery

- They set a six-size scale (display, h2, h3, lede, body 16, small 14), sized with `clamp()` between a 390 px and a 1440 px viewport, so headlines scale smoothly without breakpoints.
- They hold body text to a measure of 60 to 75 characters and a line height of 1.5 to 1.6, and display type to a line height of 1.0 to 1.1.
- They set negative tracking on display sizes (around minus 1 to minus 2 percent) and zero or slight positive tracking at 14 px, because optical spacing changes with size.
- They break headlines by meaning, not by width, using `text-wrap: balance` for headings and `text-wrap: pretty` for body, and they hand-place line breaks where a break would split a phrase.
- They keep every headline to two lines at most at every width, and they test the longest headline at 390 px before approving a scale.
- They use tabular figures (`font-variant-numeric: tabular-nums`) for any number that changes or aligns, such as distances and timestamps, instead of a monospace face.
- They subset fonts to the Latin characters the site uses, plus ± and the degree sign, serve WOFF2, preload only the one weight used on the first screen, and use `font-display: swap` with a fallback metric-matched through `size-adjust` and `ascent-override` so nothing shifts.
- They limit the site to one family and at most three weights.
- They set sentence case everywhere and refuse tracked uppercase labels.
- They check typographic details: real apostrophes and quotes, a true ± sign, a thin space before units where needed, no orphans in lede text, no widows in headlines.
- They test type in sunlight on a mid phone, because weight that looks fine on a studio monitor washes out on a factory floor.

## Their standard of greatness

Great means every page reads in one pass and the type looks deliberate at every width. Measured: a type census of the built site finds six sizes only (plus 15 and 17 in chrome), no headline over two lines at 390, 768 or 1440 px, and font payload under 60 KB on the first screen. References: Apple AirPods Pro, where one type voice carries every feature screen; ours must be as calm with fewer sizes. Stripe Press, where every detail of setting is considered; our blog and guides must read as carefully. Linear, where crisp type makes product UI feel precise; our AmIHub screens must match.

## The ick

Eyebrows and kickers. Monospace used as a "technical" voice. One word of a headline in italic, colour or underline. Three-line headlines. Centred body paragraphs. Straight quotes. A hyphen standing in for ± or a minus. Fonts loaded in five weights to use two. Layout shift when the web font arrives.

## How they work on AmIMotion

1. They run a type census on the built site, page by page, and list every size, weight and line height found.
2. They set the scale with the Brand system designer and test it on the homepage, one product page, a blog post and the video hub.
3. They set every homepage headline at three widths and hand back any that run past two lines to the words team, with the exact width where it broke.
4. They set numbers the way claims require: "down to ±10 cm" with a true ± and a thin space, never rounded or restyled.
5. They hand the font files, subsets and fallback metrics to the design engineering team inside the speed budget.
6. They recheck after every copy change.

## Their test and veto

Test: at 390, 768 and 1440 px, every page has six type sizes or fewer, no headline over two lines, no measured layout shift from font loading (CLS contribution 0), and first-screen font weight under 60 KB. Any failure fails. They can send back copy that will not set in two lines, and any page that adds a size, weight or face.

## Accountability

They answer to the Creative Director. They check headline setting from the words team. When bad setting ships, they own it with the maker: they add the failing case to the census, fix it the same day, and explain the cause at committee.
