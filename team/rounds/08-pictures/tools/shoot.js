// Shoot pages of the built site (served at BASE) full page at 1440 and 390, check horizontal scroll, LCP on
// emulated slow 4G (150 ms RTT, 1.6 Mbps down, 4x CPU), and the homepage with JavaScript off.
// NODE_PATH=/opt/node-tools/node_modules node shoot.js http://127.0.0.1:8099 <outdir> / /platform/ ...
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const [base, out, ...pages] = process.argv.slice(2);
const name = p => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const PHONE = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const p of pages) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, userAgent: w < 600 ? PHONE : undefined });
    const pg = await ctx.newPage();
    // 1. LCP, slow 4G, cold cache
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 0.9, uploadThroughput: 750e3 / 8 * 0.9 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await pg.addInitScript(() => { window.__lcp = []; new PerformanceObserver(l => l.getEntries().forEach(e => window.__lcp.push({ t: Math.round(e.startTime), el: e.element ? e.element.tagName + (e.element.currentSrc ? ':' + e.element.currentSrc.split('/').pop() : '') : '?' }))).observe({ type: 'largest-contentful-paint', buffered: true }); });
    await pg.goto(base + p, { waitUntil: 'load', timeout: 120000 });
    await pg.waitForTimeout(800);
    const lcp = await pg.evaluate(() => window.__lcp.slice(-1)[0]);
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    // 2. full page: scroll every lazy picture into view first
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
    await pg.waitForTimeout(1500);
    const st = await pg.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, vw: innerWidth,
      broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src), slots: document.querySelectorAll('.slot').length,
      playing: !!document.querySelector('.is-playing') }));
    await pg.screenshot({ path: path.join(out, `${name(p)}-${w}.png`), fullPage: true });
    res[`${name(p)}-${w}`] = { lcp, ...st };
    await ctx.close();
  }
  // 3. homepage, JavaScript off and reduced motion
  for (const [k, opt] of [['nojs', { javaScriptEnabled: false }], ['reduced', { reducedMotion: 'reduce' }]]) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opt }); const pg = await ctx.newPage();
    await pg.goto(base + '/', { waitUntil: 'load' }); await pg.waitForTimeout(2500);
    await pg.screenshot({ path: path.join(out, `home-1440-${k}.png`) });
    res[`home-1440-${k}`] = await pg.evaluate(() => ({ poster: (document.querySelector('[data-hero-film] img') || {}).currentSrc, videoSrc: (document.querySelector('[data-hero-film] video') || {}).currentSrc || '' }));
    await ctx.close();
  }
  fs.writeFileSync(path.join(out, 'shoot-result.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
  await b.close();
})();
