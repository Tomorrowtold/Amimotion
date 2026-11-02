// node at.js url w h out y1 y2 ...   (y may be a selector:offset like "#waits:0")
const { chromium } = require('playwright');
const [url, w, h, out, ...ys] = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(300);
  let k = 0;
  for (const y of ys) {
    const top = await p.evaluate((y) => { if (/^[\d.]+$/.test(y)) return +y; const [s, o] = y.split('@'); const e = document.querySelector(s); const r = e.getBoundingClientRect(); return r.top + scrollY + (o.endsWith('%') ? parseFloat(o) / 100 * (r.height - innerHeight) : +o); }, y);
    await p.evaluate((t) => scrollTo(0, t), top); await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}-${k++}.jpg`, quality: 75 });
  }
  await b.close(); })();
