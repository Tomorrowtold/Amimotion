// The explainer in real time: one 240 x 96 m plant built here in three.js from the founders' layout, one continuous camera
// in four scrolls. The scroll is the clock for camera and light; the plant itself keeps living (forklifts work the aisles,
// robots loop the lines, people work the stations), so it never plays like a slideshow.
//   1  Sodium. Every lamp is on and everything is one colour: nothing tells itself apart.
//   2  The lamps die. One tag's pulse leaves as a ring; each anchor it reaches flashes and answers; when three agree,
//      the trolley turns amber: it has waited 42 minutes.
//   3  Daylight pours in from the roof slot, east to west. Every tag lights in a wave outward from the trolley.
//   4  The roof parts down the slot, the camera rises through it, the plant cools into one live map: trails show where
//      carriers have been, amber columns rise on what waits.
// Colours: blue #66a5fa = located, amber #f0a43a = waiting. Props stay neutral so those two mean something.
// Hardware: only the AmIMo anchor, from the founders' CAD. Everything else is generic.
import * as THREE from '../assets/vendor/three.module.min.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const R = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const mix = (a, b, k) => a + (b - a) * k;
const BLUE = new THREE.Color(0x66a5fa), AMBER = new THREE.Color(0xf0a43a);

// ---------------------------------------------------------------- geometry: many boxes merged into one coloured mesh
const _c = new THREE.Color();
function merge(parts) {
  const pos = [], nor = [], col = [];
  for (const [g0, c] of parts) {
    const g = g0.index ? g0.toNonIndexed() : g0, p = g.attributes.position.array, n = g.attributes.normal.array; _c.set(c);
    for (let i = 0; i < p.length; i += 3) { pos.push(p[i], p[i + 1], p[i + 2]); nor.push(n[i], n[i + 1], n[i + 2]); col.push(_c.r, _c.g, _c.b); }
    g0.dispose();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeBoundingSphere(); return g;
}
const B = (sx, sy, sz, x, y, z, c) => [new THREE.BoxGeometry(sx, sy, sz).translate(x, y, z), c];
const Cy = (r, h, x, y, z, c, seg = 12, axis) => { const g = new THREE.CylinderGeometry(r, r, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); return [g.translate(x, y, z), c]; };
const Sp = (r, x, y, z, c) => [new THREE.SphereGeometry(r, 10, 8).translate(x, y, z), c];

// palette: neutral, cool, believable. Amber is never used on a prop.
const K = {
  wood: 0x7d6347, carton: 0x9a8264, carton2: 0x857360, wrap: 0xbfc4ca, upr: 0x2d4566, beam: 0x8d949c, steel: 0x8a9099,
  col: 0x7b8189, guard: 0x3a3f46, bench: 0xc9ccd0, benchF: 0x4a5058, tote: 0x56677c, screen: 0x0e1115, mat: 0x16181b,
  mach: 0xd0d3d7, dark: 0x22262c, body: 0x3a3f47, cowl: 0xc4c8ce, amr: 0xdde0e4, trol: 0x98a1ab, suit: 0x2b3343,
  vest: 0x8c96a3, skin: 0x9c7a5e, helmet: 0xe6e7e9, wall: 0x4f555d, roof: 0x30353c, truss: 0x6c727a, hood: 0x2a2e33, door: 0x7f868e
};

const PROPS = {
  palA: () => merge([B(1.2, .14, 1.0, 0, .07, 0, K.wood), B(1.14, .86, .96, 0, .57, 0, K.carton)]),
  palB: () => merge([B(1.2, .14, 1.0, 0, .07, 0, K.wood), B(1.16, 1.12, .98, 0, .7, 0, K.wrap)]),
  frame: () => merge([B(.1, 7.6, .08, -.55, 3.8, 0, K.upr), B(.1, 7.6, .08, .55, 3.8, 0, K.upr), ...[.4, 1.6, 2.8, 4, 5.2, 6.4].map(y => B(1.1, .04, .04, 0, y, 0, K.upr))]),
  beams: () => merge([1, 2, 3, 4].flatMap(L => [B(.06, .14, 2.7, -.55, 1.75 * L - .2, 1.4, K.beam), B(.06, .14, 2.7, .55, 1.75 * L - .2, 1.4, K.beam)])),
  column: () => merge([B(.4, 14, .4, 0, 7, 0, K.col), B(.5, 1.1, .5, 0, .55, 0, K.guard)]),
  station: () => merge([B(1.8, .05, .9, 0, .92, 0, K.bench), ...[[-.85, -.4], [.85, -.4], [-.85, .4], [.85, .4]].map(([x, z]) => B(.06, .9, .06, x, .45, z, K.benchF)),
    B(1.8, .03, .3, 0, 1.55, .3, K.benchF), B(.05, .7, .05, -.85, 1.25, .42, K.benchF), B(.05, .7, .05, .85, 1.25, .42, K.benchF),
    ...[0, 1, 2, 3].map(k => B(.32, .18, .26, -.6 + k * .4, 1.66, .3, K.tote)), B(.5, .32, .03, .5, 1.25, .1, K.screen), B(.5, .12, .4, -.3, 1.0, -.05, K.steel),
    B(1.6, .02, .8, 0, .01, -.85, K.mat)]),
  machine: () => merge([B(2.6, 2.1, 1.8, 0, 1.05, 0, K.mach), B(1.3, 1.1, .04, -.35, 1.2, -.92, K.dark), B(.5, .7, .06, .85, 1.35, -.92, K.dark),
    B(2.7, .12, 1.9, 0, .06, 0, K.dark), Cy(.04, .5, 1.1, 2.35, .7, K.dark, 8)]),
  dock: () => merge([B(.25, 4.2, .3, -1.75, 2.1, 0, K.dark), B(.25, 4.2, .3, 1.75, 2.1, 0, K.dark), B(3.75, .55, .5, 0, 4.4, 0, K.dark),
    B(3.3, 1.3, .06, 0, 3.6, .05, K.door), B(2.4, .06, 1.8, 0, .03, -.9, K.guard), B(.3, .4, .14, -1, 1.05, -.1, K.mat), B(.3, .4, .14, 1, 1.05, -.1, K.mat)]),
  carton: () => merge([B(.5, .3, .4, 0, .15, 0, K.carton)]),
  hood: () => merge([Cy(.5, .3, 0, 0, 0, K.hood, 16), Cy(.012, 1.2, 0, .7, 0, K.dark, 4)]),
  // movers, forward = +x
  trolley: () => merge([...[.25, .62, 1.0].map(y => B(1.1, .03, .62, 0, y, 0, K.trol)), ...[[-.53, -.29], [.53, -.29], [-.53, .29], [.53, .29]].map(([x, z]) => B(.03, 1.0, .03, x, .55, z, K.trol)),
    B(.03, .45, .6, -.6, 1.15, 0, K.trol), ...[[-.45, -.25], [.45, -.25], [-.45, .25], [.45, .25]].map(([x, z]) => B(.08, .1, .05, x, .06, z, K.dark)),
    B(.42, .3, .5, -.25, .42, 0, K.tote), B(.42, .3, .5, .24, .42, 0, K.tote), B(.5, .3, .5, -.22, .79, 0, K.carton), B(.44, .26, .48, .28, .77, 0, K.carton2), B(.6, .2, .45, 0, 1.12, 0, K.carton)]),
  bins: () => merge([B(.62, .06, .42, 0, .1, 0, K.trol), ...[0, 1, 2].map(i => B(.6, .24, .4, 0, .26 + i * .26, 0, K.tote)), ...[[-.25, -.15], [.25, -.15], [-.25, .15], [.25, .15]].map(([x, z]) => B(.06, .07, .05, x, .035, z, K.dark))]),
  cart: () => merge([B(.75, .9, .48, 0, .55, 0, K.body), B(.79, .04, .52, 0, 1.02, 0, K.dark), B(.03, .3, .44, -.42, 1.0, 0, K.steel), ...[0, 1, 2, 3].map(i => B(.68, .012, .01, 0, .3 + i * .2, -.245, K.steel)),
    ...[[-.3, -.18], [.3, -.18], [-.3, .18], [.3, .18]].map(([x, z]) => B(.07, .1, .05, x, .05, z, K.dark))]),
  forklift: () => merge([B(1.6, .55, 1.05, -.1, .5, 0, K.body), B(.45, .8, 1.08, -.85, .62, 0, K.dark), B(.55, .3, .9, .3, .92, 0, K.cowl),
    ...[[-.6, -.48], [-.6, .48], [.35, -.48], [.35, .48]].map(([x, z]) => B(.06, 1.3, .06, x, 1.45, z, K.dark)), B(1.05, .05, 1.0, -.12, 2.1, 0, K.dark),
    B(.42, .1, .5, -.35, .98, 0, K.dark), B(.1, .42, .5, -.56, 1.22, 0, K.dark),
    B(.08, 2.2, .1, .62, 1.12, -.3, K.steel), B(.08, 2.2, .1, .62, 1.12, .3, K.steel), B(.06, .45, .95, .7, .45, 0, K.dark),
    B(1.1, .045, .1, 1.28, .08, -.26, K.steel), B(1.1, .045, .1, 1.28, .08, .26, K.steel),
    ...[[-.55, -.5], [-.55, .5], [.45, -.5], [.45, .5]].map(([x, z]) => Cy(.27, .22, x, .27, z, K.dark, 14, 'z'))]),
  amr: () => merge([B(1.1, .28, .75, 0, .21, 0, K.amr), B(1.12, .07, .77, 0, .075, 0, K.dark), B(.9, .04, .6, 0, .37, 0, K.dark),
    B(.4, .22, .55, -.22, .5, 0, K.tote), B(.4, .22, .55, .22, .5, 0, K.tote)]),
  person: () => merge([B(.16, .82, .3, 0, .41, 0, K.suit), B(.24, .6, .42, 0, 1.12, 0, K.vest), B(.11, .55, .1, 0, 1.1, -.26, K.suit), B(.11, .55, .1, 0, 1.1, .26, K.suit),
    Sp(.115, 0, 1.58, 0, K.skin), Cy(.13, .09, 0, 1.68, 0, K.helmet, 12)])
};

// ---------------------------------------------------------------- the founders' CAD (AmIMo anchor)
async function cadMesh(name, meta) {
  const m = meta[name], buf = await (await fetch(`assets/cad/${name}.mesh`)).arrayBuffer();
  const q = new Uint16Array(buf, 0, m.nv * 3), p = new Float32Array(m.nv * 3);
  for (let i = 0; i < m.nv; i++) for (let k = 0; k < 3; k++) p[i * 3 + k] = m.min[k] + q[i * 3 + k] * m.scale[k];
  const g = new THREE.BufferGeometry(), nb = new THREE.InterleavedBuffer(new Int8Array(buf, m.nOff, m.nv * 4), 4);
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.InterleavedBufferAttribute(nb, 3, 0, true));
  g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, m.iOff, m.ni), 1));
  return g;
}

// ---------------------------------------------------------------- shaders
const FLOOR_PRE = `uniform float uPool,uSlot,uWipe,uMap,uTglow,uRing,uRingA;uniform vec3 uTgt,uTcol,uPoolC,uSlotC;varying vec3 vWP;
float hsh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hsh(i),hsh(i+vec2(1,0)),f.x),mix(hsh(i+vec2(0,1)),hsh(i+vec2(1,1)),f.x),f.y);}
float ln(float v,float w){return 1.-smoothstep(w*.5,w*.5+.02,abs(v));}
`;
const FLOOR_COL = `
{ vec2 p=vWP.xz;
  float m=vn(p*.35)*.6+vn(p*1.7)*.3+vn(p*9.)*.1; diffuseColor.rgb*=.86+.22*m;
  // saw-cut joints every 6 m
  vec2 j=abs(fract(p/6.+.5)-.5)*6.; diffuseColor.rgb*=1.-.35*(1.-smoothstep(.0,.03,min(j.x,j.y)));
  // painted lines: main aisle, walkway, WIP buffer boxes
  float paint=0.;
  if(p.x>4.&&p.x<236.){paint+=ln(p.y-43.8,.12)+ln(p.y-52.2,.12);
    float wz=p.y-42.6; paint+=(ln(wz-.7,.08)+ln(wz+.7,.08)); paint+=step(abs(wz),.62)*step(.5,fract(p.x/2.))*.85;}
  for(int k=0;k<6;k++){vec2 c=vec2(k<3?103.+float(k)*30.:103.+float(k-3)*30.,k<3?23.3:71.3);vec2 d=abs(p-c)-vec2(4.4,1.9);
    float box=ln(max(d.x,d.y),.1)*step(max(d.x,d.y),.1);float dash=step(.45,fract((p.x+p.y)*.9));paint+=box*dash;}
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.79,.8),clamp(paint,0.,1.)*.85);
  diffuseColor.rgb*=1.-.82*uMap;
}`;
const FLOOR_EMI = `#include <emissivemap_fragment>
{ vec2 p=vWP.xz;
  // pools under the high-bay lamps (12 m grid, none over the slot)
  vec2 c=floor((p-6.)/12.+.5)*12.+6.;vec2 d=p-c;float pool=exp(-dot(d,d)/(2.*4.2*4.2));pool*=step(4.,abs(c.y-48.));
  totalEmissiveRadiance+=uPoolC*pool*uPool*.9;
  // daylight from the roof slot, arriving east to west
  float edge=240.-uWipe*280.;float band=exp(-pow((p.y-48.)/5.5,2.))*smoothstep(edge,edge+18.,p.x);
  totalEmissiveRadiance+=uSlotC*band*uSlot*1.1;
  // the tag's light on the floor, and its pulse leaving as a ring
  float td=length(p-uTgt.xz);totalEmissiveRadiance+=uTcol*exp(-td*td/1.4)*uTglow*1.6;
  totalEmissiveRadiance+=vec3(.25,.55,1.)*exp(-pow((td-uRing)/.35,2.))*uRingA*2.2;
  // the map: a fine grid on the floor
  vec2 g=abs(fract(p/6.+.5)-.5)*6.;totalEmissiveRadiance+=vec3(.12,.3,.75)*(1.-smoothstep(.0,.08,min(g.x,g.y)))*uMap*.35;
}`;

const GLOW_VS = `attribute vec3 color;attribute float size;uniform float uScale;varying vec3 vC;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=size>0.?min(220.,size*uScale/max(-mv.z,.5)):0.;vC=color;}`;
const GLOW_FS = `varying vec3 vC;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=exp(-d*d*5.)*.75+exp(-d*d*60.)*.9;gl_FragColor=vec4(vC*a,1.);}`;
const RIM_VS = `varying vec3 vN,vV;void main(){vec4 w=modelMatrix*vec4(position,1.);vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`;
const RIM_FS = `uniform float uA;uniform vec3 uC;varying vec3 vN,vV;void main(){float r=pow(1.-abs(dot(vN,vV)),2.5);gl_FragColor=vec4(uC*r*uA,1.);}`;
const BEAM_VS = `varying float vU;void main(){vU=uv.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const BEAM_FS = `uniform float uHead,uA;uniform vec3 uC;varying float vU;void main(){float on=step(vU,uHead);float tip=exp(-pow((uHead-vU)*9.,2.));gl_FragColor=vec4(uC*(on*.55+tip*2.2)*uA,1.);}`;
const SHAFT_VS = `varying vec3 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const SHAFT_FS = `uniform float uA,uWipe;uniform vec3 uC;varying vec3 vP;void main(){float edge=240.-uWipe*280.;float m=smoothstep(edge,edge+18.,vP.x);
float h=clamp(vP.y/14.,0.,1.);gl_FragColor=vec4(uC*m*(.08+.92*h*h*h)*uA*.16,1.);}`;
const RIBBON_VS = `attribute float a;varying float vA;void main(){vA=a;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const RIBBON_FS = `uniform float uA;uniform vec3 uC;varying float vA;void main(){gl_FragColor=vec4(uC*vA*uA,1.);}`;
const COL_VS = `varying vec2 vUv;varying vec3 vN,vV;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`;
const COL_FS = `uniform float uA;uniform vec3 uC;varying vec2 vUv;varying vec3 vN,vV;void main(){float r=.35+.65*pow(1.-abs(dot(vN,vV)),1.5);float top=smoothstep(.9,1.,vUv.y);
gl_FragColor=vec4(uC*(r*(.25+.55*vUv.y)+top*1.4)*uA,1.);}`;
// the grade: sodium (one frequency), the map duotone, filmic tone, vignette, a little grain against banding
const POST_VS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const POST_FS = `uniform sampler2D tCol;uniform float uSod,uMap,uExpo,uTime,uVig;varying vec2 vUv;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec3 c=texture2D(tCol,vUv).rgb*uExpo;float l=dot(c,vec3(.2126,.7152,.0722));
c=mix(c,vec3(1.,.6,.13)*l*1.5,uSod);
float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b)),sat=(mx-mn)/(mx+1e-3);
vec3 duo=mix(vec3(.012,.022,.06),vec3(.42,.52,.78),clamp(pow(l*1.6,.8),0.,1.));c=mix(c,duo,uMap*(1.-smoothstep(.35,.65,sat))*.92);
c=aces(c);vec2 q=vUv-.5;c*=1.-uVig*dot(q,q)*1.6;c=srgb(c);c+=(h(vUv*913.+uTime)-.5)/255.*1.5;gl_FragColor=vec4(c,1.);}`;

// ---------------------------------------------------------------- the plant
const L = 240, W = 96, H = 14, SLOT = 48;
const TARGET = new THREE.Vector3(131.5, 0, 24.1);
const ANCH = [[120, 24], [144, 24], [144, 72]].map(([x, z]) => new THREE.Vector3(x, 6.2, z - .32));

export async function mount(stage, opt = {}) {
  const tier = opt.tier ?? 2, phone = !!opt.phone;
  const canvas = document.createElement('canvas'); canvas.className = 'see-gl'; canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false });
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); throw new Error('webgl2'); }
  renderer.toneMapping = THREE.NoToneMapping; renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.shadowMap.enabled = tier >= 2; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x05070d);
  scene.fog = new THREE.FogExp2(0x05070d, .01);
  const cam = new THREE.PerspectiveCamera(40, 1, .3, 1400);

  // a quiet sky for reflections in daylight
  { const s = new THREE.Scene(), sky = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide,
      vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vP;void main(){float y=normalize(vP).y;vec3 c=mix(vec3(.18,.2,.24),vec3(.85,.9,1.),smoothstep(-.1,.6,y));c+=vec3(2.5)*smoothstep(.97,.995,abs(normalize(vP).z)<.08?1.:0.)*step(.5,y);gl_FragColor=vec4(c,1.);}' }));
    s.add(sky); const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(s, .04).texture; pm.dispose(); }

  const propMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .72, metalness: .05 });
  const roofMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .8, metalness: .1, transparent: true });
  const shadowy = tier >= 2;
  function inst(geo, n, { mat = propMat, cast = true, dyn = false } = {}) {
    const m = new THREE.InstancedMesh(geo, mat, n); m.castShadow = cast && shadowy; m.count = 0;
    if (dyn) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
    scene.add(m); return m;
  }
  const D = new THREE.Object3D();
  const put = (m, x, y, z, ry = 0, s = 1, i = m.count++) => { D.position.set(x, y, z); D.rotation.set(0, ry, 0); D.scale.setScalar(s); D.updateMatrix(); m.setMatrixAt(i, D.matrix); return i; };
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  // floor, with its painted lines and the light that lands on it
  const U = { uPool: { value: 1 }, uSlot: { value: 0 }, uWipe: { value: 0 }, uMap: { value: 0 }, uTglow: { value: 0 }, uRing: { value: 0 }, uRingA: { value: 0 },
    uTgt: { value: TARGET }, uTcol: { value: new THREE.Color().copy(BLUE) }, uPoolC: { value: new THREE.Color(1, .72, .4) }, uSlotC: { value: new THREE.Color(1, .98, .94) } };
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x55585e, roughness: .42, metalness: 0 });
  floorMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = FLOOR_PRE + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + FLOOR_COL).replace('#include <emissivemap_fragment>', FLOOR_EMI);
  };
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(L, W, 1, 1), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(L / 2, 0, W / 2);
  floor.receiveShadow = true; scene.add(floor);

  // walls
  const walls = new THREE.Mesh(merge([B(L, H, .4, L / 2, H / 2, -.2, K.wall), B(L, H, .4, L / 2, H / 2, W + .2, K.wall), B(.4, H, W, -.2, H / 2, W / 2, K.wall), B(.4, H, W, L + .2, H / 2, W / 2, K.wall),
    B(L, .3, .05, L / 2, 4.6, .02, 0x3a4048), B(L, .3, .05, L / 2, 4.6, W - .02, 0x3a4048)]), propMat); walls.receiveShadow = true; scene.add(walls);

  // the roof: two halves either side of the slot, each with its trusses, purlins and lamps; in scroll 4 they part
  const roof = [0, 1].map(half => {
    const z0 = half ? SLOT + 1.6 : 0, z1 = half ? W : SLOT - 1.6, zc = (z0 + z1) / 2, dz = z1 - z0, parts = [B(L, .4, dz, L / 2, H + .2, zc, K.roof)];
    for (let x = 12; x < L; x += 12) { parts.push(B(.18, .14, dz, x, H - .1, zc, K.truss), B(.18, .14, dz, x, H - 1.4, zc, K.truss)); for (let z = z0 + 1; z < z1; z += 2.4) parts.push(B(.05, 1.3, .05, x, H - .75, z, K.truss)); }
    for (let z = z0 + 1.5; z < z1; z += 3) parts.push(B(L, .18, .08, L / 2, H - .02, z, K.truss));
    const g = new THREE.Group(), m = new THREE.Mesh(merge(parts), roofMat); g.add(m); scene.add(g);
    return g;
  });
  const lampPos = [];
  for (let x = 6; x < L; x += 12) for (let z = 6; z < W; z += 12) if (Math.abs(z - SLOT) >= 4) lampPos.push([x, z]);
  const hoodGeo = PROPS.hood();
  roof.forEach((g, half) => { const ps = lampPos.filter(([, z]) => (z > SLOT) === !!half), m = new THREE.InstancedMesh(hoodGeo, roofMat, ps.length); ps.forEach(([x, z], i) => { D.position.set(x, H - 1.8, z); D.rotation.set(0, 0, 0); D.scale.setScalar(1); D.updateMatrix(); m.setMatrixAt(i, D.matrix); }); g.add(m); });
  // the slot: open sky above, and the sheet of light that falls through it
  const skyMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }); skyMat.color.setRGB(0, 0, 0);
  const slotSky = new THREE.Mesh(new THREE.BoxGeometry(L, .05, 3.2), skyMat); slotSky.position.set(L / 2, H + 2.2, SLOT); scene.add(slotSky);
  const shaftU = { uA: { value: 0 }, uWipe: { value: 0 }, uC: { value: new THREE.Color(1, .97, .92) } };
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(L, H, 3.6).translate(L / 2, H / 2, SLOT), new THREE.ShaderMaterial({ vertexShader: SHAFT_VS, fragmentShader: SHAFT_FS, uniforms: shaftU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  shaft.renderOrder = 5; scene.add(shaft);

  // racking, west: two blocks, ten double rows, 12 bays of 2.8 m, four beam levels
  const rackRows = []; for (const z0 of [6, 56]) for (let i = 0; i < 10; i++) for (const dx of [-.65, .65]) rackRows.push([10 + i * 5.2 + dx, z0]);
  const frames = inst(PROPS.frame(), rackRows.length * 13), beams = inst(PROPS.beams(), rackRows.length * 12);
  const palA = PROPS.palA(), palB = PROPS.palB();
  const palAm = inst(palA, 6000), palBm = inst(palB, 6000);
  for (const [rx, z0] of rackRows) {
    for (let b = 0; b <= 12; b++) put(frames, rx, 0, z0 + b * 2.8);
    for (let b = 0; b < 12; b++) {
      put(beams, rx, 0, z0 + b * 2.8);
      for (let lv = 0; lv <= 4; lv++) for (const k of [-.68, .68]) if (rnd() < .84) put(rnd() < .55 ? palAm : palBm, rx, lv ? 1.75 * lv - .13 : 0, z0 + (b + .5) * 2.8 + k, Math.PI / 2);
    }
  }
  // columns on a 24 m grid, each with an AmIMo anchor from the CAD
  const cols = inst(PROPS.column(), 18);
  for (let k = 1; k < 10; k++) for (const z of [24, 72]) put(cols, k * 24, 0, z);
  // assembly: four lines, conveyors, stations both sides, machines between
  const conv = new THREE.Mesh(merge([16, 32, 64, 80].flatMap(z => [B(78, .12, .92, 129, .86, z, 0x9aa1a8), B(78, .05, .8, 129, .8, z, 0x5c6168),
    ...Array.from({ length: 40 }, (_, i) => [B(.06, .8, .06, 90.5 + i * 2, .4, z - .4, K.steel), B(.06, .8, .06, 90.5 + i * 2, .4, z + .4, K.steel)]).flat()])), propMat);
  conv.castShadow = shadowy; scene.add(conv);
  const stations = inst(PROPS.station(), 96), stationSpots = [];
  for (const z of [16, 32, 64, 80]) for (let k = 0; k < 12; k++) { const x = 93 + k * 6.2; put(stations, x, 0, z - 1.6); put(stations, x, 0, z + 1.6, Math.PI); stationSpots.push([x, z - 2.45, 0], [x, z + 2.45, Math.PI]); }
  const machines = inst(PROPS.machine(), 10);
  for (let k = 0; k < 5; k++) { put(machines, 95 + k * 14, 0, 41, Math.PI); put(machines, 95 + k * 14, 0, 55, 0); }
  const cartons = inst(PROPS.carton(), 4 * 26, { dyn: true }), cartonSeed = Array.from({ length: 4 * 26 }, () => rnd());
  // dispatch, east: staged pallets in lanes; dock doors in the north wall
  const docks = inst(PROPS.dock(), 6); for (let k = 0; k < 6; k++) put(docks, 186 + k * 9, 0, W - .2, Math.PI);
  const dispatch = [];
  for (let lane = 0; lane < 8; lane++) for (let j = 0; j < 14; j++) for (const zb of [10, 58]) if (rnd() < .8) dispatch.push([186 + lane * 6, zb + j * 2, lane]);
  dispatch.forEach(([x, z]) => put(rnd() < .5 ? palAm : palBm, x, 0, z));

  // ---------------------------------------------------------------- everything with a tag
  // tags: { kind, p: Vector3 (updated), wait (minutes), dim (people: never the glowing hero) }
  const tags = [], dynamic = [];
  const tagAt = (kind, x, y, z, wait = 0) => { const t = { kind, p: new THREE.Vector3(x, y, z), base: y, wait, dim: kind === 'person' }; tags.push(t); return t; };
  const trolleys = inst(PROPS.trolley(), 64), bins = inst(PROPS.bins(), 32), carts = inst(PROPS.cart(), 12);
  const forks = inst(PROPS.forklift(), 18, { dyn: true }), amrs = inst(PROPS.amr(), 10, { dyn: true }), people = inst(PROPS.person(), 64, { dyn: true });
  let target = null;
  for (const [bx, bz] of [[100, 24], [130, 24], [160, 24], [100, 72], [130, 72], [160, 72]]) for (let k = 0; k < 10; k++) {
    const x = bx + (k % 5) * 1.5, z = bz - 1.5 + Math.floor(k / 5) * 1.6;
    if (bz === 72 && rnd() < .3) continue;
    put(trolleys, x, 0, z, (rnd() - .5) * .12);
    const t = tagAt('trolley', x - .58, 1.42, z);
    if (bx === 130 && bz === 24 && k === 6) { t.wait = 42; t.answer = 'Trolley'; target = t; }
  }
  TARGET.set(target.p.x + .58, 0, target.p.z);
  // bins beside the stations, tool carts by the machines
  for (let i = 0; i < 26; i++) { const [x, z, r] = stationSpots[Math.floor(rnd() * stationSpots.length)]; const zz = z + (r ? .9 : -.9) * 1.3; put(bins, x + 1.3, 0, zz, 0); tagAt('bins', x + 1.3, .98, zz); }
  for (let k = 0; k < 5; k++) for (const [z, s] of [[41, -1], [55, 1]]) { if (rnd() < .2) continue; const x = 95 + k * 14 + 2, zz = z + s * 1.6; put(carts, x, 0, zz, Math.PI / 2); tagAt('cart', x, 1.08, zz); }
  // pallets in dispatch carry tags too; one of them has waited
  dispatch.forEach(([x, z, lane], i) => { if (i % 3 === 0 || (lane === 3 && z === 30)) { const t = tagAt('pallet', x, 1.32, z); if (lane === 3 && z === 30) { t.wait = 9; t.answer = 'Pallet'; } } });
  if (!tags.some(t => t.answer === 'Pallet')) { const t = tags.find(t => t.kind === 'pallet' && t.p.x === 204); if (t) { t.wait = 9; t.answer = 'Pallet'; } }

  // movers: each one a path in time; returns [x, z, heading]
  const dwellPP = (u) => { u = ((u % 1) + 1) % 1; return u < .1 ? 0 : u < .45 ? R(u, .1, .45) : u < .6 ? 1 : u < .95 ? 1 - R(u, .6, .95) : 0; };
  function mover(m, kind, f, tagY, extra = {}) { const o = { m, i: m.count++, kind, f, tag: tagAt(kind, 0, tagY, 0, extra.wait || 0), ...extra }; o.tag.answer = extra.answer; o.tag.mover = o; dynamic.push(o); return o; }
  // forklifts in the rack aisles (they reverse out, so they keep their heading), two idle in aisle 6
  for (let k = 0; k < 10; k++) {
    const i = [0, 1, 2, 3, 4, 6, 7, 8, 2, 7][k], x = 10 + i * 5.2 + 2.6, z0 = k < 5 ? 7 : 57, T = 34 + k * 3.7, ph = rnd();
    mover(forks, 'forklift', (tm) => [x, z0 + 3 + dwellPP(tm / T + ph) * 26, k % 2 ? Math.PI / 2 : -Math.PI / 2], 2.2);
  }
  const ax = 10 + 5 * 5.2 + 2.6;
  mover(forks, 'forklift', () => [ax, 66.5, Math.PI / 2], 2.2, { wait: 12, answer: 'Two forklifts' });
  mover(forks, 'forklift', () => [ax, 70.6, Math.PI / 2], 2.2, { wait: 12 });
  // forklifts on the main aisle, east and west
  for (let k = 0; k < 6; k++) {
    const z = k % 2 ? 46.2 : 49.8, x0 = 66 + k * 9, span = 120 + k * 8, T = 70 + k * 9, ph = rnd();
    mover(forks, 'forklift', (tm) => { const u = ((tm / T + ph) % 1 + 1) % 1, e = dwellPP(u); return [x0 + e * span, z, u > .52 && u < .97 ? Math.PI : 0]; }, 2.2);
  }
  // robots: one loop around the lines, crossing the main aisle at both ends
  const loop = [[86, 20], [172, 20], [172, 76], [86, 76]], seg = loop.map((p, i) => { const q = loop[(i + 1) % 4]; return Math.hypot(q[0] - p[0], q[1] - p[1]); }), per = seg.reduce((a, b) => a + b);
  const onLoop = (d) => { d = ((d % per) + per) % per; for (let i = 0; i < 4; i++) { if (d <= seg[i]) { const p = loop[i], q = loop[(i + 1) % 4], k = d / seg[i]; return [mix(p[0], q[0], k), mix(p[1], q[1], k), -Math.atan2(q[1] - p[1], q[0] - p[0])]; } d -= seg[i]; } return [86, 20, 0]; };
  for (let k = 0; k < 10; k++) { const off = k * per / 10 + rnd() * 6; mover(amrs, 'amr', (tm) => onLoop(off + tm * 1.15), .66); }
  // people: at stations (still, a little sway) and walking the walkway
  const persons = [];
  for (let k = 0; k < (phone ? 30 : 46); k++) { const [x, z, r] = stationSpots[Math.floor(rnd() * stationSpots.length)], ph = rnd() * 6; persons.push(mover(people, 'person', (tm) => [x + Math.sin(tm * .4 + ph) * .15, z + (r ? .1 : -.1), r ? Math.PI / 2 : -Math.PI / 2], 1.46)); }
  for (let k = 0; k < (phone ? 8 : 14); k++) { const x0 = 20 + rnd() * 190, span = 14 + rnd() * 22, T = span / 1.2 * 2.6, ph = rnd(), z = 42.6 + (rnd() - .5); const o = mover(people, 'person', (tm) => { const u = ((tm / T + ph) % 1 + 1) % 1, e = dwellPP(u); return [x0 + e * span, z, u > .45 && u < .95 ? Math.PI : 0]; }, 1.46); o.walk = true; persons.push(o); }

  // tags rendered: a small bright core and a halo
  const coreGeo = new THREE.SphereGeometry(.11, 10, 8), coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  const cores = new THREE.InstancedMesh(coreGeo, coreMat, tags.length); cores.instanceMatrix.setUsage(THREE.DynamicDrawUsage); cores.frustumCulled = false;
  cores.setColorAt(0, BLUE); scene.add(cores);
  // the anchors, from the CAD
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  const [gBody, gCap] = await Promise.all(['anc_body', 'anc_cap'].map(n => cadMesh(n, meta)));
  const ancMat = new THREE.MeshStandardMaterial({ color: 0x2f3237, roughness: .5, metalness: .1 }), ancCap = new THREE.MeshStandardMaterial({ color: 0x3a3e44, roughness: .46, metalness: .1 });
  const anchorsAll = [];
  for (let k = 1; k < 10; k++) for (const z of [24, 72]) anchorsAll.push(new THREE.Vector3(k * 24, 6.2, z - .32));
  const ab = new THREE.InstancedMesh(gBody, ancMat, anchorsAll.length), ac = new THREE.InstancedMesh(gCap, ancCap, anchorsAll.length);
  anchorsAll.forEach((p, i) => { D.position.copy(p); D.rotation.set(0, Math.PI, 0); D.scale.setScalar(.0034); D.updateMatrix(); ab.setMatrixAt(i, D.matrix); ac.setMatrixAt(i, D.matrix); });
  scene.add(ab, ac);

  // glows: tag halos, lamp glare, anchor LEDs, all one point cloud
  const NG = tags.length + lampPos.length + anchorsAll.length;
  const gPos = new Float32Array(NG * 3), gCol = new Float32Array(NG * 3), gSize = new Float32Array(NG);
  const glowGeo = new THREE.BufferGeometry();
  glowGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3).setUsage(THREE.DynamicDrawUsage));
  glowGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3).setUsage(THREE.DynamicDrawUsage));
  glowGeo.setAttribute('size', new THREE.BufferAttribute(gSize, 1).setUsage(THREE.DynamicDrawUsage));
  const glowU = { uScale: { value: 600 } };
  const glow = new THREE.Points(glowGeo, new THREE.ShaderMaterial({ vertexShader: GLOW_VS, fragmentShader: GLOW_FS, uniforms: glowU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.frustumCulled = false; glow.renderOrder = 10; scene.add(glow);

  // the pulse: a shell leaving the tag; lines from each anchor back to it as the anchors answer
  const rimU = { uA: { value: 0 }, uC: { value: new THREE.Color(.35, .65, 1.4) } };
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.ShaderMaterial({ vertexShader: RIM_VS, fragmentShader: RIM_FS, uniforms: rimU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  shell.renderOrder = 8; scene.add(shell);
  const tagTop = () => target.p;
  const beams3 = ANCH.map(a => {
    const u = { uHead: { value: 0 }, uA: { value: 0 }, uC: { value: new THREE.Color(.4, .7, 1.5) } };
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1, 6, 1, true).translate(0, .5, 0), new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS, uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.renderOrder = 9; scene.add(m); m.u = u; m.a = a; return m;
  });
  const tl = new THREE.PointLight(0x66a5fa, 0, 9, 2); scene.add(tl);

  // map: trails where carriers have been, columns that rise on what waits
  const carriers = dynamic.filter(o => o.kind === 'forklift' || o.kind === 'amr').filter(o => !o.wait);
  const NS = 40, rib = new Float32Array(carriers.length * NS * 18), ribA = new Float32Array(carriers.length * NS * 6);
  const ribGeo = new THREE.BufferGeometry(); ribGeo.setAttribute('position', new THREE.BufferAttribute(rib, 3).setUsage(THREE.DynamicDrawUsage)); ribGeo.setAttribute('a', new THREE.BufferAttribute(ribA, 1).setUsage(THREE.DynamicDrawUsage));
  const ribU = { uA: { value: 0 }, uC: { value: new THREE.Color(.3, .6, 1.3) } };
  const ribbons = new THREE.Mesh(ribGeo, new THREE.ShaderMaterial({ vertexShader: RIBBON_VS, fragmentShader: RIBBON_FS, uniforms: ribU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  ribbons.frustumCulled = false; ribbons.renderOrder = 6; scene.add(ribbons);
  const waiting = tags.filter(t => t.wait);
  const colU = { uA: { value: 0 }, uC: { value: new THREE.Color().copy(AMBER).multiplyScalar(1.6) } };
  const colGeo = new THREE.CylinderGeometry(1.8, 1.8, 1, 32, 1, true).translate(0, .5, 0);
  const columns = waiting.map(t => { const m = new THREE.Mesh(colGeo, new THREE.ShaderMaterial({ vertexShader: COL_VS, fragmentShader: COL_FS, uniforms: colU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); m.renderOrder = 7; m.visible = false; scene.add(m); m.t = t; return m; });

  // lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x2a2c30, 1); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1); key.position.set(150, 130, 20); key.target.position.set(120, 0, 48); scene.add(key, key.target);
  if (shadowy) { key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -150, right: 150, top: 90, bottom: -90, near: 20, far: 400 }); key.shadow.bias = -.0006; key.shadow.normalBias = .04; key.shadow.radius = 3; }

  // post: render into a multisampled half-float target, grade on the way to the screen
  let rt = null;
  const postU = { tCol: { value: null }, uSod: { value: 1 }, uMap: { value: 0 }, uExpo: { value: 1 }, uTime: { value: 0 }, uVig: { value: .5 } };
  const post = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: POST_VS, fragmentShader: POST_FS, uniforms: postU, depthTest: false, depthWrite: false }));
  const postScene = new THREE.Scene(); postScene.add(post); const postCam = new THREE.Camera();

  // ---------------------------------------------------------------- the director: camera keys over the four scrolls
  // [p, position, look-at, vertical lens in degrees for 16:9]
  const KEYS = [
    [0.00, [234, 3.0, 41], [150, 2.6, 50], 40],
    [0.55, [214, 3.6, 44.5], [130, 2.4, 46], 38],
    [1.00, [190, 6.0, 30], [134, 1.8, 30], 38],
    [1.45, [136, 10, 3], [133, 2.4, 34], 46],
    [2.00, [131.6, 4.2, 15.2], [131.5, 1.3, 24.1], 34],
    [2.35, [140, 7, 7], [124, 2, 36], 44],
    [3.00, [226, 10.5, 9], [112, 0, 56], 50],
    [3.30, [214, 9, 14], [150, 9, 42], 50],
    [3.62, [176, 70, 30], [124, 0, 48], 40],
    [3.88, [120, 240, -50], [120, 0, 48], 32],
    [4.00, [120, 230, -46], [120, 0, 48], 32]
  ];
  let posCurve, atCurve;
  let W_ = 1, H_ = 1, aspect = 1;
  function fitMap() {
    // the last key: the whole plant, framed clear of the words (left on wide screens, below on phones)
    const vf = 32, t = Math.tan(vf * Math.PI / 360), port = aspect < .9;
    const dir = port ? new THREE.Vector3(.4, 1, 0).normalize() : new THREE.Vector3(0, 1, -.42).normalize();
    const along = port ? 240 : 240, across = 96;
    const needW = port ? across * 1.08 : along * 1.04 / .58, needH = port ? along * 1.02 / .47 : across * 1.25 / .92;
    const d = Math.max(needH / (2 * t) * (port ? 1 : .95), needW / (2 * t * aspect)) + 10;
    const c = new THREE.Vector3(120, 0, 48);
    KEYS[9][1] = c.clone().addScaledVector(dir, d).toArray(); KEYS[10][1] = c.clone().addScaledVector(dir, d * .965).toArray(); KEYS[9][3] = KEYS[10][3] = vf;
    posCurve = new THREE.CatmullRomCurve3(KEYS.map(k => new THREE.Vector3(...k[1])), false, 'centripetal');
    atCurve = new THREE.CatmullRomCurve3(KEYS.map(k => new THREE.Vector3(...k[2])), false, 'centripetal');
  }
  const keyU = (p) => { let i = 0; while (i < KEYS.length - 2 && KEYS[i + 1][0] <= p) i++; const k = clamp((p - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0])); return [(i + k) / (KEYS.length - 1), i, k]; };
  const _p = new THREE.Vector3(), _a = new THREE.Vector3();
  function shoot(p, tm) {
    const [u, i, k] = keyU(p);
    posCurve.getPoint(u, _p); atCurve.getPoint(u, _a);
    // a breath of handheld while we are inside the hall
    const inside = 1 - R(p, 3.3, 3.6);
    _p.x += Math.sin(tm * .31) * .05 * inside; _p.y += Math.sin(tm * .43 + 1) * .04 * inside; _a.y += Math.sin(tm * .27 + 2) * .05 * inside;
    cam.position.copy(_p); cam.up.set(0, 1, 0); cam.lookAt(_a);
    let f = mix(KEYS[i][3], KEYS[i + 1][3], k * k * (3 - 2 * k));
    // keep the horizontal view on tall screens: a phone sees most of what a laptop sees
    if (aspect < 1.4) { const h = 2 * Math.atan(Math.tan(f * Math.PI / 360) * 1.78) * (aspect < .9 ? .78 : .9); f = Math.min(92, 2 * Math.atan(Math.tan(h / 2) / aspect) * 180 / Math.PI); }
    if (p > 3.62) f = mix(f, KEYS[9][3], R(p, 3.62, 3.88));
    cam.fov = f;
    // frame the subject clear of the words: right of centre on wide screens, above them on phones
    const map = R(p, 3.3, 3.88), port = aspect < .9;
    const dx = port ? 0 : (mix(.07, .17, map)) * W_, dy = port ? (mix(.1, .19, map)) * H_ : 0;
    cam.setViewOffset(W_, H_, -dx, dy, W_, H_);
    cam.updateProjectionMatrix();
  }

  // ---------------------------------------------------------------- light, by scroll
  const C3 = (r, g, b) => new THREE.Color(r, g, b);
  const lerpC = (a, b, k) => _lc.copy(a).lerp(b, k);
  const _lc = new THREE.Color(), _bg = new THREE.Color();
  const SOD_FOG = C3(.2, .14, .06), NIGHT = C3(.006, .01, .022), DAY_FOG = C3(.2, .24, .32), MAP_BG = C3(.006, .012, .03);
  function look(s, t) {
    const o = {};
    o.sod = s === 1 ? 1 : s === 2 ? 1 - R(t, 0, .35) : 0;
    o.pool = s === 1 ? 1 : s === 2 ? 1 - R(t, 0, .3) * .98 : s === 3 ? .02 + .1 * R(t, 0, .5) : .12 * (1 - R(t, 0, .4));
    o.hemi = s === 1 ? .32 : s === 2 ? mix(.32, .04, R(t, 0, .35)) : s === 3 ? mix(.04, .7, R(t, .05, .6)) : mix(.7, .9, R(t, .2, .7));
    o.key = s === 1 ? .35 : s === 2 ? .35 * (1 - R(t, 0, .3)) : s === 3 ? 2.5 * R(t, .0, .55) : mix(2.5, 2.0, R(t, .2, .7));
    o.slot = s === 3 ? R(t, 0, .5) : s === 4 ? 1 - R(t, 0, .35) : 0;
    o.wipe = s === 3 ? R(t, 0, .55) : s === 4 ? 1 : 0;
    o.fogD = s === 1 ? .0095 : s === 2 ? mix(.0095, .014, R(t, 0, .35)) : s === 3 ? mix(.014, .0024, R(t, 0, .6)) : mix(.0024, 0, R(t, .1, .5));
    o.fogC = s === 1 ? SOD_FOG : s === 2 ? lerpC(SOD_FOG, NIGHT, R(t, 0, .35)).clone() : s === 3 ? lerpC(NIGHT, DAY_FOG, R(t, .05, .6)).clone() : lerpC(DAY_FOG, MAP_BG, R(t, .1, .45)).clone();
    o.pulse = s === 2 ? R(t, .2, .3) : s === 3 ? 1 - R(t, 0, .2) : 0;
    o.amber = s === 2 ? R(t, .82, .94) : s > 2 ? 1 : 0;
    o.tgt = s === 2 ? R(t, .16, .26) : s > 2 ? 1 : 0;
    o.wave = s === 3 ? R(t, .28, .86) : s === 4 ? 1 : 0;
    o.roof = s === 4 ? R(t, 0, .34) : 0;
    o.map = s === 4 ? R(t, .3, .7) : 0;
    o.trails = s === 4 ? R(t, .5, .85) : 0;
    o.cols = s === 4 ? R(t, .4, .8) : 0;
    o.expo = s === 1 ? 1.15 : s === 2 ? mix(1.15, 1.5, R(t, 0, .4)) : s === 3 ? mix(1.5, .82, R(t, .1, .6)) : mix(.82, 1.3, R(t, .3, .7));
    return o;
  }

  // the s3 name tags: one of each kind, chosen where the camera ends scroll 3
  function pickLabels() {
    const c = cam.clone(); c.position.set(...KEYS[6][1]); c.lookAt(...KEYS[6][2]); c.fov = KEYS[6][3]; c.aspect = Math.max(aspect, 1); c.updateProjectionMatrix(); c.updateMatrixWorld();
    const used = [], out = [];
    for (const [kind, name] of [['forklift', 'Forklift'], ['amr', 'Robot'], ['pallet', 'Pallet'], ['bins', 'Bins'], ['cart', 'Tool cart']]) {
      let best = null, bd = 1e9;
      for (const t of tags) {
        if (t.kind !== kind || t.wait) continue;
        const q = t.p.clone().project(c); if (Math.abs(q.x) > .62 || q.y > .45 || q.y < -.55 || q.z > 1) continue;
        if (used.some(u => Math.hypot(u.x - q.x, (u.y - q.y) * 1.8) < .3)) continue;
        const d = t.p.distanceTo(c.position); if (d < bd && d > 18) { bd = d; best = [t, q]; }
      }
      if (best) { used.push(best[1]); out.push({ t: best[0], name }); }
    }
    return out;
  }

  // ---------------------------------------------------------------- per frame
  let sizeDpr = 1;
  function resize(w, h, dpr) {
    W_ = w; H_ = h; aspect = w / h; sizeDpr = dpr;
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    cam.aspect = aspect; fitMap();
    const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (rt) rt.dispose();
    rt = new THREE.WebGLRenderTarget(pw, ph, { type: THREE.HalfFloatType, samples: tier >= 1 ? 4 : 0, depthBuffer: true });
    postU.tCol.value = rt.texture;
    glowU.uScale.value = ph * .5;
  }

  const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _y = new THREE.Vector3(0, 1, 0), _col = new THREE.Color();
  let shadowTick = 0, labels = null, lastPing = -1;
  const engine = {
    canvas, tags, target, anchors3: ANCH, labels: null, onPing: null,
    get answers() { return waiting.filter(t => t.answer); },
    resize,
    frame(s, t, tm) {
      const p = (s - 1) + t, o = look(s, t);
      // movers live
      for (const d of dynamic) {
        const [x, z, r] = d.f(tm); let y = 0;
        if (d.walk) y = Math.abs(Math.sin(tm * 5.5 + d.i)) * .035;
        put(d.m, x, y, z, r, 1, d.i);
        const tg = d.tag; tg.p.set(x, tg.base + y, z);
        if (d.kind === 'forklift') tg.p.set(x - Math.cos(r) * .1, tg.base, z + Math.sin(r) * .1);
      }
      forks.instanceMatrix.needsUpdate = true; amrs.instanceMatrix.needsUpdate = true; people.instanceMatrix.needsUpdate = true;
      // cartons ride the conveyors
      cartons.count = 0;
      [16, 32, 64, 80].forEach((z, li) => { for (let k = 0; k < 26; k++) { const x = 90.4 + (((tm * .45 + cartonSeed[li * 26 + k] * 3 + k * 3) % 78) + 78) % 78; put(cartons, x, .92, z + (cartonSeed[li * 26 + k] - .5) * .2); } });
      cartons.instanceMatrix.needsUpdate = true;

      // camera
      shoot(p, tm); cam.updateMatrixWorld();

      // light
      hemi.intensity = o.hemi; hemi.color.copy(lerpC(C3(1, .8, .55), C3(.82, .88, 1), R(p, 1.2, 2.5))); hemi.groundColor.copy(lerpC(C3(.25, .2, .14), C3(.2, .21, .24), R(p, 1.2, 2.5)));
      key.intensity = o.key; key.color.copy(lerpC(C3(1, .78, .5), C3(1, .97, .92), R(p, 1.2, 2.2)));
      scene.fog.density = o.fogD; scene.fog.color.copy(o.fogC);
      _bg.copy(o.fogC); if (s === 4) _bg.lerp(C3(.02, .05, .14), R(t, .05, .3) * (1 - R(t, .45, .8))).lerp(MAP_BG, R(t, .45, .8)); scene.background.copy(_bg);
      scene.environmentIntensity = s >= 3 ? .45 * R(p, 2.1, 2.6) : .02;
      U.uPool.value = o.pool; U.uSlot.value = o.slot; U.uWipe.value = o.wipe; U.uMap.value = o.map;
      shaftU.uA.value = o.slot * (1 - o.map); shaftU.uWipe.value = o.wipe;
      skyMat.color.setRGB(6, 6, 6.4).multiplyScalar(o.slot);
      // roof parts down the slot
      roof[0].position.z = -o.roof * 52; roof[1].position.z = o.roof * 52; roof[0].position.y = roof[1].position.y = o.roof * 6;
      roofMat.opacity = 1 - R(o.roof, .55, 1); roof.forEach(g => g.visible = roofMat.opacity > .01); slotSky.visible = o.roof < .5;
      roofMat.depthWrite = roofMat.opacity > .99;

      // the pulse (scroll 2): rings every 1.6 s while it is live
      const P = 1.6, cyc = Math.floor(tm / P), ph = (tm / P) % 1, r = ph * 52;
      const tp = tagTop();
      if (o.pulse > .02 && cyc !== lastPing) { lastPing = cyc; engine.onPing && engine.onPing(o.pulse); }
      shell.position.copy(tp); shell.scale.setScalar(Math.max(.01, r)); rimU.uA.value = o.pulse * (1 - ph) * .9 * (1 - o.amber * .6);
      shell.visible = rimU.uA.value > .005;
      U.uRing.value = r * .6; U.uRingA.value = o.pulse * (1 - ph) * (1 - o.amber * .5);
      const flash = [];
      beams3.forEach((b, i) => {
        const a = b.a, len = a.distanceTo(tp); flash[i] = Math.exp(-Math.pow((r - len) / 3, 2)) * o.pulse;
        const seen = s === 2 ? R(t, .3 + i * .15, .42 + i * .15) : s === 3 ? 1 : 0;
        const head = clamp((r - len) / 18); b.u.uHead.value = Math.max(head, seen > .99 ? 1 : 0); b.u.uA.value = o.pulse * Math.max(seen * .35, head > 0 && head < 1 ? .9 : seen * .55);
        b.position.copy(a); _v.subVectors(tp, a).normalize(); b.quaternion.setFromUnitVectors(_y, _v); b.scale.set(1, len, 1); b.visible = b.u.uA.value > .005;
      });
      // the target tag's light
      _col.copy(BLUE).lerp(AMBER, o.amber); U.uTcol.value.copy(_col); U.uTglow.value = o.tgt * (s === 4 ? 1 - o.map * .6 : 1);
      tl.position.copy(tp).y += .6; tl.color.copy(_col); tl.intensity = o.tgt * (s <= 2 ? 14 : 4) * (1 - o.map);

      // tags: target first, then the wave outward in scroll 3
      const mapK = o.map;
      let gi = 0;
      tags.forEach((tg, i) => {
        const dd = tg.p.distanceTo(tp);
        let on = tg === target ? o.tgt : R(o.wave * 1.12, dd / 230, dd / 230 + .06);
        const pop = on > 0 && on < 1 ? Math.sin(on * Math.PI) : 0;
        const c = tg.wait ? (tg === target ? _col : AMBER) : BLUE;
        const k = tg.wait && tg !== target ? R(o.wave, .55, .9) : 1;
        D.position.copy(tg.p); D.rotation.set(0, 0, 0); D.scale.setScalar(on * (tg.dim ? .7 : 1.3) * (1 + mapK * 3)); D.updateMatrix(); cores.setMatrixAt(i, D.matrix);
        cores.setColorAt(i, _c.copy(c).lerp(AMBER, tg.wait ? k * (tg === target ? 0 : 1) : 0).multiplyScalar(tg.dim ? 1.6 : 4));
        const sz = on * ((tg.dim ? 1.2 : 4.2) + pop * 5 + (tg.wait ? 2 : 0)) * (1 + mapK * (tg.wait ? 6 : 3.5));
        gPos.set([tg.p.x, tg.p.y, tg.p.z], gi * 3); _c.copy(tg.wait && (tg === target || k > .5) ? (tg === target ? _col : AMBER) : BLUE).multiplyScalar(tg.dim ? .35 : 1.1);
        gCol.set([_c.r, _c.g, _c.b], gi * 3); gSize[gi++] = sz;
      });
      cores.instanceMatrix.needsUpdate = true; cores.instanceColor.needsUpdate = true;
      // lamp glare (scroll 1) and the anchors' LEDs, which flash as the pulse reaches them
      for (const [x, z] of lampPos) { gPos.set([x, H - 1.98, z + (z > SLOT ? 1 : -1) * o.roof * 52], gi * 3); _c.setRGB(1, .7, .38).multiplyScalar(.9 * o.pool * (1 - o.roof)); gCol.set([_c.r, _c.g, _c.b], gi * 3); gSize[gi++] = 4.5; }
      anchorsAll.forEach((a, j) => {
        const n = ANCH.findIndex(b => b.distanceTo(a) < 1); const f = n >= 0 ? flash[n] : 0;
        const seen = n >= 0 ? (s === 2 ? R(t, .3 + n * .15, .42 + n * .15) : s === 3 ? 1 - R(t, 0, .3) : 0) : 0;
        gPos.set([a.x, a.y - .05, a.z - .12], gi * 3); _c.copy(BLUE).multiplyScalar(.25 + 2.5 * f + seen * .8 + (s >= 3 ? .35 * R(p, 2.3, 2.7) : 0) + (s === 1 ? .1 : 0));
        gCol.set([_c.r, _c.g, _c.b], gi * 3); gSize[gi++] = .35 + f * 2.2 + seen * .6;
      });
      glowGeo.attributes.position.needsUpdate = glowGeo.attributes.color.needsUpdate = glowGeo.attributes.size.needsUpdate = true;

      // trails and wait columns (scroll 4)
      ribU.uA.value = o.trails * 1.4; ribbons.visible = o.trails > .01;
      if (ribbons.visible) {
        let v = 0, a = 0; const w = .9;
        carriers.forEach(cr => {
          let prev = cr.f(tm - NS * 1.2);
          for (let k = NS - 1; k >= 0; k--) {
            const cur = cr.f(tm - k * 1.2), dx = cur[0] - prev[0], dz = cur[1] - prev[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l * w, nz = dx / l * w, al = (1 - k / NS) * (l > .01 ? 1 : 0), al0 = (1 - (k + 1) / NS) * (l > .01 ? 1 : 0);
            const y = .05, P0 = [prev[0] + nx, y, prev[1] + nz], P1 = [prev[0] - nx, y, prev[1] - nz], P2 = [cur[0] + nx, y, cur[1] + nz], P3 = [cur[0] - nx, y, cur[1] - nz];
            for (const [pp, aa] of [[P0, al0], [P1, al0], [P2, al], [P1, al0], [P3, al], [P2, al]]) { rib[v++] = pp[0]; rib[v++] = pp[1]; rib[v++] = pp[2]; ribA[a++] = aa; }
            prev = cur;
          }
        });
        ribGeo.attributes.position.needsUpdate = ribGeo.attributes.a.needsUpdate = true;
      }
      colU.uA.value = o.cols;
      columns.forEach(m => { m.visible = o.cols > .01; m.position.set(m.t.p.x, 0, m.t.p.z); m.scale.set(1, Math.max(.01, m.t.wait * .75 * o.cols), 1); });

      // grade
      postU.uSod.value = o.sod; postU.uMap.value = o.map; postU.uExpo.value = o.expo; postU.uTime.value = tm % 10; postU.uVig.value = mix(.55, .3, o.map);

      // shadows only matter in daylight; refresh them every other frame
      if (shadowy) { key.castShadow = o.key > .4; if (key.castShadow && (shadowTick++ % 2 === 0)) renderer.shadowMap.needsUpdate = true; }
      renderer.setRenderTarget(rt); renderer.render(scene, cam);
      renderer.setRenderTarget(null); renderer.render(postScene, postCam);
    },
    // screen position of a world point, in CSS pixels; null when behind the camera
    project(v) { _v.copy(v).project(cam); if (_v.z > 1 || _v.z < -1) return null; return [(_v.x + 1) / 2 * W_, (1 - _v.y) / 2 * H_]; },
    pickLabels() { labels = labels || pickLabels(); return labels; },
    setTier(n) { renderer.shadowMap.enabled = n >= 2 && shadowy; },
    dispose() { renderer.dispose(); rt && rt.dispose(); }
  };
  // first shadow pass once everything stands
  renderer.shadowMap.needsUpdate = true;
  return engine;
}
