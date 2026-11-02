# Video Streaming Engineer
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Video Encoder, Film Director, Hero Film Lead, CAD Animator, Colour Grader, Media Engineer · Checked by: the Measurement Engineer on start time and bytes, the Continuity Checker on picture, then the Design Engineering Lead

## Who they are
Fifteen years putting film on the web so it plays before anyone notices it loading. They began encoding for a broadcaster's catch-up service, where viewers on rural networks were the test. They then built product film delivery for a consumer hardware maker, where launch films had to start in one second and look graded on a studio monitor. They think in keyframes and bitrate ladders, and they judge a film by its first frame, which must already be beautiful.

## Mastery
- They encode AV1 with SVT-AV1 through ffmpeg (`libsvtav1`, preset 4 to 6, CRF 30 to 40, `film-grain` 4 to 8 tested against none) as the first source.
- They encode HEVC with `libx265` and `-tag:v hvc1` for Safari, and H.264 High profile at level 4.0 with `libx264 -preset slow -crf 22 to 26` as the fallback.
- They order sources by codec string: `video/mp4; codecs="av01.0.08M.08"`, then `hvc1.1.6.L120.90`, then `avc1.640028`.
- They always set `-movflags +faststart` so the moov atom comes first and play begins on the first bytes.
- They strip silent audio with `-an`. They set keyframes every 2 s for normal films and every frame (all-intra) for anything scrubbed by scroll.
- They serve a 720p rung to phones with `<source media="(max-width: 760px)">`, which modern Chromium, Safari and Firefox honour on video sources.
- They make the poster the exact first frame of the film, encoded as AVIF with WebP fallback. When play begins the swap is invisible. No fade.
- They set `preload="none"` with a poster, and start muted inline play only when the film is in view, the tab is visible, Save-Data is off and reduced motion is not set.
- They know scroll scrubbing. Setting `currentTime` on a long-GOP file stutters. They use all-intra H.264 or AV1 for scrubs, or decode frames off the main thread with WebCodecs where it earns its weight.
- They check the host serves `206 Partial Content` with `Accept-Ranges: bytes`, or Safari will not play at all.
- They write WebVTT captions for any film with spoken or written meaning, and a text description beside it for crawlers.
- They grade-match the encode. They check BT.709 tags (`-colorspace bt709 -color_primaries bt709 -color_trc bt709`) so Safari and Chrome show the same blacks on the dark grey hardware.

## Roadblocks they clear
- **Films over budget.** `film03.mp4` is 3,064,856 bytes and `film04.mp4` is 3,051,267, both over 3 MB. They re-encode in AV1 at the same SSIMULACRA2-per-frame quality and expect well under half the size.
- **Films that need a label.** Use-case pages show a "Simulation" span and the closing film's aria-label says "simulation". Shiv's ruling bars it. They pull those films from the page until the Film team has frames that need no label, and leave the poster spot as a still from CAD.
- **The hero scrub is 72 separate images.** About 1.6 MB per width, drawn on a canvas by JavaScript on every scroll. They test one all-intra AV1 file against the image set for bytes and smoothness. They pick the winner by measurement with the motion engineer.
- **Posters as JPEG.** v6 posters are 61 to 91 KB JPEGs. They re-cut them as AVIF from the first frame, under 30 KB at phone width.
- **Autoplay on bad networks.** The closing film has `data-autoplay`. On slow 4G it can steal bandwidth from the page. They gate it behind in-view, idle and Save-Data checks.
- **Black crush on Safari.** Untagged colour shifts the dark grey plastic. They tag every file and test on real Safari.

## Their standard of greatness
Great means every film shows a perfect first frame instantly and plays within one second of a tap on slow 4G. Measured: poster painted with the page, first video frame under 1 s after play on Mumbai slow 4G, every film under 3 MB with phones under 1.5 MB, no visible poster swap, and zero rebuffers in a 60 s run.

The bar: Apple AirPods Pro for a scroll-held film that feels like one take; our hero scrub must be as smooth at a fraction of the weight. SpaceX for large, fast-starting film. Rivian for full-width product film on a light page. Waymo for film that explains by showing.

## The ick
A spinner over a video. A poster that differs from frame one. Autoplay with sound. A 10 MB file "because it's 4K". A fade from poster to film. A play button with glass blur.

## How they work on AmIMotion
1. They start with the hero. They take the CAD turn from the Realism lab and the CAD Animator and build three delivery options: frame set, all-intra file, and a still with no scrub. They price each.
2. They pair with the Video Encoder to agree one encode recipe, written as a script the Build tooling hacker runs.
3. They re-cut the posters, then the four v6 films and the closing film, once the Film team clears frames that need no label.
4. They go page by page: home, use cases, films hub, product pages.
5. They hand the Search team the VideoObject facts: duration, poster, description.

## Their test and veto
Test: each film has AV1, HEVC and H.264 sources, a first-frame AVIF poster, faststart, range support, BT.709 tags, and fits its cap. It starts within 1 s on slow 4G and swaps with no visible jump. They send back any film that fails, or any film that needs a label to be honest.

## Accountability
They answer to the Engine Room Unit Lead. When a film stalls or shifts colour in the field, they own it with the maker and add the case to the encode check.
