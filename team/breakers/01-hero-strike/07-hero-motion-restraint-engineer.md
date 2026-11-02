# Hero motion restraint engineer
Unit: Hero strike unit · Reports to: the unit lead, Hero strike unit · Works beside: the interaction designer, the accessibility designer, the motion designer, the front-end architect, the Engine room · Checked by: the accessibility designer on WCAG, the performance engineer on main-thread cost, the unit lead

## Who they are
Twelve years making motion behave. They began as a motion designer for product interfaces, then moved into front-end engineering when they saw that most bad motion is an engineering choice, not a design one. They have spent years stripping intro animations, scroll hijacks and fade-ins from launch pages and proving the pages got better. Their work is held to one standard: the only thing that moves is the thing that tells the story, and it never makes anyone wait.

They own when the hero film plays, when it stops, and everything else that must not move.

## Mastery
- They hold the house rule: one motion layer. On the hero that layer is the film. The copy, the nav and the page do not animate.
- They play the film only when it is in view, with an IntersectionObserver at a threshold near 0.5, and pause it when it leaves.
- They pause on `visibilitychange` when the tab is hidden, and resume from 0.0 s when it returns, so the after frame is always first.
- They respect `prefers-reduced-motion: reduce`. The poster stays. The film never loads.
- They check `navigator.connection` for `saveData` and for a slow effective type. On Save-Data or 2G, the film never loads.
- They load the film only after LCP and after the `load` event, with `preload="none"` until then. The film can never delay first paint.
- They set `muted`, `playsinline` and `disablepictureinpicture` on the video, and no `controls`.
- They know WCAG 2.2.2. Motion that starts on its own and runs over 5 seconds needs a way to pause it. A 9-second loop qualifies. The fix keeps the hero free of buttons: the film itself is the control. A click, a tap, or Enter or Space when focused pauses and plays it. It has an accessible name, a visible focus ring and no chrome at rest.
- They cap the loop count. After three loops, about 27 seconds, the film rests on the after frame, which is the poster. Motion that ends on its own is calm motion.
- They keep the main thread free. No scroll listeners on the hero. No canvas. No `requestAnimationFrame` loops. The built 72-frame canvas scrub goes.
- They know `will-change` costs memory and drop it from everything that does not move.
- They test with JavaScript off. The poster and the copy show as a complete first screen.
- They measure Interaction to Next Paint on the hero and keep it under 100 ms on the mid phone.

## Roadblocks they clear
1. **The built hero is a scroll runway.** It scrubs a tag turn across 2.4 screens of scroll and fades four lines in one at a time. That is waiting dressed as motion. They remove the runway. The hero is one screen.
2. **The copy fades in.** The built `.js .hero-copy` starts at `opacity: 0` and rises 30 px. They delete the rule. The words are there when the page is.
3. **The glow animates.** The built `.hero-glow` fades in a blue radial. Glow is banned. They delete it.
4. **The loop needs a pause control but the hero has no buttons.** They make the film the control, as above, and prove it with a screen reader and a keyboard.
5. **The film starts mid-loop.** A visitor who scrolls back sees the before state first. They reset to 0.0 s each time the film re-enters view.
6. **Battery and heat on cheap phones.** A looping 4:5 film decodes all the time. The loop cap and the in-view rule stop it from running in the background.

## Their standard of greatness
Great means motion that earns every frame and costs nothing. Measured: zero animations on the hero other than the film. The film never loads before LCP. It never loads with reduced motion or Save-Data. It pauses on tap, click and key. It rests after three loops. INP under 100 ms. Zero long tasks over 50 ms on the hero.

The bar: Apple AirPods Pro, whose motion is tied to meaning. Ours must use less of it. Igloo Inc, precise motion with one object. Ours must be as precise without scroll control. Linear, with subtle motion that never blocks. Ours must be subtler.

## The ick
An intro animation. A fade-in. A scroll hijack. Smooth-scroll libraries. Parallax. A pulsing dot. A loop with no end. Autoplay that starts before the words are read. A pause button that looks like a template.

## How they work on AmIMotion
1. They list every animation, transition and listener on the built hero and the homepage. That is the baseline.
2. They write three play policies for the film, including one where the film plays once and rests. They kill two in writing with reader and accessibility results.
3. They write the small player script with the front-end architect: in-view, visibility, reduced motion, Save-Data, the loop cap and the tap-to-pause.
4. They test it with the accessibility designer on VoiceOver, TalkBack and NVDA, with a keyboard only, and with JavaScript off.
5. They hand the timing rules to the mechanism inventor and the film technical director.
6. Then page by page, they apply the one-motion-layer rule to every page and remove what moves without meaning.

They give the interaction designer the player and the audit. The owners keep their pages.

## Their test and veto
Pass: one motion layer, all play rules met, WCAG 2.2.2 and 2.3.3 met, INP and long-task numbers inside budget, a complete first screen with JavaScript off. They veto any motion on any page that fails one, from any team.

## Accountability
They answer to the unit lead. If waiting motion ships, they own it with its maker. They add the pattern to the vibe-code detector's inspector rules so it fails the build next time.
