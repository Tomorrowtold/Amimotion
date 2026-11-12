// Share pictures, one per page (site audit, 12 Nov 2026): 1200x630, the page's own headline on white beside its own
// photograph. Run after a build:  node site/tools/og.cjs <dist dir>   -> site/src/assets/og/<slug>.jpg, which build.py
// then uses for og:image and the schema image. The homepage keeps its own share picture.
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const dist = path.resolve(process.argv[2] || '/tmp/amimotion-build/site/dist');
const src = path.resolve(__dirname, '../src'), out = path.join(src, 'assets/og');
const font = f => 'file://' + path.join(src, 'assets/fonts', f);
const pages = [];
(function walk(d) { for (const n of fs.readdirSync(d)) { const p = path.join(d, n);
  if (fs.statSync(p).isDirectory()) { if (n !== 'assets') walk(p); } else if (n === 'index.html') pages.push(p); } })(dist);
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim();
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
  let n = 0;
  for (const f of pages) {
    const rel = path.relative(dist, path.dirname(f)); if (!rel) continue;
    const slug = rel.split(path.sep).join('-'), html = fs.readFileSync(f, 'utf8');
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]; if (!h1) continue;
    const lines = (h1.match(/<span[^>]*>[\s\S]*?<\/span>/g) || [h1]).map(strip).filter(Boolean).slice(0, 2);
    const main = html.split(/<main[^>]*>/)[1] || html;
    const img = (main.match(/<img[^>]+src="(\/assets\/[^"]+\.(?:webp|jpg|png))"/) || [])[1];
    const pic = img && fs.existsSync(path.join(dist, img)) ? 'file://' + path.join(dist, img) : '';
    const e = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const tmp = path.join(require('os').tmpdir(), 'og-card.html');
    fs.writeFileSync(tmp, `<style>
@font-face{font-family:D;src:url(${font('AmISansDisplay-SemiBold.woff2')})}@font-face{font-family:T;src:url(${font('AmISansText-Medium.woff2')})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fff;display:grid;grid-template-columns:${pic ? '1fr 520px' : '1fr'};font-family:D;color:#0b0d12}
.w{padding:64px 56px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:${lines.join(' ').length > 46 ? 54 : 64}px;line-height:1.02;letter-spacing:-.035em;font-weight:600}h1 span{display:block}h1 span+span{color:#4b515d}
.m{font:500 22px/1 T;display:flex;align-items:center;gap:12px}.m i{width:12px;height:12px;border-radius:50%;background:#66a5fa}
.p{background:url("${pic}") center/cover}</style>
<div class="w"><h1>${lines.map(l => `<span>${e(l)}</span>`).join('')}</h1><div class="m"><i></i>AmIMotion</div></div>${pic ? '<div class="p"></div>' : ''}`);
    await pg.goto('file://' + tmp, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, slug + '.jpg'), type: 'jpeg', quality: 82 }); n++;
  }
  await b.close(); console.log(`share pictures: ${n} -> ${out}`);
})();
