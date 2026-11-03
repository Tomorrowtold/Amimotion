// locate.js (round 19): starts the "How it locates a tag" stage on the homepage. A module of a few hundred bytes:
// it waits until the section is about one screen away, checks for WebGL, then loads locate-scene.js (and three.js
// with it). With reduced motion, ?still, Save-Data or no WebGL it does nothing and the four rendered stills stay.
const sec = document.querySelector('[data-locate]');
const H = document.documentElement, conn = navigator.connection || {};
const lean = conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || '');
const webgl = () => {
  try { const c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl'); if (!g) return false; const x = g.getExtension('WEBGL_lose_context'); x && x.loseContext(); return true; } catch (e) { return false; }
};
if (sec && H.classList.contains('motion') && !lean && 'IntersectionObserver' in window && webgl()) {
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    import('./locate-scene.js').then((m) => m.start(sec, { cut: sec.dataset.locate || 'home' })).catch(() => {});
  }, { rootMargin: '120% 0px' });
  io.observe(sec);
}
