# Open facts

Core committee, 1 Nov 2026. Shiv's ruling: no questions to anyone. Each fact below is missing from the founders' documents, or two of them disagree. The homepage ships the safe line now. The confirmed line goes in only when a founders' document states the fact. Nothing on homepage-final.md waits on this list.

## 1. Facts still unproven

| # | Missing fact | Readers | Ships today | Ships if confirmed |
|---|---|---|---|---|
| O1 | Can a supervisor open AmIHub's live map on a phone today? [B6] names mobile views only in Analytics, maturity open (V13 STOP, X14, C18) | P4, P2, P1 | "Look it up on AmIHub's live map instead." | "Look it up on AmIHub's live map instead, on a screen or on your phone." |
| O2 | Does a wait past a zone limit make an alert, and who is told? (V25 STOP, X15, Q6, [CW] RED) | P4, P2, P1, P3 | "You set who sees what, by role. AmIHub also sends each entry and exit to any system you name, as it happens." Pilot: "We also agree who on your team acts when work waits too long." | "Set a time limit for each zone. When a wait passes it, AmIHub tells the person or system you choose." |
| O3 | A consent policy for tagging people (V83 STOP, X17) | P4, P10 | "Tagging people would be a separate project. It would need its own policy. You also set how long the map keeps its history." | "No one is tagged without their consent." (or the founders' own wording) |
| O4 | Do the tag's tilt and impact events reach AmIHub? [B3] lists the sensor "tilt/impact events", but no source says AmIHub shows them | P4 | "If it comes off the trolley, the map still shows its last-seen spot." | Add: "AmIHub flags a hard knock, so you know to check it." |
| O5 | Clearance to show a real AmIHub screen ([FR] A4, [FB]) | P2, P4 | Camera A still, the trail ending where the trolley stopped | A real capture: one trolley, "Last seen 10:42" |
| O6 | Named pilot checks and the right to stop after the bay (B46 STOP; [CW] is a proposal) | P1, P9 | "You see your own waits in one bay, and prove the numbers, before you decide on more." | Add: "You can stop after the bay, with nothing more owed." |
| O7 | AmIHub's default for a wait still open at shift end | P3 | "Before it starts, we agree how to count a wait that runs past shift end." | The default, stated in one line |
| O8 | What happens to positions when Wi-Fi or power drops, and how long anchors take to rejoin | P5 | Wi-Fi, "Ethernet is also an option", the dark-anchor alert | One outage line, linked to /technology/ |
| O9 | When to use Ethernet, and whether it shares the PoE port | P5, P6, P12 | "Ethernet is also an option." | "...over Wi-Fi, or over Ethernet from the same port." |
| O10 | How AmIHub's work order ties to the MES job number, and one carrier to many jobs | P6 | "Link each trolley to the job it carries, in AmIHub or from your own system." | "...by your MES job number" |
| O11 | How a second plant reaches one console, and what support can reach (X16, C21, V110) | P6, P7, P8 | "AmIHub can run both from one console." NDA pack covers architecture. | "Each plant runs its own AmIHub. One console shows all of them over your network." |
| O12 | Who installs, who supplies the AmIHub PC, what recurs after the pilot | P9, P11 | "plus our survey and an anchor plan", "local engineers on your site", NDA pack | "...plus installation and the industrial PC. After the pilot, [lines] renew each year." |
| O13 | Does a founder join the first call? | P11 | Leaders named in "What you buy" (V95) | "A founder or our CTO runs the demo." |
| O14 | Who commissions and supports when an integrator brings the client; versioned interface docs ([CW] says integrators need them) | P12 | "Your team or your integrator can build on it at any layer, through open interfaces." | "We survey and commission. Your integrator builds on versioned docs. We support every layer we ship." |
| O15 | Is approval always on for write actions? ([FR] "a person approves any action" vs [B7] "can require") (X3) | P6, P7 | "needs a person's approval. You can require it from a supervisor." | Unchanged, or the exact rule |

## 2. Truth pass on every line changed in homepage-final.md

| # | Line | Ruling | Doubt, if any |
|---|---|---|---|
| F1 | "You set who sees what, by role." | PASS on [B5] role-based access | No source says the plant, not AmIMotion, administers roles. Low. "Access is set by role." is the fallback if challenged. |
| F2 | "AmIHub also sends each entry and exit to any system you name, as it happens." | PASS. Same claim as V25's given line, plainer words | None |
| F3 | "Link each trolley to the job it carries ..." / "Its wait then counts as that job's wait." | PASS on AMBER, as V27, V29 | None. No method, no start or end record. |
| F4 | Cut "Set rules for each zone." Nav line "Zones, entries, exits and waits" | PASS. A cut makes no claim | None |
| F5 | "You can require it from a supervisor." | PASS on [B7] "can require approval from a supervisor" | Keeps V38's "a person's approval" exact beside it. Says "can", never "needs". |
| F6 | "If it comes off the trolley, the map still shows its last-seen spot." | PASS on AMBER. Follows from V50 and V51 | Inferred from motion wake and last seen, not stated as a fall case. It claims no detection. If a founder says otherwise, cut it. |
| F7 | "AmIHub tracks each tag's health and battery level." | PASS on [B5] | None |
| F8 | "It syncs over the air, with no sync cable. It sends its data to AmIHub over Wi-Fi, so it needs no separate data cable. Ethernet is also an option." | PASS on AMBER. [B4] spec table states the Ethernet option | V57 had placed Ethernet on /specs/. The fact is STATED in [B4] and kit 01, and K03 and C20 name it, so it moves up. Release check: if /specs/ does not carry the row from [B4], cut "Ethernet is also an option." |
| F9 | "Your MES, ERP and WMS connect to it through open ... interfaces." | PASS. Softer than V67 ("It connects to your MES") | None |
| F10 | "We also agree who on your team acts when work waits too long." | PASS on AMBER. A scoping step like V80 | [CW] response workflow is a proposal. The line commits AmIMotion only to agreeing an owner, not to an alert. If read as a notification promise, cut it. |
| F11 | "You also set how long the map keeps its history." | PASS on [B5] "data retention policies" | Same administrator doubt as F1. Low. |
| F12 | Cut "Ask us how the two connect." | PASS. A cut makes no claim | None |
| F13 | "After the first call, we share datasheets, architecture, prices and pilot options under NDA." | PASS on [B8] step 2 and [B8] NDA line | "Reference results" from [B8] step 2 left out on purpose (A46, C34). |
| F14 | Footer "every trolley, bin, tool and vehicle you tag in a plant" | PASS on [B3] | Not exclusive, so no product limit is claimed (V101). Departs from [FR]'s "everything that moves". |

No stopped line came back in other words. No new number, name, price or date.
