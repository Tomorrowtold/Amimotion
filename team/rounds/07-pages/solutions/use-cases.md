# /use-cases/  (hub)

Generator: `p_solutions.py`, `write("/use-cases/", TITLE, DESCRIPTION, [...])`. No `tone="dark"`: one ground, as system-notes require.

- **Title tag:** AmIMotion use cases: find, time, hand off, ask
- **Meta description (141):** Four AmIMotion use cases: find a trolley from a screen, time work station to station, see what an AMR brought, and ask your floor a question.

## Page

### head(...)
- **H1:** "Four jobs." / soft: "One live map."
- **Lede:** Each one starts with a walk someone takes today. Each one ends with an answer in AmIHub.
- **short:** AmIMotion is used for four jobs on factory and warehouse floors. Find a tagged trolley or tool from a screen. Time each trolley from station to station. See what an AMR brought, and when. Ask an AI assistant about the floor, answered from AmIHub's live map. All four run on the same AmIGo tags, AmIMo anchors and AmIHub.
- **trail:** [("Use cases", None)]
- **links line:** Plan your first bay (/diagnostic/)
- **media:** none in the head (the four cards below carry the pictures).

### section 1
- `cards([...], cols=2)`, each picture the head still of its page, cut 4:3 (briefs on each page file):
  1. /use-cases/find-the-asset/ · **Where is that trolley?** · "Someone walks the hall to find it. AmIHub shows where it was last seen." (P-UC1-01)
  2. /use-cases/station-to-station/ · **Station to station** · "Status changes when someone scans. AmIHub times every station in between." (P-UC3-01)
  3. /use-cases/amr-hand-off/ · **The hand-off** · "A robot brings a trolley. AmIHub records where and when it arrived." (P-UC2-01)
  4. /use-cases/ask-your-plant/ · **Ask your floor** · "Someone goes to look. An AI assistant answers from the live map instead." (P-UC4-01)

### section 2
- `vp("Pick the one", "your team lives with.", lede="Each AmIMotion use case answers a question someone on your floor asks every shift.")`
- `compare(["Use case", "Who asks it most", "Today", "In AmIHub"], rows)`:

| Use case | Who asks it most | Today | In AmIHub |
|---|---|---|---|
| Where is that trolley? | Supervisors and material coordinators | A walk and calls to stores | Its zone, and when it was last seen |
| Station to station | Production control and IE leads | A scan at each desk, and a gap between | Every entry and exit, timed |
| The hand-off | Logistics and robotics teams | A scan, if someone remembers | Arrival time and place, with no scan |
| Ask your floor | Supervisors, IT and developers | Someone goes and looks | An answer from the live map. Changes need a person's approval |

### section 3
- `faq([...], "Questions teams ask first.")`
  - **What can you do with an RTLS in a factory?** With AmIMotion, four things. Find tagged trolleys and tools from a screen. Time work at every station. See what robots brought, and when. Ask an AI assistant about the floor, answered from live data in AmIHub.
  - **Which use case should we start with?** The one where people walk most to find out what is happening. Plan your first bay asks six questions about how work moves in your plant and suggests where to start.
  - **Do the four need different hardware?** No. All four run on the same AmIGo tags, AmIMo anchors and AmIHub. A forklift, tugger or AMR takes the vehicle form of the tag.

### close
- Default for /use-cases/: "See where location would help first." · "Six questions, two minutes." · Plan your first bay.

## Internal links
The four use cases, /diagnostic/. Card titles are the nav label where one exists (Where is that trolley?, Ask your floor); the other two use the page H1's short name ("Station to station", "The hand-off"), which also becomes their crumb.

## JSON-LD notes
- CollectionPage, `description` = meta. ItemList of the four use cases in card order.
- BreadcrumbList: Home > Use cases.
- FAQPage, three rows. No VideoObject: the films leave these pages (see README).

## Checks
- **Job:** any buyer who wants "show me a real job, not a feature list". Next: the use case closest to their shift. Reference: Stripe's use-case index (one line of before and after per card). We beat it with the compare table, which an AI assistant can quote as one answer.
- **Drafts:** A (micro-copy writer): four film cards, dark ground (today). B (answer writer): cards plus the who-asks table. **Picked B**: the films are held (system notes, fault 2) and the table lifts the page from about 140 to about 380 words.
- **Readers:** P2 production control 8 → 9. P4 supervisor 9 → 9. P7 IT 8 → 9 (lost on "Ask your plant", which no longer matches the nav label "Ask your floor": fixed).
- **Claims:** "Changes need a person's approval" PASS (V38). "vehicle form of the tag" PASS ([B3] vehicle tag). "suggests where to start" PASS (the diagnostic's own promise, V93). Film running times removed with the films.
- **Open facts used:** none. Not O1, O2, O3, O4, O6.
- **Words:** about 380 visible.
