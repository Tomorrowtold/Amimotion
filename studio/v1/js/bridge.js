// The landing. The hero's tag falls onto its own trolley in the plant: the plant comes up out of focus,
// the tag drops faster and faster, hits the exact AmIGo rendered on that trolley's deck, the focus snaps, the lock closes.
// Then one wave of light runs out from that tag across the whole floor: every path, every wait and every other tag
// lights up as it passes, while the camera pulls back to the whole plant and the frame folds into the film's panel.
// The film opens on that exact frame (story.js S0) and only then lets the colour drain.
import { VS, FS, T, LAND_Z, WIDE, plateSize, MOVERS, moverDist, drawLanding } from './story.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const io = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const TAG_W = 17 / 2400;          // the rendered tag's width, as a share of the plate's width
const SNAP = /[?&]still\b/.test(location.search);
const IMPACT = .4, WAVE = [.4, .86], PULL = [.44, .94];

export function bridge({ descent, hero, copy, stage, canvas, hudEl, story, panel, sticky, fallback }) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['vr', 'tA', 'tB', 'tM', 'res', 'span', 'tagPos', 'bayC', 'waveC', 'cam', 'draw', 'dash', 'amber', 'onlyQ', 'hidePaths', 'bay', 'tagOn', 'time', 'grey', 'wave'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const big = plateSize();
  const tex = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); res(); }; im.src = src; });
  let ready = false;
  Promise.all([tex(`assets/scene/hall-after-${big}.webp`, 0), tex(`assets/scene/hall-before-${big}.webp`, 1), tex(`assets/scene/hall-masks-${big}.png`, 2)]).then(() => {
    gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); ready = true;
  });
  const hx = hudEl.getContext('2d');
  const dist = MOVERS.map(moverDist);

  // the runway: the hero holds still for D pixels of scroll; then the film is already pinned in its place
  let D = 0, topY = 0, dpr = 1;
  const layout = () => {
    D = Math.round(innerHeight * 1.1);
    topY = descent.getBoundingClientRect().top + scrollY;
    hero.style.top = `${Math.max(0, topY)}px`;
    descent.style.height = `${hero.offsetHeight + D}px`;
    story.style.marginTop = `${-(topY + hero.offsetHeight)}px`;
    dpr = Math.min(devicePixelRatio, 1.75);
    canvas.width = hudEl.width = canvas.clientWidth * dpr; canvas.height = hudEl.height = canvas.clientHeight * dpr;
  };
  layout(); addEventListener('resize', layout);
  if (document.fonts) document.fonts.ready.then(layout);

  const shade = stage.querySelector('.tag-shadow');
  let last = -1, dS = 0;
  return (t) => {
    const y = scrollY, d = clamp((y - topY + Math.max(0, topY)) / D);
    story.classList.toggle('pre', y < D - .5);
    if (y > D + innerHeight) { story.classList.remove('pre-on'); if (last !== 2) { canvas.style.visibility = hudEl.style.visibility = 'hidden'; last = 2; } dS = 1; globalThis.__bridge = null; return; }
    // the scroll, smoothed: the fall and the wave move like film, not in steps
    dS = Math.abs(d - dS) < .0005 || SNAP ? d : lerp(dS, d, .16);
    const e = dS;
    if (e <= 0) {
      if (last !== 0) { canvas.style.visibility = hudEl.style.visibility = 'hidden'; copy.style.transform = ''; copy.style.opacity = ''; hero.style.setProperty('--glow', 1); if (fallback) fallback.style.opacity = ''; if (shade) shade.style.opacity = ''; sticky.style.setProperty('--pre', 0); story.classList.remove('pre-on'); last = 0; }
      globalThis.__bridge = null; return;
    }
    last = 1;

    // the words lift away first
    const kc = sm(0, .1, e);
    copy.style.transform = `translate3d(0,${-kc * 18}vh,0)`; copy.style.opacity = 1 - kc;
    if (fallback && !fallback.classList.contains('gone')) fallback.style.opacity = 1 - sm(.1, .4, e);
    if (shade) shade.style.opacity = 1 - sm(0, .15, e);

    // frames, in the canvas's own CSS pixels
    const cr = canvas.getBoundingClientRect(), pr = panel.getBoundingClientRect(), st = sticky.getBoundingClientRect().top;
    const cw = cr.width, ch = cr.height;
    const R1 = [pr.left - cr.left, pr.top - st - cr.top, pr.width, pr.height];
    const kR = sm(PULL[0], PULL[1], e);
    const R = [lerp(0, R1[0], kR), lerp(0, R1[1], kR), lerp(cw, R1[2], kR), lerp(ch, R1[3], kR)];
    const rad = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 24;
    canvas.style.visibility = hudEl.style.visibility = ready ? 'visible' : 'hidden';
    const clip = `inset(${R[1]}px ${cw - R[0] - R[2]}px ${ch - R[1] - R[3]}px ${R[0]}px round ${rad * kR}px)`;
    canvas.style.clipPath = clip; hudEl.style.clipPath = clip;
    canvas.style.opacity = sm(.08, .2, e);
    // focus: soft while it falls, a snap into focus at the moment it lands
    const blur = e < IMPACT ? lerp(10, 0, sm(.08, IMPACT - .06, e)) : 0;
    canvas.style.filter = blur > .2 ? `blur(${blur.toFixed(1)}px)` : '';
    hero.style.setProperty('--glow', 1 - sm(.1, .5, e));
    // the story's first words rise in while the frame is still folding into its panel: no empty beat between hero and film
    sticky.style.setProperty('--pre', sm(.82, .95, e).toFixed(3)); sticky.style.setProperty('--preY', Math.max(0, D - y).toFixed(1)); story.classList.toggle('pre-on', e > .8);

    // the camera on the plate: during the fall the rendered tag stays under the falling one; then the pull back to the whole plant
    const tf = globalThis.__tagFrame || { fx: innerWidth > 900 ? .69 : .5, fy: .5 };
    const zFall = Math.exp(lerp(Math.log(5.5), Math.log(LAND_Z()), io(sm(.04, IMPACT, e))));
    const kP = sm(PULL[0], PULL[1], e);
    const z = Math.exp(lerp(Math.log(zFall), Math.log(WIDE[2]), kP));
    const ra = R[2] / R[3], sp = ra > .8 ? [1, .8 / ra] : [ra / .8, 1];
    const aEnd = [(T[0] - WIDE[0]) * WIDE[2] / sp[0] + .5, (T[1] - WIDE[1]) * WIDE[2] / sp[1] + .5];
    const a = [lerp(tf.fx, aEnd[0], kP), lerp(tf.fy, aEnd[1], kP)];
    // the impact: a short, small shake of the whole frame
    const ti = e - IMPACT, shake = ti > 0 && ti < .08 ? Math.exp(-ti * 55) * Math.sin(ti * 260) * 3.2 : 0;
    const cam = [T[0] - (a[0] - .5) * sp[0] / z, T[1] - (a[1] - .5) * sp[1] / z - shake / (R[3] * z / sp[1])];
    const span = [sp[0] * cw / R[2], sp[1] * ch / R[3]];
    const camE = [cam[0] + ((cw / 2 - R[0]) / R[2] - .5) * sp[0] / z, cam[1] + ((ch / 2 - R[1]) / R[3] - .5) * sp[1] / z];
    const wave = 1.35 * io(sm(WAVE[0], WAVE[1], e));
    if (ready) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform4f(U.vr, R[0] / cw, R[1] / ch, R[2] / cw, R[3] / ch);
      gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]); gl.uniform3f(U.cam, camE[0], camE[1], z);
      gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .4, .8); gl.uniform2f(U.waveC, T[0], T[1]); gl.uniform1f(U.wave, wave);
      gl.uniform1f(U.draw, 0); gl.uniform1f(U.amber, 0); gl.uniform1f(U.grey, 0);
      gl.uniform1f(U.dash, 0); gl.uniform1f(U.onlyQ, 0); gl.uniform1f(U.hidePaths, 0); gl.uniform1f(U.bay, 0); gl.uniform1f(U.tagOn, 0); gl.uniform1f(U.time, t * .001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // where the trolley's tag is on screen, in CSS pixels
    const S = [R[0] + a[0] * R[2], R[1] + a[1] * R[3] + shake];
    const platePx = TAG_W * z * R[2] / sp[0];
    // the falling tag: it shrinks slowly, then faster and faster, like something dropping away from you
    globalThis.__bridge = { d: e, sx: S[0] / cw, sy: S[1] / ch, px: platePx, k: Math.pow(sm(.03, IMPACT, e), 2.1), fade: 1 - sm(IMPACT, IMPACT + .06, e), floor: 1 - sm(0, .06, e) };

    // the lock and the located tags, drawn exactly as the film draws them
    hx.clearRect(0, 0, hudEl.width, hudEl.height);
    const P = (u, v) => [(R[0] + ((u - cam[0]) * z / sp[0] + .5) * R[2]) * dpr, (R[1] + ((v - cam[1]) * z / sp[1] + .5) * R[3]) * dpr];
    const kl = io(sm(IMPACT, IMPACT + .07, e));
    drawLanding(hx, P, dpr, (i) => i === 0 ? clamp((e - IMPACT) / .12) : clamp((wave - dist[i]) / .1), sm(IMPACT, IMPACT + .03, e), (1 - kl) * 1.6 + (z - WIDE[2]) * .7);
  };
}
