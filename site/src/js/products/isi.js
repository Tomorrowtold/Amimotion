// products/isi.js: the three-layer figure. Each layer button shows the plate with that many layers drawn
// (1 location, 2 + context, 3 + answers). Without JS all three layers show.
const fig = document.querySelector('[data-layers]');
if (fig) {
  const btns = [...fig.querySelectorAll('[data-l] button')];
  const set = (n) => { fig.dataset.layer = n; btns.forEach((b) => b.setAttribute('aria-pressed', String(+b.closest('[data-l]').dataset.l === n))); };
  btns.forEach((b) => b.addEventListener('click', () => { set(+b.closest('[data-l]').dataset.l); fig.dataset.auto = 'off'; }));
  // a slow walk through the layers the first time the figure is in view
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver((es, io) => {
      if (!es[0].isIntersecting) return; io.disconnect();
      let n = 1; set(1);
      const t = setInterval(() => { if (fig.dataset.auto === 'off') return clearInterval(t); n += 1; set(n); if (n >= 3) clearInterval(t); }, 2200);
    }, { threshold: .45 }).observe(fig);
  }
}
