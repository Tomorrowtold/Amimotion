// Round 5 width sweep for the hero: 320 to 3840 CSS px in 10 px steps, landscape and portrait heights.
// Fails on: horizontal scroll, an H1 line wider than its column, H1 or lede running into the tag's opaque area,
// the H1 starting under the bar, or (phones) the lede's last line below the first screen.
const { chromium } = require('playwright');
const url = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url); await p.evaluate(() => document.fonts.ready);
  const bad = []; let n = 0;
  const sizes = [];
  for (let w = 320; w <= 3840; w += 10) sizes.push([w, w < 1024 ? Math.max(568, Math.round(w * 2.16)) : Math.round(w * 0.5625)]);
  for (const s of [[1366, 768], [1280, 800], [1536, 864], [1920, 1080], [3440, 1440], [1080, 1920], [844, 390], [768, 1024], [1024, 768], [360, 640], [375, 667]]) sizes.push(s);
  for (const [w, h] of sizes) {
    await p.setViewportSize({ width: w, height: h }); n++;
    const r = await p.evaluate(() => {
      const h1 = document.querySelector('h1'), lede = document.querySelector('.lede'), img = document.querySelector('.picture img');
      const spans = [...h1.querySelectorAll('span')].map(s => s.getBoundingClientRect().right);
      const col = h1.getBoundingClientRect();
      const i = img.getBoundingClientRect(), l = lede.getBoundingClientRect(), hr = h1.getBoundingClientRect();
      // the tag's opaque box inside the crop, as fractions of the image (measured on the master's alpha)
      const T = window.__tagBox || [0.2075, 0.1625, 0.7788, 0.833];
      const tag = { l: i.left + T[0] * i.width, t: i.top + T[1] * i.height, r: i.left + T[2] * i.width, b: i.top + T[3] * i.height };
      const hit = (e) => !(e.right < tag.l || e.left > tag.r || e.bottom < tag.t || e.top > tag.b);
      const bar = document.querySelector('.bar').getBoundingClientRect().bottom;
      return { over: Math.max(...spans) - col.right, hs: document.documentElement.scrollWidth > innerWidth, h1Hit: hit(hr), ledeHit: hit(l), h1Top: hr.top - bar, ledeBottom: l.bottom, vh: innerHeight, stacked: innerWidth < 1024 };
    });
    const fails = [];
    if (r.over > 0.5) fails.push('h1 over ' + r.over.toFixed(1));
    if (r.hs) fails.push('h-scroll');
    if (!r.stacked && (r.h1Hit || r.ledeHit)) fails.push('text on tag');
    if (r.h1Top < 8) fails.push('h1 under bar');
    if (r.stacked && w <= 480 && h >= 640 && r.ledeBottom > r.vh) fails.push('lede below fold ' + Math.round(r.ledeBottom) + '/' + r.vh);
    if (fails.length) bad.push(`${w}x${h}: ${fails.join(', ')}`);
  }
  console.log(`${n} sizes, ${bad.length} failing`); if (bad.length) console.log(bad.join('\n'));
  await b.close();
})();
