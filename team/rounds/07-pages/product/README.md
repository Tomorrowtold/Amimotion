# Product squad, round 07: page copy

2 Nov 2026. Nine pages, written to map onto the round-05 blocks in `site/tools/pagegen/lib.py` (head, vp/section, split, tiles, steps, figures, spec, compare, faq, links, read, close; `slot()` and `still()` for pictures). Nothing in `site/` was edited. Nothing committed.

## Pages and final reader scores

Reader scores are a simulated cold read by three kit-09 personas per page (team file only, never quoted as buyer research).

| Page | File | Readers (final) | Mean | Under 9, and why |
|---|---|---|---|---|
| /platform/ | `platform.md` | P1 9 · P5 9 · P8 9 | 9.0 | — |
| /products/amigo/ | `products-amigo.md` | P4 9 · P5 9 · P9 8 | 8.7 | P9: tag size and weight are unpublished |
| /products/amimo/ | `products-amimo.md` | P5 8 · P7 9 · P9 9 | 8.7 | P5: outage recovery (O8) |
| /products/amihub/ | `products-amihub.md` | P4 9 · P6 9 · P7 9 | 9.0 | — (O5, no real screen, is the gap against the best reference) |
| /technology/ | `technology.md` | P5 8 · P7 9 · P8 9 | 8.7 | P5: outage recovery (O8) |
| /specs/ | `specs.md` | P9 8 · P5 9 · P12 8 | 8.3 | P9: size and weight; P12: versioned docs and commissioning (O14) |
| /developers/ | `developers.md` | P6 9 · P12 8 · P7 9 | 8.7 | P12: O14; no published event schema, so no code sample |
| /what-is-amimotion/ | `what-is-amimotion.md` | P11 9 · P1 9 · P8 9 | 9.0 | — |
| /industrial-spatial-intelligence/ | `industrial-spatial-intelligence.md` | P8 9 · P1 9 · P3 9 | 9.0 | — |
| **Mean** | | | **8.8** | Every score under 9 is blocked only by a missing founder fact. The safe line ships |

## Blocked items: founder facts, with the safe line that ships

1. **Tag and anchor size, weight and ingress rating.** The founders' CAD measures AmIGo at 59 x 86 x 23 mm and AmIMo at 59 x 29 x 106 mm, but no founders' document publishes them ([B3] puts them in the datasheet under NDA; kit 02 Q8). STOP on publishing CAD numbers. Ships: "Compact and low profile. Size, weight and ingress rating are in the datasheet."
2. **O8 outage behaviour and anchor rejoin time.** Ships: the dark-anchor alert, last-seen behaviour, and "How your network design handles an outage is part of the site survey."
3. **O14 commissioning and versioned interface docs.** Ships: "Your team or your integrator can build on AmIMotion at any layer, through open interfaces. One contract and one support line cover every layer."
4. **A published AmIHub event schema or API reference.** The best developer reference opens with a code sample. Inventing fields is a STOP. Ships the zone event described in words, and "Ask on the first call."
5. **O5 a real AmIHub screen.** /products/amihub/ head uses the camera A inspection-bay crop, never called AmIHub.

## Rulings other teams need

- **Search lead:** panel U25 ("Which UWB RTLS supports FiRa?") expects the word "compliant", which the charter bars. /technology/ will fail that one fact. Change the regex to `FiRa.*specification|built on`. B05 needs "typical": accuracy rows now read "Down to ±10 cm in 3D, typical, with AmIMo anchors" ([B3] qualifier plus the charter wording).
- **Truth lead:** `entity.json` fact "...through an association with a start and an end" conflicts with V108. /what-is-amimotion/ leaves it out of its facts list and uses the F3 line. The old "a link with a start, an end and an owner" is cut from /platform/ and /developers/.
- **Truth lead:** "tens of picoseconds" (old /platform/ know-more) has no source. STOP. It is gone from these pages. Grep the rest of the site.
- **Build:** `og` images on /products/amigo/ and /products/amimo/ still point to retired `/assets/img/` stills. New paths are given in each file.
- **Product Render and Engine room (pictures owed):** `amigo_trolley` (AmIGo on a trolley rail) and `amimo_column` (AmIMo on a column, DC cable) CAD shots; a `pair` ladder from `pair_scale.png` for /specs/; an `amigo_logo` ladder as the interim AmIGo section picture.
- **Realism lab (model-hall stills, all `build_hall.py` camera A, t = 0.0 unless stated):** a 16:9 full-hall render for /platform/; 16:9 racks crop for /technology/ head; 4:3 racks crop; the homepage screen 3, 4 and 6 frames reused on /platform/, /industrial-spatial-intelligence/ and /products/amimo/; one new orthographic top-down camera "P" over the inspection bay for the /technology/ explainer, with the Explainer diagram designer.

## What changed against the shipped pages, in short

- Every H1 is now the nav label or the product name as one sentence. No formula pairs ("One tag. Every carrier.", "Find it first. Then add meaning.").
- /technology/ gains "When something goes quiet", which its nav line ("outages") promised.
- /industrial-spatial-intelligence/ goes from under 250 words to about 650, with a fair comparison against scans and RTLS.
- /what-is-amimotion/ no longer repeats the footer entity paragraph, so "Physical AI" appears once. It adds who leads AmIMotion.
- Cut everywhere: picoseconds, "never marks work done by itself", cloud "terms set in your contract", alerts over MQTT (O2), "people" in AmIHub's object list, the three off-world 4:3 slots on /products/amigo/, phone wording for DL-TDoA and Wi-Fi FTM.
- O1, O2, O3, O4 and O6 stay out on all nine pages. O3 appears only as its safe line, in one AmIGo FAQ answer.
