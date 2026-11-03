// Floor diagnostic: six quick questions, a live sketch of the visitor's floor, an instant profile,
// and only then an optional request for contact details. Leads go to AMIMOTION_CONFIG.leadEndpoint,
// or fall back to an email draft. Nothing is stored server-side by this site itself.
(() => {
  const root = document.querySelector('[data-diag]');
  if (!root) return;
  const CFG = window.AMIMOTION_CONFIG || { salesEmail: 'sales@amimotion.com' };
  const $ = (s, r = root) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const Q = [
    { id: 'assets', multi: true, title: 'What does your team look for?', sub: 'Choose all that apply.', options: [
      ['carriers', 'WIP carriers & bins', 'Jobs between operations'], ['tools', 'Tools & fixtures', 'Shared between cells'],
      ['vehicles', 'Forklifts & tuggers', 'Where they are, how they’re used'], ['robots', 'AGVs & AMRs', 'Alongside people and vehicles'],
      ['goods', 'Pallets & finished goods', 'Staging and dispatch'] ] },
    { id: 'found', title: 'How do people find it today?', sub: 'The honest answer is the useful one.', options: [
      ['walk', 'Someone walks the floor and looks', ''], ['call', 'Phone or radio around', ''], ['mes', 'Check the last scan in MES or ERP', ''],
      ['board', 'A whiteboard or spreadsheet', ''], ['late', 'We usually find out when it’s already late', ''] ] },
    { id: 'wait', title: 'Where does work wait the longest?', sub: 'Pick the place you’d want to see first.', options: [
      ['machasm', 'Between machining and assembly', ''], ['qc', 'Before inspection or QC', ''], ['dock', 'At the dock or in staging', ''],
      ['rework', 'In rework', ''], ['unknown', 'Honestly, we can’t tell', 'That is usually the problem'] ] },
    { id: 'link', title: 'How is a job linked to its carrier today?', sub: 'This decides whether location can mean “which job”.', options: [
      ['scan', 'A barcode or QR scan', ''], ['paper', 'A paper traveller', ''], ['mes', 'A record in our MES or ERP', ''], ['none', 'It isn’t, reliably', ''] ] },
    { id: 'scope', title: 'Where would you want to see it first?', sub: 'Most teams start small and scale on the same system.', options: [
      ['cell', 'One cell or bay', ''], ['line', 'One line or flow', ''], ['hall', 'One hall', ''], ['plant', 'The whole plant', ''] ] },
    { id: 'role', title: 'Last one. What’s your role?', sub: 'So the profile speaks your language.', options: [
      ['plant', 'Plant or operations head', ''], ['prod', 'Production or production control', ''], ['scm', 'Supply chain & logistics', ''],
      ['eng', 'Engineering, OT or IT', ''], ['other', 'Something else', ''] ] },
  ];
  const label = (qid, v) => (Q.find((q) => q.id === qid).options.find((o) => o[0] === v) || [, ''])[1];
  const A = { assets: [] };
  let i = 0, interacted = false;
  try { Object.assign(A, JSON.parse(sessionStorage.getItem('amimotion.diag') || '{}')); } catch (e) {}
  // round 13: an answer chosen on another page (/pilot/, the inline first question) arrives as ?assets=<value>
  try {
    const pre = new URLSearchParams(location.search).get('assets');
    if (pre && Q[0].options.some((o) => o[0] === pre) && !A.assets.includes(pre)) A.assets = [...A.assets, pre];
  } catch (e) {}
  const save = () => { try { sessionStorage.setItem('amimotion.diag', JSON.stringify(A)); } catch (e) {} };

  // ------------------------------------------------------------ question view
  const stage = $('[data-diag-stage]'), nav = $('[data-diag-nav]');
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the bar is six segments, one per question: answered ones filled, the current one drawing
  const bar = $('[data-diag-bar]').parentNode;
  bar.innerHTML = Q.map(() => '<i></i>').join(''); bar.classList.add('is-seg');
  const paintBar = (n, done) => bar.querySelectorAll('i').forEach((el, k) => { el.className = done || k < n ? 'on' : k === n ? 'cur' : ''; });
  // the 3D floor (diag3d.js) listens for this; it may load after us, so the state also sits on the root
  const emit = (result = false) => { root.__diag = { A: JSON.parse(JSON.stringify(A)), i, result }; document.dispatchEvent(new CustomEvent('amimotion:diag', { detail: root.__diag })); };
  let shown = -1, leaving = 0;
  function renderQ() {
    // a new question: the old one steps aside first, then the new one arrives
    if (shown !== -1 && shown !== i && stage.querySelector('.diag-q') && !REDUCED) {
      const dir = i > shown ? 1 : -1; shown = i;
      stage.firstElementChild.style.setProperty('--dir', dir); stage.firstElementChild.classList.add('is-leaving');
      clearTimeout(leaving); leaving = setTimeout(() => { stage.dataset.dir = dir; paintQ(); }, 170);
      paintBar(i); emit(); return;
    }
    shown = i; paintQ(); paintBar(i); emit();
  }
  function paintQ() {
    const q = Q[i];
    $('[data-diag-count]').textContent = `Question ${i + 1} of ${Q.length}`;
    const chosen = (v) => (q.multi ? A[q.id]?.includes(v) : A[q.id] === v);
    stage.innerHTML = `<div class="diag-q">
      <h3 tabindex="-1">${q.title}</h3><p class="diag-sub">${q.sub}</p>
      <div class="diag-options ${q.options.length > 5 ? 'two' : ''}" role="group" aria-label="${esc(q.title)}">
        ${q.options.map(([v, l, d], k) => `<button type="button" class="diag-opt" data-v="${v}" aria-pressed="${chosen(v)}"><span class="key">${k + 1}</span><span class="txt"><b>${l}</b>${d ? `<span>${d}</span>` : ''}</span></button>`).join('')}
      </div></div>`;
    nav.hidden = false;
    $('[data-diag-back]').style.visibility = i ? 'visible' : 'hidden';
    $('[data-diag-next]').disabled = q.multi ? !(A[q.id] || []).length : !A[q.id];
    $('[data-diag-next]').textContent = i === Q.length - 1 ? 'See my floor profile' : 'Continue';
    stage.querySelectorAll('.diag-opt').forEach((b) => b.addEventListener('click', () => choose(b.dataset.v)));
    if (interacted) stage.querySelector('h3').focus({ preventScroll: true });
  }
  function refreshQ() {
    const q = Q[i];
    stage.querySelectorAll('.diag-opt').forEach((b) => b.setAttribute('aria-pressed', String(q.multi ? (A[q.id] || []).includes(b.dataset.v) : A[q.id] === b.dataset.v)));
    $('[data-diag-next]').disabled = q.multi ? !(A[q.id] || []).length : !A[q.id];
  }
  function choose(v) {
    interacted = true;
    const q = Q[i];
    if (q.multi) { const s = new Set(A[q.id] || []); s.has(v) ? s.delete(v) : s.add(v); A[q.id] = [...s]; }
    else A[q.id] = v;
    save(); drawMap(); refreshQ(); emit();
    const b = stage.querySelector(`.diag-opt[data-v="${v}"]`); if (b) { b.classList.remove('is-hit'); void b.offsetWidth; b.classList.add('is-hit'); }
    if (!q.multi) setTimeout(() => { if (Q[i] === q) next(); }, 420);
  }
  function next() { const q = Q[i]; if (q.multi ? !(A[q.id] || []).length : !A[q.id]) return; if (i < Q.length - 1) { i++; renderQ(); } else renderResult(); }
  $('[data-diag-next]').addEventListener('click', () => { interacted = true; next(); });
  $('[data-diag-back]').addEventListener('click', () => { interacted = true; if (i > 0) { i--; renderQ(); } });
  root.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (/^[1-9]$/.test(e.key) && stage.querySelector('.diag-q')) { const o = Q[i].options[+e.key - 1]; if (o) { e.preventDefault(); choose(o[0]); } }
    if (e.key === 'Enter' && stage.querySelector('.diag-q') && !e.target.matches('button')) { e.preventDefault(); next(); }
  });

  // ------------------------------------------------------------ live sketch
  const map = $('[data-diag-map]'), caption = $('[data-diag-caption]');
  const Z = { dock: [20, 28, 96, 78, 'Dock'], mach: [132, 28, 150, 78, 'Machining'], queue: [298, 28, 74, 78, 'Queue'], asm: [388, 28, 72, 196, 'Assembly'],
    stage: [20, 146, 96, 78, 'Staging'], rework: [132, 146, 72, 78, 'Rework'], qc: [220, 146, 152, 78, 'Inspection'] };
  const WAITZ = { machasm: ['queue'], qc: ['qc'], dock: ['dock', 'stage'], rework: ['rework'], unknown: [] };
  let drawn = false;
  const ctr = (k) => [Z[k][0] + Z[k][2] / 2, Z[k][1] + Z[k][3] / 2];
  function drawMap() {
    const hot = WAITZ[A.wait] || [];
    // round 21 (Kenji): an engineering sketch. Hairline walls and zones, the hall outline, and every new mark draws in
    let s = `<defs><pattern id="g" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" class="m-grid"/></pattern></defs><rect width="480" height="330" fill="url(#g)"/>`;
    s += `<rect class="m-wall" x="12" y="18" width="456" height="216"/><path class="m-aisle" d="M14 126 H466 M124 20 V232 M290 20 V232"/>`;
    for (const [k, [x, y, w, h, l]] of Object.entries(Z)) {
      const isHot = hot.includes(k);
      s += `<g class="m-zone${isHot ? ' hot' : ''}"${isHot ? ` data-k="hot-${k}"` : ''}><rect x="${x}" y="${y}" width="${w}" height="${h}"/><text x="${x + 8}" y="${y + 16}">${l}</text>${isHot ? `<text class="m-flag" x="${x + 8}" y="${y + h - 10}">waits here</text>` : ''}</g>`;
      if (A.wait === 'unknown') s += `<text class="m-q" x="${x + w - 18}" y="${y + h - 10}">?</text>`;
    }
    const set = new Set(A.assets || []);
    const dots = [];
    const at = (k, n, x, y, inner) => dots.push(`<g data-k="${k}${n}" style="--d:${n * 60}ms" transform="translate(${x} ${y})"><g class="m-drop">${inner}</g></g>`);
    if (set.has('carriers')) [[60, 70], [190, 80], [240, 62], [318, 74], [345, 58], [250, 190]].forEach(([x, y], n) => at('c', n, x, y, `<rect class="m-carrier" x="-6" y="-4" width="12" height="8" rx="1"/>`));
    if (set.has('tools')) [[160, 50], [300, 180], [175, 185]].forEach(([x, y], n) => at('t', n, x, y, `<rect class="m-tool" x="-4" y="-4" width="8" height="8" transform="rotate(45)"/>`));
    if (set.has('vehicles')) [[50, 126], [96, 190]].forEach(([x, y], n) => at('v', n, x, y, `<rect class="m-vehicle" x="-11" y="-6" width="22" height="12" rx="2"/>`));
    if (set.has('robots')) [[230, 126], [372, 126]].forEach(([x, y], n) => at('r', n, x, y, `<circle class="m-robot" r="6"/>`));
    if (set.has('goods')) [[46, 176], [64, 176], [46, 192]].forEach(([x, y], n) => at('g', n, x, y, `<rect class="m-goods" x="-6" y="-6" width="12" height="12"/>`));
    s += dots.join('');
    // found-by overlay
    if (A.found === 'walk') s += `<path class="m-walk" data-k="walk" pathLength="1" d="M30 300 C120 250 160 140 240 150 S330 110 330 74"/><text class="m-note" x="30" y="318">Found on foot</text>`;
    if (A.found === 'call') s += `<text class="m-note" x="30" y="318">Found by phone and radio</text>`;
    if (A.found === 'mes') s += `<text class="m-note" x="30" y="318">Last scan, not the place</text>`;
    if (A.found === 'board') s += `<text class="m-note" x="30" y="318">Found on a whiteboard, updated by hand</text>`;
    if (A.found === 'late') s += `<text class="m-note warn" x="30" y="318">Found when it is already late</text>`;
    // job link
    if (A.link && set.has('carriers')) {
      const solid = A.link === 'mes' || A.link === 'scan';
      s += `<path class="m-link${solid ? '' : ' weak'}" data-k="link-${A.link}" pathLength="1" d="M318 74 L338 250"/><g class="m-job${solid ? '' : ' weak'}" data-k="job-${A.link}"><rect x="314" y="250" width="${A.link === 'none' ? 96 : 84}" height="24" rx="4"/><text x="322" y="266">${A.link === 'none' ? 'job: unknown' : A.link === 'paper' ? 'job · on paper' : 'job linked'}</text></g>`;
    }
    // pilot boundary
    const box = { cell: hot.length ? Z[hot[0]] : Z.queue, line: [124, 20, 344, 94], hall: [12, 20, 456, 212], plant: [6, 14, 468, 224] }[A.scope];
    if (box) {
      const [x, y, w, h] = box, pad = A.scope === 'cell' ? 6 : 0;
      s += `<g class="m-pilot" data-k="pilot-${A.scope}-${A.wait}"><rect pathLength="1" x="${x - pad}" y="${y - pad}" width="${w + pad * 2}" height="${h + pad * 2}"/><text x="${x - pad + 6}" y="${y - pad - 6}">${A.scope === 'plant' ? 'Plant · start with one line' : 'Pilot area'}</text></g>`;
    }
    // title block, bottom right: who the live view is for, once the last answer is in
    s += `<g class="m-title"><path d="M300 290 H468 M300 290 V320 H468 V290"/><text x="308" y="302">YOUR FLOOR · SKETCH</text>${A.role ? `<text class="m-role" data-k="role-${A.role}" x="308" y="315">${esc(label('role', A.role))}</text>` : ''}</g>`;
    const before = new Set([...map.querySelectorAll('[data-k]')].map((el) => el.dataset.k));
    map.innerHTML = s;
    if (!REDUCED && drawn) map.querySelectorAll('[data-k]').forEach((el) => { if (!before.has(el.dataset.k)) el.classList.add('in'); });
    drawn = true;
    const bits = [];
    if ((A.assets || []).length) bits.push(`${A.assets.length} kind${A.assets.length > 1 ? 's' : ''} of asset`);
    if (A.wait) bits.push(A.wait === 'unknown' ? 'waiting point unknown' : `waits ${label('wait', A.wait).replace(/^(Between|Before|At the|In) /, (m) => m.toLowerCase()).replace('between ', 'between ')}`);
    if (A.link) bits.push(A.link === 'none' ? 'no job link yet' : `job link: ${label('link', A.link).replace(/^A /, 'a ')}`);
    caption.textContent = bits.length ? bits.join(' · ') : 'Answer the questions and your floor builds itself.';
  }

  // ------------------------------------------------------------ profile
  function profile() {
    const titles = { machasm: 'A hidden queue between machining and assembly.', qc: 'Work waiting unseen before inspection.', dock: 'Dock and staging dwell nobody can see.', rework: 'A rework loop without a map.', unknown: 'Work that waits where nobody can see it.' };
    const found = { walk: 'Your floor is found on foot. Every “where is it?” costs a walk, and the answer is out of date by the time it arrives.', call: 'Your floor is found by phone. The answer depends on who picks up and what they last saw.', mes: 'Your systems know the last scan, not the current place. Between scans, work is invisible.', board: 'Your whiteboard is a snapshot that someone has to keep redrawing by hand.', late: 'You hear about it when it is already late.' }[A.found];
    const link = { scan: 'A scan step already links job and carrier. That scan can link the job to its trolley in AmIHub.', paper: 'The job travels on paper, which can’t be queried. A scan or MES link at the start of each job is the missing piece for job-level answers.', mes: 'Your MES already holds the job-to-carrier link. Then AmIHub can take the link from your own system.', none: 'There’s no reliable job link yet. Start honestly with carrier location and dwell, and define the association as part of the pilot.' }[A.link];
    const a = new Set(A.assets || []);
    const lead = a.has('carriers') ? 'WIP carriers' : a.has('tools') ? 'tools and fixtures' : a.has('vehicles') ? 'forklifts and tuggers' : a.has('robots') ? 'AGVs and AMRs' : 'pallets';
    const where = { machasm: 'the assembly queue', qc: 'the inspection queue', dock: 'the dock and staging lanes', rework: 'the rework area', unknown: 'the flow you’d show a visitor first' }[A.wait];
    const assetLine = a.size > 2 ? `You named ${a.size} kinds of asset. Start with ${lead} around ${where}; add the rest on the same anchors once the first flow proves itself.` : `Start with ${lead} around ${where}. It’s a contained first step with a clear owner.`;
    const scope = { cell: 'one cell or bay', line: 'one line', hall: 'one line inside the hall first', plant: 'one line first, then the plant on the same AmIHub' }[A.scope];
    const owner = { plant: 'your production team', prod: 'production control', scm: 'logistics', eng: 'the production team, with OT/IT alongside', other: 'the team that owns the flow' }[A.role];
    const see = [
      `Where each tagged ${lead.replace(/s$/, '')} is, with the time it was observed`,
      `How long work waits in ${where}, counted the way your team agrees`,
      A.link === 'none' ? 'Job-level answers once the carrier-to-job association is defined' : 'Which job each carrier holds, from your existing link',
    ];
    const ask = [
      `When ${A.wait === 'unknown' ? 'work goes missing' : `a job waits in ${where}`}, who notices first, and how?`,
      'What would you do differently if you knew within minutes, not hours?',
      A.role === 'eng' ? 'Which system should own each field, and where should events flow?' : 'Which records does your MES keep for this flow today?',
    ];
    return { title: titles[A.wait], insights: [found, link, assetLine], pilot: `Pilot ${scope}: tag the ${lead}, define the zones around ${where}, agree how a wait is counted, and give ${owner} the live view.`, see, ask };
  }

  function summaryText(p) {
    return [`AmIMotion floor profile — ${p.title}`, '',
      `Looking for: ${(A.assets || []).map((v) => label('assets', v)).join(', ')}`,
      `Found today by: ${label('found', A.found)}`, `Waits longest: ${label('wait', A.wait)}`,
      `Job-to-carrier link: ${label('link', A.link)}`, `Start with: ${label('scope', A.scope)}`, `Role: ${label('role', A.role)}`, '',
      'What it means:', ...p.insights.map((x) => `- ${x}`), '', `A pilot that fits: ${p.pilot}`, '',
      'What you would see first:', ...p.see.map((x) => `- ${x}`), '', 'Questions for a floor walk:', ...p.ask.map((x) => `- ${x}`)].join('\n');
  }

  function renderResult() {
    const p = profile();
    $('[data-diag-count]').textContent = 'Your floor profile';
    paintBar(Q.length, true); emit(true);
    nav.hidden = true;
    root.classList.add('is-result');
    stage.innerHTML = `<div class="diag-result">
      <h3 tabindex="-1">${p.title}</h3>
      <div class="diag-heard">${[...(A.assets || []).map((v) => label('assets', v)), label('found', A.found), label('link', A.link), label('scope', A.scope)].map((t) => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="diag-block"><h4 class="diag-h">What it means</h4><ol>${p.insights.map((x) => `<li>${x}</li>`).join('')}</ol></div>
      <div class="diag-block pilot"><h4 class="diag-h">A pilot that fits</h4><p class="big">${p.pilot}</p>
        <h4 class="diag-h mt-5">What you’d see first</h4><ul>${p.see.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <div class="diag-block"><h4 class="diag-h">On a floor walk, we’d ask</h4><ul class="ask">${p.ask.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <form class="diag-lead" data-lead novalidate>
        <div class="diag-lead-head"><h4>Send me this profile and a pilot outline.</h4><p class="small">The AmIMotion team replies by email. No newsletter.</p></div>
        <div class="field"><label for="d-name">Name</label><input id="d-name" name="name" autocomplete="name" required aria-describedby="d-name-err"><span class="error" id="d-name-err" data-err="name"></span></div>
        <div class="field"><label for="d-email">Work email</label><input id="d-email" name="email" type="email" autocomplete="email" required aria-describedby="d-email-err d-email-hint"><span class="hint" id="d-email-hint" data-domain></span><span class="error" id="d-email-err" data-err="email"></span></div>
        <div class="field"><label for="d-company">Company</label><input id="d-company" name="company" autocomplete="organization"></div>
        <div class="field"><label for="d-phone">Phone or WhatsApp <span class="dim">(optional)</span></label><input id="d-phone" name="phone" type="tel" autocomplete="tel"></div>
        <div class="diag-lead-foot"><button class="btn btn-white" type="submit">Send my floor profile</button><span class="small">Used only to reply about your floor. <a class="link-arrow" href="${(document.documentElement.dataset.root ?? '/') + 'privacy/' + (document.documentElement.dataset.index || '')}">Privacy</a></span></div>
        <p class="diag-done" data-done hidden></p>
      </form>
      <div class="actions mt-6"><button type="button" class="link-arrow" data-print>Print or save as PDF</button><button type="button" class="link-arrow" data-restart>Start over</button></div>
    </div>`;
    if (interacted) stage.querySelector('h3').focus({ preventScroll: true });
    stage.querySelector('[data-restart]').addEventListener('click', () => { Object.keys(A).forEach((k) => delete A[k]); A.assets = []; save(); i = 0; shown = -1; root.classList.remove('is-result'); drawMap(); renderQ(); });
    stage.querySelector('[data-print]').addEventListener('click', () => print());
    wireLead(stage.querySelector('[data-lead]'), p);
    document.dispatchEvent(new CustomEvent('amimotion:diagnostic-complete'));
  }

  // ------------------------------------------------------------ lead capture
  const FREE = /@(gmail|yahoo|hotmail|outlook|live|icloud|aol|proton|protonmail|rediffmail|zoho)\./i;
  function wireLead(form, p) {
    const email = form.elements.email, company = form.elements.company, hint = form.querySelector('[data-domain]');
    email.addEventListener('input', () => {
      const m = email.value.match(/@([a-z0-9-]+)\.[a-z.]+$/i);
      if (!m) { hint.textContent = ''; return; }
      if (FREE.test(email.value)) { hint.textContent = 'A work email helps us prepare for your industry.'; return; }
      const guess = m[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      hint.textContent = `We’ll prepare with ${guess} in mind.`;
      if (!company.dataset.touched) company.value = guess;
    });
    company.addEventListener('input', () => (company.dataset.touched = '1'));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      const err = (n, m) => { form.querySelector(`[data-err="${n}"]`).textContent = m; form.elements[n].setAttribute('aria-invalid', String(!!m)); if (m) ok = false; };
      err('name', form.elements.name.value.trim() ? '' : 'Required.');
      err('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value) ? '' : 'Enter a valid email address.');
      if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
      const lead = { source: 'floor-diagnostic', name: form.elements.name.value.trim(), email: email.value.trim(), company: company.value.trim(), phone: form.elements.phone.value.trim(), role: label('role', A.role), summary: summaryText(p), answers: { ...A }, page: location.href };
      const done = form.querySelector('[data-done]');
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      const result = await sendLead(lead);
      btn.disabled = false;
      done.hidden = false;
      done.textContent = result === 'sent' ? `Thank you, ${lead.name.split(' ')[0]}. Your profile is with the AmIMotion team; an engineer will reply to ${lead.email}.`
        : 'Your email app should open with the profile ready to send. If it doesn’t, copy the profile above and write to ' + CFG.salesEmail + '.';
      form.querySelectorAll('.field, .diag-lead-foot').forEach((el) => (el.hidden = true));
    });
  }
  async function sendLead(lead) {
    if (CFG.leadEndpoint) {
      try {
        const body = CFG.leadFormat === 'json' ? lead : {
          fields: [['email', lead.email], ['firstname', lead.name], ['company', lead.company], ['phone', lead.phone], ['jobtitle', lead.role], ['message', lead.summary]].filter(([, v]) => v).map(([name, value]) => ({ name, value })),
          context: { pageUri: lead.page, pageName: document.title },
        };
        const r = await fetch(CFG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (r.ok) return 'sent';
      } catch (e) { /* fall through to the email draft */ }
    }
    const subject = `Floor profile — ${lead.company || lead.name}`;
    const body = `${lead.summary}\n\nName: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company}\nPhone: ${lead.phone || '-'}\nRole: ${lead.role}\n`;
    location.href = `mailto:${CFG.salesEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return 'draft';
  }

  // resume where the visitor left off in this tab
  const firstOpen = Q.findIndex((q) => (q.multi ? !(A[q.id] || []).length : !A[q.id]));
  i = firstOpen === -1 ? Q.length - 1 : firstOpen;
  drawMap();
  if (firstOpen === -1) renderResult(); else renderQ();
})();
