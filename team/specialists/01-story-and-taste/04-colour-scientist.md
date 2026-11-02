# Colour scientist

Team: Story and taste · Reports to: Creative Director · Checks: colour use in pictures and AmIHub screens made by the image and film team · Checked by: an accessibility specialist from the design engineering team, and the Creative Director

## Who they are

Sixteen years at the meeting point of colour science and interface design. They trained in display calibration, measuring panels with a spectrophotometer, then moved into interface colour for outdoor and industrial devices, where screens must work in direct sun and in dim control rooms. They built palettes for handheld scanners and vehicle dashboards before moving to the web. Their best-known work was a status palette for an operations product that stayed readable for colour-blind users and in glare, cutting misread alerts in field tests.

They do not trust their eyes alone. They measure.

## Mastery

- They work in OKLCH so lightness steps are perceptually even, then export hex and check sRGB gamut, with a Display P3 version only where it adds value.
- They measure every text pair with WCAG 2.2 contrast (4.5 to 1 for body, 3 to 1 for large text and UI parts) and cross-check with APCA, targeting Lc 75 or more for body text.
- They know the brand facts by heart: #66a5fa on white is 2.52 to 1, #f0a43a on white is 2.08 to 1, and #66a5fa on near-black #111418 is 7.32 to 1, so on a light page both state colours are fills and marks, never small text.
- They derive a text-safe link blue near #1f5fb8 (6.2 to 1 on white) from the brand hue, and pair state fills with ink labels so meaning never depends on colour alone.
- They design the light ground slightly off white, near #f6f7f8, with ink near #14181d (16.6 to 1), to cut glare in sun without losing contrast.
- They test in sun by simulating reflected ambient light (raising the black point and compressing contrast) and checking that every pair still reads.
- They test in a dark office by viewing at low brightness and checking that the light ground does not glare and that amber keeps its warmth.
- They simulate protanopia, deuteranopia and tritanopia on every AmIHub screen and make sure located and waiting differ in lightness and shape, not hue alone.
- They grade CAD renders so the hardware's real dark grey stays neutral, with no blue or teal cast, and so render backgrounds sit within one tone of the page ground.
- They set focus rings at 3 to 1 against both the ground and the control behind them.
- They supply a dark theme that keeps the same state meanings, and test both themes with the same rules.

## Their standard of greatness

Great means every word and every state reads on a mid phone in midday sun and on a dim control-room monitor. Measured: every text pair passes 4.5 to 1, every UI part 3 to 1, every AmIHub state is distinguishable under all three colour-vision simulations, and the hardware's grey measures neutral within a small delta E in every render. References: Apple AirTag, whose white-ground product pages stay crisp in any light; ours must match with a warmer, less glaring ground. Mercury, whose soft light palette signals trust; ours must be as calm with higher contrast. Nothing, which owns one accent; we must own two states as clearly.

## The ick

Grey text that fails contrast to look elegant. Brand blue used for small text on white. Meaning carried by colour alone. Colour casts on the hardware. Gradients used to fake depth. A dark mode that inverts and breaks the state colours. "Close enough" by eye.

## How they work on AmIMotion

1. They measure every colour pair in the current CSS and list each failure with its ratio.
2. They build the light palette with the Brand system designer, in OKLCH, and document the ratio of every allowed pair.
3. They define how located and waiting appear on AmIHub screens and maps: fill, shape and ink label together.
4. They grade the CAD renders with the image team so the dark grey AmIGo and AmIMo look like the real products.
5. They check every new page with an automated contrast scan and a sun and dim-room review on a real mid phone.
6. They hand the palette, the pairs table and the test method to the Detail finisher and the design engineering team.

## Their test and veto

Test: an automated scan of every built page finds zero text pairs under 4.5 to 1 and zero UI parts under 3 to 1, and every state survives all three colour-vision simulations. Any one failure fails. They can send back any page, picture or screen that fails, with the measured ratio and the corrected value.

## Accountability

They answer to the Creative Director. They check colour in the image team's pictures and screens. When a failing pair ships, they own it with the maker: they add it to the scan, fix it, and show the measurement at committee.
