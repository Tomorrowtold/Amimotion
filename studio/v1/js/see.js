// "Can you see it?" : one floor, four scrolls. The scroll position is the only clock: scroll back and everything runs backwards.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const $ = s => root.querySelector(s), NS = 'http://www.w3.org/2000/svg';
  const stage = $('.see-stage'), box = $('.see-box'), svg = $('.see-ov'), cv = $('.see-rise'), tip = $('.see-tip'), tagEl = $('.see-tag');
  const words = [...root.querySelectorAll('.see-w')], ticks = [...root.querySelectorAll('.see-ticks i')], q = $('.see-q');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tall = matchMedia('(max-aspect-ratio: 4/5)');
  const base = root.dataset.assets || 'assets/see/';
  const ctx = cv.getContext('2d');
  let V, D, W, H, frames = [], els = null, cur = 0, want = 0, shown = -1, drawn = -1, raf = 0, near = false, typed = 0, typeT = 0, hero = [.5, .5], geo = null;

  const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const ease = t => t * t * (3 - 2 * t);
  const mk = (n, a, parent) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (parent || svg).appendChild(e); return e; };

  // the pull-back comes first: the hero's tag is on a trolley, the trolley is on this floor. Then the timeline, as fractions of what is left.
  const PULL = root.hasAttribute('data-pull') ? .13 : 0, Z0 = 14;   // parked: off unless the section carries data-pull
  const rest = v => (v - PULL) / (1 - PULL);
  const T = { dip: [.10, .24], pts: [.25, .36], trail: [.45, .57], amber: [.50, .60], rise: [.68, .89], ans: [.905, .95] };
  const SHOW = [[-.02, .09], [.33, .455], [.575, .675], [.9, 2]];

  async function load() {
    V = tall.matches ? 'P' : 'L'; W = V === 'P' ? 900 : 1600; H = V === 'P' ? 1600 : 900;
    D = await (await fetch(base + V + '/data.json')).json();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.textContent = ''; frames = []; drawn = -1;
    cv.width = D.frame[0]; cv.height = D.frame[1];
    const defs = mk('defs', {});   // soft glows as gradients: no filters, so nothing is re-blurred while the camera rises
    for (const [id, c] of [['see-gb', '102,165,250'], ['see-ga', '240,164,58']]) { const g = mk('radialGradient', { id }, defs); [[0, .9], [.35, .42], [1, 0]].forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': `rgba(${c},${a})` }, g)); }
    const gT = mk('g', {}), gZ = mk('g', {}), gP = mk('g', {});
    const A = D.eye.anchors, wave = t => Math.min(...A.map(a => Math.hypot((a[0] - t.xy[0]) * W, (a[1] - t.xy[1]) * H)));
    const order = D.eye.tags.map(wave), far = Math.max(...order);
    els = {
      trails: Object.keys(D.eye.paths).map(k => ({ k, g: mk('polyline', { class: 'trg', pathLength: 1, 'stroke-dasharray': 1 }, gT), l: mk('polyline', { class: 'tr', pathLength: 1, 'stroke-dasharray': 1 }, gT) })),
      zones: Object.keys(D.zones).map(k => { const e = mk('text', { class: 'zone' }, gZ); e.textContent = k; return { k, e }; }),
      tags: D.eye.tags.map((t, i) => {
        const g = mk('g', {}, gP), wait = t.state === 'wait', hero = t.mins === 42;
        const o = { t, g, at: order[i] / far, wait, hero, pg: mk('circle', { class: 'pg', r: 24 }, g), pc: mk('circle', { class: 'pc', r: 3.6 }, g) };
        if (wait) {
          o.ag = mk('circle', { class: 'ag', r: hero ? 58 : 38 }, g); o.ac = mk('circle', { class: 'ac', r: hero ? 7 : 5 }, g);
          const flip = V === 'P' && t.xy[0] > .6; o.tx = mk('text', { class: 'mins' + (hero ? ' hero' : '') + (flip ? ' flip' : ''), x: (hero ? 16 : 12) * (flip ? -1 : 1), y: hero ? 8 : 6 }, g); o.tx.textContent = t.mins + ' min';
          if (hero) o.lock = mk('path', { class: 'lock', d: 'M-22-12v-10h10M12-22h10v10M22 12v10h-10M-12 22h-10v-10' }, g);
        }
        return o;
      })
    };
    const hi = D.eye.tags.findIndex(t => t.mins === 42), top = D.rise[D.rise.length - 1].tags[hi];
    root.style.setProperty('--hx', top[0] * 100 + '%'); root.style.setProperty('--hy', top[1] * 100 + '%');
    hero = D.eye.tags[hi].xy; box.style.transformOrigin = `${hero[0] * 100}% ${hero[1] * 100}%`; size();
    shown = -1; paint(true);
  }

  // where the box sits when nothing moves it, and where the hero's tag sits: the pull-back joins the two
  function size() {
    const sw = stage.clientWidth, sh = stage.clientHeight, bw = box.offsetWidth, bh = box.offsetHeight, P = V === 'P';
    const ax = P ? .5 : .62, ay = P ? .42 : .47;
    geo = { dx: ax * sw - ((P ? sw - bw : (sw - bw) / 2) + hero[0] * bw), dy: ay * sh - ((sh - bh) / 2 + hero[1] * bh) };
    root.style.setProperty('--ax', ax * 100 + '%'); root.style.setProperty('--ay', ay * 100 + '%');
  }

  function preload() {            // the rise frames, only once the section is close
    if (frames.length || !D) return;
    for (let i = 0; i < D.rise.length; i++) { const im = new Image(); im.decoding = 'async'; im.src = `${base}${V}/rise/${String(i).padStart(2, '0')}.webp`; im.onload = () => { if (i === drawn) { drawn = -1; paint(true); } }; frames.push(im); }
  }

  function paint(force) {
    if (!els) return;
    const s = root.style, pull = PULL ? seg(cur, 0, PULL) : 1, p = rest(cur), w = rest(want);
    if (geo && PULL) {
      const e = ease(pull), z = Math.pow(Z0, 1 - e), k = 1 - ease(seg(pull, 0, .92));
      box.style.scale = pull < 1 ? z.toFixed(4) : ''; box.style.translate = pull < 1 ? `${(geo.dx * k).toFixed(1)}px ${(geo.dy * k).toFixed(1)}px` : '';
      s.setProperty('--fog', (1 - ease(seg(pull, .22, .74))).toFixed(3)); s.setProperty('--lede', (1 - seg(pull, 0, .2)).toFixed(3));
      if (tagEl) { tagEl.style.scale = (z / Z0).toFixed(4); tagEl.style.translate = `calc(-50% + ${(geo.dx * (k - 1)).toFixed(1)}px) calc(-50% + ${(geo.dy * (k - 1)).toFixed(1)}px)`; tagEl.style.opacity = (1 - seg(pull, .5, .8)).toFixed(3); }
    }
    const dip = ease(seg(p, ...T.dip)), pts = seg(p, ...T.pts), tr = seg(p, ...T.trail), amb = ease(seg(p, ...T.amber)), rise = seg(p, ...T.rise), ans = ease(seg(p, ...T.ans));
    const f = Math.round(rise * (D.rise.length - 1)), mix = ease(seg(rise, 0, .1));
    s.setProperty('--dip', dip); s.setProperty('--blue', (ease(pts) * (1 - .5 * amb) * (1 - mix)).toFixed(3)); s.setProperty('--amb', (amb * (1 - mix)).toFixed(3));
    s.setProperty('--rise', mix.toFixed(3)); s.setProperty('--ans', ans.toFixed(3));
    root.classList.toggle('dark', dip > .5);
    if (rise > 0 && f !== drawn && frames[f] && frames[f].complete && frames[f].naturalWidth) { ctx.drawImage(frames[f], 0, 0, cv.width, cv.height); drawn = f; }
    // where things are on screen at this moment of the rise
    const F = rise > 0 ? D.rise[f] : null, at = (i) => F ? F.tags[i] : D.eye.tags[i].xy;
    els.tags.forEach((o, i) => {
      const xy = at(i), on = ease(seg(pts, o.at * .7, o.at * .7 + .3)), a = o.wait ? amb : 0;
      o.g.setAttribute('transform', `translate(${(xy[0] * W).toFixed(1)} ${(xy[1] * H).toFixed(1)})`);
      const quiet = 1 - ans * (o.hero ? 0 : .75);
      o.pg.style.opacity = .8 * on * (1 - a) * (1 - .45 * amb) * quiet; o.pc.style.opacity = on * (1 - a) * (1 - .35 * amb) * quiet;
      o.pc.setAttribute('r', (3.6 * (.6 + .4 * on)).toFixed(2));
      if (o.wait) { o.ag.style.opacity = .9 * a * quiet; o.ac.style.opacity = a * quiet; o.tx.style.opacity = ease(seg(amb, .5, 1)) * (o.hero ? 1 : 1 - ans); if (o.lock) o.lock.style.opacity = ans; }
    });
    els.trails.forEach((o, i) => {
      const pts2 = (F ? F.paths[o.k] : D.eye.paths[o.k]).map(q => (q[0] * W).toFixed(1) + ',' + (q[1] * H).toFixed(1)).join(' ');
      const d = 1 - ease(seg(tr, i * .06, i * .06 + .6)), op = (1 - .6 * ans);
      for (const e of [o.g, o.l]) { e.setAttribute('points', pts2); e.setAttribute('stroke-dashoffset', d); }
      o.l.style.opacity = .9 * op; o.g.style.opacity = .16 * op;
    });
    const last = D.rise[D.rise.length - 1];
    els.zones.forEach(o => { const xy = last.zones[o.k]; o.e.setAttribute('x', xy[0] * W); o.e.setAttribute('y', xy[1] * H); o.e.style.opacity = .9 * seg(rise, .92, 1) * (1 - .5 * ans); });
    // words: they switch on once the picture has settled, they are never scrubbed
    const step = SHOW.findIndex(r => w >= r[0] && w < r[1]);
    if (step !== shown || force) {
      shown = step; words.forEach((w, i) => w.classList.toggle('on', i === step));
      const k = w < .29 ? 0 : w < .52 ? 1 : w < .8 ? 2 : 3; ticks.forEach((t, i) => t.classList.toggle('on', i === k));
      clearTimeout(typeT); const w4 = words[3], text = q.dataset.q;
      if (step === 3) { if (calm) { q.textContent = text; w4.classList.add('told'); } else { typed = 0; q.textContent = ''; w4.classList.remove('told'); (function type() { q.textContent = text.slice(0, ++typed); typeT = setTimeout(typed < text.length ? type : () => w4.classList.add('told'), typed < text.length ? 34 : 380); })(); } }
      else { w4.classList.remove('told'); }
    }
  }

  function measure() {
    const r = root.getBoundingClientRect(), span = r.height - innerHeight;
    want = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    near = r.top < innerHeight * 2.5 && r.bottom > -innerHeight;
    if (near) preload();
    if (!raf && near) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    const d = want - cur; cur = calm || Math.abs(d) < .0004 ? want : cur + d * .16;
    paint();
    if (cur !== want) raf = requestAnimationFrame(tick);
  }

  // a point says what it is when the cursor or a finger comes near
  function hover(ev) {
    const c = rest(cur); if (!els || c < T.pts[1] || c > T.rise[0]) return tip.classList.remove('on');
    const b = box.getBoundingClientRect(); let best = null, bd = 34;
    els.tags.forEach(o => { const x = b.left + o.t.xy[0] * b.width, y = b.top + o.t.xy[1] * b.height, d = Math.hypot(ev.clientX - x, ev.clientY - y); if (d < bd) { bd = d; best = [o, x, y]; } });
    if (!best) return tip.classList.remove('on');
    const s = stage.getBoundingClientRect(); tip.textContent = best[0].t.kind + (best[0].wait && c > T.amber[1] ? ', waiting ' + best[0].t.mins + ' min' : '');
    tip.style.transform = `translate(${Math.round(best[1] - s.left + 14)}px,${Math.round(best[2] - s.top - 34)}px)`; tip.classList.add('on');
  }

  root.classList.add('live');
  load().then(() => { measure(); cur = want; paint(true); });
  addEventListener('scroll', measure, { passive: true }); addEventListener('resize', () => { if (els) size(); measure(); paint(); });
  tall.addEventListener('change', () => load().then(measure));
  stage.addEventListener('pointermove', hover); stage.addEventListener('pointerdown', hover); stage.addEventListener('pointerleave', () => tip.classList.remove('on'));
})();
