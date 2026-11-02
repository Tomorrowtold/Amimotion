// node shoot.js <base url> <outdir>: each changed screen at 1440x900 and 390x844 (motion on), plus S2 with JS off
const { chromium } = require('playwright');
const [base, out] = process.argv.slice(2);
const T = [
  ['home-s1b', '/', '.spec', 'center'],
  ['home-s2-scan', '/', '.find-run', 0.12],
  ['home-s2-draw', '/', '.find-run', 0.44],
  ['home-s2-tag', '/', '.find-run', 0.98],
  ['home-s3', '/', '.waits-panel', 'top'],
  ['home-s3-chip', '/', '.waits-panel h2', 'center'],
  ['home-s4-q1', '/', '.ask-hall', 'center', 'label[for=ask-1]'],
  ['home-s4-q2', '/', '.ask-hall', 'center', 'label[for=ask-2]'],
  ['home-s4-q3', '/', '.ask-hall', 'center', 'label[for=ask-3]'],
  ['home-s5', '/', '.fam', 'center'],
  ['home-s6', '/', '.bay', 'top'],
  ['home-s7', '/', '.jobs', 'top'],
  ['products', '/products/', 'body', 'page'],
  ['products-pic', '/products/', '.head-pic', 'center'],
  ['pilot', '/pilot/', 'body', 'page'],
  ['pilot-pic', '/pilot/', '.head-pic', 'center'],
  ['technology', '/technology/', 'body', 'page'],
  ['technology-pic', '/technology/', '.head-pic', 'center'],
];
(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    for (const js of [true, false]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: js });
      const p = await ctx.newPage();
      let at = '';
      for (const [name, url, sel, where, click] of T) {
        if (!js && !name.startsWith('home-s2')) continue;
        if (at !== url) { await p.goto(base + url, { waitUntil: 'load' }); at = url;
          const H = await p.evaluate(() => document.documentElement.scrollHeight);
          for (let y = 0; y < H; y += h) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(40); } }
        if (click) { await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), click); await p.click(click); await p.waitForTimeout(1100); }
        const y = await p.evaluate(([sel, where]) => {
          const el = document.querySelector(sel); if (!el) return -1;
          const r = el.getBoundingClientRect(), top = r.top + scrollY;
          if (where === 'page') return 0;
          if (where === 'top') return top;
          if (where === 'center') return top - (innerHeight - r.height) / 2;
          return top + where * (r.height - innerHeight);
        }, [sel, where]);
        if (y < 0) { console.log('missing', name, sel); continue; }
        await p.evaluate((y) => scrollTo(0, y), Math.max(0, y));
        await p.waitForTimeout(900);
        await p.evaluate(() => Promise.all([...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width; }).map((i) => Promise.race([i.decode().catch(() => {}), new Promise((r) => setTimeout(r, 3000))]))));
        await p.waitForTimeout(200);
        const f = `${out}/${name}-${tag}${js ? '' : '-nojs'}.jpg`;
        await p.screenshot({ path: f, quality: 78 });
        const sw = await p.evaluate(() => document.documentElement.scrollWidth);
        console.log(f, sw > w ? 'H-SCROLL ' + sw : '');
      }
      await ctx.close();
    }
  }
  await b.close();
})();
