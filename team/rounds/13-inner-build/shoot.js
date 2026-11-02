// Round 13 inner pages: shoot the built site at 1440 and 390 (full page), report sideways scroll, empty slots,
// broken pictures and LCP on emulated slow 4G (150 ms RTT, 1.6 Mbps, 4x CPU).
// node shoot.js http://127.0.0.1:8099 <outdir> [--lcp] [--w=1440,390] /products/ /technology/ ...
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const args = process.argv.slice(2);
const [base, out] = args; const opts = args.slice(2).filter(a => a.startsWith('--')); const pages = args.slice(2).filter(a => !a.startsWith('--'));
const LCP = opts.includes('--lcp'), NOJS = opts.includes('--nojs'), RM = opts.includes('--reduced');
const W = (opts.find(o => o.startsWith('--w=')) || '--w=1440,390').slice(4).split(',').map(Number);
const snap = async (pg, o) => { for (let i = 0; ; i++) { try { return await pg.screenshot(o); } catch (e) { if (i > 3) throw e; await pg.waitForTimeout(700); } } };
const name = p => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const p of pages) for (const w of W) {
    const h = w < 600 ? 844 : 900;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, javaScriptEnabled: !NOJS, reducedMotion: RM ? 'reduce' : 'no-preference' });
    const pg = await ctx.newPage(); let lcp = null;
    if (LCP) {
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 0.9, uploadThroughput: 750e3 / 8 * 0.9 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await pg.addInitScript(() => { window.__lcp = []; new PerformanceObserver(l => l.getEntries().forEach(e => window.__lcp.push({ t: Math.round(e.startTime), el: e.element ? e.element.tagName + (e.element.currentSrc ? ':' + e.element.currentSrc.split('/').pop() : '') : '?' }))).observe({ type: 'largest-contentful-paint', buffered: true }); });
      await pg.goto(base + p, { waitUntil: 'load', timeout: 120000 }); await pg.waitForTimeout(800);
      lcp = await pg.evaluate(() => window.__lcp.slice(-1)[0]);
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    } else await pg.goto(base + p, { waitUntil: 'load' });
    await pg.waitForTimeout(1200); await snap(pg, { path: path.join(out, `${name(p)}-${w}${NOJS ? '-nojs' : ''}${RM ? '-rm' : ''}-top.png`) });
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } scrollTo(0, 0); });
    await pg.waitForTimeout(900);
    const st = await pg.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, vw: innerWidth, H: document.body.scrollHeight,
      broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src), slots: document.querySelectorAll('.slot').length }));
    const tag = `${name(p)}-${w}${NOJS ? '-nojs' : ''}${RM ? '-rm' : ''}`, SEG = 7000;
    for (let y = 0, k = 0; y < st.H; y += SEG, k++)
      try { await snap(pg, { path: path.join(out, `${tag}-${k}.png`), fullPage: true, clip: { x: 0, y, width: w, height: Math.min(SEG, st.H - y) } }); }
      catch (e) { await pg.evaluate(y => scrollTo(0, y), y); await pg.waitForTimeout(300); await snap(pg, { path: path.join(out, `${tag}-${k}.png`) }); console.error('segment fallback', tag, k); }
    res[`${name(p)}-${w}`] = { lcp, ...st, hscroll: st.scrollW > st.vw };
    await ctx.close();
  }
  console.log(JSON.stringify(res));
  await b.close();
})();
