"""Start small and About us: the buying squad's round 07 copy (team/rounds/07-pages/buying/*.md), fifteen pages:
/start/, /pilot/, /how-to-buy/, /diagnostic/, /tools/ and its three tools, /contact/, /company/, /trust/,
/trust/people/, /privacy/, /films/ and /404. /what-is-amimotion/ and /industrial-spatial-intelligence/ are in
p_platform.py (product squad); /resources/, /faq/ and /glossary/ are in p_learn.py (learn squad)."""
from pathlib import Path
from lib import *

START = ("Start small", "/start/")
ABOUT = ("About us", "/company/")
CAM = "Model-hall still, build_hall.py camera A, t = 0.0"
BAY_ALT = "The model factory floor, all pale except one inspection bay shown in colour with its paths, its waits and its two anchors."
HUB_SLOT = lambda: hallslot("hall-waits-32", f"{CAM}: the hero poster crop of the inspection bay, the queue on amber, everything else pale. Never called AmIHub's screen (O5).", "still",
                        "A model factory floor with paths in blue and waits in amber.")
TALK = ("Rather talk it through?", "The call is a live demo on real AmIHub data, not slides.", (("Book a call", "/contact/"),))
CARD = "(max-width:639px) 100vw, (max-width:1023px) 50vw, 31vw"


def seg(name, opts, stack=False):
    return f'<div class="seg{" stack" if stack else ""}">' + "".join(
        f'<label><input type="radio" name="{name}" value="{v}" data-label="{e(l)}"{" checked" if i == 0 else ""}><span>{l}{f"<i>{s}</i>" if s else ""}</span></label>'
        for i, (v, l, s) in enumerate(opts)) + "</div>"


def rng(id_, name, label, lo, hi, step, val, unit="", small=None):
    return (f'<label class="field"><span class="field-row"><span>{label}</span><output for="{id_}"></output></span>'
            f'<input type="range" id="{id_}" name="{name}" min="{lo}" max="{hi}" step="{step}" value="{val}" data-unit="{unit}">'
            + (f"<small>{small}</small>" if small else "") + "</label>")


def numf(name, label, val, small=None, step="1"):
    return (f'<label class="field"><span>{label}</span><input type="number" name="{name}" value="{val}" min="0" step="{step}" inputmode="decimal">'
            + (f"<small>{small}</small>" if small else "") + "</label>")


P = lambda *xs: "".join(f"<p>{x}</p>" for x in xs)

# ---------------- /tools/anchors/ ----------------
write("/tools/anchors/", "UWB anchor estimator: a first range for your floor",
      "Enter your floor size and racking to get a first range of AmIMo anchors before a site survey. The tool's own assumptions are shown next to its answer.",
      [
          head("How many anchors?", "A first range, before the survey.", "Enter your floor and what stands on it. You get a range to plan a budget around. An AmIMotion site survey sets the real count.",
               short="AmIMotion sets the final anchor count from a site survey, because racking and steel change how far each AmIMo anchor reaches. This estimator gives a first range from your floor size, ceiling height and racking. "
                     "It lays a planning grid over the floor: about 25 m apart for an open hall, 18 m with some racking and 12 m with dense high racking. Each AmIMo anchor reaches about 50 m around it in clear line of sight.",
               trail=[START, ("How many anchors you need", None)]),
          section(
              '<div class="tool-shell"><form class="tool-form" data-tool="anchors" aria-label="How many anchors you need">'
              + rng("a-len", "flen", "Floor length", 10, 400, 5, 100, " m") + rng("a-wid", "fwid", "Floor width", 10, 300, 5, 50, " m")
              + rng("a-h", "height", "Ceiling height", 3, 20, 1, 9, " m")
              + '<fieldset class="field"><legend>What is on the floor?</legend>' + seg("env", [("mixed", "Some racking", None), ("open", "Open hall", None), ("dense", "Dense high racking", None)]) + "</fieldset>"
              + '<fieldset class="field"><legend>Position needed</legend>' + seg("dim", [("3d", "3D, with height", None), ("2d", "2D, floor only", None)]) + "</fieldset>"
              + '</form><div class="tool-out" aria-live="polite"><p class="out-name">First range</p><p class="big" data-out="range">—</p>'
              '<div class="lines"><p>Floor area <b data-out="area">—</b></p><p>Planning grid <b data-out="grid">—</b></p><p>Floor type <b data-out="env">—</b></p><p>Lowest count this tool gives <b data-out="min">—</b></p></div>'
              "<p class=\"note\">A planning estimate from this page's own grid. It is not a quote and not an AmIMotion specification. Angle of arrival can mean fewer anchors. Aisles between high racks can mean more. The survey sets the count.</p>"
              + btns((("Book a call", "/contact/"), ("Anchor planning, explained", "/learn/anchor-planning/"))) + "</div></div>", label="How many anchors you need"),
          section(vp("How the estimate works.", lede="Three assumptions, all of them this page's own."),
                  tiles([("A grid over your floor", "The tool lays a square grid over the floor and counts its corners. The grid is about 25 m for an open hall, 18 m with some racking and 12 m with dense high racking. These spacings are planning assumptions, not a figure from an AmIMotion datasheet."),
                         ("A range, not a number", "It shows a fifth under and a quarter over that count, so you can plan a budget around it. It never gives fewer than 4 anchors for 3D or 3 for 2D."),
                         ("Tall halls", "Above 10 m, the grid closes by a tenth. AmIMo anchors are recommended at 3 to 8 m up, so a tall hall is where the survey matters most.")], 3)),
          section(vp("What the survey adds."),
                  split(None, ['Each <a href="/products/amimo/">AmIMo anchor</a> reaches about 50 m around it in clear line of sight. Racking and steel change that, so we survey your floor and set the count.',
                               'An AmIMo anchor records when each pulse arrives and the angle it came from. <a href="/technology/">Time and angle</a> together can mean fewer anchors than timing alone.',
                               "Each anchor needs only power, from DC or PoE. It syncs over the air and sends its data to AmIHub over Wi-Fi, so there is no data or sync cable to run. Ethernet is also an option.",
                               "With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor."], (), still("amimo"))),
          section(faq([
              ("How many anchors does a UWB system need?", "It depends on the floor. Each AmIMo anchor reaches about 50 m in clear line of sight, but racking, steel and ceiling height change that. AmIMotion sets the final count from a site survey. This tool gives a first range to plan a budget around."),
              ("Do AmIMo anchors need data cables?", "No data or sync cable. Anchors sync over the air and send their data to AmIHub over Wi-Fi. They need only power, from DC or PoE. Ethernet is also an option."),
              ("How high do anchors go?", 'On a column or wall, 3 to 8 m up is recommended. <a href="/specs/">Specifications</a>.'),
          ])),
          close("Get the real count.", "An AmIMotion survey of your floor sets the anchor plan. It starts with a call."),
      ], scripts="tools", app="How many anchors you need")

# ---------------- /tools/search-time/ ----------------
write("/tools/search-time/", "What searching costs: a search-time calculator",
      "Put a number on the hours your team spends looking for trolleys, bins and tools, from your own figures. Runs in your browser. No savings are assumed.",
      [
          head("Time spent searching.", "Your own numbers.", "How many people look, how often and for how long. The calculator multiplies it out. It assumes nothing about savings.",
               short="AmIMotion's search-time calculator multiplies five of your own figures: people who search each shift, searches per person, minutes per search, shifts a day and working days a year. "
                     "It gives hours a year, hours a day and the same time as full-time people, at 8 hours a day. Add a loaded hourly cost to see it in rupees. It shows what searching costs you today. It does not forecast a saving.",
               trail=[START, ("Time spent searching", None)]),
          section(
              '<div class="tool-shell"><form class="tool-form" data-tool="search" aria-label="Time spent searching">'
              + rng("s-p", "people", "People who search, per shift", 1, 200, 1, 12)
              + rng("s-n", "per", "Searches per person, per shift", 1, 40, 1, 4)
              + rng("s-m", "mins", "Minutes per search", 1, 60, 1, 8, " min")
              + rng("s-s", "shifts", "Shifts per day", 1, 3, 1, 2)
              + rng("s-d", "days", "Working days a year", 200, 365, 1, 300)
              + numf("rate", "Loaded cost per hour, ₹ (optional)", "", "Leave empty to see hours only.")
              + '</form><div class="tool-out" aria-live="polite"><p class="out-name">Time spent searching</p><p class="big" data-out="hours">—</p>'
              '<div class="lines"><p>Per day <b data-out="day">—</b></p><p>Full-time people, at 8 h a day <b data-out="fte">—</b></p><p>Cost a year <b data-out="cost">—</b></p></div>'
              '<p class="note">Your numbers, multiplied out. This is what searching costs today, not a forecast of what you would save. A pilot measures the change on your floor.</p>'
              + btns((("Book a call", "/contact/"), ("Measure before you claim", "/learn/pilot-baseline/"))) + "</div></div>", label="Time spent searching"),
          section(vp("Where the numbers come from."),
                  tiles([("Your figures", "The sliders start at 12 people, 4 searches, 8 minutes, 2 shifts and 300 days. Those are only starting positions, not industry averages. Move them to match your floor."),
                         ("The sum", "People, times searches, times minutes, times shifts, times days, divided by 60, gives hours a year. Full-time people divides that by 8 hours for each working day."),
                         ("The cost", "If you add a loaded cost per hour, the tool multiplies the hours by it. Time freed is not the same as money saved, so read it as the cost of searching today.")], 3)),
          section(vp("Count it for real."),
                  split(None, ["Most plants estimate these numbers. A pilot counts them. Before it starts, time how long it takes to find the trolleys in one flow.",
                               "Then AmIMotion tags them. An AmIGo tag rides on each trolley, and AmIHub's live map shows where it was last seen, and when. You find out from a screen, not a walk.",
                               "Time the same searches again with the map open. That difference, on your floor, is the number you can defend."], (),
                        hallslot("hall-find-43", f"{CAM}, cropped close (homepage screen 2 scene, 4:3): the press line on the left and the racks on the right, everything pale except one trolley stopped behind the racks on a blue floor tint, its one blue trail running from the press and ending where it stands.", "photo",
                             "A model factory floor. One trolley stopped between the racks is marked blue. A blue line shows its path and ends where it stopped."),
                        extra=more([("Measure before you claim", "/learn/pilot-baseline/"), ("Where is that trolley?", "/use-cases/find-the-asset/")]))),
          section(faq([
              ("How much time do teams spend searching for trolleys and tools?", "AmIMotion does not publish an average, because it varies too much from floor to floor. Enter your own figures here, then measure them in a pilot before you rely on them."),
              ("Does the calculator include savings?", "No. It shows what searching costs today. Any change has to be measured on your own floor, against a baseline."),
              ("Does my data leave the page?", "No. The calculator works in your browser and keeps nothing."),
          ])),
          close("Find it from a screen.", "On the call we look up tagged things on AmIHub's live map, on real data."),
      ], scripts="tools", app="Time spent searching")

# ---------------- /tools/pilot/ ----------------
write("/tools/pilot/", "Your pilot on one page: a brief to share",
      "Three answers become a one-page AmIMotion pilot brief: what you need to see, where you start and how jobs link to trolleys. Copy, download or email it.",
      [
          head("Your pilot on one page.", None, "Three answers become a brief you can send to your plant head, IT and finance. It is written in your browser.",
               short="AmIMotion's pilot planner turns three answers into a one-page brief. You choose what you need to understand, where you would begin and how work is linked to trolleys today. "
                     "The brief lists what to settle before hardware arrives, such as the zones that matter and who acts when work waits too long. Copy it, download it as a text file or open it as an email. Nothing leaves your browser until you send it.",
               trail=[START, ("Your pilot on one page", None)]),
          section(
              '<div class="tool-shell"><form class="tool-form" data-tool="pilot" aria-label="Your pilot on one page">'
              '<fieldset class="field"><legend>What do you need to understand?</legend>' + seg("q", [("find", "Find tagged trolleys", "Where a trolley was last seen."), ("link", "Link trolleys to jobs", "Which job is on which trolley, and where."), ("wait", "See where work waits", "Zones, visits and how long work sits.")], True) + "</fieldset>"
              '<fieldset class="field"><legend>Where would you begin?</legend>' + seg("area", [("bay", "One production bay", None), ("line", "One line-side flow", None), ("tools", "One tools or fixtures area", None), ("unsure", "Not sure yet", None)]) + "</fieldset>"
              '<fieldset class="field"><legend>How is work linked to trolleys today?</legend>' + seg("link", [("none", "Not defined yet", None), ("scan", "Manual or scanned", None), ("mes", "A record in our MES or ERP", None), ("na", "Not needed", None)]) + "</fieldset>"
              '</form><div class="tool-out" aria-live="polite"><p class="out-name">Your brief</p><p class="brief" data-out="brief"></p>'
              '<p class="acts"><button class="cta" type="button" data-download>Download</button> <button class="cta alt" type="button" data-copy>Copy</button> <a data-out="mail" href="mailto:sales@amimotion.com">Email it</a></p>'
              '<p class="note">Written in this browser. It is not a quote, a feasibility result or a commitment. Email it opens your own mail app.</p></div></div>', label="Your pilot on one page"),
          section(vp("Who the brief is for.", lede="A pilot needs more than one yes."),
                  tiles([("Your plant head", "What the AmIMotion pilot asks, where it runs and what you decide at the end."),
                         ("IT and OT", "Where the anchors go and what they need. Each AmIMo anchor needs only power, and AmIHub can run on an industrial PC inside your plant, with no internet needed."),
                         ("Finance and procurement", "What is in scope, so the prices in the NDA pack can be read against it.")], 3)),
          section(vp("What the brief asks you to settle."),
                  prose("<ul><li>The zones that matter, named in your own words.</li><li>Who on your team acts when work waits too long.</li><li>How to count a wait that runs past shift end.</li>"
                        "<li>A baseline, measured before you compare anything.</li><li>How a job is linked to its trolley, in AmIHub or from your own system, if you need job-level waits.</li></ul>"
                        "<p>Until a job is linked to its trolley, AmIHub shows a trolley's wait, not a job's wait.</p>")),
          section(vp("Read with the brief."),
                  links([("/pilot/", "How a pilot runs", "The five steps the brief starts."),
                         ("/learn/pilot-baseline/", "Measure before you claim", "How to set the baseline."),
                         ("/learn/association/", "Which job is on the trolley?", "Linking trolleys to jobs.")])),
          close("Bring the brief to the call.", "The AmIMotion call is a live demo on real AmIHub data, not slides."),
      ], scripts="tools", app="Your pilot on one page")

# ---------------- /tools/ ----------------
write("/tools/", "Free RTLS planning tools",
      "Four free AmIMotion planning tools: Plan your first bay, an anchor estimator, a search-time calculator and a one-page pilot brief. No sign-up.",
      [
          head("Plan it before the call.", None, "Four free tools. They run in your browser, ask for no sign-up and send nothing unless you choose to.",
               short="AmIMotion offers four free planning tools. Plan your first bay asks six questions and gives back a plan for where to start. How many anchors you need gives a first range from your floor size, before a survey. "
                     "Time spent searching turns your own figures into hours a year. Your pilot on one page writes a brief to share with your team. Each one runs in your browser.",
               trail=[START, ("Tools", None)]),
          # the four tools as linked points, not a related-pages nav: they are the page's content (and keep it over 250 words for crawlers)
          section(vp("Pick the question you have."),
                  tiles([(f'<a href="{h}">{label(h, t)}</a>', d) for h, t, d in [
                      ("/diagnostic/", "Plan your first bay", "Where would location help first? Six questions, and a plan comes back."),
                      ("/tools/anchors/", "How many anchors you need", "How much hardware might one bay take? A first range, before the survey."),
                      ("/tools/search-time/", "Time spent searching", "What does looking for trolleys cost today? Your own numbers, multiplied out."),
                      ("/tools/pilot/", "Your pilot on one page", "How do I explain it to my team? A brief to share.")]], 2)),
          section(vp("What these tools are not."),
                  prose(P("They are planning aids, built from your answers and a few stated assumptions. None of them is a quote, a survey or a forecast of savings. Each AmIMotion tool shows its assumptions next to its answer.",
                          "The real anchor count comes from an AmIMotion survey of your floor. The real change in search time comes from a pilot that measures it, against a baseline set before it starts.",
                          "Nothing you type is stored by this site. A brief you download is a file on your own device. If you email a result, it goes from your own mail app."))),
          section(vp("Then measure it."),
                  links([("/learn/pilot-baseline/", "Measure before you claim", "Set the baseline before the tags go on."),
                         ("/pilot/", "How a pilot runs", "One flow, one bay, five steps.")])),
          close(*TALK),
      ], page="CollectionPage")

# ---------------- /diagnostic/ ----------------
diag = (Path(__file__).resolve().parent / "diag_block.html").read_text().rstrip()
write("/diagnostic/", "Plan your first bay: six questions",
      "Six questions about how work moves in your plant. AmIMotion sketches your floor as you answer and gives you a plan for where to start. Free.",
      [
          head("Plan your first bay.", None, "Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you.",
               short="AmIMotion's floor plan asks six questions: what your team looks for, how they find it today, where work waits longest, how a job is linked to its trolley, where you would start, and your role. "
                     "It sketches your floor as you answer. At the end you get a plan for one bay or line: what to tag first, which zones to name and who should see the live map. Your answers stay in this browser tab until you choose to send them.",
               trail=[START, ("Plan your first bay", None)]),
          section(diag, label="Plan your first bay"),
          section(vp("What you get back."),
                  tiles([("Where work hides", "What your answers say about how work is found today, and where it waits out of sight."),
                         ("A first bay", "Which trolleys, bins or tools to tag first, the zones around them, and the team that should see AmIHub's live map."),
                         ("Questions for a floor walk", "What AmIMotion would ask on your floor, so the first call starts in the right place.")], 3)),
          section(vp("What the plan is, and is not."),
                  prose(P("The plan is a starting point built from six answers. It is not a survey, a quote or a promise about your floor. Racking and steel change how far each AmIMo anchor reaches, so we survey your floor and set the count.",
                          "You can print the plan or save it as a PDF. Start over clears your answers.",
                          'If you choose to send it, the page opens a draft email to AmIMotion in your own mail app, with your plan, your name and your work email. Nothing reaches us until you press send. We use it only to reply about your floor. <a href="/privacy/">Privacy</a>'))),
          section(vp("Then put a number on it."),
                  links([("/tools/anchors/", "How many anchors you need", "A first range from your floor size, before the survey."),
                         ("/tools/pilot/", "Your pilot on one page", "Turn the plan into a brief for your team."),
                         ("/pilot/", "How a pilot runs", "The five steps, from the question to the decision.")])),
          close(*TALK),
      ], scripts="diag", app="Plan your first bay")

# ---------------- /pilot/ ----------------
write("/pilot/", "How a pilot runs: one flow, one bay",
      "An AmIMotion pilot follows one flow in one bay or line. It times today's waits first, surveys the hard places and ends in a decision on your numbers.",
      [
          head("How a pilot runs.", "One flow, one bay.", "An AmIMotion pilot answers one question on one part of your floor. It measures today first, so the numbers at the end mean something.",
               short="An AmIMotion pilot follows one flow in one bay or line. You choose the flow. The pilot times today's waits first, over a window you choose. That is your baseline. "
                     "AmIMotion surveys your floor and sets the anchor count. AmIGo tags go on the trolleys, bins and pallets in that flow, not on people. Your team uses the live map during the shift. "
                     "You see your own waits in one bay, and prove the numbers, before you decide on more.",
               trail=[START, ("How a pilot runs", None)], actions=(("Your pilot on one page", "/tools/pilot/"), ("Plan your first bay", "/diagnostic/")),
               media=render("bay-45", "(max-width:1023px) 100vw, 42vw"), offer=True),   # round 11 R7, the 4:5 crop
          # round 13 (Mercury, Formlabs): the diagnostic's first question, inline; each answer opens it with that answer chosen
          section(vp("Plan your first bay."),
                  qstart("What does your team look for?", [("carriers", "WIP carriers &amp; bins"), ("tools", "Tools &amp; fixtures"), ("vehicles", "Forklifts &amp; tuggers"),
                                                          ("robots", "AGVs &amp; AMRs"), ("goods", "Pallets &amp; finished goods")]), band="surface"),
          section(vp("Five steps, in order.", lede="Each step has to hold before the next one starts."),
                  steps([("The question", "You choose one flow, such as trolleys from the press to inspection. We agree the bay, the zones that matter and the trolleys in scope."),
                         ("Today, measured", 'The pilot times today\'s waits first, over a window you choose. That is your <a href="/learn/pilot-baseline/">baseline</a>. Before it starts, we agree how to count a wait that runs past shift end.'),
                         ("Survey and install", "We survey your floor and set the anchor count. The survey looks at your columns, your power points, your racking and your steel, because each changes how far an AmIMo anchor reaches."),
                         ("Used by people", "Your team finds trolleys and sees waits on AmIHub's live map during the shift. We also agree who on your team acts when work waits too long."),
                         ("A decision", "You see your own waits in one bay, and prove the numbers, before you decide on more. If you go on, you grow plant-wide on the same AmIHub, without re-fitting the first bay.")])),
          section(vp("Who does what.", lede="So you know the effort before you say yes."),
                  tiles([("AmIMotion brings", "Our survey and an anchor plan for your floor. AmIGo tags and AmIMo anchors for one bay or line. AmIHub, running on an industrial PC inside your plant or in the cloud. Local engineers on your site."),
                         ("You bring", "One flow you want to see. A person on the floor who owns it. Power at each anchor point, from DC or PoE. The zones that matter, named in your own words."),
                         ("Your team does", "Walks the survey with us. Names the trolleys in scope. Uses the live map in the shift. Joins the review and decides on the numbers.")], 3)),
          section(vp("What the pilot leaves out."),
                  split(None, ['The pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy. <a href="/trust/people/">People and privacy</a>.',
                               "A plant-wide rollout and a second plant are their own steps, planned after the bay. A second plant gets its own survey.",
                               "Your MES stays in charge of every job. AmIHub adds where its trolley is and how long it has waited.",
                               "Duration and price depend on the bay, the number of tags and the anchor plan. After the first call, AmIMotion shares datasheets, architecture, prices and pilot options under NDA."], (),
                        still("amigo", alt="The AmIGo tag, a small dark grey tag with amimotion on its cover."))),
          section(faq([
              ("What does an AmIMotion pilot involve?", "One flow in one bay or line, chosen by you. AmIMotion surveys the floor and sets the anchor count. AmIGo tags go on the trolleys, bins or pallets in that flow. The pilot times today's waits first, as a baseline. Your team uses the live map in the shift. You see your own waits, and prove the numbers, before you decide on more."),
              ("How long does a pilot take, and what does it cost?", "It depends on the bay, the number of tags and the anchor plan, so AmIMotion does not publish a standard length or price. After the first call, we share datasheets, architecture, prices and pilot options under NDA."),
              ("What if we can't link jobs to trolleys yet?", 'Start with where each trolley is and how long it waits. <a href="/learn/association/">Link each trolley to the job it carries</a> later, in AmIHub or from your own system. Until that link exists, AmIHub shows a trolley\'s wait, not a job\'s wait.'),
              ("How is success judged?", "You agree it before the pilot starts: the baseline, how a wait is counted, and who acts when work waits too long. At the end you compare the bay's numbers with that baseline."),
              ("Will the steel and racking in our bay be a problem?", 'Racking and steel change how far each AmIMo anchor reaches, so we survey your floor and set the count. With these anchors, AmIHub places a tag down to ±10 cm. How close depends on your floor, and the pilot shows it on yours. <a href="/technology/">How it locates a tag</a>.'),
          ], "Questions teams ask first.")),
          close("Put your pilot on one page.", "Three answers become an AmIMotion pilot brief your plant head, IT and finance can read.", (("Your pilot on one page", "/tools/pilot/"),)),
      ])

# ---------------- /films/ ----------------
# The hero film is not yet in src/assets (the homepage owner is rendering it), so the head keeps a slot naming it.
write("/films/", "Films: one floor, in motion",
      "Short AmIMotion films of one model factory floor from above: where tagged trolleys, tools and vehicles went, and where work waits. Muted, no autoplay.",
      [
          head("Films.", "One floor, in motion.", "Short films of one model factory floor, seen from above. Each one shows a single idea, with no sound and nothing to read.",
               short="AmIMotion's films show one model factory floor from above. Blue lines show where tagged trolleys, tools and vehicles went. Amber marks the trolleys and pallets that are waiting. "
                     "The first film runs nine seconds: the same floor before and after AmIMotion, from scan ticks at three desks to every path and wait on one live map.",
               trail=[START, ("Films", None)],
               media=slot("The homepage hero film, 9 s, muted, loops when played, camera A locked. Source team/rounds/03-hero-film/film/hall-4x5-av1.mp4 and hall-4x5-h264.mp4 (1:1 crop on phones), posters poster-1x1-*. Poster first, preload none, controls, no autoplay. "
                          "Engine room to add it to film() as a 4:5 or 1:1 entry.", "1:1",
                          "A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. Three trolleys at inspection and one pallet in a staging lane are marked amber because they are waiting.", "Engine room")),
          section(vp("What you are looking at."),
                  tiles([("Blue", "Where a tagged thing went. An AmIGo tag sends a short UWB pulse as it moves, and AmIMo anchors on the columns hear it."),
                         ("Amber", "Where work waits. AmIHub notes when each trolley or pallet enters a zone and when it leaves, so you see a wait while it is still a wait."),
                         ("Pale", "Everything nobody has tagged.")], 3)),
          section(vp("The nine seconds, in words."),
                  prose(P("The film opens on the floor as AmIMotion shows it. Blue trails run behind every moving thing: the tugger's train, the forklift, an AMR, a trolley leaving the press. Three trolleys in the inspection queue and one pallet in the staging lane stand on amber.",
                          "At two seconds the colour goes. This is the floor as most plants see it. At three checkpoint desks, a short blue tick appears as a trolley passes. Nothing marks the path between desks. One trolley passes a desk, turns behind the racks and stops. No mark follows it.",
                          "Then the ticks join into lines, one kind of thing at a time: trolleys, bins and a fixture, the tool cart, the forklift and tugger, the AMR. The three trolleys and the pallet take their amber again. At nine seconds the frame is back where it began."))),
          section(vp("The same stories, on their own pages."),
                  links([("/use-cases/find-the-asset/", "Where is that trolley?", "The one that turned behind the racks."),
                         ("/solutions/wip/", "Work in progress", "The three trolleys waiting at inspection."),
                         ("/use-cases/ask-your-plant/", "Ask your floor", "A question, answered from the live map."),
                         ("/technology/", "How it locates a tag", "How a pulse becomes a place.")])),
          close("See it on your own floor.", "The AmIMotion call is a live demo on real AmIHub data, not slides."),
      ])

# ---------------- /company/ ----------------
write("/company/", "About AmIMotion: spatial intelligence from Bengaluru",
      "AmIMotion, a brand of Locatepro Technologies, designs and builds UWB tags, anchors and AmIHub software in Bengaluru. Led by Kaushal Kukkar and Vivek Dham.",
      [
          head("Designed in Bengaluru.", "Built in India.", "AmIMotion makes the tags, the anchors and the software that show where work is in a plant, and where it waits. One team builds all three.",
               short="AmIMotion is spatial intelligence for factories and warehouses. It is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. AmIMotion designs and builds AmIGo tags, AmIMo anchors and AmIHub software, on NXP Trimension UWB silicon. "
                     "It is built on the FiRa and omlox specifications. AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.",
               trail=[("About us", None)], actions=(("What is AmIMotion?", "/what-is-amimotion/"), ("How to buy", "/how-to-buy/")),
               media=still("pair", eager=True, alt="The AmIGo tag and the AmIMo anchor side by side, both dark grey with amimotion on the cover.")),
          section(vp("Who leads it."),
                  prose(P("AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO.",
                          "AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. The tags, the anchors and AmIHub are designed and built in India, with local stock and local engineers on your site."))),
          section(vp("What we make."),
                  cards([("/products/amigo/", still("amigo", CARD), "AmIGo tag", "Rides on what moves. Sends a short UWB pulse when it moves and sleeps when it stops."),
                         ("/products/amimo/", still("amimo", CARD), "AmIMo anchor", "Hears every tag. Fixed to a column or wall, it needs only power."),
                         ("/products/amihub/", HUB_SLOT(), "AmIHub", "One live map. Runs on an industrial PC inside your plant, with no internet needed.")], 3)),
          section(vp("How we work."),
                  tiles([("One team, every layer", "AmIMotion designs the tags, the anchors and AmIHub. One contract and one support line cover every layer."),
                         ("Made in India", "Designed and built in India, with local stock and local engineers on your site."),
                         ("Open by design", "Built on the FiRa and omlox specifications. AmIHub connects through open REST, MQTT, WebSocket and omlox hub interfaces, so your team or your integrator can build on it."),
                         ("One bay first", "Every AmIMotion pilot starts with one bay or line. Then it grows plant-wide on the same AmIHub, without re-fitting the first bay.")], 4)),
          section(vp("What we will not claim.", lede="A position is only useful when you know what it can and cannot tell you."),
                  prose(P("A position shows where a trolley is, and AmIHub says when it was last seen. It does not show which job the trolley carries until that job is linked to it. It does not say why work waited. That is for your team to say.",
                          "This site names no customer and shows no customer result. AmIMotion is built on the FiRa and omlox specifications, and claims no formal certification."))),
          section(links([("/what-is-amimotion/", "What is AmIMotion?", "The company in one page."),
                         ("/industrial-spatial-intelligence/", "What is spatial intelligence?", "The category."),
                         ("/trust/", "Trust and data", "Where your data lives."),
                         ("/how-to-buy/", "How to buy", "Call, NDA pack, survey, pilot.")]), label="More about AmIMotion"),
          close(),
      ], page="AboutPage")

# ---------------- /contact/ ----------------
write("/contact/", "Book a call: a live demo on real data",
      "Book a call with AmIMotion. We show AmIHub's live map and an AI question on real data, not slides, and talk through one flow on your floor.",
      [
          head("Book a call.", None, "Tell us where your team walks to check. On the call we show AmIHub's live map on real data, not slides.",
               short="To book a call with AmIMotion, write to sales@amimotion.com or use the form on this page. The call is a live demo on real AmIHub data, not slides: tagged things moving on the live map, and a question typed to an AI assistant. "
                     "Bring one flow where people walk to find work. After the first call, we share datasheets, architecture, prices and pilot options under NDA.",
               trail=[ABOUT, ("Book a call", None)]),
          section('<div class="contact-grid"><div>'
                  '<form class="form" data-contact novalidate>'
                  '<label>Your name<input name="name" autocomplete="name" required></label>'
                  '<label>Work email<input name="email" type="email" autocomplete="email" required></label>'
                  '<label>Company<input name="company" autocomplete="organization" required></label>'
                  '<label>Role (optional)<input name="role" autocomplete="organization-title"></label>'
                  '<label>Which part of your flow needs someone to go and check?<textarea name="flow"></textarea></label>'
                  '<button class="cta" type="submit">Book a call</button><p class="small">Opens a draft to sales@amimotion.com in your own mail app. This site stores nothing you type. <a href="/privacy/">Privacy</a></p></form>'
                  '<div class="draft" data-draft hidden><p><b>Your draft is ready.</b></p><p class="small pre" data-draft-text></p><p class="acts"><a class="cta" data-draft-mail href="mailto:sales@amimotion.com">Open email draft</a> <button class="cta alt" type="button" data-draft-copy>Copy text</button></p></div>'
                  '</div><div>'
                  '<h2 id="next">What happens next</h2><ol class="next-steps"><li>A call, with a live demo on real AmIHub data.</li><li>The NDA pack: datasheets, architecture, prices and pilot options.</li>'
                  '<li>A site survey, and a pilot in one bay or line.</li><li>Then plant-wide, on the same AmIHub, if the bay proves its numbers.</li></ol>'
                  '<h2 id="write">Write directly</h2><p class="lead"><a href="mailto:sales@amimotion.com">sales@amimotion.com</a></p>'
                  '<p class="small">AmIMotion · Locatepro Technologies Pvt Ltd · Bengaluru, India</p>'
                  '</div></div>'),
          section(faq([
              ("What should we bring to the first call?", 'One flow where people walk to find work, roughly how big the area is, and who owns it. <a href="/tools/pilot/">Your pilot on one page</a> helps you write it down.'),
              ("Is the demo on real data?", "Yes. The AmIMotion call is a live demo on real AmIHub data, not slides. It includes a question asked of an AI assistant, answered from the live map."),
              ("Do we need an NDA before the first call?", "No. The first call comes first. After it, we share datasheets, architecture, prices and pilot options under NDA."),
              ("Our plant is outside India. Can we still talk?", "Yes, write to us. AmIMotion is designed and built in Bengaluru, India. Tell us where your plant is, and we will tell you plainly what a survey and support would look like there."),
          ], "Before you write.")),
          close("Rather start on your own?", "Six questions about how work moves in your plant. AmIMotion gives you a plan back before anyone calls you.", (("Plan your first bay", "/diagnostic/"),)),
      ], scripts="tools", page="ContactPage")

# ---------------- /trust/ ----------------
write("/trust/", "Trust and data: where your data lives",
      "Where AmIMotion's data lives and who can read it: AmIHub inside your plant or in the cloud, TLS, roles, API keys, audit logs, and what each claim rests on.",
      [
          head("Trust and data.", "Where your data lives.", "AmIHub can run inside your plant with no internet needed. This page says who can read what, and what each claim on this site rests on.",
               short="AmIMotion's AmIHub runs on an industrial PC inside your plant, with no internet needed, or in the cloud. Every interface uses TLS. You set who sees what, by role. Each system and AI assistant gets its own API key and scope, and every request is logged. "
                     "You set how long the map keeps its history. The figures on this site, such as down to ±10 cm with AmIMo anchors, come from AmIMotion's own published specifications and depend on your floor.",
               trail=[("How it works", "/platform/"), ("Trust and data", None)], actions=(("For developers", "/developers/"), ("People and privacy", "/trust/people/"))),
          section(vp("Where it runs."),
                  tiles([("Inside your plant", "AmIHub runs on an industrial PC inside your plant, with no internet needed. Positions, zones and history do not have to leave your network."),
                         ("In the cloud", "AmIHub can also run in the cloud. The same access controls, audit logs and history settings apply in both.")], 2, big=True)),
          section(vp("Who can read it."),
                  tiles([("Encrypted in transit", "AmIHub uses TLS on every interface, from REST and MQTT to the MCP server."),
                         ("Access by role", "You set who sees what, by role. Each system and each AI assistant gets its own API key and scope."),
                         ("Every request logged", "AmIHub keeps an audit log. For an AI assistant, it records who asked, what was called and what changed."),
                         ("History you set", "You also set how long the map keeps its history."),
                         ("A person approves changes", 'Asking changes nothing. Any change, such as raising a work order in AmIHub, needs a person\'s approval. You can require it from a supervisor. We show it live on a call. <a href="/use-cases/ask-your-plant/">Ask your floor</a>.'),
                         ("Firmware over the air", "AmIHub updates anchor and tag firmware over the air.")], 3)),
          section(vp("What the claims rest on.", lede="Every figure on this site has a source and a condition."),
                  tiles([("Product figures", "They come from AmIMotion's own published specifications and are indicative. Down to ±10 cm needs AmIMo anchors and depends on your floor. A battery life of 1 to 3 years depends on use. Final datasheets are shared under NDA."),
                         ("Standards", "AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification."),
                         ("What a position cannot tell you", 'A position does not show which job a trolley carries until the job is <a href="/learn/association/">linked to it</a>. It does not show that work is done, or why it waited. Those need your links, your zones and your team.'),
                         ("Customers", "This site names no customer and shows no customer result.")], 2, big=True), band="surface"),
          section(faq([
              ("Does AmIHub need the internet?", "No. AmIHub runs on an industrial PC inside your plant, with no internet needed. It can also run in the cloud."),
              ("Can an AI assistant change anything in AmIHub?", "Asking changes nothing. Each assistant gets its own access: read-only, or only the actions you allow. Any change, such as raising a work order, needs a person's approval, and you can require it from a supervisor. Every request it makes is logged. AmIMotion shows it live on a call."),
              ("Does AmIMotion hold a formal certification?", "AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification."),
              ("Does the pilot track people?", "No. The AmIMotion pilot tags trolleys, bins and pallets, not people. Tagging people would be a separate project. It would need its own policy."),
          ])),
          section(links([("/developers/", "For developers", "Interfaces, events and the MCP server."),
                         ("/specs/", "Specifications", "Every figure and its condition."),
                         ("/trust/people/", "People and privacy", "What a pilot tags, and why."),
                         ("/privacy/", "Privacy", "What this website collects, and what it does not.")]), label="More on trust"),
          close("Talk to the team.", "Tell us the flow you want to see. We walk through it with you."),
      ])

# ---------------- /trust/people/ ----------------
write("/trust/people/", "People and privacy: what a pilot tags",
      "An AmIMotion pilot tags trolleys, bins and pallets, not people. The tag goes on the trolley, not on the person pushing it. Here is what the map shows.",
      [
          head("People and privacy.", "The tag goes on the trolley.", "An AmIMotion pilot follows work, not workers. Here is what it tags, what the map shows and who decides.",
               short="An AmIMotion pilot tags trolleys, bins and pallets, not people. The AmIGo tag goes on the trolley, not on the person pushing it. AmIHub's map shows where tagged things are and how long they have waited. "
                     "Tagging people would be a separate project. It would need its own policy. You set who sees what, by role, and how long the map keeps its history.",
               trail=[ABOUT, ("People and privacy", None)]),
          section(vp("What the map shows."),
                  split(None, ["AmIHub shows where each tagged trolley, bin or pallet is, and how long it has waited in a zone. It shows where a tag was last seen, and when.",
                               "In the AmIMotion pilot, no person carries a tag. So no person is on the map, and the map does not show who pushed a trolley.",
                               "Why it waited is for your team to say. A long wait shows where to look in the flow. It does not say who is to blame."], (),
                        hallslot("hall-ask-43", f"{CAM}, homepage screen 4 scene, 4:3 crop on the queue: everything pale, no trails, only the three trolleys in the inspection queue on amber. No people in the hall.", "photo",
                             "The model factory floor with everything pale except three trolleys at inspection, marked amber: the ones that have waited."))),
          section(vp("Who sees what."),
                  tiles([("Access by role", 'You set who sees what, by role. Each system and each AI assistant gets its own access, and every request is logged. <a href="/trust/">Trust and data</a>.'),
                         ("History you set", "You also set how long the map keeps its history."),
                         ("Inside your plant", "AmIHub can run on an industrial PC inside your plant, with no internet needed.")], 3)),
          section(vp("If you ever want to tag people."),
                  prose(P('It is never part of an AmIMotion WIP pilot. Tagging people would be a separate project, outside the pilot. It would need its own policy. Talk to us about it before anything is tagged. <a href="/pilot/">How a pilot runs</a>.',
                          'In India, a location tied to a named person is personal data under the Digital Personal Data Protection Act, 2023. Your own policy would need to cover it. <a href="/privacy/">Privacy</a>.'))),
          section(faq([
              ("Does AmIMotion track workers?", "The AmIMotion pilot tags trolleys, bins and pallets, not people. The tag goes on the trolley, not on the person pushing it. Tagging people would be a separate project. It would need its own policy."),
              ("Can a supervisor see who moved a trolley?", "No. The map shows where the trolley went and when. No person carries a tag in the pilot, so the map does not show who pushed it."),
              ("Who decides how long the history is kept?", "You do. You set how long the map keeps its history."),
              ("Does a tag on a forklift track its driver?", "Forklifts are not part of the WIP pilot. If you tag vehicles later, the map shows the vehicle, and your policy decides how that history is used."),
          ])),
          close("Bring the hard questions to the call.", "Ask who sees what, and how long it is kept. AmIMotion answers on the call, with AmIHub open."),
      ])

# ---------------- /privacy/ ----------------
H = lambda t: f"<h2>{t}</h2>"
write("/privacy/", "Privacy notice",
      "How the AmIMotion website handles personal data: no sign-up, no ads or analytics trackers, tools that run in your browser, and your rights under the DPDP Act.",
      [
          head("Privacy notice.", None, "This notice covers the amimotion.com website. It says what the site collects, what it does not, and what you can ask of us.",
               short="The AmIMotion website has no sign-up, no advertising trackers and no analytics. The planning tools and Plan your first bay run in your browser. Your answers to Plan your first bay sit in this browser tab only, and nothing reaches AmIMotion until you send an email. "
                     "When you write to us, Locatepro Technologies Pvt Ltd uses your details to reply and to follow up the enquiry you started. You can ask to see, correct or erase them under India's Digital Personal Data Protection Act, 2023.",
               trail=[("Privacy", None)], actions=(("Trust and data", "/trust/"), ("People and privacy", "/trust/people/"))),
          section(prose(
              H("Who we are") + "<p>This website is run by Locatepro Technologies Pvt Ltd, Bengaluru, India. AmIMotion is its brand. For personal data you send us through this site, we are the Data Fiduciary under India's Digital Personal Data Protection Act, 2023. Write to us at <a href=\"mailto:sales@amimotion.com\">sales@amimotion.com</a>.</p>"
              + H("What the site does not do") + "<p>There is no sign-up and no account. The site sets no cookies. It loads no advertising, analytics or social-media trackers. It loads no fonts or scripts from other companies' servers.</p>"
              + H("What stays in your browser") + '<p><a href="/diagnostic/">Plan your first bay</a> keeps your answers in this browser tab, so you can go back a step. They are deleted when you close the tab, and Start over clears them at once. If you type a work email there, the page guesses your company name from it inside your browser. '
                '<a href="/tools/anchors/">How many anchors you need</a>, <a href="/tools/search-time/">Time spent searching</a> and <a href="/tools/pilot/">Your pilot on one page</a> work out their answers in your browser and keep nothing. A brief you download is a file on your own device. Copy puts text on your own clipboard.</p>'
              + H("When you send us something") + '<p>The <a href="/contact/">contact form</a> and Plan your first bay open a draft email in your own mail app, addressed to sales@amimotion.com. Nothing reaches us until you press send. When you do, we receive what the email contains: usually your name, work email and company, your role and phone number if you gave them, and your answers. We use it only to reply to you and to follow up the enquiry you started. We do not sell it, and we do not add you to a newsletter.</p>'
              + H("How long we keep it") + "<p>We keep an enquiry for as long as we need it to reply and to follow up, then erase it, unless a law requires us to keep it longer.</p>"
              + H("Server logs") + "<p>The company that hosts this site may record standard request data, such as your IP address, browser type, the page asked for and the time, to serve the site and keep it secure. We do not use it to build a profile of you.</p>"
              + H("Your rights") + "<p>Under the DPDP Act you can ask us for a summary of the personal data we hold about you and how we use it. You can ask us to correct, complete, update or erase it. You can name someone to act for you if you die or cannot act yourself. You can withdraw your consent at any time, as easily as you gave it, by writing to us. Withdrawing does not undo what was lawfully done before.</p>"
              + H("Complaints") + "<p>Write to sales@amimotion.com first, and we will answer you. If you are not satisfied with our answer, you may complain to the Data Protection Board of India.</p>"
              + H("Children") + "<p>This site is for businesses. It is not meant for children, and we do not knowingly collect a child's personal data.</p>"
              + H("Other sites") + "<p>A link to another website, such as a video channel, takes you to that site's own privacy terms.</p>"
              + H("Changes") + "<p>If this notice changes, the new version goes on this page with its date. Last updated: 2 November 2026.</p>"), label="Privacy notice"),
      ])

# ---------------- 404 ----------------
write("/404.html", "Page not found",
      "This page is not here. The AmIMotion homepage and the four sections of the site will get you where you were going.",
      [
          head("This page is not here.", None, "The link may be old, or the address may have a typo. These pages are a good next step.",
               short="AmIMotion is spatial intelligence for factories and warehouses. A small tag rides on each trolley, bin and tool."),
          section(links([("/", "AmIMotion", "The homepage."), ("/platform/", "How it works", "The tag, the anchor and AmIHub."),
                         ("/solutions/", "Where it helps", "Work in progress, trolleys, tools and vehicles."), ("/start/", "Start small", "One flow, one bay."),
                         ("/company/", "About us", "Who makes AmIMotion.")]), label="Pages"),
          close("Not sure where to start?", "Plan your first bay.", (("Plan your first bay", "/diagnostic/"),)),
      ], noindex="true")

# ---------------- /start/ ----------------
write("/start/", "Start small: one bay first",
      "Start with one bay. AmIMotion pilots follow one flow in one bay or line, then grow plant-wide on the same AmIHub. Plan the first bay here.",
      [
          head("Start with one bay.", "Then grow on the same AmIHub.", "AmIMotion starts small on purpose. One flow, in one bay or line, measured on your own floor before anyone talks about more.",
               short="AmIMotion pilots start in one bay or one line. You choose the flow. The pilot times today's waits first, so you have a baseline. You see your own waits in one bay, and prove the numbers, before you decide on more. "
                     "Then you grow plant-wide on the same AmIHub, without re-fitting the first bay.",
               trail=[("Start small", None)], actions=(("Plan your first bay", "/diagnostic/"), ("How a pilot runs", "/pilot/")),
               media=hallslot("hall-bay", f"{CAM}, full frame, the homepage screen 6 scene (one bay in colour), 16:9 crop centred on the inspection bay: the whole hall pale, the inspection station and its queue in full colour with its trails, its waits and the two AmIMo anchors on its columns.", "wide", BAY_ALT)),
          section(vp("Three ways in.", lede="Pick the one that fits where you are today."),
                  tiles([("Not sure where to start", "Plan your first bay. Six questions about how work moves in your plant. You get a plan for where to start, before anyone calls you."),
                         ("You know the flow", "Read how an AmIMotion pilot runs: the five steps, what we bring, what your team does and what you decide at the end."),
                         ("Others need to say yes", "Your pilot on one page turns three answers into a brief you can send to your plant head, IT and finance.")], 3),
                  more([("Plan your first bay", "/diagnostic/"), ("How a pilot runs", "/pilot/"), ("Your pilot on one page", "/tools/pilot/")])),
          section(vp("Your numbers, before the call.", lede="Three AmIMotion tools that run in your browser. Nothing you enter leaves it unless you send it."),
                  links([("/tools/anchors/", "How many anchors you need", "A first range from your floor size and racking, before the survey."),
                         ("/tools/search-time/", "Time spent searching", "Your own figures, multiplied out into hours a year. No savings assumed."),
                         ("/tools/pilot/", "Your pilot on one page", "Three answers, one brief to share with your team.")])),
          section(vp("What a first bay proves."),
                  split(None, ["A pilot follows one flow in one bay or line. AmIGo tags ride on the trolleys, bins or pallets in that flow. AmIMo anchors on the bay's columns hear them. AmIHub shows where each one is and how long it has waited.",
                               "Before it starts, we agree how to count a wait that runs past shift end. We also agree who on your team acts when work waits too long.",
                               "When the bay has shown its numbers, AmIMotion grows plant-wide on the same AmIHub. The first bay is not re-fitted."], (), still("amimo"))),
          section(vp("Read before you plan."),
                  links([("/learn/pilot-baseline/", "Measure before you claim", "Why the baseline comes first, and how to set one."),
                         ("/how-to-buy/", "How to buy", "Call, NDA pack, survey, pilot."),
                         ("/trust/people/", "People and privacy", "What an AmIMotion pilot tags, and why it is not people."),
                         ("/learn/", "Field guides", "Plain answers, one per page.")])),
          close("Not sure which bay?", "Six questions about how work moves in your plant. AmIMotion gives you a plan back before anyone calls you.", (("Plan your first bay", "/diagnostic/"),)),
      ], page="CollectionPage")

# ---------------- /how-to-buy/ ----------------
write("/how-to-buy/", "How to buy: call, NDA pack, survey, pilot",
      "What you buy from AmIMotion and in what order: a call with a live demo, the NDA pack with prices, a site survey, then a pilot in one bay or line.",
      [
          head("How to buy.", "Four steps, in order.", "AmIMotion sells one system, from one team, under one contract. Here is what you buy and how it reaches your floor.",
               short="You buy AmIGo tags, AmIMo anchors and AmIHub from AmIMotion, plus our survey and an anchor plan for your floor. It happens in four steps. First, a call with a live demo on real AmIHub data. "
                     "Second, the NDA pack with datasheets, architecture, prices and pilot options. Third, a site survey and a pilot in one bay or line. Fourth, growth plant-wide on the same AmIHub. One contract and one support line cover every layer.",
               trail=[START, ("How to buy", None)], actions=(("How a pilot runs", "/pilot/"), ("Your pilot on one page", "/tools/pilot/"))),
          section(vp("Four steps."),
                  steps([("A call", "The call is a live demo on real AmIHub data, not slides. Bring one flow where people walk to find work."),
                         ("The NDA pack", "After the first call, AmIMotion shares datasheets, architecture, prices and pilot options under NDA."),
                         ("Survey and pilot", "We survey your floor and set the anchor count. A pilot follows one flow in one bay or line."),
                         ("Grow", "Then grow plant-wide on the same AmIHub, without re-fitting the first bay.")], big=True)),
          section(vp("What you buy.", lede="Three parts, and the work to fit them to your floor."),
                  cards([("/products/amigo/", still("amigo", "(max-width:639px) 100vw, (max-width:1023px) 50vw, 24vw"), "AmIGo tag", "One on each trolley, bin, pallet or tool in scope. One battery lasts 1 to 3 years, depending on use."),
                         ("/products/amimo/", still("amimo", "(max-width:639px) 100vw, (max-width:1023px) 50vw, 24vw"), "AmIMo anchor", "Fixed to a column or wall, 3 to 8 m up. It needs only power, from DC or PoE."),
                         ("/products/amihub/", HUB_SLOT(), "AmIHub", "Works out where each tag is. Runs on an industrial PC inside your plant, with no internet needed, or in the cloud."),
                         ("/pilot/", "", "Survey and plan", "An AmIMotion survey of your floor and an anchor plan for it, so the anchor count fits your racking and steel.")], 4)),
          section(vp("What procurement asks."),
                  tiles([("Who is the supplier?", 'AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru, India. It is led by <a href="/company/">Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO</a>.'),
                         ("Who supports it?", "One contract and one support line cover every layer. AmIMotion designs and builds the tags, the anchors and AmIHub in India, with local stock and local engineers on your site."),
                         ("Are we tied to one supplier?", 'AmIMotion is built on the FiRa and omlox specifications. Your MES, ERP and WMS connect to AmIHub through <a href="/developers/">open REST, MQTT, WebSocket and omlox hub interfaces</a>. Your team or your integrator can build on it at any layer.'),
                         ("What will the quote cover?", "Prices are in the NDA pack, after the first call. If you need hardware, services and software on separate lines, say so on the call.")], 2)),
          section(vp("Bring these to the call.", lede="Four answers make the first AmIMotion call useful."),
                  tiles([("One flow", "Where people walk to find work today."), ("Its size", "Roughly how big the bay or line is."),
                         ("Its owner", "The person on the floor who would act on the map."), ("Its jobs", "How a job is linked to its trolley today, if it is.")], 4),
                  more([("Your pilot on one page", "/tools/pilot/"), ("How many anchors you need", "/tools/anchors/")])),
          section(faq([
              ("What does AmIMotion cost?", "After the first call, we share datasheets, architecture, prices and pilot options under NDA. The cost depends on your floor, so it follows the survey and the anchor plan."),
              ("Can we buy through our integrator?", "Your team or your integrator can build on AmIMotion at any layer, through open interfaces. Tell us on the first call who else will be involved."),
              ("Does AmIMotion hold a formal certification?", "AmIMotion is built on the FiRa and omlox specifications. It claims no formal certification."),
              ("Where is AmIMotion made?", "Designed and built in India, on NXP Trimension UWB silicon. AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru."),
          ])),
          close("Talk to the team.", "Tell us the flow you want to see. We walk through it with you."),
      ])
