/* Latest news card in the hero. One headline at a time; its words rise in; a row of nine segments shows where you are,
   the current one filling over 7 s before the next comes in. Arrows step by hand; hover or focus holds it; reduced motion
   waits for the arrows. Without this script the first headline simply shows. */
(() => {
  const w = document.querySelector('.hx-news'); if (!w) return;
  const li = [...w.querySelectorAll('li')], seg = [...w.querySelectorAll('.hx-news-seg i')], num = w.querySelector('.hx-news-n b');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  li.forEach((l, k) => {
    const h = l.querySelector('.hx-news-h'), words = h.textContent.trim().split(/\s+/);
    h.textContent = '';
    words.forEach((x, n) => { const s = document.createElement('span'); s.textContent = x; s.style.setProperty('--k', n); h.append(s, ' '); });
    l.setAttribute('aria-hidden', k ? 'true' : 'false'); l.querySelector('a').tabIndex = k ? -1 : 0;
  });
  let i = 0;
  const mark = () => {
    seg.forEach((s, k) => { s.classList.toggle('done', k < i); s.classList.remove('run'); });
    if (!still) { void seg[i].offsetWidth; seg[i].classList.add('run'); } else seg[i].classList.add('done');
    num.textContent = String(i + 1).padStart(2, '0');
  };
  const go = (j, dir) => {
    j = (j + li.length) % li.length; if (j === i) return;
    w.dataset.dir = dir > 0 ? 'f' : 'b';
    li.forEach((l) => l.classList.remove('was'));
    const a = li[i], b = li[j];
    a.classList.remove('on'); a.classList.add('was'); a.setAttribute('aria-hidden', 'true'); a.querySelector('a').tabIndex = -1;
    b.classList.add('on'); b.setAttribute('aria-hidden', 'false'); b.querySelector('a').tabIndex = 0;
    i = j; mark();
  };
  w.querySelectorAll('.hx-news-b').forEach((btn) => btn.addEventListener('click', () => go(i + +btn.dataset.d, +btn.dataset.d)));
  seg.forEach((s) => s.addEventListener('animationend', () => go(i + 1, 1)));
  w.classList.add('live'); mark();
})();
