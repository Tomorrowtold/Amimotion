// The three planning tools and the contact draft. Everything runs in the browser; nothing is sent or stored.
(() => {
  const d = document;
  const $ = (s, el = d) => el.querySelector(s);
  const num = (v, min = 0) => Math.max(min, Number(v) || 0);
  const fmt = (n) => Math.round(n).toLocaleString('en-IN');
  const val = (form, name) => (form.elements[name] && (form.elements[name].value ?? '')) || '';
  const radio = (form, name) => { const r = form.querySelector(`input[name="${name}"]:checked`); return r ? r : null; };
  const buzz = () => { try { if (navigator.vibrate && !matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate(5); } catch (_) {} };
  const live = (form, fn) => { form.addEventListener('input', fn); form.addEventListener('change', (e) => { if (e.target.type === 'radio') buzz(); fn(); }); form.addEventListener('submit', (e) => { e.preventDefault(); fn(); }); fn(); };
  d.querySelectorAll('input[type="range"]').forEach((r) => {
    const o = d.querySelector(`output[for="${r.id}"]`);
    const show = () => { if (o) o.textContent = Number(r.value).toLocaleString('en-IN') + (r.dataset.unit || ''); };
    r.addEventListener('input', show); show();
  });

  // Anchor estimator. Planning grids are this site's first-budget assumptions, not an AmIMotion specification.
  const GRID = { open: 25, mixed: 18, dense: 12 };
  const anch = $('[data-tool="anchors"]');
  if (anch) live(anch, () => {
    const L = num(val(anch, 'flen'), 1), W = num(val(anch, 'fwid'), 1), H = num(val(anch, 'height'), 3);
    const env = (radio(anch, 'env') || {}).value || 'mixed';
    const dim = (radio(anch, 'dim') || {}).value || '3d';
    let g = GRID[env];
    if (H > 10) g *= 0.9;                       // tall halls lose some geometry at floor level
    const cells = (Math.ceil(L / g) + 1) * (Math.ceil(W / g) + 1);
    const min = dim === '3d' ? 4 : 3;
    const mid = Math.max(min, Math.round(cells));
    const lo = Math.max(min, Math.round(mid * 0.8)), hi = Math.max(min + 1, Math.round(mid * 1.25));
    $('[data-out="range"]').innerHTML = `${lo}–${hi}<small>anchors</small>`;
    $('[data-out="area"]').textContent = fmt(L * W) + ' m²';
    $('[data-out="grid"]').textContent = `about ${Math.round(g)} m`;
    $('[data-out="min"]').textContent = `${min} anchors`;
    $('[data-out="env"]').textContent = { open: 'Open hall', mixed: 'Some racking', dense: 'Dense high racking' }[env];
  });

  // What searching costs: the user's own numbers, multiplied out. No savings are assumed.
  const srch = $('[data-tool="search"]');
  if (srch) live(srch, () => {
    const people = num(val(srch, 'people')), per = num(val(srch, 'per')), mins = num(val(srch, 'mins'));
    const shifts = num(val(srch, 'shifts')), days = num(val(srch, 'days')), rate = num(val(srch, 'rate'));
    const hours = (people * per * mins * shifts * days) / 60;
    $('[data-out="hours"]').innerHTML = `${fmt(hours)}<small>hours a year</small>`;
    $('[data-out="day"]').textContent = ((people * per * mins * shifts) / 60).toFixed(1) + ' h';
    $('[data-out="fte"]').textContent = (hours / (8 * Math.max(days, 1))).toFixed(1) + ' people';
    $('[data-out="cost"]').textContent = rate ? '₹' + fmt(hours * rate) : 'Add an hourly cost';
  });

  // Pilot brief
  const pilot = $('[data-tool="pilot"]');
  if (pilot) {
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
      return brief;
    };
    live(pilot, make);
    $('[data-copy]', pilot.parentNode)?.addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(make()); e.target.textContent = 'Copied'; buzz(); } catch (_) {} });
    $('[data-download]', pilot.parentNode)?.addEventListener('click', () => {
      const a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([make()], { type: 'text/plain' })); a.download = 'AmIMotion-pilot-brief.txt'; a.click(); buzz();
    });
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
