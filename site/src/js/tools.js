// The planning tools and the contact draft. Everything runs in the browser; nothing is sent or stored.
// Round 21 (Kenji): every input draws. Each tool's answer is a drawing first (the plan, the pile of hours, the
// brief sheet), redrawn the moment an input moves, and the tool hubs show a live miniature of each drawing.
(() => {
  const d = document;
  const $ = (s, el = d) => el.querySelector(s);
  const num = (v, min = 0) => Math.max(min, Number(v) || 0);
  const fmt = (n) => Math.round(n).toLocaleString('en-IN');
  const fmt1 = (n) => (n >= 100 ? fmt(n) : n.toFixed(1));
  const val = (form, name) => (form.elements[name] && (form.elements[name].value ?? '')) || '';
  const radio = (form, name) => { const r = form.querySelector(`input[name="${name}"]:checked`); return r ? r : null; };
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const buzz = () => { try { if (navigator.vibrate && !RM.matches) navigator.vibrate(5); } catch (_) {} };
  const live = (form, fn) => { form.addEventListener('input', fn); form.addEventListener('change', (e) => { if (e.target.type === 'radio') buzz(); fn(); }); form.addEventListener('submit', (e) => { e.preventDefault(); fn(); }); fn(); };
  d.querySelectorAll('input[type="range"]').forEach((r) => {
    const o = d.querySelector(`output[for="${r.id}"]`);
    const show = () => { if (o) o.textContent = Number(r.value).toLocaleString('en-IN') + (r.dataset.unit || ''); r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); };
    r.addEventListener('input', show); show();
  });

  // ------------------------------------------------------------ drawing kit
  const tok = (n) => getComputedStyle(d.body).getPropertyValue(n).trim();
  const C = {};
  const colours = () => Object.assign(C, { ink: tok('--ink') || '#0b1238', soft: tok('--ink-soft') || '#3d4870', loc: tok('--located') || '#1f6bff', wait: tok('--waiting') || '#ffb020', act: tok('--action') || '#4b3df0', paper: tok('--surface') || '#fff', ground: tok('--ground') || '#f0f6ff', pressed: tok('--pressed') || '#e3eeff' });
  colours();
  const FONT = (px, w = 500) => `${w} ${px}px "AmI Text","AmI Text Fallback",Arial,sans-serif`;
  const outQ = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  // glide every key of o toward tgt; returns true while anything still moves
  const glide = (o, tgt, dt, tau = 140) => {
    const k = RM.matches ? 1 : 1 - Math.exp(-dt / tau); let busy = false;
    for (const key in tgt) {
      const v = o[key] ?? tgt[key], n = v + (tgt[key] - v) * k;
      o[key] = Math.abs(tgt[key] - n) <= 1e-3 * Math.max(1, Math.abs(tgt[key])) ? tgt[key] : n;
      if (o[key] !== tgt[key]) busy = true;
    }
    return busy;
  };
  const nice = (x) => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(x, 1e-9)))); return [1, 2, 2.5, 5, 10].map((m) => m * p).find((v) => v >= x); };
  // a canvas in `host`, redrawn on demand; paint(ctx, w, h, dt, now) returns true while it is still animating
  function canvas(host, paint) {
    const cv = d.createElement('canvas'); host.prepend(cv);
    const ctx = cv.getContext('2d'); let w = 0, h = 0, raf = 0, last = 0;
    const frame = (t) => {
      const dt = last ? Math.min(64, t - last) : 16; last = t;
      ctx.clearRect(0, 0, w, h); const busy = w && paint(ctx, w, h, dt, t);
      raf = busy ? requestAnimationFrame(frame) : 0; if (!busy) last = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const size = () => { const k = Math.min(devicePixelRatio || 1, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = Math.round(w * k); cv.height = Math.round(h * k); ctx.setTransform(k, 0, 0, k, 0, 0); kick(); };
    new ResizeObserver(size).observe(cv);
    if (d.fonts) d.fonts.ready.then(kick);
    return kick;
  }
  const line = (c, x1, y1, x2, y2) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
  const px = (v) => Math.round(v) + 0.5; // crisp hairlines
  // a dimension line with end ticks and its label, like a drawing's
  function dim(c, x1, y1, x2, y2, text, vertical) {
    c.strokeStyle = C.soft; c.globalAlpha = .55; c.lineWidth = 1;
    line(c, x1, y1, x2, y2);
    const t = 4; if (vertical) { line(c, x1 - t, y1, x1 + t, y1); line(c, x2 - t, y2, x2 + t, y2); } else { line(c, x1, y1 - t, x1, y1 + t); line(c, x2, y2 - t, x2, y2 + t); }
    c.globalAlpha = 1; c.fillStyle = C.ink; c.font = FONT(12); c.textAlign = 'center'; c.textBaseline = 'middle';
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, tw = c.measureText(text).width + 10;
    c.save(); c.translate(mx, my); if (vertical) c.rotate(-Math.PI / 2);
    c.fillStyle = C.paper; c.fillRect(-tw / 2, -8, tw, 16); c.fillStyle = C.ink; c.fillText(text, 0, 0.5); c.restore();
  }
  const label = (c, text, x, y, o = {}) => { c.font = FONT(o.size || 10, o.w || 500); c.fillStyle = o.color || C.soft; c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'alphabetic'; if (o.alpha != null) c.globalAlpha = o.alpha; c.fillText(text, x, y); c.globalAlpha = 1; };
  // a number that counts to its new value
  function counter(el, render) {
    let cur = null, from = null, to = null, t0 = 0, raf = 0;
    const step = (t) => {
      const k = outQ((t - t0) / 520); cur = from.map((f, i) => f + (to[i] - f) * k);
      el.innerHTML = render(cur.map(Math.round)); raf = k < 1 ? requestAnimationFrame(step) : 0;
    };
    return (...v) => { if (cur === null || RM.matches) { cur = v; el.innerHTML = render(v); return; } from = cur.slice(); to = v; t0 = performance.now(); if (!raf) raf = requestAnimationFrame(step); };
  }

  // ------------------------------------------------------------ anchor estimator
  // Planning grids are this site's first-budget assumptions, not an AmIMotion specification.
  const GRID = { open: 25, mixed: 18, dense: 12 };
  const anchorsOf = (L, W, H, env, dim) => {
    let g = GRID[env];
    if (H > 10) g *= 0.9;                       // tall halls lose some geometry at floor level
    const cells = (Math.ceil(L / g) + 1) * (Math.ceil(W / g) + 1);
    const min = dim === '3d' ? 4 : 3;
    const mid = Math.max(min, Math.round(cells));
    return { g, min, mid, nx: Math.ceil(L / g), ny: Math.ceil(W / g), lo: Math.max(min, Math.round(mid * 0.8)), hi: Math.max(min + 1, Math.round(mid * 1.25)) };
  };
  // the plan: the floor to scale, rack rows by floor type, the grid's coverage lines and an anchor on each corner;
  // beside it a section through the hall with the 3 to 8 m mounting band
  function anchorPlan(host, mini) {
    const S = { L: 100, W: 50, H: 9, s: 0, open: 0, mixed: 1, dense: 0 }, T = { ...S }, A = new Map(); let tgt = null, gone = [];
    const kick = canvas(host, (c, w, h, dt, now) => {
      if (!tgt) return false;
      const narrow = w < 520, secW = mini ? 0 : narrow ? 48 : Math.max(64, Math.min(110, w * .13));
      const padL = mini ? 12 : 36, padT = mini ? 30 : 34, padR = mini ? 12 : secW + (narrow ? 22 : 34), padB = mini ? 12 : 52;
      const pw = w - padL - padR, ph = h - padT - padB;
      // drawing scale steps by quarter-octaves, so a longer floor grows on the sheet until the scale changes
      const fit = Math.min(pw / tgt.L, ph / tgt.W);
      T.s = Math.pow(2, Math.floor(Math.log2(fit) * 4) / 4);
      let busy = glide(S, T, dt, 170);
      const s = S.s, L = S.L, W = S.W, x0 = padL + (pw - L * s) / 2, y0 = padT + (ph - W * s) / 2;
      // floor and racking
      c.fillStyle = C.ground; c.fillRect(x0, y0, L * s, W * s);
      c.save(); c.beginPath(); c.rect(x0, y0, L * s, W * s); c.clip();
      c.fillStyle = C.ink; c.strokeStyle = C.ink; c.lineWidth = 1;
      [['mixed', 14, .55], ['dense', 4.6, .92]].forEach(([k, pitch, len]) => {
        const a = S[k]; if (a < .01) return;
        const n = Math.floor(L / pitch);
        for (let i = 1; i < n; i++) {
          const rx = x0 + i * pitch * s, rw = Math.max(1, 1.6 * s), rh = W * s * len;
          c.globalAlpha = .07 * a; c.fillRect(rx - rw / 2, y0 + (W * s - rh) / 2, rw, rh);
          c.globalAlpha = .22 * a; c.strokeRect(px(rx - rw / 2), px(y0 + (W * s - rh) / 2), Math.round(rw), Math.round(rh));
        }
      });
      c.restore(); c.globalAlpha = 1;
      // anchors: each glides to its grid corner; new ones land, old ones lift away
      let moving = false;
      c.strokeStyle = C.loc; c.lineWidth = 1;
      const pos = (a) => [x0 + a.x * s, y0 + a.y * s];
      // coverage lines: the planning grid through the anchors
      c.globalAlpha = .32;
      for (let i = 0; i <= tgt.nx; i++) { const a = A.get(i + ',0'); if (a) { const [x] = pos(a); line(c, px(x), y0, px(x), y0 + W * s); } }
      for (let j = 0; j <= tgt.ny; j++) { const a = A.get('0,' + j); if (a) { const [, y] = pos(a); line(c, x0, px(y), x0 + L * s, px(y)); } }
      c.globalAlpha = 1;
      c.strokeStyle = C.ink; c.lineWidth = 1.25; c.strokeRect(px(x0), px(y0), Math.round(L * s), Math.round(W * s));
      const sp = Math.min(L / tgt.nx, W / tgt.ny) * s, r = mini ? Math.max(1.4, Math.min(2.6, sp * .12)) : Math.max(1.6, Math.min(4, sp * .12));
      const glyph = (x, y, k) => { c.fillStyle = C.ink; c.fillRect(x - r, y - r, r * 2, r * 2); if (!mini && r > 3) { c.fillStyle = C.paper; c.fillRect(x - .9, y - .9, 1.8, 1.8); } };
      for (const a of A.values()) {
        if (glide(a, { x: a.tx, y: a.ty }, dt, 170)) moving = true;
        const age = RM.matches ? 1 : (now - a.born) / 380; if (age < 1) moving = true;
        const k = outQ(age), [x, y] = pos(a);
        c.globalAlpha = Math.min(1, age * 2.2); glyph(x, y - (1 - k) * 14);
      }
      gone = gone.filter((a) => { const age = (now - a.died) / 260; if (age >= 1 || RM.matches) return false; const [x, y] = pos(a); c.globalAlpha = 1 - age; glyph(x, y - age * 8); moving = true; return true; });
      c.globalAlpha = 1;
      if (!mini) {
        // overall dimensions and one grid pitch
        dim(c, x0, y0 + W * s + 18, x0 + L * s, y0 + W * s + 18, `${fmt(tgt.L)} m`);
        dim(c, x0 - 18, y0, x0 - 18, y0 + W * s, `${fmt(tgt.W)} m`, true);
        const a0 = A.get('0,0'), a1 = A.get('1,0');
        if (a0 && a1) { const [xa] = pos(a0), [xb] = pos(a1); if (xb - xa > 34) { c.fillStyle = C.loc; c.font = FONT(11); c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillText(`${Math.round(tgt.g)} m`, (xa + xb) / 2, y0 - 5); } }
        // scale bar
        const m = nice((narrow ? 50 : 70) / s), bl = m * s, by = h - 10;
        c.fillStyle = C.ink; c.fillRect(padL, by - 3, bl / 2, 3); c.strokeStyle = C.ink; c.lineWidth = 1; c.strokeRect(px(padL), px(by - 3), Math.round(bl), 3);
        label(c, '0', padL, by - 7, { size: 11, align: 'center' }); label(c, `${m} m`, padL + bl, by - 7, { size: 11, align: 'center' });
        // legend
        const lx = padL + bl + (narrow ? 26 : 40), lr = Math.min(r, 3); c.fillStyle = C.ink; c.fillRect(lx - lr, by - 2.5 - lr, lr * 2, lr * 2); c.font = FONT(11); const t1 = narrow ? 'anchor' : 'AmIMo anchor'; label(c, t1, lx + 9, by + 1, { size: 11 });
        const gx = lx + 9 + c.measureText(t1).width + 16; c.strokeStyle = C.loc; c.globalAlpha = .6; line(c, gx, by - 2.5, gx + 16, by - 2.5); c.globalAlpha = 1; label(c, narrow ? 'grid' : 'planning grid', gx + 22, by + 1, { size: 11 });
        // section through the hall: floor to ceiling, 0 to 20 m, with the 3 to 8 m mounting band
        const sx = w - secW - 6, sb = padT + ph, sh = ph, mh = (v) => sb - (v / 20) * sh;
        label(c, 'SECTION', sx, padT - 14, { size: 10, alpha: .8 });
        c.fillStyle = C.ground; c.fillRect(sx, mh(S.H), secW, sb - mh(S.H));
        c.fillStyle = C.loc; c.globalAlpha = .08; c.fillRect(sx, mh(8), secW, mh(3) - mh(8)); c.globalAlpha = 1;
        c.strokeStyle = C.loc; c.globalAlpha = .45; c.lineWidth = 1; line(c, sx, px(mh(8)), sx + secW, px(mh(8))); line(c, sx, px(mh(3)), sx + secW, px(mh(3))); c.globalAlpha = 1;
        label(c, '3–8 m', sx + secW - 2, mh(8) + 13, { size: 11, align: 'right', color: C.loc });
        c.strokeStyle = C.ink; c.lineWidth = 1.25; line(c, sx, px(sb), sx + secW, px(sb)); line(c, sx, px(mh(S.H)), sx + secW, px(mh(S.H)));
        c.lineWidth = 1; c.globalAlpha = .5; line(c, px(sx + 6), mh(S.H), px(sx + 6), sb); c.globalAlpha = 1;
        const ay = mh(Math.max(3, Math.min(8, S.H - 1))); c.fillStyle = C.ink; c.fillRect(sx + 6, ay - 3, 6, 6);
        label(c, `${fmt(tgt.H)} m`, sx + secW - 2, mh(S.H) - 6, { size: 12, align: 'right', color: C.ink });
        label(c, 'PLAN', padL - 18, padT - 14, { size: 10, alpha: .8 });
      } else {
        label(c, `${fmt(tgt.L)} × ${fmt(tgt.W)} m`, 12, 18, { size: 12, color: C.soft });
        label(c, `${tgt.lo}–${tgt.hi} anchors`, w - 12, 18, { size: 12, align: 'right', color: C.ink });
      }
      return busy || moving;
    });
    return (L, W, H, env, dm) => {
      const r = anchorsOf(L, W, H, env, dm); tgt = { L, W, H, ...r };
      Object.assign(T, { L, W, H, open: +(env === 'open'), mixed: +(env === 'mixed'), dense: +(env === 'dense') });
      const now = performance.now(), keep = new Set();
      for (let i = 0; i <= r.nx; i++) for (let j = 0; j <= r.ny; j++) {
        const k = i + ',' + j, tx = i * L / r.nx, ty = j * W / r.ny; keep.add(k);
        const a = A.get(k); if (a) { a.tx = tx; a.ty = ty; } else A.set(k, { x: tx, y: ty, tx, ty, born: now + (RM.matches ? -1e4 : (i + j) * 9) });
      }
      for (const [k, a] of A) if (!keep.has(k)) { A.delete(k); a.died = now; gone.push(a); }
      kick(); return r;
    };
  }

  const anch = $('[data-tool="anchors"]');
  if (anch) {
    const plan = anchorPlan($('[data-draw="anchors"]'));
    const range = counter($('[data-out="range"]'), ([lo, hi]) => `${lo}–${hi}<small>anchors</small>`);
    live(anch, () => {
      const L = num(val(anch, 'flen'), 1), W = num(val(anch, 'fwid'), 1), H = num(val(anch, 'height'), 3);
      const env = (radio(anch, 'env') || {}).value || 'mixed';
      const dm = (radio(anch, 'dim') || {}).value || '3d';
      const { g, min, lo, hi } = plan(L, W, H, env, dm);
      range(lo, hi);
      $('[data-out="area"]').textContent = fmt(L * W) + ' m²';
      $('[data-out="grid"]').textContent = `about ${Math.round(g)} m`;
      $('[data-out="min"]').textContent = `${min} anchors`;
      $('[data-out="env"]').textContent = { open: 'Open hall', mixed: 'Some racking', dense: 'Dense high racking' }[env];
    });
  }

  // ------------------------------------------------------------ what searching costs
  // the year as a pile: twelve bars, each the hours searched by the end of that month, built of week-sized blocks
  const MONTHS = 'JFMAMJJASOND';
  function hourPile(host, mini) {
    const S = { top: 1 }, T = { top: 1 }; let tgt = null;
    for (let m = 0; m < 12; m++) S['b' + m] = 0;
    const kick = canvas(host, (c, w, h, dt) => {
      if (!tgt) return false;
      let busy = glide(S, { top: T.top }, dt, 200);
      for (let m = 0; m < 12; m++) if (glide(S, { ['b' + m]: tgt.year * (m + 1) / 12 }, dt, 110 + m * 26)) busy = true;
      c.font = FONT(11); const padL = mini ? 12 : c.measureText(fmt(S.top) + ' h').width + 16, padR = mini ? 12 : 8, padT = mini ? 30 : 38, padB = mini ? 12 : 28;
      const pw = w - padL - padR, ph = h - padT - padB, base = padT + ph, ys = (v) => base - v / S.top * ph;
      if (!mini) {
        // value axis: hairline rules at nice steps
        const step = nice(S.top / 4);
        for (let v = 0; v <= S.top * 1.001; v += step) {
          c.strokeStyle = C.ink; c.globalAlpha = v ? .08 : .9; c.lineWidth = 1; line(c, padL, px(ys(v)), w - padR, px(ys(v))); c.globalAlpha = 1;
          label(c, fmt(v) + (v ? ' h' : ''), padL - 8, ys(v) + 4, { size: 11, align: 'right' });
        }
      }
      const gap = Math.max(3, pw / 12 * .22), bw = (pw - gap * 11) / 12;
      // block size: a working week if a week is at least 4 px tall, else a month
      const week = tgt.year / 52, unit = week / S.top * ph >= 4 ? week : tgt.year / 12;
      for (let m = 0; m < 12; m++) {
        const v = S['b' + m], x = padL + m * (bw + gap), y = ys(v), last = m === 11;
        c.fillStyle = last ? C.ink : C.pressed; c.fillRect(x, y, bw, base - y);
        c.strokeStyle = C.ink; c.lineWidth = 1; c.globalAlpha = last ? 1 : .55; c.strokeRect(px(x), px(y), Math.round(bw), Math.round(base - y)); c.globalAlpha = 1;
        // the blocks
        const n = Math.floor(v / unit), bh = unit / S.top * ph;
        if (bh >= 3) { c.strokeStyle = last ? C.paper : C.ink; c.globalAlpha = last ? .35 : .18; for (let k = 1; k <= n && k < 400; k++) { const yy = px(base - k * bh); if (yy > y + 1) line(c, x + 1, yy, x + bw - 1, yy); } c.globalAlpha = 1; }
        if (!mini) label(c, MONTHS[m], x + bw / 2, base + 17, { size: 11, align: 'center' });
      }
      if (!mini) {
        const xl = padL + 11 * (bw + gap) + bw;
        label(c, `${fmt(tgt.year)} h a year`, xl, ys(S.b11) - 9, { size: 13, align: 'right', color: C.ink });
        // the legend never clips: on a narrow sheet it starts at the sheet's edge and steps its type down to fit
        const key = unit === week ? `one block = one week of searching, ${fmt1(week)} h` : `one block = one month of searching, ${fmt1(unit)} h`;
        let ks = 11; c.font = FONT(ks); const kx = padL + 22 + c.measureText(key).width > w - padR ? 0 : padL;
        while (ks > 8 && kx + 22 + (c.font = FONT(ks), c.measureText(key).width) > w - padR) ks -= .5;
        c.fillStyle = C.pressed; c.fillRect(kx, padT - 27, 14, 9); c.strokeStyle = C.ink; c.globalAlpha = .55; c.strokeRect(px(kx), px(padT - 27), 14, 9); c.globalAlpha = 1;
        label(c, key, kx + 22, padT - 18, { size: ks });
      } else {
        label(c, 'hours searched, Jan to Dec', 12, 18, { size: 12 });
        label(c, `${fmt(tgt.year)} h a year`, w - 12, 18, { size: 12, align: 'right', color: C.ink });
      }
      return busy;
    });
    return (year) => { tgt = { year }; T.top = nice(Math.max(year, 1) * 1.08); kick(); };
  }

  const srch = $('[data-tool="search"]');
  if (srch) {
    const pile = hourPile($('[data-draw="search"]'));
    const big = counter($('[data-out="hours"]'), ([h]) => `${fmt(h)}<small>hours a year</small>`);
    live(srch, () => {
      const people = num(val(srch, 'people')), per = num(val(srch, 'per')), mins = num(val(srch, 'mins'));
      const shifts = num(val(srch, 'shifts')), days = num(val(srch, 'days')), rate = num(val(srch, 'rate'));
      const hours = (people * per * mins * shifts * days) / 60;
      big(hours); pile(hours);
      $('[data-out="day"]').textContent = ((people * per * mins * shifts) / 60).toFixed(1) + ' h';
      $('[data-out="week"]').textContent = (hours / 52).toFixed(1) + ' h';
      $('[data-out="fte"]').textContent = (hours / (8 * Math.max(days, 1))).toFixed(1) + ' people';
      $('[data-out="cost"]').textContent = rate ? '₹' + fmt(hours * rate) : 'Add an hourly cost';
    });
  }

  // ------------------------------------------------------------ pilot brief
  // the brief as a printed sheet: each answer is typed into its field, and the list fills line by line
  function typer(el, text) {
    clearInterval(el._t); el.classList.add('typing');
    if (RM.matches || !text) { el.textContent = text; el.classList.remove('typing'); return; }
    let n = 0; el.textContent = '';
    el._t = setInterval(() => { n += 2; el.textContent = text.slice(0, n); if (n >= text.length) { clearInterval(el._t); el.classList.remove('typing'); } }, 16);
  }
  const pilot = $('[data-tool="pilot"]');
  if (pilot) {
    const sheet = $('[data-bsheet]', pilot.parentNode);
    const FIELDS = [['q', 'What we need to understand'], ['area', 'Where we begin'], ['link', 'How work is linked to trolleys today']];
    sheet.innerHTML = '<div class="bsheet-head"><b>AmIMotion pilot brief</b><span>1 / 1</span></div>'
      + FIELDS.map(([k, l], i) => `<div class="bsheet-row"><span class="bsheet-n">${i + 1}</span><span class="bsheet-l">${l}</span><span class="bsheet-v" data-f="${k}"></span></div>`).join('')
      + '<p class="bsheet-h">To settle before hardware arrives:</p><ol class="bsheet-list" data-list></ol>'
      + '<p class="bsheet-foot">Made in the browser on amimotion.com. Not a quote or a feasibility result.</p>';
    const shown = {};
    const make = () => {
      const q = radio(pilot, 'q'), a = radio(pilot, 'area'), l = radio(pilot, 'link');
      const t = (r) => (r ? r.dataset.label : '—');
      const settle = [];
      if (l && l.value === 'none') settle.push('How a job is linked to its trolley, in AmIHub or from your own system.');
      if (a && a.value === 'unsure') settle.push('Which bay or line to start with, chosen on a short floor walk.');
      settle.push('The zones that matter, named in your own words.', 'Who on your team acts when work waits too long.', 'How to count a wait that runs past shift end.', 'A baseline: searches per shift and minutes per search, measured before tags go on.');
      const brief = `AmIMotion pilot brief\n\nWhat we need to understand: ${t(q)}\nWhere we begin: ${t(a)}\nHow work is linked to trolleys today: ${t(l)}\n\nTo settle before hardware arrives:\n` + settle.map((s) => '• ' + s).join('\n') +
        '\n\nMade in the browser on amimotion.com. Not a quote or a feasibility result.';
      $('[data-out="brief"]').textContent = brief;
      const mail = $('[data-out="mail"]');
      if (mail) mail.href = 'mailto:sales@amimotion.com?subject=' + encodeURIComponent('Pilot brief') + '&body=' + encodeURIComponent(brief);
      // the sheet: retype only what changed
      [['q', t(q)], ['area', t(a)], ['link', t(l)]].forEach(([k, v]) => { if (shown[k] !== v) { shown[k] = v; typer($(`[data-f="${k}"]`, sheet), v); } });
      const list = $('[data-list]', sheet), have = [...list.children].map((li) => li.dataset.s);
      if (have.join('|') !== settle.join('|')) {
        [...list.children].forEach((li) => { if (!settle.includes(li.dataset.s)) li.remove(); });
        settle.forEach((s, i) => {
          let li = [...list.children].find((x) => x.dataset.s === s);
          if (!li) { li = d.createElement('li'); li.dataset.s = s; li.className = 'new'; const sp = d.createElement('span'); li.append(sp); setTimeout(() => typer(sp, s), RM.matches ? 0 : 140 + i * 60); }
          if (list.children[i] !== li) list.insertBefore(li, list.children[i] || null);
        });
      }
      return brief;
    };
    live(pilot, make);
    $('[data-copy]', pilot.parentNode)?.addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(make()); e.target.textContent = 'Copied'; buzz(); } catch (_) {} });
    $('[data-download]', pilot.parentNode)?.addEventListener('click', () => {
      const a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([make()], { type: 'text/plain' })); a.download = 'AmIMotion-pilot-brief.txt'; a.click(); buzz();
    });
  }

  // ------------------------------------------------------------ hub miniatures
  // each tool card plays its own drawing with a few sample inputs while it is on screen; still with reduced motion
  // the diagnostic's sketch: the same seven zones; the waiting one fills amber, tagged things land, a pilot area is drawn
  const DIAGZ = [[4, 8, 22, 30, 'DOCK'], [30, 8, 34, 30, 'MACHINING'], [68, 8, 16, 30, 'QUEUE'], [88, 8, 8, 76, 'ASSEMBLY'], [4, 46, 22, 38, 'STAGING'], [30, 46, 16, 38, 'REWORK'], [50, 46, 34, 38, 'INSPECTION']];
  const DIAGS = [[2, 3], [6, 5], [0, 4], [5, 6]];
  function diagMini(host) {
    let hot = 2, t0 = performance.now(), dots = [];
    const kick = canvas(host, (c, w, h, dt, now) => {
      const ox = 12, oy = 30, sx = (w - 24) / 100, sy = (h - 42) / 87, age = RM.matches ? 9 : (now - t0) / 420;
      c.strokeStyle = C.ink; c.lineWidth = 1; c.globalAlpha = .9; c.strokeRect(px(ox), px(oy), Math.round(100 * sx), Math.round(87 * sy)); c.globalAlpha = 1;
      DIAGZ.forEach(([x, y, zw, zh, n], i) => {
        const X = ox + x * sx, Y = oy + y * sy, ZW = zw * sx, ZH = zh * sy;
        if (i === hot) { c.fillStyle = C.wait; c.globalAlpha = outQ(age); c.fillRect(X, Y, ZW, ZH); c.globalAlpha = 1; }
        c.globalAlpha = .4; c.strokeRect(px(X), px(Y), Math.round(ZW), Math.round(ZH)); c.globalAlpha = 1;
        if (ZW > 54) label(c, n, X + 6, Y + 13, { size: 9, color: i === hot ? C.ink : C.soft });
      });
      dots.forEach(([x, y], i) => { const k = outQ(RM.matches ? 1 : (now - t0 - 200 - i * 70) / 320); c.globalAlpha = Math.max(0, k); c.fillStyle = C.loc; c.fillRect(ox + x * sx - 5, oy + y * sy - 3 - (1 - k) * 8, 10, 6); });
      const [x, y, zw, zh] = DIAGZ[hot], k = outQ(age - .8);
      if (k > 0) { c.globalAlpha = k; c.strokeStyle = C.act; c.setLineDash([5, 3]); c.lineWidth = 1.25; c.strokeRect(ox + x * sx - 4, oy + y * sy - 4, zw * sx + 8, zh * sy + 8); c.setLineDash([]); c.globalAlpha = 1; }
      label(c, 'your floor, as you answer', 12, 18, { size: 12 });
      label(c, `waits: ${DIAGZ[hot][4].toLowerCase()}`, w - 12, 18, { size: 12, align: 'right', color: C.ink });
      return age < 2.4;
    });
    return (n) => { const [hz, nd] = DIAGS[n % 4]; hot = hz; t0 = RM.matches ? -1e4 : performance.now(); dots = [[12, 22], [42, 26], [56, 18], [76, 26], [60, 64], [36, 70]].slice(0, nd); kick(); };
  }
  // the brief sheet, typing its three answers
  const PILOTS = [['Find tagged trolleys', 'One production bay', 'Manual or scanned'], ['See where work waits', 'One line-side flow', 'Not defined yet'], ['Link trolleys to jobs', 'One tools or fixtures area', 'A record in our MES or ERP']];
  function pilotMini(host) {
    let t0 = 0, n = 0;
    const kick = canvas(host, (c, w, h, dt, now) => {
      const x = 12, y = 30, sw = w - 24, sh = h - 42, p = RM.matches ? 999 : (now - t0) / 28;
      c.fillStyle = C.ground; c.fillRect(x, y, sw, sh);
      c.fillStyle = C.ink; c.fillRect(x + 12, y + 30, sw - 24, 1.5);
      label(c, 'AmIMotion pilot brief', x + 12, y + 22, { size: 13, w: 500, color: C.ink });
      let used = 0;
      ['What we need to understand', 'Where we begin', 'How work is linked to trolleys today'].forEach((l, i) => {
        const yy = y + 52 + i * ((sh - 60) / 3);
        if (yy + 18 > y + sh) return;
        label(c, l, x + 12, yy, { size: 10 });
        const v = PILOTS[n % 3][i], shown = Math.max(0, Math.min(v.length, Math.floor(p - used))); used += v.length + 6;
        label(c, v.slice(0, shown), x + 12, yy + 16, { size: 13, color: C.ink });
        if (shown < v.length && shown > 0) { c.font = FONT(13); c.fillStyle = C.ink; c.fillRect(x + 13 + c.measureText(v.slice(0, shown)).width, yy + 14, 6, 1.5); }
        c.globalAlpha = .12; c.fillStyle = C.ink; c.fillRect(x + 12, yy + 24, sw - 24, 1); c.globalAlpha = 1;
      });
      label(c, 'written in your browser', 12, 18, { size: 12 });
      label(c, 'one page', w - 12, 18, { size: 12, align: 'right', color: C.ink });
      return p < used;
    });
    return (k) => { n = k; t0 = performance.now(); kick(); };
  }
  const SAMPLES = {
    anchors: [[60, 40, 6, 'open'], [100, 50, 9, 'mixed'], [160, 80, 9, 'mixed'], [220, 120, 12, 'dense']],
    search: [12 * 4 * 8 * 2 * 300 / 60, 20 * 4 * 8 * 2 * 300 / 60, 30 * 6 * 10 * 3 * 300 / 60, 8 * 3 * 6 * 2 * 300 / 60],
  };
  const minis = [...d.querySelectorAll('[data-mini]')].filter((el) => el.dataset.mini);
  if (minis.length) {
    const players = minis.map((el) => {
      const k = el.dataset.mini;
      if (k === 'anchors') { const f = anchorPlan(el, true); return (n) => { const [L, W, H, env] = SAMPLES.anchors[n % 4]; f(L, W, H, env, '3d'); }; }
      if (k === 'search') { const f = hourPile(el, true); return (n) => f(SAMPLES.search[n % 4]); }
      if (k === 'pilot') return pilotMini(el);
      return diagMini(el);
    });
    const seen = new Set(); let n = 0;
    players.forEach((p) => p(0));
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))));
    minis.forEach((el) => io.observe(el));
    if (!RM.matches) setInterval(() => { if (d.hidden) return; n++; players.forEach((p, i) => { if (seen.has(minis[i])) p(n); }); }, 2600);
    // touching a card plays its next state at once
    minis.forEach((el, i) => el.closest('li').addEventListener('pointerenter', () => players[i](++n)));
  }

  // Contact: build an email draft in the visitor's own mail app
  const c = $('[data-contact]');
  if (c) c.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!c.reportValidity()) return;
    const body = `Name: ${val(c, 'name')}\nCompany: ${val(c, 'company')}\nRole: ${val(c, 'role')}\nEmail: ${val(c, 'email')}\n\nWhere our team walks to check:\n${val(c, 'flow')}`;
    const href = 'mailto:sales@amimotion.com?subject=' + encodeURIComponent('Book a call: ' + (val(c, 'company') || 'AmIMotion')) + '&body=' + encodeURIComponent(body);
    const box = $('[data-draft]'); box.hidden = false; $('[data-draft-text]').textContent = body; $('[data-draft-mail]').href = href;
    buzz(); location.href = href;
  });
  $('[data-draft-copy]')?.addEventListener('click', async (e) => { try { await navigator.clipboard.writeText($('[data-draft-text]').textContent); e.target.textContent = 'Copied'; } catch (_) {} });
})();
