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
    if (document.documentElement.classList.contains('sim-lock')) return; // the planner is open: the page stays put
    if (!wheeling) { target = cur = scrollY; }
    wheeling = true;
    target = clamp(target + e.deltaY * (e.deltaMode === 1 ? 32 : 1), 0, document.documentElement.scrollHeight - innerHeight);
  }, { passive: false });
  addEventListener('keydown', () => { wheeling = false; });
  addEventListener('pointerdown', () => { wheeling = false; });
}

/* ---------- the film settles on a chapter when the visitor stops scrolling ---------- */
let lastDir = 1, prevY = scrollY; const FINE = matchMedia('(pointer:fine)').matches;
let settleT = 0; const STILL = /[?&]still\b/.test(location.search); // screenshots: no settling
const settle = () => {
  if (reduce || !storySec || wheeling || STILL) return;
  const top = storySec.getBoundingClientRect().top + scrollY, len = storySec.offsetHeight - innerHeight, y = scrollY, p = (y - top) / len;
  if (drawBridge && y < top - 2) return; // the landing is driven by the hand alone: no auto-scroll
  if (p < -.12 || p > .985) return;
  const nb = +storySec.dataset.beats || 7; const rests = [0, ...Array.from({ length: nb }, (_, i) => (i + .78) / nb)];
  // settle only forward in the direction the visitor was going, and only when the next rest is close: never pull back
  if (!FINE) return;
  const ahead = rests.filter((r) => lastDir > 0 ? r >= p - .002 : r <= p + .002); if (!ahead.length) return;
  const best = lastDir > 0 ? Math.min(...ahead) : Math.max(...ahead);
  if (Math.abs(best - p) * nb > .55) return;
  const to = top + best * len; if (Math.abs(to - y) < 6) return;
  target = to; cur = y; wheeling = true;
};
addEventListener('touchstart', () => { wheeling = false; clearTimeout(settleT); }, { passive: true });
addEventListener('scroll', () => { const dy = scrollY - prevY; if (dy && !wheeling) lastDir = Math.sign(dy); prevY = scrollY; clearTimeout(settleT); if (!wheeling) settleT = setTimeout(settle, 240); }, { passive: true });

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

  if (drawBridge) drawBridge(t);
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

/* ---------- guides: Shiv's film plays 6 s full frame, settles into the first card, then scroll turns the spiral one guide at a time ---------- */
(() => {
  const sec = $('.bs'); if (!sec) return;
  const stage = $('.bs-stage', sec), intro = $('.bs-intro', sec), iv = $('video', intro), helix = $('.bs-helix', sec);
  const cards = $$('.bs-card', sec), posts = $$('.bs-post', sec), ticks = $$('.bs-rail i', sec);
  const N = cards.length, STEP = 50 * Math.PI / 180, HOLD = 6, MORPH = 1.25;
  const lowData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  const still = /[?&]still/.test(location.search), fm = location.search.match(/[?&]bs=([\d.]+)/), fixed = fm ? +fm[1] : null;
  const ease = (x) => 1 - Math.pow(1 - x, 4);
  const hold = (t) => { const i = Math.floor(t), f = t - i, g = clamp((f - .22) / .56); return i + g * g * (3 - 2 * g); };
  let p = 0, cur = -1, active = -1, seen = false, cw = 0, ch = 0, last = 0;
  // intro: 0 waiting, 1 playing, 2 morphing, 3 done
  let phase = (reduce || lowData || still || fixed != null) ? 3 : 0, t0 = 0, m = 0;
  if (phase === 3) sec.classList.add('done');
  const measure = () => { cw = cards[0].offsetWidth; ch = cards[0].offsetHeight; sec.style.setProperty('--ch', ch + 'px'); };
  const progress = () => { const r = sec.getBoundingClientRect(), seg = (sec.offsetHeight - innerHeight) / N;
    return { t: clamp(-r.top / seg, 0, N), pinned: r.top <= 2 && r.bottom >= innerHeight - 2 }; };
  const setIntro = (k) => {   // k: 0 = fills the padded screen, 1 = sits exactly on card 1
    const s = stage.getBoundingClientRect(), h = helix.getBoundingClientRect(), pad = parseFloat(getComputedStyle(sec).getPropertyValue('--pad')) || 16;
    const a = { l: pad + 10, t: pad + 10, w: s.width - 2 * pad - 20, h: s.height - 2 * pad - 20, r: 26 };
    const b = { l: h.left - s.left - cw / 2 + 8, t: h.top - s.top - ch / 2 + 8, w: cw - 16, h: ch - 16, r: 15 };
    const L = (x, y) => x + (y - x) * k;
    intro.style.setProperty('--il', L(a.l, b.l) + 'px'); intro.style.setProperty('--it', L(a.t, b.t) + 'px');
    intro.style.setProperty('--iw', L(a.w, b.w) + 'px'); intro.style.setProperty('--ih', L(a.h, b.h) + 'px'); intro.style.setProperty('--ir', L(a.r, b.r) + 'px');
  };
  const place = () => {
    const phone = innerWidth <= 860, R = cw * (phone ? .62 : .82), DY = ch * (phone ? .5 : .46);
    cards.forEach((c, i) => {
      const d = i - p, a = d * STEP, ad = Math.abs(d), front = (Math.cos(a) + 1) / 2;
      c.style.setProperty('--x', (R * Math.sin(a)).toFixed(1) + 'px'); c.style.setProperty('--y', (d * DY).toFixed(1) + 'px');
      c.style.setProperty('--z', (R * (Math.cos(a) - 1) - ad * 30).toFixed(1) + 'px');
      c.style.setProperty('--a', (a * .3 * 180 / Math.PI).toFixed(2) + 'deg');
      c.style.setProperty('--o', (clamp(.34 + .66 * front) * clamp(1.9 - ad * .28)).toFixed(3));
      c.style.setProperty('--d', clamp((1 - front) * .55 + Math.min(ad, 1) * .2, 0, .75).toFixed(3));
      c.style.zIndex = String(Math.round(front * 100) + (ad < .5 ? 50 : 0));
      c.style.pointerEvents = ad < .3 ? 'auto' : 'none';
    });
    const k = Math.round(p);
    if (k !== active) {
      active = k;
      posts.forEach((el, i) => el.classList.toggle('on', i === k));
      ticks.forEach((el, i) => el.classList.toggle('on', i === k));
      cards.forEach((c, i) => {
        const v = c.querySelector('video'), img = c.querySelector('img'), near = Math.abs(i - k);
        if (img) c.style.setProperty('--kb', near === 0 ? '1.12' : '1.04');
        if (!v || lowData || reduce) return;
        if (near <= 1 && !v.src) { v.src = v.dataset.src; v.load(); }
        if (near === 0 && seen && phase === 3) { const pr = v.play(); if (pr) pr.catch(() => {}); } else if (v.src) v.pause();
      });
    }
  };
  const finish = () => {
    phase = 3; sec.classList.add('done'); sec.style.setProperty('--pool', 1);
    const v = cards[0].querySelector('video');
    if (v) { if (!v.src) { v.src = v.dataset.src; } try { v.currentTime = iv.currentTime % (v.duration || 6); } catch (e) {} const pr = v.play(); if (pr) pr.catch(() => {}); }
    iv.pause(); active = -1; cur = -1;
  };
  const tick = (now) => {
    const dt = Math.min(.1, last ? (now - last) / 1000 : .016); last = now;
    const { t, pinned } = progress();
    if (phase === 0 && t > 1.05) { measure(); finish(); }
    if (phase === 0 && pinned) { phase = 1; t0 = now; if (!iv.src) iv.src = iv.dataset.src; iv.currentTime = 0; const pr = iv.play(); if (pr) pr.catch(() => {}); }
    if (phase === 1 && (now - t0) / 1000 >= HOLD) { phase = 2; t0 = now; measure(); }
    if (phase === 2) { m = clamp((now - t0) / 1000 / MORPH); setIntro(ease(m)); if (m >= 1) finish(); }
    if (phase < 2) setIntro(0);
    const target = fixed != null ? fixed : (phase === 3 ? hold(clamp(t - 1, 0, N - 1)) : 0);
    p = (reduce || still) ? target : lerp(p, target, 1 - Math.exp(-dt * 7.5));
    if (Math.abs(p - target) < .0005) p = target;
    if (p !== cur) { cur = p; place(); }
    if (seen) requestAnimationFrame(tick);
  };
  iv.addEventListener('playing', () => { if (phase === 1) t0 = performance.now(); }, { once: true });   // the 6 s count from the first frame actually shown
  measure(); place(); setIntro(0); if (phase === 3) sec.style.setProperty('--pool', 1);
  addEventListener('resize', () => { measure(); cur = -1; active = -1; place(); if (phase < 2) setIntro(0); });
  new IntersectionObserver((es) => {
    const was = seen; seen = es[0].isIntersecting;
    if (seen && !was) { active = -1; last = 0; if (phase === 0 && !iv.src) { iv.src = iv.dataset.src; iv.load(); } requestAnimationFrame(tick); }
    if (!seen) { cards.forEach((c) => { const v = c.querySelector('video'); if (v && v.src) v.pause(); }); if (phase === 1) { iv.pause(); phase = 0; } }
  }, { rootMargin: '300px' }).observe(sec);
})();
