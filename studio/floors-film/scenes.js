import { THREE, M, concrete, shaft, dust, box, tube, slab, castPart, trolley, rng } from './film.js';
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const BLUE = 0x1f6bff, AMBER = 0xffb020;
function doorGlow() {
  return new THREE.ShaderMaterial({ uniforms: {}, vertexShader: `varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 u;void main(){float e=smoothstep(0.,.08,u.x)*smoothstep(1.,.92,u.x);vec3 c=mix(vec3(.5,.56,.68),vec3(.9,.95,1.05),u.y)*(.5+.5*e);gl_FragColor=vec4(c*.6,1.);}` });
}
// light on the floor from a moving thing: soft additive ellipse
function floorGlow(color, k) {
  return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { c: { value: new THREE.Color(color).multiplyScalar(k) } },
    vertexShader: `varying vec2 u;void main(){u=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform vec3 c;varying vec2 u;void main(){float d=length(u);gl_FragColor=vec4(c*pow(max(0.,1.-d),2.2),1.);}` });
}

function hall(scene, { fog = 0x0b1018, density = .06 } = {}) {
  scene.background = new THREE.Color(fog).multiplyScalar(.6);
  scene.fog = new THREE.FogExp2(fog, density);
  scene.add(new THREE.HemisphereLight(0x4a5a78, 0x0a0a0c, .08));
}

function floor(scene, size = 80, rep = 14, seed) {
  const f = new THREE.Mesh(new THREE.PlaneGeometry(size, size), concrete([rep, rep], seed)); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; scene.add(f); return f;
}

function spot(scene, pos, target, color, intensity, angle, pen = .6, shadow = false, dist = 30) {
  const s = new THREE.SpotLight(color, intensity, dist, angle, pen, 1.6); s.position.copy(pos); s.target.position.copy(target);
  if (shadow) { s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -.0004; s.shadow.radius = 4; s.shadow.camera.near = .5; }
  scene.add(s, s.target); return s;
}

// floor paint line, slightly worn
function paint(scene, x0, z0, x1, z1, w, color = 0x6e6644) {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, w), new THREE.MeshStandardMaterial({ color, roughness: .6, transparent: true, opacity: .8, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(z1 - z0, x1 - x0); m.position.set((x0 + x1) / 2, .002, (z0 + z1) / 2); m.receiveShadow = true; scene.add(m); return m;
}

// pallet racking run along x: uprights, beams, loaded pallets
function rackRun(scene, { x0, x1, z, depth = 1.0, bay = 2.7, levels = [0, 1.6, 3.2, 4.8], H = 6, seed = 5, face = 1 }) {
  const R = rng(seed), up = M.steel(), beam = new THREE.MeshStandardMaterial({ color: 0x3b4a66, metalness: .6, roughness: .45 });
  const cards = [M.cardboard(seed), M.cardboard(seed + 1)], wrap = M.wrap(), wood = new THREE.MeshStandardMaterial({ color: 0x6b5a45, roughness: .9 });
  for (let x = x0; x <= x1 + .01; x += bay) {
    for (const dz of [-depth / 2, depth / 2]) scene.add(box(.09, H, .07, up, x, H / 2, z + dz));
    for (let y = .4; y < H; y += .9) scene.add(tube(V(x, y, z - depth / 2), V(x, y + .6, z + depth / 2), .012, up));
    if (x + bay > x1 + .01) break;
    levels.forEach((ly, li) => {
      if (li) for (const dz of [-depth / 2, depth / 2]) scene.add(box(bay - .09, .12, .05, beam, x + bay / 2, ly, z + dz));
      for (let k = 0; k < 2; k++) {
        if (R() < .12) continue;
        const px = x + bay * (k ? .73 : .27), py = ly + (li ? .06 : 0);
        scene.add(box(1.0, .14, .9, wood, px, py + .07, z));
        const hh = .6 + R() * .7, g = new THREE.Group(); g.position.set(px, py + .14, z);
        const nx = 2, nz = 2, ny = Math.max(1, Math.round(hh / .32));
        for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) for (let c = 0; c < ny; c++) g.add(box(.48, .3, .43, cards[(a + b + c) % 2], -.25 + a * .5, .15 + c * .31, -.22 + b * .45));
        const w = box(1.02, ny * .31 + .01, .92, wrap, 0, ny * .31 / 2, 0); w.castShadow = false; g.add(w);
        scene.add(g);
      }
    });
  }
}

// small practical lamps far away: depth of field turns them into round bokeh. Periodic in P so loops stay seamless.
function bokehField(scene, { x0, x1, P, z0, z1, y0, y1, n, seed, warm = .25 }) {
  const R = rng(seed), pts = [];
  for (let i = 0; i < n; i++) pts.push([R() * P, y0 + R() * (y1 - y0), z0 + R() * (z1 - z0), R() < warm, .6 + R() * 1.4]);
  for (let x = x0; x < x1; x += P) pts.forEach(([dx, y, z, w, k]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), M.glow(w ? 0xffc27a : 0xcfdcff, 6 * k)); m.position.set(x + dx, y, z); scene.add(m); });
}

/* ------------------------------------------------------------------ */
/* ROBOTICS A: floor-level tracking beside an AMR towing a trolley     */
/* ------------------------------------------------------------------ */
export function robotsA() {
  const scene = new THREE.Scene(); hall(scene, { fog: 0x0a0f18, density: .075 });
  const P = 5.4, T = 6;
  floor(scene, 120, 30, 3);
  paint(scene, -40, .62, 60, .62, .08); paint(scene, -40, -.62, 60, -.62, .08);
  // racks behind the aisle, and a run between camera and aisle that wipes past out of focus
  rackRun(scene, { x0: -16.2, x1: 32.4, z: -2.0, seed: 4 });
  for (let x = -16.2; x < 32; x += 5.4) { scene.add(box(.09, 6, .07, M.steel(), x, 3, 1.55)); }
  // AMR
  const amr = new THREE.Group();
  const body = slab(1.0, .66, .26, .16, M.satinWhite(), .02); body.position.y = .06; amr.add(body);
  const band = slab(1.02, .68, .07, .17, M.graphite(), .01); band.position.y = .045; amr.add(band);
  const lidar = slab(.06, .42, .05, .02, new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: .05, clearcoat: 1 })); lidar.position.set(.49, .19, 0); amr.add(lidar);
  const top = slab(.78, .5, .02, .1, M.graphite(), .005); top.position.y = .32; amr.add(top);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .018, 48), M.zinc()); plate.position.set(.08, .335, 0); amr.add(plate);
  for (const sx of [-.2, .28]) { const seam = box(.004, .2, .7, new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: .6 }), sx, .2, 0); seam.castShadow = false; amr.add(seam); }
  for (const sz of [-.12, .12]) { const eye = new THREE.Mesh(new THREE.CircleGeometry(.018, 24), new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: .05, clearcoat: 1 })); eye.rotation.y = Math.PI / 2; eye.position.set(.522, .12, sz); amr.add(eye); }
  for (const sx of [-.36, .36]) for (const sz of [-.24, .24]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .03, 18), M.rubber()); w.rotation.x = Math.PI / 2; w.position.set(sx, .035, sz); amr.add(w); }

  // located: a thin line of electric blue along the flank, and its light on the floor
  for (const s of [-1, 1]) { const st = box(.7, .008, .004, M.glow(BLUE, 5), .03, .215, s * .357); st.castShadow = false; amr.add(st); }
  // rim: a cool key from behind and above that draws the robot's edges out of the dark
  const rim = new THREE.SpotLight(0xd8e4ff, 34, 14, .35, .7, 1.5); rim.position.set(.6, 3.2, -4.5); rim.target.position.set(0, .2, 0); amr.add(rim, rim.target);
  const key = new THREE.SpotLight(0xffe8d0, 5, 10, .5, .9, 1.5); key.position.set(-1.2, 1.4, 1.1); key.target.position.set(0, .3, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004; amr.add(key, key.target);
  const under = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), floorGlow(BLUE, .5)); under.rotation.x = -Math.PI / 2; under.position.set(0, .004, 0); under.layers.set(1); under.visible = !location.search.includes('nog'); amr.add(under);
  const rearL = box(.004, .02, .3, M.glow(0xff3030, 1.2), -.5, .18, 0); amr.add(rearL);
  // tow bar and the trolley it pulls
  amr.add(tube(V(-.5, .14, 0), V(-.95, .14, 0), .02, M.darkSteel()));
  const R = rng(9), alu = M.alu();
  const tr = trolley({ L: 1.25, W: .66, H: .95, frame: M.zinc(), shelf: M.darkSteel(), load: (g, y, L, W, i) => { if (i === 0) return; for (let k = 0; k < 3; k++) { const p = castPart(alu, R); p.position.set(-L / 2 + .25 + k * .38, y, (R() - .5) * .1); p.rotation.y = R() * .4 - .2; g.add(p); } } });
  tr.position.set(-1.65, 0, 0); amr.add(tr);
  amr.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(amr);
  // waiting: one parked trolley per loop period on the far side, in an amber pool
  for (let x = -10.8; x <= 27; x += P) {
    const t2 = trolley({ L: 1.2, W: .66, H: .95, frame: M.zinc(), shelf: M.darkSteel(), load: (g, y, L, W, i) => { if (i === 0) return; for (let k = 0; k < 3; k++) { const p = castPart(alu, R); p.position.set(-L / 2 + .25 + k * .37, y, 0); g.add(p); } } });
    t2.position.set(x + 1.3, 0, -1.05); t2.rotation.y = .04; scene.add(t2);
    spot(scene, V(x + 1.3, 4.2, -1.05), V(x + 1.3, 0, -1.05), AMBER, 26, .3, .9, false, 10);
    scene.add(shaft(V(x + 1.3, 4.0, -1.05), V(x + 1.3, 0, -1.05), .05, .9, AMBER, .05));
  }
  // high-bay lights over the aisle, cool, every bay
  for (let x = -13.5; x <= 30; x += 2.7) {
    const shadow = Math.abs(x - 1.35) < 3 || Math.abs(x - 4.05) < .1;
    spot(scene, V(x, 7.5, 0), V(x, 0, 0), 0xcad8ff, 16, .42, .7, shadow, 14);
    scene.add(shaft(V(x, 7.2, 0), V(x, 0, 0), .12, 2.0, 0x9fb6ff, .03));
    const lamp = box(.5, .04, .22, M.glow(0xdfe8ff, 6), x, 7.55, 0); lamp.castShadow = false; scene.add(lamp);
  }
  const d = { tick() {} };
  bokehField(scene, { x0: -16.2, x1: 32.4, P, z0: -9, z1: -26, y0: .5, y1: 9, n: 26, seed: 6 });
  const far = new THREE.Mesh(new THREE.PlaneGeometry(200, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x1a2438).multiplyScalar(.6) })); far.position.set(0, 8, -30); scene.add(far);
  // camera: low, long lens, tracking with the robot
  const cam = new THREE.PerspectiveCamera(22, 4 / 3, .1, 80);
  return {
    scene, cam, amr, cull: [-6, 12], loop: T, focus: 4.3, aperture: .11, maxR: 26, look: { exposure: 1.05, bloom: .55, sat: .82 },
    tick(t) {
      const u = t / T, x = u * P;
      amr.position.set(x + .35, 0, 0);
      cam.position.set(x - .15, .24, 4.3); cam.lookAt(x + 0, .36, 0);
      d.tick(t, T);
    },
  };
}

/* ------------------------------------------------------------------ */
/* ROBOTICS B: wide, still camera; robots pass through light            */
/* ------------------------------------------------------------------ */
export function robotsB() {
  const s = robotsA();
  const P = 5.4, T = 6; const cam = s.cam; cam.fov = 30; cam.updateProjectionMatrix();
  const a = s.amr, c1 = a.clone(), c2 = a.clone(); s.scene.add(c1, c2);
  return { ...s, focus: 6.8, aperture: .035, tick(t) { s.tick(t); c1.position.copy(a.position).x -= P; c2.position.copy(a.position).x += P; cam.position.set(1.6 + Math.sin(t / T * 6.283) * .02, 1.25, 6.8); cam.lookAt(1.8, .45, 0); } };
}

/* ------------------------------------------------------------------ */
/* MANUFACTURING: slow push along the queue of trolleys at inspection */
/* ------------------------------------------------------------------ */
export function factory() {
  const scene = new THREE.Scene(); hall(scene, { fog: 0x0d1016, density: .06 });
  const P = 1.55, T = 6;
  floor(scene, 120, 26, 8);
  paint(scene, -30, .75, 40, .75, .09); paint(scene, -30, -2.2, 40, -2.2, .09);
  const R = rng(21), alu = M.alu();
  // the queue: trolleys nose to tail along x, waiting
  for (let x = -12; x <= 18; x += P) {
    const tr = trolley({ L: 1.25, W: .7, H: 1.0, frame: M.zinc(), shelf: M.darkSteel(), load: (g, y, L, W, i) => { for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) { if (R() < .15) continue; const p = castPart(alu, R); p.position.set(-L / 2 + .12 + k * .55, y, -W / 4 + j * W / 2 - .1); p.rotation.y = (R() - .5) * .25; g.add(p); } } });
    tr.position.set(x, 0, 0); tr.rotation.y = (R() - .5) * .03; scene.add(tr);
  }
  // amber: a long, warm pool along the waiting line (they wait)
  for (let x = -12; x <= 18; x += P * 2) { spot(scene, V(x, 3.6, .2), V(x, .6, 0), AMBER, 55, .42, .95, Math.abs(x - 1.55) < 2, 10); scene.add(shaft(V(x, 3.4, .2), V(x, 0, 0), .06, 1.2, AMBER, .03)); }
  // inspection booth behind glass: cool, bright, out of focus
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(40, 2.6), new THREE.MeshPhysicalMaterial({ color: 0xaab8cc, roughness: .05, metalness: 0, transparent: true, opacity: .14, depthWrite: false }));
  glass.position.set(0, 1.9, -1.1); scene.add(glass);
  scene.add(box(40, .9, .1, M.steel(), 0, .45, -1.12));
  for (let x = -12; x <= 18; x += 3.1) { scene.add(box(.06, 2.6, .08, M.darkSteel(), x, 1.9, -1.1)); }
  const bench = box(40, .06, .8, M.darkSteel(), 0, .95, -1.7); scene.add(bench);
  for (let x = -12; x <= 18; x += 3.1) { const l = box(1.2, .03, .2, M.glow(0xe6eeff, 7), x + 1.5, 2.9, -1.7); l.castShadow = false; scene.add(l); spot(scene, V(x + 1.5, 2.8, -1.7), V(x + 1.5, .9, -1.7), 0xdde8ff, 14, .8, .8, false, 6); }
  // parts on the inspection bench, in the far focus
  for (let x = -11; x <= 18; x += .9) { const p = castPart(alu, R); p.position.set(x, .98, -1.75); scene.add(p); }
  // the hall beyond: columns, machine cells as dark masses with small cool lights
  for (let x = -12; x <= 20; x += 6) { scene.add(box(.4, 8, .4, M.darkSteel(), x, 4, -6)); const cell = box(3.2, 2.4, 2.2, M.graphite(), x + 2.6, 1.2, -7.4); scene.add(cell); const w = box(1.6, .5, .02, M.glow(0x9ec0ff, 2.2), x + 2.6, 1.7, -6.29); w.castShadow = false; scene.add(w); }
  for (let x = -12; x <= 20; x += 4) { spot(scene, V(x, 8, -3), V(x, 0, -3), 0xc6d4ff, 14, .5, .8, false, 16); scene.add(shaft(V(x, 7.8, -3), V(x, 0, -3), .1, 2, 0x9fb6ff, .025)); }
  // located: a trolley crossing far behind the glass, carried by a blue light
  const mover = new THREE.Group();
  const mt = trolley({ L: 1.1, W: .6, H: .9, frame: M.zinc(), shelf: M.darkSteel() }); mover.add(mt);
  for (const sz of [-.31, .31]) { const st = box(1.0, .01, .004, M.glow(BLUE, 3), 0, .55, sz); st.castShadow = false; mover.add(st); }
  const ml = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), floorGlow(BLUE, .6)); ml.rotation.x = -Math.PI / 2; ml.position.y = .004; ml.layers.set(1); mover.add(ml);
  mover.position.set(0, 0, -4.2); scene.add(mover);
  const mover2 = mover.clone(), mover3 = mover.clone(); scene.add(mover2, mover3);
  const d = { tick() {} };
  const cam = new THREE.PerspectiveCamera(34, 4 / 3, .1, 80);
  return {
    scene, cam, cull: [-5, 9], loop: T, focus: 2.6, aperture: .06, maxR: 24, look: { exposure: 1.15, bloom: .5, sat: .8, gain: [1.02, .99, .95] },
    tick(t) {
      const u = t / T, x = u * P;
      cam.position.set(x - 2.2, 1.05, 1.15); cam.lookAt(x + 1.2, .78, -.25);
      const mx = u * 5 * P;   // copies every 4 spacings keep the loop seamless
      mover.position.x = mx - 2; mover2.position.x = mx - 2 - 4 * P; mover3.position.x = mx - 2 - 8 * P;
      d.tick(t, T);
    },
  };
}

/* ------------------------------------------------------------------ */
/* WAREHOUSING: crane move over the dock, forklift crossing, pallets waiting */
/* ------------------------------------------------------------------ */
export function warehouse() {
  const scene = new THREE.Scene(); hall(scene, { fog: 0x0c121c, density: .06 });
  const P = 4.0, T = 6;
  floor(scene, 160, 40, 12);
  const R = rng(31), wood = new THREE.MeshStandardMaterial({ color: 0x6b5a45, roughness: .9 }), wrap = M.wrap(), cards = [M.cardboard(31), M.cardboard(32)];
  // dock wall with doors: cold daylight spilling in
  for (let x = -24; x <= 40; x += P) {
    scene.add(box(.3, 7, .3, M.darkSteel(), x, 3.5, -9));
    const door = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.2), doorGlow());
    for (const sx of [-1.62, 1.62]) scene.add(box(.22, 2.6, .25, M.rubber(), x + P / 2 + sx, 1.3, -8.95));
    scene.add(shaft(V(x + P / 2, 1.3, -9), V(x + P / 2 + .4, 0, -6.4), 1.0, 1.7, 0xc8d8ff, .022)); door.position.set(x + P / 2, 1.1, -9.05); scene.add(door);
    // roller shutter half up, ribbed
    for (let k = 0; k < 9; k++) scene.add(box(3.0, .12, .04, M.steel(), x + P / 2, 2.28 + k * .125, -9.0));
    const spill = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 6), floorGlow(0xc8d8ff, .35)); spill.rotation.x = -Math.PI / 2; spill.position.set(x + P / 2, .005, -7.2); spill.layers.set(1); scene.add(spill);
    scene.add(box(3.4, 3.6, .1, M.graphite(), x + P / 2, 5.3, -9.1));
    spot(scene, V(x + P / 2, 2.4, -9.6), V(x + P / 2, 0, -4), 0xcfe0ff, 30, .55, .9, Math.abs(x) < 2, 14);
    scene.add(shaft(V(x + P / 2, 2.2, -9), V(x + P / 2, 0, -3), 1.2, 2.4, 0xbfd2ff, .02));
    paint(scene, x + .3, -8, x + .3, 2, .1);
    // staging lane: pallets waiting under amber
    for (let k = 0; k < 2; k++) {
      const px = x + P / 2 + (k ? .6 : -.6), pz = -5.4 + (R() - .5) * .2;
      scene.add(box(1.0, .14, 1.2, wood, px, .07, pz));
      const ny = 2 + (R() * 3 | 0), g = new THREE.Group(); g.position.set(px, .14, pz);
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < ny; c++) { const j = (R() - .5) * .015; g.add(box(.31 + j, .29, .38 + j, cards[(a * 3 + b + c) % 2], -.33 + a * .33 + j, .15 + c * .31, -.4 + b * .4 - j)); }
      const w = box(1.02, ny * .31 + .01, 1.22, wrap, 0, ny * .31 / 2, 0); w.castShadow = false; g.add(w); scene.add(g);
    }
    spot(scene, V(x + P / 2 + .6, 4.2, -4.4), V(x + P / 2, .3, -5.4), AMBER, 70, .45, .9, Math.abs(x) < 2, 12);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.8), floorGlow(AMBER, .22)); pool.rotation.x = -Math.PI / 2; pool.position.set(x + P / 2, .006, -5.4); pool.layers.set(1); scene.add(pool);
  }
  paint(scene, -24, -3.6, 40, -3.6, .1); paint(scene, -24, -7.2, 40, -7.2, .1);
  // racking at the back of the lane
  // high bays
  for (let x = -22; x <= 40; x += 4) for (const z of [-5, 0]) { spot(scene, V(x, 10, z), V(x, 0, z), 0xc9d6ff, 30, .5, .8, false, 18); const l = box(.6, .05, .25, M.glow(0xe2eaff, 6), x, 10, z); l.castShadow = false; scene.add(l); }
  // forklift: drives along the lane; a blue safety spot leads it on the floor
  const fk = new THREE.Group();
  const paintF = new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: .5, metalness: .3 });
  fk.add(slab(1.3, 1.0, .55, .12, paintF, .02)); fk.children[0].position.y = .25;
  const cw = slab(.5, 1.0, .6, .2, M.graphite(), .02); cw.position.set(-.6, .3, 0); fk.add(cw);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const wh = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .2, 24), M.rubber()); wh.rotation.x = Math.PI / 2; wh.position.set(sx * .45, .22, sz * .45); wh.castShadow = true; fk.add(wh); }
  for (const sz of [-.42, .42]) { fk.add(tube(V(-.35, .8, sz), V(-.35, 2.1, sz), .03, M.darkSteel())); fk.add(tube(V(.35, .8, sz), V(.3, 2.1, sz), .03, M.darkSteel())); }
  fk.add(box(.75, .04, .9, M.darkSteel(), 0, 2.12, 0));
  for (const sz of [-.3, .3]) fk.add(box(.08, 2.3, .1, M.darkSteel(), .72, 1.15, sz));
  for (const sz of [-.25, .25]) fk.add(box(1.0, .04, .1, M.steel(), 1.25, .08, sz));
  fk.add(box(.1, .9, .8, M.darkSteel(), .78, .5, 0));
  const seat = box(.4, .1, .45, M.rubber(), -.1, .85, 0); fk.add(seat);
  const beacon = box(.06, .06, .06, M.glow(BLUE, 6), -.3, 2.2, 0); fk.add(beacon);
  for (const sz of [-.5, .5]) { const st = box(.9, .015, .004, M.glow(BLUE, 3), 0, .5, sz); st.castShadow = false; fk.add(st); }
  const fr = new THREE.SpotLight(0xdfe8ff, 25, 8, .5, .8, 1.5); fr.position.set(-1.5, 3, -2.5); fr.target.position.set(0, .8, 0); fk.add(fr, fr.target);
  const bs = new THREE.SpotLight(BLUE, 90, 9, .16, .6, 1.4); bs.position.set(.2, 2.15, 0); bs.target.position.set(3.6, 0, 0); fk.add(bs, bs.target);
  fk.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(fk);
  const fk2 = fk.clone(); scene.add(fk2);
  const d = { tick() {} };
  const cam = new THREE.PerspectiveCamera(32, 4 / 3, .1, 120);
  return {
    scene, cam, cull: [-9, 20], loop: T, focus: 6.5, aperture: .05, maxR: 20, look: { exposure: 1.05, bloom: .6, sat: .8 },
    tick(t) {
      const u = t / T, x = u * P;
      cam.position.set(x - 7, 1.55, -3.1); cam.lookAt(x + 2, 1.0, -4.6);
      // forklifts drive the lane between dock and staging: 2 periods per loop, one every 3 periods
      const fx = u * 4 * P;   // moves 4 bays per loop; copies every 3 bays keep it seamless
      fk.position.set(fx - 6, 0, -1.8); fk2.position.set(fx - 6 - 3 * P, 0, -1.8);
      d.tick(t, T);
    },
  };
}

export const SCENES = { robotsA, robotsB, factory, warehouse };
