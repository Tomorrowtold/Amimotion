// Vibe-code + token census on computed styles, at three widths.
const { chromium } = require('playwright');
const file='/home/user/amimotion/team/rounds/02-design/frame/hero.html';
(async()=>{const b=await chromium.launch();
for (const [w,h] of [[1440,900],[390,844],[2560,1440]]){
 const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('file://'+file);await p.evaluate(()=>document.fonts.ready);
 const r=await p.evaluate(()=>{
  const els=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return s.display!=='none'&&e.getClientRects().length});
  const c={backdrop:0,shadow:0,gradient:0,upper:0,posTracking:0,border1:0,pill:0,opacity0:0,anim:0,filter:0,textShadow:0,svgIcons:0,italic:0,mono:0};
  const sizes=new Set(),colors=new Set(),bgs=new Set(),radii=new Set(),fams=new Set(),weights=new Set();
  for(const e of els){const s=getComputedStyle(e);
   if(s.backdropFilter&&s.backdropFilter!=='none')c.backdrop++; if(s.boxShadow!=='none')c.shadow++;
   if(/gradient/.test(s.backgroundImage))c.gradient++; if(s.textTransform==='uppercase')c.upper++;
   if(parseFloat(s.letterSpacing)>0)c.posTracking++; if(['Top','Right','Bottom','Left'].some(k=>s['border'+k+'Width']==='1px'&&s['border'+k+'Style']!=='none'))c.border1++;
   const rr=parseFloat(s.borderTopLeftRadius); if(rr>0){radii.add(s.borderTopLeftRadius); if(rr>=e.offsetHeight/2-1)c.pill++;}
   if(s.opacity==='0')c.opacity0++; if(s.animationName!=='none')c.anim++; if(s.filter!=='none')c.filter++; if(s.textShadow!=='none')c.textShadow++;
   if(s.fontStyle==='italic')c.italic++; if(/mono/i.test(s.fontFamily))c.mono++;
   if(e.tagName==='svg'&&!e.closest('.logo'))c.svgIcons++;
   const hasText=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
   if(hasText){sizes.add(s.fontSize);colors.add(s.color);fams.add(s.fontFamily.split(',')[0]);weights.add(s.fontWeight)}
   if(s.backgroundColor!=='rgba(0, 0, 0, 0)')bgs.add(s.backgroundColor);}
  const h1=document.querySelector('h1'),lede=document.querySelector('.lede'),pic=document.querySelector('.picture');
  const lh=parseFloat(getComputedStyle(h1).lineHeight);const ch=lede.offsetWidth/ (parseFloat(getComputedStyle(lede).fontSize)*0.5);
  const links=[...document.querySelectorAll('nav.main a')].map(a=>a.getBoundingClientRect().left|0);
  return {c,sizes:[...sizes],colors:[...colors],bgs:[...bgs],radii:[...radii],fams:[...fams],weights:[...weights],
   h1:{size:getComputedStyle(h1).fontSize,lines:Math.round(h1.offsetHeight/lh),w:h1.scrollWidth,boxW:h1.parentElement.clientWidth},
   lede:{size:getComputedStyle(lede).fontSize,approxChars:Math.round(ch),bottom:lede.getBoundingClientRect().bottom|0},
   pic:pic.getBoundingClientRect().toJSON(),firstNavLink:links[0],buttons:document.querySelectorAll('.hero a,.hero button').length,
   hscroll:document.documentElement.scrollWidth>innerWidth,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight)};
 });
 console.log(`== ${w}x${h}`);console.log(JSON.stringify(r));await p.close();}
await b.close()})();
