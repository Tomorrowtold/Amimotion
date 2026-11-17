// measure.js: what visitors do, as plain events, with no cookies and nothing sent anywhere until config names a tool.
// Events go to window.dataLayer (any analytics tool reads it). config.js 'analytics' picks a destination:
//   ''            nothing leaves the browser (the default until AmIMotion chooses a tool and its privacy notice says so)
//   'plausible'   cookieless page views and events to plausible.io (add https://plausible.io to the CSP connect-src and script-src)
//   'ga4:G-XXXX'  Google Analytics 4 with consent mode: nothing is stored until the visitor agrees (needs a consent banner)
(() => {
  const w = window, d = document, dl = (w.dataLayer = w.dataLayer || []);
  const ev = (name, p = {}) => { dl.push({ event: name, path: location.pathname, ...p }); if (w.plausible) w.plausible(name, { props: p }); };
  w.amiEvent = ev;
  // the steps that matter on a B2B site: plan a bay, book a call, ask, read a guide, open a datasheet
  const kind = (a) => {
    const h = a.getAttribute('href') || '';
    if (a.dataset.ev) return a.dataset.ev;
    if (/\/diagnostic\//.test(h)) return 'cta_plan_bay';
    if (/\/contact\//.test(h)) return 'cta_book_call';
    if (/\/pilot\//.test(h)) return 'nav_pilot';
    if (/^mailto:/.test(h)) return 'email_click';
    if (/\.pdf($|\?)/.test(h)) return 'file_open';
    return '';
  };
  d.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (!a) return; const k = kind(a); if (k) ev(k, { to: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 60) }); }, { capture: true, passive: true });
  d.addEventListener('amimotion:lead', (e) => ev('lead_sent', { how: e.detail && e.detail.how, source: e.detail && e.detail.source }));
  d.addEventListener('submit', (e) => { const f = e.target; if (f.matches && f.matches('[data-ask], .nask-form')) ev('ask_used'); else if (f.matches && f.matches('[data-contact], .book-form')) ev('form_submit', { form: f.className.split(' ')[0] }); }, { capture: true, passive: true });
  // how far people read: 25, 50, 75 and 100 per cent of the page, once each
  const seen = new Set();
  addEventListener('scroll', () => { const h = d.documentElement, p = Math.round(100 * (scrollY + innerHeight) / h.scrollHeight); for (const m of [25, 50, 75, 100]) if (p >= m && !seen.has(m)) { seen.add(m); ev('scroll_depth', { percent: m }); } }, { passive: true });
  // Core Web Vitals from real visitors (LCP, CLS, INP), so speed is measured on real phones, not only in the lab
  try {
    let cls = 0, inp = 0;
    new PerformanceObserver((l) => { const e = l.getEntries().pop(); if (e) w.__lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) inp = Math.max(inp, e.duration); }).observe({ type: 'event', durationThreshold: 40, buffered: true });
    addEventListener('visibilitychange', () => { if (d.visibilityState === 'hidden' && !w.__vitalsSent) { w.__vitalsSent = 1; ev('web_vitals', { lcp: w.__lcp || 0, cls: Math.round(cls * 1000) / 1000, inp: Math.round(inp) }); } });
  } catch (_) {}
  // destination, only when config.js names one
  const go = () => {
    const a = ((w.AMIMOTION_CONFIG || {}).analytics || '').trim();
    if (!a) return;
    const s = d.createElement('script'); s.defer = true;
    if (a === 'plausible') { s.src = 'https://plausible.io/js/script.tagged-events.js'; s.dataset.domain = location.hostname.replace(/^www\./, ''); w.plausible = w.plausible || function () { (w.plausible.q = w.plausible.q || []).push(arguments); }; }
    else if (a.startsWith('ga4:')) {
      const id = a.slice(4); w.gtag = function () { dl.push(arguments); };
      w.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
      w.gtag('js', new Date()); w.gtag('config', id); s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    } else return;
    d.head.appendChild(s);
  };
  if (d.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
})();
