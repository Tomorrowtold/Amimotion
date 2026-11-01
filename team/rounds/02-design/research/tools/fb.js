// Compare layout with web fonts vs blocked fonts (fallback) to estimate CLS from the swap.
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const out={};
for(const block of [false,true]){const p=await b.newPage({viewport:{width:1440,height:900}});
if(block)await p.route('**/*.woff2',r=>r.abort());
await p.goto('file:///home/user/amimotion/team/rounds/02-design/frame/hero.html');await p.waitForTimeout(500);
out[block?'fallback':'web']=await p.evaluate(()=>['h1','.lede','.btn','nav.main'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return s+' '+[r.x,r.y,r.width,r.height].map(v=>v.toFixed(0)).join(',')}));
if(block)await p.screenshot({path:'/home/user/amimotion/team/rounds/02-design/research/fallback-1440.png'});await p.close()}
console.log(out);await b.close()})();
