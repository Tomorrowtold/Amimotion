(() => {
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
