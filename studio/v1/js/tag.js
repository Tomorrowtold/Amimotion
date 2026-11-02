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

// the floor: a fine dot field that fades out, rings when the tag is heard, an amber dial while it waits
const FLOOR_VS = `varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FLOOR_FS = `precision highp float;varying vec2 vP;
uniform float t,ring,wait,fadeAll;
const float PI=3.14159265;
void main(){
  float r=length(vP);
  vec3 col=vec3(.043,.07,.22); float a=0.;
  // waiting: an amber dial fills around the tag
  float ang=atan(vP.x,vP.y); float u=fract(ang/(2.*PI)+.5);
  float band=exp(-pow((r-84.)/.75,2.));
  float track=band*.05*step(.001,wait);
  float arc=band*step(u,wait)*.8;
  float head=exp(-pow((r-84.)/1.6,2.))*exp(-pow((u-wait)*600.,2.))*step(.001,wait);
  // heard: one fine blue ring runs out across the floor the moment the tag lands
  float rr=24.+ring*190.;float glow=exp(-pow((r-rr)/1.2,2.))*(1.-ring)*step(.001,ring)*.55;
  float wa=max(max(track,glow),max(arc,head));
  vec3 wc=arc+head>glow?vec3(1.,.69,.13):vec3(.12,.42,1.);col=mix(col,wc,wa/(a+wa+1e-4));a+=wa;
  gl_FragColor=vec4(col,a*fadeAll);}`;


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

// the path: a ribbon on the floor that draws itself into the tag
const PATH_VS = `attribute float u;varying float vU;varying float vS;attribute float side;void main(){vU=u;vS=side;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const PATH_FS = `precision highp float;varying float vU;varying float vS;uniform float draw,fadeAll;
void main(){float on=1.-smoothstep(draw-.004,draw+.004,vU);
  float front=exp(-pow((vU-draw)/.02,2.))*step(.01,draw)*step(draw,.995);
  float edge=1.-smoothstep(.35,1.,abs(vS));
  float tail=smoothstep(0.,.25,vU);
  vec3 c=mix(vec3(.12,.42,1.),vec3(.40,.62,1.),front*.6);
  gl_FragColor=vec4(c,(on*.85*tail+front*.35)*edge*fadeAll);}`;

function ribbon(pts, w) {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
  const N = 220, pos = [], us = [], sd = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const k = i / N, p = curve.getPointAt(k), tg = curve.getTangentAt(k); const nx = -tg.z, nz = tg.x;
    for (const s of [-1, 1]) { pos.push(p.x + nx * w * s, 0, p.z + nz * w * s); us.push(k); sd.push(s); }
    if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('u', new THREE.Float32BufferAttribute(us, 1)); g.setAttribute('side', new THREE.Float32BufferAttribute(sd, 1)); g.setIndex(idx); return g;
}
// three routes a trolley might take before it stops (floor units; the tag sits at 0,0)
const ROUTES = [
  [[220, 440], [170, 270], [50, 210], [20, 80], [0, 0]],
  [[380, 300], [240, 120], [80, 160], [30, 60], [0, 0]],
  [[440, -220], [260, -170], [170, -40], [60, -24], [0, 0]],
];

export async function init(canvas, fallback, hero) {
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  const [gTop, gBot] = await Promise.all([mesh('top_cover', meta), mesh('bottom_cover', meta)]);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer); scene.environmentIntensity = 1.0;
  const cam = new THREE.PerspectiveCamera(20, 1, 10, 5000);

  // the founders' dark grey shell; a satin finish that holds a long highlight
  const shell = (c, r, cc, ccr) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, metalness: 0, clearcoat: cc, clearcoatRoughness: ccr, });
  const top = new THREE.Group(), bot = new THREE.Group();
  top.add(new THREE.Mesh(gTop, shell(0x3a3c40, .46, .22, .32))); bot.add(new THREE.Mesh(gBot, shell(0x2c2d31, .52, .22, .32)));
  const inner = new THREE.Group(); inner.add(top, bot); inner.position.set(-61.77, -65.98, 1.0);
  const mid = new THREE.Group(); mid.add(inner); mid.rotation.x = Math.PI / 2;
  const tag = new THREE.Group(); tag.add(mid); scene.add(tag);

  const FLOOR_Y = -16;
  const floorMat = new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, transparent: true, depthWrite: false, uniforms: { t: { value: 0 }, ring: { value: 0 }, wait: { value: 0 }, fadeAll: { value: 1 } } });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR_Y; scene.add(floor);
  const groundMat = new THREE.ShaderMaterial({ vertexShader: GROUND_VS, fragmentShader: GROUND_FS, transparent: true, depthWrite: false, uniforms: { t: { value: 0 }, fadeAll: { value: 1 }, leftFade: { value: 1 }, farR: { value: 1500 }, res: { value: new THREE.Vector2(1, 1) }, lightC: { value: new THREE.Vector3(-30, 20, 330) } } });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), groundMat); ground.rotation.x = -Math.PI / 2; ground.position.y = FLOOR_Y - .2; ground.renderOrder = -2; scene.add(ground);


  const pathMat = new THREE.ShaderMaterial({ vertexShader: PATH_VS, fragmentShader: PATH_FS, transparent: true, depthWrite: false, uniforms: { draw: { value: 0 }, fadeAll: { value: 1 } } });
  const glowMat = new THREE.ShaderMaterial({ vertexShader: PATH_VS, fragmentShader: PATH_FS.replace('gl_FragColor=vec4(c,', 'gl_FragColor=vec4(c,.10*'), transparent: true, depthWrite: false, uniforms: pathMat.uniforms });
  const glows = ROUTES.map((r) => { const m = new THREE.Mesh(ribbon(r, 7), glowMat); m.position.y = FLOOR_Y + .03; m.visible = false; scene.add(m); return m; });
  const paths = ROUTES.map((r) => { const m = new THREE.Mesh(ribbon(r, 1.5), pathMat); m.position.y = FLOOR_Y + .05; m.visible = false; scene.add(m); return m; });

  // contact shadow
  const shadowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(11,18,56,.55)'); g.addColorStop(.18, 'rgba(11,18,56,.32)'); g.addColorStop(.5, 'rgba(11,18,56,.07)'); g.addColorStop(1, 'rgba(11,18,56,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(160, 118), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = FLOOR_Y + .1; scene.add(shadow);

  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-200, 260, 120); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fa6ff, 1.8); rim.position.set(240, 70, -260); scene.add(rim);

  const phone = () => innerWidth < 900; let dist = 560;
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h;
    // put the tag where the composition wants it: right of the words on a laptop, between them on a phone
    let fx = .69, fy = .52;
    if (phone()) { const cr = canvas.getBoundingClientRect(), a = hero.querySelector('h1').getBoundingClientRect(), b = hero.querySelector('p').getBoundingClientRect(); fx = .5; fy = clamp(((a.bottom + b.top) / 2 - cr.top) / h, .3, .7); }
    dist = phone() ? 150 / (2 * Math.tan(10 * Math.PI / 180) * cam.aspect) : Math.max(560, 260 / (2 * Math.tan(10 * Math.PI / 180) * cam.aspect));
    cam.setViewOffset(w, h, -(fx - .5) * w, -(fy - .5) * h, w, h); cam.updateProjectionMatrix();
    globalThis.__tagFrame = { fx, fy };
  };
  size(); addEventListener('resize', size);
  // the canvas can settle after the first frame (fonts, layout): refit whenever its box changes
  let lastBox = '';
  const refit = () => { const b = canvas.clientWidth + 'x' + canvas.clientHeight; if (b !== lastBox) { lastBox = b; size(); } };

  canvas.style.transition = 'none';
  const box = new THREE.Box3(), V = new THREE.Vector3(); let landing = false;
  let wxSet = false, px = 0, py = 0, tx = 0, ty = 0, on = true, t0 = performance.now(), lift = 0;
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) requestAnimationFrame(loop); }).observe(hero);

  const CYCLE = 13, START = 1.15, FIRST = 0; // the first visit: the tag settles, is heard, then the path arrives and the wait begins
  function loop(now) {
    if (!on) return;
    const t = (now - t0) / 1000;
    const r = hero.getBoundingClientRect(); const sp = clamp(-r.top / r.height);
    px = lerp(px, tx, .035); py = lerp(py, ty, .035);

    // arrival: the tag drops onto the floor with a soft spring
    // arrival: the tag comes down out of the light and settles, turning the last few degrees into its pose; no bounce
    const intro = eo(clamp(t / 1.25)), ia = clamp(t / .5);
    lift = lerp(lift, sp * 30, .12);
    tag.position.y = (1 - intro) * 46 + Math.sin(t * 1.05) * 1.0 * intro + sp * 14;
    tag.rotation.y = 0.98 + (1 - intro) * .55 + Math.sin(t * .3) * .09 * intro + px * .45 + sp * 1.3;
    canvas.style.opacity = landing ? canvas.style.opacity : ia.toFixed(3);
    tag.rotation.x = py * .18 - sp * .22;
    tag.rotation.z = Math.sin(t * .45) * .015;
    top.position.z = -lift;

    // the light follows the hand; the studio turns slowly
    key.position.set(-200 + px * 300, 260 - py * 120, 120 + py * 100);
    // one long highlight sweeps across the lid as it settles
    const sw = sm(.35, 1.9, t); key.position.x -= (1 - sw) * 900; key.intensity = 1.4 + Math.sin(sw * Math.PI) * 1.1;
    scene.environmentRotation.y = t * .035 + px * .45;

    // the story under the tag, on a loop: a path arrives, it is heard, then it waits
    const lt = Math.max(0, t - START) + FIRST, ci = Math.floor(lt / CYCLE), c = (lt % CYCLE);
    paths.forEach((m, i) => { m.visible = i === ci % ROUTES.length; }); glows.forEach((m, i) => { m.visible = i === ci % ROUTES.length; });
    pathMat.uniforms.draw.value = t < START ? 0 : clamp(c / 2.6) * 1.01;
    floorMat.uniforms.ring.value = t > 1.05 && t < 3.2 ? eo((t - 1.05) / 2.1) : 0;
    // the headline's amber word fills with the same wait
    hero.style.setProperty('--wait', (floorMat.uniforms.wait.value / .62).toFixed(3));
    floorMat.uniforms.wait.value = c > 3.2 ? eo((c - 3.2) / 8) * .62 : 0;
    const fade = t < START ? 0 : clamp(c / .4) * clamp((CYCLE - c) / .8);
    const ringOn = t > 1.05 && t < 3.2 ? 1 : 0;
    pathMat.uniforms.fadeAll.value = phone() ? 0 : fade; floorMat.uniforms.fadeAll.value = (phone() ? 0 : 1) * Math.max(ringOn, t < START ? 0 : clamp((CYCLE - c) / .8) * .6 + .4) * (1 - sp * .8);

    const gu = groundMat.uniforms; gu.t.value = t; gu.res.value.set(canvas.width, canvas.height); gu.leftFade.value = phone() ? 0 : 1;
    gu.lightC.value.set(-30 - px * 120, 20 - py * 60, 330);
    gu.fadeAll.value = (phone() ? .75 : 1) * clamp(t / .9) * (1 - sp * .6);
    shadow.material.opacity = clamp(1 - tag.position.y / 50) * ia * (1 - sp * .5); shadow.scale.setScalar(1.25 - .25 * intro);
    refit(); let d = dist;
    cam.position.set(Math.sin(.15 + px * .05) * d, d * .62, Math.cos(.15 + px * .05) * d); cam.lookAt(0, -4, 0);

    // the landing (bridge.js): the tag falls onto its own trolley in the plant, to the size of the rendered tag on its deck
    const B = globalThis.__bridge;
    if (B) {
      if (!landing) { landing = true; canvas.style.transition = 'none'; }
      const k = B.k, w = canvas.clientWidth, h = canvas.clientHeight;
      tag.position.y = lerp(tag.position.y, 0, k); tag.rotation.x = lerp(tag.rotation.x, 0, k); tag.rotation.z = lerp(tag.rotation.z, 0, k); top.position.z = 0;
      cam.setViewOffset(w, h, -(B.sx - .5) * w, -(B.sy - .5) * h, w, h); cam.updateProjectionMatrix();
      cam.updateMatrixWorld(); tag.updateMatrixWorld(true); box.setFromObject(tag);
      let x0 = 1e9, x1 = -1e9; for (let i = 0; i < 8; i++) { V.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(cam); x0 = Math.min(x0, V.x); x1 = Math.max(x1, V.x); }
      const natPx = Math.max(1, (x1 - x0) * w / 2), want = Math.exp(lerp(Math.log(natPx), Math.log(Math.max(2, B.px * 1.35)), k));
      d = dist * natPx / want;
      cam.position.set(Math.sin(.15) * d, d * .62, Math.cos(.15) * d); cam.lookAt(0, -4, 0);
      cam.far = d * 4; cam.near = Math.max(1, d / 40); cam.updateProjectionMatrix();
      const f = B.floor; groundMat.uniforms.fadeAll.value *= f; pathMat.uniforms.fadeAll.value *= f; floorMat.uniforms.fadeAll.value *= f; shadow.material.opacity *= f;
      canvas.style.opacity = B.fade;
    } else if (landing) { landing = false; canvas.style.opacity = ''; cam.near = 10; cam.far = 5000; cam.updateProjectionMatrix(); size(); }
    if (!(B && B.fade < .01)) renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame((n) => { t0 = n; loop(n); canvas.classList.add('ready'); fallback.classList.add('gone'); hero.classList.add('tag-in'); });
}
