// Round 14 nav research: open the live navs of reference sites at 1440 and 390, closed and open, and dump the
// nav's link labels and timings. node research.js <outdir>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const out = process.argv[2];
const SITES = [
  ['apple', 'https://www.apple.com/', 'nav#globalnav a.globalnav-link-mac, #globalnav .globalnav-item a'],
  ['apple-iphone', 'https://www.apple.com/iphone/', null],
  ['stripe', 'https://stripe.com/', 'button:has-text("Products"), [data-testid*=nav] button'],
  ['linear', 'https://linear.app/', 'header button:has-text("Product"), nav button'],
  ['vercel', 'https://vercel.com/', 'nav button:has-text("Products"), header button'],
  ['anduril', 'https://www.anduril.com/', 'header button, header a'],
  ['vention', 'https://vention.io/', 'header button, nav button'],
  ['rivian', 'https://rivian.com/', 'header button, nav button'],
  ['nothing', 'https://nothing.tech/', 'header button, nav button'],
  ['framer', 'https://www.framer.com/', 'nav button, header button'],
  ['figma', 'https://www.figma.com/', 'header button, nav button'],
  ['notion', 'https://www.notion.com/', 'header button, nav button'],
  ['raycast', 'https://www.raycast.com/', 'header button, nav button'],
  ['arc', 'https://arc.net/', 'header button, nav a'],
  ['samsara', 'https://www.samsara.com/', 'header button, nav button'],
];
const PHONE_BTN = 'button[aria-label*="enu" i], button[aria-label*="avigation" i], [aria-label*="menu" i], button:has-text("Menu"), header button';
(async () => {
  const b = await chromium.launch(); const rep = {};
  for (const [n, url, sel] of SITES) {
    const r = rep[n] = {};
    for (const w of [1440, 390]) {
      const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, userAgent: w < 600 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined, isMobile: w < 600, hasTouch: w < 600 });
      const pg = await ctx.newPage();
      try {
        await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); await pg.waitForTimeout(2500);
        await pg.screenshot({ path: path.join(out, `${n}-${w}-closed.png`) });
        const info = await pg.evaluate(() => { const h = document.querySelector('header, nav'); if (!h) return null; const r = h.getBoundingClientRect();
          return { h: Math.round(r.height), pos: getComputedStyle(h).position, labels: [...h.querySelectorAll('a,button')].map(a => (a.innerText || a.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 30) }; });
        r[w] = { info };
        const s = w < 600 ? PHONE_BTN : sel;
        if (s) {
          const el = await pg.locator(s).filter({ visible: true }).first();
          if (await el.count()) {
            const t0 = Date.now();
            if (w < 600) await el.click({ timeout: 4000 }).catch(() => {}); else { await el.hover({ timeout: 4000 }).catch(() => {}); await pg.waitForTimeout(250); }
            for (const t of [60, 120, 240, 600]) { await pg.waitForTimeout(t === 60 ? 60 : t - [60,120,240,600][[60,120,240,600].indexOf(t)-1]); await pg.screenshot({ path: path.join(out, `${n}-${w}-open-${t}.png`) }); }
            if (w >= 600) { const ae = await el.getAttribute('aria-expanded').catch(() => null); if (ae !== 'true') { await el.click({ timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(500); await pg.screenshot({ path: path.join(out, `${n}-${w}-open-click.png`) }); } }
          }
        }
      } catch (e) { r[w] = { err: String(e).slice(0, 200) }; }
      await ctx.close();
    }
    console.log(n, JSON.stringify(r).slice(0, 400));
  }
  fs.writeFileSync(path.join(out, 'research.json'), JSON.stringify(rep, null, 1)); await b.close();
})();
