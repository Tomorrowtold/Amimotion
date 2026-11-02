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
$$('.k-lines,.k-fade,.k-pic,.k-rise,.wordmark').forEach((el) => { if (!el.closest('.hero')) io.observe(el); });
requestAnimationFrame(() => setTimeout(() => { $('#h1').classList.add('in'); $$('.hero .k-fade').forEach((e, i) => setTimeout(() => e.classList.add('in'), 380 + i * 160)); }, 120));

/* ---------- menu ---------- */
const mb = $('#menuBtn'), sheet = $('#sheet') || { hidden: true };
if (mb) mb.addEventListener('click', () => { const o = mb.getAttribute('aria-expanded') !== 'true'; mb.setAttribute('aria-expanded', o); sheet.hidden = !o; });

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

/* ---------- the film settles on a chapter when the visitor stops scrolling ---------- */
let settleT = 0;
const settle = () => {
  if (reduce || !storySec || wheeling) return;
  const top = storySec.offsetTop, len = storySec.offsetHeight - innerHeight, y = scrollY, p = (y - top) / len;
  if (p < -.12 || p > .985) return;
  const rests = [0, ...[0, 1, 2, 3, 4, 5, 6].map((i) => (i + .82) / 7)];
  let best = rests[0]; for (const r of rests) if (Math.abs(r - p) < Math.abs(best - p)) best = r;
  const to = top + best * len; if (Math.abs(to - y) < 6) return;
  target = to; cur = y; wheeling = true;
};
addEventListener('touchstart', () => { wheeling = false; clearTimeout(settleT); }, { passive: true });
addEventListener('scroll', () => { clearTimeout(settleT); if (!wheeling) settleT = setTimeout(settle, 240); }, { passive: true });

/* ---------- cursor ---------- */
const cursor = $('#cursor');
let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
addEventListener('pointermove', (e) => {
  mx = e.clientX; my = e.clientY; if (!cursor) return; if (e.pointerType === 'mouse') cursor.classList.add('on');
  const t = e.target;
  cursor.classList.toggle('link', !!t.closest('a,button'));
  
}, { passive: true });
document.addEventListener('pointerleave', () => cursor && cursor.classList.remove('on'));

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

/* ---------- the film's question types itself when its chapter opens ---------- */
const qb = document.querySelector('.cap .q-big');
if (qb && !reduce) {
  const full = qb.textContent; qb.setAttribute('aria-label', full); let timer = 0, typed = false;
  new MutationObserver(() => {
    const on = qb.parentElement.classList.contains('on');
    if (on && !typed) { typed = true; let i = 0; qb.textContent = ''; const step = () => { i++; qb.textContent = full.slice(0, i); if (i < full.length) timer = setTimeout(step, 18 + Math.random() * 30); }; timer = setTimeout(step, 250); }
    if (!on && typed) { clearTimeout(timer); typed = false; qb.textContent = full; }
  }).observe(qb.parentElement, { attributes: true, attributeFilter: ['class'] });
}

/* ---------- one system: vertical scroll moves the track sideways, tag, then anchor, then AmIHub ---------- */
/* ---------- the products: names first, then one product per scroll ---------- */
const kn = $('#system'), knItems = kn ? [...kn.querySelectorAll('.kn-item')] : [], knShots = kn ? [...kn.querySelectorAll('.kn-shot')] : [], knSweep = kn && kn.querySelector('.kn-sweep');
if (kn && reduce) kn.classList.add('kn-static');
const sm = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const KN_AT = [.1, .38, .66];
let knStep = -2;
const knSet = (st) => {
  if (st === knStep) return;
  const prev = knStep; knStep = st;
  knItems.forEach((el, i) => el.classList.toggle('on', i === st));
  knShots.forEach((el, i) => { el.classList.toggle('on', i === st); el.classList.toggle('out', i === prev && i !== st); });
  kn.classList.toggle('lit', st >= 0);
  if (st >= 0 && knSweep && !reduce) { knSweep.classList.remove('go'); void knSweep.offsetWidth; knSweep.classList.add('go'); }
};
const knFrame = () => {
  if (!kn || reduce) return;
  const sc = kn;
  const r = sc.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
  const p = clamp(-r.top / (r.height - innerHeight));
  knSet(p < KN_AT[0] ? -1 : p < KN_AT[1] ? 0 : p < KN_AT[2] ? 1 : 2);
  kn.style.setProperty('--f', sm(.84, .94, p).toFixed(3));
};
if (kn) kn.querySelectorAll('.kn-go').forEach((b) => b.addEventListener('click', () => {
  const sc = kn, i = +b.dataset.i, top = sc.getBoundingClientRect().top + scrollY, span = sc.offsetHeight - innerHeight;
  scrollTo({ top: top + span * ([.22, .5, .8][i]), behavior: reduce ? 'auto' : 'smooth' });
}));

/* ---------- book a call: four fields, then the calendar ---------- */
const bookForm = $('.book-form');
if (bookForm) {
  const err = bookForm.querySelector('.bf-err'), go = bookForm.querySelector('.book-go');
  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = bookForm.elements, name = f.name.value.trim(), email = f.email.value.trim(), site = f.website.value.trim(), role = (bookForm.querySelector('input[name=role]:checked') || {}).value || '';
    f.name.setAttribute('aria-invalid', String(!name)); const okMail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email); f.email.setAttribute('aria-invalid', String(!okMail));
    if (!name || !okMail) { err.hidden = false; err.textContent = !name ? 'Please add your name.' : 'Please add a valid work email.'; (!name ? f.name : f.email).focus(); return; }
    err.hidden = true; go.disabled = true;
    const CFG = window.AMIMOTION_CONFIG || {}, lead = { source: 'homepage-book', name, email, website: site, role, page: location.href };
    if (CFG.leadEndpoint) { try { await fetch(CFG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }); } catch (x) {} }
    const base = CFG.bookingUrl || '';
    if (base) {
      const u = new URL(base); u.searchParams.set('name', name); u.searchParams.set('email', email);
      if (site) u.searchParams.set('a1', site); if (role) u.searchParams.set('a2', role);
      u.searchParams.set('notes', [site, role].filter(Boolean).join(' · '));
      location.href = u.toString();
    } else {
      location.href = `./contact/index.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    }
  });
}

const bookDlg = $('#book');
if (bookDlg && bookDlg.showModal) {
  const openBook = (e) => { e.preventDefault(); bookDlg.showModal(); setTimeout(() => bookDlg.querySelector('input[name=name]').focus(), 60); };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a'); if (!a || bookDlg.contains(a)) return;
    if (/contact\//.test(a.getAttribute('href') || '') && /book a call/i.test(a.textContent)) openBook(e);
  });
  bookDlg.querySelector('.book-x').addEventListener('click', () => bookDlg.close());
  bookDlg.addEventListener('click', (e) => { if (e.target === bookDlg) bookDlg.close(); });
}

/* ---------- details open with a soft height animation ---------- */
$$('details').forEach((d) => {
  const sum = d.querySelector('summary'), more = d.querySelector('.more');
  sum.addEventListener('click', (e) => {
    if (reduce) return; e.preventDefault();
    if (d.open) { const h = more.offsetHeight; more.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,.7,.2,1)' }).onfinish = () => { d.open = false; }; }
    else { d.open = true; const h = more.offsetHeight; more.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22,.7,.2,1)' }); }
  });
});

/* ---------- the story film ---------- */
const storySec = $('#story'); let drawStory = null, storyOn = false;
new IntersectionObserver((es) => { storyOn = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(storySec);
const startGL = () => { if (!reduce) import('./story.js').then((m) => { drawStory = m.story(storySec, $('#storyGL')); }); };
/* ---------- parallax pictures ---------- */
const pics = $$('.card-pic img');

/* ---------- prologue film ---------- */
const pro = $('#prologue'), pf = $('#prologueFrame'), pv = pro && pro.querySelector('video');
if (pv) new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { if (!pv.src && !slow) { pv.src = pv.dataset.src; } if (pv.src && !reduce) pv.play().catch(() => {}); } else pv.pause();
}), { rootMargin: '200px' }).observe(pro);

/* ---------- bar ---------- */
const bar = $('#bar') || document.createElement('i'); let lastY = 0;

/* ---------- main loop ---------- */
function frame(t) {
  if (wheeling) { cur = lerp(cur, target, .11); if (Math.abs(target - cur) < .5) { cur = target; wheeling = false; clearTimeout(settleT); settleT = setTimeout(settle, 240); } scrollTo(0, cur); }
  const y = scrollY;
  bar.classList.toggle('scrolled', y > 20);
  bar.classList.toggle('hide', y > innerHeight * 1.2 && y > lastY + 2 && sheet.hidden);
  if (Math.abs(y - lastY) > 2) lastY = y;

  cx = lerp(cx, mx, .2); cy = lerp(cy, my, .2);
  cursor && (cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`);

  if (drawStory && storyOn) drawStory(t);
  knFrame();
  if (pf && !reduce) { const r = pro.getBoundingClientRect(); const k = clamp(-r.top / (r.height - innerHeight) * 1.25 + .15); const e = 1 - Math.pow(1 - k, 3);
    pf.style.setProperty('--pi', `${(1 - e) * 18}%`); pf.style.setProperty('--pj', `${(1 - e) * 22}%`); pf.style.setProperty('--pr', `${(1 - e) * 28}px`); pf.style.setProperty('--ps', `${1.18 - e * .18}`); }
  if (!reduce) for (const el of pics) { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue; const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; el.style.setProperty('--py', `${k * -5}%`); }
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

/* ---------- plan your first bay: the first answer opens the real planner in a glass window ---------- */
const simSec = $('#sim');
if (simSec) {
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) simSec.classList.add('in'); }), { threshold: .3 }).observe(simSec);
  const win = simSec.querySelector('.sim-window'), frame = simSec.querySelector('.sim-frame');
  const dress = (doc) => {
    const st = doc.createElement('style');
    st.textContent = `header.top,.dock,.scrim,.foot,footer,.head,.skip-link,.cursor,main > section:not(:has([data-diag])),main > *:not(section){display:none!important}
      html,body{background:transparent!important}body{padding:0!important}main{padding:0!important;margin:0!important}
      main > section:has([data-diag]){padding:clamp(18px,2.4vw,34px)!important;margin:0!important}`;
    doc.head.appendChild(st);
    if (!doc.querySelector('script[data-pl]')) { const sc = doc.createElement('script'); sc.src = '../assets/studio/js/planner.js'; sc.dataset.pl = '1'; doc.body.appendChild(sc); }
  };
  const open = (v) => {
    simSec.classList.add('open'); win.hidden = false;
    const go = () => { try { const d = frame.contentDocument; dress(d); const pick = () => { const b = d.querySelector(`.diag-opt[data-v="${v}"]`); if (b) { if (b.getAttribute('aria-pressed') !== 'true') b.click(); } else setTimeout(pick, 120); }; pick(); } catch (e) {} };
    if (!frame.src) { frame.addEventListener('load', go, { once: true }); frame.src = './diagnostic/index.html'; } else go();
    if (!simSec.closest('.trio')) setTimeout(() => win.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 250);
  };
  simSec.querySelectorAll('.sim-opt').forEach((b) => b.addEventListener('click', () => open(b.dataset.v)));
  simSec.querySelector('.sim-close').addEventListener('click', () => { simSec.classList.remove('open'); win.hidden = true; });
  const shut = () => { simSec.classList.remove('open'); win.hidden = true; };
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !win.hidden) shut(); });
  document.addEventListener('pointerdown', (e) => { if (!win.hidden && !win.contains(e.target) && !e.target.closest('.sim-opt')) shut(); });
}


/* ---------- floors: three real floors at night; what moves carries blue, what waits carries amber ---------- */
(() => {
  const cards = $$('.ind'); if (!cards.length) return;
  const band = cards[0].closest('.inds');
  const small = matchMedia('(max-width:700px)').matches;
  const lowData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  // every literal path is written out so the site build can find and copy it
  const SRC = {
    factory: { ph: small ? 'assets/floors/factory-900.webp' : 'assets/floors/factory-1600.webp', mk: 'assets/floors/factory-mask.png', pa: 'assets/floors/factory-path.png', f: [.42, .55], d: 0 },
    warehouse: { ph: small ? 'assets/floors/warehouse-900.webp' : 'assets/floors/warehouse-1600.webp', mk: 'assets/floors/warehouse-mask.png', pa: 'assets/floors/warehouse-path.png', f: [.5, .6], d: .35 },
    robots: { ph: small ? 'assets/floors/robots-900.webp' : 'assets/floors/robots-1600.webp', mk: 'assets/floors/robots-mask.png', pa: 'assets/floors/robots-path.png', f: [.47, .6], d: .7, z: 1.2 },
  };
  const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
  const FS = `precision highp float;varying vec2 v;
uniform sampler2D P,M,L;uniform vec2 C,E,R;uniform float Z,T,H,G,B;
float hs(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 u=C+(v-.5)*E/Z;
  vec3 ph=texture2D(P,u).rgb; vec4 m=texture2D(M,u); vec2 l=texture2D(L,u).rg;
  float g=dot(ph,vec3(.2126,.7152,.0722));
  float vy=mix(.55,1.15,1.-u.y);
  // the plant after hours: colour drained, cool, the roof falling into the dark
  vec3 night=(g+(ph-g)*.12)*vec3(.55,.64,.95)*.13*vy+vec3(.006,.008,.02);
  // hover: the floor comes up under a cool work light
  vec3 o=mix(night,ph*vec3(.6,.67,.82)*.5*vy,H*.55);
  float br=.88+.12*sin(T*1.25+B*6.);
  vec3 blue=ph*vec3(.72,.88,1.25)*.95+vec3(0.,.03,.12);
  vec3 amb=(g*.6+ph*.4)*vec3(1.3,.84,.4)*1.05;
  o=mix(o,blue,m.r*.9*(.85+.15*H));
  o=mix(o,amb*br,m.g*.88);
  o+=vec3(1.,.58,.16)*m.b*(.15+.85*g)*.42*br;
  // the line on the floor draws in, then light travels along it toward what moves
  float on=l.r<.999?smoothstep(G+.004,G-.012,l.r):0.;
  float hd=fract(T*.16+B)*1.5;
  float cm=exp(-pow((hd-l.r)*9.,2.))*step(l.r,hd);
  o+=vec3(.25,.5,1.)*l.g*on*(1.+1.4*cm);
  float vg=smoothstep(1.25,.25,length((v-.5)*vec2(1.1,1.5)));
  o*=mix(.55,1.,vg);
  o=1.-exp(-o*1.25);
  o+=(hs(v*R+fract(T*7.))-.5)*.014;
  gl_FragColor=vec4(o,1.);
}`;
  const load = (src) => new Promise((ok, no) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = no; i.src = src; });
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  let seen = -1;
  const scenes = [];
  cards.forEach((card) => {
    const cv = card.querySelector('canvas'), S = SRC[card.dataset.scene]; if (!S) return;
    const gl = !lowData && cv.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['P', 'M', 'L', 'C', 'E', 'R', 'Z', 'T', 'H', 'G', 'B'].forEach((k) => (U[k] = gl.getUniformLocation(pr, k)));
    const sc = { card, cv, gl, U, S, W: 0, H: 0, vis: false, mx: 0, my: 0, px: 0, py: 0, hov: 0, hovT: 0, ready: false, iw: 4, ih: 3 };
    const fit = () => { const d = Math.min(1.5, devicePixelRatio || 1); sc.W = cv.clientWidth; sc.H = cv.clientHeight; cv.width = Math.max(1, sc.W * d | 0); cv.height = Math.max(1, sc.H * d | 0); };
    new ResizeObserver(fit).observe(cv); fit();
    new IntersectionObserver((es) => { sc.vis = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(cv);
    card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); sc.mx = (e.clientX - r.left) / r.width - .5; sc.my = (e.clientY - r.top) / r.height - .5; card.style.setProperty('--mx', (sc.mx + .5) * 100 + '%'); card.style.setProperty('--my', (sc.my + .5) * 100 + '%'); card.style.setProperty('--ry', (sc.mx * 5).toFixed(2) + 'deg'); card.style.setProperty('--rx', (-sc.my * 4).toFixed(2) + 'deg'); });
    card.addEventListener('pointerenter', () => (sc.hovT = 1)); card.addEventListener('pointerleave', () => { sc.hovT = 0; sc.mx = sc.my = 0; card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    card.addEventListener('focus', () => (sc.hovT = 1)); card.addEventListener('blur', () => (sc.hovT = 0));
    Promise.all([load(S.ph), load(S.mk), load(S.pa)]).then((ims) => {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      ims.forEach((im, i) => {
        const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      });
      gl.uniform1i(U.P, 0); gl.uniform1i(U.M, 1); gl.uniform1i(U.L, 2);
      sc.iw = ims[0].naturalWidth; sc.ih = ims[0].naturalHeight; sc.ready = true;
    }).catch(() => {});
    scenes.push(sc);
  });
  if (!scenes.length) return;
  // the lines start drawing when the band arrives
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { seen = performance.now(); io.disconnect(); } }, { threshold: .35 }).observe(band);
  const draw = (sc, now) => {
    const { gl, U, cv, S } = sc; if (!sc.ready || !sc.W) return;
    const t = now / 1000;
    sc.hov += (sc.hovT - sc.hov) * .07; sc.px += (sc.mx - sc.px) * .06; sc.py += (sc.my - sc.py) * .06;
    // cover the card with the still, held on its focus point
    const ca = sc.W / sc.H, ia = sc.iw / sc.ih;
    let ex = 1, ey = 1; if (ca > ia) ey = ia / ca; else ex = ca / ia;
    const z = (S.z || 1.035) + sc.hov * .06;
    const hx = ex / z / 2, hy = ey / z / 2;
    let cx = S.f[0] + sc.px * .03, cy = 1 - S.f[1] - sc.py * .025;
    cx = Math.min(1 - hx, Math.max(hx, cx)); cy = Math.min(1 - hy, Math.max(hy, cy));
    const g = reduce ? 1 : seen < 0 ? 0 : ease((now - seen) / 1000 / 2.2 - S.d);
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform2f(U.C, cx, cy); gl.uniform2f(U.E, ex, ey); gl.uniform2f(U.R, cv.width, cv.height);
    gl.uniform1f(U.Z, z); gl.uniform1f(U.T, reduce ? 2 : t); gl.uniform1f(U.H, sc.hov); gl.uniform1f(U.G, g * 1.02); gl.uniform1f(U.B, S.d);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!sc.on) { sc.on = true; sc.card.classList.add('lit'); }
  };
  const loop = (now) => { requestAnimationFrame(loop); scenes.forEach((sc) => { if (sc.vis) draw(sc, now); }); };
  if (reduce) { const once = () => { scenes.forEach((sc) => draw(sc, 1e4)); if (scenes.some((s) => !s.ready)) setTimeout(once, 200); }; once(); }
  else requestAnimationFrame(loop);
})();
