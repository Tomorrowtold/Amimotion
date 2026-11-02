// The AmIGo tag, live, from the founders' CAD (top and bottom covers, quantised).
import * as THREE from '../assets/vendor/three.module.min.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;

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

function studioEnv(renderer) {
  const s = new THREE.Scene(); s.background = new THREE.Color(0xdfe9f8);
  const box = (w, h, pos, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: 2 })); m.position.copy(pos); m.lookAt(0, 0, 0); s.add(m); };
  box(7, 7, new THREE.Vector3(0, 9, 1), 0xffffff);
  box(1.4, 10, new THREE.Vector3(-8, 2, 3), 0xcfe0ff);
  box(1.4, 10, new THREE.Vector3(8, 2, -2), 0xfff6ea);
  box(16, 3, new THREE.Vector3(0, -2, -9), 0x8fa6c8);
  box(16, 3, new THREE.Vector3(0, -3, 9), 0xf0f6ff);
  const pm = new THREE.PMREMGenerator(renderer); const t = pm.fromScene(s, 0.03).texture; pm.dispose(); return t;
}

export async function init(canvas, fallback, hero) {
  const meta = await (await fetch('assets/cad/mesh.json')).json();
  await document.fonts.load('600 190px "AmI Display"');
  const [gTop, gBot] = await Promise.all([mesh('top_cover', meta), mesh('bottom_cover', meta)]);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
  const cam = new THREE.PerspectiveCamera(20, 1, 10, 3000);

    const shell = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: .42, metalness: 0, clearcoat: .3, clearcoatRoughness: .45 });
  const topMat = shell(0x4e5258), botMat = shell(0x3b3e43);
  const top = new THREE.Group(), bot = new THREE.Group();
  top.add(new THREE.Mesh(gTop, topMat)); bot.add(new THREE.Mesh(gBot, botMat));
    // the CAD carries its own embossed wordmark; no decal needed
  const inner = new THREE.Group(); inner.add(top, bot); inner.position.set(-61.77, -65.98, 1.0);
  const mid = new THREE.Group(); mid.add(inner); mid.rotation.x = Math.PI / 2;
  const tag = new THREE.Group(); tag.add(mid); scene.add(tag);

  // a soft located glow under the tag, like the blue on the floor
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(31,107,255,.55)'); g.addColorStop(.45, "rgba(31,107,255,.10)"); g.addColorStop(1, 'rgba(31,107,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = -16; scene.add(glow);
  const shadowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(11,18,56,.38)'); g.addColorStop(.6, 'rgba(11,18,56,.06)'); g.addColorStop(1, 'rgba(11,18,56,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -15.5; scene.add(shadow);

  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-200, 260, 120); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fb8ff, 2.2); rim.position.set(220, 80, -240); scene.add(rim);

  const size = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  size(); addEventListener('resize', size);

  let px = 0, py = 0, tx = 0, ty = 0, on = true, t0 = performance.now(), lift = 0;
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) requestAnimationFrame(loop); }).observe(hero);

  function loop(now) {
    if (!on) return;
    const t = (now - t0) / 1000;
    const r = hero.getBoundingClientRect(); const sp = clamp(-r.top / r.height);
    px = lerp(px, tx, .06); py = lerp(py, ty, .06);
    const intro = 1 - Math.exp(-3.2 * t) * Math.cos(5.5 * t); // spring in
    lift = lerp(lift, sp * 26, .12);
    tag.position.y = lerp(60, 0, clamp(intro)) + Math.sin(t * 1.1) * 2.2 + sp * 10;
    tag.rotation.y = 0.98 + Math.sin(t * .35) * .18 + px * .9 + sp * 1.4;
    tag.rotation.x = py * .35 - sp * .25;
    tag.rotation.z = Math.sin(t * .5) * .03;
    top.position.z = -lift; // covers part as you scroll
    glow.material.opacity = .6 + Math.sin(t * 1.6) * .25 + sp * .4;
    shadow.material.opacity = clamp(1 - (tag.position.y - 0) / 70) * (1 - sp * .4);
    const d = innerWidth < 900 ? 380 : 330;
    cam.position.set(Math.sin(.15) * d, d * .62, Math.cos(.15) * d); cam.lookAt(0, -2, 0);
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame((n) => { loop(n); canvas.classList.add('ready'); fallback.classList.add('gone'); });
}
