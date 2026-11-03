// Planner skin: runs inside the diagnostic page when it is opened from the homepage banner.
// It restyles the six questions (soft keycaps, beads, a little press), replaces the flat sketch with a
// living floor that builds itself from the answers, and turns the result into a report with a
// Today / With AmIMotion floor. Nothing here changes the questions or the profile text.
(() => {
  const root = document.querySelector('[data-diag]');
  if (!root || root.dataset.pl) return;
  root.dataset.pl = '1';
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = `
  :root{--pl-ink:#0b1238;--pl-soft:#5a6385;--pl-ind:#4b3df0;--pl-blue:#1f6bff;--pl-sky:#eef3fb;--pl-amber:#ffb020;--pl-red:#ff3b4e;
    --pl-disp:var(--font-display,ui-sans-serif),system-ui,sans-serif;--pl-ease:cubic-bezier(.22,.7,.2,1)}
  html,body{height:100%}
  #cursor,.cursor,.c-ring,.c-dot{display:none!important}
  main > section:has([data-diag]){height:100%;padding:0!important}
  .diag-shell{display:grid!important;grid-template-columns:minmax(0,.92fr) minmax(0,1.18fr)!important;column-gap:0!important;row-gap:0!important;height:100vh;align-items:stretch!important}
  .diag-main{grid-column:auto!important;min-height:0!important;overflow:auto;padding:clamp(22px,2.6vw,40px) clamp(20px,2.6vw,40px) 28px;scrollbar-width:thin;scrollbar-color:rgba(75,61,240,.25) transparent}
  .diag-visual{grid-column:auto!important;order:0!important;margin:12px 12px 12px 0!important;padding:0!important;border-radius:24px;position:relative;overflow:hidden;
    background:radial-gradient(120% 90% at 70% 0%,#ffffff 0,#f1f5fd 42%,#e4ebfa 100%);box-shadow:inset 0 1px 0 #fff,inset 0 0 0 1px rgba(75,61,240,.07),0 30px 60px -40px rgba(30,40,110,.35)}
  .diag-visual > svg{display:none!important}
  .diag-caption{position:absolute;left:0;right:0;bottom:0;padding:14px 22px 18px!important;font-size:.86rem!important;color:var(--pl-soft)!important;text-align:center;background:linear-gradient(transparent,rgba(238,243,251,.9) 40%)}
  /* top: count and six beads */
  .diag-top{gap:14px!important}
  .diag-count{font:500 .82rem/1 var(--pl-disp)!important;color:var(--pl-soft)!important;letter-spacing:.01em}
  .diag-bar.is-seg{gap:6px!important;height:8px!important}
  .diag-bar.is-seg i{border-radius:99px;background:#e6ebf6!important;box-shadow:inset 0 1px 2px rgba(20,30,80,.12);position:relative;overflow:hidden;transition:background .4s}
  .diag-bar.is-seg i.on{background:linear-gradient(90deg,var(--pl-ind),var(--pl-blue))!important;box-shadow:0 2px 8px -2px rgba(75,61,240,.55)}
  .diag-bar.is-seg i.cur{background:#d9defa!important}
  .diag-bar.is-seg i.cur::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(75,61,240,.5),transparent);animation:pl-sh 1.8s ease-in-out infinite}
  @keyframes pl-sh{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
  .diag-stage{padding-top:clamp(20px,3vh,36px)!important}
  .diag-stage h3,.diag-result h3{font:600 clamp(1.45rem,1.1rem + 1vw,2rem)/1.12 var(--pl-disp)!important;letter-spacing:-.03em!important;color:var(--pl-ink)}
  .diag-sub{color:var(--pl-soft)!important}
  .diag-q{animation:pl-in .42s var(--pl-ease) both}
  .diag-q.is-leaving{animation:pl-out .17s ease-in both}
  @keyframes pl-in{from{opacity:0;transform:translateY(10px)}}
  @keyframes pl-out{to{opacity:0;transform:translateY(-8px)}}
  .diag-options{grid-template-columns:1fr!important;gap:10px!important;margin-top:22px!important}
  .diag-opt{align-items:center;gap:14px!important;padding:14px 16px!important;border-radius:16px!important;background:#fff!important;color:var(--pl-ink)!important;
    box-shadow:inset 0 1px 0 #fff,inset 0 -3px 0 rgba(20,30,80,.05),0 1px 2px rgba(20,30,80,.06),0 10px 22px -16px rgba(30,40,110,.35)!important;
    transition:transform .22s var(--pl-ease),box-shadow .22s,background .25s!important;animation:pl-in .42s var(--pl-ease) both}
  .diag-opt:nth-child(2){animation-delay:.04s}.diag-opt:nth-child(3){animation-delay:.08s}.diag-opt:nth-child(4){animation-delay:.12s}.diag-opt:nth-child(5){animation-delay:.16s}
  .diag-opt:hover{transform:translateY(-2px);box-shadow:inset 0 1px 0 #fff,inset 0 -3px 0 rgba(20,30,80,.05),0 2px 4px rgba(20,30,80,.06),0 18px 30px -18px rgba(75,61,240,.45)!important}
  .diag-opt:active{transform:translateY(1px)}
  .diag-opt .key{display:grid!important;place-items:center;flex:none;width:30px;height:30px;border-radius:9px;font:600 .8rem/1 var(--pl-disp);color:var(--pl-soft);
    background:linear-gradient(#fbfcff,#eef2fb);box-shadow:inset 0 1px 0 #fff,inset 0 -2px 0 rgba(20,30,80,.08),0 1px 2px rgba(20,30,80,.12);transition:all .25s}
  .diag-opt b{font-weight:550!important}
  .diag-opt .txt span{color:var(--pl-soft)!important}
  .diag-opt[aria-pressed="true"]{background:linear-gradient(135deg,#5b4cff,#3a46ee 55%,#1f6bff)!important;color:#fff!important;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -3px 0 rgba(10,10,80,.25),0 16px 30px -16px rgba(75,61,240,.8)!important}
  .diag-opt[aria-pressed="true"] .txt span{color:rgba(255,255,255,.78)!important}
  .diag-opt[aria-pressed="true"] .key{background:#fff;color:var(--pl-ind);box-shadow:0 0 0 4px rgba(255,255,255,.18)}
  .diag-opt.is-hit{animation:pl-hit .42s var(--pl-ease)}
  @keyframes pl-hit{30%{transform:scale(.97)}70%{transform:scale(1.015)}}
  .diag-nav{margin-top:24px!important}
  .diag-back{color:var(--pl-soft)!important}
  [data-diag-next]{border:0!important;border-radius:999px!important;padding:14px 22px!important;font:600 .95rem/1 var(--pl-disp)!important;color:#fff!important;cursor:pointer;
    background:linear-gradient(135deg,#5b4cff,#2f4cf0)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 14px 26px -14px rgba(75,61,240,.9)!important;transition:transform .2s var(--pl-ease),opacity .2s}
  [data-diag-next]:hover{transform:translateY(-2px)}
  [data-diag-next]:disabled{opacity:.35;transform:none;box-shadow:none!important}
  :focus-visible{outline:2px solid var(--pl-blue)!important;outline-offset:3px}
  .diag-stage h3:focus,.diag-stage h3:focus-visible{outline:none!important}

  /* the living floor */
  .pl-stage{position:absolute;inset:0;perspective:1600px;overflow:hidden}
  .pl-cam{position:absolute;left:46%;top:50%;width:480px;height:250px;transform-style:preserve-3d;
    transform:translate(-50%,-50%) scale(var(--k,1)) rotateX(var(--rx,57deg)) rotateZ(var(--rz,-33deg));transition:transform 1.2s var(--pl-ease)}
  .pl-floor{position:absolute;inset:-26px;border-radius:28px;background:linear-gradient(140deg,#fdfeff,#eaf0fb);
    box-shadow:0 0 0 1px rgba(75,61,240,.06),10px 14px 0 #d8e0f1,24px 40px 60px rgba(30,40,110,.18)}
  .pl-floor::after{content:"";position:absolute;inset:0;border-radius:inherit;background-image:radial-gradient(rgba(75,61,240,.13) 1px,transparent 1.3px);background-size:14px 14px;opacity:.7}
  .pl-zone{position:absolute;border-radius:12px;background:linear-gradient(150deg,#fff,#f3f6fd);transition:background .6s,box-shadow .6s;
    box-shadow:inset 0 0 0 1px rgba(75,61,240,.07),4px 6px 0 #dfe6f4,10px 18px 22px -8px rgba(30,40,110,.22)}
  .pl-zone i{position:absolute;left:9px;top:8px;font:500 9.5px/1 var(--pl-disp);font-style:normal;color:#8a92b0;letter-spacing:.01em}
  .pl-zone.hot{background:radial-gradient(80% 90% at 50% 55%,rgba(255,176,32,.42),rgba(255,176,32,.12) 60%,#fff8ec)}
  .pl-zone.hot::after{content:"";position:absolute;left:50%;top:50%;width:70%;aspect-ratio:1;border-radius:50%;border:2px solid rgba(255,176,32,.7);transform:translate(-50%,-50%) scale(.3);animation:pl-ring 2.6s ease-out infinite}
  .pl-zone.in-pilot{background:linear-gradient(150deg,#f6f8ff,#e9eeff)}
  .pl-zone.hot.in-pilot{background:radial-gradient(80% 90% at 50% 55%,rgba(255,176,32,.42),rgba(255,176,32,.12) 60%,#fff8ec)}
  @keyframes pl-ring{to{transform:translate(-50%,-50%) scale(1.25);opacity:0}}
  .diag-visual svg.pl-flat{position:absolute;left:0;top:0;width:480px!important;height:250px!important;aspect-ratio:auto!important;overflow:visible;pointer-events:none}
  .pl-walk{fill:none;stroke:#0b1238;stroke-width:1.6;stroke-dasharray:1 6;stroke-linecap:round;opacity:.5}
  .pl-call{fill:none;stroke:#5a6385;stroke-width:1.2;stroke-dasharray:3 5;opacity:0;animation:pl-blink 3.6s infinite}
  .pl-call:nth-of-type(2){animation-delay:1.2s}.pl-call:nth-of-type(3){animation-delay:2.4s}
  @keyframes pl-blink{10%,35%{opacity:.6}50%{opacity:0}}
  .pl-pilot{fill:rgba(75,61,240,.04);stroke:var(--pl-ind);stroke-width:2;stroke-dasharray:7 6;animation:pl-march 1.4s linear infinite;rx:14px}
  @keyframes pl-march{to{stroke-dashoffset:-26}}
  .pl-sig{fill:none;stroke:url(#pl-g);stroke-width:1.6;stroke-dasharray:4 120;stroke-linecap:round;animation:pl-pkt 2.4s linear infinite}
  @keyframes pl-pkt{from{stroke-dashoffset:124}to{stroke-dashoffset:0}}
  .pl-sigbase{fill:none;stroke:rgba(31,107,255,.18);stroke-width:1}
  .pl-fog{position:absolute;inset:-26px;border-radius:28px;background:radial-gradient(60% 60% at 50% 50%,rgba(255,255,255,.5),rgba(240,244,252,.86));backdrop-filter:blur(3px);transition:opacity .9s}
  .pl-tok{position:absolute;width:0;height:0;transform-style:preserve-3d}
  .pl-sh{position:absolute;left:-12px;top:-6px;width:24px;height:12px;border-radius:50%;background:radial-gradient(rgba(20,30,80,.28),transparent 70%)}
  .pl-up{position:absolute;left:0;top:0;transform-origin:0 0;transform:rotateZ(33deg) rotateX(-57deg) translate(-50%,-100%)}
  .pl-pop{display:block;transform-origin:50% 100%;animation:pl-pop .55s cubic-bezier(.2,1.4,.4,1) both;animation-delay:var(--d,0ms)}
  @keyframes pl-pop{from{transform:scale(0) translateY(10px);opacity:0}}
  .diag-visual .pl-pop svg{display:block;overflow:visible;width:auto!important;height:auto!important;aspect-ratio:auto!important}
  .pl-tagdot{fill:#c3c9db;transition:fill .5s}
  .pl-tagring{fill:none;stroke:var(--pl-blue);stroke-width:1.5;opacity:0}
  .after .pl-tok.in .pl-tagdot{fill:var(--pl-blue)}
  .after .pl-tok.in .pl-tagring{animation:pl-tr 2.2s ease-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pl-tr{from{opacity:.9;transform:scale(.6)}to{opacity:0;transform:scale(2.6)}}
  .pl-walker{position:absolute;left:0;top:0;transform-style:preserve-3d;offset-rotate:0deg;animation:pl-walk 7s linear infinite}
  @keyframes pl-walk{from{offset-distance:0%}to{offset-distance:100%}}
  .pl-anchor .pl-pop{animation-duration:.7s}
  .pl-pulse{position:absolute;left:-36px;top:-36px;width:72px;height:72px;border-radius:50%;border:1.5px solid rgba(31,107,255,.4);background:radial-gradient(rgba(31,107,255,.12),transparent 70%);animation:pl-ap 2.8s ease-out infinite;animation-delay:var(--d,0ms)}
  @keyframes pl-ap{from{transform:scale(.1);opacity:1}to{transform:scale(1);opacity:0}}
  .pl-clock .hand{transform-origin:12px 12px;animation:pl-spin 4s linear infinite}
  .pl-clock .arc{transition:stroke-dashoffset 1.2s var(--pl-ease)}
  @keyframes pl-spin{to{transform:rotate(360deg)}}
  .pl-redp{position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:50%;background:radial-gradient(rgba(255,59,78,.35),transparent 65%);animation:pl-ap 2.4s ease-out infinite}
  .pl-before-only{transition:opacity .7s}.after .pl-before-only{opacity:0!important}
  .pl-after-only{opacity:0;transition:opacity .9s .3s}.after .pl-after-only{opacity:1}
  .pl-switch{position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:3;display:none;padding:4px;border-radius:999px;background:rgba(255,255,255,.72);backdrop-filter:blur(10px);
    box-shadow:inset 0 1px 0 #fff,0 0 0 1px rgba(75,61,240,.08),0 12px 24px -16px rgba(30,40,110,.45)}
  .is-result .pl-switch{display:flex}
  .pl-switch button{white-space:nowrap;border:0;background:none;padding:9px 16px;border-radius:999px;font:600 .82rem/1 var(--pl-disp);color:var(--pl-soft);cursor:pointer;transition:all .3s var(--pl-ease)}
  .pl-switch button[aria-pressed="true"]{color:#fff;background:linear-gradient(135deg,#5b4cff,#2f4cf0);box-shadow:0 8px 16px -10px rgba(75,61,240,.9)}

  /* the report */
  .is-result .diag-main{padding-top:clamp(18px,2vw,28px)}
  .diag-result{animation:pl-in .6s var(--pl-ease) both}
  .diag-result h3{font-size:clamp(1.7rem,1.2rem + 1.5vw,2.5rem)!important;background:linear-gradient(120deg,#0b1238 30%,#4b3df0);-webkit-background-clip:text;background-clip:text;color:transparent!important;padding-bottom:2px}
  .diag-heard{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px!important}
  .diag-heard span{font-size:.8rem;padding:7px 11px;border-radius:999px;background:#fff;color:var(--pl-ink);box-shadow:inset 0 -2px 0 rgba(20,30,80,.05),0 6px 14px -10px rgba(30,40,110,.4)}
  .diag-heard span+span::before{content:none!important}
  .pl-book{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:20px}
  .pl-book a{display:inline-flex;align-items:center;gap:10px;padding:16px 26px;border-radius:999px;color:#fff;text-decoration:none;font:600 1rem/1 var(--pl-disp);
    background:linear-gradient(135deg,#5b4cff,#3a46ee 55%,#1f6bff);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -3px 0 rgba(10,10,80,.25),0 20px 36px -18px rgba(75,61,240,.95);transition:transform .25s var(--pl-ease)}
  .pl-book a:hover{transform:translateY(-2px)}
  .pl-book a::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--pl-amber);box-shadow:0 0 0 4px rgba(255,176,32,.25);animation:pl-dot 1.8s ease-in-out infinite}
  @keyframes pl-dot{50%{box-shadow:0 0 0 7px rgba(255,176,32,0)}}
  .diag-block{margin-top:22px!important}
  .diag-h{font:600 .78rem/1 var(--pl-disp)!important;color:var(--pl-ind)!important;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px!important}
  .diag-block > ol{list-style:none;padding:0;margin:0;display:grid;gap:10px;counter-reset:pl}
  .diag-block > ol li{counter-increment:pl;position:relative;padding:14px 16px 14px 52px;border-radius:16px;background:#fff;color:#2b3150!important;line-height:1.5;
    box-shadow:inset 0 -2px 0 rgba(20,30,80,.04),0 12px 24px -18px rgba(30,40,110,.4)}
  .diag-block > ol li::before{content:counter(pl);position:absolute;left:14px;top:13px;width:26px;height:26px;border-radius:9px;display:grid;place-items:center;font:600 .8rem/1 var(--pl-disp);color:var(--pl-ind);
    background:linear-gradient(#f6f5ff,#e8e6ff);box-shadow:inset 0 -2px 0 rgba(75,61,240,.12)}
  .diag-block.pilot{position:relative;overflow:hidden;border-radius:22px!important;padding:22px 22px 20px!important;color:#fff;
    background:radial-gradient(120% 140% at 0% 0%,#5b4cff 0,#4b3df0 40%,#2a3fe0 75%,#1f6bff 100%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 30px 50px -30px rgba(75,61,240,.8)}
  .diag-block.pilot::before{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(rgba(255,255,255,.28),transparent 65%)}
  .diag-block.pilot .diag-h{color:rgba(255,255,255,.75)!important}
  .diag-block.pilot p{font-size:1.06rem!important;line-height:1.5!important;color:#fff;position:relative}
  .diag-block.pilot ul{list-style:none;padding:0;margin:0;display:grid;gap:8px;color:#fff!important;position:relative}
  .diag-block.pilot ul li{position:relative;padding-left:26px;line-height:1.45}
  .diag-block.pilot ul li::before{content:"";position:absolute;left:2px;top:.45em;width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.2),0 0 14px rgba(140,190,255,.9)}
  .diag-block ul.ask{list-style:none;padding:0;margin:0;display:grid;gap:8px}
  .diag-block ul.ask li{padding:12px 16px;border-left:3px solid var(--pl-amber);border-radius:4px 14px 14px 4px;background:rgba(255,255,255,.7);color:#2b3150;font-style:italic}
  .diag-lead{margin-top:24px!important;padding:20px;border-radius:22px;background:rgba(255,255,255,.75);box-shadow:inset 0 1px 0 #fff,0 0 0 1px rgba(75,61,240,.07),0 20px 40px -30px rgba(30,40,110,.5)}
  .diag-lead input{background:#f4f7fd!important;border-radius:12px!important;box-shadow:inset 0 2px 4px rgba(20,30,80,.07)}
  .diag-lead button[type=submit]{border:0;border-radius:999px!important;color:#fff!important;background:#0b1238!important;font-weight:600}
  .diag-result .actions{display:flex;gap:18px;margin-top:18px}
  @media (max-width:760px){
    html,body{height:auto}
    .diag-shell{grid-template-columns:1fr!important;height:auto}
    .diag-visual{order:-1!important;margin:10px!important;height:46vh;min-height:280px}
    .diag-main{overflow:visible;padding:18px 16px 26px}
    .pl-switch button{padding:8px 12px}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------------------------------------------------------------- the floor
  const vis = root.querySelector('.diag-visual');
  const Z = { dock: [20, 18, 96, 88, 'Dock'], mach: [132, 18, 150, 88, 'Machining'], queue: [298, 18, 74, 88, 'Queue'], asm: [388, 18, 72, 214, 'Assembly'],
    stage: [20, 142, 96, 90, 'Staging'], rework: [132, 142, 72, 90, 'Rework'], qc: [220, 142, 152, 90, 'Inspection'] };
  const WAITZ = { machasm: ['queue'], qc: ['qc'], dock: ['dock', 'stage'], rework: ['rework'], unknown: [] };
  const DOTS = {
    carriers: [[60, 66], [190, 70], [240, 52], [318, 64], [345, 48], [250, 186]],
    tools: [[160, 44], [300, 182], [175, 186]],
    vehicles: [[52, 124], [96, 190]],
    robots: [[230, 124], [372, 124]],
    goods: [[46, 172], [66, 176], [50, 196]],
  };
  const ART = {
    carriers: '<svg width="26" height="26" viewBox="0 0 26 26"><rect x="3" y="7" width="20" height="12" rx="3" fill="#2b3152"/><rect x="3" y="7" width="20" height="4" rx="2" fill="#3c4470"/><circle cx="7" cy="22" r="2.2" fill="#1a1f38"/><circle cx="19" cy="22" r="2.2" fill="#1a1f38"/><circle class="pl-tagring" cx="19" cy="5" r="3"/><circle class="pl-tagdot" cx="19" cy="5" r="3"/></svg>',
    tools: '<svg width="20" height="22" viewBox="0 0 20 22"><rect x="4" y="5" width="12" height="12" rx="2.5" transform="rotate(45 10 11)" fill="#59618a"/><circle class="pl-tagring" cx="10" cy="3" r="2.6"/><circle class="pl-tagdot" cx="10" cy="3" r="2.6"/></svg>',
    vehicles: '<svg width="36" height="30" viewBox="0 0 36 30"><rect x="4" y="12" width="22" height="11" rx="3" fill="#2b3152"/><rect x="8" y="5" width="11" height="9" rx="2" fill="none" stroke="#2b3152" stroke-width="2"/><path d="M29 4v20h6" stroke="#59618a" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="9" cy="25" r="3" fill="#1a1f38"/><circle cx="22" cy="25" r="3" fill="#1a1f38"/><circle class="pl-tagring" cx="13" cy="3" r="2.8"/><circle class="pl-tagdot" cx="13" cy="3" r="2.8"/></svg>',
    robots: '<svg width="26" height="22" viewBox="0 0 26 22"><rect x="2" y="8" width="22" height="12" rx="6" fill="#2b3152"/><circle cx="13" cy="14" r="2.4" fill="#8fb4ff"/><circle class="pl-tagring" cx="13" cy="4" r="2.8"/><circle class="pl-tagdot" cx="13" cy="4" r="2.8"/></svg>',
    goods: '<svg width="22" height="24" viewBox="0 0 22 24"><rect x="3" y="8" width="16" height="13" rx="2" fill="#7b6a52"/><path d="M3 12h16M11 8v13" stroke="#5e4f3c" stroke-width="1"/><rect x="2" y="20" width="18" height="3" rx="1" fill="#4a3f30"/><circle class="pl-tagring" cx="11" cy="4" r="2.6"/><circle class="pl-tagdot" cx="11" cy="4" r="2.6"/></svg>',
  };
  const PERSON = '<svg width="16" height="26" viewBox="0 0 16 26"><circle cx="8" cy="5" r="4" fill="#0b1238"/><rect x="3" y="10" width="10" height="14" rx="5" fill="#0b1238"/></svg>';
  const ANCHOR = '<svg width="22" height="54" viewBox="0 0 22 54"><rect x="10" y="14" width="2.4" height="40" rx="1.2" fill="#aab4d2"/><rect x="1" y="1" width="20" height="16" rx="5" fill="#2b2f3a"/><rect x="1" y="1" width="20" height="5" rx="2.5" fill="#3d4252"/><circle cx="11" cy="10" r="3" fill="#5d8bff"/><circle cx="11" cy="10" r="6" fill="none" stroke="#5d8bff" stroke-opacity=".35"/></svg>';
  const CLOCK = (arc) => `<svg class="pl-clock" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#fff" stroke="rgba(11,18,56,.08)"/><circle class="arc" cx="12" cy="12" r="8" fill="none" stroke="#ffb020" stroke-width="3" stroke-dasharray="50.3" stroke-dashoffset="${50.3 * (1 - arc)}" transform="rotate(-90 12 12)" stroke-linecap="round"/><path class="hand" d="M12 12V6" stroke="#0b1238" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1.4" fill="#0b1238"/></svg>`;
  const JOB = (kind) => `<svg width="26" height="20" viewBox="0 0 26 20"><rect x="1" y="1" width="24" height="18" rx="4" fill="#fff" stroke="${kind === 'solid' ? '#4b3df0' : '#9aa3c0'}" stroke-width="1.5" ${kind === 'solid' ? '' : 'stroke-dasharray="3 2"'}/>${kind === 'none' ? '<text x="13" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#ff3b4e">?</text>' : `<path d="M6 7h14M6 11h10M6 15h12" stroke="${kind === 'solid' ? '#4b3df0' : '#b6bdd4'}" stroke-width="1.6" stroke-linecap="round"/>`}</svg>`;
  const BOARD = '<svg width="34" height="34" viewBox="0 0 34 34"><rect x="1" y="1" width="32" height="22" rx="3" fill="#fff" stroke="#c9d0e4"/><path d="M6 8h12M6 13h18M6 18h9" stroke="#ff3b4e" stroke-width="1.4" stroke-linecap="round" opacity=".7"/><path d="M8 23l-3 10M26 23l3 10" stroke="#9aa3c0" stroke-width="1.6"/></svg>';

  const stageEl = document.createElement('div'); stageEl.className = 'pl-stage';
  stageEl.innerHTML = '<div class="pl-cam"></div>';
  const sw = document.createElement('div'); sw.className = 'pl-switch'; sw.setAttribute('role', 'group');
  sw.innerHTML = '<button type="button" data-m="before" aria-pressed="false">Today</button><button type="button" data-m="after" aria-pressed="true">With AmIMotion</button>';
  vis.prepend(stageEl); vis.prepend(sw);
  const cam = stageEl.firstElementChild;
  const fit = () => { const w = vis.clientWidth, h = vis.clientHeight; cam.style.setProperty('--k', Math.min(w / 600, h / 430).toFixed(3)); };
  new ResizeObserver(fit).observe(vis); fit();
  // a gentle, game-like camera: it breathes, and leans toward the pointer
  let px = 0, py = 0, t0 = performance.now();
  vis.addEventListener('pointermove', (e) => { const r = vis.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5; });
  vis.addEventListener('pointerleave', () => { px = py = 0; });
  if (!REDUCED) (function breathe(now) {
    const s = Math.sin((now - t0) / 4200);
    cam.style.setProperty('--rz', (-33 + s * 1.6 + px * 5).toFixed(2) + 'deg');
    cam.style.setProperty('--rx', (57 + py * -4).toFixed(2) + 'deg');
    requestAnimationFrame(breathe);
  })(t0);

  let mode = 'before', last = null, seen = new Set();
  const tok = (key, x, y, inner, extra = '', d = 0) => {
    const isNew = !seen.has(key); seen.add(key);
    return `<div class="pl-tok ${extra}" style="left:${x}px;top:${y}px"><div class="pl-sh"></div><div class="pl-up"><span class="pl-pop" style="${isNew && !REDUCED ? `--d:${d}ms` : 'animation:none'}">${inner}</span></div></div>`;
  };
  function draw(A, result) {
    const hot = WAITZ[A.wait] || [];
    const box = { cell: hot.length ? Z[hot[0]] : Z.queue, line: [124, 10, 344, 102], hall: [12, 10, 456, 228], plant: [4, 4, 472, 240] }[A.scope];
    const inBox = (x, y) => box && x >= box[0] - 8 && x <= box[0] + box[2] + 8 && y >= box[1] - 8 && y <= box[1] + box[3] + 8;
    let h = '<div class="pl-floor"></div>';
    for (const [k, [x, y, w, hh, l]] of Object.entries(Z)) {
      const ip = box && inBox(x + w / 2, y + hh / 2);
      h += `<div class="pl-zone${hot.includes(k) ? ' hot' : ''}${ip ? ' in-pilot' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px"><i>${l}</i></div>`;
    }
    // flat layer: paths, the pilot outline, signal lines
    let f = '<svg class="pl-flat" viewBox="0 0 480 250" width="480" height="250"><defs><linearGradient id="pl-g"><stop offset="0" stop-color="#4b3df0"/><stop offset="1" stop-color="#1f6bff"/></linearGradient></defs>';
    const WALK = 'M14 244 C110 214 150 132 236 128 S330 112 334 62';
    if (A.found === 'walk') f += `<path class="pl-walk pl-before-only" d="${WALK}"/>`;
    if (A.found === 'call') f += `<g class="pl-before-only"><path class="pl-call" d="M10 238 Q80 140 66 62"/><path class="pl-call" d="M10 238 Q180 200 206 66"/><path class="pl-call" d="M10 238 Q260 250 330 64"/></g>`;
    let anchors = [];
    if (box) {
      const [x, y, w, hh] = box;
      f += `<rect class="pl-pilot" x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${hh + 12}" rx="14"/>`;
      anchors = [[x - 6, y - 6], [x + w + 6, y - 6], [x + w + 6, y + hh + 6], [x - 6, y + hh + 6]];
    }
    const set = new Set(A.assets || []);
    const items = [];
    for (const k of Object.keys(DOTS)) if (set.has(k)) DOTS[k].forEach(([x, y], n) => items.push([k, n, x, y]));
    if (anchors.length) {
      f += '<g class="pl-after-only">';
      for (const [k, n, x, y] of items) if (inBox(x, y)) {
        const a = anchors.reduce((b, p) => (Math.hypot(p[0] - x, p[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? p : b));
        f += `<line class="pl-sigbase" x1="${a[0]}" y1="${a[1]}" x2="${x}" y2="${y}"/><line class="pl-sig" style="animation-delay:${(n * 330) % 2400}ms" x1="${a[0]}" y1="${a[1]}" x2="${x}" y2="${y}"/>`;
      }
      f += '</g>';
    }
    f += '</svg>';
    h += f;
    // standing things
    items.forEach(([k, n, x, y]) => { h += tok(`${k}${n}`, x, y, ART[k], inBox(x, y) ? 'in' : '', n * 70); });
    if (A.found === 'walk') h += `<div class="pl-walker pl-before-only" style="offset-path:path('${WALK}')"><div class="pl-tok">${'<div class="pl-sh"></div><div class="pl-up"><span class="pl-pop" style="animation:none">' + PERSON + '</span></div>'}</div></div>`;
    if (A.found === 'call') h += `<div class="pl-before-only">${tok('caller', 10, 238, PERSON)}</div>`;
    if (A.found === 'board') h += `<div class="pl-before-only">${tok('board', 30, 246, BOARD)}</div>`;
    if (A.found === 'mes') h += `<div class="pl-before-only" style="opacity:.4">${tok('ghost', 200, 60, ART.carriers.replace('#2b3152', 'none" stroke="#2b3152" stroke-dasharray="2 2'))}</div>`;
    if (A.found === 'late') h += `<div class="pl-before-only"><div class="pl-tok" style="left:424px;top:124px"><div class="pl-redp"></div></div></div>`;
    if (A.link && set.has('carriers')) h += tok(`job-${A.link}`, 334, 40, JOB(A.link === 'mes' || A.link === 'scan' ? 'solid' : A.link === 'none' ? 'none' : 'weak'));
    hot.forEach((k) => { const [x, y, w, hh] = Z[k]; h += tok(`clock-${k}`, x + w - 16, y + 18, CLOCK(result && mode === 'after' ? .78 : .5)); });
    if (A.wait === 'unknown') h += '<div class="pl-fog pl-before-only"></div>';
    anchors.forEach(([x, y], n) => { h += `<div class="pl-after-only">${`<div class="pl-tok pl-anchor" style="left:${x}px;top:${y}px"><div class="pl-pulse" style="--d:${n * 600}ms"></div><div class="pl-sh"></div><div class="pl-up"><span class="pl-pop" style="--d:${300 + n * 140}ms">${ANCHOR}</span></div></div>`}</div>`; });
    cam.innerHTML = h;
  }
  const setMode = (m) => {
    mode = m; vis.classList.toggle('after', m === 'after');
    sw.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
    if (last) draw(last.A, last.result);
  };
  sw.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setMode(b.dataset.m); });

  const book = () => {
    const res = root.querySelector('.diag-result');
    if (!res || res.querySelector('.pl-book')) return;
    const href = (document.documentElement.dataset.root ?? '../') + 'contact/' + (document.documentElement.dataset.index || 'index.html');
    const d = document.createElement('div'); d.className = 'pl-book';
    d.innerHTML = `<a href="${href}" target="_top">Book a call</a>`;
    res.querySelector('.diag-heard').after(d);
  };
  const on = (detail) => {
    last = detail;
    if (detail.result) { setTimeout(book, 0); if (mode !== 'after') { draw(detail.A, true); setTimeout(() => setMode('after'), REDUCED ? 0 : 700); return; } }
    else if (mode === 'after') { mode = 'before'; vis.classList.remove('after'); }
    draw(detail.A, detail.result);
  };
  document.addEventListener('amimotion:diag', (e) => on(e.detail));
  if (root.__diag) on(root.__diag);
})();
