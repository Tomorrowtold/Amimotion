// products/site.js: the quiet side rail and the films of the product sites.
// The rail is not a nav: no links, no focus, hidden from screen readers (the headings already carry the outline).
// It lists each section by its heading's first line, marks the one you are reading and draws how far you are.
(() => {
  const d = document, main = d.querySelector('main');
  if (!main) return;
  const name = d.body.dataset.rail;
  const hs = [...main.querySelectorAll('section h2')].filter((h) => !h.closest('.close,details,.no-rail'));
  if (name && hs.length > 2) {
    const rail = d.createElement('aside'); rail.className = 'p-rail'; rail.setAttribute('aria-hidden', 'true');
    const b = d.createElement('b'); b.textContent = name; rail.append(b);
    const ol = d.createElement('ol');
    const items = hs.map((h) => {
      const li = d.createElement('li');
      const first = h.querySelector('span') || h;
      li.dataset.n = first.textContent.trim().replace(/[.:]$/, '');
      ol.append(li); return li;
    });
    rail.append(ol); d.body.append(rail);
    const hero = main.querySelector('.p-hero');
    let ticking = false;
    const tick = () => {
      ticking = false;
      const y = innerHeight * 0.42;
      let k = -1;
      hs.forEach((h, i) => { if (h.closest('section').getBoundingClientRect().top < y) k = i; });
      items.forEach((li, i) => { li.classList.toggle('here', i === k); li.classList.toggle('past', i < k); });
      const heroEnd = hero ? hero.getBoundingClientRect().bottom : 0;
      const end = main.getBoundingClientRect().bottom - innerHeight;
      rail.classList.toggle('on', heroEnd < innerHeight * 0.5 && end > -innerHeight * 0.2);
      const first = hs[0].closest('section').getBoundingClientRect().top, last = main.getBoundingClientRect().bottom - innerHeight;
      const p = Math.min(1, Math.max(0, -first / Math.max(1, last - first)));
      rail.style.setProperty('--rp', p.toFixed(3));
      // the rail takes the tone of the band it sits over (dark or light), read from data-tone on sections
      const at = d.elementFromPoint(Math.max(4, rail.getBoundingClientRect().left + 4), innerHeight / 2);
      const band = at && at.closest('[data-tone]');
      rail.dataset.tone = band ? band.dataset.tone : '';
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
    addEventListener('resize', tick); tick();
  }
  // films: muted loops play only while on screen, never with reduced motion
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vids = [...d.querySelectorAll('video[data-loop]')];
  if (!still && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '120px' });
    vids.forEach((v) => io.observe(v));
  }
  // the question types itself in once, when the console comes into view
  d.querySelectorAll('[data-askdemo] .hb-type').forEach((t) => {
    if (still || !('IntersectionObserver' in window)) return;
    t.style.setProperty('--tp', '0%');
    const box = t.closest('[data-askdemo]'); box.classList.add('hb-arm');
    new IntersectionObserver((es, io) => { if (!es[0].isIntersecting) return; io.disconnect(); const t0 = performance.now();
      const step = (n) => { const k = Math.min(1, (n - t0) / 2200); t.style.setProperty('--tp', (k * 100).toFixed(1) + '%'); if (k < 1) requestAnimationFrame(step); else box.classList.add('played'); };
      requestAnimationFrame(step); }, { threshold: .6 }).observe(t);
  });
  // live example feeds: a new line slides in every few seconds from the page's own <template>
  d.querySelectorAll('[data-feed]').forEach((box) => {
    const ol = box.querySelector('ol'), tpl = box.querySelector('template');
    if (!ol || !tpl || still) return;
    const pool = [...tpl.content.children]; let i = 0;
    setInterval(() => {
      if (d.hidden || ol.getBoundingClientRect().bottom < 0 || ol.getBoundingClientRect().top > innerHeight) return;
      const li = pool[i++ % pool.length].cloneNode(true); li.classList.add('in');
      ol.prepend(li); while (ol.children.length > 5) ol.lastElementChild.remove();
    }, 3200);
  });
})();
