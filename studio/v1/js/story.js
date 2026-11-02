// One continuous scroll film over the model hall, told in beats: every scroll plays one picture,
// and the words on the left light up as the picture says them.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
export const FS = `precision highp float;varying vec2 v;
uniform sampler2D tA,tB,tM;uniform vec2 res,span,tagPos,bayC,waveC;uniform vec3 cam;uniform vec4 vr;
uniform float draw,dash,amber,onlyQ,hidePaths,bay,tagOn,time,grey,wave,dof,sky;
uniform vec4 spot,lpos;uniform vec3 ltgt;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vec2(v.x,1.-v.y);
  vec2 iu=cam.xy+(uv-.5)*span/cam.z;
  // a lens on a model: sharp through the middle of the frame, falling softly out of focus toward its edges
  vec2 fu=(uv-vr.xy)/vr.zw; float tilt=smoothstep(.2,.56,abs(fu.y-.5))*1.6+smoothstep(.3,.62,abs(fu.x-.5))*.7;
  // the focus: one place on the floor in light, the rest falls back, softer and quieter
  float sd0=length((iu-spot.xy)*vec2(.8,1.));float out0=smoothstep(spot.z,spot.z*1.9+.02,sd0)*spot.w;
  // the loupe: a lens over the render itself, magnifying one thing on the floor
  vec2 ld=(uv-lpos.xy)*res/res.y;float lr=length(ld);float inL=(1.-smoothstep(lpos.z-.0015,lpos.z,lr))*step(.001,lpos.w);
  vec2 liu=ltgt.xy+(uv-lpos.xy)*span/(cam.z*ltgt.z);
  iu=mix(iu,liu,inL);
  float lb=mix(tilt*dof+out0*1.6,0.,inL);
  vec3 A=texture2D(tA,iu,lb).rgb,B=texture2D(tB,iu,lb).rgb,M=texture2D(tM,iu).rgb;
  // the landing's reveal: inside the wave the plant is already known
  float wd=length((iu-waveC)*vec2(.8,1.));
  float inW=(1.-smoothstep(wave-.05,wave,wd))*step(.001,wave);
  float onPath=step(.004,M.g)*M.r;
  float line=onPath*max(1.-smoothstep(draw-.015,draw+.015,M.g),inW)*(1.-hidePaths);
  float scans=onPath*(1.-smoothstep(.0,.035,abs(fract(M.g*5.+.5)-.5)))*dash*(1.-line);
  float am=step(.02,M.b)*max(amber,inW)*(onlyQ>.5?step(iu.x,.62):1.);
  float k=max(max(line,scans),am);
  vec3 col=mix(B,A,k);
  // the front of each drawing path glows
  float front=onPath*exp(-pow((M.g-draw)/.02,2.))*(1.-hidePaths)*step(.01,draw)*step(draw,1.02);
  col=mix(col,vec3(.35,.62,1.),front*.8);
  // the wave's edge: a soft band of light passing over the floor
  float band=exp(-pow((wd-wave)/.018,2.))*step(.001,wave)*(1.-smoothstep(1.,1.25,wave));
  col=mix(col,vec3(.86,.92,1.),band*.55);col=mix(col,vec3(.3,.55,1.),band*onPath*.6);
  // one bay in colour
  vec2 bd=(iu-bayC)*vec2(.8,1.25);float bl=length(bd);
  float inBay=(1.-smoothstep(bay-.035,bay+.02,bl))*step(.001,bay);
  col=mix(col,A,inBay);
  // the tag, located
  vec2 tp=(tagPos-cam.xy)/span*cam.z+.5; vec2 dp=(uv-tp)*res; float dd=length(dp)/(res.y*.001);
  float pulse=fract(time*.55);
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(8.,9.5,dd)));
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(0.,2.,abs(dd-(12.+pulse*60.))))*(1.-pulse)*.6);
  // daylight through the roof: soft panes drift across the plant; outside them the light is cooler and lower
  vec2 fl=mat2(.72,.69,-.62,.79)*(iu*vec2(1.,1.25));   // the floor's own axes in the render
  vec2 sq=fl+vec2(time*.004,time*.0012); vec2 sc=vec2(.3,.22); vec2 sl=mod(sq+sc*.5,sc)-sc*.5;
  vec2 sd=abs(sl)-vec2(.085,.03)+.03; float pane=1.-smoothstep(-.03,.05,length(max(sd,0.))+min(max(sd.x,sd.y),0.)-.03);
  col*=mix(vec3(1.),mix(vec3(.955,.968,1.0),vec3(1.025,1.012,.985),pane),sky);
  // cooler, quieter grade for "before"
  float g=dot(col,vec3(.299,.587,.114));col=mix(col,mix(vec3(g),col,.2)*vec3(.97,.985,1.02),grey*(1.-k)*(1.-inBay)*.6);
  // outside the focus: a pale, cool haze
  float gq=dot(col,vec3(.299,.587,.114));col=mix(col,mix(vec3(gq),col,.25)*.42+vec3(.93,.95,.99)*.58,out0*(1.-inL)*.9);
  col=mix(col,col*col*(3.-2.*col),.14);
  // the lens itself: a slight lift inside, a soft falloff at its rim, and its shadow on the floor
  col=mix(col,col*1.03,inL);col*=1.-inL*smoothstep(lpos.z*.7,lpos.z,lr)*.07;
  float lsh=(1.-inL)*exp(-pow(max(0.,lr-lpos.z)/(.03),2.))*step(.001,lpos.w)*lpos.w;col*=1.-lsh*.12;
  vec2 pu=(uv-vr.xy)/vr.zw;float vg=smoothstep(.5,1.2,length((pu-.5)*vec2(1.2,1.)));col*=mix(vec3(1.),vec3(.955,.965,.995),vg);col+=vec3(.014,.016,.02)*(1.-smoothstep(0.,.9,length((pu-vec2(.18,.08))*vec2(1.,1.2))));
  col+=(h(floor(uv*res))-.5)*.012;
  gl_FragColor=vec4(col,1.);}`;

// ---------- the floor: everything found in the render itself ----------
export const T = [0.4792, 0.4848];      // the AmIGo rendered on the lone trolley's deck: the hero's tag lands here
export const LAND_Z = () => innerWidth > 900 ? 2.2 : 3.0;   // how close the landing is
export const WIDE = [0.5, 0.5, 1.0];                         // the whole plant, where the film opens
export const plateSize = () => { const px = Math.max(innerWidth, innerHeight * .8) * Math.min(devicePixelRatio, 2); return innerWidth > 900 ? (px > 1200 ? 2400 : 1600) : (px > 900 ? 1600 : 800); };
export const LOCK = { r: 15, len: 6, w: 2 };
// the plates, loaded to power-of-two sizes with mipmaps so the lens can soften them; the masks stay exact
export function plateTex(gl, src, unit, mip = true) {
  return new Promise((res) => {
    const im = new Image(); im.decoding = 'async'; im.crossOrigin = 'anonymous';
    im.onload = () => {
      let srcEl = im;
      if (mip) { const P2 = (n) => Math.pow(2, Math.round(Math.log2(n))); const c = document.createElement('canvas'); c.width = Math.min(4096, P2(im.naturalWidth)); c.height = Math.min(4096, P2(im.naturalHeight)); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height); srcEl = c; }
      const tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, srcEl);
      if (mip) gl.generateMipmap(gl.TEXTURE_2D);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
      res();
    };
    im.src = src;
  });
}
// every tag rendered on the floor (dark AmIGo pixels found in the plate): the trolley first, then bin, tool and the rest
export const MOVERS = [[.4792, .4848], [.2375, .3206], [.1945, .4275], [.7213, .2755], [.8975, .6083], [.1871, .6205], [.5101, .7342], [.3728, .7992], [.2201, .8717], [.8857, .7407]];
export const moverDist = (m) => Math.hypot((m[0] - T[0]) * .8, m[1] - T[1]);
const BIN = MOVERS[2], TOOL = MOVERS[3];
const ANCH = [[.4396, .03], [.8745, .2287], [.222, .075]];   // the AmIMo anchors rendered on the columns
const GATES = [[.262, .124], [.316, .394]];
const STORES = [.66, .17];
const WAITS = [[.269, .891, .82], [.42, .825, .64], [.546, .762, .6], [.854, .603, .38]];
const ZONES = [[.81, .6, .11, .075], [.22, .64, .13, .085]];   // two more floor zones for "before you decide on more"
const WALK1 = [[.97, .99], [.86, .9], [.93, .76], [.8, .67], [.64, .56], [.71, .44], [.63, .4]];
const WALK2 = [[.63, .4], [.5, .43], [.33, .37], [.26, .45], [.12, .5], [.17, .64], [.3, .58], [.41, .52], [.462, .505]];
const LOOK1 = [[.8, .67, 3], [.71, .44, 5]], LOOK2 = [[.33, .37, 2], [.12, .5, 4], [.17, .64, 5]];

// ---------- the beats: one picture per scroll; each plays on its own clock once you reach it, then holds ----------
// sp = where the light falls [u, v, radius], sk = how far the rest falls back, lz = the lens on, lt = what it magnifies
const S0 = { cam: WIDE, draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0, sp: [T[0], T[1], .5], sk: 0, lz: 0, lt: [T[0], T[1]] };
const st = (o) => Object.assign({ draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1, sp: [.5, .5, .6], sk: 0, lz: 0, lt: [T[0], T[1]] }, o);
const WC = [.44, .82];
export const BEATS = [
  st({ ch: 0, cam: [.52, .55, 1.06], hide: 1, sp: [T[0], T[1], .09], sk: .55 }),         // Think of the last time someone went looking for a trolley.
  st({ ch: 0, cam: [.66, .6, 1.16], sp: [.8, .7, .14], sk: .5 }),                          // The walk.
  st({ ch: 0, cam: [.6, .4, 1.16], sp: [.65, .3, .17], sk: .5 }),                          // The calls to stores.
  st({ ch: 0, cam: [.4, .5, 1.12], sp: [.3, .5, .15], sk: .5 }),                           // The second walk.
  st({ ch: 1, cam: [.36, .3, 1.4], sp: [.29, .26, .17], sk: .45 }),                        // A scan tells you where it last passed.
  st({ ch: 1, cam: [.4, .38, 1.3], sp: [.29, .26, .13], sk: .92 }),                        // Between scans ... out of sight.
  st({ ch: 2, cam: [.48, .5, 1.9], sp: [T[0], T[1], .05], sk: .6, lz: 1, lt: T }),        // A small tag rides on each trolley,
  st({ ch: 2, cam: [.34, .46, 1.5], sp: [BIN[0], BIN[1], .05], sk: .6, lz: 1, lt: BIN }), // bin
  st({ ch: 2, cam: [.58, .36, 1.4], sp: [TOOL[0], TOOL[1], .05], sk: .6, lz: 1, lt: TOOL }), // and tool.
  st({ ch: 2, cam: [.6, .24, 1.3], sp: [.6, .17, .2], sk: .35, lz: 1, lt: [.8745, .2287] }), // Anchors on your columns
  st({ ch: 2, cam: [.52, .3, 1.12], sp: [.55, .3, .3], sk: .3 }),                          // hear its signal.
  st({ ch: 3, cam: [.5, .5, 1.3], sp: [T[0], T[1], .07], sk: .6 }),                        // A tag tells you where it stopped.
  st({ ch: 3, cam: [.5, .5, 1.0], draw: 1.03, grey: 0, sp: [.5, .5, .7], sk: 0 }),         // One live map shows where it went
  st({ ch: 3, cam: [.48, .5, 1.36], draw: 1.03, grey: 0, sp: [T[0], T[1], .09], sk: .4 }), // and how long it has waited.
  st({ ch: 4, cam: [.55, .74, 1.3], draw: 1.03, amber: 1, grey: 0, sp: [WC[0], WC[1], .3], sk: .35 }),  // See where work waits.
  st({ ch: 4, cam: [.55, .74, 1.3], draw: 1.03, amber: 1, grey: 0, sp: [WC[0], WC[1], .3], sk: .35 }),  // You see how long each one has waited,
  st({ ch: 4, cam: [.55, .74, 1.36], draw: 1.03, amber: 1, grey: 0, sp: [WC[0], WC[1], .3], sk: .35 }), // while it is still waiting.
  st({ ch: 5, cam: [.48, .74, 1.2], draw: 1.03, amber: 1, onlyQ: 1, hide: 1, sp: [.41, .84, .17], sk: .85 }), // Ask your floor a question.
  st({ ch: 5, cam: [.48, .74, 1.2], draw: 1.03, amber: 1, onlyQ: 1, hide: 1, sp: [.41, .84, .17], sk: .85 }), // Which trolleys ...?
];
export const NB = BEATS.length;
const SNAP = /[?&]still\b/.test(location.search); // screenshots: no easing lag
const PLAY = .92;
export const REST = BEATS.map((_, i) => (i + .78) / NB);
export const CH_FIRST = [0, 1, 2, 3, 4, 5].map((c) => BEATS.findIndex((b) => b.ch === c));
const KEYS = ['cam', 'draw', 'dash', 'amber', 'onlyQ', 'hide', 'bay', 'dot', 'grey', 'sp', 'sk', 'lz', 'lt'];

function sample(bf) {
  const b = Math.min(NB - 1, Math.floor(bf)), u = clamp(bf - b), a = b ? BEATS[b - 1] : S0, z = BEATS[b], k = sm(0, 1, u / PLAY);
  const o = {}; for (const key of KEYS) o[key] = Array.isArray(a[key]) ? a[key].map((x, j) => lerp(x, z[key][j], k)) : lerp(a[key], z[key], k);
  if (b === 12) o.draw = clamp(u / PLAY) * 1.03;    // the paths draw on a steady clock so their fronts read
  if (b === 0) { o.draw = 1.03; o.hide = sm(0, PLAY * .7, u); }
  // the light walks with the person
  if (b === 1 || b === 3) { const w = along(b === 1 ? WALK1 : WALK2, clamp(u / PLAY)); o.sp = [lerp(o.sp[0], w[0], k), lerp(o.sp[1], w[1], k), o.sp[2]]; }
  return o;
}
// what each beat's words point at on the floor
function targetOf(b, k) {
  switch (b) {
    case 0: case 5: case 6: case 10: case 11: case 13: return T;
    case 1: return along(WALK1, k); case 3: return along(WALK2, k);
    case 2: return STORES; case 4: return GATES[1];
    case 7: return BIN; case 8: return TOOL; case 9: return ANCH[1];
    case 14: return WAITS[0]; case 15: return WAITS[1]; case 16: return WAITS[2];
    default: return null;
  }
}

export function story(section, canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['vr', 'tA', 'tB', 'tM', 'res', 'span', 'tagPos', 'bayC', 'waveC', 'cam', 'draw', 'dash', 'amber', 'onlyQ', 'hidePaths', 'bay', 'tagOn', 'time', 'grey', 'wave', 'dof', 'sky', 'spot', 'lpos', 'ltgt'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const big = plateSize();
  let ready = false;
  Promise.all([plateTex(gl, `assets/scene/hall-after-${big}.webp`, 0), plateTex(gl, `assets/scene/hall-before-${big}.webp`, 1), plateTex(gl, `assets/scene/hall-masks-${big}.png`, 2, false)]).then(() => {
    gl.uniform1f(U.sky, 1); gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); gl.uniform4f(U.vr, 0, 0, 1, 1); gl.uniform1f(U.wave, 0); gl.uniform2f(U.waveC, T[0], T[1]); ready = true; canvas.classList.add('ready');
  });
  let span = [1, 1];
  const hud = section.querySelector('#storyHUD'), hctx = hud && hud.getContext('2d');
  const size = () => { const d = Math.min(devicePixelRatio, 1.75); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); const ra = canvas.width / canvas.height, ia = .8; span = ra > ia ? [1, ia / ra] : [ra / ia, 1]; if (hud) { hud.width = canvas.width; hud.height = canvas.height; } };
  size(); addEventListener('resize', size);
  section.dataset.beats = NB;

  // the threads: a hairline from the words being read to the thing they name on the floor
  const sticky = section.querySelector('.story-sticky'), qEl = section.querySelector('.q-big');
  const NS = 'http://www.w3.org/2000/svg', thread = document.createElementNS(NS, 'svg'); thread.setAttribute('class', 'q-thread'); thread.setAttribute('aria-hidden', 'true');
  const tps = [0, 1, 2].map(() => { const g = document.createElementNS(NS, 'path'); g.setAttribute('pathLength', '1'); thread.appendChild(g); return g; });
  const tds = [0, 1, 2].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '3.5'); thread.appendChild(c); return c; });
  sticky.appendChild(thread);
  const wire = document.createElementNS(NS, 'svg'); wire.setAttribute('class', 'w-thread'); wire.setAttribute('aria-hidden', 'true');
  const wp = document.createElementNS(NS, 'path'); wp.setAttribute('pathLength', '1'); const wd = document.createElementNS(NS, 'circle'); wd.setAttribute('r', '2.6'); const ws = document.createElementNS(NS, 'circle'); ws.setAttribute('r', '2'); ws.setAttribute('class', 'ws');
  wire.append(wp, wd, ws); sticky.appendChild(wire);
  const caps = [...section.querySelectorAll('.cap')], links = [...section.querySelectorAll('.rail a')];
  const frags = [...section.querySelectorAll('[data-b]')].map((el) => [el, +el.dataset.b]);
  const fragAt = (i) => { let el = null; for (const [e, j] of frags) if (j === i) el = e; return el; };
  links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); const top = section.getBoundingClientRect().top + scrollY + (section.offsetHeight - innerHeight) * REST[CH_FIRST[i]]; scrollTo({ top, behavior: 'smooth' }); }));
  let smooth = null, mx = 0, my = 0, qx = 0, qy = 0, beat = -1, lit = -1, disp = 0, last = 0, wk = 0, wb = -1;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  return (t) => {
    const dt = Math.min(.1, last ? (t - last) / 1000 : 0); last = t;
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight)), sf = Math.min(NB - .0001, p * NB), pinned = r.top <= 1 || section.classList.contains('pre-on');
    // the scroll only chooses the moment; once a moment is reached it plays out on its own clock and then stops
    const sb = Math.floor(sf), target = Math.min(NB - .0001, sb + clamp((sf - sb) / .1) * .999);
    if (SNAP || !pinned) disp = target; else { const dd = target - disp, rate = Math.max(.85, Math.abs(dd) * 2.4); disp += Math.sign(dd) * Math.min(Math.abs(dd), rate * dt); }
    const bf = disp, bNow = Math.floor(bf), ch = BEATS[bNow].ch;
    // the words: the chapter shows, and its words light up as their picture starts
    const lb = pinned ? bNow : -1;
    if (bNow !== beat || lb !== lit) {
      beat = bNow; lit = lb;
      caps.forEach((c, i) => { const on = pinned && i === ch; c.classList.toggle('on', on); links[i] && links[i].classList.toggle('on', on); });
      frags.forEach(([el, i]) => { el.classList.toggle('lit', i <= lb); el.classList.toggle('now', i === lb); el.classList.toggle('past', i < lb); });
    }
    // the chapter bar: each chapter fills as its moments play
    links.forEach((a, i) => { const f0 = CH_FIRST[i], f1 = i + 1 < CH_FIRST.length ? CH_FIRST[i + 1] : NB; a.style.setProperty('--f', clamp((bf - f0) / (f1 - f0)).toFixed(3)); });
    if (!ready) return;
    const s = sample(bf);
    if (!smooth || SNAP) smooth = JSON.parse(JSON.stringify(s)); else for (const k in s) smooth[k] = Array.isArray(s[k]) ? s[k].map((x, j) => lerp(smooth[k][j], x, .1)) : lerp(smooth[k], s[k], .1);
    const z = smooth.cam[2], hx = span[0] / z / 2, hy = span[1] / z / 2;
    const pk = clamp(bf / .5); qx = lerp(qx, mx * pk, .05); qy = lerp(qy, my * pk, .05);
    const cx = clamp(smooth.cam[0] + qx * .012 / z, hx, 1 - hx), cy = clamp(smooth.cam[1] + qy * .012 / z, hy, 1 - hy);
    const desk = innerWidth > 900;
    // the lens: it sits in the emptier side of the frame, away from what it magnifies
    const toUV = (u, v) => [(u - cx) * z / span[0] + .5, (v - cy) * z / span[1] + .5];
    const [lu, lv] = toUV(...smooth.lt), asp = canvas.width / canvas.height, LR = desk ? .15 : .13;
    const LP = [clamp(lu + (lu > .5 ? -.3 : .3) / asp * 1.25, LR / asp + .04, 1 - LR / asp - .04), clamp(lv + (lv > .45 ? -.26 : .26), LR + .05, 1 - LR - .05)];
    const lzk = sm(.05, .95, smooth.lz);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]);
    gl.uniform3f(U.cam, cx, cy, z); gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .40, .80);
    gl.uniform1f(U.draw, smooth.draw); gl.uniform1f(U.dash, smooth.dash); gl.uniform1f(U.amber, smooth.amber); gl.uniform1f(U.onlyQ, smooth.onlyQ > .5 ? 1 : 0);
    gl.uniform1f(U.hidePaths, smooth.hide); gl.uniform1f(U.bay, 0); gl.uniform1f(U.tagOn, 0); gl.uniform1f(U.grey, smooth.grey); gl.uniform1f(U.time, t * .001); gl.uniform1f(U.dof, desk ? 1 : .6);
    gl.uniform4f(U.spot, smooth.sp[0], smooth.sp[1], smooth.sp[2], smooth.sk);
    gl.uniform4f(U.lpos, LP[0], LP[1], LR * eo(lzk), lzk); gl.uniform3f(U.ltgt, smooth.lt[0], smooth.lt[1], 2.4);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (hctx) drawHUD(hctx, bf, t * .001, cx, cy, z, span, { lp: LP, lr: LR * eo(lzk), lz: lzk, lt: smooth.lt, sp: smooth.sp });

    // the thread from the words to the floor
    const cr = canvas.getBoundingClientRect(), sr = sticky.getBoundingClientRect(), sc = cr.width / canvas.width;
    const Pc = (u, v) => [((u - cx) * z / span[0] + .5) * canvas.width * sc + cr.left - sr.left, ((v - cy) * z / span[1] + .5) * canvas.height * sc + cr.top - sr.top];
    const u0 = clamp(bf - bNow), tg = desk && pinned ? targetOf(bNow, clamp(u0 / PLAY)) : null, el = tg && fragAt(lb);
    if (bNow !== wb) { wb = bNow; wk = 0; }
    wk = SNAP ? 1 : Math.min(1, wk + dt / .7);
    if (!el) wire.style.opacity = 0; else {
      const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter((o) => o.width > 1), q = rs[rs.length - 1] || el.getBoundingClientRect();
      const sx = q.right - sr.left + 14, sy = q.top - sr.top + q.height * .56, [ex, ey] = Pc(tg[0], tg[1]);
      const gx = cr.left - sr.left - 18, kx = Math.max(sx + 20, gx);
      wp.setAttribute('d', `M ${sx} ${sy} L ${kx} ${sy} C ${kx + (ex - kx) * .45} ${sy}, ${ex - (ex - kx) * .2} ${ey}, ${ex} ${ey}`);
      const k = eo(wk); wp.style.strokeDashoffset = 1 - k; wd.setAttribute('cx', ex); wd.setAttribute('cy', ey); wd.style.opacity = k > .97 ? 1 : 0; ws.setAttribute('cx', sx - 6); ws.setAttribute('cy', sy);
      wire.style.opacity = sm(.02, .25, u0) * (bNow >= 17 ? 0 : 1);
    }
    // the question's threads, from the words to the three answers
    const ta = clamp((bf - 18.02) / .1);
    if (ta <= 0 || !qEl || !desk) thread.style.opacity = 0; else {
      const k = eo((bf - 18.05) / .5);
      const q = qEl.getBoundingClientRect(), sx = q.right - sr.left + 18, sy = q.top - sr.top + q.height * .45;
      WAITS.slice(0, 3).forEach(([u, v], i) => {
        const [ex, ey] = Pc(u, v), mx = sx + (ex - sx) * .55;
        tps[i].setAttribute('d', `M ${sx} ${sy} C ${mx} ${sy}, ${ex - 60} ${ey}, ${ex} ${ey}`);
        const ki = clamp(k * 1.25 - i * .12); tps[i].style.strokeDashoffset = 1 - ki; tds[i].setAttribute('cx', ex); tds[i].setAttribute('cy', ey); tds[i].style.opacity = ki > .98 ? 1 : 0;
      });
      thread.style.opacity = ta;
    }
  };
}

/* ---------- shared with the landing: every tag located, and the lock on the trolley ---------- */
const RED = '31,107,255', INDIGO = '75,61,240', INK = '11,18,56', BLUE = '31,107,255', AMB = '255,176,32';
// x: 2D context; P: plate -> device px; d: device pixels per CSS pixel; seen(i): 0..1 since the wave reached mover i; lockA: lock alpha
export function drawLanding(x, P, d, seen, lockA, lockGrow = 0) {
  x.save(); x.lineCap = 'round';
  MOVERS.forEach((m, i) => {
    const e = seen(i); if (e <= 0) return; const [X, Y] = P(m[0], m[1]);
    if (e < 1) { x.globalAlpha = (1 - e) * .55; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.4 * d; x.beginPath(); x.arc(X, Y, (6 + e * 34) * d, 0, 7); x.stroke(); }
    const k = eo(Math.min(1, e * 2.5)); if (i === 0) return;
    x.globalAlpha = Math.min(1, e * 3); x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 6.5 * d * k, 0, 7); x.fill();
    x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.arc(X, Y, 4 * d * k, 0, 7); x.fill();
  });
  if (lockA > 0) { const [X, Y] = P(T[0], T[1]); x.globalAlpha = lockA; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = LOCK.w * d; brackets(x, X, Y, LOCK.r * d * (1 + lockGrow), LOCK.len, d); }
  x.restore();
}

/* ---------- the story layer: no words, no numbers; only fine light, line and motion ---------- */
function along(path, k) { const n = path.length - 1, u = clamp(k) * n, i = Math.min(n - 1, Math.floor(u)), f = u - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; }
function floorRing(x, X, Y, r, s) { x.beginPath(); x.ellipse(X, Y, r * s, r * .62 * s, -.5, 0, 7); }
function brackets(x, X, Y, r, len, s) {
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const cx = X + dx * r, cy = Y + dy * r; x.beginPath(); x.moveTo(cx, cy - dy * len * s); x.lineTo(cx, cy); x.lineTo(cx - dx * len * s, cy); x.stroke(); }
}
// a precise reticle: a fine ring in four arcs, ticks outside it, a point at its centre; it closes in as it arrives
function reticle(x, X, Y, r, k, s, col, a = 1, spin = 0) {
  if (k <= 0 || a <= 0) return; const e = eo(k), R = r * s * (1 + (1 - e) * .9);
  x.save(); x.globalAlpha = a * e; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1.15 * s;
  for (let i = 0; i < 4; i++) { const a0 = spin + i * 1.5708 + .2; x.beginPath(); x.arc(X, Y, R, a0, a0 + 1.17); x.stroke(); }
  x.lineWidth = 1 * s; for (let i = 0; i < 4; i++) { const an = spin + i * 1.5708 - .19; x.beginPath(); x.moveTo(X + Math.cos(an) * (R + 3 * s), Y + Math.sin(an) * (R + 3 * s)); x.lineTo(X + Math.cos(an) * (R + 8 * s), Y + Math.sin(an) * (R + 8 * s)); x.stroke(); }
  x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(X, Y, 1.6 * s, 0, 7); x.fill(); x.restore();
}
// a located point: small, exact, with a hairline halo
function point(x, X, Y, k, s, col, a = 1, big = 1) {
  if (k <= 0 || a <= 0) return; const e = eo(Math.min(1, k * 1.8));
  x.save(); x.globalAlpha = a;
  if (k < 1) { x.globalAlpha = a * (1 - k) * .5; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1 * s; floorRing(x, X, Y, 6 + k * 30, s); x.stroke(); x.globalAlpha = a; }
  x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.arc(X, Y, 4.6 * s * e * big, 0, 7); x.fill();
  x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(X, Y, 2.9 * s * e * big, 0, 7); x.fill(); x.restore();
}
// a comet: the last stretch of a path in fading light, its head a soft point
function comet(x, P, path, k, s, a, col, tail = .4) {
  if (k <= 0 || a <= 0) return; const N = 90, k0 = Math.max(0, k - tail);
  x.save(); x.lineCap = 'round';
  // the whole way so far, very faint
  x.globalAlpha = a * .22; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1 * s; x.setLineDash([1.5 * s, 4 * s]); x.beginPath();
  for (let i = 0; i <= N; i++) { const [X, Y] = P(...along(path, k * i / N)); i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); x.setLineDash([]);
  for (let i = 1; i <= N; i++) { const q0 = lerp(k0, k, (i - 1) / N), q1 = lerp(k0, k, i / N), [X0, Y0] = P(...along(path, q0)), [X1, Y1] = P(...along(path, q1)); x.globalAlpha = a * Math.pow(i / N, 1.6) * .9; x.lineWidth = (.6 + 1.4 * i / N) * s; x.beginPath(); x.moveTo(X0, Y0); x.lineTo(X1, Y1); x.stroke(); }
  const [HX, HY] = P(...along(path, k)); const g = x.createRadialGradient(HX, HY, 0, HX, HY, 14 * s); g.addColorStop(0, `rgba(${col},.32)`); g.addColorStop(1, `rgba(${col},0)`);
  x.globalAlpha = a; x.fillStyle = g; x.beginPath(); x.arc(HX, HY, 14 * s, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.arc(HX, HY, 4.4 * s, 0, 7); x.fill(); x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(HX, HY, 2.8 * s, 0, 7); x.fill();
  x.restore();
}
// waiting: a fine amber ring on the floor, its arc filling with the time
function waitRing(x, X, Y, R, w, s, a, t, live, i) {
  if (a <= 0) return; x.save(); x.globalAlpha = a;
  const g = x.createRadialGradient(X, Y, 0, X, Y, R * 1.3); g.addColorStop(0, `rgba(${AMB},${.16 + .05 * Math.sin(t * 1.6 + i)})`); g.addColorStop(1, `rgba(${AMB},0)`);
  x.fillStyle = g; x.beginPath(); x.ellipse(X, Y, R * 1.3, R * .8, -.5, 0, 7); x.fill();
  x.strokeStyle = `rgba(${AMB},.28)`; x.lineWidth = 1 * s; x.beginPath(); x.ellipse(X, Y, R, R * .62, -.5, 0, 7); x.stroke();
  const a0 = -1.9, sw = 6.283 * clamp(w); x.strokeStyle = `rgb(${AMB})`; x.lineWidth = 2 * s; x.lineCap = 'round'; x.beginPath(); x.ellipse(X, Y, R, R * .62, -.5, a0, a0 + sw); x.stroke();
  // the arc's leading end keeps creeping while the work keeps waiting
  const ex = X + Math.cos(a0 + sw) * R * Math.cos(-.5) - Math.sin(a0 + sw) * R * .62 * Math.sin(-.5), ey = Y + Math.cos(a0 + sw) * R * Math.sin(-.5) + Math.sin(a0 + sw) * R * .62 * Math.cos(-.5);
  x.fillStyle = `rgb(${AMB})`; x.beginPath(); x.arc(ex, ey, (2.6 + live * .8 * (1 + Math.sin(t * 3 + i))) * s, 0, 7); x.fill();
  x.restore();
}

function drawHUD(x, bf, t, cx, cy, z, span, L) {
  const W = x.canvas.width, H = x.canvas.height, d = W / Math.max(1, x.canvas.clientWidth), s = Math.min(Math.max(H / 760, .8), 2.2) * (W < 700 ? .9 : 1);
  const P = (u, v) => [((u - cx) * z / span[0] + .5) * W, ((v - cy) * z / span[1] + .5) * H];
  const lp = (i) => clamp((bf - i) / PLAY);
  const win = (a, b, f = .25) => clamp((bf - a) / f) * clamp((b - bf) / f);
  x.clearRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round';

  // the landing holds for a moment: every tag located, the lock on the trolley; then they go out one by one
  const out = clamp(bf / (PLAY * .7));
  if (out < 1) drawLanding(x, P, d, (i) => 1 - clamp(out * 2.2 - (MOVERS.length - i) * .09), 1 - clamp(out * 1.8), out * .8);
  const [TX, TY] = P(T[0], T[1]);

  // ---- Search ----
  let a = win(.1, 4.1);
  if (a > 0) {
    // the one they are looking for: we can see it, they cannot
    const lost = sm(.3, .8, bf) * (1 - sm(3.7, 4, bf));
    if (lost > 0) { x.save(); x.globalAlpha = a * lost * .75; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s; x.setLineDash([2 * s, 5 * s]); x.lineDashOffset = -t * 5; floorRing(x, TX, TY, 24, s); x.stroke(); x.setLineDash([]); x.restore(); }
    const k1 = lp(1), k3 = lp(3);
    if (k1 > 0 && k3 <= 0) comet(x, P, WALK1, k1, s, a * (1 - sm(1.85, 2.2, bf) * .6), INK, .35);
    if (k3 > 0) comet(x, P, WALK2, k3, s, a, INK, .3);
    // where they stop and look: a quick hairline ripple, nothing found
    [[LOOK1, k1, WALK1, 2.1], [LOOK2, k3, WALK2, 4.1]].forEach(([Lk, k, path, end]) => { if (bf > end) return; Lk.forEach(([u, v, at]) => { const kk = k * (path.length - 1) - at; if (kk < 0 || kk > 1.6) return; const [X, Y] = P(u, v); x.save(); x.globalAlpha = a * (1 - kk / 1.6) * .6; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s; floorRing(x, X, Y, 10 + eo(kk / 1.6) * 30, s); x.stroke(); x.restore(); }); });
    // the calls to stores: a fine arc out, rings at the racks, nothing comes back
    const k2 = lp(2), [WX, WY] = P(...WALK1[WALK1.length - 1]), [SX, SY] = P(...STORES);
    if (k2 > 0 && bf < 3.8) {
      const ca = a * (1 - sm(3.2, 3.7, bf)), kk = eo(k2 * 1.4), mx = (WX + SX) / 2 - 50 * s, my = Math.min(WY, SY) - 30 * s;
      x.save(); x.globalAlpha = ca * .7; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s;
      x.beginPath(); for (let i = 0; i <= 40 * kk; i++) { const q = i / 40, X = (1 - q) * (1 - q) * WX + 2 * (1 - q) * q * mx + q * q * SX, Y = (1 - q) * (1 - q) * WY + 2 * (1 - q) * q * my + q * q * SY; i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke();
      for (let j = 0; j < 3; j++) { const q = ((t * .55 + j / 3) % 1) * kk, X = (1 - q) * (1 - q) * WX + 2 * (1 - q) * q * mx + q * q * SX, Y = (1 - q) * (1 - q) * WY + 2 * (1 - q) * q * my + q * q * SY; x.globalAlpha = ca * Math.sin(q / kk * 3.14); x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(X, Y, 2 * s, 0, 7); x.fill(); }
      for (let j = 0; j < 3; j++) { const ph = (t * .7 + j / 3) % 1; x.globalAlpha = ca * (1 - ph) * .55 * sm(.5, .8, k2); x.beginPath(); floorRing(x, SX, SY, 8 + ph * 42, s); x.stroke(); }
      point(x, WX, WY, 1, s, INK, ca * (k3 > 0 ? 0 : 1));
      x.restore();
    }
    // found, at last: the ring closes on the trolley
    const f = sm(.8, 1, k3); if (f > 0) { x.save(); x.globalAlpha = a * f; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.4 * s; x.beginPath(); x.ellipse(TX, TY, 24 * s, 15 * s, -.5, -1.6, -1.6 + 6.283 * f); x.stroke(); x.restore(); }
  }

  // ---- Scans: two checkpoints catch a moment each; after them, the trolley is out of sight ----
  a = win(4, 6.1);
  if (a > 0) {
    const G = GATES.map(([u, v]) => P(u, v)), k4 = lp(4), k5 = lp(5);
    x.save(); x.globalAlpha = a;
    const k1 = eo((k4 - .25) / .5);
    // the gates: two fine posts and a curtain of light between them
    G.forEach(([X, Y], i) => {
      const hit = clamp((k4 - (i ? .72 : .2)) / .25), flash = hit > 0 && hit < 1 ? Math.sin(hit * 3.14) : 0;
      const gr = x.createLinearGradient(X, Y - 34 * s, X, Y); gr.addColorStop(0, `rgba(${BLUE},0)`); gr.addColorStop(1, `rgba(${BLUE},${.1 + flash * .35 + (hit >= 1 ? .08 : 0)})`);
      x.fillStyle = gr; x.beginPath(); x.moveTo(X - 15 * s, Y - 9 * s - 30 * s); x.lineTo(X + 15 * s, Y + 9 * s - 30 * s); x.lineTo(X + 15 * s, Y + 9 * s); x.lineTo(X - 15 * s, Y - 9 * s); x.closePath(); x.fill();
      x.strokeStyle = `rgba(${INK},.75)`; x.lineWidth = 1.2 * s; for (const dd of [-1, 1]) { x.beginPath(); x.moveTo(X + dd * 15 * s, Y + dd * 9 * s); x.lineTo(X + dd * 15 * s, Y + dd * 9 * s - 30 * s); x.stroke(); }
      x.strokeStyle = `rgba(${BLUE},${.6 + flash * .4})`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(X - 15 * s, Y - 9 * s); x.lineTo(X + 15 * s, Y + 9 * s); x.stroke();
      if (flash > 0) { x.globalAlpha = a * (1 - hit) * .7; x.strokeStyle = `rgb(${BLUE})`; floorRing(x, X, Y, 10 + hit * 50, s); x.stroke(); x.globalAlpha = a; }
    });
    // the trolley as the scans see it: a point that moves only between the gates
    if (k1 > 0) { x.strokeStyle = `rgba(${INK},.55)`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(G[0][0], G[0][1]); x.lineTo(lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)); x.stroke(); }
    if (k5 <= 0) { const mv = k4 < .25 ? G[0] : [lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)]; point(x, mv[0], mv[1], 1, s, INK, a); }
    // after the last scan: its trace thins out and is lost in the haze
    if (k5 > 0) {
      const N = 22, ke = eo(k5 * 1.3); x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s;
      for (let i = 0; i < N * ke; i++) { const q0 = i / N, q1 = (i + .5) / N; x.globalAlpha = a * .6 * Math.pow(1 - q0, 2); x.beginPath(); x.moveTo(lerp(G[1][0], TX, q0 * .8), lerp(G[1][1], TY, q0 * .8)); x.lineTo(lerp(G[1][0], TX, q1 * .8), lerp(G[1][1], TY, q1 * .8)); x.stroke(); }
      x.globalAlpha = a * sm(.4, .9, k5) * .5; x.setLineDash([2 * s, 5 * s]); x.lineDashOffset = -t * 5; floorRing(x, TX, TY, 30 + Math.sin(t * 1.3) * 3, s); x.stroke(); x.setLineDash([]);
    }
    x.restore();
    // the shift as one hairline: two moments seen, the rest unseen
    const kt = eo(k4 * 1.6);
    if (kt > 0) {
      const bw = W * .56, bx = (W - bw) / 2, by = H - 34 * s, head = clamp(k4 * .45 + k5 * .55);
      x.save(); x.globalAlpha = a * kt;
      x.strokeStyle = `rgba(${INK},.16)`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + bw, by); x.stroke();
      for (let i = 0; i <= 24; i++) { const X = bx + bw * i / 24; x.beginPath(); x.moveTo(X, by - (i % 6 ? 2 : 5) * s); x.lineTo(X, by); x.stroke(); }
      x.strokeStyle = `rgba(${INK},.55)`; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + bw * Math.min(head, .45), by); x.stroke();
      if (head > .45) { x.setLineDash([2 * s, 5 * s]); x.strokeStyle = `rgba(${INK},.3)`; x.beginPath(); x.moveTo(bx + bw * .45, by); x.lineTo(bx + bw * head, by); x.stroke(); x.setLineDash([]); }
      [.2, .45].forEach((m) => { if (head < m) return; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.6 * s; x.beginPath(); x.moveTo(bx + bw * m, by - 9 * s); x.lineTo(bx + bw * m, by + 3 * s); x.stroke(); });
      x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(bx + bw * head, by, 2.4 * s, 0, 7); x.fill();
      x.restore();
    }
  }

  // ---- Tag: on the trolley, a bin, a tool; anchors on the columns; the signal; found ----
  a = win(6, 11.1);
  if (a > 0) {
    const k6 = lp(6), k7 = lp(7), k8 = lp(8), k9 = lp(9), k10 = lp(10), AP = ANCH.map(([u, v]) => P(u, v));
    const tagged = [[T, k6], [BIN, k7], [TOOL, k8]];
    tagged.forEach(([m, k], i) => { const [X, Y] = P(...m), cur = Math.floor(bf) === 6 + i; reticle(x, X, Y, 13, k, s, INDIGO, a * (cur ? 1 : .0), t * .2); point(x, X, Y, k * 1.2, s, INDIGO, a); });
    if (k8 > .4) MOVERS.slice(4).forEach((m, i) => point(x, ...P(...m), clamp((k8 - .4) * 2.4 - i * .1), s * .8, INDIGO, a * .8));
    // anchors: a small square mark on each column, and the column's line of sight
    AP.forEach(([X, Y], i) => { const on = eo((k9 - i * .15) / .4); if (on <= 0) return; x.save(); x.globalAlpha = a * on; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.2 * s; brackets(x, X, Y, (7 + (1 - on) * 10) * s, 4, s); x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.arc(X, Y, 2.2 * s, 0, 7); x.fill(); x.restore(); });
    // the signal: a fine pulse out from the tag, each anchor answers on its beam, then the lock closes
    if (k10 > 0) {
      x.save(); x.globalAlpha = a * sm(0, .2, k10);
      for (let j = 0; j < 3; j++) { const ph = (t * .4 + j / 3) % 1; x.strokeStyle = `rgba(${INDIGO},${.4 * (1 - ph)})`; x.lineWidth = 1 * s; floorRing(x, TX, TY, 8 + ph * 60, s); x.stroke(); }
      AP.forEach(([X, Y], i) => {
        const on = eo((k10 - i * .1) / .3); if (on <= 0) return;
        const gr = x.createLinearGradient(TX, TY, X, Y); gr.addColorStop(0, `rgba(${INDIGO},.5)`); gr.addColorStop(1, `rgba(${BLUE},.15)`);
        x.strokeStyle = gr; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(TX, TY); x.lineTo(lerp(TX, X, on), lerp(TY, Y, on)); x.stroke();
        const f = (t * .45 + i * .27) % 1, px = lerp(TX, X, f), py = lerp(TY, Y, f);
        x.fillStyle = `rgba(${INDIGO},${Math.sin(f * 3.14)})`; x.beginPath(); x.arc(px, py, 1.8 * s, 0, 7); x.fill();
        const hit = Math.max(0, 1 - Math.abs(f - .97) * 14); if (hit > 0) { x.strokeStyle = `rgba(${BLUE},${.6 * hit})`; x.lineWidth = 1 * s; x.beginPath(); x.arc(X, Y, (8 + (1 - hit) * 14) * s, 0, 7); x.stroke(); }
      });
      const lock = eo((k10 - .4) / .45); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.4 * s; x.globalAlpha = a * lock; brackets(x, TX, TY, (54 - lock * 36) * s, 6, s);
      x.restore();
    }
  }
  // the lens's rim and its leader to what it magnifies
  if (L && L.lz > .01) {
    const lx = L.lp[0] * W, ly = L.lp[1] * H, lr = L.lr * H, [GX, GY] = P(...L.lt), an = Math.atan2(GY - ly, GX - lx);
    x.save(); x.globalAlpha = L.lz;
    x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 3 * s; x.beginPath(); x.arc(lx, ly, lr, 0, 7); x.stroke();
    x.strokeStyle = `rgba(${INK},.22)`; x.lineWidth = 1 * s; x.beginPath(); x.arc(lx, ly, lr + 2 * s, 0, 7); x.stroke();
    x.strokeStyle = `rgba(${INDIGO},.9)`; x.lineWidth = 1.4 * s; x.beginPath(); x.arc(lx, ly, lr + 2 * s, an - .35, an + .35); x.stroke();
    x.strokeStyle = `rgba(${INK},.35)`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(lx + Math.cos(an) * (lr + 2 * s), ly + Math.sin(an) * (lr + 2 * s)); x.lineTo(GX - Math.cos(an) * 16 * s, GY - Math.sin(an) * 16 * s); x.stroke();
    x.restore();
  }

  // ---- Paths: where it stopped; where it went; how long it has waited ----
  a = win(11, 14.1);
  if (a > 0) {
    const k = lp(11), land = clamp((k - .35) / .4);
    x.save(); x.globalAlpha = a;
    if (land > 0) for (let j = 0; j < 2; j++) { const ph = ((t * .4 + j / 2) % 1); x.strokeStyle = `rgba(${RED},${.45 * (1 - ph) * land * (1 - lp(12) * .7)})`; x.lineWidth = 1 * s; floorRing(x, TX, TY, 10 + ph * 50, s); x.stroke(); }
    x.restore();
    reticle(x, TX, TY, 15, k, s, RED, a * (1 - lp(12) * .5), 0);
    point(x, TX, TY, clamp(k * 1.4), s, RED, a, 1.15);
    const k13 = lp(13); if (k13 > 0) waitRing(x, TX, TY, 34 * s, .42 * eo(k13), s, a * eo(k13 * 2), t, sm(.5, 1, k13), 9);
  }

  // ---- Waits: fine amber rings on the floor, filling, then creeping on while the work still waits ----
  a = win(13.9, 19.2);
  WAITS.forEach(([u, v, w], i) => {
    const k = eo((lp(14) - i * .12) / .5); if (a * k <= 0) return; const [X, Y] = P(u, v);
    const ask = bf > 17 ? (i < 3 ? 1 : .2) : 1, grow = eo(lp(15));
    waitRing(x, X, Y, 30 * s, w * k * (.55 + .45 * grow) + lp(16) * ((t * .006) % .05), s, a * ask, t, lp(16), i);
  });
  // the answer: a reticle settles on each of the three that match
  a = win(18, 19.2, .3);
  if (a > 0) WAITS.slice(0, 3).forEach(([u, v], i) => { const [X, Y] = P(u, v); reticle(x, X, Y, 40, clamp((lp(18) - .15 - i * .12) / .45), s, AMB, a, t * .15 + i); });
}
