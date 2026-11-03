// Floors films: a small film camera written in code.
// Scene -> HDR target + depth -> bloom/halation -> bokeh depth of field -> filmic grade, grain, vignette.
import * as THREE from '../v1/assets/vendor/three.module.min.js';
export { THREE };

const FS_QUAD = new THREE.BufferGeometry();
FS_QUAD.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
const VS = `varying vec2 v;void main(){v=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}`;

function pass(frag, uniforms) {
  const m = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(FS_QUAD, m); mesh.frustumCulled = false;
  const sc = new THREE.Scene(); sc.add(mesh);
  return { m, sc, u: uniforms };
}

const BRIGHT = `uniform sampler2D t;uniform float th;varying vec2 v;
void main(){vec3 c=texture2D(t,v).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(th,th*2.5,l),1.);}`;
const BLUR = `uniform sampler2D t;uniform vec2 d;varying vec2 v;
void main(){vec3 s=texture2D(t,v).rgb*.2270;
s+=(texture2D(t,v+d*1.3846).rgb+texture2D(t,v-d*1.3846).rgb)*.3162;
s+=(texture2D(t,v+d*3.2308).rgb+texture2D(t,v-d*3.2308).rgb)*.0703;gl_FragColor=vec4(s,1.);}`;
// circle of confusion, foreground dilated so near objects blur over what is behind them
const COC = `uniform sampler2D tD;uniform float cn,cf,focus,ap,maxR;uniform vec2 res;varying vec2 v;
#include <packing>
float vz(vec2 u){float d=unpackRGBAToDepth(texture2D(tD,u));return perspectiveDepthToViewZ(d,cn,cf);}
float coc(vec2 u){float z=-vz(u);return clamp(ap*(z-focus)/(z*focus)*res.y,-maxR,maxR);}
void main(){float c=coc(v);float fg=max(0.,-c);
 for(int i=0;i<28;i++){float a=float(i)*2.39996;float r=sqrt((float(i)+.5)/28.)*maxR;vec2 o=vec2(cos(a),sin(a))*r/res;float s=-coc(v+o);if(s>r)fg=max(fg,s);}
 gl_FragColor=vec4(c,fg,0.,1.);}`;
const FINAL = `uniform sampler2D tC,tCoc,tB1,tB2;uniform vec2 res;uniform float time,bloom,exposure,grain,vig,sat,ca,maxR;
uniform vec3 lift,gain;uniform float streak;varying vec2 v;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){
  vec2 cc=texture2D(tCoc,v).rg;float r=max(abs(cc.r),cc.g);
  vec3 col;float wsum;
  if(r<.6){col=texture2D(tC,v).rgb;}
  else{col=vec3(0.);wsum=0.;
    for(int i=0;i<48;i++){float a=float(i)*2.39996;float rr=sqrt((float(i)+.5)/48.);vec2 o=vec2(cos(a),sin(a))*rr*r/res;
      vec2 sc=texture2D(tCoc,v+o).rg;float sr=max(abs(sc.r),sc.g);
      float w=smoothstep(rr*r-1.5,rr*r+.5,sr+.5);vec3 s=texture2D(tC,v+o).rgb;
      w*=1.+2.*smoothstep(1.2,3.,dot(s,vec3(.3,.6,.1)));   // bright points bloom into round bokeh
      col+=s*w;wsum+=w;}
    col=wsum>0.?col/wsum:texture2D(tC,v).rgb;}
  // lens: slight chromatic split toward the edges
  vec2 dc=(v-.5);float e=dot(dc,dc);
  col.r=mix(col.r,texture2D(tC,v-dc*ca*e).r,step(r,.6)*.6);
  col.b=mix(col.b,texture2D(tC,v+dc*ca*e).b,step(r,.6)*.6);
  vec3 b=texture2D(tB1,v).rgb*.6+texture2D(tB2,v).rgb*.9;
  col+=b*bloom+b*vec3(.35,.08,.02)*bloom*.6; // halation: warm red edge around highlights
  vec3 st=vec3(0.);for(int k=1;k<9;k++){float o=float(k)*.018;st+=(texture2D(tB2,v+vec2(o,0.)).rgb+texture2D(tB2,v-vec2(o,0.)).rgb)*(1.-float(k)/9.);}
  col+=st*vec3(.45,.6,1.)*streak; // a faint horizontal lens streak on the brightest lights
  col*=exposure;
  col=aces(col);
  float l=dot(col,vec3(.2126,.7152,.0722));
  col=mix(vec3(l),col,sat);
  col=col*gain+lift*(1.-col);
  col*=mix(1.,smoothstep(1.1,.2,length(dc*vec2(1.,1.15))*1.5),vig);
  col=pow(max(col,0.),vec3(1./2.2));
  col+=(h(v*res+fract(time*13.1)*91.)-.5)*grain;
  gl_FragColor=vec4(col,1.);
}`;

export function film(canvas, W, H, look = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  r.setPixelRatio(1); r.setSize(W, H, false);
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.NoToneMapping; r.outputColorSpace = THREE.LinearSRGBColorSpace;
  const ss = look.ss || 1;
  const opt = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  const rtC = new THREE.WebGLRenderTarget(W * ss | 0, H * ss | 0, { ...opt, samples: 4 });
  const rtD = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
  const rtCoc = new THREE.WebGLRenderTarget(W, H, opt);
  const b1 = [new THREE.WebGLRenderTarget(W / 4 | 0, H / 4 | 0, opt), new THREE.WebGLRenderTarget(W / 4 | 0, H / 4 | 0, opt)];
  const b2 = [new THREE.WebGLRenderTarget(W / 8 | 0, H / 8 | 0, opt), new THREE.WebGLRenderTarget(W / 8 | 0, H / 8 | 0, opt)];
  const depthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  const pB = pass(BRIGHT, { t: { value: null }, th: { value: look.th ?? 1.4 } });
  const pBl = pass(BLUR, { t: { value: null }, d: { value: new THREE.Vector2() } });
  const pCoc = pass(COC, { tD: { value: rtD.texture }, cn: { value: .1 }, cf: { value: 100 }, focus: { value: 5 }, ap: { value: .02 }, maxR: { value: 18 }, res: { value: new THREE.Vector2(W, H) } });
  const pF = pass(FINAL, {
    tC: { value: rtC.texture }, tCoc: { value: rtCoc.texture }, tB1: { value: b1[0].texture }, tB2: { value: b2[0].texture },
    res: { value: new THREE.Vector2(W, H) }, time: { value: 0 }, bloom: { value: look.bloom ?? .5 }, exposure: { value: look.exposure ?? 1 },
    grain: { value: look.grain ?? .035 }, vig: { value: look.vig ?? .55 }, sat: { value: look.sat ?? .85 }, ca: { value: look.ca ?? .012 }, maxR: { value: 18 }, streak: { value: look.streak ?? .06 },
    lift: { value: new THREE.Vector3(...(look.lift || [.012, .018, .03])) }, gain: { value: new THREE.Vector3(...(look.gain || [1.0, .99, .97])) },
  });
  const qcam = new THREE.Camera();
  const blur = (src, pair, w, h) => {
    pBl.u.t.value = src; pBl.u.d.value.set(1 / w, 0); r.setRenderTarget(pair[1]); r.render(pBl.sc, qcam);
    pBl.u.t.value = pair[1].texture; pBl.u.d.value.set(0, 1 / h); r.setRenderTarget(pair[0]); r.render(pBl.sc, qcam);
  };
  return {
    r,
    render(scene, cam, { focus, aperture, maxR = 18, time = 0 }) {
      cam.layers.enable(1);
      r.setRenderTarget(rtC); r.render(scene, cam);
      // depth without the light shafts and dust
      const bg = scene.background, fog = scene.fog; scene.overrideMaterial = depthMat; scene.background = null; scene.fog = null; cam.layers.disable(1);
      r.setClearColor(0xffffff, 1); r.setRenderTarget(rtD); r.clear(); r.render(scene, cam);
      scene.overrideMaterial = null; scene.background = bg; scene.fog = fog; cam.layers.enable(1); r.setClearColor(0x000000, 1);
      Object.assign(pCoc.u, {}); pCoc.u.cn.value = cam.near; pCoc.u.cf.value = cam.far; pCoc.u.focus.value = focus; pCoc.u.ap.value = aperture; pCoc.u.maxR.value = maxR;
      r.setRenderTarget(rtCoc); r.render(pCoc.sc, qcam);
      pB.u.t.value = rtC.texture; r.setRenderTarget(b1[0]); r.render(pB.sc, qcam);
      blur(b1[0].texture, b1, W / 4, H / 4);
      blur(b1[0].texture, b2, W / 8, H / 8); blur(b2[0].texture, b2, W / 8, H / 8);
      pF.u.time.value = time; pF.u.maxR.value = maxR;
      r.setRenderTarget(null); r.render(pF.sc, qcam);
    },
    look: pF.u,
  };
}

// ---------- shared materials and props ----------
const rng = (s) => () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), (s ^= s >>> 16) >>> 0) / 4294967296);
export { rng };

function canvasTex(w, h, draw, { repeat = [1, 1], srgb = false } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}

// polished, worn concrete: colour + roughness (wet sheen where it is smooth)
export function concrete(repeat = [6, 6], seed = 7) {
  const R = rng(seed);
  const noise = (ctx, w, h, base, amp, blobs) => {
    ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < blobs; i++) { const x = R() * w, y = R() * h, rr = 8 + R() * 120, a = R() * amp; const g = ctx.createRadialGradient(x, y, 0, x, y, rr); const v = R() < .5 ? 0 : 255; g.addColorStop(0, `rgba(${v},${v},${v},${a})`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    const id = ctx.getImageData(0, 0, w, h); for (let i = 0; i < id.data.length; i += 4) { const n = (R() - .5) * amp * 90; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n; } ctx.putImageData(id, 0, 0);
  };
  const map = canvasTex(1024, 1024, (ctx, w, h) => {
    noise(ctx, w, h, '#55575b', .05, 900);
    ctx.strokeStyle = 'rgba(30,30,30,.25)'; ctx.lineWidth = 1.2; // saw cuts
    for (let i = 0; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * w / 2, 0); ctx.lineTo(i * w / 2, h); ctx.moveTo(0, i * h / 2); ctx.lineTo(w, i * h / 2); ctx.stroke(); }
    for (let i = 0; i < 40; i++) { ctx.strokeStyle = `rgba(20,20,20,${R() * .12})`; ctx.lineWidth = R() * 3; ctx.beginPath(); const x = R() * w, y = R() * h; ctx.moveTo(x, y); ctx.bezierCurveTo(x + R() * 200 - 100, y + R() * 200 - 100, x + R() * 300 - 150, y + R() * 300 - 150, x + R() * 400 - 200, y + R() * 400 - 200); ctx.stroke(); } // tyre marks
  }, { repeat, srgb: true });
  const rough = canvasTex(512, 512, (ctx, w, h) => noise(ctx, w, h, '#6a6a6a', .22, 400), { repeat });
  return new THREE.MeshStandardMaterial({ map, roughnessMap: rough, roughness: .42, metalness: 0, envMapIntensity: 1.0 });
}

export const M = {
  steel: () => new THREE.MeshStandardMaterial({ color: 0x5c6470, metalness: .85, roughness: .38, envMapIntensity: 2.5 }),
  darkSteel: () => new THREE.MeshStandardMaterial({ color: 0x2a2e35, metalness: .7, roughness: .45 }),
  zinc: () => new THREE.MeshStandardMaterial({ color: 0x9aa1aa, metalness: .9, roughness: .3, envMapIntensity: 3 }),
  alu: () => new THREE.MeshStandardMaterial({ color: 0xaeb3ba, metalness: .55, roughness: .42, envMapIntensity: 2.5 }),
  rubber: () => new THREE.MeshStandardMaterial({ color: 0x111214, roughness: .8 }),
  paintYellow: () => new THREE.MeshStandardMaterial({ color: 0x8a7a3a, roughness: .7 }),
  satinWhite: () => new THREE.MeshStandardMaterial({ color: 0xc9ccd0, roughness: .32, metalness: .05 }),
  graphite: () => new THREE.MeshStandardMaterial({ color: 0x1b1d21, roughness: .42, metalness: .2 }),
  cardboard: (seed = 3) => {
    const R = rng(seed);
    const map = canvasTex(256, 256, (ctx, w, h) => { ctx.fillStyle = '#8e7556'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { ctx.fillStyle = `rgba(${R() < .5 ? 0 : 255},${R() < .5 ? 0 : 230},200,${R() * .05})`; ctx.fillRect(R() * w, R() * h, R() * 40, R() * 3); } ctx.fillStyle = 'rgba(40,30,20,.35)'; ctx.fillRect(0, h * .48, w, h * .04); }, { srgb: true });
    return new THREE.MeshStandardMaterial({ map, roughness: .85 });
  },
  wrap: () => new THREE.MeshPhysicalMaterial({ color: 0xdfe6ee, roughness: .18, metalness: 0, transparent: true, opacity: .32, clearcoat: 1, clearcoatRoughness: .2, depthWrite: false }),
  glow: (c, i = 4) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i) }),
};

// environment: dark hall with long strip lights, for reflections on metal and floor
export function envFrom(r, { tint = 0xbfd0ff, strength = 1 } = {}) {
  const s = new THREE.Scene(); s.background = new THREE.Color(0x05070b);
  const room = new THREE.Mesh(new THREE.BoxGeometry(40, 14, 40), new THREE.MeshBasicMaterial({ color: 0x0a0d12, side: THREE.BackSide })); s.add(room);
  for (let i = -3; i <= 3; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(3 * strength), side: THREE.DoubleSide })); l.rotation.x = Math.PI / 2; l.position.set(i * 5, 6.8, 0); s.add(l); }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xdde8ff).multiplyScalar(2 * strength) })); door.position.set(0, 1, -19.9); door.rotation.y = 0; if (strength > 5) s.add(door);
  const pm = new THREE.PMREMGenerator(r); const t = pm.fromScene(s, .02).texture; pm.dispose(); return t;
}

// a soft volumetric shaft of light (additive, no depth write, layer 1)
export function shaft(top, bottom, r0, r1, color, strength = .08) {
  const len = top.distanceTo(bottom);
  const g = new THREE.CylinderGeometry(r0, r1, len, 48, 1, true);
  const m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { c: { value: new THREE.Color(color).multiplyScalar(strength) } },
    vertexShader: `varying float y;varying vec3 n;varying vec3 vp;void main(){y=uv.y;n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vp=p.xyz;gl_Position=projectionMatrix*p;}`,
    fragmentShader: `uniform vec3 c;varying float y;varying vec3 n;varying vec3 vp;void main(){float f=abs(dot(normalize(-vp),n));float a=pow(f,2.2)*pow(y,1.3)*(.35+.65*smoothstep(0.,.25,y));gl_FragColor=vec4(c*a,1.);}`,
  });
  const mesh = new THREE.Mesh(g, m); mesh.layers.set(1);
  mesh.position.copy(top).add(bottom).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(bottom).normalize());
  return mesh;
}

// dust in the light: tiny points, drifting; depth of field turns them into soft bokeh
export function dust(n, box, seed = 11, color = 0xcfd8ff, size = .012) {
  const R = rng(seed), p = new Float32Array(n * 3), base = [];
  for (let i = 0; i < n; i++) { const v = [box.min.x + R() * (box.max.x - box.min.x), box.min.y + R() * (box.max.y - box.min.y), box.min.z + R() * (box.max.z - box.min.z)]; base.push([...v, R() * 6.28, .3 + R()]); p.set(v, i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.PointsMaterial({ color: new THREE.Color(color).multiplyScalar(1.6), size, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(g, m); pts.layers.set(1);
  pts.tick = (t, loop) => { const a = g.attributes.position.array; base.forEach(([x, y, z, ph, sp], i) => { const w = 2 * Math.PI * t / loop; a[i * 3] = x + Math.sin(w + ph) * .05 * sp; a[i * 3 + 1] = y + Math.sin(w * 1 + ph * 2) * .04; a[i * 3 + 2] = z + Math.cos(w + ph) * .05; }); g.attributes.position.needsUpdate = true; };
  return pts;
}

export function box(w, h, d, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
export function tube(a, b, r, mat) { const len = a.distanceTo(b); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat); m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); m.castShadow = m.receiveShadow = true; return m; }

// rounded slab via extrude (bevelled edges catch light like machined parts)
export function slab(w, d, h, rad, mat, bevel = .01) {
  const s = new THREE.Shape(); const x = -w / 2, y = -d / 2;
  s.moveTo(x + rad, y); s.lineTo(x + w - rad, y); s.quadraticCurveTo(x + w, y, x + w, y + rad); s.lineTo(x + w, y + d - rad); s.quadraticCurveTo(x + w, y + d, x + w - rad, y + d);
  s.lineTo(x + rad, y + d); s.quadraticCurveTo(x, y + d, x, y + d - rad); s.lineTo(x, y + rad); s.quadraticCurveTo(x, y, x + rad, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
  g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0);
  const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m;
}

// a cast aluminium housing: body, bosses, ribs, a bore (reads as a real part under shallow focus)
export function castPart(mat, R) {
  // a cast aluminium motor housing lying on its side: bell, flange ring with bolt ears, cooling ribs, a dark bore
  const g = new THREE.Group(), r = .085 + R() * .02, L = .2 + R() * .05;
  const prof = [[0, 0], [r * .55, 0], [r * .9, .015], [r, .05], [r, L * .82], [r * 1.25, L * .84], [r * 1.25, L * .92], [r * .7, L * .94], [r * .7, L], [0, L]].map(([x, y]) => new THREE.Vector2(x, y));
  const bell = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), mat); bell.castShadow = bell.receiveShadow = true;
  const holder = new THREE.Group(); holder.add(bell);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const rib = new THREE.Mesh(new THREE.BoxGeometry(.008, L * .7, .016), mat); rib.position.set(Math.cos(a) * r, L * .45, Math.sin(a) * r); rib.rotation.y = -a; rib.castShadow = true; holder.add(rib); }
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + .4; const ear = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .03, 14), mat); ear.position.set(Math.cos(a) * r * 1.38, L * .88, Math.sin(a) * r * 1.38); ear.castShadow = true; holder.add(ear); }
  const bore = new THREE.Mesh(new THREE.CylinderGeometry(r * .42, r * .42, .012, 28), new THREE.MeshStandardMaterial({ color: 0x08090b, roughness: .5 })); bore.position.y = L + .001; holder.add(bore);
  holder.rotation.z = Math.PI / 2; holder.position.set(L / 2, r * 1.25, 0);
  g.add(holder); return g;
}

// shop trolley: tube frame, three shelves, push handle, castors
export function trolley({ L = 1.2, W = .7, H = 1.0, levels = 3, frame, shelf, load } = {}) {
  const g = new THREE.Group(); const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const r = .016;
  for (const [x, z] of [[-L / 2, -W / 2], [L / 2, -W / 2], [-L / 2, W / 2], [L / 2, W / 2]]) {
    g.add(tube(V(x, .14, z), V(x, H, z), r, frame));
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .035, 18), M.rubber()); c.rotation.x = Math.PI / 2; c.position.set(x, .055, z); c.castShadow = true; g.add(c);
    g.add(box(.05, .04, .05, frame, x, .12, z));
  }
  for (let i = 0; i < levels; i++) {
    const y = .2 + i * (H - .25) / (levels - 1 || 1);
    const s = box(L + .02, .02, W + .02, shelf, 0, y, 0); g.add(s);
    g.add(tube(V(-L / 2, y + .02, -W / 2), V(L / 2, y + .02, -W / 2), r * .8, frame)); g.add(tube(V(-L / 2, y + .02, W / 2), V(L / 2, y + .02, W / 2), r * .8, frame));
    if (load) load(g, y + .01, L, W, i);
  }
  // push handle: a bent loop above one end
  g.add(tube(V(-L / 2, H, -W / 2), V(-L / 2 - .02, H + .12, -W / 2), r, frame)); g.add(tube(V(-L / 2, H, W / 2), V(-L / 2 - .02, H + .12, W / 2), r, frame));
  g.add(tube(V(-L / 2 - .02, H + .12, -W / 2), V(-L / 2 - .02, H + .12, W / 2), r, frame));
  return g;
}
