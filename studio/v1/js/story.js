// One continuous scroll film over the model hall: a trolley, its scans, its tag, its path, its wait.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const FS = `precision highp float;varying vec2 v;
uniform sampler2D tA,tB,tM;uniform vec2 res,span,tagPos,bayC;uniform vec3 cam;
uniform float draw,dash,amber,onlyQ,hidePaths,bay,tagOn,time,grey;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vec2(v.x,1.-v.y);
  vec2 iu=cam.xy+(uv-.5)*span/cam.z;
  vec3 A=texture2D(tA,iu).rgb,B=texture2D(tB,iu).rgb,M=texture2D(tM,iu).rgb;
  float onPath=step(.004,M.g)*M.r;
  float line=onPath*(1.-smoothstep(draw-.015,draw+.015,M.g))*(1.-hidePaths);
  float scans=onPath*(1.-smoothstep(.0,.035,abs(fract(M.g*5.+.5)-.5)))*dash*(1.-line);
  float am=step(.02,M.b)*amber*(onlyQ>.5?step(iu.x,.62):1.);
  float k=max(max(line,scans),am);
  vec3 col=mix(B,A,k);
  // the front of each drawing path glows
  float front=onPath*exp(-pow((M.g-draw)/.02,2.))*(1.-hidePaths)*step(.01,draw)*step(draw,1.02);
  col=mix(col,vec3(.35,.62,1.),front*.8);
  // one bay in colour
  vec2 bd=(iu-bayC)*vec2(.8,1.25);float bl=length(bd);
  float inBay=(1.-smoothstep(bay-.035,bay+.02,bl))*step(.001,bay);
  col=mix(col,A,inBay);
    // the tag, located
  vec2 tp=(tagPos-cam.xy)/span*cam.z+.5; vec2 dp=(uv-tp)*res; float dd=length(dp)/(res.y*.001);
  float pulse=fract(time*.55);
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(8.,9.5,dd)));
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(0.,2.,abs(dd-(12.+pulse*60.))))*(1.-pulse)*.6);
  // cooler, quieter grade for "before"
  float g=dot(col,vec3(.299,.587,.114));col=mix(col,mix(vec3(g),col,.2)*vec3(.97,.985,1.02),grey*(1.-k)*(1.-inBay)*.6);
  col*=mix(1.,.93,smoothstep(.45,1.15,length((uv-.5)*vec2(1.2,1.))));
  col+=(h(uv*res+time)-.5)*.016;
  gl_FragColor=vec4(col,1.);}`;

// chapters: [start, cam x, cam y, zoom, draw, dash, amber, onlyQ, hidePaths, bay, dot, grey]
const T = [0.481, 0.484];      // the tag on the lone trolley
const Q = [0.40, 0.80];      // inspection queue
const K = [
  { at: 0.00, cam: [0.60, 0.60, 1.05], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.12, cam: [0.52, 0.50, 1.12], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.20, cam: [0.40, 0.36, 1.30], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.28, cam: [0.40, 0.36, 1.30], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.36, cam: [0.60, 0.36, 1.18], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 1, grey: 1 },
  { at: 0.43, cam: [0.60, 0.36, 1.18], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 1, grey: 1 },
  { at: 0.52, cam: [0.50, 0.50, 1.00], draw: 1.03, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: .6, grey: 0 },
  { at: 0.60, cam: [0.50, 0.50, 1.00], draw: 1.03, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 },
  { at: 0.67, cam: [0.55, 0.72, 1.30], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 },
  { at: 0.74, cam: [0.55, 0.72, 1.30], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 },
  { at: 0.80, cam: [0.50, 0.70, 1.15], draw: 1.03, dash: 0, amber: 1, onlyQ: 1, hide: 1, bay: 0, dot: 0, grey: 1 },
  { at: 0.88, cam: [0.50, 0.70, 1.15], draw: 1.03, dash: 0, amber: 1, onlyQ: 1, hide: 1, bay: 0, dot: 0, grey: 1 },
  { at: 0.95, cam: [0.42, 0.72, 1.25], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 1, bay: .2, dot: 0, grey: 1 },
  { at: 1.00, cam: [0.42, 0.72, 1.25], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 1, bay: .2, dot: 0, grey: 1 },
];
function sample(p) {
  let i = 0; while (i < K.length - 2 && p > K[i + 1].at) i++;
  const a = K[i], b = K[i + 1], k = ease(clamp((p - a.at) / (b.at - a.at)));
  const o = {}; for (const key of Object.keys(a)) { if (key === 'at') continue; o[key] = Array.isArray(a[key]) ? a[key].map((x, j) => lerp(x, b[key][j], k)) : lerp(a[key], b[key], k); }
  // the paths draw on a linear clock inside their chapter so the front is visible
  if (p > .44 && p < .58) o.draw = (p - .44) / .14 * 1.03;
  return o;
}

export function story(section, canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['tA', 'tB', 'tM', 'res', 'span', 'tagPos', 'bayC', 'cam', 'draw', 'dash', 'amber', 'onlyQ', 'hidePaths', 'bay', 'tagOn', 'time', 'grey'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const px = Math.max(innerWidth, innerHeight * .8) * Math.min(devicePixelRatio, 2); const big = px > 1700 ? 2400 : px > 900 ? 1600 : 800;
  const tex = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); res(); }; im.src = src; });
  let ready = false;
  Promise.all([tex(`assets/scene/hall-after-${big}.webp`, 0), tex(`assets/scene/hall-before-${big}.webp`, 1), tex(`assets/scene/hall-masks-${big}.png`, 2)]).then(() => {
    gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); ready = true; canvas.classList.add('ready');
  });
  let span = [1, 1];
  const hud = section.querySelector('#storyHUD'), hctx = hud && hud.getContext('2d');
  const font = getComputedStyle(section).getPropertyValue("--text") || "Arial";
  const size = () => { const d = Math.min(devicePixelRatio, 1.75); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); const ra = canvas.width / canvas.height, ia = .8; span = ra > ia ? [1, ia / ra] : [ra / ia, 1]; if (hud) { hud.width = canvas.width; hud.height = canvas.height; } };
  size(); addEventListener('resize', size);

  const caps = [...section.querySelectorAll('.cap')], rail = section.querySelector('.rail b'), links = [...section.querySelectorAll('.rail a')];
  links.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const top = section.offsetTop + (section.offsetHeight - innerHeight) * +a.dataset.to; scrollTo({ top, behavior: 'smooth' }); }));
  const marks = caps.map((c) => [+c.dataset.from, +c.dataset.to]);
  let smooth = null, mx = 0, my = 0, qx = 0, qy = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  return (t) => {
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight));
    caps.forEach((c, i) => { const on = p >= marks[i][0] && p < marks[i][1]; c.classList.toggle('on', on); links[i] && links[i].classList.toggle('on', on); });
    rail.style.transform = innerWidth > 900 ? `scaleX(${p})` : `scaleY(${p})`;
    section.dispatchEvent(new CustomEvent('progress', { detail: p }));
    if (!ready) return;
    const s = sample(p);
    if (!smooth) smooth = s; else for (const k in s) smooth[k] = Array.isArray(s[k]) ? s[k].map((x, j) => lerp(smooth[k][j], x, .14)) : lerp(smooth[k], s[k], .14);
    const z = smooth.cam[2], hx = span[0] / z / 2, hy = span[1] / z / 2;
    qx = lerp(qx, mx, .05); qy = lerp(qy, my, .05);
    const cx = clamp(smooth.cam[0] + qx * .012 / z, hx, 1 - hx), cy = clamp(smooth.cam[1] + qy * .012 / z, hy, 1 - hy);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]);
    gl.uniform3f(U.cam, cx, cy, z); gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .40, .80);
    gl.uniform1f(U.draw, smooth.draw); gl.uniform1f(U.dash, smooth.dash); gl.uniform1f(U.amber, smooth.amber); gl.uniform1f(U.onlyQ, smooth.onlyQ > .5 ? 1 : 0);
    gl.uniform1f(U.hidePaths, smooth.hide); gl.uniform1f(U.bay, smooth.bay); gl.uniform1f(U.tagOn, smooth.dot); gl.uniform1f(U.grey, smooth.grey); gl.uniform1f(U.time, t * .001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (hctx) drawHUD(hctx, p, t * .001, cx, cy, z, span);
  };
}

/* ---------- the story layer: no words, only light, shape and motion ---------- */
const TAGIMG = new Image(); TAGIMG.decoding = 'async'; TAGIMG.src = 'assets/home/amigo-side-1500.webp';
const INK = '11,18,56', BLUE = '31,107,255', AMB = '255,176,32';
const WALK = [[.97, .99], [.86, .9], [.93, .76], [.8, .67], [.64, .56], [.71, .44], [.6, .39], [.5, .43], [.33, .37], [.26, .45], [.12, .5], [.17, .64], [.07, .72]];
const LOOK = [[.8, .67, 3], [.6, .39, 6], [.26, .45, 9], [.17, .64, 11]];
const GATES = [[.262, .124], [.316, .394]];
const ANCH = [[.44, .07], [.875, .235], [.222, .075]];
const WAITS = [[.269, .891, .82], [.42, .825, .64], [.546, .762, .6], [.854, .603, .38]];
const fade = (p, a, b, f = .025) => clamp((p - a) / f) * clamp((b - p) / f);
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
function walkAt(k) { const n = WALK.length - 1, u = clamp(k) * n, i = Math.min(n - 1, Math.floor(u)), f = u - i; return [lerp(WALK[i][0], WALK[i + 1][0], f), lerp(WALK[i][1], WALK[i + 1][1], f), Math.atan2(WALK[i + 1][1] - WALK[i][1], WALK[i + 1][0] - WALK[i][0])]; }
function floorRing(x, X, Y, r, s) { x.beginPath(); x.ellipse(X, Y, r * s, r * .62 * s, -.5, 0, 7); }
function brackets(x, X, Y, r, len, s) {
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const cx = X + dx * r, cy = Y + dy * r; x.beginPath(); x.moveTo(cx - dx * len * s * 0, cy - dy * len * s); x.lineTo(cx, cy); x.lineTo(cx - dx * len * s, cy); x.stroke(); }
}
function drawHUD(x, p, t, cx, cy, z, span) {
  const W = x.canvas.width, H = x.canvas.height, s = Math.min(Math.max(H / 760, .8), 2.2) * (W < 700 ? .9 : 1);
  const P = (u, v) => [((u - cx) * z / span[0] + .5) * W, ((v - cy) * z / span[1] + .5) * H];
  x.clearRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round';

  // 1. the search: footsteps wander, the person looks around, time keeps turning
  let a = fade(p, -.1, .19);
  if (a > 0) {
    const k = clamp(p / .155);
    for (let i = 0, N = 70; i < N; i++) {
      const q = i / N; if (q > k) break; const [u, v, ang] = walkAt(q); const [X, Y] = P(u, v); const side = i % 2 ? 1 : -1;
      const age = clamp(1 - (k - q) * 1.6); x.save(); x.globalAlpha = a * (.12 + .5 * age); x.translate(X + Math.cos(ang + 1.57) * side * 3.2 * s, Y + Math.sin(ang + 1.57) * side * 3.2 * s); x.rotate(ang);
      x.fillStyle = `rgb(${INK})`; x.beginPath(); x.ellipse(0, 0, 3.4 * s, 1.7 * s, 0, 0, 7); x.fill(); x.restore();
    }
    LOOK.forEach(([u, v, at]) => { const kk = k * (WALK.length - 1) - at; if (kk < 0) return; const [X, Y] = P(u, v); x.save(); x.globalAlpha = a * clamp(1 - kk * .35) * .7; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.2 * s; x.setLineDash([2 * s, 5 * s]); x.lineDashOffset = t * 8; floorRing(x, X, Y, 22 + eo(kk) * 26, s); x.stroke(); x.restore(); });
    const [u, v, ang] = walkAt(k); const [X, Y] = P(u, v);
    x.save(); x.globalAlpha = a;
    const look = ang + Math.sin(t * 1.7) * .9; const g = x.createRadialGradient(X, Y, 0, X, Y, 90 * s); g.addColorStop(0, `rgba(${INK},.16)`); g.addColorStop(1, `rgba(${INK},0)`);
    x.fillStyle = g; x.beginPath(); x.moveTo(X, Y); x.arc(X, Y, 90 * s, look - .42, look + .42); x.closePath(); x.fill();
    x.shadowColor = 'rgba(11,18,56,.35)'; x.shadowBlur = 10 * s; x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(X, Y, 6.5 * s, 0, 7); x.fill(); x.shadowColor = 'transparent';
    // time turning: a thin ring fills as the search drags on
    const R = 17 * s; x.strokeStyle = `rgba(${INK},.14)`; x.lineWidth = 2.2 * s; x.beginPath(); x.arc(X, Y, R, 0, 7); x.stroke();
    x.strokeStyle = `rgba(${INK},.8)`; x.beginPath(); x.arc(X, Y, R, -1.57, -1.57 + 6.283 * (.08 + k * .9)); x.stroke();
    x.restore();
  }

  // 2. scans: two checkpoints flash, the trace between them is sure, after the last one it breaks up, and the trolley could be anywhere
  a = fade(p, .18, .33);
  if (a > 0) {
    const G = GATES.map(([u, v]) => P(u, v)), [TX, TY] = P(.481, .484);
    x.save(); x.globalAlpha = a;
    const k1 = eo((p - .2) / .03);
    if (k1 > 0) { x.strokeStyle = `rgba(${INK},.6)`; x.lineWidth = 2.2 * s; x.beginPath(); x.moveTo(G[0][0], G[0][1]); x.lineTo(lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)); x.stroke(); }
    const k2 = eo((p - .232) / .035);
    if (k2 > 0) { const N = 14; for (let i = 0; i < N * k2; i++) { const q = i / N, X = lerp(G[1][0], TX, q * .72), Y = lerp(G[1][1], TY, q * .72); x.fillStyle = `rgba(${INK},${.55 * (1 - q)})`; x.beginPath(); x.arc(X, Y, 2 * s * (1 - q * .6), 0, 7); x.fill(); } }
    G.forEach(([X, Y], i) => {
      const k = clamp((p - .195 - i * .03) / .03);
      // a checkpoint: two posts and a beam
      x.fillStyle = `rgb(${INK})`; for (const d of [-1, 1]) { x.beginPath(); x.roundRect(X + d * 15 * s - 2 * s, Y - 22 * s, 4 * s, 22 * s, 2 * s); x.fill(); }
      x.strokeStyle = k > 0 && k < 1 ? `rgba(${BLUE},${1 - k * .6})` : `rgba(${INK},.35)`; x.lineWidth = 1.6 * s; x.beginPath(); x.moveTo(X - 15 * s, Y - 14 * s); x.lineTo(X + 15 * s, Y - 14 * s); x.stroke();
      if (k > 0 && k < 1) { x.globalAlpha = a * (1 - k); x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.4 * s; floorRing(x, X, Y, 10 + k * 64, s); x.stroke(); x.globalAlpha = a; }
      if (k >= 1) { x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(X, Y + 6 * s, 3.4 * s, 0, 7); x.fill(); }
    });
    x.restore();
    // out of sight: fog where it really is, and doubt in three places
    const kf = clamp((p - .25) / .04);
    if (kf > 0) {
      x.save(); x.globalAlpha = a * kf;
      const g = x.createRadialGradient(TX, TY, 0, TX, TY, 120 * s); g.addColorStop(0, 'rgba(243,242,238,.8)'); g.addColorStop(.6, 'rgba(243,242,238,.4)'); g.addColorStop(1, 'rgba(243,242,238,0)'); x.fillStyle = g; x.fillRect(TX - 130 * s, TY - 130 * s, 260 * s, 260 * s);
      [[.481, .484], [.6, .39], [.3, .6]].forEach(([u, v], i) => {
        const [X, Y] = P(u, v), ph = (t * .45 + i / 3) % 1, br = Math.sin(ph * 3.1416);
        x.globalAlpha = a * kf * (.4 + .6 * br); x.strokeStyle = `rgba(${INK},.85)`; x.lineWidth = 2 * s; x.setLineDash([3 * s, 6 * s]); x.lineDashOffset = -t * 10;
        floorRing(x, X, Y, 26 + br * 8, s); x.stroke();
      });
      x.restore();
    }
  }

  // 3. the tag: anchors listen, signal travels, the fix closes in
  a = fade(p, .33, .47);
  if (a > 0) {
    const [TX, TY] = P(.481, .484), lock = eo((p - .37) / .05);
    ANCH.forEach(([u, v], i) => {
      const [X, Y] = P(u, v), on = eo((p - .34 - i * .008) / .02); x.save(); x.globalAlpha = a * on;
      x.strokeStyle = `rgba(${BLUE},.35)`; x.lineWidth = 1.2 * s; x.beginPath(); x.moveTo(X, Y); x.lineTo(lerp(X, TX, on), lerp(Y, TY, on)); x.stroke();
      for (let j = 0; j < 3; j++) { const f = (t * .9 + j / 3 + i * .17) % 1; x.fillStyle = `rgba(${BLUE},${.9 * Math.sin(f * 3.14)})`; x.beginPath(); x.arc(lerp(TX, X, f), lerp(TY, Y, f), 2.6 * s, 0, 7); x.fill(); }
      const ph = (t * .7 + i * .33) % 1; x.strokeStyle = `rgba(${BLUE},${.55 * (1 - ph)})`; x.beginPath(); x.arc(X, Y, (7 + ph * 30) * s, 0, 7); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 6 * s, 0, 7); x.fill(); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.4 * s; x.stroke();
      x.restore();
    });
    x.save(); x.globalAlpha = a * clamp((p - .36) / .02); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s;
    brackets(x, TX, TY, (70 - lock * 46) * s, 10, s);
    x.globalAlpha *= lock; const ph = (t * .6) % 1; x.strokeStyle = `rgba(${BLUE},${.5 * (1 - ph)})`; x.beginPath(); x.arc(TX, TY, (10 + ph * 40) * s, 0, 7); x.stroke();
    x.restore();
  }

  // 3b. a loupe opens over the trolley and shows the real tag riding on it
  a = fade(p, .385, .47);
  if (a > 0 && TAGIMG.complete && TAGIMG.naturalWidth) {
    const [TX, TY] = P(.481, .484), k = eo((p - .385) / .03), R = Math.min(W, H) * .17 * k;
    const R0 = Math.min(W, H) * .17, LX = clamp(TX + (W < 700 ? -1 : 1) * Math.min(W * .26, 230 * s), R0 + 14 * s, W - R0 - 14 * s), LY = clamp(TY - Math.min(H * .24, 200 * s), R0 + 14 * s, H);
    x.save(); x.globalAlpha = a;
    x.strokeStyle = `rgba(${BLUE},.55)`; x.lineWidth = 1.4 * s; x.beginPath(); x.moveTo(TX, TY); x.lineTo(lerp(TX, LX, k), lerp(TY, LY, k)); x.stroke();
    x.shadowColor = 'rgba(11,18,56,.22)'; x.shadowBlur = 30 * s; x.shadowOffsetY = 10 * s; x.fillStyle = '#fff'; x.beginPath(); x.arc(LX, LY, R + 5 * s, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.save(); x.beginPath(); x.arc(LX, LY, R, 0, 7); x.clip();
    const iw = R * 2.5, ih = iw * TAGIMG.naturalHeight / TAGIMG.naturalWidth, dr = (1 - k) * 12 * s + Math.sin(t * .8) * 2 * s;
    x.fillStyle = '#f4f7fc'; x.fillRect(LX - R, LY - R, R * 2, R * 2); x.drawImage(TAGIMG, LX - iw / 2, LY - ih * .48 + dr, iw, ih); x.restore();
    x.strokeStyle = `rgba(${BLUE},.9)`; x.lineWidth = 2 * s; x.beginPath(); x.arc(LX, LY, R + 5 * s, 0, 7); x.stroke();
    const pp = (t * .5) % 1; x.strokeStyle = `rgba(${BLUE},${.35 * (1 - pp)})`; x.beginPath(); x.arc(LX, LY, R + 5 * s + pp * 24 * s, 0, 7); x.stroke();
    x.restore();
  }

  // 4. paths: a pin settles where the tag stopped
  a = fade(p, .47, .63);
  if (a > 0) {
    const [X, Y] = P(.481, .484), k = clamp((p - .5) / .03), drop = 1 - eo(k), land = clamp((p - .53) / .03);
    x.save(); x.globalAlpha = a * k;
    x.fillStyle = `rgba(${INK},${.18 * (1 - drop)})`; floorRing(x, X, Y, 9 - drop * 4, s); x.fill();
    if (land > 0 && land < 1) { x.strokeStyle = `rgba(${BLUE},${.7 * (1 - land)})`; x.lineWidth = 1.6 * s; floorRing(x, X, Y, 10 + land * 40, s); x.stroke(); }
    const py = Y - drop * 60 * s - 4 * s; x.fillStyle = `rgb(${BLUE})`; x.shadowColor = 'rgba(31,107,255,.45)'; x.shadowBlur = 14 * s;
    x.beginPath(); x.moveTo(X, py); x.bezierCurveTo(X - 12 * s, py - 14 * s, X - 12 * s, py - 32 * s, X, py - 32 * s); x.bezierCurveTo(X + 12 * s, py - 32 * s, X + 12 * s, py - 14 * s, X, py); x.fill();
    x.shadowColor = 'transparent'; x.fillStyle = '#fff'; x.beginPath(); x.arc(X, py - 22 * s, 4 * s, 0, 7); x.fill();
    x.restore();
  }

  // 6a. the question dims the floor; only the answers stay lit
  a = fade(p, .775, .905, .03);
  if (a > 0) {
    x.save(); x.globalAlpha = a; x.fillStyle = 'rgba(232,238,248,.72)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'destination-out';
    WAITS.slice(0, 3).forEach(([u, v]) => { const [X, Y] = P(u, v), R = 110 * s; const g = x.createRadialGradient(X, Y - 10 * s, 0, X, Y - 10 * s, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(X - R, Y - R - 10 * s, R * 2, R * 2); });
    x.restore();
  }
  // 5. waits: an amber dial grows around every waiting trolley
  a = fade(p, .62, .9);
  WAITS.forEach(([u, v, w], i) => {
    const k = eo((p - .63 - i * .012) / .04); if (a * k <= 0) return; const [X, Y] = P(u, v); const R = 30 * s, ask = p > .77 ? (i < 3 ? 1 : .25) : 1;
    x.save(); x.translate(X, Y - 46 * s); x.globalAlpha = a * k * ask;
    x.fillStyle = 'rgba(255,255,255,.9)'; x.shadowColor = 'rgba(11,18,56,.16)'; x.shadowBlur = 16 * s; x.shadowOffsetY = 4 * s; x.beginPath(); x.arc(0, 0, R + 7 * s, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.strokeStyle = `rgba(${AMB},.22)`; x.lineWidth = 5 * s; x.beginPath(); x.arc(0, 0, R, 0, 7); x.stroke();
    const sweep = 6.283 * (w * k + ((t * .004) % .02)); x.strokeStyle = `rgb(${AMB})`; x.beginPath(); x.arc(0, 0, R, -1.57, -1.57 + sweep); x.stroke();
    x.fillStyle = `rgb(${AMB})`; x.beginPath(); x.arc(Math.cos(-1.57 + sweep) * R, Math.sin(-1.57 + sweep) * R, 4.2 * s, 0, 7); x.fill();
    x.fillStyle = `rgba(${AMB},${.35 + .25 * Math.sin(t * 2 + i)})`; x.beginPath(); x.arc(0, 0, 7 * s, 0, 7); x.fill();
    x.restore();
  });

  // 6. ask: the answer draws itself around the three that match
  a = fade(p, .77, .91);
  if (a > 0) {
    WAITS.slice(0, 3).forEach(([u, v], i) => { const [X, Y] = P(u, v), k = eo((p - .795 - i * .014) / .03); if (k <= 0) return; x.save(); x.globalAlpha = a;
      x.strokeStyle = `rgba(${AMB},.28)`; x.lineWidth = 9 * s; x.beginPath(); x.ellipse(X, Y, 58 * s, 36 * s, -.5, -2.2, -2.2 + 6.283 * k); x.stroke();
      x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.8 * s; x.beginPath(); x.ellipse(X, Y, 58 * s, 36 * s, -.5, -2.2, -2.2 + 6.283 * k); x.stroke(); x.restore(); });
  }

  // 7. one bay: corner marks settle around the bay, a soft blue edge breathes
  a = fade(p, .9, 1.2);
  if (a > 0) { const [X, Y] = P(.40, .80), k = eo((p - .925) / .04), rx = (.2 / .8) * z / span[0] * W, ry = (.2 / 1.25) * z / span[1] * H;
    x.save(); x.globalAlpha = a * k; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.6 * s; const e = (1 - k) * 40 * s, L = 26 * s;
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const cx = X + dx * (rx + e), cy = Y + dy * (ry + e); x.beginPath(); x.moveTo(cx, cy - dy * L); x.lineTo(cx, cy); x.lineTo(cx - dx * L, cy); x.stroke(); }
    x.globalAlpha = a * k * (.35 + .2 * Math.sin(t * 1.6)); x.lineWidth = 1.2 * s; x.setLineDash([2 * s, 8 * s]); x.strokeRect(X - rx, Y - ry, rx * 2, ry * 2); x.restore(); }
}
