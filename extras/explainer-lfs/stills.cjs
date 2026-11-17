// Make the five finished pictures (s_*.webp) from the live page itself, so they match it exactly.
// usage: node stills.cjs <page url> <assets/lfs dir>   (then stills.py turns the PNGs into WebP)
const { chromium } = require('playwright');
const SHOTS = [['lost', .1, 1], ['isl', .34, 1], ['tag', .44, .05], ['found', .685, 1.9], ['seen', .9, 1]];
(async () => {
  const [url, dir] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [o, w, h] of [['L', 1280, 720], ['P', 720, 1280]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await pg.addInitScript(() => { window.__lfsShot = 1; });
    await pg.goto(url, { waitUntil: 'load' });
    await pg.addStyleTag({ content: '.lfs-t,.lfs-facts,.lfs-end,.lfs-ctl,.lfs-ov,.lfs-shade,#bar,.bar,header{display:none!important}' });
    for (const [k, p, clock] of SHOTS) {
      await pg.evaluate((p) => { const s = document.getElementById('see'); scrollTo(0, s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) * p); }, p);
      await pg.waitForFunction(() => window.__lfs && window.__lfs.ready(), null, { timeout: 60000 });
      await pg.waitForTimeout(700); await pg.evaluate((c) => window.__lfs.clock(c), clock); await pg.waitForTimeout(250);
      await (await pg.$('.lfs-gl')).screenshot({ path: `${dir}/${o}/s_${k}.png` });
    }
    await pg.close();
  }
  await b.close();
})();
