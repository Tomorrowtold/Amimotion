const { chromium } = require('playwright');
const [,,file,out,w,h,full]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:1});
await p.goto('file://'+file);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:out,fullPage:!!full});await b.close()})();
