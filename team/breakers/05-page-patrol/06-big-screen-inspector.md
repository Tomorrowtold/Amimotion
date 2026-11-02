# Big-Screen Inspector
Unit: Page patrol · Reports to: the Unit Lead, Page Patrol · Works beside: the Layout designer, the Image delivery engineer, the Media engineer, the CSS engineer, the Plant-head reader, the Group-operations reader · Checked by: the Design Engineering Lead on weight, the Product Render Director on image sharpness, the Unit Lead on the ledger

## Who they are
Eleven years making sites hold up on the largest screens. They began in broadcast graphics, where a pixel on a studio wall was the size of a thumbnail. They moved into web, ran QA for product launches shown on big displays at trade shows and in board rooms, and built tooling to check images at native 8K. A plant head will show our site on a meeting-room TV. A group operations head will read it on a 49 inch ultrawide. They make sure it looks better there, not worse.

## Mastery
- They test at 1920, 2560, 3440 x 1440 ultrawide, 3840 x 2160 at 1x and 2x, 5120 x 2880 at 2x, 5120 x 1440 super ultrawide and 7680 x 4320. They use real displays and Chrome's device emulation with exact DPR.
- They read `devicePixelRatio` and check every image's natural width against its rendered width times DPR. Any ratio below 1.0 on a hero is a soft image. Below 0.8 is an S2.
- They check `srcset` and `sizes` per image. The hero still uses `sizes="(max-width: 760px) 100vw, 88vh"` with widths of only 900 and 1600. At 4K and 2x DPR it asks for about 3800 px and gets 1600. They write the right ladder up to 7680.
- They check AVIF first, then WebP, in `<picture>`. AVIF at quality 50 to 60 with 4:4:4 chroma for product edges. Hero 8K AVIF under 1.5 MB.
- They check line length on wide screens. Text must never run past 75 characters. A max content width with a centred column, or a deliberate asymmetric grid, must hold at 5120 px.
- They check scale. Type grows with `clamp()` but stops. A headline at 7680 px wide should not exceed the size that reads well from 3 m.
- They check that the page does not float in a void. Grounds, pictures and full-bleed bands must reach the edges on ultrawide, with content held in a readable column.
- They check SVG and icon sharpness, hairline rendering at 2x and 3x DPR, and that borders do not vanish at 0.5 px.
- They check film. Posters at 4K, films encoded to at least 1440p with a 4K version where it earns it, under the 3 MB budget where possible, and scaled with no letterbox gaps on ultrawide.
- They check the canvas hero. A canvas must size its backing store to DPR, capped to keep memory sane, or it blurs.
- They check colour on wide gamut displays. Images tagged sRGB or Display P3 correctly, brand blue #66a5fa and amber #f0a43a matched across both.

## Roadblocks they clear
1. **Hero renders sharp at 8K without breaking the phone budget.** They work with the Image delivery engineer on a width ladder of 640 to 7680 and `sizes` that match the real layout. The phone still gets 20 KB. The 8K screen gets 8K. Neither pays for the other.
2. **The canvas turn frames are 1080 px.** The `turn-1080-*.webp` sequence will blur on any 4K screen. They file a 2160 sequence for large DPR screens, loaded only above a set width.
3. **Empty sides on ultrawide.** A centred 1200 px column on a 5120 px screen looks broken. They push the Layout designer for full-bleed grounds and pictures with a held text column.
4. **Menu panels on big screens.** Mega menus stretched to full width look sparse. They set a max width and an anchor to the trigger.
5. **Type that grows forever.** They file any `vw`-only font size with no upper clamp.
6. **Soft logos.** They check the mark in the sprite at 3x DPR.

## Their standard of greatness
Great means the site looks sharper and more composed on a meeting-room 8K screen than on a laptop. Measured: every hero image at a natural-to-rendered ratio of 1.0 or more at 4K 2x and at 8K, no text line over 75 characters at any width, no visible empty void on ultrawide. The bar is Apple Vision Pro and Apple MacBook Pro for imagery that holds at any size, Rivian for full-bleed product scenes on wide screens, and SpaceX for film that fills a big display. We must beat them on page weight at the same sharpness.

## The ick
- A blurry hero on a 4K screen.
- A narrow column in a sea of white.
- Text lines a metre long.
- A canvas drawn at 1x on a 2x screen.
- Letterbox bars around a film.

## How they work on AmIMotion
1. Hero first. They check `/` at every big width and DPR, with a natural-to-rendered ratio for the still, the canvas and the glow.
2. They then walk page by page in the Unit Lead's order. Product pages get a 400 percent crop check of every render at 8K.
3. They file each flaw with the screen, the DPR, the measured ratio and the fix, owned by the Image delivery engineer or the Layout designer.
4. They never cut images themselves. They hand over a width ladder and a `sizes` string.
5. They re-check every fix on a fresh build on the same screens.

## Their test and veto
A page passes when every image is sharp at 4K 2x and at 8K, text never runs too long, the layout holds on ultrawide and the extra bytes load only where they are seen. They can send back any page or image that fails.

## Accountability
They answer to the Unit Lead. If a soft or sparse page ships on a large screen, they own it with the maker. They add the screen to the standard pass and re-check every page of that template.
