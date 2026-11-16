/* LOST. FOUND. SEEN: the explainer after the hero.
   The pictures are path-traced views of one plant, each kind of light kept as its own layer. This script mixes those layers live
   on the graphics chip as you scroll (lamps die, a pulse crosses the hall, light returns), places the words over the picture,
   and plays the sound. With no graphics chip it cross-fades five finished pictures instead. With reduced motion it does nothing:
   the stylesheet then shows the five pictures and their words one under another. */
(function () {
  'use strict';
  var sec = document.getElementById('see');
  if (!sec || !sec.classList.contains('lfs') || !window.requestAnimationFrame || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var $ = function (s, r) { return (r || sec).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || sec).querySelectorAll(s)); };
  var stage = $('.lfs-stage'), cv = $('.lfs-gl'), ov = $('.lfs-ov'), base = sec.getAttribute('data-assets') || 'assets/lfs/';
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; }, ss = function (a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
  var mix = function (a, b, t) { return a + (b - a) * t; };
  sec.classList.add('lfs-on');

  /* ---------- the five frames and everything that fades with the scroll ---------- */
  var frames = $$('.lfs-f').map(function (el) {
    var r = el.getAttribute('data-p').split(',').map(Number);
    return { el: el, k: el.getAttribute('data-k'), plate: el.getAttribute('data-plate'), a: r[0], b: r[1], img: $('img', el), o: -1 };
  });
  var FADE = .013;     /* scenes meet and cross-fade: there is never an empty screen between them */
  /* into and out of the tag close-up the picture dips: the plant dims first, then the tag arrives (no ghost of one over the other) */
  function fadeOf(f, p) {
    var di = f.k === 'tag' || f.k === 'found', dout = f.k === 'isl' || f.k === 'tag';
    var i = f.a <= 0 ? 1 : di ? ss(f.a - FADE * .4, f.a + FADE * 2.4, p) : ss(f.a - FADE, f.a + FADE, p);
    var o = f.b >= 1 ? 1 : dout ? 1 - ss(f.b - FADE * 2.4, f.b + FADE * .4, p) : 1 - ss(f.b - FADE, f.b + FADE, p);
    return i * o;
  }
  var texts = $$('[data-p]').filter(function (el) { return !el.classList.contains('lfs-f'); }).map(function (el) {
    var fr = el.closest('.lfs-f'), li = el.tagName === 'LI';
    var t = { el: el, li: li, plate: fr.getAttribute('data-plate'), at: el.getAttribute('data-at'), o: -1, x: -1, y: -1 };
    t.p = el.getAttribute('data-p').split(',').map(Number); t.pm = (el.getAttribute('data-pm') || el.getAttribute('data-p')).split(',').map(Number);
    if (li) {
      t.off = el.getAttribute('data-o').split(',').map(Number); t.offm = (el.getAttribute('data-om') || el.getAttribute('data-o')).split(',').map(Number);
      t.span = el.firstElementChild; t.hair = document.createElement('i'); t.hair.className = 'lfs-hair'; t.dot = document.createElement('i'); t.dot.className = 'lfs-dot';
      el.insertBefore(t.hair, t.span); el.insertBefore(t.dot, t.span);
    }
    return t;
  });
  var rail = $$('.lfs-rail a'), topLink = $('.lfs-top'), sndBtn = $('.lfs-snd'), skip = $('.lfs-skip');

  /* ---------- size, orientation, scroll ---------- */
  var sw = 1, sh = 1, zone = 0, tall = false, O = 'L', p = 0, ps = 0, lastY = 0, upT = 0, vis = false, T0 = performance.now(), data = null, mode = 'pics';
  var ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  function size() {
    sw = stage.clientWidth; sh = stage.clientHeight; var t = sw / sh < .8;
    if (t !== tall || !O) { tall = t; O = tall ? 'P' : 'L'; if (GL) GL.swap(); }
    if (GL) GL.resize();
    ov.setAttribute('viewBox', '0 0 ' + sw + ' ' + sh); zone = Math.min(sh, window.innerHeight) * .6 - 14;
  }
  function readScroll() {
    var r = sec.getBoundingClientRect(), span = sec.offsetHeight - sh; p = clamp(-r.top / span, 0, 1);
    var y = window.pageYOffset; if (y < lastY - 2 && p > .02 && p < 1) upT = performance.now(); lastY = y;
  }
  function goTo(t) { var top = sec.getBoundingClientRect().top + window.pageYOffset, span = sec.offsetHeight - sh; window.scrollTo({ top: top + span * t + 2, behavior: 'smooth' }); }
  rail.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); goTo(Number(a.getAttribute('data-go')) + .012); }); });
  skip.addEventListener('click', function (e) { e.preventDefault(); var n = sec.nextElementSibling; window.scrollTo({ top: (n ? n.getBoundingClientRect().top : sec.getBoundingClientRect().bottom) + window.pageYOffset, behavior: 'smooth' }); if (n) { n.setAttribute('tabindex', '-1'); n.focus({ preventScroll: true }); } });
  topLink.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') { ptr.x = e.clientX / innerWidth - .5; ptr.y = e.clientY / innerHeight - .5; } }, { passive: true });

  /* ---------- where a point of the picture lands on the stage ---------- */
  var FOCUS = { a: [.5, .5], b: [.5, .5], c: [.62, .8], d: [.5, .5] };
  var view = { su: 1, sv: 1, cu: .5, cv: .5, px: 0, py: 0, foc: .3 }, pan = { x: .5, to: .5 };
  function fit(plate, zoom) {
    var d = data && data[O][plate], ap = d ? d.w / d.h : (tall ? 9 / 16 : 16 / 9), as = sw / sh, su, sv, f = FOCUS[plate];
    if (as > ap) { su = 1; sv = ap / as; } else { sv = 1; su = as / ap; }
    su /= zoom; sv /= zoom;
    view.su = su; view.sv = sv; view.cu = clamp(plate === 'b' ? pan.x - (tall ? 0 : .12 * su) : f[0], su / 2, 1 - su / 2); view.cv = clamp(f[1], sv / 2, 1 - sv / 2);
  }
  function place(plate, key) {
    var d = data[O][plate], q = d.pts[key]; if (!q) return null;
    var inv = q[2] > 0 ? clamp(d.near / q[2], 0, 1) : 0;
    var u = q[0] - view.px * (inv - view.foc), v = q[1] - view.py * (inv - view.foc);
    return [((u - view.cu) / view.su + .5) * sw, ((v - view.cv) / view.sv + .5) * sh];
  }

  /* ---------- the look of each frame: light weights as a function of its own progress q and the world clock t ---------- */
  var BLUE = [.16, .42, 1], AMBER = [1, .52, .1];
  var U = {};                      // filled each frame
  var pulse = { ph: 0, n: -1, hit: [0, 0, 0], line: [0, 0, 0], r: 0 }, lost = { bank: -1 };
  var LEVELS = [1, .72, .5, .32, .18, .09];
  var PERIOD = 4.6, SPEED = 30;    // the pulse repeats on the world clock; shown speed in metres per second (the real one is light speed)
  function blink(t) { var x = t % 2.3; return Math.exp(-x * 9) + .8 * Math.exp(-Math.max(0, x - .22) * 9) * (x > .22 ? 1 : 0); }
  var mute = { level: function () {}, blink: function () {}, tick: function () {}, note: function () {}, once: function () {}, reset: function () {}, thunk: function () {} };
  function look(f, q, t, main) {
    var snd = main ? SND : mute, u = U; u.sod = [0, 0, 0]; u.wht = [0, 0, 0]; u.amb = [0, 0, 0]; u.blu = [0, 0, 0]; u.col = [0, 0]; u.rev = [999, 999, 999]; u.shell = [0, 1, 0]; u.glow = []; u.anc = [0, 0, 0]; u.zoom = 1.05; u.par = 1;
    var d = data[O][f.plate];
    if (f.k === 'lost') {
      /* the lamps go out bank by bank: the light steps down, each step a breaker thrown */
      var die = clamp((q - .7) / .3, 0, 1), bank = Math.min(5, Math.floor(die * 5.999)), lv = LEVELS[bank], into = die * 6 - bank;
      if (bank !== lost.bank) { if (lost.bank >= 0) snd.thunk(bank > lost.bank); lost.bank = bank; }
      if (bank < 5 && die > 0) lv = mix(lv, LEVELS[bank + 1], ss(.82, 1, into)) * (into > .7 && Math.sin(t * 61) * Math.sin(t * 37.3) > .3 ? .8 : 1);
      u.sod[0] = lv; u.zoom = 1.05 + .07 * q; snd.level('hall', lv);
    } else if (f.k === 'isl') {
      u.sod[0] = 1.55; u.sod[2] = .2; u.zoom = 1.07 - .04 * q;
    } else if (f.k === 'tag') {
      var b = blink(t), L = d.pts.led || d.pts.tag; u.sod[0] = .22; u.wht[1] = .8; u.blu[2] = b * 1.1; u.zoom = 1.03 + .04 * q;
      u.glow.push([L[0], L[1], b * .8, .007]);
      snd.blink(t);
    } else if (f.k === 'found') {
      var cone = ss(.5, .66, q), run = q > .1;
      u.sod[0] = mix(.46, .1, cone); u.col[0] = cone * 1.7; u.zoom = 1.035 + .03 * q;
      var ph = t % PERIOD, n = Math.floor(t / PERIOD);
      if (n !== pulse.n) { pulse.n = n; pulse.hit = [0, 0, 0]; if (run) snd.tick(); }
      var r = ph * SPEED; pulse.r = r;
      u.blu[2] = Math.exp(-ph * 7) * 1.4 + .12;
      u.glow.push([d.pts.tag[0], d.pts.tag[1], Math.exp(-ph * 6) * .9 + .12, .006]);
      if (run) {
        u.shell = [r, 1.1 + r * .05, Math.exp(-r / 26) * (FLAGS.shell ? 1 : 0)];
        for (var i = 0; i < 3; i++) {
          var since = (r - d.adist[i]) / SPEED;
          if (since > 0 && !pulse.hit[i]) { pulse.hit[i] = 1; snd.note(i); }
          var a = since > 0 ? Math.exp(-since * 2.2) * 1.0 + .5 : (q > .5 ? .5 : 0);
          u.anc[i] = a; pulse.line[i] = since > 0 ? clamp(since / .5, 0, 1) * (q > .5 ? 1 : clamp((PERIOD - ph) / .5, 0, 1)) : (q > .5 ? 1 : 0);
          u.glow.push([d.pts['a' + i][0], d.pts['a' + i][1], a * 1.1, .0055]);
        }
      } else pulse.line = [0, 0, 0];
      if (cone > .5) snd.once('chord'); else snd.reset('chord');
    } else if (f.k === 'seen') {
      var e = Math.pow(clamp(q / .3, 0, 1), 2.1);
      u.col = [2.1, 1.5]; u.rev[0] = 9 + e * 200; u.rev[1] = 7 + clamp(e * 1.08 - .08, 0, 1) * 200; u.rev[2] = u.rev[1];
      u.amb[1] = 1.7 * ss(.27, .4, q); u.wht[2] = mix(.1, .2, ss(0, .3, q)); u.zoom = 1.03 + .04 * (1 - ss(0, 1, q));
      snd.level('pad', ss(0, .15, q)); if (q > .02) snd.once('open'); else snd.reset('open');
    }
    if (f.k !== 'lost') snd.level('hall', 0);
    if (f.k !== 'seen') snd.level('pad', 0);
    u.k0 = f.k === 'seen' ? [.9, .97, 1.08] : [1, 1, 1]; u.sat = f.k === 'seen' ? 1.5 : 1.15;
  }
  var FLAGS = { shell: sec.getAttribute('data-pulse') !== 'lines' };

  /* ---------- the graphics chip: one shader that mixes the light layers ---------- */
  var VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;v.y=1.-v.y;gl_Position=vec4(a,0.,1.);}';
  var FS = [
    'precision highp float;varying vec2 v;',
    'uniform sampler2D m0,m1,m2,c0,c1,dp,ds;',
    'uniform vec4 fit;uniform vec3 par;uniform vec3 sod,wht,amb,blu,rev,shell,anc;uniform vec2 col;uniform vec3 k0;uniform float sat;uniform vec4 g0,g1,g2,g3;uniform vec3 a0,a1,a2;',
    'uniform float fade,time,dmax,asp;uniform vec2 res;',
    'float tm(float x){x=x*(1.+x/16.)/(1.+x);return pow(clamp(x,0.,1.),.4545);}',
    'vec3 ramp(float L){L=pow(clamp((L-.03)/.9,0.,1.),1.35);vec3 k1=vec3(.27,.13,.012),k2=vec3(.78,.48,.06),k3=vec3(.98,.78,.26),k4=vec3(1.,.95,.7);',
    ' return L<.25?mix(vec3(0.),k1,L/.25):L<.6?mix(k1,k2,(L-.25)/.35):L<.88?mix(k2,k3,(L-.6)/.28):mix(k3,k4,(L-.88)/.12);}',
    'float hash(vec2 p){p=fract(p*vec2(443.897,441.423));p+=dot(p,p.yx+19.19);return fract((p.x+p.y)*p.x);}',
    'float glow(vec4 g,vec2 uv){vec2 d=(uv-g.xy)*vec2(asp,1.);float r=length(d)/g.w;return g.z*(exp(-r*r)+.35/(1.+r*r*.6)*exp(-r*.25));}',
    'float near(vec3 a,vec2 uv){vec2 d=(uv-a.xy)*vec2(asp,1.);return a.z*exp(-dot(d,d)/.012);}',
    'void main(){',
    ' vec2 uv=fit.zw+(v-.5)*fit.xy;float inv=texture2D(dp,uv).r;uv+=par.xy*(inv-par.z);',
    ' vec3 m=pow(vec3(texture2D(m0,uv).r,texture2D(m1,uv).r,texture2D(m2,uv).r),vec3(2.2));',
    ' float dist=texture2D(ds,uv).r;dist=dist*dist*dmax;',
    ' float s=dot(m,sod);vec3 o=ramp(tm(s));',
    ' vec3 r3=1.-smoothstep(rev-9.,rev,vec3(dist));',
    ' vec3 lin=pow(texture2D(c0,uv).rgb,vec3(2.2))*k0*col.x*r3.x+pow(texture2D(c1,uv).rgb,vec3(2.2))*col.y*r3.y;',
    ' float an=m.y*(near(a0,uv)+near(a1,uv)+near(a2,uv));',
    ' float gy=dot(lin,vec3(.3,.6,.1));lin=max(vec3(0.),mix(vec3(gy),lin,sat));',
    ' lin+=vec3(dot(m,wht))+vec3(1.,.52,.1)*dot(m,amb)*r3.z;',
    ' float sh=exp(-pow((dist-shell.x)/shell.y,2.))*shell.z;',
    ' vec3 bl=vec3(.16,.42,1.);lin+=bl*(dot(m,blu)+an*anc.x)+mix(bl,vec3(1.),.35)*sh*(m.x*5.+.035+inv*.02);',
    ' lin+=mix(bl,vec3(1.),.45)*(glow(g0,uv)+glow(g1,uv)+glow(g2,uv)+glow(g3,uv));',
    ' vec3 c=vec3(tm(lin.r),tm(lin.g),tm(lin.b));o=1.-(1.-o)*(1.-c);',
    ' float l=dot(o,vec3(.33));o+=(hash(v*res+fract(time)*61.)-.5)*.05*(.3+1.7*l*(1.-l));',
    ' vec2 q=v-.5;o*=1.-.42*dot(q,q)*1.6;',
    ' gl_FragColor=vec4(o*fade,1.);}'].join('\n');
  var FILES = { a: { m0: 'lamps', dp: 'depth' }, b: { m0: 'isl', m1: 'amber', m2: 'lamps', c0: 'slot', c1: 'pools', dp: 'depth', ds: 'dist' },
    c: { m0: 'lamps', m1: 'anc', m2: 'led', c0: 'cone', dp: 'depth', ds: 'dist' }, d: { m0: 'lamps', m1: 'cone', m2: 'led', dp: 'depth' } };
  var SLOTS = ['m0', 'm1', 'm2', 'c0', 'c1', 'dp', 'ds'];
  var GL = (function () {
    var gl, prog, loc = {}, black, plates = {}, order = ['a', 'b', 'd', 'c'], loading = false, bw = 0, bh = 0, scale = 1, slowN = 0, frames = 0, tAcc = 0;
    try { gl = cv.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!window.__lfsShot }) || cv.getContext('experimental-webgl'); } catch (e) {}
    var c = navigator.connection || {};
    if (!gl || c.saveData || /2g/.test(c.effectiveType || '')) return null;
    function mk(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    function init() {
      prog = gl.createProgram(); gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog); var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var al = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
      ['fit', 'par', 'sat', 'k0', 'sod', 'wht', 'amb', 'blu', 'rev', 'shell', 'anc', 'col', 'g0', 'g1', 'g2', 'g3', 'a0', 'a1', 'a2', 'fade', 'time', 'dmax', 'asp', 'res'].concat(SLOTS).forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
      SLOTS.forEach(function (n, i) { gl.uniform1i(loc[n], i); });
      black = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, black); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([0]));
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    }
    try { init(); } catch (e) { return null; }
    function tex(img, grey) {
      var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); var f = grey ? gl.LUMINANCE : gl.RGB;
      gl.texImage2D(gl.TEXTURE_2D, 0, f, f, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t;
    }
    function loadPlate(name, o, done) {
      var files = FILES[name], keys = Object.keys(files), left = keys.length, P = { o: o, t: {}, ok: false }, bad = false;
      keys.forEach(function (k) {
        var im = new Image(); im.decoding = 'async';
        im.onload = function () { if (O === o && !gl.isContextLost()) P.t[k] = tex(im, k[0] !== 'c'); if (!--left) fin(); };
        im.onerror = function () { bad = true; if (!--left) fin(); };
        im.src = base + o + '/' + name + '_' + files[k] + '.webp';
      });
      function fin() { if (!bad && O === o) { P.ok = true; plates[name] = P; } done(); }
    }
    function next() {
      if (loading || !data || !vis) return;
      var cur = current && current.plate, list = (cur ? [cur] : []).concat(order), name = null;
      for (var i = 0; i < list.length; i++) if (!plates[list[i]]) { name = list[i]; break; }
      if (!name) return; loading = true; loadPlate(name, O, function () { loading = false; next(); });
    }
    function drop() { Object.keys(plates).forEach(function (k) { var t = plates[k].t; Object.keys(t).forEach(function (n) { gl.deleteTexture(t[n]); }); }); plates = {}; }
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); plates = {}; sec.classList.remove('lfs-live'); });
    cv.addEventListener('webglcontextrestored', function () { try { init(); next(); } catch (e) {} });
    return {
      swap: function () { drop(); next(); }, next: next,
      ready: function (name) { return !!(plates[name] && plates[name].ok && plates[name].o === O); },
      resize: function () {
        var dpr = Math.min(window.devicePixelRatio || 1, tall ? 2 : 1.5) * scale, w = Math.round(sw * dpr), h = Math.round(sh * dpr), cap = (tall ? 1080 : 1920) / w;
        if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
        if (w !== bw || h !== bh) { bw = cv.width = w; bh = cv.height = h; gl.viewport(0, 0, w, h); }
      },
      draw: function (f, fade, t, dt, add) {
        var P = plates[f.plate], d = data[O][f.plate], u = U;
        if (add) { gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); } else gl.disable(gl.BLEND);
        SLOTS.forEach(function (n, i) { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, P.t[n] || black); });
        gl.uniform4f(loc.fit, view.su, view.sv, view.cu, view.cv); gl.uniform3f(loc.par, view.px, view.py, view.foc);
        gl.uniform3fv(loc.k0, u.k0); gl.uniform1f(loc.sat, u.sat); gl.uniform3fv(loc.sod, u.sod); gl.uniform3fv(loc.wht, u.wht); gl.uniform3fv(loc.amb, u.amb); gl.uniform3fv(loc.blu, u.blu); gl.uniform3fv(loc.rev, u.rev); gl.uniform3fv(loc.shell, u.shell); gl.uniform2fv(loc.col, u.col);
        gl.uniform3f(loc.anc, 1, 0, 0);
        for (var i = 0; i < 4; i++) gl.uniform4fv(loc['g' + i], u.glow[i] || [0, 0, 0, 1]);
        for (i = 0; i < 3; i++) { var a = d.pts['a' + i]; gl.uniform3f(loc['a' + i], a ? a[0] : 0, a ? a[1] : 0, u.anc[i]); }
        gl.uniform1f(loc.fade, fade); gl.uniform1f(loc.time, t); gl.uniform1f(loc.dmax, d.dmax || 1); gl.uniform1f(loc.asp, d.w / d.h); gl.uniform2f(loc.res, bw, bh);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        /* a chip that cannot keep up gets a smaller picture, and after that the finished pictures */
        if (!add && dt < 250 && !window.__lfsShot && !/[?&]lfs=full/.test(location.search)) { tAcc += dt; if (++frames === 50) { var avg = tAcc / 50; frames = 0; tAcc = 0; if (avg > 34) { if (++slowN >= 2) { if (scale > .55) { scale *= .7; slowN = 0; this.resize(); } else { GL = null; sec.classList.remove('lfs-live'); } } } else slowN = 0; } }
      }
    };
  })();

  /* ---------- sound: built from tones, started by the first tap, click or key ---------- */
  var SND = (function () {
    var ac = null, on = true, master, hall, pad, lv = { hall: 0, pad: 0 }, done = {}, lastBlink = -1, N = [659.25, 830.61, 987.77];
    function build() {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ac = new AC();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      /* the hall: air as filtered noise, and the lamps' mains hum */
      hall = ac.createGain(); hall.gain.value = 0; hall.connect(master);
      var len = ac.sampleRate * 3, buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0), b = 0;
      for (var i = 0; i < len; i++) { b = (b + .02 * (Math.random() * 2 - 1)) / 1.02; ch[i] = b * 3.2; }
      var ns = ac.createBufferSource(); ns.buffer = buf; ns.loop = true; var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; var ng = ac.createGain(); ng.gain.value = .5;
      ns.connect(lp); lp.connect(ng); ng.connect(hall); ns.start();
      [[100, .05], [200, .022], [300, .008]].forEach(function (h) { var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = h[0]; var g = ac.createGain(); g.gain.value = h[1]; o.connect(g); g.connect(hall); o.start(); });
      /* the plant, seen: a wide calm chord */
      pad = ac.createGain(); pad.gain.value = 0; pad.connect(master);
      [164.81, 246.94, 329.63, 415.3, 493.88].forEach(function (f, i) { var o = ac.createOscillator(); o.type = i < 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i % 2 ? 5 : -5); var g = ac.createGain(); g.gain.value = .03 / (1 + i * .35); o.connect(g); g.connect(pad); o.start(); });
    }
    function ping(f, v, dur, type) {
      if (!ac || !on || ac.state !== 'running') return; var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
    }
    function unlock() { if (!ac) build(); if (ac && ac.state === 'suspended') ac.resume().then(label, label); else label(); }
    ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });
    var touch = matchMedia('(pointer: coarse)').matches;
    function label() { var live = ac && ac.state === 'running'; sndBtn.textContent = !on ? 'Sound off' : live ? 'Sound on' : touch ? 'Tap for sound' : 'Click for sound'; sndBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    sndBtn.addEventListener('click', function () { var live = ac && ac.state === 'running'; on = live ? !on : true; try { localStorage.setItem('lfs-sound', on ? '1' : '0'); } catch (e) {} unlock(); gate = -1; label(); });
    try { if (localStorage.getItem('lfs-sound') === '0') on = false; } catch (e) {} label();
    document.addEventListener('visibilitychange', function () { if (ac) { if (document.hidden) ac.suspend(); else if (vis) ac.resume(); } });
    var gate = -1;
    return {
      gate: function (g) { g = on ? g : 0; if (!ac || g === gate) return; gate = g; master.gain.setTargetAtTime(.9 * g, ac.currentTime, .12); },
      level: function (k, v) { if (!ac || lv[k] === v) return; lv[k] = v; (k === 'hall' ? hall : pad).gain.setTargetAtTime(v * (k === 'hall' ? .5 : 1), ac.currentTime, k === 'hall' ? .06 : .5); },
      thunk: function (off) { ping(off ? 62 : 90, off ? .22 : .1, off ? .35 : .2, 'sine'); ping(off ? 1400 : 2100, .02, .03, 'square'); },
      tick: function () { ping(2400, .05, .06, 'square'); ping(1200, .06, .09); },
      blink: function (t) { var n = Math.floor(t / 2.3); if (n !== lastBlink) { lastBlink = n; ping(1900, .035, .07); } },
      note: function (i) { ping(N[i], .09, 1.5); ping(N[i] * 2, .025, .8); },
      once: function (k) { if (done[k]) return; done[k] = 1; if (k === 'chord') N.forEach(function (f, i) { ping(f / 2, .07, 2.6, 'triangle'); ping(f, .05, 2.2); }); if (k === 'open') [329.63, 493.88, 659.25, 987.77].forEach(function (f, i) { setTimeout(function () { ping(f, .05, 2.4); }, i * 140); }); },
      reset: function (k) { done[k] = 0; },
      quiet: function () { this.gate(0); }
    };
  })();

  /* ---------- lines of light drawn over the picture ---------- */
  var NS = 'http://www.w3.org/2000/svg', lines = [];
  function line(i) { if (!lines[i]) { lines[i] = document.createElementNS(NS, 'line'); ov.appendChild(lines[i]); } return lines[i]; }
  function seg(i, A, B, k, op) {
    var l = line(i); if (!A || !B || k <= 0 || op <= 0) { if (l._o !== 0) { l.setAttribute('opacity', 0); l._o = 0; } return; }
    l.setAttribute('x1', A[0].toFixed(1)); l.setAttribute('y1', A[1].toFixed(1)); l.setAttribute('x2', mix(A[0], B[0], k).toFixed(1)); l.setAttribute('y2', mix(A[1], B[1], k).toFixed(1)); l.setAttribute('opacity', op.toFixed(3)); l._o = op;
  }

  /* ---------- one frame ---------- */
  var current = null, lastT = 0;
  function set(t, o, rise) {
    o = Math.round(o * 1000) / 1000; if (o === t.o) return; t.o = o;
    t.el.style.opacity = o; if (!t.li) t.el.style.transform = o < 1 ? 'translate3d(0,' + ((1 - o) * 6).toFixed(1) + 'px,0)' : ''; t.el.style.visibility = o ? 'visible' : 'hidden';
  }
  function tick(now) {
    if (!vis) return; requestAnimationFrame(tick);
    var t = (now - T0) / 1000, dt = now - lastT; lastT = now;
    readScroll(); ps += (p - ps) * (Math.abs(p - ps) > .2 ? 1 : .18); if (Math.abs(p - ps) < .0002) ps = p;
    ptr.sx += (ptr.x - ptr.sx) * .05; ptr.sy += (ptr.y - ptr.sy) * .05;
    var best = null, bf = -1, other = null, of = 0;
    frames.forEach(function (f) { f.f = fadeOf(f, ps); if (f.f > bf) { bf = f.f; best = f; } });
    frames.forEach(function (f) { if (f !== best && f.f > .004) { other = f; of = f.f; } });
    current = best; var q = clamp((ps - best.a) / (best.b - best.a), 0, 1), live = !!(GL && data && GL.ready(best.plate) && (!other || GL.ready(other.plate)));
    if (data) {
      var k = tall ? .5 : 1, px = (Math.sin(t * .23) * .0035 + ptr.sx * .008) * k, py = (Math.cos(t * .19) * .002 + ptr.sy * .004) * k;
      view.px = px; view.py = py; view.foc = .25;
      if (other) { look(other, clamp((ps - other.a) / (other.b - other.a), 0, 1), t, false); fit(other.plate, U.zoom); if (live) GL.draw(other, of, t, dt, false); }
      look(best, q, t, true); fit(best.plate, U.zoom);
      if (live) GL.draw(best, bf, t, dt, !!other);
    }
    if (live !== (mode === 'gl')) { mode = live ? 'gl' : 'pics'; sec.classList.toggle('lfs-live', live); }
    frames.forEach(function (f) { var o = live ? 0 : Math.round(f.f * 100) / 100; if (o !== f.o) { f.o = o; f.img.style.opacity = o; } });
    stage.style.setProperty('--end', ss(.925, .96, ps).toFixed(3)); stage.style.setProperty('--seen', ss(.7, .735, ps).toFixed(3));
    /* words and facts. On a screen narrower than the picture, the high view pans to the newest fact */
    var newest = -1, tz = null; pan.to = tall ? .5 : .5 + .12 * view.su;
    if (!tall) texts.forEach(function (x) {
      if (x.li || x.o < .05) return;
      if (!x.rc) { var a = x.el.getBoundingClientRect(), b = stage.getBoundingClientRect(); x.rc = { l: a.left - b.left, t: a.top - b.top, r: a.right - b.left, b: a.bottom - b.top }; }
      tz = tz ? { l: Math.min(tz.l, x.rc.l), t: Math.min(tz.t, x.rc.t), r: Math.max(tz.r, x.rc.r), b: Math.max(tz.b, x.rc.b) } : x.rc;
    });
    texts.forEach(function (x) {
      var r = tall ? x.pm : x.p, o = ss(r[0], r[0] + .014, ps) * (r[1] >= 1 ? 1 : 1 - ss(r[1] - .012, r[1], ps));
      if (x.li) {
        if (!data || x.plate !== best.plate) o = 0;
        if (o > 0 && x.plate === 'b' && r[0] > newest && ps < r[1] - .014) { newest = r[0]; pan.to = data[O].b.pts[x.at][0]; }
        if (o > 0) {
          var pt = place(x.plate, x.at); if (!pt) { set(x, 0); return; }
          var X = Math.round(pt[0]), Y = Math.round(pt[1]) + Math.round((1 - o) * 6), off = tall ? x.offm : x.off, ks = tall ? clamp(sw / 390, .9, 1.5) : clamp(sw / 1440, .85, 1.5), dx = off[0] * ks, dy = off[1] * ks;
          if (!x.w) { x.w = x.span.offsetWidth; x.h = x.span.offsetHeight; }
          /* a label never sits on the words or off the stage: try its own side first, then the others */
          var c = [[dx, dy], [-dx, dy], [dx, -dy], [-dx, -dy]], ok = false;
          for (var ci = 0; ci < 4 && !ok; ci++) {
            var l = X + (c[ci][0] > 0 ? c[ci][0] : c[ci][0] - x.w), tp = Y + (c[ci][1] > 0 ? c[ci][1] : c[ci][1] - x.h + 20);
            ok = l > 12 && l + x.w < sw - 12 && tp > (tall ? 70 : 100) && tp + x.h < (tall ? zone : sh - 60) && !(tz && l < tz.r + 16 && l + x.w > tz.l - 16 && tp < tz.b + 12 && tp + x.h > tz.t - 12);
            if (ok) { dx = c[ci][0]; dy = c[ci][1]; }
          }
          if (!ok) { set(x, 0); return; }
          if (X !== x.x || Y !== x.y || dx !== x.dx || dy !== x.dy) {
            x.x = X; x.y = Y; x.dx = dx; x.dy = dy; x.el.style.transform = 'translate3d(' + X + 'px,' + Y + 'px,0)';
            x.span.style.left = (dx > 0 ? dx : dx - x.w) + 'px'; x.span.style.top = (dy > 0 ? dy : dy - x.h + 20) + 'px';
            var ex = dx > 0 ? dx - 8 : dx + 8, ey = dy > 0 ? dy + 10 : dy + 10, len = Math.sqrt(ex * ex + ey * ey);
            x.hair.style.width = len.toFixed(1) + 'px'; x.hair.style.transform = 'rotate(' + Math.atan2(ey, ex).toFixed(4) + 'rad)';
          }
        }
      }
      set(x, o);
    });
    pan.x += (pan.to - pan.x) * Math.min(1, dt * .0022);
    /* lines of light: anchors to the tag, then the floor lines of the map */
    if (data) {
      var d = data[O], i;
      if (best.k === 'found') { var tg = place('c', 'tag'); for (i = 0; i < 3; i++) seg(i, place('c', 'a' + i), tg, pulse.line[i], .75 * bf * (q > .1 ? 1 : 0)); } else for (i = 0; i < 3; i++) seg(i, null);
      if (best.k === 'seen') { seg(3, place('b', 'workerfloor'), place('b', 'freefloor'), ss(.3, .38, q), .7 * bf * (1 - ss(.74, .78, q))); seg(4, place('b', 'dockfloor'), place('b', 'palletfloor'), ss(.44, .52, q), .7 * bf * (1 - ss(.74, .78, q))); } else { seg(3, null); seg(4, null); }
    }
    /* controls */
    var step = ps < .38 ? 0 : ps < .706 ? 1 : 2; rail.forEach(function (a, i) { a.classList.toggle('on', i === step); });
    topLink.classList.toggle('show', now - upT < 2600 && ps > .02);
    var rc = sec.getBoundingClientRect(); SND.gate(rc.top < innerHeight * .7 && rc.bottom > innerHeight * .3 ? 1 : 0);
    if (GL) GL.next();
  }
  new IntersectionObserver(function (es) {
    var v = es[0].isIntersecting; if (v === vis) return; vis = v;
    if (vis) { size(); lastT = performance.now(); requestAnimationFrame(tick); if (!data && !data0) load(); } else SND.quiet();
  }, { rootMargin: '60% 0px' }).observe(sec);
  var data0 = false;
  function load() {
    data0 = true;
    fetch(base + 'lfs.json').then(function (r) { return r.json(); }).then(function (j) { data = j; if (GL) GL.next(); }).catch(function () { data0 = false; });
  }
  window.addEventListener('resize', function () { size(); texts.forEach(function (x) { x.w = 0; x.x = -1; x.rc = null; }); }, { passive: true });
  window.__lfs = { at: function (v) { ps = p = v; }, ready: function () { return !!(data && (!GL || ['a', 'b', 'c', 'd'].every(GL.ready))); }, clock: function (s) { T0 = performance.now() - s * 1000; } };
  size();
})();
