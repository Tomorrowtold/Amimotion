const { chromium } = require('playwright');
const Q = ['how much does it cost','what is amimotion','does it need wifi','battery life','how accurate','is it safe for workers','how do I start a pilot','where is my trolley','mcp','api','integrate with SAP','what is an anchor','how many anchors do I need','steel racking','where does my data live','forklift','dwell time','warehouse','does it track people','who makes it','lead time','india','omlox','privacy','wip','book a demo','installation','cloud or on premise','spatial intelligence','xyzzy'];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pg.goto('http://127.0.0.1:8141/'); await pg.keyboard.press('/'); 
for (const q of Q) { await pg.fill('#ask-d', q); await pg.waitForTimeout(250);
  const r = await pg.evaluate(() => [...document.querySelectorAll('.nask-drop .nask-out a')].map(a => (a.querySelector('b')||a).textContent + ' [' + a.getAttribute('href').split('#')[0] + ']'));
  console.log('Q:', q, '\n   ', r.slice(0, 3).join('\n    ')); }
await b.close() })();
