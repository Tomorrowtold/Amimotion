// AmIMotion homepage: the hero's first scroll, the book-a-call dialog, quiet reveals, the floor films. No libraries.
// Nothing here runs on a timer or a frame loop: the page is idle whenever the visitor is not scrolling or pointing.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const conn = navigator.connection || {};
const slow = conn.saveData || /(^|-)2g/.test(conn.effectiveType || '');

/* ---------- reveal on view ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
$$('.k-lines,.k-fade').forEach((el) => { if (!el.closest('.hero')) io.observe(el); });
// the hero's words are the first thing painted: they never wait for the 3D tag, which arrives under them
requestAnimationFrame(() => { $('#h1').classList.add('in'); $$('.hero .k-fade').forEach((e) => e.classList.add('in')); });

/* ---------- scroll: the browser's own, everywhere. One exception: the first scroll in the hero glides straight into the film ----------
   The glide needs non-passive wheel/touch listeners, and a non-passive listener on the window makes every scroll on the page wait for
   JavaScript (the compositor cannot scroll on its own). So they are attached only while the page is in the hero, and taken off after. */
const STILL = /[?&]still\b/.test(location.search); // screenshots: no glide
const glide = { on: false, to: 0, end: 0, hero: false };   // hero: the glide is the hero's own (other sections reuse glideTo)
const filmStart = () => { const s = storySec; if (!s) return 0; const top = s.getBoundingClientRect().top + scrollY, len = s.offsetHeight - innerHeight; return Math.round(top + len * (s.hasAttribute('data-pull') ? .2 : 0)); };   // one gesture: the camera backs away from the tag and the floor turns real
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
    e.preventDefault(); e.stopImmediatePropagation(); glideTo(dir > 0 ? (fsCache = filmStart()) : 0, dir > 0 ? 2100 : 900, true);
  };
  let ty0 = null;
  const onTouchStart = (e) => { ty0 = e.touches[0].clientY; };
  const onTouchMove = (e) => { if (glide.on && glide.hero) { e.preventDefault(); e.stopImmediatePropagation(); return; } if (ty0 == null) return; const dy = ty0 - e.touches[0].clientY; if (Math.abs(dy) < 12) return; const dir = Math.sign(dy); if (inHero(dir)) { e.preventDefault(); e.stopImmediatePropagation(); ty0 = null; glideTo(dir > 0 ? (fsCache = filmStart()) : 0, dir > 0 ? 1900 : 900, true); } };
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
    if (inHero(dir)) { e.preventDefault(); e.stopImmediatePropagation(); glideTo(dir > 0 ? (fsCache = filmStart()) : 0, dir > 0 ? 2100 : 900, true); }
  }, true);
}


/* ---------- while the page is moving, nothing under a still cursor reacts (cards would grow and relayout mid-scroll) ---------- */
{
  const html = document.documentElement; let st = 0;
  addEventListener('scroll', () => { if (!st) html.classList.add('is-scrolling'); clearTimeout(st); st = setTimeout(() => { st = 0; html.classList.remove('is-scrolling'); }, 180); }, { passive: true });
}

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


/* ---------- the section after the hero runs itself (see.js); the hero's first scroll glides into it ---------- */
const storySec = $('#see');

/* ---------- the hero's 3D tag: starts at once on a computer; the still picture shows if it cannot run ----------
   Phones and tablets keep the still: it is the 3D tag's own resting frame, so the look is the same, and the phone's first
   screen is ready in a second instead of waiting on a WebGL scene. */
const tagFb = $('#tagFallback');
if (!slow && !reduce && window.WebGLRenderingContext && matchMedia('(pointer: fine)').matches) {
  document.documentElement.classList.add('tag-live');
  import('./tag.js').then((m) => m.init($('#tagGL'), tagFb, $('#hero'))).catch(() => document.documentElement.classList.remove('tag-live'));
  setTimeout(() => { if (!$('#tagGL').classList.contains('ready')) document.documentElement.classList.remove('tag-live'); }, 3000);
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


/* ---------- the floors arrive once, as they come into view ---------- */
(() => {
  const el = $('.inds'); if (!el) return;
  if (reduce) { el.classList.add('in-view'); return; }
  const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { el.classList.add('in-view'); o.disconnect(); } }, { threshold: .22 }); o.observe(el);
})();
