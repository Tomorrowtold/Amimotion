/* worlds.js: the signature moment of each inner page. Every figure is complete in the HTML (people, crawlers and
   reduced motion see the finished state); this file only animates it and wires the controls. No libraries. */
(()=>{
const still=!document.documentElement.classList.contains('motion');
const inView=(el,fn,opt)=>{if(!('IntersectionObserver' in window)){fn();return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.disconnect();fn()}}),opt||{threshold:.35});io.observe(el)};

/* ASK: the question types, the answer rows land; question cards re-run it */
document.querySelectorAll('[data-sig="ask"]').forEach(box=>{
  const q=box.querySelector('.q span'),rows=[...box.querySelectorAll('li')],chips=[...box.querySelectorAll('.chips button')];
  const sets=JSON.parse(box.dataset.sets||'[]');let busy=0;
  const play=i=>{const s=sets[i];if(!s)return;busy++;const me=busy;
    chips.forEach((c,k)=>c.setAttribute('aria-pressed',k===i));
    box.querySelector('ol').innerHTML=s.rows.map(r=>`<li class="pending"><b>${r[0]}</b><span>${r[1]}</span><em>${r[2]}</em></li>`).join('');
    box.querySelector('.src').textContent=s.src;
    const lis=[...box.querySelectorAll('li')];
    if(still){q.textContent=s.q;lis.forEach(l=>l.classList.remove('pending'));return}
    q.textContent='';let n=0;const caret=box.querySelector('.caret');caret.hidden=false;
    const step=()=>{if(me!==busy)return;q.textContent=s.q.slice(0,++n);if(n<s.q.length)setTimeout(step,22+Math.random()*28);
      else{caret.hidden=true;lis.forEach((l,k)=>setTimeout(()=>me===busy&&l.classList.remove('pending'),380+k*170))}};
    step()};
  chips.forEach((c,i)=>c.addEventListener('click',()=>play(i)));
  if(!still)inView(box,()=>play(0));
});

/* GATE: acting needs a person */
document.querySelectorAll('[data-sig="gate"]').forEach(g=>{
  const b=g.querySelector('button'),st=g.querySelector('.state');const t0=st.textContent;
  b.addEventListener('click',()=>{const open=!g.hasAttribute('data-open');g.toggleAttribute('data-open',open);
    b.setAttribute('aria-pressed',open);st.textContent=open?g.dataset.done:t0});
});

/* DWELL: scrub one morning; entry and exit are stamped as the trolley crosses the zone edge */
document.querySelectorAll('[data-sig="dwell"]').forEach(f=>{
  const r=f.querySelector('input'),dot=f.querySelector('.cart'),trail=f.querySelector('.trail'),zone=f.querySelector('.zone');
  const out={in:f.querySelector('[data-o=in]'),out:f.querySelector('[data-o=out]'),dw:f.querySelector('[data-o=dw]'),dwl:f.querySelector('[data-o=dwl]')};
  const ent=f.querySelector('.stamp-in'),ext=f.querySelector('.stamp-out'),now=f.querySelector('.now');
  // the morning: minutes after 08:00 -> x on the lane. Arrives 08:40, enters 09:12, leaves 10:47, gone by 11:20
  const T0=0,T1=240,ENTER=72,EXIT=167,X0=40,ZX0=330,ZX1=610,X1=900;
  const xAt=m=>m<ENTER?X0+(ZX0-X0)*(m/ENTER):m<EXIT?ZX0+30+(ZX1-ZX0-60)*((m-ENTER)/(EXIT-ENTER)):ZX1+(X1-ZX1)*Math.min(1,(m-EXIT)/(T1-EXIT));
  const hm=m=>{const t=480+Math.round(m);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
  const dur=m=>{m=Math.round(m);return (m>=60?Math.floor(m/60)+' h ':'')+String(m%60).padStart(m>=60?2:1,'0')+' min'};
  const set=m=>{const x=xAt(m);dot.setAttribute('transform',`translate(${x},0)`);trail.setAttribute('x2',x);now.textContent=hm(m);
    const inside=m>=ENTER&&m<EXIT,done=m>=EXIT;
    zone.classList.toggle('on',inside);ent.style.opacity=m>=ENTER?1:0;ext.style.opacity=done?1:0;
    out.in.textContent=m>=ENTER?hm(ENTER):'not yet';out.out.textContent=done?hm(EXIT):(inside?'still inside':'not yet');
    out.dw.textContent=m<ENTER?'0 min':dur((done?EXIT:m)-ENTER);out.dwl.textContent=done?'Dwell':'Waiting now';
    out.dw.classList.toggle('wait',inside);r.setAttribute('aria-valuetext',hm(m))};
  r.addEventListener('input',()=>set(+r.value));set(+r.value);
  if(!still)inView(f,()=>{let m=0;const target=+r.value;const go=()=>{m+=3;if(m<target){set(m);requestAnimationFrame(go)}else set(target)};go()});
  // drag the trolley itself
  const svg=f.querySelector('svg');let drag=false;
  const toM=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const x=p.matrixTransform(svg.getScreenCTM().inverse()).x;
    let best=0,bd=1e9;for(let m=T0;m<=T1;m++){const d=Math.abs(xAt(m)-x);if(d<bd){bd=d;best=m}}return best};
  dot.addEventListener('pointerdown',e=>{drag=true;dot.setPointerCapture(e.pointerId)});
  dot.addEventListener('pointermove',e=>{if(!drag)return;const m=toM(e);r.value=m;set(m)});
  dot.addEventListener('pointerup',()=>drag=false);
});

/* ROUTE: dock to stock, one leg per step as the section scrolls */
document.querySelectorAll('[data-sig="route"]').forEach(f=>{
  const sec=f.closest('section'),legs=[...f.querySelectorAll('.leg')],steps=[...sec.querySelectorAll('.steps li')],path=f.querySelector('.path'),pal=f.querySelector('.pallet');
  if(still||!path)return;
  const L=path.getTotalLength();path.style.strokeDasharray=L;sec.classList.add('w-route-on');
  const stops=JSON.parse(f.dataset.stops);
  const upd=()=>{const r=f.getBoundingClientRect(),vh=innerHeight;let p=(vh*.85-r.top)/(r.height+vh*.35);p=Math.max(0,Math.min(1,p));
    path.style.strokeDashoffset=L*(1-p);const pt=path.getPointAtLength(L*p);pal.setAttribute('transform',`translate(${pt.x},${pt.y})`);
    const k=stops.filter(s=>p>=s).length-1;legs.forEach((l,i)=>l.style.opacity=i<=k?1:.15);steps.forEach((s,i)=>s.classList.toggle('on',i<=k&&i>=k))};
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
});
})();
