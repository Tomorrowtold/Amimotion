// First-screen weight, LCP element and JS-off check for a hero page served over http.
// node weight.js <url> : prints bytes per resource at 390x844 (DPR 3), 1440x900 (DPR 2), 2560x1440 (DPR 2), 3840x2160 (DPR 2)
const { chromium } = require('playwright');
const url = process.argv[2];
(async () => {
  const b = await chromium.launch();
  for (const [w, h, dpr, js] of [[390, 844, 3, true], [390, 844, 2, true], [1440, 900, 1, true], [1440, 900, 2, true], [2560, 1440, 2, true], [3840, 2160, 2, true], [1440, 900, 2, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, javaScriptEnabled: js });
    const p = await ctx.newPage();
    const res = [];
    p.on('requestfinished', async r => { try { const s = await r.sizes(); res.push([r.url().split('/').pop(), s.responseBodySize]); } catch (e) {} });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const lcp = js ? await p.evaluate(() => new Promise(r => new PerformanceObserver(l => { const e = l.getEntries().pop(); r(e ? (e.element ? e.element.tagName + (e.element.currentSrc ? ' ' + e.element.currentSrc.split('/').pop() : '') : e.url) : ''); }).observe({ type: 'largest-contentful-paint', buffered: true }))) : 'js off';
    const vis = await p.evaluate(() => { const h = document.querySelector('h1').getBoundingClientRect(); const i = document.querySelector('.picture img'); const r = i.getBoundingClientRect(); return { h1top: Math.round(h.top), h1bottom: Math.round(h.bottom), img: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], src: i.currentSrc.split('/').pop(), hscroll: document.documentElement.scrollWidth > innerWidth }; });
    const tot = res.reduce((a, x) => a + x[1], 0);
    console.log(`${w}x${h}@${dpr}${js ? '' : ' JS off'}: ${(tot / 1024).toFixed(1)} KB  LCP=${lcp}  ${JSON.stringify(vis)}  ${res.map(x => x[0] + ':' + (x[1] / 1024).toFixed(1)).join(' ')}`);
    await ctx.close();
  }
  await b.close();
})();
