// How it works: one small factory floor, built in CSS 3D and driven straight by scroll.
// Act 1, AmIGo: the camera rides with a tagged trolley. Act 2, AmIMo: anchors rise on the columns
// and each pulse travels to them. Act 3, AmIHub: the floor flattens into the live map, the position
// settles, zones appear, the trolley parks in the queue and its wait counts up. Act 4: the event
// goes out to MES, ERP, WMS and AI assistants.
// Everything is scrubbed from scroll position (no timed transitions inside the pinned scene).
// Without JS the four steps read as plain text; with reduced motion the map shows its final state.
(() => {
  const root = document.querySelector('[data-explain]');
  if (!root) return;
  const runway = root.querySelector('[data-ex-runway]');
  const stage = root.querySelector('[data-ex-stage]');
  const steps = [...root.querySelectorAll('[data-ex-step]')];
  const navs = [...root.querySelectorAll('[data-ex-go]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const span = (a, b, v) => clamp((v - a) / (b - a));
  const ease = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const el = (cls, parent, tag = 'div') => { const e = document.createElement(tag); if (cls) e.className = cls; parent && parent.appendChild(e); return e; };

  // ---------- the world: 1000 x 640 floor units ----------
  const cam = el('ex-cam', stage), world = el('ex-world', cam);
  const floor = el('ex-floor', world);
  el('ex-slab s', world); el('ex-slab e', world);
  [['ex-aisle h', 0, 286, 1000, 28], ['ex-aisle v', 452, 0, 28, 640]].forEach(([c, x, y, w, h]) => { const a = el(c, floor); Object.assign(a.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); });

  const zones = {};
  [['mach', 'Machining', 60, 60, 360, 200], ['insp', 'Inspection', 640, 60, 320, 200], ['queue', 'Queue', 560, 336, 260, 92], ['stores', 'Stores', 60, 400, 360, 190], ['dock', 'Dock', 840, 440, 130, 160]]
    .forEach(([k, name, x, y, w, h]) => { const z = el('ex-zone', floor); z.dataset.z = k; Object.assign(z.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); el('ex-zl', z, 'span').textContent = name; zones[k] = z; });

  // a box with a top and four sides; tone gives the material
  function box(x, y, w, d, h, tone, parent = world, z0 = 0) {
    const b = el('ex-box ' + tone, parent);
    Object.assign(b.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: d + 'px' });
    if (z0) b.style.transform = `translateZ(${z0}px)`;
    el('sh', b);
    const t = el('f top', b); t.style.transform = `translateZ(${h}px)`;
    const s = el('f s', b); Object.assign(s.style, { width: w + 'px', height: h + 'px', top: d + 'px' });
    const n = el('f n', b); Object.assign(n.style, { width: w + 'px', height: h + 'px', top: '0px' });
    const e = el('f e', b); Object.assign(e.style, { width: h + 'px', height: d + 'px', left: w + 'px' });
    const wv = el('f w', b); Object.assign(wv.style, { width: h + 'px', height: d + 'px', left: '0px' });
    b._h = h; b._faces = { t, s, n, e, w: wv };
    return b;
  }
  function setH(b, h) { // grow a box in height
    const f = b._faces; f.t.style.transform = `translateZ(${h}px)`;
    f.s.style.height = f.n.style.height = h + 'px'; f.e.style.width = f.w.style.width = h + 'px';
  }

  // machines, racks, the inspection bench, pallets at the dock
  [[90, 92], [200, 92], [90, 172], [200, 172]].forEach(([x, y]) => box(x, y, 74, 54, 34, 'graphite'));
  box(300, 100, 80, 116, 24, 'graphite');
  box(80, 430, 320, 30, 64, 'steel'); box(80, 520, 320, 30, 64, 'steel');
  box(700, 110, 200, 64, 34, 'steel');
  [[860, 470], [860, 530]].forEach(([x, y]) => box(x, y, 46, 46, 22, 'wood'));

  // columns, and AmIMo anchors on four of them
  const COLH = 210, ANZ = 176;
  const colXY = [[22, 22], [482, 22], [946, 22], [22, 586], [482, 586], [946, 586]];
  const cols = colXY.map(([x, y]) => box(x, y, 32, 32, 2, 'concrete'));
  const anchorAt = [0, 2, 3, 5];
  const anchors = anchorAt.map((i) => {
    const [x, y] = colXY[i], inX = x < 500 ? 32 : -18, inY = y < 300 ? 32 : -14;
    const g = el('ex-anchor', world);
    g._x = x + (x < 500 ? 4 : 2); g._y = y + (y < 300 ? 30 : -12);
    box(0, 0, 26, 14, 18, 'anchor', g);
    return { g, x: g._x + 13, y: g._y + 7, z: ANZ + 9 };
  });

  // trolleys: the hero, two already waiting in the queue, one in stores, one by the machines
  // a shop trolley: four wheels, a steel deck, a push handle and a crate of parts; the tag sits on the crate
  function trolley(tone = '') {
    const g = el('ex-trolley ' + tone, world);
    [[-22, -14], [17, -14], [-22, 10], [17, 10]].forEach(([x, y]) => box(x, y, 5, 4, 6, 'graphite', g));
    box(-24, -16, 48, 32, 3, 'deck', g, 6);
    box(-20, -13, 34, 26, 14, 'crate', g, 9);
    box(20, -15, 3, 30, 22, 'deck', g, 9);
    const tag = el('ex-tag', g); tag.style.transform = 'translate3d(-9px,-6px,23.5px)';
    const dot = el('ex-dot', g); dot.style.transform = 'translate3d(-12px,-9px,25px)';
    return { g, tag, dot };
  }
  const hero = trolley('lead');
  const others = [[680, 382, 0, 'wait'], [740, 382, 0, 'wait'], [130, 490, 0, ''], [800, 220, 0, '']].map(([x, y, a, t]) => {
    const o = trolley(t); o.x = x; o.y = y; o.a = a; o.g.style.transform = `translate3d(${x}px,${y}px,0) rotateZ(${a}deg)`; return o;
  });

  // pulse lines in 3D, from the hero tag to each anchor
  const pulses = anchors.map(() => { const l = el('ex-pulse', world); el('ex-pulse-dot', l); return l; });

  // ---------- 2D overlay ----------
  const ui = el('ex-ui', stage);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'ex-wires'); ui.appendChild(svg);
  const wire = () => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); svg.appendChild(p); return p; };
  const leadGo = wire(), leadMo = wire(); leadGo.setAttribute('class', 'lead'); leadMo.setAttribute('class', 'lead');
  const ROOT = document.documentElement.dataset.root ?? '/';
  const card = (img, name, line) => { const c = el('ex-card', ui); c.innerHTML = `<img src="${ROOT}assets/img/${img}" alt="" width="900" height="600" loading="lazy" decoding="async"><b>${name}</b><span>${line}</span>`; return c; };
  const cGo = card('amigo-card-900.webp', 'AmIGo tag', 'On the trolley'), cMo = card('amimo-3q-900.webp', 'AmIMo anchor', 'On the column');
  cGo.classList.add('l'); cMo.classList.add('l');
  const mapLabel = el('ex-maplabel', ui); mapLabel.innerHTML = '<i></i>AmIHub live map';
  const cross = el('ex-cross', ui); ['a', 'b', 'c', 'd'].forEach((k) => el('t ' + k, cross)); const crossL = el('ex-cross-l', ui); crossL.textContent = 'Down to ±10 cm';
  const pill = el('ex-pill', ui); pill.innerHTML = '<i></i><span>Waiting 0 min</span>'; const pillT = pill.querySelector('span');
  const sysNames = ['MES', 'ERP', 'WMS', 'AI assistants'];
  const sys = sysNames.map((n) => { const s = el('ex-sys', ui); s.textContent = n; return { s, w: wire() }; });
  sys.forEach((o, i) => { o.w.setAttribute('class', 'sysw'); o.s.style.setProperty('--i', i); if (i === 3) o.s.classList.add('ai'); });

  // ---------- motion ----------
  // the hero trolley's path: along the aisle, then a turn into the queue
  const P = [[150, 300], [470, 300], [606, 300], [620, 382]];
  function heroAt(p) {
    if (p < 0.52) { const t = ease(span(0, 0.52, p)); return { x: lerp(P[0][0], P[1][0], t), y: P[0][1], a: 0 }; }
    const t = ease(span(0.56, 0.7, p));
    if (t < 0.55) { const u = t / 0.55; return { x: lerp(P[1][0], P[2][0], u), y: P[1][1], a: 0 }; }
    const u = (t - 0.55) / 0.45; return { x: lerp(P[2][0], P[3][0], u), y: lerp(P[2][1], P[3][1], u), a: 90 * ease(clamp(u * 1.6)) };
  }
  // camera keys: p, tilt, turn, zoom, focus mix (0 = follow the trolley, 1 = floor centre), focus x shift
  const K = [
    [0.00, 54, -28, 3.8, 0, 0], [0.20, 56, -38, 3.3, 0, 0], [0.32, 56, -26, 1.02, 1, 0], [0.48, 54, -20, 1.0, 1, 0],
    [0.58, 0, 0, 1.12, 1, 0], [0.78, 0, 0, 1.12, 1, 0], [0.88, 0, 0, 0.84, 1, 170], [1, 0, 0, 0.84, 1, 170],
  ];
  function camAt(p) {
    let i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1], t = ease(span(a[0], b[0], p));
    return a.map((v, k) => lerp(v, b[k], t));
  }
  let SW = 1, SH = 1, base = 1, wide = true;
  function measure() {
    const r = stage.getBoundingClientRect(); SW = r.width; SH = r.height; wide = innerWidth > 900;
    base = Math.min(SW / 1180, SH / 760);
    if (runway && !reduce) runway.style.height = `${innerHeight * (wide ? 5.2 : 5.6)}px`;
  }
  const centerOf = (n) => { const r = n.getBoundingClientRect(), s = stage.getBoundingClientRect(); return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top]; };
  const rectIn = (n) => { const r = n.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { l: r.left - s.left, t: r.top - s.top, r: r.right - s.left, b: r.bottom - s.top, w: r.width, h: r.height }; };
  const show = (n, o, y = 0) => { n.style.opacity = o.toFixed(3); n.style.transform = `translateY(${((1 - o) * y).toFixed(1)}px)`; n.style.visibility = o > 0.01 ? 'visible' : 'hidden'; };

  function render(p) {
    const h = heroAt(p);
    hero.g.style.transform = `translate3d(${h.x}px,${h.y}px,0) rotateZ(${h.a}deg)`;
    const others0 = others[2]; const ox = lerp(130, 330, ease(span(0.05, 0.6, p)));
    others0.g.style.transform = `translate3d(${ox}px,${others0.y}px,0)`;

    const [, rx, rz, z, mix, shift] = camAt(p);
    const fx = lerp(h.x, 500, mix) + shift, fy = lerp(h.y, 320, mix);
    const sc = base * z * (wide ? 1 : 1.12);
    cam.style.transform = `translate3d(${SW / 2}px, ${SH / 2 + SH * 0.06 * rx / 60}px, 0) scale(${sc}) rotateX(${rx}deg) rotateZ(${rz}deg) translate3d(${-fx}px, ${-fy}px, 0)`;

    // columns rise, anchors arrive
    const up = ease(span(0.22, 0.34, p)) * (1 - ease(span(0.5, 0.58, p)));
    cols.forEach((c) => setH(c, 2 + (COLH - 2) * up));
    anchors.forEach((a, i) => { const o = ease(span(0.3 + i * 0.012, 0.36 + i * 0.012, p)); a.g.style.opacity = o; a.g.style.transform = `translate3d(${a.g._x}px,${a.g._y}px,${(ANZ - 4) * up + 4 + 40 * (1 - o) * (p < 0.4)}px)`; });

    // pulses: draw, travel three times, fade
    const draw = ease(span(0.34, 0.4, p)), fade = 1 - ease(span(0.5, 0.56, p));
    const tz = 24;
    pulses.forEach((l, i) => {
      const a = anchors[i], dx = a.x - h.x, dy = a.y - h.y, dz = a.z - tz, hz = Math.hypot(dx, dy), len = Math.hypot(hz, dz);
      const az = Math.atan2(dy, dx) * 180 / Math.PI, el2 = Math.atan2(dz, hz) * 180 / Math.PI;
      l.style.width = len + 'px';
      l.style.transform = `translate3d(${h.x}px,${h.y}px,${tz}px) rotateZ(${az}deg) rotateY(${-el2}deg) scaleX(${draw.toFixed(3)})`;
      l.style.opacity = (draw * fade).toFixed(3);
      const k = span(0.36, 0.5, p) * 3, f = k - Math.floor(k);
      l.firstChild.style.transform = `translateX(${(f * len).toFixed(1)}px)`;
      l.firstChild.style.opacity = k > 0 && k < 3 ? (Math.sin(f * Math.PI)).toFixed(3) : 0;
    });
    // the tag blinks with each pulse during act 2, then becomes the located dot
    const k2 = span(0.36, 0.5, p) * 3, blink = k2 > 0 && k2 < 3 && (k2 % 1) < 0.18;
    hero.tag.classList.toggle('on', blink || (p < 0.24 && Math.floor(p * 60) % 6 === 0));
    const located = ease(span(0.52, 0.58, p)), waiting = span(0.7, 0.72, p) >= 1;
    hero.dot.style.opacity = located;
    hero.dot.classList.toggle('amber', waiting);
    others.forEach((o) => { o.dot.style.opacity = ease(span(0.56, 0.62, p)); o.dot.classList.toggle('amber', o.g.classList.contains('wait')); });

    // the floor turns into the map
    const mapOn = ease(span(0.54, 0.62, p));
    Object.values(zones).forEach((zn) => { zn.style.opacity = mapOn; });
    zones.queue.classList.toggle('hot', waiting);
    stage.style.setProperty('--map', mapOn.toFixed(3));
    show(mapLabel, mapOn);

    // overlay positions follow the projected scene
    const [tx, ty] = centerOf(hero.tag);
    const cx = ease(span(0.52, 0.6, p)), cGone = 1 - ease(span(0.66, 0.7, p));
    cross.style.transform = `translate(${tx}px,${ty}px) scale(${(2.6 - 1.6 * cx).toFixed(3)})`;
    cross.style.opacity = (cx > 0 ? Math.min(1, cx * 3) * cGone : 0).toFixed(3);
    crossL.style.transform = `translate(${tx + 22}px,${ty - 34}px)`; crossL.style.opacity = (ease(span(0.57, 0.6, p)) * cGone).toFixed(3);

    const wv = ease(span(0.7, 0.73, p)), mins = Math.round(42 * span(0.7, 0.8, p));
    pillT.textContent = `Waiting ${mins} min`;
    const pw = pill.offsetWidth || 140; pill.style.transform = `translate(${tx > SW * 0.55 || !wide ? tx - pw - 14 : tx + 16}px,${ty - 44}px)`; pill.style.opacity = wv.toFixed(3);

    // product cards and their leader lines
    const goO = ease(span(0.02, 0.07, p)) * (1 - ease(span(0.2, 0.25, p)));
    const moO = ease(span(0.33, 0.38, p)) * (1 - ease(span(0.48, 0.53, p)));
    show(cGo, goO, 16); show(cMo, moO, 16);
    const leader = (path, c, [x, y], o) => {
      if (o < 0.01) { path.style.opacity = 0; return; }
      const r = rectIn(c), sx = r.r, sy = r.t + r.h * 0.42;
      path.setAttribute('d', `M${sx},${sy} C${sx + 60},${sy} ${x - 60},${y} ${x},${y}`); path.style.opacity = o;
    };
    leader(leadGo, cGo, [tx, ty], goO);
    leader(leadMo, cMo, centerOf(anchors[0].g.firstChild), moO);

    // out to your systems
    sys.forEach((o, i) => {
      const a = ease(span(0.8 + i * 0.025, 0.86 + i * 0.025, p));
      show(o.s, a, 10);
      const r = rectIn(o.s);
      if (a > 0.01) {
        const ex = r.l, ey = r.t + r.h / 2, mx = (tx + ex) / 2;
        o.w.setAttribute('d', `M${tx},${ty} C${mx},${ty} ${mx},${ey} ${ex},${ey}`);
        const L = o.w.getTotalLength(); o.w.style.strokeDasharray = L; o.w.style.strokeDashoffset = (L * (1 - a)).toFixed(1);
      }
      o.w.style.opacity = a > 0.01 ? 1 : 0;
    });

    // copy: one step at a time, crossfaded straight from scroll
    const W = [[-1, 0.25], [0.25, 0.5], [0.5, 0.78], [0.78, 2]];
    let cur = 0;
    steps.forEach((s, i) => {
      const [a, b] = W[i], o = clamp(Math.min((p - a) / 0.035, (b - p) / 0.035));
      if (wide || true) { s.style.opacity = o.toFixed(3); s.style.transform = `translateY(${((1 - o) * (p < a + 0.04 ? 18 : -18)).toFixed(1)}px)`; s.style.visibility = o > 0.01 ? 'visible' : 'hidden'; }
      if (p >= a) cur = i;
    });
    navs.forEach((n, i) => { n.classList.toggle('on', i === cur); n.style.setProperty('--fill', i < cur ? 1 : i === cur ? clamp((p - W[i][0]) / (Math.min(W[i][1], 1) - Math.max(W[i][0], 0))).toFixed(3) : 0); });
  }

  let len = 1;
  const progress = () => { const r = runway.getBoundingClientRect(); len = Math.max(1, r.height - innerHeight); return clamp(-r.top / len); };
  root.classList.add('ex-live');
  if (reduce) { root.classList.add('ex-still'); measure(); render(0.79); addEventListener('resize', () => { measure(); render(0.79); }); return; }
  let raf = 0;
  const tick = () => { raf = 0; render(progress()); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  addEventListener('resize', () => { measure(); tick(); });
  navs.forEach((n, i) => n.addEventListener('click', () => {
    const at = [0.08, 0.4, 0.7, 0.93][i], top = runway.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + at * len, behavior: 'smooth' });
  }));
  measure(); tick();
  if (/[?&]ex=([\d.]+)/.test(location.search)) { const v = +RegExp.$1; requestAnimationFrame(() => { const top = runway.getBoundingClientRect().top + scrollY; scrollTo(0, top + v * len); }); }
})();
