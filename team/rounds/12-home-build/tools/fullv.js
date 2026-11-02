// node fullv.js url out w h variant(normal|nojs|reduced)
const { chromium } = require('playwright');
const [url, out, w, h, v = 'normal'] = process.argv.slice(2);
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, javaScriptEnabled: v !== 'nojs', reducedMotion: v === 'reduced' ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'load' });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += +h / 2) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(80); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
  console.log(v, w, 'height', H, 'scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth));
  await p.screenshot({ path: out, fullPage: true }); await b.close(); })();
