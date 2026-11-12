// "Can you see it?" : one floor, four scrolls. The scroll position is the only clock: scroll back and everything runs backwards.
// With data-pull on the section it opens on the hero's tag and the camera backs away from it, through a white model of the plant
// that then turns real. Nothing here needs WebGL: pictures, two small canvases for the camera moves, and one SVG drawn over them.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const here = document.currentScript ? document.currentScript.src : '';
  const $ = s => root.querySelector(s), NS = 'http://www.w3.org/2000/svg';
  const stage = $('.see-stage'), box = $('.see-box'), svg = $('.see-ov'), cv = $('.see-rise'), pv = $('.see-pull'), tip = $('.see-tip'), sndBtn = $('.see-snd');
  const words = [...root.querySelectorAll('.see-w')], ticks = [...root.querySelectorAll('.see-ticks i')], q = $('.see-q');
  const lay = { dim: $('.see-dim'), blue: $('.see-blue'), amber: $('.see-amber'), vig: $('.see-vig') };
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tall = matchMedia('(max-aspect-ratio: 4/5)');
  const base = root.dataset.assets || 'assets/see/';
  const ctx = cv.getContext('2d'), pctx = pv ? pv.getContext('2d') : null;
  let V, D, W, H, frames = [], pframes = [], els = null, order = [], cur = 0, want = 0, shown = -1, drawn = -1, pdrawn = -1, raf = 0, near = false, typed = -1, seen = false;
  let hi = 0, px = 0, py = 0, tx = 0, ty = 0, vel = 0, guessed = 0, sound = null, was = null;

  const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const ease = t => t * t * (3 - 2 * t);
  const mk = (n, a, parent) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (parent || svg).appendChild(e); return e; };
  const pad = i => String(i).padStart(2, '0');
  // the page is only written to when a value has really changed, so a still frame costs nothing
  let memo = {};
  const V$ = (k, v) => { if (memo[k] !== v) { memo[k] = v; root.style.setProperty(k, v); } };
  const A$ = (e, k, v) => { const c = e._c || (e._c = {}); if (c[k] !== v) { c[k] = v; e.setAttribute(k, v); } };
  const L$ = (e, on) => { if (e && e._v !== on) { e._v = on; e.classList.toggle('see-off', !on); } };   // a layer that adds nothing leaves the picture
  const O$ = (e, v) => { v = Math.round(v * 200) / 200; if (e._o !== v) { e._o = v; e.style.opacity = v; } };

  // The pull-back takes the first fifth of the scroll when it is on. Everything after is a fraction of what is left.
  const PULL = pv && root.hasAttribute('data-pull') ? .2 : 0, FLY = .74;
  const rest = v => (v - PULL) / (1 - PULL);
  const T = { dip: [.07, .2], pts: [.17, .31], trail: [.43, .56], amber: [.47, .59], rise: [.66, .88], type: [.865, .925], ans: [.93, .965], push: [0, .66] };
  // each set of words: where it comes in (it plays once, by itself), and the stretch of scroll that carries it away
  const SHOW = [[-.01, .07, .12], [.2, .395, .45], [.5, .62, .67], [.855, 2, 3]];
  const PUSH = .07;

  // headlines come up word by word from behind their own baseline
  root.querySelectorAll('.see-h').forEach(h => {
    let i = 0; const wrap = (node, into) => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return into.append(' '); const o = document.createElement('span'), b = document.createElement('b'); o.className = 'wd'; b.style.setProperty('--i', i++); b.textContent = t; o.append(b); into.append(o); });
      else { const c = n.cloneNode(false); into.append(c); wrap(n, c); }
    });
    const f = document.createDocumentFragment(); wrap(h, f); h.setAttribute('aria-label', h.textContent); h.textContent = ''; h.append(f); h.nextElementSibling && h.nextElementSibling.style.setProperty('--i', i);
  });

  const image = (src, done) => { const im = new Image(); im.decoding = 'async'; im.src = src; (im.decode ? im.decode() : Promise.reject()).then(done, () => { im.complete ? done() : (im.onload = done); }); return im; };
  const ready = im => im && im.complete && im.naturalWidth;

  async function load() {
    V = tall.matches ? 'P' : 'L'; W = V === 'P' ? 900 : 1600; H = V === 'P' ? 1600 : 900;
    D = await (await fetch(base + V + '/data.json')).json();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.textContent = ''; frames = []; pframes = []; drawn = pdrawn = -1; memo = {};
    cv.width = D.frame[0]; cv.height = D.frame[1]; if (pv) { pv.width = D.frame[0]; pv.height = D.frame[1]; }
    const defs = mk('defs', {});   // soft glows as gradients: no filters, so nothing is re-blurred while the camera rises
    for (const [id, c] of [['see-gb', '102,165,250'], ['see-ga', '240,164,58'], ['see-gw', '255,236,205'], ['see-gh', '255,248,236'], ['see-gr', '214,64,48']]) { const g = mk('radialGradient', { id }, defs); (id === 'see-gw' ? [[0, .62], [.45, .34], [.8, .08], [1, 0]] : id === 'see-gh' ? [[0, .95], [.45, .55], [.8, .14], [1, 0]] : id === 'see-gr' ? [[0, .7], [.45, .3], [.8, .06], [1, 0]] : [[0, .9], [.35, .42], [1, 0]]).forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': `rgba(${c},${a})` }, g)); }
    for (const [id, c] of [['see-gbeam', '255,240,214'], ['see-gbeam-a', '246,178,80']]) { const g = mk('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); [[0, 0], [.55, .05], [.9, .2], [1, .26]].forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': `rgba(${c},${a})` }, g)); }
    const gK = mk('g', { class: 'pk' }), gT = mk('g', {}), gZ = mk('g', {}), gP = mk('g', { class: 'pts' });
    const A = D.eye.anchors, wave = t => Math.min(...A.map(a => Math.hypot((a[0] - t.xy[0]) * W, (a[1] - t.xy[1]) * H)));
    const dist = D.eye.tags.map(wave), far = Math.max(...dist);
    els = {
      trails: Object.keys(D.eye.paths).map(k => ({ k, g: mk('polyline', { class: 'trg', pathLength: 1, 'stroke-dasharray': 1 }, gT), l: mk('polyline', { class: 'tr', pathLength: 1, 'stroke-dasharray': 1 }, gT), h: mk('circle', { class: 'trh', r: 3 }, gT) })),
      zones: Object.keys(D.zones).map(k => { const e = mk('text', { class: 'zone' }, gZ); e.textContent = k; return { k, e }; }),
      tags: D.eye.tags.map((t, i) => {
        const g = mk('g', {}, gP), wait = t.state === 'wait', hero = t.mins === 42;
        const o = { t, g, i, at: dist[i] / far, wait, hero, shown: -1, pg: mk('circle', { class: 'pg', r: 24 }, g), pc: mk('circle', { class: 'pc', r: 3.6 }, g) };
        if (wait) {
          o.ag = mk('circle', { class: 'ag', r: hero ? 58 : 38 }, g); o.ac = mk('circle', { class: 'ac', r: hero ? 7 : 5 }, g);
          const flip = V === 'P' && t.xy[0] > .6; o.tx = mk('text', { class: 'mins' + (hero ? ' mins-big' : '') + (flip ? ' flip' : ''), x: (hero ? 16 : 12) * (flip ? -1 : 1), y: hero ? 8 : 6 }, g);
          if (hero) o.lock = mk('path', { class: 'lock', d: 'M-22-12v-10h10M12-22h10v10M22 12v10h-10M-12 22h-10v-10' }, g);
        }
        return o;
      })
    };
    order = [...els.tags].sort((a, b) => a.at - b.at);
    // scroll 1: a pool of light on every trolley, larger where the floor is nearer; a ring and its minutes arrive when one is picked.
    // What has been picked is kept by the trolley's id, so turning the phone (which redraws all of this) loses nothing.
    els.tags.forEach((o, i) => {
      if (o.t.kind !== 'Trolley') return; const [x, y] = o.t.xy, k = .62 + .76 * y, flip = x > (V === 'P' ? .6 : .72);
      const g = mk('g', { transform: `translate(${(x * W).toFixed(1)} ${(y * H).toFixed(1)})` }, gK);
      const top = -(y * H) + H * .03; mk('polygon', { class: 'pk-beam', points: `${-10 * k},${top} ${10 * k},${top} ${70 * k},${26 * k} ${-70 * k},${26 * k}` }, g);
      mk('ellipse', { class: 'pk-pool', cx: 0, cy: (26 * k).toFixed(1), rx: (78 * k).toFixed(1), ry: (52 * k).toFixed(1) }, g);
      mk('circle', { class: 'pk-ring', cy: (20 * k).toFixed(1), r: (38 * k).toFixed(1) }, g); mk('circle', { class: 'pk-dot', r: 2.6 }, g);
      const l = mk('text', { class: 'pk-l', x: (38 * k + 12) * (flip ? -1 : 1), y: (20 * k + 6).toFixed(1), 'text-anchor': flip ? 'end' : 'start' }, g);
      o.pk = g; o.pl = l; const was = picked[o.t.id];
      g.style.setProperty('--w', (y * 1.3).toFixed(2)); if (was) { g.classList.add(was, 'lit'); l.textContent = was === 'yes' ? '42 min' : ago(o) + ' min'; }
    });
    hot = null; if (armed) requestAnimationFrame(() => { litIds.clear(); game = new Set(inView().map(o => o.t.id)); els.tags.forEach(o => { if (o.pk) o.pk.classList.toggle('lit', game.has(o.t.id) || !!picked[o.t.id]); if (game.has(o.t.id)) litIds.add(o.t.id); }); spots(); buildKeys(); declash(); });
    hi = D.eye.tags.findIndex(t => t.mins === 42); const hero = D.eye.tags[hi].xy; box.style.transformOrigin = `${hero[0] * 100}% ${hero[1] * 100}%`;
    if (PULL) for (let i = 0; i <= D.pull; i++) pframes.push(image(`${base}${V}/pull/${pad(i)}.webp`, () => { if (pdrawn < 0 || i === Math.round(seg(cur, 0, PULL * FLY) * D.pull)) { pdrawn = -1; paint(true); } }));
    shown = -1; paint(true);
  }

  function preload() {            // the rise frames, only once the section is close
    if (frames.length || !D) return;
    for (let i = 0; i < D.rise.length; i++) frames.push(image(`${base}${V}/rise/${pad(i)}.webp`, () => { if (i === drawn) { drawn = -1; paint(true); } }));
  }

  function paint(force) {
    if (!els) return;
    const pull = PULL ? seg(cur, 0, PULL) : 1, p = rest(cur), w = rest(want);
    const fly = seg(pull, 0, FLY), real = PULL ? ease(seg(pull, FLY, 1)) : 1;
    if (PULL) {   // the camera backs away from the hero's tag; then the real floor spreads out from that tag
      const f = Math.round(fly * D.pull);
      if (f !== pdrawn && ready(pframes[f])) { pctx.drawImage(pframes[f], 0, 0, pv.width, pv.height); pdrawn = f; }
      V$('--rr', (real * 190).toFixed(1) + '%'); V$('--in', seg(pull, .84, 1).toFixed(3)); V$('--lede', (1 - seg(pull, 0, .09)).toFixed(3));
      pv.style.visibility = real >= 1 ? 'hidden' : 'visible';
    }
    if (!calm) {   // depth: the camera never quite stops. It drifts in on the floor until it lifts off, and leans a hair with the cursor
      const z = 1 + PUSH * (1 - ease(seg(p, ...T.push))), k = (z - 1) / PUSH * (PULL ? real : 1);
      box.style.scale = z > 1.0005 ? z.toFixed(4) : ''; box.style.translate = k > .01 ? `${(-px * 9 * k).toFixed(1)}px ${(-py * 6 * k).toFixed(1)}px` : '';
      V$('--wx', (px * 4 * k).toFixed(1) + 'px');
    }
    const dip = seg(p, ...T.dip), pts = seg(p, ...T.pts), tr = seg(p, ...T.trail), amb = ease(seg(p, ...T.amber)), rise = seg(p, ...T.rise), ans = ease(seg(p, ...T.ans));
    const f = Math.round(rise * (D.rise.length - 1)), mix = ease(seg(rise, 0, .1));
    V$('--dip', ease(dip).toFixed(3)); V$('--m0', (dip * 160 - 60).toFixed(1) + '%'); V$('--m1', (dip * 160).toFixed(1) + '%');
    V$('--blue', (ease(pts) * (1 - .5 * amb) * (1 - mix)).toFixed(3)); V$('--amb', (amb * (1 - mix)).toFixed(3));
    V$('--rise', mix.toFixed(3)); V$('--ans', ans.toFixed(3));
    // a layer that adds nothing is taken out of the picture, so the browser has less to blend
    L$(lay.dim, dip > 0); L$(lay.blue, pts > 0 && mix < 1); L$(lay.amber, amb > 0 && mix < 1); L$(cv, mix > 0); L$(lay.vig, dip > 0);
    const glow = pts > 0 && mix < 1 && ans < 1; if (glow !== root._glow) { root._glow = glow; root.classList.toggle('see-glow', glow); }   // the points breathe only while you can see them
    if (rise > 0 && f !== drawn && ready(frames[f])) { ctx.drawImage(frames[f], 0, 0, cv.width, cv.height); drawn = f; }
    // where things are on screen at this moment of the rise
    const F = rise > 0 ? D.rise[f] : null, at = (i) => F ? F.tags[i] : D.eye.tags[i].xy;
    const hxy = at(hi); V$('--hx', (hxy[0] * 100).toFixed(2) + '%'); V$('--hy', (hxy[1] * 100).toFixed(2) + '%');
    V$('--spot', Math.max(.5 * ease(seg(amb, .5, 1)) * (1 - mix), ans).toFixed(3)); V$('--grid', (seg(rise, .8, 1) * (1 - .35 * ans)).toFixed(3));
    els.tags.forEach((o, i) => {
      const xy = at(i), on = ease(seg(pts, o.at * .7, o.at * .7 + .3)), a = o.wait ? amb : 0;
      const big = 1 + (.62 + .76 * D.eye.tags[i].xy[1] - 1) * (1 - ease(rise));   // near things are larger, until the view is from straight above
      A$(o.g, 'transform', `translate(${(xy[0] * W).toFixed(1)} ${(xy[1] * H).toFixed(1)}) scale(${big.toFixed(3)})`);
      const quiet = 1 - ans * (o.hero ? 0 : .6);
      O$(o.pg, .8 * on * (1 - a) * (1 - .45 * amb) * quiet); O$(o.pc, on * (1 - a) * (1 - .35 * amb) * quiet);
      A$(o.pc, 'r', (3.6 * (.6 + .4 * on)).toFixed(2));
      if (o.wait) {
        O$(o.ag, .9 * a * quiet); O$(o.ac, a * quiet); O$(o.tx, ease(seg(amb, .25, .7)) * (o.hero ? 1 : 1 - ans)); if (o.lock) O$(o.lock, ans);
        const m = Math.round(o.t.mins * ease(seg(amb, .25, 1))); if (m !== o.shown) { o.shown = m; o.tx.textContent = m + ' min'; }
      }
    });
    els.trails.forEach((o, i) => {
      const fk = F ? f : -1; if (o.fk !== fk) { o.fk = fk; o.len = 0; const pts2 = (F ? F.paths[o.k] : D.eye.paths[o.k]).map(q => (q[0] * W).toFixed(1) + ',' + (q[1] * H).toFixed(1)).join(' '); o.g.setAttribute('points', pts2); o.l.setAttribute('points', pts2); }
      const d = +(1 - ease(seg(tr, i * .06, i * .06 + .6))).toFixed(4), op = (1 - .6 * ans);
      A$(o.g, 'stroke-dashoffset', d); A$(o.l, 'stroke-dashoffset', d);
      O$(o.l, .9 * op); O$(o.g, .16 * op);
      const run = 1 - d; if (run > .001 && run < .999) { const L = o.len || (o.len = o.l.getTotalLength()), pt = o.l.getPointAtLength(L * run); o.h.setAttribute('cx', pt.x); o.h.setAttribute('cy', pt.y); O$(o.h, 1); } else O$(o.h, 0);
    });
    const last = D.rise[D.rise.length - 1];
    els.zones.forEach(o => { const xy = last.zones[o.k]; A$(o.e, 'x', xy[0] * W); A$(o.e, 'y', xy[1] * H); O$(o.e, .9 * seg(rise, .92, 1) * (1 - .5 * ans)); });
    // words come in on their own once you reach them; the scroll itself carries them away
    const step = SHOW.findIndex(r => w >= r[0] && w < r[2]);
    words.forEach((el, i) => { const r = SHOW[i], out = seg(p, r[1], r[2]); el.classList.toggle('on', i === step && (i > 0 || seen)); el.style.opacity = out > 0 ? (1 - out).toFixed(3) : ''; el.style.setProperty('--out', out.toFixed(3)); });
    if (step !== shown || force) { shown = step; const k = w < .14 ? 0 : w < .44 ? 1 : w < .7 ? 2 : 3; ticks.forEach((t, i) => t.classList.toggle('on', i === k)); }
    // scroll 1 is a question you can answer with a finger: it stays open until the lights go
    const ask = p >= -.01 && p < T.dip[0]; root.classList.toggle('see-ask', ask); if (ask && seen && !lit0 && root.getBoundingClientRect().top < innerHeight * .15) lightUp(); if (!ask && tip.classList.contains('say')) tip.classList.remove('on', 'say');
    const night = lit0 && p < T.dip[1]; if (night !== root._night) { root._night = night; root.classList.toggle('see-night', night); } V$('--hn', night ? (1 - ease(dip)).toFixed(3) : '0');
    // the question is typed by the scroll, and answered on the floor
    const text = q.dataset.q, n = calm ? text.length : Math.round(text.length * seg(p, ...T.type));
    if (n !== typed) { typed = n; q.textContent = text.slice(0, n); }
    const told = p >= T.ans[0] - .012; words[3].classList.toggle('told', told);
    // what the story is doing now, for the ear and the hand
    const lit = order.filter(o => pts > o.at * .7 + .12).length, waits = order.filter(o => o.wait && !o.hero && amb > .3 + .25 * (o.t.mins > 20));
    const st = { near, vel, fly, real, dip: Math.max(dip, night ? bankOff / 3 : 0), bank: Math.max(Math.min(3, Math.floor(dip * 3.2)), night ? bankOff : 0), lit, litAt: lit ? order[lit - 1].t.xy : null, amber: waits.length, amberAt: waits.length ? waits[waits.length - 1].t.xy : null, hero: amb > .8, heroAt: D.eye.tags[hi].xy, mins: els.tags[hi].shown, rise, typed: n, told, guess: guessed, pkLit, hotN, pickAt, bankOff };
    const p0 = was || st; was = st;
    if (!calm && navigator.vibrate) { const n = st.told && !p0.told ? 18 : st.hero && !p0.hero ? 14 : st.bank > p0.bank ? 10 : 0; if (n) try { navigator.vibrate(n); } catch (e) {} }
    if (sound) sound.hear(st);
  }

  function measure() {
    const r = root.getBoundingClientRect(), span = r.height - innerHeight;
    want = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    const wasNear = near; near = r.top < innerHeight * 2.5 && r.bottom > -innerHeight; root.classList.toggle('near', near);
    if (near !== wasNear) { if (near) fetchScore(); if (sound) paint(); idle(); } if (!seen && r.top < innerHeight * .5) { seen = true; shown = -1; }
    if (near && rest(want) > .2) preload();
    if (!raf && near) raf = requestAnimationFrame(tick);
  }
  // the picture follows the scroll with a little weight. Time-based, so it feels the same at 60, 90 or 120 frames a second
  let lastT = 0;
  function tick(now) {
    raf = 0; const dt = lastT ? Math.min(64, now - lastT) : 16.7; lastT = now; const k = 1 - Math.pow(1 - .16, dt / 16.7), kp = 1 - Math.pow(1 - .08, dt / 16.7);
    const d = want - cur; vel += (Math.abs(d) - vel) * .2; cur = calm || Math.abs(d) < .0004 ? want : cur + d * k;
    px += (tx - px) * kp; py += (ty - py) * kp;
    paint();
    if (cur !== want || Math.abs(tx - px) + Math.abs(ty - py) > .002 || (sound && vel > .0004)) raf = requestAnimationFrame(tick); else lastT = 0;
  }

  // the nearest thing of a kind to the cursor or finger, within reach
  function pick(ev, reach, kind, ok) {
    const b = ev._b || (ev._b = box.getBoundingClientRect()); let best = null, bd = reach;
    els.tags.forEach(o => { if ((kind && o.t.kind !== kind) || (ok && !ok(o))) return; const x = b.left + o.t.xy[0] * b.width, y = b.top + o.t.xy[1] * b.height, d = Math.hypot(ev.clientX - x, ev.clientY - y); if (d < bd) { bd = d; best = [o, x, y]; } });
    return best;
  }
  function say(best, text, cls) {
    const s = stage.getBoundingClientRect(); tip.textContent = text; tip.classList.toggle('say', !!cls); tip.classList.add('on');
    const x = Math.min(s.width - tip.offsetWidth - 12, Math.max(12, best[1] - s.left + 14)); tip.style.transform = `translate(${Math.round(x)}px,${Math.round(best[2] - s.top - 40)}px)`;
  }
  // a point says what it is when the cursor or a finger comes near
  function hover(ev) {
    const c = rest(cur); if (!els || tip.classList.contains('say')) return;
    if (c < T.pts[1] || c > T.rise[0]) return tip.classList.remove('on');
    const best = pick(ev, 34); if (!best) return tip.classList.remove('on');
    say(best, best[0].t.kind + (best[0].wait && c > T.amber[1] ? ', waiting ' + best[0].t.mins + ' min' : ''));
  }
  // Scroll 1 is a game with three picks. The hall's lights come down, the trolleys light up one by one, and the visitor
  // picks the one that has waited 42 minutes. Almost everyone misses, and every miss shows the point: they all look the same,
  // waiting cannot be seen. A hit (or the third miss, which shows the answer) carries the visitor straight into the next scene.
  // It can be played with a mouse, a finger or the keyboard (a hidden row of buttons, one per trolley in view).
  const sayEl = root.querySelector('.see-say'), lives = [...root.querySelectorAll('.see-lives i')], livesEl = root.querySelector('.see-lives'), keys = root.querySelector('.see-keys');
  const picked = {}, N_TRY = 3, litIds = new Set(), spot = root.querySelector('.see-spot');
  // which trolleys stand in light: an opening in the dark for each one that is on (a missed one goes dark; after the answer, only it stays lit)
  function spots() {
    if (!spot || !els) return;
    const m = els.tags.filter(o => o.pk && litIds.has(o.t.id) && picked[o.t.id] !== 'no' && (!found || o.hero)).map(o => { const k = .62 + .76 * o.t.xy[1]; return `radial-gradient(ellipse ${(88 * k / W * 100).toFixed(2)}% ${(62 * k / H * 100).toFixed(2)}% at ${(o.t.xy[0] * 100).toFixed(2)}% ${((o.t.xy[1] * H + 24 * k) / H * 100).toFixed(2)}%,#000 34%,transparent 100%)`; }).join(',') || 'linear-gradient(transparent,transparent)';
    spot.style.webkitMaskImage = m; spot.style.maskImage = m;
  }
  let tries = 0, found = false, hot = null, lit0 = false, armed = false, pkLit = 0, pickAt = null, hotN = 0, bankOff = 0, nudge = 0;
  const tell = html => { if (!sayEl) return; sayEl.classList.add('swap'); setTimeout(() => { sayEl.innerHTML = html; sayEl.classList.remove('swap'); }, 200); };
  function ago(o) { return o.t.mins && o.t.mins !== 42 ? o.t.mins : 2 + o.i * 7 % 9; }
  // only the trolleys the visitor can actually see are in the game (a phone shows fewer of them than a laptop)
  // (and not one the words sit on, nor T-02, which the photograph hides behind a column)
  const inView = () => { const b = box.getBoundingClientRect(), s = stage.getBoundingClientRect(), wr = words[0].getBoundingClientRect(), floor = Math.min(s.bottom - 14, (wr.height ? wr.top : s.bottom) - 18); return els.tags.filter(o => { if (!o.pk || o.t.id === 'T-02') return false; const x = b.left + o.t.xy[0] * b.width, y = b.top + o.t.xy[1] * b.height; return o.hero || (x > s.left + 14 && x < s.right - 14 && y > s.top + 70 && y < floor); }); };
  let game = new Set();
  const setHot = o => { if (o === hot) return; if (hot) hot.pk.classList.remove('hot'); hot = o; if (o) { o.pk.classList.add('hot'); hotN++; pickAt = o.t.xy; if (sound) paint(); } };
  function buildKeys() {
    if (!keys || !armed) return; keys.textContent = ''; const list = els.tags.filter(o => game.has(o.t.id)).sort((a, b) => a.t.xy[0] - b.t.xy[0]);
    list.forEach((o, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.textContent = `Trolley ${i + 1} of ${list.length}`; bt.disabled = found || !!picked[o.t.id]; bt.onfocus = () => setHot(found || picked[o.t.id] ? null : o); bt.onblur = () => setHot(null); bt.onclick = ev => { ev.stopPropagation(); choose(o); }; o.key = bt; keys.append(bt); });
  }
  function lightUp() {            // the hall's lights go off bank by bank, far to near; then the trolleys' lights come on, each with a note
    lit0 = true; const list = inView().sort((a, b) => a.t.xy[1] - b.t.xy[1]), t0 = calm ? 0 : 1500, gap = calm ? 0 : 90; game = new Set(list.map(o => o.t.id));
    [1, 2, 3].forEach(b => setTimeout(() => { root.classList.add('pk-b' + b); bankOff = b; if (sound) paint(); }, calm ? 0 : 200 + (b - 1) * 420));
    list.forEach((o, i) => setTimeout(() => { o.pk.classList.add('lit'); litIds.add(o.t.id); spots(); pkLit++; pickAt = o.t.xy; if (sound) paint(); }, t0 + i * gap));
    setTimeout(() => {
      armed = true; list.forEach(o => { o.pk.classList.add('lit'); litIds.add(o.t.id); }); spots(); root.classList.add('pk-ready'); buildKeys();
    }, t0 + list.length * gap + 120);
    setTimeout(() => {
      // nobody has picked yet: one slow wave of light across the trolleys says they can be
      nudge = setTimeout(() => { if (!tries && !found && root.classList.contains('see-ask')) { root.classList.add('pk-wave'); setTimeout(() => root.classList.remove('pk-wave'), 2600); } }, 6500);
    }, t0 + list.length * gap + 140);
  }
  const red = root.querySelector('.see-red');
  // straight on into scene 2: the lights go down and every tag comes on, played by a glide rather than the visitor's wheel
  function carryOn(delay) {
    setTimeout(() => {
      if (!root.classList.contains('see-ask') || document.hidden) return;   // the visitor has already moved on by themselves
      const span = root.offsetHeight - innerHeight, top = root.getBoundingClientRect().top + scrollY, to = Math.round(top + span * (PULL + (1 - PULL) * .3));
      if (scrollY >= to - 2) return; if (calm) return scrollTo(0, to);
      const from = scrollY, t0 = performance.now(), ms = 1900; let stop = false; const halt = () => { stop = true; off(); }, EV = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
      const off = () => EV.forEach(e => removeEventListener(e, halt)); EV.forEach(e => addEventListener(e, halt, { passive: true }));
      const e2 = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const step = now => { if (stop) return; const k = Math.min(1, (now - t0) / ms); scrollTo(0, from + (to - from) * e2(k)); if (k < 1) requestAnimationFrame(step); else off(); };
      requestAnimationFrame(step);
    }, delay);
  }
  // a miss's small label never sits under the answer's
  function declash() { if (!els || !found) return; const h = els.tags[hi], a = h.pl.getBoundingClientRect(); els.tags.forEach(o => { if (o === h || !o.pl || picked[o.t.id] !== 'no') return; const b = o.pl.getBoundingClientRect(); o.pk.classList.toggle('clash', b.left < a.right + 8 && b.right > a.left - 8 && b.top < a.bottom + 6 && b.bottom > a.top - 6); }); }
  function reveal(won) {
    found = true; const h = els.tags[hi]; picked[h.t.id] = 'yes'; h.pk.classList.remove('hot', 'no'); h.pk.classList.add('yes', 'lit'); h.pl.textContent = '42 min'; root.classList.add('see-found'); spots();
    requestAnimationFrame(declash);
    if (livesEl) livesEl.classList.toggle('won', won); guessed += won ? 100 : 50; pickAt = h.t.xy; setHot(null); paint();
    if (keys) keys.querySelectorAll('button').forEach(b => { b.disabled = true; });
    carryOn(won ? 1400 : 2400);
  }
  function choose(o) {
    if (!els || !armed || found || !o || !game.has(o.t.id) || picked[o.t.id] || !root.classList.contains('see-ask')) return;
    clearTimeout(nudge); const n = game.size; tries++;
    if (o.hero) { reveal(true); return tell(tries === 1 ? `That's the one. First pick, one chance in ${n}. <b>AmIMotion never needs the luck.</b>` : `That's the one, on pick ${tries}. On a real floor every pick is a walk. <b>AmIMotion never needs one.</b>`); }
    if (lives[tries - 1]) lives[tries - 1].classList.add('out');
    picked[o.t.id] = 'no'; guessed += 1; pickAt = o.t.xy; if (hot === o) setHot(null); o.pk.classList.add('no'); spots(); o.pl.textContent = ago(o) + ' min'; if (o.key) o.key.disabled = true;
    if (red && !calm) { red.classList.remove('on'); void red.offsetWidth; red.classList.add('on'); }
    if (tries >= N_TRY) { tell(`It was this one: <b>42 minutes, and it looked like all the rest.</b>`); paint(); return setTimeout(() => reveal(false), 500); }
    tell(tries === 1 ? `Not this one. It got here ${ago(o)} minutes ago. <b>They all look the same.</b>` : `Not this one either. <b>Your eyes can't see how long something has waited.</b>`);
    paint();
  }
  const under = ev => { if (!els || !armed || found || !root.classList.contains('see-ask')) return null; const b = pick(ev, ev.pointerType === 'touch' ? 64 : 80, 'Trolley', o => game.has(o.t.id) && !picked[o.t.id]); return b ? b[0] : null; };
  function guess(ev) { if (!ev.target.closest('.see-snd')) choose(under(ev)); }
  // under the cursor or the finger, a trolley's light comes up: it is the thing to pick
  function lift(ev) { setHot(under(ev)); }

  // Sound is on by default. No browser lets a page make a sound before the visitor's first tap, click or key (a scroll is not
  // enough), so the button says "Tap for sound" until then, and the very first touch anywhere starts it. The audio context is
  // made inside that touch (iPhones refuse one made later); the score itself is fetched as the section comes near.
  let muted = false, AC = null; try { muted = localStorage.getItem('see-mute') === '1'; } catch (e) {}
  const playing = () => !!(sound && AC && AC.state === 'running' && !muted);
  const label = () => { if (!sndBtn) return; const on = playing(); sndBtn.setAttribute('aria-pressed', on); sndBtn.classList.toggle('wait', !muted && !on); sndBtn.lastElementChild.textContent = muted ? 'Sound off' : on ? 'Sound on' : 'Tap for sound'; };
  let score = null;
  const fetchScore = () => score || (score = new Promise(res => { const sc = document.createElement('script'); sc.src = here.replace(/see\.js(\?.*)?$/, 'see-sound.js'); sc.onload = sc.onerror = res; document.head.append(sc); }));
  function start() {                 // only ever called inside a tap, click or key
    if (muted) return;
    if (AC) { if (AC.state !== 'running') AC.resume().then(label, label); return; }
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    try { const b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource(); s.buffer = b; s.connect(AC.destination); s.start(0); } catch (e) {}   // older iPhones unlock on a played sample
    AC.resume().then(label, label); AC.onstatechange = label;
    fetchScore().then(() => { try { sound = window.SeeSound(AC); sound.set(true); was = null; paint(); } catch (e) { sound = null; } label(); });
  }
  const gesture = ev => { if (ev.target && ev.target.closest && ev.target.closest('.see-snd')) return; if (!playing()) start(); };
  ['pointerdown', 'pointerup', 'touchend', 'keydown'].forEach(e => addEventListener(e, gesture, { passive: true, capture: true }));
  if (sndBtn) sndBtn.addEventListener('click', () => {
    if (playing()) { muted = true; sound.set(false); }
    else { muted = false; if (sound) sound.set(true); start(); }
    try { localStorage.setItem('see-mute', muted ? '1' : '0'); } catch (e) {} was = null; paint(); label();
  });
  // a hidden tab, or a page scrolled well away from the floor, is silent and costs nothing
  let nap = 0;
  const idle = () => { if (!AC) return; clearTimeout(nap); const away = document.hidden || !near; if (away) nap = setTimeout(() => { if (AC.state === 'running') AC.suspend(); }, 1500); else if (!muted && AC.state === 'suspended') AC.resume().then(label, label); };
  document.addEventListener('visibilitychange', idle);
  label();

  root.classList.add('live');
  // the floor's data waits for the hero: it is fetched when the section first shows, or once the page has loaded and gone quiet
  let booted = false;
  const boot = () => { if (booted) return; booted = true; load().then(() => { measure(); cur = want; paint(true); }); };
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(e => { if (e.some(x => x.isIntersecting)) { io.disconnect(); boot(); } }, { rootMargin: '0px' }); io.observe(root); } else boot();
  const later = () => (window.requestIdleCallback || setTimeout)(boot, { timeout: 1200 });
  if (document.readyState === 'complete') later(); else addEventListener('load', later, { once: true });
  addEventListener('scroll', measure, { passive: true }); addEventListener('resize', () => { measure(); paint(); });
  tall.addEventListener('change', () => { if (booted) load().then(measure); });
  stage.addEventListener('pointerdown', lift); ['pointerup', 'pointercancel', 'pointerleave'].forEach(e => stage.addEventListener(e, ev => { if (ev.pointerType !== 'mouse' || e === 'pointerleave') setTimeout(() => setHot(null), 260); }));
  stage.addEventListener('pointermove', ev => { hover(ev); lift(ev); if (ev.pointerType === 'mouse') { tx = ev.clientX / innerWidth - .5; ty = ev.clientY / innerHeight - .5; if (!raf) raf = requestAnimationFrame(tick); } });
  stage.addEventListener('click', guess); stage.addEventListener('pointerleave', () => { if (!tip.classList.contains('say')) tip.classList.remove('on'); });
})();
