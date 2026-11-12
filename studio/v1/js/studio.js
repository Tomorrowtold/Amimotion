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
// the hero's words arrive with the tag: one choreography from the first frame (or on their own if the 3D cannot start soon)
{ let shown = false; const show = () => { if (shown) return; shown = true; requestAnimationFrame(() => setTimeout(() => { $('#h1').classList.add('in'); $$('.hero .k-fade').forEach((e, i) => setTimeout(() => e.classList.add('in'), 380 + i * 160)); }, 140)); };
  if (document.documentElement.classList.contains('tag-live')) { addEventListener("tag:ready", show, { once: true }); setTimeout(show, 900); } else show(); }

/* ---------- menu ---------- */
const mb = $('#menuBtn'), sheet = $('#sheet') || { hidden: true };
if (mb) mb.addEventListener('click', () => { const o = mb.getAttribute('aria-expanded') !== 'true'; mb.setAttribute('aria-expanded', o); sheet.hidden = !o; });

/* ---------- scroll: the browser's own, everywhere. One exception: the first scroll in the hero glides straight into the film ----------
   The glide needs non-passive wheel/touch listeners, and a non-passive listener on the window makes every scroll on the page wait for
   JavaScript (the compositor cannot scroll on its own). So they are attached only while the page is in the hero, and taken off after. */
let wheeling = false; const STILL = /[?&]still\b/.test(location.search); // screenshots: no glide
const glide = { on: false, to: 0, end: 0, hero: false };   // hero: the glide is the hero's own (other sections reuse glideTo)
const filmStart = () => { const s = storySec; if (!s) return 0; const top = s.getBoundingClientRect().top + scrollY, len = s.offsetHeight - innerHeight, nb = +s.dataset.beats || 19; return Math.round(top + len * (.78 / nb)); };
let fsCache = 0; const fsNow = () => fsCache || (fsCache = filmStart());
addEventListener('resize', () => { fsCache = 0; }); addEventListener('load', () => { fsCache = 0; });
const glideTo = (to, ms = 1050, hero = false) => {
  if (glide.on) return; glide.on = true; glide.hero = hero; const from = scrollY, t0 = performance.now(); document.documentElement.classList.add('gliding');
  const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const step = (now) => { const k = Math.min(1, (now - t0) / ms); scrollTo(0, from + (to - from) * ease(k)); if (k < 1) requestAnimationFrame(step); else { glide.on = false; glide.end = performance.now(); document.documentElement.classList.remove('gliding'); } };
  requestAnimationFrame(step);
};
const inHero = (dir) => { const fs = fsNow(); return dir > 0 ? scrollY < fs - 4 : scrollY > 4 && scrollY <= fs + 4; };
if (!reduce && !STILL) {
  // a trackpad keeps sending wheel events for a second or two after the fingers lift; after a glide those belong to the same
  // gesture, so they are held until the stream pauses (a new gesture), instead of flinging the visitor past the film's first beats
  let lastWheel = 0, lastMag = 0;
  const onWheel = (e) => {
    const now = performance.now(), gap = now - lastWheel, mag = Math.abs(e.deltaY), prev = lastMag; lastWheel = now; lastMag = mag;
    if (e.ctrlKey || document.documentElement.classList.contains('sim-lock')) return;
    // what this handler takes, nothing after it sees (the explainer's beat stepper must not step on the hero's momentum)
    const mine = glide.hero;   // a glide started by another section (guides) is that section's to manage
    if (glide.on && mine) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    // still the same flick: no pause, and the deltas are dying away rather than a fresh push
    if (mine && !glide.on && gap < 110 && now - glide.end < 2600 && mag <= prev * 1.15 + 1) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    const dir = Math.sign(e.deltaY); if (!dir || !inHero(dir)) return;
    e.preventDefault(); e.stopImmediatePropagation(); glideTo(dir > 0 ? (fsCache = filmStart()) : 0, dir > 0 ? 1050 : 800, true);
  };
  let ty0 = null;
  const onTouchStart = (e) => { ty0 = e.touches[0].clientY; };
  const onTouchMove = (e) => { if (glide.on && glide.hero) { e.preventDefault(); e.stopImmediatePropagation(); return; } if (ty0 == null) return; const dy = ty0 - e.touches[0].clientY; if (Math.abs(dy) < 12) return; const dir = Math.sign(dy); if (inHero(dir)) { e.preventDefault(); e.stopImmediatePropagation(); ty0 = null; glideTo(dir > 0 ? (fsCache = filmStart()) : 0, 900, true); } };
  let armed = false;
  const arm = () => {
    const want = scrollY <= fsNow() + innerHeight * .5 || (glide.hero && (glide.on || performance.now() - glide.end < 2600));
    if (want === armed) return; armed = want;
    const f = want ? addEventListener : removeEventListener;
    // capture phase: the hero always decides first, whatever was attached later
    f('wheel', onWheel, { passive: false, capture: true }); f('touchmove', onTouchMove, { passive: false, capture: true }); f('touchstart', onTouchStart, { passive: true, capture: true });
  };
  addEventListener('scroll', arm, { passive: true }); queueMicrotask(arm);
  addEventListener('keydown', (e) => {
    if (!armed) return;
    const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1 : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0;
    if (!dir || e.target.closest('input,textarea,select,button,[contenteditable]')) return;
    if (glide.on && glide.hero) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (inHero(dir)) { e.preventDefault(); e.stopImmediatePropagation(); glideTo(dir > 0 ? (fsCache = filmStart()) : 0, 1050, true); }
  }, true);
}

/* ---------- while the page is moving, nothing under a still cursor reacts (cards would grow and relayout mid-scroll) ---------- */
{
  const html = document.documentElement; let st = 0;
  addEventListener('scroll', () => { if (!st) html.classList.add('is-scrolling'); clearTimeout(st); st = setTimeout(() => { st = 0; html.classList.remove('is-scrolling'); }, 180); }, { passive: true });
}

/* ---------- where things are: measured once (and when the page changes size), so scroll frames never force a layout ---------- */
const geo = new Map();
const measure = () => { geo.forEach((g, el) => { const r = el.getBoundingClientRect(); g.top = r.top + scrollY; g.h = el.offsetHeight; }); };
const track = (el) => { if (el && !geo.has(el)) { geo.set(el, { top: 0, h: 0 }); const r = el.getBoundingClientRect(); geo.get(el).top = r.top + scrollY; geo.get(el).h = el.offsetHeight; } return geo.get(el); };
let mq = 0; const remeasure = () => { if (mq) return; mq = requestAnimationFrame(() => { mq = 0; measure(); fsCache = 0; }); };
addEventListener('resize', remeasure); addEventListener('load', remeasure);
if (window.ResizeObserver) new ResizeObserver(remeasure).observe(document.body);
// progress through a pinned section, from the scroll position alone
const pinP = (el) => { const g = geo.get(el) || track(el); return { top: g.top - scrollY, h: g.h }; };

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
  const mo = new MutationObserver(() => {
    const on = qb.classList.contains('lit') && qb.parentElement.classList.contains('on');
    if (on && !typed) { typed = true; let i = 0; qb.textContent = ''; const step = () => { i++; qb.textContent = full.slice(0, i); if (i < full.length) timer = setTimeout(step, 18 + Math.random() * 30); }; timer = setTimeout(step, 250); }
    if (!on && typed) { clearTimeout(timer); typed = false; qb.textContent = full; }
  }); mo.observe(qb.parentElement, { attributes: true, attributeFilter: ['class'] }); mo.observe(qb, { attributes: true, attributeFilter: ['class'] });
}

/* ---------- one system: vertical scroll moves the track sideways, tag, then anchor, then AmIHub ---------- */
/* ---------- the products: names first, then one product per scroll ---------- */
const kn = $('#system'), knItems = kn ? [...kn.querySelectorAll('.kn-item')] : [], knShots = kn ? [...kn.querySelectorAll('.kn-shot')] : [], knSweep = kn && kn.querySelector('.kn-sweep');
if (kn && reduce) kn.classList.add('kn-static');
const sm = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const KN_AT = [-1, .36, .68];
let knStep = -2;
const knSet = (st) => {
  if (st === knStep) return;
  const prev = knStep; knStep = st;
  knItems.forEach((el, i) => el.classList.toggle('on', i === st));
  knShots.forEach((el, i) => { el.classList.toggle('on', i === st); el.classList.toggle('out', i === prev && i !== st); });
  kn.classList.toggle('lit', st >= 0);
  if (st >= 0 && knSweep && !reduce) { knSweep.classList.remove('go'); void knSweep.offsetWidth; knSweep.classList.add('go'); }
};
let knNear = false, knF = '';
if (kn) new IntersectionObserver((es) => { knNear = es[0].isIntersecting; }, { rootMargin: '100px 0px' }).observe(kn);
const knFrame = () => {
  if (!kn || reduce || !knNear) return;
  const r = pinP(kn); if (r.top + r.h < 0 || r.top > innerHeight) return;
  const p = clamp(-r.top / (r.h - innerHeight));
  knSet(p < KN_AT[0] ? -1 : p < KN_AT[1] ? 0 : p < KN_AT[2] ? 1 : 2);
  const f = sm(.84, .94, p).toFixed(3); if (f !== knF) { knF = f; kn.style.setProperty('--f', f); }
};
if (kn) kn.querySelectorAll('.kn-go').forEach((b) => b.addEventListener('click', () => {
  const sc = kn, i = +b.dataset.i, top = sc.getBoundingClientRect().top + scrollY, span = sc.offsetHeight - innerHeight;
  scrollTo({ top: top + span * ([.12, .5, .82][i]), behavior: reduce ? 'auto' : 'smooth' });
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
$$('main details').forEach((d) => {   // the page's own details only: the nav's doors run their own script
  const sum = d.querySelector('summary'), more = d.querySelector('.more');
  if (!sum || !more) return;
  sum.addEventListener('click', (e) => {
    if (reduce) return; e.preventDefault();
    if (d.open) { const h = more.offsetHeight; more.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,.7,.2,1)' }).onfinish = () => { d.open = false; }; }
    else { d.open = true; const h = more.offsetHeight; more.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22,.7,.2,1)' }); }
  });
});

/* ---------- the story film ---------- */
const storySec = $('#story'); let drawStory = null, storyOn = false;
new IntersectionObserver((es) => { storyOn = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(storySec);
let drawBridge = null;
const startGL = () => { if (!reduce) import('./story.js').then((m) => { drawStory = m.story(storySec, $('#storyGL'));
  // the landing between the hero and the film
  if ($('#descent') && $('#bridgeGL')) import('./bridge.js').then((b) => { drawBridge = b.bridge({ descent: $('#descent'), hero: $('#hero'), copy: $('#hero .hero-copy'), stage: $('#hero .hero-stage'), canvas: $('#bridgeGL'), hudEl: $('#bridgeHUD'), story: storySec, panel: $('#storyGL').parentElement, sticky: $('#storyGL').closest('.story-sticky'), fallback: $('#tagFallback') }); }); }); };
/* ---------- parallax pictures ---------- */
const pics = $$('.card-pic img');

/* ---------- prologue film ---------- */
const pro = $('#prologue'), pf = $('#prologueFrame'), pv = pro && pro.querySelector('video');
if (pv) new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { if (!pv.src && !slow) { pv.src = pv.dataset.src; } if (pv.src && !reduce) pv.play().catch(() => {}); } else pv.pause();
}), { rootMargin: '200px' }).observe(pro);

/* ---------- bar ---------- */
const bar = $('#bar') || document.createElement('i'); let lastY = 0, barS = null, barH = null;

/* ---------- main loop ---------- */
function frame(t) {
  const y = scrollY;
  const bs = y > 20, bh = y > innerHeight * 1.2 && y > lastY + 2 && sheet.hidden;
  if (bs !== barS) { barS = bs; bar.classList.toggle('scrolled', bs); } if (bh !== barH) { barH = bh; bar.classList.toggle('hide', bh); }
  if (Math.abs(y - lastY) > 2) lastY = y;

  if (cursor) { cx = lerp(cx, mx, .2); cy = lerp(cy, my, .2); cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`; }

  if (drawBridge) drawBridge(t);
  if (drawStory && storyOn) drawStory(t);
  knFrame();
  if (pf && !reduce) { const r = pro.getBoundingClientRect(); const k = clamp(-r.top / (r.height - innerHeight) * 1.25 + .15); const e = 1 - Math.pow(1 - k, 3);
    pf.style.setProperty('--pi', `${(1 - e) * 18}%`); pf.style.setProperty('--pj', `${(1 - e) * 22}%`); pf.style.setProperty('--pr', `${(1 - e) * 28}px`); pf.style.setProperty('--ps', `${1.18 - e * .18}`); }
  if (!reduce && pics.length) for (const el of pics) { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue; const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; el.style.setProperty('--py', `${k * -5}%`); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- progressive 3D: after first paint and idle ---------- */
// a busy main thread (the hero renders every frame) can starve idle callbacks forever: cap the wait
const idle = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 1200 }) : (f) => setTimeout(f, 200);
// the hero's tag starts at once, so it is there on the very first visit; the fallback picture only shows if it cannot run
const tagFb = $('#tagFallback');
if (!slow && !reduce && window.WebGLRenderingContext) {
  document.documentElement.classList.add('tag-live');
  import('./tag.js').then((m) => m.init($('#tagGL'), tagFb, $('#hero'))).catch(() => document.documentElement.classList.remove('tag-live'));
  setTimeout(() => { if (!$('#tagGL').classList.contains('ready')) document.documentElement.classList.remove('tag-live'); }, 3000);
}
addEventListener('load', () => idle(() => {
  startGL();
  if (slow || reduce) return;
  // the three parts, live from CAD, once the visitor is near them
  const knStage = kn && kn.querySelector('.kn-stage');
  // the three parts are styled CAD stills now (Shiv, 3 Nov): one at a time, fast, no WebGL needed here (products3d.js kept for reference)
  void knStage;
}));

/* ---------- plan, people, products: stage light and motion (js/trio.js) ---------- */
import('./trio.js').then((m) => m.mount({ sim: $('#sim'), team: $('#team'), kn, reduce })).catch((e) => console.warn(e));

/* ---------- plan your first bay: the first answer opens the real planner in a glass window ---------- */
const simSec = $('#sim');
if (simSec) {
  new IntersectionObserver((es) => es.forEach((e) => { simSec.classList.toggle('live', e.isIntersecting); if (e.isIntersecting && e.intersectionRatio >= .3) simSec.classList.add('in'); }), { threshold: [0, .3] }).observe(simSec);
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
    simSec.classList.add('open'); win.hidden = false; document.documentElement.classList.add('sim-lock'); wheeling = false;
    const go = () => { try { const d = frame.contentDocument; dress(d); const pick = () => { const b = d.querySelector(`.diag-opt[data-v="${v}"]`); if (b) { if (b.getAttribute('aria-pressed') !== 'true') b.click(); } else setTimeout(pick, 120); }; pick(); } catch (e) {} };
    if (!frame.src) { frame.addEventListener('load', go, { once: true }); frame.src = './diagnostic/index.html'; } else go();
    if (!simSec.closest('.trio')) setTimeout(() => win.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 250);
  };
  simSec.querySelectorAll('.sim-opt').forEach((b) => b.addEventListener('click', () => open(b.dataset.v)));
  const shut = () => { simSec.classList.remove('open'); win.hidden = true; document.documentElement.classList.remove('sim-lock'); };
  simSec.querySelector('.sim-close').addEventListener('click', shut);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !win.hidden) shut(); });
  document.addEventListener('pointerdown', (e) => { if (!win.hidden && !win.contains(e.target) && !e.target.closest('.sim-opt')) shut(); });
}


/* ---------- floors: three film loops made in code; play only while seen ---------- */
(() => {
  const cards = $$('.ind'); if (!cards.length) return;
  const lowData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  cards.forEach((card) => {
    const v = card.querySelector('video'); if (!v) return;
    card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width - .5, my = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--mx', (mx + .5) * 100 + '%'); card.style.setProperty('--my', (my + .5) * 100 + '%');
      card.style.setProperty('--ry', (mx * 5).toFixed(2) + 'deg'); card.style.setProperty('--rx', (-my * 4).toFixed(2) + 'deg'); });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    if (lowData || reduce) return;   // the poster frame stays
    new IntersectionObserver((es) => {
      if (es[0].isIntersecting) { if (!v.src) { v.src = v.dataset.src; v.load(); } const p = v.play(); if (p) p.catch(() => {}); }
      else if (v.src) v.pause();
    }, { rootMargin: '200px' }).observe(card);
    v.addEventListener('playing', () => card.classList.add('lit'), { once: true });
  });
})();

/* ---------- guides v3: Shiv's film fills the padded screen; on the first scroll (or after a second) it rises into the spiral.
   Then one scroll = one guide: a flick, a swipe or a key glides to the next guide and the trackpad's momentum is absorbed,
   the spiral lands on a spring, the rail mark pulses and phones tick. Listeners are armed only while the guides are on screen. ---------- */
(() => {
  const sec = $('.bs'); if (!sec) return;
  const stage = $('.bs-stage', sec), intro = $('.bs-intro', sec), iv = $('video', intro), helix = $('.bs-helix', sec);
  const cards = $$('.bs-card', sec), posts = $$('.bs-post', sec), ticks = $$('.bs-rail i', sec);
  const N = cards.length, STEP = 50 * Math.PI / 180, MORPH = 1.15;
  // the opening film is held until her big smile (peak 3.4-4.0 s, the cut to her back is at 4.125 s); the rise then plays it slowed, so the smile carries into the spiral
  const SMILE = 3.7, SLOW = .3;
  const lowData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  const still = /[?&]still/.test(location.search), fm = location.search.match(/[?&]bs=([\d.]+)/), fixed = fm ? +fm[1] : null;
  const easeIO = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, easeX = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
  const hold = (t) => { const i = Math.floor(t), f = t - i, g = clamp((f - .22) / .56); return i + g * g * (3 - 2 * g); };
  let p = 0, v = 0, cur = -1, active = -1, seen = false, cw = 0, ch = 0, last = 0, gi = 0, fan = 1, rk = 0, pinnedAt = 0, doneAt = 0;
  // intro: 0 waiting, 1 showing, 2 rising, 3 done
  let phase = (reduce || lowData || still || fixed != null) ? 3 : 0, t0 = 0;
  if (phase === 3) sec.classList.add('done');
  const measure = () => { cw = cards[0].offsetWidth; ch = cards[0].offsetHeight; sec.style.setProperty('--ch', ch + 'px'); sec.style.setProperty('--cw', cw + 'px'); A = null; };
  const geom = () => { const r = pinP(sec); return { top: r.top, seg: (r.h - innerHeight) / N, h: r.h }; };
  const progress = () => { const g = geom(); return { t: clamp(-g.top / g.seg, 0, N), pinned: g.top <= 2 && g.top + g.h >= innerHeight - 2 }; };
  const posOf = (k) => { const g = geom(); return Math.round(scrollY + g.top + (1 + k) * g.seg); };   // page position where guide k rests

  /* haptics: Android vibrates; iOS 18 Safari ticks when a switch control toggles inside a touch */
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let sw = null;
  const haptic = () => {
    if (reduce) return;
    try { if (navigator.vibrate) { navigator.vibrate(9); return; } } catch (e) {}
    if (!ios) return;
    if (!sw) { sw = document.createElement('label'); sw.className = 'bs-haptic'; sw.setAttribute('aria-hidden', 'true'); sw.innerHTML = '<input type="checkbox" switch tabindex="-1">'; stage.appendChild(sw); }
    try { sw.click(); } catch (e) {}
  };
  const land = () => { const el = ticks[gi]; if (!el) return; el.classList.remove('land'); void el.offsetWidth; el.classList.add('land'); };

  /* the opening film: frame A fills the padded screen, frame B is card one; the move is a transform plus a clip */
  let A = null;
  const frames = () => {
    const s = stage.getBoundingClientRect(), h = helix.getBoundingClientRect(), pad = parseFloat(getComputedStyle(sec).getPropertyValue('--pad')) || 12;
    const a = { l: pad + 8, t: pad + 8, w: s.width - 2 * pad - 16, h: s.height - 2 * pad - 16 };
    const b = { l: h.left - s.left - cw / 2 + 7, t: h.top - s.top - ch / 2 + 7, w: cw - 14, h: ch - 14 };
    A = { a, b }; intro.style.setProperty('--iw', a.w + 'px'); intro.style.setProperty('--ih', a.h + 'px');
  };
  const setIntro = (k) => {   // k 0..1 along the rise
    if (!A) frames(); const { a, b } = A;
    const s = 1 + (b.w / a.w - 1) * k;                   // scale to the card's width
    const hv = b.h / s, cut = Math.max(0, (a.h - hv) / 2) * k; // clip the height to the card's shape, centred
    const arc = -Math.sin(Math.PI * Math.min(1, k * 1.1)) * a.h * .07;  // it rises a little before it settles: the film goes up
    const x = a.l + (b.l - a.l) * k, y = a.t + (b.t - a.t - cut * s) * k + arc;
    intro.style.setProperty('--ix', x.toFixed(1) + 'px'); intro.style.setProperty('--iy', y.toFixed(1) + 'px'); intro.style.setProperty('--is', s.toFixed(4));
    intro.style.setProperty('--ict', cut.toFixed(1) + 'px'); intro.style.setProperty('--icb', cut.toFixed(1) + 'px');
    intro.style.setProperty('--icr', (22 / s * (1 - k) + 14 / s * k).toFixed(1) + 'px');
    intro.style.setProperty('--ishade', (1 - k).toFixed(3)); intro.style.setProperty('--io', clamp((1 - k) / .12).toFixed(3));
  };

  const place = () => {
    const phone = innerWidth <= 860, R = cw * (phone ? .6 : .8), DY = ch * (phone ? .52 : .46);
    cards.forEach((c, i) => {
      const d = i - p + fan * (i ? 1.6 : 0), a = d * STEP, ad = Math.abs(d), front = (Math.cos(a) + 1) / 2;
      c.style.setProperty('--x', (R * Math.sin(a)).toFixed(1) + 'px'); c.style.setProperty('--y', (d * DY).toFixed(1) + 'px');
      c.style.setProperty('--z', (R * (Math.cos(a) - 1) - ad * 30).toFixed(1) + 'px');
      c.style.setProperty('--a', (a * .3 * 180 / Math.PI).toFixed(2) + 'deg');
      c.style.setProperty('--o', (clamp(.34 + .66 * front) * clamp(1.9 - ad * .28) * (i ? 1 - fan : (phase === 3 ? 1 : clamp((rk - .86) / .1)))).toFixed(3));
      c.style.setProperty('--d', clamp((1 - front) * .55 + Math.min(ad, 1) * .2, 0, .75).toFixed(3));
      c.style.zIndex = String(Math.round(front * 100) + (ad < .5 ? 50 : 0));
      c.style.pointerEvents = ad < .3 ? 'auto' : 'none';
    });
    const k = clamp(Math.round(p), 0, N - 1);
    if (k !== active) {
      active = k;
      posts.forEach((el, i) => el.classList.toggle('on', i === k));
      ticks.forEach((el, i) => el.classList.toggle('on', i === k));
      cards.forEach((c, i) => {
        const vid = c.querySelector('video'), img = c.querySelector('img'), near = Math.abs(i - k);
        if (img) c.style.setProperty('--kb', near === 0 ? '1.12' : '1.04');
        if (!vid || lowData || reduce) return;
        if (near <= 1 && !vid.src && seen) { vid.src = vid.dataset.src; vid.preload = near ? 'metadata' : 'auto'; }
        if (near === 0 && seen && phase === 3) { const pr = vid.play(); if (pr) pr.catch(() => {}); } else if (vid.src && !vid.paused) vid.pause();
      });
    }
  };
  const finish = () => {
    phase = 3; fan = 0; doneAt = performance.now(); sec.classList.add('done'); sec.style.setProperty('--pool', 1);
    const vid = cards[0].querySelector('video');
    if (vid) { if (!vid.src) vid.src = vid.dataset.src; try { vid.currentTime = iv.currentTime % (vid.duration || 6); } catch (e) {} const pr = vid.play(); if (pr) pr.catch(() => {}); }
    iv.pause(); try { iv.playbackRate = 1; } catch (e) {} active = -1; cur = -1;
  };
  const rise = () => { if (phase > 1) return; if (phase === 0) { if (!iv.src) iv.src = iv.dataset.src; } phase = 2; t0 = performance.now(); try { iv.playbackRate = SLOW; } catch (e) {} measure(); frames(); };
  // a scroll before the smile asks for the rise; it comes when the smile has played
  const smiled = (now) => iv.ended || iv.currentTime >= SMILE || (now - t0) / 1000 >= SMILE + 2.5;

  const tick = (now) => {
    const dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
    const { t, pinned } = progress();
    if (phase === 0 && t > 1.2) { measure(); finish(); }
    if (phase === 0 && pinned) { phase = 1; t0 = now; pinnedAt = now; if (!iv.src) iv.src = iv.dataset.src; const pr = iv.play(); if (pr) pr.catch(() => {}); }
    if (phase === 1 && smiled(now)) rise();
    if (phase === 2) {
      const m = clamp((now - t0) / 1000 / MORPH), e = easeX(m);
      rk = e; setIntro(e); fan = 1 - easeX(clamp((m - .25) / .75)); cur = -1;
      if (m >= 1) finish();
    }
    if (phase < 2) setIntro(0);
    // the spiral follows the page on a spring: it carries a touch past each guide and settles back, so the landing is felt
    if (!glide.on && phase === 3) gi = clamp(Math.round(hold(clamp(t - 1, 0, N - 1))), 0, N - 1);
    const target = fixed != null ? fixed : (phase === 3 ? hold(clamp(t - 1, 0, N - 1)) : 0);
    if (reduce || still) { p = target; v = 0; }
    else { const w = 13, z = .68; v += (w * w * (target - p) - 2 * z * w * v) * dt; p += v * dt; if (Math.abs(target - p) < .0004 && Math.abs(v) < .002) { p = target; v = 0; } }
    if (p !== cur || phase === 2) { cur = p; place(); }
    if (seen) requestAnimationFrame(tick);
  };

  /* one scroll, one guide: armed only while the guides fill the screen */
  if (!reduce && !STILL && fixed == null) {
    let lastWheel = 0, lastMag = 0, lastStep = 0;
    const inBand = () => { const g = geom(); return g.top <= 4 && g.top + g.h >= innerHeight - 4; };
    const go = (dir) => {   // true when the guides took the gesture
      if (phase < 3 || performance.now() - doneAt < 450) { if (dir < 0 && phase < 3) return false; if (phase === 1 && smiled(performance.now())) rise(); if (phase < 3 && scrollY < posOf(0) - 2) glideTo(posOf(0), 900); lastStep = performance.now(); return true; }
      const next = gi + dir; if (next < 0 || next > N - 1) return false;   // past the first or last guide the page scrolls on as usual
      gi = next; lastStep = performance.now(); glideTo(posOf(next), 720); haptic(); land(); return true;
    };
    let stream = 0, pinSeen = 0;   // the gesture under way: once it has moved a guide, the rest of it (and its momentum) is absorbed
    const onWheel = (e) => {
      const now = performance.now(), gap = now - lastWheel, mag = Math.abs(e.deltaY), prev = lastMag; lastWheel = now; lastMag = mag;
      if (gap > 450) stream = 0;
      // scroll audit: a mouse wheel spun on keeps sending even notches (no decay) — once the guide has landed, that is the next request, not momentum
      else if (stream && !glide.on && now - lastStep > 750 && gap > 30 && mag > 8 && mag >= prev) stream = 0;
      if (pinnedAt !== pinSeen) { pinSeen = pinnedAt; if (gap <= 450) { stream = 1; lastStep = pinnedAt; } }   // the flick that brought the page here is not a request
      // scroll audit: the last guide rests exactly where the band unpins, so the flick that landed it must stay absorbed there too
      if (e.ctrlKey || (!inBand() && !(stream && now - lastStep < 1500))) return;
      if (glide.on || stream) { e.preventDefault(); return; }
      if (now - lastStep < 2500 && gap < 200 && mag <= prev * 1.2 + 2) { e.preventDefault(); return; }   // (only a close stream is momentum: a separate notch after a pause is a new step)   // a slow device's momentum, still dying away
      if (mag < 3) { e.preventDefault(); return; }
      if (go(Math.sign(e.deltaY))) { stream = 1; e.preventDefault(); }
    };
    let ty = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (!inBand()) return; if (glide.on) { e.preventDefault(); return; } if (ty == null) { e.preventDefault(); return; }
      const dy = ty - e.touches[0].clientY; if (Math.abs(dy) < 14) { e.preventDefault(); return; }
      const dir = Math.sign(dy); if (go(dir)) { e.preventDefault(); ty = null; }
    };
    const onKey = (e) => {
      const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1 : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0;
      if (!dir || !inBand() || e.target.closest('input,textarea,select,button,[contenteditable]')) return;
      if (glide.on || go(dir)) e.preventDefault();
    };
    let armed = false;
    const arm = (want) => { if (want === armed) return; armed = want; const f = want ? addEventListener : removeEventListener;
      f('wheel', onWheel, { passive: false }); f('touchstart', onTouchStart, { passive: true }); f('touchmove', onTouchMove, { passive: false }); f('keydown', onKey); };
    new IntersectionObserver((es) => arm(es[0].isIntersecting), { rootMargin: '0px 0px -40% 0px' }).observe(sec);
  }

  measure(); place(); setIntro(0); if (phase === 3) sec.style.setProperty('--pool', 1);
  addEventListener('resize', () => { measure(); cur = -1; active = -1; place(); if (phase < 2) setIntro(0); });
  new IntersectionObserver((es) => {
    const was = seen; seen = es[0].isIntersecting;
    if (seen && !was) { active = -1; last = 0; if (phase === 0 && !iv.src) { iv.src = iv.dataset.src; iv.preload = 'auto'; } requestAnimationFrame(tick); }
    if (!seen) { cards.forEach((c) => { const vid = c.querySelector('video'); if (vid && vid.src && !vid.paused) vid.pause(); }); if (phase === 1) { iv.pause(); phase = 0; } }
  }, { rootMargin: '400px' }).observe(sec);
})();

/* ---------- the sections after the products arrive once, as they come into view ---------- */
(() => {
  const on = (sel, cls, ratio) => { const el = $(sel); if (!el) return; if (reduce) { el.classList.add(cls); return; }
    const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { el.classList.add(cls); o.disconnect(); } }, { threshold: ratio }); o.observe(el); };
  on('.inds', 'in-view', .22); on('.start .ctas', 'in', .35);
})();
