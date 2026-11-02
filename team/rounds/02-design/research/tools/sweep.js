const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file:///home/user/amimotion/team/rounds/02-design/frame/hero.html');await p.evaluate(()=>document.fonts.ready);
const bad=[];for(let w=320;w<=3840;w+=10){await p.setViewportSize({width:w,height:Math.round(w*0.6)<700?844:Math.round(w*0.5625)});
const r=await p.evaluate(()=>{const h=document.querySelector('h1');const sp=[...h.querySelectorAll('span')].map(s=>s.getBoundingClientRect().right);const lim=h.parentElement.getBoundingClientRect().right-parseFloat(getComputedStyle(h.parentElement).paddingRight);
const pic=document.querySelector('.picture').getBoundingClientRect();const nav=document.querySelector('nav.main');const nr=nav&&getComputedStyle(nav).display!=='none'?[...nav.querySelectorAll('a')].pop().getBoundingClientRect().right:0;const bt=document.querySelector('.btn').getBoundingClientRect().left;
const lede=document.querySelector('.words').getBoundingClientRect();
return {over:Math.max(...sp)-lim, hs:document.documentElement.scrollWidth>innerWidth, navClash:nr&&nr>bt-16, wordsTop:lede.top, bar:document.querySelector('.bar').offsetHeight}});
if(r.over>0.5||r.hs||r.navClash||r.wordsTop<r.bar)bad.push(w+':'+JSON.stringify(r));}
console.log(bad.length?bad.join('\n'):'all widths 320-3840 clean');await b.close()})();
