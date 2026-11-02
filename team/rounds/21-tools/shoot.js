// node shoot.js <base> <outdir> [suffix]: Kenji's tool pages at 1440x900 and 390x844, default and with inputs changed
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [base, out, suf = ''] = process.argv.slice(2);
const set = async (p, sel, v) => p.evaluate(([s, v]) => { const el = document.querySelector(s); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, [sel, v]);
const click = async (p, sel) => p.evaluate((s) => document.querySelector(s).click(), sel);
const T = [
  ['tools', '/tools/', '.points, .tool-cards', null],
  ['resources', '/resources/', '.points, .tool-cards', null],
  ['anchors', '/tools/anchors/', '.tool-shell', null],
  ['anchors-big', '/tools/anchors/', '.tool-shell', async (p) => { await set(p, '#a-len', 220); await set(p, '#a-wid', 120); await click(p, 'input[name=env][value=dense]'); }],
  ['search', '/tools/search-time/', '.tool-shell', null],
  ['search-big', '/tools/search-time/', '.tool-shell', async (p) => { await set(p, '#s-p', 60); await set(p, '#s-m', 22); await set(p, '#s-s', 3); }],
  ['pilot', '/tools/pilot/', '.tool-shell', null],
  ['pilot-set', '/tools/pilot/', '.tool-shell', async (p) => { await click(p, 'input[name=q][value=wait]'); await click(p, 'input[name=area][value=unsure]'); await click(p, 'input[name=link][value=none]'); }],
  ['diag', '/diagnostic/', '[data-diag]', null],
  ['diag-3', '/diagnostic/', '[data-diag]', async (p) => { for (const v of ['carriers', 'tools', 'vehicles']) await click(p, `.diag-opt[data-v=${v}]`); await click(p, '[data-diag-next]'); await p.waitForTimeout(400); await click(p, '.diag-opt[data-v=walk]'); await p.waitForTimeout(900); await click(p, '.diag-opt[data-v=qc]'); await p.waitForTimeout(900); }],
  ['diag-6', '/diagnostic/', '[data-diag]', async (p) => { await click(p, '.diag-opt[data-v=none]'); await p.waitForTimeout(900); await click(p, '.diag-opt[data-v=line]'); await p.waitForTimeout(900); }],
];
(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => console.log('ERR', e.message));
    let at = '';
    for (const [name, url, sel, act] of T) {
      if (at !== url) { await p.goto(base + url, { waitUntil: 'load' }); at = url; if (url === '/diagnostic/') await p.evaluate(() => { sessionStorage.clear(); }), await p.reload(); }
      const y = await p.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return -1; const r = el.getBoundingClientRect(); return r.top + scrollY - 80; }, sel);
      if (y < 0) { console.log('missing', name); continue; }
      await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(300);
      if (act) await act(p);
      await p.waitForTimeout(1400);
      await p.screenshot({ path: `${out}/${name}-${tag}${suf}.jpg`, quality: 80, fullPage: false });
      if (h === 844 && /anchors|search|pilot/.test(name)) { // phone: also the result below the form
        await p.evaluate(() => { const o = document.querySelector('.tool-out'); if (o) o.scrollIntoView({ block: 'start' }); }); await p.waitForTimeout(700);
        await p.screenshot({ path: `${out}/${name}-${tag}-out${suf}.jpg`, quality: 80 });
      }
    }
    await ctx.close();
  }
  await b.close();
})();
