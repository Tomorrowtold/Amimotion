const { chromium } = require('playwright');
const [url, w = 1440, h = 900] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h } });
  const p = await ctx.newPage(); const c = await ctx.newCDPSession(p);
  await c.send('Network.enable');
  await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const sizes = []; c.on('Network.loadingFinished', (e) => sizes.push(e.encodedDataLength));
  const urls = {}; c.on('Network.responseReceived', (e) => { urls[e.requestId] = e.response.url; });
  const byReq = []; c.on('Network.loadingFinished', (e) => byReq.push([urls[e.requestId], e.encodedDataLength]));
  await p.addInitScript(() => {
    window.__lcp = []; window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push([Math.round(e.startTime), e.element ? e.element.tagName + '.' + (e.element.id || e.element.className) : '?', e.size]))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
  console.log(JSON.stringify(r));
  console.log('bytes at load+2.5s', sizes.reduce((a, x) => a + x, 0));
  byReq.sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([u, s]) => console.log(s, u));
  await b.close();
})();
