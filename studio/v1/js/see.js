// The explainer, the section after the hero: one vast plant rendered in Blender, one continuous camera move in four scrolls.
//   1  Sodium: one yellow light, every colour lost. Somewhere a trolley has waited 42 minutes.
//   2  The pulse: the plant goes dark; three roof anchors' red, green and blue meet on one trolley, which turns amber.
//   3  Full light pours in from the roof slot; every tag lights; the waiting one stays amber.
//   4  The mirrored roof: the plant appears above itself, one live map. A question, three answers.
// The scroll is the film's clock. Frames (s{seg}_{fff}.webp) are drawn to a canvas, two at a time, crossfaded.
// Marks are placed with the same camera the film was rendered with (hall.py FILM), so they stay on the things they name.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, e = root) => e.querySelector(s), $$ = (s, e = root) => [...e.querySelectorAll(s)];
  const stage = $('.see-stage'), cv = $('.see-film'), ctx = cv.getContext('2d'), marksEl = $('.see-marks');
  const words = $$('.see-w'), ticks = $$('.see-ticks i'), ans = $$('.see-ans li'), snd = $('.see-snd');
  const base = (root.dataset.film || 'assets/hall/').replace(/\/?$/, '/');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), R = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
  const here = (document.currentScript && document.currentScript.src) || 'js/see.js';

  // the film camera, exactly as hall.py moves it: [location, look-at, lens mm] at the start and end of each scroll
  let FILM = {
    1: [[[234, 16, 9], [80, 58, 1], 22], [[206, 22, 7.5], [110, 50, 1.5], 24]],
    2: [[[206, 22, 7.5], [110, 50, 1.5], 24], [[146, 9, 6], [131.5, 25.7, 1.4], 32]],
    3: [[[146, 9, 6], [131.5, 25.7, 1.4], 32], [[172, 30, 11], [90, 52, 2], 20]],
    4: [[[172, 30, 11], [90, 52, 2], 20], [[176, 48, 3], [110, 48, 14], 16]]
  };
  let FW = 1920, FH = 1080, SENSOR = 36, TARGET = [131.5, 25.7, 1.2], TAGS = [];
  const ANCH = [[120, 24, 6.2, 'r'], [144, 24, 6.2, 'g'], [144, 72, 6.2, 'b']];

  // frames: which exist for each scroll (the manifest lists them; a preview render may have every 4th)
  let have = { 1: [], 2: [], 3: [], 4: [] };
  const imgs = new Map();
  const key = (s, f) => `s${s}_${String(f).padStart(3, '0')}`;
  function img(s, f) {
    const k = key(s, f); let im = imgs.get(k);
    if (!im) { im = new Image(); im.decoding = 'async'; im.src = `${base}frames/${k}.webp`; im.onload = () => { im.ok = true; dirty = true; }; imgs.set(k, im); }
    return im;
  }
  // the two available frames around time t in scroll s, and the mix between them
  function pair(s, t) {
    const L = have[s]; if (!L.length) return null;
    const f = t * 59; let i = 0; while (i < L.length - 1 && L[i + 1] <= f) i++;
    const a = L[i], b = L[Math.min(i + 1, L.length - 1)];
    return [a, b, b > a ? clamp((f - a) / (b - a)) : 0];
  }
  // load in the order the visitor will need them: the first scroll first, then spread out, then the gaps
  function preload() {
    const order = [];
    for (let s = 1; s <= 4; s++) have[s].forEach((f, i) => order.push([s, f, (s - 1) * 4 + (i % 4 ? 2 + (i % 2) : 0) + (s === 1 ? -4 : 0)]));
    order.sort((x, y) => x[2] - y[2]);
    let n = 0; const next = () => { if (n >= order.length) return; const [s, f] = order[n++]; const im = img(s, f); if (im.complete) next(); else { im.addEventListener('load', next, { once: true }); im.addEventListener('error', next, { once: true }); } };
    for (let k = 0; k < 4; k++) next();
  }

  // camera math: world point -> pixel in the rendered frame (Blender's perspective camera, horizontal sensor fit)
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }, lerp = (a, b, e) => a.map((v, i) => v + (b[i] - v) * e);
  function cam(s, t) {
    const [[l0, a0, f0], [l1, a1, f1]] = FILM[s], e = t * t * (3 - 2 * t);
    const loc = lerp(l0, l1, e), at = lerp(a0, a1, e), lens = f0 + (f1 - f0) * e;
    const fw = norm(sub(at, loc)), rt = norm(cross(fw, [0, 0, 1])), up = cross(rt, fw);
    return { loc, fw, rt, up, k: lens / SENSOR * FW };
  }
  function proj(c, p) {
    const d = sub(p, c.loc), z = dot(d, c.fw); if (z < .5) return null;
    return [FW / 2 + dot(d, c.rt) / z * c.k, FH / 2 - dot(d, c.up) / z * c.k, z];
  }

  // the canvas covers the stage like object-fit: cover, with the focus a little right of centre on wide screens
  let W = 0, H = 0, dpr = 1, fit = { s: 1, x: 0, y: 0 };
  function size() {
    const r = stage.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const s = Math.max(W / FW, H / FH), fx = W < 700 ? .6 : .55;
    // keep the focus point (fx across the frame) at the middle of the stage, never showing an edge
    fit = { s, x: clamp(W / 2 - FW * s * fx, W - FW * s, 0), y: (H - FH * s) / 2 };
    dirty = true;
  }

  // marks: built once, placed every frame
  const mk = (cls, html) => { const d = document.createElement('div'); d.className = 'see-m ' + cls; d.innerHTML = `<i></i>${html ? `<span>${html}</span>` : ''}`; marksEl.append(d); return d; };
  let M = null;
  function marks() {
    M = {
      anch: ANCH.map(([x, y, z, c]) => ({ p: [x, y, z], el: mk(c, '') })),
      tgt: { p: TARGET, el: mk('amb', 'Trolley <em>· waited 42 min</em>') },
      tags: TAGS.slice(0, 5).map(m => ({ p: [m[1], m[2], 1.6], el: mk('tag', m[0]) }))
    };
  }
  const put = (o, c, op) => {
    const q = op > .01 && proj(c, o.p);
    if (!q) { o.el.style.setProperty('--o', 0); return; }
    const x = fit.x + q[0] * fit.s, y = fit.y + q[1] * fit.s, inside = x > 16 && x < W - 16 && y > 60 && y < H - 16;
    o.el.style.setProperty('--x', x.toFixed(1) + 'px'); o.el.style.setProperty('--y', y.toFixed(1) + 'px');
    o.el.style.setProperty('--o', inside ? op.toFixed(3) : 0);
  };

  // the clock: scroll position through the pinned section -> scroll 1..4 and time 0..1 inside it
  let cur = 0, want = 0, raf = 0, dirty = true, shown = 0, near = false, ready = false;
  function progress() {
    const r = root.getBoundingClientRect(), span = r.height - H;
    return span > 0 ? clamp(-r.top / span) : 0;
  }
  function at(p) { const g = clamp(p, 0, .99999) * 4, s = Math.floor(g) + 1; return [s, clamp((g - (s - 1) - .03) / .94)]; }

  function draw() {
    raf = 0;
    want = progress();
    cur += (want - cur) * (reduce ? 1 : .14); if (Math.abs(want - cur) < 1e-4) cur = want;
    const [s, t] = at(cur), pr = pair(s, t);
    if (pr) {
      const A = img(s, pr[0]), B = img(s, pr[1]);
      if (A.ok) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1;
        ctx.drawImage(A, fit.x, fit.y, FW * fit.s, FH * fit.s);
        if (B !== A && B.ok && pr[2] > .01) { ctx.globalAlpha = pr[2]; ctx.drawImage(B, fit.x, fit.y, FW * fit.s, FH * fit.s); ctx.globalAlpha = 1; }
        // the roof turns to a mirror between scrolls 3 and 4: dissolve from the last clear frame instead of cutting
        if (s === 4 && t < .14) { const L3 = have[3], C = L3.length && img(3, L3[L3.length - 1]), k = 1 - R(t, 0, .14); if (C && C.ok && k > .01) { ctx.globalAlpha = k; ctx.drawImage(C, fit.x, fit.y, FW * fit.s, FH * fit.s); ctx.globalAlpha = 1; } }
        if (!ready) { ready = true; root.classList.add('ready'); }
      }
    }
    // words and ticks
    if (s !== shown) {
      shown = s; words.forEach(w => w.classList.toggle('on', +w.dataset.s === s)); ticks.forEach((k, i) => k.classList.toggle('on', i === s - 1));
      sound('seg', s);
    }
    // marks, timed to compose.py's light: anchors as their colours arrive, the trolley as it turns amber, tags as the light pours in
    if (M) {
      const c = cam(s, t);
      M.anch.forEach((o, i) => put(o, c, s === 2 ? R(t, .35 + i * .15, .5 + i * .15) : s === 3 ? 1 - R(t, 0, .25) : 0));
      put(M.tgt, c, s === 2 ? R(t, .84, .96) : s === 3 ? 1 - R(t, .5, .7) : 0);
      M.tags.forEach((o, i) => put(o, c, s === 3 ? R(t, .45 + i * .06, .6 + i * .06) * (1 - R(t, .92, 1)) : 0));
    }
    // the answers type in one by one
    ans.forEach((li, i) => li.style.setProperty('--a', s === 4 ? R(t, .3 + i * .16, .42 + i * .16).toFixed(3) : 0));
    sound('t', s, t);
    if (cur !== want) raf = requestAnimationFrame(draw);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

  // start: only when the section is near, so the page above never pays for the film
  async function boot() {
    try {
      const m = await (await fetch(base + 'film.json')).json();
      if (m.film) FILM = m.film; if (m.w) { FW = m.w; FH = m.h; } if (m.sensor) SENSOR = m.sensor; if (m.target) TARGET = m.target;
      if (m.tags) TAGS = m.tags;
      have = m.frames;
    } catch (e) { return; }   // no film: the poster and the words stay as they are
    root.classList.add('live'); size(); marks(); preload(); kick();
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', () => { size(); kick(); });
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    near = e.isIntersecting; if (S) S.room(near);
    if (near && !root.dataset.booted) { root.dataset.booted = 1; boot(); }
  }), { rootMargin: '120% 0px' });
  io.observe(root);

  // sound: on by default. Browsers only allow it after a tap, click or key, so it starts on the first one, anywhere on the page
  let pref = true, started = false, AC = null, S = null, score = null;
  try { pref = localStorage.getItem('see-sound') !== 'off'; } catch (e) {}
  const label = () => { snd.setAttribute('aria-pressed', String(pref && started)); snd.lastChild.textContent = !pref ? 'Sound off' : started ? 'Sound on' : 'Tap for sound'; };
  const fetchScore = () => score || (score = new Promise(res => { const sc = document.createElement('script'); sc.src = here.replace(/see\.js(\?.*)?$/, 'see-sound.js'); sc.onload = sc.onerror = res; document.head.append(sc); }));
  function startSound() {
    if (started || !pref) return; started = true;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume(); } catch (e) { started = false; return; }
    fetchScore().then(() => { try { S = window.SeeSound(AC); S.set(true); S.room(near); const [s, t] = at(cur); S.seg(s); S.time(s, t); } catch (e) { S = null; } label(); });
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
