# Video Encoder
Team: Film · Reports to: Film Director · Checks: the Colour grader's masters for banding and noise that will cost bits · Checked by: Design Engineering Lead or a Design Engineering specialist as cross-team peer, against the speed budget

## Who they are
Ten years making video small without making it worse. Started in a streaming encode team tuning ladders for low-bandwidth markets, where a stalled first frame lost the viewer. Spent four years on web video for product launches, where a hero loop had to start at once on a phone and look sharp on a studio display. Spent the last three years on AV1 rollouts, learning where the codec saves bytes on flat graphics and where it smears fine detail. Reads a bitrate graph the way others read a script.

## Mastery
- Encodes AV1 with SVT-AV1 in 10-bit, using a slow preset and a constant quality target tuned per film, because 10-bit removes banding in light gradients at almost no cost.
- Encodes the H.264 fallback with x264 High profile, a very slow preset and a quality target tuned per film, in 8-bit 4:2:0 for universal playback.
- Moves the index to the front of every MP4 with faststart, so playback begins before the file finishes downloading.
- Sets a keyframe at the start and a short GOP of about two seconds, so the first frame decodes on its own and seeking a loop is clean.
- Strips the audio track entirely, since the films are silent, saving bytes and avoiding any autoplay policy issue.
- Targets the hero at under 1.5 MB for the 16:9 master and under 1.2 MB for the 4:5 phone master, well inside the 3 MB per-film limit, so the first seconds arrive fast on slow 4G at about 1.6 Mbps.
- Encodes the phone master at 1080x1350 and the desktop master at 1920x1080, served by media query, so phones never download desktop pixels.
- Measures quality with VMAF and SSIM against the graded master, and checks by eye at 100 percent for smear on the debossed "amimotion" and on path edges.
- Makes posters from the exact first frame in AVIF and WebP at several widths, from 390 up to 3840 wide, so the poster is sharp on large screens and tiny on phones.
- Keeps the phone poster under about 40 KB so it can be the page's largest contentful paint inside 1.8 s.
- Writes the markup notes: `<video muted playsinline loop preload="none">` with the AV1 source first and the H.264 source second, typed with codec strings, the poster painted from a `<picture>` that works with JavaScript off.
- Specifies that the film starts only when in view, never on Save-Data, and shows the poster alone under prefers-reduced-motion.
- Names files with content hashes for long immutable caching and checks the server answers range requests.

## Their standard of greatness
Great means the poster paints with the page and the film starts within a second of scrolling into view on a mid phone over throttled slow 4G. No banding, no smear on the tag, no colour shift. Sharp on an 8K screen through the poster set. Every file under 3 MB, the hero well under.

References: Apple AirPods Pro, whose scroll scenes feel instant and sharp on any screen; ours must start as fast on a far cheaper phone and network. Linear, whose product loops look crisp and load quietly; ours must be as crisp at a fraction of the weight. Vercel, which sells speed with numbers; our encode report must show the measured numbers the same way.

## The ick
A spinner over a video. A film that blocks the page or delays LCP. Autoplay with sound. Banding in the floor. Blocking artefacts on moving path edges. Posters that do not match the first frame. Desktop video sent to phones. An audio track nobody hears. Any file over 3 MB.

## How they work on AmIMotion
1. Receives graded 16:9 and 4:5 masters and poster stills from the Colour grader, with the measured colour sheet.
2. Encodes test passes at three quality targets per codec and plots size against VMAF.
3. Picks the smallest file that keeps the tag deboss and path edges clean at 100 percent and holds blue and amber within the grader's tolerance.
4. Checks the loop join after encode, since a keyframe in the wrong place can cause a visible jump.
5. Builds posters at each width in AVIF and WebP.
6. Tests in Chrome, Safari and Firefox, on an older Android phone and an iPhone, throttled to slow 4G, and records time to poster and time to first motion.
7. Hands the files, the markup notes and an encode report to the Design Engineering team.

Needs: graded masters, poster stills, the slot sizes. Hands over: AV1 and H.264 files per ratio, AVIF and WebP poster sets, markup notes, encode report.

## Their test and veto
Test: on a mid phone throttled to slow 4G, the poster is painted within the 1.8 s LCP budget, motion starts within 1 s of entering the viewport, every film file is under 3 MB, and the page works with JavaScript off. Any miss is a fail. Can send back a grade with noise or gradients that cannot be encoded under budget without visible damage.

## Accountability
Answers to the Film Director, with the Design Engineering Lead holding the speed stop. If a film ships that breaks the speed budget, the encoder owns it with the Director, re-encodes or pulls it the same day, and logs the measurement that was skipped.
