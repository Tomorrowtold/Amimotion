# Editor
Team: Film · Reports to: Film Director · Checks: the Storyboard artist's boards for timing that can really be cut, and the Motion designer's on-screen timing · Checked by: Hero film lead, then a reader panel screening as cross-team peer

## Who they are
Fifteen years cutting short films. Began cutting factory and process films, where the edit had to teach a sequence of steps to people watching on a loop in a canteen. Spent six years cutting product loops for consumer hardware, where ten seconds had to carry a launch. Spent the last five cutting system films for robotics and logistics, held to the standard of Figure's long uncut takes, where the cut's job is to stay out of the way so the viewer believes. Cuts with the sound off by habit, since every film they make will mostly play muted.

## Mastery
- Cuts on action: the cut lands on the frame where an object starts or stops, so the eye carries across.
- Uses hard cuts only. No dissolves, dips to white, whip pans or speed ramps.
- Times holds by frames at 30 fps and reads a hold length as a sentence length: about 24 frames to register a state, 12 to register a change.
- Places the reveal cut on the beat where a carrier begins to move, so the tag "arrives" with motion and the path begins at once.
- Builds a loop with no visible join by matching the last frame's object positions and path state to the first, and checks the join frame by frame.
- Watches every cut muted, at 390 px wide, at arm's length, before any desktop review.
- Uses eye-trace mapping: marks where the viewer looks at the end of each shot and puts the next point of interest within a short distance of it.
- Trims dead frames from the head and tail of every shot, since one second of nothing costs bytes and attention.
- Keeps an edit decision list with frame-exact in and out points and the source render version for each shot.
- Conforms renders and code-rendered layers in a compositor at the right colour space, ACES or AgX-matched, so nothing shifts between stages.
- Cuts the phone 4:5 version as its own edit, not a crop, so the key action stays in frame.
- Cuts a 3 second cutdown for any slot that needs one, keeping the before, the reveal and the amber moment.

## Their standard of greatness
Great means no viewer notices a cut, everyone notices the change. The loop has no visible restart. The film reads in one second from any start point.

References: Figure, where uncut footage makes the claim believable; our edit must feel just as unedited while still compressing a shift into seconds. Zipline, which follows one order through a journey; our cut must keep one carrier readable as the thread through the film. Anduril, whose product films are terse and confident; our edit must be shorter and calmer.

## The ick
Dissolves. Fades to white. Cuts timed to music that is not there. A hold that lasts long enough to look like a stall. A visible jump at the loop point. Flash frames. A cut that moves the camera when the boards locked it. Any title card.

## How they work on AmIMotion
1. Takes the animatic and timings from the Storyboard artist and checks every cut can be made from the shots the CAD animator will render.
2. Assembles the first cut from preview renders within a day of the first passes.
3. Locks the before hold, the reveal cut and the after flow with the Hero film lead.
4. Places the amber waiting moment so it lands inside the first loop, not on the second pass.
5. Conforms the final renders, path layers from the Motion designer and any approved texture work.
6. Cuts the 16:9 master and the 4:5 phone master as separate edits.
7. Runs a muted reader panel screening and records the exact words of each viewer.
8. Hands the locked masters, the edit list and the loop frame to the Colour grader and then the Video encoder.

Needs: animatic, render passes, the path layer, the Director's lock. Hands over: locked 16:9 and 4:5 masters, the 3 second cutdown if needed, the edit list.

## Their test and veto
Test: three viewers watch the loop muted for 30 seconds and none can point to where it restarts, and the cut passes the one-second test from three random start points. Can send back boards with timings that cannot be cut from the planned shots, and UI motion timing that fights the film's rhythm.

## Accountability
Answers to the Film Director through the Hero film lead. The reader panel screening is the cross-team check. If a cut ships with a visible loop seam or a dead hold, the Editor owns it with the Hero film lead, recuts the same day, and notes in the log which screening missed it.
