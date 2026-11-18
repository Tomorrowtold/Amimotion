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
  var WGT = [.9, 1.5, 1.15, 1.1, 1.2, 1.1, 1.45, 1.25, 1.8], SUM = WGT.reduce(function (a, b) { return a + b; }, 0), UNIT = 32;   // vh of scroll per unit
  var EDGE = [0]; WGT.forEach(function (w) { EDGE.push(EDGE[EDGE.length - 1] + w / SUM); });
  S.style.setProperty('--flr-run', (SUM * UNIT) + 'vh');
  S.classList.add('flr-on');
  if (SHOT) S.classList.add('flr-shot');

  // ---- words
  // The copy owns the left side and tells one sentence at a time. Each line rises out of its own slot, each word lights as the scroll
  // passes it, and a word that names a thing in the picture is tied to that thing: it is underlined in the thing's colour and a hair
  // runs from its line to the thing at the moment the picture shows it.
  var col = document.createElement('div'); col.className = 'flr-col';
  var head = document.createElement('div'); head.className = 'flr-head'; head.innerHTML = '<span class="flr-hn"><b></b></span><span class="flr-hp"><i></i><i></i><i></i></span>';
  var roll = document.createElement('div'); roll.className = 'flr-roll'; col.appendChild(head); col.appendChild(roll); stage.insertBefore(col, cv);
  var dimEl = document.createElement('div'); dimEl.className = 'flr-dim'; dimEl.setAttribute('aria-hidden', 'true'); stage.insertBefore(dimEl, col);
  var cardEl = document.createElement('div'); cardEl.className = 'flr-card'; cardEl.setAttribute('aria-hidden', 'true'); stage.insertBefore(cardEl, col);
  var hn = head.querySelector('b'), hp = [].slice.call(head.querySelectorAll('i')), CH = ['Lost', 'Found', 'Seen'], chNow = -1;
  var SS = { 3: [.14, .5], 4: [.22, .46], 5: [.06, .34] };                            // when a sentence's words light, where the picture needs them later than usual
  var AS = { 3: [.5, .78], 6: [.44, .78], 7: [.46, .62], 8: [.2, .7] }, AW = { 6: [.44, .55, .66, .75], 8: [.2, .22, .24, .26, .6, .62, .64] };   // the same for the second line; some words are timed to things in the picture
  var KC = { due: 'amber', pallet: 'amber', walker: 'ink', mid: 'ink' };
  var blocks = beats.map(function (b, bi) {
    var t = b.querySelector('.flr-t'), ps = [], keys = [];
    [].forEach.call(t.querySelectorAll('.flr-s,.flr-a'), function (p) {
      var ans = p.classList.contains('flr-a'), toks = [];
      [].forEach.call(p.childNodes, function (n) {
        var k = n.nodeType === 1 ? n.getAttribute('data-k') : null;
        var tx = n.textContent, glue = !k && toks.length && /^\S/.test(tx);
        tx.split(/\s+/).forEach(function (w, q) { if (!w) return; if (glue && q === 0) toks[toks.length - 1][2] = w; else toks.push([w, k, '']); });
      });
      var sp = ans ? (AS[bi] || [.46, .62]) : (SS[bi] || [.04, .28]), words = toks.map(function (tk, k) {
        var e = document.createElement('span'); e.className = 'w' + (tk[1] ? ' k k-' + (KC[tk[1]] || 'blue') : ''); e.textContent = tk[0];
        var m = /^(.*?)([.,]+)$/.exec(tk[0]); var tail = tk[2] || ''; if (tk[1] && m) { e.textContent = m[1]; tail = m[2] + tail; }
        var w = { el: e, at: ans && AW[bi] ? AW[bi][k] : sp[0] + (sp[1] - sp[0]) * k / toks.length, v: -1, key: tk[1], tail: tail };
        if (tk[1]) { var K = keys.filter(function (x) { return x.k === tk[1]; })[0]; if (!K) { K = { k: tk[1], at: w.at, ws: [], c: KC[tk[1]] || 'blue' }; keys.push(K); } K.ws.push(w); }
        return w;
      });
      ps.push({ el: p, ans: ans, words: words, lines: [], t0: sp[0], A: 0 });
    });
    roll.appendChild(t); return { el: t, ps: ps, keys: keys, vis: null, E: 0, X: 0 };
  });
  function split() {                                                                   // wrap every visual line in its own slot
    blocks.forEach(function (b) {
      b.el.style.display = 'block';
      b.ps.forEach(function (p) {
        p.el.textContent = ''; p.words.forEach(function (w, k) { if (k) p.el.appendChild(document.createTextNode(' ')); p.el.appendChild(w.el); if (w.tail) p.el.appendChild(document.createTextNode(w.tail)); });
      });
    });
    blocks.forEach(function (b) {
      b.ps.forEach(function (p) {
        var rows = [], top = null; p.words.forEach(function (w) { var y = w.el.offsetTop; if (top === null || Math.abs(y - top) > 4) { rows.push([]); top = y; } rows[rows.length - 1].push(w); });
        p.rows = rows;
      });
    });
    blocks.forEach(function (b) {
      var j = 0;
      b.ps.forEach(function (p) {
        p.el.textContent = ''; p.lines = p.rows.map(function (row) {
          var ln = document.createElement('span'); ln.className = 'flr-ln'; var li = document.createElement('span'); li.className = 'flr-li'; ln.appendChild(li); p.el.appendChild(ln);
          row.forEach(function (w, k) { if (k) li.appendChild(document.createTextNode(' ')); li.appendChild(w.el); if (w.tail) li.appendChild(document.createTextNode(w.tail)); w.v = -1; w.row = ln; });
          return { ln: ln, li: li, j: j++, y: null };
        });
      });
      b.keys.forEach(function (K) { K.h = b.el.offsetHeight; });
      b.vis = null; b.el.style.display = '';
    });
    textFrame.tb = null;
  }
  function easeO(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return 1 - Math.pow(1 - x, 4); }
  function easeI(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * x; }
  var leads = [];
  function chase(v, t, up, dn, dt) { return t > v ? Math.min(t, v + dt / up) : Math.max(t, v - dt / dn); }
  function textFrame(tb, dt) {
    var i = Math.min(NB - 1, Math.floor(tb)), u = Math.min(1, tb - i), ch = Math.min(2, Math.floor(i / 3));
    if (ch !== chNow) { if (live && onScreen && (ch > chNow || chNow < 0) && ap > .6 && Math.abs(textFrame.v || 0) < 2.5) { cardEl.textContent = CH[ch]; cardEl.classList.remove('go'); void cardEl.offsetWidth; cardEl.classList.add('go', 'c' + ch); cardEl.classList.remove('c' + (ch ? ch - 1 : 2)); } chNow = ch; hn.textContent = CH[ch]; hn.classList.remove('sw'); void hn.offsetWidth; hn.classList.add('sw'); }
    hp.forEach(function (e, k) { var f = Math.max(0, Math.min(1, tb - ch * 3 - k)); if (f !== e.f) { e.f = f; e.style.setProperty('--f', f.toFixed(3)); } });
    head.style.opacity = ease(seg(ap, .3, .7));
    leads.length = 0;
    // Every sentence, line and word is a function of the same scroll value as the picture, so nothing lags or runs ahead.
    // Sentence k rises in over the first part of its beat and leaves over the last part: two sentences can never share the screen.
    // During a fast fling (a menu jump, a hard flick) the words step back and return the moment the scroll settles.
    var calm = 1 - seg(Math.abs(textFrame.v || 0), 1.6, 4.5); calm = Math.round(calm * 20) / 20;
    blocks.forEach(function (b, k) {
      var e = k === 0 ? Math.max(seg(ap, .45, .85), seg(tb, 0, .02)) : seg(tb, k, k + .16), x = k < NB - 1 ? seg(tb, k + .9, k + 1) : 0;
      var vis = e > 0 && x < 1, uu = k < i ? 1 : k > i ? 0 : u;
      if (vis !== b.vis) { b.vis = vis; b.el.style.visibility = vis ? 'visible' : 'hidden'; }
      if (!vis) return;
      if (calm !== b.calm) { b.calm = calm; b.el.style.opacity = calm < 1 ? calm : ''; }
      b.ps.forEach(function (p) {
        var a = p.ans ? (k < i ? 1 : ease(seg(uu, p.t0 - .12, p.t0 + .02))) : e;
        p.lines.forEach(function (l, n) {
          var en = easeO(seg(a, n * .16, n * .16 + .62)), ex = easeI(seg(x, l.j * .09, l.j * .09 + .55)), y = Math.round(((1 - en) * 108 - ex * 108) * 10) / 10;
          if (y !== l.y) { l.y = y; l.li.style.transform = y ? 'translate3d(0,' + y + '%,0)' : ''; }
        });
        p.words.forEach(function (w) {
          var v = ease(seg(uu, w.at, w.at + .08)); v = Math.round(v * 40) / 40;
          if (v !== w.v) { w.v = v; w.el.style.opacity = (.26 + .74 * v).toFixed(3); }
        });
      });
      if (k === NB - 1) { var cn = b.el.querySelector('.flr-count'); if (cn) cn.style.opacity = ease(seg(uu, .66, .8)); }
      b.keys.forEach(function (K) {
        var at = k === 0 ? .1 : K.at, kv = ease(seg(uu, at, at + .1)) * (1 - seg(x, 0, .25)); kv = Math.round(kv * 50) / 50;
        if (kv !== K.v) { K.v = kv; K.ws.forEach(function (w) { w.el.style.setProperty('--kv', kv); }); }
        if (k === i && K.k[0] !== 'L') leads.push({ K: K, d: seg(u, at + .03, at + .2), a: Math.min(seg(u, at + .03, at + .06), 1 - seg(u, .84, .9)) });
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
  var ap = 1, vw = 0, vh = 0, dpr = 1, phone = false, p = 0, ps = -1, bi = -1, live = false, stills = false, onScreen = false, near = false;
  function measure() {
    var r = stage.getBoundingClientRect(); vw = r.width; vh = r.height; phone = vw / vh < .8;
    dpr = Math.min(window.devicePixelRatio || 1, phone ? 2 : 1.75);
    if (live) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); }
    ov.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh); S.querySelector('.flr-lead').setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    notes.forEach(function (n) {
      var o = phone ? n.om : n.o; n.sp.style.left = o[0] + 'px'; n.sp.style.top = o[1] + 'px';
      var w = n.sp.offsetWidth, h = n.sp.offsetHeight, ex = o[0] >= 0 ? o[0] - 7 : o[0] + w + 7, ey = o[1] + (o[1] < 0 ? h - 4 : 4);
      if (n.at === 'mid') { n.hair.style.display = n.pin.style.display = 'none'; return; }
      n.hair.style.width = Math.hypot(ex, ey) + 'px'; n.hair.style.transform = 'rotate(' + Math.atan2(ey, ex) + 'rad)';
    });
    split();
  }
  // Once the whole story has been scrolled and left behind, the section folds to one screen: coming back shows the last picture only.
  var done = false, seenEnd = false, RUN = SUM * UNIT;
  function fold() {
    done = true; var b0 = S.getBoundingClientRect().bottom; S.classList.add('flr-done'); S.style.setProperty('--flr-run', '0vh');
    var d = S.getBoundingClientRect().bottom - b0; if (d) window.scrollBy({ top: d, behavior: 'instant' });
  }
  // The fold moves the page by a whole story's height, so it waits until the page is still: a jump in the middle of a
  // flick would stop the flick dead on phones (and read as lag).
  var foldT = 0;
  function foldSoon() { clearTimeout(foldT); foldT = setTimeout(function () { var r = S.getBoundingClientRect(); if (!done && seenEnd && r.bottom <= 0) fold(); }, 400); }
  function unfold(g) {
    done = false; seenEnd = false; S.classList.remove('flr-done'); S.style.setProperty('--flr-run', RUN + 'vh'); ps = -1;
    var r = S.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top + (g ? (EDGE[g] + .012) * (r.height - vh) : 0), behavior: 'instant' });
  }
  function readScroll() {
    var r = S.getBoundingClientRect(), run = r.height - vh; p = done ? 1 : run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    if (p > .985) seenEnd = true;
    if (seenEnd && !done && !SHOT && r.bottom <= 0) foldSoon();
    ap = r.top > 0 ? Math.max(0, Math.min(1, 1 - r.top / vh)) : 1;
    onScreen = r.top < vh && r.bottom > 0; near = r.top < vh * 1.3 && r.bottom > -vh;
    topA.classList.toggle('show', done || (r.top < -vh * .4 && r.bottom > vh));
  }
  function beatOf(x) { for (var i = NB - 1; i >= 0; i--) if (x >= EDGE[i]) return i; return 0; }
  function setBeat(i) {
    if (i === bi) return; var was = bi; bi = i;
    beats.forEach(function (b, k) { b.classList.toggle('on', k === i); b.classList.toggle('flr-near', Math.abs(k - i) <= 1); });
    rail.forEach(function (a) { var g = +a.getAttribute('data-go'); a.classList.toggle('on', i >= g && (g === 6 || i < g + 3)); });
    stage.style.setProperty('--end', 0);
    if (was >= 0 && !frozen) { snd.beat(i, was); if (i === NB - 1 && was === NB - 2) hap.land(); else hap.beat(); }
  }
  rail.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var g = +a.getAttribute('data-go'); if (done) { unfold(g); return; } var r = S.getBoundingClientRect(), run = r.height - vh;
      window.scrollTo({ top: window.scrollY + r.top + (EDGE[g] + .012) * run, behavior: 'smooth' });
    });
  });

  // Scrolling is the browser's own here too (18 Nov): copy, picture and sound follow the scroll position, so nothing
  // hijacks the wheel or the finger, and no non-passive listener slows scrolling elsewhere on the page.

  var reB = S.querySelector('.flr-re'); if (reB) reB.addEventListener('click', function () { unfold(0); });

  // ---- sound: made here, nothing to download. It starts only after a tap, a click or a key.
  var snd = (function () {
    var on = true, ctx = null, out = null, air = null, lastPop = 0, roomG = null, roomV = -1;
    try { if (localStorage.getItem('flr-snd2') === '0') on = false; } catch (e) {}
    function label() { sndB.textContent = on ? 'Sound on' : 'Sound off'; sndB.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    // Browsers keep a page silent until the first click, tap or key. Until then a quiet line says that one click anywhere starts the sound.
    var hint = document.createElement('span'); hint.className = 'flr-hint'; hint.setAttribute('aria-hidden', 'true');
    hint.textContent = (matchMedia('(hover:none)').matches ? 'Tap' : 'Click') + ' anywhere for sound'; head.appendChild(hint);
    function hintSet() { hint.classList.toggle('show', on && onScreen && !(ctx && ctx.state === 'running')); }
    label();
    function boot() {
      if (ctx || !on) return; var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC(); ctx.onstatechange = hintSet; out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
      var n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0), v = 0;
      for (var i = 0; i < n; i++) { v = (v + (Math.random() * 2 - 1) * .02) / 1.02; d[i] = v * 3.2; }
      air = ctx.createBufferSource(); air.buffer = buf; air.loop = true; var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; var g = ctx.createGain(); g.gain.value = .5; roomG = g;
      air.connect(f); f.connect(g); g.connect(out); air.start();
      var hum = ctx.createOscillator(), hg = ctx.createGain(); hum.frequency.value = 55; hg.gain.value = .035; hum.connect(hg); hg.connect(g); hum.start();   // the plant's own low hum, under the air
    }
    ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'].forEach(function (ev) { window.addEventListener(ev, function () { boot(); if (ctx && ctx.state === 'suspended') ctx.resume(); hintSet(); }, { passive: true }); });
    sndB.addEventListener('click', function () { on = !on; try { localStorage.setItem('flr-snd2', on ? '1' : '0'); } catch (e) {} label(); if (on) boot(); hintSet(); });
    function gate() { hintSet(); if (!ctx) return; var t = (on && onScreen && !document.hidden) ? .55 : 0; out.gain.setTargetAtTime(t, ctx.currentTime, .25); }
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
      tock: function (v) { if (!ctx || !on || !onScreen) return; tone(2093, 0, .045, v * .5, 'square'); tick(v); },
      room: function (v) { v = Math.round(v * 20) / 20; if (!roomG || v === roomV) return; roomV = v; roomG.gain.setTargetAtTime(.5 * v + .02, ctx.currentTime, .35); },
      pop: function (k) { var n = performance.now(); if (n - lastPop < 45) return; lastPop = n; tone(SC[k % SC.length], 0, .5, .085); },
      tag: function () { tone(1318.5, 0, .45, .085); tone(1975.5, .035, .55, .04); },
      warn: function () { tone(392, 0, .7, .06, 'triangle'); tone(311.1, .14, .9, .05, 'triangle'); },
      isOn: function () { return on; },
      fix: function () { tone(659.25, 0, .9, .09); tone(987.77, .09, 1.1, .07); },
      beat: function (i, was) { if (i === NB - 1 && was === NB - 2) { tone(261.6, 0, 2.2, .07); tone(392, .05, 2.2, .06); tone(659.25, .1, 2.4, .05); } else tone(i > was ? 196 : 174.6, 0, .22, .07, 'triangle'); }
    };
  })();

  // ---- touch feel: a short tick from the phone's motor, only where the picture does something you would feel.
  // Android browsers allow it after the first tap; iPhone Safari gives web pages no vibration at all, so there it stays still.
  // It follows the sound switch, and stays off for people who ask their device for reduced motion.
  var hap = (function () {
    var ok = 'vibrate' in navigator && !matchMedia('(prefers-reduced-motion: reduce)').matches, last = 0;
    function go(pat, gap) {
      if (!ok || !snd.isOn() || !onScreen || document.hidden || SHOT) return; var ua = navigator.userActivation; if (ua && !ua.hasBeenActive) return;
      if (Math.abs(textFrame.v || 0) > 2.5) return; var n = performance.now(); if (n - last < (gap || 90)) return; last = n; try { navigator.vibrate(pat); } catch (e) {}
    }
    return { tick: function () { go(9); }, beat: function () { go(14, 160); }, land: function () { go([12, 60, 22], 200); } };
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
  // the trolley's recorded journey, from the line where it was filled to the corner where it stopped
  var TRIP = [[11.2, 15.2], [9.4, 14.6], [9.4, 9.6], [28.6, 9.6], [28.6, 4.9], [27.1, 4.5]], TL = [0], TTOT = 0;
  for (var ti = 1; ti < TRIP.length; ti++) { TTOT += Math.hypot(TRIP[ti][0] - TRIP[ti - 1][0], TRIP[ti][1] - TRIP[ti - 1][1]); TL.push(TTOT); }
  function tripAt(d) { d = Math.max(0, Math.min(TTOT, d)); for (var i = 1; i < TRIP.length; i++) if (d <= TL[i] || i === TRIP.length - 1) { var t = (d - TL[i - 1]) / (TL[i] - TL[i - 1]); return { x: lerp(TRIP[i - 1][0], TRIP[i][0], t), y: lerp(TRIP[i - 1][1], TRIP[i][1], t), seg: i }; } }
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
      case 0: var e0 = ease5(seg(u, .08, .5)); return phone ? { f: [lerp(14.5, 10.2, e0), lerp(10, 15.2, e0), .6], s: lerp(34, 14, e0) } : { f: [lerp(15.6, 10.6, e0), lerp(9.6, 15.2, e0), .6], s: lerp(41, 26, e0) };
      case 1: return phone ? { f: [lerp(w.x, 12, .25), lerp(w.y, 10, .25), .8], s: 17 } : { f: [lerp(w.x, 14, .55), lerp(w.y, 10, .6), .6], s: 31 };
      case 2: var e = ease(seg(u, .5, .95)); return phone ? { f: [lerp(21, H[0], e), lerp(9.5, H[1], e), .6], s: lerp(26, 11, e) } : { f: [lerp(19.5, H[0] - 1, e), lerp(10.2, H[1] + .4, e), .6], s: lerp(33, 15, e) };
      case 3: return phone ? { f: [T[0], T[1], T[2] - .01], s: .17 } : { f: [T[0], T[1], T[2]], s: .22 };
      case 4: return phone ? { f: [20.5, 8.6, .5], s: 20.5 } : { f: [19, 9.8, .5], s: 29 };
      case 5: return phone ? { f: [H[0], H[1], .8], s: 5.4 } : { f: [H[0] - .2, H[1], .8], s: 8.4 };
      case 6: return phone ? { f: [14.5, 10, .5], s: 31 } : { f: [16, 9.6, .5], s: 38 };
      case 7: return phone ? { f: [15.5, 9.6, .5], s: 28 } : { f: [16.4, 9.4, .5], s: 35 };
      case 9: var L9 = shotOf(8, 1, st), e9 = ease5(seg(u, .06, .56)), T9 = phone ? { f: [WALK[0][0], WALK[0][1] - .6, .9], s: 10 } : { f: [WALK[0][0] - .4, WALK[0][1] - .2, .9], s: 16 };
        return { f: [0, 1, 2].map(function (k) { return lerp(L9.f[k], T9.f[k], e9); }), s: Math.exp(lerp(Math.log(L9.s), Math.log(T9.s), e9)) };
      default: var e8 = i === 8 ? ease5(seg(u, .3, .8)) : 1; return phone ? { f: [lerp(14.5, 16.7, e8), lerp(10, 7.8, e8), lerp(.5, 9.5, e8)], s: lerp(34, 48, e8) } : { f: [lerp(15.6, 14.6, e8), lerp(9.6, 10.4, e8), lerp(.5, 10, e8)], s: lerp(41, 62, e8) };
    }
  }
  var MOVE = [0, .4, .3, .44, .5, .42, .42, .4, .2, 0];      // the share of each sentence's scroll in which the camera travels to it; then it rests
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
    // the clock runs straight on; his walk stops twice: at the first corner he looks both ways, at the dead end he just stands
    st.clk = i < 1 ? 0 : i === 1 ? .7 * ease(seg(u, .12, 1)) : i === 2 ? .7 + .3 * ease(seg(u, 0, .6)) : 1;
    var c1 = WL[2], c2 = WL[3], d1 = .7 * WTOT, d, pose = null;
    if (i < 1) { d = 0; pose = [1, 1]; }
    else if (i === 1) {
      if (u < .12) { d = 0; pose = [1, 1]; } else if (u < .32) d = c1 * seg(u, .12, .32); else if (u < .44) { d = c1; pose = [u < .38 ? 1 : 2, 3]; }
      else if (u < .54) d = lerp(c1, c2, seg(u, .44, .54)); else if (u < .66) { d = c2; pose = [3, 2]; } else d = lerp(c2, d1, seg(u, .66, 1));
    } else if (i === 2) { d = lerp(d1, WTOT, ease(seg(u, 0, .6))); if (u >= .6) pose = [4, 3]; }
    else { d = WTOT; pose = i < 6 ? [0, 2] : [i === 9 && u > .55 && u < .68 ? 6 : 5, 1]; }
    st.wd = d; st.walker = i < 6 ? walkAt(d) : { x: WALK[0][0], y: WALK[0][1], h: 1, seg: 1 }; st.pose = pose;
    st.walkA = i < 3 ? 1 : i === 3 ? 1 - seg(u, 0, .2) : i === 4 ? seg(u, .3, .5) : i === 5 ? 1 - seg(u, .88, 1) : i === 6 ? seg(u, .3, .5) : 1;
    // his wasted walk stays on the floor while the trolley's own journey is drawn beside it
    st.trail = i === 1 ? 1 : i === 2 ? 1 : i === 3 ? 1 : i === 4 ? 1 : i === 5 ? 1 - seg(u, .1, .3) : 0;
    // the turn: the light drops and the plant goes quiet for a moment before Found
    st.dim = i === 2 ? ease(seg(u, .8, 1)) : i === 3 ? 1 - ease(seg(u, .05, .3)) : 0;
    // window light crawling across the floor while the minutes pass
    st.shaft = [0, 0];
    // focus: the far plant goes soft on the close shots
    st.dof = 0;   // everything stays sharp: the plant is read in full detail
    st.fp = i <= 4 ? M.tag : i === 5 ? [M.hero[0], M.hero[1], .9] : [WALK[0][0], WALK[0][1], .9];
    st.due = i <= 2 ? (i === 0 ? seg(u, .1, .22) : 1) : i === 3 ? 1 - seg(u, 0, .25) : 0;
    st.meas = i === 2 ? ease(seg(u, .08, .42)) : 0; st.measA = i === 2 ? 1 : i === 3 ? 1 - seg(u, 0, .25) : 0;
    st.tag = i < 3 ? 0 : i === 3 ? ease(seg(u, .3, .44)) : 1;
    st.lines = 0; st.linesA = 0; st.anch = 0;
    st.trip = i < 4 ? 0 : i === 4 ? ease(seg(u, .3, .8)) : 1;
    st.tripA = i < 4 ? 0 : i === 4 ? seg(u, .26, .32) : i === 5 ? 1 - seg(u, .14, .34) : 0;
    st.heroC = i < 5 ? 0 : i === 5 ? ease(seg(u, .2, .34)) : 1;
    st.fix = i === 5 ? ease(seg(u, .46, .6)) : 0;
    st.wave = i < 6 ? 0 : i === 6 ? u : 2;
    st.all = i < 6 ? 0 : i === 6 ? ease(seg(u, .86, .97)) : 1;
    st.dots = i < 5 ? 0 : 1;
    st.amber = i === 7 ? ease(seg(u, .56, .68)) : i >= 8 ? 1 : 0;
    st.l1 = i < 8 ? 0 : i === 8 ? ease(seg(u, .2, .3)) : 1; st.l2 = 0; st.l3 = i < 8 ? 0 : i === 8 ? ease5(seg(u, .34, .8)) : 1 - ease(seg(u, .02, .32));
    // sunlight: Lost stands under a flat sky. Light opens around the first thing that is located, then crosses the whole floor.
    st.sun = i < 5 ? 0 : i === 5 ? 4.5 * ease(seg(u, .2, .5)) : i === 6 ? lerp(4.5, 48, ease(seg(u, .03, .42))) : 99;
    // colour script: Lost is a cold, drained morning; the light that comes with the first located trolley warms the plant for good
    st.cool = i < 3 ? 1 : i === 3 ? lerp(1, .6, ease(seg(u, .2, .9))) : i === 4 ? .6 : i === 5 ? lerp(.6, .12, ease(seg(u, .2, .6))) : i === 6 ? lerp(.12, 0, seg(u, 0, .5)) : 0;
    st.axes = i < 5 ? 0 : i === 5 ? seg(u, .5, .7) : 1;
    return st;
  }

  // ---- overlay pieces (SVG)
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, c) { var e = document.createElementNS(NS, n); if (c) e.setAttribute('class', c); ov.appendChild(e); return e; }
  var bayP = el('polygon', 'l-bay'), trailP = el('polyline', 'l-trail'), measL = el('line', 'l-ink'), measA = el('circle', 'f-ink'), measB = el('circle', 'f-ink');
  var rays = [0, 1, 2].map(function () { return { l: el('line', 'l-blue'), d: el('line', 'l-pulse') }; });
  var tripP = el('polyline', 'l-trip'), tripC = [], tripH = el('circle', 'f-head'); tripH.setAttribute('r', 5);
  for (var tc = 1.4; tc < TTOT; tc += 1.4) { var cc = el('circle', 'f-crumb'); cc.setAttribute('r', 2.4); tripC.push({ e: cc, d: tc }); }
  var bar = el('line', 'l-ink'), barA = el('line', 'l-ink'), barB = el('line', 'l-ink'), barT = el('text');
  barT.setAttribute('style', 'font:500 14px "AmI Text",Arial,sans-serif;fill:#0b1238;paint-order:stroke;stroke:#f4f7fc;stroke-width:4px;stroke-linejoin:round'); barT.textContent = '10 cm';
  [measA, measB].forEach(function (c) { c.setAttribute('r', 3.5); }); 
  var tl = [0, 1, 2].map(function () { var d = document.createElement('div'); d.className = 'flr-dot'; d.style.cssText = 'width:auto;height:auto;margin:0;border-radius:0;background:none;box-shadow:none;font:500 14px/1 "AmI Text",Arial,sans-serif;color:#1f6bff;white-space:nowrap;paint-order:stroke;-webkit-text-stroke:0;text-shadow:0 0 1px #fff,0 0 2px #fff;font-variant-numeric:tabular-nums'; dotsEl.appendChild(d); return d; });
  var axG = el('g', 'l-axes'), axT = [];
  (function () { for (var k = 0; k <= 10; k++) { var l = document.createElementNS(NS, 'line'); axG.appendChild(l); var t = document.createElementNS(NS, 'text'); axG.appendChild(t); axT.push({ l: l, t: t, x: k <= 6 ? k * 5 : 30, y: k <= 6 ? 0 : (k - 6) * 5, ex: k > 6 }); } })();
  // the three layers: the floor with its tags, the anchors above, the live map on top
  var LZ = [0, 0], layG = el('g', 'l-lay'), lay2 = document.createElementNS(NS, 'polygon'), lay3 = document.createElementNS(NS, 'polygon'), layP = [0, 1, 2, 3].map(function () { var l = document.createElementNS(NS, 'line'); l.setAttribute('class', 'post'); layG.appendChild(l); return l; });
  lay2.setAttribute('class', 'pl'); lay3.setAttribute('class', 'pl top'); layG.appendChild(lay2);
  var layA = [0, 1, 2].map(function () { var l = document.createElementNS(NS, 'line'); l.setAttribute('class', 'drop'); layG.appendChild(l); var r = document.createElementNS(NS, 'rect'); r.setAttribute('width', 7); r.setAttribute('height', 7); r.setAttribute('class', 'an'); layG.appendChild(r); return { l: l, r: r }; });
  layG.appendChild(lay3); var layL = [[17, 11.4, 17, 19], [19.5, 11.4, 19.5, 19], [17, .9, 17, 7.6], [19.5, .9, 19.5, 7.6], [1.2, 8, 16.6, 8], [19.9, 8, 29, 8], [1.2, 11, 16.6, 11], [19.9, 11, 29, 11]].map(function (q) { var l = document.createElementNS(NS, 'line'); l.setAttribute('class', 'aisle'); layG.appendChild(l); return { l: l, q: q }; }), layD = [];
  function poly(e, z) { e.setAttribute('points', [[0, 0], [30, 0], [30, 20], [0, 20]].map(function (v) { var q = scr(v[0], v[1], z); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ')); }
  var lead = S.querySelector('.flr-lead'), leadEls = [0, 1].map(function () { var pth = document.createElementNS(NS, 'path'); lead.appendChild(pth); var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 3); lead.appendChild(c); return { p: pth, c: c }; });
  var scaleEl = S.querySelector('.flr-scale'), scaleI = scaleEl.querySelector('i'), scaleT = scaleEl.querySelector('span'), NICE = [.02, .05, .1, .2, .5, 1, 2, 5, 10, 20];
  var searchEl = S.querySelector('[data-search]'), walkedEl = S.querySelector('[data-walked]');
  function show(e, a) { e.style.opacity = a; e.style.display = a > .003 ? '' : 'none'; }

  // ---- WebGL
  var VS1 = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS1 = 'precision highp float;uniform vec2 uRes,uA,uF,uPl;uniform float uPpm;uniform sampler2D tWc,tWk,tMc,tMk,tCc,tCk,tXc,tXk,tWi,tMi,tCi,tXi,tLut;uniform vec4 uMid,uClose,uMac,uTx,uSun;uniform vec3 uW;uniform vec2 uO,uIa,uIb,uDr;uniform float uDay,uCool,uDof,uFd;uniform vec2 uSh;uniform sampler2D tD;float gF;' +
    'vec3 grade(vec3 col,float L,float dn,vec2 s){float lum=dot(col,vec3(.2126,.7152,.0722));float q=uCool*(1.-.6*L);float wv=L*(1.-uCool);col=mix(col,col*col*(3.-2.*col),.1+.1*wv);col=mix(col,vec3(lum)*vec3(.9,.94,1.03),q*.22);col*=1.-.025*q;col+=wv*(vec3(.05,.025,-.035)*(1.-.35*uDay)*smoothstep(.3,1.,lum)+vec3(-.02,-.006,.03)*(1.-smoothstep(0.,.55,lum)));col=mix(col,mix(vec3(.8,.85,.94),vec3(.98,.95,.9),wv),smoothstep(.3,1.,dn)*(.05-.03*wv));float vg=smoothstep(.45,1.2,length((s-uA)/uRes.y));col*=1.-vg*.03;return clamp(col,0.,1.);}' +
    'float edge(vec2 u){vec2 d=min(u,1.-u);return smoothstep(0.,.07,min(d.x,d.y));}float r1(sampler2D t,vec2 u){float id=texture2D(t,u).r*255.;float v=texture2D(tLut,vec2((id+.5)/256.,.5)).r;return id<.5?max(v,gF):v;}float rv(sampler2D t,vec2 u,float d){vec2 o=vec2(d*.5,d*.5*uRes.x/uRes.y*0.+d*.5);return(r1(t,u+vec2(-o.x,-o.y))+r1(t,u+vec2(o.x,-o.y))+r1(t,u+vec2(-o.x,o.y))+r1(t,u+vec2(o.x,o.y)))*.25;}' +
    'void main(){vec2 s=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);vec2 m=(s-uA)/uPpm+uF;vec2 uv=m/uPl;vec2 wq=uv-uO;gF=1.-smoothstep(uSun.z-uSun.w,uSun.z,distance(vec2(dot(uIa,wq),dot(uIb,wq)),uSun.xy));' +
    'vec4 dd=texture2D(tD,uv);float dn=(dd.r*65280.+dd.g*255.)/65535.;float bb=uDof*smoothstep(.08,2.2,abs(dn-uFd)*(uDr.y-uDr.x));' +
    'vec4 c=vec4(0.);if(uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.)c=mix(texture2D(tWk,uv,bb),texture2D(tWc,uv,bb),rv(tWi,uv,uTx.x));' +
    'if(uW.x>0.){vec2 u=(uv-uMid.xy)/uMid.zw;if(u.x>0.&&u.x<1.&&u.y>0.&&u.y<1.)c=mix(c,mix(texture2D(tMk,u,bb),texture2D(tMc,u,bb),rv(tMi,u,uTx.y)),edge(u)*uW.x);}' +
    'if(uW.y>0.){vec2 u=(uv-uClose.xy)/uClose.zw;if(u.x>0.&&u.x<1.&&u.y>0.&&u.y<1.)c=mix(c,mix(texture2D(tCk,u,bb),texture2D(tCc,u,bb),rv(tCi,u,uTx.z)),edge(u)*uW.y);}' +
    'if(uW.z>0.){vec2 u=(uv-uMac.xy)/uMac.zw;if(u.x>0.&&u.x<1.&&u.y>0.&&u.y<1.)c=mix(c,mix(texture2D(tXk,u,bb),texture2D(tXc,u,bb),rv(tXi,u,uTx.w)),edge(u)*uW.z);}' +
    'float L=max(gF,uDay);c.rgb*=mix(vec3(.9,.92,.955),vec3(1.),L);' +
    'vec2 wf=vec2(dot(uIa,wq),dot(uIb,wq));vec2 gp=fract(wf/vec2(7.5,6.6))-.5;float pool=smoothstep(.44,.08,length(gp*vec2(1.,1.25)));' +
    'if(c.a>.001){vec3 col=c.rgb/c.a;col+=vec3(.06,.035,0.)*gF*(1.-gF)*4.*(1.-uDay);float pr=dot(wf,vec2(.8,-.6))-uSh.x;float sh=uSh.y*(exp(-pr*pr/1.3)+.7*exp(-(pr-3.4)*(pr-3.4)/1.3));col=col*(1.+sh)+sh*vec3(.035,.025,.0);c.rgb=grade(col,L,dn,s)*c.a;}gl_FragColor=c;}';
  var VS2 = 'attribute vec2 a;uniform vec2 uRes,uA,uF;uniform float uPpm;uniform vec4 uR;varying vec2 vU,vM;void main(){vU=a;vM=uR.xy+a*uR.zw;vec2 s=uA+(vM-uF)*uPpm;gl_Position=vec4(s.x/uRes.x*2.-1.,1.-s.y/uRes.y*2.,0.,1.);}';
  var FS2 = 'precision highp float;varying vec2 vU,vM;uniform sampler2D tAt,tD;uniform vec2 uCa,uCb,uPl,uDr,uRes,uA,uK;uniform float uMix,uAl,uBy,uBd,uTan,uCool,uDay;' +
    'vec3 grade(vec3 col,float L,float dn,vec2 s){float lum=dot(col,vec3(.2126,.7152,.0722));float q=uCool*(1.-.6*L);float wv=L*(1.-uCool);col=mix(col,col*col*(3.-2.*col),.1+.1*wv);col=mix(col,vec3(lum)*vec3(.9,.94,1.03),q*.22);col*=1.-.025*q;col+=wv*(vec3(.05,.025,-.035)*(1.-.35*uDay)*smoothstep(.3,1.,lum)+vec3(-.02,-.006,.03)*(1.-smoothstep(0.,.55,lum)));col=mix(col,mix(vec3(.8,.85,.94),vec3(.98,.95,.9),wv),smoothstep(.3,1.,dn)*(.05-.03*wv));float vg=smoothstep(.45,1.2,length((s-uA)/uRes.y));col*=1.-vg*.03;return clamp(col,0.,1.);}' +
    'void main(){vec2 q=clamp(vU,.004,.996)*uK;vec4 c=mix(texture2D(tAt,uCb+q),texture2D(tAt,uCa+q),uMix);vec3 un=c.rgb/max(c.a,.001);float shd=step(.08,un.b-un.r)*step(un.r,.16)*step(c.a,.6);vec2 eu=min(vU,1.-vU);c*=mix(1.,.6*smoothstep(0.,.16,min(eu.x,eu.y)),shd);vec4 dd=texture2D(tD,vM/uPl);float D=uDr.x+(dd.r*65280.+dd.g*255.)/65535.*(uDr.y-uDr.x);' +
    'float dy=uBy-vM.y;float fd=uBd-(dy>0.?dy*uTan:-dy/uTan);if(c.a>.001)c.rgb=grade(c.rgb/c.a,max(uDay,1.-uCool),(D-uDr.x)/(uDr.y-uDr.x),vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y))*c.a;gl_FragColor=c*uAl*smoothstep(-.75,-.3,D-fd);}';
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
    var names = ['wide_col', 'wide_clay', 'mid_col', 'mid_clay', 'close_col', 'close_clay', 'macro_col', 'macro_clay', 'sprites', 'poses'];
    var idn = ['wide_id', 'mid_id', 'close_id', 'macro_id'];
    // floor.json is always checked with the server and names the present set of pictures, so a new set is never mixed with a kept old one
    fetch(base + 'floor.json').then(function (r) { return r.json(); }).then(function (m) {
      var q = m.v ? '?v=' + m.v : '';
      return Promise.all([m, loadImg(base + 'depth.png' + q)].concat(names.map(function (n) { return loadImg(base + L + n + '.webp' + q); }), idn.map(function (n) { return loadImg(base + L + n + '.png' + q); })));
    }).then(function (r) {
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
    M.pt = { stop: [27, 4.5, 1.02], due: [M.due[0], M.due[1], 0], hero: [H[0], H[1], 1.02], tag: M.tag, a0: M.anch[0], a1: M.anch[1], a2: M.anch[2], pallet: [M.pallet[0], M.pallet[1], 1.25], buf: [buf.x, buf.y, 1.02],
      mid: [(M.due[0] + H[0]) / 2, (M.due[1] + H[1]) / 2, 0], corner: [30, 0, 0], tr: [15, 16.3, 1.02] };
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
    var dv = Math.round(st.dim * 100) / 100; if (dv !== frame.dv) { frame.dv = dv; stage.style.setProperty('--dim', dv); }
    var tk = Math.floor(st.clk * 561 / 30); if (i <= 2 && st.dim < .5 && frame.tk != null && tk !== frame.tk) snd.tock(.09); frame.tk = tk;   // the clock ticks as its numbers move
    if (i === 2 && st.dim > .95 && !frame.held) { frame.held = true; snd.tock(.22); } if (i < 2 || (i === 2 && st.dim < .5)) frame.held = false;
    snd.room(i <= 2 ? 1 - st.dim : i === 3 ? lerp(0, .35, seg(u, .3, 1)) : .35);
    // camera
    var area = phone ? vw * .98 : vw * .6, f = Mxy(c.f[0], c.f[1], c.f[2]), arr = 1 - easeO(seg(ap, .1, 1));
    cam.ppm = area / (c.s * (1 + .22 * arr)); cam.fx = f[0]; cam.fy = f[1]; cam.ax = phone ? vw * .5 : vw * .685; cam.ay = (phone ? vh * .63 : vh * .525) + arr * vh * .1;
    // moving things
    var a0 = amrPos(0, time), a1 = amrPos(1, time); AMRI[0].x = a0.x; AMRI[0].y = a0.y; AMRI[0].th = a0.th; AMRI[1].x = a1.x; AMRI[1].y = a1.y; AMRI[1].th = a1.th;
    // --- plate
    var W = cv.width, Hh = cv.height; gl.viewport(0, 0, W, Hh); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    var U = P1.u; gl.useProgram(P1.p); gl.bindBuffer(gl.ARRAY_BUFFER, tex.full); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(U.uRes, W, Hh); gl.uniform2f(U.uA, cam.ax * dpr, cam.ay * dpr); gl.uniform2f(U.uF, cam.fx, cam.fy); gl.uniform1f(U.uPpm, cam.ppm * dpr); gl.uniform2f(U.uPl, M.scale, M.scale / M.aspect); setLut(st); gl.uniform1i(U.tLut, 12);
    ['wide_col', 'wide_clay', 'mid_col', 'mid_clay', 'close_col', 'close_clay', 'macro_col', 'macro_clay', 'wide_id', 'mid_id', 'close_id', 'macro_id'].forEach(function (n, k) { gl.activeTexture(gl.TEXTURE0 + k); gl.bindTexture(gl.TEXTURE_2D, tex[n].t); gl.uniform1i(U[['tWc', 'tWk', 'tMc', 'tMk', 'tCc', 'tCk', 'tXc', 'tXk', 'tWi', 'tMi', 'tCi', 'tXi'][k]], k); });
    var dt2 = M.x[0] * M.y[1] - M.y[0] * M.x[1]; gl.uniform2f(U.uO, M.o[0], M.o[1]); gl.uniform2f(U.uIa, M.y[1] / dt2, -M.y[0] / dt2); gl.uniform2f(U.uIb, -M.x[1] / dt2, M.x[0] / dt2);
    gl.uniform1f(U.uDay, st.all); gl.uniform1f(U.uCool, st.cool); gl.uniform2f(U.uDr, M.depth[0], M.depth[1]); gl.uniform1f(U.uDof, st.dof); gl.uniform1f(U.uFd, (depthOf(st.fp[0], st.fp[1], st.fp[2]) - M.depth[0]) / (M.depth[1] - M.depth[0])); gl.uniform2f(U.uSh, st.shaft[0], st.shaft[1]); gl.activeTexture(gl.TEXTURE13); gl.bindTexture(gl.TEXTURE_2D, tex.depth.t); gl.uniform1i(U.tD, 13);
    gl.uniform4f(U.uSun, M.hero[0], M.hero[1], st.sun, Math.min(6, st.sun * .8) + .01);
    gl.uniform4f(U.uTx, 1 / tex.wide_id.w, 1 / tex.mid_id.w, 1 / tex.close_id.w, 1 / tex.macro_id.w); gl.uniform4fv(U.uMid, M.mid); gl.uniform4fv(U.uClose, M.close); gl.uniform4fv(U.uMac, M.macro);
    var dp = cam.ppm * dpr, wp = tex.wide_col.w / M.scale, mp = tex.mid_col.w / (M.mid[2] * M.scale), cp = tex.close_col.w / (M.close[2] * M.scale);
    gl.uniform3f(U.uW, ease(seg(dp / wp, .85, 1.5)), ease(seg(dp / mp, .85, 1.5)), ease(seg(dp / cp, .85, 1.5)));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // --- sprites, far ones first
    U = P2.u; gl.useProgram(P2.p); gl.bindBuffer(gl.ARRAY_BUFFER, tex.quad); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(U.uRes, W, Hh); gl.uniform2f(U.uA, cam.ax * dpr, cam.ay * dpr); gl.uniform2f(U.uF, cam.fx, cam.fy); gl.uniform1f(U.uPpm, cam.ppm * dpr); gl.uniform2f(U.uPl, M.scale, M.scale / M.aspect);
    gl.uniform2f(U.uDr, M.depth[0], M.depth[1]); gl.uniform1f(U.uTan, TAN); gl.uniform1f(U.uCool, st.cool); gl.uniform1f(U.uDay, st.all);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex.sprites.t); gl.uniform1i(U.tAt, 0); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex.depth.t); gl.uniform1i(U.tD, 1);
    var sp = [], wk = M.spr.walk, ar = M.spr.amr, w = st.walker;
    var fr = Math.floor(st.wd / wk.stride * 8) % 8;
    if (st.walkA > 0) { if (st.pose && tex.poses) sp.push({ x: w.x, y: w.y, s: wk.size, an: wk.anchor, ca: st.pose, cb: st.pose, mix: 1, al: st.walkA, t: tex.poses }); else sp.push({ x: w.x, y: w.y, s: wk.size, an: wk.anchor, ca: [fr, 4 + w.h], cb: [fr, 4 + w.h], mix: 1, al: st.walkA }); }
    for (var k = 0; k < 2; k++) { var A = AMRI[k]; var hd = ((Math.round(A.th / (Math.PI / 8)) % 16) + 16) % 16; sp.push({ x: A.x, y: A.y, s: ar.size, an: ar.anchor, ca: [hd % 8, hd >> 3], cb: [hd % 8, 2 + (hd >> 3)], mix: A.rev, al: 1 }); }
    sp.forEach(function (s) { s.d = depthOf(s.x, s.y, 0); }); sp.sort(function (a, b) { return b.d - a.d; });
    sp.forEach(function (s) {
      var b = Mxy(s.x, s.y, 0); gl.uniform4f(U.uR, b[0] - s.an[0] * s.s, b[1] - s.an[1] * s.s, s.s, s.s);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, (s.t || tex.sprites).t);
      var kr = s.t === tex.poses ? 4 : 8; gl.uniform2f(U.uK, .125, 1 / kr); gl.uniform2f(U.uCa, s.ca[0] / 8, s.ca[1] / kr); gl.uniform2f(U.uCb, s.cb[0] / 8, s.cb[1] / kr); gl.uniform1f(U.uMix, s.mix); gl.uniform1f(U.uAl, s.al); gl.uniform1f(U.uBy, b[1]); gl.uniform1f(U.uBd, s.d);
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
    var td = st.trip * TTOT, th = tripAt(td);
    show(tripP, st.tripA * (td > .05 ? 1 : 0)); show(tripH, st.tripA * (st.trip > 0 && st.trip < 1 ? 1 : 0));
    if (st.tripA > 0) {
      var tp = [scr(TRIP[0][0], TRIP[0][1], .02)]; for (k = 1; k < th.seg; k++) tp.push(scr(TRIP[k][0], TRIP[k][1], .02)); var thp = scr(th.x, th.y, .02); tp.push(thp);
      tripP.setAttribute('points', tp.map(function (v) { return v[0].toFixed(1) + ',' + v[1].toFixed(1); }).join(' ')); tripH.setAttribute('cx', thp[0]); tripH.setAttribute('cy', thp[1]);
      tripC.forEach(function (C) { var on = C.d <= td; if (on) { var q = tripAt(C.d), sq = scr(q.x, q.y, .02); C.e.setAttribute('cx', sq[0]); C.e.setAttribute('cy', sq[1]); } show(C.e, on ? st.tripA * (.35 + .65 * Math.max(0, 1 - (td - C.d) / 14)) : 0); });
    } else tripC.forEach(function (C) { show(C.e, 0); });
    if (i === 4 && st.trip >= 1 && !frame.arr) { frame.arr = true; snd.pop(4); hap.tick(); } if (i < 4 || (i === 4 && st.trip < 1)) frame.arr = false;
    var tg = scr(M.tag[0], M.tag[1], M.tag[2]), cyc = (time % 2.6) / 2.6, mx = Math.max.apply(null, M.ns);
    rays.forEach(function (r, k) {
      var an = scr(M.anch[k][0], M.anch[k][1], M.anch[k][2] - .12), gk = Math.min(1, st.lines * mx / M.ns[k]), e = [lerp(tg[0], an[0], gk), lerp(tg[1], an[1], gk)];
      show(r.l, st.linesA * (st.lines > 0 ? .9 : 0)); r.l.setAttribute('x1', tg[0]); r.l.setAttribute('y1', tg[1]); r.l.setAttribute('x2', e[0]); r.l.setAttribute('y2', e[1]);
      var t = cyc * 1.5 * mx / M.ns[k], vis = st.lines >= 1 && t <= 1 ? st.linesA : 0; var t0 = Math.max(0, t - 3 / M.ns[k]); show(r.d, vis); r.d.setAttribute('x1', lerp(tg[0], an[0], t0)); r.d.setAttribute('y1', lerp(tg[1], an[1], t0)); r.d.setAttribute('x2', lerp(tg[0], an[0], Math.min(1, t))); r.d.setAttribute('y2', lerp(tg[1], an[1], Math.min(1, t)));
      var la = 0; tl[k].style.opacity = la; tl[k].style.display = la > 0 ? '' : 'none';
      if (la > 0) { tl[k].style.transform = 'translate(' + (an[0] + 12).toFixed(1) + 'px,' + (an[1] - 24).toFixed(1) + 'px)'; var gp = (i === 4 && u > .6) || i === 5, tv = gp ? '+' + (M.ns[k] - Math.min.apply(null, M.ns)).toFixed(1) + ' ns' : M.ns[k].toFixed(1) + ' ns'; if (tl[k].tv !== tv) { tl[k].tv = tv; tl[k].textContent = tv; } }
    });
    if (st.tag > .5 && !pulsed) { pulsed = true; snd.tag(); hap.tick(); } if (st.tag < .3) pulsed = false;
    if (st.amber > .5 && !frame.amb) { frame.amb = true; snd.warn(); hap.tick(); } if (st.amber < .3) frame.amb = false;
    if (st.fix > .5 && !fixed) { fixed = true; snd.fix(); hap.land(); } if (i < 5 || (i === 5 && st.fix < .3)) fixed = false;
    // the 10 cm bar, true to scale, beside the located point
    var hp = scr(M.hero[0], M.hero[1], 1.02), bw = .1 * cam.ppm, bx = hp[0] + Math.max(16, .62 * cam.ppm), by = hp[1] + 22;
    [bar, barA, barB, barT].forEach(function (e) { show(e, st.fix); });
    if (st.fix > 0) { bar.setAttribute('x1', bx); bar.setAttribute('x2', bx + bw); bar.setAttribute('y1', by); bar.setAttribute('y2', by); barA.setAttribute('x1', bx); barA.setAttribute('x2', bx); barA.setAttribute('y1', by - 5); barA.setAttribute('y2', by + 5); barB.setAttribute('x1', bx + bw); barB.setAttribute('x2', bx + bw); barB.setAttribute('y1', by - 5); barB.setAttribute('y2', by + 5); barT.setAttribute('x', bx + bw + 14); barT.setAttribute('y', by + 5); }
    // --- dots
    things.forEach(function (t, n) {
      var a = t.hero ? (i === 5 ? ease(seg(u, .26, .36)) : i > 5 ? 1 : 0) : ease(seg(st.wave, t.at + .02, t.at + .06));
      if (i >= 7) a = 1;
      if (a > .5 && !t.on && i === 6) snd.pop(n); t.on = a > .5;
      if (a <= 0) { if (t.vis) { t.el.style.opacity = 0; t.vis = false; } return; } t.vis = true;
      var s = scr(t.x, t.y, t.z), amb = t.amber && st.amber > .5; if (amb !== t.amb) { t.amb = amb; t.el.classList.toggle('w', amb); }
      t.el.style.opacity = a; t.el.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px) scale(' + (.4 + .6 * a + (amb ? .25 : 0)).toFixed(2) + ')';
    });
    // --- notes
    notes.forEach(function (n) {
      var inn;
      if (n.at === 'due') inn = st.due > .5 && i < 3; else if (n.at === 'mid') inn = i === 2 && st.meas >= 1 && u < .93;
      else if (n.at === 'walker') inn = (i === 1 && u > .3) || (i === 2 && u < .34); else if (n.bi === 3) inn = i === 3 && u > .5; else if (n.bi === 4) inn = i === 4 && st.trip >= 1 && u < .97;
      else if (n.bi === 5) inn = i === 5 && st.fix > .4; else if (n.bi === 7) inn = i === 7 && (n.at === 'amr0' ? u > .2 && AMRI[0].x > 5 && AMRI[0].x < 20.5 && AMRI[0].y < 9.5 : st.amber > .5) && u < .96; else if (n.bi === 8) inn = i >= 8 && st['l' + n.at[1]] > .6; else inn = n.bi === i;
      var pt = n.at[0] === 'L' ? [30, 0, [0, 0, LZ[0], LZ[1]][+n.at[1]]] : n.at === 'amr0' ? [AMRI[0].x, AMRI[0].y, 1.9] : n.at === 'walker' ? [w.x, w.y, 1.95] : M.pt[n.at], s = scr(pt[0], pt[1], pt[2]);
      if (phone ? s[1] < vh * .4 : s[0] < vw * .42) inn = false;          // never over the copy
      if (inn && n.at === 'amr0' && phone) ['buf', 'pallet', 'hero'].forEach(function (q) { var o = scr(M.pt[q][0], M.pt[q][1], M.pt[q][2]); if (Math.abs(o[0] - s[0]) < 190 && Math.abs(o[1] - s[1]) < 70) inn = false; });
      if (inn !== n.inn) { n.inn = inn; n.el.classList.toggle('in', inn); }
            if (Math.abs(n.bi - i) <= 1 || n.at === 'due' || n.inn) { n.el.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px)'; }
    });
    if (xyEl && i === 7) { var xv = 'x ' + AMRI[0].x.toFixed(1) + ' m, y ' + AMRI[0].y.toFixed(1) + ' m'; if (xv !== xyEl.t) { xyEl.t = xv; xyEl.textContent = xv; } }
    if (searchEl) { var sm = fmt(st.clk * 561, false), wm = Math.round(st.wd) + ' m walked'; if (sm !== searchEl.t) { searchEl.t = sm; searchEl.textContent = sm; } if (wm !== walkedEl.t) { walkedEl.t = wm; walkedEl.textContent = wm; } }
    // --- the ruler: a true length at this distance
    var nk = 0; while (nk < NICE.length - 1 && NICE[nk] * cam.ppm < 56) nk++;
    var nl = NICE[nk] < 1 ? Math.round(NICE[nk] * 100) + ' cm' : NICE[nk] + ' m'; scaleI.style.width = (NICE[nk] * cam.ppm).toFixed(1) + 'px'; scaleEl.style.opacity = (1 - st.l3).toFixed(2); if (nl !== scaleT.t) { scaleT.t = nl; scaleT.textContent = nl; }
    // --- the plant's own grid lines, in metres: what x and y are measured from
    var axa = st.axes * (1 - (st.l1 || 0)) * seg(c.s, 15, 24) * (phone ? 0 : 1); show(axG, axa);
    if (axa > 0) axT.forEach(function (t) {
      var p0 = scr(t.x, t.y, -.5), p1 = t.ex ? scr(t.x + .45, t.y, -.5) : scr(t.x, t.y - .45, -.5), p2 = t.ex ? scr(t.x + 1.5, t.y, -.5) : scr(t.x, t.y - 1.5, -.5);
      t.l.setAttribute('x1', p0[0]); t.l.setAttribute('y1', p0[1]); t.l.setAttribute('x2', p1[0]); t.l.setAttribute('y2', p1[1]); t.t.setAttribute('x', p2[0]); t.t.setAttribute('y', p2[1] + 4);
      if (!t.t.textContent) t.t.textContent = (t.ex ? t.y : t.x) + (t.x === 30 && t.y === 0 || t.y === 20 ? ' m' : '');
      var vw = innerWidth, ok = p2[0] > vw * .42 && p2[0] < vw - 44 ? '' : '0'; if (t.o !== ok) { t.o = ok; t.l.style.opacity = t.t.style.opacity = ok; }
    });
    // --- the layers
    var la = Math.max(st.l2, st.l3); show(layG, la > 0 ? 1 : 0);
    if (la > 0) {
      LZ[0] = 0; LZ[1] = lerp(2, 23, st.l3);
      lay2.style.opacity = 0; lay3.style.opacity = st.l3; poly(lay3, LZ[1]);
      [[0, 0], [30, 0], [30, 20], [0, 20]].forEach(function (v, k) { var a = scr(v[0], v[1], 0), b = scr(v[0], v[1], LZ[1]); layP[k].setAttribute('x1', a[0]); layP[k].setAttribute('y1', a[1]); layP[k].setAttribute('x2', b[0]); layP[k].setAttribute('y2', b[1]); layP[k].style.opacity = st.l3 * .8; });
      layA.forEach(function (A, k) { var an = M.anch[k], a = scr(an[0], an[1], an[2]), b = scr(an[0], an[1], LZ[0]); A.l.setAttribute('x1', a[0]); A.l.setAttribute('y1', a[1]); A.l.setAttribute('x2', b[0]); A.l.setAttribute('y2', b[1]); A.r.setAttribute('x', b[0] - 3.5); A.r.setAttribute('y', b[1] - 3.5); A.l.style.opacity = A.r.style.opacity = 0; });
      layL.forEach(function (A) { var a = scr(A.q[0], A.q[1], LZ[1]), b = scr(A.q[2], A.q[3], LZ[1]); A.l.setAttribute('x1', a[0]); A.l.setAttribute('y1', a[1]); A.l.setAttribute('x2', b[0]); A.l.setAttribute('y2', b[1]); A.l.style.opacity = st.l3; });
      things.forEach(function (t, n) {
        var c = layD[n]; if (!c) { var th2 = document.createElementNS(NS, 'line'); th2.setAttribute('class', 'thr'); layG.insertBefore(th2, lay3); c = layD[n] = document.createElementNS(NS, 'circle'); c.setAttribute('r', 2.6); c.thr = th2; layG.appendChild(c); }
        var q = scr(t.x, t.y, LZ[1]), q0 = scr(t.x, t.y, 1.1); c.thr.setAttribute('x1', q0[0]); c.thr.setAttribute('y1', q0[1]); c.thr.setAttribute('x2', q[0]); c.thr.setAttribute('y2', q[1]); c.thr.style.opacity = (st.l3 * .5).toFixed(2); c.setAttribute('cx', q[0]); c.setAttribute('cy', q[1]); c.setAttribute('class', t.amber ? 'dw' : 'd'); c.style.opacity = st.l3;
      });
    }
    // --- the hairs that tie a word to its thing
    var sr = stage.getBoundingClientRect();
    leadEls.forEach(function (L, k) {
      var ld = leads[k]; if (!ld || ld.a <= 0 || !live) { if (L.on !== false) { L.on = false; L.p.style.display = L.c.style.display = 'none'; } return; }
      var K = ld.K, wl = K.ws[K.ws.length - 1], rr = wl.row.getBoundingClientRect(), wr = wl.el.getBoundingClientRect();
      var pt = K.k === 'walker' ? [w.x, w.y, 1.0] : K.k === 'due' ? [D[0], D[1], 0] : K.k === 'mid' ? M.pt.mid : M.pt[K.k], T = scr(pt[0], pt[1], pt[2]), x0, y0, x1, y1;
      if (phone) { x0 = (wr.left + wr.right) / 2 - sr.left; y0 = roll.getBoundingClientRect().top - sr.top + K.h + 12; x1 = x0; y1 = y0 + 18; } else { x0 = wl.row.querySelector('.flr-li').getBoundingClientRect().right - sr.left + 12; y0 = (wr.top + wr.bottom) / 2 - sr.top + 2; x1 = x0 + 26; y1 = y0; }
      var len = Math.hypot(x1 - x0, y1 - y0) + Math.hypot(T[0] - x1, T[1] - y1);
      L.p.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'L' + T[0].toFixed(1) + ' ' + T[1].toFixed(1));
      L.p.style.strokeDasharray = len.toFixed(1); L.p.style.strokeDashoffset = (len * (1 - ease(ld.d))).toFixed(1);
      L.c.setAttribute('cx', T[0]); L.c.setAttribute('cy', T[1]); L.c.style.opacity = K.k === 'tag' ? 0 : (ld.a * seg(ld.d, .9, 1)).toFixed(2);
      if (L.cls !== K.c) { L.cls = K.c; L.p.setAttribute('class', 'k-' + K.c); L.c.setAttribute('class', 'k-' + K.c); }
      L.on = true; L.p.style.display = L.c.style.display = ''; L.p.style.opacity = (ld.a * .7).toFixed(2);
    });
    // --- clocks
    clocks.forEach(function (c) { var v = c.due ? fmt(c.base + st.clk * 561, false) : fmt(c.base + time, true); if (v !== c.last) { c.last = v; c.el.textContent = v; } });
  }

  // ---- point at a located thing to read where it is
  var hov = document.createElement('div'); hov.className = 'flr-hov'; stage.appendChild(hov); var hovT = null, NAME = { trolley: 'Trolley', pallet: 'Pallet', forklift: 'Forklift', amr: 'AMR' }, mouse = null;
  stage.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; var r = stage.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; kick(); });
  stage.addEventListener('pointerleave', function () { mouse = null; kick(); });
  function hover() {
    var best = null, bd = 26;
    if (mouse && live) things.forEach(function (t) { if (!t.vis) return; var s = scr(t.x, t.y, t.z), d = Math.hypot(s[0] - mouse[0], s[1] - mouse[1]); if (d < bd) { bd = d; best = t; best.s = s; } });
    if (best !== hovT) { hovT = best; hov.classList.toggle('in', !!best); }
    if (best) { var tx = NAME[best.k] + '  x ' + best.x.toFixed(1) + ' m, y ' + best.y.toFixed(1) + ' m'; if (tx !== hov.tx) { hov.tx = tx; hov.textContent = tx; } hov.style.transform = 'translate(' + (best.s[0] + 14).toFixed(1) + 'px,' + (best.s[1] - 30).toFixed(1) + 'px)'; }
  }

  // ---- the loop: runs only while the section is on screen
  var raf = 0, lastT = 0, slow = 0, frames = 0, tbs = -1;
  function tbOf(x) { var i = beatOf(x); return i + Math.min(1, (x - EDGE[i]) / (EDGE[i + 1] - EDGE[i])); }
  function tick(now) {
    raf = 0; if (!onScreen && !SHOT) { snd.gate(); return; }
    var dt = Math.min(.1, (now - lastT) / 1000 || .016); lastT = now;
    if (ps < 0) { ps = p; tbs = -1; } else ps += (p - ps) * (1 - Math.exp(-dt * 10)); if (Math.abs(p - ps) < .00002) ps = p;
    snd.gate(); var tbT = tbOf(ps); textFrame.v = tbs < 0 ? 0 : lerp(textFrame.v || 0, (tbT - tbs) / dt, 1 - Math.exp(-dt * 10)); tbs = tbT;
    if (!frozen) setBeat(Math.min(NB - 1, Math.floor(tbs + 1e-6)));
    textFrame(frozen ? frozen[0] : tbs, frozen ? .2 : dt);
    if (live) {
      if (frozen) frame(frozen[0], frozen[1]); else frame(tbs, (now - T0) / 1000);
      hover();
      if (!FULL && frames < 90) { frames++; if (dt > .055) slow++; if (frames === 90 && slow > 45) { toStills(); } }
    }
    kick();
  }
  function kick() { if (!raf && (onScreen || SHOT)) raf = requestAnimationFrame(tick); }
  function onScroll() { readScroll(); if (near) start(); if (bi < 0) setBeat(beatOf(p)); kick(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  document.addEventListener('visibilitychange', function () { snd.gate(); kick(); });
  measure(); onScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.__flr = { seek: function (tb, time) { frozen = tb == null ? null : [tb, time || 0]; if (tb != null) setBeat(Math.min(NB - 1, Math.floor(tb))); kick(); }, ready: function () { return live; }, tb: function () { return tbs; }, edges: EDGE };
})();
