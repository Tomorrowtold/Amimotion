// products/isi.js: the spatial intelligence page.
// 1. Hero instrument: the clock ticks, and the read-out table follows each moving tag (metres, zone).
// 2. Three layers: on wide screens the section pins and your scroll lifts the stack apart one layer at a time.
//    The step buttons jump to their layer. Phones, reduced motion and no JS: no pin, all layers, buttons switch.
// 3. The timeline: its clock runs with your scroll; the wait at inspection counts up as the playhead crosses it.
(() => {
  const d = document, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (x) => x * x * (3 - 2 * x);
  const pad = (n) => String(n).padStart(2, '0');

  // 1. hero
  const live = d.querySelector('[data-live]');
  if (live) {
    const svg = live.querySelector('svg'), clock = live.querySelector('[data-clock]');
    const t0 = Date.now(), base = 9 * 3600 + 17 * 60 + 4;
    const zones = [['Press 2', 60, 44, 150, 86], ['Inspection', 232, 44, 136, 86], ['Cell 4', 390, 44, 150, 86], ['Staging', 60, 332, 200, 86], ['Dock 2', 340, 332, 200, 86]];
    const tags = [...live.querySelectorAll('.mv[data-path]')].map((g) => {
      const p = svg.querySelector('#' + g.dataset.path);
      return { p, len: p.getTotalLength(), dur: +g.dataset.dur, row: live.querySelector(`[data-row="${g.dataset.tag}"]`) };
    });
    let last = 0;
    const frame = (now) => {
      requestAnimationFrame(frame);
      if (now - last < 250 || d.hidden) return; last = now;
      const r = live.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const s = base + Math.floor((Date.now() - t0) / 1000);
      if (clock) clock.textContent = `${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
      const st = svg.getCurrentTime ? svg.getCurrentTime() : 0;
      tags.forEach((t) => {
        if (!t.row) return;
        const q = t.p.getPointAtLength(((st % t.dur) / t.dur) * t.len);
        const z = zones.find((z) => q.x >= z[1] && q.x <= z[1] + z[3] && q.y >= z[2] && q.y <= z[2] + z[4]);
        t.row.querySelector('[data-xy]').textContent = `${((q.x - 20) / 14).toFixed(2)}, ${((q.y - 20) / 14).toFixed(2)}`;
        t.row.querySelector('[data-z]').textContent = z ? z[0] : 'Aisle';
      });
    };
    if (still) svg.pauseAnimations && svg.pauseAnimations();
    requestAnimationFrame(frame);
  }

  // 2. layers
  const sec = d.querySelector('[data-pinsec]'), fig = d.querySelector('[data-layers]');
  if (sec && fig) {
    const btns = [...sec.querySelectorAll('[data-steps] [data-l] button')];
    const cap = fig.querySelector('[data-cap]'), names = ['', '1 · Location', '2 · Context', '3 · Answer'];
    let cur = 0;
    const mark = (n) => { if (n === cur) return; cur = n; fig.dataset.layer = n; if (cap) cap.textContent = names[n];
      btns.forEach((b) => b.setAttribute('aria-pressed', String(+b.closest('[data-l]').dataset.l === n))); };
    const vars = (g, a2, a3, p) => { const st = sec.style; st.setProperty('--g', g.toFixed(3)); st.setProperty('--a2', a2.toFixed(3)); st.setProperty('--a3', a3.toFixed(3)); st.setProperty('--p', p.toFixed(3)); };
    const wide = matchMedia('(min-width: 901px) and (min-height: 620px)');
    let pinned = false;
    const read = () => {
      if (!pinned) return;
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      const g = ease(clamp((p - 0.04) / 0.22)), a2 = ease(clamp((p - 0.3) / 0.14)), a3 = ease(clamp((p - 0.62) / 0.14));
      vars(g, a2, a3, p); mark(p < 0.37 ? 1 : p < 0.69 ? 2 : 3);
    };
    const setup = () => {
      pinned = wide.matches && !still;
      sec.classList.toggle('pinned', pinned); fig.classList.toggle('js', pinned);
      if (pinned) read(); else { vars(1, 1, 1, 1); mark(3); }
    };
    // a button jumps to its layer: by scrolling when pinned, by switching when not
    btns.forEach((b) => b.addEventListener('click', () => {
      const n = +b.closest('[data-l]').dataset.l;
      if (pinned) {
        const top = sec.getBoundingClientRect().top + scrollY, span = sec.offsetHeight - innerHeight;
        scrollTo({ top: top + span * [0, 0.2, 0.52, 0.86][n], behavior: still ? 'auto' : 'smooth' });
      } else { vars(1, n >= 2 ? 1 : 0, n >= 3 ? 1 : 0, 1); mark(n); }
    }));
    addEventListener('scroll', () => requestAnimationFrame(read), { passive: true });
    wide.addEventListener ? wide.addEventListener('change', setup) : wide.addListener(setup);
    addEventListener('resize', read);
    setup();
  }

  // 3. timeline
  const chart = d.querySelector('[data-chart]');
  if (chart && !still) {
    const tl = chart.querySelector('[data-t]'), wl = chart.querySelector('[data-w]');
    const run = () => {
      const r = chart.getBoundingClientRect();
      // the clock starts as the chart rises past 85% of the screen and reaches 09:30 when it sits at 30%
      const t = clamp((innerHeight * 0.85 - r.top) / (innerHeight * 0.55));
      chart.style.setProperty('--t', t.toFixed(4));
      chart.style.setProperty('--ho', t > 0.002 && t < 0.998 ? 1 : 0);
      const m = Math.round(t * 90);
      if (tl) tl.textContent = `${pad(8 + Math.floor(m / 60))}:${pad(m % 60)}`;
      if (wl) wl.textContent = String(clamp(m - 36, 0, 41));
    };
    addEventListener('scroll', () => requestAnimationFrame(run), { passive: true });
    addEventListener('resize', run); run();
  } else if (chart) { const wl = chart.querySelector('[data-w]'); if (wl) wl.textContent = '41'; }
})();
// the record: its fields light up in order, measured first, the answer last
(() => {
  const rec = document.querySelector('.si-rec');
  if (!rec || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  rec.classList.add('arm');
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { rec.classList.add('in'); io.disconnect(); } }, { threshold: .35 }).observe(rec);
})();
