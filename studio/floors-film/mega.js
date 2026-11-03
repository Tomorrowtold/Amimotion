// The scale reveal: one plant, three floors. Each film opens tight on one thing and rises until the
// whole plant is in frame, turning from film into the live twin (blue = where things moved, amber = waiting).
import { THREE, M, concrete, box, tube, slab, castPart, trolley, rng, shaft } from './film.js';
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const BLUE = 0x1f6bff, AMBER = 0xffb020;
const ease = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (x * 6 - 15) + 10);
const lerp = (a, b, k) => a + (b - a) * k;
const lerpV = (a, b, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k));

// ---------- geometry helpers ----------
function merge(parts) {
  // parts: [geometry, matrix] -> one non-indexed geometry
  const pos = [], nor = [];
  for (const [g0, m] of parts) {
    const g = (g0.index ? g0.toNonIndexed() : g0.clone()).applyMatrix4(m);
    pos.push(g.attributes.position.array); nor.push(g.attributes.normal.array);
  }
  const cat = (arrs) => { const n = arrs.reduce((a, b) => a + b.length, 0), o = new Float32Array(n); let i = 0; for (const a of arrs) { o.set(a, i); i += a.length; } return o; };
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(cat(pos), 3)); g.setAttribute('normal', new THREE.BufferAttribute(cat(nor), 3)); return g;
}
const mB = (w, h, d, x, y, z) => [new THREE.BoxGeometry(w, h, d), new THREE.Matrix4().makeTranslation(x, y, z)];
const mC = (r, h, x, y, z, rx = 0) => [new THREE.CylinderGeometry(r, r, h, 10), new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationX(rx))];

function inst(geo, mat, mats, { shadow = true } = {}) {
  const im = new THREE.InstancedMesh(geo, mat, mats.length); mats.forEach((m, i) => im.setMatrixAt(i, m)); im.castShadow = shadow; im.receiveShadow = true; im.instanceMatrix.needsUpdate = true; return im;
}
const at = (x, z, ry = 0, y = 0, s = 1) => new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), ry), V(s, s, s));

// light pooled on the floor (instanced), and per-frame strength
function glowMat(color) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { c: { value: new THREE.Color(color) }, k: { value: 1 } },
    vertexShader: `varying vec2 u;void main(){u=uv*2.-1.;vec4 p=vec4(position,1.);
      #ifdef USE_INSTANCING
      p=instanceMatrix*p;
      #endif
      gl_Position=projectionMatrix*modelViewMatrix*p;}`,
    fragmentShader: `uniform vec3 c;uniform float k;varying vec2 u;void main(){float d=length(u);gl_FragColor=vec4(c*k*pow(max(0.,1.-d),2.),1.);}`,
  });
}

// ---------- the props, two levels of detail ----------
const LOD = {
  trolleyFrame: () => merge([...[[-.6, -.33], [.6, -.33], [-.6, .33], [.6, .33]].map(([x, z]) => mB(.035, .9, .035, x, .55, z)), mB(.03, .03, .7, -.62, 1.08, 0), ...[-.33, .33].map((z) => mB(1.2, .025, .025, 0, .98, z))]),
  trolleyShelf: () => merge([.2, .58, .96].map((y) => mB(1.22, .02, .68, 0, y, 0))),
  trolleyLoad: () => merge([.22, .6].flatMap((y) => [-.38, 0, .38].map((x) => mC(.09, .2, x, y + .1, 0, Math.PI / 2)))),
  pallet: () => merge([mB(1.0, .14, 1.2, 0, .07, 0)]),
  cartons: () => merge([mB(.98, 1.05, 1.18, 0, .67, 0)]),
  amrBody: () => merge([mB(1.0, .26, .66, 0, .19, 0)]),
  amrBase: () => merge([mB(1.02, .07, .68, 0, .06, 0), mB(.78, .03, .5, 0, .33, 0)]),
  amrStrip: () => merge([mB(.7, .012, .69, 0, .22, 0)]),
  forkBody: () => merge([mB(1.3, .55, 1.0, 0, .45, 0), mB(.5, .6, 1.0, -.6, .5, 0), mB(.75, .04, .9, 0, 2.1, 0), ...[-.42, .42].flatMap((z) => [mB(.05, 1.3, .05, -.35, 1.45, z), mB(.05, 1.3, .05, .33, 1.45, z)])]),
  forkMast: () => merge([mB(.08, 2.3, .1, .72, 1.15, -.3), mB(.08, 2.3, .1, .72, 1.15, .3), mB(1.0, .04, .1, 1.25, .08, -.25), mB(1.0, .04, .1, 1.25, .08, .25)]),
  rackBay: () => merge([...[[0, -.5], [0, .5]].map(([x, z]) => mB(.09, 6, .07, x, 3, z)), ...[1.6, 3.2, 4.8].flatMap((y) => [mB(2.6, .12, .05, 1.35, y, -.5), mB(2.6, .12, .05, 1.35, y, .5)])]),
  rackLoads: (R) => merge([0, 1.66, 3.26, 4.86].flatMap((y) => [.68, 2.02].filter(() => R() > .15).map((x) => mB(1.0, .7 + R() * .6, .9, x, y + .5, 0)))),
  cell: () => merge([mB(4.2, 2.6, 3.2, 0, 1.3, 0), mB(4.4, .1, 3.4, 0, 2.65, 0), mB(1.2, 3.4, 1.2, 1.2, 1.7, -.6)]),
  cellGlass: () => merge([mB(2.4, 1.0, .02, -.4, 1.5, 1.61)]),
};

function buildAMR() {
  const amr = new THREE.Group();
  const body = slab(1.0, .66, .26, .16, M.satinWhite(), .02); body.position.y = .06; amr.add(body);
  const band = slab(1.02, .68, .07, .17, M.graphite(), .01); band.position.y = .045; amr.add(band);
  const lidar = slab(.06, .42, .05, .02, new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: .05, clearcoat: 1 })); lidar.position.set(.49, .19, 0); amr.add(lidar);
  const top = slab(.78, .5, .02, .1, M.graphite(), .005); top.position.y = .32; amr.add(top);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .018, 48), M.zinc()); plate.position.set(.08, .335, 0); amr.add(plate);
  for (const sx of [-.2, .28]) { const seam = box(.004, .2, .7, new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: .6 }), sx, .2, 0); seam.castShadow = false; amr.add(seam); }
  for (const sz of [-.12, .12]) { const eye = new THREE.Mesh(new THREE.CircleGeometry(.018, 24), new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: .05, clearcoat: 1 })); eye.rotation.y = Math.PI / 2; eye.position.set(.522, .12, sz); amr.add(eye); }
  for (const sx of [-.36, .36]) for (const sz of [-.24, .24]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .03, 18), M.rubber()); w.rotation.x = Math.PI / 2; w.position.set(sx, .035, sz); amr.add(w); }
  for (const s of [-1, 1]) { const st = box(.7, .008, .004, M.glow(BLUE, 5), .03, .215, s * .357); st.castShadow = false; amr.add(st); }
  amr.add(tube(V(-.5, .14, 0), V(-.95, .14, 0), .02, M.darkSteel()));
  const R = rng(9), alu = M.alu();
  const tr = trolley({ L: 1.25, W: .66, H: .95, frame: M.zinc(), shelf: M.darkSteel(), load: (g, y, L, W, i) => { if (i === 0) return; for (let k = 0; k < 2; k++) { const p = castPart(alu, R); p.position.set(-L / 2 + .2 + k * .55, y, (R() - .5) * .1); p.rotation.y = R() * .4 - .2; g.add(p); } } });
  tr.position.set(-1.65, 0, 0); amr.add(tr);
  amr.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return amr;
}

// ---------- the plant: one world for all three films ----------
// x -60..-20 robotics, -20..20 manufacturing, 20..60 warehousing; z -30..30
export function plant(seed = 1) {
  const R = rng(seed), scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a10);
  scene.fog = new THREE.FogExp2(0x0b1018, .012);
  const hemi = new THREE.HemisphereLight(0x5a6c90, 0x0a0a0c, .35); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xdfe8ff, 1.6); sun.position.set(-30, 60, 40); sun.target.position.set(0, 0, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 45, bottom: -45, near: 10, far: 160 }); sun.shadow.bias = -.0006; sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(150, 90), concrete([36, 22], 5)); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; scene.add(f);
  // the slab edge: the plant floats in the dark like a cut-away model
  const edge = new THREE.Mesh(new THREE.BoxGeometry(150, .6, 90), M.graphite()); edge.position.y = -.31; scene.add(edge);
  const lineMat = new THREE.MeshStandardMaterial({ color: 0x6e6644, roughness: .6, polygonOffset: true, polygonOffsetFactor: -2 });
  const lanes = [];
  const lane = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0); const m = new THREE.Matrix4().compose(V((x0 + x1) / 2, .003, (z0 + z1) / 2), new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, -Math.atan2(z1 - z0, x1 - x0))), V(len, .1, 1)); lanes.push(m); };
  for (const z of [-24, -12, 0, 12, 24]) { lane(-72, z - 1.2, 72, z - 1.2); lane(-72, z + 1.2, 72, z + 1.2); }
  for (const x of [-20, 20]) lane(x, -44, x, 44);
  scene.add(inst(new THREE.PlaneGeometry(1, 1), lineMat, lanes, { shadow: false }));

  const mats = { zinc: M.zinc(), dark: M.darkSteel(), alu: M.alu(), wood: new THREE.MeshStandardMaterial({ color: 0x6b5a45, roughness: .9 }), card: new THREE.MeshStandardMaterial({ color: 0x8e7556, roughness: .85 }), white: M.satinWhite(), graphite: M.graphite(), steel: M.steel(), paint: new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: .5, metalness: .3 }) };
  const L = {}; for (const k in LOD) L[k] = k === 'rackLoads' ? LOD[k](R) : LOD[k]();

  const waits = [];   // [x, z, r] amber pools
  // --- manufacturing: cells in a grid, queues of trolleys waiting between them
  const cells = [], cellGlass = [], tF = [], tS = [], tL = [];
  for (let x = -16; x <= 16; x += 8) for (const z of [-18, -6, 6, 18]) { cells.push(at(x, z)); cellGlass.push(at(x, z)); }
  const queue = (x0, z, n, dx = 1.45) => { for (let i = 0; i < n; i++) { const m = at(x0 + i * dx, z, (R() - .5) * .04); tF.push(m); tS.push(m); tL.push(m); waits.push([x0 + i * dx, z, 1.3]); } };
  for (let x = -16; x <= 12; x += 8) for (const z of [-12, 0, 12]) queue(x + 2.2, z + (R() < .5 ? -.0 : 0), 2 + (R() * 3 | 0));
  // --- robotics: staging rows of trolleys
  for (let x = -56; x <= -26; x += 1.45) for (const z of [-18, 18]) if (R() < .7) { const m = at(x, z); tF.push(m); tS.push(m); tL.push(m); if (R() < .35) waits.push([x, z, 1.3]); }
  // --- warehousing: rack rows along x, staging pallets near docks, dock doors at x = 64
  const racks = [], loads = [], pallets = [], cartons = [];
  for (const z of [-28, -20, -4, 4, 20, 28]) for (let x = 24; x <= 56; x += 2.7) { racks.push(at(x, z)); loads.push(at(x, z)); }
  for (let z = -16; z <= 16; z += 1.6) for (const x of [58.5, 60]) if (R() < .75) { const m = at(x, z, (R() - .5) * .05); pallets.push(m); cartons.push(at(x, z, 0, 0, 1)); waits.push([x, z, 1.1]); }
  const doors = new THREE.Group();
  for (let z = -24; z <= 24; z += 6) { const d = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.4), M.glow(0xd6e4ff, 1.1)); d.position.set(64.9, 1.7, z); d.rotation.y = -Math.PI / 2; doors.add(d); }
  scene.add(doors);
  scene.add(inst(L.cell, mats.graphite, cells), inst(L.cellGlass, M.glow(0x9ec0ff, .5), cellGlass, { shadow: false }));
  scene.add(inst(L.trolleyFrame, mats.zinc, tF), inst(L.trolleyShelf, mats.dark, tS), inst(L.trolleyLoad, mats.alu, tL));
  scene.add(inst(L.rackBay, mats.steel, racks), inst(L.rackLoads, mats.card, loads));
  scene.add(inst(L.pallet, mats.wood, pallets), inst(L.cartons, mats.card, cartons));
  // columns and the light grid hanging over the floor
  const cols = []; for (let x = -60; x <= 60; x += 12) for (const z of [-30, -15, 0, 15, 30]) cols.push(at(x, z));
  const colMesh = inst(merge([mB(.45, 6, .45, 0, 3, 0)]), mats.dark, cols); scene.add(colMesh);
  const lamps = []; for (let x = -66; x <= 66; x += 6) for (let z = -36; z <= 36; z += 6) lamps.push(at(x, z, 0, 11.5));
  const lampMesh = inst(merge([mB(.7, .05, .25, 0, 0, 0)]), M.glow(0xe2eaff, 5), lamps, { shadow: false }); scene.add(lampMesh);

  // --- movers: AMRs on the robotics highways and through the cells, forklifts in the warehouse
  const loopRect = (x0, z0, x1, z1) => { const p = [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]]; let len = 0; const seg = []; for (let i = 1; i < p.length; i++) { const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); seg.push([p[i - 1], p[i], len, l]); len += l; } return { seg, len }; };
  const posOn = (P, d) => { d = ((d % P.len) + P.len) % P.len; for (const [a, b, s, l] of P.seg) if (d <= s + l) { const k = (d - s) / l; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(-(b[1] - a[1]), b[0] - a[0])]; } return [0, 0, 0]; };
  const movers = [];
  const routes = [loopRect(-58, -13.2, -22, -10.8), loopRect(-58, 10.8, -22, 13.2), loopRect(-58, -1.2, 18, 1.2), loopRect(-18, -25.2, 18, -22.8), loopRect(-18, 22.8, 18, 25.2), loopRect(-58, -25.2, -22, 25.2)];
  routes.forEach((P, ri) => { const n = Math.round(P.len / 9); for (let i = 0; i < n; i++) movers.push({ P, o: i / n * P.len + R() * 2, v: 1.4 + R() * .4, kind: 'amr' }); });
  const fRoutes = [loopRect(22, -13.2, 62, -10.8), loopRect(22, 10.8, 62, 13.2), loopRect(22, -1.2, 62, 1.2), loopRect(22, -25.2, 56, -22.8), loopRect(22, 22.8, 56, 25.2)];
  fRoutes.forEach((P) => { const n = Math.round(P.len / 14); for (let i = 0; i < n; i++) movers.push({ P, o: i / n * P.len + R() * 3, v: 2.2 + R() * .5, kind: 'fork' }); });
  const amrs = movers.filter((m) => m.kind === 'amr'), forks = movers.filter((m) => m.kind === 'fork');
  const mk = (geo, mat, n, sh = true) => { const im = new THREE.InstancedMesh(geo, mat, n); im.castShadow = sh; im.receiveShadow = true; scene.add(im); return im; };
  const aB = mk(L.amrBody, mats.white, amrs.length), aBase = mk(L.amrBase, mats.graphite, amrs.length), aS = mk(L.amrStrip, M.glow(BLUE, 4), amrs.length, false);
  const aTF = mk(L.trolleyFrame, mats.zinc, amrs.length), aTS = mk(L.trolleyShelf, mats.dark, amrs.length), aTL = mk(L.trolleyLoad, mats.alu, amrs.length);
  const fB = mk(L.forkBody, mats.paint, forks.length), fM = mk(L.forkMast, mats.dark, forks.length);
  const fBeacon = mk(merge([mB(.08, .08, .08, -.3, 2.2, 0)]), M.glow(BLUE, 6), forks.length, false);
  // the live map: trails of where each mover has been, drawn on the floor
  const TR = 70, trailPos = new Float32Array(movers.length * (TR - 1) * 6), trailCol = new Float32Array(movers.length * (TR - 1) * 6);
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(trailPos, 3)); tg.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
  const trails = new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); trails.frustumCulled = false; trails.layers.set(1); scene.add(trails);
  // amber pools under what waits
  const amberMat = glowMat(AMBER); const amb = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), amberMat, waits.length);
  waits.forEach(([x, z, r], i) => amb.setMatrixAt(i, new THREE.Matrix4().compose(V(x, .02, z), new THREE.Quaternion(), V(r * 2.4, 1, r * 2.4)))); amb.layers.set(1); amb.frustumCulled = false; scene.add(amb);
  const blueMat = glowMat(BLUE); const bpool = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), blueMat, movers.length); bpool.layers.set(1); bpool.frustumCulled = false; scene.add(bpool);
  // a faint survey grid that appears with the twin
  const grid = new THREE.GridHelper(150, 75, 0x2a3c66, 0x2a3c66); grid.position.y = .01; grid.material.transparent = true; grid.material.opacity = 0; grid.material.depthWrite = false; grid.layers.set(1); scene.add(grid);

  const tmp = new THREE.Matrix4(), q = new THREE.Quaternion(), Y = V(0, 1, 0);
  const place = (t, k) => {
    let ai = 0, fi = 0;
    movers.forEach((m, i) => {
      const [x, z, a] = posOn(m.P, m.o + m.v * t);
      q.setFromAxisAngle(Y, a);
      if (m.kind === 'amr') { tmp.compose(V(x, 0, z), q, V(1, 1, 1)); aB.setMatrixAt(ai, tmp); aBase.setMatrixAt(ai, tmp); aS.setMatrixAt(ai, tmp); const [tx, tz, ta] = posOn(m.P, m.o + m.v * t - 1.65); const q2 = new THREE.Quaternion().setFromAxisAngle(Y, ta); const m2 = new THREE.Matrix4().compose(V(tx, 0, tz), q2, V(1, 1, 1)); aTF.setMatrixAt(ai, m2); aTS.setMatrixAt(ai, m2); aTL.setMatrixAt(ai, m2); ai++; }
      else { tmp.compose(V(x, 0, z), q, V(1, 1, 1)); fB.setMatrixAt(fi, tmp); fM.setMatrixAt(fi, tmp); fBeacon.setMatrixAt(fi, tmp); fi++; }
      bpool.setMatrixAt(i, new THREE.Matrix4().compose(V(x, .025, z), new THREE.Quaternion(), V(2.6, 1, 2.6)));
      for (let j = 0; j < TR - 1; j++) {
        const d0 = m.o + m.v * (t - j * .1), d1 = m.o + m.v * (t - (j + 1) * .1);
        const p0 = posOn(m.P, d0), p1 = posOn(m.P, d1), o = (i * (TR - 1) + j) * 6;
        trailPos.set([p0[0], .03, p0[1], p1[0], .03, p1[1]], o);
        const f0 = (1 - j / TR) * k, f1 = (1 - (j + 1) / TR) * k;
        trailCol.set([.3 * f0, .9 * f0, 3 * f0, .3 * f1, .9 * f1, 3 * f1], o);
      }
    });
    [aB, aBase, aS, aTF, aTS, aTL, fB, fM, fBeacon, bpool].forEach((im) => (im.instanceMatrix.needsUpdate = true));
    tg.attributes.position.needsUpdate = true; tg.attributes.color.needsUpdate = true;
  };
  const twin = (k) => {
    amberMat.uniforms.k.value = .25 + .55 * k; blueMat.uniforms.k.value = .15 + .45 * k;
    grid.material.opacity = .22 * k;
    sun.intensity = lerp(1.6, .55, k); hemi.intensity = lerp(.35, .12, k); lampMesh.visible = k < .35; colMesh.visible = k < .6;
  };
  return { scene, place, twin, sun };
}

// ---------- the three films ----------
// camera keys: [time, pos, look, focus, aperture]
function film(build, keys, look) {
  return () => {
    const W = plant(3); const S = build(W);
    const cam = new THREE.PerspectiveCamera(30, 4 / 3, .05, 400);
    const T = 8;
    const out = {
      scene: W.scene, cam, loop: T, focus: 3, aperture: .05, maxR: 22, look,
      tick(t) {
        let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
        const [t0, p0, l0, f0, a0, fov0] = keys[i], [t1, p1, l1, f1, a1, fov1] = keys[i + 1];
        const k = ease((t - t0) / (t1 - t0));
        cam.position.copy(lerpV(p0, p1, k)); cam.lookAt(lerpV(l0, l1, k));
        cam.fov = lerp(fov0, fov1, k); cam.updateProjectionMatrix();
        out.focus = lerp(f0, f1, k); out.aperture = lerp(a0, a1, k);
        const tw = ease((t - 2.4) / 3.2);
        W.place(t + 30, tw); W.twin(tw); if (S && S.tick) S.tick(t, tw);
      },
    };
    return out;
  };
}

// MANUFACTURING: tight on a waiting housing at a cell, then up over the whole floor
export const megaFactory = film((W) => {
  const R = rng(5), alu = M.alu(), s = W.scene;
  const hero = trolley({ L: 1.25, W: .7, H: 1.0, frame: M.zinc(), shelf: M.darkSteel(), load: (g, y, L, Wd, i) => { for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) { const p = castPart(alu, R); p.position.set(-L / 2 + .12 + k * .55, y, -Wd / 4 + j * Wd / 2 - .1); p.rotation.y = (R() - .5) * .25; g.add(p); } } });
  hero.position.set(-1.4, 0, 3.2); s.add(hero);
  const sp = new THREE.SpotLight(AMBER, 70, 9, .5, .9, 1.5); sp.position.set(-.8, 3.6, 3.6); sp.target.position.set(-1.4, .8, 3.2); sp.castShadow = true; sp.shadow.mapSize.set(1024, 1024); s.add(sp, sp.target);
  const rim = new THREE.SpotLight(0xd8e4ff, 40, 12, .45, .8, 1.5); rim.position.set(-3, 3, -.5); rim.target.position.set(-1.4, .8, 3.2); s.add(rim, rim.target);
  return { tick(t, k) { sp.intensity = lerp(70, 0, k); rim.intensity = lerp(40, 0, k); } };
}, [
  [0, [-.25, 1.15, 4.35], [-1.55, .75, 3.0], 1.7, .07, 26],
  [2.4, [-.55, 1.35, 4.95], [-1.5, .8, 3.0], 2.2, .06, 28],
  [7.2, [-34, 46, 52], [0, 0, 0], 70, .0, 34],
  [8, [-35.5, 47, 53], [0, 0, 0], 72, .0, 34],
], { exposure: 1.1, bloom: .55, sat: .82 });

// WAREHOUSING: low among the pallets at the docks, a forklift's blue light passes, then the rise
export const megaWarehouse = film((W) => {
  const s = W.scene;
  const sp = new THREE.SpotLight(AMBER, 60, 10, .5, .9, 1.5); sp.position.set(57, 4, -2); sp.target.position.set(59, .6, 0); s.add(sp, sp.target);
  const rim = new THREE.SpotLight(0xd8e4ff, 50, 14, .5, .8, 1.5); rim.position.set(66, 3, 4); rim.target.position.set(59, .6, 0); s.add(rim, rim.target);
  return { tick(t, k) { sp.intensity = lerp(60, 0, k); rim.intensity = lerp(50, 8, k); } };
}, [
  [0, [54.4, .9, -2.6], [59, .9, .6], 5.4, .06, 30],
  [2.4, [53.6, 1.2, -3.4], [59, .9, .6], 6.2, .05, 32],
  [7.2, [82, 44, -44], [10, 0, 2], 75, 0, 36],
  [8, [83, 45, -45.5], [10, 0, 2], 76, 0, 36],
], { exposure: 1.1, bloom: .6, sat: .82 });

// ROBOTICS: floor level beside an AMR towing a trolley, then the rise reveals every route
export const megaRobots = film((W) => {
  const s = W.scene, amr = buildAMR(); s.add(amr);
  const key = new THREE.SpotLight(0xffe8d0, 8, 10, .5, .9, 1.5); key.target.position.set(0, .3, 0); amr.add(key, key.target); key.position.set(-1.2, 1.4, 1.1);
  const rim = new THREE.SpotLight(0xd8e4ff, 34, 14, .35, .7, 1.5); rim.position.set(.6, 3.2, -4.5); rim.target.position.set(0, .2, 0); amr.add(rim, rim.target);
  return { tick(t, k) { amr.position.set(-44 + t * 1.5, 0, 6.0); key.intensity = lerp(8, 0, k); rim.intensity = lerp(34, 0, k); } };
}, [
  [0, [-44.15, .24, 10.3], [-44.0, .36, 6], 4.3, .11, 22],
  [2.4, [-40.4, .4, 10.6], [-40.4, .36, 6], 4.6, .09, 22],
  [7.2, [-80, 42, 50], [-6, 0, 0], 80, 0, 34],
  [8, [-81, 43, 51], [-6, 0, 0], 81, 0, 34],
], { exposure: 1.08, bloom: .55, sat: .82 });

export const MEGA = { megaFactory, megaWarehouse, megaRobots };
