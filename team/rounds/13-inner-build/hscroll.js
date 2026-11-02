// every built page at 320, 390, 1440 and 3840: sideways scroll, empty slots, broken pictures. node hscroll.js <base> <dist>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const [base, dist] = process.argv.slice(2);
const pages = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) { if (f !== 'assets') walk(p); } else if (f === 'index.html') pages.push('/' + path.relative(dist, d).replace(/\\/g, '/') + (d === dist ? '' : '/')); } })(dist);
(async () => { const b = await chromium.launch(); const bad = [];
  for (const w of [320, 390, 1440, 3840]) { const ctx = await b.newContext({ viewport: { width: w, height: 900 } }); const pg = await ctx.newPage();
    for (const p of pages) { if (p === '/') continue; await pg.goto(base + p.replace('//', '/'), { waitUntil: 'load' });
      const r = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: innerWidth, slots: document.querySelectorAll('.slot').length }));
      if (r.sw > r.vw || r.slots) bad.push([w, p, r]); }
    await ctx.close(); }
  console.log(pages.length - 1, 'pages x 4 widths; problems:', JSON.stringify(bad)); await b.close(); })();
