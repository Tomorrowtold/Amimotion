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

/* ---------- product stage tabs ---------- */
const tabs = $$('.tabs [role=tab]'), panels = $$('.panel'), sps = $$('.sp'), ink = $('.tab-ink');
let tabIdx = 0, touched = false;
function selectTab(i, focus) {
  tabIdx = i;
  tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
  panels.forEach((p, j) => { p.hidden = j !== i; });
  sps.forEach((p, j) => p.classList.toggle('on', j === i));
  const t = tabs[i]; ink.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth / 100})`;
  if (focus) t.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => { touched = true; selectTab(i); });
  t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { touched = true; selectTab((i + (e.key === 'ArrowRight' ? 1 : 2)) % 3, true); } });
});
addEventListener('resize', () => selectTab(tabIdx));
document.fonts.ready.then(() => selectTab(0));
let stageOn = false; new IntersectionObserver((es) => { stageOn = es[0].isIntersecting; }, { threshold: .5 }).observe($('#stage'));
if (!reduce) setInterval(() => { if (stageOn && !touched && !$('#stage details[open]')) selectTab((tabIdx + 1) % 3); }, 5200);

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
  if (wheeling) { cur = lerp(cur, target, .11); if (Math.abs(target - cur) < .5) { cur = target; wheeling = false; } scrollTo(0, cur); }
  const y = scrollY;
  bar.classList.toggle('scrolled', y > 20);
  bar.classList.toggle('hide', y > innerHeight * 1.2 && y > lastY + 2 && sheet.hidden);
  if (Math.abs(y - lastY) > 2) lastY = y;

  cx = lerp(cx, mx, .2); cy = lerp(cy, my, .2);
  cursor && (cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`);

  if (drawStory && storyOn) drawStory(t);
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
  import('./world.js').then((m) => m.world($('#worldGL'), $('#hero'))).catch(() => {});
  import('./tag.js').then((m) => m.init($('#tagGL'), $('#tagFallback'), $('#hero'))).catch(() => {});
}));
