# /privacy/  Privacy notice

Squad: buying. Generator: `p_company.py`, `write("/privacy/", ...)`.

- **Title tag:** Privacy notice | AmIMotion
- **Meta description:** How the AmIMotion website handles personal data: no sign-up, no ads or analytics trackers, tools that run in your browser, and your rights under the DPDP Act.

**Job of the page.** Readers: P7 IT and security, the legal or compliance reviewer in any buying committee, and any visitor. Question: "What does this site collect, and what can I ask of you?" Best reference: Apple Privacy and Resend's privacy page: short sections in plain words, each one true of the site as built. Rule from the brief: every sentence must be true of what the site does today, and legally accurate under India's Digital Personal Data Protection Act, 2023 (DPDP).

**What the site does today (verified in the repo, 2 Nov 2026).** No cookies are set (no `document.cookie` anywhere). No `localStorage`. The diagnostic keeps answers in `sessionStorage` key `amimotion.diag`, cleared by Start over and by closing the tab. The tools (`tools.js`) make no network request: Download builds a local file, Copy uses the clipboard, Email and the contact form open `mailto:sales@amimotion.com`. The diagnostic's lead form opens a `mailto:` draft because `leadEndpoint` in `config.js` is empty. Fonts are self-hosted; the built pages load no script, font, image or frame from another domain (only canonical links). No analytics, advertising or social-media script. The YouTube channel appears only as `sameAs` in structured data, not as an embed. The free-email check and the company-name guess in the diagnostic run in the browser.

**Drafts.** A (current): five short sections, no law, no rights. B (truth lead with a privacy specialist): DPDP structure (who we are, what we collect, why, how long, your rights, complaints) written only from what the site does. Picked B: A promised nothing wrong but named no data fiduciary, no rights and no grievance route, which DPDP requires for any personal data we receive by email.

---

## head(...)

- **H1:** Privacy notice.
- **soft:** none
- **lede:** This notice covers the amimotion.com website. It says what the site collects, what it does not, and what you can ask of us.
- **short:** The AmIMotion website has no sign-up, no advertising trackers and no analytics. The planning tools and Plan your first bay run in your browser. Your answers to Plan your first bay sit in this browser tab only, and nothing reaches AmIMotion until you send an email. When you write to us, Locatepro Technologies Pvt Ltd uses your details to reply and to follow up the enquiry you started. You can ask to see, correct or erase them under India's Digital Personal Data Protection Act, 2023.
- **trail:** [("Privacy", None)]
- **media:** none

## section 1: `prose(html)`, H2 per part, in this order

**Who we are.** This website is run by Locatepro Technologies Pvt Ltd, Bengaluru, India. AmIMotion is its brand. For personal data you send us through this site, we are the Data Fiduciary under India's Digital Personal Data Protection Act, 2023. Write to us at sales@amimotion.com.

**What the site does not do.** There is no sign-up and no account. The site sets no cookies. It loads no advertising, analytics or social-media trackers. It loads no fonts or scripts from other companies' servers.

**What stays in your browser.** Plan your first bay keeps your answers in this browser tab, so you can go back a step. They are deleted when you close the tab, and Start over clears them at once. If you type a work email there, the page guesses your company name from it inside your browser. How many anchors you need, Time spent searching and Your pilot on one page work out their answers in your browser and keep nothing. A brief you download is a file on your own device. Copy puts text on your own clipboard.

**When you send us something.** The contact form and Plan your first bay open a draft email in your own mail app, addressed to sales@amimotion.com. Nothing reaches us until you press send. When you do, we receive what the email contains: usually your name, work email and company, your role and phone number if you gave them, and your answers. We use it only to reply to you and to follow up the enquiry you started. We do not sell it, and we do not add you to a newsletter.

**How long we keep it.** We keep an enquiry for as long as we need it to reply and to follow up, then erase it, unless a law requires us to keep it longer.

**Server logs.** The company that hosts this site may record standard request data, such as your IP address, browser type, the page asked for and the time, to serve the site and keep it secure. We do not use it to build a profile of you.

**Your rights.** Under the DPDP Act you can ask us for a summary of the personal data we hold about you and how we use it. You can ask us to correct, complete, update or erase it. You can name someone to act for you if you die or cannot act yourself. You can withdraw your consent at any time, as easily as you gave it, by writing to us. Withdrawing does not undo what was lawfully done before.

**Complaints.** Write to sales@amimotion.com first, and we will answer you. If you are not satisfied with our answer, you may complain to the Data Protection Board of India.

**Children.** This site is for businesses. It is not meant for children, and we do not knowingly collect a child's personal data.

**Other sites.** A link to another website, such as a video channel, takes you to that site's own privacy terms.

**Changes.** If this notice changes, the new version goes on this page with its date. Last updated: [date set at release].

## close

None. A legal page ends on its contact and date.

## FAQ

None (no FAQPage on a legal notice).

## Internal links

/diagnostic/ ("Plan your first bay"), /tools/anchors/, /tools/search-time/, /tools/pilot/, /contact/, /trust/ ("Trust and data", in the lede line: "For how AmIHub handles your plant's data, see Trust and data."), /trust/people/.

Add the lede link line: `more([("Trust and data", "/trust/"), ("People and privacy", "/trust/people/")])`. This notice covers the website, not AmIHub in a plant; those pages cover the product.

## JSON-LD notes

`WebPage` with `name` "Privacy notice", `dateModified` set at release, `publisher` the Organization `@id`. BreadcrumbList (Home > Privacy). No FAQPage. Keep `noindex` off: buyers' legal teams search for it.

---

## Legal and truth checks

| Line | Ruling | Basis | Condition |
|---|---|---|---|
| Data Fiduciary = Locatepro Technologies Pvt Ltd | PASS | [B8] legal entity; DPDP s.2(i) | Founders to confirm the entity that receives sales@ mail |
| "sets no cookies" | PASS | No `document.cookie` in src or dist | Re-check at release; any host or CDN cookie breaks it |
| "no advertising, analytics or social-media trackers" | PASS | Built pages load nothing off-domain | Re-check at release; adding analytics means rewriting this page first |
| "no fonts or scripts from other companies' servers" | PASS | Self-hosted fonts; no off-domain src | Same |
| sessionStorage, cleared on tab close and Start over | PASS | diagnostic.js lines 33, 34 and restart handler | |
| Company-name guess in the browser | PASS | diagnostic.js `wireLead` | |
| Tools keep nothing | PASS | tools.js | |
| "Nothing reaches us until you press send" | PASS while `leadEndpoint` is empty | config.js | **If `leadEndpoint` is ever set** (e.g. HubSpot), this section must name the processor, say the form sends directly, and the form must say so before submit. Release judge to block otherwise. |
| "We use it only to reply ... We do not sell it ... no newsletter" | PASS on condition | Matches the form's own promise ("Used only to reply about your floor") | Founders' written OK needed: it binds the company's mail practice, not only the site |
| Retention line | PASS on condition | DPDP s.8(7) (erase when the purpose is served, unless law requires retention) | Founders to confirm practice; no fixed period stated, so none is promised |
| Server logs "may record" | PASS | Generic; host not chosen | Name the host and its log retention once chosen (open) |
| Rights: summary, correction, completion, update, erasure, nominee, withdrawal | PASS | DPDP s.11, s.12, s.14, s.6(4), s.6(5) | |
| Complaints: us first, then the Board | PASS | DPDP s.13 (grievance redressal must be used before the Board) | No response time stated (the DPDP Rules set it; legal to confirm before adding a number) |
| Contact sales@amimotion.com for privacy | PASS on condition | Only address in the founders' documents | Open: a dedicated privacy or grievance contact. Required for a Significant Data Fiduciary (a DPO); not expected here, but a named contact is good practice |
| Children | PASS | B2B site; DPDP s.9 | |
| Cross-border transfer | Not stated | Mail provider's server location unknown | Founders to confirm; DPDP s.16 permits transfer except to notified countries, so silence promises nothing false |
| Old "The host may process technical request data" | Kept, plainer | | |

**Readers (simulated panel).**

| Reader | R1 | Line that lost them | Fix | R2 |
|---|---|---|---|---|
| P7 IT and security | 8 | "Which host, and how long are logs kept?" | Host not chosen; logged as open. | 8 (blocked on host) |
| Legal reviewer (P9 side) | 7 | Old page named no fiduciary, no rights, no complaint route | Full DPDP structure | 9 |
| P4 Supervisor (any visitor) | 9 | none | | 9 |

Mean 8.7. Blockers: host name and log retention; founders' OK on the mail-practice lines; a privacy contact.

**Open facts used.** none of O1 to O15.
**Word count:** about 650.
