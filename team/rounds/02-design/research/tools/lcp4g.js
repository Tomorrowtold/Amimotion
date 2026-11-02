// LCP and CLS on a slow-4G lab profile (1.6 Mbps down, 750 kbps up, 150 ms RTT, CPU 4x slower), served over local http.
const { chromium } = require('playwright');
const url = process.argv[2];
(async () => {
  const b = await chromium.launch();
  for (const [w, h, dpr] of [[390, 844, 3], [1440, 900, 2]]) {
    const out = [];
    for (let run = 0; run < 3; run++) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
      const p = await ctx.newPage(); const c = await ctx.newCDPSession(p);
      await c.send('Network.enable'); await c.send('Network.setCacheDisabled', { cacheDisabled: true });
      await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
      await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
      await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1500);
      const r = await p.evaluate(() => new Promise(res => new PerformanceObserver(l => { const e = l.getEntries().pop(); res({ lcp: Math.round(e.startTime), el: e.element ? e.element.tagName : '', cls: window.__cls }); }).observe({ type: 'largest-contentful-paint', buffered: true })));
      out.push(r); await ctx.close();
    }
    console.log(`${w}x${h}@${dpr}`, JSON.stringify(out));
  }
  await b.close();
})();
