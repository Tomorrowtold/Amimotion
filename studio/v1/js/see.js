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
  let V, D, W, H, frames = [], els = null, cur = 0, want = 0, shown = -1, drawn = -1, raf = 0, near = false, typed = -1, seen = false, hero = [.5, .5], hi = 0, geo = null, px = 0, py = 0, tx = 0, ty = 0;

  const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const ease = t => t * t * (3 - 2 * t);
  const mk = (n, a, parent) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (parent || svg).appendChild(e); return e; };

  // the pull-back comes first: the hero's tag is on a trolley, the trolley is on this floor. Then the timeline, as fractions of what is left.
  const PULL = root.hasAttribute('data-pull') ? .13 : 0, Z0 = 14;   // parked: off unless the section carries data-pull
  const rest = v => (v - PULL) / (1 - PULL);
  const T = { dip: [.05, .19], pts: [.17, .31], trail: [.43, .56], amber: [.47, .59], rise: [.66, .88], type: [.865, .925], ans: [.93, .965], push: [0, .66] };
  // each set of words: where it comes in (it plays once, by itself), and the stretch of scroll that carries it away
  const SHOW = [[-1, .05, .105], [.2, .395, .45], [.5, .62, .67], [.855, 2, 3]];
  const PUSH = .07;

  // headlines come up word by word from behind their own baseline
  root.querySelectorAll('.see-h').forEach(h => {
    let i = 0; const wrap = (node, into) => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return into.append(' '); const o = document.createElement('span'), b = document.createElement('b'); o.className = 'wd'; b.style.setProperty('--i', i++); b.textContent = t; o.append(b); into.append(o); });
      else { const c = n.cloneNode(false); into.append(c); wrap(n, c); }
    });
    const f = document.createDocumentFragment(); wrap(h, f); h.setAttribute('aria-label', h.textContent); h.textContent = ''; h.append(f); h.nextElementSibling && h.nextElementSibling.style.setProperty('--i', i);
  });

  async function load() {
    V = tall.matches ? 'P' : 'L'; W = V === 'P' ? 900 : 1600; H = V === 'P' ? 1600 : 900;
    D = await (await fetch(base + V + '/data.json')).json();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.textContent = ''; frames = []; drawn = -1;
    cv.width = D.frame[0]; cv.height = D.frame[1];
    const defs = mk('defs', {});   // soft glows as gradients: no filters, so nothing is re-blurred while the camera rises
    for (const [id, c] of [['see-gb', '102,165,250'], ['see-ga', '240,164,58']]) { const g = mk('radialGradient', { id }, defs); [[0, .9], [.35, .42], [1, 0]].forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': `rgba(${c},${a})` }, g)); }
    const gT = mk('g', {}), gZ = mk('g', {}), gP = mk('g', { class: 'pts' });
    const A = D.eye.anchors, wave = t => Math.min(...A.map(a => Math.hypot((a[0] - t.xy[0]) * W, (a[1] - t.xy[1]) * H)));
    const order = D.eye.tags.map(wave), far = Math.max(...order);
    els = {
      trails: Object.keys(D.eye.paths).map(k => ({ k, g: mk('polyline', { class: 'trg', pathLength: 1, 'stroke-dasharray': 1 }, gT), l: mk('polyline', { class: 'tr', pathLength: 1, 'stroke-dasharray': 1 }, gT), h: mk('circle', { class: 'trh', r: 3 }, gT) })),
      zones: Object.keys(D.zones).map(k => { const e = mk('text', { class: 'zone' }, gZ); e.textContent = k; return { k, e }; }),
      tags: D.eye.tags.map((t, i) => {
        const g = mk('g', {}, gP), wait = t.state === 'wait', hero = t.mins === 42;
        const o = { t, g, at: order[i] / far, wait, hero, shown: -1, pg: mk('circle', { class: 'pg', r: 24 }, g), pc: mk('circle', { class: 'pc', r: 3.6 }, g) };
        if (wait) {
          o.ag = mk('circle', { class: 'ag', r: hero ? 58 : 38 }, g); o.ac = mk('circle', { class: 'ac', r: hero ? 7 : 5 }, g);
          const flip = V === 'P' && t.xy[0] > .6; o.tx = mk('text', { class: 'mins' + (hero ? ' hero' : '') + (flip ? ' flip' : ''), x: (hero ? 16 : 12) * (flip ? -1 : 1), y: hero ? 8 : 6 }, g); o.tx.textContent = t.mins + ' min';
          if (hero) o.lock = mk('path', { class: 'lock', d: 'M-22-12v-10h10M12-22h10v10M22 12v10h-10M-12 22h-10v-10' }, g);
        }
        return o;
      })
    };
    hi = D.eye.tags.findIndex(t => t.mins === 42); hero = D.eye.tags[hi].xy; box.style.transformOrigin = `${hero[0] * 100}% ${hero[1] * 100}%`; size();
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
    if (!PULL && !calm) {   // depth: the camera never quite stops. It drifts in on the floor until it lifts off, and leans a hair with the cursor
      const z = 1 + PUSH * (1 - ease(seg(p, ...T.push))), k = (z - 1) / PUSH;
      box.style.scale = z > 1.0005 ? z.toFixed(4) : ''; box.style.translate = k > .01 ? `${(-px * 9 * k).toFixed(1)}px ${(-py * 6 * k).toFixed(1)}px` : '';
      s.setProperty('--wx', (px * 4 * k).toFixed(1) + 'px');
    }
    if (geo && PULL) {
      const e = ease(pull), z = Math.pow(Z0, 1 - e), k = 1 - ease(seg(pull, 0, .92));
      box.style.scale = pull < 1 ? z.toFixed(4) : ''; box.style.translate = pull < 1 ? `${(geo.dx * k).toFixed(1)}px ${(geo.dy * k).toFixed(1)}px` : '';
      s.setProperty('--fog', (1 - ease(seg(pull, .22, .74))).toFixed(3)); s.setProperty('--lede', (1 - seg(pull, 0, .2)).toFixed(3));
      if (tagEl) { tagEl.style.scale = (z / Z0).toFixed(4); tagEl.style.translate = `calc(-50% + ${(geo.dx * (k - 1)).toFixed(1)}px) calc(-50% + ${(geo.dy * (k - 1)).toFixed(1)}px)`; tagEl.style.opacity = (1 - seg(pull, .5, .8)).toFixed(3); }
    }
    const dip = seg(p, ...T.dip), pts = seg(p, ...T.pts), tr = seg(p, ...T.trail), amb = ease(seg(p, ...T.amber)), rise = seg(p, ...T.rise), ans = ease(seg(p, ...T.ans));
    const f = Math.round(rise * (D.rise.length - 1)), mix = ease(seg(rise, 0, .1));
    s.setProperty('--dip', ease(dip).toFixed(3)); s.setProperty('--m0', (dip * 160 - 60).toFixed(1) + '%'); s.setProperty('--m1', (dip * 160).toFixed(1) + '%'); s.setProperty('--blue', (ease(pts) * (1 - .5 * amb) * (1 - mix)).toFixed(3)); s.setProperty('--amb', (amb * (1 - mix)).toFixed(3));
    s.setProperty('--rise', mix.toFixed(3)); s.setProperty('--ans', ans.toFixed(3));
    if (rise > 0 && f !== drawn && frames[f] && frames[f].complete && frames[f].naturalWidth) { ctx.drawImage(frames[f], 0, 0, cv.width, cv.height); drawn = f; }
    // where things are on screen at this moment of the rise
    const F = rise > 0 ? D.rise[f] : null, at = (i) => F ? F.tags[i] : D.eye.tags[i].xy;
    const hxy = at(hi); s.setProperty('--hx', (hxy[0] * 100).toFixed(2) + '%'); s.setProperty('--hy', (hxy[1] * 100).toFixed(2) + '%');
    s.setProperty('--spot', Math.max(.5 * ease(seg(amb, .5, 1)) * (1 - mix), ans).toFixed(3)); s.setProperty('--grid', (seg(rise, .8, 1) * (1 - .35 * ans)).toFixed(3));
    els.tags.forEach((o, i) => {
      const xy = at(i), on = ease(seg(pts, o.at * .7, o.at * .7 + .3)), a = o.wait ? amb : 0;
      const near = 1 + (.62 + .76 * D.eye.tags[i].xy[1] - 1) * (1 - ease(rise));   // near things are larger, until the view is from straight above
      o.g.setAttribute('transform', `translate(${(xy[0] * W).toFixed(1)} ${(xy[1] * H).toFixed(1)}) scale(${near.toFixed(3)})`);
      const quiet = 1 - ans * (o.hero ? 0 : .6);
      o.pg.style.opacity = .8 * on * (1 - a) * (1 - .45 * amb) * quiet; o.pc.style.opacity = on * (1 - a) * (1 - .35 * amb) * quiet;
      o.pc.setAttribute('r', (3.6 * (.6 + .4 * on)).toFixed(2));
      if (o.wait) { o.ag.style.opacity = .9 * a * quiet; o.ac.style.opacity = a * quiet; o.tx.style.opacity = ease(seg(amb, .25, .7)) * (o.hero ? 1 : 1 - ans); const m = Math.round(o.t.mins * ease(seg(amb, .25, 1))); if (m !== o.shown) { o.shown = m; o.tx.textContent = m + ' min'; } if (o.lock) o.lock.style.opacity = ans; }
    });
    els.trails.forEach((o, i) => {
      const pts2 = (F ? F.paths[o.k] : D.eye.paths[o.k]).map(q => (q[0] * W).toFixed(1) + ',' + (q[1] * H).toFixed(1)).join(' ');
      const d = 1 - ease(seg(tr, i * .06, i * .06 + .6)), op = (1 - .6 * ans);
      for (const e of [o.g, o.l]) { e.setAttribute('points', pts2); e.setAttribute('stroke-dashoffset', d); }
      o.l.style.opacity = .9 * op; o.g.style.opacity = .16 * op;
      const run = 1 - d; if (run > .001 && run < .999) { const L = o.l.getTotalLength(), pt = o.l.getPointAtLength(L * run); o.h.setAttribute('cx', pt.x); o.h.setAttribute('cy', pt.y); o.h.style.opacity = 1; } else o.h.style.opacity = 0;
    });
    const last = D.rise[D.rise.length - 1];
    els.zones.forEach(o => { const xy = last.zones[o.k]; o.e.setAttribute('x', xy[0] * W); o.e.setAttribute('y', xy[1] * H); o.e.style.opacity = .9 * seg(rise, .92, 1) * (1 - .5 * ans); });
    // words come in on their own once you reach them; the scroll itself carries them away
    const step = SHOW.findIndex(r => w >= r[0] && w < r[2]);
    words.forEach((el, i) => { const r = SHOW[i], out = seg(p, r[1], r[2]); el.classList.toggle('on', i === step && (i > 0 || seen)); el.style.opacity = out > 0 ? (1 - out).toFixed(3) : ''; el.style.setProperty('--out', out.toFixed(3)); });
    if (step !== shown || force) { shown = step; const k = w < .14 ? 0 : w < .44 ? 1 : w < .7 ? 2 : 3; ticks.forEach((t, i) => t.classList.toggle('on', i === k)); }
    // the question is typed by the scroll, and answered on the floor
    const text = q.dataset.q, n = calm ? text.length : Math.round(text.length * seg(p, ...T.type));
    if (n !== typed) { typed = n; q.textContent = text.slice(0, n); }
    const told = p >= T.ans[0] - .012; words[3].classList.toggle('told', told);
    hear({ dip, in: near ? 1 : 0, bank: Math.min(3, Math.floor(dip * 3.2)), lit: els.tags.filter(o => pts > o.at * .7 + .12).length, amber: els.tags.filter(o => o.wait && !o.hero && amb > .3 + .25 * (o.t.mins > 20)).length, hero: amb > .8, mins: els.tags.find(o => o.hero).shown, rise, typed: n, told });
  }

  // Sound, off until the visitor asks for it. Every sound is made here in the browser: there are no audio files.
  // The hall hums while the lights are on. The breakers go off in three banks. Then it is quiet enough to hear each tag answer.
  const sndBtn = $('.see-snd'), buzz = n => { if (!calm && navigator.vibrate) try { navigator.vibrate(n); } catch (e) {} };
  let AC = null, out, room, air, airF, noise, sOn = false, was = null, lastPing = 0, vel = 0;
  function audio() {
    AC = new (window.AudioContext || window.webkitAudioContext)(); out = AC.createGain(); out.gain.value = .55; out.connect(AC.destination);
    const n = AC.sampleRate * 2; noise = AC.createBuffer(1, n, AC.sampleRate); const d = noise.getChannelData(0); let l = 0;
    for (let i = 0; i < n; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
    const loop = (freq, type, q) => { const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); src.buffer = noise; src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0; src.connect(f).connect(g).connect(out); src.start(); return [g, f]; };
    [room] = loop(380, 'lowpass', .5); [air, airF] = loop(500, 'bandpass', .8);
  }
  const tone = (f, len, vol, type = 'sine', f2) => { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(g).connect(out); o.start(t); o.stop(t + len + .02); };
  const click = (freq, len, vol) => { const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime; src.buffer = noise; f.type = 'highpass'; f.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + len); src.connect(f).connect(g).connect(out); src.start(t, Math.random()); src.stop(t + len + .02); };
  // called from paint with where the story is now; a sound plays when the scroll carries the story forward past its moment
  function hear(st) {
    const p0 = was || st; was = st; if (st.told && !p0.told) buzz(18); if (st.bank > p0.bank) buzz(10); if (st.hero && !p0.hero) buzz(14);
    if (!sOn) return; const t = AC.currentTime;
    room.gain.setTargetAtTime(.2 * (1 - st.dip) * st.in, t, .12);
    air.gain.setTargetAtTime(st.rise > 0 && st.rise < 1 ? Math.min(.22, vel * 26) : 0, t, .08); airF.frequency.setTargetAtTime(380 + 1500 * st.rise, t, .1);
    if (st.bank > p0.bank) { tone(92 - st.bank * 9, .34, .5, 'sine', 40); click(900, .05, .28); }
    if (st.lit > p0.lit && performance.now() - lastPing > 38) { lastPing = performance.now(); tone(1180 + 60 * st.lit, .5, .05); }
    if (st.amber > p0.amber) tone([392, 330, 262][Math.min(2, st.amber - 1)], .9, .09, 'triangle');
    if (st.hero && !p0.hero) tone(196, 1.4, .14, 'triangle');
    if (st.mins > p0.mins && st.mins % 3 === 0) click(3200, .018, .06);
    if (st.typed > p0.typed) click(2400, .03, .16);
    if (st.told && !p0.told) { tone(587, 1.1, .1); setTimeout(() => sOn && tone(880, 1.5, .1), 130); }
  }
  if (sndBtn) sndBtn.addEventListener('click', () => {
    if (!AC) audio(); sOn = !sOn; if (sOn) AC.resume(); else { room.gain.setTargetAtTime(0, AC.currentTime, .05); air.gain.setTargetAtTime(0, AC.currentTime, .05); }
    sndBtn.setAttribute('aria-pressed', sOn); sndBtn.lastElementChild.textContent = sOn ? 'Sound on' : 'Sound off'; was = null; paint();
  });

  function measure() {
    const r = root.getBoundingClientRect(), span = r.height - innerHeight;
    want = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    near = r.top < innerHeight * 2.5 && r.bottom > -innerHeight; if (!seen && r.top < innerHeight * .5) { seen = true; shown = -1; }
    if (near) preload();
    if (!raf && near) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    const d = want - cur; vel += (Math.abs(d) - vel) * .2; cur = calm || Math.abs(d) < .0004 ? want : cur + d * .16;
    px += (tx - px) * .08; py += (ty - py) * .08;
    paint();
    if (cur !== want || Math.abs(tx - px) + Math.abs(ty - py) > .002 || (sOn && vel > .0004)) raf = requestAnimationFrame(tick);
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
  stage.addEventListener('pointermove', ev => { hover(ev); if (ev.pointerType === 'mouse') { tx = ev.clientX / innerWidth - .5; ty = ev.clientY / innerHeight - .5; if (!raf) raf = requestAnimationFrame(tick); } }); stage.addEventListener('pointerdown', hover); stage.addEventListener('pointerleave', () => tip.classList.remove('on'));
})();
