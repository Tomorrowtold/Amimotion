// km.js (round 20, Theo): the inner pages' kinetic type, and the learn guides' question swap and drawn figures.
// Native scroll only: nothing here moves the page, it only reads scrollY and IntersectionObserver. Every part checks
// for its own markup. Without JavaScript, or with reduced motion (no .motion on <html>), the page is the end state.
(() => {
  const d = document, h = d.documentElement;
  if (!h.classList.contains('motion') || !('IntersectionObserver' in window)) return;
  const once = (els, fn, opt) => {
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { io.unobserve(x.target); fn(x.target); } }), opt);
    els.forEach(el => io.observe(el));
  };

  // 1. headings rise line by line out of their own mask as they enter (the H1 does it in CSS at load)
  const lines = [];
  d.querySelectorAll('main .sec h2, main .prose h2, main .close p>span:first-child').forEach(el => {
    let sp = [...el.children].filter(c => c.tagName === 'SPAN');
    // a one-line heading gets one inner span to rise in (the observer must watch an unclipped box)
    if (!sp.length) { const s = d.createElement('span'); while (el.firstChild) s.appendChild(el.firstChild); el.appendChild(s); sp = [s]; }
    sp.forEach((s, i) => { s.classList.add('km-r'); s.style.setProperty('--i', i); });
    lines.push(el);
  });
  once(lines, el => requestAnimationFrame(() => el.querySelectorAll('.km-r').forEach(s => s.classList.add('in'))),
    { rootMargin: '0px 0px -12% 0px' });

  // 2. figures count up in tabular numerals; the final text is the page's own, character for character
  const nums = [...d.querySelectorAll('main .figures dt, main .giant-num data')].filter(el => {
    const m = el.textContent.match(/\d+(?:[.,]\d+)?/g); return m && m.length === 1 && !el.children.length;
  });
  nums.forEach(el => { el.dataset.kmText = el.textContent; el.classList.add('km-n'); });
  once(nums, el => {
    const t = el.dataset.kmText, m = t.match(/\d+(?:[.,]\d+)?/), v = parseFloat(m[0].replace(',', '.')), dp = (m[0].split(/[.,]/)[1] || '').length;
    const t0 = performance.now(), dur = 900;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = t.replace(m[0], (v * e).toFixed(dp));
      if (k < 1) requestAnimationFrame(step); else el.textContent = t;
    };
    requestAnimationFrame(step);
  }, { rootMargin: '0px 0px -10% 0px' });

  // 3. the guide's question answers itself: the question line is held where it stands while the answer line scrolls up
  //    into its place and wipes it away; the answer then locks to full ink. One line of travel, then plain scroll.
  const qa = d.querySelector('h1.qa');
  if (qa && qa.children.length === 2) {
    const [q, a] = qa.children;
    let L = 1, raf = 0;
    const measure = () => { L = Math.max(1, a.offsetTop - q.offsetTop); };
    const paint = () => {
      raf = 0;
      const s = Math.min(Math.max(scrollY, 0), L), p = s / L;
      qa.style.setProperty('--s', s.toFixed(1) + 'px');
      qa.style.setProperty('--p', p.toFixed(3));
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    measure(); paint();
    addEventListener('scroll', ask, { passive: true });
    addEventListener('resize', () => { measure(); ask(); });
    if (d.fonts) d.fonts.ready.then(() => { measure(); ask(); });
    qa.classList.add('live');
  }

  // 4. the guide's figure draws itself, one layer per section of the article. Desktop: the layer of the section being
  //    read. Phone (figure above the text): every layer in turn, once, as the figure comes into view.
  const fig = d.querySelector('[data-gfig]');
  if (fig) {
    const groups = [...fig.querySelectorAll('[data-s]')];
    // layers follow the article's order of sections, whatever their order in the drawing
    const ids = new Set(groups.map(g => g.dataset.s));
    const order = [...d.querySelectorAll('main h2[id]')].map(x => x.id).filter(id => ids.has(id));
    const heads = order.map(id => d.getElementById(id)).filter(Boolean);
    const toc = [...d.querySelectorAll('.read.has-fig .toc a')];
    let at = -1, timer = 0;
    const show = k => {
      if (k === at) return; at = k;
      groups.forEach(g => g.classList.toggle('on', order.indexOf(g.dataset.s) <= k));
      groups.forEach(g => g.classList.toggle('now', order.indexOf(g.dataset.s) === k));
      toc.forEach(a => a.classList.toggle('now', a.hash === '#' + order[k]));
      fig.querySelectorAll('[data-count]').forEach(n => {
        const g = n.closest('[data-s]');
        if (g && g.classList.contains('on') && !n.dataset.done) { n.dataset.done = 1; count(n); }
      });
    };
    const count = n => {
      const to = +n.dataset.count, fmt = n.dataset.fmt || '', suf = n.dataset.suf || '', t0 = performance.now(), dur = +(n.dataset.dur || 1400);
      const f = v => fmt === 'mmss' ? `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, '0')}` : String(Math.round(v));
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        n.textContent = f(to * e) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    fig.classList.add('live');
    const wide = matchMedia('(min-width:1024px)');
    const io = new IntersectionObserver(es => {
      if (!wide.matches) return;
      es.forEach(x => { if (x.isIntersecting) show(heads.indexOf(x.target)); });
    }, { rootMargin: '-25% 0px -60% 0px' });
    heads.forEach(el => io.observe(el));
    // the first layer draws as soon as the figure is in view; on phones all layers follow, one every 0.9 s
    once([fig], () => {
      if (at < 0) show(0);
      if (!wide.matches) { let k = 0; timer = setInterval(() => { k++; show(k); if (k >= order.length - 1) clearInterval(timer); }, 900); }
    }, { rootMargin: '0px 0px -20% 0px' });
    // reading back up on desktop: the layer follows the section above the fold
    addEventListener('scroll', () => {
      if (!wide.matches || !heads.length) return;
      const k = heads.reduce((m, el, i) => el.getBoundingClientRect().top < innerHeight * 0.4 ? i : m, 0);
      if (heads[0].getBoundingClientRect().top < innerHeight) show(k);
    }, { passive: true });
  }
})();
