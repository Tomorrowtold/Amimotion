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


/* ---------- floors: three living plans drawn on black ---------- */
(() => {
  const cards = $$('.ind'); if (!cards.length) return;
  const BLUE = '31,107,255', IND = '120,110,255', AMB = '255,176,32', LINE = 'rgba(150,170,255,.24)';
  const poly = (pts) => { const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push([pts[i - 1], pts[i], L, d]); L += d; } return { seg, L }; };
  const at = (P, t) => { let d = ((t % 1) + 1) % 1 * P.L; for (const [a, b, s, l] of P.seg) if (d <= s + l) { const f = (d - s) / l; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; } return P.seg[P.seg.length - 1][1]; };
  // every scene lives in a 100 x 100 plan, drawn in a gentle isometric tilt
  const SC = {
    factory: () => {
      const cells = [[8, 10, 22, 18], [38, 10, 22, 18], [68, 10, 24, 18], [8, 62, 22, 22], [38, 62, 22, 22], [68, 62, 24, 22]];
      const paths = [poly([[19, 30], [19, 45], [49, 45], [49, 30]]), poly([[49, 30], [49, 45], [80, 45], [80, 30]]), poly([[80, 30], [80, 45], [80, 60]]), poly([[19, 60], [19, 45], [49, 45], [49, 60]])];
      const movers = paths.map((p, i) => ({ p, sp: .05 + i * .012, o: i * .27 }));
      return { boxes: cells, paths, movers, waits: [[49, 52], [80, 52]], grid: true };
    },
    warehouse: () => {
      const racks = []; for (let i = 0; i < 6; i++) racks.push([8 + i * 15, 8, 6, 58]);
      const paths = [0, 1, 2, 3, 4].map((i) => poly([[17.5 + i * 15, 70], [17.5 + i * 15, 10], [17.5 + i * 15, 70]]));
      const dock = [[10, 86, 14, 8], [30, 86, 14, 8], [50, 86, 14, 8], [70, 86, 14, 8]];
      const movers = paths.map((p, i) => ({ p, sp: .04 + (i % 3) * .015, o: i * .31, big: true }));
      return { boxes: racks.concat(dock), paths, movers, waits: [[17, 90], [57, 90]], rack: true };
    },
    robots: () => {
      const loop = poly([[14, 16], [86, 16], [86, 84], [14, 84], [14, 16]]), inner = poly([[34, 36], [66, 36], [66, 64], [34, 64], [34, 36]]);
      const cross = poly([[14, 50], [86, 50]]);
      const movers = [{ p: loop, sp: .045, o: 0, robot: true, tow: true }, { p: loop, sp: .045, o: .5, robot: true }, { p: inner, sp: .07, o: .2, robot: true, tow: true }, { p: cross, sp: .09, o: .1 }];
      return { boxes: [[44, 44, 12, 12]], paths: [loop, inner, cross], movers, waits: [[86, 50]], zone: [44, 44, 12, 12] };
    },
  };
  cards.forEach((card) => {
    const cv = card.querySelector('canvas'), ctx = cv.getContext('2d'), S = SC[card.dataset.scene]();
    let W = 0, H = 0, dpr = 1, vis = false, mx = 0, my = 0, hov = 0, hovT = 0;
    const fit = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
    new ResizeObserver(fit).observe(cv); fit();
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }).observe(cv);
    card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    card.addEventListener('pointerenter', () => (hovT = 1)); card.addEventListener('pointerleave', () => { hovT = 0; mx = my = 0; });
    const trails = S.movers.map(() => []);
    const draw = (now) => {
      requestAnimationFrame(draw); if (!vis || !W) return;
      const t = now / 1000; hov += (hovT - hov) * .06;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      // isometric plan, centred, leaning toward the pointer
      const k = Math.min(W * 1.05, H * 1.75) / 110 * (1 + hov * .07), cx = W / 2 + mx * 14, cy = H * .4 + my * 10;
      const ang = -.52 + mx * .08, sq = .56 - my * .04, c = Math.cos(ang), s = Math.sin(ang);
      const P = (x, y) => { x -= 50; y -= 50; return [cx + (x * c - y * s) * k, cy + (x * s + y * c) * k * sq]; };
      // floor dots
      { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .6); g.addColorStop(0, 'rgba(60,70,220,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      ctx.fillStyle = 'rgba(130,150,255,.18)';
      for (let x = 0; x <= 100; x += 5) for (let y = 0; y <= 100; y += 5) { const [px, py] = P(x, y); ctx.fillRect(px - .6, py - .6, 1.2, 1.2); }
      const quad = (x, y, w, h) => { ctx.beginPath(); const a = P(x, y), b = P(x + w, y), d = P(x + w, y + h), e = P(x, y + h); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...d); ctx.lineTo(...e); ctx.closePath(); };
      // structures: thin walls with a lifted top edge for depth
      S.boxes.forEach(([x, y, w, h]) => {
        quad(x, y, w, h); ctx.fillStyle = 'rgba(90,100,170,.06)'; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.stroke();
        const lift = S.rack ? 7 : 4; ctx.save(); ctx.translate(0, -lift); quad(x, y, w, h); ctx.strokeStyle = 'rgba(170,185,255,.4)'; ctx.stroke(); ctx.restore();
        [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].forEach(([u, v]) => { const [px, py] = P(u, v); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - lift); ctx.stroke(); });
      });
      if (S.zone) { const [x, y, w, h] = S.zone, f = (Math.sin(t * 2) + 1) / 2; quad(x, y, w, h); ctx.setLineDash([3, 3]); ctx.strokeStyle = `rgba(${BLUE},${.35 + f * .4})`; ctx.stroke(); ctx.setLineDash([]); }
      // the routes, faint
      ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(31,107,255,.28)';
      S.paths.forEach((p) => { ctx.beginPath(); p.seg.forEach(([a, b], i) => { const A = P(...a), B = P(...b); if (!i) ctx.moveTo(...A); ctx.lineTo(...B); }); ctx.stroke(); });
      // waits: amber pools that breathe
      S.waits.forEach(([x, y], i) => {
        const [px, py] = P(x, y), f = ((t * .5 + i * .37) % 1);
        const g = ctx.createRadialGradient(px, py, 0, px, py, 26); g.addColorStop(0, `rgba(${AMB},.45)`); g.addColorStop(1, `rgba(${AMB},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(px, py, 26, 26 * sq, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = `rgba(${AMB},${(1 - f) * .7})`; ctx.beginPath(); ctx.ellipse(px, py, 6 + f * 22, (6 + f * 22) * sq, 0, 0, 7); ctx.stroke();
        ctx.fillStyle = `rgb(${AMB})`; ctx.beginPath(); ctx.arc(px, py - 3, 3.2, 0, 7); ctx.fill();
      });
      // movers: located dots with light trails
      S.movers.forEach((m, i) => {
        const u = t * m.sp + m.o, [x, y] = at(m.p, u), [px, py] = P(x, y), tr = trails[i];
        tr.push([px, py]); if (tr.length > 46) tr.shift();
        for (let j = 1; j < tr.length; j++) { ctx.strokeStyle = `rgba(${m.robot ? IND : BLUE},${(j / tr.length) * .8})`; ctx.lineWidth = 2 * (j / tr.length); ctx.beginPath(); ctx.moveTo(...tr[j - 1]); ctx.lineTo(...tr[j]); ctx.stroke(); }
        if (m.tow) { const [bx, by] = P(...at(m.p, u - .025)); ctx.fillStyle = 'rgba(200,210,255,.55)'; ctx.fillRect(bx - 3, by - 6, 6, 5); }
        const col = m.robot ? IND : BLUE, r = m.big ? 4.2 : 3.4;
        ctx.shadowColor = `rgba(${col},1)`; ctx.shadowBlur = 14; ctx.fillStyle = `rgb(${col})`;
        ctx.beginPath(); m.robot ? ctx.ellipse(px, py - 3, r + 1, (r + 1) * .8, 0, 0, 7) : ctx.arc(px, py - 3, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py - 3, 1.2, 0, 7); ctx.fill();
      });
    };
    if (reduce) { vis = true; draw(4000); } else requestAnimationFrame(draw);
  });
})();
