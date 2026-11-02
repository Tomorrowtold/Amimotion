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
  float inBay=(1.-smoothstep(bay-.01,bay+.01,bl))*step(.001,bay);
  col=mix(col,A,inBay);
  col=mix(col,vec3(.12,.42,1.),exp(-pow((bl-bay)/.0011,2.))*step(.001,bay)*.85);
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
  { at: 0.20, cam: [0.40, 0.36, 1.30], draw: 0, dash: 1, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.28, cam: [0.40, 0.36, 1.30], draw: 0, dash: 1, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
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
  let smooth = null;
  return (t) => {
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight));
    caps.forEach((c, i) => { const on = p >= marks[i][0] && p < marks[i][1]; c.classList.toggle('on', on); links[i] && links[i].classList.toggle('on', on); });
    rail.style.transform = innerWidth > 900 ? `scaleX(${p})` : `scaleY(${p})`;
    section.dispatchEvent(new CustomEvent('progress', { detail: p }));
    if (!ready) return;
    const s = sample(p);
    if (!smooth) smooth = s; else for (const k in s) smooth[k] = Array.isArray(s[k]) ? s[k].map((x, j) => lerp(smooth[k][j], x, .14)) : lerp(smooth[k], s[k], .14);
    const z = smooth.cam[2], hx = span[0] / z / 2, hy = span[1] / z / 2;
    const cx = clamp(smooth.cam[0], hx, 1 - hx), cy = clamp(smooth.cam[1], hy, 1 - hy);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]);
    gl.uniform3f(U.cam, cx, cy, z); gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .40, .80);
    gl.uniform1f(U.draw, smooth.draw); gl.uniform1f(U.dash, smooth.dash); gl.uniform1f(U.amber, smooth.amber); gl.uniform1f(U.onlyQ, smooth.onlyQ > .5 ? 1 : 0);
    gl.uniform1f(U.hidePaths, smooth.hide); gl.uniform1f(U.bay, smooth.bay); gl.uniform1f(U.tagOn, smooth.dot); gl.uniform1f(U.grey, smooth.grey); gl.uniform1f(U.time, t * .001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (hctx) drawHUD(hctx, p, t * .001, cx, cy, z, span, font);
  };
}

/* ---------- the story layer: people, scans, anchors, timers, answers ---------- */
const INK = '11,18,56', BLUE = '31,107,255', AMB = '255,176,32';
const WALK = [[.97, .99], [.86, .9], [.93, .76], [.8, .67], [.64, .56], [.71, .44], [.6, .39], [.5, .43], [.33, .37], [.26, .45], [.12, .5], [.17, .64], [.07, .72]];
const SCANS = [[.262, .124, 'Scanned 08:52'], [.316, .394, 'Scanned 09:40']];
const ANCH = [[.44, .07], [.875, .235], [.222, .075]];
const WAITS = [[.269, .891, 5460], [.42, .825, 4010], [.546, .762, 3890], [.854, .603, 2520]];
const fade = (p, a, b, f = .025) => clamp((p - a) / f) * clamp((b - p) / f);
function rr(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
function chip(x, s, X, Y, text, a, dot, opt = {}) {
  if (a <= 0) return;
  x.save(); x.globalAlpha = a; x.font = `600 ${13 * s}px ${opt.font}`; const w = x.measureText(text).width + (dot ? 34 : 22) * s, h = 30 * s;
  const lx = (opt.left || X + 14 * s + w > x.canvas.width - 10 * s) ? Math.max(10 * s, X - w - 14 * s) : X + 14 * s, ly = Y - h / 2 - (1 - a) * 8 * s;
  x.shadowColor = 'rgba(11,18,56,.18)'; x.shadowBlur = 18 * s; x.shadowOffsetY = 6 * s;
  x.fillStyle = opt.fill || 'rgba(255,255,255,.96)'; rr(x, lx, ly, w, h, h / 2); x.fill(); x.shadowColor = 'transparent';
  if (dot) { x.fillStyle = `rgb(${dot})`; x.beginPath(); x.arc(lx + 15 * s, ly + h / 2, 4.5 * s, 0, 7); x.fill(); }
  x.fillStyle = opt.ink || `rgb(${INK})`; x.textBaseline = 'middle'; x.fillText(text, lx + (dot ? 26 : 11) * s, ly + h / 2 + .5 * s);
  x.restore();
}
const hm = (sec) => { const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = Math.floor(sec) % 60; return `${h ? h + ' h ' : ''}${String(m).padStart(h ? 2 : 1, '0')} m ${String(s).padStart(2, '0')} s`; };
function drawHUD(x, p, t, cx, cy, z, span, fam) {
  const W = x.canvas.width, H = x.canvas.height, s = Math.min(Math.max(H / 760, .8), 2.2) * (W < 700 ? .9 : 1);
  const P = (u, v) => [((u - cx) * z / span[0] + .5) * W, ((v - cy) * z / span[1] + .5) * H];
  const font = fam.trim() || 'Arial', o = { font };
  x.clearRect(0, 0, W, H);

  // 1. the search: someone walks the aisles, the clock runs
  let a = fade(p, -.1, .19);
  if (a > 0) {
    const k = clamp(p / .15), n = WALK.length - 1, upto = k * n; x.save(); x.globalAlpha = a;
    x.strokeStyle = `rgba(${INK},.55)`; x.lineWidth = 2.2 * s; x.setLineDash([2 * s, 9 * s]); x.lineCap = 'round'; x.beginPath();
    let hx = 0, hy = 0;
    for (let i = 0; i <= Math.ceil(upto) && i <= n; i++) { const f = Math.min(1, upto - i + 1); const pr = WALK[Math.max(0, i - 1)], c = WALK[i]; const u = i ? lerp(pr[0], c[0], f) : c[0], v = i ? lerp(pr[1], c[1], f) : c[1]; [hx, hy] = P(u, v); i ? x.lineTo(hx, hy) : x.moveTo(hx, hy); }
    x.stroke(); x.setLineDash([]);
    // the searcher
    x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(hx, hy, 6 * s, 0, 7); x.fill();
    x.strokeStyle = `rgba(${INK},.25)`; x.lineWidth = 1.5 * s; x.beginPath(); x.arc(hx, hy, (10 + 8 * ((t * 1.3) % 1)) * s, 0, 7); x.stroke();
    // question marks where they looked
    x.font = `700 ${16 * s}px ${font}`; x.fillStyle = `rgba(${INK},.45)`;
    [[.8, .67], [.6, .39], [.26, .45]].forEach(([u, v], i) => { if (upto > [3, 6, 9][i]) { const [X, Y] = P(u, v); x.fillText('?', X + 10 * s, Y - 10 * s); } });
    x.restore();
    chip(x, s, hx, hy - 4 * s, `Searching · ${Math.round(4 + k * 21)} min`, a, null, o);
  }

  // 2. scans: two checkpoints, then nothing
  a = fade(p, .18, .33);
  if (a > 0) {
    SCANS.forEach(([u, v, txt], i) => { const [X, Y] = P(u, v); x.save(); x.globalAlpha = a; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 3 * s; x.beginPath(); x.moveTo(X - 12 * s, Y + 9 * s); x.lineTo(X + 12 * s, Y - 9 * s); x.stroke(); x.restore(); chip(x, s, X, Y, txt, a * clamp((p - .2 - i * .025) / .02), INK, o); });
    const [X, Y] = P(.481, .484); x.save(); x.globalAlpha = a * .8; x.strokeStyle = `rgba(${INK},.5)`; x.setLineDash([5 * s, 6 * s]); x.lineWidth = 2 * s; x.beginPath(); x.arc(X, Y, 34 * s, 0, 7); x.stroke(); x.restore();
    chip(x, s, X + 22 * s, Y, 'Since then? No record', a * clamp((p - .25) / .02), null, o);
  }

  // 3. the tag: anchors hear it
  a = fade(p, .33, .47);
  if (a > 0) {
    const [TX, TY] = P(.481, .484);
    ANCH.forEach(([u, v], i) => {
      const [X, Y] = P(u, v); x.save(); x.globalAlpha = a;
      x.strokeStyle = `rgba(${BLUE},.75)`; x.lineWidth = 1.6 * s; x.setLineDash([3 * s, 7 * s]); x.lineDashOffset = -t * 40 * s; x.beginPath(); x.moveTo(X, Y); x.lineTo(TX, TY); x.stroke(); x.setLineDash([]);
      const ph = (t * .8 + i * .33) % 1; x.strokeStyle = `rgba(${BLUE},${.6 * (1 - ph)})`; x.beginPath(); x.arc(X, Y, (6 + ph * 34) * s, 0, 7); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 6 * s, 0, 7); x.fill(); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.5 * s; x.stroke(); x.restore();
    });
    const [AX, AY] = P(ANCH[1][0], ANCH[1][1]); chip(x, s, AX, AY, 'AmIMo anchor', a * clamp((p - .35) / .02), BLUE, o);
    chip(x, s, TX + 16 * s, TY, 'AmIGo tag · heard', a * clamp((p - .37) / .02), BLUE, o);
  }

  // 4. paths: a legend and the tag's last stop
  a = fade(p, .46, .63);
  if (a > 0) {
    const [TX, TY] = P(.481, .484);
    chip(x, s, TX + 16 * s, TY, 'Stopped here', a * clamp((p - .5) / .02), BLUE, o);
  }
  a = fade(p, .47, 1.1);
  if (a > 0) {
    x.save(); x.globalAlpha = a; x.font = `600 ${12.5 * s}px ${font}`; const L = [['Moving', BLUE], ['Waiting', AMB]]; let X = 18 * s; const Y = 22 * s;
    x.shadowColor = 'rgba(11,18,56,.14)'; x.shadowBlur = 14 * s; x.fillStyle = 'rgba(255,255,255,.94)'; rr(x, 12 * s, 10 * s, 176 * s, 26 * s, 13 * s); x.fill(); x.shadowColor = 'transparent';
    L.forEach(([n, c], i) => { if (i && p < .62) x.globalAlpha = a * .35; x.fillStyle = `rgb(${c})`; rr(x, X + 6 * s, Y - 3 * s, 16 * s, 6 * s, 3 * s); x.fill(); x.fillStyle = `rgb(${INK})`; x.textBaseline = 'middle'; x.fillText(n, X + 28 * s, Y + .5 * s); X += 82 * s; x.globalAlpha = a; });
    x.restore();
  }

  // 5. waits: every amber spot runs a live timer
  a = fade(p, .62, .78);
  WAITS.forEach(([u, v, sec], i) => { const [X, Y] = P(u, v); chip(x, s, X - 20 * s, Y - 42 * s, hm(sec + t), a * clamp((p - .63 - i * .012) / .02), AMB, o); });

  // 6. ask: the floor answers
  a = fade(p, .77, .91);
  if (a > 0) {
    const k = clamp((p - .8) / .03);
    WAITS.slice(0, 3).forEach(([u, v, sec]) => { const [X, Y] = P(u, v); x.save(); x.globalAlpha = a * k; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 2.5 * s; x.beginPath(); x.ellipse(X, Y, 62 * s, 40 * s, -.5, 0, 7); x.stroke(); x.restore(); });
    const bw = 300 * s, bh = 128 * s, bx = W - bw - 18 * s, by = 52 * s; x.save(); x.globalAlpha = a * k;
    x.shadowColor = 'rgba(11,18,56,.2)'; x.shadowBlur = 30 * s; x.shadowOffsetY = 10 * s; x.fillStyle = '#fff'; rr(x, bx, by, bw, bh, 18 * s); x.fill(); x.shadowColor = 'transparent';
    x.fillStyle = `rgb(${INK})`; x.font = `700 ${15 * s}px ${font}`; x.textBaseline = 'alphabetic'; x.fillText('3 trolleys at inspection', bx + 18 * s, by + 30 * s);
    x.font = `500 ${13 * s}px ${font}`; WAITS.slice(0, 3).forEach(([, , sec], i) => { const Y = by + (56 + i * 23) * s; x.fillStyle = `rgb(${AMB})`; x.beginPath(); x.arc(bx + 24 * s, Y - 4 * s, 4 * s, 0, 7); x.fill(); x.fillStyle = `rgb(${INK})`; x.fillText(`Trolley ${['T-14', 'T-09', 'T-21'][i]}`, bx + 36 * s, Y); x.textAlign = 'right'; x.fillText(hm(sec + t).replace(/ \d+ s$/, ''), bx + bw - 18 * s, Y); x.textAlign = 'left'; });
    x.restore();
  }

  // 7. one bay
  a = fade(p, .9, 1.2);
  if (a > 0) { const [X, Y] = P(.40 + .2 * .55, .80 - .2 * .62); chip(x, s, X, Y, 'Your first bay', a * clamp((p - .93) / .02), BLUE, o); }
}
