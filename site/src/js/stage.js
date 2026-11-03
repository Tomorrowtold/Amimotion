// stage.js: the homepage motion system (round 10 harvest plan, section 3, M17). About 3 KB gzipped, no libraries.
// One rAF loop writes --p (0 to 1) on each [data-stage] (a sticky stage in its runway) and [data-view] (an element
// crossing the viewport), only where the browser lacks CSS scroll-driven animations; one IntersectionObserver gates
// the work to stages in view. The same loop drives the parts CSS cannot: the turntable frames (render job R1, when
// its frames land), the Find it switch, and the hall film (plays in view, pauses out of view, with a pause control).
// html.motion is set in the head before first paint, so nothing here moves layout. Without it (reduced motion),
// the page is a set of designed stills and only the film control and the diagnostic hand-off run.
(() => {
  const d = document, H = d.documentElement, motion = H.classList.contains('motion');
  const ROOT = H.dataset.root ?? '/', IDX = H.dataset.index ?? '';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const native = !!(window.CSS && CSS.supports('animation-timeline: view()'));
  const conn = navigator.connection || {};
  const lean = conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || '');
  const prog = (el) => {
    const r = el.getBoundingClientRect(), vh = innerHeight;
    return el.hasAttribute('data-stage') ? clamp(-r.top / Math.max(1, r.height - vh)) : clamp((vh - r.top) / (vh + r.height));
  };

  // ---- the stages: which are in view, and their --p ----
  const stages = [...d.querySelectorAll('[data-stage],[data-view]')], live = new Set(), hooks = [];
  if (motion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      e.isIntersecting ? live.add(e.target) : live.delete(e.target);
      e.target.style.willChange = e.isIntersecting ? 'transform' : '';
    }), { rootMargin: '25% 0px' });
    stages.forEach((s) => io.observe(s));
  }
  let raf = 0;
  const tick = () => {
    raf = 0;
    if (!native) live.forEach((s) => s.style.setProperty('--p', prog(s).toFixed(4)));
    hooks.forEach((h) => h());
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);

  // ---- S1 turntable: a frame sequence scrubbed by the hero runway (render job R1). No frames yet: the still stays. ----
  const turn = d.querySelector('[data-turn]'), hero = turn && turn.closest('[data-stage]');
  const N = turn ? +turn.dataset.frames || 0 : 0;
  // the still, painted into the canvas over the hidden <img> box (CSS hides the img only when JavaScript runs)
  if (turn) {
    const cv = turn.querySelector('canvas'), cx = cv.getContext('2d'), im = turn.querySelector('img');
    const paint = () => {
      if (turn.classList.contains('is-live') || !im.complete || !im.naturalWidth) return;
      const k = Math.min(devicePixelRatio || 1, 2), f = turn.getBoundingClientRect(), r = im.getBoundingClientRect(), sc = f.width ? cv.offsetWidth / f.width : 1;
      cv.width = Math.round(cv.offsetWidth * k); cv.height = Math.round(cv.offsetHeight * k);
      cx.clearRect(0, 0, cv.width, cv.height);
      cx.drawImage(im, (r.left - f.left) * sc * k, (r.top - f.top) * sc * k, r.width * sc * k, r.height * sc * k);
    };
    im.complete ? paint() : im.addEventListener('load', paint);
    addEventListener('resize', paint);
  }
  if (motion && N && !lean) {
    const cv = turn.querySelector('canvas'), cx = cv.getContext('2d'), frames = [], ok = [];
    const w = innerWidth <= 760 ? 720 : 1080, src = (i) => ROOT + turn.dataset.frameSrc.replace(/^\//, '').replace('{w}', w).replace('{i}', String(i).padStart(3, '0'));
    let drawn = -1;
    const fit = () => { const r = cv.getBoundingClientRect(), k = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(r.width * k); cv.height = Math.round(r.height * k); drawn = -1; };
    const near = (i) => { for (let j = 0; j < N; j++) { if (ok[i - j]) return frames[i - j]; if (ok[i + j]) return frames[i + j]; } return null; };
    const draw = () => {
      if (!live.has(hero)) return;
      const t = clamp(prog(hero) / 0.7), e = t * t * (3 - 2 * t), i = Math.round(e * 0.75 * (N - 1));   // about 270 degrees
      if (i === drawn) return;
      const im = near(i); if (!im) return;
      if (!cv.width) fit();
      drawn = i; turn.classList.add('is-live');
      const s = Math.min(cv.width / im.naturalWidth, cv.height / im.naturalHeight), iw = im.naturalWidth * s, ih = im.naturalHeight * s;
      cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(im, (cv.width - iw) / 2, (cv.height - ih) / 2, iw, ih);
    };
    const order = []; for (let s = 16; s >= 1; s >>= 1) for (let i = 0; i < N; i += s) if (!order.includes(i)) order.push(i);
    const load = () => order.forEach((i, k) => setTimeout(() => { const im = new Image(); im.decoding = 'async'; im.onload = () => { frames[i] = im; ok[i] = true; drawn = -1; ask(); }; im.src = src(i); }, k * 10));
    d.readyState === 'complete' ? load() : addEventListener('load', load);
    addEventListener('resize', fit);
    hooks.push(draw);
  }

  // ---- S2 Find it: on a wide screen the runway drives Scan -> Tag; the switch reports the state and jumps the runway ----
  const find = d.querySelector('[data-find]');
  if (find && motion) {
    const scan = find.querySelector('#find-scan'), tag = find.querySelector('#find-tag'), wide = matchMedia('(min-width:1024px)');
    let last;
    hooks.push(() => {
      if (!wide.matches || !live.has(find)) return;
      const s = prog(find) < 0.36;
      if (s !== last) { last = s; (s ? scan : tag).checked = true; }
    });
    const jump = (p) => (e) => {
      if (!wide.matches) return;
      e.preventDefault();
      const r = find.getBoundingClientRect(), y = scrollY + r.top + p * (r.height - innerHeight);
      scrollTo({ top: y, behavior: 'smooth' });
    };
    find.querySelector('label[for=find-scan]').addEventListener('click', jump(0.08));
    find.querySelector('label[for=find-tag]').addEventListener('click', jump(0.62));
    if (wide.matches) { scan.checked = true; last = true; }
  }

  // ---- S1c the hall film: sources attach after load, it plays at 50% or more in view and uncovered, a visible pause ----
  const film = d.querySelector('[data-film]');
  if (film) {
    const v = film.querySelector('video'), btn = film.querySelector('.playpause'), run = film.parentElement.querySelector('[data-film-run]');
    const next = (run || film).nextElementSibling, cut = matchMedia('(max-aspect-ratio:1/1)').matches ? '1x1' : '4x5';
    let attached = false, user = motion ? null : 'paused', failed = false, held = false;
    const attach = () => {
      if (attached || lean) return; attached = true;
      const b = film.dataset.src + '-' + cut;
      [['-av1.mp4', 'video/mp4; codecs="av01.0.08M.08"'], ['-h264.mp4', 'video/mp4; codecs="avc1.640028"']].forEach(([x, t]) => {
        const s = d.createElement('source'); s.src = ROOT + b.replace(/^\//, '') + x; s.type = t; v.appendChild(s);
      });
      v.lastElementChild.addEventListener('error', () => { failed = true; btn.hidden = true; });
      v.load();
    };
    const set = (playing) => { btn.setAttribute('aria-pressed', String(!playing)); btn.setAttribute('aria-label', playing ? 'Pause the film' : 'Play the film'); };
    v.addEventListener('playing', () => { film.classList.add('is-playing'); btn.hidden = false; set(true); });
    v.addEventListener('pause', () => set(false));
    btn.addEventListener('click', () => {
      if (v.paused) { user = null; attach(); v.play().catch(() => {}); } else { user = 'paused'; v.pause(); }
    });
    if (!lean) { btn.hidden = false; set(false); }
    const seen = () => {
      const r = film.getBoundingClientRect(), vh = innerHeight;
      const bottom = Math.min(r.bottom, vh, next ? next.getBoundingClientRect().top : vh);
      return clamp((bottom - Math.max(r.top, 0)) / vh);
    };
    const check = () => {
      if (failed) return;
      const s = seen();
      if (s > 0.05) attach();
      if (s >= 0.5 && !user && motion && !held) { if (v.paused) v.play().catch(() => {}); } else if (!v.paused) v.pause();
    };
    const start = () => { hooks.push(check); check(); };
    d.readyState === 'complete' ? start() : addEventListener('load', start);

    // ---- S1c handover (round 23): film becomes the live map. The runway after the figure scrubs --h; the film holds
    // on its top-down frame (a still of that exact frame, the same cover crop), the floor cleans to the map ground, the
    // racks draw in ink over the real racks, the trolley closes to its located dot, and its wait counts in amber.
    // Scrolling back reverses it to the footage. Reduced motion: the finished map, no tween, once the runway is entered.
    const hand = film.querySelector('[data-hand]');
    if (hand && run) {
      film.dataset.cut = cut;
      const svg = hand.querySelector('svg'), trol = hand.querySelector('.h-trol'), wt = hand.querySelector('.h-card span');
      if (cut === '1x1') svg.setAttribute('viewBox', '531.2 0 857.6 1072');
      const url = (u) => { u = u.replace('{cut}', cut); return u[0] === '/' ? ROOT + u.slice(1) : u; };
      let loaded = false, tgt = 0, cur = -1, hr = 0, last = 0, waitFrom = 0, timer = 0;
      const load = () => {
        if (loaded) return; loaded = true;
        hand.querySelectorAll('source[data-av]').forEach((s) => { s.type = 'image/avif'; s.srcset = url(s.dataset.av); });
        hand.querySelectorAll('img[data-wb]').forEach((i) => { i.src = url(i.dataset.wb); });
      };
      // the trolley's footprint (master px) closes to the dot at its centre
      const T = [812, 124, 258, 150], C = [958, 198], R = 10;
      const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
      const count = () => { wt.textContent = mmss((performance.now() - waitFrom) / 1000); };
      const apply = (h) => {
        hand.style.setProperty('--h', h.toFixed(4));
        const on = h > 0.0005;
        if (on !== held) { held = on; film.classList.toggle('is-held', on); if (on) v.pause(); else check(); }
        const a = clamp((h - .44) / .12), b = ease(clamp((h - .58) / .18));
        const w = T[2] + (2 * R - T[2]) * b, ht = T[3] + (2 * R - T[3]) * b;
        const x = T[0] + (C[0] - R - T[0]) * b, y = T[1] + (C[1] - R - T[1]) * b;
        trol.setAttribute('x', x.toFixed(1)); trol.setAttribute('y', y.toFixed(1));
        trol.setAttribute('width', w.toFixed(1)); trol.setAttribute('height', ht.toFixed(1));
        trol.setAttribute('rx', (8 + (R - 8) * b).toFixed(1));
        trol.style.opacity = a.toFixed(3);
        trol.style.fill = '#1f6bff'; trol.style.fillOpacity = clamp((b - .78) / .22).toFixed(3);
        trol.style.stroke = b > .5 ? '#1f6bff' : ''; trol.style.strokeOpacity = (1 - clamp((b - .8) / .2)).toFixed(3);
        const show = h > .78;
        if (show && !timer) { if (!waitFrom) waitFrom = performance.now() - 252000; count(); timer = setInterval(count, 1000); }
        if (!show && timer) { clearInterval(timer); timer = 0; }
        if (h < .5) waitFrom = 0;
      };
      const step = (now) => {
        hr = 0;
        const dt = last ? Math.min(64, now - last) : 16.7; last = now;
        cur = cur < 0 || !motion ? tgt : cur + (tgt - cur) * (1 - Math.pow(1 - .14, dt / 16.7));
        if (Math.abs(tgt - cur) < .0005) cur = tgt;
        apply(cur);
        if (cur !== tgt) hr = requestAnimationFrame(step); else last = 0;
      };
      const watch = () => {
        const r = run.getBoundingClientRect(), vh = innerHeight;
        if (r.top < vh * 2) load();
        const p = clamp((vh - r.top) / Math.max(1, r.height));
        const h = motion ? clamp((p - .08) / .64) : (p > .12 ? 1 : 0);
        if (h !== tgt || cur < 0) { tgt = h; if (!hr) hr = requestAnimationFrame(step); }
      };
      hooks.push(watch); watch();
    }
  }

  // ---- S6 the first diagnostic question: a tap carries the answer into /diagnostic/ (its own session store) ----
  const first = d.querySelector('[data-diag-start]');
  if (first) first.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-v]'); if (!a) return;
    try { const k = 'amimotion.diag', s = JSON.parse(sessionStorage.getItem(k) || '{}'); s.assets = [a.dataset.v]; sessionStorage.setItem(k, JSON.stringify(s)); } catch (x) {}
    if (IDX && !a.getAttribute('href').endsWith(IDX)) a.href += IDX;
  });

  ask();
})();
