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
// Seven equal chapters for the visitor. Inside each, the picture plays out over the first 75%, then holds while they read.
const OLD = [0, .17, .32, .45, .62, .76, .9, 1.0001];
export const REST = OLD.slice(0, 7).map((_, i) => (i + .82) / 7);
function remap(p) { const i = Math.min(6, Math.floor(p * 7)), u = clamp((p * 7 - i) / .75); return lerp(OLD[i], OLD[i] + (OLD[i + 1] - OLD[i]) * .86, u); }
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

  // the question's thread: a fine line from the words to the three answers on the floor
  const sticky = section.querySelector('.story-sticky'), qEl = section.querySelector('.q-big');
  const NS = 'http://www.w3.org/2000/svg', thread = document.createElementNS(NS, 'svg'); thread.setAttribute('class', 'q-thread'); thread.setAttribute('aria-hidden', 'true');
  const tps = [0, 1, 2].map(() => { const g = document.createElementNS(NS, 'path'); g.setAttribute('pathLength', '1'); thread.appendChild(g); return g; });
  const tds = [0, 1, 2].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '4'); thread.appendChild(c); return c; });
  sticky.appendChild(thread);
  const caps = [...section.querySelectorAll('.cap')], rail = section.querySelector('.rail b'), links = [...section.querySelectorAll('.rail a')];
  links.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const top = section.offsetTop + (section.offsetHeight - innerHeight) * REST[links.indexOf(a)]; scrollTo({ top, behavior: 'smooth' }); }));
  const marks = caps.map((c, i) => [i / 7, i === 6 ? 1.01 : (i + 1) / 7]);
  let smooth = null, mx = 0, my = 0, qx = 0, qy = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  return (t) => {
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight)), po = remap(p);
    caps.forEach((c, i) => { const on = p >= marks[i][0] && p < marks[i][1]; c.classList.toggle('on', on); links[i] && links[i].classList.toggle('on', on); });
    rail.style.transform = innerWidth > 900 ? `scaleX(${p})` : `scaleY(${p})`;
    section.dispatchEvent(new CustomEvent('progress', { detail: p }));
    if (!ready) return;
    const s = sample(po);
    if (!smooth) smooth = s; else for (const k in s) smooth[k] = Array.isArray(s[k]) ? s[k].map((x, j) => lerp(smooth[k][j], x, .14)) : lerp(smooth[k], s[k], .14);
    const z = smooth.cam[2], hx = span[0] / z / 2, hy = span[1] / z / 2;
    qx = lerp(qx, mx, .05); qy = lerp(qy, my, .05);
    const cx = clamp(smooth.cam[0] + qx * .012 / z, hx, 1 - hx), cy = clamp(smooth.cam[1] + qy * .012 / z, hy, 1 - hy);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]);
    gl.uniform3f(U.cam, cx, cy, z); gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .40, .80);
    gl.uniform1f(U.draw, smooth.draw); gl.uniform1f(U.dash, smooth.dash); gl.uniform1f(U.amber, smooth.amber); gl.uniform1f(U.onlyQ, smooth.onlyQ > .5 ? 1 : 0);
    gl.uniform1f(U.hidePaths, smooth.hide); gl.uniform1f(U.bay, smooth.bay); gl.uniform1f(U.tagOn, smooth.dot); gl.uniform1f(U.grey, smooth.grey); gl.uniform1f(U.time, t * .001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (hctx) drawHUD(hctx, po, t * .001, cx, cy, z, span);
    const ta = clamp((po - .8) / .02) * clamp((.902 - po) / .015);
    if (ta <= 0 || !qEl) thread.style.opacity = 0; else {
      const k = eo((po - .805) / .035), cr = canvas.getBoundingClientRect(), sr = sticky.getBoundingClientRect(), sc = cr.width / canvas.width, desk = innerWidth > 900;
      const Pc = (u, v) => [((u - cx) * z / span[0] + .5) * canvas.width * sc + cr.left - sr.left, ((v - cy) * z / span[1] + .5) * canvas.height * sc + cr.top - sr.top];
      const q = qEl.getBoundingClientRect(), sx = desk ? q.right - sr.left + 18 : q.left - sr.left + Math.min(q.width * .5, 160), sy = desk ? q.top - sr.top + q.height * .45 : q.top - sr.top - 14;
      WAITS.slice(0, 3).forEach(([u, v], i) => {
        const [ex, ey] = Pc(u, v), mx = desk ? sx + (ex - sx) * .55 : sx, my = desk ? sy : sy + (ey - sy) * .5;
        tps[i].setAttribute('d', `M ${sx} ${sy} C ${mx} ${my}, ${ex - (desk ? 60 : 0)} ${ey + (desk ? 0 : 60)}, ${ex} ${ey}`);
        const ki = clamp(k * 1.25 - i * .12); tps[i].style.strokeDashoffset = 1 - ki; tds[i].setAttribute('cx', ex); tds[i].setAttribute('cy', ey); tds[i].style.opacity = ki > .98 ? 1 : 0;
      });
      thread.style.opacity = ta;
    }
  };
}

/* ---------- the story layer: no words, only light, shape and motion ---------- */
const TAGIMG = new Image(); TAGIMG.decoding = 'async'; TAGIMG.src = 'assets/hw/amigo-34.webp';
const MOIMG = new Image(); MOIMG.decoding = 'async'; MOIMG.src = 'assets/hw/amimo-34.webp';
const RED = '255,59,78', INDIGO = '75,61,240';
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
function clockChip(x, X, Y, R, ang, s, a) {
  x.save(); x.globalAlpha = a; x.fillStyle = 'rgba(255,255,255,.94)'; x.shadowColor = 'rgba(11,18,56,.18)'; x.shadowBlur = 14 * s; x.shadowOffsetY = 3 * s; x.beginPath(); x.arc(X, Y, R, 0, 7); x.fill(); x.shadowColor = 'transparent';
  x.strokeStyle = 'rgba(11,18,56,.12)'; x.lineWidth = 1 * s; x.stroke();
  x.strokeStyle = 'rgb(11,18,56)'; x.lineWidth = 1.8 * s; x.lineCap = 'round'; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + Math.sin(ang / 12) * R * .42, Y - Math.cos(ang / 12) * R * .42); x.moveTo(X, Y); x.lineTo(X + Math.sin(ang) * R * .66, Y - Math.cos(ang) * R * .66); x.stroke();
  x.fillStyle = 'rgb(11,18,56)'; x.beginPath(); x.arc(X, Y, 1.8 * s, 0, 7); x.fill(); x.restore();
}
function drawHUD(x, p, t, cx, cy, z, span) {
  const W = x.canvas.width, H = x.canvas.height, s = Math.min(Math.max(H / 760, .8), 2.2) * (W < 700 ? .9 : 1);
  const P = (u, v) => [((u - cx) * z / span[0] + .5) * W, ((v - cy) * z / span[1] + .5) * H];
  x.clearRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round';

  // 1. the search: one dotted walk wanders the floor, glancing here and there, while the clock turns
  let a = fade(p, -.1, .19);
  if (a > 0) {
    const k = clamp(p / .155), N = 160;
    x.save(); x.globalAlpha = a; x.strokeStyle = `rgba(${INK},.55)`; x.lineWidth = 1.8 * s; x.setLineDash([1, 7 * s]); x.beginPath();
    for (let i = 0; i <= N * k; i++) { const [u, v] = walkAt(i / N); const [X, Y] = P(u, v); i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); x.setLineDash([]);
    LOOK.forEach(([u, v, at]) => { const kk = k * (WALK.length - 1) - at; if (kk < 0) return; const [X, Y] = P(u, v); x.globalAlpha = a * clamp(1 - kk * .4) * .55; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.2 * s; floorRing(x, X, Y, 16 + eo(kk) * 26, s); x.stroke(); });
    const [u, v] = walkAt(k), [X, Y] = P(u, v); x.globalAlpha = a;
    x.fillStyle = '#fff'; x.shadowColor = 'rgba(11,18,56,.3)'; x.shadowBlur = 10 * s; x.beginPath(); x.arc(X, Y, 9 * s, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(X, Y, 5 * s, 0, 7); x.fill();
    x.restore();
    clockChip(x, 40 * s, 40 * s, 20 * s, k * 6.283 * 3, s, a);
  }

  // 2. scans: two checkpoints, each stamps a moment. Between them the line is sure; after the last, it fades out.
  a = fade(p, .18, .33);
  if (a > 0) {
    const G = GATES.map(([u, v]) => P(u, v)), [TX, TY] = P(.481, .484);
    x.save(); x.globalAlpha = a;
    const k1 = eo((p - .225) / .03);
    if (k1 > 0) { x.strokeStyle = `rgba(${INK},.7)`; x.lineWidth = 2 * s; x.beginPath(); x.moveTo(G[0][0], G[0][1]); x.lineTo(lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)); x.stroke(); }
    const k2 = eo((p - .255) / .035);
    if (k2 > 0) { const N = 14; for (let i = 0; i < N * k2; i++) { const q = i / N, X = lerp(G[1][0], TX, q * .85), Y = lerp(G[1][1], TY, q * .85); x.fillStyle = `rgba(${INK},${.6 * (1 - q)})`; x.beginPath(); x.arc(X, Y, 1.8 * s, 0, 7); x.fill(); } }
    // where it really is: a soft haze, and one quiet ring of doubt
    const kf = clamp((p - .27) / .03);
    if (kf > 0) { const g = x.createRadialGradient(TX, TY, 0, TX, TY, 90 * s); g.addColorStop(0, `rgba(240,246,255,${.85 * kf})`); g.addColorStop(1, 'rgba(240,246,255,0)'); x.fillStyle = g; x.fillRect(TX - 90 * s, TY - 90 * s, 180 * s, 180 * s);
      x.strokeStyle = `rgba(${INK},${.45 * kf})`; x.lineWidth = 1.4 * s; x.setLineDash([3 * s, 6 * s]); x.lineDashOffset = -t * 8; floorRing(x, TX, TY, 30 + Math.sin(t * 1.4) * 3, s); x.stroke(); x.setLineDash([]); }
    G.forEach(([X, Y], i) => {
      const k = clamp((p - .195 - i * .03) / .03);
      x.fillStyle = `rgb(${INK})`; for (const d of [-1, 1]) { x.beginPath(); x.roundRect(X + d * 14 * s - 2 * s, Y - 22 * s, 4 * s, 22 * s, 2 * s); x.fill(); }
      x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.beginPath(); x.moveTo(X - 14 * s, Y - 14 * s); x.lineTo(X + 14 * s, Y - 14 * s); x.stroke();
      if (k > 0 && k < 1) { x.globalAlpha = a * (1 - k); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.6 * s; floorRing(x, X, Y, 10 + k * 60, s); x.stroke(); x.globalAlpha = a; }
      const c = eo((p - .205 - i * .03) / .02); if (c > 0) clockChip(x, X + 30 * s, Y - 40 * s, 15 * s * c, i ? 2.4 : .7, s, a);
    });
    x.restore();
    // the shift, on one line: two moments seen, the rest unseen
    const kt = eo((p - .19) / .03);
    if (kt > 0) {
      const bw = Math.min(W * .6, 520 * s), bx = (W - bw) / 2, by = H - 40 * s, bh = 6 * s;
      x.save(); x.globalAlpha = a * kt;
      x.fillStyle = 'rgba(255,255,255,.92)'; x.shadowColor = 'rgba(11,18,56,.16)'; x.shadowBlur = 18 * s; x.beginPath(); x.roundRect(bx - 20 * s, by - 17 * s, bw + 40 * s, bh + 34 * s, 20 * s); x.fill(); x.shadowColor = 'transparent';
      x.fillStyle = 'rgba(11,18,56,.08)'; x.beginPath(); x.roundRect(bx, by, bw, bh, bh / 2); x.fill();
      const head = clamp((p - .19) / .1);
      [.2, .45].forEach((m) => { if (head < m) return; const mx = bx + bw * m; x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.arc(mx, by + bh / 2, 5 * s, 0, 7); x.fill(); });
      x.strokeStyle = `rgba(${INK},.35)`; x.lineWidth = 1.2 * s; x.setLineDash([2 * s, 4 * s]); x.beginPath(); x.moveTo(bx + bw * .45 + 8 * s, by + bh / 2); x.lineTo(bx + bw * Math.max(.45, head), by + bh / 2); x.stroke(); x.setLineDash([]);
      x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(bx + bw * head, by + bh / 2, 4 * s, 0, 7); x.fill();
      x.restore();
    }
  }

  // 3. the tag and the anchors: the tag pulses, each pulse travels to the anchors, each anchor answers. Then the tag is found.
  a = fade(p, .33, .47);
  if (a > 0) {
    const [TX, TY] = P(.481, .484), lock = eo((p - .39) / .04), AP = ANCH.map(([u, v]) => P(u, v));
    x.save(); x.globalAlpha = a;
    for (let j = 0; j < 2; j++) { const ph = (t * .45 + j / 2) % 1; x.strokeStyle = `rgba(${INDIGO},${.45 * (1 - ph)})`; x.lineWidth = 1.4 * s; floorRing(x, TX, TY, 10 + ph * 46, s); x.stroke(); }
    AP.forEach(([X, Y], i) => {
      const on = eo((p - .34 - i * .012) / .025); if (on <= 0) return;
      const gr = x.createLinearGradient(TX, TY, X, Y); gr.addColorStop(0, `rgba(${INDIGO},.45)`); gr.addColorStop(1, `rgba(${BLUE},.45)`);
      x.strokeStyle = gr; x.lineWidth = 1.2 * s; x.beginPath(); x.moveTo(TX, TY); x.lineTo(lerp(TX, X, on), lerp(TY, Y, on)); x.stroke();
      const f = (t * .5 + i * .22) % 1, px = lerp(TX, X, f), py = lerp(TY, Y, f), al = Math.sin(f * 3.1416);
      const g = x.createRadialGradient(px, py, 0, px, py, 10 * s); g.addColorStop(0, `rgba(${INDIGO},${al})`); g.addColorStop(1, `rgba(${INDIGO},0)`); x.fillStyle = g; x.beginPath(); x.arc(px, py, 10 * s, 0, 7); x.fill();
      const hit = Math.max(0, 1 - Math.abs(f - .97) * 14);
      if (hit > 0) { x.strokeStyle = `rgba(${BLUE},${.6 * hit})`; x.lineWidth = 1.4 * s; x.beginPath(); x.arc(X, Y, (10 + (1 - hit) * 16) * s, 0, 7); x.stroke(); }
      x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 7 * s, 0, 7); x.fill(); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.6 * s; x.stroke();
    });
    x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.globalAlpha = a * lock; brackets(x, TX, TY, (60 - lock * 36) * s, 9, s);
    x.globalAlpha = a; x.fillStyle = `rgb(${INDIGO})`; x.beginPath(); x.arc(TX, TY, 5.5 * s, 0, 7); x.fill();
    x.restore();
  }

  // 3b. two small white cards name the parts in pictures: the tag on the trolley, the anchor on the column
  a = fade(p, .36, .449, .012);
  if (a > 0) {
    const k = eo((p - .36) / .03), [TX, TY] = P(.481, .484), [AX, AY] = P(...ANCH[1]);
    const card = (img, OX, OY, CX, CY, w, col) => {
      if (!img.complete || !img.naturalWidth) return;
      const h = w * img.naturalHeight / img.naturalWidth, pad = 12 * s, X = CX - w / 2 - pad, Y = CY - h / 2 - pad, CW = w + pad * 2, CH = h + pad * 2;
      x.save(); x.globalAlpha = a * k;
      x.strokeStyle = `rgba(${col},.45)`; x.lineWidth = 1.2 * s; x.setLineDash([2 * s, 4 * s]); x.beginPath(); x.moveTo(OX, OY); x.lineTo(CX, CY); x.stroke(); x.setLineDash([]);
      x.translate(0, (1 - k) * 10 * s);
      x.fillStyle = 'rgba(255,255,255,.96)'; x.shadowColor = 'rgba(11,18,56,.2)'; x.shadowBlur = 24 * s; x.shadowOffsetY = 8 * s; x.beginPath(); x.roundRect(X, Y, CW, CH, 16 * s); x.fill(); x.shadowColor = 'transparent';
      x.fillStyle = `rgb(${col})`; x.beginPath(); x.roundRect(X + 14 * s, Y + CH - 3 * s, CW - 28 * s, 3 * s, 2 * s); x.fill();
      x.drawImage(img, CX - w / 2, CY - h / 2 + Math.sin(t * .9) * 1.5 * s, w, h);
      x.restore();
    };
    const w0 = Math.min(W * .17, 150 * s);
    card(TAGIMG, TX, TY, clamp(TX - Math.min(W * .2, 190 * s), w0, W - w0), clamp(TY + Math.min(H * .17, 140 * s), w0, H - w0 * .8), w0, INDIGO);
    card(MOIMG, AX, AY, clamp(AX - Math.min(W * .14, 120 * s), w0, W - w0), clamp(AY + Math.min(H * .2, 170 * s), w0, H - w0), w0 * .82, BLUE);
  }

  // 4. paths: a red pin settles where the tag stopped. Stopping is the problem.
  a = fade(p, .47, .66);
  if (a > 0) {
    const [X, Y] = P(.481, .484), k = clamp((p - .5) / .03), drop = 1 - eo(k), land = clamp((p - .53) / .03), fadeOut = 1 - clamp((p - .62) / .04) * .7;
    x.save(); x.globalAlpha = a * k * fadeOut;
    x.fillStyle = `rgba(${RED},${.22 * (1 - drop)})`; floorRing(x, X, Y, 10 - drop * 4, s); x.fill();
    if (land > 0) { for (let j = 0; j < 2; j++) { const ph = ((t * .45 + j / 2) % 1); x.strokeStyle = `rgba(${RED},${.55 * (1 - ph) * land})`; x.lineWidth = 1.6 * s; floorRing(x, X, Y, 10 + ph * 46, s); x.stroke(); } }
    const py = Y - drop * 60 * s - 4 * s; x.fillStyle = `rgb(${RED})`; x.shadowColor = `rgba(${RED},.45)`; x.shadowBlur = 16 * s;
    x.beginPath(); x.moveTo(X, py); x.bezierCurveTo(X - 13 * s, py - 15 * s, X - 13 * s, py - 34 * s, X, py - 34 * s); x.bezierCurveTo(X + 13 * s, py - 34 * s, X + 13 * s, py - 15 * s, X, py); x.fill();
    x.shadowColor = 'transparent'; x.fillStyle = '#fff'; x.beginPath(); x.arc(X, py - 23 * s, 4.2 * s, 0, 7); x.fill();
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
    const rk = clamp(k * 1.4), cr = Math.round(lerp(255, 255, rk)), cg = Math.round(lerp(59, 176, rk)), cb = Math.round(lerp(78, 32, rk)); x.fillStyle = `rgba(${cr},${cg},${cb},${.55 + .25 * Math.sin(t * 2 + i)})`; x.beginPath(); x.arc(0, 0, 7 * s, 0, 7); x.fill();
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
