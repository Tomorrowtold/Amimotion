// node shoot_board.js -> board.png (1440 wide, full page)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  await p.goto('file://' + __dirname + '/board.html');
  await p.waitForTimeout(500);
  await p.screenshot({ path: __dirname + '/board.png', fullPage: true });
  await b.close();
})();
