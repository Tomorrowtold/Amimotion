// The explainer, live: one 240 x 96 m plant at night, built in three.js, told as the founders' own picture.
// "Without AmIMotion: a limited view of the world. With AmIMotion: a complete spatial context."
// One idea carries it: light is knowing. One camera, high, at the founders' angle.
//   1  Without. The plant is dark. Four small cold lights find the founders' four moments: a worker looking for a forklift,
//      a forklift idle for hours, a robot heading into a queue, a truck waiting for a pallet nobody can find.
//   2  With. A wall of light crosses the plant from the right, as in the founders' picture; anchors wake as it reaches
//      them; behind it every tagged thing has its own light.
//   3  The answers, where the problems were: the idle forklift is the one the worker needs; the queue is on the map;
//      the truck's pallet is still at line 4. Lines on the floor join each pair.
//   4  The camera rises over the whole plant: where everything is, how long it has waited.
// Light: the "knowing" light (a soft high key with shadows plus the sky fill) is masked by the sweep inside every lit
// material, so the plant is lit only behind it; every tag adds a soft pool, computed in the materials (up to 32 near
// the camera, the rest as floor glows). Colours: blue #66a5fa = located, amber #f0a43a = waiting. Hardware: only the
// AmIMo anchor, from the founders' CAD.
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


const Wx = (r, h, x, y, z, c) => [new THREE.CylinderGeometry(r, r, h, 12).rotateZ(Math.PI / 2).translate(x, y, z), c];
PROPS.truck = () => merge([B(2.5, 2.9, 12.6, 0, 2.75, 6.5, 0xc3c8ce), B(2.3, 2.7, .04, 0, 2.7, .18, 0x0b0d10), B(2.56, .12, 12.7, 0, 1.25, 6.5, K.dark),
  B(.9, .3, 12, 0, 1, 6.5, K.dark), ...[1.2, 2.6, 10.4, 13.8].flatMap(z => [Wx(.5, .3, -1.05, .5, z, K.dark), Wx(.5, .3, 1.05, .5, z, K.dark)]),
  B(2.5, 2.7, 2.3, 0, 1.95, 14.2, 0xb9bec5), B(2.3, .9, .05, 0, 2.6, 15.36, 0x101318), B(2.5, .4, .3, 0, .7, 15.4, K.dark)]);

// ---------------------------------------------------------------- shaders
// pool lights, injected into every lit material: a soft overhead light per tagged thing, with a little gloss.
// uF masks the scene's own lights by the sweep: x = seam, y = softness, z = direct light ahead of it, w = sky fill ahead of it.
const POOL_VS_PRE = 'varying vec3 vWP,vWN;\n';
const POOL_VS = `
{ vec4 wp=vec4(transformed,1.);vec3 wn=objectNormal;
#ifdef USE_INSTANCING
  wp=instanceMatrix*wp;wn=mat3(instanceMatrix)*wn;
#endif
  wp=modelMatrix*wp;vWP=wp.xyz;vWN=normalize(mat3(modelMatrix)*wn); }`;
const POOL_FS_PRE = (n) => `#define NP ${n}
uniform vec4 uP[NP];uniform vec4 uC[NP];uniform vec4 uF;uniform float uSpec;varying vec3 vWP,vWN;
`;
const POOL_FS = `#include <lights_fragment_end>
{ float k=smoothstep(uF.x-uF.y,uF.x+uF.y,vWP.x);
  reflectedLight.directDiffuse*=mix(uF.z,1.,k);reflectedLight.directSpecular*=mix(uF.z,1.,k);reflectedLight.indirectDiffuse*=mix(uF.w,1.,k);
  vec3 n=normalize(vWN),v=normalize(cameraPosition-vWP),pl=vec3(0.),ps=vec3(0.);
  for(int i=0;i<NP;i++){vec4 P=uP[i];if(P.w<=0.)continue;vec4 C=uC[i];vec3 L=P.xyz-vWP;float d2=dot(L,L);vec3 l=L*inversesqrt(d2);
    float h2=dot(L.xz,L.xz);float cone=exp(-h2/(C.w*C.w));float e=P.w*cone*36./(d2+6.);
    float nl=max(dot(n,l),0.);pl+=C.rgb*e*(nl*.88+.12);
    vec3 hv=normalize(l+v);ps+=C.rgb*e*pow(max(dot(n,hv),0.),48.)*nl;}
  reflectedLight.directDiffuse+=pl*diffuseColor.rgb*.318;reflectedLight.directSpecular+=ps*uSpec; }`;

const FLOOR_PRE = `float hsh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hsh(i),hsh(i+vec2(1,0)),f.x),mix(hsh(i+vec2(0,1)),hsh(i+vec2(1,1)),f.x),f.y);}
float ln(float v,float w){return 1.-smoothstep(w*.5,w*.5+.02,abs(v));}
`;
const FLOOR_COL = `
{ vec2 p=vWP.xz;
  float m=vn(p*.35)*.55+vn(p*1.9)*.3+vn(p*11.)*.15; diffuseColor.rgb*=.8+.32*m;
  vec2 j=abs(fract(p/6.+.5)-.5)*6.; diffuseColor.rgb*=1.-.45*(1.-smoothstep(.0,.025,min(j.x,j.y)));
  float paint=0.;
  if(p.x>4.&&p.x<236.){paint+=ln(p.y-43.8,.12)+ln(p.y-52.2,.12);
    float wz=p.y-42.6; paint+=(ln(wz-.7,.08)+ln(wz+.7,.08)); paint+=step(abs(wz),.62)*step(.5,fract(p.x/2.))*.85;}
  if(p.x>182.&&p.x<232.&&p.y>88.&&p.y<95.6){float bx=abs(fract((p.x-186.)/9.+.5)-.5)*9.;paint+=ln(bx-1.75,.1)*step(p.y,95.);}
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.62,.6,.5),clamp(paint,0.,1.)*.75);
}`;

const GLOW_VS = `attribute vec3 color;attribute float size;uniform float uScale;varying vec3 vC;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=size>0.?min(160.,size*uScale/max(-mv.z,.5)):0.;vC=color;}`;
const GLOW_FS = `varying vec3 vC;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=exp(-d*d*6.)*.5+exp(-d*d*70.)*1.2;gl_FragColor=vec4(vC*a,1.);}`;
// floor glows for pools too far to light the materials; haze cones under the near ones
const DECAL_VS = `attribute vec3 ic;varying vec3 vC;varying vec2 vQ;void main(){vC=ic;vQ=position.xz;gl_Position=projectionMatrix*viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.);}`;
const DECAL_FS = `varying vec3 vC;varying vec2 vQ;void main(){float r=dot(vQ,vQ);gl_FragColor=vec4(vC*exp(-r*3.2),1.);}`;
const CONE_VS = `attribute vec3 ic;varying vec3 vC;varying float vY,vE;void main(){vC=ic;vY=uv.y;vec4 w=modelMatrix*instanceMatrix*vec4(position,1.);
vec3 n=normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal);vec3 v=normalize(cameraPosition-w.xyz);vE=abs(dot(n,v));gl_Position=projectionMatrix*viewMatrix*w;}`;
const CONE_FS = `varying vec3 vC;varying float vY,vE;void main(){float a=pow(vE,2.2)*(.15+.85*vY*vY)*smoothstep(0.,.08,vY);gl_FragColor=vec4(vC*a,1.);}`;
// the sweep: a thin curtain of light standing on the floor
const SEAM_VS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const SEAM_FS = `uniform vec3 uCol;varying vec2 vUv;void main(){float y=vUv.y,e=smoothstep(0.,.06,vUv.x)*smoothstep(1.,.94,vUv.x);gl_FragColor=vec4(uCol*e*(exp(-y*5.)*.9+exp(-y*40.)*2.),1.);}`;
// lines on the floor that join a problem to its answer: dashes that travel, revealed from the start
const PATH_VS = `attribute float a;varying float vA;void main(){vA=a;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const PATH_FS = `uniform float uRev,uT;uniform vec3 uCol;varying float vA;void main(){if(vA>uRev)discard;float d=fract(vA/1.8-uT*.7);float m=smoothstep(.0,.08,d)*smoothstep(.6,.52,d);
gl_FragColor=vec4(uCol*m*(.6+.4*smoothstep(uRev-3.,uRev,vA)),1.);}`;
// the grade: exposure, filmic tone, a navy floor under the blacks, vignette, grain against banding in the dark
const POST_VS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const POST_FS = `uniform sampler2D tCol;uniform float uExpo,uTime,uVig;varying vec2 vUv;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec3 c=texture2D(tCol,vUv).rgb*uExpo;c=aces(c);c+=vec3(.002,.004,.011)*(1.-c);vec2 q=vUv-.5;c*=1.-uVig*dot(q,q)*1.9;c=srgb(c);
c+=(h(vUv*913.+uTime)-.5)/255.*2.5;gl_FragColor=vec4(c,1.);}`;

// ---------------------------------------------------------------- the plant
const L = 240, W = 96;
// the founders' four moments
const SEEK = [189, 24], IDLE = [168.5, 7.2], QUEUE = [[197, 49.8], [201.6, 49.8], [206.2, 49.8]], ROBOT = [192.2, 49.8], DOCK = 204, LINE4 = [171.5, 84];

export async function mount(stage, opt = {}) {
  const tier = opt.tier ?? 2, phone = !!opt.phone, NP = tier >= 2 ? 32 : 16;
  const canvas = document.createElement('canvas'); canvas.className = 'see-gl'; canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false, preserveDrawingBuffer: !!opt.capture });
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); throw new Error('webgl2'); }
  renderer.toneMapping = THREE.NoToneMapping; renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const shadowy = tier >= 1;
  renderer.shadowMap.enabled = shadowy; renderer.shadowMap.type = tier >= 2 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap; renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x010204);
  scene.fog = new THREE.FogExp2(0x02040a, .006);
  const cam = new THREE.PerspectiveCamera(34, 1, 1, 1400);

  // the pools and the sweep: one shared set of uniforms for every lit material
  const PU = { uP: { value: Array.from({ length: NP }, () => new THREE.Vector4()) }, uC: { value: Array.from({ length: NP }, () => new THREE.Vector4(1, 1, 1, 2)) }, uF: { value: new THREE.Vector4(-50, 5, .03, .2) } };
  function lit(mat, spec = .08, floor = false) {
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, PU, { uSpec: { value: spec } });
      sh.vertexShader = POOL_VS_PRE + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>' + POOL_VS);
      sh.fragmentShader = POOL_FS_PRE(NP) + (floor ? FLOOR_PRE : '') + sh.fragmentShader.replace('#include <lights_fragment_end>', POOL_FS)
        .replace('#include <color_fragment>', '#include <color_fragment>' + (floor ? FLOOR_COL : ''));
    };
    mat.customProgramCacheKey = () => 'pool' + NP + (floor ? 'f' : '') + spec;
    return mat;
  }
  const propMat = lit(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .7, metalness: .05 }));
  const inst = (geo, n, { mat = propMat, cast = true, dyn = false } = {}) => {
    const m = new THREE.InstancedMesh(geo, mat, n); m.castShadow = cast && shadowy; m.receiveShadow = shadowy; m.count = 0;
    if (dyn) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
    scene.add(m); return m;
  };
  const D = new THREE.Object3D();
  const put = (m, x, y, z, ry = 0, s = 1, i = m.count++) => { D.position.set(x, y, z); D.rotation.set(0, ry, 0); D.scale.setScalar(s); D.updateMatrix(); m.setMatrixAt(i, D.matrix); return i; };
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  // floor: polished slab, saw cuts, worn paint
  const floorMat = lit(new THREE.MeshStandardMaterial({ color: 0x4a4d53, roughness: .42, metalness: 0 }), .4, true);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(L + 60, W + 60), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(L / 2, 0, W / 2 + 10);
  floor.receiveShadow = true; scene.add(floor);
  // walls cut low like a model, so the camera sees in; dock doors open in the north wall
  const doors = [0, 1, 2, 3, 4, 5].map(k => 186 + k * 9), wallParts = [B(L, 7, .4, L / 2, 3.5, -.2, K.wall), B(.4, 7, W, -.2, 3.5, W / 2, K.wall), B(.4, 4.8, W, L + .2, 2.4, W / 2, K.wall)];
  let x0 = 0; for (const d of doors) { wallParts.push(B(d - 1.7 - x0, 4.8, .4, (x0 + d - 1.7) / 2, 2.4, W + .2, K.wall), B(3.4, .55, .4, d, 4.52, W + .2, K.wall)); x0 = d + 1.7; }
  wallParts.push(B(L - x0, 4.8, .4, (x0 + L) / 2, 2.4, W + .2, K.wall));
  const walls = new THREE.Mesh(merge(wallParts), propMat); walls.receiveShadow = walls.castShadow = shadowy; scene.add(walls);

  // racking, west: two blocks, ten double rows, 12 bays of 2.8 m, four beam levels
  const rackRows = []; for (const z0 of [6, 56]) for (let i = 0; i < 10; i++) for (const dx of [-.65, .65]) rackRows.push([10 + i * 5.2 + dx, z0]);
  const frames = inst(PROPS.frame(), rackRows.length * 13), beams = inst(PROPS.beams(), rackRows.length * 12);
  const palAm = inst(PROPS.palA(), 6000), palBm = inst(PROPS.palB(), 6000);
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
  conv.castShadow = conv.receiveShadow = shadowy; scene.add(conv);
  const stations = inst(PROPS.station(), 96), stationSpots = [];
  for (const z of [16, 32, 64, 80]) for (let k = 0; k < 12; k++) { const x = 93 + k * 6.2; put(stations, x, 0, z - 1.6); put(stations, x, 0, z + 1.6, Math.PI); stationSpots.push([x, z - 2.45, 0], [x, z + 2.45, Math.PI]); }
  const machines = inst(PROPS.machine(), 10);
  for (let k = 0; k < 5; k++) { put(machines, 95 + k * 14, 0, 41, Math.PI); put(machines, 95 + k * 14, 0, 55, 0); }
  const cartons = inst(PROPS.carton(), 4 * 26, { dyn: true, cast: false }), cartonSeed = Array.from({ length: 4 * 26 }, () => rnd());
  // dispatch, east: staged pallets in lanes; dock doors in the north wall, trucks backed up to them
  const docks = inst(PROPS.dock(), 6); doors.forEach(d => put(docks, d, 0, W - .2, Math.PI));
  const trucks = inst(PROPS.truck(), 5); [0, 1, 2, 3, 5].forEach(k => put(trucks, doors[k], 0, W + .45));
  const dispatch = [];
  for (let lane = 0; lane < 8; lane++) for (let j = 0; j < 14; j++) for (const zb of [10, 58]) if (rnd() < .8) dispatch.push([186 + lane * 6, zb + j * 2, lane]);
  dispatch.forEach(([x, z]) => put(rnd() < .5 ? palAm : palBm, x, 0, z));

  // ---------------------------------------------------------------- everything with a tag
  // tags: { kind, p: Vector3 (updated), wait (minutes), dim (people: never the glowing hero), amberAt (scroll position it turns amber) }
  const tags = [], dynamic = [];
  const tagAt = (kind, x, y, z, wait = 0) => { const t = { kind, p: new THREE.Vector3(x, y, z), base: y, wait, dim: kind === 'person' }; tags.push(t); return t; };
  const trolleys = inst(PROPS.trolley(), 64), bins = inst(PROPS.bins(), 32), carts = inst(PROPS.cart(), 12);
  const forks = inst(PROPS.forklift(), 24, { dyn: true }), amrs = inst(PROPS.amr(), 12, { dyn: true }), people = inst(PROPS.person(), 64, { dyn: true });
  const hero = {};
  for (const [bx, bz] of [[100, 24], [130, 24], [160, 24], [100, 72], [130, 72], [160, 72]]) for (let k = 0; k < 10; k++) {
    const x = bx + (k % 5) * 1.5, z = bz - 1.5 + Math.floor(k / 5) * 1.6;
    if (bz === 72 && rnd() < .3) continue;
    put(trolleys, x, 0, z, (rnd() - .5) * .12);
    const t = tagAt('trolley', x - .58, 1.42, z);
    if (bx === 160 && bz === 24 && k === 6) { t.wait = 42; t.amberAt = 3.3; hero.trolley = t; }
  }
  for (let i = 0; i < 26; i++) { const [x, z, r] = stationSpots[Math.floor(rnd() * stationSpots.length)]; const zz = z + (r ? .9 : -.9) * 1.3; put(bins, x + 1.3, 0, zz, 0); tagAt('bins', x + 1.3, .98, zz); }
  for (let k = 0; k < 5; k++) for (const [z, s] of [[41, -1], [55, 1]]) { if (rnd() < .2) continue; const x = 95 + k * 14 + 2, zz = z + s * 1.6; put(carts, x, 0, zz, Math.PI / 2); tagAt('cart', x, 1.08, zz); }
  dispatch.forEach(([x, z], i) => { if (i % 3 === 0) tagAt('pallet', x, 1.32, z); });
  // the truck's pallet, still at the end of line 4
  put(palBm, LINE4[0], 0, LINE4[1], .3); hero.pallet = tagAt('pallet', LINE4[0], 1.32, LINE4[1], 26); hero.pallet.amberAt = 2.62;
  hero.truck = tagAt('truck', DOCK, 4.3, W + 1.2); hero.truck.dim = true;

  // movers: each one a path in time; returns [x, z, heading]
  const dwellPP = (u) => { u = ((u % 1) + 1) % 1; return u < .1 ? 0 : u < .45 ? R(u, .1, .45) : u < .6 ? 1 : u < .95 ? 1 - R(u, .6, .95) : 0; };
  function mover(m, kind, f, tagY, extra = {}) { const o = { m, i: m.count++, kind, f, tag: tagAt(kind, 0, tagY, 0, extra.wait || 0), ...extra }; o.tag.mover = o; o.tag.amberAt = extra.amberAt; dynamic.push(o); return o; }
  // forklifts in the rack aisles (they reverse out, so they keep their heading)
  for (let k = 0; k < 10; k++) {
    const i = [0, 1, 2, 3, 4, 6, 7, 8, 2, 7][k], x = 10 + i * 5.2 + 2.6, z0 = k < 5 ? 7 : 57, T = 34 + k * 3.7, ph = rnd();
    mover(forks, 'forklift', (tm) => [x, z0 + 3 + dwellPP(tm / T + ph) * 26, k % 2 ? Math.PI / 2 : -Math.PI / 2], 2.2);
  }
  // forklifts on the main aisle, in the south lane, short of the dispatch queue
  for (let k = 0; k < 5; k++) {
    const x0 = 66 + k * 9, span = 70 + k * 10, T = 60 + k * 9, ph = rnd();
    mover(forks, 'forklift', (tm) => { const u = ((tm / T + ph) % 1 + 1) % 1, e = dwellPP(u); return [x0 + e * span, 46.2, u > .52 && u < .97 ? Math.PI : 0]; }, 2.2);
  }
  // the founders' moments: the idle forklift, the queue, the robot behind it
  hero.idle = mover(forks, 'forklift', () => [IDLE[0], IDLE[1], Math.PI], 2.2, { wait: 130, amberAt: 2.12 }).tag;
  hero.queue = QUEUE.map(([x, z], i) => mover(forks, 'forklift', (tm) => [x + Math.sin(tm * .2 + i) * .03, z, 0], 2.2, { wait: 12, amberAt: 2.38 }).tag);
  hero.robot = mover(amrs, 'amr', () => [ROBOT[0], ROBOT[1], 0], .66).tag;
  // robots: one loop around the lines
  const loop = [[86, 20], [172, 20], [172, 76], [86, 76]], seg = loop.map((p, i) => { const q = loop[(i + 1) % 4]; return Math.hypot(q[0] - p[0], q[1] - p[1]); }), per = seg.reduce((a, b) => a + b);
  const onLoop = (d) => { d = ((d % per) + per) % per; for (let i = 0; i < 4; i++) { if (d <= seg[i]) { const p = loop[i], q = loop[(i + 1) % 4], k = d / seg[i]; return [mix(p[0], q[0], k), mix(p[1], q[1], k), -Math.atan2(q[1] - p[1], q[0] - p[0])]; } d -= seg[i]; } return [86, 20, 0]; };
  for (let k = 0; k < 9; k++) { const off = k * per / 9 + rnd() * 6; mover(amrs, 'amr', (tm) => onLoop(off + tm * 1.15), .66); }
  // people: at stations, on the walkway, and the one looking for a forklift between the dispatch lanes
  for (let k = 0; k < (phone ? 28 : 44); k++) { const [x, z, r] = stationSpots[Math.floor(rnd() * stationSpots.length)], ph = rnd() * 6; mover(people, 'person', (tm) => [x + Math.sin(tm * .4 + ph) * .15, z + (r ? .1 : -.1), r ? Math.PI / 2 : -Math.PI / 2], 1.46); }
  for (let k = 0; k < (phone ? 8 : 14); k++) { const x0 = 20 + rnd() * 150, span = 14 + rnd() * 22, T = span / 1.2 * 2.6, ph = rnd(), z = 42.6 + (rnd() - .5); mover(people, 'person', (tm) => { const u = ((tm / T + ph) % 1 + 1) % 1, e = dwellPP(u); return [x0 + e * span, z, u > .45 && u < .95 ? Math.PI : 0]; }, 1.46).walk = true; }
  const seeker = mover(people, 'person', (tm) => { const u = ((tm / 30) % 1 + 1) % 1, e = dwellPP(u); return [SEEK[0] + Math.sin(tm * .7) * .08, SEEK[1] - 9 + e * 18, u > .45 && u < .95 ? Math.PI / 2 : -Math.PI / 2]; }, 1.46);
  seeker.walk = true; hero.seeker = seeker.tag; seeker.tag.dim = true;

  // tags drawn as a tiny bright core
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  const cores = new THREE.InstancedMesh(new THREE.SphereGeometry(.07, 8, 6), coreMat, tags.length); cores.instanceMatrix.setUsage(THREE.DynamicDrawUsage); cores.frustumCulled = false;
  cores.setColorAt(0, BLUE); scene.add(cores);

  // the anchors, from the CAD, on the columns
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  const [gBody, gCap] = await Promise.all(['anc_body', 'anc_cap'].map(n => cadMesh(n, meta)));
  const ancMat = lit(new THREE.MeshStandardMaterial({ color: 0x2f3237, roughness: .45, metalness: .1 }), .3), ancCap = lit(new THREE.MeshStandardMaterial({ color: 0x3a3e44, roughness: .42, metalness: .1 }), .3);
  const anchorsAll = []; for (let k = 1; k < 10; k++) for (const z of [24, 72]) anchorsAll.push(new THREE.Vector3(k * 24, 6.2, z + .32));
  const ab = new THREE.InstancedMesh(gBody, ancMat, anchorsAll.length), ac = new THREE.InstancedMesh(gCap, ancCap, anchorsAll.length);
  anchorsAll.forEach((p, i) => { D.position.copy(p); D.rotation.set(0, 0, 0); D.scale.setScalar(.0034); D.updateMatrix(); ab.setMatrixAt(i, D.matrix); ac.setMatrixAt(i, D.matrix); });
  scene.add(ab, ac);

  // ---------------------------------------------------------------- light
  // { src: Vector3 above the thing, c: Color, r: radius, I: current, tag?, v? (one of the four "without" lights), lamp? }
  const pools = [];
  const COOL = new THREE.Color(.78, .87, 1), TORCH = new THREE.Color(.86, .92, 1), NIGHT_LAMP = new THREE.Color(1, .66, .38);
  // the four lights of "without", one over each moment, in the founders' order
  const VIG = [[SEEK[0], SEEK[1], 4.2], [IDLE[0], IDLE[1], 4], [199.5, 49.8, 6.4], [DOCK, W - 1, 5]];
  VIG.forEach(([x, z, r], i) => pools.push({ src: new THREE.Vector3(x, 7.5, z), c: TORCH, r, I: 0, v: i + 1 }));
  // a few far work lamps, warm and weak, that only hint at the size of the dark
  const lampsFar = [[99, 61], [74, 30], [118, 80], [48, 66], [131, 36], [28, 20]];
  lampsFar.forEach(([x, z]) => pools.push({ src: new THREE.Vector3(x, 6.8, z), c: NIGHT_LAMP, r: 3.4, I: 0, lamp: 1 }));
  const RAD = { trolley: 1.9, forklift: 2.6, pallet: 1.8, bins: 1.4, cart: 1.4, amr: 1.9 };
  for (const t of tags) if (!t.dim) pools.push({ src: new THREE.Vector3(), c: new THREE.Color().copy(COOL), r: RAD[t.kind] || 1.6, I: 0, tag: t, rr: 0 });

  // lamp hoods (the four "without" lights and the far lamps) with lenses that glow
  const lampAll = [...VIG.map(([x, z]) => [x, z]), ...lampsFar];
  const hoods = new THREE.InstancedMesh(PROPS.hood(), propMat, lampAll.length), lensMat = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false });
  const lenses = new THREE.InstancedMesh(new THREE.CircleGeometry(.42, 20).rotateX(Math.PI / 2), lensMat, lampAll.length);
  lampAll.forEach(([x, z], i) => { const y = i < 4 ? 7.8 : 7.1; put(hoods, x, y, z, 0, 1, i); D.position.set(x, y - .16, z); D.rotation.set(0, 0, 0); D.scale.setScalar(1); D.updateMatrix(); lenses.setMatrixAt(i, D.matrix); });
  lenses.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(lampAll.length * 3), 3);
  scene.add(hoods, lenses);

  // floor glows (near pools dimmed where the materials already light the floor)
  const decalGeo = new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2); decalGeo.setAttribute('ic', new THREE.InstancedBufferAttribute(new Float32Array(pools.length * 3), 3).setUsage(THREE.DynamicDrawUsage));
  const decals = new THREE.InstancedMesh(decalGeo, new THREE.ShaderMaterial({ vertexShader: DECAL_VS, fragmentShader: DECAL_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), pools.length);
  decals.frustumCulled = false; decals.renderOrder = 2; scene.add(decals);
  // haze: a faint cone under each near pool
  const coneGeo = new THREE.CylinderGeometry(.18, 1, 1, 28, 1, true).translate(0, -.5, 0);
  coneGeo.setAttribute('ic', new THREE.InstancedBufferAttribute(new Float32Array(NP * 3), 3).setUsage(THREE.DynamicDrawUsage));
  const cones = new THREE.InstancedMesh(coneGeo, new THREE.ShaderMaterial({ vertexShader: CONE_VS, fragmentShader: CONE_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), NP);
  cones.frustumCulled = false; cones.renderOrder = 4; scene.add(cones);

  // glows: tag cores' halos, anchor LEDs, lamp glare
  const NG = tags.length + anchorsAll.length + lampAll.length;
  const gPos = new Float32Array(NG * 3), gCol = new Float32Array(NG * 3), gSize = new Float32Array(NG);
  const glowGeo = new THREE.BufferGeometry();
  glowGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3).setUsage(THREE.DynamicDrawUsage));
  glowGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3).setUsage(THREE.DynamicDrawUsage));
  glowGeo.setAttribute('size', new THREE.BufferAttribute(gSize, 1).setUsage(THREE.DynamicDrawUsage));
  const glowU = { uScale: { value: 600 } };
  const glow = new THREE.Points(glowGeo, new THREE.ShaderMaterial({ vertexShader: GLOW_VS, fragmentShader: GLOW_FS, uniforms: glowU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.frustumCulled = false; glow.renderOrder = 10; scene.add(glow);

  // the knowing light: a soft high key with shadows, and the sky fill; both masked by the sweep in the materials
  const hemi = new THREE.HemisphereLight(0x6f86b0, 0x101215, .3); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xeef2ff, 2.6); key.position.set(70, 75, 0); key.target.position.set(150, 0, 48); scene.add(key, key.target);
  if (shadowy) {
    key.castShadow = true; key.shadow.mapSize.setScalar(tier >= 2 ? 2048 : 1024); const sc = key.shadow.camera; sc.left = -140; sc.right = 140; sc.top = 140; sc.bottom = -140; sc.near = 1; sc.far = 330;
    key.shadow.bias = -.0006; key.shadow.normalBias = .06; key.shadow.radius = 3; sc.updateProjectionMatrix();
  }
  // the sweep's curtain
  const seamU = { uCol: { value: new THREE.Color(0, 0, 0) } };
  const seam = new THREE.Mesh(new THREE.PlaneGeometry(W + 24, 12).rotateY(Math.PI / 2).translate(0, 6, W / 2 + 6), new THREE.ShaderMaterial({ vertexShader: SEAM_VS, fragmentShader: SEAM_FS, uniforms: seamU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  seam.frustumCulled = false; seam.renderOrder = 6; scene.add(seam);
  // lines on the floor: worker to the idle forklift, truck back to its pallet
  function path(pts, col) {
    const v = [], a = [], idx = []; let acc = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x, z] = pts[i], [px, pz] = pts[Math.max(0, i - 1)], [nx, nz] = pts[Math.min(pts.length - 1, i + 1)];
      if (i) acc += Math.hypot(x - px, z - pz);
      let dx = nx - px, dz = nz - pz; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      v.push(x - dz * .22, .05, z + dx * .22, x + dz * .22, .05, z - dx * .22); a.push(acc, acc);
      if (i) { const b = (i - 1) * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setAttribute('a', new THREE.Float32BufferAttribute(a, 1)); g.setIndex(idx);
    const u = { uRev: { value: 0 }, uT: { value: 0 }, uCol: { value: new THREE.Color(col) } };
    const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: PATH_VS, fragmentShader: PATH_FS, uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    m.frustumCulled = false; m.renderOrder = 3; scene.add(m); return { u, len: acc };
  }
  const pathSeek = path([[SEEK[0], SEEK[1]], [SEEK[0], 8.6], [IDLE[0] + 3.2, 8.6], [IDLE[0] + 2.2, IDLE[1]]], BLUE);
  const pathTruck = path([[DOCK, W - 1], [DOCK, 89.2], [178, 89.2], [174, 87], [LINE4[0] + 1, LINE4[1] + 1.2]], BLUE);

  // post
  let rt = null;
  const postU = { tCol: { value: null }, uExpo: { value: 1 }, uTime: { value: 0 }, uVig: { value: .6 } };
  const postScene = new THREE.Scene(), postCam = new THREE.Camera();
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: POST_VS, fragmentShader: POST_FS, uniforms: postU, depthTest: false, depthWrite: false })));

  // ---------------------------------------------------------------- the camera: one shot at the founders' angle, then up
  // keys: [p, position, look-at, lens]; landscape and portrait have their own framing of the same four moments
  const SHOT = {
    land: [[0, [150, 96, 196], [193, 0, 57], 31], [1, [151, 93, 192], [193, 0, 57], 31], [2, [152, 90, 188], [193, 0, 57], 31], [3, [153, 87, 184], [193, 0, 57], 31]],
    // the phone pans from moment to moment in close-up, and pulls back for the sweep
    port: [[0, [188, 70, 99], [179, 0, 21], 34], [0.36, [188.4, 70, 98.6], [179.4, 0, 20.6], 34], [0.46, [207, 70, 127], [198, 0, 49], 34], [0.58, [207.4, 70, 126.6], [198.4, 0, 48.6], 34], [0.66, [209, 70, 168], [200, 0, 90], 34], [0.76, [209.4, 70, 167.6], [200.4, 0, 89.6], 34], [0.94, [201.8, 122.5, 196.5], [186, 0, 60], 34], [2, [201.3, 119.0, 192.6], [186, 0, 60], 34], [2.12, [188, 70, 99], [179, 0, 21], 34], [2.32, [188.4, 70, 98.6], [179.4, 0, 20.6], 34], [2.4, [207, 70, 127], [198, 0, 49], 34], [2.56, [207.4, 70, 126.6], [198.4, 0, 48.6], 34], [2.64, [199.2, 87.5, 185.5], [188, 0, 88], 34], [2.9, [199.7, 87.5, 185.1], [188.4, 0, 87.6], 34], [3.05, [201.3, 119.0, 188.6], [186, 0, 56], 34]]
  };
  let KEYS = [], posCurve, atCurve, W_ = 1, H_ = 1, aspect = 1;
  function fitMap() {
    const port = aspect < .9, vf = 30, t = Math.tan(vf * Math.PI / 360);
    const dir = port ? new THREE.Vector3(.5, 1, 0).normalize() : new THREE.Vector3(0, 1, .62).normalize();
    const needW = port ? 96 * 1.1 : 240 * 1.3, needH = port ? 240 * 1.04 / .62 : 96 * 1.35 / .78;
    const d = Math.max(needH / (2 * t), needW / (2 * t * aspect)) + 8, c = new THREE.Vector3(120, 0, 48);
    KEYS = SHOT[port ? 'port' : 'land'].map(k => k.slice());
    KEYS.push([3.45, port ? [200, 170, 120] : [190, 130, 150], [150, 0, 50], 32]);
    KEYS.push([3.9, c.clone().addScaledVector(dir, d).toArray(), c.toArray(), vf], [4, c.clone().addScaledVector(dir, d * .97).toArray(), c.toArray(), vf]);
    posCurve = new THREE.CatmullRomCurve3(KEYS.map(k => new THREE.Vector3(...k[1])), false, 'centripetal');
    atCurve = new THREE.CatmullRomCurve3(KEYS.map(k => new THREE.Vector3(...k[2])), false, 'centripetal');
  }
  const keyU = (p) => { let i = 0; while (i < KEYS.length - 2 && KEYS[i + 1][0] <= p) i++; const k = clamp((p - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0])); return [(i + k) / (KEYS.length - 1), i, k]; };
  const _p = new THREE.Vector3(), _a = new THREE.Vector3();
  function shoot(p, tm) {
    const [u, i, k] = keyU(p);
    posCurve.getPoint(u, _p); atCurve.getPoint(u, _a);
    const drift = 1 - R(p, 3, 3.6);
    _p.x += Math.sin(tm * .11) * .6 * drift; _p.y += Math.sin(tm * .17 + 1) * .3 * drift;
    cam.position.copy(_p); cam.up.set(0, 1, 0); cam.lookAt(_a);
    let f = mix(KEYS[i][3], KEYS[i + 1][3], k * k * (3 - 2 * k));
    if (aspect > .9 && aspect < 1.5) f = 2 * Math.atan(Math.tan(f * Math.PI / 360) * 1.6 / aspect) * 180 / Math.PI;
    cam.fov = f;
    // keep the subject clear of the words: low left on landscape, the bottom on portrait
    const top = R(p, 3, 3.9), port = aspect < .9;
    const dx = port ? 0 : mix(.07, .03, top) * W_, dy = port ? mix(.12, .16, top) * H_ : mix(-.03, 0, top) * H_;
    cam.setViewOffset(W_, H_, -dx, dy, W_, H_);
    cam.updateProjectionMatrix();
  }

  // ---------------------------------------------------------------- the marks the page pins to the plant
  // op(p) is how visible each one is at scroll position p (0..4); cls: q = a problem (without), a = an answer, w = waiting
  const P3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const fade = (a, b, c, d) => (p) => R(p, a, b) * (1 - R(p, c, d));
  const marks = [
    { p: hero.seeker.p, cls: 'q', html: 'Looking for a free forklift <em>· 20 min</em>', op: fade(.1, .18, 1.12, 1.3) },
    { p: hero.idle.p, cls: 'q', html: 'Forklift idle <em>· over 2 h</em>', op: fade(.3, .38, 1.12, 1.3) },
    { p: hero.robot.p, cls: 'q', html: 'Robot can’t see the queue ahead', op: fade(.5, .58, 1.12, 1.3) },
    { p: P3(DOCK, 4.4, W + 1), cls: 'q', html: 'Truck waiting <em>· where is its pallet?</em>', op: fade(.7, .78, 1.12, 1.3) },
    { p: hero.idle.p, cls: 'a', html: 'Free forklift <em>· ' + Math.round(pathSeek.len / 5) * 5 + ' m away</em>', op: fade(2.16, 2.26, 3.1, 3.25) },
    { p: hero.queue[1].p, cls: 'a', html: '3 forklifts queued <em>· 12 min</em>', op: fade(2.42, 2.52, 3.1, 3.25) },
    { p: hero.pallet.p, cls: 'a', html: 'Its pallet <em>· still at line 4</em>', op: fade(2.66, 2.76, 3.1, 3.25) },
    { p: hero.idle.p, cls: 'w', html: 'Forklift <em>· 2 h 10 min</em>', op: fade(3.55, 3.65, 9, 9) },
    { p: hero.queue[1].p, cls: 'w', html: 'Three forklifts <em>· 12 min</em>', op: fade(3.62, 3.72, 9, 9) },
    { p: hero.pallet.p, cls: 'w', html: 'Pallet <em>· 26 min</em>', op: fade(3.69, 3.79, 9, 9) },
    { p: hero.trolley.p, cls: 'w', html: 'Trolley <em>· 42 min</em>', op: fade(3.76, 3.86, 9, 9) }
  ];

  // ---------------------------------------------------------------- per frame
  function resize(w, h, dpr) {
    W_ = w; H_ = h; aspect = w / h;
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    cam.aspect = aspect; fitMap();
    const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (rt) rt.dispose();
    rt = new THREE.WebGLRenderTarget(pw, ph, { type: THREE.HalfFloatType, samples: tier >= 1 ? 4 : 0 });
    postU.tCol.value = rt.texture; glowU.uScale.value = ph * .5;
  }

  const _v = new THREE.Vector3(), _c2 = new THREE.Color(), _w = new THREE.Color();
  let lastSeam = 1e9, shadowAt = -1, shadowOK = false;
  const ANCX = [...new Set(anchorsAll.map(a => a.x))];
  const engine = {
    canvas, marks, onPing: null, resize,
    frame(s, t, tm) {
      const p = (s - 1) + t;
      // movers live
      for (const d of dynamic) {
        const [x, z, r] = d.f(tm); let y = 0;
        if (d.walk) y = Math.abs(Math.sin(tm * 5.5 + d.i)) * .035;
        put(d.m, x, y, z, r, 1, d.i);
        d.tag.p.set(x, d.tag.base + y, z);
      }
      forks.instanceMatrix.needsUpdate = amrs.instanceMatrix.needsUpdate = people.instanceMatrix.needsUpdate = true;
      cartons.count = 0;
      [16, 32, 64, 80].forEach((z, li) => { for (let k = 0; k < 26; k++) { const x = 90.4 + (((tm * .45 + cartonSeed[li * 26 + k] * 3 + k * 3) % 78) + 78) % 78; put(cartons, x, .92, z + (cartonSeed[li * 26 + k] - .5) * .2); } });
      cartons.instanceMatrix.needsUpdate = true;
      shoot(p, tm); cam.updateMatrixWorld();

      // the sweep: from the west wall to the east, slow where the camera looks
      const sw = R(p, 1.14, 1.86), seamX = p < 1.14 ? 400 : p > 1.86 ? -60 : mix(250, 122, sw);
      PU.uF.value.set(seamX, 5, .1, .75);
      seam.position.x = seamX; _c2.copy(COOL).multiplyScalar(.5 * R(p, 1.14, 1.2) * (1 - R(p, 1.78, 1.86))); seamU.uCol.value.copy(_c2);
      // the anchors wake as it reaches them, each with a ping
      for (const ax of ANCX) if (lastSeam > ax && seamX <= ax && seamX > -50 && ax > 110) engine.onPing && engine.onPing(1);
      lastSeam = seamX;
      const calm = R(p, 3.2, 3.8);

      for (const pl of pools) {
        if (pl.v) {
          const on = R(p, (pl.v - 1) * .2 + .06, (pl.v - 1) * .2 + .16) * (1 - R(seamX, pl.src.x + 8, pl.src.x - 4));
          pl.I = on * (pl.v === 3 ? 2.2 : 1.8); continue;
        }
        if (pl.lamp) { pl.I = .5 * (1 - R(p, 1.1, 1.5)); continue; }
        const tg = pl.tag; pl.src.set(tg.p.x, 6.4, tg.p.z);
        const on = R(tg.p.x - seamX, 0, 7);
        const amber = tg.amberAt ? R(p, tg.amberAt, tg.amberAt + .12) * (tg.amberAt < 3 ? 1 - R(p, 3.1, 3.3) * .0 : 1) : 0;
        const hot = amber > 0;
        pl.I = on * .9 * (1 - calm * .35) * (1 + amber * 1.1);
        pl.c.copy(COOL).lerp(AMBER, amber); pl.rr = pl.r * (1 + amber * (tg.kind === 'forklift' ? .5 : .9)) * (hot ? 1 : 1);
      }
      // the near set: brightest for the camera
      const cp = cam.position;
      for (const pl of pools) pl.score = pl.I > .01 ? pl.I * (pl.v ? 6 : pl.tag && pl.tag.amberAt ? 3 : 1) / (1 + pl.src.distanceTo(cp) / 40) : 0;
      const near = pools.filter(q => q.score > 0).sort((a, b) => b.score - a.score).slice(0, NP);
      const nearSet = new Set(near);
      for (let i = 0; i < NP; i++) {
        const q = near[i];
        if (q) { PU.uP.value[i].set(q.src.x, q.src.y, q.src.z, q.I); PU.uC.value[i].set(q.c.r, q.c.g, q.c.b, q.rr || q.r); } else PU.uP.value[i].w = 0;
        if (q) { D.position.copy(q.src); D.rotation.set(0, 0, 0); D.scale.set((q.rr || q.r) * .95, q.src.y, (q.rr || q.r) * .95); } else D.scale.setScalar(0);
        D.updateMatrix(); cones.setMatrixAt(i, D.matrix);
        _c2.copy(q ? q.c : _w.setRGB(0, 0, 0)).multiplyScalar(q ? q.I * (q.v ? .16 : .03) * (1 - R(p, 1.3, 2)) : 0); coneGeo.attributes.ic.setXYZ(i, _c2.r, _c2.g, _c2.b);
      }
      cones.instanceMatrix.needsUpdate = true; coneGeo.attributes.ic.needsUpdate = true;
      pools.forEach((q, i) => {
        const r = (q.rr || q.r) * 1.05; D.position.set(q.src.x, .02, q.src.z); D.rotation.set(0, 0, 0); D.scale.set(r, 1, r); D.updateMatrix(); decals.setMatrixAt(i, D.matrix);
        _c2.copy(q.c).multiplyScalar(q.I * (nearSet.has(q) ? .04 : .3)); decalGeo.attributes.ic.setXYZ(i, _c2.r, _c2.g, _c2.b);
      });
      decals.instanceMatrix.needsUpdate = true; decalGeo.attributes.ic.needsUpdate = true;
      lampAll.forEach((_, i) => { const q = pools[i]; _c2.copy(q.c).multiplyScalar(q.I * 9); lenses.setColorAt(i, _c2); });
      lenses.instanceColor.needsUpdate = true;
      hemi.intensity = .3 * (1 - calm * .2); key.intensity = 2.6 * (1 - calm * .3);
      scene.fog.density = mix(.006, .0025, R(p, 1, 2)) * (1 - R(p, 3.2, 3.8) * .8);
      // shadows only change when something moves enough to see it: refresh a few times a second, never in the dark
      if (shadowy && seamX < 300 && (!shadowOK || Math.abs(tm - shadowAt) > (tier >= 2 ? .25 : 1))) { renderer.shadowMap.needsUpdate = true; shadowAt = tm; shadowOK = true; }

      // lines on the floor
      pathSeek.u.uRev.value = R(p, 2.1, 2.3) * pathSeek.len * (1 - R(p, 3.1, 3.25)); pathSeek.u.uT.value = tm;
      pathTruck.u.uRev.value = R(p, 2.6, 2.8) * pathTruck.len * (1 - R(p, 3.1, 3.25)); pathTruck.u.uT.value = tm;

      // tags and lights in the dark
      let gi = 0;
      const big = 1 + R(p, 3.2, 3.9) * 3;
      tags.forEach((tg, i) => {
        const pl = tg.dim ? null : pools.find(q => q.tag === tg);
        const on = tg.dim ? R(tg.p.x - seamX, 0, 7) * .6 : pl ? clamp(pl.I) : 0;
        const amber = pl && pl.c.g < .8;
        const a = amber ? AMBER : BLUE;
        D.position.copy(tg.p); D.rotation.set(0, 0, 0); D.scale.setScalar(on > 0 && tg.kind !== 'truck' ? (tg.dim ? .7 : 1) * big : 0); D.updateMatrix(); cores.setMatrixAt(i, D.matrix);
        cores.setColorAt(i, _c2.copy(a).multiplyScalar(tg.dim ? 1.2 : 5));
        gPos.set([tg.p.x, tg.p.y, tg.p.z], gi * 3); _c2.copy(a).multiplyScalar((tg.dim ? .25 : .9) * on);
        gCol.set([_c2.r, _c2.g, _c2.b], gi * 3); gSize[gi++] = on > 0 && tg.kind !== 'truck' ? (tg.dim ? .5 : .9) * (1 + R(p, 3.2, 3.9) * 5) : 0;
      });
      cores.instanceMatrix.needsUpdate = true; cores.instanceColor.needsUpdate = true;
      anchorsAll.forEach((a) => {
        const d = a.x - seamX, f = d >= 0 && seamX > -50 ? Math.exp(-d / 5) : 0, on = d >= 0 ? 1 : 0;
        gPos.set([a.x, a.y - .06, a.z + .1], gi * 3); _c2.copy(BLUE).multiplyScalar(.05 + .35 * on + 5 * f);
        gCol.set([_c2.r, _c2.g, _c2.b], gi * 3); gSize[gi++] = .3 + f * 2.2;
      });
      lampAll.forEach(([x, z], i) => { gPos.set([x, i < 4 ? 7.6 : 6.9, z], gi * 3); _c2.copy(pools[i].c).multiplyScalar(pools[i].I * .9); gCol.set([_c2.r, _c2.g, _c2.b], gi * 3); gSize[gi++] = 2.6; });
      glowGeo.attributes.position.needsUpdate = glowGeo.attributes.color.needsUpdate = glowGeo.attributes.size.needsUpdate = true;

      postU.uExpo.value = mix(1.5, 1.0, R(p, 1.2, 1.9)); postU.uTime.value = tm % 10; postU.uVig.value = mix(.75, .45, R(p, 1.2, 1.9));
      renderer.setRenderTarget(rt); renderer.render(scene, cam);
      renderer.setRenderTarget(null); renderer.render(postScene, postCam);
    },
    project(v) { _v.copy(v).project(cam); if (_v.z > 1 || _v.z < -1) return null; return [(_v.x + 1) / 2 * W_, (1 - _v.y) / 2 * H_]; },
    dispose() { renderer.dispose(); rt && rt.dispose(); }
  };
  return engine;
}
