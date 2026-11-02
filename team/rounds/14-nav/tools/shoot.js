// Round 14 nav shots: closed and open states at 1440 and 390, plus a frame sequence of the open motion.
// node shoot.js http://127.0.0.1:8141 <outdir> [page=/technology/]   (then: home closed states with --home)
const { chromium } = require('playwright'); const path = require('path');
const [base, out, page = '/technology/'] = process.argv.slice(2);
const shot = (pg, n, o = {}) => pg.screenshot({ path: path.join(out, n + '.png'), ...o });
(async () => {
  const b = await chromium.launch(); const log = [];
  // desktop
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); let pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await pg.goto(base + page, { waitUntil: 'load' }); await pg.waitForTimeout(600);
  await shot(pg, 'd1440-closed');
  const labels = ['How it works', 'Where it helps', 'Start small', 'About us'];
  for (const [i, l] of labels.entries()) {
    await pg.click(`.links summary:text-is("${l}")`); await pg.waitForTimeout(400);
    await shot(pg, `d1440-open-${i + 1}`);
  }
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(100);
  // preview: hover a row
  await pg.click('.links summary:text-is("Where it helps")'); await pg.waitForTimeout(300);
  await pg.hover('.drop-groups a[href="/industries/warehousing/"]'); await pg.waitForTimeout(300); await shot(pg, 'd1440-preview-hover');
  await pg.keyboard.press('Escape');
  // motion: every animation is paused the moment the panel opens and stepped to 0, 30 ... 180 ms, so the frames show
  // the real curve (the real thing runs at 60 fps; a screenshot takes longer than a frame)
  const frames = async (tag, open, ms = [0, 30, 60, 90, 120, 150, 180], clip = { x: 0, y: 0, width: 1440, height: 620 }) => {
    await pg.evaluate(open); await pg.evaluate(() => document.getAnimations().filter(a => a.timeline === document.timeline).forEach(a => a.pause()));
    for (const [f, t] of ms.entries()) { await pg.evaluate(t => document.getAnimations().filter(a => a.timeline === document.timeline).forEach(a => a.currentTime = t), t); await shot(pg, `motion-${tag}-${String(f).padStart(2, '0')}-${t}ms`, clip ? { clip } : {}); }
    await pg.evaluate(() => document.getAnimations().filter(a => a.timeline === document.timeline).forEach(a => a.finish()));
  };
  await pg.mouse.move(700, 800); await pg.waitForTimeout(300);
  await frames('d-open', () => document.querySelectorAll('.links summary')[0].click());
  await frames('d-morph', () => document.querySelectorAll('.links summary')[2].click());
  await pg.keyboard.press('Escape');
  // Ask
  await pg.keyboard.press('/'); await pg.waitForTimeout(300); await shot(pg, 'd1440-ask-empty');
  await pg.keyboard.type('does it work near steel racking', { delay: 10 }); await pg.waitForTimeout(500); await shot(pg, 'd1440-ask-answer');
  await pg.fill('#ask-d', 'how much does a pilot cost'); await pg.waitForTimeout(400); await shot(pg, 'd1440-ask-answer-2');
  await pg.keyboard.press('Escape');
  // focus ring: keyboard into a panel
  await pg.goto(base + page); await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab'); await pg.keyboard.press('Enter'); await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab'); await pg.waitForTimeout(250); await shot(pg, 'd1440-keyboard');
  const a11y = await pg.evaluate(() => [...document.querySelectorAll('.top summary')].map(s => s.textContent + ':' + s.getAttribute('aria-expanded')));
  log.push(['aria', a11y, document = 0]);
  await ctx.close();
  // phone
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(base + page, { waitUntil: 'load' }); await pg.waitForTimeout(500);
  await shot(pg, 'p390-closed');
  await pg.tap('.phone > summary'); await pg.waitForTimeout(400); await shot(pg, 'p390-open');
  await pg.tap('.fold > summary >> nth=0'); await pg.waitForTimeout(500); await shot(pg, 'p390-open-section');
  await pg.tap('.phone > summary'); await pg.waitForTimeout(200);
  await pg.evaluate(() => scrollTo(0, innerHeight * 1.5)); await pg.waitForTimeout(500); await shot(pg, 'p390-dock');
  await pg.tap('[data-ask-open]'); await pg.waitForTimeout(400); await pg.keyboard.type('battery life', { delay: 10 }); await pg.waitForTimeout(500); await shot(pg, 'p390-ask');
  await pg.tap('[data-menu]'); await pg.waitForTimeout(300);
  await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(300);
  await pg.evaluate(() => document.querySelector('.phone > summary').click()); await pg.evaluate(() => document.getAnimations().filter(a => a.timeline === document.timeline).forEach(a => a.pause()));
  for (const [f, t] of [0, 45, 90, 135, 180].entries()) { await pg.evaluate(t => document.getAnimations().filter(a => a.timeline === document.timeline).forEach(a => a.currentTime = t), t); await shot(pg, `motion-p-open-${f}-${t}ms`); }
  await ctx.close();
  // JS off
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); pg = await ctx.newPage();
  await pg.goto(base + page); await pg.click('.links summary >> nth=0'); await pg.waitForTimeout(400); await shot(pg, 'd1440-nojs-open');
  await ctx.close();
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, deviceScaleFactor: 2 }); pg = await ctx.newPage();
  await pg.goto(base + page); await pg.click('.phone > summary'); await pg.waitForTimeout(300); await shot(pg, 'p390-nojs-open');
  await ctx.close();
  for (const w of [1440, 1024, 390]) { ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: w < 600 ? 2 : 1 }); pg = await ctx.newPage();
    await pg.goto(base + '/', { waitUntil: 'load' }); await pg.waitForTimeout(800); await shot(pg, `home-${w}-closed`);
    if (w === 1024) { await pg.click('.links summary >> nth=1'); await pg.waitForTimeout(300); await shot(pg, 'home-1024-open'); }
    await ctx.close(); }
  await b.close();
  console.log(JSON.stringify(log)); console.log('errors', errs);
})();
