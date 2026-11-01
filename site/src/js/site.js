// Site behaviour: nav tone, menus, scroll reveals, the Know more panel, and the scroll-linked chapters.
// Every word on the page is in the HTML; this file only adds motion and the panel.
(() => {
  const d = document, root = d.documentElement;
  root.classList.remove('no-js'); root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // every page opens at its top, unless the link points to a section
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) {
    let moved = false;
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, () => { moved = true; }, { once: true, passive: true }));
    const toTop = () => { if (moved) return; scrollTo(0, 0); try { d.body && d.body.scrollIntoView({ block: 'start' }); } catch (_) {} };
    toTop(); d.addEventListener('DOMContentLoaded', toTop); addEventListener('load', toTop);
    addEventListener('pageshow', (e) => { if (e.persisted) toTop(); });
  }

  // nav: dark glass over dark sections, white glass over light ones
  const nav = d.querySelector('[data-nav]'), sub = d.querySelector('[data-subnav]');
  const darkZones = () => [...d.querySelectorAll('main .dark, main [data-tone="dark"], .hero-runway, .footer')];
  let ticking = false;
  const tone = () => {
    ticking = false;
    if (!nav) return;
    const y = nav.getBoundingClientRect().top + nav.offsetHeight / 2;
    const dark = darkZones().some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
    nav.dataset.tone = dark ? 'dark' : 'light';
    if (sub) { const sy = sub.getBoundingClientRect().top + sub.offsetHeight / 2; sub.dataset.tone = darkZones().some((el) => { const r = el.getBoundingClientRect(); return r.top <= sy && r.bottom >= sy; }) ? 'dark' : 'light'; }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tone); } }, { passive: true });
  addEventListener('resize', tone); tone();

  // phone menu
  const sheet = d.querySelector('[data-sheet]');
  d.querySelector('[data-sheet-open]')?.addEventListener('click', () => { sheet.classList.add('is-open'); sheet.setAttribute('aria-hidden', 'false'); });
  d.querySelector('[data-sheet-close]')?.addEventListener('click', () => { sheet.classList.remove('is-open'); sheet.setAttribute('aria-hidden', 'true'); });

  // reveals
  const rv = d.querySelectorAll('[data-reveal], [data-reveal-scale]');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach((el) => io.observe(el));
  }

  // Know more: a compact glass panel from the left; springs open, swaps topics, drags shut
  const km = d.getElementById('km');
  if (km) {
    const topics = [...d.querySelectorAll('.km-src')].map((el) => el.id.slice(3));
    const q = (sel) => km.querySelector(sel);
    const buzz = (ms) => { try { if (!reduce && navigator.vibrate) navigator.vibrate(ms); } catch (_) {} };
    const isOpen = () => root.classList.contains('km-open');
    let cur = -1, opener = null;
    const fill = (i) => {
      const src = d.getElementById('km-' + topics[i]); if (!src) return;
      cur = i;
      km.style.setProperty('--h1', src.dataset.h1 || '#66a5fa');
      km.style.setProperty('--h2', src.dataset.h2 || '#8f7cf6');
      q('[data-km-dots]').innerHTML = topics.map((_, j) => '<i' + (j === i ? ' class="on"' : '') + '></i>').join('');
      q('[data-km-kicker]').textContent = src.dataset.kicker || '';
      q('[data-km-title]').textContent = src.dataset.title || '';
      q('[data-km-list]').innerHTML = [...src.querySelectorAll('li')].map((li) => '<li data-stagger>' + li.innerHTML + '</li>').join('');
      q('[data-km-note]').textContent = src.dataset.note || '';
      const link = q('[data-km-link]');
      if (src.dataset.link) { link.href = src.dataset.link; link.hidden = false; } else link.hidden = true;
      const pv = (i - 1 + topics.length) % topics.length, nx = (i + 1) % topics.length;
      q('[data-km-prev-label]').textContent = d.getElementById('km-' + topics[pv]).dataset.kicker || '';
      q('[data-km-next-label]').textContent = d.getElementById('km-' + topics[nx]).dataset.kicker || '';
      [...km.querySelectorAll('[data-stagger]')].forEach((el, k) => el.style.setProperty('--i', k));
      d.querySelectorAll('button[data-km]').forEach((b) => b.setAttribute('aria-expanded', String(isOpen() && b.dataset.km === topics[i])));
    };
    const go = (step) => {
      if (cur < 0) return;
      const next = (cur + step + topics.length) % topics.length;
      buzz(6);
      if (reduce) { fill(next); return; }
      km.style.setProperty('--dir', step);
      km.classList.add('is-swapping');
      setTimeout(() => { fill(next); km.style.setProperty('--dir', -step); requestAnimationFrame(() => km.classList.remove('is-swapping')); }, 190);
    };
    const open = (id, btn) => {
      const i = topics.indexOf(id); if (i < 0) return;
      opener = btn;
      if (btn) { const r = btn.getBoundingClientRect(); km.style.setProperty('--oy', Math.round(Math.min(Math.max(r.top + r.height / 2, 0), innerHeight)) + 'px'); }
      if (isOpen()) { if (i !== cur) go(i - cur); return; }
      root.classList.add('km-open'); km.setAttribute('aria-hidden', 'false');
      fill(i); buzz(10);
      setTimeout(() => q('.km-close').focus({ preventScroll: true }), 80);
    };
    const close = () => {
      if (!isOpen()) return;
      root.classList.remove('km-open'); km.setAttribute('aria-hidden', 'true'); km.style.transform = '';
      d.querySelectorAll('button[data-km][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      buzz(4); opener?.focus({ preventScroll: true });
    };
    d.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-km]'); if (b) { open(b.dataset.km, b); return; }
      if (e.target.closest('[data-km-close]')) { close(); return; }
      if (e.target.closest('[data-km-prev]')) go(-1);
      else if (e.target.closest('[data-km-next]')) go(1);
    });
    d.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(); return; }
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest('input,textarea')) { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); return; }
      if (e.key === 'Tab') {
        const f = [...km.querySelectorAll('a[href]:not([hidden]),button:not([hidden])')].filter((x) => x.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    // drag left to dismiss, with a rubber band to the right
    let x0 = null, xl = 0, t0 = 0, passed = false;
    km.addEventListener('pointerdown', (e) => {
      if (e.button || e.target.closest('a,button')) return;
      x0 = xl = e.clientX; t0 = performance.now(); passed = false;
      km.setPointerCapture(e.pointerId); km.classList.add('is-dragging');
    });
    km.addEventListener('pointermove', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; xl = e.clientX;
      const off = dx < 0 ? dx : dx * 0.18;
      km.style.transform = 'translateX(' + off + 'px)';
      if (!passed && dx < -90) { passed = true; buzz(8); } else if (passed && dx > -90) passed = false;
    });
    const end = () => {
      if (x0 === null) return;
      const dx = xl - x0, v = dx / Math.max(performance.now() - t0, 1);
      x0 = null; km.classList.remove('is-dragging'); km.style.transform = '';
      if (dx < -90 || v < -0.6) close();
    };
    km.addEventListener('pointerup', end); km.addEventListener('pointercancel', end);
  }

  // ---------- scroll-linked chapters: one rAF pass per scroll frame, values mapped straight from the scroll position ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const tick = (ms) => { try { if (!reduce && navigator.vibrate) navigator.vibrate(ms); } catch (_) {} };
  const jobs = [];
  let queued = false;
  const frame = () => { queued = false; jobs.forEach((j) => j()); };
  const kick = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { jobs.forEach((j) => j.measure && j.measure()); kick(); });
  addEventListener('load', () => { jobs.forEach((j) => j.measure && j.measure()); kick(); });

  // applications: a pinned stage; the scroll position sets the reel's offset exactly, with a soft detent on each card
  const run = d.querySelector('[data-apps]');
  if (run) {
    const reel = run.querySelector('[data-reel]'), track = run.querySelector('[data-track]');
    const cards = [...track.children], tabs = [...run.querySelectorAll('[data-tab]')];
    const tabBar = run.querySelector('[data-tabs]'), ink = run.querySelector('[data-tab-ink]'), bar = run.querySelector('[data-apps-bar]');
    const n = cards.length, HOLD = 0.1, IN = 0.03;
    const select = (i) => tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    if (reduce || n < 2) {
      // native swipe reel; tabs scroll it
      tabs.forEach((t, i) => t.addEventListener('click', () => { const c = cards[i]; reel.scrollTo({ left: c.offsetLeft - (reel.clientWidth - c.clientWidth) / 2 }); select(i); }));
      reel.addEventListener('scroll', () => { const mid = reel.scrollLeft + reel.clientWidth / 2; let b = 0, bd = Infinity; cards.forEach((c, k) => { const dd = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid); if (dd < bd) { bd = dd; b = k; } }); select(b); }, { passive: true });
    } else {
      run.classList.add('is-pinned');
      let step = 0, cw = 0, gap = 0, len = 1, top = 0, tm = [], last = -1;
      const measure = () => {
        const vh = innerHeight;
        run.style.height = `${vh + (n - 1) * vh * (innerWidth <= 760 ? 0.62 : 0.78)}px`;
        cw = cards[0].offsetWidth;
        gap = parseFloat(getComputedStyle(track).columnGap) || 24;
        step = cw + gap;
        len = run.offsetHeight - vh;
        top = run.getBoundingClientRect().top + scrollY;
        tm = tabs.map((t) => [t.offsetLeft, t.offsetWidth]);
      };
      // scroll progress (0..1) -> reel position (0..n-1), holding briefly at each card
      const pos = (p) => {
        const raw = clamp((p - IN) / (1 - 2 * IN)) * (n - 1), i = Math.min(Math.floor(raw), n - 2), f = raw - i;
        return i + smooth(clamp((f - HOLD) / (1 - 2 * HOLD)));
      };
      const render = () => {
        const r = run.getBoundingClientRect();
        if (r.bottom < -50 || r.top > innerHeight + 50) return;
        const p = clamp(-r.top / len), a = pos(p);
        track.style.transform = `translate3d(${(innerWidth - cw) / 2 - a * step}px,0,0)`;
        cards.forEach((c, k) => {
          const dd = Math.min(Math.abs(k - a), 1.5);
          c.style.opacity = (1 - Math.min(dd, 1) * 0.66).toFixed(3);
          c.style.transform = `scale(${(1 - dd * 0.045).toFixed(4)})`;
        });
        const i = Math.min(Math.floor(a), n - 2), f = a - i;
        const x = tm[i][0] + (tm[i + 1][0] - tm[i][0]) * f, w = tm[i][1] + (tm[i + 1][1] - tm[i][1]) * f;
        ink.style.width = `${w}px`; ink.style.transform = `translate3d(${x}px,0,0)`;
        if (tabBar.scrollWidth > tabBar.clientWidth) tabBar.scrollLeft = x + w / 2 - tabBar.clientWidth / 2;
        bar.style.setProperty('--p', p.toFixed(4));
        const near = Math.round(a);
        if (near !== last) { if (last >= 0) tick(8); last = near; select(near); }
      };
      render.measure = measure;
      jobs.push(render);
      // a tab takes the page to the scroll position where its card rests
      tabs.forEach((t, k) => t.addEventListener('click', () => {
        measure();
        const p = IN + (k / (n - 1)) * (1 - 2 * IN);
        scrollTo({ top: Math.round(top + p * len), behavior: 'smooth' });
      }));
      measure();
    }
  }

  // product chapters: the active feature sets the picture; every feature eases in by its distance from the middle of the screen
  const wide = matchMedia('(min-width: 901px)');
  d.querySelectorAll('[data-chapter]').forEach((ch) => {
    const feats = [...ch.querySelectorAll('[data-feat]')], shots = [...ch.querySelectorAll('[data-stage] img')], bars = [...ch.querySelectorAll('.stage-bars i')];
    let on = 0;
    const show = (i) => { if (i === on) return; on = i; shots.forEach((s, k) => s.classList.toggle('is-on', k === i)); tick(6); };
    const render = () => {
      const live = wide.matches && !reduce;
      ch.classList.toggle('is-live', live);
      if (!live) return;
      const r = ch.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;
      let best = 0, bt = -1;
      feats.forEach((f, k) => {
        const fr = f.getBoundingClientRect(), c = fr.top + fr.height / 2, off = (c - vh * 0.5) / (vh * 0.62);
        const t = smooth(clamp(1 - Math.abs(off)));
        f.style.setProperty('--o', (0.18 + 0.82 * t).toFixed(3));
        f.style.setProperty('--y', `${(Math.sign(off) * (1 - t) * 46).toFixed(1)}px`);
        f.style.setProperty('--s', (0.965 + 0.035 * t).toFixed(4));
        if (t > bt) { bt = t; best = k; }
        if (bars[k]) bars[k].style.setProperty('--f', clamp((vh * 0.5 - fr.top) / fr.height).toFixed(3));
      });
      show(best);
    };
    jobs.push(render);
  });

  // precision: 42 position fixes start scattered over the rack and settle within 10 cm of the tag
  const pv = d.querySelector('[data-precision]');
  if (pv) {
    const NS = 'http://www.w3.org/2000/svg', g = pv.querySelector('[data-dots]'), target = pv.querySelector('.pv-target'), svg = pv.querySelector('svg');
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const CX = 310, CY = 230, R = 12;
    const dots = Array.from({ length: 42 }, () => {
      const a = rnd() * Math.PI * 2, m = Math.sqrt(rnd()) * R;
      const el = d.createElementNS(NS, 'circle'); g.appendChild(el);
      return { el, fx: CX + Math.cos(a) * m, fy: CY + Math.sin(a) * m, sx: 72 + rnd() * 456, sy: 44 + rnd() * 330, lag: rnd() * 0.28 };
    });
    const paint = (t) => {
      dots.forEach((o) => {
        const e = smooth(clamp((t - o.lag) / 0.72));
        o.el.setAttribute('cx', (o.sx + (o.fx - o.sx) * e).toFixed(1));
        o.el.setAttribute('cy', (o.sy + (o.fy - o.sy) * e).toFixed(1));
        o.el.setAttribute('r', (3.4 - 1.3 * e).toFixed(2));
        o.el.setAttribute('opacity', (0.45 + 0.4 * e).toFixed(2));
      });
      const done = smooth(clamp((t - 0.82) / 0.18));
      svg.style.setProperty('--dim', done.toFixed(3));
      target.style.setProperty('--hit', (done * 0.16).toFixed(3));
    };
    if (reduce) paint(1);
    else {
      const render = () => { const r = pv.getBoundingClientRect(), vh = innerHeight; if (r.bottom < -50 || r.top > vh + 50) return; paint(clamp((vh * 0.95 - r.top) / (vh * 0.6))); };
      jobs.push(render);
    }
  }
  // the category paragraph: each word lights up as the page scrolls past it
  const wsec = d.querySelector('[data-words]');
  if (wsec && !reduce) {
    const para = wsec.querySelector('[data-words-text]'), words = [];
    const split = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const f = d.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(d.createTextNode(t)); else { const w = d.createElement('span'); w.className = 'w'; w.textContent = t; f.appendChild(w); words.push(w); } });
        n.replaceWith(f);
      } else split(n);
    });
    split(para);
    wsec.classList.add('is-run');
    const link = wsec.querySelector('.arrow-link');
    const render = () => {
      const r = wsec.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;
      const t = clamp(-r.top / Math.max(1, r.height - vh) / 0.86), lit = t * (words.length + 4) - 2;
      words.forEach((w, i) => { w.style.setProperty('--o', (0.16 + 0.84 * clamp(lit - i)).toFixed(3)); });
      link.style.setProperty('--lo', clamp((t - 0.9) * 10).toFixed(2));
    };
    jobs.push(render);
  }
  // closing film: plays only while on screen
  const vids = d.querySelectorAll('video[data-autoplay]');
  if (vids.length && 'IntersectionObserver' in window && !reduce) {
    const vo = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { threshold: 0.35 });
    vids.forEach((v) => vo.observe(v));
  } else vids.forEach((v) => { v.controls = true; });
  kick();
})();
