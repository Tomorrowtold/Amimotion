// Ask AmIMotion: the inbound agent in the page.
// - Remembers the visitor's floor across pages, in their own browser only (what they told the guide, the tools and the
//   diagnostic they used, the pages they read), and shows them exactly what it remembers, with a Forget button.
// - Answers with the best engine it can reach: the site's /api/agent (Claude with the site's tools), else Claude in
//   the preview viewer, else the local engine (same tools, the site's own passages). Every reply passes the claims gate.
// - Works the tools inside the chat (anchors, search time, pilot brief, flow, floor check, data exchange, tags,
//   buying committee, the sample plant) and turns real interest into a floor profile an engineer replies to.
// - Mounts the inner-page magnets (magnets.js) and gives them the same memory and hand-off.
(() => {
  const d = document, html = d.documentElement;
  const R = html.dataset.root || '/', IDX = html.dataset.index || '';
  const at = (p) => new URL(R + p.replace(/^\//, ''), location.href).href;   // absolute: import() resolves against the script, not the page
  const href = (u) => { if (R === '/') return u; const [p, f] = String(u).split('#'); return R + p.slice(1) + (p.endsWith('/') ? IDX : '') + (f ? '#' + f : ''); };
  // files this script loads at runtime (listed so the build ships them)
  const FILES = { core: '/assets/js/agent-core.js', magnets: '/assets/js/magnets.js', css: '/assets/js/agent.css', kb: '/assets/agent/kb.json' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fmt = (n) => Math.round(n).toLocaleString('en-IN');
  const PATH = location.pathname.replace(/index\.html$/, '').replace(/^.*?(\/[a-z-]+\/(?:[a-z-]+\/)?)$/, '$1') || '/';

  // ------------------------------------------------------------------ memory (this browser only)
  const KEY = 'amimotion.visitor';
  const blank = () => ({ v: 1, profile: {}, pages: [], tools: [], visits: 1, first: Date.now(), last: Date.now(), transcript: [], cards: [], diagnostic: false, sent: null });
  let MEM = blank();
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) MEM = Object.assign(blank(), s); } catch (e) {}
  try { if (!sessionStorage.getItem(KEY + '.s')) { sessionStorage.setItem(KEY + '.s', '1'); if (Date.now() - MEM.last > 30 * 60e3) MEM.visits++; } } catch (e) {}
  MEM.last = Date.now();
  if (MEM.pages[MEM.pages.length - 1] !== PATH) MEM.pages = MEM.pages.concat(PATH).slice(-40);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(MEM)); } catch (e) {} };
  save();
  const signals = () => ({ pages: MEM.pages, tools: MEM.tools, visits: MEM.visits, diagnostic: MEM.diagnostic });
  const remember = (patch) => { for (const [k, v] of Object.entries(patch || {})) if (v != null && String(v).trim()) MEM.profile[k] = typeof v === 'string' ? v.slice(0, 300) : v; save(); paintFloor(); };
  const usedTool = (name) => { if (!MEM.tools.includes(name)) { MEM.tools = MEM.tools.concat(name).slice(-20); save(); } };
  // the planning tools and the diagnostic feed the same memory
  d.querySelectorAll('[data-tool]').forEach((f) => { let t; f.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { usedTool({ anchors: 'Anchor estimate', search: 'Search-time sum', pilot: 'Pilot brief' }[f.dataset.tool] || f.dataset.tool); if (f.dataset.tool === 'anchors') remember({ tool_anchors: `${f.elements.flen.value}×${f.elements.fwid.value} m, ${f.elements.height.value} m ceiling` }); }, 600); }); });
  const DIAG = { assets: { carriers: 'WIP carriers and bins', tools: 'tools and fixtures', vehicles: 'forklifts and tuggers', robots: 'AGVs and AMRs', goods: 'pallets and finished goods' }, found: { walk: 'someone walks the floor', call: 'phone or radio around', mes: 'last scan in MES or ERP', board: 'whiteboard or spreadsheet', late: 'find out when it is late' }, wait: { machasm: 'between machining and assembly', qc: 'before inspection or QC', dock: 'at the dock or in staging', rework: 'in rework', unknown: 'can’t tell' }, link: { scan: 'scan', paper: 'paper', mes: 'mes', none: 'none' }, scope: { cell: 'bay', line: 'line', hall: 'hall', plant: 'plant' }, role: { plant: 'Plant or operations head', prod: 'Production or production control', scm: 'Supply chain and logistics', eng: 'Engineering, OT or IT', other: '' } };
  d.addEventListener('amimotion:diag', (e) => { const A = (e.detail && e.detail.A) || {}; remember({ carriers: (A.assets || []).map((x) => DIAG.assets[x]).join(', '), found_today: DIAG.found[A.found], waits_at: DIAG.wait[A.wait], link: DIAG.link[A.link], start: DIAG.scope[A.scope], role: DIAG.role[A.role] }); });
  d.addEventListener('amimotion:diagnostic-complete', () => { MEM.diagnostic = true; usedTool('Floor diagnostic'); save(); });

  // ------------------------------------------------------------------ lazy pieces
  let CORE, IX, SAMPLE;
  const core = () => CORE || (CORE = import(at(FILES.core)));
  const kb = () => IX || (IX = Promise.all([core(), fetch(at(FILES.kb)).then((r) => r.json())]).then(([c, k]) => c.indexKB(k)).catch(() => null));
  const css = () => { if (d.getElementById('askw-css')) return; const l = d.createElement('link'); l.id = 'askw-css'; l.rel = 'stylesheet'; l.href = at(FILES.css); d.head.append(l); };
  // the preview viewer can lend its own Claude (it asks the viewer first); on the live site the server answers
  const sampleFn = () => SAMPLE ?? (SAMPLE = (window.claude && window.claude.use ? Promise.race([window.claude.use('sample'), new Promise((r) => setTimeout(() => r(null), 4000))]).catch(() => null) : Promise.resolve(null)));
  let serverDead = location.protocol === 'file:';

  // ------------------------------------------------------------------ cards (shared with the magnets)
  const SIM = '<span class="askw-sim">Simulation</span>';
  function svgFlow(c) {
    const n = c.stations.length, w = 640, h = 92, gap = w / n;
    return `<svg class="askw-flow" viewBox="0 0 ${w} ${h}" role="img" aria-label="Your flow: ${esc(c.stations.join(', '))}. Work waits at ${esc(c.waits_at)}.">` +
      `<line x1="${gap / 2}" y1="38" x2="${w - gap / 2}" y2="38" class="ln"/>` +
      c.stations.map((s, i) => { const x = gap / 2 + i * gap, wt = s === c.waits_at, inP = c.pilot_zones.includes(s); return `<g class="${wt ? 'wt' : inP ? 'in' : ''}"><rect x="${x - 15}" y="23" width="30" height="30" rx="3"/>${wt ? `<circle cx="${x}" cy="38" r="5"/>` : ''}<text x="${x}" y="78" text-anchor="middle">${esc(s.length > 14 ? s.slice(0, 13) + '…' : s)}</text></g>`; }).join('') +
      (() => { const ix = c.stations.map((s, i) => (c.pilot_zones.includes(s) ? i : -1)).filter((i) => i >= 0); const x1 = gap / 2 + ix[0] * gap - 26, x2 = gap / 2 + ix[ix.length - 1] * gap + 26; return `<rect class="pz" x="${x1}" y="10" width="${x2 - x1}" height="56" rx="6"/><text class="pzl" x="${x1 + 6}" y="7">first bay</text>`; })() + '</svg>';
  }
  function svgAnchors(c) {
    const W = 300, H = Math.max(90, Math.min(200, 300 * c.width_m / c.length_m)), sx = (W - 20) / c.length_m, sy = (H - 20) / c.width_m;
    let g = ''; for (let i = 0; i <= c.nx; i++) for (let j = 0; j <= c.ny; j++) { const x = 10 + Math.min(c.length_m, i * c.grid_m) * sx, y = 10 + Math.min(c.width_m, j * c.grid_m) * sy; g += `<rect x="${x - 2.5}" y="${y - 2.5}" width="5" height="5"/>`; }
    return `<svg class="askw-plan" viewBox="0 0 ${W} ${H}" role="img" aria-label="Plan of a ${c.length_m} by ${c.width_m} metre floor with the planning grid."><rect class="fl" x="10" y="10" width="${W - 20}" height="${H - 20}"/>${g}</svg>`;
  }
  const acts = (c, extra = '') => `<div class="askw-acts">${extra}${c.page ? `<a class="askw-more" href="${href(c.page)}">Open the full page</a>` : ''}</div>`;
  const CARDS = {
    anchors: (c) => `<div class="askw-card"><p class="askw-k">First range, AmIMo anchors</p><p class="askw-big">${c.low}–${c.high}</p><p class="askw-s">${c.length_m} × ${c.width_m} m · ${c.ceiling_m} m ceiling · ${{ open: 'open hall', mixed: 'some racking', dense: 'dense racking' }[c.floor]} · ${c.position.toUpperCase()}</p>${svgAnchors(c)}<p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    search: (c) => `<div class="askw-card"><p class="askw-k">Time spent searching</p><p class="askw-big">${fmt(c.hours_year)} <small>hours a year</small></p><p class="askw-s">${c.hours_day} h a day · ${c.fte} full-time people${c.cost_year ? ' · ₹' + fmt(c.cost_year) + ' a year' : ''}</p><p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    brief: (c) => `<div class="askw-card askw-sheet"><p class="askw-k">AmIMotion pilot brief</p><dl><dt>What we need to understand</dt><dd>${esc(c.goal)}</dd><dt>Where we begin</dt><dd>${esc(c.start)}</dd><dt>How work is linked to trolleys today</dt><dd>${esc(c.link)}</dd></dl><p class="askw-k">To settle before hardware arrives</p><ol>${c.settle.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>${acts(c, `<button type="button" class="askw-btn" data-dl="AmIMotion-pilot-brief.txt" data-text="${esc(c.text)}">Download</button>`)}</div>`,
    flow: (c) => `<div class="askw-card"><p class="askw-k">Your first bay</p>${svgFlow(c)}<ul class="askw-zones">${c.zones.map((z) => `<li class="${z.name === c.waits_at ? 'wt' : c.pilot_zones.includes(z.name) ? 'in' : ''}"><b>${esc(z.name)}</b> ${esc(z.role)}</li>`).join('')}</ul><p class="askw-k">What you’d see first</p><ul>${c.first_views.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="askw-k">We’d ask on a floor walk</p><ul>${c.questions.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    floor: (c) => `<div class="askw-card"><p class="askw-k">Your floor, point by point</p><ul class="askw-checks">${c.points.map(([k, t]) => `<li class="${k}"><i aria-hidden="true"></i><span><b class="vh">${k === 'ok' ? 'Fine:' : 'To check:'}</b> ${esc(t)}</span></li>`).join('')}</ul><p class="askw-k">The survey will test</p><ul>${c.survey_will_test.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    exchange: (c) => `<div class="askw-card"><p class="askw-k">Your data exchange</p><p class="askw-s">AmIHub ${esc(c.hosting)}</p><ul class="askw-ex">${c.flows.map((f) => `<li><span>${esc(f.from)}</span><i aria-hidden="true"></i><span>${esc(f.to)}</span><em>${esc(f.what)} · ${esc(f.how)}</em></li>`).join('')}</ul><p class="askw-k">How a trolley links to a job</p><ol>${c.contract.map((s) => `<li>${esc(s)}</li>`).join('')}</ol><p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    tags: (c) => `<div class="askw-card"><p class="askw-k">What you’d tag</p><ul class="askw-tags">${c.items.map((r) => `<li><b>${esc(r.item)}</b><span class="askw-fit">${esc(r.fit)}</span><span>${esc(r.why)}</span><em>${esc(r.check)}</em></li>`).join('')}</ul><p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    committee: (c) => `<div class="askw-card"><p class="askw-k">Who usually says yes</p><ul class="askw-people">${c.people.map((p) => `<li class="${p.you ? 'you' : ''}"><b>${esc(p.name)}${p.you ? ' (you)' : ''}</b><span>${esc(p.needs)}</span><em>${esc(p.asset)}</em></li>`).join('')}</ul><p class="askw-k">${c.boss ? 'A note to your team' : 'A note to your plant head'}</p><pre class="askw-mail">${esc(c.email)}</pre><p class="askw-note">${esc(c.note)}</p>${acts(c, `<button type="button" class="askw-btn" data-copy="${esc(c.email)}">Copy the note</button>`)}</div>`,
    plant: (c) => `<div class="askw-card"><p class="askw-k">${SIM} The sample plant at ${esc(c.snapshot)}</p><p class="askw-call"><code>${esc(c.call)}</code></p>${c.rows.length ? `<table class="askw-tab"><thead><tr><th>Carrier</th><th>Job</th><th>Zone</th><th>Waiting</th></tr></thead><tbody>${c.rows.map((r) => `<tr class="${r.over_rule ? 'over' : ''}"><td>${esc(r.id)}</td><td>${esc(r.job || '—')}</td><td>${esc(r.zone)}</td><td>${r.dwell_min} min${r.rule_min ? ` / ${r.rule_min}` : ''}</td></tr>`).join('')}</tbody></table>` : '<p class="askw-s">Nothing matches.</p>'}<p class="askw-note">${esc(c.note)}</p>${acts(c)}</div>`,
    related: (c) => `<ul class="askw-rel">${c.items.map((x) => `<li><a href="${href(x.url)}">${esc(x.heading || x.page)}<span>${esc(x.page)}</span></a></li>`).join('')}</ul>`,
    handoff: (c) => handoffForm(c),
  };
  function card(c) { const f = CARDS[c.type]; return f ? f(c) : ''; }
  // download and copy buttons inside any card
  d.addEventListener('click', async (e) => {
    const dl = e.target.closest('[data-dl]'); if (dl) { const a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([dl.dataset.text], { type: 'text/plain' })); a.download = dl.dataset.dl; a.click(); return; }
    const cp = e.target.closest('[data-copy]'); if (cp) { try { await navigator.clipboard.writeText(cp.dataset.copy); const was = cp.textContent; cp.textContent = 'Copied'; setTimeout(() => { cp.textContent = was; }, 1800); } catch (_) {} }
  });

  // ------------------------------------------------------------------ hand-off: the floor profile goes to a person
  function handoffForm(c = {}) {
    const P = MEM.profile;
    if (MEM.sent && Date.now() - MEM.sent.at < 6 * 3600e3) return `<div class="askw-card askw-done"><p><b>Your floor profile is with the team.</b></p><p class="askw-s">An engineer replies to ${esc(MEM.sent.email)}. Anything you add here goes with it if you send again.</p></div>`;
    const know = floorLines();
    return `<form class="askw-card askw-hand" data-hand novalidate><p class="askw-k">Send your floor profile to an engineer</p>
      ${know.length ? `<ul class="askw-know">${know.map(([k, v]) => `<li><span>${esc(k)}</span>${esc(v)}</li>`).join('')}</ul>` : ''}
      <input type="hidden" name="summary" value="${esc(c.summary || '')}">
      <label class="askw-f"><span>Name</span><input name="name" autocomplete="name" required value="${esc(P.name || '')}"></label>
      <label class="askw-f"><span>Work email</span><input name="email" type="email" autocomplete="email" required value="${esc(P.email || '')}"></label>
      <div class="askw-row"><label class="askw-f"><span>Company</span><input name="company" autocomplete="organization" value="${esc(P.company || '')}"></label><label class="askw-f"><span>Role</span><input name="role" autocomplete="organization-title" value="${esc(P.role || '')}"></label></div>
      <label class="askw-f"><span>Phone or WhatsApp <i>(optional)</i></span><input name="phone" type="tel" autocomplete="tel" value="${esc(P.phone || '')}"></label>
      <label class="askw-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <label class="askw-c"><input type="checkbox" name="reply" required checked> <span>Reply to me about my floor. AmIMotion uses this only to answer me. <a href="${href('/privacy/')}">Privacy</a></span></label>
      <label class="askw-c"><input type="checkbox" name="updates"> <span>Also send me new field guides, now and then.</span></label>
      <p class="askw-err" data-err role="alert"></p>
      <button class="cta" type="submit">Send to the team</button></form>`;
  }
  const LINKN = { none: 'Not linked yet', scan: 'A barcode scan', mes: 'An MES or ERP record', paper: 'A paper traveller', na: 'Not needed' };
  function floorLines() {
    const P = MEM.profile, L = [];
    if (P.carriers) L.push(['What moves', P.carriers]); if (P.waits_at) L.push(['Where it waits', P.waits_at]); if (P.found_today) L.push(['Found today by', P.found_today]);
    if (P.link) L.push(['Job to trolley', LINKN[P.link] || P.link]); if (P.start) L.push(['Start with', P.start]); if (P.systems) L.push(['Systems', P.systems]);
    if (P.role) L.push(['Role', P.role]); if (P.company) L.push(['Company', P.company]); if (P.timing) L.push(['Timing', P.timing]);
    Object.keys(P).filter((k) => k.startsWith('tool_')).forEach((k) => L.push([{ tool_anchors: 'Anchor estimate', tool_search: 'Search time', tool_brief: 'Pilot brief', tool_flow: 'Flow plan', tool_floor: 'Floor check', tool_exchange: 'Data exchange', tool_tags: 'Tags', tool_committee: 'Committee' }[k] || k, P[k]]));
    return L;
  }
  async function sendLead(form, source) {
    const f = form.elements, err = form.querySelector('[data-err]'); err.textContent = '';
    if (!f.name.value.trim()) { err.textContent = 'Add your name.'; f.name.focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) { err.textContent = 'Add a valid work email.'; f.email.focus(); return; }
    if (!f.reply.checked) { err.textContent = 'We need your OK to reply.'; f.reply.focus(); return; }
    remember({ name: f.name.value.trim(), email: f.email.value.trim(), company: f.company.value.trim(), role: f.role.value.trim(), phone: f.phone.value.trim() });
    const payload = { profile: MEM.profile, signals: { ...signals(), asked_for_call: true }, transcript: MEM.transcript.slice(-30), cards: MEM.cards.slice(-10), summary: f.summary.value, page: location.href, source: source || 'agent', website: f.website.value, consent: { reply: true, updates: f.updates.checked } };
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';
    let how = 'draft';
    if (!serverDead) { try { const r = await fetch(at('/api/lead'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }); if (r.ok) how = 'sent'; else if (r.status === 404 || r.status === 405) serverDead = true; } catch (_) { serverDead = true; } }
    if (how !== 'sent' && window.claude && window.claude.use) { try { const db = await Promise.race([window.claude.use('db'), new Promise((r) => setTimeout(() => r(null), 3000))]); if (db) { const c = await core(); const doc = c.dossier({ id: 'P' + Date.now().toString(36), ...payload }); doc.status = 'new'; doc.desk = 'preview'; await db.collection('leads').doc(doc.id).set(JSON.parse(JSON.stringify(doc))); how = 'sent'; } } catch (_) {} }
    if (how !== 'sent') { const c = await core(); const doc = c.dossier({ ...payload }); const body = `${doc.summary || 'Floor profile from amimotion.com'}\n\n` + floorLines().map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nName: ${MEM.profile.name}\nEmail: ${MEM.profile.email}\nCompany: ${MEM.profile.company || '-'}\nRole: ${MEM.profile.role || '-'}\nPhone: ${MEM.profile.phone || '-'}`; location.href = `mailto:sales@amimotion.com?subject=${encodeURIComponent('Floor profile — ' + (MEM.profile.company || MEM.profile.name))}&body=${encodeURIComponent(body)}`; }
    MEM.sent = { at: Date.now(), email: MEM.profile.email, how }; save();
    form.outerHTML = `<div class="askw-card askw-done" tabindex="-1"><p><b>${how === 'sent' ? `Thank you, ${esc(MEM.profile.name.split(' ')[0])}. Your floor profile is with the team.` : 'Your email app should open with your floor profile ready to send.'}</b></p><p class="askw-k">What happens next</p><ol><li>A call, with a live demo on real AmIHub data.</li><li>The NDA pack: datasheets, architecture, prices and pilot options.</li><li>A site survey, and a pilot in one bay or line.</li><li>Then plant-wide, on the same AmIHub, if the bay proves its numbers.</li></ol></div>`;
    d.dispatchEvent(new CustomEvent('amimotion:lead', { detail: { how, source } }));
  }
  d.addEventListener('submit', (e) => { const f = e.target.closest('[data-hand]'); if (!f) return; e.preventDefault(); sendLead(f, f.dataset.source); });

  // ------------------------------------------------------------------ the panel
  let panel, log, input, chipsEl, busy = false, opened = false;
  const LABEL = 'Ask AmIMotion';
  function build() {
    if (panel) return; css();
    panel = d.createElement('aside'); panel.className = 'ag'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'askw-t'); panel.hidden = true;
    panel.innerHTML = `<header class="askw-h"><p id="askw-t"><b>${LABEL}</b><span data-eng>Answers from AmIMotion’s own pages</span></p><button type="button" class="askw-x" data-floor aria-expanded="false">Your floor</button><button type="button" class="askw-x askw-close" aria-label="Close">×</button></header>
      <div class="askw-floor" hidden><p class="askw-k">What this site remembers about your floor</p><div data-floor-list></div><p class="askw-note">Kept in this browser only, until you send it. Nothing leaves your device before that.</p><button type="button" class="askw-btn" data-forget>Forget everything</button></div>
      <div class="askw-log" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="askw-chips" data-chips></div>
      <form class="askw-in"><label class="vh" for="askw-q">Ask about your floor</label><textarea id="askw-q" rows="1" placeholder="Ask about your floor, a tool or a pilot" enterkeyhint="send"></textarea><button type="submit" aria-label="Send">↑</button></form>`;
    d.body.append(panel);
    log = panel.querySelector('.askw-log'); input = panel.querySelector('textarea'); chipsEl = panel.querySelector('[data-chips]');
    panel.querySelector('.askw-close').addEventListener('click', close);
    panel.querySelector('[data-floor]').addEventListener('click', (e) => { const fl = panel.querySelector('.askw-floor'); fl.hidden = !fl.hidden; e.currentTarget.setAttribute('aria-expanded', String(!fl.hidden)); paintFloor(); });
    panel.querySelector('[data-forget]').addEventListener('click', () => { MEM = blank(); save(); log.innerHTML = ''; paintFloor(); greet(); });
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    panel.querySelector('.askw-in').addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
    input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(140, input.scrollHeight) + 'px'; });
    chipsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.key) { core().then((c) => remember(c.chipPatch(b.dataset.key, b.textContent))); } ask(b.textContent, !!b.dataset.key); });
    // replay this visitor's conversation from earlier pages
    MEM.transcript.slice(-10).forEach((m) => bubble(m.role, m.content));
    if (!MEM.transcript.length) greet();
    paintFloor();
  }
  function paintFloor() {
    if (!panel) return; const L = floorLines(), box = panel.querySelector('[data-floor-list]');
    box.innerHTML = L.length ? `<ul class="askw-know">${L.map(([k, v]) => `<li><span>${esc(k)}</span>${esc(v)}</li>`).join('')}</ul>` : '<p class="askw-s">Nothing yet. Tell the guide about your floor, or try a tool.</p>';
    const n = L.length; panel.querySelector('[data-floor]').textContent = n ? `Your floor · ${n}` : 'Your floor';
  }
  function greet() {
    core().then((c) => {
      const L = floorLines();
      bubble('assistant', L.length ? `Welcome back. I remember your floor: ${L.slice(0, 3).map(([k, v]) => `${k.toLowerCase()} ${v}`).join('; ')}. What would you like to work out next?` : 'Ask me anything about AmIMotion, or about your floor. I can size anchors, write a pilot brief, plan your first bay, sketch the data exchange with your MES, or query a sample plant.', true);
      chips(c.pageChips(PATH));
    });
  }
  function chips(list, key) { chipsEl.innerHTML = (list || []).map((t) => `<button type="button"${key ? ` data-key="${esc(key)}"` : ''}>${esc(t)}</button>`).join(''); }
  function bubble(role, text, transient) {
    const el = d.createElement('div'); el.className = 'askw-m ' + (role === 'user' ? 'me' : 'it');
    el.innerHTML = `<p>${esc(text).replace(/\n/g, '<br>')}</p>`; log.append(el); log.scrollTop = log.scrollHeight;
    return el;
  }
  function open(q) {
    build(); panel.hidden = false; opened = true; html.classList.add('askw-open');
    requestAnimationFrame(() => panel.classList.add('on'));
    launcher && launcher.setAttribute('aria-expanded', 'true');
    if (q) ask(q); else setTimeout(() => input.focus({ preventScroll: true }), 60);
    kb();
  }
  function close() { if (!panel) return; panel.classList.remove('on'); html.classList.remove('askw-open'); setTimeout(() => { panel.hidden = true; }, 220); launcher && (launcher.setAttribute('aria-expanded', 'false'), launcher.focus({ preventScroll: true })); }

  // ------------------------------------------------------------------ one turn
  async function ask(text, fromChip) {
    text = String(text || '').trim(); if (!text || busy) return;
    busy = true; input.value = ''; input.style.height = 'auto'; chips([]);
    bubble('user', text); MEM.transcript.push({ role: 'user', content: text.slice(0, 1500) });
    const wait = bubble('assistant', ''); wait.classList.add('wait'); wait.querySelector('p').innerHTML = '<span class="askw-dots" aria-label="Thinking"><i></i><i></i><i></i></span>';
    let r;
    try { r = await answer(text); } catch (e) { r = null; }
    if (!r) { const c = await core(); r = c.localTurn({ message: text, profile: MEM.profile, page: PATH, index: await kb(), turns: MEM.transcript.filter((m) => m.role === 'user').length - 1 }); }
    wait.classList.remove('wait');
    wait.querySelector('p').innerHTML = esc(r.text).replace(/\n/g, '<br>') + (r.source ? ` <a class="askw-src" href="${href(r.source.url)}">${esc(r.source.page)}</a>` : '');
    (r.cards || []).forEach((c) => { const h = card(c); if (h) { const box = d.createElement('div'); box.className = 'askw-m it card'; box.innerHTML = h; log.append(box); if (c.type !== 'related' && c.type !== 'handoff') { MEM.cards = MEM.cards.concat(c).slice(-10); usedTool({ anchors: 'Anchor estimate', search: 'Search-time sum', brief: 'Pilot brief', flow: 'Flow plan', floor: 'Floor check', exchange: 'Data exchange', tags: 'Tag match', committee: 'Committee map', plant: 'Sample plant' }[c.type]); } } });
    if (r.profilePatch) remember(r.profilePatch);
    MEM.transcript.push({ role: 'assistant', content: r.text.slice(0, 1500) }); MEM.transcript = MEM.transcript.slice(-30); save();
    const eng = panel.querySelector('[data-eng]'); eng.textContent = r.engine === 'claude' ? 'Claude, answering from AmIMotion’s own pages' : 'Answers from AmIMotion’s own pages';
    if (r.question) { const q = bubble('assistant', r.question.text); q.classList.add('q'); chips(r.question.chips, r.question.key); }
    else chips(r.handoff ? [] : (r.suggestions || []).concat(MEM.transcript.length >= 6 && !MEM.sent && !(r.cards || []).some((c) => c.type === 'handoff') ? ['Talk to an engineer'] : []));
    log.scrollTop = log.scrollHeight; busy = false;
  }
  async function answer(text) {
    const c = await core(), turns = MEM.transcript.filter((m) => m.role === 'user').length - 1;
    const body = { messages: MEM.transcript.slice(-14), profile: MEM.profile, page: PATH, signals: signals() };
    if (!serverDead) {
      try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 60000);
        const r = await fetch(at('/api/agent'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal }); clearTimeout(t);
        if (r.ok && (r.headers.get('content-type') || '').includes('json')) return await r.json();
        if ([404, 405, 501].includes(r.status) || !(r.headers.get('content-type') || '').includes('json')) serverDead = true;
      } catch (_) { serverDead = true; }
    }
    const sample = await sampleFn();
    if (sample) { try { return await sampleTurn(sample, c, text, turns); } catch (e) { if (e && (e.code === 'not_granted')) SAMPLE = Promise.resolve(null); } }
    return c.localTurn({ message: text, profile: MEM.profile, page: PATH, index: await kb(), turns });
  }
  // Claude through the preview viewer: the same rules, the founders' facts, the best site passages, the same tools
  async function sampleTurn(sample, c, text, turns) {
    const ix = await kb(), hits = c.search(ix, MEM.transcript.filter((m) => m.role === 'user').slice(-2).map((m) => m.content).join(' '), 14);
    const rules = `${c.POLICY}\n\nFACTS:\n${c.FACTS.map((f) => '- ' + f).join('\n')}\n\nSITE PASSAGES for this question ([page] heading: text):\n${hits.map((h) => `[${h.page}] ${h.heading}: ${h.text}`).join('\n')}\n\nPage the visitor is on: ${PATH}. What the site knows about their floor: ${JSON.stringify(MEM.profile)}.\nReply in plain text, two to five sentences.`;
    const cards = [], patch = {}; let handoff = false;
    const tools = c.TOOL_DEFS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.input_schema, execute: (inp) => { const out = c.runTool(t.name, inp || {}, { index: ix }); if (out && c.CARD_TYPES.has(out.type)) { cards.push(out); if (out.type === 'handoff') handoff = true; } if (t.name === 'remember') Object.assign(patch, inp || {}); return out; } }));
    const convo = MEM.transcript.slice(-12).map((m) => ({ role: m.role, content: m.content }));
    while (convo.length && convo[0].role !== 'user') convo.shift();
    const { text: out } = await sample([{ role: 'user', content: rules }, { role: 'assistant', content: 'Understood.' }, ...convo], { tools, cache: false, modelTier: 'quick' });
    let reply = String(out || '').trim(), source = null;
    const src = reply.match(/\n?Source:\s*(.+)\s*$/i); if (src) { reply = reply.slice(0, src.index).trim(); const hit = hits.find((h) => h.page.toLowerCase() === src[1].trim().toLowerCase()); if (hit) source = { page: hit.page, url: hit.url }; }
    if (!reply || !c.gate(reply, text).ok) return c.localTurn({ message: text, profile: MEM.profile, page: PATH, index: ix, turns });
    const q = handoff || /\?\s*$/.test(reply) ? null : c.nextQuestion(c.mergeProfile(MEM.profile, patch), turns);
    return { text: reply, cards, source, handoff, profilePatch: patch, question: q, suggestions: c.pageChips(PATH), engine: 'claude' };
  }

  // ------------------------------------------------------------------ doors into the agent
  // 1. a quiet launcher, once the visitor has scrolled a little (never over the first screen)
  let launcher = null;
  if (!html.dataset.noAgent) {
    launcher = d.createElement('button'); launcher.type = 'button'; launcher.className = 'askw-launch'; launcher.setAttribute('aria-expanded', 'false');
    launcher.innerHTML = `<span class="askw-dot" aria-hidden="true"></span>${LABEL}`;
    launcher.addEventListener('click', () => (opened && !panel.hidden ? close() : open()));
    const show = () => { if (scrollY > innerHeight * 0.5 || MEM.transcript.length) { css(); d.body.append(launcher); requestAnimationFrame(() => launcher.classList.add('on')); removeEventListener('scroll', show); } };
    addEventListener('scroll', show, { passive: true }); show();
  }
  // 2. the nav's Ask field: when the instant answers are not enough, the question continues with the guide
  d.querySelectorAll('[data-ask]').forEach((form) => {
    const out = form.parentNode.querySelector('.nask-out'), inp = form.querySelector('input'); if (!out || !inp) return;
    new MutationObserver(() => {
      if (out.querySelector('.askw-go') || !inp.value.trim()) return;
      const a = d.createElement('button'); a.type = 'button'; a.className = 'askw-go'; a.innerHTML = `<b>Ask the guide</b><span>“${esc(inp.value.trim())}”, worked through for your floor</span>`;
      a.addEventListener('click', () => { const q = inp.value.trim(); const det = form.closest('details'); if (det) det.open = false; open(q); });
      out.append(a);
    }).observe(out, { childList: true });
  });
  // 3. any link or button with data-agent="question" opens the guide on that question
  d.addEventListener('click', (e) => { const b = e.target.closest('[data-agent]'); if (!b) return; e.preventDefault(); open(b.dataset.agent || ''); });
  // 4. the inner-page magnets
  const slots = d.querySelectorAll('[data-magnet]');
  if (slots.length) {
    const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); css(); Promise.all([core(), import(at(FILES.magnets))]).then(([c, m]) => slots.forEach((el) => m.mount(el, API, c))).catch((e) => console.error('magnets', e)); } }, { rootMargin: '600px 0px' });
    slots.forEach((el) => io.observe(el));
  }

  const API = { open, card, remember, usedTool, profile: () => MEM.profile, floorLines, handoffForm, href, esc, keepCard: (c) => { MEM.cards = MEM.cards.concat(c).slice(-10); save(); } };
  window.AmIAgent = API;
})();
