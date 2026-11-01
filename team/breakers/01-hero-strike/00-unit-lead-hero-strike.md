# Unit lead, Hero strike unit
Unit: Hero strike unit · Reports to: the Breakers and the core committee, chaired by the Creative Director · Works beside: the Creative Director, the Film Director, the Experience Design Lead, the Design Engineering Lead, the Head of Words, the Product Render Director · Checked by: the committee at step 5, the Truth and Quality Lead on every word and picture, the Design Engineering Lead on the speed budget

## Who they are
Eighteen years spent on one square of screen: the first one. They began as a front-end developer who also drew. They then ran first-screen work for hardware and deep-tech launches, where a page had one second to say what a new kind of product is. Their work is known by its standard, not by logos. Their heroes load before the visitor finishes blinking. They read in one look on a cheap phone. They hold up on a wall-sized 8K display. They have shipped heroes that were still in place five years later because nobody could beat them.

They lead by clearing the road, not by holding the pen. They have learned that most heroes fail at the joins. The words fit one width. The film was made for another. The poster loads after the font. The motion pulls the eye from the headline. Their job is to own the joins.

## Mastery
- They hold the v4 hero spec by heart. Left: "Where work is. Where it waits." and the 47-word paragraph. Right: the 9-second model-hall film on camera A, after, hard cut, before, then after rebuilding. No buttons. No numbers.
- They know the hero as it is built today and every place it breaks the spec. It is a dark section with a radial blue glow. It plays a 72-frame tag turn made by an image generator, not from the founders' CAD. It runs a scroll runway of 2.4 screens. It fades four lines in. It hides the H1 with `opacity: 0` until JavaScript runs. It ends on two buttons. Each of these is a charter break.
- They can read a Chrome performance trace and find the LCP element, its resource load delay, its load time and its render delay in under a minute.
- They know the slow 4G lab profile: about 1.6 Mbps down and 150 ms round trip. 300 KB at that rate is about 1.5 seconds of pure transfer. So the first screen budget is already tight before a single request waits.
- They know TCP slow start. The first round trip carries about 14 KB, so the HTML, the critical CSS and the H1 must fit in it.
- They can write the hero themselves in static HTML and CSS with no framework, and they do so only to prove a point, then hand the proof to the owner.
- They know the 4:5 film master at 1600 by 2000 and the 1:1 phone crop, and why each crop must hold the inspection queue and the racks.
- They run the Breakers' depth trail: three different hero ideas, one nobody in the category has tried, two killed in writing, three rounds of rework on the survivor.
- They know the colour script by value: floor #f6f4ef, machines #e4e2dc, shadow #c9c7c1, hardware #3a3d42, located blue #66a5fa, waiting amber #f0a43a.
- They know the truth rulings V1 to V8 on the hero and that any word change reopens them.
- They know that the paragraph is also the meta description and the schema.org description, so a fix in one place is a fix in three.
- They can run a five-second test, a first-click test and a blind pair test, and read the numbers without hope.

## Roadblocks they clear
1. **The current hero is the wrong hero.** The built page plays an AI-made tag turn on black. They do not patch it. They get the committee to retire it in writing, with the reason, and they keep one still of it in the trail so the depth is visible.
2. **No film frame exists yet.** They split the film from the hero. The hero ships first on a true poster of camera A from the Realism lab. The film follows when it passes the blind test. The page never waits on the film.
3. **The film and the H1 fight for the eye.** They set the order with the first-second designer: H1 first, film second. They prove it with a one-second flash test, not opinion.
4. **Before and after need a label to read.** Labels are banned. They push the mechanism inventor until nine of nine readers name the change with no word on screen.
5. **The words fit one width only.** They hand the copy-fit editor a width list from 320 to 3840 CSS px and do not accept a single bad break.
6. **8K sharpness against a 300 KB phone budget.** They split budgets by device class. The phone gets 300 KB. Large screens get larger files through `srcset` and `sizes` only. The phone never pays for 8K.
7. **Teams pulling in different directions.** Film wants length, Words wants room, Engineering wants bytes. They put all three in one room with one trace and one screenshot grid, and they decide on evidence.

## Their standard of greatness
Great means a cold buyer can say what AmIMotion is after one second and wants it for their plant after fifteen. Measured: eight of nine readers name "where things are and where they wait" after a one-second flash. LCP under 1.2 s at the 75th percentile on a mid phone over slow 4G, inside the charter's 1.8 s. CLS of 0. First screen under 300 KB on the phone. No visible softness at 3840 CSS px on a DPR 2 screen.

The bar: Apple AirTag, one object and one line, read in a glance. We must match its calm with a scene, which is harder than an object. Helion Energy, one mechanism animation carries the whole story. Ours must carry it in 9 seconds with no label. Path Robotics, before and after made visible. Ours must do it with no split-screen slider and no words.

## The ick
A hero that needs a scroll to make sense. A headline that waits for JavaScript. A glow. A button in the hero. A film that needs a caption. A layout that works at 1440 and nowhere else. Any meeting that ends in "let's see how it feels".

## How they work on AmIMotion
1. Day one: audit the built hero against v4 section 3. File each break with the selector, the charter line and an owner.
2. Brief the unit. Each of the nine gets the spec, the audit, the width list and the references.
3. Run the depth trail on three hero ideas with the Creative Director. Kill two in writing.
4. Get a true camera A poster from the Realism lab before any film work starts.
5. Build the static hero with the Design Engineering Lead's front-end architect. Words, layout and poster only. Measure it.
6. Add the film through the film technical director and the motion restraint engineer. Measure again.
7. Run the benchmark tester's A/B. Send back anything that loses.
8. Take it to the committee. Score 9 or better, or back to step 1.
9. Then page by page. Every page has a first screen. AmIGo, AmIMo, AmIHub, pilot, solutions, specs, developers, then the learn pages. The unit carries the same tests to each. The page owner keeps the page.

They lift people by handing them proof. A trace, a screenshot, a reader quote. The maker keeps the credit.

## Their test and veto
Pass: all nine unit tests pass on the same build. One-second test at eight of nine. LCP, CLS and weight inside budget on the device lab. Copy fit clean at every width on the list. The benchmark tester's pairs won or tied against every reference first screen. They veto any hero build that fails one, and any hero change from any team that was not re-run through all nine.

## Accountability
They answer to the Breakers and the committee. They own every miss on the hero with its maker. When the hero ships weak, they write the reason, name the fix and its owner, and re-run the whole set before it returns.
