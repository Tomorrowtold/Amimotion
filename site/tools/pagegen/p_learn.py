"""Learn squad, round 07: /learn/ and its 14 guides, /glossary/, /faq/, /resources/.

One source for two outputs:
  python3 learn_pages.py --md        writes the per-page .md deliverables next to this file
  import from site/tools/pagegen      (copy as p_learn.py) writes the 18 pages with lib.py blocks

When applied: replace site/tools/pagegen/p_learn.py with this file, and delete the /resources/, /faq/ and
/glossary/ write() calls (and FAQS, TERMS) from p_company.py, so each page is written once.
"""
import re, sys, os
from pathlib import Path

HERE = Path(__file__).resolve().parent
PAGEGEN = HERE.parents[3] / "site" / "tools" / "pagegen"
if __name__ != "__main__" or "--md" not in sys.argv:
    sys.path.insert(0, str(PAGEGEN))
    from lib import *  # noqa
    BUILD = True
else:
    BUILD = False

P = lambda *xs: "".join(f"<p>{x}</p>" for x in xs)
UL = lambda *xs: "<ul>" + "".join(f"<li>{x}</li>" for x in xs) + "</ul>"
OL = lambda *xs: "<ol>" + "".join(f"<li>{x}</li>" for x in xs) + "</ol>"


def TABLE(headers, rows):
    """compare() markup, inlined so it can sit inside an article's prose."""
    s = '<table class="compare"><thead><tr>' + "".join(f'<th scope="col">{h}</th>' for h in headers) + "</tr></thead><tbody>"
    for r in rows:
        s += f'<tr><th scope="row">{r[0]}</th>' + "".join(f'<td data-h="{h}">{c}</td>' for h, c in zip(headers[1:], r[1:])) + "</tr>"
    return s + "</tbody></table>"


ACC = "down to ±10 cm in 3D with AmIMo anchors, depending on the site"

# related-link rows: (href, title, line). Nav URLs show their nav label whatever the title.
L = {
    "india": ("/learn/uwb-rtls-india/", "UWB RTLS in India", "Seven questions for any supplier."),
    "acc": ("/learn/accuracy/", "How accurate is UWB?", "Typical, best case and the hard places."),
    "assoc": ("/learn/association/", "Which job is on the trolley?", "A tag knows the trolley. A link knows the job."),
    "anch": ("/learn/anchor-planning/", "How many UWB anchors?", "What really sets the count."),
    "vs": ("/learn/uwb-vs-rfid/", "UWB, BLE or RFID?", "Choose by the question you ask."),
    "dwell": ("/learn/dwell-time/", "How dwell time is measured", "From zone entry to zone exit."),
    "wip": ("/learn/wip-visibility/", "What is WIP visibility?", "Where each job is, and how long it waited."),
    "mcp": ("/learn/mcp-location-data/", "AI assistants and location data", "MCP, access and approval."),
    "omlox": ("/learn/omlox/", "What is omlox?", "One open hub for every location system."),
    "qual": ("/learn/location-data-quality/", "When a tag goes quiet", "Last seen, never a guess."),
    "mes": ("/learn/value-without-mes/", "Value before the MES link", "What location proves on its own."),
    "base": ("/learn/pilot-baseline/", "Measure before you claim", "The baseline, before any tag goes on."),
    "rtls": ("/learn/rtls/", "What is RTLS?", "Real-time location, plainly."),
    "alt": ("/learn/alternatives/", "Scan, checkpoint or location?", "Each answers a different question."),
    "diag": ("/diagnostic/", "Plan your first bay", "Six questions, a plan back."),
    "pilot": ("/pilot/", "How a pilot runs", "One flow, one bay."),
    "gloss": ("/glossary/", "Glossary", "Floor words and tech words, plainly."),
    "faq": ("/faq/", "Questions", "Short answers about AmIMotion."),
    "anchors_tool": ("/tools/anchors/", "How many anchors you need", "A first range, before the survey."),
    "search_tool": ("/tools/search-time/", "Time spent searching", "Your own numbers, multiplied out."),
    "amimo": ("/products/amimo/", "AmIMo anchor", "Range, angle and power."),
    "amihub": ("/products/amihub/", "AmIHub", "Interfaces and the MCP server."),
    "tech": ("/technology/", "How it locates a tag", "Timing, angle and reflections."),
    "isi": ("/industrial-spatial-intelligence/", "What is spatial intelligence?", "The category, in one page."),
}

# ------------------------------------------------------------------------------------------------
# Pictures. Each is (kind, args, md note). kind "still" = page-graded CAD ladder in lib.STILLS;
# kind "slot" = a reserved slot with brief, ratio, alt and code. Codes L01..L12 are this squad's,
# so they never shift other pages' P-numbers.
# ------------------------------------------------------------------------------------------------
HALL = "Model-hall still from team/rounds/03-hero-film/build_hall.py"
PICS = {
    "pair": ("slot", ("The AmIGo tag and the AmIMo anchor side by side on the page ground, dark grey, at true relative size.", "still",
                      "The AmIGo tag and the AmIMo anchor side by side, both dark grey.", "Realism lab", "L01"),
             "The AmIGo tag beside the AmIMo anchor at true relative size. Source: CAD render pair_scale.png (team/rounds/02-design/renders/), graded to the page ground."),
    "amigo": ("still", ("amigo",), "The AmIGo tag, dark grey, amimotion debossed on the top cover. Source: CAD render amigo_page.png, shipped as still(\"amigo\")."),
    "amimo": ("still", ("amimo",), "The AmIMo anchor with its RJ45 port. Source: CAD render amimo_rj45.png, shipped as still(\"amimo\")."),
    "queue": ("slot", ("Camera A cropped to the inspection station: one trolley inside its zone on a blue tint, the pale queue outline in front with three trolleys on amber, a short blue trail into the queue. No labels, no numbers.",
                       "photo", "A model inspection station. One trolley is being worked on. Three trolleys in the queue in front of it are marked amber because they are waiting.", "Realism lab", "L02"),
              HALL + ": camera A (11 m up, 45 degrees down, 35 mm), cropped 4:3 to the inspection station and its queue. Three trolleys on amber, one in the station on blue. The homepage screen 3 frame, cropped tighter."),
    "boundary": ("slot", ("Camera A cropped close on the queue outline: one trolley stands across the outline, half in and half out, on no tint. The other trolleys sit fully inside on amber.",
                          "photo", "A model queue outline on a factory floor. Three trolleys wait inside it, marked amber. A fourth stands across the line.", "Realism lab", "L03"),
                 HALL + ": camera A, cropped 4:3 to the queue outline; move one extra trolley so it straddles the outline (QUEUE x0 edge). Shows the edge case the guide asks every supplier about."),
    "laststop": ("slot", ("Camera A cropped close: the press line on the left, the racks on the right. Everything pale except one trolley stopped behind the racks on a blue floor tint, its one blue trail running from the press and ending where it stands.",
                          "photo", "A model factory floor. One trolley stopped behind the racks is marked blue. A blue line shows its path from the press and ends where it stopped.", "Realism lab", "L04"),
                 HALL + ": camera A, cropped 4:3 to the press and racks. The homepage screen 2 frame (last seen), reused."),
    "bay": ("slot", ("Camera A, the whole hall pale, one bay in colour with two AmIMo anchors on its columns at 3 to 8 m. No lines from anchors, no rings.",
                     "cine", "A model factory hall seen from above. One bay is in colour, with two dark grey anchors on its columns.", "Realism lab", "L05"),
            HALL + ": camera A full frame 16:9, all pale except one bay with two anchors (V96 framing). No rings, no lines."),
    "trolley": ("slot", ("A close camera on one loaded trolley beside the press: about 2.5 m up, 30 degrees down, 50 mm. The tag box on the top rail is visible. Nothing else in colour.",
                         "photo", "A model trolley loaded with parts beside a press. A small dark grey tag sits on its top rail.", "Realism lab", "L06"),
                HALL + ": new camera C (about 2.5 m up, 30 degrees down, 50 mm) on one loaded trolley at the press, tagbox() on the top rail. The tag box is the hall's simplified shape, not a drawn AmIGo."),
    "checkpoints": ("slot", ("Camera A in its before state: all colour gone, a short blue tick at each of the three checkpoint desks where a trolley passed, and nothing marking the path between desks.",
                             "cine", "A model factory floor in grey. Three checkpoint desks each show a short blue mark where a trolley passed. Nothing marks the path between them.", "Realism lab", "L07"),
                    HALL + ": camera A, the hero film's 'before' frame at about 3.5 s (ticks_at), 16:9."),
    "mixed": ("slot", ("Camera A, the whole hall: blue trails behind the tugger train, the forklift, the AMR and the moving trolleys; three trolleys on amber at inspection, one pallet on amber in the staging lane.",
                       "cine", "A model of a factory floor seen from above. Blue lines show where tagged trolleys, tools and vehicles went. Three trolleys and one pallet are marked amber because they are waiting.", "Realism lab", "L08"),
              HALL + ": camera A, the hero film's poster frame (0.0 s 'after'), 16:9."),
}


# round 08 stills (team/rounds/08-pictures/stills-index.md, learn squad table): L03 and L08 not made, they stay slots
HALL_BASE = {"queue": "hall-inspect-43", "laststop": "hall-find-43", "bay": "hall-bay", "trolley": "hall-trolley-43", "checkpoints": "hall-before"}
ALT_FIX = {"laststop": "A model factory floor. One trolley stopped between the racks is marked blue. A blue line shows its path and ends where it stopped."}


def pic(key):
    if key is None or not BUILD: return None
    kind, args, _ = PICS[key]
    if kind == "still": return still(*args, eager=True)
    if key == "pair": return still("pair", eager=True, alt=args[2])   # L01: the pair ladder now exists
    args = list(args)
    if key in ALT_FIX: args[2] = ALT_FIX[key]
    return slot(*args, base=HALL_BASE.get(key))


# ------------------------------------------------------------------------------------------------
# The 14 guides
# ------------------------------------------------------------------------------------------------
G = []


def guide(**k): G.append(k)


guide(slug="rtls", group="The basics",
      title="What is RTLS? Real-time location, explained",
      desc="A real-time location system (RTLS) uses fixed anchors to locate tagged objects indoors. How it works, what it can and cannot tell you, with AmIMotion.",
      h1="What is RTLS?", soft="Location you can look up, indoors.",
      lede="A plain guide for anyone new to real-time location on a factory floor.",
      short="A real-time location system (RTLS) uses fixed receivers, called anchors, to work out where tagged objects are, usually indoors where GPS does not reach. "
            "A useful record has three parts: which object, where, and when it was seen. AmIMotion is a UWB RTLS. "
            f"AmIGo tags ride on trolleys, bins and tools, AmIMo anchors hear them, and AmIHub software shows each position, {ACC}.",
      pic="pair",
      parts=[("how", "How a position is made", P(
                  "A tag on a trolley sends a short radio pulse as it moves. Anchors fixed on columns and walls record when the pulse arrives, and software turns those times into a position.",
                  "In AmIMotion, the AmIGo tag sends the pulse. Each AmIMo anchor in range records when it arrived and, with its 3D angle-of-arrival antenna, the direction it came from. AmIHub combines timing, angle and the floor map into one position and puts it on the live map.")),
             ("radio", "Which radio it uses", P(
                  "An RTLS can run on ultra-wideband (UWB), Bluetooth Low Energy (BLE), passive RFID, Wi-Fi or a mix. UWB times very short pulses, so it can tell neighbouring lanes apart. BLE is cheaper and usually works at room or zone level. RFID records a read when a tag passes an antenna.",
                  "AmIMotion is built on UWB. AmIMo anchors also range BLE devices and Wi-Fi FTM devices, with device support confirmed per site.")),
             ("can", "What it can tell you", UL(
                  "Where each tagged object is now, or where it was last seen.",
                  "Where it went, as a trail.",
                  "When it entered and left each zone, and how long it stayed.",
                  "Which objects are in an area at a given time.")),
             ("cannot", "What it cannot tell you on its own", P(
                  "Location shows where a trolley is. Location alone does not show which job the trolley carries, whether work on it is finished, or why it is waiting. AmIMotion links each trolley to its job in AmIHub or from your own system, and the reason for a wait stays with your team.")),
             ("check", "A short checklist", P(
                  "Ask any RTLS supplier, AmIMotion included, to show five things live: the right tag on the right object, position quality in your conditions, how old each position is, how jobs are linked to carriers, and who on your team responds. The five tell you more than a moving dot on a demo screen.")),
             ],
      faqs=[("What does RTLS stand for?", "Real-time location system. AmIMotion's RTLS uses UWB tags, anchors and AmIHub software."),
            ("Is RTLS the same as GPS?", "No. GPS uses satellites and works outdoors. An RTLS such as AmIMotion uses anchors installed in your building, so it works indoors."),
            ("Which radio does an RTLS use?", "UWB, BLE, RFID, Wi-Fi or a mix. AmIMotion uses UWB, and the same AmIMo anchors also range BLE and Wi-Fi FTM devices, with device support confirmed per site."),
            ("Does RTLS work outdoors?", "AmIMo anchors work indoors and in sheltered outdoor areas, such as a yard under a canopy.")],
      related=["vs", "wip", "gloss"])

guide(slug="uwb-vs-rfid", group="Choosing a system",
      title="UWB vs BLE vs RFID for tracking WIP and trolleys",
      desc="UWB, BLE, RFID or barcode for trolleys, bins and WIP? A fair way to choose by the question you ask, and where AmIMotion's UWB fits.",
      h1="UWB, BLE or RFID?", soft="Choose by the question you ask.",
      lede="A fair way to pick a radio for trolleys, bins and work in progress.",
      short="Choose by the question your team needs answered. If you need to know that a trolley passed a gate or a station, an RFID portal or a barcode scan is often enough. "
            "If you need to know which hall or large zone it is in, BLE can do it at low cost. "
            "If you need to tell neighbouring lanes and queues apart, and see how long work waited in each, use UWB. "
            f"AmIMotion is a UWB system, {ACC}, and the same anchors also range BLE and Wi-Fi FTM devices.",
      pic="checkpoints",
      parts=[("observe", "What each one observes", P(
                  "<strong>Barcode or QR scan.</strong> A person or a fixed scanner records an event: this carrier, at this station, at this time. Nothing is known between scans.",
                  "<strong>Passive RFID (UHF).</strong> A battery-free tag is read when it passes a reader antenna, usually at a portal, a dock door or a station. Like a scan, RFID gives an event at a read point, without a person.",
                  "<strong>Bluetooth Low Energy (BLE).</strong> Battery tags are heard by receivers. Signal-strength methods usually place a tag at room or zone level.",
                  "<strong>Ultra-wideband (UWB).</strong> Tags and anchors time very short radio pulses (IEEE 802.15.4z). The result is a continuous position, precise enough to tell neighbouring lanes and queue positions apart. UWB infrastructure costs more than BLE, and anchors are planned from a site survey.")),
             ("choose", "Choose by workflow", TABLE(["The question your team asks", "What usually fits"], [
                  ("Did this trolley reach the station or leave through the gate?", "Barcode scan or RFID portal"),
                  ("Which hall or large zone is this bin in?", "BLE"),
                  ("Which of two neighbouring queues is this job in, and in what order?", "UWB"),
                  ("How long did this work wait between operations?", "UWB, or scans at every boundary if people scan every time"),
                  ("Where are forklifts and AMRs relative to loads?", "UWB")])),
             ("wip", "Trolleys and WIP specifically", P(
                  "A tag on a trolley tells you where the trolley is, not which job it holds. For WIP visibility you also need a link between carrier and job. The same holds for every technology on this page, AmIMotion included.",
                  "Scans and RFID already give events where work changes hands. The gap is usually the time in between: work waiting beside a cell, or in a queue nobody scans. Continuous UWB position from AmIMotion earns its cost in that gap.")),
             ("vendors", "Which vendors to evaluate", P(
                  "For UWB, plants look at global suppliers and Indian makers. AmIMotion, in Bengaluru, is an Indian maker of UWB tags, anchors and software. The <a href=\"/learn/uwb-rtls-india/\">guide to UWB RTLS in India</a> lists suppliers and the questions to ask. For RFID and BLE there are many reader and tag makers.",
                  "Ask every vendor, AmIMotion included, the same three questions: accuracy measured how, what the infrastructure needs, and how a job gets linked to a carrier.")),
             ("combine", "Combining them", P(
                  "These are not rivals. Keep scans where the process already needs them, and add continuous location only where work goes quiet. AmIMo anchors also range BLE devices and Wi-Fi FTM devices, so one AmIMotion installation can serve more than one kind of device, with device support confirmed per site.")),
             ],
      faqs=[("Is UWB more accurate than BLE?", "Generally, yes. UWB times very short pulses, while most BLE systems estimate distance from signal strength. AmIMotion's UWB reaches down to ±10 cm in 3D with AmIMo anchors. Real accuracy for either depends on the site."),
            ("Is RFID enough to track WIP?", "For events at fixed read points, often yes. RFID does not show position or waiting time between readers unless you add more read points."),
            ("Can one system read UWB and BLE tags?", "Some can. AmIMo anchors range UWB, BLE and Wi-Fi FTM from the same unit, with device support confirmed per site."),
            ("When is UWB worth the extra cost?", "Where work waits between read points and people walk to find it. Where a scan at each step already answers the question, a scan may be enough.")],
      related=["alt", "assoc", "india"])

guide(slug="alternatives", group="Choosing a system",
      title="Scans, RFID checkpoints or UWB: how to choose",
      desc="Barcode scans, RFID checkpoints or UWB location: a fair way to decide which your workflow needs, and when to add AmIMotion to the scans you keep.",
      h1="Scan, checkpoint or location?", soft="Each one answers a different question.",
      lede="How to decide what your flow needs, before you buy anything.",
      short="Start with the question. Do you need a person to confirm a step, proof that something passed a point, or where it is right now? "
            "A barcode scan confirms a step. An RFID checkpoint proves passage without a person. "
            f"UWB location, such as AmIMotion, shows where work is between those points and how long it waits, {ACC}. "
            "Many plants keep their scans and add location only where work goes quiet.",
      pic=None,
      parts=[("side", "Side by side", TABLE(["", "Barcode scan", "RFID checkpoint", "UWB location"], [
                  ("Who acts", "A person scans", "Nobody, at the read point", "Nobody"),
                  ("What you learn", "A step is confirmed", "An item passed this point", "Where it is, where it went, how long it waited"),
                  ("Between points", "Nothing", "Nothing", "Continuous position"),
                  ("What you install", "Scanners and labels", "Reader antennas at each point", "Anchors on columns, planned from a site survey")])),
             ("scan", "When a scan is right", P(
                  "A scan is a deliberate confirmation of an item or a step, such as a quality check. If that is all your process needs, improve the scanning first. AmIMotion does not replace a scan that confirms a step.")),
             ("check", "When a checkpoint is enough", P(
                  "If you only need to know that an item passed a point, such as a dock door, test an RFID checkpoint against exactly that. A checkpoint answers a passage question well.")),
             ("loc", "When location adds something", P(
                  "If work moves between scans and people go looking for it, location answers a new question. With AmIMotion, AmIHub shows where each tagged trolley was last seen and how long it has waited in each zone. Location still needs a link to the job and a tested installation.")),
             ("effort", "Compare the whole effort", P(
                  "Count everything: anchors or readers, the survey, power, network, tag mounting, reassigning tags, upkeep and the exceptions people handle by hand. Compare the cost of useful answers, not hardware prices alone. AmIMo anchors need power from a DC adapter or PoE, and no data or sync cabling.")),
             ("test", "Use the same test", P(
                  "Give every option the same scenario and the same measures. Record what each one sees, what it misses and how much human effort it needs. Run the same test on AmIMotion in a one-bay pilot.")),
             ],
      faqs=[("Do we have to replace barcode scanning?", "No. Keep scans where a person must confirm a step. AmIMotion adds location where work moves and waits between scans."),
            ("When is RFID the better choice?", "When you need proof that items passed fixed points, such as dock doors, and nothing in between."),
            ("How do we compare the options fairly?", "Give each one the same scenario, the same measures and the same time on the floor, then compare what each saw and missed.")],
      related=["vs", "rtls", "pilot"])

guide(slug="uwb-rtls-india", group="Choosing a system",
      title="UWB RTLS companies in India: how to choose",
      desc="How to choose a UWB RTLS company in India: accuracy evidence, anchor cabling, on-premise data, MES links, standards and local support. AmIMotion is one.",
      h1="UWB RTLS in India.", soft="How to choose.",
      lede="Seven questions to ask any supplier, global or Indian, and how AmIMotion answers them.",
      short="Plants in India can choose global RTLS suppliers or an Indian maker. Global RTLS suppliers include HID, which acquired the UWB maker Sewio in 2024, Ubisense, KINEXON, Pozyx and Zebra. "
            "AmIMotion, a brand of Locatepro Technologies in Bengaluru, designs and builds its UWB tags, anchors and AmIHub software in India, and starts with work-in-progress visibility in manufacturing. "
            f"AmIMo anchors locate AmIGo tags {ACC.replace('down to ±10 cm in 3D with AmIMo anchors', 'down to ±10 cm in 3D')}. Judge every supplier on the same seven questions.",
      pic="amigo",
      parts=[("who", "Who plants look at", P(
                  "Plants evaluating real-time location in India usually see a mix of global suppliers and Indian makers. The suppliers differ in radio (UWB, BLE or both), software, integration and support. The questions below work for all of them.",
                  "AmIMotion is a brand of Locatepro Technologies Pvt Ltd, Bengaluru. AmIMotion designs and builds its tags, anchors and software in India, with local stock and local engineers on site.")),
             ("seven", "Seven questions to ask", OL(
                  "<strong>What accuracy, measured how?</strong> Ask for typical accuracy and the conditions behind it, then measure it in your hardest area during a pilot. A best-case number is not an acceptance plan.",
                  "<strong>What do the anchors need?</strong> Power, data cabling and sync cabling change installation time and cost in a running plant. Ask which of the three each anchor needs.",
                  "<strong>Where does the data live?</strong> Many plants want location data on-premise with no internet dependency. Ask whether on-premise and cloud run the same software.",
                  "<strong>How does it reach MES, ERP and WMS?</strong> Ask for the interfaces, such as REST, MQTT, WebSocket and omlox, and who builds the connector.",
                  "<strong>Which standards?</strong> FiRa covers UWB interoperability and omlox covers open location data. Ask whether a product follows the specification or has passed a formal certification, and read the claim as stated.",
                  "<strong>Who supports it?</strong> A location system needs a survey, tuning and changes as the floor changes. Ask where the engineers are and where spares are stocked.",
                  "<strong>How small can the pilot be?</strong> One bay or one line, with a baseline measured before tags go on, is usually enough to decide.")),
             ("skip", "One question suppliers skip", P(
                  "Ask how the system knows which job is on a tagged trolley. Location alone does not show it. A good answer describes a link between carrier and job, with a start, an end and an owner. The <a href=\"/learn/association/\">guide to carrier-to-job links</a> explains what to ask. Ask AmIMotion the same question.")),
             ("amimotion", "How AmIMotion answers them", TABLE(["Question", "AmIMotion's answer"], [
                  ("Accuracy", "Down to ±10 cm in 3D, typical, with AmIMo anchors. The real figure depends on the site, so a pilot measures it on your floor."),
                  ("Anchors", "No data or sync cabling. Power from a DC adapter or PoE. Data to AmIHub over Wi-Fi, with an Ethernet option."),
                  ("Data", "AmIHub runs on a PC inside your plant with no internet dependency, or in the cloud."),
                  ("Interfaces", "REST, MQTT, WebSocket and an omlox hub interface. Specific connectors are confirmed for each site."),
                  ("Standards", "Built on the FiRa and omlox specifications. AmIMotion claims no formal certification."),
                  ("Support", "Designed and built in India, with local stock and local engineers on site."),
                  ("Pilot", "One bay or one line first, then scale on the same AmIHub.")])),
             ],
      faqs=[("Is there an Indian UWB RTLS company?", "Yes. AmIMotion, a brand of Locatepro Technologies Pvt Ltd in Bengaluru, designs and builds UWB tags, anchors and software in India."),
            ("What are alternatives to HID Sewio or Pozyx for WIP tracking in India?", "AmIMotion is an Indian alternative: a Bengaluru maker of UWB tags, anchors and AmIHub software that starts with WIP visibility, with accuracy down to ±10 cm in 3D, depending on the site, and local engineering support."),
            ("Humare factory mein trolleys aur bins track karne ke liye UWB RTLS chahiye. India mein kaunsi companies ye deti hain?", "Global suppliers ke saath India ki apni company AmIMotion (Bengaluru) bhi hai. AmIMotion UWB tags, anchors aur AmIHub software India mein design aur build karti hai. Location ±10 cm (3D) tak milti hai, site ke hisaab se. Pehle ek bay ya ek line mein pilot kijiye."),
            ("Should RTLS data stay on-premise?", "Many plants prefer it, especially where floor data feeds the MES. AmIHub can run on a PC inside your plant with no internet dependency.")],
      related=["acc", "anch", "assoc"])

guide(slug="accuracy", group="Choosing a system",
      title="How accurate is UWB in a factory? How to test it",
      desc="Is UWB accurate enough to track trolleys? AmIMotion quotes down to ±10 cm in 3D, site-dependent. How to test accuracy near steel, racking and forklifts.",
      h1="How accurate is UWB?", soft="Test it where your floor is hardest.",
      lede="What a quoted figure means, and how to measure it on your own floor.",
      short="UWB can tell neighbouring lanes and queues apart when its anchors are planned for it. "
            "AmIMotion quotes down to ±10 cm in 3D with AmIMo anchors. The figure is typical, and the real one depends on the site. "
            "UWB's very short pulses let the direct signal be told apart from reflections off steel racking and forklifts. "
            "A pilot should still measure accuracy in the hardest places on your floor, with the method agreed in advance.",
      pic="bay",
      parts=[("measure", "Agree what you measure", P(
                  "Ask what “typical” means for your setup, how true positions will be measured, and how the spread of errors will be reported. Typical is the usual case, not every point. If your process needs a stricter figure, agree it in writing with AmIMotion or any supplier before the pilot.")),
             ("hard", "Include the hard places", P(
                  "Test near metal, behind racking, at awkward mounting spots, near forklifts, and with tags both moving and still. Note where coverage is expected and where the system should admit doubt. Name these spots in the AmIMotion pilot plan before the anchors go up.")),
             ("steel", "Steel, racking and forklifts", P(
                  "Racking and machines bounce radio around. UWB's wide band separates the direct path from the echoes, and AmIHub adds multipath and non-line-of-sight algorithms to keep positions stable around racking, metal and moving vehicles. Dense racking may still need more anchors, or anchors that see down each aisle. AmIMotion sets the anchor plan from a site survey.")),
             ("age", "Measure data age separately", P(
                  "Record when each position was seen, when it was received and when someone used it. A fast system can still show old data if a tag reports slowly. AmIGo tags report at a rate set per tag group, from 0.1 to 10 times a second, so set a freshness target for each task.")),
             ("person", "End with a person", P(
                  "Give a supervisor a real task. Can they find the right trolley and its job, and see how old the position is? Record how much they had to correct. The figure that matters is whether the AmIMotion map sends them to the right place.")),
             ],
      faqs=[("Is UWB accurate enough to track trolleys in a factory?", "Usually, yes, when anchors are planned for the floor. AmIMotion locates tags down to ±10 cm in 3D with AmIMo anchors, typical and site-dependent, which is enough to tell neighbouring lanes and queues apart. Measure it on your floor in a pilot."),
            ("Does UWB work around steel racking and forklifts?", "UWB's very short pulses separate the direct signal from reflections off steel, and AmIHub adds multipath and non-line-of-sight handling. Dense racking can need extra anchors, which a site survey shows."),
            ("Does ±10 cm mean every reading is within 10 cm?", "No. Down to ±10 cm is typical with AmIMo anchors in good conditions. A pilot reports the spread of errors on your floor."),
            ("Is the ±10 cm figure 2D or 3D?", "3D, typical, with AmIMo anchors. AmIHub works out each position in 3D from pulse timing and the anchors' 3D angle of arrival.")],
      related=["anch", "qual", "base"])

guide(slug="anchor-planning", group="Choosing a system",
      title="How many UWB anchors do I need?",
      desc="How many UWB anchors a 5,000 m² shop floor needs: what sets the count, a worked example, and why AmIMotion sets the final number from a site survey.",
      h1="How many UWB anchors?", soft="Fewer than area suggests, more than racking allows.",
      lede="What sets the count, a worked example, and where the real number comes from.",
      short="No honest formula gives an anchor count from floor area alone. The count depends on the accuracy you need, 2D or 3D, the positioning method, ceiling height, and how much racking and metal block line of sight. "
            "An AmIMo anchor reaches about 50 m in line of sight, indicative and site-dependent, and AmIMotion's angle of arrival works with as few as two anchors in view. "
            "As a first budget only, an open 5,000 m² hall on this site's 25 m planning grid needs about 15 anchors. AmIMotion sets the final count from a site survey.",
      pic="bay",
      parts=[("sets", "What sets the count", P(
                  "<strong>The task.</strong> “Which hall?” needs far fewer anchors than “which of two neighbouring lanes?”.",
                  "<strong>The method.</strong> With TDoA a tag must be heard by several anchors at once: at least three for 2D and four for 3D. With two-way ranging plus angle of arrival, fewer are needed, and AmIMo anchors work with as few as two in view.",
                  "<strong>Line of sight.</strong> Tall racking, machine guards, mezzanines and parked vehicles block the direct path. Aisles between high racks often need anchors that see down each aisle.",
                  "<strong>Geometry.</strong> Anchors in a straight line give poor accuracy across that line. Spread them around the area where tags move.",
                  "<strong>Mounting and power.</strong> AmIMo anchors go on columns, walls, ceiling structure or poles, 3 to 8 m up, and need power from a DC adapter or PoE.")),
             ("example", "A worked example", P(
                  "Take an open hall of 100 × 50 m (5,000 m²) with clear sight lines. Planned on a 25 m grid, that is 5 × 3 = 15 anchor positions. With mixed racking, a grid of about 18 m gives about 28. Dense high racking can need a grid of 12 m or less.",
                  "The grids are this site's planning assumptions for a first budget, not an AmIMotion specification. Try your own floor in the <a href=\"/tools/anchors/\">anchor estimator</a>, then let a survey set the number.")),
             ("steps", "How to get to a number", OL(
                  "Mark the areas where location changes a decision. Leave the rest out of scope.",
                  "Write the accuracy and update rate each area needs.",
                  "Note ceiling height, racking, aisles and large metal objects.",
                  "Choose a positioning method per area. AmIMo anchors select the mode per zone.",
                  "Lay out anchors for sight lines and geometry, then confirm with a survey and a short pilot in the hardest spot.")),
             ("ask", "Questions to ask any supplier", P(
                  "Is the anchor count from a survey of my floor or a rule of thumb? What accuracy is it designed for, and where will it be worse? What cabling does each anchor need? How is accuracy measured at acceptance? AmIMotion answers each one from the site survey.")),
             ],
      faqs=[("Can I calculate UWB anchors from floor area?", "Only roughly. Area ignores racking, ceiling height, metal and the accuracy you need. Use area for a first budget, then a site survey for the plan."),
            ("How far does a UWB anchor reach?", "An AmIMo anchor reaches about 50 m in line of sight, indicative and site-dependent. Obstructions reduce the useful range."),
            ("Do UWB anchors need network cables?", "AmIMo anchors need no data or sync cabling: they sync over the air and send data over Wi-Fi, with an Ethernet option. Each needs power from a DC adapter or PoE, and PoE runs over a network cable."),
            ("How high are anchors mounted?", "AmIMo anchors are mounted 3 to 8 m up, on walls, columns, ceiling structure or poles.")],
      related=["anchors_tool", "amimo", "acc"])

guide(slug="omlox", group="The basics",
      title="What is omlox? The open standard for RTLS",
      desc="omlox is an open standard for industrial location, so different technologies and vendors feed one hub. What it means, and how AmIMotion is built on it.",
      h1="What is omlox?", soft="One open hub for every location system.",
      lede="The open standard behind interoperable industrial location, in plain words.",
      short="omlox is an open standard for interoperable industrial location systems. The standard defines a common hub interface and data model, so location data from different technologies and vendors, such as UWB, BLE and RFID, can feed one location hub. "
            "AmIMotion is built on the FiRa and omlox specifications. AmIHub offers an omlox hub interface next to REST, MQTT and WebSocket, "
            f"and its UWB positions reach {ACC}.",
      pic=None,
      parts=[("why", "Why omlox exists", P(
                  "Plants often end up with several location systems: RFID at the docks, BLE for one area, UWB for carriers, a fleet manager for robots. omlox lets them meet in one hub instead of one integration per vendor. A plant that adds AmIMotion can keep its other location sources in the same model.")),
             ("parts", "The parts", P(
                  "omlox covers a hub that collects location data and a standard way for devices and systems to talk to it. Applications read one model of objects, zones and positions, whatever technology produced them. AmIHub's omlox hub interface is one of those standard ways in and out.")),
             ("fira", "And FiRa?", P(
                  "The FiRa Consortium is an industry body that defines interoperable UWB specifications and runs certification programmes for UWB devices. FiRa covers the radio. omlox covers the location data above it. AmIMotion is built on both specifications.")),
             ("certification", "A specification, or a certification?", P(
                  "Following a specification is a company's own statement. A formal certification means an authorised body has tested the product against the specification. AmIMotion describes itself as built on the FiRa and omlox specifications, and that is the claim to read.")),
             ("amimotion", "omlox in AmIMotion", P(
                  "AmIHub has an omlox hub interface, and its data and device model follow the FiRa and omlox specifications. The same positions and events are available over REST, MQTT and WebSocket. AmIMotion keeps your location data open, whichever systems you add later.")),
             ],
      faqs=[("What is omlox?", "An open standard for industrial location systems, so different technologies and vendors can feed one location hub. AmIMotion is built on the omlox specification."),
            ("Does AmIMotion hold FiRa or omlox certification?", "AmIMotion is built on the FiRa and omlox specifications. AmIMotion claims no formal certification."),
            ("What is FiRa?", "The FiRa Consortium defines interoperable UWB specifications and runs certification programmes for UWB devices."),
            ("Do I need omlox to use AmIMotion?", "No. AmIHub also offers REST, MQTT and WebSocket. omlox matters most when several location systems must feed one hub.")],
      related=["tech", "vs", "gloss"])

guide(slug="wip-visibility", group="The basics",
      title="What is WIP visibility? Tracking vs visibility",
      desc="WIP visibility means knowing where each job is and how long it waited. How it differs from WIP tracking, what it needs, and how AmIMotion builds it.",
      h1="What is WIP visibility?", soft="Where each job is, and how long it waited.",
      lede="What it means, what it needs, and where a plant should start.",
      short="WIP (work-in-progress) visibility means knowing where each job physically is and how long it has waited at each step. WIP tracking shows where a carrier is. Visibility adds which job the carrier holds and its time in each zone. "
            f"AmIMotion builds it from three parts: AmIGo tags on trolleys and bins, AmIMo anchors that locate them {ACC.replace(' with AmIMo anchors', '')}, "
            "and AmIHub software, where each carrier is linked to its job and every zone entry and exit is time-stamped.",
      pic="queue",
      parts=[("needs", "Three things it needs", P(
                  "<strong>A tag on the carrier.</strong> The trolley, bin or rack carries its own AmIGo tag.",
                  "<strong>A reliable position.</strong> AmIMo anchors locate the tag, and every reading carries its time. UWB can tell neighbouring queues apart.",
                  "<strong>A link to the job.</strong> Each trolley is linked to the job it carries, in AmIHub or from your own system.")),
             ("tells", "What it tells you", P(
                  "Where a job is, where it has been, when it entered each zone and how long it has waited, while it is still waiting. In AmIMotion, supervisors see each wait live during the shift, not at the next morning's review. A long wait is a reason for a named person to go and look.")),
             ("not", "What it cannot tell you", P(
                  "Being in a zone does not prove work started or finished. A long wait does not explain why. Location never authorises an action by itself. AmIMotion leaves the reason for a wait with your team.")),
             ("start", "How to start", P(
                  "Ask one question first: which part of the flow makes people walk the floor to find out what is happening? Tag that flow's trolleys, agree a few zones, and name who acts when work waits too long. Measure how work is found before and after. AmIMotion starts with one bay or one line.")),
             ],
      faqs=[("What is the difference between WIP visibility and WIP tracking?", "Tracking shows where a carrier is. Visibility adds which job it holds and how long it waited in each zone. AmIMotion adds the job through a link in AmIHub."),
            ("Which companies offer real-time WIP tracking for manufacturing?", "Several RTLS suppliers do. AmIMotion, from Bengaluru, starts with WIP visibility in manufacturing, using UWB down to ±10 cm in 3D, depending on the site."),
            ("Where should a plant start?", "With one flow where people walk to find work, such as machining to assembly, in one bay or one line."),
            ("Does WIP visibility mean tagging every part?", "No. AmIMotion tags the carrier: the trolley, bin or rack. The job it holds comes from the carrier-to-job link.")],
      related=["dwell", "assoc", "diag"])

guide(slug="dwell-time", group="On the floor",
      title="How dwell time is measured in manufacturing",
      desc="Dwell time is the time a carrier spends in a zone, from entry to exit. How RTLS measures it, what it includes, and how AmIMotion shows where WIP waits.",
      h1="How is dwell time measured?", soft="From zone entry to zone exit.",
      lede="What dwell includes, where the edge cases hide, and how AmIMotion times every wait.",
      short="Dwell time is the time a tagged carrier spends inside an agreed zone, from the moment it enters to the moment it leaves. A real-time location system measures it by time-stamping every zone entry and exit. "
            f"AmIMotion does this in AmIHub, with AmIGo tags located {ACC.replace(' with AmIMo anchors', '')}, so neighbouring queues and stations can be told apart. "
            "You see how long each carrier has waited while it is still waiting.",
      pic="queue",
      parts=[("zones", "Start with the zones", P(
                  "A zone is an agreed area of the floor, such as an inspection queue or a dock lane. Draw zones around the process, not around radio coverage. In AmIHub you name the zones yourself. Neighbouring zones need positions precise enough to tell them apart, which is why UWB is used where queues sit side by side.")),
             ("entry", "Entry, exit and the edge", P(
                  "Every time a tag crosses a zone boundary, AmIHub records a time. Agree what counts as a visit: a short pass through a zone on the way somewhere else should not count as waiting. A trolley parked across a boundary is the hard case. Agree a rule for it before the pilot, and ask any supplier, AmIMotion included, to show how its system handles that case.")),
             ("includes", "What dwell includes", P(
                  "Dwell is not cycle time. Dwell includes waiting, processing, breaks and anything else that happens while the carrier sits in the zone. To separate waiting from working you need another signal, such as a start or finish event from your MES, or a scan. AmIHub can take those events from your own systems.")),
             ("shift", "Waits that cross a shift", P(
                  "A wait can start on one shift and end on the next. Before an AmIMotion pilot starts, we agree how to count a wait that runs past shift end, so every report reads the same way.")),
             ("use", "Using it well", UL(
                  "Name who on your team acts when work waits too long.",
                  "Compare dwell by shift, product and station, not just averages.",
                  "Treat a long dwell as a reason to look, not as a diagnosis.")),
             ("amimotion", "How AmIMotion does it", P(
                  "AmIHub time-stamps every enter, exit, idle and dwell event and keeps the history, so you can ask for time in zone by shift, station or time window. AmIHub also sends each entry and exit to any system you name, as it happens, over MQTT, REST or WebSocket. Why work waited is for your team to say.")),
             ],
      faqs=[("How can I see where work in progress is waiting?", "Tag the carriers, name the zones where work queues, and time every entry and exit. AmIHub shows how long each tagged carrier has waited in each zone."),
            ("Is dwell time the same as cycle time?", "No. Dwell is time in a zone and includes waiting and processing. Cycle time needs process start and finish events, which AmIHub can take from your MES."),
            ("Do we need an MES to measure dwell?", "No. Dwell comes from location and time alone. The MES link adds which job was waiting."),
            ("How is a wait that runs past shift end counted?", "AmIMotion agrees the rule with your team before the pilot starts, so every report counts it the same way.")],
      related=["wip", "assoc", "base"])

guide(slug="association", group="On the floor",
      title="Which job is on the trolley? Carrier-to-job links",
      desc="An RTLS tag identifies a trolley, not its job. How carrier-to-job links work, who owns them, and how AmIMotion links tagged carriers to jobs.",
      h1="Which job is on the trolley?", soft="A tag knows the trolley. A link knows the job.",
      lede="Why location needs a link to the job, and what to agree before a pilot.",
      short="An RTLS tag identifies the trolley, not the job on it. To know which job is on a trolley, the system needs a carrier-to-job link: a record that this carrier holds this job, from one moment until another. "
            "In AmIMotion you link each trolley to the job it carries, in AmIHub or from your own system, and its wait then counts as that job's wait. "
            f"AmIGo tags are located {ACC.replace(' with AmIMo anchors', '')}, but the radio alone never knows the job.",
      pic="trolley",
      parts=[("two", "One trolley, two identities", P(
                  "Trolley 14 has its own tag. Job 208 is what it carries today. Keeping the two apart stops a reused trolley from dragging an old job forward. AmIMotion tags the trolley and links the job.")),
             ("lifetime", "Why a link needs a start and an end", P(
                  "A trolley carries one job, is emptied, and carries another. A link with no end would credit the second job's wait to the first. Agree who starts each link, who ends it, which event marks the change, and how mistakes get corrected. Agree those four things for AmIMotion or any other system before the pilot.")),
             ("amihub", "Linking in AmIHub", P(
                  "In AmIHub, work orders are objects of their own, and tags are assigned to them. You can link a trolley to its job in AmIHub, or send the link from your own system through the same interfaces AmIHub offers for everything else, REST and MQTT. How your plant links jobs today, by a scan, a record or a person, is agreed during scoping.")),
             ("record", "Respect the system of record", P(
                  "Your MES or ERP stays the authority on jobs and status. AmIHub supplies where and when. Agree the source of each field, so a location event never implies a business step. Agree up front, with AmIMotion or any supplier, that a trolley moving never changes a job's status on its own.")),
             ("unknown", "Plan for the unknown", P(
                  "If there is no link, a good system shows the trolley's position and says the job is unknown. If a position is old, it shows the time it was last seen. An honest partial answer beats an invented full one, and AmIMotion's map shows where each trolley was last seen, and when.")),
             ("ask", "What to ask any supplier", P(
                  "Ask how jobs get linked, how links are kept and changed, which way data flows, and how mixed or split loads are handled. Then ask to see that workflow in a live demo. AmIMotion's demo on a call runs on real AmIHub data.")),
             ],
      faqs=[("How do I know which job is on a trolley with RTLS?", "Link the trolley's tag to the job it carries. In AmIMotion you make the link in AmIHub or from your own system, and AmIHub shows it with the trolley's position."),
            ("Does AmIMotion track individual parts?", "AmIMotion tags the carrier: the trolley, bin or rack. Which parts or job it holds comes from the carrier-to-job link, not from the radio."),
            ("What if one trolley carries several jobs?", "Agree how mixed and split loads are linked before the pilot. How AmIHub records them for your plant is settled during scoping."),
            ("Does the link need our MES?", "No. You can link trolleys to jobs in AmIHub. Your MES or ERP can send the links later, when the pilot earns that connection.")],
      related=["wip", "mes", "dwell"])

guide(slug="location-data-quality", group="On the floor",
      title="What happens when an RTLS tag goes quiet?",
      desc="When an RTLS tag is not seen for a while, a good system shows last seen, never a guess. How AmIMotion handles freshness, gaps and tag health.",
      h1="When a tag goes quiet.", soft="Last seen, never a guess.",
      lede="Why tags go quiet, what the map should show, and how to check it in a pilot.",
      short="When an RTLS tag is not seen for a while, the honest answer is “last seen here, at this time”, not a guess at where it is now. "
            "AmIMotion's AmIHub keeps every position with the time it was seen, so you see where each trolley was last seen, and when. "
            "AmIGo tags send as they move and sleep when still, so a quiet tag at rest is normal. "
            "Battery life is 1 to 3 years, typical and usage-dependent, and AmIHub tracks each tag's health and battery level.",
      pic="laststop",
      parts=[("why", "Why tags go quiet", UL(
                  "The tag is still and asleep, which saves battery. AmIGo tags deep-sleep at rest and wake on motion.",
                  "The tag is somewhere with poor coverage, such as inside a metal cage.",
                  "The battery is low. AmIHub tracks each tag's battery level, so you can change it before it goes flat.",
                  "The tag came off, or was moved to another object. If it comes off the trolley, the map still shows its last-seen spot.")),
             ("fresh", "Freshness is its own measure", P(
                  "How often a tag sends, how long processing takes and how often a screen refreshes are three different things. A precise point can still be too old to act on. AmIGo tags report at a rate set per tag group, from 0.1 to 10 times a second, and wake on motion. Set a freshness target for each task.")),
             ("show", "What the map should show", P(
                  "Old data shown as old. A trolley not seen for an hour should read as last seen an hour ago, in its last place, with nothing suggesting it is live. AmIMotion's map shows where each trolley was last seen, and when.")),
             ("anchors", "When an anchor goes dark", P(
                  "Tags are not the only thing that can go quiet. AmIHub watches the health of every AmIMo anchor and alerts when one goes dark, so a gap in coverage is found before people trust an empty area.")),
             ("check", "Checking quality in a pilot", P(
                  "Count how often tags are found where people expect them, how old positions are when people use them, and how many corrections people make. Run the count in an AmIMotion pilot before and after any change to anchors or tag rates.")),
             ],
      faqs=[("What happens if an RTLS tag is not seen for a while?", "AmIHub keeps its last position and the time it was seen, and the map shows where it was last seen. AmIMotion does not guess where the tag is now."),
            ("How long do AmIGo batteries last?", "1 to 3 years, typical and usage-dependent. AmIHub tracks each tag's battery level."),
            ("Can a tag be moved to another trolley?", "Yes. Tags are assigned to objects in AmIHub, so you reassign it there."),
            ("What if an anchor stops working?", "AmIHub monitors anchor health and alerts when an anchor goes dark.")],
      related=["acc", "assoc", "mcp"])

guide(slug="mcp-location-data", group="On the floor",
      title="Can AI assistants query factory location data?",
      desc="Yes, through MCP. AmIHub has a built-in MCP server, so AI assistants can query live positions and zones, with logged calls and a person's approval.",
      h1="Can AI assistants query location data?", soft="Yes, through MCP.",
      lede="How an assistant reads the floor, and what keeps it in check.",
      short="Yes. AmIHub, AmIMotion's location software, has a built-in MCP (Model Context Protocol) server. "
            f"An MCP-capable AI assistant can ask it for live positions, zones and history from the factory floor, where AmIGo tags are located {ACC.replace(' with AmIMo anchors', '')}. "
            "Each assistant gets its own credentials and tool scope, every call is logged, and any change needs a person's approval. "
            "AmIMotion shows this in a live demo, and the setup for your site is confirmed during scoping.",
      pic=None,
      parts=[("what", "What MCP is", P(
                  "Model Context Protocol is an open standard that lets AI assistants use other software in a consistent way. An MCP server describes the tools it offers, and the assistant decides when to call them. AmIHub's MCP server offers location tools.")),
             ("ask", "What people ask", P("Examples of questions an assistant can answer from AmIHub:") + UL(
                  "“Which forklifts have been idle for more than an hour, and where are they?”",
                  "“What entered the inspection queue on the night shift?”",
                  "“Where is trolley 14, and which job is on it?”") + P("The last one needs the trolley linked to its job in AmIHub.")),
             ("tools", "The tools AmIHub describes", P(
                  "AmIMotion groups AmIHub's MCP tools into live location, history, zones and fences, trackables and work orders. Example tool names include <code>get_live_locations</code>, <code>get_fence_events</code> and <code>count_idle_assets</code>. The same tools are available over REST and MQTT.")),
             ("guard", "Access, logs and approval", P(
                  "Each assistant gets its own credentials and tool scope, so it reads only what you allow. Every call is logged. Any change, such as raising a work order in AmIHub, needs a person's approval, and you can require it from a supervisor.")),
             ("where", "Where it runs", P(
                  "The MCP server runs where AmIHub runs: on a PC inside your plant, or in the cloud. What an assistant then does with an answer depends on where that assistant runs, which your IT team chooses. Settle both with your IT team when an AmIMotion pilot is scoped.")),
             ],
      faqs=[("Can the assistant act on its own?", "No. Any change, such as raising a work order in AmIHub, needs a person's approval. You can require it from a supervisor."),
            ("Which assistants work with it?", "Any MCP-capable client. Each one gets its own credentials and tool scope."),
            ("Is it available today?", "The MCP server is built into AmIHub and shown in a live demo. The setup for your site is confirmed during scoping."),
            ("Does location data leave the plant?", "AmIHub and its MCP server can run on a PC inside your plant with no internet dependency. Where an assistant runs is your IT team's choice.")],
      related=[("/use-cases/ask-your-plant/", "Ask your floor", "A supervisor asks a plain question."), "amihub", "qual"])

guide(slug="value-without-mes", group="Proving it",
      title="Prove RTLS value without a live MES link",
      desc="Can you prove RTLS value before connecting the MES? Yes: search time, waits and dwell come from location alone. How an AmIMotion pilot can start.",
      h1="Value before the MES link?", soft="Yes. Location and time come first.",
      lede="What location proves on its own, and when the MES connection should follow.",
      short="Yes, you can prove the value of RTLS before a live MES connection. Search time, how long carriers wait in each zone and where work piles up all come from location and time alone. "
            f"With AmIMotion, a first bay can start with AmIGo tags on one flow's trolleys, located {ACC.replace(' with AmIMo anchors', '')}, and AmIHub timing every zone. "
            "Link each trolley to its job in AmIHub before you report any result per job. The MES connection can follow when the pilot earns it.",
      pic=None,
      parts=[("alone", "What location shows on its own", UL(
                  "Where each tagged trolley, bin or tool is, and when it was last seen.",
                  "Time in each zone, by shift and station.",
                  "How often people search, and how long finding something takes.") + P(
                  "AmIHub gives the first two from AmIGo tags and AmIMo anchors, with no MES connection. Your team counts the third, before and after.")),
             ("later", "What needs the job link", P(
                  "Which job waits where, and lead times per job, need the carrier-to-job link. Start by linking trolleys to jobs in AmIHub, then connect the MES when the pilot earns it. AmIHub offers REST, MQTT, WebSocket and an omlox hub interface for that step, and connectors are confirmed for each site.")),
             ("plan", "A pilot plan that works", OL(
                  "Measure search time and walks before any tag goes on.",
                  "Tag one flow's carriers and agree a few zones.",
                  "Link part of the pilot's trolleys to their jobs in AmIHub.",
                  "Compare, then decide on the MES connection.")),
             ("who", "Who to involve, and when", P(
                  "IT is needed from day one, for the network and where AmIHub runs. The MES owner joins when the link is planned. Production and the people who search for work own the baseline. Bring all three to the AmIMotion scoping call.")),
             ],
      faqs=[("Can we prove the value of RTLS without a live MES connection?", "Yes. Location and time alone show search time, waits and dwell. Link trolleys to jobs in AmIHub during the pilot, and connect the MES later."),
            ("What does the MES link add?", "Which job is on each carrier, so waits become waits per job."),
            ("Do we need IT involved from day one?", "For the network and where AmIHub runs, yes. The MES connector can come later.")],
      related=["base", "assoc", "pilot"])

guide(slug="pilot-baseline", group="Proving it",
      title="What to measure before claiming RTLS results",
      desc="Before claiming RTLS cut search time, measure a baseline: searches, walk time, waits and corrections. The pilot baseline AmIMotion recommends.",
      h1="What should a pilot measure first?", soft="The baseline, before any tag goes on.",
      lede="What to count, how to count it fairly, and what you can claim after.",
      short="Before claiming that RTLS cut search time, measure a baseline on the same flow: how often people search, how long each search takes, how far they walk, how long carriers wait in each zone and how many records need correcting. "
            "Measure it before any AmIGo tag goes on, then measure the same things with AmIMotion's live map, where positions reach down to ±10 cm in 3D, depending on the site. "
            "A fair comparison covers normal variation, such as two weeks of shifts, and reports the spread, not the best day.",
      pic=None,
      parts=[("what", "What to measure", UL(
                  "Searches per shift, and minutes per search.",
                  "Walking distance or time to find a carrier.",
                  "Time in key zones, measured by hand or from existing scans.",
                  "Corrections to records, such as wrong locations or statuses.") + P(
                  "Once the AmIMotion tags are on, time in zones comes from AmIHub. Searches, walks and corrections are counted the same way as before, so before and after compare like with like.")),
             ("how", "How to measure fairly", P(
                  "Use the same flow, shifts and product mix before and after. Let the people who search record it, on a simple sheet. Two weeks is better than two days. Agree the measures with your team before the AmIMotion pilot starts.")),
             ("claim", "What you can then claim", P(
                  "Compare like with like and report the spread, not just the best day. A financial case needs your real costs on top, and your team owns those numbers. In an AmIMotion pilot you see your own waits in one bay, and prove the numbers, before you decide on more.")),
             ("tool", "A head start", P(
                  "The <a href=\"/tools/search-time/\">search-time calculator</a> turns your own figures into hours a year, as a starting point for the baseline. The calculator assumes no savings, and AmIMotion never quotes one from a calculator.")),
             ],
      faqs=[("What should be measured before claiming RTLS reduced search time?", "Searches per shift, minutes per search, walking time, zone waits and record corrections, on the same flow, before tags go on."),
            ("How long should a baseline run?", "Long enough to cover normal variation. Two weeks is a sensible minimum."),
            ("Will AmIMotion calculate the financial case?", "Not from a calculator. A sound case needs a measured baseline and your real costs.")],
      related=["mes", "pilot", "search_tool"])

GROUP_ORDER = [
    ("The basics", "Start here if real-time location is new to you."),
    ("Choosing a system", "Radios, suppliers, accuracy and anchor counts."),
    ("On the floor", "Waits, job links, quiet tags and AI assistants."),
    ("Proving it", "What a pilot should measure, and when."),
]

# ------------------------------------------------------------------------------------------------
# Glossary
# ------------------------------------------------------------------------------------------------
TERMS = [
    ("Positioning", [
        ("rtls", "RTLS", "Real-time location system: fixed infrastructure and software that continuously locate tagged objects, usually indoors where GPS does not work. AmIMotion is a UWB RTLS."),
        ("uwb", "UWB", "Ultra-wideband: radio that sends very short pulses across a wide band of frequencies. Short pulses allow precise timing, so distance can be measured to centimetres and echoes told apart."),
        ("tag", "Tag", "The small device fixed to whatever is tracked: a carrier, tool or vehicle. AmIMotion's tag is AmIGo, which wakes on motion and lasts 1 to 3 years on its battery, typical and usage-dependent."),
        ("anchor", "Anchor", "A fixed device at a known position that receives UWB signals from tags. AmIMotion's anchor is AmIMo, a UWB anchor with a 3D angle-of-arrival antenna array. AmIMo needs power from a DC adapter or PoE, and no data or sync cabling."),
        ("tof", "Time of flight", "The time a radio signal takes to travel from transmitter to receiver. Multiplied by the speed of light, about 30 cm per nanosecond, it gives distance."),
        ("twr", "TWR", "Two-way ranging: tag and anchor exchange messages and measure the round trip to work out the distance."),
        ("tdoa", "TDoA", "Time difference of arrival: a position worked out from the differences in when one signal reaches several synchronised anchors."),
        ("ul-tdoa", "UL-TDoA", "Uplink TDoA: the tag sends a short blink and the anchors work out its position. Tags only transmit, so many low-power tags can be tracked."),
        ("dl-tdoa", "DL-TDoA", "Downlink TDoA: anchors transmit and the device works out its own position, like GPS indoors."),
        ("aoa", "AoA", "Angle of arrival: an antenna array measures the direction a signal comes from. 3D AoA measures the horizontal and the vertical angle."),
        ("multipath", "Multipath", "Copies of a signal that arrive late after bouncing off metal, walls or racking."),
        ("nlos", "NLOS", "Non-line-of-sight: the direct path between tag and anchor is blocked, so the strongest signal may be a reflection."),
        ("ota-sync", "Over-the-air sync", "Keeping anchor clocks in step by radio instead of timing cables. AmIMo anchors sync over the air."),
        ("ftm", "Wi-Fi FTM", "Fine Timing Measurement (IEEE 802.11mc): Wi-Fi round-trip timing that lets compatible Wi-Fi devices estimate distance without a separate tag."),
        ("ble", "BLE ranging", "Estimating distance to Bluetooth Low Energy devices. Usually coarse, at room or zone level."),
        ("update-rate", "Update rate", "How often a tag reports. 0.1 Hz is once every 10 seconds; 10 Hz is ten times a second."),
        ("survey", "Site survey", "A visit that maps ceiling height, racking, metal and sight lines before anchors go up. AmIMotion sets the final anchor count from a site survey."),
        ("poe", "PoE", "Power over Ethernet: power delivered over a network cable. An AmIMo anchor can take its power by PoE or from a DC adapter."),
    ]),
    ("Standards", [
        ("802154z", "IEEE 802.15.4z", "The UWB standard amendment that adds enhanced and secure ranging. HRP is the high-rate pulse physical layer used by most current UWB chips."),
        ("fira", "FiRa", "The FiRa Consortium, an industry body that defines interoperable UWB specifications and runs certification programmes."),
        ("omlox", "omlox", "An open standard for interoperable industrial location systems, so different location technologies and vendors can feed one location hub."),
        ("certification", "Certification", "A formal certification means an authorised body has tested a product against a specification. Following a specification is a company's own statement. AmIMotion describes itself as built on the FiRa and omlox specifications."),
    ]),
    ("Operations", [
        ("wip", "WIP", "Work in progress: partly finished goods moving through production."),
        ("wip-visibility", "WIP visibility", "Knowing where work in progress physically is, which job each carrier holds and how long it has waited in each zone."),
        ("carrier", "Carrier", "The trolley, bin, rack or container that holds WIP. In a WIP visibility system the carrier carries the tag."),
        ("association", "Association", "The link between a tagged carrier and the job it holds, which gives a location its work meaning. A link needs a start, an end and an owner."),
        ("zone", "Zone", "An agreed area of the floor, such as an assembly queue. Entering or leaving it creates a time-stamped event."),
        ("geofence", "Geofence", "A boundary drawn on the floor map. Crossing it creates an event, in the same way as a zone."),
        ("dwell", "Dwell", "Time spent in a zone, from entry to exit. Dwell includes waiting, processing and breaks, so it is not the same as cycle time."),
        ("exception", "Exception", "A case that asks a person to look, such as work that has waited longer than the team agreed. An exception is not a diagnosis."),
        ("last-seen", "Last seen", "The last place and time a tag was located. An honest map shows a quiet tag as last seen, never as live."),
        ("freshness", "Freshness", "How old a position is when someone uses it. A precise position can still be too old to act on."),
        ("mes", "MES, ERP, WMS", "Manufacturing execution, enterprise resource planning and warehouse management systems: the systems of record for jobs, orders and stock."),
        ("amr", "AGV and AMR", "Automated guided vehicle, which follows fixed paths, and autonomous mobile robot, which navigates freely."),
        ("milk-run", "Milk run", "A fixed delivery loop, often by tugger, that feeds line-side stations."),
    ]),
    ("Software and AI", [
        ("amihub", "AmIHub", "AmIMotion's software. AmIHub works out positions and keeps the live map, zones, time-stamped events and interfaces: REST, MQTT, WebSocket, an omlox hub interface and a built-in MCP server. AmIHub runs on a PC inside your plant with no internet dependency, or in the cloud."),
        ("mcp", "MCP", "Model Context Protocol: an open standard that lets AI assistants use external tools and data. AmIHub has a built-in MCP server."),
        ("isi", "Industrial spatial intelligence", "A time-stamped location for what moves in a plant, joined with context such as jobs and zones, so people, systems and AI assistants can answer where work is and where it waits."),
        ("edge", "Edge", "Computing done on site, near the equipment, rather than in a remote cloud."),
    ]),
]
N_TERMS = sum(len(t) for _, t in TERMS)

# ------------------------------------------------------------------------------------------------
# FAQ
# ------------------------------------------------------------------------------------------------
FAQS = [
    ("The company.", [
        ("What is AmIMotion?", "AmIMotion builds industrial spatial intelligence for factories and warehouses. AmIMotion makes AmIGo UWB tags, AmIMo anchors and AmIHub software. AmIMotion is a brand of Locatepro Technologies Pvt Ltd in Bengaluru, and its products are designed and built in India."),
        ("What does AmIMotion do?", "AmIMotion shows where work is and where it waits. A small AmIGo tag rides on each trolley, bin and tool in a factory or warehouse. AmIMo anchors hear it, and AmIHub's live map shows where it went and how long it has waited."),
        ("Who makes AmIMotion and where is it based?", "Locatepro Technologies Pvt Ltd, in Bengaluru, India. AmIMotion is its brand, and the tags, anchors and software are designed and built in India."),
        ("Who leads AmIMotion?", "AmIMotion is led by Kaushal Kukkar, founder and CEO, and Vivek Dham, CTO."),
        ("What does AmIMotion cost?", "After the first call, we share datasheets, architecture, prices and pilot options under NDA."),
        ("Can we start small?", "Yes. An AmIMotion pilot starts in one bay or one line. You then scale on the same AmIHub."),
    ]),
    ("The three parts.", [
        ("What is an AmIGo tag?", "AmIGo is AmIMotion's UWB tag. An AmIGo tag rides on a trolley, bin, tool or vehicle, wakes on motion and sleeps when still. Battery life is 1 to 3 years, typical and usage-dependent."),
        ("What is an AmIMo anchor?", "AmIMo is AmIMotion's UWB anchor. An AmIMo anchor mounts on a column or wall, times each tag's pulse and measures the angle it came from. Each anchor syncs over the air, sends data over Wi-Fi with an Ethernet option, and needs power from a DC adapter or PoE."),
        ("What is AmIHub?", "AmIHub is AmIMotion's software. AmIHub works out positions, keeps the live map and zone history, and offers REST, MQTT, WebSocket, an omlox hub interface and a built-in MCP server. AmIHub runs on-premise with no internet dependency, or in the cloud."),
    ]),
    ("How it works.", [
        ("How accurate is AmIMotion?", "Down to ±10 cm in 3D, typical, with AmIMo anchors. Accuracy depends on the site, so a pilot measures it on your floor."),
        ("Do the anchors need cables?", "No data or sync cabling. AmIMo anchors sync over the air and send data over Wi-Fi, with an Ethernet option. Each anchor needs power, from a DC adapter or PoE."),
        ("Does UWB work in a factory full of steel and racking?", "UWB's wide bandwidth separates the direct signal from reflections. AmIHub adds multipath and non-line-of-sight algorithms, and AmIMotion plans the anchors from a site survey."),
        ("How long do tag batteries last?", "1 to 3 years, typical and usage-dependent. AmIGo tags sleep when still and send when they move."),
        ("Does AmIMotion track individual parts?", "AmIMotion tags the carrier: the trolley, bin or rack. Which parts or job it holds comes from a carrier-to-job link, not from the radio."),
    ]),
    ("Systems, data and AI.", [
        ("Can it run without the internet?", "Yes. AmIHub can run on an industrial PC inside your plant with no internet dependency, or in the cloud."),
        ("Does it connect to our MES or ERP?", "AmIHub offers REST, MQTT, WebSocket and an omlox hub interface, and can push events to MES, ERP, WMS, SCADA or BI. Connectors are confirmed for each site."),
        ("Does AmIMotion hold FiRa or omlox certification?", "AmIMotion is built on the FiRa and omlox specifications. AmIMotion claims no formal certification."),
        ("Does AmIMotion have an MCP server for AI assistants?", "Yes. AmIHub has a built-in MCP server, so MCP-capable AI assistants can query live positions, zones and history. Any change needs a person's approval, and every call is logged. AmIMotion shows it in a live demo."),
    ]),
]
FAQ_SHORT = ("AmIMotion makes AmIGo tags, AmIMo anchors and AmIHub software, designed and built in India by Locatepro Technologies in Bengaluru. "
             f"Together they give each tagged trolley, bin, tool and vehicle a time-stamped location, {ACC}. "
             "The answers below cover the company, the three parts, accuracy, cabling, data, standards and AI assistants.")

# ------------------------------------------------------------------------------------------------
# Resources
# ------------------------------------------------------------------------------------------------
RES_TOOLS = [
    ("Plan your first bay", "/diagnostic/", "Six questions about how work moves on your floor. AmIMotion's diagnostic sketches your floor as you answer and ends with a visibility profile and a pilot scope for one bay or line."),
    ("How many anchors you need", "/tools/anchors/", "Your floor size and racking in, a first anchor range out. AmIMotion's estimator shows its planning grid, and a site survey sets the real number."),
    ("Time spent searching", "/tools/search-time/", "Your people, searches and minutes, multiplied into hours a year. AmIMotion's calculator assumes no savings."),
    ("Your pilot on one page", "/tools/pilot/", "Three choices become a one-page brief for an AmIMotion pilot, to share with your team or bring to the first call."),
]
RES_READ = [
    ("Field guides", "/learn/", f"Fourteen guides, one question each: UWB vs RFID, anchor counts, accuracy, dwell time, job links and choosing an RTLS in India."),
    ("Questions", "/faq/", "Short answers about AmIMotion: the company, the three parts, accuracy, cabling, data, standards and AI assistants."),
    ("Glossary", "/glossary/", f"{N_TERMS} terms you hear when people talk about location on a factory floor, from RTLS and UWB to dwell and last seen."),
]


# ------------------------------------------------------------------------------------------------
# Build the pages with lib.py
# ------------------------------------------------------------------------------------------------
def rel(keys):
    return [L[k] if isinstance(k, str) else k for k in keys]


def build():
    for g in G:
        crumb = L[next(k for k, v in L.items() if v[0] == f"/learn/{g['slug']}/")][1]
        write(f"/learn/{g['slug']}/", g["title"], g["desc"], [
            head(g["h1"], g["soft"], g["lede"], short=g["short"], trail=[("Field guides", "/learn/"), (label(f"/learn/{g['slug']}/", crumb), None)], media=pic(g["pic"])),
            section(read(g["parts"]), label="The guide"),
            section(faq(g["faqs"], "Common follow-ups.")) if g["faqs"] else "",
            section(vp("Read next."), links(rel(g["related"]))),
            close(),
        ], type="article")

    by = {}
    for g in G: by.setdefault(g["group"], []).append(L[next(k for k, v in L.items() if v[0] == f"/learn/{g['slug']}/")])
    write("/learn/", "Field guides: RTLS, UWB and WIP visibility",
          "Plain answers on factory location: UWB vs RFID, anchor counts, accuracy tests, dwell time, job links and choosing a UWB RTLS in India. By AmIMotion.",
          [
              head("Field guides to factory location.", "One question per page.", "Fourteen short guides from AmIMotion. Each answers a question plants ask after a demo. No sign-up.",
                   short=LEARN_SHORT, trail=[("Field guides", None)]),
              section(vp("Four quick answers."), tiles(QUICK, cols=2)),
              *[section(vp(gname + ".", None, gline), links(by[gname])) for gname, gline in GROUP_ORDER],
              section(vp("More answers."), links(rel(["faq", "gloss", "isi"]))),
              close(),
          ])

    write("/glossary/", "Glossary of RTLS and UWB terms",
          "Plain definitions of factory location terms: RTLS, UWB, TDoA, angle of arrival, multipath, omlox, FiRa, WIP visibility, dwell, last seen and job links.",
          [
              head("Glossary of location terms.", "Floor words and tech words, in plain English.", f"{N_TERMS} terms you will hear when people talk about location on a factory floor.",
                   short=GLOSS_SHORT, trail=[("Glossary", None)]),
              # terms block: dl/dt/dd markup kept as before, because build.py reads it into DefinedTermSet. Ask Structure for a terms() block.
              section('<nav class="term-index" aria-label="Terms">' + "".join(f'<a href="#{i}">{n}</a>' for _, ts in TERMS for i, n, _ in ts) + "</nav>"
                      + "".join(f'<div class="term-group"><h2 id="g-{gname.lower().replace(" ", "-")}">{gname}</h2><dl class="terms">' + "".join(f'<dt id="{i}">{n}</dt><dd>{dd}</dd>' for i, n, dd in ts) + "</dl></div>" for gname, ts in TERMS)),
              section(vp("Read next."), links(rel(["rtls", "wip", "faq"]))),
              close(),
          ], type="glossary")

    write("/faq/", "AmIMotion FAQ: UWB indoor positioning, answered",
          "Plain answers about AmIMotion: down to ±10 cm in 3D (site-dependent), anchors and cabling, steel, MES and ERP links, FiRa and omlox, MCP and pilots.",
          [
              head("Questions about AmIMotion.", "Short answers, with their conditions.", short=FAQ_SHORT, trail=[("Questions", None)]),
              *[section(faq(items, title)) for title, items in FAQS],
              close("Ask us the next one.", "On a call an engineer answers the questions specific to your floor, with the AmIHub map open."),
          ], type="faq")

    write("/resources/", "AmIMotion resources: tools, guides and answers",
          "Free resources to plan UWB location with AmIMotion: a floor diagnostic, anchor estimator, search-time calculator, pilot planner, guides, FAQ and glossary.",
          [
              head("Resources.", "Plan a location project, with no sign-up.", short=RES_SHORT, trail=[("Resources", None)]),
              section(vp("Tools that work it out.", None, "Each one runs in your browser. Nothing is stored and nobody asks for an email."), tiles([(f'<a href="{h}">{label(h, t)}</a>', d) for t, h, d in RES_TOOLS], cols=2)),
              section(vp("Pages that explain it."), tiles([(f'<a href="{h}">{label(h, t)}</a>', d) for t, h, d in RES_READ], cols=3)),
              section(vp("Where to begin."), steps(RES_STEPS)),
              close(),
          ])


LEARN_SHORT = ("AmIMotion's field guides answer the questions plants ask about real-time location: how UWB compares with BLE and RFID, how many anchors a floor needs, how to test accuracy, how dwell time is measured and how to see where work in progress waits. "
               f"Every figure carries its condition. AmIMo anchors locate AmIGo tags {ACC.replace(' with AmIMo anchors', '')}.")
QUICK = [
    ("Is UWB accurate enough for trolleys?", "Usually, when anchors are planned for the floor. AmIMotion quotes down to ±10 cm in 3D with AmIMo anchors, typical and site-dependent. <a href=\"/learn/accuracy/\">How to test it</a>."),
    ("UWB, BLE or RFID?", "RFID and scans prove a trolley passed a point. BLE finds the zone. UWB, which AmIMotion uses, tells neighbouring queues apart. <a href=\"/learn/uwb-vs-rfid/\">Choose by the question</a>."),
    ("How many anchors does a floor need?", "A survey decides. As a first budget, an open 5,000 m² hall on this site's 25 m planning grid needs about 15 AmIMo anchors. <a href=\"/learn/anchor-planning/\">What sets the count</a>."),
    ("Does a tag know the job on the trolley?", "No. AmIMotion links each trolley to its job in AmIHub or from your own system. <a href=\"/learn/association/\">Why the link matters</a>."),
]
GLOSS_SHORT = ("AmIMotion's glossary defines the words used in real-time location on factory floors, from RTLS and UWB to dwell time and carrier-to-job links. "
               "Each term has a plain definition, and where a term names an AmIMotion part, the definition says so. "
               f"AmIMo anchors locate AmIGo tags {ACC.replace(' with AmIMo anchors', '')}.")
RES_SHORT = ("AmIMotion's resources help a plant plan real-time location before the first call: a six-question floor diagnostic, an anchor estimator, a search-time calculator, a one-page pilot planner, fourteen field guides, an FAQ and a glossary. "
             "None of them asks for an email. "
             f"Each figure carries its condition, such as positions {ACC}.")
RES_STEPS = [
    ("Name the flow", "Pick the flow where people walk to find work. AmIMotion's diagnostic helps you choose it."),
    ("Size the floor", "Get a first anchor range from the estimator, before anyone visits."),
    ("Count the cost", "Put your own search time into hours a year, as the start of a baseline."),
    ("Bring a brief", "Turn it into a one-page AmIMotion pilot brief for the first call."),
]


# ------------------------------------------------------------------------------------------------
# Markdown deliverables
# ------------------------------------------------------------------------------------------------
def txt(h):
    h = re.sub(r"<li>", "\n- ", h)
    h = re.sub(r"</p>\s*<p>", "\n\n", h)
    h = re.sub(r"<strong>(.*?)</strong>", r"**\1**", h)
    h = re.sub(r"<code>(.*?)</code>", r"`\1`", h)
    h = re.sub(r'<a href="([^"]+)">(.*?)</a>', r"[\2](\1)", h)
    h = re.sub(r"<[^>]+>", "", h)
    return re.sub(r"\n{3,}", "\n\n", h).strip()


def md_table(html):
    heads = re.findall(r'<th scope="col">(.*?)</th>', html)
    rows = re.findall(r"<tr><th scope=\"row\">(.*?)</th>(.*?)</tr>", html)
    out = ["| " + " | ".join(h or " " for h in heads) + " |", "|" + "---|" * len(heads)]
    for r0, rest in rows:
        out.append("| " + " | ".join([r0] + re.findall(r"<td[^>]*>(.*?)</td>", rest)) + " |")
    return "\n".join(out)


def body_md(h):
    if '<table class="compare">' in h:
        pre, tbl = h.split('<table class="compare">', 1)
        tbl, post = tbl.split("</table>", 1)
        return "\n\n".join(x for x in (txt(pre), md_table('<table class="compare">' + tbl + "</table>"), txt(post)) if x)
    return txt(h)


def pic_md(key):
    if key is None: return "Picture: none."
    kind, args, note = PICS[key]
    s = f"Picture ({'CAD still' if kind == 'still' else 'slot ' + args[4] + ', ' + args[1]}): {note}"
    if kind == "slot": s += f'\nAlt text: "{args[2]}"'
    return s


def write_md(path, lines):
    (HERE / path).write_text("\n".join(lines).rstrip() + "\n")


def md_all():
    from checks import CHECKS  # per-page loop records
    for g in G:
        url = f"/learn/{g['slug']}/"
        lines = [f"# {url}", "", f"**Title tag:** {g['title']} | AmIMotion", f"**Meta description ({len(g['desc'])}):** {g['desc']}",
                 f"**H1:** {g['h1']} / {g['soft']}", f"**Lede:** {g['lede']}", "", "## Head", "", "**The short answer** (speakable, the quotable paragraph):", "", g["short"], "", pic_md(g["pic"]), "",
                 "## Sections (read() article, on-this-page list on the left)", ""]
        for i, h2, h in g["parts"]:
            lines += [f"### {h2}", "", body_md(h), "", "Picture: none.", ""]
        if g["faqs"]:
            lines += ["## Common follow-ups (faq block, FAQPage JSON-LD)", ""]
            for q, a in g["faqs"]: lines += [f"**{q}**", a, ""]
        lines += ["## Read next (related block)", ""] + [f"- [{t}]({h}): {l}" for h, t, l in rel(g["related"])] + [""]
        lines += ["## Close", "", "Default close for this part of the site: \"Questions about your own floor?\" / \"An engineer answers them on a short call, with the live map open.\" / [Book a call](/contact/)", ""]
        links_in = sorted(set(re.findall(r'href=\\?"(/[^"\\]+)', "".join(h for _, _, h in g["parts"]))) | {h for h, _, _ in rel(g["related"])})
        lines += ["## Internal links", "", ", ".join(links_in + ["/learn/ (breadcrumb)", "/contact/ (close)"]), "",
                  "## JSON-LD notes", "", "type=article: WebPage with speakable (h1, .short-answer), TechArticle (headline = title, author and publisher = #org), FAQPage from the follow-ups, BreadcrumbList Home > Field guides > this page. Organization from the footer entity. Keep `published: 2026-10-28` and let build.py set dateModified.", ""]
        lines += CHECKS[url]
        write_md(f"learn-{g['slug']}.md", lines)

    # hub
    lines = ["# /learn/", "", "**Title tag:** Field guides: RTLS, UWB and WIP visibility | AmIMotion",
             "**Meta description:** Plain answers on factory location: UWB vs RFID, anchor counts, accuracy tests, dwell time, job links and choosing a UWB RTLS in India. By AmIMotion.",
             "**H1:** Field guides to factory location. / One question per page.", "**Lede:** Fourteen short guides from AmIMotion. Each answers a question plants ask after a demo. No sign-up.", "",
             "## Head", "", "**The short answer:**", "", LEARN_SHORT, "", "Picture: none. An index reads fastest as words; every guide below carries its own picture or none.", "",
             "## Four quick answers (tiles, cols=2)", ""]
    for q, a in QUICK: lines += [f"**{q}** {txt(a)}", ""]
    for gname, gline in GROUP_ORDER:
        lines += [f"## {gname}. (heading row, lede: {gline}) then related links", ""]
        lines += [f"- [{L[k][1]}]({L[k][0]}): {L[k][2]}" for g in G if g["group"] == gname for k in [next(k for k, v in L.items() if v[0] == f"/learn/{g['slug']}/")]] + [""]
    lines += ["## More answers. (related links)", ""] + [f"- [{t}]({h}): {l}" for h, t, l in rel(["faq", "gloss", "isi"])] + ["",
              "## Close", "", "Default close: \"Questions about your own floor?\" / [Book a call](/contact/)", "",
              "## Internal links", "", "All 14 guides, /faq/, /glossary/, /industrial-spatial-intelligence/, /contact/.", "",
              "## JSON-LD notes", "", "WebPage with speakable (h1, .short-answer), BreadcrumbList Home > Field guides, Organization. No FAQPage: the quick answers are tiles, not details, so they are not duplicated as FAQ data. Consider CollectionPage/ItemList of the 14 guides in build.py (ask Structure).", ""]
    lines += CHECKS["/learn/"]
    write_md("learn.md", lines)

    # glossary
    lines = ["# /glossary/", "", "**Title tag:** Glossary of RTLS and UWB terms | AmIMotion",
             "**Meta description:** Plain definitions of factory location terms: RTLS, UWB, TDoA, angle of arrival, multipath, omlox, FiRa, WIP visibility, dwell, last seen and job links.",
             "**H1:** Glossary of location terms. / Floor words and tech words, in plain English.", f"**Lede:** {N_TERMS} terms you will hear when people talk about location on a factory floor.", "",
             "## Head", "", "**The short answer:**", "", GLOSS_SHORT, "", "Picture: none.", "", "## Term index (anchor links to every term), then the groups", ""]
    for gname, ts in TERMS:
        lines += [f"### {gname} (H2)", ""] + [f"- **{n}** (#{i}): {d}" for i, n, d in ts] + [""]
    lines += ["## Read next", ""] + [f"- [{t}]({h}): {l}" for h, t, l in rel(["rtls", "wip", "faq"])] + ["", "## Close", "", "Default close: \"Questions about your own floor?\" / [Book a call](/contact/)", "",
              "## Internal links", "", "/learn/rtls/, /learn/wip-visibility/, /faq/, /contact/, plus #term anchors.", "",
              "## JSON-LD notes", "", f"type=glossary: DefinedTermSet with {N_TERMS} DefinedTerm items read from the dt/dd markup (build.py glossary_of), BreadcrumbList, WebPage with speakable. The term markup is kept as raw dl/dt/dd because no lib.py block makes it yet: ask Structure for terms().", ""]
    lines += CHECKS["/glossary/"]
    write_md("glossary.md", lines)

    # faq
    lines = ["# /faq/", "", "**Title tag:** AmIMotion FAQ: UWB indoor positioning, answered",
             "**Meta description:** Plain answers about AmIMotion: down to ±10 cm in 3D (site-dependent), anchors and cabling, steel, MES and ERP links, FiRa and omlox, MCP and pilots.",
             "**H1:** Questions about AmIMotion. / Short answers, with their conditions.", "**Lede:** none (the short answer follows the H1).", "",
             "## Head", "", "**The short answer:**", "", FAQ_SHORT, "", "Picture: none.", ""]
    for title, items in FAQS:
        lines += [f"## {title} (faq block)", ""]
        for q, a in items: lines += [f"**{q}**", a, ""]
    lines += ["## Close", "", "\"Ask us the next one.\" / \"On a call an engineer answers the questions specific to your floor, with the AmIHub map open.\" / [Book a call](/contact/)", "",
              "## Internal links", "", "/contact/ (close). Answers stay link-free so each lifts cleanly as FAQ data.", "",
              "## JSON-LD notes", "", "type=faq: FAQPage with all 18 questions from the details blocks, WebPage with speakable, BreadcrumbList Home > Questions, Organization.", ""]
    lines += CHECKS["/faq/"]
    write_md("faq.md", lines)

    # resources
    lines = ["# /resources/", "", "**Title tag:** AmIMotion resources: tools, guides and answers",
             "**Meta description:** Free resources to plan UWB location with AmIMotion: a floor diagnostic, anchor estimator, search-time calculator, pilot planner, guides, FAQ and glossary.",
             "**H1:** Resources. / Plan a location project, with no sign-up.", "**Lede:** none.", "", "## Head", "", "**The short answer:**", "", RES_SHORT, "", "Picture: none.", "",
             "## Tools that work it out. (lede: Each one runs in your browser. Nothing is stored and nobody asks for an email.) tiles, cols=2", ""]
    lines += [f"- **[{t}]({h})** {d}" for t, h, d in RES_TOOLS] + ["", "## Pages that explain it. tiles, cols=3", ""] + [f"- **[{t}]({h})** {d}" for t, h, d in RES_READ]
    lines += ["", "## Where to begin. (steps)", ""] + [f"{i}. **{a}** {b}" for i, (a, b) in enumerate(RES_STEPS, 1)]
    lines += ["", "## Close", "", "Default close: \"Questions about your own floor?\" / [Book a call](/contact/)", "",
              "## Internal links", "", "/diagnostic/, /tools/anchors/, /tools/search-time/, /tools/pilot/, /learn/, /faq/, /glossary/, /contact/. /films/ left out on purpose: held (V103).", "",
              "## JSON-LD notes", "", "WebPage with speakable, BreadcrumbList Home > Resources, Organization. No FAQPage.", ""]
    lines += CHECKS["/resources/"]
    write_md("resources.md", lines)


if BUILD:
    build()
elif __name__ == "__main__":
    sys.path.insert(0, str(HERE))
    md_all()
