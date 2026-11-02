// Capture live first screens at 1440x900 for palette research. PNGs are gitignored.
const { chromium } = require('playwright');
const sites = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
  await Promise.all(sites.map(async s => {
    const [name, url] = s.split('=');
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await p.waitForTimeout(6000);
      // read computed colours of body, h1, links, buttons
      const css = await p.evaluate(() => {
        const g = (el) => el ? getComputedStyle(el) : null;
        const b = g(document.body), h = g(document.querySelector('h1')), a = g(document.querySelector('main a, a'));
        const btn = g(document.querySelector('a[class*=button i], button[class*=button i], [class*=btn i]'));
        return { body: b && [b.backgroundColor, b.color], h1: h && h.color, a: a && a.color, btn: btn && [btn.backgroundColor, btn.color] };
      });
      await p.screenshot({ path: `research/refs/${name}.png` });
      console.log(name, JSON.stringify(css));
    } catch (e) { console.log(name, 'FAIL', e.message.split('\n')[0]); }
    await p.close();
  }));
  await b.close();
})();
