/* The wire: the hero's lower third. One headline at a time, its words rising in like a broadcast caption; a hairline
   along the top fills while it stays, then the next comes in. Arrows step by hand; hover or focus holds it; with reduced
   motion it waits for the arrows. Without this script the first headline simply shows. */
(() => {
  const w = document.querySelector('.hx-wire'); if (!w) return;
  const li = [...w.querySelectorAll('li')], num = w.querySelector('.hx-wire-n b'), bar = w.querySelector('.hx-wire-p');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  li.forEach((l) => {
    const h = l.querySelector('.hx-wire-h'), words = h.textContent.trim().split(/\s+/);
    h.textContent = '';
    words.forEach((x, k) => { const s = document.createElement('span'); s.textContent = x; s.style.setProperty('--k', k); h.append(s, ' '); });
    l.setAttribute('aria-hidden', l.classList.contains('on') ? 'false' : 'true');
    l.querySelector('a').tabIndex = l.classList.contains('on') ? 0 : -1;
  });
  let i = 0;
  const pad = (n) => String(n).padStart(2, '0');
  const run = () => { if (still) return; bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); };
  const go = (j, dir) => {
    j = (j + li.length) % li.length; if (j === i) return;
    w.dataset.dir = dir > 0 ? 'f' : 'b';
    li.forEach((l) => l.classList.remove('was'));
    const a = li[i], b = li[j];
    a.classList.remove('on'); a.classList.add('was'); a.setAttribute('aria-hidden', 'true'); a.querySelector('a').tabIndex = -1;
    b.classList.add('on'); b.setAttribute('aria-hidden', 'false'); b.querySelector('a').tabIndex = 0;
    i = j; num.textContent = pad(i + 1); run();
  };
  w.querySelectorAll('.hx-wire-b').forEach((btn) => btn.addEventListener('click', () => go(i + +btn.dataset.d, +btn.dataset.d)));
  bar.addEventListener('animationend', () => go(i + 1, 1));
  w.classList.add('live'); run();
})();
