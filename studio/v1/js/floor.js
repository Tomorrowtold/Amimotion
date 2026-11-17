/* LOST. FOUND. SEEN: one small plant, one camera, nine sentences.
   The plant is a set of finished pictures taken from one fixed direction (wide, near, close; each in clay and in colour).
   This script moves a flat camera over them, lets colour spread where a thing is located, moves the AMRs and the walker,
   and pins a few words and lines to things. Without WebGL, on slow machines or with Save-Data it shows nine finished pictures. */
(function () {
  'use strict';
  var S = document.querySelector('.flr'); if (!S) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;            // the stacked page is the reduced-motion version
  var stage = S.querySelector('.flr-stage'), beats = [].slice.call(S.querySelectorAll('.flr-b')), NB = beats.length;
  var cv = S.querySelector('.flr-gl'), ov = S.querySelector('.flr-ov'), dotsEl = S.querySelector('.flr-dots'), xyEl = null;
  var rail = [].slice.call(S.querySelectorAll('.flr-rail a')), topA = S.querySelector('.flr-top'), sndB = S.querySelector('.flr-snd');
  var Q = new URLSearchParams(location.search), SHOT = !!window.__flrShot, FULL = SHOT || Q.get('flr') === 'full', FORCE_STILLS = Q.get('flr') === 'stills';
  var base = S.getAttribute('data-assets');
  var WGT = [1, 1.5, 1.15, 1, 1.2, 1, 1.45, 1.25, 1.1], SUM = WGT.reduce(function (a, b) { return a + b; }, 0), UNIT = 50;   // vh of scroll per unit
  var EDGE = [0]; WGT.forEach(function (w) { EDGE.push(EDGE[EDGE.length - 1] + w / SUM); });
  S.style.setProperty('--flr-run', (SUM * UNIT) + 'vh');
  S.classList.add('flr-on');
  if (SHOT) S.classList.add('flr-shot');

  // ---- words: each sentence is split into words so it can arrive word by word
  // The copy is one running column on the left. The sentence being told stands at a fixed line; told ones move up and dim.
  // Every word lights as the scroll passes it, and each picture event is tied to the same point of the scroll as its words.
  var col = document.createElement('div'); col.className = 'flr-col'; var roll = document.createElement('div'); roll.className = 'flr-roll'; col.appendChild(roll); stage.insertBefore(col, cv);
  var AW = { 3: [.5, .56, .6, .64, .68, .72, .76], 6: [.44, .55, .66, .75] };       // answers whose words are timed to things in the picture
  var blocks = beats.map(function (b, bi) {
    var t = b.querySelector('.flr-t'), words = [];
    [].forEach.call(t.querySelectorAll('.flr-s,.flr-a'), function (p) {
      var ans = p.classList.contains('flr-a'), out = document.createDocumentFragment(), ws = p.textContent.split(' ');
      ws.forEach(function (w, k) {
        if (k) out.appendChild(document.createTextNode(' '));
        var s = document.createElement('span'); s.className = 'w'; s.textContent = w; out.appendChild(s);
        var at = ans ? (AW[bi] ? AW[bi][k] : .44 + .2 * k / ws.length) : .02 + .27 * k / ws.length;
        words.push({ el: s, at: at, v: -1 });
      });
      p.textContent = ''; p.appendChild(out);
    });
    roll.appendChild(t); return { el: t, words: words, top: 0, st: '' };
  });
  function textFrame(tb) {
    var i = Math.min(NB - 1, Math.floor(tb)), u = Math.min(1, tb - i), line = phone ? vh * .1 : vh * .3;
    var y = i < NB - 1 ? lerp(blocks[i].top, blocks[i + 1].top, ease5(seg(u, .86, 1))) : blocks[i].top;
    roll.style.transform = 'translate3d(0,' + (line - y).toFixed(1) + 'px,0)';
    blocks.forEach(function (b, k) {
      var st = k < i ? 'past' : k === i ? 'on' : 'next'; if (st !== b.st) { b.st = st; b.el.className = 'flr-t ' + st; }
      if (Math.abs(k - i) > 1 && b.done === st) return; b.done = st;
      b.words.forEach(function (w) {
        var v = k < i ? 1 : k > i ? 0 : ease(seg(u, w.at, w.at + .09)); v = Math.round(v * 50) / 50;
        if (v === w.v) return; w.v = v; w.el.style.opacity = (.13 + .87 * v).toFixed(3);
        w.el.style.transform = v < 1 ? 'translate3d(0,' + ((1 - v) * .16).toFixed(3) + 'em,0)' : ''; w.el.style.filter = v > 0 && v < 1 ? 'blur(' + ((1 - v) * 5).toFixed(1) + 'px)' : '';
      });
    });
  }
  // ---- notes
  var notes = [];
  beats.forEach(function (b, bi) {
    [].forEach.call(b.querySelectorAll('.flr-n li'), function (li) {
      var sp = document.createElement('span'); while (li.firstChild) sp.appendChild(li.firstChild);
      var hair = document.createElement('i'); hair.className = 'flr-hair'; var pin = document.createElement('i'); pin.className = 'flr-pin';
      li.appendChild(hair); li.appendChild(pin); li.appendChild(sp);
      if (li.getAttribute('data-at') === 'due') li.classList.add('flr-due');
      notes.push({ el: li, sp: sp, hair: hair, pin: pin, bi: bi, at: li.getAttribute('data-at'), o: li.getAttribute('data-o').split(',').map(Number), om: li.getAttribute('data-om').split(',').map(Number) });
    });
  });
  xyEl = S.querySelector('[data-xy]');
  var clocks = [].slice.call(S.querySelectorAll('[data-clock]')).map(function (e) { return { el: e, base: +e.getAttribute('data-clock'), due: !!e.closest('[data-at="due"]'), last: '' }; });
  function fmt(s, sec) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return sec ? m + ' min ' + (r < 10 ? '0' : '') + r + ' s' : m + ' min'; }

  // ---- layout and scroll
  var vw = 0, vh = 0, dpr = 1, phone = false, p = 0, ps = -1, bi = -1, live = false, stills = false, onScreen = false, near = false;
  function measure() {
    var r = stage.getBoundingClientRect(); vw = r.width; vh = r.height; phone = vw / vh < .8;
    dpr = Math.min(window.devicePixelRatio || 1, phone ? 2 : 1.75);
    if (live) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); }
    ov.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    notes.forEach(function (n) {
      var o = phone ? n.om : n.o; n.sp.style.left = o[0] + 'px'; n.sp.style.top = o[1] + 'px';
      var w = n.sp.offsetWidth, h = n.sp.offsetHeight, ex = o[0] >= 0 ? o[0] - 7 : o[0] + w + 7, ey = o[1] + (o[1] < 0 ? h - 4 : 4);
      if (n.at === 'mid') { n.hair.style.display = n.pin.style.display = 'none'; return; }
      n.hair.style.width = Math.hypot(ex, ey) + 'px'; n.hair.style.transform = 'rotate(' + Math.atan2(ey, ex) + 'rad)';
    });
    blocks.forEach(function (b) { b.top = b.el.offsetTop; });
  }
  function readScroll() {
    var r = S.getBoundingClientRect(), run = r.height - vh; p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    onScreen = r.top < vh && r.bottom > 0; near = r.top < vh * 1.3 && r.bottom > -vh;
    topA.classList.toggle('show', r.top < -vh * .4 && r.bottom > vh);
  }
  function beatOf(x) { for (var i = NB - 1; i >= 0; i--) if (x >= EDGE[i]) return i; return 0; }
  function setBeat(i) {
    if (i === bi) return; var was = bi; bi = i;
    beats.forEach(function (b, k) { b.classList.toggle('on', k === i); b.classList.toggle('flr-near', Math.abs(k - i) <= 1); });
    rail.forEach(function (a) { var g = +a.getAttribute('data-go'); a.classList.toggle('on', i >= g && i < g + 3); });
    stage.style.setProperty('--end', i === NB - 1 ? 1 : 0);
    if (was >= 0) snd.beat(i, was);
  }
  rail.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var g = +a.getAttribute('data-go'), r = S.getBoundingClientRect(), run = r.height - vh;
      window.scrollTo({ top: window.scrollY + r.top + (EDGE[g] + .012) * run, behavior: 'smooth' });
    });
  });

  // ---- sound: made here, nothing to download. It starts only after a tap, a click or a key.
  var snd = (function () {
    var on = true, ctx = null, out = null, air = null, lastPop = 0;
    try { if (localStorage.getItem('flr-snd') === '0') on = false; } catch (e) {}
    function label() { sndB.textContent = on ? 'Sound on' : 'Sound off'; sndB.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    label();
    function boot() {
      if (ctx || !on) return; var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC(); out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
      var n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0), v = 0;
      for (var i = 0; i < n; i++) { v = (v + (Math.random() * 2 - 1) * .02) / 1.02; d[i] = v * 3.2; }
      air = ctx.createBufferSource(); air.buffer = buf; air.loop = true; var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; var g = ctx.createGain(); g.gain.value = .5;
      air.connect(f); f.connect(g); g.connect(out); air.start();
    }
    ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.addEventListener(ev, function () { boot(); if (ctx && ctx.state === 'suspended') ctx.resume(); }, { passive: true }); });
    sndB.addEventListener('click', function () { on = !on; try { localStorage.setItem('flr-snd', on ? '1' : '0'); } catch (e) {} label(); if (on) boot(); });
    function gate() { if (!ctx) return; var t = (on && onScreen && !document.hidden) ? .55 : 0; out.gain.setTargetAtTime(t, ctx.currentTime, .25); }
    function tone(f, t0, dur, vol, type) {
      if (!ctx || !on || !onScreen) return; var t = ctx.currentTime + (t0 || 0), o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
    }
    function tick(vol) {
      if (!ctx || !on || !onScreen) return; var t = ctx.currentTime, n = Math.floor(ctx.sampleRate * .05), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
      var s = ctx.createBufferSource(); s.buffer = b; var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = 1.2; var g = ctx.createGain(); g.gain.value = vol;
      s.connect(f); f.connect(g); g.connect(out); s.start(t);
    }
    var SC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5];
    return {
      gate: gate, step: function () { tick(.5); },
      pop: function (k) { var n = performance.now(); if (n - lastPop < 45) return; lastPop = n; tone(SC[k % SC.length], 0, .5, .085); },
      pulse: function (d) { tone(1568, 0, .35, .11); tone(784, 0, .5, .05); d.forEach(function (x, i) { tone([1174.7, 1318.5, 1046.5][i], .12 + x * .012, .7, .07); }); },
      fix: function () { tone(659.25, 0, .9, .09); tone(987.77, .09, 1.1, .07); },
      beat: function (i, was) { if (i === 8 && was === 7) { tone(261.6, 0, 2.2, .07); tone(392, .05, 2.2, .06); tone(659.25, .1, 2.4, .05); } else tone(i > was ? 196 : 174.6, 0, .22, .07, 'triangle'); }
    };
  })();

  // ---- the plant
  var M = null, gl = null, P1, P2, tex = {}, lut = null;
  var EL = 36 * Math.PI / 180, TAN = Math.tan(EL);
  function Mxy(x, y, z) { return [(M.o[0] + x * M.x[0] + y * M.y[0] + z * M.z[0]) * M.scale, (M.o[1] + x * M.x[1] + y * M.y[1] + z * M.z[1]) * M.scale / M.aspect]; }
  function depthOf(x, y, z) { return (x - M.cam[0]) * M.view[0] + (y - M.cam[1]) * M.view[1] + (z - M.cam[2]) * M.view[2]; }
  var cam = { fx: 0, fy: 0, ppm: 10, ax: 0, ay: 0 };
  function scr(x, y, z) { var m = Mxy(x, y, z); return [cam.ax + (m[0] - cam.fx) * cam.ppm, cam.ay + (m[1] - cam.fy) * cam.ppm]; }
  function ease(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function ease5(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * x * (x * (6 * x - 15) + 10); }
  function seg(u, a, b) { return u <= a ? 0 : u >= b ? 1 : (u - a) / (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // routes
  var WALK = [[12.6, 14.6], [9.4, 14.6], [9.4, 7.5], [4.2, 7.5], [28.6, 7.5], [28.6, 4.9]], WL = [0], WTOT = 0;
  for (var wi = 1; wi < WALK.length; wi++) { WTOT += Math.hypot(WALK[wi][0] - WALK[wi - 1][0], WALK[wi][1] - WALK[wi - 1][1]); WL.push(WTOT); }
  function walkAt(d) {
    d = Math.max(0, Math.min(WTOT, d));
    for (var i = 1; i < WALK.length; i++) if (d <= WL[i] || i === WALK.length - 1) {
      var t = (d - WL[i - 1]) / (WL[i] - WL[i - 1]), a = WALK[i - 1], b = WALK[i], dx = b[0] - a[0], dy = b[1] - a[1];
      return { x: lerp(a[0], b[0], t), y: lerp(a[1], b[1], t), h: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), seg: i };
    }
  }
  function loop(x0, y0, x1, y1, off, r) {          // out along one lane, a half turn, back along the next lane
    var pts = [], horiz = y0 === y1, L = horiz ? x1 - x0 : y1 - y0, n = 16, i, a;
    pts.push([x0, y0]); pts.push([x1, y1]);
    for (i = 1; i <= n; i++) { a = Math.PI * i / n; pts.push(horiz ? [x1 + Math.sin(a) * r * Math.sign(L), y1 + (1 - Math.cos(a)) * off / 2] : [x1 + (1 - Math.cos(a)) * off / 2, y1 + Math.sin(a) * r * Math.sign(L)]); }
    pts.push(horiz ? [x0, y0 + off] : [x0 + off, y0]);
    for (i = 1; i <= n; i++) { a = Math.PI * i / n; pts.push(horiz ? [x0 - Math.sin(a) * r * Math.sign(L), y0 + off - (1 - Math.cos(a)) * off / 2] : [x0 + off - (1 - Math.cos(a)) * off / 2, y0 - Math.sin(a) * r * Math.sign(L)]); }
    var len = [0], tot = 0; for (i = 1; i < pts.length; i++) { tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); len.push(tot); }
    return { pts: pts, len: len, tot: tot };
  }
  var RA = loop(3.4, 8.9, 27.6, 8.9, 1.25, .62), RB = loop(18.85, 2.2, 18.85, 17.6, -1.2, .6);
  function routeAt(R, d) {
    d = ((d % R.tot) + R.tot) % R.tot; var lo = 1; while (lo < R.pts.length - 1 && R.len[lo] < d) lo++;
    var a = R.pts[lo - 1], b = R.pts[lo], t = (d - R.len[lo - 1]) / (R.len[lo] - R.len[lo - 1] || 1);
    return { x: lerp(a[0], b[0], t), y: lerp(a[1], b[1], t), th: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }
  var PER = 50;
  function amrPos(k, time) {
    if (k === 0) return routeAt(RA, (time % PER) / PER * RA.tot);
    var t = ((time + 21) % PER) / PER, half = RB.tot / 2, hold = .16, d;        // the second AMR waits a moment at each end, so the two never meet at the crossing
    if (t < .5) d = ease(seg(t, hold / 2, .5 - hold / 2)) * 0 + seg(t, hold, .5) * half; else d = half + seg(t, .5 + hold, 1) * half;
    return routeAt(RB, d);
  }

  // ---- camera: for each sentence, where the picture rests. f = world point kept at the picture's centre, span = metres across the picture area.
  function shotOf(i, u, st) {
    var H = M.hero, T = M.tag, D = M.due, w = st.walker;
    switch (i) {
      case 0: return phone ? { f: [10.2, 15.2, .6], s: 13 } : { f: [10.6, 15.4, .6], s: 18 };
      case 1: return phone ? { f: [lerp(w.x, 12, .25), lerp(w.y, 10, .25), .8], s: 17 } : { f: [lerp(w.x, 14, .5), lerp(w.y, 10, .55), .6], s: 27 };
      case 2: var e = ease(seg(u, .5, .95)); return phone ? { f: [lerp(21, H[0], e), lerp(9.5, H[1], e), .6], s: lerp(26, 11, e) } : { f: [lerp(19.5, H[0] - 1, e), lerp(10.2, H[1] + .4, e), .6], s: lerp(31, 13, e) };
      case 3: return phone ? { f: [T[0], T[1], T[2] - .01], s: .2 } : { f: [T[0], T[1], T[2]], s: .32 };
      case 4: return phone ? { f: [21.5, 8, 2.6], s: 23 } : { f: [17, 8.6, 2.4], s: 35 };
      case 5: return phone ? { f: [H[0], H[1], .8], s: 5.4 } : { f: [H[0] - .2, H[1], .8], s: 7.2 };
      case 6: return phone ? { f: [14.5, 10, .5], s: 31 } : { f: [16, 9.6, .5], s: 36 };
      case 7: return phone ? { f: [15.5, 9.6, .5], s: 28 } : { f: [16.4, 9.4, .5], s: 33.5 };
      default: return phone ? { f: [14.5, 10, .5], s: 34 } : { f: [15.6, 9.6, .5], s: 39 };
    }
  }
  var MOVE = [0, .4, .3, .44, .5, .42, .42, .4, .5];      // the share of each sentence's scroll in which the camera travels to it; then it rests
  function camAt(i, u, st) {
    var b = shotOf(i, u, st);
    if (i > 0 && u < MOVE[i]) {
      var a = shotOf(i - 1, 1, st), t = ease5(u / MOVE[i]), la = Math.log(a.s), lb = Math.log(b.s), k;
      // pan mostly while wide, zoom mostly while centred: the eye never loses the thing it is going to
      var zin = lb < la, tz = zin ? Math.pow(t, 1.5) : 1 - Math.pow(1 - t, 1.5), tp = zin ? 1 - Math.pow(1 - t, 1.6) : Math.pow(t, 1.6);
      b = { f: [0, 1, 2].map(function (k) { return lerp(a.f[k], b.f[k], tp); }), s: Math.exp(lerp(la, lb, tz)) };
    }
    return b;
  }

  // ---- state of the story at (sentence i, progress u)
  var things = [], amberIdx = {}, AMRI = [];
  function story(i, u) {
    var st = {};
    var wd = i < 1 ? 0 : i === 1 ? .7 * ease(seg(u, .12, 1)) : i === 2 ? .7 + .3 * ease(seg(u, 0, .6)) : 1;
    st.wd = wd * WTOT; st.walker = walkAt(st.wd);
    st.walkA = i < 3 ? 1 : i === 3 ? 1 - seg(u, 0, .2) : i === 4 ? seg(u, .3, .5) : 1;
    st.trail = i === 1 ? 1 : i === 2 ? 1 : i === 3 ? 1 - seg(u, 0, .3) : 0;
    st.due = i <= 2 ? (i === 0 ? seg(u, .44, .58) : 1) : i === 3 ? 1 - seg(u, 0, .25) : 0;
    st.meas = i === 2 ? ease(seg(u, .08, .42)) : 0; st.measA = i === 2 ? 1 : i === 3 ? 1 - seg(u, 0, .25) : 0;
    st.tag = i < 3 ? 0 : i === 3 ? ease(seg(u, .3, .46)) : 1;
    st.lines = i === 3 ? ease(seg(u, .6, .86)) * .12 : i === 4 ? lerp(.12, 1, ease(seg(u, .04, .5))) : i === 5 ? 1 : 0;
    st.linesA = i === 3 ? seg(u, .6, .64) : i === 4 ? 1 : i === 5 ? lerp(1, .0, seg(u, .3, .5)) : 0;
    st.anch = i < 4 ? 0 : i === 4 ? ease(seg(u, .3, .5)) : 1;
    st.heroC = i < 5 ? 0 : i === 5 ? ease(seg(u, .16, .3)) : 1;
    st.fix = i === 5 ? ease(seg(u, .46, .6)) : 0;
    st.wave = i < 6 ? 0 : i === 6 ? u : 2;
    st.all = i < 6 ? 0 : i === 6 ? ease(seg(u, .86, .97)) : 1;
    st.dots = i < 5 ? 0 : 1;
    st.amber = i === 7 ? ease(seg(u, .44, .58)) : i === 8 ? 1 : 0;
    return st;
  }

  // ---- overlay pieces (SVG)
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, c) { var e = document.createElementNS(NS, n); if (c) e.setAttribute('class', c); ov.appendChild(e); return e; }
  var bayP = el('polygon', 'l-bay'), trailP = el('polyline', 'l-trail'), measL = el('line', 'l-ink'), measA = el('circle', 'f-ink'), measB = el('circle', 'f-ink');
  var rays = [0, 1, 2].map(function () { return { l: el('line', 'l-blue'), d: el('circle', 'f-blue') }; });
  var bar = el('line', 'l-ink'), barA = el('line', 'l-ink'), barB = el('line', 'l-ink'), barT = el('text');
  barT.setAttribute('style', 'font:500 14px "AmI Text",Arial,sans-serif;fill:#0b1238'); barT.textContent = '10 cm';
  [measA, measB].forEach(function (c) { c.setAttribute('r', 3.5); }); rays.forEach(function (r) { r.d.setAttribute('r', 4); });
  var tl = [0, 1, 2].map(function () { var d = document.createElement('div'); d.className = 'flr-dot'; d.style.cssText = 'width:auto;height:auto;margin:0;border-radius:0;background:none;box-shadow:none;font:500 14px/1 "AmI Text",Arial,sans-serif;color:#1f6bff;white-space:nowrap;text-shadow:0 0 6px #f0f6ff,0 0 12px #f0f6ff;font-variant-numeric:tabular-nums'; dotsEl.appendChild(d); return d; });
  function show(e, a) { e.style.opacity = a; e.style.display = a > .003 ? '' : 'none'; }

  // ---- WebGL
  var VS1 = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS1 = 'precision highp float;uniform vec2 uRes,uA,uF,uPl;uniform float uPpm;uniform sampler2D tWc,tWk,tMc,tMk,tCc,tCk,tXc,tXk,tWi,tMi,tCi,tXi,tLut;uniform vec4 uMid,uClose,uMac;uniform vec3 uW;' +
    'float edge(vec2 u){vec2 d=min(u,1.-u);return smoothstep(0.,.07,min(d.x,d.y));}float rv(sampler2D t,vec2 u){return texture2D(tLut,vec2((texture2D(t,u).r*255.+.5)/256.,.5)).r;}' +
    'void main(){vec2 s=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);vec2 m=(s-uA)/uPpm+uF;vec2 uv=m/uPl;' +
    'vec4 c=vec4(0.);if(uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.)c=mix(texture2D(tWk,uv),texture2D(tWc,uv),rv(tWi,uv));' +
    'if(uW.x>0.){vec2 u=(uv-uMid.xy)/uMid.zw;if(u.x>0.&&u.x<1.&&u.y>0.&&u.y<1.)c=mix(c,mix(texture2D(tMk,u),texture2D(tMc,u),rv(tMi,u)),edge(u)*uW.x);}' +
    'if(uW.y>0.){vec2 u=(uv-uClose.xy)/uClose.zw;if(u.x>0.&&u.x<1.&&u.y>0.&&u.y<1.)c=mix(c,mix(texture2D(tCk,u),texture2D(tCc,u),rv(tCi,u)),edge(u)*uW.y);}' +
    'if(uW.z>0.){vec2 u=(uv-uMac.xy)/uMac.zw;if(u.x>0.&&u.x<1.&&u.y>0.&&u.y<1.)c=mix(c,mix(texture2D(tXk,u),texture2D(tXc,u),rv(tXi,u)),edge(u)*uW.z);}' +
    'gl_FragColor=c;}';
  var VS2 = 'attribute vec2 a;uniform vec2 uRes,uA,uF;uniform float uPpm;uniform vec4 uR;varying vec2 vU,vM;void main(){vU=a;vM=uR.xy+a*uR.zw;vec2 s=uA+(vM-uF)*uPpm;gl_Position=vec4(s.x/uRes.x*2.-1.,1.-s.y/uRes.y*2.,0.,1.);}';
  var FS2 = 'precision highp float;varying vec2 vU,vM;uniform sampler2D tAt,tD;uniform vec2 uCa,uCb,uPl,uDr;uniform float uMix,uAl,uBy,uBd,uTan;' +
    'void main(){vec2 q=clamp(vU,.004,.996)*.125;vec4 c=mix(texture2D(tAt,uCb+q),texture2D(tAt,uCa+q),uMix);vec4 dd=texture2D(tD,vM/uPl);float D=uDr.x+(dd.r*65280.+dd.g*255.)/65535.*(uDr.y-uDr.x);' +
    'float dy=uBy-vM.y;float fd=uBd-(dy>0.?dy*uTan:-dy/uTan);gl_FragColor=c*uAl*smoothstep(-.75,-.3,D-fd);}';
  function prog(vs, fs) {
    var pr = gl.createProgram();
    [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(function (x) { var s = gl.createShader(x[0]); gl.shaderSource(s, x[1]); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); gl.attachShader(pr, s); });
    gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    var u = {}, n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS); for (var i = 0; i < n; i++) { var nm = gl.getActiveUniform(pr, i).name.replace('[0]', ''); u[nm] = gl.getUniformLocation(pr, nm); }
    return { p: pr, u: u };
  }
  function loadImg(src) { return new Promise(function (ok, no) { var im = new Image(); im.decoding = 'async'; im.onload = function () { ok(im); }; im.onerror = no; im.src = src; }); }
  function mkTex(im, o) {
    o = o || {}; var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !o.raw); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var mip = gl2 && !o.raw && !o.nomip; if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, o.raw ? gl.NEAREST : mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, o.raw ? gl.NEAREST : gl.LINEAR);
    return { t: t, w: im.width, h: im.height };
  }
  var gl2 = false;
  function canGL() {
    if (FORCE_STILLS) return false;
    try {
      var c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl'); if (!g) return false;
      if (FULL) return true;
      var nav = navigator, cn = nav.connection || {}; if (cn.saveData || /(^|-)2g$/.test(cn.effectiveType || '')) return false;
      var ex = g.getExtension('WEBGL_debug_renderer_info'), r = ex ? String(g.getParameter(ex.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software|basic render/i.test(r)) return false;
      if (g.getParameter(g.MAX_TEXTURE_SIZE) < 4096 || g.getParameter(g.MAX_TEXTURE_IMAGE_UNITS) < 13) return false;
      return true;
    } catch (e) { return false; }
  }
  function toStills() { live = false; stills = true; S.classList.remove('flr-live'); S.classList.add('flr-stills'); }

  var started = false;
  function start() {
    if (started) return; started = true;
    if (!canGL()) { toStills(); return; }
    S.classList.add('flr-stills');                                             // the finished picture of this sentence shows while the plant loads
    stills = true;
    var L = (phone || Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1) < 1500) ? 'P/' : 'L/';
    var names = ['wide_col', 'wide_clay', 'mid_col', 'mid_clay', 'close_col', 'close_clay', 'macro_col', 'macro_clay', 'sprites'];
    var idn = ['wide_id', 'mid_id', 'close_id', 'macro_id'];
    Promise.all([fetch(base + 'floor.json').then(function (r) { return r.json(); }), loadImg(base + 'depth.png')].concat(names.map(function (n) { return loadImg(base + L + n + '.webp'); }), idn.map(function (n) { return loadImg(base + L + n + '.png'); }))).then(function (r) {
      M = r[0];
      gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' }); gl2 = !!gl;
      if (!gl) gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
      if (!gl) throw new Error('no gl');
      cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); toStills(); });
      P1 = prog(VS1, FS1); P2 = prog(VS2, FS2);
      tex.depth = mkTex(r[1], { raw: true }); names.forEach(function (n, k) { tex[n] = mkTex(r[2 + k]); });
      idn.forEach(function (n, k) { tex[n] = mkTex(r[2 + names.length + k], { raw: true }); });
      lut = new Uint8Array(256 * 4); var lt = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, lt); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, lut);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); tex.lut = { t: lt };
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW); tex.quad = b;
      var b2 = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b2); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW); tex.full = b2;
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
      setup(); live = true; stills = false; measure(); S.classList.add('flr-live'); setTimeout(function () { if (live) S.classList.remove('flr-stills'); }, 650);
      ps = -1; kick();
    }).catch(function () { toStills(); });
  }

  function setup() {
    // tagged things, ordered by how far they are from the first one: colour spreads outward from the trolley that was found
    var H = M.hero, zt = { trolley: 1.02, pallet: 1.25, forklift: 2.2, amr: .34 };
    things = M.things.map(function (t) { return { k: t[0], x: t[1], y: t[2], z: zt[t[0]], d: Math.hypot(t[1] - H[0], t[2] - H[1]) }; });
    things.push({ k: 'amr', amr: 0, x: 0, y: 0, z: 1.9, d: 14 }, { k: 'amr', amr: 1, x: 0, y: 0, z: 1.9, d: 9 });
    var KA = { trolley: [.44, .09], pallet: [.55, .09], forklift: [.66, .02], amr: [.75, .04] }, cnt = {}, seen = {};
    things.forEach(function (t) { cnt[t.k] = (cnt[t.k] || 0) + 1; });
    things.slice().sort(function (a, b) { return a.d - b.d; }).forEach(function (t) { seen[t.k] = (seen[t.k] || 0) + 1; t.at = KA[t.k][0] + KA[t.k][1] * (seen[t.k] - 1) / cnt[t.k]; });
    things.forEach(function (t, i) {
      t.hero = t.d < .05; t.el = document.createElement('i'); t.el.className = 'flr-dot'; dotsEl.appendChild(t.el); t.on = false;
      if (t.amr !== undefined) AMRI[t.amr] = t;
    });
    function nearest(x, y) { var b = null; things.forEach(function (t) { if (t.amr === undefined && (!b || Math.hypot(t.x - x, t.y - y) < Math.hypot(b.x - x, b.y - y))) b = t; }); return b; }
    var buf = nearest(8.46, 5.6); amberIdx = { hero: nearest(H[0], H[1]), pallet: nearest(M.pallet[0], M.pallet[1]), buf: buf };
    for (var k in amberIdx) amberIdx[k].amber = true;
    M.pt = { due: [M.due[0], M.due[1], 0], hero: [H[0], H[1], 1.02], tag: M.tag, a0: M.anch[0], a1: M.anch[1], a2: M.anch[2], pallet: [M.pallet[0], M.pallet[1], 1.25], buf: [buf.x, buf.y, 1.02],
      mid: [(M.due[0] + H[0]) / 2, (M.due[1] + H[1]) / 2, 0] };
    M.ns = M.anch.map(function (a) { return Math.hypot(a[0] - M.tag[0], a[1] - M.tag[1], a[2] - M.tag[2]) / .299792458; });
    var c = S.querySelector('.flr-count');
    if (c) { var n = { trolley: 0, pallet: 0, forklift: 0, amr: 0 }; things.forEach(function (t) { n[t.k]++; }); var bs = c.querySelectorAll('b'); bs[0].textContent = n.trolley; bs[1].textContent = n.pallet; bs[2].textContent = n.amr; bs[3].textContent = n.forklift; }
  }

  // which things show their colour: one value per thing, looked up through the matte, so colour stops exactly at each thing's outline
  function setLut(st) {
    function put(id, v) { lut[id * 4] = Math.round(Math.max(st.all, v) * 255); }
    put(0, 0);
    things.forEach(function (t, n) { if (t.amr !== undefined) { t.rev = Math.max(st.all, ease(seg(st.wave, t.at, t.at + .06))); return; } put(n + 1, t.hero ? st.heroC : ease(seg(st.wave, t.at, t.at + .06))); });
    for (var k = 0; k < 3; k++) put(240 + k, st.anch); put(250, st.tag);
    gl.activeTexture(gl.TEXTURE12); gl.bindTexture(gl.TEXTURE_2D, tex.lut.t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, lut);
  }

  var lastStep = -1, pulsed = false, fixed = false, T0 = performance.now(), frozen = null;
  function frame(tb, time) {
    var i = Math.min(NB - 1, Math.floor(tb)), u = Math.min(1, tb - i), st = story(i, u), c = camAt(i, u, st);
    // camera
    var area = phone ? vw * .98 : vw * .57, f = Mxy(c.f[0], c.f[1], c.f[2]);
    cam.ppm = area / c.s; cam.fx = f[0]; cam.fy = f[1]; cam.ax = phone ? vw * .5 : vw * .695; cam.ay = phone ? vh * .63 : vh * .525;
    // moving things
    var a0 = amrPos(0, time), a1 = amrPos(1, time); AMRI[0].x = a0.x; AMRI[0].y = a0.y; AMRI[0].th = a0.th; AMRI[1].x = a1.x; AMRI[1].y = a1.y; AMRI[1].th = a1.th;
    // --- plate
    var W = cv.width, Hh = cv.height; gl.viewport(0, 0, W, Hh); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    var U = P1.u; gl.useProgram(P1.p); gl.bindBuffer(gl.ARRAY_BUFFER, tex.full); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(U.uRes, W, Hh); gl.uniform2f(U.uA, cam.ax * dpr, cam.ay * dpr); gl.uniform2f(U.uF, cam.fx, cam.fy); gl.uniform1f(U.uPpm, cam.ppm * dpr); gl.uniform2f(U.uPl, M.scale, M.scale / M.aspect); setLut(st); gl.uniform1i(U.tLut, 12);
    ['wide_col', 'wide_clay', 'mid_col', 'mid_clay', 'close_col', 'close_clay', 'macro_col', 'macro_clay', 'wide_id', 'mid_id', 'close_id', 'macro_id'].forEach(function (n, k) { gl.activeTexture(gl.TEXTURE0 + k); gl.bindTexture(gl.TEXTURE_2D, tex[n].t); gl.uniform1i(U[['tWc', 'tWk', 'tMc', 'tMk', 'tCc', 'tCk', 'tXc', 'tXk', 'tWi', 'tMi', 'tCi', 'tXi'][k]], k); });
    gl.uniform4fv(U.uMid, M.mid); gl.uniform4fv(U.uClose, M.close); gl.uniform4fv(U.uMac, M.macro);
    var dp = cam.ppm * dpr, wp = tex.wide_col.w / M.scale, mp = tex.mid_col.w / (M.mid[2] * M.scale), cp = tex.close_col.w / (M.close[2] * M.scale);
    gl.uniform3f(U.uW, ease(seg(dp / wp, .85, 1.5)), ease(seg(dp / mp, .85, 1.5)), ease(seg(dp / cp, .85, 1.5)));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // --- sprites, far ones first
    U = P2.u; gl.useProgram(P2.p); gl.bindBuffer(gl.ARRAY_BUFFER, tex.quad); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(U.uRes, W, Hh); gl.uniform2f(U.uA, cam.ax * dpr, cam.ay * dpr); gl.uniform2f(U.uF, cam.fx, cam.fy); gl.uniform1f(U.uPpm, cam.ppm * dpr); gl.uniform2f(U.uPl, M.scale, M.scale / M.aspect);
    gl.uniform2f(U.uDr, M.depth[0], M.depth[1]); gl.uniform1f(U.uTan, TAN);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex.sprites.t); gl.uniform1i(U.tAt, 0); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex.depth.t); gl.uniform1i(U.tD, 1);
    var sp = [], wk = M.spr.walk, ar = M.spr.amr, w = st.walker;
    var fr = Math.floor(st.wd / wk.stride * 8) % 8;
    if (st.walkA > 0) sp.push({ x: w.x, y: w.y, s: wk.size, an: wk.anchor, ca: [fr, 4 + w.h], cb: [fr, 4 + w.h], mix: 1, al: st.walkA });
    for (var k = 0; k < 2; k++) { var A = AMRI[k]; var hd = ((Math.round(A.th / (Math.PI / 8)) % 16) + 16) % 16; sp.push({ x: A.x, y: A.y, s: ar.size, an: ar.anchor, ca: [hd % 8, hd >> 3], cb: [hd % 8, 2 + (hd >> 3)], mix: A.rev, al: 1 }); }
    sp.forEach(function (s) { s.d = depthOf(s.x, s.y, 0); }); sp.sort(function (a, b) { return b.d - a.d; });
    sp.forEach(function (s) {
      var b = Mxy(s.x, s.y, 0); gl.uniform4f(U.uR, b[0] - s.an[0] * s.s, b[1] - s.an[1] * s.s, s.s, s.s);
      gl.uniform2f(U.uCa, s.ca[0] / 8, s.ca[1] / 8); gl.uniform2f(U.uCb, s.cb[0] / 8, s.cb[1] / 8); gl.uniform1f(U.uMix, s.mix); gl.uniform1f(U.uAl, s.al); gl.uniform1f(U.uBy, b[1]); gl.uniform1f(U.uBd, s.d);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });
    // footsteps
    var stp = Math.floor(st.wd / (wk.stride / 2)); if (stp !== lastStep) { if (lastStep >= 0 && (i === 1 || i === 2) && st.walkA > 0) snd.step(); lastStep = stp; }

    // --- lines
    var D = M.due, q, a, b2;
    show(bayP, st.due); if (st.due > 0) bayP.setAttribute('points', [[D[0] - 1, D[1] - .9], [D[0] + 1, D[1] - .9], [D[0] + 1, D[1] + .9], [D[0] - 1, D[1] + .9]].map(function (v) { return scr(v[0], v[1], 0).map(function (n) { return n.toFixed(1); }).join(','); }).join(' '));
    show(trailP, st.trail * (st.wd > .3 ? .55 : 0));
    if (st.trail > 0) { var pts = [scr(WALK[0][0], WALK[0][1], 0)]; for (k = 1; k < w.seg; k++) pts.push(scr(WALK[k][0], WALK[k][1], 0)); pts.push(scr(w.x, w.y, 0)); trailP.setAttribute('points', pts.map(function (v) { return v[0].toFixed(1) + ',' + v[1].toFixed(1); }).join(' ')); }
    a = scr(D[0], D[1], 0); q = scr(M.hero[0], M.hero[1], 0); b2 = [lerp(a[0], q[0], st.meas), lerp(a[1], q[1], st.meas)];
    show(measL, st.measA * (st.meas > 0 ? 1 : 0)); show(measA, st.measA * (st.meas > 0 ? 1 : 0)); show(measB, st.measA * (st.meas >= 1 ? 1 : 0));
    measL.setAttribute('x1', a[0]); measL.setAttribute('y1', a[1]); measL.setAttribute('x2', b2[0]); measL.setAttribute('y2', b2[1]); measA.setAttribute('cx', a[0]); measA.setAttribute('cy', a[1]); measB.setAttribute('cx', q[0]); measB.setAttribute('cy', q[1]);
    var tg = scr(M.tag[0], M.tag[1], M.tag[2]), cyc = (time % 2.6) / 2.6, mx = Math.max.apply(null, M.ns);
    rays.forEach(function (r, k) {
      var an = scr(M.anch[k][0], M.anch[k][1], M.anch[k][2] - .12), e = [lerp(tg[0], an[0], st.lines), lerp(tg[1], an[1], st.lines)];
      show(r.l, st.linesA * (st.lines > 0 ? .9 : 0)); r.l.setAttribute('x1', tg[0]); r.l.setAttribute('y1', tg[1]); r.l.setAttribute('x2', e[0]); r.l.setAttribute('y2', e[1]);
      var t = cyc * 1.5 * mx / M.ns[k], vis = st.lines >= 1 && t <= 1 ? st.linesA : 0; show(r.d, vis); r.d.setAttribute('cx', lerp(tg[0], an[0], Math.min(1, t))); r.d.setAttribute('cy', lerp(tg[1], an[1], Math.min(1, t)));
      var la = i === 4 ? ease(seg(u, .5 + k * .06, .58 + k * .06)) : i === 5 ? 1 - seg(u, .1, .3) : 0; tl[k].style.opacity = la; tl[k].style.display = la > 0 ? '' : 'none';
      if (la > 0) { tl[k].style.transform = 'translate(' + (an[0] + 12).toFixed(1) + 'px,' + (an[1] - 24).toFixed(1) + 'px)'; if (!tl[k].textContent) tl[k].textContent = M.ns[k].toFixed(1) + ' ns'; }
    });
    if (i === 3 && u > .62 && !pulsed) { pulsed = true; snd.pulse(M.ns); } if (i < 3 || (i === 3 && u < .5)) pulsed = false;
    if (i === 4 && st.lines >= 1 && Math.floor(time / 2.6) !== frame.cy) { frame.cy = Math.floor(time / 2.6); snd.pulse(M.ns); }
    if (st.fix > .5 && !fixed) { fixed = true; snd.fix(); } if (i < 5) fixed = false;
    // the 10 cm bar, true to scale, beside the located point
    var hp = scr(M.hero[0], M.hero[1], 1.02), bw = .1 * cam.ppm, bx = hp[0] + 16, by = hp[1] + 22;
    [bar, barA, barB, barT].forEach(function (e) { show(e, st.fix); });
    if (st.fix > 0) { bar.setAttribute('x1', bx); bar.setAttribute('x2', bx + bw); bar.setAttribute('y1', by); bar.setAttribute('y2', by); barA.setAttribute('x1', bx); barA.setAttribute('x2', bx); barA.setAttribute('y1', by - 5); barA.setAttribute('y2', by + 5); barB.setAttribute('x1', bx + bw); barB.setAttribute('x2', bx + bw); barB.setAttribute('y1', by - 5); barB.setAttribute('y2', by + 5); barT.setAttribute('x', bx + bw + 14); barT.setAttribute('y', by + 5); }
    // --- dots
    things.forEach(function (t, n) {
      var a = t.hero ? (i === 5 ? ease(seg(u, .26, .36)) : i > 5 ? 1 : 0) : ease(seg(st.wave, t.at + .02, t.at + .06));
      if (i === 7 || i === 8) a = 1;
      if (a > .5 && !t.on && i === 6) snd.pop(n); t.on = a > .5;
      if (a <= 0) { if (t.vis) { t.el.style.opacity = 0; t.vis = false; } return; } t.vis = true;
      var s = scr(t.x, t.y, t.z), amb = t.amber && st.amber > .5; if (amb !== t.amb) { t.amb = amb; t.el.classList.toggle('w', amb); }
      t.el.style.opacity = a; t.el.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px) scale(' + (.4 + .6 * a + (amb ? .25 : 0)).toFixed(2) + ')';
    });
    // --- notes
    notes.forEach(function (n) {
      var inn;
      if (n.at === 'due') inn = st.due > .5 && i < 3; else if (n.at === 'mid') inn = i === 2 && st.meas >= 1 && u < .93;
      else if (n.bi === 3) inn = i === 3 && u > .5; else if (n.bi === 4) inn = i === 4 && st.anch > .7 && u < .97;
      else if (n.bi === 5) inn = i === 5 && st.fix > .4; else if (n.bi === 7) inn = i === 7 && (n.at === 'amr0' ? u > .2 && AMRI[0].x > 5 && AMRI[0].x < 20.5 && AMRI[0].y < 9.5 : st.amber > .5) && u < .96; else inn = n.bi === i;
      var pt = n.at === 'amr0' ? [AMRI[0].x, AMRI[0].y, 1.9] : M.pt[n.at], s = scr(pt[0], pt[1], pt[2]);
      if (phone ? s[1] < vh * .4 : s[0] < vw * .42) inn = false;          // never over the copy
      if (inn !== n.inn) { n.inn = inn; n.el.classList.toggle('in', inn); }
      if (Math.abs(n.bi - i) <= 1 || n.at === 'due') { n.el.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px)'; }
    });
    if (xyEl && i === 7) { var xv = 'x ' + AMRI[0].x.toFixed(1) + ' m, y ' + AMRI[0].y.toFixed(1) + ' m'; if (xv !== xyEl.t) { xyEl.t = xv; xyEl.textContent = xv; } }
    // --- clocks
    clocks.forEach(function (c) { var v = c.due ? fmt(c.base + st.wd / WTOT * 561, false) : fmt(c.base + time, true); if (v !== c.last) { c.last = v; c.el.textContent = v; } });
  }

  // ---- the loop: runs only while the section is on screen
  var raf = 0, lastT = 0, slow = 0, frames = 0;
  function tbOf(x) { var i = beatOf(x); return i + Math.min(1, (x - EDGE[i]) / (EDGE[i + 1] - EDGE[i])); }
  function tick(now) {
    raf = 0; if (!onScreen && !SHOT) { snd.gate(); return; }
    var dt = Math.min(.1, (now - lastT) / 1000 || .016); lastT = now;
    if (ps < 0) ps = p; else ps += (p - ps) * (1 - Math.exp(-dt * 8)); if (Math.abs(p - ps) < .00002) ps = p;
    setBeat(beatOf(p)); snd.gate(); textFrame(frozen ? frozen[0] : tbOf(ps));
    if (live) {
      if (frozen) frame(frozen[0], frozen[1]); else frame(tbOf(ps), (now - T0) / 1000);
      if (!FULL && frames < 90) { frames++; if (dt > .055) slow++; if (frames === 90 && slow > 45) { toStills(); } }
    }
    kick();
  }
  function kick() { if (!raf && (onScreen || SHOT)) raf = requestAnimationFrame(tick); }
  function onScroll() { readScroll(); if (near) start(); setBeat(beatOf(p)); kick(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  document.addEventListener('visibilitychange', function () { snd.gate(); kick(); });
  measure(); onScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.__flr = { seek: function (tb, time) { frozen = tb == null ? null : [tb, time || 0]; if (tb != null) setBeat(Math.min(NB - 1, Math.floor(tb))); kick(); }, ready: function () { return live; }, edges: EDGE };
})();
