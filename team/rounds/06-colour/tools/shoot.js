// Shoot each frame: hero viewport and the sample section, at 1440x900 and 390x844. Usage: node shoot.js id...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    for (const id of process.argv.slice(2)) {
      const p = await ctx.newPage();
      await p.goto('file://' + path.resolve('frames', id + '.html'));
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
      await p.screenshot({ path: `shots/${id}-hero-${w}x${h}.png` });
      const s = await p.$('.sample');
      await s.scrollIntoViewIfNeeded();
      if (w > 1000) await s.screenshot({ path: `shots/${id}-section-${w}x${h}.png` });
      else { await p.evaluate(() => window.scrollTo(0, document.querySelector('.sample').offsetTop)); await p.screenshot({ path: `shots/${id}-section-${w}x${h}.png` }); }
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
})();
