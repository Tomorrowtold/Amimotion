// The explainer, the section after the hero: what AmIMotion is, on one floor, in four beats.
//   1  Without: the floor is dark. You see the corner you stand in; the rest is questions.
//   2  The tags: everything that moves lights up, kind by kind, and the anchors on the roof find each one. Then the floor is all there.
//   3  Without | with: a line splits the floor. Five kinds of things to compare (the scroll steps through them, or tap one); drag the line.
//   4  Ask: the view rises to the map, a question is typed, and the floor answers.
// No libraries, no WebGL: the photo, three light layers, a canvas for the rise, and plain HTML marks placed in pixels.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, STILL = /[?&]still\b/.test(location.search);
  const $ = (s, e = root) => e.querySelector(s), $$ = (s, e = root) => [...e.querySelectorAll(s)];
  const stage = $('.see-stage'), box = $('.see-box'), svg = $('.see-ov'), marksEl = $('.see-marks'), cv = $('.see-rise'), ctx = cv.getContext('2d');
  const words = $$('.see-w'), ticks = $$('.see-ticks i'), kinds = $$('.see-kinds span'), cards = $$('.see-c'), tabs = $$('.see-tabs button');
  const grip = $('.see-grip'), w4 = $('.see-w4'), q = $('.see-q'), qText = q.dataset.q, snd = $('.see-snd');
  const base = root.dataset.assets || 'assets/see/';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => clamp((p - a) / (b - a)), ease = t => t * t * (3 - 2 * t);
  const pad = i => String(i).padStart(2, '0');

  // the kinds of things on this floor, and what each tab shows
  const KIND = { Trolley: 'wip', Bins: 'wip', Pallet: 'dock', Forklift: 'fork', Robot: 'robot', Badge: 'people', 'Tool chest': 'tools' };
  const LEGEND = { Trolley: 0, Bins: 1, Pallet: 2, Forklift: 3, Robot: 4, 'Tool chest': 5, Badge: 6 };
  const CATS = ['wip', 'fork', 'robot', 'dock', 'people'];
  const DOCK = new Set(['P-21', 'P-22', 'P-23']);
  // the few words the floor says, per tab (no ids: what it is, and where or how long)
  const SAY = {
    wip: { 'T-14': '42 min', 'B-08': '26 min' },
    fork: { 'FL-1': 'Forklift, moving' },
    robot: { 'AMR-2': 'Robot, on its way' },
    dock: { 'P-23': '12 min at the dock', 'P-21': 'Pallet, arriving' },
    people: { 'Badge-1': 'In the racks', 'Badge-2': 'In the aisle', 'Badge-3': 'At the bench', 'Badge-4': 'By the bins' }
  };
  const TRAILS = { wip: ['T-14', 'T-03', 'T-07', 'B-11'], fork: ['FL-1'], robot: ['AMR-2'], dock: ['P-21'], people: [] };
  const ASK = { 'T-14': '42 min', 'B-08': '26 min', 'P-23': '12 min' };
  const QS = [['FL-1', 'Which forklift is free?', 1], ['P-23', 'Is this load ready?', 0], ['T-14', 'How long has this waited?', 0]];
  const POOLS = ['Badge-3', 'Badge-2', 'Badge-4'];
  // where each beat sits in the scroll (0..1 through the pinned section)
  const T = { lights: [.15, .27], roof: [.17, .27], up: [.255, .315], cmpIn: [.33, .37], cats: [.37, .745], cmpOut: [.75, .775], rise: [.775, .88], type: [.875, .915], told: .925 };
  const SHOW = [[-.01, .125, .15], [.15, .315, .34], [.345, .75, .772], [.772, 2, 3]];

  let V, D, els = null, frames = [], drawn = -1, cur = 0, want = 0, raf = 0, last = 0, near = false, seen = false;
  let bx = { l: 0, t: 0, w: 1, h: 1, sw: 1, sh: 1 }, userG = null, cat = -1, typed = -1, told = false, shownStep = -1;
  const memo = {}; const V$ = (k, v) => { if (memo[k] !== v) { memo[k] = v; root.style.setProperty(k, v); } };
  const O$ = (e, v) => { v = Math.round(v * 100) / 100; if (e._o !== v) { e._o = v; e.style.opacity = v; } };
  const A$ = (e, k, v) => { const c = e._c || (e._c = {}); if (c[k] !== v) { c[k] = v; e.setAttribute(k, v); } };

  // the headline words rise in one by one
  $$('.see-h').forEach(h => {
    let i = 0; const wrap = (from, into) => from.childNodes.forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return into.append(' '); const o = document.createElement('span'), b = document.createElement('b'); o.className = 'wd'; b.style.setProperty('--i', i++); b.textContent = t; o.append(b); into.append(o); });
      else { const c = n.cloneNode(false); into.append(c); wrap(n, c); }
    });
    const f = document.createDocumentFragment(); wrap(h, f); h.setAttribute('aria-label', h.textContent); h.textContent = ''; h.append(f);
    let s = h.nextElementSibling; while (s) { s.style.setProperty('--i', i); s = s.nextElementSibling; }
  });
  $$('.see-ans li').forEach((li, i) => li.style.setProperty('--r', i));

  if (reduce) return;   // still pictures and plain words: the section reads top to bottom without moving
  root.classList.add('live');

  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const image = (src, done) => { const im = new Image(); im.decoding = 'async'; im.src = src; (im.decode ? im.decode() : Promise.reject()).then(done, () => { im.complete ? done() : (im.onload = done); }); return im; };
  const ready = im => im && im.complete && im.naturalWidth;

  async function load() {
    V = matchMedia('(max-aspect-ratio:4/5)').matches ? 'P' : 'L';
    try { D = await (await fetch(`${base}${V}/data.json`)).json(); } catch (e) { return; }
    const W = V === 'P' ? 900 : 1600, H = V === 'P' ? 1600 : 900; svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.textContent = ''; marksEl.textContent = '';
    cv.width = D.frame[0]; cv.height = D.frame[1]; frames = []; drawn = -1; for (const k in memo) delete memo[k];
    const A = D.eye.anchors, tags = D.eye.tags, byId = Object.fromEntries(tags.map((t, i) => [t.id, i]));
    const wave = t => Math.min(...A.map(a => Math.hypot((a[0] - t.xy[0]) * W, (a[1] - t.xy[1]) * H))), dist = tags.map(wave), far = Math.max(...dist);
    const gT = mk('g', {}, svg), gR = mk('g', {}, svg);
    const amr = tags[byId['AMR-2']].xy, nearest = [...A].sort((a, b) => Math.hypot(a[0] - amr[0], a[1] - amr[1]) - Math.hypot(b[0] - amr[0], b[1] - amr[1])).slice(0, 3);
    els = {
      W, H, byId,
      roof: nearest.map(a => mk('line', { class: 'rf', x1: a[0] * W, y1: a[1] * H, x2: amr[0] * W, y2: amr[1] * H }, gR)),
      anchors: A.map(a => mk('circle', { class: 'an', cx: a[0] * W, cy: a[1] * H, r: 4, opacity: 0 }, gR)),
      trails: Object.fromEntries(Object.entries(D.eye.paths).map(([k, pts]) => {
        const s = pts.map(p => `${(p[0] * W).toFixed(1)},${(p[1] * H).toFixed(1)}`).join(' ');
        return [k, { g: mk('polyline', { class: 'trg', points: s, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, gT), l: mk('polyline', { class: 'tr', points: s, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, gT) }];
      })),
      tags: tags.map((t, i) => {
        const e = document.createElement('div'); e.className = 'see-m'; const dot = document.createElement('i'), lab = document.createElement('b'); e.append(dot, lab); marksEl.append(e);
        const k = t.kind === 'Pallet' && !DOCK.has(t.id) ? 'wip' : KIND[t.kind];
        return { t, i, e, lab, k, at: dist[i] / far, wait: t.state === 'wait', say: '' };
      }),
      qs: QS.map(([id, text, left]) => { const e = document.createElement('div'); e.className = 'see-qm'; e.innerHTML = '<i>?</i><b></b>'; e.lastChild.textContent = text; marksEl.append(e); return { i: byId[id], e, left, skipP: id === 'P-23' }; })
    };
    measure(); preload(); paint(true);
  }
  function preload() { if (frames.length || !D || !near) return; for (let i = 0; i < D.rise.length; i++) frames.push(image(`${base}${V}/rise/${pad(i)}.webp`, () => { if (i === drawn) { drawn = -1; paint(true); } })); }

  // the box is the picture's real place on screen: marks are put there in pixels
  function measure() {
    const b = box.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const wr = $('.see-ans').getBoundingClientRect(), qr = q.getBoundingClientRect(); bx = { l: b.left - s.left, t: b.top - s.top, w: b.width, h: b.height, sw: s.width, sh: s.height, wt: Math.min(wr.top, qr.top) - s.top, ct: $('.see-cmp').getBoundingClientRect().top - s.top - ($('.see-c.on .see-a') ? 0 : 0) - (V === 'P' ? 40 : 0) };
    const top = root.getBoundingClientRect().top + scrollY; root._top = top; root._len = root.offsetHeight - innerHeight;
    if (els) { const pools = POOLS.map(id => { const xy = D.eye.tags[els.byId[id]].xy, k = .62 + .76 * xy[1], r = (V === 'P' ? 16 : 7.5) * k; return `radial-gradient(circle at ${(xy[0] * 100).toFixed(2)}% ${(xy[1] * 100 + 1).toFixed(2)}%,#000 ${(r * .35).toFixed(1)}%,transparent ${r.toFixed(1)}%)`; }); V$('--pools', pools.join(',')); }
  }
  const px = xy => [bx.l + xy[0] * bx.w, bx.t + xy[1] * bx.h];
  const onScreen = (x, y) => x > 16 && x < bx.sw - 16 && y > 70 && y < bx.sh * .62;

  function progress() { const len = root._len || 1; return clamp((scrollY - (root._top || 0)) / len); }

  function paint(force) {
    if (!els) return; const p = cur;
    // beat 1 and 2: the dark floor, the lights, the roof
    const lights = seg(p, ...T.lights), up = ease(seg(p, ...T.up)), cmpIn = ease(seg(p, ...T.cmpIn)), cmpOut = ease(seg(p, ...T.cmpOut)), rise = ease(seg(p, ...T.rise));
    const cmp = cmpIn * (1 - cmpOut), inCmp = cmp > .5;
    const ci = clamp(Math.floor((p - T.cats[0]) / ((T.cats[1] - T.cats[0]) / 5)), 0, 4);
    if (ci !== cat || force) setCat(ci, false);
    const g0 = userG != null ? userG : (V === 'P' ? .34 : .5), g = g0;
    // the dark: all of it in beat 1; it lifts in beat 2; in beat 3 it sweeps back in from the left to the line
    const night = p < T.cmpIn[0] ? 1 - up : 1 - cmpOut;
    const gx = bx.sw * g, sxBox = clamp((gx - bx.l) / bx.w * 100, 0, 100);
    const sx = p < T.cmpIn[0] ? 100 : sxBox * cmpIn * (1 - cmpOut);            // right edge of the dark, share of the box
    const wx = p < T.lights[0] ? 100 : p < T.cmpIn[0] ? 0 : sx;                 // left edge of the lit marks and glows
    V$('--night', night.toFixed(3)); V$('--sx', sx.toFixed(2) + '%'); V$('--wx', wx.toFixed(2) + '%'); V$('--gx', (g * 100).toFixed(2) + '%'); V$('--cmp', cmp.toFixed(3));
    root.classList.toggle('cmp', inCmp); grip.tabIndex = inCmp ? 0 : -1; A$(grip, 'aria-valuenow', Math.round(g * 100));
    // glows: blue while the tags light in the dark, settling once the floor is lit; amber for what waits, on the work and dock tabs
    const blue = p < T.cmpIn[0] ? lights * (.9 - .5 * up) : (1 - cmpOut) * .45 * cmpIn;
    const amb = (cat === 0 || cat === 3) ? cmp * .9 : 0;
    V$('--blue', blue.toFixed(3)); V$('--amb', amb.toFixed(3)); V$('--rise', seg(rise, 0, .22).toFixed(3)); V$('--ask', seg(p, T.type[0], T.told).toFixed(3));
    $('.see-ov').style.clipPath = `inset(0 0 0 ${wx.toFixed(2)}%)`;
    // the roof finds a tag: three dashed lines from the nearest anchors to the robot, while the tags light
    const roof = seg(p, ...T.roof), rf = Math.sin(Math.PI * roof) * (1 - up);
    els.roof.forEach(l => O$(l, rf * .9)); els.anchors.forEach(a => O$(a, Math.max(rf, (1 - rise) * lights * .6 * (1 - cmp))));
    // the rise: frames on a canvas, marks follow the frame's own points
    const f = Math.round(rise * (D.rise.length - 1));
    if (rise > 0 && f !== drawn && ready(frames[f])) { ctx.drawImage(frames[f], 0, 0, cv.width, cv.height); drawn = f; }
    const F = rise > 0 ? D.rise[f] : null;
    // the typed question and its answer
    const n = Math.round(seg(p, ...T.type) * qText.length); if (n !== typed) { typed = n; q.textContent = qText.slice(0, n); }
    const t2 = p >= T.told; if (t2 !== told) { told = t2; w4.classList.toggle('told', t2); if (t2) sound('told'); }
    // trails of the focused kind
    const focus = CATS[cat];
    for (const k in els.trails) { const on = inCmp && TRAILS[focus].includes(k) ? 1 : 0, tr = els.trails[k]; const off = tr._off == null ? 1 : tr._off; tr._want = on; }
    // marks
    const lab = rise > .9 ? (told ? 1 : 0) : inCmp ? 1 : 0;
    els.tags.forEach(o => {
      const xy = F ? F.tags[o.i] : o.t.xy, [x, y] = px(xy);
      let a = 0, foc = false, say = '';
      if (rise > .02) { const behind = y > bx.wt - 14 && Math.abs(x - bx.sw / 2) < Math.min(bx.sw * .5, 520); a = seg(rise, 0, .22) * (ASK[o.t.id] ? 1 : .55) * (behind && !ASK[o.t.id] ? 1 - seg(p, T.type[0], T.told) : 1); if (ASK[o.t.id]) { foc = told && !behind; say = told && !behind ? ASK[o.t.id] : ''; } }
      else if (p < T.cmpIn[0]) a = ease(seg(lights, o.at * .72, o.at * .72 + .28));
      else { const right = x > gx + 6, under = y > bx.ct - 12; foc = o.k === focus && !under; a = right ? (cmp > .02 ? (foc ? 1 : under ? 0 : .32) : 1) : (cmp < .5 ? 1 - cmpIn : 0); say = foc ? (SAY[focus][o.t.id] || '') : ''; }
      const w = o.wait && (rise > .02 ? true : p >= T.cmpIn[0] && (focus === 'wip' || focus === 'dock') && SAY[focus][o.t.id]);
      if (o.say !== say) { o.say = say; o.lab.textContent = say; }
      const flip = xy[0] > (V === 'P' ? .55 : .74);
      const cls = 'see-m' + (w ? ' w' : '') + (foc ? ' f' : '') + (flip ? ' l' : ''); if (o.e.className !== cls) o.e.className = cls;
      const tf = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; if (o._tf !== tf) { o._tf = tf; o.e.style.transform = tf; }
      O$(o.e, a); o.e.style.setProperty('--lab', say ? lab : 0); o.e.style.setProperty('--ring', foc ? 1 : 0);
      // a kind's name lights in the list as its first tag lights
      if (p < T.cmpIn[0] && o.t.kind in LEGEND && a > .6) kinds[LEGEND[o.t.kind]]._on = true;
    });
    if (p < T.cmpIn[0]) { kinds.forEach((k, i) => { const on = !!k._on || (i === 5 && lights > .92); k.classList.toggle('on', on); k._on = false; }); }
    // beat 1's questions, in the dark where nobody can see
    const qa = (1 - seg(p, .1, .155)) * (seen ? 1 : 0);
    els.qs.forEach((o, j) => { if (V === 'P' && o.skipP) return O$(o.e, 0); const xy = D.eye.tags[o.i].xy, [x, y] = px(xy), vis = onScreen(x, y) || y < bx.sh * .7; o.e.className = 'see-qm' + (o.left || xy[0] > (V === 'P' ? .55 : .8) ? ' l' : ''); const tf = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; if (o._tf !== tf) { o._tf = tf; o.e.style.transform = tf; } O$(o.e, vis ? qa * ease(seg(p, -.02 + j * .015, .02 + j * .015)) : 0); });
    // words and ticks
    const step = SHOW.findIndex(r => p >= r[0] && p < r[2]);
    words.forEach((el, i) => { const r = SHOW[i], out = seg(p, r[1], r[2]); el.classList.toggle('on', i === step && (i > 0 || seen)); el.style.opacity = out > 0 ? (1 - out).toFixed(3) : ''; el.style.setProperty('--out', out.toFixed(3)); });
    if (step !== shownStep) { shownStep = step; ticks.forEach((t, i) => t.classList.toggle('on', i === Math.max(0, step))); if (step >= 0) sound('beat', step); }
    trailsTick();
  }
  // trails draw in and out with a little time of their own, so a tab change reads as motion, not a cut
  function trailsTick() {
    let busy = false;
    for (const k in els.trails) { const tr = els.trails[k], to = tr._want ? 0 : 1, now = tr._off == null ? 1 : tr._off; if (Math.abs(to - now) < .002) { tr._off = to; continue; } const nx = now + (to - now) * .12; tr._off = nx; busy = true; A$(tr.l, 'stroke-dashoffset', nx.toFixed(3)); A$(tr.g, 'stroke-dashoffset', nx.toFixed(3)); }
    if (busy) kick();
  }
  function setCat(i, user) {
    if (i === cat && !user) return; const was = cat; cat = i;
    cards.forEach((c, j) => c.classList.toggle('on', j === i)); tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    if (was >= 0 && was !== i && cur > T.cmpIn[0] && cur < T.cmpOut[0]) sound('cat', i);
  }

  // the scroll moves the story with a little weight; time-based, so it feels the same at any frame rate
  function tick(now) {
    raf = 0; const dt = last ? Math.min(64, now - last) : 16; last = now;
    want = progress(); const k = STILL ? 1 : 1 - Math.exp(-dt / 85); cur += (want - cur) * k; if (Math.abs(want - cur) < .0004) cur = want;
    paint(); if (cur !== want) kick(); else last = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }

  // tabs: each one is a place in the scroll, so the tab and the scroll never disagree
  const catAt = i => (root._top || 0) + (root._len || 0) * (T.cats[0] + (T.cats[1] - T.cats[0]) / 5 * (i + .45));
  tabs.forEach((t, i) => t.addEventListener('click', () => { measure(); scrollTo({ top: catAt(i), behavior: 'smooth' }); }));
  $('.see-tabs').addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); const i = clamp(cat + d, 0, 4); tabs[i].focus(); tabs[i].click(); });

  // the line: drag it anywhere on the floor while comparing, or use the arrow keys on its grip
  let dragging = false;
  const setG = cx => { const s = stage.getBoundingClientRect(); userG = clamp((cx - s.left) / s.width, .08, .92); paint(true); };
  grip.addEventListener('pointerdown', e => { dragging = true; grip.classList.add('drag'); grip.setPointerCapture(e.pointerId); e.preventDefault(); });
  grip.addEventListener('pointermove', e => { if (dragging) setG(e.clientX); });
  const stop = () => { dragging = false; grip.classList.remove('drag'); }; grip.addEventListener('pointerup', stop); grip.addEventListener('pointercancel', stop);
  stage.addEventListener('pointerdown', e => { if (!root.classList.contains('cmp') || e.target.closest('button,.see-grip,a') || e.pointerType === 'touch') return; setG(e.clientX); });
  grip.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? .04 : e.key === 'ArrowLeft' ? -.04 : 0; if (!d) return; e.preventDefault(); userG = clamp((userG != null ? userG : .5) + d, .08, .92); paint(true); });

  // sound: on by default. Browsers let it start only after a tap, click or key, so it starts on the first one, anywhere on the page
  let AC = null, S = null, score = null, pref = true, started = false;
  try { pref = localStorage.getItem('see-sound') !== 'off'; } catch (e) {}
  const here = (document.currentScript && document.currentScript.src) || '';
  const label = () => { snd.setAttribute('aria-pressed', pref && started); snd.lastChild.textContent = !pref ? 'Sound off' : started ? 'Sound on' : 'Tap for sound'; };
  const fetchScore = () => score || (score = new Promise(res => { const sc = document.createElement('script'); sc.src = here.replace(/see\.js(\?.*)?$/, 'see-sound.js'); sc.onload = sc.onerror = res; document.head.append(sc); }));
  function startSound() {
    if (started || !pref) return; started = true;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume(); } catch (e) { started = false; return; }
    fetchScore().then(() => { try { S = window.SeeSound(AC); S.set(true); S.room(near); } catch (e) { S = null; } label(); });
    label();
  }
  function sound(what, arg) { if (S && pref && near) S.play(what, arg); }
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, e => { if (!e.target.closest || !e.target.closest('.see-snd')) startSound(); }, { capture: true, passive: true }));
  snd.addEventListener('click', () => {
    if (!started && pref) { startSound(); return; }
    pref = !pref; try { localStorage.setItem('see-sound', pref ? 'on' : 'off'); } catch (e) {}
    if (pref && !started) startSound(); else if (S) S.set(pref); label();
  });
  label();

  // only while the section is on screen does any of this run
  new IntersectionObserver(es => es.forEach(e => {
    near = e.isIntersecting; if (S) S.room(near);
    if (near) { if (!D) load(); else preload(); if (!seen) { seen = true; } measure(); kick(); }
  }), { rootMargin: '25% 0px' }).observe(root);
  addEventListener('scroll', () => { if (near) kick(); }, { passive: true });
  let rz = 0; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { const v = matchMedia('(max-aspect-ratio:4/5)').matches ? 'P' : 'L'; if (v !== V && D) { D = null; els = null; load(); } else { measure(); paint(true); } }, 120); });
  addEventListener('load', () => { measure(); if (near) paint(true); });
  // the floor's numbers are tiny; fetch them once the page is idle, so the first scroll never waits
  const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 3000 }) : f => setTimeout(f, 1500); addEventListener("load", () => idle(() => { if (!D) load(); }));
})();
