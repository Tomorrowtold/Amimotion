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
  col+=(h(uv*res+time)-.5)*.016;
  gl_FragColor=vec4(col,1.);}`;

// chapters: [start, cam x, cam y, zoom, draw, dash, amber, onlyQ, hidePaths, bay, dot, grey]
const T = [0.481, 0.484];      // the tag on the lone trolley
const Q = [0.40, 0.80];      // inspection queue
const K = [
  { at: 0.00, cam: [T[0], T[1], 2.2], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.10, cam: [T[0], T[1], 1.9], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.20, cam: [0.5, 0.55, 1.15], draw: 0, dash: 1, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.27, cam: [0.5, 0.55, 1.15], draw: 0, dash: 1, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 },
  { at: 0.36, cam: [T[0], T[1], 2.3], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 1, grey: 1 },
  { at: 0.42, cam: [T[0], T[1], 2.3], draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 1, grey: 1 },
  { at: 0.56, cam: [0.5, 0.5, 1.0], draw: 1.03, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: .0, grey: 0 },
  { at: 0.60, cam: [0.5, 0.5, 1.0], draw: 1.03, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 },
  { at: 0.68, cam: [Q[0], Q[1], 2.0], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 },
  { at: 0.72, cam: [Q[0], Q[1], 2.0], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 },
  { at: 0.80, cam: [0.5, 0.6, 1.05], draw: 1.03, dash: 0, amber: 1, onlyQ: 1, hide: 1, bay: 0, dot: 0, grey: 1 },
  { at: 0.85, cam: [0.5, 0.6, 1.05], draw: 1.03, dash: 0, amber: 1, onlyQ: 1, hide: 1, bay: 0, dot: 0, grey: 1 },
  { at: 0.95, cam: [0.42, 0.7, 1.0], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 1, bay: .2, dot: 0, grey: 1 },
  { at: 1.00, cam: [0.42, 0.7, 1.0], draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 1, bay: .2, dot: 0, grey: 1 },
];
function sample(p) {
  let i = 0; while (i < K.length - 2 && p > K[i + 1].at) i++;
  const a = K[i], b = K[i + 1], k = ease(clamp((p - a.at) / (b.at - a.at)));
  const o = {}; for (const key of Object.keys(a)) { if (key === 'at') continue; o[key] = Array.isArray(a[key]) ? a[key].map((x, j) => lerp(x, b[key][j], k)) : lerp(a[key], b[key], k); }
  // the paths draw on a linear clock inside their chapter so the front is visible
  if (p > .42 && p < .56) o.draw = (p - .42) / .14 * 1.03;
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
  const big = innerWidth * Math.min(devicePixelRatio, 2) > 900 ? 1600 : 800;
  const tex = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); res(); }; im.src = src; });
  let ready = false;
  Promise.all([tex(`assets/scene/hall-after-${big}.webp`, 0), tex(`assets/scene/hall-before-${big}.webp`, 1), tex(`assets/scene/hall-masks-${big}.png`, 2)]).then(() => {
    gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); ready = true; canvas.classList.add('ready');
  });
  let span = [1, 1];
  const size = () => { const d = Math.min(devicePixelRatio, 1.75); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); const ra = canvas.width / canvas.height, ia = .8; span = ra > ia ? [1, ia / ra] : [ra / ia, 1]; };
  size(); addEventListener('resize', size);

  const caps = [...section.querySelectorAll('.cap')], rail = section.querySelector('.rail i');
  const marks = caps.map((c) => [+c.dataset.from, +c.dataset.to]);
  let smooth = null;
  return (t) => {
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight));
    caps.forEach((c, i) => c.classList.toggle('on', p >= marks[i][0] && p < marks[i][1]));
    rail.style.transform = `scaleY(${p})`;
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
  };
}
