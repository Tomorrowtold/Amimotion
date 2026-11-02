// The landing: the hero's tag drops onto its own trolley in the plant, and the hero becomes the film.
// The plant rises out of focus under the tag, the tag falls to the exact pixels of the AmIGo rendered on that
// trolley's deck, the frame folds into the film's panel, the paths arrive, the lock closes. Then the film takes over
// on the same frame (story.js opens on this exact camera).
import { VS, FS, T, LAND_Z, plateSize, LOCK } from './story.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const io = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const TAG_W = 17 / 2400; // the rendered tag's width, as a share of the plate's width

export function bridge({ descent, hero, copy, stage, canvas, lock, story, panel, sticky, fallback }) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['vr', 'tA', 'tB', 'tM', 'res', 'span', 'tagPos', 'bayC', 'cam', 'draw', 'dash', 'amber', 'onlyQ', 'hidePaths', 'bay', 'tagOn', 'time', 'grey'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const big = plateSize();
  const tex = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); res(); }; im.src = src; });
  let ready = false;
  Promise.all([tex(`assets/scene/hall-after-${big}.webp`, 0), tex(`assets/scene/hall-before-${big}.webp`, 1), tex(`assets/scene/hall-masks-${big}.png`, 2)]).then(() => {
    gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); ready = true;
  });

  // the runway: the hero holds still for D pixels of scroll, then the film is already pinned in its place
  let D = 0, topY = 0;
  const layout = () => {
    D = Math.round(innerHeight * 1.15);
    topY = descent.getBoundingClientRect().top + scrollY;
    hero.style.top = `${Math.max(0, topY)}px`;
    descent.style.height = `${hero.offsetHeight + D}px`;
    story.style.marginTop = `${-(topY + hero.offsetHeight)}px`;
    const d = Math.min(devicePixelRatio, 1.75); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d;
  };
  layout(); addEventListener('resize', layout);
  if (document.fonts) document.fonts.ready.then(layout);

  const corners = [...lock.children], shade = stage.querySelector('.tag-shadow');
  let last = -1;
  return (t) => {
    const y = scrollY, d = clamp((y - topY + Math.max(0, topY)) / D);
    story.classList.toggle('pre', y < D - .5);
    if (y > D + innerHeight) { if (last !== 2) { canvas.style.visibility = 'hidden'; last = 2; } globalThis.__bridge = null; return; }
    const on = d > 0;
    if (!on) {
      if (last !== 0) { canvas.style.visibility = 'hidden'; lock.style.opacity = 0; copy.style.transform = ''; copy.style.opacity = ''; hero.style.setProperty('--glow', 1); if (fallback) fallback.style.opacity = ''; if (shade) shade.style.opacity = ''; last = 0; }
      globalThis.__bridge = null; return;
    }
    last = 1;

    // the words lift away first
    const kc = sm(0, .32, d);
    copy.style.transform = `translate3d(0,${-kc * 22}vh,0)`; copy.style.opacity = 1 - kc;
    if (fallback && !fallback.classList.contains('gone')) fallback.style.opacity = 1 - sm(.1, .5, d);
    if (shade) shade.style.opacity = 1 - sm(0, .2, d);

    // frames, in the canvas's own CSS pixels
    const cr = canvas.getBoundingClientRect(), pr = panel.getBoundingClientRect(), st = sticky.getBoundingClientRect().top;
    const cw = cr.width, ch = cr.height;
    const R1 = [pr.left - cr.left, pr.top - st - cr.top, pr.width, pr.height];
    const kR = io(sm(.3, .9, d));
    const R = [lerp(0, R1[0], kR), lerp(0, R1[1], kR), lerp(cw, R1[2], kR), lerp(ch, R1[3], kR)];
    const rad = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 24;
    canvas.style.visibility = ready ? 'visible' : 'hidden';
    canvas.style.clipPath = `inset(${R[1]}px ${cw - R[0] - R[2]}px ${ch - R[1] - R[3]}px ${R[0]}px round ${rad * kR}px)`;
    canvas.style.opacity = sm(.04, .3, d);
    const blur = (1 - sm(.12, .64, d)) * 14; canvas.style.filter = blur > .2 ? `blur(${blur.toFixed(1)}px)` : '';
    hero.style.setProperty('--glow', 1 - kR);

    // where the tag is on screen: from where the hero put it to the middle of the film's panel
    const tf = globalThis.__tagFrame || { fx: innerWidth > 900 ? .69 : .5, fy: .5 };
    const kS = io(sm(.12, .86, d));
    const S = [lerp(tf.fx * cw, R[0] + R[2] / 2, kS), lerp(tf.fy * ch, R[1] + R[3] / 2, kS)];

    // the camera on the plate keeps the rendered tag right under the hero's tag
    const z = Math.exp(lerp(Math.log(5.5), Math.log(LAND_Z()), io(sm(.06, .88, d))));
    const ra = R[2] / R[3], sp = ra > .8 ? [1, .8 / ra] : [ra / .8, 1];
    const pu = [(S[0] - R[0]) / R[2], (S[1] - R[1]) / R[3]];
    const cam = [T[0] - (pu[0] - .5) * sp[0] / z, T[1] - (pu[1] - .5) * sp[1] / z];
    // the same mapping, written for a canvas that fills the hero
    const span = [sp[0] * cw / R[2], sp[1] * ch / R[3]];
    const camE = [cam[0] + ((cw / 2 - R[0]) / R[2] - .5) * sp[0] / z, cam[1] + ((ch / 2 - R[1]) / R[3] - .5) * sp[1] / z];
    if (ready) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform4f(U.vr, R[0] / cw, R[1] / ch, R[2] / cw, R[3] / ch);
      gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]); gl.uniform3f(U.cam, camE[0], camE[1], z);
      gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .4, .8);
      gl.uniform1f(U.draw, sm(.5, .86, d) * 1.03); gl.uniform1f(U.amber, sm(.84, .97, d)); gl.uniform1f(U.grey, 0);
      gl.uniform1f(U.dash, 0); gl.uniform1f(U.onlyQ, 0); gl.uniform1f(U.hidePaths, 0); gl.uniform1f(U.bay, 0); gl.uniform1f(U.tagOn, 0); gl.uniform1f(U.time, t * .001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // the hero's tag falls to the size of the rendered tag on the deck, then hands over to it
    const platePx = TAG_W * z * R[2] / sp[0];
    globalThis.__bridge = { d, sx: S[0] / cw, sy: S[1] / ch, px: platePx, k: io(sm(.08, .84, d)), fade: 1 - sm(.82, .9, d), floor: 1 - sm(0, .22, d) };

    // the lock closes on the tag: the same four corners the film keeps for a beat
    const kl = sm(.84, .95, d), r = LOCK.r * (1 + (1 - io(kl)) * 2.2);
    lock.style.opacity = sm(.84, .9, d);
    lock.style.transform = `translate3d(${S[0]}px,${S[1]}px,0)`;
    corners.forEach((c, i) => { const dx = i % 3 ? 1 : -1, dy = i < 2 ? -1 : 1; c.style.transform = `translate3d(${dx * r}px,${dy * r}px,0)`; });
    void t;
  };
}
