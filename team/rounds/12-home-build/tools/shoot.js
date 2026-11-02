// usage: node shoot.js <url> <outdir> <mode>   mode: full | screens
const { chromium } = require('playwright');
const [url, out, mode = 'screens', only = ''] = process.argv.slice(2);
const fs = require('fs'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
    if (only && only !== tag) continue;
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.goto(url, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    console.log(tag, 'height', H, 'scrollWidth', sw);
    if (mode === 'full') {
      // walk the page so lazy images load, then shoot it whole
      for (let y = 0; y < H; y += h / 2) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
      await p.screenshot({ path: `${out}/full-${tag}.png`, fullPage: true });
    } else {
      let k = 0;
      for (let y = 0; y < H; y += h * 0.75) {
        await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(250);
        await p.screenshot({ path: `${out}/${tag}-${String(k++).padStart(2, '0')}.jpg`, quality: 70 });
      }
    }
    await p.close();
  }
  await b.close();
})();
