/* Latest news pods in the hero. Four pods show four headlines; every 2 s they turn over to the next four in a wave
   (each shell resizes to its words, a sheen crosses it, its light flashes). Hover or focus holds them, the round button
   pauses, an off-screen hero or hidden tab stops the clock, reduced motion waits for nothing to move.
   Without this script the first four headlines simply show. */
(() => {
  const w = document.querySelector('.hx-pods'); if (!w) return;
  const src = [...w.querySelectorAll('.hx-pods-src li')].map((l) => ({ id: l.dataset.id, k: l.dataset.k, h: l.textContent.trim() }));
  const pods = [...w.querySelectorAll('.hx-pods-l .pod')], btn = w.querySelector('.hx-pods-p');
  if (src.length <= pods.length) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DWELL = 2000, STAGGER = 110, OUT = 220, EASE = 'cubic-bezier(.2,.8,.2,1)';
  let at = 0, timer = 0, busy = false, paused = false, held = false, seen = true;
  const fill = (pod, n) => {
    const d = src[n % src.length], a = pod.querySelector('a');
    a.href = '/company/news/#' + d.id; pod.querySelector('.pod-h').textContent = d.h;
  };
  const turn = (pod, n, delay) => new Promise((done) => setTimeout(() => {
    const a = pod.querySelector('a'), t = pod.querySelector('.pod-t');
    t.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-9px)', filter: 'blur(3px)' }], { duration: OUT, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished.then(() => {
      const w0 = a.getBoundingClientRect().width;
      fill(pod, n); pod.classList.remove('pod-flash'); void pod.offsetWidth; pod.classList.add('pod-flash');
      const w1 = a.getBoundingClientRect().width;
      if (Math.abs(w1 - w0) > 1) a.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: 520, easing: EASE });
      t.getAnimations().forEach((x) => x.cancel());
      t.animate([{ opacity: 0, transform: 'translateY(10px)', filter: 'blur(3px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 460, easing: EASE }).finished.then(done, done);
    });
  }, delay));
  const step = async () => {
    if (busy) return; busy = true;
    at = (at + pods.length) % src.length;
    await Promise.all(pods.map((p, k) => turn(p, at + k, k * STAGGER)));
    busy = false; arm();
  };
  const arm = () => { clearTimeout(timer); if (!still && !paused && !held && seen && !document.hidden) timer = setTimeout(step, DWELL); };
  w.addEventListener('pointerenter', () => { held = true; arm(); });
  w.addEventListener('pointerleave', () => { held = false; arm(); });
  w.addEventListener('focusin', () => { held = true; arm(); });
  w.addEventListener('focusout', (e) => { if (!w.contains(e.relatedTarget)) { held = false; arm(); } });
  document.addEventListener('visibilitychange', arm);
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { seen = e[0].isIntersecting; arm(); }).observe(w);
  if (btn && !still) {
    w.classList.add('live');
    btn.addEventListener('click', () => {
      paused = !paused; btn.setAttribute('aria-pressed', String(paused)); arm();
    });
  }
  arm();
})();
