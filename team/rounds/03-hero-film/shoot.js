// Shoot hero-film.html at the three review sizes, check the film plays in view, and record LCP.
// node shoot.js   (Playwright, chromium, DPR 1, phone UA at 390)
const { chromium } = require('playwright');
const path = require('path');
const page_url = 'file://' + path.resolve(__dirname, 'hero-film.html');
const sizes = [[1440, 900], [390, 844], [2560, 1440]];
(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const [w, h] of sizes) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1,
      userAgent: w < 600 ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' : undefined });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      window.__lcp = [];
      new PerformanceObserver(l => l.getEntries().forEach(e => window.__lcp.push({ t: e.startTime, el: e.element ? e.element.tagName + (e.element.id ? '#' + e.element.id : '') : '?', size: e.size })))
        .observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await p.goto(page_url);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(__dirname, 'shots', `hero-film-${w}x${h}.png`) });
    await p.waitForTimeout(3200);
    const st = await p.evaluate(() => {
      const v = document.querySelector('video'), f = document.querySelector('.film'), r = f.querySelector('.frame').getBoundingClientRect();
      const h1 = document.querySelector('h1').getBoundingClientRect(), lede = document.querySelector('.lede').getBoundingClientRect();
      return { playing: f.classList.contains('is-playing'), t: v.currentTime, src: v.currentSrc.split('/').pop(), paused: v.paused,
        frame: [r.x, r.y, r.width, r.height].map(Math.round), h1: [h1.x, h1.y, h1.width, h1.height].map(Math.round),
        lede_bottom: Math.round(lede.bottom), scrollW: document.documentElement.scrollWidth, lcp: window.__lcp,
        poster: document.querySelector('.frame img').currentSrc.split('/').pop() };
    });
    await p.screenshot({ path: path.join(__dirname, 'shots', `hero-film-${w}x${h}-playing.png`) });
    out[`${w}x${h}`] = st;
    await ctx.close();
  }
  // reduced motion and JS off keep the poster
  for (const [name, opts] of [['reduced', { reducedMotion: 'reduce' }], ['nojs', { javaScriptEnabled: false }]]) {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 1440, height: 900 } }, opts));
    const p = await ctx.newPage(); await p.goto(page_url); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(__dirname, 'shots', `hero-film-1440x900-${name}.png`) });
    out[name] = name === 'nojs' ? 'shot only' : await p.evaluate(() => ({ playing: document.querySelector('.film').classList.contains('is-playing'), src: document.querySelector('video').currentSrc }));
    await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
