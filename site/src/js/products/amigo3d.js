// products/amigo3d.js: the AmIGo tag from the founders' CAD, the same render as the homepage hero (studio tag.js),
// set centre stage on the AmIGo page. It wakes (rings), a path arrives, then the amber dial counts a wait.
// Pointer moves the light; scrolling lifts the top cover a little. Fallback: the CAD still under the canvas.
import * as THREE from '../../vendor/three.module.min.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);

async function mesh(name, meta) {
  const m = meta[name];
  const buf = await (await fetch(new URL(`../../locate/cad/${name}.bin`, import.meta.url))).arrayBuffer();
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
function studioEnv(renderer) {
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
  vec2 g=fract(vP/10.)-.5; float dotm=1.-smoothstep(.045,.085,length(g));
  float field=dotm*.11*smoothstep(330.,60.,r)*smoothstep(52.,84.,r);
  vec3 col=vec3(.043,.07,.22); float a=field;
  // located: rings leave the tag
  for(int i=0;i<3;i++){float ph=fract(ring-float(i)*.33);float rr=72.+ph*170.;
    float w=exp(-pow((r-rr)/.9,2.))*pow(1.-ph,1.8)*.3*step(.001,ring)*step(ring-float(i)*.33,1.);
    col=mix(col,vec3(.12,.42,1.),w/(a+w+1e-4));a+=w;}
  // waiting: an amber dial fills around the tag
  float ang=atan(vP.x,vP.y); float u=fract(ang/(2.*PI)+.5);
  float band=exp(-pow((r-84.)/1.1,2.));
  float track=band*.12*step(.001,wait);
  float arc=band*step(u,wait)*.95;
  float head=exp(-pow((r-84.)/2.6,2.))*exp(-pow((u-wait)*600.,2.))*step(.001,wait);
  float glow=exp(-pow((r-84.)/7.,2.))*step(u,wait)*.07;
  float wa=max(max(track,glow),max(arc,head));
  col=mix(col,vec3(1.,.69,.13),wa/(a+wa+1e-4));a+=wa;
  gl_FragColor=vec4(col,a*fadeAll);}`;

// the path: a ribbon on the floor that draws itself into the tag
const PATH_VS = `attribute float u;varying float vU;varying float vS;attribute float side;void main(){vU=u;vS=side;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const PATH_FS = `precision highp float;varying float vU;varying float vS;uniform float draw,fadeAll;
void main(){float on=1.-smoothstep(draw-.004,draw+.004,vU);
  float front=exp(-pow((vU-draw)/.02,2.))*step(.01,draw)*step(draw,.995);
  float edge=1.-smoothstep(.55,1.,abs(vS));
  float tail=smoothstep(0.,.25,vU);
  vec3 c=mix(vec3(.12,.42,1.),vec3(.55,.75,1.),front);
  gl_FragColor=vec4(c,(on*.9*tail+front*.8)*edge*fadeAll);}`;

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


const stage = document.querySelector('[data-amigo3d]');
const canvas = stage && stage.querySelector('canvas'), fallback = stage && stage.querySelector('.ag-fallback');
const ok = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
if (stage && ok && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); init().catch(() => {}); } }, { rootMargin: '200px' }).observe(stage);
}
async function init() {
  const meta = await (await fetch(new URL('../../locate/cad/mesh.json', import.meta.url))).json();
  meta.top_cover = meta.tag_top; meta.bottom_cover = meta.tag_bottom;
  const [gTop, gBot] = await Promise.all([mesh('tag_top', meta), mesh('tag_bottom', meta)]);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer); scene.environmentIntensity = 1.0;
  const cam = new THREE.PerspectiveCamera(20, 1, 10, 5000);
  const shell = (c, r) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, metalness: 0, clearcoat: .22, clearcoatRoughness: .32 });
  const top = new THREE.Group(), bot = new THREE.Group();
  top.add(new THREE.Mesh(gTop, shell(0x3a3c40, .46))); bot.add(new THREE.Mesh(gBot, shell(0x2c2d31, .52)));
  const inner = new THREE.Group(); inner.add(top, bot); inner.position.set(-61.77, -65.98, 1.0);
  const mid = new THREE.Group(); mid.add(inner); mid.rotation.x = Math.PI / 2;
  const tag = new THREE.Group(); tag.add(mid); scene.add(tag);
  const FLOOR_Y = -16;
  const floorMat = new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, transparent: true, depthWrite: false, uniforms: { t: { value: 0 }, ring: { value: 0 }, wait: { value: 0 }, fadeAll: { value: 1 } } });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR_Y; scene.add(floor);
  const pathMat = new THREE.ShaderMaterial({ vertexShader: PATH_VS, fragmentShader: PATH_FS, transparent: true, depthWrite: false, uniforms: { draw: { value: 0 }, fadeAll: { value: 1 } } });
  const glowMat = new THREE.ShaderMaterial({ vertexShader: PATH_VS, fragmentShader: PATH_FS.replace('gl_FragColor=vec4(c,', 'gl_FragColor=vec4(c,.16*'), transparent: true, depthWrite: false, uniforms: pathMat.uniforms });
  const glows = ROUTES.map((r) => { const m = new THREE.Mesh(ribbon(r, 7), glowMat); m.position.y = FLOOR_Y + .03; m.visible = false; scene.add(m); return m; });
  const paths = ROUTES.map((r) => { const m = new THREE.Mesh(ribbon(r, 1.5), pathMat); m.position.y = FLOOR_Y + .05; m.visible = false; scene.add(m); return m; });
  const shadowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(11,18,56,.55)'); g.addColorStop(.45, 'rgba(11,18,56,.16)'); g.addColorStop(1, 'rgba(11,18,56,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(170, 130), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = FLOOR_Y + .1; scene.add(shadow);
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-200, 260, 120); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fa6ff, 1.8); rim.position.set(240, 70, -260); scene.add(rim);
  let dist = 560;
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h;
    dist = Math.max(430, 230 / (2 * Math.tan(10 * Math.PI / 180) * Math.min(cam.aspect, 1.6)));
    if (cam.aspect < 1) dist = 190 / (2 * Math.tan(10 * Math.PI / 180) * cam.aspect);
    cam.updateProjectionMatrix();
  };
  size(); new ResizeObserver(size).observe(canvas);
  let px = 0, py = 0, tx = 0, ty = 0, on = true, lift = 0; const t0 = performance.now();
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) requestAnimationFrame(loop); }).observe(stage);
  const CYCLE = 13, START = .6;
  function loop(now) {
    if (!on) return;
    const t = (now - t0) / 1000;
    const r = stage.getBoundingClientRect(); const sp = clamp((innerHeight * .5 - r.top) / r.height);
    px = lerp(px, tx, .05); py = lerp(py, ty, .05);
    const intro = 1 - Math.exp(-3 * t) * Math.cos(5.2 * t);
    lift = lerp(lift, clamp(sp - .35) * 34, .1);
    tag.position.y = lerp(70, 0, clamp(intro)) + Math.sin(t * 1.05) * 1.6;
    tag.rotation.y = 0.98 + Math.sin(t * .3) * .14 + px * .7 + sp * 1.1;
    tag.rotation.x = py * .28; tag.rotation.z = Math.sin(t * .45) * .025;
    top.position.z = -lift;
    key.position.set(-200 + px * 520, 260 - py * 200, 120 + py * 160);
    scene.environmentRotation.y = t * .06 + px * .8;
    const lt = Math.max(0, t - START), ci = Math.floor(lt / CYCLE), c = lt % CYCLE;
    paths.forEach((m, i) => { m.visible = i === ci % ROUTES.length; }); glows.forEach((m, i) => { m.visible = i === ci % ROUTES.length; });
    pathMat.uniforms.draw.value = t < START ? 0 : clamp(c / 2.6) * 1.01;
    floorMat.uniforms.ring.value = c > 2.6 && c < 5.6 ? (c - 2.6) / 1.5 : 0;
    floorMat.uniforms.wait.value = c > 3.2 ? eo((c - 3.2) / 8) * .86 : 0;
    const fade = t < START ? 0 : clamp(c / .4) * clamp((CYCLE - c) / .8);
    pathMat.uniforms.fadeAll.value = fade; floorMat.uniforms.fadeAll.value = t < START ? clamp(t / START) : clamp((CYCLE - c) / .8) * .6 + .4;
    shadow.material.opacity = clamp(1 - tag.position.y / 80);
    const d = dist; cam.position.set(Math.sin(.15 + px * .05) * d, d * .62, Math.cos(.15 + px * .05) * d); cam.lookAt(0, -4, 0);
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame((n) => { loop(n); canvas.classList.add('ready'); if (fallback) fallback.classList.add('gone'); });
}
