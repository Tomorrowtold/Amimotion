// Takes the ten finished pictures (laptop and phone) from the live section, for browsers that get no WebGL.
// usage: node stills.cjs <url of the studio page> <out dir = studio/v1/assets/floor>
const { chromium } = require('playwright'); const fs = require('fs');
process.on('unhandledRejection', e => { console.log('ERR', String(e).slice(0, 300)); process.exit(1); });
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [lay, w, h] of [['L', 1440, 900], ['P', 390, 844]]) {
    console.log(lay); const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: lay === 'L' ? 1 : 2 });
    await pg.addInitScript(() => { window.__flrShot = 1; });
    await pg.goto(url, { waitUntil: 'load' });
    await pg.evaluate(() => document.querySelector('.flr').scrollIntoView());
    await pg.waitForFunction(() => window.__flr && window.__flr.ready(), null, { timeout: 120000 });
    await pg.addStyleTag({ content: '.nav,header,.flr-n li{transition:none!important}header,.nav,.cursor{display:none!important}' });
    const at = [.8, .78, .97, .97, .97, .97, .985, .9, .95, .9];
    for (let i = 0; i < 10; i++) {
      await pg.evaluate(([i, u]) => window.__flr.seek(i + u, 7.3 + i), [i, at[i]]); await pg.waitForTimeout(1500);
      await (await pg.$('.flr-stage')).screenshot({ path: `${out}/${lay}/s${i + 1}.png` });
    }
    await pg.close();
  }
  await b.close();
})();
