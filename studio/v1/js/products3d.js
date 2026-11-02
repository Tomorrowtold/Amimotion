// The three parts, live from the founders' CAD. The tag stands on the same lit slab as the hero.
// When the anchor comes in, the tag steps aside and its pulse travels to the anchor, again and again: the system, not a catalogue.
// When AmIHub comes in, the hardware falls back out of focus behind the live map.
import * as THREE from '../assets/vendor/three.module.min.js';
import { mesh, studioEnv, GROUND_VS, GROUND_FS } from './tag.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

// one radio pulse along the floor: rings that leave the tag and arrive at the anchor
const RING_VS = `varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const RING_FS = `precision highp float;varying vec2 vP;uniform float r,a;
void main(){float d=length(vP);float w=exp(-pow((d-r)/1.6,2.));float h=exp(-pow((d-r)/7.,2.))*.25;
gl_FragColor=vec4(vec3(.12,.42,1.),(w+h)*a);}`;
const BEAM_VS = `attribute float u;varying float vU;void main(){vU=u;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const BEAM_FS = `precision highp float;varying float vU;uniform float head,a;
void main(){float trail=smoothstep(head-.35,head,vU)*step(vU,head);float dots=step(.5,fract(vU*46.));
gl_FragColor=vec4(vec3(.12,.42,1.),(trail*.9+.18*dots)*a);}`;

export async function mount(stage, kn) {
  const canvas = document.createElement('canvas'); canvas.className = 'kn-gl'; canvas.setAttribute('aria-hidden', 'true');
  stage.insertBefore(canvas, stage.querySelector('.kn-shot'));
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  const [gTop, gBot, gBody, gCap] = await Promise.all(['top_cover', 'bottom_cover', 'anc_body', 'anc_cap'].map((n) => mesh(n, meta)));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
  const cam = new THREE.PerspectiveCamera(22, 1, 10, 6000);
  const shell = (c, r) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, metalness: 0, clearcoat: .22, clearcoatRoughness: .32 });

  // AmIGo, as in the hero: its lid up, the amimotion name on top
  const tagIn = new THREE.Group(); tagIn.add(new THREE.Mesh(gTop, shell(0x3a3c40, .46)), new THREE.Mesh(gBot, shell(0x2c2d31, .52)));
  const tagMid = new THREE.Group(); tagMid.add(tagIn); tagMid.rotation.x = Math.PI / 2;
  // AmIMo, lying on its flanged plate: the plate (cap) down, the body up
  const ancIn = new THREE.Group(); ancIn.add(new THREE.Mesh(gBody, shell(0x2f3237, .5)), new THREE.Mesh(gCap, shell(0x3a3e44, .46)));
  const ancMid = new THREE.Group(); ancMid.add(ancIn); ancMid.rotation.x = Math.PI;
  const seat = (mid) => { const b = new THREE.Box3().setFromObject(mid), c = b.getCenter(new THREE.Vector3()); mid.position.set(-c.x, -b.min.y, -c.z); const g = new THREE.Group(); g.add(mid); return g; };
  const amigo = seat(tagMid), amimo = seat(ancMid);
  [amigo, amimo].forEach((g) => { g.traverse((o) => { if (o.isMesh) { o.castShadow = true; } }); scene.add(g); });

  // the slab, lit from the roof, and a soft shadow catcher on it
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.ShaderMaterial({ vertexShader: GROUND_VS, fragmentShader: GROUND_FS, transparent: true, depthWrite: false,
    uniforms: { t: { value: 0 }, fadeAll: { value: .95 }, leftFade: { value: 0 }, farR: { value: 760 }, res: { value: new THREE.Vector2(1, 1) }, lightC: { value: new THREE.Vector3(0, 0, 160) } } }));
  ground.rotation.x = -Math.PI / 2; ground.renderOrder = -2; scene.add(ground);
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.ShadowMaterial({ color: 0x0b1238, opacity: .22 }));
  catcher.rotation.x = -Math.PI / 2; catcher.position.y = .05; catcher.receiveShadow = true; scene.add(catcher);
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-160, 420, 200); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 9; key.shadow.blurSamples = 16; Object.assign(key.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 50, far: 1200 }); key.shadow.bias = -.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fa6ff, 1.6); rim.position.set(260, 90, -280); scene.add(rim);

  // the pulse: rings on the floor around the tag, and a fine thread of light to the anchor
  const ringMat = new THREE.ShaderMaterial({ vertexShader: RING_VS, fragmentShader: RING_FS, transparent: true, depthWrite: false, uniforms: { r: { value: 0 }, a: { value: 0 } } });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = .3; scene.add(ring);
  const beamMat = new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS, transparent: true, depthWrite: false, uniforms: { head: { value: 0 }, a: { value: 0 } } });
  const beamGeo = new THREE.BufferGeometry(); const N = 90; beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((N + 1) * 6), 3)); beamGeo.setAttribute('u', new THREE.Float32BufferAttribute(new Float32Array((N + 1) * 2), 1));
  const bi = []; for (let i = 0; i < N; i++) { const a = i * 2; bi.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } beamGeo.setIndex(bi);
  const beam = new THREE.Mesh(beamGeo, beamMat); beam.frustumCulled = false; scene.add(beam);
  const P0 = new THREE.Vector3(), P1 = new THREE.Vector3(), Q = new THREE.Vector3(), camDir = new THREE.Vector3(), side = new THREE.Vector3(), tang = new THREE.Vector3();
  const setBeam = (a, b, lift) => {
    const pos = beamGeo.attributes.position.array, us = beamGeo.attributes.u.array; cam.getWorldDirection(camDir);
    for (let i = 0; i <= N; i++) {
      const k = i / N; Q.lerpVectors(a, b, k); Q.y += Math.sin(k * Math.PI) * lift;
      tang.subVectors(b, a); tang.y += Math.cos(k * Math.PI) * Math.PI * lift; tang.normalize(); side.crossVectors(tang, camDir).normalize().multiplyScalar(.9);
      pos.set([Q.x - side.x, Q.y - side.y, Q.z - side.z, Q.x + side.x, Q.y + side.y, Q.z + side.z], i * 6); us[i * 2] = us[i * 2 + 1] = k;
    }
    beamGeo.attributes.position.needsUpdate = true; beamGeo.attributes.u.needsUpdate = true;
  };

  const size = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); ground.material.uniforms.res.value.set(canvas.width, canvas.height); };
  size(); addEventListener('resize', size);
  let on = false, px = 0, py = 0, tx = 0, ty = 0;
  stage.addEventListener('pointermove', (e) => { const r = stage.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; }, { passive: true });
  stage.addEventListener('pointerleave', () => { tx = ty = 0; });
  new IntersectionObserver((es) => { const was = on; on = es[0].isIntersecting; if (on && !was) requestAnimationFrame(loop); }, { rootMargin: '200px 0px' }).observe(stage);

  // state: the product on stage, eased in time (not scroll), so each one arrives like a cut in a film
  const S = { s1: 0, s2: 0 }; let t0 = performance.now(), last = t0, lastBox = '';
  const step = () => { const items = kn.querySelectorAll('.kn-item'); for (let i = 0; i < items.length; i++) if (items[i].classList.contains('on')) return i; return -1; };
  kn.classList.add('kn-3d');
  function loop(now) {
    if (!on) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now; const t = (now - t0) / 1000;
    const b = canvas.clientWidth + 'x' + canvas.clientHeight; if (b !== lastBox) { lastBox = b; size(); }
    const st = step(), r = kn.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - innerHeight));
    const g1 = st >= 1 ? 1 : 0, g2 = st >= 2 ? 1 : 0;
    S.s1 += (g1 - S.s1) * (1 - Math.exp(-dt * 3.2)); S.s2 += (g2 - S.s2) * (1 - Math.exp(-dt * 3.2));
    const e1 = ease(S.s1), e2 = ease(S.s2);
    px = lerp(px, tx, .05); py = lerp(py, ty, .05);
    const phone = innerWidth < 900;

    // AmIGo: alone at the centre, turning with the scroll; then it steps forward-left to make room
    amigo.position.set(lerp(0, -74, e1), 0, lerp(0, 46, e1));
    amigo.rotation.y = .62 + p * 1.6 + Math.sin(t * .35) * .05 + px * .5;
    amigo.scale.setScalar(lerp(1.18, .86, e1));
    // AmIMo: comes down onto the slab behind-right, as if set down by a hand
    const drop = 1 - e1; amimo.visible = S.s1 > .002;
    amimo.position.set(76, drop * 160, lerp(-110, -40, e1));
    amimo.rotation.y = 1.6 + (1 - e1) * .6 + p * .8 + px * .4; amimo.scale.setScalar(lerp(.9, .98, e1));

    // the pulse, every 1.8 s, once both are on the slab
    const pc = (t % 1.8) / 1.8, pa = clamp((S.s1 - .7) / .3) * (1 - e2 * .6);
    ring.position.set(amigo.position.x, .3, amigo.position.z); ringMat.uniforms.r.value = 20 + pc * 150; ringMat.uniforms.a.value = pa * (1 - pc) * .8;
    amigo.updateMatrixWorld(true); amimo.updateMatrixWorld(true);
    P0.set(amigo.position.x, 26 * amigo.scale.x, amigo.position.z); P1.set(amimo.position.x, 34 * amimo.scale.x, amimo.position.z);
    beamMat.uniforms.head.value = ease(clamp(pc * 1.6)) * 1.05; beamMat.uniforms.a.value = pa * (1 - clamp((pc - .7) / .3));

    // camera: a slow orbit; it pulls back for two, and lifts for AmIHub, where the hardware rests out of focus
    const fitW = Math.max(1, 1 / cam.aspect); const d = lerp(lerp(560, 860, e1) * Math.max(1, fitW * .95), 900, e2);
    const az = .1 + px * .12 + p * .12, el = lerp(.5, .78, e2) - py * .06;
    cam.position.set(Math.sin(az) * d * Math.cos(el), Math.sin(el) * d + 10, Math.cos(az) * d * Math.cos(el));
    cam.lookAt(lerp(0, 0, e1), lerp(14, 16, e1), lerp(0, 2, e1));
    setBeam(P0, P1, 46);
    ground.material.uniforms.t.value = t; ground.material.uniforms.lightC.value.set(lerp(0, 0, e1), lerp(0, -10, e1), lerp(170, 300, e1));
    canvas.style.filter = e2 > .02 ? `blur(${(e2 * 7).toFixed(1)}px) saturate(${1 - e2 * .3})` : '';
    canvas.style.opacity = (1 - e2 * .35).toFixed(3);
    renderer.render(scene, cam);
    canvas.classList.add('ready');
    requestAnimationFrame(loop);
  }
}
