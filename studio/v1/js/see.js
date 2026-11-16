// The explainer, the section after the hero: the founders' "without / with" picture, told in one plant over four scrolls.
//   1  Without: the plant is dark; four small lights find four problems (a worker looking for a forklift, a forklift idle
//      for hours, a robot heading into a queue, a truck waiting for a pallet nobody can find).
//   2  With: anchors wake and a wall of light crosses the plant; every tagged thing gets its own light.
//   3  The same four moments, answered where they stand.
//   4  The whole plant from above: where everything is, how long it has waited.
// Everyone first gets four still frames of the same scene, crossfaded by the scroll (light on any phone and connection).
// The live three.js plant (see3d.js) replaces them only when the device and the connection can carry it, after the page
// has loaded and the section comes near. Reduced motion keeps the stills. Without script: one still and the words as text.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const Q = new URLSearchParams(location.search);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, e = root) => e.querySelector(s), $$ = (s, e = root) => [...e.querySelectorAll(s)];
  const stage = $('.see-stage'), marksEl = $('.see-marks');
  const words = $$('.see-w'), ticks = $$('.see-ticks i'), stills = $$('.see-stills picture'), snd = $('.see-snd');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const here = (document.currentScript && document.currentScript.src) || 'js/see.js';
  const still = Q.has('still');

  // can this device and this connection carry the live plant? 0 = stay on the stills, 1 = phone or small laptop, 2 = full
  function capable() {
    const force = Q.get('see') === '3d';
    if (Q.get('see') === 'stills' || Q.get('see') === 'poster' || (reduce && !force)) return 0;
    const c = navigator.connection;
    if (!force && c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || ''))) return 0;
    let gl = null; try { gl = document.createElement('canvas').getContext('webgl2'); } catch (e) {}
    if (!gl) return 0;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info'), name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const lose = gl.getExtension('WEBGL_lose_context'); lose && lose.loseContext();
    if (!force && /swiftshader|llvmpipe|softpipe|software|basic render|mali-4|adreno \(tm\) [34]/i.test(name)) return 0;
    const phone = matchMedia('(pointer: coarse)').matches || innerWidth < 700, mem = navigator.deviceMemory;
    if (!force && mem && mem < (phone ? 4 : 2)) return 0;
    if (Q.get('tier')) return +Q.get('tier');
    return phone || (navigator.hardwareConcurrency || 8) <= 4 ? 1 : 2;
  }

  // the clock: scroll position through the pinned section -> scroll 1..4 and time 0..1 inside it
  let W = 0, H = 0, cur = 0, want = 0, raf = 0, shown = 0, near = false, E = null, M = [];
  function progress() { const r = root.getBoundingClientRect(), span = r.height - innerHeight; return span > 0 ? clamp(-r.top / span) : 0; }
  function at(p) { const g = clamp(p, 0, .99999) * 4, s = Math.floor(g) + 1; return [s, clamp((g - (s - 1) - .03) / .94)]; }
  function segment(s) {
    if (s === shown) return; shown = s;
    words.forEach(w => w.classList.toggle('on', +w.dataset.s === s)); ticks.forEach((k, i) => k.classList.toggle('on', i === s - 1));
    stills.forEach(p => p.classList.toggle('on', +p.dataset.s === s)); sound('seg', s);
  }

  // the stills: the section pins at once and the scroll crossfades four frames; nothing else runs
  root.classList.add('live');
  const onScroll = () => { if (E) return; const [s, t] = at(still && window.__seeP != null ? window.__seeP : progress()); segment(s); sound('t', s, t); };
  addEventListener('scroll', onScroll, { passive: true });

  // resolution: start from the tier, step down if frames run long
  const STEPS = [1.75, 1.5, 1.3, 1.1, .9, .75];
  let step = 0, slow = 0, frames = 0, lastT = 0, tier = 2;
  function size() {
    const r = stage.getBoundingClientRect(); W = r.width; H = r.height;
    if (E) E.resize(W, H, Math.min(devicePixelRatio || 1, STEPS[step]));
  }

  // marks: small labels pinned to things in the plant, placed with the live camera
  const mk = (cls, html) => { const d = document.createElement('div'); d.className = 'see-m ' + cls; d.innerHTML = '<i></i>' + (html ? '<span>' + html + '</span>' : ''); marksEl.append(d); return d; };
  function marks() { M = E.marks.map(m => ({ ...m, el: mk(m.cls, m.html) })); }
  function place(s, t) {
    const taken = [];
    for (const o of M) {
      const op = o.op((s - 1) + t), q = op > .01 && E.project(o.p);
      // a label that would sit on one already placed waits its turn
      const clash = q && taken.some(([x, y]) => Math.abs(x - q[0]) < 170 && Math.abs(y - q[1]) < 30);
      const inside = q && !clash && q[0] > 16 && q[0] < W - 16 && q[1] > 104 && q[1] < H - 16;
      if (inside) taken.push(q);
      o.el.style.setProperty('--o', inside ? op.toFixed(3) : 0);
      if (inside) {
        // the label reads to the right of its point, or to the left near the edge, or centred under it when neither fits
        const w = o.w || (o.w = o.el.lastChild.offsetWidth || 180), right = q[0] + 14 + w < W - 8, left = q[0] - 14 - w > 8;
        o.el.classList.toggle('flip', !right && left); o.el.classList.toggle('below', !right && !left);
        o.el.style.setProperty('--x', q[0].toFixed(1) + 'px'); o.el.style.setProperty('--y', q[1].toFixed(1) + 'px');
      }
    }
  }

  const t0 = performance.now();
  function draw(now) {
    raf = 0;
    want = still && window.__seeP != null ? window.__seeP : progress();
    cur += (want - cur) * (reduce || still ? 1 : .12); if (Math.abs(want - cur) < 1e-4) cur = want;
    const [s, t] = at(cur), tm = still ? (window.__seeT ?? 30) : (now - t0) / 1000;
    E.frame(s, t, tm); place(s, t); segment(s); sound('t', s, t);
    // watch the frame time; a device that can't keep up gets fewer pixels
    if (lastT && !still) { const dt = now - lastT; frames++; if (dt > 30) slow++; if (frames >= 45) { if (slow > 18 && step < STEPS.length - 1) { step++; size(); } frames = slow = 0; } }
    lastT = now;
    if (near && !document.hidden && !window.__seeManual) raf = requestAnimationFrame(draw); else lastT = 0;
  }
  const kick = () => { if (!raf && E) raf = requestAnimationFrame(draw); };

  // the live plant: only after the page has loaded, the browser is idle and the section is near
  async function boot() {
    tier = capable(); if (!tier) return;
    step = tier === 2 ? 0 : 2;
    try {
      const m = await import(here.replace(/see\.js(\?.*)?$/, 'see3d.js'));
      E = await m.mount(stage, { tier, phone: tier === 1 });
    } catch (e) { E = null; return; }   // the stills stay
    stage.insertBefore(E.canvas, marksEl);
    E.onPing = (v) => { if (S && pref) S.ping(v); };
    size(); marks(); if (S) S.drive();
    requestAnimationFrame((n) => { draw(n); root.classList.add('ready'); });
    addEventListener('resize', () => { size(); kick(); });
    document.addEventListener('visibilitychange', kick);
    window.__see = { E, at, draw: () => draw(performance.now()) };   // for captures
  }
  const loaded = new Promise(res => document.readyState === 'complete' ? res() : addEventListener('load', res, { once: true }))
    .then(() => new Promise(res => (window.requestIdleCallback || setTimeout)(res, { timeout: 1500 })));
  const io = new IntersectionObserver(es => es.forEach(e => {
    near = e.isIntersecting; if (S) S.room(near);
    if (near && !root.dataset.booted) { root.dataset.booted = 1; loaded.then(boot); }
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
  label(); onScroll();
})();
