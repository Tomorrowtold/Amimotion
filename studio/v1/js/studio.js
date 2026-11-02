// AmIMotion studio v1: kinetic type, floor shader, cursor, smooth scroll. No libraries.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const conn = navigator.connection || {};
const slow = conn.saveData || /(^|-)2g/.test(conn.effectiveType || '');

/* ---------- reveal on view ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
$$('.k-lines,.k-fade,.k-pic,.wordmark').forEach((el) => { if (!el.closest('.hero')) io.observe(el); });
requestAnimationFrame(() => setTimeout(() => { $('#h1').classList.add('in'); $$('.hero .k-fade').forEach((e, i) => setTimeout(() => e.classList.add('in'), 380 + i * 160)); }, 120));

/* ---------- menu ---------- */
const mb = $('#menuBtn'), sheet = $('#sheet');
mb.addEventListener('click', () => { const o = mb.getAttribute('aria-expanded') !== 'true'; mb.setAttribute('aria-expanded', o); sheet.hidden = !o; });

/* ---------- smooth scroll (wheel only, desktop) ---------- */
let target = scrollY, cur = scrollY, wheeling = false;
if (fine && !reduce) {
  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;
    e.preventDefault();
    if (!wheeling) { target = cur = scrollY; }
    wheeling = true;
    target = clamp(target + e.deltaY * (e.deltaMode === 1 ? 32 : 1), 0, document.documentElement.scrollHeight - innerHeight);
  }, { passive: false });
  addEventListener('keydown', () => { wheeling = false; });
  addEventListener('pointerdown', () => { wheeling = false; });
}

/* ---------- cursor ---------- */
const cursor = $('#cursor');
let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
addEventListener('pointermove', (e) => {
  mx = e.clientX; my = e.clientY; if (e.pointerType === 'mouse') cursor.classList.add('on');
  const t = e.target;
  cursor.classList.toggle('link', !!t.closest('a,button'));
  cursor.classList.toggle('scope', !!t.closest('.floor-gl'));
}, { passive: true });
document.addEventListener('pointerleave', () => cursor.classList.remove('on'));

/* ---------- magnetic + tilt ---------- */
if (fine && !reduce) {
  $$('.magnet').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; const k = el.classList.contains('cta') ? .04 : .25; el.style.transform = `translate(${x * k}px,${y * k}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  $$('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- the question types itself ---------- */
const q = $('#question'), qt = $('.q-text', q), full = qt.textContent;
if (!reduce) {
  qt.textContent = '';
  new IntersectionObserver((es, o) => es.forEach((e) => {
    if (!e.isIntersecting) return; o.disconnect();
    let i = 0; const step = () => { i++; qt.textContent = full.slice(0, i); if (i < full.length) setTimeout(step, 22 + Math.random() * 38); else q.classList.add('done'); };
    setTimeout(step, 300);
  }), { threshold: .6 }).observe(q);
} else q.classList.add('done');

/* ---------- floor shader (raw WebGL, ~4 KB) ---------- */
const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const FS = `precision highp float;varying vec2 v;
uniform sampler2D tA,tB;uniform vec2 res,img,mouse,center;uniform float reveal,lens,time,mode,edgeOn;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){return n(p)*.55+n(p*2.1)*.28+n(p*4.3)*.17;}
vec2 cover(vec2 uv){float ra=res.x/res.y,ia=img.x/img.y;vec2 s=ra>ia?vec2(1.,ia/ra):vec2(ra/ia,1.);vec2 pan=mode>.5?clamp(center-vec2(.42,.45),-(1.-s)*.5,(1.-s)*.5):vec2(0.);return (uv-.5)*s+.5+pan;}
void main(){
  vec2 uv=vec2(v.x,1.-v.y);
  vec2 par=(mouse-.5)*.012;
  vec2 iu=cover((uv-.5)/1.035+.5+par);
  vec3 A=texture2D(tA,iu).rgb, B=texture2D(tB,iu).rgb;
  vec2 ip=(iu-center)*vec2(img.x/img.y,1.);
  float d=length(mode>.5?ip*vec2(.82,1.25):ip);
  float w=fbm(iu*7.+time*.05)*.04;
  float r=reveal;
  float k=1.-smoothstep(r-.012,r+.012,d+w);
  vec3 col=mix(B,A,k);
  float edge=exp(-pow((d+w-r)/.0016,2.))*edgeOn*step(.001,r);
  col=mix(col,vec3(.12,.42,1.),edge*.9);
  vec2 mp=(uv-mouse)*res;float ld=length(mp);
  float L=1.-smoothstep(lens-1.5,lens+1.5,ld);
  col=mix(col,mix(A,B,k),L);
  col=mix(col,vec3(.12,.42,1.),(1.-smoothstep(0.,1.5,abs(ld-lens)))*step(1.,lens)*.85);
  col+=(h(uv*res+time)-.5)*.018;
  gl_FragColor=vec4(col,1.);}`;

function floorGL(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['tA', 'tB', 'res', 'img', 'mouse', 'center', 'reveal', 'lens', 'time', 'mode', 'edgeOn'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  const big = innerWidth * Math.min(devicePixelRatio, 2) > 900 ? 1600 : 800;
  const load = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); res(); }; im.src = `${src}-${big}.webp`; });
  const st = { reveal: 0, lens: 0, mouse: [.5, .5], m: [.5, .5], ready: false };
  Promise.all([load(canvas.dataset.after, 0), load(canvas.dataset.before, 1)]).then(() => { gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); st.ready = true; canvas.classList.add('ready'); });
  const size = () => { const d = Math.min(devicePixelRatio, 1.75); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; st.dpr = d; gl.viewport(0, 0, canvas.width, canvas.height); };
  size(); addEventListener('resize', size);
  const bay = canvas.dataset.mode === 'bay';
  st.center = bay ? [.33, .76] : [.875, .24];
  let over = false;
  canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); st.m = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; over = e.pointerType === 'mouse'; });
  canvas.addEventListener('pointerleave', () => { over = false; });
  st.draw = (t) => {
    if (!st.ready) return;
    st.mouse = [lerp(st.mouse[0], st.m[0], .12), lerp(st.mouse[1], st.m[1], .12)];
    st.lens = lerp(st.lens, over && !bay ? 110 : 0, .12);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.img, 1600, 2000);
    gl.uniform2f(U.mouse, st.mouse[0], st.mouse[1]); gl.uniform2f(U.center, st.center[0], st.center[1]);
    gl.uniform1f(U.reveal, st.reveal); gl.uniform1f(U.lens, st.lens * st.dpr); gl.uniform1f(U.time, t * .001); gl.uniform1f(U.mode, bay ? 1 : 0); gl.uniform1f(U.edgeOn, bay ? .6 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  return st;
}

const floorSec = $('#floor'), baySec = $('#bay');
let F = null, Bq = null;
const vis = new Map();
const watch = new IntersectionObserver((es) => es.forEach((e) => vis.set(e.target, e.isIntersecting)), { rootMargin: '200px' });
[floorSec, baySec].forEach((s) => watch.observe(s));
const startGL = () => { if (!reduce) { F = floorGL($('#floorGL')); Bq = floorGL($('#bayGL')); } };
const progress = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };

/* ---------- parallax pictures ---------- */
const pics = $$('.pic-inner');

/* ---------- bar ---------- */
const bar = $('#bar'); let lastY = 0;

/* ---------- main loop ---------- */
function frame(t) {
  if (wheeling) { cur = lerp(cur, target, .11); if (Math.abs(target - cur) < .5) { cur = target; wheeling = false; } scrollTo(0, cur); }
  const y = scrollY;
  bar.classList.toggle('scrolled', y > 20);
  bar.classList.toggle('hide', y > innerHeight * 1.2 && y > lastY + 2 && sheet.hidden);
  if (Math.abs(y - lastY) > 2) lastY = y;

  cx = lerp(cx, mx, .2); cy = lerp(cy, my, .2);
  cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;

  if (F && vis.get(floorSec)) {
    const p = progress(floorSec);
    F.reveal = lerp(F.reveal, clamp((p - .18) / .6) * 1.45, .14);
    floorSec.classList.toggle('s1', p > .48);
    $('#meter').style.transform = `scaleX(${clamp((p - .18) / .6)})`;
    F.draw(t);
  } else if (!F && vis.get(floorSec)) { floorSec.classList.toggle('s1', progress(floorSec) > .48); }
  if (Bq && vis.get(baySec)) {
    const p = progress(baySec);
    Bq.reveal = lerp(Bq.reveal, clamp((p - .1) / .5) * .27, .12);
    Bq.draw(t);
  }
  if (!reduce) for (const el of pics) { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue; const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; el.style.transform = `translate3d(0,${k * -6}%,0)`; }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- progressive 3D: after first paint and idle ---------- */
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
addEventListener('load', () => idle(() => {
  startGL();
  if (slow || reduce) return;
  import('./tag.js').then((m) => m.init($('#tagGL'), $('#tagFallback'), $('#hero'))).catch(() => {});
}));
