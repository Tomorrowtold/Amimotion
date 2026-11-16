// The explainer, the section after the hero: one vast plant, live in three.js (see3d.js), one continuous camera in four scrolls.
//   1  Sodium: one yellow light, every colour lost. Somewhere a trolley has waited 42 minutes.
//   2  The lamps die; one tag's pulse reaches three anchors on the columns; when they agree, the trolley turns amber.
//   3  Daylight pours in from the roof slot; every tag lights in a wave; what waits stays amber.
//   4  The roof parts, the camera rises: one live map. A question, three answers.
// The scroll is the clock for camera and light; the plant keeps moving in real time while the section is on screen.
// No WebGL2, a software GPU or reduced motion: the poster (a still of the same scene) and the four lines as text.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const Q = new URLSearchParams(location.search);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, e = root) => e.querySelector(s), $$ = (s, e = root) => [...e.querySelectorAll(s)];
  const stage = $('.see-stage'), marksEl = $('.see-marks');
  const words = $$('.see-w'), ticks = $$('.see-ticks i'), ans = $$('.see-ans li'), snd = $('.see-snd');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), R = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
  const here = (document.currentScript && document.currentScript.src) || 'js/see.js';
  const still = Q.has('still');

  // can this device run the plant well? Software renderers and tiny devices get the poster.
  function capable() {
    const force = Q.get('see') === '3d';
    if (Q.get('see') === 'poster' || (reduce && !force)) return 0;
    let gl = null; try { gl = document.createElement('canvas').getContext('webgl2'); } catch (e) {}
    if (!gl) return 0;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info'), name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const lose = gl.getExtension('WEBGL_lose_context'); lose && lose.loseContext();
    if (!force && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)) return 0;
    if (!force && navigator.deviceMemory && navigator.deviceMemory < 2) return 0;
    const phone = matchMedia('(pointer: coarse)').matches || innerWidth < 700;
    return phone || (navigator.hardwareConcurrency || 8) <= 4 ? 1 : 2;
  }

  // the clock: scroll position through the pinned section -> scroll 1..4 and time 0..1 inside it
  let W = 0, H = 0, cur = 0, want = 0, raf = 0, shown = 0, near = false, E = null, M = [];
  function progress() { const r = root.getBoundingClientRect(), span = r.height - H; return span > 0 ? clamp(-r.top / span) : 0; }
  function at(p) { const g = clamp(p, 0, .99999) * 4, s = Math.floor(g) + 1; return [s, clamp((g - (s - 1) - .03) / .94)]; }

  // resolution: start from the tier, step down if frames run long
  const STEPS = [1.75, 1.5, 1.3, 1.1, .9, .75];
  let step = 0, slow = 0, frames = 0, lastT = 0, tier = 2;
  function size() {
    const r = stage.getBoundingClientRect(); W = r.width; H = r.height;
    if (E) E.resize(W, H, Math.min(devicePixelRatio || 1, STEPS[step]));
  }

  // marks: small labels pinned to things in the plant, placed with the live camera
  const mk = (cls, html) => { const d = document.createElement('div'); d.className = 'see-m ' + cls; d.innerHTML = `<i></i>${html ? `<span>${html}</span>` : ''}`; marksEl.append(d); return d; };
  function marks() {
    M = [];
    E.anchors3.forEach((p, i) => M.push({ p, el: mk('anc', ''), op: (s, t) => s === 2 ? R(t, .3 + i * .15, .42 + i * .15) : s === 3 ? 1 - R(t, 0, .2) : 0 }));
    M.push({ p: E.target.p, el: mk('amb', 'Trolley <em>· waited 42 min</em>'), op: (s, t) => s === 2 ? R(t, .86, .97) : s === 3 ? 1 - R(t, .2, .4) : 0 });
    E.pickLabels().forEach(({ t: tg, name }, i) => M.push({ p: tg.p, el: mk('tag', name), op: (s, t) => s === 3 ? R(t, .6 + i * .05, .72 + i * .05) * (1 - R(t, .94, 1)) : 0 }));
    E.answers.forEach((tg, i) => M.push({ p: tg.p, el: mk('amb ans', `${tg.answer} <em>· ${tg.wait} min</em>`), op: (s, t) => s === 4 ? R(t, .3 + i * .16, .42 + i * .16) : 0 }));
  }
  function place(s, t) {
    for (const o of M) {
      const op = o.op(s, t), q = op > .01 && E.project(o.p);
      const inside = q && q[0] > 16 && q[0] < W - 16 && q[1] > 70 && q[1] < H - 16;
      o.el.style.setProperty('--o', inside ? op.toFixed(3) : 0);
      if (inside) { o.el.classList.toggle('flip', q[0] > W - 190); o.el.style.setProperty('--x', q[0].toFixed(1) + 'px'); o.el.style.setProperty('--y', q[1].toFixed(1) + 'px'); }
    }
  }

  const t0 = performance.now();
  function draw(now) {
    raf = 0;
    want = still && window.__seeP != null ? window.__seeP : progress();
    cur += (want - cur) * (reduce || still ? 1 : .12); if (Math.abs(want - cur) < 1e-4) cur = want;
    const [s, t] = at(cur), tm = still ? (window.__seeT ?? 30) : (now - t0) / 1000;
    E.frame(s, t, tm); place(s, t);
    if (s !== shown) { shown = s; words.forEach(w => w.classList.toggle('on', +w.dataset.s === s)); ticks.forEach((k, i) => k.classList.toggle('on', i === s - 1)); sound('seg', s); }
    ans.forEach((li, i) => li.style.setProperty('--a', s === 4 ? R(t, .3 + i * .16, .42 + i * .16).toFixed(3) : 0));
    sound('t', s, t);
    // watch the frame time; a device that can't keep up gets fewer pixels
    if (lastT && !still) { const dt = now - lastT; frames++; if (dt > 30) slow++; if (frames >= 45) { if (slow > 18 && step < STEPS.length - 1) { step++; size(); } frames = slow = 0; } }
    lastT = now;
    if (near && !document.hidden && !window.__seeManual) raf = requestAnimationFrame(draw); else lastT = 0;
  }
  const kick = () => { if (!raf && E) raf = requestAnimationFrame(draw); };

  // start only when the section is near, so the page above never pays for it
  async function boot() {
    tier = capable(); if (!tier) return;
    step = tier === 2 ? 0 : 2;
    try {
      const m = await import(here.replace(/see\.js(\?.*)?$/, 'see3d.js'));
      E = await m.mount(stage, { tier, phone: tier === 1 });
    } catch (e) { E = null; return; }   // the poster and the words stay as they are
    stage.insertBefore(E.canvas, marksEl);
    E.onPing = (v) => { if (S && pref) S.ping(v); };
    root.classList.add('live'); size(); marks();
    requestAnimationFrame((n) => { draw(n); root.classList.add('ready'); });
    addEventListener('resize', () => { size(); kick(); });
    document.addEventListener('visibilitychange', kick);
    window.__see = { E, at, draw: () => draw(performance.now()) };   // for captures
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    near = e.isIntersecting; if (S) S.room(near);
    if (near && !root.dataset.booted) { root.dataset.booted = 1; boot(); }
    kick();
  }), { rootMargin: '100% 0px' });
  io.observe(root);

  // sound: on by default. Browsers only allow it after a tap, click or key, so it starts on the first one, anywhere on the page
  let pref = true, started = false, AC = null, S = null, score = null;
  try { pref = localStorage.getItem('see-sound') !== 'off'; } catch (e) {}
  const label = () => { snd.setAttribute('aria-pressed', String(pref && started)); snd.lastChild.textContent = !pref ? 'Sound off' : started ? 'Sound on' : 'Tap for sound'; };
  const fetchScore = () => score || (score = new Promise(res => { const sc = document.createElement('script'); sc.src = here.replace(/see\.js(\?.*)?$/, 'see-sound.js'); sc.onload = sc.onerror = res; document.head.append(sc); }));
  function startSound() {
    if (started || !pref) return; started = true;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume(); } catch (e) { started = false; return; }
    fetchScore().then(() => { try { S = window.SeeSound(AC); if (E) S.drive(); S.set(true); S.room(near); const [s, t] = at(cur); S.seg(s); S.time(s, t); } catch (e) { S = null; } label(); });
  }
  function sound(what, s, t) { if (!S || !pref) return; if (what === 'seg') S.seg(s); else S.time(s, t); }
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, e => { if (!e.target.closest || !e.target.closest('.see-snd')) startSound(); }, { capture: true, passive: true }));
  snd.addEventListener('click', () => {
    if (!started && pref) { startSound(); return; }
    pref = !pref; try { localStorage.setItem('see-sound', pref ? 'on' : 'off'); } catch (e) {}
    if (pref && !started) startSound(); else if (S) S.set(pref);
    label();
  });
  label();
})();
