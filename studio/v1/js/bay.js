// Plan your first bay: a live plan of one bay, drawn in hairlines on the card.
// Each answer the planner asks about has its own picture: what moves, where it goes, where it waits.
// Pointing at (or focusing) an answer shows it; otherwise the plan walks through them on its own.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

// the bay, in metres: 48 x 28, columns every 8 m
const W = 48, H = 28;
const RACKS = [[6, 4, 30, 2.4], [6, 9.6, 30, 2.4]];             // x, y, w, h
const LINE = [6, 20, 26, 3];                                      // line-side
const DOCK = [39, 3, 7, 22];                                      // dock / staging
const BUF = [33, 16.5, 4.5, 4.5];                                 // the buffer where work waits
const STATIONS = [[9, 21.5], [15, 21.5], [21, 21.5], [27, 21.5]];
// one picture per answer: routes (polylines), mover glyph, count, where one waits
const MODES = {
  carriers: { glyph: 'box', n: 4, speed: 5.2, routes: [[[2, 15], [12, 15], [12, 19], [30, 19], [35, 18.7], [42, 18.7], [42, 8], [36, 7], [2, 7]]], wait: [35.2, 18.7] },
  tools: { glyph: 'dia', n: 4, speed: 3.2, routes: [[[9, 18.6], [15, 18.6], [21, 18.6], [27, 18.6], [27, 14.2], [9, 14.2], [9, 18.6]]], wait: [21, 18.6] },
  vehicles: { glyph: 'fork', n: 2, speed: 7.5, routes: [[[2, 7.2], [36, 7.2], [42, 7.2], [42, 22], [36, 22], [36, 14.2], [2, 14.2]]], wait: [42, 13] },
  robots: { glyph: 'ring', n: 3, speed: 4.4, routes: [[[4, 17.6], [32, 17.6], [37, 13], [37, 2], [4, 2], [4, 17.6]]], wait: [35.2, 15.2] },
  goods: { glyph: 'pal', n: 3, speed: 6, routes: [[[33, 7.2], [40, 7.2], [40, 12], [44, 12]], [[33, 14.2], [41, 14.2], [41, 20], [44, 20]]], wait: [42.5, 20] },
};
const ORDER = ['carriers', 'tools', 'vehicles', 'robots', 'goods'];

const polyLen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
const along = (pts, d) => {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= l) { const k = d / l; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(b[1] - a[1], b[0] - a[0])]; }
    d -= l;
  }
  const a = pts[pts.length - 2], b = pts[pts.length - 1]; return [b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0])];
};

export function mount(sim) {
  const card = sim.querySelector('.sim-card');
  const opts = [...sim.querySelectorAll('.sim-opt')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas'); cv.className = 'sim-bay'; cv.setAttribute('aria-hidden', 'true');
  card.insertBefore(cv, card.querySelector('.sim-teaser'));
  const g = cv.getContext('2d');
  sim.classList.add('has-bay');

  let dpr = 1, cw = 1, ch = 1, phone = false;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); cw = cv.clientWidth; ch = cv.clientHeight; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); phone = innerWidth < 900; };

  // a tilted floor plane seen through a long lens
  const SC = () => phone ? Math.min(cw / 64, ch / 26) : Math.min(cw * .5 / 50, ch / 29);
  let yaw = -.34, tilt = .98, tyaw = yaw, ttilt = tilt;
  const P = (x, y, z = 0) => {
    const X = x - W / 2, Y = y - H / 2;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const rx = X * cy - Y * sy, ry = X * sy + Y * cy;
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const py = ry * ct - z * st, pz = ry * st + z * ct;
    const D = 120, f = D / (D + pz);
    const sc = SC();
    return [cw * (phone ? .5 : .71) + rx * f * sc, ch * (phone ? .6 : .52) + py * f * sc, f];
  };
  const path = (pts, z = 0) => { g.beginPath(); pts.forEach((p, i) => { const q = P(p[0], p[1], z); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); };
  const rect = (x, y, w, h, z = 0) => { path([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], z); };
  const box3 = (x, y, w, h, z, a) => {
    g.strokeStyle = `rgba(255,255,255,${.5 * a})`; rect(x, y, w, h, 0); g.stroke();
    g.strokeStyle = `rgba(255,255,255,${.75 * a})`; rect(x, y, w, h, z); g.stroke();
    g.strokeStyle = `rgba(255,255,255,${.28 * a})`; g.beginPath();
    [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].forEach(([u, v]) => { const a0 = P(u, v, 0), a1 = P(u, v, z); g.moveTo(a0[0], a0[1]); g.lineTo(a1[0], a1[1]); }); g.stroke();
    // shelf beams
    g.strokeStyle = `rgba(255,255,255,${.16 * a})`; for (let k = 1; k < 3; k++) { rect(x, y, w, h, z * k / 3); g.stroke(); }
  };

  let mode = 'carriers', prev = null, mix = 1, held = false, last = performance.now(), t = 0, cycleAt = 0, on = false;
  const show = (m) => {
    if (m === mode) return;
    prev = mode; mode = m; mix = 0;
    opts.forEach((o) => o.classList.toggle('sim-on', o.dataset.v === m));
  };
  opts.forEach((o) => {
    const go = () => { held = true; show(o.dataset.v); };
    o.addEventListener('pointerenter', go); o.addEventListener('focus', go);
    o.addEventListener('pointerleave', () => { held = false; cycleAt = t + 2.4; });
    o.addEventListener('blur', () => { held = false; cycleAt = t + 2.4; });
  });
  opts.forEach((o) => o.classList.toggle('sim-on', o.dataset.v === mode));
  card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); const u = (e.clientX - r.left) / r.width - .5, v = (e.clientY - r.top) / r.height - .5; tyaw = -.34 + u * .12; ttilt = .98 - v * .08; }, { passive: true });
  card.addEventListener('pointerleave', () => { tyaw = -.34; ttilt = .98; });

  const drawMode = (key, a, time) => {
    if (a <= .002) return;
    const M = MODES[key];
    // routes: a fine dashed line that flows the way work moves
    g.lineWidth = 1.4; g.setLineDash([2, 5]); g.lineDashOffset = -time * 14;
    g.strokeStyle = `rgba(190,222,255,${.85 * a})`;
    M.routes.forEach((r) => { path(r); g.stroke(); });
    g.setLineDash([]); g.lineDashOffset = 0;
    // the place where one waits: an amber ring that fills with the wait
    const [wx, wy] = M.wait; const wc = P(wx, wy);
    const wk = (time % 5.5) / 5.5, fill = ease(clamp(wk / .8));
    const sc = SC();
    const R = 1.6 * sc * wc[2];
    g.save(); g.translate(wc[0], wc[1]); g.scale(1, Math.cos(tilt) * .9 + .1);
    g.strokeStyle = `rgba(255,190,90,${.28 * a})`; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = `rgba(255,176,32,${.95 * a})`; g.lineWidth = 2.2; g.beginPath(); g.arc(0, 0, R, -Math.PI / 2, -Math.PI / 2 + fill * Math.PI * 2); g.stroke();
    g.restore();
    // a waiting mover sits in the ring
    glyph(M.glyph, wx, wy, 0, a, true);
    // movers: evenly spaced along the routes, each with its tag lit
    M.routes.forEach((r, ri) => {
      const L = polyLen(r), n = Math.max(1, Math.round(M.n / M.routes.length));
      for (let i = 0; i < n; i++) {
        const closed = r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1];
        let d = time * M.speed + (i / n) * L + ri * 7;
        d = closed ? d % L : d % (L + 6);
        if (d > L) continue;
        const [x, y, ang] = along(r, d);
        const fade = closed ? 1 : clamp(d / 3) * clamp((L - d) / 3);
        glyph(M.glyph, x, y, ang, a * fade, false);
      }
    });
  };
  // plan symbols, not pictures of products
  const glyph = (kind, x, y, ang, a, waiting) => {
    const c = Math.cos(ang), s = Math.sin(ang);
    const shape = (pts) => { path(pts.map(([u, v]) => [x + u * c - v * s, y + u * s + v * c])); };
    g.lineWidth = 1.4; g.strokeStyle = `rgba(255,255,255,${.95 * a})`; g.fillStyle = `rgba(255,255,255,${.16 * a})`;
    if (kind === 'box') { shape([[-1, -.7], [1, -.7], [1, .7], [-1, .7], [-1, -.7]]); g.fill(); g.stroke(); }
    else if (kind === 'dia') { shape([[0, -.8], [.8, 0], [0, .8], [-.8, 0], [0, -.8]]); g.fill(); g.stroke(); }
    else if (kind === 'fork') { shape([[-1.6, -.9], [.8, -.9], [.8, .9], [-1.6, .9], [-1.6, -.9]]); g.fill(); g.stroke(); shape([[.8, -.5], [2.2, -.5]]); g.stroke(); shape([[.8, .5], [2.2, .5]]); g.stroke(); }
    else if (kind === 'ring') { const q = P(x, y); g.save(); g.translate(q[0], q[1]); g.scale(1, .55); g.beginPath(); g.arc(0, 0, 7 * q[2], 0, Math.PI * 2); g.restore(); g.fill(); g.stroke(); }
    else if (kind === 'pal') { shape([[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1], [-1.1, -1.1]]); g.fill(); g.stroke(); shape([[-1.1, 0], [1.1, 0]]); g.stroke(); }
    // its tag: a point of light just above, blue while it moves, amber while it waits
    const q = P(x, y, 1.1);
    const col = waiting ? '255,176,32' : '160,210,255';
    const r = 9 * q[2];
    const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], r);
    gr.addColorStop(0, `rgba(${col},${.9 * a})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], r, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.arc(q[0], q[1], 1.6, 0, Math.PI * 2); g.fill();
  };

  const frame = (now) => {
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += reduce ? 0 : dt;
    if (!held && t > cycleAt && !reduce) { cycleAt = t + 3.6; if (t > 3) show(ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]); }
    mix = Math.min(1, mix + dt * 2.2);
    yaw += (tyaw - yaw) * .06; tilt += (ttilt - tilt) * .06;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cw, ch);
    g.lineCap = 'round'; g.lineJoin = 'round';

    // the slab: outline, a 2 m grid that fades away from the light, columns every 8 m
    const slab = [[0, 0], [W, 0], [W, H], [0, H], [0, 0]];
    path(slab); g.fillStyle = 'rgba(255,255,255,.045)'; g.fill();
    g.lineWidth = 1; g.strokeStyle = 'rgba(255,255,255,.55)'; path(slab); g.stroke();
    g.lineWidth = .6;
    for (let x = 2; x < W; x += 2) { g.strokeStyle = `rgba(255,255,255,${x % 8 ? .06 : .12})`; path([[x, 0], [x, H]]); g.stroke(); }
    for (let y = 2; y < H; y += 2) { g.strokeStyle = `rgba(255,255,255,${y % 8 ? .06 : .12})`; path([[0, y], [W, y]]); g.stroke(); }
    // a sweep of light crossing the floor, like a scan
    const sx = ((t * .09) % 1.4 - .2) * W;
    g.save(); path(slab); g.clip();
    const a0 = P(sx - 6, H / 2), a1 = P(sx + 6, H / 2);
    const lg = g.createLinearGradient(a0[0], a0[1], a1[0], a1[1]);
    lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, 'rgba(200,225,255,.16)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = lg; g.fillRect(0, 0, cw, ch); g.restore();

    // zones: line-side, the buffer, the dock
    g.lineWidth = 1; g.setLineDash([3, 4]);
    g.strokeStyle = 'rgba(255,255,255,.4)'; rect(...LINE); g.stroke(); rect(...DOCK); g.stroke();
    g.strokeStyle = 'rgba(255,190,90,.55)'; rect(...BUF); g.stroke(); g.setLineDash([]);
    STATIONS.forEach(([x, y]) => { g.strokeStyle = 'rgba(255,255,255,.45)'; rect(x - 1.6, y - .9, 3.2, 1.8, .9); g.stroke(); });
    // racking, in three dimensions
    g.lineWidth = 1; RACKS.forEach((r) => box3(r[0], r[1], r[2], r[3], 3.2, 1));
    // anchors on the columns, high up, where a plan would put them
    for (let x = 0; x <= W; x += 16) for (let y = 0; y <= H; y += H) {
      const b = P(x, y, 0), u = P(x, y, 6);
      g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 1; g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(u[0], u[1]); g.stroke();
      const pul = (t * .55 + x * .013 + y * .02) % 1;
      g.strokeStyle = `rgba(160,210,255,${.5 * (1 - pul)})`; g.beginPath(); g.save(); g.translate(u[0], u[1]); g.scale(1, .5); g.arc(0, 0, 3 + pul * 14 * u[2], 0, Math.PI * 2); g.restore(); g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(u[0], u[1], 2.2, 0, Math.PI * 2); g.fill();
    }

    if (prev && mix < 1) drawMode(prev, 1 - ease(mix), t);
    drawMode(mode, ease(mix), t);
    if (on && !reduce) requestAnimationFrame(frame);
  };
  size(); addEventListener('resize', () => { size(); if (!on || reduce) requestAnimationFrame(frame); });
  new ResizeObserver(() => { size(); }).observe(cv);
  new IntersectionObserver((es) => { const was = on; on = es[0].isIntersecting; if (on && !was) { last = performance.now(); requestAnimationFrame(frame); } }, { rootMargin: '100px 0px' }).observe(cv);
  requestAnimationFrame(frame);
}
