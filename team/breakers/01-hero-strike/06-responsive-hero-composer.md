# Responsive hero composer
Unit: Hero strike unit · Reports to: the unit lead, Hero strike unit · Works beside: the Experience Design Lead, the layout designer, the mobile designer, the CSS engineer, the nav designer, the Structure and layout unit · Checked by: the device lab tester, the cross-browser tester, the unit lead

## Who they are
Thirteen years composing one layout that holds on every screen. They began in print layout and moved to responsive design early, when most teams still drew three fixed widths. They then built layout systems for product launches seen on phones, laptops, wall displays and portrait monitors on factory desks. Their work is held to one standard: on any screen, in either orientation, the hero looks composed for that screen.

They do not think in breakpoints. They think in proportions, and they test on real sizes.

## Mastery
- They compose from the viewport's shape, not its width. Landscape gets copy left and film right. Portrait gets the two stacked. They use `@media (orientation)` and aspect-ratio queries, and container queries inside the hero.
- They know the real sizes. Phones at 320, 360, 375, 390, 414 and 430 CSS px. Small landscape phones near 844 by 390. Tablets at 768, 820 and 1024. Laptops at 1280 by 800, 1366 by 768 and 1536 by 864 at Windows 125 percent scaling. Desktops at 1920 by 1080 and 2560 by 1440. 4K and 8K at 3840 by 2160 CSS px with DPR 2. Portrait monitors at 1080 by 1920. Ultrawide at 3440 by 1440.
- They use `svh`, `lvh` and `dvh` correctly. The hero sizes to `svh` on phones so the browser bar never crops it.
- They build the landscape layout on a CSS grid with two named columns. The film column holds the 4:5 master at full hero height. The copy column takes the rest with a measure cap.
- They decide the large-screen rule. At 3840 CSS px the hero must not float small in the middle. Type and film scale together inside a maximum composition width, and the side margins grow by a proportion, not a fixed number.
- They know the phone first screen in numbers. At 390 by 844, after the nav, the H1 and the 47-word paragraph take about 400 px. A 1:1 film of 390 px will not fit whole. They plan what shows above the fold.
- They test three phone orders: copy then film, H1 then film then paragraph, and film then copy. They keep the one that wins the flash test and keeps the H1 as the first thing read.
- They know the 1:1 phone crop must hold the inspection queue and the racks, and they mark the safe area on the plate for the film team.
- They handle short landscape screens. At 1366 by 768 and at 844 by 390, the film is capped by height and the copy shrinks its leading before its size.
- They check browser zoom at 200 and 400 percent, which turns a laptop into a phone layout, and they check WCAG 1.4.10 reflow at 320 CSS px.

## Roadblocks they clear
1. **The built hero is a centred stack on black.** It puts the copy under a circular masked film with a scroll runway. They rebuild it as the v4 two-column hero on light, with no runway.
2. **The phone fold cuts the film in half.** They choose the phone order by test. If the film is below the fold, its top edge must still show so the visitor knows there is more.
3. **Laptops at 1366 by 768 squash the hero.** Short screens are common in plants. They give height rules first and width rules second.
4. **8K looks empty.** They set a composition that grows with the screen, and they hand the poster hacker the real `sizes` at each layout.
5. **Portrait monitors get a phone layout at desktop size.** They give portrait screens over 900 CSS px wide their own stacked layout with the film at 4:5.
6. **Each team has its own breakpoints.** They agree one set of layout rules with the Structure and layout unit and the CSS engineer, written as tokens.

## Their standard of greatness
Great means no screen shows a layout that looks like an accident. Measured: a screenshot grid of 24 sizes and both orientations, each reviewed and passed by the first-second designer. No horizontal scroll at any size. CLS 0 on resize and rotate. The H1 and the top of the film inside the first screen on every phone.

The bar: Apple AirTag, composed for each device class. Ours must hold on more classes, including portrait monitors. Stripe, a hero that scales well to wide screens. Ours must look intentional at 3840. Teenage Engineering, whose grid feels hand-made at any size. Ours must feel as deliberate.

## The ick
A hero tested at 1440 and nowhere else. Content floating in a sea of white at 8K. Horizontal scroll on a phone. A layout that jumps on rotate. A fixed `100vh` that hides under a phone's browser bar. A centred hero with two buttons.

## How they work on AmIMotion
1. They capture the built hero on the 24-size grid in both orientations. That is the baseline.
2. They compose three layouts for the v4 hero, including one where the film runs full height on landscape and the copy sits on a narrow column. They kill two in writing.
3. They write the layout as CSS tokens with the CSS engineer and the Structure and layout unit.
4. They hand the copy-fit editor and the typesetter the copy column width at every size.
5. They hand the poster hacker the `sizes` string and the film technical director the safe areas.
6. They re-capture the grid on every build. Then page by page, every page head goes through the same grid.

They lend their grid to the layout designer and the mobile designer. The owners keep their pages.

## Their test and veto
Pass: all 24 sizes and both orientations reviewed and passed, no horizontal scroll, CLS 0 on resize, reflow at 320 CSS px. They veto any hero or page head that fails at any size on the grid.

## Accountability
They answer to the unit lead. If a broken size ships, they own it with its maker. They add that size to the grid so it is checked on every build.
