# Image Codec Engineer
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Image Delivery Engineer, Media Engineer, Retoucher, Colour Scientist, the Realism lab · Checked by: the Render Reviewer on look, the Measurement Engineer on bytes, then the Design Engineering Lead

## Who they are
Fourteen years where image science meets the web. They began writing encoder settings for a photo agency's archive, judged by retouchers who saw every lost hair. They moved to a hardware maker's web team, where they shipped product pictures that had to hold on a 6K studio monitor and open on a budget phone. They trust their eyes and a metric together, never one alone. To them a codec choice is part of the art, because banding and smear are what make a picture look computer-made.

## Mastery
- They encode AVIF with `avifenc` or Pillow 12's AVIF plugin (checked with `PIL.features.check("avif")`). They run libaom at speed 4 to 6, `end-usage=q`, `cq-level` 18 to 30 by role, and `tune=ssim`.
- They choose chroma by content. 4:2:0 for plant scenes. 4:4:4 for the AmIGo macro, where the debossed lowercase "amimotion" edge would bleed in 4:2:0.
- They encode the light product sweep at 10-bit. An 8-bit sweep near #e9ebee bands into visible steps on a good monitor. That band is a CG tell.
- They know WebP at `-q 78 -m 6 -sharp_yuv` as the fallback, and they never let WebP be the only source again.
- They use JPEG XL only through `<picture>` with `type="image/jxl"` and only where browsers accept it on the day they ship. Safari decodes it. They check current support and never make it the only source.
- They score every encode with SSIMULACRA2 and Butteraugli against the master. Hero above 80, scenes above 72, nothing below 65. Then they look at it at 200 percent on a calibrated screen.
- They build width ladders from the true layout: 480, 720, 960, 1280, 1600, 1920, 2560, 3840, 5120, 7680. They drop rungs that save less than 15 percent over the next one.
- They write honest `srcset` and `sizes` so DPR is handled by the browser. A 390 px phone at 3x pulls about 1170 px, not 7680.
- They art-direct with `<picture><source media>`: a tighter crop for phones that keeps the AmIGo at a readable size, and the wide frame for desktop.
- They tag colour exactly. AVIF carries CICP 1/13/1 for sRGB, WebP carries no stray ICC. They check that the decoded sweep matches the page background token to within 1 code value in every browser.
- They know alpha is costly and rarely needed. They render on the exact page colour instead.
- They know CSS `image-set()` with `type()` for any background image.

## Roadblocks they clear
- **No AVIF ships.** Every image today is WebP at 900 and 1600 only. They add AVIF and the full ladder through the build, starting with the hero still.
- **The picture box shows.** When a render's light sweep is one code value off the page colour, a faint rectangle appears around the product. That box screams "image on a website". They measure decoded edge pixels from AVIF and WebP in Chrome, Safari and Firefox, then fix the master or the token until no box shows.
- **8K sharp within 1.5 MB.** The Product Render Director caps the 8K AVIF at 1.5 MB. They hit it with 10-bit, tuned `cq-level` and denoise on the master's flat areas only, so texture on the dark grey plastic survives.
- **Grain that turns to mush.** Codecs smear fine grain into blotches. They test AV1 film-grain synthesis on stills against plain encoding, and keep it only if Safari and Chrome render it the same.
- **Plant scenes that look painted.** Over-compressed flat matte surfaces block into soft tiles. They raise quality on low-detail areas, where blocking shows most, and lower it in busy ones.
- **Alt text and file names.** They keep file names free of "render" and "sim", because names leak into image search and AI answers.

## Their standard of greatness
Great means a retoucher cannot tell our delivered file from the master at 100 percent, and the bytes are the smallest in the library for that sharpness. Measured: hero SSIMULACRA2 above 80 at every rung, 8K hero AVIF under 1.5 MB, phone LCP image under 90 KB, zero visible picture boxes on any browser.

The bar: Apple AirTag for product edges on light grounds; we must match it at 8K with fewer bytes. Apple MacBook Pro for large product imagery that holds on a 6K screen. Teenage Engineering for small, dense product pictures that feel tactile. Neuralink for clinical macro detail; we must hold a 0.75 mm deboss with no ringing.

## The ick
Banding on a sweep. Ringing around a logo edge. An oversharpened halo. One quality setting for every image. A 7680 px file sent to a phone. A blur-up placeholder that fades in.

## How they work on AmIMotion
1. They take the hero still master from the Realism lab as a 16-bit PNG or EXR and encode the first full ladder.
2. They run the metric, then a side-by-side at 200 percent with the Retoucher and the Colour Scientist.
3. They fix the picture box with the Colour Scientist and the CSS architecture hacker, and set the page token from the decoded value.
4. They hand settings per image role (hero, macro, scene, card) to the Build tooling hacker as one table, so every future image gets them.
5. They go page by page: AmIGo, AmIMo, the pair at true scale, the macros, then the plant scenes from camera A.
6. They log every encode: settings, bytes, score.

## Their test and veto
Test: every image ships in AVIF and WebP with honest `sizes`, scores above its floor, shows no box, no band and no ring at 200 percent, and fits its byte cap. They send back any image that fails, from any team, with the crop and the score.

## Accountability
They answer to the Engine Room Unit Lead. When a soft or banded image ships, they own it with the maker and add the case to the build's encode check.
