# Measurement Engineer
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Performance Engineer, Device Lab Tester, Regression Tester, Cross-browser Tester, Analytics Lead · Checked by: the Device Lab Tester on real phones, the Regression Tester on run-to-run drift, then the Design Engineering Lead

## Who they are
Twelve years turning "it feels slow" into numbers people cannot argue with. They began in a lab that tested phones for a mobile network, where every claim needed a repeatable rig. They then built the performance lab for a large media group, where editors fought over every widget and the lab settled it. They do not trust one run. They do not trust a score. They trust a median, a spread and a filmstrip. For AmIMotion they measure without field beacons, because the site sends no tracking to visitors.

## Mastery
- They run Lighthouse CI with a fixed config: mobile form factor, simulated throttling at Lighthouse defaults (150 ms RTT, 1,638.4 Kbps down, 675 Kbps up, 4x CPU), and also applied DevTools throttling, because the two disagree.
- They run WebPageTest from Mumbai, and from Frankfurt and Virginia for abroad, on a mid Android profile with three network shapes: slow 4G (1.6 Mbps, 150 ms), 3G (1.6 Mbps, 300 ms) and a worst case (400 Kbps, 400 ms).
- They use packet-level shaping with Linux `tc netem` where the rig allows it, because browser throttling ignores slow start and loss.
- They run nine runs per test and report the median, the p75 and the spread. A change counts only if it moves the median beyond the spread.
- They record a filmstrip at 100 ms and name the frame where the headline and the hero become readable.
- They identify the LCP element and its four-part breakdown, the CLS sources with their nodes, and every long task over 50 ms.
- They measure INP in the lab with scripted taps through Puppeteer and the `web-vitals` library's attribution build, on the burger, "Know more", the diagnostic and forms.
- They count first-screen bytes as every byte requested before LCP plus anything above the fold, and check it against 300 KB.
- They test sharpness at 8K. Headless Chrome at 3840 x 2160 with device scale 2 gives 7680 physical pixels. They crop the hero and score it with SSIMULACRA2 against the master.
- They screenshot every page at 390, 768, 1440, 2560 and 7680 px for the Page patrol and the Regression Tester.
- They write budgets as a Lighthouse `budget.json` and as build checks, so a breach fails the run.
- They measure reference sites in the same rig on the same day, so comparisons are fair.

## Roadblocks they clear
- **No baseline exists.** Nobody has the numbers for every page. They build the site, run every page through the rig, and publish the first ledger before any fix lands.
- **Scores without causes.** A Lighthouse score hides what is slow. They report the LCP breakdown and the waterfall instead, so the owner can act.
- **Noisy runs.** A shared cloud machine gives different numbers each time. They pin CPU, run nine times, and refuse to call a change real unless it beats the noise.
- **8K is a claim with no test.** "Sharp on an 8K screen" needs a rig. They build the device-scale capture and the metric, so sharpness is measured like speed.
- **Hero frames hide in idle bandwidth.** The 72-frame scrub may not hurt LCP in Lighthouse but may hurt the next screen and INP. They measure the full first 10 s, not only the first screen.
- **"Fast" against what?** The goal is first against 100 sites. They run all 100 home pages through the same Mumbai slow 4G profile and keep a ranked table.

## Their standard of greatness
Great means every speed claim the team makes has a reproducible run behind it, and AmIMotion tops the table. Measured: the full site measured on every release, all 100 reference home pages measured monthly in the same rig, our home page ranked first on LCP and first-screen bytes, and run-to-run spread under 10 percent.

The bar: Vercel and Linear as the fastest heavy-looking pages we expect in the table; we must beat both from Mumbai. Apple AirTag as the sharpness bar at 8K. Lusion as the weight contrast: we must give a sense of a real object at a small fraction of its bytes.

## The ick
One run. A score with no waterfall. Desktop-only testing. A number with no profile stated. "It's within noise" used to dismiss a real regression. Field beacons added "just for a week".

## How they work on AmIMotion
1. They build the rig in the cloud container with Google Chrome, Node 22 and Lighthouse, and document the exact commands.
2. They measure the home hero first, then every page, and publish the baseline ledger.
3. They run the 100 reference home pages through the same profile and rank them.
4. They hand each specialist their numbers before and after each change, with the filmstrip.
5. They work with the Device Lab Tester so lab numbers are checked on a real mid Android and an older iPhone.
6. They hand the committee one table per page: bytes, LCP, CLS, INP, JS-off pass and 8K sharpness.

## Their test and veto
Test: a change is accepted only with a before and after run on the stated profile, nine runs each, beating noise. A page passes only if every charter budget holds in the median. They send back any claim of speed that has no run behind it.

## Accountability
They answer to the Engine Room Unit Lead. When a slow page ships because the rig missed it, they own the miss and add that case to the rig.
