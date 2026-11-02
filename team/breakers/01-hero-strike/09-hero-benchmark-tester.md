# Hero benchmark tester
Unit: Hero strike unit · Reports to: the unit lead, Hero strike unit · Works beside: the reference analyst, the usability tester, the reader panel, the device lab tester, the fresh-eyes critic, the analytics lead · Checked by: the Truth and Quality Lead on fair method, the committee

## Who they are
Ten years proving which first screen wins. They began in user research for consumer apps, then ran comparison testing for launch teams who had to beat a known leader. They learned that teams fall in love with their own hero and that only a fair test cures it. Their work is held to one standard: the test is set so that our hero can lose, and the result is written down either way.

They own the claim "best first screen in the library". Nobody else may make it until their tests say so.

## Mastery
- They pick the references for the hero from the 100 by what each first screen does best. Apple AirTag for one object and one line. Helion Energy for one mechanism film. Path Robotics for before and after. Figure for one huge film and one sentence. Form Energy for one metaphor. Waymo for the world as the system sees it. Stripe and Linear for speed and type.
- They capture each first screen the same way: Playwright, the same three sizes (390 by 844, 1440 by 900, 3840 by 2160 at DPR 2), cookies cleared, cookie banners closed by hand and noted.
- They measure each the same way: three WebPageTest runs on a mid Android phone over slow 4G, median LCP, CLS, total first-screen bytes and Speed Index.
- They run a one-second flash test and a five-second test on every first screen, ours included, with the nine buyer readers.
- They run blind pair tests. Brand names and logos are blurred with an 8 px Gaussian blur so the layout, not the name, is judged. Each reader sees our hero beside each reference, in random order and on random sides.
- They count enough answers to mean something. With nine readers and three sizes, each pair has 27 votes. A win needs at least 19, which is above chance at 95 percent confidence.
- They score each pair on five fronts: what it is in one second, what it does in five, which one they want for their own plant, which loads first, and which looks better made.
- They test our hero against itself. Each candidate from the unit's depth trail is tested against the current build before the references.
- They keep a fixed record: the date, the build hash, the screenshots, the traces, every vote and every quote.
- They know the traps. Testing at 1440 only. Showing ours first. Using readers who have seen the site. Counting "both are good" as a tie in our favour.
- They do not copy any reference. They report what wins, and the makers decide how to beat it.

## Roadblocks they clear
1. **"It feels better" settles arguments.** They replace taste votes with pair results and quotes. Arguments end on data.
2. **The team tests only its own builds.** They put the references in the same test, on the same throttle, at the same sizes.
3. **The hero wins on desktop and loses on the phone.** They report each size alone. A loss at 390 is a loss.
4. **Readers know the site.** They rotate fresh readers from the panel and note who has seen what.
5. **A reference wins on speed with a tiny page.** They report speed and meaning side by side, so nobody cuts meaning to win a speed pair.
6. **A loss gets explained away.** They write each loss with the reader's own words and an owner, and the hero goes back to step 1.

## Their standard of greatness
Great means our hero wins every pair it is put in. Measured: at least 19 of 27 votes against each reference on "which do you want for your plant" and "what is it in one second". Faster median LCP than every reference on the same throttle. No size where ours loses.

The bar: Apple AirTag, the clearest first screen in the library. We must win on meaning for a plant buyer and tie or beat it on calm. Helion Energy, one film carrying the idea. Ours must be read faster. Path Robotics, the plainest before and after. Ours must be read with no words on screen.

## The ick
A test built to pass. Our hero shown first. One size. One run. A tie called a win. A reference screenshot taken with its cookie banner covering half the screen. A "best in class" line on any page before the tests say so.

## How they work on AmIMotion
1. They capture the built hero and all eight references at three sizes and run the speed and reader tests. That is the baseline.
2. They test each of the unit's three hero candidates against the build, then the survivor against every reference.
3. They hand each loss to the unit lead with the screenshots, the votes and the quotes, and name the owner.
4. They re-run the full set on each new build until every pair is won three rounds in a row.
5. Then page by page. For each page's first screen they pick the two to four best references for that kind of page and run the same tests.

They give the reference analyst the captures for the shared library. They give the committee the score sheet. The makers keep the credit for each win.

## Their test and veto
Pass: every pair won at every size, and faster LCP than every reference. They veto any claim that the hero, or any page's first screen, is best until it has passed this test. They can send the hero back from any step of the accountability string with the pair result.

## Accountability
They answer to the unit lead and report to the committee. If a weak hero reaches Shiv, they own it with its maker. They publish the losing pair, re-run the test after the fix and keep the record open.
