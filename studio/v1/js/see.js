// "Can you see it?" : one floor, four scrolls. The scroll position is the only clock: scroll back and everything runs backwards.
// With data-pull on the section it opens on the hero's tag and the camera backs away from it, through a white model of the plant
// that then turns real. Nothing here needs WebGL: pictures, two small canvases for the camera moves, and one SVG drawn over them.
(() => {
  const root = document.getElementById('see'); if (!root) return;
  const here = document.currentScript ? document.currentScript.src : '';
  const $ = s => root.querySelector(s), NS = 'http://www.w3.org/2000/svg';
  const stage = $('.see-stage'), box = $('.see-box'), svg = $('.see-ov'), cv = $('.see-rise'), pv = $('.see-pull'), tip = $('.see-tip');
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
  const L$ = () => {};
  const O$ = (e, v) => { v = Math.round(v * 200) / 200; if (e._o !== v) { e._o = v; e.style.opacity = v; } };

  // The pull-back takes the first fifth of the scroll when it is on. Everything after is a fraction of what is left.
  const PULL = pv && root.hasAttribute('data-pull') ? .2 : 0, FLY = .74;
  const rest = v => (v - PULL) / (1 - PULL);
  const T = { dip: [.05, .19], pts: [.17, .31], trail: [.43, .56], amber: [.47, .59], rise: [.66, .88], type: [.865, .925], ans: [.93, .965], push: [0, .66] };
  // each set of words: where it comes in (it plays once, by itself), and the stretch of scroll that carries it away
  const SHOW = [[-.01, .05, .105], [.2, .395, .45], [.5, .62, .67], [.855, 2, 3]];
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
    for (const [id, c] of [['see-gb', '102,165,250'], ['see-ga', '240,164,58']]) { const g = mk('radialGradient', { id }, defs); [[0, .9], [.35, .42], [1, 0]].forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': `rgba(${c},${a})` }, g)); }
    const gT = mk('g', {}), gZ = mk('g', {}), gP = mk('g', { class: 'pts' });
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
    const ask = p >= -.01 && p < T.dip[0]; root.classList.toggle('see-ask', ask); if (!ask && tip.classList.contains('say')) tip.classList.remove('on', 'say');
    // the question is typed by the scroll, and answered on the floor
    const text = q.dataset.q, n = calm ? text.length : Math.round(text.length * seg(p, ...T.type));
    if (n !== typed) { typed = n; q.textContent = text.slice(0, n); }
    const told = p >= T.ans[0] - .012; words[3].classList.toggle('told', told);
    // what the story is doing now, for the ear and the hand
    const lit = order.filter(o => pts > o.at * .7 + .12).length, waits = order.filter(o => o.wait && !o.hero && amb > .3 + .25 * (o.t.mins > 20));
    const st = { near, vel, fly, real, dip, bank: Math.min(3, Math.floor(dip * 3.2)), lit, litAt: lit ? order[lit - 1].t.xy : null, amber: waits.length, amberAt: waits.length ? waits[waits.length - 1].t.xy : null, hero: amb > .8, heroAt: D.eye.tags[hi].xy, mins: els.tags[hi].shown, rise, typed: n, told, guess: guessed };
    const p0 = was || st; was = st;
    if (!calm && navigator.vibrate) { const n = st.told && !p0.told ? 18 : st.hero && !p0.hero ? 14 : st.bank > p0.bank ? 10 : 0; if (n) try { navigator.vibrate(n); } catch (e) {} }
    if (sound) sound.hear(st);
  }

  function measure() {
    const r = root.getBoundingClientRect(), span = r.height - innerHeight;
    want = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    near = r.top < innerHeight * 2.5 && r.bottom > -innerHeight; root.classList.toggle('near', near); if (!seen && r.top < innerHeight * .5) { seen = true; shown = -1; }
    if (near && rest(want) > .2) preload();
    if (!raf && near) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    const d = want - cur; vel += (Math.abs(d) - vel) * .2; cur = calm || Math.abs(d) < .0004 ? want : cur + d * .16;
    px += (tx - px) * .08; py += (ty - py) * .08;
    paint();
    if (cur !== want || Math.abs(tx - px) + Math.abs(ty - py) > .002 || (sound && vel > .0004)) raf = requestAnimationFrame(tick);
  }

  // the nearest thing of a kind to the cursor or finger, within reach
  function pick(ev, reach, kind) {
    const b = box.getBoundingClientRect(); let best = null, bd = reach;
    els.tags.forEach(o => { if (kind && o.t.kind !== kind) return; const x = b.left + o.t.xy[0] * b.width, y = b.top + o.t.xy[1] * b.height, d = Math.hypot(ev.clientX - x, ev.clientY - y); if (d < bd) { bd = d; best = [o, x, y]; } });
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
  // scroll 1: the visitor guesses. Almost everyone is wrong, which is the point.
  function guess(ev) {
    if (!els || !root.classList.contains('see-ask') ) return;
    const best = pick(ev, 70, 'Trolley'); if (!best) return;
    const n = els.tags.filter(o => o.t.kind === 'Trolley').length; guessed += best[0].hero ? 100 : 1;
    say(best, best[0].hero ? `Yes, this one. A lucky guess: one in ${n}.` : `Not this one. It got here ${2 + best[0].i * 7 % 9} minutes ago.`, true); paint();
  }

  // No sound on the site (founders' rule; Shiv, 12 Nov): the score in see-sound.js is never fetched.

  root.classList.add('live');
  load().then(() => { measure(); cur = want; paint(true); });
  addEventListener('scroll', measure, { passive: true }); addEventListener('resize', () => { measure(); paint(); });
  tall.addEventListener('change', () => load().then(measure));
  stage.addEventListener('pointermove', ev => { hover(ev); if (ev.pointerType === 'mouse') { tx = ev.clientX / innerWidth - .5; ty = ev.clientY / innerHeight - .5; if (!raf) raf = requestAnimationFrame(tick); } });
  stage.addEventListener('click', guess); stage.addEventListener('pointerleave', () => { if (!tip.classList.contains('say')) tip.classList.remove('on'); });
})();
