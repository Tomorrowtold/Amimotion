# /contact/  Book a call

Squad: buying. Generator: `p_company.py`, `write("/contact/", ..., scripts="tools")`. Form markup and the mail-draft logic in `tools.js` are kept. Words only.

- **Title tag:** Book a call: a live demo on real data | AmIMotion
- **Meta description:** Book a call with AmIMotion. We show AmIHub's live map and an AI question on real data, not slides, and talk through one flow on your floor.

**Job of the page.** Buyers: P1, P2, P11 at the point of asking. Question: "What happens if I write, and what should I bring?" Next step: send the draft. Best reference: Resend's and Supabase's contact pages: a short form, a plain email address, and exactly what happens next. Linear's "talk to us" says who will answer; we cannot (O13), so we say what the call shows instead.

**Drafts.** A: form plus "What happens next" list (current). B: same, with a speakable answer on top, the NDA order stated, and an FAQ that answers the outside-India question without claiming regions. Picked B.

---

## head(...)

- **H1:** Book a call.
- **soft:** none
- **lede:** Tell us where your team walks to check. On the call we show AmIHub's live map on real data, not slides.
- **short:** To book a call with AmIMotion, write to sales@amimotion.com or use the form on this page. The call is a live demo on real AmIHub data, not slides: tagged things moving on the live map, and a question typed to an AI assistant. Bring one flow where people walk to find work. After the first call, we share datasheets, architecture, prices and pilot options under NDA.
- **trail:** [("About us", "/company/"), ("Book a call", None)]
- **media:** none

## section 1: the contact grid (markup kept)

Form labels kept: "Your name", "Work email", "Company", "Role (optional)", "Which part of your flow needs someone to go and check?". Button "Book a call".
Under the button: "Opens a draft to sales@amimotion.com in your own mail app. This site stores nothing you type."
Draft state: "Your draft is ready." / "Open email draft" / "Copy text".

Right column:
- **H2 "What happens next"**, ordered list:
  1. A call, with a live demo on real AmIHub data.
  2. The NDA pack: datasheets, architecture, prices and pilot options.
  3. A site survey, and a pilot in one bay or line.
  4. Then plant-wide, on the same AmIHub, if the bay proves its numbers.
- **H2 "Write directly"**: sales@amimotion.com
- Small: "AmIMotion · Locatepro Technologies Pvt Ltd · Bengaluru, India"

## section 2: `faq([...], "Before you write.")`

1. **What should we bring to the first call?** One flow where people walk to find work, roughly how big the area is, and who owns it. Your pilot on one page helps you write it down.
2. **Is the demo on real data?** Yes. The AmIMotion call is a live demo on real AmIHub data, not slides. It includes a question asked of an AI assistant, answered from the live map.
3. **Do we need an NDA before the first call?** No. The first call comes first. After it, we share datasheets, architecture, prices and pilot options under NDA.
4. **Our plant is outside India. Can we still talk?** Yes, write to us. AmIMotion is designed and built in Bengaluru, India. Tell us where your plant is, and we will tell you plainly what a survey and support would look like there.

## close

`close("Rather start on your own?", "Six questions about how work moves in your plant. AmIMotion gives you a plan back before anyone calls you.", (("Plan your first bay", "/diagnostic/"),))`

## Internal links

/company/ (crumb), /tools/pilot/ (FAQ 1), /diagnostic/ (close), /privacy/ (under the form: "This site stores nothing you type. [Privacy](/privacy/)").

## JSON-LD notes

`ContactPage` + `BreadcrumbList` (Home > About us > Book a call) + `FAQPage` (four). Organization `contactPoint`: `contactType` "sales", `email` "sales@amimotion.com", `availableLanguage` "en". No `areaServed` (regions open, kit 02 Q18). No telephone (none in the founders' documents).

---

## Checks

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P11 Promoter or MD | 7 | "Who will be on the call?" | O13 open; cannot name. FAQ 2 says what the call shows instead. Logged. | 8 (blocked on O13) |
| P1 Plant head | 9 | none | | 9 |
| P2 Production control | 9 | none | | 9 |

Mean 8.7. Blocker: O13.

**Claims.**

| Claim | Ruling | Source |
|---|---|---|
| Live demo on real AmIHub data, not slides | PASS | [B7], V94 |
| "a question typed to an AI assistant" | PASS on AMBER | [B7] live demo; MCP carried by "on a call" (V39) |
| NDA after the first call | PASS | [B8] order of steps, F13 |
| "This site stores nothing you type." | PASS | tools.js contact handler builds a `mailto:`; no storage, no network |
| Old FAQ "For plants elsewhere, including the Gulf, ... we will set out how survey, installation and support would work" | REWORD | Regions served is open (kit 02 Q18); "installation" is O12. New answer names no region and promises only a plain answer. |
| "if the bay proves its numbers" | PASS | V84 wording, no gate or stop right |

**Open facts used.** O12, O13 kept out; Q18 (regions) kept out.
**Word count:** about 400.
