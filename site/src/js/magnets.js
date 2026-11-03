// The inner-page magnets. Each one asks a few questions about the visitor's own floor and answers with something
// they can use the same minute: a first-bay plan, what the survey will test, a data exchange sketch, a tag match,
// their buying committee with a note to their plant head, or the sample plant to question.
// Every answer is drawn by the same tools the agent uses (agent-core.js), feeds the visitor's memory, and can go to an
// engineer in one step. Placeholders are empty in the HTML (<section data-magnet="...">), so the page's own words
// and its crawler view do not change.
export function mount(el, A, C) {
  if (el.dataset.ready) return; el.dataset.ready = '1';
  const kind = el.dataset.magnet, M = MAGNETS[kind]; if (!M) return;
  const P = A.profile();
  el.classList.add('mg'); el.setAttribute('aria-labelledby', 'mg-' + kind);
  el.innerHTML = `<div class="mg-head"><h2 id="mg-${kind}"><span>${M.h[0]}</span><span>${M.h[1]}</span></h2><p>${M.p}</p></div>
    <div class="mg-body"><form class="mg-ctl" novalidate>${M.form(P, A.esc)}</form><div class="mg-out" aria-live="polite"><div data-card></div>
    <div class="mg-cta"><button type="button" class="cta" data-send>Send this to an engineer</button><button type="button" class="cta alt" data-talk>Talk it through</button></div><div class="mg-send" data-sendbox></div></div></div>`;
  const form = el.querySelector('form'), out = el.querySelector('[data-card]');
  let last = null, touched = false;
  const run = () => {
    const r = M.run(form, C, A.profile()); if (!r) return; last = r;
    out.innerHTML = A.card(r);
    if (touched) { A.remember(M.remember(r, form)); A.usedTool(M.tool); }
  };
  form.addEventListener('input', () => { touched = true; run(); });
  form.addEventListener('change', () => { touched = true; run(); });
  form.addEventListener('submit', (e) => e.preventDefault());
  if (M.wire) M.wire(form, () => { touched = true; run(); }, A, C);
  run();
  el.querySelector('[data-talk]').addEventListener('click', () => { if (last) A.keepCard(last); A.open(M.talk(last)); });
  el.querySelector('[data-send]').addEventListener('click', (e) => {
    if (last) { A.keepCard(last); A.remember(M.remember(last, form)); }
    const box = el.querySelector('[data-sendbox]'); box.innerHTML = A.handoffForm({ summary: M.summary(last) });
    const f = box.querySelector('form'); if (f) { f.dataset.source = 'magnet:' + kind; f.querySelector('input[name="name"]').focus({ preventScroll: true }); }
    e.currentTarget.hidden = true; box.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

const radios = (name, opts, cur) => `<div class="mg-chips">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}"${v === cur ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>`;
const checks = (name, opts, cur = []) => `<div class="mg-chips">${opts.map(([v, l]) => `<label><input type="checkbox" name="${name}" value="${v}"${cur.includes(v) ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>`;
const val = (f, n) => { const r = f.querySelector(`input[name="${n}"]:checked`); return r ? r.value : ''; };
const vals = (f, n) => [...f.querySelectorAll(`input[name="${n}"]:checked`)].map((x) => x.value);
const range = (name, label, min, max, step, v, unit) => `<div><span class="mg-lab">${label}</span><div class="mg-range"><input type="range" name="${name}" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label}"><output>${v}${unit}</output></div></div>`;
const wireRanges = (f) => f.querySelectorAll('input[type=range]').forEach((r) => { const o = r.nextElementSibling, u = o.textContent.replace(/^[\d.]+/, ''); r.addEventListener('input', () => { o.textContent = r.value + u; }); });

const STATIONS = ['Stores', 'Kitting', 'Machining', 'Welding', 'Paint', 'Buffer', 'Inspection', 'Sub-assembly', 'Assembly', 'Rework', 'Testing', 'Packing', 'Dispatch'];
const ROLES = [['plant', 'Plant head'], ['prod', 'Production or PPC'], ['ie', 'IE or lean'], ['sup', 'Supervisor'], ['ot', 'OT or maintenance'], ['mes', 'MES or ERP owner'], ['it', 'IT and security'], ['dx', 'Digital or excellence'], ['fin', 'Procurement or finance'], ['md', 'Promoter or MD'], ['si', 'Integrator']];

const MAGNETS = {
  // ---------------------------------------------------------------------------------------------- flow -> first bay
  flow: {
    h: ['Map the flow you’d start with.', 'Get your first bay back.'],
    p: 'Tap your stations in the order work moves, then mark where it waits. You get a first-bay plan: the zones, where the first dwell rule goes, and what you’d see on day one.',
    tool: 'Flow plan',
    form: (P) => `<div class="mg-q"><span class="mg-lab">Your stations, in order <small>Tap to add. Tap again to remove.</small></span><div class="mg-chips" data-st>${STATIONS.map((s) => `<button type="button" aria-pressed="false">${s}</button>`).join('')}</div><div class="mg-add" style="margin-top:8px"><input data-own placeholder="Add your own station" aria-label="Add your own station"><button type="button" data-addown>Add</button></div></div>
      <div class="mg-q"><span class="mg-lab">Where does work wait longest? <small>Tap a station in your flow.</small></span><div class="mg-chips" data-wait></div></div>
      <fieldset class="mg-q"><legend>What moves between them?</legend>${radios('carrier', [['trolleys', 'Trolleys'], ['bins', 'Bins'], ['kit racks', 'Kit racks'], ['pallets', 'Pallets']], /bin/.test(P.carriers || '') ? 'bins' : /pallet/.test(P.carriers || '') ? 'pallets' : 'trolleys')}</fieldset>`,
    wire(f, go) {
      const seq = ['Machining', 'Buffer', 'Inspection', 'Assembly']; let waits = 'Buffer';
      const st = f.querySelector('[data-st]'), wt = f.querySelector('[data-wait]');
      const paint = () => {
        st.querySelectorAll('button').forEach((b) => { const i = seq.indexOf(b.textContent.replace(/^\d+\s*/, '')); b.setAttribute('aria-pressed', String(i >= 0)); b.innerHTML = (i >= 0 ? `<span class="n">${i + 1}</span>` : '') + b.textContent.replace(/^\d+\s*/, ''); });
        if (!seq.includes(waits)) waits = seq[Math.min(1, seq.length - 1)] || '';
        wt.innerHTML = seq.map((s) => `<button type="button" class="${s === waits ? 'wt' : ''}" aria-pressed="${s === waits}">${s}</button>`).join('') || '<p class="mg-hint">Add two or more stations first.</p>';
        f._seq = seq.slice(); f._waits = waits;
      };
      st.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const s = b.textContent.replace(/^\d+\s*/, ''); const i = seq.indexOf(s); if (i >= 0) seq.splice(i, 1); else if (seq.length < 10) seq.push(s); paint(); go(); });
      wt.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; waits = b.textContent; paint(); go(); });
      const own = f.querySelector('[data-own]'), add = () => { const s = own.value.trim().slice(0, 24); if (!s || seq.includes(s) || seq.length >= 10) return; seq.push(s); const b = document.createElement('button'); b.type = 'button'; b.textContent = s; st.append(b); own.value = ''; paint(); go(); };
      f.querySelector('[data-addown]').addEventListener('click', add); own.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      paint();
    },
    run: (f, C) => (f._seq && f._seq.length >= 2 ? C.planFlow({ stations: f._seq, waits_at: f._waits, carrier: val(f, 'carrier') }) : null),
    remember: (r) => ({ carriers: r.carrier, waits_at: r.waits_at, tool_flow: r.stations.join(' → ') }),
    talk: (r) => r ? `My flow is ${r.stations.join(' → ')} and work waits at ${r.waits_at}. How would a first bay work?` : 'How would a first bay work on my floor?',
    summary: (r) => r ? `Flow ${r.stations.join(' → ')}; waits at ${r.waits_at}; wants a first-bay plan` : 'Wants a first-bay plan',
  },
  // ---------------------------------------------------------------------------------------------- floor readiness
  floor: {
    h: ['Will it work on your floor?', 'Five facts, an honest answer.'],
    p: 'Tell us about your hall: its size, the ceiling, the racking, the steel and the power. You get a first anchor range and the points the site survey will test.',
    tool: 'Floor check',
    form: () => range('L', 'Floor length', 20, 400, 5, 120, ' m') + range('W', 'Floor width', 10, 300, 5, 60, ' m') + range('H', 'Ceiling height', 3, 20, 1, 9, ' m') +
      `<fieldset class="mg-q"><legend>What is on the floor?</legend>${radios('rack', [['open', 'Open hall'], ['some', 'Some racking'], ['dense', 'Dense high racking']], 'some')}</fieldset>
      <fieldset class="mg-q"><legend>Lots of steel machines or walls?</legend>${radios('metal', [['yes', 'Yes'], ['no', 'Not much']], 'yes')}</fieldset>
      <fieldset class="mg-q"><legend>Power at mounting points</legend>${radios('power', [['poe', 'PoE'], ['dc', 'DC'], ['unknown', 'Not sure']], 'unknown')}</fieldset>
      <fieldset class="mg-q"><legend>Your IT on cloud</legend>${radios('it', [['no-cloud', 'Stay inside the plant'], ['cloud', 'Cloud is fine'], ['unknown', 'Not sure']], 'unknown')}</fieldset>`,
    wire: (f) => wireRanges(f),
    run(f, C) {
      const L = +f.elements.L.value, W = +f.elements.W.value, H = +f.elements.H.value, rack = val(f, 'rack');
      const a = C.estimateAnchors({ length_m: L, width_m: W, ceiling_m: H, floor: rack === 'some' ? 'mixed' : rack, position: '3d' });
      const fl = C.checkFloor({ ceiling_m: H, racking: rack, metal_heavy: val(f, 'metal') === 'yes', power: val(f, 'power'), it: val(f, 'it') });
      return { ...fl, points: [['ok', `First range for ${L} × ${W} m: ${a.low} to ${a.high} AmIMo anchors (planning estimate; the survey sets the count).`], ...fl.points], _a: a };
    },
    remember: (r) => ({ tool_floor: `${r._a.length_m}×${r._a.width_m} m, ${r._a.ceiling_m} m ceiling, ${r._a.low}–${r._a.high} anchors` }),
    talk: (r) => r ? `My hall is ${r._a.length_m} × ${r._a.width_m} m with a ${r._a.ceiling_m} m ceiling. What would the survey look at first?` : 'What would the survey look at on my floor?',
    summary: (r) => r ? `Floor ${r._a.length_m}×${r._a.width_m} m, ${r._a.ceiling_m} m ceiling; first range ${r._a.low}–${r._a.high} anchors; wants a survey view` : 'Wants a floor check',
  },
  // ---------------------------------------------------------------------------------------------- data exchange
  exchange: {
    h: ['Sketch your data exchange.', 'Your MES stays in charge.'],
    p: 'Pick the systems you run and how a job meets its trolley today. You get what AmIHub sends where, over which interface, and the link from tag to carrier to job.',
    tool: 'Data exchange',
    form: () => `<fieldset class="mg-q"><legend>Systems you run <small>Choose all that apply.</small></legend>${checks('sys', [['SAP or ERP', 'SAP or another ERP'], ['MES', 'MES'], ['WMS', 'WMS'], ['BI dashboards', 'BI dashboards'], ['SCADA', 'SCADA']], ['SAP or ERP', 'MES'])}</fieldset>
      <fieldset class="mg-q"><legend>How is a job linked to its trolley today?</legend>${radios('link', [['scan', 'A barcode scan'], ['paper', 'A paper traveller'], ['mes', 'An MES or ERP record'], ['none', 'It isn’t, reliably']], 'scan')}</fieldset>
      <fieldset class="mg-q"><legend>Where should AmIHub run?</legend>${radios('host', [['plant', 'Inside the plant'], ['cloud', 'In the cloud']], 'plant')}</fieldset>
      <fieldset class="mg-q"><legend>An AI assistant asking the live map?</legend>${radios('ai', [['yes', 'Yes, show it'], ['no', 'Not now']], 'no')}</fieldset>`,
    run: (f, C) => C.mapDataExchange({ systems: vals(f, 'sys'), link: val(f, 'link'), hosting: val(f, 'host'), assistant: val(f, 'ai') === 'yes' }),
    remember: (r, f) => ({ systems: r.systems.join(', '), link: val(f, 'link'), tool_exchange: r.systems.join(', ') + ' · ' + r.hosting }),
    talk: (r) => r ? `We run ${r.systems.join(', ') || 'no MES yet'}. How would AmIHub exchange data with it?` : 'How would AmIHub connect to our systems?',
    summary: (r) => r ? `Systems ${r.systems.join(', ')}; AmIHub ${r.hosting}; wants the integration note` : 'Wants an integration view',
  },
  // ---------------------------------------------------------------------------------------------- tag fit
  tags: {
    h: ['What would you tag?', 'Tag the carrier, not the part.'],
    p: 'Choose what moves on your floor. You get how each one fits, what to check first, and the honest exceptions.',
    tool: 'Tag match',
    form: (P) => `<fieldset class="mg-q"><legend>What do your teams look for? <small>Choose all that apply.</small></legend>${checks('it', [['trolleys', 'Trolleys'], ['bins', 'Bins'], ['kit racks', 'Kit racks'], ['pallets', 'Pallets'], ['tools and fixtures', 'Tools and fixtures'], ['forklifts', 'Forklifts or tuggers'], ['AMRs', 'AGVs or AMRs'], ['loose parts', 'Individual parts'], ['people', 'People']], ['trolleys', 'tools and fixtures'])}</fieldset>`,
    run: (f, C) => { const i = vals(f, 'it'); return i.length ? C.matchTags({ items: i }) : null; },
    remember: (r) => ({ carriers: r.items.filter((x) => !/people|parts/.test(x.item)).map((x) => x.item).join(', '), tool_tags: r.items.map((x) => x.item).join(', ') }),
    talk: (r) => r ? `We'd tag ${r.items.map((x) => x.item).join(', ')}. What should we check first?` : 'What should we tag first?',
    summary: (r) => r ? `Would tag ${r.items.map((x) => x.item).join(', ')}` : 'Asked what to tag',
  },
  // ---------------------------------------------------------------------------------------------- buying committee
  committee: {
    h: ['Build your internal case.', 'Bring the right people in.'],
    p: 'A plant pilot needs a few people to agree. Say who you are and who else signs. You get what each of them needs to see, and a short note to your plant head that you can send today.',
    tool: 'Committee map',
    form: (P) => `<fieldset class="mg-q"><legend>You are</legend>${radios('me', ROLES, 'prod')}</fieldset><fieldset class="mg-q"><legend>Who else needs to agree? <small>Choose all that apply.</small></legend>${checks('others', ROLES, ['plant', 'ie', 'mes', 'it', 'fin'])}</fieldset>
      <label class="mg-q"><span class="mg-lab">Company <small>Optional. Used only in your note.</small></span><span class="mg-add"><input name="company" value="${''}" autocomplete="organization"></span></label>`,
    wire(f, go, A) { const c = A.profile().company; if (c) f.elements.company.value = c; },
    run: (f, C) => C.mapCommittee({ role: val(f, 'me'), others: vals(f, 'others'), company: f.elements.company.value.trim() }),
    remember: (r, f) => ({ role: r.you.name, company: f.elements.company.value.trim(), tool_committee: r.people.map((p) => p.name).join(', ') }),
    talk: (r) => r ? `I'm the ${r.you.name.toLowerCase()}. How do I get ${r.people.filter((p) => !p.you).slice(0, 2).map((p) => p.name.toLowerCase()).join(' and ')} on board?` : 'How do I build the internal case?',
    summary: (r) => r ? `${r.you.name} building the case; committee ${r.people.map((p) => p.name).join(', ')}` : 'Building an internal case',
  },
  // ---------------------------------------------------------------------------------------------- sample plant
  plant: {
    h: ['Ask the sample plant.', 'The way an assistant would.'],
    p: 'One morning in a sample plant, at 10:56. Ask where a carrier is, what waits in a zone, or what has passed its rule. Each answer shows the query an assistant would make. Simulation: illustrative data.',
    tool: 'Sample plant',
    form: () => `<fieldset class="mg-q"><legend>Ask</legend><div class="mg-chips" data-qs>${['What is past its rule?', 'Where is C-014?', 'Where is job J-214?', 'What waits in Buffer B?', 'What has waited 30 minutes or more?'].map((q, i) => `<button type="button" aria-pressed="${i === 0}">${q}</button>`).join('')}</div></fieldset>
      <p class="mg-hint">An assistant reads; any action, such as raising a work order, waits for a person’s approval.</p>`,
    wire(f, go) { f._q = 'What is past its rule?'; f.querySelector('[data-qs]').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; f.querySelectorAll('[data-qs] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); f._q = b.textContent; go(); }); },
    run(f, C) {
      const q = f._q || ''; const id = q.match(/\b([CJBKT]-\d{2,3})\b/);
      return id ? C.askSamplePlant({ op: 'locate', id: id[1] }) : /Buffer B/.test(q) ? C.askSamplePlant({ op: 'waiting', zone: 'Buffer B' }) : /30 minutes/.test(q) ? C.askSamplePlant({ op: 'waiting', min_minutes: 30 }) : C.askSamplePlant({ op: 'exceptions' });
    },
    remember: () => ({}),
    talk: () => 'In the sample plant, what is past its rule, and who should act?',
    summary: () => 'Tried the sample plant; interested in AI assistants over MCP',
  },
};
