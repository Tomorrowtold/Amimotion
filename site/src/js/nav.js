// The nav (round 14, team/rounds/14-nav/notes.md). Every panel is a native <details>, so the nav works with this file
// off. It adds: one panel at a time, hover intent on a mouse, Escape and focus-out closing, the morph between panels,
// the preview still, the gliding hover mark, prefetch on intent, the phone dock and sheet, and Ask (answers from
// assets/ask.json, built from the pages themselves; no backend).
(() => {
  const d = document, h = d.documentElement, top = d.querySelector('.top'); if (!top) return;
  const P = [...d.querySelectorAll('details[data-panel]')], S = p => p.querySelector('summary'), phone = d.querySelector('.phone');
  const mouse = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const inert = on => d.querySelectorAll('main,footer').forEach(x => x.inert = on);
  let tm;
  const show = (p, on) => {
    if (on) {
      const o = P.find(q => q !== p && q.open), dr = p.querySelector('.drop'), od = o && o.querySelector('.drop');
      if (dr) dr.style.setProperty('--from', od && o.closest('.top') === p.closest('.top') && !o.classList.contains('phone') ? od.offsetHeight + 'px' : '0px');
      P.forEach(q => { if (q !== p) q.open = false });
    } else delete p.dataset.hover;
    p.open = on; S(p).setAttribute('aria-expanded', on);
  };
  P.forEach(p => {
    const s = S(p); s.setAttribute('aria-expanded', p.open);
    s.addEventListener('click', e => {
      e.preventDefault();
      if (p.dataset.hover) { delete p.dataset.hover; return; } // a click on a panel the pointer opened pins it
      show(p, !p.open);
    });
    p.addEventListener('toggle', () => {
      s.setAttribute('aria-expanded', p.open);
      if (p === phone) { h.classList.toggle('sheet-on', p.open); inert(p.open); const b = d.querySelector('[data-menu]'); if (b) b.setAttribute('aria-expanded', p.open); }
      if (p.open && p.classList.contains('nask') && !p.contains(d.activeElement)) p.querySelector('input').focus();
    });
    if (p !== phone) p.addEventListener('focusout', e => { if (p.open && e.relatedTarget && !p.contains(e.relatedTarget)) show(p, false) });
    // hover intent, mouse only: 110 ms to open the first panel, none to move to the next one
    if (mouse && p.closest('.links')) {
      s.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse') return; clearTimeout(tm);
        tm = setTimeout(() => { if (!p.open) { show(p, true); p.dataset.hover = 1 } }, P.some(q => q.open && q !== p) ? 0 : 110);
      });
      s.addEventListener('pointerleave', () => clearTimeout(tm));
    }
  });
  if (mouse) {
    top.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') tm = setTimeout(() => P.forEach(p => p.dataset.hover && show(p, false)), 240) });
    top.addEventListener('pointerenter', () => clearTimeout(tm));
  }
  d.addEventListener('click', e => P.forEach(p => { if (p.open && !p.contains(e.target) && !e.target.closest('[data-dock]')) show(p, false) }));
  d.addEventListener('keydown', e => {
    const t = e.target, typing = /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable;
    if (e.key === 'Escape') P.forEach(p => { if (p.open) { show(p, false); (p === phone && h.classList.contains('dock-on') && !phone.contains(t) ? d.querySelector('[data-menu]') : S(p)).focus() } });
    else if ((e.key === '/' && !typing) || (e.key === 'k' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); openAsk() }
  });
  const openAsk = () => {
    const a = d.querySelector('.nask');
    if (a && a.offsetParent) { show(a, true); a.querySelector('input').focus() }
    else if (phone) { show(phone, true); phone.querySelector('.sheet-ask input').focus() }
  };

  // the preview still: the row under the pointer or the focus picks the picture and the caption
  d.querySelectorAll('.drop').forEach(dr => {
    const st = dr.querySelector('.stage'); if (!st) return; const cap = st.querySelector('figcaption');
    const go = e => {
      const a = e.target.closest('.drop-groups a'); if (!a) return;
      if (a.dataset.k) st.querySelectorAll('picture').forEach(x => x.classList.toggle('on', x.dataset.k === a.dataset.k));
      cap.innerHTML = a.innerHTML;
    };
    dr.addEventListener('pointerover', go); dr.addEventListener('focusin', go);
  });

  // the hover mark glides between the section names (mouse only); it is placed against the bar, not the list,
  // so the list stays static and the panels keep the bar as their box
  const L = d.querySelector('.links');
  if (L && mouse) {
    const g = d.createElement('li'); g.className = 'glide'; g.setAttribute('aria-hidden', 'true'); L.append(g);
    L.addEventListener('pointerover', e => {
      const s = e.target.closest('summary'); if (!s) return;
      g.style.cssText = `width:${s.offsetWidth}px;transform:translateX(${s.getBoundingClientRect().left - top.getBoundingClientRect().left}px)`;
      if (!L.classList.contains('glide-on')) requestAnimationFrame(() => L.classList.add('glide-on'));
    });
    L.addEventListener('pointerleave', () => L.classList.remove('glide-on'));
  }

  // prefetch a page the pointer rests on in the bar, its panels and the sheet (Vercel pick, M17)
  const seen = new Set([location.pathname]);
  top.addEventListener('pointerover', e => {
    const a = e.target.closest('a[href]'); if (!a || a.origin !== location.origin || seen.has(a.pathname)) return;
    seen.add(a.pathname); const l = d.createElement('link'); l.rel = 'prefetch'; l.href = a.href; d.head.append(l);
  }, { passive: true });

  // the phone dock slides in once the first screen (or the homepage hero runway) is behind the reader
  const k = d.querySelector('[data-dock]');
  if (k) {
    const a = d.querySelector('[data-dock-after]'), b = [...k.querySelectorAll('a,button')]; let on;
    const f = () => { const y = a ? a.getBoundingClientRect().bottom < innerHeight * .5 : scrollY > innerHeight * .8; if (y !== on) { on = y; h.classList.toggle('dock-on', y); b.forEach(x => x.tabIndex = y ? 0 : -1) } };
    addEventListener('scroll', f, { passive: true }); f();
    k.querySelector('[data-menu]').addEventListener('click', () => show(phone, !phone.open));
    k.querySelector('[data-ask-open]').addEventListener('click', openAsk);
  }

  // Ask: score the site's own answers against the words typed; the best answer reads in place, four more under it
  const root = h.dataset.root || '/', idx = h.dataset.index || '';
  const url = u => { if (root === '/') return u; const [p, f] = u.split('#'); return root + p.slice(1) + (p.endsWith('/') ? idx : '') + (f ? '#' + f : '') };
  const STOP = new Set('a an the is are am do does did i me my we our us you your it its to of in on for and or can how what when where which who why with be will this that there from by at as about need get much many any have has'.split(' '));
  const SYN = { price: 'cost pricing buy', cost: 'price pricing buy', wifi: 'wi fi network', wip: 'work progress', start: 'pilot', live: 'map', accuracy: 'accurate cm', accurate: 'accuracy cm', battery: 'batteries', worker: 'people privacy', staff: 'people privacy', install: 'mount survey anchor', ai: 'mcp assistant', api: 'developer mcp', trial: 'pilot', demo: 'call pilot', range: 'metre coverage', data: 'cloud', security: 'trust data' };
  const tk = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9±\s]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)).map(w => w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ations?|ing|ed|s)$/, '') : w);
  let IX;
  const load = () => IX || (IX = fetch(root + 'assets/ask.json').then(r => r.json()).then(j => j.e.map(([i, t, a, f, k]) => {
    const [u, l] = j.p[i]; return { u: f === 'q' ? u + '#:~:text=' + encodeURIComponent(t) : f ? u + f : u, l, t, a, k, T: tk(t + ' ' + (k || '')), L: tk(l), A: tk(a) };
  })));
  const hit = (arr, w, pre) => arr.some(x => x === w || ((pre || w.length > 4) && x.startsWith(w)));
  const find = (E, q) => {
    const Q = tk(q); if (!Q.length) return [];
    return E.map(e => {
      let s = 0, n = 0;
      Q.forEach((w, i) => {
        const pre = i === Q.length - 1 && w.length > 1;
        let v = hit(e.T, w, pre) ? 3 : hit(e.L, w, pre) ? 2 : hit(e.A, w, pre) ? 1 : 0;
        if (!v && SYN[w]) v = SYN[w].split(' ').some(x => hit(e.T, x) || hit(e.A, x)) ? .8 : 0;
        if (v) n++; s += v;
      });
      return [s * n / Q.length + (e.k ? .5 : 0), e]; // a page in the nav edges out a passing mention
    }).filter(x => x[0] >= 1).sort((a, b) => b[0] - a[0]).map(x => x[1])
      .filter((e, i, A) => A.findIndex(x => x.t.toLowerCase() === e.t.toLowerCase()) === i).slice(0, 5); // one line per question
  };
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  d.querySelectorAll('[data-ask]').forEach(form => {
    const inp = form.querySelector('input'), box = form.parentNode, out = box.querySelector('.nask-out'), st = box.querySelector('[data-ask-status]');
    const wrap = form.closest('.sheet') || form.closest('.drop'); let tq;
    const run = () => {
      const q = inp.value.trim(); wrap.classList.toggle('asking', !!q);
      if (!q) { out.innerHTML = ''; st.textContent = ''; return; }
      load().then(E => {
        if (inp.value.trim() !== q) return; const r = find(E, q);
        out.innerHTML = r.length
          ? `<a class="ans" href="${url(r[0].u)}"><b>${esc(r[0].t)}</b><span>${esc(r[0].a)}</span><i>${esc(r[0].l)}</i></a>`
            + (r.length > 1 ? '<ul class="nask-more">' + r.slice(1).map(x => `<li><a href="${url(x.u)}"><b>${esc(x.t)}</b><span>${esc(x.t === x.l ? x.k || x.a.slice(0, 90) + '…' : x.l)}</span></a></li>`).join('') + '</ul>' : '')
          : `<p class="nask-none">No page answers that yet. <a href="${url('/contact/')}">Book a call</a> and nask the team.</p>`;
        st.textContent = r.length ? `${r.length} answer${r.length > 1 ? 's' : ''}. Down arrow to move through them.` : 'No answer on the site yet.';
      }).catch(() => { IX = 0 });
    };
    inp.addEventListener('focus', load, { once: true });
    inp.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(run, 60) });
    form.addEventListener('submit', e => { e.preventDefault(); const a = out.querySelector('a'); if (a) location.href = a.href });
    box.addEventListener('keydown', e => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const A = [inp, ...out.querySelectorAll('a')], i = A.indexOf(d.activeElement); if (i < 0) return;
      e.preventDefault(); A[Math.max(0, Math.min(A.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))].focus();
    });
  });
})();
