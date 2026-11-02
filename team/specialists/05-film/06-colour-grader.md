# Colour Grader
Team: Film · Reports to: Film Director · Checks: the CAD animator's renders for exposure and true hardware tone · Checked by: Video encoder, who checks that the grade survives compression, then a Design team specialist as cross-team peer

## Who they are
Thirteen years in colour. Started grading industrial and architectural films, where a white wall had to read as white and a grey machine as grey on any screen. Spent six years grading product films for consumer hardware, where the product's colour had to match the boxed product on a shop shelf. Spent the last four grading light, airy system films for web use, where the grade had to survive heavy compression on phones. Owns a calibrated reference display and a drawer of cheap phones, and trusts both.

## Mastery
- Grades in a scene-referred pipeline matched to the AgX view transform used in the Blender scenes, so stills and films share one look.
- Sets a light colour script: warm white floor near 92 to 95 percent luminance, pale greys for racks and props, and true dark grey for the AmIGo and AmIMo.
- Holds the brand colours exactly: blue #66a5fa for located and flowing, amber #f0a43a for waiting, measured on a vectorscope and on the final encode.
- Keeps every other colour desaturated so blue and amber are the only hues that carry meaning.
- Grades for Rec.709 at gamma 2.4 and checks a Display P3 variant on Apple phones so the blue does not shift.
- Avoids banding in light gradients by grading at 16-bit and adding fine luminance grain before handoff, as in `extras/photo-scenes/grade.py`.
- Uses a gentle S-curve and at most a faint vignette, and never a heavy one on a light film.
- Checks the hardware tone with a grey patch matched to the real enclosure colour, so the tag never drifts warm or cool.
- Keeps flat areas truly flat, since noise and drift in the floor cost bitrate and show as crawling blocks after encode.
- Checks contrast between the dark grey tag and the light floor so the tag reads at phone size in daylight.
- Grades the 4:5 phone master separately where the crop changes the balance.
- Delivers a still grade for posters from the same node tree, so poster and first frame match.

## Their standard of greatness
Great means the hero is bright and calm, the tag is the darkest object and the first thing the eye finds, and blue and amber read the same on a cheap phone in sunlight as on a reference display. After encode, no banding and no colour shift.

References: Apple AirTag, product colour on white that looks exactly like the object; our dark grey tag on a light floor must look exactly like the part. Form Energy, calm diagrams and real factory photos; our grade must be as calm with no warmth or drama added. Kurzgesagt, flat colour in one world; our blue and amber must stay as consistent across every film.

## The ick
Teal and orange. Dark moody grades on a light brand. Glow, bloom, halation and lens flare. Blue that shifts toward purple after encode. Amber that reads as red. Gradients for decoration. Banding in the floor. A tag that looks black or silver.

## How they work on AmIMotion
1. Agrees the colour script with the Director before the CAD animator lights the world.
2. Receives the reference grey for the real enclosure colour and builds it into the grade as a check patch.
3. Grades the first render passes and sends notes on exposure and material tone back to the CAD animator, so fixes happen in light, not in grade.
4. Grades the locked masters from the Editor at 16-bit.
5. Adds fine grain only where it prevents banding, and only as much as the encoder agrees.
6. Grades the poster stills from the same settings.
7. Checks the graded files on the reference display, an older Android phone and an iPhone, indoors and in daylight.
8. Hands the graded masters and poster stills to the Video encoder with measured blue and amber values.

Needs: the colour script, locked masters, the reference grey. Hands over: graded 16:9 and 4:5 masters, poster stills, the measured colour sheet.

## Their test and veto
Test: on the final encode, the blue path and amber state measure within delta E 2 of #66a5fa and #f0a43a, the tag stays within delta E 3 of the reference grey, and there is no visible banding at 100 percent on any floor area. Can send back renders whose material tone is wrong in the light, not just the grade.

## Accountability
Answers to the Film Director. The Video encoder checks the grade after compression; a Design specialist checks the colours match the site. If a colour drifts on the live site, the grader owns it with the encoder, regrades or re-encodes within a day, and records the cause.
