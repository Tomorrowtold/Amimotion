// Hero: the AmIGo tag film from the previous site, scrubbed by scroll.
// The tag turns in studio light while four lines arrive one at a time, then the promise settles.
// Without JS (or with reduced motion) the still and the promise show as a normal first screen.
(() => {
  const runway = document.querySelector('[data-hero-runway]');
  if (!runway) return;
  const hero = runway.querySelector('[data-hero]');
  const canvas = runway.querySelector('[data-hero-canvas]'), still = runway.querySelector('[data-hero-still]');
  const lines = [...runway.querySelectorAll('[data-hero-line]')], copy = runway.querySelector('[data-hero-copy]');
  const glow = runway.querySelector('[data-hero-glow]'), film = runway.querySelector('.hero-film');
  const ROOT = document.documentElement.dataset.root ?? '/';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settle = () => { copy.classList.add('is-on'); glow?.classList.add('is-on'); hero.classList.add('is-static'); runway.style.height = ''; film.style.transform = 'translateY(-17vh) scale(.58)'; };
  if (reduce || /[?&]still\b/.test(location.search)) { settle(); return; }

  const N = 72, phone = () => innerWidth <= 760;
  const src = (i) => `${ROOT}assets/intro/turn-${phone() ? 720 : 1080}-${String(i).padStart(3, '0')}.webp`;
  const frames = new Array(N), ok = new Array(N).fill(false);
  const ctx = canvas.getContext('2d');
  let len = 1, p = 0, drawn = -1;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const span = (a, b, v) => clamp((v - a) / (b - a));

  // load frames in a spread order so the turn is usable early, after first paint
  const order = []; for (let s = 8; s >= 1; s = s >> 1) for (let i = 0; i < N; i += s) if (!order.includes(i)) order.push(i);
  const load = () => order.forEach((i, k) => setTimeout(() => { const im = new Image(); im.decoding = 'async'; im.onload = () => { ok[i] = true; frames[i] = im; if (k < 2) draw(true); }; im.src = src(i); }, k * 12));
  if (document.readyState === 'complete') setTimeout(load, 200); else addEventListener('load', () => setTimeout(load, 200));

  function measure() {
    len = innerHeight * (phone() ? 1.8 : 2.4);
    runway.style.height = `${innerHeight + len}px`;
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    drawn = -1; draw(true);
  }
  function pick(i) { for (let dd = 0; dd < N; dd++) { if (ok[i - dd]) return frames[i - dd]; if (ok[i + dd]) return frames[i + dd]; } return null; }
  function draw(force) {
    const t = span(0.0, 0.72, p), i = Math.round((t * t * (3 - 2 * t)) * (N - 1));
    if (i === drawn && !force) return;
    const img = pick(i); if (!img) return;
    drawn = i; still.style.opacity = '0';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }
  function apply() {
    p = clamp(-runway.getBoundingClientRect().top / len);
    draw();
    // four lines, each owning a window of the scroll; the promise takes the last stretch
    const W = [[0.02, 0.2], [0.2, 0.38], [0.38, 0.56], [0.56, 0.72]];
    lines.forEach((el, k) => el.classList.toggle('is-on', p >= W[k][0] && p < W[k][1]));
    const end = p >= 0.76;
    copy.classList.toggle('is-on', end); glow?.classList.toggle('is-on', end);
    const k = span(0.7, 0.9, p), e = k * k * (3 - 2 * k);
    film.style.transform = `translateY(${-17 * e}vh) scale(${1 - 0.42 * e})`;
  }
  let raf = 0;
  addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); }, { passive: true });
  addEventListener('resize', () => { measure(); apply(); });
  
  measure(); apply();
  if (/[?&]heroend\b/.test(location.search)) { scrollTo(0, len * 0.9); }
})();
