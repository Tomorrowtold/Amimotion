// Harvest capture: node capture.js <jobs.json> <outdir> [concurrency]
// jobs: [{id, url, depth}] ; writes <outdir>/<id>/d0.jpg.. m0.jpg.. and meta.json
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [, , jobsFile, outDir, concArg] = process.argv;
const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
const CONC = +concArg || 6;

const COOKIE = ['#onetrust-accept-btn-handler', 'button:has-text("Accept all")', 'button:has-text("Accept All")',
  'button:has-text("Accept")', 'button:has-text("I agree")', 'button:has-text("Got it")', 'button:has-text("Allow all")',
  '[aria-label="Close"]'];

async function dismiss(page) {
  for (const s of COOKIE) {
    try { const b = page.locator(s).first(); if (await b.isVisible({ timeout: 300 })) { await b.click({ timeout: 800 }); await page.waitForTimeout(300); } } catch (e) {}
  }
}

const probe = () => {
  // cheap: sample an 8x6 grid of points, collect the element stack under each
  const seen = new Set();
  for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) {
    for (const el of document.elementsFromPoint((i + .5) * innerWidth / 8, (j + .5) * innerHeight / 6).slice(0, 12)) seen.add(el);
  }
  const sticky = [], media = { video: 0, canvas: 0, img: 0 };
  let big = 0, bigText = '';
  for (const el of seen) {
    const cs = getComputedStyle(el);
    const t = el.tagName.toLowerCase();
    if (t === 'video') media.video++; if (t === 'canvas') media.canvas++; if (t === 'img' || t === 'picture') media.img++;
    if ((cs.position === 'sticky' || cs.position === 'fixed') && el !== document.body) { const r = el.getBoundingClientRect(); sticky.push(`${t} ${cs.position} ${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.top)}`); }
    if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) { const f = parseFloat(cs.fontSize); if (f > big) { big = f; bigText = el.textContent.trim().slice(0, 50); } }
  }
  return { y: Math.round(scrollY), sticky: sticky.slice(0, 5), media, bigFont: big, bigText };
};

const pageProbe = () => {
  const q = s => document.querySelector(s);
  const st = el => { if (!el) return null; const c = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60), fs: c.fontSize, fw: c.fontWeight, lh: c.lineHeight, ls: c.letterSpacing, ff: c.fontFamily.split(',')[0], color: c.color, bg: c.backgroundColor, pad: c.padding, rad: c.borderRadius, w: Math.round(r.width), h: Math.round(r.height) }; };
  const btns = [...document.querySelectorAll('a,button')].filter(el => { const c = getComputedStyle(el); const r = el.getBoundingClientRect(); return r.top < innerHeight * 1.2 && r.width > 60 && (c.backgroundColor !== 'rgba(0, 0, 0, 0)' || c.borderStyle !== 'none' && parseFloat(c.borderWidth) > 0); }).slice(0, 3).map(st);
  const nav = q('header') || q('nav');
  const footer = q('footer');
  return { title: document.title, h1: st(q('h1')), h2: st(q('h2')), p: st(q('main p') || q('p')), buttons: btns, nav: st(nav),
    footer: footer ? { h: Math.round(footer.getBoundingClientRect().height), links: footer.querySelectorAll('a').length, bg: getComputedStyle(footer).backgroundColor } : null,
    docH: document.documentElement.scrollHeight, bodyBg: getComputedStyle(document.body).backgroundColor,
    videos: document.querySelectorAll('video').length, canvases: document.querySelectorAll('canvas').length,
    sections: document.querySelectorAll('section').length,
    smooth: !!(document.documentElement.classList.contains('lenis') || window.lenis || document.querySelector('[data-lenis-prevent],[data-scroll-container]')),
    gsap: !!window.gsap, three: !!window.THREE };
};

async function shoot(browser, job, vp, prefix, depth, step) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: vp.width < 600, hasTouch: vp.width < 600,
    userAgent: vp.width < 600 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
  const page = await ctx.newPage();
  const dir = path.join(outDir, job.id);
  const scrolls = [];
  let meta = null;
  try {
    const t0 = Date.now();
    await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    try { await page.waitForLoadState('load', { timeout: 15000 }); } catch (e) {}
    await page.waitForTimeout(1800);
    await dismiss(page);
    await page.waitForTimeout(500);
    const loadMs = Date.now() - t0;
    await page.screenshot({ path: path.join(dir, `${prefix}0.jpg`), type: 'jpeg', quality: 62 });
    scrolls.push(await page.evaluate(probe));
    if (prefix === 'd') { meta = await page.evaluate(pageProbe); meta.loadMs = loadMs; }
    for (let i = 1; i <= depth; i++) {
      // wheel in small increments so scroll-driven animation runs
      const px = Math.round(vp.height * step);
      for (let k = 0; k < 6; k++) { await page.mouse.wheel(0, px / 6); await page.waitForTimeout(110); }
      try { await page.evaluate(n => { if (Math.abs(scrollY - n) > 50 && !document.documentElement.classList.contains('lenis')) scrollTo(0, n); }, px * i); } catch (e) {}
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(dir, `${prefix}${i}.jpg`), type: 'jpeg', quality: 62 });
      scrolls.push(await page.evaluate(probe));
    }
  } catch (e) {
    scrolls.push({ error: String(e).slice(0, 200) });
  }
  try { await ctx.close(); } catch (e) {}
  return { scrolls, meta };
}

process.on('unhandledRejection', e => console.log('UNH', String(e).slice(0,120)));
(async () => {
  const browser = await chromium.launch();
  let idx = 0;
  async function worker() {
    while (idx < jobs.length) {
      const job = jobs[idx++];
      const dir = path.join(outDir, job.id);
      fs.mkdirSync(dir, { recursive: true });
      const t = Date.now();
      const d = await shoot(browser, job, { width: 1440, height: 900 }, 'd', job.depth, job.step || 1);
      const m = await shoot(browser, job, { width: 390, height: 844 }, 'm', Math.min(3, job.depth), 1);
      fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ job, desktop: d, mobile: m }, null, 1));
      console.log(job.id, ((Date.now() - t) / 1000).toFixed(0) + 's', d.scrolls.some(s => s.error) ? 'ERR ' + (d.scrolls.find(s => s.error) || {}).error : '');
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  await browser.close();
})();
