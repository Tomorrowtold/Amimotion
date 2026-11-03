// locate-scene.js (round 19): "How it locates a tag", live. A slice of an Indian plant floor in metres: epoxy aisle with
// worn yellow lines, two steel columns, a rack end, and a steel WIP trolley of machined aluminium housings. The AmIGo tag
// on the trolley and the three AmIMo anchors are the founders' CAD (quantised meshes in assets/locate/cad).
// The section's runway (--p, 0 to 1) drives four steps: 1 the trolley rolls in and the tag wakes; 2 three timing lines
// run from the tag to the anchors with each arrival time and angle; 3 the lines resolve into one mark on the floor while
// the camera turns top-down and the floor becomes the live map; 4 the map keeps the last seen mark, the path, and an
// amber waiting timer. Drag the trolley (or use the arrow keys) and the lines, figures and mark follow.
// Timings are illustrative: distance over the speed of light, from the distances drawn. Nothing here is customer data.
import * as THREE from '../vendor/three.module.min.js';

const CAD_DEFAULT = new URL('../locate/cad/', import.meta.url);
// the scene's own styles (overlay lines, figures), injected once; colours read the site tokens, with fallbacks
const CSS = `.lz-host{position:relative;overflow:hidden;background:var(--ground,#f0f6ff)}
.lz-host canvas,.lz-host .lz-ov{position:absolute;inset:0;width:100%;height:100%;display:block}
.lz-host canvas{cursor:grab;outline:none;touch-action:pan-y}.lz-host canvas:focus-visible{box-shadow:inset 0 0 0 2px var(--focus,#4b3df0)}.lz-host.is-drag canvas{cursor:grabbing}
.lz-host .lz-ov{pointer-events:none;overflow:visible}
.lz-ov line{stroke:var(--located,#1f6bff);stroke-width:1.5;stroke-linecap:round;fill:none}
.lz-ov .lz-lead{stroke:var(--ink,#0b1238);stroke-width:1;opacity:0}
.lz-ov .lz-trail{stroke:var(--located,#1f6bff);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;fill:none}
.lz-ov circle{fill:var(--located,#1f6bff)}
.lz-cross path{stroke:var(--ink,#0b1238);stroke-width:1.5;stroke-linecap:round;fill:none}
.lz-ruler line,.lz-ruler path{stroke:var(--ink,#0b1238);stroke-width:1;fill:none}
.lz-ruler g line{stroke:var(--located,#1f6bff);stroke-width:2}
.lz-ruler .lz-minor{stroke:var(--ink,#0b1238);opacity:.35}
.lz-ruler text{font:500 11px/1 var(--font-text,system-ui,sans-serif);fill:var(--ink,#0b1238);font-variant-numeric:tabular-nums}
.lz-ruler .lz-unit{fill:var(--ink-soft,#3d4870)}
.lz-ruler .lz-n{fill:var(--located,#1f6bff)}
.lz-l{position:absolute;left:0;top:0;pointer-events:none;font:500 12px/1.35 var(--font-text,system-ui,sans-serif);color:var(--ink,#0b1238);font-variant-numeric:tabular-nums;white-space:nowrap;background:var(--surface,#fff);border:1px solid var(--hairline,rgba(11,18,56,.1));border-radius:4px;padding:5px 8px;opacity:0}
.lz-l b{display:block;font-weight:500;font-size:11px;color:var(--ink-soft,#3d4870)}
.lz-l i{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--located,#1f6bff);margin-right:6px;vertical-align:1px}
.lz-l.is-sleep i{background:var(--ink-soft,#3d4870);opacity:.45}
.lz-l.lz-mid{padding:2px 6px;font-size:11px;color:var(--located,#1f6bff);border-color:rgba(31,107,255,.25)}
.lz-l .lz-t{color:var(--ink-soft,#3d4870)}
.lz-l.lz-wait b span{color:var(--ink,#0b1238);font-weight:500}
.lz-l.lz-wait em{display:block;margin-top:4px;font-style:normal;background:var(--waiting,#ffb020);color:var(--ink,#0b1238);border-radius:3px;padding:2px 6px}
.lz-hint{position:absolute;left:var(--margin,24px);bottom:var(--s-4,16px);margin:0;font:500 12px/1.3 var(--font-text,system-ui,sans-serif);color:var(--ink-soft,#3d4870);pointer-events:none;transition:opacity .4s}
.lz-hint.is-used{opacity:0}
@media (max-width:760px){.lz-l{font-size:11px;padding:4px 6px}.lz-l.lz-mid{font-size:10px;padding:1px 5px}}`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (k, a, b) => clamp((k - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const C_LIGHT = 0.299792458;                       // metres per nanosecond
const XMIN = -4.6, XMAX = 3.0, XIN = -8.5;         // where the trolley may stand, and where it enters

async function cadMesh(name, meta, CAD) {
  const m = meta[name];
  const buf = await (await fetch(new URL(name + '.bin', CAD))).arrayBuffer();
  const q = new Uint16Array(buf, 0, m.nv * 3), p = new Float32Array(m.nv * 3);
  for (let i = 0; i < m.nv; i++) for (let k = 0; k < 3; k++) p[i * 3 + k] = m.min[k] + q[i * 3 + k] * m.scale[k];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(new Int8Array(buf, m.nOff, m.nv * 4), 4), 3, 0, true));
  g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, m.iOff, m.ni), 1));
  return g;
}

function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// merge non-indexed copies of simple geometries (avoids pulling in BufferGeometryUtils)
function mergeGeo(list) {
  const gs = list.map((g) => g.index ? g.toNonIndexed() : g), n = gs.reduce((a, g) => a + g.attributes.position.count, 0);
  const out = new THREE.BufferGeometry();
  for (const k of ['position', 'normal']) { const arr = new Float32Array(n * 3); let o = 0; gs.forEach((g) => { arr.set(g.attributes[k].array, o); o += g.attributes[k].array.length; }); out.setAttribute(k, new THREE.BufferAttribute(arr, 3)); }
  return out;
}

// a seeded random, so every visitor (and every poster) sees the same floor
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// The homepage section: the stage inside section.how, driven by the section's own runway.
export async function start(sec, opts = {}) {
  const host = sec.querySelector('.how-scene'), box = document.createElement('div'); box.className = 'lz-host'; host.prepend(box);
  const api = await mount(box, {
    ...opts, observe: sec, describedBy: 'how-scene-desc',
    hint: 'Drag the trolley along the aisle', rulerCaption: 'Light travels about 30 cm in a nanosecond.',
    progress: () => { const r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); },
  });
  host.hidden = false; sec.classList.add('is-3d'); api.resize();
  addEventListener('scroll', api.update, { passive: true });
  sec.__locate = { set: api.setTrolley, get: api.getTrolley };
  return api;
}

// Mount the scene into any element (it fills it; give it a size). Options:
//   progress: () => 0..1      read every frame it is asked to draw (or call api.setProgress(p) yourself)
//   small: boolean            the phone cut (defaults to a 760 px media query)
//   cad: URL string           where mesh.json and the .bin meshes live (defaults to ../locate/cad/ beside this file)
//   observe: element          visibility gate (defaults to the host)
//   hint, rulerCaption: text  optional captions; none by default
//   describedBy: id           aria-describedby for the slider
// Returns { setProgress(p), setTrolley(x), getTrolley(), update(), resize(), destroy() }.
export async function mount(host, opts = {}) {
  if (!document.getElementById('lz-css')) { const st = document.createElement('style'); st.id = 'lz-css'; st.textContent = CSS; document.head.appendChild(st); }
  host.classList.add('lz-host');
  const CAD = opts.cad ? new URL(opts.cad, location.href) : CAD_DEFAULT;
  const small = opts.small ?? matchMedia('(max-width:760px)').matches;
  let pExt = 0;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const tok = (n, f) => css.getPropertyValue(n).trim() || f;
  const GROUND = tok('--ground', '#f0f6ff'), INK = tok('--ink', '#0b1238'), LOCATED = tok('--located', '#1f6bff');

  const meta = await (await fetch(new URL('mesh.json', CAD))).json();
  const [gTop, gBot, gBody, gCap] = await Promise.all(['tag_top', 'tag_bottom', 'anc_body', 'anc_cap'].map((n) => cadMesh(n, meta, CAD)));

  // ------------------------------------------------------------------ renderer
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.75 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !small; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  const root = new THREE.Scene();
  const scene = new THREE.Group(); root.add(scene);   // everything standing; flattened onto the floor for the map
  const BG = new THREE.Color(GROUND);
  root.background = BG; root.fog = new THREE.Fog(BG, 11, 30);

  // the film-to-map handover: every material carries its flat map colour; uMap mixes the lit, tone-mapped pixel to it
  const MAP = { value: 0 };
  const mapify = (mat, hex) => {
    const t = {}; new THREE.Color(hex).getRGB(t, THREE.SRGBColorSpace); const v = V(t.r, t.g, t.b); // sRGB, mixed after output conversion
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uMap = MAP; sh.uniforms.uMapCol = { value: v };
      sh.fragmentShader = 'uniform float uMap;\nuniform vec3 uMapCol;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, uMapCol, uMap );');
    };
    return mat;
  };
  const std = (o, map) => mapify(new THREE.MeshStandardMaterial(o), map);
  const phys = (o, map) => mapify(new THREE.MeshPhysicalMaterial(o), map);

  // daylight environment for reflections: a high, wide skylight, pale walls, a warm floor bounce
  {
    const s = new THREE.Scene(); s.background = new THREE.Color(0x8b949f);
    const panel = (w, h, pos, c, k = 1) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: 2 })); m.position.copy(pos); m.lookAt(0, 0, 0); s.add(m); };
    // skylight strips (bright, HDR), a pale far wall, darker side walls and a warm grey floor: metals get real contrast
    for (const z of [-4, 0, 4]) panel(14, 1.2, V(0, 9, z), 0xffffff, 7);
    panel(2, 10, V(-9, 6, -3), 0xffffff, 3);
    panel(18, 4, V(0, 2.5, -10), 0xe8eef7, 1.4); panel(18, 4, V(-10, 2.5, 0), 0xc2ccd8); panel(18, 4, V(10, 2.5, 0), 0xf1e6d6, 1.2);
    panel(18, 4, V(0, 2.5, 10), 0x7a838e);
    panel(30, 30, V(0, -6, 0), 0x8a8580);
    const pm = new THREE.PMREMGenerator(renderer); root.environment = pm.fromScene(s, 0.04).texture; pm.dispose();
    root.environmentIntensity = 0.85;
  }
  const hemi = new THREE.HemisphereLight(0xeef4ff, 0xb7b1a6, 1.15); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff3e2, 2.3); sun.position.set(-4, 14, 6); sun.target.position.set(0.5, 0, 0);
  scene.add(sun, sun.target);
  if (!small) {
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 2, far: 30 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
  }

  const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene, shadow = true) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m;
  };
  const box = (w, h, d, mat, x, y, z, parent) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);

  // soft contact shadow, the "ambient occlusion" under every foot: a blurred rounded rectangle
  const blobTex = canvasTex(128, 128, (x, w, h) => {
    x.shadowColor = 'rgba(11,18,56,1)'; x.shadowBlur = 22; x.shadowOffsetX = 1000;
    x.fillStyle = '#000'; x.beginPath(); x.roundRect(28 - 1000, 28, 72, 72, 16); x.fill();
  });
  const blobMat = (o) => new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: o, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const blobs = [];
  const blob = (w, d, x, z, o = 0.5, parent = scene) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), blobMat(o)); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.002, z);
    m.renderOrder = 1; parent.add(m); blobs.push(m); return m;
  };

  // ------------------------------------------------------------------ floor
  const FW = 40, FD = 20;   // metres; x from -20 to 20, z from -10 to 10
  const floorTex = canvasTex(small ? 2048 : 4096, small ? 1024 : 2048, (x, w, h) => {
    const sx = w / FW, sz = h / FD, X = (m) => (m + FW / 2) * sx, Z = (m) => (m + FD / 2) * sz;
    x.fillStyle = '#b3bab9'; x.fillRect(0, 0, w, h);
    seed = 11;
    // the epoxy's slow mottling and trowel patches
    for (let i = 0; i < 900; i++) {
      const r = (0.4 + rnd() * 2.2) * sx, cx = rnd() * w, cy = rnd() * h, g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      const tone = rnd() < 0.5 ? '120,124,130' : '238,240,242';
      g.addColorStop(0, `rgba(${tone},${0.035 + rnd() * 0.04})`); g.addColorStop(1, `rgba(${tone},0)`);
      x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    // fine speckle
    for (let i = 0; i < 26000; i++) { x.fillStyle = rnd() < 0.5 ? 'rgba(90,96,104,.10)' : 'rgba(255,255,255,.12)'; x.fillRect(rnd() * w, rnd() * h, 1.5, 1.5); }
    // tyre tracks down the aisle, darker where the trolleys run
    x.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      const z0 = (rnd() - 0.5) * 2.0, wd = (0.02 + rnd() * 0.05) * sz;
      x.strokeStyle = `rgba(70,74,82,${0.025 + rnd() * 0.035})`; x.lineWidth = wd;
      x.beginPath(); const xa = -20 + rnd() * 10, xb = xa + 8 + rnd() * 22;
      x.moveTo(X(xa), Z(z0)); x.bezierCurveTo(X(xa + 6), Z(z0 + (rnd() - 0.5) * 0.3), X(xb - 6), Z(z0 + (rnd() - 0.5) * 0.3), X(xb), Z(z0 + (rnd() - 0.5) * 0.2)); x.stroke();
    }
    // saw-cut joints every 6 m, with a darker sealant line
    x.strokeStyle = 'rgba(70,74,82,.32)'; x.lineWidth = Math.max(1.2, 0.008 * sx);
    for (let m = -18; m <= 18; m += 6) { x.beginPath(); x.moveTo(X(m), 0); x.lineTo(X(m), h); x.stroke(); }
    for (let m = -9; m <= 9; m += 6) { x.beginPath(); x.moveTo(0, Z(m)); x.lineTo(w, Z(m)); x.stroke(); }
    // the aisle's yellow lines, 100 mm, worn through where wheels and boots cross
    const line = (z, xa = -20, xb = 20) => {
      x.fillStyle = '#e8b31c'; x.fillRect(X(xa), Z(z - 0.05), (xb - xa) * sx, 0.1 * sz);
      x.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < (xb - xa) * 26; i++) {
        const cx = X(xa + rnd() * (xb - xa)), cy = Z(z + (rnd() - 0.5) * 0.12), r = (0.01 + rnd() * 0.04) * sx;
        x.fillStyle = `rgba(0,0,0,${0.2 + rnd() * 0.6})`; x.beginPath(); x.ellipse(cx, cy, r * (1 + rnd() * 3), r, 0, 0, 7); x.fill();
      }
      x.globalCompositeOperation = 'source-over';
      x.fillStyle = 'rgba(255,255,255,.05)'; x.fillRect(X(xa), Z(z - 0.05), (xb - xa) * sx, 0.1 * sz);
    };
    // the paint shows the floor below where it is worn: redraw the floor tone under it first
    line(-1.25); line(1.25); line(-5.2, -20, 20); line(5.6, -20, 3.9);
  });
  floorTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const floorMat = std({ map: floorTex, roughness: 0.3, metalness: 0, envMapIntensity: 1.0 }, GROUND);
  const floor = add(new THREE.PlaneGeometry(FW, FD), floorMat, 0, 0, 0, scene, false);
  floor.rotation.x = -Math.PI / 2;
  // beyond the slab: the same floor colour, so the fog closes it off cleanly
  const far = add(new THREE.PlaneGeometry(200, 200), std({ color: 0xb3bab9, roughness: 0.6 }, GROUND), 0, -0.002, 0, scene, false);
  far.rotation.x = -Math.PI / 2;

  // map-only layer: a 1 m grid and the aisle edges, drawn in hairline ink, faded in with uMap
  const mapLayer = new THREE.Group(); root.add(mapLayer);
  const mapMats = [];
  const mapMat = (o) => { const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, fog: false, ...o }); m.userData.o = o.opacity ?? 1; mapMats.push(m); return m; };
  {
    const pts = [];
    for (let m = -FW / 2; m <= FW / 2; m++) pts.push(m, 0, -FD / 2, m, 0, FD / 2);
    for (let m = -FD / 2; m <= FD / 2; m++) pts.push(-FW / 2, 0, m, FW / 2, 0, m);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const lm = new THREE.LineBasicMaterial({ color: new THREE.Color(INK), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, fog: false }); lm.userData.o = 0.09; mapMats.push(lm);
    const grid = new THREE.LineSegments(g, lm); grid.position.y = 0.004; grid.renderOrder = 2; mapLayer.add(grid);
  }
  const lane = new THREE.Mesh(new THREE.PlaneGeometry(FW, 2.5), mapMat({ color: 0xffffff, opacity: 0.9 })); lane.rotation.x = -Math.PI / 2; lane.position.y = 0.0035; mapLayer.add(lane);
  for (const z of [-1.25, 1.25]) { const e = new THREE.Mesh(new THREE.PlaneGeometry(FW, 0.03), mapMat({ color: new THREE.Color(INK), opacity: 0.22 })); e.rotation.x = -Math.PI / 2; e.position.set(0, 0.004, z); mapLayer.add(e); }

  // ------------------------------------------------------------------ materials of the plant: galvanised steel, cast aluminium, ply
  const galv = phys({ color: 0xc3c9cf, roughness: 0.3, metalness: 1, clearcoat: 0.05 }, '#3d4870');
  const galvDark = std({ color: 0x8f979f, roughness: 0.45, metalness: 0.85 }, '#3d4870');
  const concrete = std({ color: 0xc4c2bc, roughness: 0.92 }, '#3d4870');
  const castAlu = phys({ color: 0xd2d6da, roughness: 0.34, metalness: 1 }, '#c3d3ee');
  const faceAlu = phys({ color: 0xeef0f2, roughness: 0.16, metalness: 1, anisotropy: 0.6 }, '#c3d3ee');
  const castIn = std({ color: 0x80868d, roughness: 0.6, metalness: 0.9 }, '#c3d3ee');
  const woodTex = canvasTex(512, 256, (x, w, h) => {
    x.fillStyle = '#b48d5e'; x.fillRect(0, 0, w, h); seed = 21;
    for (let i = 0; i < 220; i++) { const y = rnd() * h; x.strokeStyle = `rgba(${rnd() < 0.5 ? '96,64,32' : '226,196,150'},${0.06 + rnd() * 0.12})`; x.lineWidth = 0.5 + rnd() * 2; x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(w * 0.3, y + (rnd() - 0.5) * 6, w * 0.7, y + (rnd() - 0.5) * 6, w, y + (rnd() - 0.5) * 4); x.stroke(); }
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(70,50,30,${0.05 + rnd() * 0.08})`; x.fillRect(rnd() * w, rnd() * h, 4 + rnd() * 30, 1 + rnd() * 3); }
  });
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  const wood = std({ map: woodTex, roughness: 0.78, metalness: 0 }, '#c3d3ee');
  const woodRack = std({ map: woodTex, roughness: 0.82, metalness: 0, color: 0xd8cbb8 }, '#c9d4e6');

  // ------------------------------------------------------------------ cast aluminium housings (gearbox cases): walls, floor, machined flange, bored boss
  const rrect = (hw, hd, r) => { const s = new THREE.Shape(); s.moveTo(-hw + r, -hd); s.lineTo(hw - r, -hd); s.quadraticCurveTo(hw, -hd, hw, -hd + r); s.lineTo(hw, hd - r); s.quadraticCurveTo(hw, hd, hw - r, hd); s.lineTo(-hw + r, hd); s.quadraticCurveTo(-hw, hd, -hw, hd - r); s.lineTo(-hw, -hd + r); s.quadraticCurveTo(-hw, -hd, -hw + r, -hd); return s; };
  const HW = 0.115, HD = 0.085, HH = 0.12;
  const ex = (shape, depth, y) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1, curveSegments: 5 }); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); return g; };
  const wall = rrect(HW, HD, 0.022); wall.holes.push(rrect(HW - 0.011, HD - 0.011, 0.014));
  const flange = rrect(HW + 0.008, HD + 0.008, 0.028); flange.holes.push(rrect(HW - 0.011, HD - 0.011, 0.014));
  const hGeo = [
    [ex(wall, HH - 0.012, 0.004), castAlu],
    [ex(rrect(HW - 0.004, HD - 0.004, 0.02), 0.014, 0.002), castIn],
    [ex(flange, 0.01, HH - 0.01), faceAlu],
    // a bearing boss on the long side, machined face and dark bore; two cast ribs; four bolt lugs at the foot
    [(() => { const g = new THREE.CylinderGeometry(0.045, 0.05, 0.03, 32); g.rotateX(Math.PI / 2); g.translate(0.02, 0.064, HD + 0.012); return g; })(), castAlu],
    [(() => { const g = new THREE.CylinderGeometry(0.043, 0.043, 0.004, 32); g.rotateX(Math.PI / 2); g.translate(0.02, 0.064, HD + 0.028); return g; })(), faceAlu],
    [(() => { const g = new THREE.CylinderGeometry(0.026, 0.026, 0.006, 28); g.rotateX(Math.PI / 2); g.translate(0.02, 0.064, HD + 0.029); return g; })(), castIn],
    [(() => { const g = new THREE.BoxGeometry(0.012, HH - 0.03, 0.014); const g2 = g.clone(); g.translate(-0.07, (HH - 0.03) / 2 + 0.006, HD + 0.006); g2.translate(0.09, (HH - 0.03) / 2 + 0.006, HD + 0.006); return mergeGeo([g, g2]); })(), castAlu],
    [(() => mergeGeo([-1, 1].flatMap((sx) => [-1, 1].map((sz) => { const g = new THREE.CylinderGeometry(0.016, 0.016, 0.02, 16); g.translate(sx * (HW + 0.004), 0.012, sz * (HD + 0.004)); return g; }))))(), castAlu],
  ];
  const hSpots = { trolley: [], world: [] };
  const housings = (parent, list) => {
    if (!list.length) return;
    const o = new THREE.Object3D();
    hGeo.forEach(([g, m]) => {
      const im = new THREE.InstancedMesh(g, m, list.length); im.castShadow = im.receiveShadow = true;
      list.forEach(([x, y, z, r], k) => { o.position.set(x, y, z); o.rotation.y = r; o.updateMatrix(); im.setMatrixAt(k, o.matrix); });
      parent.add(im);
    });
  };

  // ------------------------------------------------------------------ steel columns (300 mm H-section, galvanised grey)
  const column = (cx, cz) => {
    const g = new THREE.Group(); g.position.set(cx, 0, cz); scene.add(g);
    const Hc = 10;
    box(0.30, Hc, 0.018, galv, 0, Hc / 2, 0.14, g); box(0.30, Hc, 0.018, galv, 0, Hc / 2, -0.14, g); box(0.012, Hc, 0.26, galv, 0, Hc / 2, 0, g);
    box(0.56, 0.12, 0.56, concrete, 0, 0.06, 0, g);
    box(0.42, 0.018, 0.42, galvDark, 0, 0.129, 0, g);
    blob(1.0, 1.0, cx, cz, 0.5);
    return g;
  };
  column(-3.0, -2.25); column(4.2, -2.25); column(0.6, -5.6);
  for (const x of [-10.2, 11.4]) column(x, -2.25);

  // ------------------------------------------------------------------ racking: galvanised uprights, wooden pallets of housings
  const rack = (x0, z0, bays, depth = 1.0, levels = [0, 1.5, 3.0], Hr = 4.0, fill = 1) => {
    const g = new THREE.Group(); g.position.set(x0, 0, z0); scene.add(g);
    const BL = 2.7;
    for (let b = 0; b <= bays; b++) {
      const x = b * BL;
      for (const z of [0, depth]) { box(0.09, Hr, 0.07, galv, x, Hr / 2, z, g); box(0.15, 0.01, 0.12, galvDark, x, 0.005, z, g); blob(0.36, 0.36, x0 + x, z0 + z, 0.45); }
      for (let y = 0.3; y < Hr - 0.4; y += 0.7) {
        box(0.03, 0.03, depth, galv, x, y, depth / 2, g);
        const d = new THREE.Mesh(new THREE.BoxGeometry(0.025, Math.hypot(0.7, depth), 0.022), galv);
        d.position.set(x, y + 0.35, depth / 2); d.rotation.x = Math.atan2(depth, 0.7) * (Math.round(y / 0.7) % 2 ? 1 : -1); d.castShadow = true; g.add(d);
      }
      box(0.03, 0.03, depth, galv, x, Hr - 0.05, depth / 2, g);
    }
    for (let b = 0; b < bays; b++) {
      const xc = b * BL + BL / 2;
      for (const y of levels.slice(1)) for (const z of [0, depth]) box(BL - 0.09, 0.12, 0.05, galvDark, xc, y, z, g);
      for (const y of levels) {
        // two pallets per bay, each with a layer of housings; one gap here and there, as a real bay has
        for (const px of [-0.62, 0.62]) {
          if (rnd() > fill) continue;
          const yb = y + (y > 0 ? 0.06 : 0), cx = xc + px;
          box(1.0, 0.022, depth - 0.1, woodRack, cx, yb + 0.133, depth / 2, g);
          for (const sz of [-1, 0, 1]) box(1.0, 0.1, 0.09, woodRack, cx, yb + 0.07, depth / 2 + sz * (depth / 2 - 0.12), g);
          if (y === 0) blob(1.15, depth, x0 + cx, z0 + depth / 2, 0.4);
          for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) if (rnd() < 0.92) hSpots.world.push([x0 + cx - 0.36 + i * 0.24, yb + 0.146, z0 + depth / 2 - 0.27 + j * 0.27, (rnd() < 0.5 ? 0 : Math.PI) + (rnd() - 0.5) * 0.06]);
        }
      }
    }
    return g;
  };
  seed = 3;
  const RACK_X = 4.75, RACK_Z = 2.0;
  rack(RACK_X, RACK_Z, 3, 1.0, [0, 1.5, 3.0], 4.0, 0.9);
  rack(-12, -8.0, 4, 1.0, [0, 1.5, 3.0], 4.0, 0.8);
  rack(7.6, -8.0, 3, 1.0, [0, 1.5, 3.0], 4.0, 0.8);

  // ------------------------------------------------------------------ the WIP trolley (1.2 x 0.7 m, two tiers, steel frame, ply decks)
  const steel = galv;
  const steelDark = galvDark;
  const tyre = std({ color: 0x2f343c, roughness: 0.72, metalness: 0 }, '#c3d3ee');
  const hub = std({ color: 0xb8bec6, roughness: 0.35, metalness: 0.9 }, '#c3d3ee');
  const trolley = new THREE.Group(); scene.add(trolley);
  const L = 1.2, W = 0.7, wheelR = 0.0625;
  const shelf = (y, apron) => {
    const d = box(L - 0.02, 0.018, W - 0.02, wood, 0, y + 0.012, 0, trolley);
    d.geometry.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 0.6 : 1.6); });
    box(L - 0.04, 0.006, W - 0.04, steel, 0, y, 0, trolley);
    for (const s of [-1, 1]) {
      box(L, apron, 0.004, steel, 0, y + 0.006 - apron / 2 + 0.03, s * (W / 2), trolley);   // folded angle edge
      box(0.004, apron, W, steel, s * (L / 2), y + 0.006 - apron / 2 + 0.03, 0, trolley);
      box(L, 0.004, 0.03, steel, 0, y + 0.034, s * (W / 2 - 0.015), trolley);
    }
  };
  shelf(0.30, 0.06); shelf(0.80, 0.075);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(0.032, 0.66, 0.032, steel, sx * (L / 2 - 0.016), 0.5, sz * (W / 2 - 0.016), trolley);
    const cx = sx * (L / 2 - 0.08), cz = sz * (W / 2 - 0.08);
    box(0.09, 0.008, 0.09, steelDark, cx, 0.232, cz, trolley);
    for (const f of [-1, 1]) box(0.05, 0.09, 0.005, steelDark, cx - 0.012, 0.185, cz + f * 0.024, trolley);
    const wh = add(new THREE.CylinderGeometry(wheelR, wheelR, 0.035, 28), tyre, cx - 0.02, wheelR, cz, trolley);
    wh.rotation.x = Math.PI / 2; wh.userData.wheel = true;
    const hb = add(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16), hub, 0, 0, 0, wh); hb.castShadow = false;
  }
  // the push handle: one bent 25 mm tube, rounded corners
  {
    const xh = -L / 2 - 0.045, r = 0.06, top = 1.02;
    const path = new THREE.CurvePath();
    const P = (y, z) => V(xh, y, z);
    path.add(new THREE.LineCurve3(V(-L / 2 + 0.005, 0.78, -W / 2 + 0.03), P(top - r, -W / 2 + 0.03)));
    path.add(new THREE.QuadraticBezierCurve3(P(top - r, -W / 2 + 0.03), P(top, -W / 2 + 0.03), P(top, -W / 2 + 0.03 + r)));
    path.add(new THREE.LineCurve3(P(top, -W / 2 + 0.03 + r), P(top, W / 2 - 0.03 - r)));
    path.add(new THREE.QuadraticBezierCurve3(P(top, W / 2 - 0.03 - r), P(top, W / 2 - 0.03), P(top - r, W / 2 - 0.03)));
    path.add(new THREE.LineCurve3(P(top - r, W / 2 - 0.03), V(-L / 2 + 0.005, 0.78, W / 2 - 0.03)));
    add(new THREE.TubeGeometry(path, 120, 0.0125, 14, false), steel, 0, 0, 0, trolley);
    const grip = add(new THREE.CylinderGeometry(0.017, 0.017, W - 0.26, 18), tyre, xh, top, 0, trolley); grip.rotation.x = Math.PI / 2;
  }
  seed = 5;
  for (const y of [0.33, 0.83]) for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) if (!(y > 0.5 && i === 3 && j === 1)) hSpots.trolley.push([-0.405 + i * 0.27, y, -0.165 + j * 0.33, (j ? Math.PI : 0) + (rnd() - 0.5) * 0.06]);
  housings(trolley, hSpots.trolley); housings(scene, hSpots.world);
  blob(1.55, 1.0, 0, 0, 0.6, trolley);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) blob(0.16, 0.16, sx * (L / 2 - 0.1), sz * (W / 2 - 0.08), 0.7, trolley);
  const hit = new THREE.Mesh(new THREE.BoxGeometry(L + 0.5, 1.4, W + 0.5), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = 0.6; trolley.add(hit);

  // ------------------------------------------------------------------ AmIGo, from CAD, on the top shelf's front rail
  const shell = (c) => phys({ color: c, roughness: 0.42, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.45 }, '#3a3d42');
  const tag = new THREE.Group();
  {
    const inner = new THREE.Group();
    inner.add(new THREE.Mesh(gTop, shell(0x4e5258)), new THREE.Mesh(gBot, shell(0x3b3e43)));
    inner.children.forEach((m) => { m.castShadow = true; m.receiveShadow = true; });
    inner.position.set(-61.77, -65.98, -10.6);          // centred, its back face on the rail
    const s = new THREE.Group(); s.add(inner); s.scale.setScalar(0.001);
    // CAD x -> up, CAD y (the long side, with lugs) -> along the rail, CAD -z (the embossed face) -> out
    s.matrixAutoUpdate = false; s.matrix.makeBasis(V(0, 0.001, 0), V(0.001, 0, 0), V(0, 0, -0.001));
    tag.add(s);
  }
  const TAG_LOCAL = V(0.3, 0.79, W / 2 + 0.006);
  tag.position.copy(TAG_LOCAL); trolley.add(tag);

  // ------------------------------------------------------------------ AmIMo anchors, from CAD, high on columns and rack
  const ancMat = phys({ color: 0x2f3237, roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.5 }, INK);
  const capMat = phys({ color: 0x3a3e44, roughness: 0.46, clearcoat: 0.2, clearcoatRoughness: 0.5 }, INK);
  const anchors = [];
  const anchor = (pos, face, tilt = 0.18) => {
    // CAD: the cap (mounting tabs) on +y, the body below; long side on z. Back face to the wall, body out along `face`.
    const inner = new THREE.Group();
    inner.add(new THREE.Mesh(gBody, ancMat), new THREE.Mesh(gCap, capMat));
    inner.children.forEach((m) => { m.castShadow = true; });
    inner.position.set(3.28, -20.49, -0.8);
    const s = new THREE.Group(); s.add(inner); s.scale.setScalar(0.001);
    const g = new THREE.Group(); g.add(s); g.position.copy(pos);
    const n = face.clone().normalize(), up = V(0, 1, 0), side = new THREE.Vector3().crossVectors(up, n).normalize();
    // CAD -y -> n (out), CAD z -> up, CAD x -> side (right-handed: x = y cross z)
    const m = new THREE.Matrix4().makeBasis(side.clone().negate().negate(), n.clone().negate(), up);
    if (m.determinant() < 0) m.makeBasis(side.clone().negate(), n.clone().negate(), up);
    s.matrixAutoUpdate = false; s.matrix.copy(m).multiply(new THREE.Matrix4().makeScale(0.001, 0.001, 0.001));
    g.rotateOnWorldAxis(side, tilt);
    // a galvanised mounting plate behind it
    const plate = box(0.075, 0.13, 0.004, galvDark, 0, 0, 0, g); plate.lookAt(n.clone().add(g.position)); plate.position.addScaledVector(n, 0.002);
    scene.add(g);
    const front = g.position.clone().addScaledVector(n, 0.03);
    anchors.push({ g, pos: front, n });
  };
  anchor(V(-3.0, 3.35, -2.25 + 0.15), V(0, 0, 1));
  anchor(V(4.2, 3.35, -2.25 + 0.15), V(0, 0, 1));
  anchor(V(RACK_X - 0.05, 3.55, RACK_Z), V(-1, 0, -1));
  anchor(V(0.6, 4.2, -5.6 + 0.16), V(0, 0, 1));

  // anchor marks on the map: small ink squares where each anchor stands
  for (const a of anchors) {
    const sq = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), mapMat({ color: new THREE.Color(INK) }));
    sq.rotation.x = -Math.PI / 2; sq.position.set(a.g.position.x, 0.005, a.g.position.z); mapLayer.add(sq);
  }

  // ------------------------------------------------------------------ the map dot (dot, white keyline, four ticks; no ring)
  const mark = new THREE.Group(); root.add(mark);
  const markMat = (o = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(LOCATED), transparent: true, opacity: o, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
  const dotM = markMat(), tickM = markMat(), haloM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
  const halo = new THREE.Mesh(new THREE.CircleGeometry(0.1, 48), haloM); halo.rotation.x = -Math.PI / 2; mark.add(halo);
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.075, 40), dotM); dot.rotation.x = -Math.PI / 2; mark.add(dot);
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.014), tickM); t.rotation.x = -Math.PI / 2;
    const a = i * Math.PI / 2; t.position.set(Math.cos(a) * 0.22, 0, Math.sin(a) * 0.22); t.rotation.z = -a; mark.add(t);
  }
  mark.children.forEach((c) => { c.renderOrder = 20; }); halo.renderOrder = 19;

  // ------------------------------------------------------------------ the overlay: lines, ruler, crosshair (SVG) and figures (HTML)
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, attrs = {}, parent = svg) => { const e = document.createElementNS(NS, n); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'lz-ov'); svg.setAttribute('aria-hidden', 'true');
  const trail = el('path', { class: 'lz-trail' });
  const lines = anchors.map(() => el('line'));
  const ends = anchors.map(() => el('circle', { r: 2.5 }));
  // angle leaders: two short orthogonal strokes in each anchor's own frame (along its face, and out of it)
  const leads = anchors.map(() => [el('line', { class: 'lz-lead' }), el('line', { class: 'lz-lead' })]);
  const cross = el('g', { class: 'lz-cross' });
  for (const d of ['M-22 0H-7', 'M7 0H22', 'M0 -22V-7', 'M0 7V22']) el('path', { d }, cross);
  // the timing ruler: one ns axis, a tick per anchor where its pulse arrives; the first arrival is 0
  const ruler = el('g', { class: 'lz-ruler' });
  const rAxis = el('line', {}, ruler), rUnit = el('text', { class: 'lz-unit' }, ruler);
  const rMinor = el('path', { class: 'lz-minor' }, ruler);
  const rTicks = anchors.map(() => { const g = el('g', {}, ruler); return [g, el('line', { y1: -8, y2: 8 }, g), el('text', { y: 24, 'text-anchor': 'middle', class: 'lz-n' }, g)]; });
  const label = (cls = '') => { const d = document.createElement('div'); d.className = 'lz-l ' + cls; d.setAttribute('aria-hidden', 'true'); host.appendChild(d); return d; };
  const hint = document.createElement('p'); hint.className = 'lz-hint'; hint.setAttribute('aria-hidden', 'true'); hint.textContent = opts.hint || ''; if (!opts.hint) hint.hidden = true;
  host.prepend(canvas); host.append(svg);
  const lTag = label(), lMid = anchors.map(() => label('lz-mid')), lA = anchors.map(() => label()), lPos = label(), lWait = label('lz-wait');
  host.append(hint);
  lTag.innerHTML = '<b>AmIGo</b><i></i><span>awake</span>';
  lA.forEach((l, i) => { l.innerHTML = `<b>AmIMo ${i + 1}</b><span></span>`; });
  lPos.innerHTML = '<b>AmIHub</b><span></span><br><span class="lz-t"></span>';
  lWait.innerHTML = '<b>Last seen <span></span></b><em>Waiting <span></span></em>';
  const lTagS = lTag.querySelector('span'), lAS = lA.map((l) => l.querySelector('span'));
  const [lPosS, lPosT] = lPos.querySelectorAll('span'), [lSeen, lWaitS] = lWait.querySelectorAll('span');

  // accessibility: the canvas is a slider for the trolley's place on the aisle
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'slider');
  canvas.setAttribute('aria-label', 'Trolley position along the aisle');
  if (opts.describedBy) canvas.setAttribute('aria-describedby', opts.describedBy);
  canvas.setAttribute('aria-valuemin', '0'); canvas.setAttribute('aria-valuemax', String(Math.round((XMAX - XMIN) * 10) / 10));


  // ------------------------------------------------------------------ state
  let xr = opts.rest ?? (small ? -0.6 : -0.4);  // where the trolley rests (the visitor can move it)
  let moved = false, waitFrom = 0, kd = -1, visible = true, raf = 0, last = performance.now(), fixAt = null, fixX = NaN;
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 120);
  const tmp = V(0, 0, 0), tagW = V(0, 0, 0), markW = V(0, 0, 0);
  const progress = () => clamp(opts.progress ? opts.progress() : pExt);

  // camera keys on k (0 to 4): [k, position, target, fov, up-mix]. Close-up keys follow the trolley.
  const keys = () => {
    const T = V(xr, 0, 0).add(TAG_LOCAL);
    const top = small ? [V(xr + 0.6, 21, 0.4001), V(xr + 0.6, 0, 0.4), 24] : [V(0.2, 25, 0.42), V(0.2, 0, 0.4), 22];
    const close = small ? V(-0.3, 0.1, 0.7) : V(-0.3, 0.09, 0.56);
    const wide = small ? [V(xr - 1.5, 1.2, 7.0), V(xr + 0.8, 2.1, -0.6), 60] : [V(xr - 2.1, 1.1, 5.6), V(xr + 1.0, 2.0, -0.6), 48];
    const high = small ? [V(xr - 1.6, 6.5, 8.0), V(xr + 0.4, 0.6, 0.0), 50] : [V(xr - 3.0, 6.2, 7.6), V(xr + 0.6, 0.6, -0.2), 40];
    return [
      [0.0, ...(small ? [V(-6.6, 1.2, 5.4), V(-3.0, 0.8, 0), 46] : [V(-6.4, 1.2, 4.4), V(-2.6, 0.75, -0.2), 34]), 0],
      [0.38, ...(small ? [V(xr - 2.2, 1.0, 3.4), V(xr, 0.7, 0), 44] : [V(xr - 2.4, 1.0, 2.6), V(xr, 0.68, 0), 34]), 0],
      [0.62, T.clone().add(close), T.clone().add(V(0.03, -0.035, 0)), small ? 34 : 30, 0],
      [0.74, T.clone().add(close).add(V(0.02, 0, -0.03)), T.clone().add(V(0.03, -0.035, 0)), small ? 34 : 30, 0],
      [1.02, ...wide, 0],
      [2.15, wide[0].clone().add(V(0.4, 0.15, 0.3)), wide[1], wide[2], 0],
      [2.85, ...high, 0],
      [3.35, ...top, 1], [4, ...top, 1]];
  };
  const camAt = (k) => {
    const K = keys();
    let i = 0; while (i < K.length - 2 && k > K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1], t = ease(seg(k, a[0], b[0]));
    cam.position.lerpVectors(a[1], b[1], t);
    tmp.lerpVectors(a[2], b[2], t);
    cam.fov = lerp(a[3], b[3], t);
    cam.up.set(0, 1, 0).lerp(small ? V(1, 0, 0) : V(0, 0, -1), lerp(a[4], b[4], t)).normalize();
    cam.lookAt(tmp); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  };

  let W0 = 0, H0 = 0;
  const size = () => {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    W0 = w; H0 = h; renderer.setSize(w, h, false); cam.aspect = w / h; svg.setAttribute('viewBox', `0 0 ${w} ${h}`); ask();
  };

  const scr = (v) => { tmp.copy(v).project(cam); return [(tmp.x * 0.5 + 0.5) * W0, (-tmp.y * 0.5 + 0.5) * H0]; };
  const op = (e, o) => { e.style.opacity = o > 0.001 ? o.toFixed(3) : '0'; };
  const place = (e, x, y, o, ax = 0, ay = 0) => {
    op(e, o); if (o <= 0.001) return;
    const w = e.offsetWidth, h = e.offsetHeight;
    e.style.transform = `translate(${clamp(x - ax * w, 8, W0 - w - 8).toFixed(1)}px,${clamp(y - ay * h, 8, H0 - h - 8).toFixed(1)}px)`;
  };
  const at = (e, v, dx, dy, o, ax, ay) => { const [x, y] = scr(v); place(e, x + dx, y + dy, o, ax, ay); };
  const xy = (e, a, b, x, y) => { e.setAttribute(a, x.toFixed(1)); e.setAttribute(b, y.toFixed(1)); };
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const clock = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`;
  const f1 = (v) => v.toFixed(1).replace('-', '−');

  let shadowX = NaN;
  function frame(now) {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const kt = opts.k ?? progress() * 4;
    if (kd < 0) kd = kt;
    kd += (kt - kd) * (REDUCED ? 1 : Math.min(1, dt * 7));   // reduced motion: no easing, each beat is a still
    const settling = Math.abs(kt - kd) > 0.0005;
    if (!settling) kd = kt;
    const k = kd;

    // trolley: rolls in during step 1, decelerating to a stop
    const roll = moved ? 1 : 1 - Math.pow(1 - seg(k, 0, 0.6), 3);
    const x = lerp(XIN, xr, roll);
    if (x !== trolley.position.x) {
      const dx = x - trolley.position.x; trolley.position.x = x;
      trolley.traverse((o) => { if (o.userData.wheel) o.rotation.y -= dx / wheelR; });
    }
    if (renderer.shadowMap.enabled && x !== shadowX) { shadowX = x; renderer.shadowMap.needsUpdate = true; }

    camAt(k);
    const mapK = ease(seg(k, 3.0, 3.35));
    MAP.value = mapK;
    scene.scale.y = lerp(1, 0.02, ease(seg(k, 2.95, 3.3)));
    mapMats.forEach((m) => { m.opacity = m.userData.o * mapK; });
    blobs.forEach((b) => { b.visible = mapK < 0.999; });
    root.fog.near = lerp(11, 40, Math.max(mapK, seg(k, 2.2, 2.9))); root.fog.far = lerp(30, 90, Math.max(mapK, seg(k, 2.2, 2.9)));

    tagW.copy(TAG_LOCAL).add(trolley.position).add(V(0, 0, 0.012));
    markW.set(tagW.x, 0.006, tagW.z);
    // a fix: each new position gets the time it was seen
    if (tagW.x !== fixX) { fixX = tagW.x; fixAt = new Date(); }

    // beat 1: the pulse, as straight lines out to each anchor, each labelled at its midpoint in metres and ns
    const ns = anchors.map((a) => a.pos.distanceTo(tagW) / C_LIGHT), first = Math.min(...ns);
    const fade = 1 - seg(k, 3.0, 3.2);
    anchors.forEach((a, i) => {
      const draw = ease(seg(k, 0.8 + i * 0.05, 1.0 + i * 0.05));
      const o = fade * lerp(1, 0.55, seg(k, 2.1, 2.4));
      const [x1, y1] = scr(tagW), [x2, y2] = scr(a.pos);
      xy(lines[i], 'x1', 'y1', x1, y1); xy(lines[i], 'x2', 'y2', lerp(x1, x2, draw), lerp(y1, y2, draw)); op(lines[i], draw > 0 ? o : 0);
      xy(ends[i], 'cx', 'cy', x2, y2); op(ends[i], draw >= 1 ? o : 0);
      lMid[i].textContent = `${a.pos.distanceTo(tagW).toFixed(2)} m · ${ns[i].toFixed(1)} ns`;
      place(lMid[i], (x1 + x2) / 2, (y1 + y2) / 2, seg(k, 0.95 + i * 0.05, 1.05 + i * 0.05) * (1 - seg(k, 2.05, 2.25)), 0.5, 0.5);
      // beat 2: angle, in the anchor's own frame: azimuth across its face, elevation out of it
      const v = tmp.copy(tagW).sub(a.pos).normalize(), side = V(0, 1, 0).cross(a.n).normalize();
      const az = THREE.MathUtils.radToDeg(Math.atan2(v.dot(side), v.dot(a.n))), el = THREE.MathUtils.radToDeg(Math.asin(clamp(v.y, -1, 1)));
      lAS[i].textContent = `az ${f1(az)}° · el ${f1(el)}°`;
      const ao = (small ? 0 : 1) * seg(k, 1.3 + i * 0.08, 1.42 + i * 0.08) * (1 - seg(k, 2.05, 2.25));
      const [lx1, ly1] = scr(a.pos.clone().addScaledVector(side, 0.45)), [lx2, ly2] = scr(a.pos.clone().addScaledVector(a.n, 0.45));
      xy(leads[i][0], 'x1', 'y1', x2, y2); xy(leads[i][0], 'x2', 'y2', lx1, ly1); xy(leads[i][1], 'x1', 'y1', x2, y2); xy(leads[i][1], 'x2', 'y2', lx2, ly2);
      op(leads[i][0], ao); op(leads[i][1], ao);
      const right = x2 < W0 * 0.6;
      place(lA[i], x2 + (right ? 14 : -14), y2 - 12, ao, right ? 0 : 1, 1);
    });

    // beat 2: the timing ruler, a tick per anchor where its pulse arrives, the first arrival at 0
    const ro = seg(k, 1.05, 1.2) * (1 - seg(k, 2.1, 2.3));
    op(ruler, ro);
    if (ro > 0) {
      const span = Math.max(4, Math.ceil(Math.max(...ns) - first + 1)), xa = small ? 28 : W0 * 0.2, xb = small ? W0 - 28 : W0 * 0.8, y = H0 - (small ? 46 : 54);
      const X = (t) => lerp(xa, xb, t / span);
      ruler.setAttribute('transform', `translate(0 ${y.toFixed(1)})`);
      xy(rAxis, 'x1', 'y1', xa, 0); xy(rAxis, 'x2', 'y2', xb, 0);
      let d = ''; for (let t = 0; t <= span; t++) d += `M${X(t).toFixed(1)} -3V3`;
      rMinor.setAttribute('d', d);
      rUnit.textContent = opts.rulerCaption || ''; xy(rUnit, 'x', 'y', xa, -18);
      const order = ns.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
      let lastX = -1e9, row = 0;
      order.forEach(([v, i], r) => {
        const [g, , tVal] = rTicks[i], land = ease(seg(k, 1.15 + r * 0.1, 1.3 + r * 0.1)), px = X(v - first);
        g.setAttribute('transform', `translate(${X((v - first) * land).toFixed(1)} 0)`); op(g, land);
        tVal.textContent = `${small ? '' : 'AmIMo '}${i + 1} · ${r === 0 ? '0' : '+' + (v - first).toFixed(1) + ' ns'}`;
        tVal.setAttribute('text-anchor', r === 0 ? 'start' : r === order.length - 1 ? 'end' : 'middle');
        row = px - lastX < (small ? 70 : 120) ? row + 1 : 0; lastX = px; tVal.setAttribute('y', String(24 + row * 15));
      });
    }

    // beat 3: the lines meet at a crosshair with x / y / z and the time it was seen
    const co = seg(k, 2.1, 2.3) * (1 - seg(k, 3.05, 3.2));
    const [cx, cy] = scr(tagW);
    cross.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${lerp(1.6, 1, ease(seg(k, 2.1, 2.3))).toFixed(3)})`); op(cross, co);
    lPosS.textContent = `x ${(tagW.x - XIN + 4).toFixed(2)} m · y ${(tagW.z + 6).toFixed(2)} m · z ${tagW.y.toFixed(2)} m`;
    lPosT.textContent = `seen ${clock(fixAt)}`;
    place(lPos, cx + 30, cy - 30, seg(k, 2.25, 2.45) * (1 - seg(k, 3.0, 3.15)), 0, 1);

    // beat 4: top-down, the crosshair becomes the map dot; the tag sleeps; the path and the wait
    const mk = ease(seg(k, 3.15, 3.35));
    mark.position.copy(markW); mark.visible = mk > 0;
    mark.scale.setScalar(lerp(1.5, 1, mk) * (small ? 1.6 : 1.15));
    dotM.opacity = mk; tickM.opacity = mk; haloM.opacity = mk;
    const asleep = k > 3.1;
    lTag.classList.toggle('is-sleep', asleep); lTagS.textContent = asleep ? 'asleep' : 'awake';
    const tagO = asleep ? seg(k, 3.3, 3.45) : seg(k, 0.5, 0.6) * (1 - seg(k, 0.9, 1.0));
    const [tx, ty] = scr(asleep ? V(trolley.position.x, 0, -0.2) : tmp.copy(tagW).add(V(0.05, 0.02, 0)));
    if (asleep && small) place(lTag, tx - 24, ty, tagO, 1, 0.5); else place(lTag, tx + (asleep ? 0 : 16), ty + (asleep ? 0 : -14), tagO, asleep ? 0.5 : 0, asleep ? 0.5 : 1);
    const tr = ease(seg(k, 3.35, 3.6));
    if (tr > 0) {
      const pts = [];
      for (let i = 0; i <= 24; i++) pts.push(scr(V(lerp(XIN - 1.5, markW.x - 0.2, i / 24 * tr), 0.006, markW.z)));
      trail.setAttribute('d', 'M' + pts.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L'));
    }
    op(trail, tr > 0 ? 0.9 : 0);
    const wo = seg(k, 3.5, 3.65);
    if (wo > 0 && !waitFrom) waitFrom = now - 252000;      // illustrative: it has been standing here a few minutes
    if (k < 3.2) waitFrom = 0;
    lSeen.textContent = clock(fixAt);
    lWaitS.textContent = mmss(waitFrom ? (now - waitFrom) / 1000 : 0);
    const [mx, my] = scr(markW);
    place(lWait, mx + 22, my + (small ? 0 : 14), wo, 0, small ? 0.5 : 0);

    hint.classList.toggle('is-used', moved || k < 1.2 || k > 3.9 || (small && (ro > 0 || k > 2.9)));
    canvas.setAttribute('aria-valuenow', (xr - XMIN).toFixed(1));
    canvas.setAttribute('aria-valuetext', `Trolley ${(xr - XMIN).toFixed(1)} metres along the aisle`);

    renderer.render(root, cam);
    // keep ticking while settling, dragging, or while the wait timer runs
    if (settling || drag || wo > 0) raf = requestAnimationFrame(frame);
  }
  const ask = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
  addEventListener('resize', ask);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) { last = performance.now(); ask(); } }).observe(opts.observe || host);

  // ------------------------------------------------------------------ drag and keys
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(V(0, 1, 0), -0.8), hitP = V(0, 0, 0);
  const pointer = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, cam); };
  const onTrolley = (e) => { pointer(e); return ray.intersectObject(hit, false).length > 0; };
  const floorX = (e) => { pointer(e); return ray.ray.intersectPlane(plane, hitP) ? hitP.x : null; };
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (!onTrolley(e)) return;
    const fx = floorX(e); if (fx == null) return;
    drag = { x0: fx, r0: moved ? xr : trolley.position.x }; xr = drag.r0; moved = true;
    canvas.setPointerCapture(e.pointerId); host.classList.add('is-drag'); e.preventDefault(); ask();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) { if (e.pointerType === 'mouse') canvas.style.cursor = onTrolley(e) ? '' : 'default'; return; }
    const fx = floorX(e); if (fx == null) return;
    xr = clamp(drag.r0 + fx - drag.x0, XMIN, XMAX); waitFrom = waitFrom && performance.now() - 1; ask();
  });
  const end = () => { drag = null; host.classList.remove('is-drag'); ask(); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 1 : 0.25;
    const to = { ArrowLeft: xr - step, ArrowDown: xr - step, ArrowRight: xr + step, ArrowUp: xr + step, Home: XMIN, End: XMAX }[e.key];
    if (to === undefined) return;
    e.preventDefault(); moved = true; xr = clamp(to, XMIN, XMAX); waitFrom = waitFrom && performance.now() - 1; ask();
  });

  size();
  if (document.fonts) document.fonts.ready.then(ask);
  ask();
  // test hook for the review shots: move the trolley as a drag would
  const ro = new ResizeObserver(size); ro.observe(host);
  return {
    setProgress: (p) => { pExt = clamp(p); ask(); },
    setTrolley: (v) => { moved = true; xr = clamp(v, XMIN, XMAX); ask(); },
    getTrolley: () => xr,
    update: ask, resize: size,
    destroy: () => { visible = false; ro.disconnect(); removeEventListener('resize', ask); renderer.dispose(); host.replaceChildren(); host.classList.remove('lz-host'); },
  };
}
