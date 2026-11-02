// The hero: the AmIGo tag from the founders' CAD, standing on a quiet floor.
// Line one of the headline is the blue path arriving; line two is the amber wait growing.
import * as THREE from '../assets/vendor/three.module.min.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);

async function mesh(name, meta) {
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
  vec2 g=fract(vP/9.)-.5; float dotm=1.-smoothstep(.06,.11,length(g));
  float field=dotm*.16*smoothstep(330.,60.,r)*smoothstep(52.,80.,r);
  vec3 col=vec3(.043,.07,.22); float a=field;
  // located: rings leave the tag
  for(int i=0;i<3;i++){float ph=fract(ring-float(i)*.33);float rr=72.+ph*170.;
    float w=exp(-pow((r-rr)/.9,2.))*pow(1.-ph,1.6)*.42*step(.001,ring)*step(ring-float(i)*.33,1.);
    col=mix(col,vec3(.12,.42,1.),w/(a+w+1e-4));a+=w;}
  // waiting: an amber dial fills around the tag
  float ang=atan(vP.x,vP.y); float u=fract(ang/(2.*PI)+.5);
  float band=exp(-pow((r-84.)/1.1,2.));
  float track=band*.12*step(.001,wait);
  float arc=band*step(u,wait)*.95;
  float head=exp(-pow((r-84.)/2.6,2.))*exp(-pow((u-wait)*600.,2.))*step(.001,wait);
  float wa=max(track,max(arc,head));
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
  gl_FragColor=vec4(c,(on*.75*tail+front*.9)*edge*fadeAll);}`;

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
  [[380, 300], [240, 120], [80, 160], [30, 60], [0, 0]],
  [[440, -220], [260, -170], [170, -40], [60, -24], [0, 0]],
  [[220, 440], [170, 270], [50, 210], [20, 80], [0, 0]],
];

export async function init(canvas, fallback, hero) {
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  const [gTop, gBot] = await Promise.all([mesh('top_cover', meta), mesh('bottom_cover', meta)]);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer); scene.environmentIntensity = 1.0;
  const cam = new THREE.PerspectiveCamera(20, 1, 10, 5000);

  // the founders' dark grey shell; a satin finish that holds a long highlight
  const shell = (c, r) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, metalness: 0, clearcoat: .22, clearcoatRoughness: .32, });
  const top = new THREE.Group(), bot = new THREE.Group();
  top.add(new THREE.Mesh(gTop, shell(0x3a3c40, .46))); bot.add(new THREE.Mesh(gBot, shell(0x2c2d31, .52)));
  const inner = new THREE.Group(); inner.add(top, bot); inner.position.set(-61.77, -65.98, 1.0);
  const mid = new THREE.Group(); mid.add(inner); mid.rotation.x = Math.PI / 2;
  const tag = new THREE.Group(); tag.add(mid); scene.add(tag);

  const FLOOR_Y = -16;
  const floorMat = new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, transparent: true, depthWrite: false, uniforms: { t: { value: 0 }, ring: { value: 0 }, wait: { value: 0 }, fadeAll: { value: 1 } } });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR_Y; floor.visible = false; scene.add(floor);

  const pathMat = new THREE.ShaderMaterial({ vertexShader: PATH_VS, fragmentShader: PATH_FS, transparent: true, depthWrite: false, uniforms: { draw: { value: 0 }, fadeAll: { value: 1 } } });
  const paths = ROUTES.map((r) => { const m = new THREE.Mesh(ribbon(r, 1.15), pathMat); m.position.y = FLOOR_Y + .05; m.visible = false; scene.add(m); return m; });

  // contact shadow
  const shadowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(11,18,56,.55)'); g.addColorStop(.45, 'rgba(11,18,56,.16)'); g.addColorStop(1, 'rgba(11,18,56,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(170, 130), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = FLOOR_Y + .1; scene.add(shadow);

  const poolTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,176,32,.55)'); g.addColorStop(.35, 'rgba(255,176,32,.22)'); g.addColorStop(1, 'rgba(255,176,32,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(300, 230), new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, opacity: 0 })); pool.rotation.x = -Math.PI / 2; pool.position.y = FLOOR_Y + .06; scene.add(pool);
  const mirror = tag.clone(true); mirror.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = .07; o.material.depthWrite = false; } }); mirror.visible = false; scene.add(mirror);
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-200, 260, 120); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fa6ff, 1.8); rim.position.set(240, 70, -260); scene.add(rim);

  // ---------- the world assembles around the tag, in the same quiet language ----------
  const W = new THREE.Group(); W.position.set(18, FLOOR_Y + .04, -10); W.scale.set(.56, 1, .56); W.visible = false; scene.add(W);
  const fadeR = (r) => clamp((380 - r) / 160);
  // floor markings: bays and an aisle, drawn as thin lines that write themselves
  const MARK_VS = `attribute float u;attribute float rr;varying float vU;varying float vR;void main(){vU=u;vR=rr;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const MARK_FS = `precision highp float;varying float vU;varying float vR;uniform float draw;uniform vec3 col;uniform float alpha;
    void main(){float on=1.-smoothstep(draw-.003,draw+.003,vU);float f=smoothstep(380.,220.,vR);gl_FragColor=vec4(col,on*alpha*f);}`;
  function polyRibbon(pts, w) {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1], pos = [], us = [], rs = [], idx = []; let n = 0;
    for (let i = 1; i < pts.length; i++) {
      const [x0, z0] = pts[i - 1], [x1, z1] = pts[i], dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz), nx = -dz / l * w, nz = dx / l * w;
      for (const [x, z, u] of [[x0, z0, L[i - 1] / tot], [x1, z1, L[i] / tot]]) for (const sd of [-1, 1]) { pos.push(x + nx * sd, 0, z + nz * sd); us.push(u); rs.push(Math.hypot(x, z)); }
      idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); n += 4;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('u', new THREE.Float32BufferAttribute(us, 1)); g.setAttribute('rr', new THREE.Float32BufferAttribute(rs, 1)); g.setIndex(idx); return g;
  }
  const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]];
  const MARKS = [rect(-310, -230, -130, -80), rect(110, -250, 300, -110), rect(70, 70, 280, 190), [[-420, 40], [-150, 40]], [[-420, 64], [-150, 64]], [[-40, -330], [-40, -160]]];
  const marks = MARKS.map((pts, i) => { const m = new THREE.ShaderMaterial({ vertexShader: MARK_VS, fragmentShader: MARK_FS, transparent: true, depthWrite: false, uniforms: { draw: { value: 0 }, col: { value: new THREE.Color(0x0b1238) }, alpha: { value: .16 } } }); const me = new THREE.Mesh(polyRibbon(pts, .9), m); W.add(me); return m; });
  // columns rise at the back, each carrying an anchor that lights when it hears the tag
  const colMat = new THREE.MeshPhysicalMaterial({ color: 0xe9eef7, roughness: .6, clearcoat: .2, transparent: true, opacity: 1 });
  const COLS = [[-120, -210], [100, -280], [140, -130]];
  const cols = COLS.map(([x, z]) => {
    const g = new THREE.Group(); g.position.set(x, 0, z);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, 50, 8), new THREE.MeshBasicMaterial({ color: 0x9aa6c4, transparent: true, opacity: .55 })); c.position.y = 25; g.add(c);
    const node = new THREE.Mesh(new THREE.SphereGeometry(3.4, 20, 14), new THREE.MeshBasicMaterial({ color: 0x1f6bff, transparent: true, opacity: 0 })); node.position.set(0, 50, 7); g.add(node);
    const halo = new THREE.Mesh(new THREE.RingGeometry(5, 6.2, 40), new THREE.MeshBasicMaterial({ color: 0x1f6bff, transparent: true, opacity: 0, side: 2, depthWrite: false })); halo.position.copy(node.position); g.add(halo);
    const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 50, 7), new THREE.Vector3((-18 / .56) - x, 6, (10 / .56) - z)]);
    const line = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0x1f6bff, transparent: true, opacity: 0 })); g.add(line);
    g.scale.y = .001; W.add(g); return { g, node, halo, line };
  });
  // other tags across the floor: a few moving in blue, a few waiting in amber
  const disc = (c) => new THREE.Mesh(new THREE.CircleGeometry(4.2, 28), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false }));
  const ring = (c) => new THREE.Mesh(new THREE.RingGeometry(6, 7.2, 36), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false }));
  const MOVERS = [[[-400, 52], [-160, 52]], [[-40, -320], [-40, -170]], [[300, -270], [130, -270]]];
  const movers = MOVERS.map((seg, i) => { const d = disc(0x1f6bff); d.rotation.x = -Math.PI / 2; W.add(d); return { d, seg, ph: i * .37 }; });
  const WAITERS = [[110, 130], [170, 130], [230, 130], [-220, -155]];
  const waiters = WAITERS.map(([x, z], i) => { const d = disc(0xffb020), r = ring(0xffb020); for (const m of [d, r]) { m.rotation.x = -Math.PI / 2; m.position.set(x, .1, z); W.add(m); } return { d, r, i }; });
  function world(t) {
    const b = Math.max(0, t - 1.15); // the world starts when the tag lands
    marks.forEach((m, i) => { m.uniforms.draw.value = eo((b - .1 - i * .12) / 1.3) * 1.01; });
    cols.forEach((c, i) => {
      const k = eo((b - .5 - i * .14) / 1.1); c.g.scale.y = Math.max(.001, k); colMat.opacity = 1;
      const hear = clamp((b - 1.6 - i * .1) / .25), pulse = (t * .7 + i * .33) % 1;
      c.node.material.opacity = hear; c.halo.material.opacity = hear * (1 - pulse) * .6; c.halo.scale.setScalar(1 + pulse * 2.4);
      c.halo.lookAt(cam.position);
      const ping = Math.exp(-Math.pow(((t - 1.15 - 1.8 - i * .1) % 6.5 + 6.5) % 6.5 - .2, 2) / .06);
      c.line.material.opacity = hear * ping * .55;
    });
    movers.forEach((m) => { const k = (t * .06 + m.ph) % 1, e = k < .5 ? k * 2 : 2 - k * 2; const [a, z] = m.seg; m.d.position.set(lerp(a[0], z[0], e), .1, lerp(a[1], z[1], e)); m.d.material.opacity = clamp((b - 2.2) / .6) * fadeR(Math.hypot(m.d.position.x, m.d.position.z)) * .9; });
    waiters.forEach((w) => { const on = clamp((b - 2.6 - w.i * .12) / .5), p = (t * .5 + w.i * .25) % 1; const f = fadeR(Math.hypot(w.d.position.x, w.d.position.z)); w.d.material.opacity = on * f * .95; w.r.material.opacity = on * f * (1 - p) * .55; w.r.scale.setScalar(1 + p * 1.6); });
  }

  const phone = () => innerWidth < 900; let dist = 560;
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h;
    // put the tag where the composition wants it: right of the words on a laptop, between them on a phone
    let fx = .69, fy = .52;
    if (phone()) { const cr = canvas.getBoundingClientRect(), a = hero.querySelector('h1').getBoundingClientRect(), b = hero.querySelector('p').getBoundingClientRect(); fx = .5; fy = clamp(((a.bottom + b.top) / 2 - cr.top) / h, .3, .7); }
    dist = phone() ? 150 / (2 * Math.tan(10 * Math.PI / 180) * cam.aspect) : Math.max(560, 260 / (2 * Math.tan(10 * Math.PI / 180) * cam.aspect));
    hero.dataset.fx = fx; hero.dataset.fy = fy;
    cam.setViewOffset(w, h, -(fx - .5) * w, -(fy - .5) * h, w, h); cam.updateProjectionMatrix();
  };
  size(); addEventListener('resize', size);

  let px = 0, py = 0, tx = 0, ty = 0, on = true, t0 = performance.now(), lift = 0, landedSent = false;
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) requestAnimationFrame(loop); }).observe(hero);

  const CYCLE = 13, START = 1.2;
  function loop(now) {
    if (!on) return;
    const t = (now - t0) / 1000;
    const r = hero.getBoundingClientRect(); const sp = clamp(-r.top / r.height);
    px = lerp(px, tx, .05); py = lerp(py, ty, .05);

    // arrival: the tag drops onto the floor with a soft spring
    const intro = 1 - Math.exp(-3 * t) * Math.cos(5.2 * t);
    lift = lerp(lift, sp * 30, .12);
    tag.position.y = lerp(70, 0, clamp(intro)) + Math.sin(t * 1.05) * 1.6 + sp * 14;
    tag.rotation.y = 0.98 + Math.sin(t * .3) * .14 + px * .7 + sp * 1.3;
    tag.rotation.x = py * .28 - sp * .22;
    tag.rotation.z = Math.sin(t * .45) * .025;
    top.position.z = -lift;

    // the light follows the hand; the studio turns slowly
    key.position.set(-200 + px * 520, 260 - py * 200, 120 + py * 160);
    scene.environmentRotation.y = t * .06 + px * .8;

    // the story under the tag, on a loop: a path arrives, it is heard, then it waits
    const lt = Math.max(0, t - START), ci = Math.floor(lt / CYCLE), c = (lt % CYCLE);
    paths.forEach((m, i) => { m.visible = i === ci % ROUTES.length; });
    if (!landedSent && t > 1.0) { landedSent = true; hero.dispatchEvent(new Event('landed')); }
    pathMat.uniforms.draw.value = t < START ? 0 : clamp(c / 2.6) * 1.01;
    floorMat.uniforms.ring.value = c > 2.6 && c < 5.6 ? (c - 2.6) / 1.5 : 0;
    floorMat.uniforms.wait.value = c > 3.2 ? eo((c - 3.2) / 8) * .86 : 0;
    const fade = t < START ? 0 : clamp(c / .4) * clamp((CYCLE - c) / .8);
    pathMat.uniforms.fadeAll.value = fade * (1 - sp); floorMat.uniforms.fadeAll.value = (t < START ? clamp(t / START) : clamp((CYCLE - c) / .8) * .6 + .4) * (1 - sp * .8);

    const waitK = t < START ? 0 : clamp((c - 3.4) / 7) * clamp((CYCLE - c) / .9);
    pool.material.opacity = waitK * (1 - sp) * .9;
    mirror.position.set(tag.position.x, 2 * FLOOR_Y - tag.position.y, tag.position.z); mirror.rotation.set(-tag.rotation.x, tag.rotation.y, -tag.rotation.z); mirror.scale.set(1, -1, 1);
    mirror.children[0].children[0].children[0].position.z = top.position.z;
    shadow.material.opacity = clamp(1 - tag.position.y / 80) * (1 - sp * .5);
    const d = dist;
    cam.position.set(Math.sin(.15 + px * .05) * d, d * .62, Math.cos(.15 + px * .05) * d); cam.lookAt(0, -4, 0);
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame((n) => { loop(n); canvas.classList.add('ready'); fallback.classList.add('gone'); });
}
