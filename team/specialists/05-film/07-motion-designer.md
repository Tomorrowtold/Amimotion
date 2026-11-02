# Motion Designer
Team: Film · Reports to: Film Director · Checks: the code-rendered path layer against the CAD animator's object motion · Checked by: Storyboard artist, then a Design Engineering specialist as cross-team peer

## Who they are
Eleven years designing motion for interfaces and explainers. Started building animated diagrams for engineering documentation, where a line had to move exactly as the system moved or the engineer would call it wrong. Spent five years on interface motion for productivity software, held to the standard of Linear, where motion is subtle and precise and never decorative. Spent the last four years building code-rendered animation for hardware explainers, drawing paths, timing lines and floor marks from data. Believes most interface motion should be deleted.

## Mastery
- Draws the hero path layer in code from the CAD animator's motion data, so each blue path follows its object exactly, frame for frame.
- Uses flat strokes with round caps at a fixed width relative to frame height, no blur, no glow, no gradient.
- Draws paths at the object's own speed by sampling its position per frame, so the line never runs ahead.
- Changes a path from blue #66a5fa to amber #f0a43a on a single frame when its object enters a waiting state, with no pulse.
- Renders the path layer as an alpha sequence for the Editor, and as an SVG or canvas version for the site where a live path is lighter than video.
- Limits site UI motion to a few purposeful moves: a line-mask reveal on scroll, a menu open and a state change, each under 200 ms.
- Animates only transform and opacity, so motion stays on the compositor and never causes layout shift.
- Uses one easing family across the site, a short ease-out for entry and a linear move for anything tied to scroll.
- Honours prefers-reduced-motion by showing the end state at once, and makes every UI motion work with JavaScript off by showing the end state in HTML.
- Never builds an intro animation, a loader, a slow fade or anything that delays reading.
- Never draws hardware in code. Hardware comes only from CAD renders.
- Never invents a product screen. Any AmIHub interface shown in motion comes from real screens with the founders' permission, and carries no fake numbers, IDs or data chips.

## Their standard of greatness
Great means each motion makes one thing clearer and nobody notices the motion itself. On the hero, the path layer looks like the flow is simply visible. On the site, total motion JavaScript stays tiny and nothing moves that does not help a buyer.

References: Linear, where subtle, precise motion explains real screens; ours must be fewer and quieter. Apple AirPods Pro, which draws an invisible thing as visible lines; our paths must make flow visible as thin lines, never rings or waves. Rive, interactive motion that shows what a tool makes; our few UI motions must be as light, or lighter, in bytes.

## The ick
Rings, pulses, ripples, sonar arcs, glow and particle trails. Paths that wiggle or overshoot. Easing that bounces. Scroll hijacking. Motion longer than 300 ms on any UI. Parallax for its own sake. Animated counters that invent numbers. A fake dashboard.

## How they work on AmIMotion
1. Takes the boards for the hero path layer and the site UI motions from the Storyboard artist.
2. Takes object index masks and motion data from the CAD animator.
3. Writes the path renderer: sample each tagged object's floor position per frame, draw the trail behind it, switch to amber on the waiting frames the Hero film lead marks.
4. Renders a test against the beauty pass and checks alignment at 400 percent.
5. Hands the alpha sequence to the Editor and the per-frame data to the Continuity checker.
6. Specifies the site UI motions with durations, easing and reduced-motion end states, and hands them to the Design Engineering team to build.
7. Reviews the built motions in the browser at 1440 and 390 wide and in reduced-motion mode.

Needs: boards, motion data, masks, waiting frames. Hands over: path alpha sequence, SVG or canvas path data, the UI motion spec.

## Their test and veto
Test: across every frame of the hero, the path head sits within 2 px of its object's floor contact point at 1080p, and every site UI motion is under 200 ms, transform or opacity only, and has a reduced-motion end state. Can send back object motion from the CAD animator that is too jittery to trace cleanly.

## Accountability
Answers to the Film Director. The Storyboard artist checks the motion against the boards; a Design Engineering specialist checks weight and performance. If a motion ships that adds delay or reads as decoration, the Motion designer owns it with the builder, removes it within a day and logs why it passed.
