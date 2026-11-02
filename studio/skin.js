/* nav: the three parts of AmIMotion shown as one system inside "How it works" */
(() => {
  const src = (document.currentScript && document.currentScript.src) || '';
  const root = src.replace(/assets\/studio\/skin\.js.*$/, '');
  const drop = document.querySelector('.top .links > li:nth-child(1) .drop');
  if (!drop || !root) return;
  const pick = (k) => drop.querySelector(`.drop-groups a[data-k="${k}"]`);
  const parts = [['amigo', 'assets/studio/assets/hw/amigo-dark-600.webp'], ['amimo', 'assets/studio/assets/hw/amimo-dark-600.webp'], ['hub', 'assets/studio/assets/scene/hall-after-800.webp']];
  const els = parts.map(([k]) => pick(k)); if (els.some((e) => !e)) return;
  const sys = document.createElement('div'); sys.className = 'sk-sys';
  sys.innerHTML = parts.map(([k, img], i) => { const a = els[i]; const b = a.querySelector('b').textContent, sp = a.querySelector('span') ? a.querySelector('span').textContent : '';
    return `<a class="sk-sys-c sk-${k}" href="${a.getAttribute('href')}"><span class="sk-sys-pic"><img src="${root}${img}" alt="" loading="lazy" decoding="async"></span><b>${b}</b><span>${sp}</span></a>${i < 2 ? '<i class="sk-sys-link" aria-hidden="true"><em></em></i>' : ''}`; }).join('');
  const g1 = els[0].closest('.grp'), g2 = g1 && g1.nextElementSibling, name = g1 && g1.querySelector('.grp-name');
  if (name) { const lab = name.cloneNode(true); lab.classList.add('sk-sys-name'); sys.prepend(lab); }
  if (g1 && g2) { const ul2 = g2.querySelector('ul'); [...g1.querySelectorAll('li')].filter((li) => !els.some((e) => li.contains(e))).reverse().forEach((li) => ul2.prepend(li)); g1.remove(); }
  else els.forEach((a) => a.closest('li').classList.add('sk-moved'));
  drop.appendChild(sys); drop.classList.add('sk-has-sys');
})();
(() => {
  const top = document.querySelector('header.top');
  if (top) { const on = () => top.classList.toggle('sk-scrolled', scrollY > 8); addEventListener('scroll', on, { passive: true }); on(); }
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c = document.getElementById('cursor');
  if (c && fine && !document.querySelector('main.studio')) {
    let mx = 0, my = 0, x = 0, y = 0;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; if (e.pointerType === 'mouse') c.classList.add('on'); c.classList.toggle('link', !!e.target.closest('a,button,summary,[role=tab],input,select,label')); }, { passive: true });
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
    const loop = () => { x += (mx - x) * .2; y += (my - y) * .2; c.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(loop); }; loop();
  }
  if (reduce || document.querySelector('main.studio')) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('main h2, main figure, main picture').forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('sk-rise'); io.observe(el); } });
})();
