// inner.js (round 13): the inner pages' three upgrades. Each finds its own markup and does nothing without it;
// with JavaScript off every part already reads as plain content (lib.py: localnav, closer, explain).
(() => {
  const d = document;
  const IO = 'IntersectionObserver' in window;

  // 1. the local bar: mark the section in view
  const bar = d.querySelector('.local');
  if (bar && IO) {
    const links = [...bar.querySelectorAll('ul a[href^="#"]')], map = new Map();
    links.forEach(a => { const t = d.getElementById(a.hash.slice(1)); if (t) map.set(t, a); });
    const seen = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target));
      const top = [...map.keys()].filter(t => seen.has(t)).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
      links.forEach(a => a.removeAttribute('aria-current'));
      if (top) { const a = map.get(top); a.setAttribute('aria-current', 'true'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }, { rootMargin: '-60px 0px -55% 0px' });
    map.forEach((_, t) => io.observe(t));
  }

  // 2. the closer look: the features become buttons, their pictures share one stage
  d.querySelectorAll('[data-closer]').forEach(root => {
    const items = [...root.querySelectorAll('li')];
    if (items.length < 2) return;
    const stage = d.createElement('div'); stage.className = 'closer-stage';
    items.forEach((li, k) => {
      const h = li.querySelector('h3'), p = li.querySelector('p'), pic = li.querySelector('.pic');
      const b = d.createElement('button'); b.type = 'button'; b.textContent = h.textContent;
      if (p) { p.id = p.id || `closer-${k}-${Math.random().toString(36).slice(2, 7)}`; b.setAttribute('aria-controls', p.id); }
      h.textContent = ''; h.appendChild(b);
      if (pic) { pic.querySelectorAll('img').forEach(i => i.loading = 'eager'); stage.appendChild(pic); }
      b.addEventListener('click', () => pick(k));
    });
    root.insertBefore(stage, root.querySelector('ol'));
    const pics = [...stage.children];
    const pick = k => items.forEach((li, j) => {
      li.classList.toggle('on', j === k); li.querySelector('button').setAttribute('aria-expanded', j === k);
      if (pics[j]) pics[j].classList.toggle('on', j === k);
    });
    root.classList.add('is-live'); pick(0);
  });

  // 3. the explainer: steps light the drawing; the tag can be dragged, bars and angles follow
  d.querySelectorAll('[data-explain]').forEach(root => {
    const svg = root.querySelector('svg'), tag = svg.querySelector('[data-tag]');
    const A = [...svg.querySelectorAll('[data-a]')].map(r => [+r.getAttribute('x') + 8, +r.getAttribute('y') + 8]);
    const rays = [...svg.querySelectorAll('[data-ray]')], bars = [...svg.querySelectorAll('.ex-bar')];
    let T = (tag.dataset.at || '230,170').split(',').map(Number);
    const draw = () => {
      tag.setAttribute('transform', `translate(${T[0]} ${T[1]})`);
      A.forEach(([x, y], k) => {
        const r = rays[k]; r.setAttribute('x1', x); r.setAttribute('y1', y); r.setAttribute('x2', T[0]); r.setAttribute('y2', T[1]);
        bars[k].setAttribute('width', Math.round(Math.hypot(T[0] - x, T[1] - y) * 0.82));
      });
    };
    const steps = [...root.querySelectorAll('.ex-steps li')];
    root.classList.add('is-live'); root.dataset.at = '0';
    if (IO) {
      const io = new IntersectionObserver(es => es.forEach(x => {
        if (!x.isIntersecting) return;
        const k = steps.indexOf(x.target); root.dataset.at = String(k + 1);
        steps.forEach((s, j) => s.classList.toggle('on', j === k));
      }), { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(s => io.observe(s));
    } else { root.dataset.at = String(steps.length); steps.forEach(s => s.classList.add('on')); }
    // drag, and arrow keys
    tag.setAttribute('tabindex', '0'); tag.setAttribute('role', 'button');
    tag.setAttribute('aria-label', svg.querySelector('title').textContent);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const set = (x, y) => { T = [clamp(x, 44, 596), clamp(y, 44, 336)]; draw(); };
    const at = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
    let drag = false;
    tag.addEventListener('pointerdown', e => { drag = true; tag.setPointerCapture(e.pointerId); e.preventDefault(); });
    tag.addEventListener('pointermove', e => { if (drag) { const p = at(e); set(p.x, p.y); } });
    tag.addEventListener('pointerup', () => { drag = false; });
    tag.addEventListener('keydown', e => {
      const k = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key];
      if (k) { e.preventDefault(); set(T[0] + k[0], T[1] + k[1]); }
    });
    draw();
  });
})();
