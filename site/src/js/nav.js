// The nav (round 3, thread "Perfect the site navigation"). Every door is a native <details>, so the nav works with this
// file off. It adds: one panel at a time, hover intent on a mouse, Escape and focus-out closing, the morph between
// panels, the lens that glides to the door you point at and rests on the door you are in, the shelf caption, the
// locator on long pages, the capsule tucking away while you read, prefetch on intent, the phone sheet's doors and
// panes, and Ask (answers from assets/ask.json, built from the pages themselves; no backend).
(() => {
  const d = document, h = d.documentElement, top = d.querySelector('.top'); if (!top) return;
  const P = [...d.querySelectorAll('details[data-panel]')], S = p => p.querySelector('summary'), phone = d.querySelector('.phone');
  const mouse = matchMedia('(hover:hover) and (pointer:fine)').matches, narrow = () => innerWidth < 1024;
  const inert = on => d.querySelectorAll('main,footer').forEach(x => x.inert = on);
  let tm;
  const show = (p, on) => {
    if (on) {
      const o = P.find(q => q !== p && q.open), dr = p.querySelector('.drop'), od = o && o.querySelector('.drop');
      if (dr) { const morph = od && o.classList.contains('door') && p.classList.contains('door'); dr.style.setProperty('--from', morph ? od.offsetHeight + 'px' : '0px'); dr.style.setProperty('--o0', morph ? 1 : 0) }
      P.forEach(q => { if (q !== p) q.open = false });
    } else delete p.dataset.hover;
    p.open = on; S(p).setAttribute('aria-expanded', on); lensTo();
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
      if (p === phone) { h.classList.toggle('sheet-on', p.open); inert(p.open); if (!p.open) home() }
      if (p.open) top.classList.remove('away', 'locate');
      if (p.open && p.classList.contains('nask')) setTimeout(() => p.querySelector('input').focus(), 30);
    });
    if (p !== phone) p.addEventListener('focusout', e => { if (p.open && e.relatedTarget && !p.contains(e.relatedTarget)) show(p, false) });
    // hover intent, mouse only: 110 ms to open the first panel, none to move to the next one
    if (mouse && p.classList.contains('door')) {
      s.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse') return; clearTimeout(tm); lensTo(s);
        tm = setTimeout(() => { if (!p.open) { show(p, true); p.dataset.hover = 1 } }, P.some(q => q.open && q !== p) ? 0 : 110);
      });
      s.addEventListener('pointerleave', () => clearTimeout(tm));
    }
  });
  if (mouse) {
    top.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') tm = setTimeout(() => { P.forEach(p => p.dataset.hover && show(p, false)); lensTo() }, 260) });
    top.addEventListener('pointerenter', e => { clearTimeout(tm); if (e.pointerType === 'mouse' && !narrow()) top.classList.remove('locate') });
  }
  d.addEventListener('click', e => P.forEach(p => { if (p.open && !p.contains(e.target)) show(p, false) }));
  d.addEventListener('keydown', e => {
    const t = e.target, typing = /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable;
    if (e.key === 'Escape') P.forEach(p => { if (p.open) { show(p, false); S(p).focus() } });
    else if ((e.key === '/' && !typing) || (e.key === 'k' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); openAsk() }
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && t.closest && t.closest('.door > summary')) {
      const D = [...d.querySelectorAll('.door > summary')], i = D.indexOf(t), n = D[(i + (e.key === 'ArrowRight' ? 1 : -1) + D.length) % D.length];
      e.preventDefault(); n.focus(); lensTo(n); if (P.some(p => p.open && p.classList.contains('door'))) show(n.parentNode, true);
    }
  });
  const openAsk = () => {
    const a = d.querySelector('.nask');
    if (a && !narrow()) { show(a, true); a.querySelector('input').focus() }
    else if (phone) { show(phone, true); home(); phone.querySelector('.sheet-ask input').focus() }
  };

  // the lens: one bead of glass behind the door you point at (or the open one); at rest on the door you are in
  const doors = d.querySelector('.doors'), lens = d.querySelector('.lens');
  function lensTo(s) {
    if (!lens) return;
    s = s || (d.querySelector('.door[open] > summary')) || d.querySelector('.door.here > summary');
    if (!s || narrow()) { lens.classList.remove('on'); return }
    lens.style.width = s.offsetWidth + 'px'; lens.style.transform = `translateX(${s.offsetLeft}px)`;
    requestAnimationFrame(() => lens.classList.add('on'));
  }
  if (doors) doors.addEventListener('pointerleave', () => { if (!P.some(p => p.open)) lensTo() });
  (d.fonts ? d.fonts.ready : Promise.resolve()).then(() => lensTo());
  addEventListener('resize', () => lensTo());

  // the shelf: the spine under the pointer or the focus names its guide
  d.querySelectorAll('.shelfgrp').forEach(g => {
    const c = g.querySelector('.shelf-cap');
    const go = e => { const a = e.target.closest('.spine'); if (a) c.textContent = a.dataset.t };
    g.addEventListener('pointerover', go); g.addEventListener('focusin', go);
  });

  // reading: the capsule tucks away going down and comes back going up; on long pages it becomes a locator instead,
  // naming where you are and the section you read, with a hairline for how far (the page's cover or world colour)
  const main = d.querySelector('main'), world = d.body.dataset.world;
  const H = world && !d.querySelector('.local,[data-rail]') ? [...main.querySelectorAll('h2')].filter(x => !x.closest('.head,.close,.related,details,footer')) : [];
  const where = top.querySelector('.where'), wc = where && where.querySelector('.w-crumb'), ws = where && where.querySelector('.w-sec');
  const crumbs = main.querySelectorAll('.crumbs a'), here = d.querySelector('.door.here > summary');
  if (wc) wc.textContent = crumbs.length ? crumbs[crumbs.length - 1].textContent : here ? here.textContent : '';
  const head = main.querySelector('.head');
  let lastY = scrollY, sec = -1;
  const ft = d.querySelector('footer.ft .ft-card');
  const tidy = s => (s.querySelector('span') || s).textContent.replace(/\s+/g, ' ').trim().replace(/\.$/, '');
  const onScroll = () => {
    const y = scrollY, dy = y - lastY; lastY = y;
    top.classList.toggle('compact', y > 8);
    // phones: over the night footer the dock's glass turns dark, so it reads as glass there too, not a grey smear
    if (ft) top.classList.toggle('on-ink', narrow() && ft.getBoundingClientRect().top < innerHeight - 40);
    if (P.some(p => p.open) || top.contains(d.activeElement) && d.activeElement !== d.body) return;
    const past = head ? head.getBoundingClientRect().bottom < 80 : y > innerHeight * .8;
    if (H.length >= 3 && past && !narrow()) {
      top.classList.remove('away');
      let k = 0; H.forEach((x, i) => { if (x.getBoundingClientRect().top < innerHeight * .4) k = i });
      if (k !== sec) { sec = k; ws.textContent = tidy(H[k]) }
      top.style.setProperty('--p', Math.min(1, y / Math.max(1, d.documentElement.scrollHeight - innerHeight)).toFixed(4));
      if (dy > 3) top.classList.add('locate'); else if (dy < -8) top.classList.remove('locate');
    } else {
      top.classList.remove('locate');
      if (y > innerHeight * .9 && dy > 6) top.classList.add('away'); else if (dy < -6 || y < innerHeight * .9) top.classList.remove('away');
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // prefetch a page the pointer rests on in the capsule, its panels and the sheet (Vercel pick, M17)
  const seen = new Set([location.pathname]);
  top.addEventListener('pointerover', e => {
    const a = e.target.closest('a[href]'); if (!a || a.origin !== location.origin || seen.has(a.pathname)) return;
    seen.add(a.pathname); const l = d.createElement('link'); l.rel = 'prefetch'; l.href = a.href; d.head.append(l);
  }, { passive: true });

  // the phone sheet: the five doors; a door slides in its own page, in its world's ground
  const sheet = d.querySelector('.sheet'), panes = sheet ? [...sheet.querySelectorAll('.pane')] : [];
  const GROUND = { steel: '#eef3fb', shift: '#f3f5f9', morning: '#f0f6ff', paper: '#f8f5ef', studio: '#f6f3f1' };
  function home() { if (!sheet) return; sheet.classList.remove('deep'); sheet.style.removeProperty('--sg') }
  if (sheet) {
    sheet.querySelectorAll('[data-pane]').forEach(b => b.addEventListener('click', () => {
      const p = panes[+b.dataset.pane]; panes.forEach(x => x.classList.toggle('on', x === p));
      sheet.style.setProperty('--sg', GROUND[p.dataset.world] || '#fff'); sheet.classList.add('deep');
      p.parentNode.scrollTop = 0; setTimeout(() => sheet.querySelector('.back').focus({ preventScroll: true }), 300);
    }));
    sheet.querySelector('.back').addEventListener('click', home);
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
          : `<p class="nask-none">No page answers that yet. <a href="${url('/contact/')}">Book a call</a> and ask the team.</p>`;
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
