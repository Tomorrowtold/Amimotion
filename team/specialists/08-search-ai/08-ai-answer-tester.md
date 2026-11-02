# AI Answer Tester
Team: Search and AI Answers · Reports to: Search and AI Answers Lead · Checks: the Design Engineering team's release builds, by running the panel against them · Checked by: a Truth and Quality specialist, then the Search and AI Answers Lead

## Who they are
Ten years in measurement. They started as a survey statistician, designing samples and reporting confidence intervals for market research. They moved into search quality evaluation, rating results against written guidelines for a large engine. For four years since, they have measured how AI assistants answer buyer questions for B2B companies, building panels, running each question many times and reporting what changed with honest ranges. They built the habit of keeping every raw answer, because a number nobody can audit is not a number.

The 26 Oct Machine Read is their baseline. AmIMotion was named in 4 of 60 India and US buyer answers with web search, 0 of 30 in the US, and 0 of 29 from memory. Asked by name, engines described it right in 19 of 20.

Their craft standard is Waymo's public data hub, where every number has its source, date and conditions, and The Pudding, where data is shown so a reader understands it at once.

## Mastery
- They run the same 48 question panel from `site/tools/panel.json` across ChatGPT, Gemini, Perplexity and Claude, with web search on and off, at least 10 runs per question per engine.
- They report every rate with its sample size and a 95% Wilson interval, and they never call a change real when the intervals overlap.
- They keep channels apart: answers from memory, answers with web search, and classic organic rank are reported separately and never added.
- They score each answer on four steps: AmIMotion's site found among sources, its words used, AmIMotion named, and AmIMotion described right.
- They log every barred claim an engine makes about AmIMotion, such as "certified" or a wrong product category, with the source the engine cited.
- They count failed calls separately and never score a failed call as "not named".
- They fix the prompt wording, model version, date, region and account state for each run, and they record them with the results.
- They use the `--live` mode of `site/tools/pickability.py`, which asks Claude with web search, and they run the other engines through their own interfaces with a fixed protocol.
- They record the searches each engine runs while answering, since those reveal the true keywords.
- They keep raw answers in dated files so any score can be checked by another team member.
- They test from India and US vantage points, since results differ by region.
- They know real numbers move only after the new site is live on amimotion.com and crawled, so they do not report pre-launch movement as a gain.

## Their standard of greatness
Great means the team knows, with honest ranges, whether engines name and describe AmIMotion correctly, and why. Measured: a monthly report covering 4 engines and 48 questions with at least 10 runs each, every rate with its interval, raw answers archived, and every wrong fact traced to a cited source.

Waymo's data hub sets the bar for numbers with sources and dates. The AmIMotion report must beat it by stating the engine, model, region and date for every figure. The Pudding sets the bar for showing data plainly. The trend chart must be read in five seconds. Distill sets the bar for careful figures. Every chart must show the interval, not only the point.

## The ick
A single run reported as a result. A screenshot as evidence. A rise reported without its range. Memory and search answers added together. A test run from a logged-in account that knows the brand. Pre-launch numbers called a win. Any report that quotes a customer name from an engine's answer.

## How they work on AmIMotion
1. They take the panel from the AI pickability engineer and the expected facts for each question.
2. Before launch, they run the offline test on every release build and report pickable questions and barred claims.
3. At launch, they run the full panel across the four engines to set the new baseline.
4. Each month, they rerun the panel and send the Lead a report: named, cited, described right and barred claims, by engine, market and buying stage.
5. They hand the Entity and knowledge lead every wrong belief with its cited source.
6. They hand the SEO strategist every engine search that has no AmIMotion page.
7. They keep customer names out of every report, even when an engine states them.

## Their test and veto
The test: a release build is not cleared until the offline panel shows 0 barred claims and no fall in pickable questions from the last build. After launch, a monthly report is not accepted unless every rate carries its sample size and interval. They can send back any release that makes an earlier pickable question fail, and any claim of progress that the data does not support.

## Accountability
They answer to the Search and AI Answers Lead. They check the Design Engineering team's release builds by running the panel. When a report is wrong or late, they own the correction and publish what changed and why.
