// The hero: the AmIGo tag from the founders' CAD, standing on a quiet floor.
// Line one of the headline is the blue path arriving; line two is the amber wait growing.
import * as THREE from '../assets/vendor/three.module.min.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);

export async function mesh(name, meta) {
  const m = meta[name];
  const buf = await (await fetch(`assets/cad/${name}.mesh`)).arrayBuffer();
  const q = new Uint16Array(buf, 0, m.nv * 3), p = new Float32Array(m.nv * 3);
  for (let i = 0; i < m.nv; i++) for (let k = 0; k < 3; k++) p[i * 3 + k] = m.min[k] + q[i * 3 + k] * m.scale[k];
  const nb = new THREE.InterleavedBuffer(new Int8Array(buf, m.nOff, m.nv * 4), 4);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.InterleavedBufferAttribute(nb, 3, 0, true));
  g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, m.iOff, m.ni), 1));
  return g;
}

// a photographer's studio: one long overhead softbox, two strip lights, a cool bounce
export function studioEnv(renderer) {
  const s = new THREE.Scene(); s.background = new THREE.Color(0xa4a8b0);
  const box = (w, h, pos, c, k) => { const mt = new THREE.MeshBasicMaterial({ color: c, side: 2 }); mt.color.multiplyScalar(k); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); m.position.copy(pos); m.lookAt(0, 0, 0); s.add(m); };
  box(14, 3.2, new THREE.Vector3(0, 9, 0), 0xffffff, 5.5);
  box(1.2, 11, new THREE.Vector3(-8.5, 2.5, 3), 0xdfe8ff, 3.2);
  box(1.2, 11, new THREE.Vector3(8.5, 2.5, -3), 0xfff3e4, 2.2);
  box(20, 4, new THREE.Vector3(0, -3, -9), 0x50607e, 1);
  box(20, 4, new THREE.Vector3(0, -3.5, 9), 0xe8f0ff, 1.2);
  const pm = new THREE.PMREMGenerator(renderer); const t = pm.fromScene(s, 0.02).texture; pm.dispose(); return t;
}

// the ground: a polished pale slab the tag stands on. Skylights lay soft pools of daylight across it and drift with the
// sun; the saw-cut joints of the slab run away from you; the far floor dissolves into the page.
export const GROUND_VS = `varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
export const GROUND_FS = `precision highp float;varying vec3 vW;
uniform float t,fadeAll,leftFade,farR;uniform vec2 res;uniform vec3 lightC;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float box(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}
void main(){
  vec2 p=vW.xz; float r=length(p);
  // slab: a touch cooler and darker than the page so light can land on it
  vec3 col=vec3(.86,.895,.955);
  float grain=n(p*.045)*.6+n(p*.17)*.4; col*=1.-.022*grain;
  // daylight from the roof: soft panes in a grid, drifting slowly
  vec2 q=p+vec2(t*7.,t*2.); vec2 cell=vec2(560.,400.); vec2 c=mod(q+cell*.5,cell)-cell*.5;
  float pane=1.-smoothstep(-18.,46.,box(c,vec2(170.,58.),26.));
  vec3 day=vec3(1.,.985,.955);
  col=mix(col,day,pane*.9);
  // the key pool under the tag
  float pool=exp(-pow(length((p-lightC.xy)*vec2(1.,1.25))/lightC.z,2.));
  col=mix(col,vec3(.985,.99,1.),pool*.85);
  // saw-cut joints, running away from you
  vec2 j=abs(mod(p+300.,600.)-300.); float joint=1.-smoothstep(.0,1.3,min(j.x,j.y));
  col=mix(col,vec3(.8,.85,.93),joint*.28*(1.-pool*.7));
  // contact: the floor darkens a little in the tag's own shadow side (soft, cool)
  // fade: the far floor dissolves into the page; the words on the left sit on clear page
  float a=(1.-smoothstep(farR*.35,farR,r));
  vec2 s=gl_FragCoord.xy/res; a*=mix(1.,smoothstep(.12,.52,s.x),leftFade);
  a*=1.-smoothstep(.82,1.,s.y)*.6;
  a*=.9;
  gl_FragColor=vec4(col,a*fadeAll);}`;


// The hero floor: a pale calibration surface the tag stands on. Fine engineering grid, a pool of soft light under the tag,
// the UWB pulse running out across it, the anchors that hear it, the fix locking on, and the amber wait filling around it.
const SIG_VS = `varying vec2 vP;varying vec3 vW;void main(){vP=position.xy;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const SIG_FS = `precision highp float;varying vec2 vP;varying vec3 vW;
uniform float t,ring,lock,wait,fadeAll,leftFade,grid;uniform vec2 res;uniform vec3 heard;uniform vec2 A0,A1,A2;uniform vec2 pool;
const float PI=3.14159265;
float gridL(vec2 p,float s,float w){vec2 q=p/s;vec2 g=abs(fract(q-.5)-.5)/fwidth(q);return 1.-clamp(min(g.x,g.y)/w,0.,1.);}
float ringL(float d,float w){float f=fwidth(d);return 1.-clamp(abs(d)/(f*w),0.,1.);}
void main(){
  vec2 p=vec2(vW.x,vW.z); float r=length(p);
  vec3 col=vec3(.93,.952,.988); float a=0.;
  // a pool of soft light under the tag; the floor dissolves into the page around it
  float lp=exp(-pow(length((p-pool)*vec2(1.,1.25))/150.,2.));
  col=mix(col,vec3(1.),lp*.85);
  a=(1.-smoothstep(90.,420.,r))*.9;
  // calibration grid: 10 mm minor, 50 mm major, one device pixel, only around the tag
  float gf=(1.-smoothstep(40.,230.,r))*grid;
  float gm=gridL(p,10.,1.), gM=gridL(p+25.,50.,1.2);
  col=mix(col,vec3(.62,.70,.88),gm*.16*gf); col=mix(col,vec3(.42,.52,.80),gM*.26*gf);
  a=max(a,(gm*.16+gM*.26)*gf);
  // the pulse: a fine wavefront and a faint echo, running out from the tag
  vec3 bc=vec3(.12,.42,1.);
  if(ring>0.){float rr=46.+ring*330.;float f=pow(1.-ring,1.4)*smoothstep(0.,.04,ring);
    float front=ringL(r-rr,1.3)*f, echo=ringL(r-rr+9.,1.)*f*.4;
    float glow=exp(-max(0.,rr-r)/22.)*step(r,rr)*.07*f;
    float w=clamp(front+echo+glow,0.,1.); col=mix(col,bc,w); a=max(a,w);}
  // anchors that hear it: three points on the far floor brighten as the pulse reaches them
  vec2 As[3]; As[0]=A0;As[1]=A1;As[2]=A2; float hs[3]; hs[0]=heard.x;hs[1]=heard.y;hs[2]=heard.z;
  for(int i=0;i<3;i++){float d=length(p-As[i]); float h=hs[i];
    float core=1.-smoothstep(1.3,2.1,d); float halo=exp(-pow(d/(4.+h*7.),2.))*h*.5; float rg=ringL(d-4.-h*5.,1.)*h*.75;
    float w=clamp(core*(.35+.65*h)+halo+rg,0.,1.); col=mix(col,bc,w); a=max(a,w);}
  // the fix locking on: four fine corner brackets close in around the tag
  if(lock>0.){float s=mix(1.6,1.,lock); vec2 q=abs(p)/s; float H=60.,L=10.;
    float bx=ringL(q.x-H,1.1)*step(H-L,q.y)*step(q.y,H+.5), by=ringL(q.y-H,1.1)*step(H-L,q.x)*step(q.x,H+.5);
    float w=max(bx,by)*lock; col=mix(col,bc,w); a=max(a,w);}
  // waiting: a thin amber arc fills around the tag, a soft head leading it
  if(wait>0.){float ang=atan(p.x,-p.y);float u=fract(ang/(2.*PI)+1.);float ra=64.;
    float track=ringL(r-ra,1.)*.14, arc=ringL(r-ra,1.6)*step(u,wait), head=exp(-pow((u-wait)*120.,2.))*exp(-pow((r-ra)/2.2,2.))*.9;
    vec3 wc=vec3(.97,.63,.1); float w=clamp(max(track,arc)+head,0.,1.); col=mix(col,wc,w); a=max(a,w);}
  vec2 sc=gl_FragCoord.xy/res; a*=mix(1.,smoothstep(.38,.58,sc.x),leftFade);
  gl_FragColor=vec4(col,a*fadeAll);}`;

export async function init(canvas, fallback, hero) {
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  const [gTop, gBot] = await Promise.all([mesh('top_cover', meta), mesh('bottom_cover', meta)]);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer); scene.environmentIntensity = 1.0;
  const cam = new THREE.PerspectiveCamera(18, 1, 10, 6000);

  // the founders' dark grey shell, satin, with a clear coat that holds one long highlight
  const shell = (c, r, cc, ccr) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, metalness: 0, clearcoat: cc, clearcoatRoughness: ccr });
  const top = new THREE.Group(), bot = new THREE.Group();
  const mTop = shell(0x3a3c41, .4, .45, .18), mBot = shell(0x2b2c31, .5, .25, .32);
  top.add(new THREE.Mesh(gTop, mTop)); bot.add(new THREE.Mesh(gBot, mBot));
  const inner = new THREE.Group(); inner.add(top, bot); inner.position.set(-61.77, -65.98, 1.0);
  const mid = new THREE.Group(); mid.add(inner); mid.rotation.x = Math.PI / 2;
  const tag = new THREE.Group(); tag.add(mid); scene.add(tag);
  const FLOOR_Y = -16;

  // its reflection in the polished floor: the same shell mirrored under the floor, fading with depth
  const reflMat = (m) => { const r = m.clone(); r.transparent = true; r.depthWrite = false; r.side = THREE.DoubleSide;
    r.onBeforeCompile = (sh) => { sh.uniforms.reflA = reflA; sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWy;').replace('#include <project_vertex>', '#include <project_vertex>\nvWy=(modelMatrix*vec4(transformed,1.)).y;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vWy;uniform float reflA;').replace('#include <dithering_fragment>', `#include <dithering_fragment>\ngl_FragColor.a*=reflA*exp(-max(0.,${FLOOR_Y.toFixed(1)}-vWy)/3.2);`); };
    return r; };
  const reflA = { value: 0 };
  const rTop = new THREE.Group(), rBot = new THREE.Group();
  rTop.add(new THREE.Mesh(gTop, reflMat(mTop))); rBot.add(new THREE.Mesh(gBot, reflMat(mBot)));
  const rInner = new THREE.Group(); rInner.add(rTop, rBot); rInner.position.copy(inner.position);
  const rMid = new THREE.Group(); rMid.add(rInner); rMid.rotation.x = Math.PI / 2;
  const refl = new THREE.Group(); refl.add(rMid); refl.matrixAutoUpdate = false; refl.renderOrder = 1; scene.add(refl);
  rTop.children[0].renderOrder = rBot.children[0].renderOrder = 1;
  const MIR = new THREE.Matrix4().makeTranslation(0, FLOOR_Y, 0).multiply(new THREE.Matrix4().makeScale(1, -1, 1)).multiply(new THREE.Matrix4().makeTranslation(0, -FLOOR_Y, 0));

  // the floor
  const ANCH = [new THREE.Vector2(-70, -150), new THREE.Vector2(80, -125), new THREE.Vector2(92, 58)];
  const sigMat = new THREE.ShaderMaterial({ vertexShader: SIG_VS, fragmentShader: SIG_FS, transparent: true, depthWrite: false, extensions: { derivatives: true },
    uniforms: { t: { value: 0 }, ring: { value: 0 }, lock: { value: 0 }, wait: { value: 0 }, fadeAll: { value: 0 }, leftFade: { value: 1 }, grid: { value: 1 }, res: { value: new THREE.Vector2(1, 1) }, heard: { value: new THREE.Vector3() }, A0: { value: ANCH[0] }, A1: { value: ANCH[1] }, A2: { value: ANCH[2] }, pool: { value: new THREE.Vector2(-20, 10) } } });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), sigMat); floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR_Y; floor.renderOrder = 0; scene.add(floor);

  // contact shadow: a tight core and a wide soft skirt
  const shadowTex = (stops) => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); stops.forEach(([o, a]) => g.addColorStop(o, `rgba(11,18,56,${a})`)); x.fillStyle = g; x.fillRect(0, 0, 256, 256); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; };
  const mkShadow = (w, h, stops) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: shadowTex(stops), transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = FLOOR_Y + .15; m.renderOrder = 2; scene.add(m); return m; };
  const core = mkShadow(84, 108, [[0, .62], [.35, .38], [.7, .06], [1, 0]]);
  const skirt = mkShadow(200, 220, [[0, .22], [.4, .09], [1, 0]]);

  // light: a long softbox overhead-left for the lid, a cool rim behind for the edges, a warm low fill so the black keeps its form
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-200, 280, 120); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fb2ff, 2.4); rim.position.set(260, 90, -300); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xfff1e2, .45); fill.position.set(120, 30, 320); scene.add(fill);

  const phone = () => innerWidth < 900;
  // fit: put the tag where the composition wants it, at the size the composition wants
  const box = new THREE.Box3(), V = new THREE.Vector3();
  const EYE = .44;
  const projW = (d, w, h) => { cam.position.set(Math.sin(.15) * d, d * EYE, Math.cos(.15) * d); cam.lookAt(0, -6, 0); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    tag.updateMatrixWorld(true); box.setFromObject(tag); let x0 = 1e9, x1 = -1e9;
    for (let i = 0; i < 8; i++) { V.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(cam); x0 = Math.min(x0, V.x); x1 = Math.max(x1, V.x); }
    return Math.max(1, (x1 - x0) * w / 2); };
  let dist = 700;
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h;
    let fx = .7, fy = .53;
    if (phone()) { const cr = canvas.getBoundingClientRect(), a = hero.querySelector('h1').getBoundingClientRect(), b = hero.querySelector('p').getBoundingClientRect(); fx = .5; fy = clamp(((a.bottom + b.top) / 2 - cr.top) / h, .3, .7); }
    cam.setViewOffset(w, h, -(fx - .5) * w, -(fy - .5) * h, w, h);
    const want = phone() ? Math.min(w * .56, h * .3) : Math.min(w * .32, 600, h * .52);
    const ty = tag.position.y, rx = tag.rotation.x, ry = tag.rotation.y; tag.position.y = 0; tag.rotation.set(0, .98, 0);
    const d0 = 700; dist = d0 * projW(d0, w, h) / want;
    tag.position.y = ty; tag.rotation.x = rx; tag.rotation.y = ry;
    globalThis.__tagFrame = { fx, fy };
  };
  size(); addEventListener('resize', size);
  let lastBox = '';
  const refit = () => { const b = canvas.clientWidth + 'x' + canvas.clientHeight; if (b !== lastBox) { lastBox = b; size(); } };

  let landing = false, px = 0, py = 0, tx = 0, ty = 0, on = true, t0 = 0, lift = 0, late = false;
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) requestAnimationFrame(loop); }).observe(hero);

  // timeline (seconds from the first frame): the tag comes down out of soft focus, the highlight crosses the lid,
  // it touches down, is heard (the pulse reaches the anchors), the fix locks on, then the wait begins. The pulse repeats.
  const DOWN = 1.2, PULSE = 2.6, EVERY = 4.2, WAIT_LEN = 9, CYC = 14, REST = 3.85;
  // late (the 3D arrived after the still was already showing): start from the resting frame the still was made from, and cross-fade
  let WAIT_AT = 4;
  const ANCR = ANCH.map((a) => a.length());
  // ?hero=1.2 holds the hero at that second (for stills and review)
  const FREEZE = (() => { const m = /[?&]hero=([\d.]+)/.exec(location.search); return m ? +m[1] : -1; })();
  function loop(now) {
    if (!on) return;
    const t = FREEZE >= 0 ? FREEZE : (now - t0) / 1000 + (late ? REST : 0);
    const r = hero.getBoundingClientRect(); const sp = clamp(-r.top / r.height);
    px = lerp(px, tx, .04); py = lerp(py, ty, .04);

    const intro = eo(clamp(t / DOWN)), ia = 1; // solid from its first frame: the drop is the entrance, never a fade through grey
    lift = lerp(lift, sp * 30, .12);
    tag.position.y = (1 - intro) * 38 + sp * 14;
    tag.rotation.y = 0.98 + (1 - intro) * .7 + Math.sin(t * .28) * .06 * intro + px * .4 + sp * 1.3;
    tag.rotation.x = py * .14 - sp * .22 + (1 - intro) * .12;
    tag.rotation.z = (1 - intro) * -.06;
    top.position.z = -lift;
    if (!landing) canvas.style.opacity = ia.toFixed(3);

    // the highlight: the key softbox sweeps once across the lid as it comes down, then follows the hand
    const sw = sm(.15, 1.6, t);
    key.position.set(-200 + px * 300 - (1 - sw) * 1100, 280 - py * 120, 120 + py * 100); key.intensity = 1.8 + Math.sin(sw * Math.PI) * 1.6;
    rim.intensity = 2.4 + Math.sin(t * .6) * .2;
    scene.environmentRotation.y = t * .03 + px * .45;

    // the signal
    const u = sigMat.uniforms;
    const pt = t - DOWN; // since touchdown
    let ring = 0; if (pt > 0) { const k = pt % EVERY; ring = k < PULSE ? k / PULSE : 0; }
    u.ring.value = ring;
    const rr = 46 + ring * 330;
    for (let i = 0; i < 3; i++) { const h = ring > 0 ? Math.exp(-Math.pow((rr - ANCR[i]) / 26, 2)) : 0; const key2 = 'xyz'[i]; const since = ring > 0 ? (rr - ANCR[i]) / 330 * PULSE : 9; u.heard.value[key2] = ring > 0 && rr > ANCR[i] ? Math.max(h, Math.exp(-since / .9)) : h; }
    u.lock.value = pt > .05 ? eo(clamp((pt - .05) / .55)) : 0;
    const wt = t - WAIT_AT; let wv = 0; if (wt > 0) { const c = wt % CYC; wv = c < WAIT_LEN ? eo(c / WAIT_LEN) * .62 : c < CYC - 1 ? .62 : .62 * (CYC - c); }
    u.wait.value = wv; hero.style.setProperty('--wait', (wv / .62).toFixed(3));
    u.t.value = t; u.res.value.set(canvas.width, canvas.height); u.leftFade.value = phone() ? 0 : 1; u.grid.value = phone() ? .7 : 1;
    u.pool.value.set(-20 - px * 80, 10 - py * 40);
    u.fadeAll.value = clamp((t - .15) / .9) * (1 - sp * .7);
    const ground = clamp(1 - tag.position.y / 40);
    core.material.opacity = ground * ground * ia * (1 - sp * .5); core.scale.setScalar(1.35 - .35 * intro);
    skirt.material.opacity = ground * ia * (1 - sp * .5);
    reflA.value = .1 * ground * ia * (1 - sp);

    refit(); let d = dist;
    cam.position.set(Math.sin(.15 + px * .05) * d, d * (EYE - py * .04), Math.cos(.15 + px * .05) * d); cam.lookAt(0, -6, 0);

    // the landing (bridge.js): the tag falls onto its own trolley in the plant, to the size of the rendered tag on its deck
    const B = globalThis.__bridge;
    if (B) {
      if (!landing) { landing = true; canvas.style.transition = 'none'; canvas.style.filter = ''; }
      const k = B.k, w = canvas.clientWidth, h = canvas.clientHeight;
      tag.position.y = lerp(tag.position.y, 0, k); tag.rotation.x = lerp(tag.rotation.x, 0, k); tag.rotation.z = lerp(tag.rotation.z, 0, k); top.position.z = 0;
      cam.setViewOffset(w, h, -(B.sx - .5) * w, -(B.sy - .5) * h, w, h); cam.updateProjectionMatrix();
      cam.updateMatrixWorld(); tag.updateMatrixWorld(true); box.setFromObject(tag);
      let x0 = 1e9, x1 = -1e9; for (let i = 0; i < 8; i++) { V.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(cam); x0 = Math.min(x0, V.x); x1 = Math.max(x1, V.x); }
      const natPx = Math.max(1, (x1 - x0) * w / 2), want = Math.exp(lerp(Math.log(natPx), Math.log(Math.max(2, B.px * 1.35)), k));
      d = d * natPx / want;
      cam.position.set(Math.sin(.15) * d, d * lerp(EYE, .58, k), Math.cos(.15) * d); cam.lookAt(0, -6, 0);
      cam.far = d * 4; cam.near = Math.max(1, d / 40); cam.updateProjectionMatrix();
      const f = B.floor; u.fadeAll.value *= f; core.material.opacity *= f; skirt.material.opacity *= f; reflA.value *= f;
      canvas.style.opacity = B.fade;
    } else if (landing) { landing = false; canvas.style.opacity = ''; cam.near = 10; cam.far = 6000; cam.updateProjectionMatrix(); size(); }
    tag.updateMatrixWorld(true); refl.matrix.multiplyMatrices(MIR, tag.matrixWorld); rTop.position.copy(top.position);
    if (!(B && B.fade < .01)) renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  // compile everything before the first visible frame, so the first frame the visitor sees is the finished picture
  renderer.compile(scene, cam);
  requestAnimationFrame((n) => { t0 = n; late = FREEZE < 0 && !document.documentElement.classList.contains('tag-live'); if (late) { WAIT_AT = REST + 1.6; fallback.style.transition = 'opacity 1.6s ease'; } else canvas.style.transition = 'none'; loop(n); canvas.classList.add('ready'); fallback.classList.add('gone'); hero.classList.add('tag-in'); dispatchEvent(new Event('tag:ready')); });
}
