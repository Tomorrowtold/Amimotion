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
const TAGIMG = new Image(); TAGIMG.decoding = 'async'; TAGIMG.src = 'assets/hw/amigo-dark-600.webp';
const MOIMG = new Image(); MOIMG.decoding = 'async'; MOIMG.src = 'assets/hw/amimo-dark-600.webp';
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

  // 2. scans: the floor goes dark except at two checkpoints. Each scan stamps a time. Between and after, time runs on unseen.
  a = fade(p, .18, .33);
  if (a > 0) {
    const G = GATES.map(([u, v]) => P(u, v)), [TX, TY] = P(.481, .484), kd = eo((p - .185) / .02);
    // dark everywhere you cannot see, light where a scanner stands
    x.save(); x.globalAlpha = a * kd; x.fillStyle = 'rgba(16,22,52,.58)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'destination-out';
    G.forEach(([X, Y], i) => { const on = eo((p - .195 - i * .03) / .02), R = 150 * s * on; if (R <= 0) return; const g = x.createRadialGradient(X, Y - 8 * s, 0, X, Y - 8 * s, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(X - R, Y - R - 8 * s, R * 2, R * 2); });
    x.restore();
    x.save(); x.globalAlpha = a;
    // the sure stretch between the two scans
    const k1 = eo((p - .225) / .03);
    if (k1 > 0) { x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 2.4 * s; x.beginPath(); x.moveTo(G[0][0], G[0][1]); x.lineTo(lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)); x.stroke(); }
    // after the last scan: the trail breaks up in the dark
    const k2 = eo((p - .255) / .035);
    if (k2 > 0) { const N = 16; for (let i = 0; i < N * k2; i++) { const q = i / N, X = lerp(G[1][0], TX, q * .8), Y = lerp(G[1][1], TY, q * .8); x.fillStyle = `rgba(255,255,255,${.85 * (1 - q)})`; x.beginPath(); x.arc(X, Y, 2.2 * s * (1 - q * .6), 0, 7); x.fill(); } }
    G.forEach(([X, Y], i) => {
      const k = clamp((p - .195 - i * .03) / .03);
      // a checkpoint gate: two posts and a beam that flashes on the scan
      x.fillStyle = '#fff'; for (const d of [-1, 1]) { x.beginPath(); x.roundRect(X + d * 16 * s - 2.5 * s, Y - 26 * s, 5 * s, 26 * s, 2.5 * s); x.fill(); }
      const flash = k > 0 && k < 1 ? 1 - k : 0;
      x.strokeStyle = `rgba(${BLUE},${.35 + flash * .65})`; x.lineWidth = (1.6 + flash * 2) * s; x.beginPath(); x.moveTo(X - 16 * s, Y - 16 * s); x.lineTo(X + 16 * s, Y - 16 * s); x.stroke();
      if (flash) { x.globalAlpha = a * flash; x.strokeStyle = '#fff'; x.lineWidth = 1.6 * s; floorRing(x, X, Y, 10 + k * 70, s); x.stroke(); x.globalAlpha = a; }
      // the time stamp: a small clock pops above the gate, hands set to the moment of the scan
      const c = eo((p - .205 - i * .03) / .02);
      if (c > 0) { const CX = X + 34 * s, CY = Y - 52 * s, R = 20 * s * c; x.fillStyle = '#fff'; x.shadowColor = 'rgba(11,18,56,.3)'; x.shadowBlur = 12 * s; x.beginPath(); x.arc(CX, CY, R, 0, 7); x.fill(); x.shadowColor = 'transparent';
        x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.8 * s; const h = i ? 1.2 : -0.6, m = i ? 2.6 : 0.6; x.beginPath(); x.moveTo(CX, CY); x.lineTo(CX + Math.sin(h) * R * .45, CY - Math.cos(h) * R * .45); x.moveTo(CX, CY); x.lineTo(CX + Math.sin(m) * R * .7, CY - Math.cos(m) * R * .7); x.stroke(); }
    });
    // doubt: where could it be now?
    const kf = clamp((p - .27) / .03);
    if (kf > 0) [[.481, .484], [.6, .39], [.3, .6]].forEach(([u, v], i) => {
      const [X, Y] = P(u, v), ph = (t * .45 + i / 3) % 1, br = Math.sin(ph * 3.1416);
      x.globalAlpha = a * kf * (.35 + .65 * br); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 1.8 * s; x.setLineDash([3 * s, 6 * s]); x.lineDashOffset = -t * 10; floorRing(x, X, Y, 26 + br * 8, s); x.stroke(); x.setLineDash([]);
    });
    x.restore();
    // the clock of the shift: seen at two moments, unseen the rest of the time
    const kt = eo((p - .19) / .03);
    if (kt > 0) {
      const bw = Math.min(W * .72, 620 * s), bx = (W - bw) / 2, by = H - 46 * s, bh = 10 * s;
      x.save(); x.globalAlpha = a * kt;
      x.fillStyle = 'rgba(255,255,255,.9)'; x.shadowColor = 'rgba(11,18,56,.25)'; x.shadowBlur = 20 * s; x.beginPath(); x.roundRect(bx - 18 * s, by - 20 * s, bw + 36 * s, bh + 40 * s, 22 * s); x.fill(); x.shadowColor = 'transparent';
      // unseen time: hatched
      x.save(); x.beginPath(); x.roundRect(bx, by, bw, bh, bh / 2); x.clip(); x.fillStyle = 'rgba(28,34,62,.14)'; x.fillRect(bx, by, bw, bh);
      x.strokeStyle = 'rgba(28,34,62,.22)'; x.lineWidth = 1.4 * s; for (let hx = bx - bh; hx < bx + bw; hx += 6 * s) { x.beginPath(); x.moveTo(hx, by + bh); x.lineTo(hx + bh, by); x.stroke(); } x.restore();
      // the two scans: moments of light
      const marks = [.18, .42], head = clamp((p - .19) / .1) * .98;
      marks.forEach((m, i) => { if (head < m) return; const mx = bx + bw * m; x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.roundRect(mx - 3 * s, by - 3 * s, 6 * s, bh + 6 * s, 3 * s); x.fill(); x.strokeStyle = `rgba(${BLUE},.4)`; x.lineWidth = 1.2 * s; x.beginPath(); x.moveTo(mx, by - 3 * s); x.lineTo(mx, by - 12 * s); x.stroke(); });
      // the playhead keeps going into the unseen
      const hx2 = bx + bw * head; x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(hx2, by + bh / 2, 7 * s, 0, 7); x.fill();
      x.strokeStyle = '#fff'; x.lineWidth = 1.6 * s; const sp = t * 3; x.beginPath(); x.moveTo(hx2, by + bh / 2); x.lineTo(hx2 + Math.sin(sp) * 4.5 * s, by + bh / 2 - Math.cos(sp) * 4.5 * s); x.stroke();
      x.restore();
    }
  }

  // 3. the tag and the anchors: the tag sends a pulse (indigo), each anchor hears it (blue), and the distances meet at one point
  a = fade(p, .33, .47);
  if (a > 0) {
    const [TX, TY] = P(.481, .484), lock = eo((p - .38) / .04), AP = ANCH.map(([u, v]) => P(u, v));
    // pulses leave the tag as fine indigo rings
    x.save(); x.globalAlpha = a;
    for (let j = 0; j < 3; j++) { const ph = (t * .5 + j / 3) % 1; x.strokeStyle = `rgba(${INDIGO},${.5 * (1 - ph)})`; x.lineWidth = 1.4 * s; floorRing(x, TX, TY, 8 + ph * 70, s); x.stroke(); }
    AP.forEach(([X, Y], i) => {
      const on = eo((p - .34 - i * .01) / .025); if (on <= 0) return;
      const dx = X - TX, dy = Y - TY, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      // the line between them, indigo at the tag, blue at the anchor
      const gr = x.createLinearGradient(TX, TY, X, Y); gr.addColorStop(0, `rgba(${INDIGO},.55)`); gr.addColorStop(1, `rgba(${BLUE},.55)`);
      x.strokeStyle = gr; x.lineWidth = 1.2 * s; x.beginPath(); x.moveTo(TX, TY); x.lineTo(lerp(TX, X, on), lerp(TY, Y, on)); x.stroke();
      // a textured wave packet travels out
      const f = (t * .55 + i * .27) % 1; x.strokeStyle = `rgba(${INDIGO},${.95 * Math.sin(f * 3.14)})`; x.lineWidth = 1.8 * s; x.beginPath();
      for (let q = -1; q <= 1; q += .05) { const d = (f + q * .05) * L, amp = 5 * s * Math.cos(q * 1.57), w = Math.sin(q * 18 + t * 12) * amp; const px = TX + ux * d + nx * w, py = TY + uy * d + ny * w; q === -1 ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke();
      // the anchor answers in blue
      const hit = Math.max(0, 1 - Math.abs(f - .95) * 12); x.fillStyle = `rgba(${BLUE},${.25 + hit * .6})`; x.beginPath(); x.arc(X, Y, (10 + hit * 10) * s, 0, 7); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 6.5 * s, 0, 7); x.fill(); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.6 * s; x.stroke();
      // each anchor knows a distance: an arc through the tag
      if (lock > 0) { const r = L, a0 = Math.atan2(TY - Y, TX - X); x.strokeStyle = `rgba(${BLUE},${.7 * lock})`; x.lineWidth = 1.6 * s; x.beginPath(); x.arc(X, Y, r, a0 - .22 * lock, a0 + .22 * lock); x.stroke(); }
    });
    x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.globalAlpha = a * clamp((p - .37) / .02); brackets(x, TX, TY, (70 - lock * 46) * s, 10, s);
    x.fillStyle = `rgb(${INDIGO})`; x.globalAlpha = a; x.beginPath(); x.arc(TX, TY, 5 * s, 0, 7); x.fill();
    x.restore();
  }

  // 3b. two dark loupes: the real tag on the trolley, the real anchor on the column
  a = fade(p, .385, .449, .012);
  if (a > 0) {
    const k = eo((p - .385) / .03), [TX, TY] = P(.481, .484), [AX, AY] = P(...ANCH[1]);
    const loupe = (img, OX, OY, LX, LY, R, col) => {
      if (!img.complete || !img.naturalWidth) return;
      x.save(); x.globalAlpha = a; x.strokeStyle = `rgba(${col},.6)`; x.lineWidth = 1.3 * s; x.beginPath(); x.moveTo(OX, OY); x.lineTo(lerp(OX, LX, k), lerp(OY, LY, k)); x.stroke();
      x.shadowColor = 'rgba(11,18,56,.35)'; x.shadowBlur = 30 * s; x.shadowOffsetY = 10 * s; x.fillStyle = '#05060a'; x.beginPath(); x.arc(LX, LY, R * k + 4 * s, 0, 7); x.fill(); x.shadowColor = 'transparent';
      x.save(); x.beginPath(); x.arc(LX, LY, R * k, 0, 7); x.clip(); const iw = R * 2.25, ih = iw * img.naturalHeight / img.naturalWidth; x.drawImage(img, LX - iw / 2, LY - ih / 2 + Math.sin(t * .8) * 2 * s, iw, ih); x.restore();
      x.strokeStyle = `rgb(${col})`; x.lineWidth = 2 * s; x.beginPath(); x.arc(LX, LY, R * k + 4 * s, 0, 7); x.stroke(); x.restore();
    };
    const R0 = Math.min(W, H) * (W < 700 ? .13 : .135);
    loupe(TAGIMG, TX, TY, clamp(TX - Math.min(W * .22, 210 * s), R0 + 14 * s, W - R0 - 14 * s), clamp(TY + Math.min(H * .2, 170 * s), R0 + 14 * s, H - R0 - 14 * s), R0, INDIGO);
    loupe(MOIMG, AX, AY, clamp(AX - Math.min(W * .2, 170 * s), R0 + 14 * s, W - R0 - 14 * s), clamp(AY + Math.min(H * .2, 160 * s), R0 + 14 * s, H - R0), R0 * .85, BLUE);
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
