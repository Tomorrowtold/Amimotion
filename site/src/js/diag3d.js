// Floor diagnostic, in 3D: the visitor's floor builds itself as the six answers land.
// Reads the answers diagnostic.js publishes (root.__diag and the "amimotion:diag" event) and draws:
//   assets they look for, moving on real aisles · how it is found today · where work waits ·
//   how a job is linked to its carrier · the pilot boundary with its AmIMo anchors · and, at the end,
//   the same floor with AmIMotion. Everything here is an illustrative sketch, never customer data.
// Falls back to the SVG sketch when WebGL is missing. Reduced motion: nothing travels, it just appears.
import * as THREE from 'three';

const root = document.querySelector('[data-diag]');
const vis = root && root.querySelector('.diag-visual');
if (vis) init();

function init() {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const tok = (n, f) => css.getPropertyValue(n).trim() || f;
  const C = (n, f) => new THREE.Color(tok(n, f));
  const COL = {
    floor: C('--ink-900', '#080b11'), slab: C('--ink-850', '#0c1118'), prop: C('--ink-700', '#1b2431').lerp(C('--fog-500', '#7c8998'), 0.12), prop2: C('--ink-800', '#121924').lerp(C('--fog-500', '#7c8998'), 0.08),
    edge: C('--ink-line-2', '#283342').lerp(C('--fog-500', '#7c8998'), 0.35), line: C('--ink-line-2', '#283342'),
    fog: C('--fog-300', '#b6c0cc'), fog5: C('--fog-500', '#7c8998'), white: C('--fog-100', '#eef1f5'),
    cyan: C('--cyan', '#38d6ea'), amber: C('--amber', '#ffb224'), blue: C('--signal-hi', '#6c9cff'), hw: new THREE.Color('#2b3038'),
  };

  // ---------------------------------------------------------------- stage
  const box = document.createElement('div'); box.className = 'd3';
  const labels = document.createElement('div'); labels.className = 'd3-labels'; labels.setAttribute('aria-hidden', 'true');
  const hint = document.createElement('p'); hint.className = 'd3-hint'; hint.textContent = 'Drag to turn the floor';
  box.append(labels, hint);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return; }
  if (!renderer.getContext()) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  box.prepend(renderer.domElement);
  vis.querySelector('svg').before(box);
  vis.classList.add('has-3d');

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#c9d6e8', '#05070b', 1.25));
  const key = new THREE.DirectionalLight('#eef3ff', 1.1); key.position.set(-10, 22, 14); scene.add(key);
  const rim = new THREE.DirectionalLight('#6c86b0', 0.35); rim.position.set(16, 8, -12); scene.add(rim);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);

  const lam = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
  const lineMat = (c, opacity = 1) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity });
  // a solid block with drawn edges, sitting on the floor, pivot at its base so it can rise
  function block(w, h, d, color = COL.prop, edge = COL.edge, eo = 0.55) {
    const g = new THREE.Group();
    const geo = new THREE.BoxGeometry(w, h, d); geo.translate(0, h / 2, 0);
    g.add(new THREE.Mesh(geo, lam(color)));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(edge, eo)));
    return g;
  }
  const at = (o, x, z, y = 0) => { o.position.set(x, y, z); return o; };

  // ---------------------------------------------------------------- the hall (metres; same plan as the sketch)
  const S = (x, y, w, h) => [(x - 240) / 20, (y - 125) / 20, w / 20, h / 20];
  const ZONES = {
    dock: [...S(20, 28, 96, 78), 'Dock'], mach: [...S(132, 28, 150, 78), 'Machining'], queue: [...S(298, 28, 74, 78), 'Queue'],
    asm: [...S(388, 28, 72, 196), 'Assembly'], stage: [...S(20, 146, 96, 78), 'Staging'], rework: [...S(132, 146, 72, 78), 'Rework'],
    qc: [...S(220, 146, 152, 78), 'Inspection'],
  };
  const HALL = { x0: -12.8, x1: 12.6, z0: -6.6, z1: 6.8 };
  const AISLE = { main: 0.05, back: -5.7, front: 5.85, left: -11.9, mid: 7.0, right: 11.85 };
  const WAITZ = { machasm: 'queue', qc: 'qc', dock: 'dock', rework: 'rework' };
  const zc = (k) => { const [x, z, w, d] = ZONES[k]; return new THREE.Vector3(x + w / 2, 0, z + d / 2); };

  const world = new THREE.Group(); scene.add(world);
  const builds = [];                                          // static pieces that rise once, in order, when first seen
  const rise = (o, delay) => { o.userData.rise = delay; o.scale.y = 0.001; builds.push(o); world.add(o); return o; };

  const slab = block(HALL.x1 - HALL.x0, 0.22, HALL.z1 - HALL.z0, COL.floor, COL.line, 0.9);
  at(slab, (HALL.x0 + HALL.x1) / 2, (HALL.z0 + HALL.z1) / 2, -0.22); world.add(slab);
  const grid = new THREE.GridHelper(26, 26, COL.line, COL.line); grid.material.transparent = true; grid.material.opacity = 0.35; grid.position.set(-0.1, 0.002, 0.1); grid.scale.set(25.4 / 26, 1, 13.4 / 26); world.add(grid);
  // back and left walls with columns give the floor its depth
  rise(at(block(HALL.x1 - HALL.x0, 2.6, 0.18, COL.prop2, COL.edge, 0.35), (HALL.x0 + HALL.x1) / 2, HALL.z0 + 0.09), 0);
  rise(at(block(0.18, 2.6, HALL.z1 - HALL.z0, COL.prop2, COL.edge, 0.35), HALL.x0 + 0.09, (HALL.z0 + HALL.z1) / 2), 0);
  for (let x = -8; x <= 12; x += 6.4) rise(at(block(0.45, 3.4, 0.45, COL.prop, COL.edge, 0.5), x, HALL.z0 + 0.3), 60);

  // zones are painted areas: a fill and an outline, tinted when work waits there
  const zoneObj = {};
  for (const [k, [x, z, w, d]] of Object.entries(ZONES)) {
    const fill = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color: COL.slab, transparent: true, opacity: 0.9, depthWrite: false }));
    fill.rotation.x = -Math.PI / 2; fill.position.set(x + w / 2, 0.012, z + d / 2); fill.userData.zone = k;
    const pts = [[x, z], [x + w, z], [x + w, z + d], [x, z + d], [x, z]].map(([a, b]) => new THREE.Vector3(a, 0.02, b));
    const outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(COL.edge, 0.8));
    world.add(fill, outline);
    zoneObj[k] = { fill, outline, hot: 0, hover: 0 };
  }
  const zoneFills = Object.values(zoneObj).map((z) => z.fill);

  // equipment, so each zone reads as what it is
  const props = [];
  const P = (o, delayBias = 0) => { props.push(o); rise(o, 120 + (o.position.x - HALL.x0) * 26 + delayBias); return o; };
  [-4.3, -1.6, 1.1].forEach((x) => { const m = block(1.9, 1.35, 1.7); m.add(at(block(1.2, 0.35, 0.9, COL.prop2), 0.2, 0, 1.35)); P(at(m, x, -3.3)); });
  P(at(block(1.0, 0.7, 9.0, COL.prop2), 9.2, 0.05));
  [-3.2, -0.6, 2.0].forEach((z) => P(at(block(0.9, 1.25, 0.9), 10.5, z)));
  [0.6, 3.6].forEach((x) => P(at(block(1.8, 0.85, 0.9), x, 3.6)));
  P(at(block(2.2, 0.75, 0.9), -3.6, 3.7));
  // racks in staging: open frames with three shelves (the "levels" a tag sits on)
  function rack(len) {
    const g = new THREE.Group();
    for (const s of [-1, 1]) for (const e of [-1, 1]) g.add(at(block(0.08, 2.4, 0.08, COL.prop, COL.edge, 0.7), s * 0.4, e * (len / 2 - 0.05)));
    for (const y of [0.15, 0.95, 1.75]) { const sh = block(0.9, 0.06, len, COL.prop, COL.edge, 0.6); sh.position.y = y; g.add(sh);
      for (let z = -len / 2 + 0.5; z < len / 2; z += 0.9) if (Math.sin(z * 7 + y * 3) > -0.3) g.add(at(block(0.6, 0.4, 0.6, COL.prop2, COL.edge, 0.4), 0, z, y + 0.06)); }
    return g;
  }
  P(at(rack(3.4), -10.5, 3.0)); P(at(rack(3.4), -8.4, 3.0));
  [-10.2, -8.3].forEach((x) => P(at(block(1.5, 2.2, 0.12, COL.prop, COL.edge, 0.6), x, HALL.z0 + 0.25)));     // dock doors
  // queue lanes painted on the floor
  for (const x of [3.6, 4.6, 5.6]) {
    const pts = [[-0.55, -0.45], [0.55, -0.45], [0.55, 0.45], [-0.55, 0.45], [-0.55, -0.45]].map(([a, b]) => new THREE.Vector3(x + a * 0.8, 0.025, -2.3 + b * 1.4));
    world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(COL.fog5, 0.5)));
  }

  // ---------------------------------------------------------------- things that move
  function trolley() { const g = block(0.9, 0.12, 0.62, COL.prop, COL.edge, 0.7); g.children.forEach((c) => (c.position.y = 0.3));
    const t = block(0.78, 0.34, 0.5, new THREE.Color('#3a4656'), COL.fog5, 0.6); t.position.y = 0.42; g.add(t);
    for (const [a, b] of [[-0.38, -0.24], [0.38, -0.24], [-0.38, 0.24], [0.38, 0.24]]) g.add(at(block(0.05, 0.3, 0.05, COL.prop, COL.edge, 0.3), a, b)); return g; }
  function forklift() { const g = block(1.1, 0.75, 0.8, new THREE.Color('#4a4f57'), COL.fog5, 0.6);
    g.add(at(block(0.6, 0.55, 0.6, COL.prop2, COL.fog5, 0.4), -0.15, 0, 0.75)); g.add(at(block(0.1, 1.8, 0.7, COL.prop, COL.fog5, 0.5), 0.6, 0));
    g.add(at(block(0.7, 0.05, 0.12, COL.fog5, COL.fog5, 0.3), 0.95, -0.22, 0.1)); g.add(at(block(0.7, 0.05, 0.12, COL.fog5, COL.fog5, 0.3), 0.95, 0.22, 0.1)); return g; }
  function amr() { const g = block(1.0, 0.28, 0.72, new THREE.Color('#3b4250'), COL.fog5, 0.7); g.add(at(block(0.8, 0.04, 0.56, COL.fog5, COL.fog5, 0.2), 0, 0, 0.28)); return g; }
  function pallet() { const g = block(1.0, 0.14, 1.0, new THREE.Color('#3a3630'), COL.fog5, 0.4);
    g.add(at(block(0.9, 0.5, 0.9, new THREE.Color('#5a5246'), COL.fog5, 0.4), 0, 0, 0.14)); g.add(at(block(0.6, 0.35, 0.6, new THREE.Color('#5a5246'), COL.fog5, 0.4), 0.1, 0.05, 0.64)); return g; }
  function fixture() { const g = block(0.42, 0.42, 0.42, new THREE.Color('#566070'), COL.fog, 0.5); g.rotation.y = 0.6; return g; }
  function person(c = COL.fog5) { const g = new THREE.Group();
    const body = new THREE.CylinderGeometry(0.17, 0.2, 1.05, 10); body.translate(0, 0.53, 0); g.add(new THREE.Mesh(body, lam(c)));
    const head = new THREE.SphereGeometry(0.15, 12, 10); head.translate(0, 1.22, 0); g.add(new THREE.Mesh(head, lam(c))); return g; }
  function anchor() { const g = new THREE.Group(); g.add(block(0.07, 2.7, 0.07, COL.prop, COL.edge, 0.6));
    const u = block(0.46, 0.32, 0.2, COL.hw, COL.fog5, 0.7); u.position.y = 2.6; g.add(u); return g; }
  function tag() { const t = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.12), new THREE.MeshBasicMaterial({ color: COL.cyan })); t.userData.isTag = true; return t; }

  const LOOP = [[AISLE.left, AISLE.main], [AISLE.mid, AISLE.main], [AISLE.mid, AISLE.front], [AISLE.left, AISLE.front]];
  const OUTER = [[AISLE.left, AISLE.back], [AISLE.right, AISLE.back], [AISLE.right, AISLE.front], [AISLE.left, AISLE.front]];
  const ASSETS = {
    carriers: { n: 6, make: trolley, speed: 1.15, route: LOOP, h: 0.8 },
    tools: { n: 4, make: fixture, still: [[-4.3, -2.2, 1.35], [1.1, -2.2, 1.35], [0.6, 3.6, 0.85], [-3.6, 3.7, 0.75]], h: 0.5 },
    vehicles: { n: 2, make: forklift, speed: 2.1, route: OUTER, h: 1.9 },
    robots: { n: 2, make: amr, speed: 1.5, route: [[-10.4, AISLE.main], [6.4, AISLE.main]], h: 0.35 },
    goods: { n: 4, make: pallet, still: [[-10.1, -3.2], [-8.8, -3.2], [-7.5, -3.2], [-10.1, -1.9]], h: 1.0 },
    people: { n: 3, make: () => person(), speed: 0.85, wander: true, h: 1.4 },
  };
  const routeLen = (r) => r.reduce((s, p, k) => s + Math.hypot(r[(k + 1) % r.length][0] - p[0], r[(k + 1) % r.length][1] - p[1]), 0);
  function onLoop(r, d) {                                      // point and heading at distance d around a closed route
    const L = routeLen(r); d = ((d % L) + L) % L;
    for (let k = 0; k < r.length; k++) { const a = r[k], b = r[(k + 1) % r.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d <= l) { const t = d / l; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[0] - a[0], b[1] - a[1])]; } d -= l; }
    return [r[0][0], r[0][1], 0];
  }
  // walking between two points by the aisles, never through a machine
  function aisleRoute(a, b) {
    const pts = [[a.x, a.z]];
    const onMain = Math.abs(a.z - AISLE.main) < 0.4;
    if (!onMain) { const vx = Math.abs(a.x - AISLE.mid) < Math.abs(a.x - AISLE.left) ? AISLE.mid : AISLE.left;
      const z = Math.abs(a.z - AISLE.front) < 1 || Math.abs(a.z - AISLE.back) < 1 ? a.z : null;
      if (z !== null) pts.push([vx, z]); pts.push([z !== null ? vx : a.x, AISLE.main]); }
    else pts.push([a.x, AISLE.main]);
    pts.push([b.x, AISLE.main], [b.x, b.z]);
    return pts;
  }

  const items = new Map();                                     // key -> { obj, mode, ... }
  const now = () => performance.now();
  function spawn(key, obj, opts = {}) {
    obj.userData.born = now(); obj.userData.dying = 0; obj.scale.setScalar(REDUCED ? 1 : 0.001);
    world.add(obj); const it = { key, obj, ...opts }; items.set(key, it); return it;
  }
  function kill(key) { const it = items.get(key); if (!it || it.obj.userData.dying) return; it.obj.userData.dying = now(); }

  // ---------------------------------------------------------------- labels (HTML, projected each frame)
  const L = new Map();
  function label(key, text, pos, kind = '') {
    let l = L.get(key);
    if (!l) { const el = document.createElement('span'); el.className = 'd3-label ' + kind; labels.append(el); l = { el, pos }; L.set(key, l);
      requestAnimationFrame(() => el.classList.add('on')); }
    if (l.el.textContent !== text) { l.el.textContent = text; l.wid = 0; }
    l.el.className = 'd3-label on ' + kind; l.pos = pos; l.keep = true;
  }
  const v3 = new THREE.Vector3();
  function placeLabels(w, h) {
    for (const [k, l] of L) {
      const p = typeof l.pos === 'function' ? l.pos() : l.pos;
      if (!p) continue;
      v3.copy(p).project(camera);
      let x = (v3.x + 1) / 2 * w; const y = (1 - v3.y) / 2 * h;
      // centred labels stay whole inside the canvas
      if (!/zone|blue|quiet|caption/.test(l.el.className)) { const half = (l.wid ||= l.el.offsetWidth) / 2; x = Math.max(half + 6, Math.min(w - half - 6, x)); }
      l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }

  // ---------------------------------------------------------------- overlays: lines on the floor and in the air
  const overlay = new THREE.Group(); world.add(overlay);
  function tether(from, to, color, dashed) {
    const g = new THREE.BufferGeometry().setFromPoints([from, to]);
    const m = dashed ? new THREE.LineDashedMaterial({ color, dashSize: 0.18, gapSize: 0.14, transparent: true }) : lineMat(color, 1);
    const l = new THREE.Line(g, m); if (dashed) l.computeLineDistances(); return l;
  }
  function rectLine(x0, z0, x1, z1, color, y = 0.04) {
    const pts = [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]].map(([a, b]) => new THREE.Vector3(a, y, b));
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color, dashSize: 0.5, gapSize: 0.28, transparent: true }));
    l.computeLineDistances(); return l;
  }
  const trail = { pts: [], obj: null };
  {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(90 * 3), 3));
    trail.obj = new THREE.Points(g, new THREE.PointsMaterial({ color: COL.fog, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.7 }));
    trail.obj.visible = false; world.add(trail.obj);
  }

  // ---------------------------------------------------------------- state -> scene
  let st = { A: { assets: [] }, i: 0, result: false };
  let frame = { box: [-12.8, -6.6, 12.6, 6.8], pol: 0.98 };
  let pilotBox = null;

  function apply(next) {
    st = next;
    const A = st.A || {}, set = new Set(A.assets || []), res = st.result;
    for (const l of L.values()) l.keep = false;
    const want = new Set();
    const hot = WAITZ[A.wait];

    // assets: spawn what was chosen, let the rest go
    for (const [type, cfg] of Object.entries(ASSETS)) {
      for (let k = 0; k < cfg.n; k++) {
        const key = `${type}-${k}`;
        if (!set.has(type)) { kill(key); continue; }
        want.add(key);
        let it = items.get(key);
        if (!it || it.obj.userData.dying) {
          if (it) { world.remove(it.obj); items.delete(key); }
          const o = cfg.make();
          if (cfg.still) { const [x, z, y = 0] = cfg.still[k]; at(o, x, z, y); it = spawn(key, o, { mode: 'still', h: cfg.h }); }
          else if (cfg.wander) { const c = zc(['mach', 'qc', 'stage'][k]); at(o, c.x, AISLE.main + (k - 1) * 0.6); it = spawn(key, o, { mode: 'wander', speed: cfg.speed, path: [], h: cfg.h }); }
          else if (cfg.route.length === 2) { it = spawn(key, o, { mode: 'shuttle', speed: cfg.speed, d: k * 9, route: cfg.route, h: cfg.h }); }
          else { it = spawn(key, o, { mode: 'loop', speed: cfg.speed, d: (routeLen(cfg.route) / cfg.n) * k + (type === 'vehicles' ? 7 : 0), route: cfg.route, h: cfg.h }); }
          if (!cfg.still && !cfg.wander) { const [x, z, a] = cfg.route.length === 2 ? [cfg.route[0][0] + it.d, cfg.route[0][1], Math.PI / 2] : onLoop(cfg.route, it.d); at(o, x, z); o.rotation.y = a; }
        }
        // the tag appears on everything once the floor is seen with AmIMotion
        const hasTag = it.obj.children.some((c) => c.userData.isTag);
        if (res && !hasTag) { const t = tag(); t.position.y = cfg.h + 0.05; t.userData.born = now(); t.scale.setScalar(REDUCED ? 1 : 0.001); it.obj.add(t); }
        if (!res && hasTag) it.obj.children.filter((c) => c.userData.isTag).forEach((c) => it.obj.remove(c));
      }
    }

    // where work waits: carriers 0-2 leave the loop and queue there
    const slots = { queue: [[3.6, -2.3], [4.6, -2.3], [5.6, -2.3]], qc: [[1.3, 1.9], [2.3, 1.9], [3.3, 1.9]], dock: [[-9.8, -2.2], [-8.6, -2.2], [-7.4, -1.6]], rework: [[-4.7, 2.0], [-3.7, 2.0], [-2.7, 2.0]] }[hot];
    for (let k = 0; k < 3; k++) {
      const it = items.get(`carriers-${k}`); if (!it || it.obj.userData.dying) continue;
      if (slots) { const target = new THREE.Vector3(slots[k][0], 0, slots[k][1]);
        if (it.mode !== 'park' || !it.target || !it.target.equals(target)) { it.mode = 'park'; it.target = target; it.path = REDUCED ? [[target.x, target.z]] : aisleRoute(it.obj.position, target); it.seg = 0;
          if (REDUCED) at(it.obj, target.x, target.z); } }
      else if (it.mode === 'park') { it.mode = 'rejoin'; it.path = aisleRoute(it.obj.position, new THREE.Vector3(AISLE.left, 0, AISLE.main)); it.seg = 0; }
    }
    for (const [k, z] of Object.entries(zoneObj)) z.hotTarget = (k === hot) ? 1 : 0;
    const anyCarrier = items.get('carriers-0') && !items.get('carriers-0').obj.userData.dying;

    // zone names: always there, quiet; the waiting one speaks up
    for (const [k, [x, z, w, d, name]] of Object.entries(ZONES)) {
      const isHot = k === hot;
      const txt = isHot ? (res ? (anyCarrier ? `${name} · work waits here` : `${name} · work waits here`) : `${name} · work waits here`) : (A.wait === 'unknown' && !res ? `${name} · ?` : name);
      label('z-' + k, txt, new THREE.Vector3(x + 0.25, 0.05, z + 0.35), 'zone' + (isHot ? ' warn' : '') + (zoneObj[k].hover ? ' hover' : ''));
    }

    // how it is found today (gone once the floor is seen with AmIMotion)
    const sup = 'supervisor';
    const found = res ? null : A.found;
    if (found === 'walk' || found === 'call') {
      want.add(sup);
      let it = items.get(sup);
      if (!it || it.obj.userData.dying) { if (it) { world.remove(it.obj); items.delete(sup); } it = spawn(sup, at(person(COL.white), -11.2, AISLE.main), { mode: 'still', h: 1.4 }); }
      it.mode = found === 'walk' ? 'search' : 'still'; it.path = it.path || []; it.speed = 1.3;
      if (found === 'call') at(it.obj, -0.9, AISLE.main);
      label('sup', found === 'walk' ? 'Supervisor, searching on foot' : 'Supervisor, calling round', () => it.obj.position.clone().setY(1.9), 'light');
      if (found === 'call') {
        const p0 = items.get('people-0'), p1 = items.get('people-1');
        if (p0) label('c0', '“Not at my cell”', () => p0.obj.position.clone().setY(1.9));
        if (p1) label('c1', '“Try assembly?”', () => p1.obj.position.clone().setY(1.9));
        if (!p0) label('c0', '“Not at my cell”', zc('mach').setY(2.2));
        if (!p1) label('c1', '“Try assembly?”', zc('asm').setY(2.2));
      }
    } else kill(sup);
    trail.obj.visible = found === 'walk' && !REDUCED; if (!trail.obj.visible) trail.pts.length = 0;

    if (found === 'mes') {
      want.add('ghost');
      if (!items.get('ghost') || items.get('ghost').obj.userData.dying) {
        if (items.get('ghost')) { world.remove(items.get('ghost').obj); items.delete('ghost'); }
        const g = trolley(); g.traverse((c) => { if (c.material) { c.material = c.material.clone(); c.material.transparent = true; c.material.opacity = c.isLineSegments ? 0.5 : 0.12; c.material.depthWrite = false; } });
        spawn('ghost', at(g, -1.6, -0.45), { mode: 'still', h: 0.8 });
      }
      label('ghost', 'Last scan: leaving Cell 2', new THREE.Vector3(-1.6, 1.45, -0.45), 'dashed');
      if (anyCarrier) label('real', 'Where it actually is', () => items.get('carriers-0').obj.position.clone().setY(1.55), 'light');
    } else kill('ghost');

    if (found === 'board') {
      want.add('board');
      if (!items.get('board') || items.get('board').obj.userData.dying) {
        const b = block(2.2, 1.3, 0.08, new THREE.Color('#d9dee5'), COL.fog5, 0.6); b.children.forEach((c) => (c.position.y = 0.7));
        b.add(at(block(0.06, 0.7, 0.06, COL.prop, COL.edge, 0.4), -1, 0)); b.add(at(block(0.06, 0.7, 0.06, COL.prop, COL.edge, 0.4), 1, 0));
        spawn('board', at(b, -6.9, -5.35), { mode: 'still', h: 2 });
      }
      label('board', 'Whiteboard, updated by hand at 09:10', new THREE.Vector3(-6.9, 2.4, -5.35));
    } else kill('board');
    if (found === 'late') label('late', 'Found when it’s already late', zc('asm').setY(1.9), 'warn');

    // the job link: a line from carrier C-014 up to its job
    if (A.link && anyCarrier) {
      const solid = res || A.link === 'scan' || A.link === 'mes';
      const txt = res ? 'Trolley · job linked' : { scan: 'Job linked by scan', mes: 'Job linked from MES', paper: 'Job on a paper traveller', none: 'Job: unknown' }[A.link];
      label('job', txt, () => items.get('carriers-0').obj.position.clone().setY(2.35), solid ? 'sig' : 'warn dashed');
      overlay.userData.tether = { solid };
    } else overlay.userData.tether = null;

    // the pilot: a boundary on the floor and AmIMo anchors around it
    const pad = 0.45;
    const zb = (k) => { const [x, z, w, d] = ZONES[k]; return [x - pad, z - pad, x + w + pad, z + d + pad]; };
    pilotBox = A.scope ? { cell: zb(hot || 'queue'), line: [-5.9, -5.35, 11.5, 0.9], hall: [-12.3, -6.1, 12.1, 6.35], plant: [-12.3, -6.1, 12.1, 6.35] }[A.scope] : null;
    const pk = pilotBox ? `pilot:${pilotBox.join(',')}` : null;
    for (const [k] of items) if (k.startsWith('pilot:') && !k.startsWith(pk + '|') && k !== pk) kill(k);
    if (pilotBox) {
      const [x0, z0, x1, z1] = pilotBox;
      if (!items.get(pk) || items.get(pk).obj.userData.dying) {
        if (items.get(pk)) { world.remove(items.get(pk).obj); items.delete(pk); }
        spawn(pk, rectLine(x0, z0, x1, z1, COL.blue), { mode: 'still', flat: true });
        // anchors every ~8 m round the boundary
        const per = []; const nx = Math.max(1, Math.ceil((x1 - x0) / 8)), nz = Math.max(1, Math.ceil((z1 - z0) / 8));
        for (let a = 0; a <= nx; a++) per.push([x0 + (x1 - x0) * a / nx, z0], [x0 + (x1 - x0) * a / nx, z1]);
        for (let b = 1; b < nz; b++) per.push([x0, z0 + (z1 - z0) * b / nz], [x1, z0 + (z1 - z0) * b / nz]);
        per.forEach(([x, z], n) => { const it = spawn(`${pk}|a${n}`, at(anchor(), x, z), { mode: 'still' }); it.obj.userData.born += REDUCED ? 0 : 90 * n; });
      }
      for (const [k] of items) if (k.startsWith(pk)) want.add(k);
      label('pilot', A.scope === 'plant' ? 'Plant · start with one line' : 'Pilot area', new THREE.Vector3(x1 - 0.2, 0.05, z1 - 0.2), 'blue');
      label('anchors', 'AmIMo anchors', new THREE.Vector3(x0, 3.2, z0), 'quiet');
    }

    if (res) label('with', 'With AmIMotion: every tagged asset, its job and its wait, on one floor', null, 'caption');
    // labels that no longer apply fade away
    for (const [k, l] of L) if (!l.keep) { l.el.classList.remove('on'); setTimeout(() => { if (!l.keep) { l.el.remove(); L.delete(k); } }, 260); }
    const cap = L.get('with'); if (cap) cap.el.style.transform = 'none';

    // camera: the whole hall while answering; the pilot or the role's corner once those are known
    const role = A.role;
    const FULL = [HALL.x0, HALL.z0, HALL.x1, HALL.z1];
    let f = { box: FULL, pol: 0.98 };
    if (pilotBox && st.i >= 4 && A.scope !== 'hall' && A.scope !== 'plant') f = { box: pilotBox.map((v, n) => v + (n < 2 ? -1.2 : 1.2)), pol: 0.98 };
    if (role && !res) { if (role === 'eng') f.pol = 1.1; if (role === 'scm' && f.box === FULL) f = { box: [HALL.x0, -6, -4.6, 5.6], pol: 0.98 }; }
    frame = f;
    wake();
  }

  // ---------------------------------------------------------------- camera, drag, hover
  const cam = { box: frame.box.slice(), pol: frame.pol, az: -0.42, azT: -0.42 };
  let dragging = null, w = 1, h = 1;
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => { dragging = { x: e.clientX, az: cam.azT }; canvas.setPointerCapture(e.pointerId); box.classList.add('grabbing'); hint.hidden = true; wake(); });
  canvas.addEventListener('pointermove', (e) => {
    if (dragging) { cam.azT = Math.max(-1.45, Math.min(0.25, dragging.az - (e.clientX - dragging.x) / 260)); wake(); return; }
    if (e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(zoneFills)[0]; const k = hit ? hit.object.userData.zone : null;
    let changed = false; for (const [zk, z] of Object.entries(zoneObj)) { const v = zk === k ? 1 : 0; if (z.hover !== v) { z.hover = v; changed = true; } }
    if (changed) { apply(st); }
  });
  const end = () => { dragging = null; box.classList.remove('grabbing'); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', () => { if (Object.values(zoneObj).some((z) => z.hover)) { Object.values(zoneObj).forEach((z) => (z.hover = 0)); apply(st); } });
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

  function size() {
    const r = box.getBoundingClientRect(); w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
  }
  new ResizeObserver(() => { size(); wake(); }).observe(box);

  // fit the framed box (and what stands on it) into the canvas, below the heading and above the caption
  const corner = new THREE.Vector3();
  function placeCamera(dt) {
    const k = REDUCED ? 1 : 1 - Math.exp(-dt * 3.2);
    let moving = false;
    cam.box = cam.box.map((v, n) => { const d = frame.box[n] - v; if (Math.abs(d) > 0.005) moving = true; return v + d * k; });
    cam.pol += (frame.pol - cam.pol) * k;
    const azBase = w < 700 ? 0.22 : 0; const auto = st.result && !dragging && !REDUCED ? Math.sin(now() / 5200) * 0.16 : 0;
    const daz = cam.azT + azBase + auto - cam.az; cam.az += daz * (REDUCED ? 1 : 1 - Math.exp(-dt * 6)); if (Math.abs(daz) > 0.002) moving = true;
    const [x0, z0, x1, z1] = cam.box, tgt = new THREE.Vector3((x0 + x1) / 2, 0, (z0 + z1) / 2), D = 60;
    camera.position.set(tgt.x + D * Math.sin(cam.pol) * Math.sin(cam.az), D * Math.cos(cam.pol), tgt.z + D * Math.sin(cam.pol) * Math.cos(cam.az));
    camera.lookAt(tgt); camera.updateMatrixWorld();
    let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity;
    for (const x of [x0, x1]) for (const z of [z0, z1]) for (const y of [0, 2.4]) {
      corner.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
      mnx = Math.min(mnx, corner.x); mxx = Math.max(mxx, corner.x); mny = Math.min(mny, corner.y); mxy = Math.max(mxy, corner.y);
    }
    const narrow = w < 700, top = narrow ? 64 : 84, bot = narrow ? 46 : 60, side = narrow ? -w * 0.07 : 24;
    const sc = Math.max((mxx - mnx) / Math.max(1, w - 2 * side), (mxy - mny) / Math.max(1, h - top - bot));
    const cx = (mnx + mxx) / 2, cy = (mny + mxy) / 2;
    camera.left = cx - (w / 2) * sc; camera.right = cx + (w / 2) * sc;
    camera.top = cy + ((h - top - bot) / 2 + top) * sc; camera.bottom = camera.top - h * sc;
    camera.updateProjectionMatrix();
    return moving;
  }

  // ---------------------------------------------------------------- the clock
  const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  let built = 0, last = now(), raf = 0, visible = false;
  function step(path, it, dt) {                             // walk along a polyline; returns true at the end
    let left = it.speed * dt;
    while (left > 0 && it.seg < path.length - 1) {
      const a = path[it.seg], b = path[it.seg + 1], o = it.obj.position;
      const dx = b[0] - o.x, dz = b[1] - o.z, d = Math.hypot(dx, dz);
      if (d < 1e-3) { it.seg++; continue; }
      const m = Math.min(d, left); o.x += dx / d * m; o.z += dz / d * m; left -= m;
      const yaw = Math.atan2(dx, dz); let dy = yaw - it.obj.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); it.obj.rotation.y += dy * Math.min(1, dt * 8);
      if (m >= d) it.seg++;
    }
    return it.seg >= path.length - 1;
  }
  const WANDER = [zc('mach'), zc('qc'), zc('stage'), zc('rework'), zc('dock'), zc('queue'), zc('asm')].map((v) => new THREE.Vector3(v.x, 0, v.z + (v.z < 0 ? 1.5 : -1.5)));
  function tick() {
    raf = 0;
    const t = now(), dt = Math.min(0.05, (t - last) / 1000); last = t;
    let busy = false;
    // the build: walls, then equipment rising left to right
    if (!built && visible) built = t;
    for (const o of builds) { const k = REDUCED ? 1 : ease((t - built - o.userData.rise) / 700); if (o.scale.y !== k) { o.scale.y = Math.max(0.001, k); busy = busy || k < 1; } }
    // spawns and departures
    for (const [key, it] of items) {
      const u = it.obj.userData;
      if (u.baseY === undefined) u.baseY = it.obj.position.y;
      if (u.dying) { const k = REDUCED ? 1 : ease((t - u.dying) / 320);
        if (it.flat) it.obj.material.opacity = 1 - k; else { it.obj.scale.setScalar(Math.max(0.001, 1 - k)); it.obj.position.y = u.baseY - 0.4 * k; }
        if (k >= 1) { world.remove(it.obj); items.delete(key); } busy = true; continue; }
      const k = REDUCED ? 1 : ease((t - u.born) / 650);
      if (it.flat) { it.obj.scale.set(1, 1, 1); it.obj.material.opacity = k; }
      else { it.obj.scale.set(1, Math.max(0.001, k), 1); it.obj.position.y = u.baseY + (1 - k) * 1.8; }
      if (k < 1) busy = true;
      it.obj.children.forEach((c) => { if (c.userData.isTag && c.scale.x < 1) { c.scale.setScalar(REDUCED ? 1 : Math.max(0.001, ease((t - c.userData.born) / 400))); busy = true; } });
      if (REDUCED) continue;
      if (it.mode === 'loop') { it.d += it.speed * dt; const [x, z, a] = onLoop(it.route, it.d); it.obj.position.x = x; it.obj.position.z = z; let dy = a - it.obj.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); it.obj.rotation.y += dy * Math.min(1, dt * 7); busy = true; }
      else if (it.mode === 'shuttle') { it.d += it.speed * dt; const span = it.route[1][0] - it.route[0][0], p = it.d % (2 * span), x = it.route[0][0] + (p < span ? p : 2 * span - p);
        it.obj.position.set(x, it.obj.position.y, it.route[0][1]); it.obj.rotation.y = p < span ? Math.PI / 2 : -Math.PI / 2; busy = true; }
      else if (it.mode === 'park' || it.mode === 'rejoin') { if (step(it.path, it, dt)) { if (it.mode === 'rejoin') { it.mode = 'loop'; it.route = LOOP; it.d = 0; } else { let dy = Math.PI - it.obj.rotation.y; it.obj.rotation.y += Math.atan2(Math.sin(dy), Math.cos(dy)) * Math.min(1, dt * 4); } } busy = true; }
      else if (it.mode === 'wander' || it.mode === 'search') {
        if (!it.path.length || step(it.path, it, dt)) { const nxt = WANDER[Math.floor(Math.random() * WANDER.length)]; it.path = aisleRoute(it.obj.position, nxt); it.seg = 0; it.pause = it.mode === 'search' ? 0.4 : 1.6; }
        busy = true;
      }
    }
    // the search leaves footprints
    const sup = items.get('supervisor');
    if (trail.obj.visible && sup) {
      const p = sup.obj.position; const lastP = trail.pts[trail.pts.length - 1];
      if (!lastP || Math.hypot(lastP[0] - p.x, lastP[1] - p.z) > 0.45) { trail.pts.push([p.x, p.z]); if (trail.pts.length > 90) trail.pts.shift(); }
      const arr = trail.obj.geometry.attributes.position.array; arr.fill(0);
      trail.pts.forEach(([x, z], n) => { arr[n * 3] = x; arr[n * 3 + 1] = 0.05; arr[n * 3 + 2] = z; });
      trail.obj.geometry.setDrawRange(0, trail.pts.length); trail.obj.geometry.attributes.position.needsUpdate = true;
    }
    // zones take their colour gently
    for (const z of Object.values(zoneObj)) {
      z.hot += ((z.hotTarget || 0) - z.hot) * (REDUCED ? 1 : Math.min(1, dt * 5));
      z.fill.material.color.copy(COL.slab).lerp(COL.amber, z.hot * 0.22 + z.hover * 0.05);
      z.outline.material.color.copy(COL.edge).lerp(COL.amber, z.hot).lerp(COL.white, z.hover * 0.5);
      if (Math.abs((z.hotTarget || 0) - z.hot) > 0.01) busy = true;
    }
    // the job tether follows its carrier
    const tt = overlay.userData.tether, c0 = items.get('carriers-0');
    overlay.children.forEach((c) => c.geometry.dispose()); overlay.clear();
    if (tt && c0) { const p = c0.obj.position; overlay.add(tether(new THREE.Vector3(p.x, 0.85, p.z), new THREE.Vector3(p.x, 2.1, p.z), tt.solid ? COL.cyan : COL.amber, !tt.solid)); }
    const g = items.get('ghost');
    if (g && c0 && !g.obj.userData.dying) overlay.add(tether(new THREE.Vector3(-1.6, 0.5, -0.45), c0.obj.position.clone().setY(0.5), COL.fog5, true));
    busy = placeCamera(dt) || busy || !!dragging || st.result;
    renderer.render(scene, camera);
    placeLabels(w, h);
    if (busy && visible && !document.hidden) wake();
  }
  function wake() { if (!raf) { last = Math.min(last, now()); raf = requestAnimationFrame(tick); } }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = now(); wake(); } }, { rootMargin: '120px' }).observe(box);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = now(); wake(); } });

  size();
  apply(root.__diag || st);
  document.addEventListener('amimotion:diag', (e) => apply(e.detail));
}
