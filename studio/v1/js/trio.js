// Plan, people, products: the light and motion that sit on top of the three sections.
// Team: portraits come up out of the dark one after another, then a key light follows the pointer.
// Products: each part has its own stage light; the scroll fills a quiet progress line; AmIHub's map is read in.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function mount({ sim, team, kn, reduce }) {
  // the bay plan on the planner card
  if (sim) import('./bay.js').then((m) => m.mount(sim)).catch((e) => console.warn(e));

  if (team) {
    if (!reduce) {
      team.classList.add('team-ready');
      const io = new IntersectionObserver((es) => { if (es[0].intersectionRatio > .22) { team.classList.add('team-lit'); io.disconnect(); setTimeout(() => team.classList.add('team-done'), 1700); } }, { threshold: [0, .22, .5] });
      io.observe(team);
    }
    team.querySelectorAll('.tm-pic').forEach((f) => {
      f.addEventListener('pointermove', (e) => { const r = f.getBoundingClientRect(); const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
        f.style.setProperty('--lx', (u * 100).toFixed(1) + '%'); f.style.setProperty('--ly', (v * 100).toFixed(1) + '%');
        if (!reduce) { f.style.setProperty('--rx', ((.5 - v) * 5).toFixed(2) + 'deg'); f.style.setProperty('--ry', ((u - .5) * 6).toFixed(2) + 'deg'); } }, { passive: true });
      f.addEventListener('pointerleave', () => { f.style.removeProperty('--rx'); f.style.removeProperty('--ry'); });
    });
  }

  if (kn) {
    const stage = kn.querySelector('.kn-stage'), items = [...kn.querySelectorAll('.kn-item')];
    let cur = -9;
    const tick = () => {
      const r = kn.getBoundingClientRect();
      if (r.bottom > -200 && r.top < innerHeight + 200) {
        const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
        stage.style.setProperty('--kp', p.toFixed(4));
        let st = -1; items.forEach((el, i) => { if (el.classList.contains('on')) st = i; });
        if (st !== cur) {
          cur = st; stage.dataset.on = String(st);
          if (st === 2) { const s = stage.querySelector('.kn-screen'); if (s) { s.classList.remove('read'); void s.offsetWidth; s.classList.add('read'); } }
        }
      }
      if (performance.now() < until) requestAnimationFrame(tick); else looping = false;
    };
    // it follows the scroll: frames only while the page moves (and 600 ms after), so the main thread rests otherwise
    let looping = false, until = 0;
    const kick = () => { until = performance.now() + 600; if (!looping) { looping = true; requestAnimationFrame(tick); } };
    if (stage) { addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick); kick(); }
  }
}
