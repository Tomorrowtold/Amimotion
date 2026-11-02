// One continuous scroll film over the model hall, told in beats: every scroll plays one picture,
// and the words on the left light up as the picture says them.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
export const FS = `precision highp float;varying vec2 v;
uniform sampler2D tA,tB,tM;uniform vec2 res,span,tagPos,bayC,waveC;uniform vec3 cam;uniform vec4 vr;
uniform float draw,dash,amber,onlyQ,hidePaths,bay,tagOn,time,grey,wave,shock,shockA;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vec2(v.x,1.-v.y);
  vec2 iu=cam.xy+(uv-.5)*span/cam.z;
  // the impact: one ring of pressure runs out across the floor and bends the picture as it passes
  vec2 sv=(iu-waveC)*vec2(.8,1.);float sd=length(sv);
  float ring=exp(-pow((sd-shock)/.022,2.))*shockA;
  iu-=normalize(sv+1e-5)*ring*.014/cam.z;
  float ca=ring*.004;
  vec3 A=vec3(texture2D(tA,iu+vec2(ca,0.)).r,texture2D(tA,iu).g,texture2D(tA,iu-vec2(ca,0.)).b);
  vec3 B=texture2D(tB,iu).rgb,M=texture2D(tM,iu).rgb;
  // the landing's reveal: inside the wave the plant is already known
  float wd=length((iu-waveC)*vec2(.8,1.));
  float inW=(1.-smoothstep(wave-.05,wave,wd))*step(.001,wave);
  float onPath=step(.004,M.g)*M.r;
  float drawn=max(1.-smoothstep(draw-.015,draw+.015,M.g),inW)*(1.-hidePaths);
  float line=onPath*drawn;
  float scans=onPath*(1.-smoothstep(.0,.035,abs(fract(M.g*5.+.5)-.5)))*dash*(1.-line);
  float amOn=max(amber,inW)*(onlyQ>.5?step(iu.x,.62):1.);
  float am=step(.02,M.b)*amOn;
  float k=max(max(line,scans),am);
  vec3 col=mix(B,A,k);
  // light: a soft halo around every live path and every wait, and light travelling along the paths
  vec2 o=vec2(.0035,.0028)/max(cam.z,.6);
  vec3 m1=texture2D(tM,iu+o).rgb,m2=texture2D(tM,iu-o).rgb,m3=texture2D(tM,iu+vec2(o.x,-o.y)).rgb,m4=texture2D(tM,iu+vec2(-o.x,o.y)).rgb;
  float halo=(m1.r+m2.r+m3.r+m4.r)*.25*drawn,ahalo=(step(.02,m1.b)+step(.02,m2.b)+step(.02,m3.b)+step(.02,m4.b))*.25*amOn;
  col+=vec3(.16,.36,1.)*halo*(1.-onPath)*.22;
  col+=vec3(1.,.62,.12)*ahalo*(1.-step(.02,M.b))*.16;
  float com=pow(max(0.,1.-abs(fract(M.g*7.-time*.22)-.5)*2.),18.)*line;
  col=mix(col,vec3(.78,.9,1.),com*.85);
  // the front of each drawing path glows
  float front=onPath*exp(-pow((M.g-draw)/.02,2.))*(1.-hidePaths)*step(.01,draw)*step(draw,1.02);
  col=mix(col,vec3(.55,.78,1.),front*.9);
  // the wave's edge: a band of light passing over the floor
  float band=exp(-pow((wd-wave)/.02,2.))*step(.001,wave)*(1.-smoothstep(1.,1.25,wave));
  col=mix(col,vec3(.9,.95,1.),band*.6);col=mix(col,vec3(.4,.65,1.),band*onPath*.7);
  col+=vec3(.55,.7,1.)*ring*.5+vec3(1.)*exp(-sd*38.)*shockA*.55;
  // one bay in colour
  vec2 bd=(iu-bayC)*vec2(.8,1.25);float bl=length(bd);
  float inBay=(1.-smoothstep(bay-.035,bay+.02,bl))*step(.001,bay);
  col=mix(col,A,inBay);
  // the tag, located
  vec2 tp=(tagPos-cam.xy)/span*cam.z+.5; vec2 dp=(uv-tp)*res; float dd=length(dp)/(res.y*.001);
  float pulse=fract(time*.55);
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(8.,9.5,dd)));
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(0.,2.,abs(dd-(12.+pulse*60.))))*(1.-pulse)*.6);
  // "before" is cooler and quieter
  float g=dot(col,vec3(.299,.587,.114));col=mix(col,mix(vec3(g),col,.2)*vec3(.96,.98,1.03),grey*(1.-k)*(1.-inBay)*.6);
  // the grade: a key light from the top left, cool shadows, clean whites, a touch more colour
  g=dot(col,vec3(.299,.587,.114));
  col=mix(vec3(g),col,1.14);
  col=mix(col,col*vec3(.9,.94,1.06),pow(1.-g,1.6)*.9);
  col=mix(col,col*col*(3.-2.*col),.22);
  vec2 pu=(uv-vr.xy)/vr.zw;
  col*=1.035-.07*(pu.x*.35+pu.y*.65);
  float sheen=exp(-pow((pu.x*.7+pu.y*.3)-fract(time*.05)*2.2+.5,2.)/.02);col+=vec3(.9,.95,1.)*sheen*.035;
  col*=mix(1.,.9,smoothstep(.45,1.15,length((pu-.5)*vec2(1.2,1.))));
  col+=(h(uv*res+time)-.5)*.014;
  gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;

// ---------- the floor: everything found in the render itself ----------
export const T = [0.4792, 0.4848];      // the AmIGo rendered on the lone trolley's deck: the hero's tag lands here
export const LAND_Z = () => innerWidth > 900 ? 2.2 : 3.0;   // how close the landing is
export const WIDE = [0.5, 0.5, 1.0];                         // the whole plant, where the film opens
export const plateSize = () => { const px = Math.max(innerWidth, innerHeight * .8) * Math.min(devicePixelRatio, 2); return innerWidth > 900 ? (px > 1200 ? 2400 : 1600) : (px > 900 ? 1600 : 800); };
export const LOCK = { r: 15, len: 6, w: 2 };
// every tag rendered on the floor (dark AmIGo pixels found in the plate): the trolley first, then bin, tool and the rest
export const MOVERS = [[.4792, .4848], [.2375, .3206], [.1945, .4275], [.7213, .2755], [.8975, .6083], [.1871, .6205], [.5101, .7342], [.3728, .7992], [.2201, .8717], [.8857, .7407]];
export const moverDist = (m) => Math.hypot((m[0] - T[0]) * .8, m[1] - T[1]);
const BIN = MOVERS[2], TOOL = MOVERS[3];
const ANCH = [[.4396, .03], [.8745, .2287], [.222, .075]];   // the AmIMo anchors rendered on the columns
const GATES = [[.262, .124], [.316, .394]];
const STORES = [.66, .17];
const WAITS = [[.269, .891, .82], [.42, .825, .64], [.546, .762, .6], [.854, .603, .38]];
const ZONES = [[.81, .6, .11, .075], [.22, .64, .13, .085]];   // two more floor zones for "before you decide on more"
const WALK1 = [[.97, .99], [.86, .9], [.93, .76], [.8, .67], [.64, .56], [.71, .44], [.63, .4]];
const WALK2 = [[.63, .4], [.5, .43], [.33, .37], [.26, .45], [.12, .5], [.17, .64], [.3, .58], [.41, .52], [.462, .505]];
const LOOK1 = [[.8, .67, 3], [.71, .44, 5]], LOOK2 = [[.33, .37, 2], [.12, .5, 4], [.17, .64, 5]];

// ---------- the beats: one picture per scroll; frag = which words light up ----------
const S0 = { cam: WIDE, draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0 };
const st = (o) => Object.assign({ draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1 }, o);
export const BEATS = [
  st({ ch: 0, cam: [.52, .55, 1.06] }),                                   // Think of the last time someone went looking for a trolley.
  st({ ch: 0, cam: [.62, .6, 1.12] }),                                    // The walk.
  st({ ch: 0, cam: [.58, .42, 1.12] }),                                   // The calls to stores.
  st({ ch: 0, cam: [.42, .5, 1.12] }),                                    // The second walk.
  st({ ch: 1, cam: [.38, .32, 1.32] }),                                   // A scan tells you where it last passed.
  st({ ch: 1, cam: [.41, .4, 1.3] }),                                     // Between scans ... out of sight.
  st({ ch: 2, cam: [.47, .47, 2.1] }),                                    // A small tag rides on each trolley,
  st({ ch: 2, cam: [.36, .45, 1.5] }),                                    // bin
  st({ ch: 2, cam: [.5, .38, 1.22] }),                                    // and tool.
  st({ ch: 2, cam: [.55, .26, 1.18] }),                                   // Anchors on your columns
  st({ ch: 2, cam: [.5, .3, 1.12] }),                                     // hear its signal.
  st({ ch: 3, cam: [.5, .5, 1.04] }),                                     // A tag tells you where it stopped.
  st({ ch: 3, cam: [.5, .5, 1.0], draw: 1.03, grey: 0 }),                 // One live map shows where it went
  st({ ch: 3, cam: [.47, .5, 1.3], draw: 1.03, grey: 0 }),                // and how long it has waited.
  st({ ch: 4, cam: [.55, .72, 1.3], draw: 1.03, amber: 1, grey: 0 }),     // See where work waits.
  st({ ch: 4, cam: [.55, .72, 1.3], draw: 1.03, amber: 1, grey: 0 }),     // You see how long each one has waited,
  st({ ch: 4, cam: [.55, .72, 1.34], draw: 1.03, amber: 1, grey: 0 }),    // while it is still waiting.
  st({ ch: 5, cam: [.5, .7, 1.15], draw: 1.03, amber: 1, onlyQ: 1, hide: 1 }), // Ask your floor a question.
  st({ ch: 5, cam: [.5, .7, 1.15], draw: 1.03, amber: 1, onlyQ: 1, hide: 1 }), // Which trolleys ...?
  st({ ch: 6, cam: [.42, .74, 1.3], draw: 1.03, amber: 1, hide: 1, bay: .2 }), // Start with one bay.
  st({ ch: 6, cam: [.42, .76, 1.4], draw: 1.03, amber: 1, hide: 1, bay: .2 }), // You see your own waits in one bay,
  st({ ch: 6, cam: [.42, .76, 1.4], draw: 1.03, amber: 1, hide: 1, bay: .2 }), // and prove the numbers,
  st({ ch: 6, cam: [.48, .66, 1.05], draw: 1.03, amber: 1, hide: 1, bay: .2 }), // before you decide on more.
];
export const NB = BEATS.length;
const SNAP = /[?&]still\b/.test(location.search); // screenshots: no easing lag
const PLAY = .8; // each beat plays in its first 80% of scroll, then holds while it is read
export const REST = BEATS.map((_, i) => (i + .9) / NB);
export const CH_FIRST = [0, 1, 2, 3, 4, 5, 6].map((c) => BEATS.findIndex((b) => b.ch === c));

function sample(bf) {
  const b = Math.min(NB - 1, Math.floor(bf)), u = clamp(bf - b), a = b ? BEATS[b - 1] : S0, z = BEATS[b], k = ease(clamp(u / PLAY));
  const o = {}; for (const key of ['cam', 'draw', 'dash', 'amber', 'onlyQ', 'hide', 'bay', 'dot', 'grey']) o[key] = Array.isArray(a[key]) ? a[key].map((x, j) => lerp(x, z[key][j], k)) : lerp(a[key], z[key], k);
  if (b === 12) o.draw = clamp(u / PLAY) * 1.03;    // the paths draw on a steady clock so their fronts read
  if (b === 0) o.draw = 1.03 * (1 - clamp(u / (PLAY * .7)));
  return o;
}

export function story(section, canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['vr', 'tA', 'tB', 'tM', 'res', 'span', 'tagPos', 'bayC', 'waveC', 'cam', 'draw', 'dash', 'amber', 'onlyQ', 'hidePaths', 'bay', 'tagOn', 'time', 'grey', 'wave', 'shock', 'shockA'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const big = plateSize();
  const tex = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); res(); }; im.src = src; });
  let ready = false;
  Promise.all([tex(`assets/scene/hall-after-${big}.webp`, 0), tex(`assets/scene/hall-before-${big}.webp`, 1), tex(`assets/scene/hall-masks-${big}.png`, 2)]).then(() => {
    gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); gl.uniform4f(U.vr, 0, 0, 1, 1); gl.uniform1f(U.wave, 0); gl.uniform2f(U.waveC, T[0], T[1]); ready = true; canvas.classList.add('ready');
  });
  let span = [1, 1];
  const hud = section.querySelector('#storyHUD'), hctx = hud && hud.getContext('2d');
  const size = () => { const d = Math.min(devicePixelRatio, 1.75); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); const ra = canvas.width / canvas.height, ia = .8; span = ra > ia ? [1, ia / ra] : [ra / ia, 1]; if (hud) { hud.width = canvas.width; hud.height = canvas.height; } };
  size(); addEventListener('resize', size);
  section.dataset.beats = NB;

  // the question's thread: a fine line from the words to the three answers on the floor
  const media = canvas.parentElement;
  const sticky = section.querySelector('.story-sticky'), qEl = section.querySelector('.q-big');
  const NS = 'http://www.w3.org/2000/svg', thread = document.createElementNS(NS, 'svg'); thread.setAttribute('class', 'q-thread'); thread.setAttribute('aria-hidden', 'true');
  const tps = [0, 1, 2].map(() => { const g = document.createElementNS(NS, 'path'); g.setAttribute('pathLength', '1'); thread.appendChild(g); return g; });
  const tds = [0, 1, 2].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '4'); thread.appendChild(c); return c; });
  sticky.appendChild(thread);
  const caps = [...section.querySelectorAll('.cap')], rail = section.querySelector('.rail b'), links = [...section.querySelectorAll('.rail a')];
  const frags = [...section.querySelectorAll('[data-b]')].map((el) => [el, +el.dataset.b]);
  links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); const top = section.getBoundingClientRect().top + scrollY + (section.offsetHeight - innerHeight) * REST[CH_FIRST[i]]; scrollTo({ top, behavior: 'smooth' }); }));
  let smooth = null, mx = 0, my = 0, qx = 0, qy = 0, beat = -1, lit = -1;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  return (t) => {
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight)), bf = Math.min(NB - .0001, p * NB), pinned = r.top <= 1 || section.classList.contains('pre-on');
    const bNow = Math.floor(bf), ch = BEATS[bNow].ch;
    // the words: the chapter shows, and its words light up beat by beat (a word lights as its picture starts)
    const lb = pinned ? Math.floor(bf + .12) : -1;
    if (bNow !== beat || lb !== lit) {
      beat = bNow; lit = lb;
      caps.forEach((c, i) => { const on = pinned && i === ch; c.classList.toggle('on', on); links[i] && links[i].classList.toggle('on', on); });
      frags.forEach(([el, i]) => { el.classList.toggle('lit', i <= lb); el.classList.toggle('now', i === lb); });
    }
    rail.style.transform = innerWidth > 900 ? `scaleX(${p})` : `scaleY(${p})`;
    if (!ready) return;
    const s = sample(bf);
    if (!smooth || SNAP) smooth = s; else for (const k in s) smooth[k] = Array.isArray(s[k]) ? s[k].map((x, j) => lerp(smooth[k][j], x, .12)) : lerp(smooth[k], s[k], .12);
    const z = smooth.cam[2], hx = span[0] / z / 2, hy = span[1] / z / 2;
    const pk = clamp(bf / .5); qx = lerp(qx, mx * pk, .05); qy = lerp(qy, my * pk, .05);
    media.style.setProperty('--ry', (qx * 4.5).toFixed(3) + 'deg'); media.style.setProperty('--rx', (-qy * 3.5).toFixed(3) + 'deg');
    const cx = clamp(smooth.cam[0] + qx * .012 / z, hx, 1 - hx), cy = clamp(smooth.cam[1] + qy * .012 / z, hy, 1 - hy);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]);
    gl.uniform3f(U.cam, cx, cy, z); gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .40, .80);
    gl.uniform1f(U.draw, smooth.draw); gl.uniform1f(U.dash, smooth.dash); gl.uniform1f(U.amber, smooth.amber); gl.uniform1f(U.onlyQ, smooth.onlyQ > .5 ? 1 : 0);
    gl.uniform1f(U.hidePaths, smooth.hide); gl.uniform1f(U.bay, smooth.bay); gl.uniform1f(U.tagOn, smooth.dot); gl.uniform1f(U.grey, smooth.grey); gl.uniform1f(U.time, t * .001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (hctx) drawHUD(hctx, bf, t * .001, cx, cy, z, span);
    // the question's threads, from the words to the answers
    const ta = clamp((bf - 18.05) / .15) * clamp((19 - bf) / .1);
    if (ta <= 0 || !qEl) thread.style.opacity = 0; else {
      const k = eo((bf - 18.1) / .4), cr = canvas.getBoundingClientRect(), sr = sticky.getBoundingClientRect(), sc = cr.width / canvas.width, desk = innerWidth > 900;
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

/* ---------- shared with the landing: every tag located, and the lock on the trolley ---------- */
const RED = '255,59,78', INDIGO = '75,61,240', INK = '11,18,56', BLUE = '31,107,255', AMB = '255,176,32';
// x: 2D context; P: plate -> device px; d: device pixels per CSS pixel; seen(i): 0..1 since the wave reached mover i; lockA: lock alpha
export function drawLanding(x, P, d, seen, lockA, lockGrow = 0) {
  x.save(); x.lineCap = 'round';
  MOVERS.forEach((m, i) => {
    const e = seen(i); if (e <= 0) return; const [X, Y] = P(m[0], m[1]);
    if (e < 1) { x.globalAlpha = (1 - e) * .55; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.4 * d; x.beginPath(); x.arc(X, Y, (6 + e * 34) * d, 0, 7); x.stroke(); }
    const k = eo(Math.min(1, e * 2.5)); if (i === 0) return;
    x.globalAlpha = Math.min(1, e * 3); x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 6.5 * d * k, 0, 7); x.fill();
    x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.arc(X, Y, 4 * d * k, 0, 7); x.fill();
  });
  if (lockA > 0) { const [X, Y] = P(T[0], T[1]); x.globalAlpha = lockA; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = LOCK.w * d; brackets(x, X, Y, LOCK.r * d * (1 + lockGrow), LOCK.len, d); }
  x.restore();
}

/* ---------- the story layer: no words, only light, shape and motion ---------- */
const TAGIMG = new Image(); TAGIMG.decoding = 'async'; TAGIMG.src = 'assets/hw/amigo-34.webp';
const MOIMG = new Image(); MOIMG.decoding = 'async'; MOIMG.src = 'assets/hw/amimo-34.webp';
function along(path, k) { const n = path.length - 1, u = clamp(k) * n, i = Math.min(n - 1, Math.floor(u)), f = u - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; }
function floorRing(x, X, Y, r, s) { x.beginPath(); x.ellipse(X, Y, r * s, r * .62 * s, -.5, 0, 7); }
function brackets(x, X, Y, r, len, s) {
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const cx = X + dx * r, cy = Y + dy * r; x.beginPath(); x.moveTo(cx, cy - dy * len * s); x.lineTo(cx, cy); x.lineTo(cx - dx * len * s, cy); x.stroke(); }
}
function clockChip(x, X, Y, R, ang, s, a) {
  x.save(); x.globalAlpha = a; x.fillStyle = 'rgba(255,255,255,.95)'; x.shadowColor = 'rgba(11,18,56,.18)'; x.shadowBlur = 14 * s; x.shadowOffsetY = 3 * s; x.beginPath(); x.arc(X, Y, R, 0, 7); x.fill(); x.shadowColor = 'transparent';
  x.strokeStyle = 'rgba(11,18,56,.12)'; x.lineWidth = 1 * s; x.stroke();
  x.strokeStyle = 'rgb(11,18,56)'; x.lineWidth = 1.8 * s; x.lineCap = 'round'; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + Math.sin(ang / 12) * R * .42, Y - Math.cos(ang / 12) * R * .42); x.moveTo(X, Y); x.lineTo(X + Math.sin(ang) * R * .66, Y - Math.cos(ang) * R * .66); x.stroke();
  x.fillStyle = 'rgb(11,18,56)'; x.beginPath(); x.arc(X, Y, 1.8 * s, 0, 7); x.fill(); x.restore();
}
function dotPath(x, P, path, k, s, a, col = INK) {
  const N = 140; x.save(); x.globalAlpha = a; x.strokeStyle = `rgba(${col},.6)`; x.lineWidth = 1.8 * s; x.setLineDash([1, 7 * s]); x.beginPath();
  for (let i = 0; i <= N * clamp(k); i++) { const [X, Y] = P(...along(path, i / N)); i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); x.restore();
}
function walker(x, X, Y, s, a) { x.save(); x.globalAlpha = a; x.fillStyle = '#fff'; x.shadowColor = 'rgba(11,18,56,.3)'; x.shadowBlur = 10 * s; x.beginPath(); x.arc(X, Y, 9 * s, 0, 7); x.fill(); x.shadowColor = 'transparent'; x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(X, Y, 5 * s, 0, 7); x.fill(); x.restore(); }
function popDot(x, X, Y, k, s, col, a = 1) {
  if (k <= 0) return; x.save(); x.globalAlpha = a;
  if (k < 1) { x.globalAlpha = a * (1 - k) * .6; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1.4 * s; floorRing(x, X, Y, 8 + k * 40, s); x.stroke(); x.globalAlpha = a; }
  const e = eo(Math.min(1, k * 2.2)); x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 8 * s * e, 0, 7); x.fill(); x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(X, Y, 5 * s * e, 0, 7); x.fill(); x.restore();
}
function card(x, img, OX, OY, CX, CY, w, col, a, k, s, t) {
  if (!img.complete || !img.naturalWidth || a * k <= 0) return;
  const h = w * img.naturalHeight / img.naturalWidth, pad = 12 * s, X = CX - w / 2 - pad, Y = CY - h / 2 - pad, CW = w + pad * 2, CH = h + pad * 2;
  x.save(); x.globalAlpha = a * k;
  x.strokeStyle = `rgba(${col},.45)`; x.lineWidth = 1.2 * s; x.setLineDash([2 * s, 4 * s]); x.beginPath(); x.moveTo(OX, OY); x.lineTo(CX, CY); x.stroke(); x.setLineDash([]);
  x.translate(0, (1 - k) * 12 * s);
  x.fillStyle = 'rgba(255,255,255,.96)'; x.shadowColor = 'rgba(11,18,56,.2)'; x.shadowBlur = 24 * s; x.shadowOffsetY = 8 * s; x.beginPath(); x.roundRect(X, Y, CW, CH, 16 * s); x.fill(); x.shadowColor = 'transparent';
  x.fillStyle = `rgb(${col})`; x.beginPath(); x.roundRect(X + 14 * s, Y + CH - 3 * s, CW - 28 * s, 3 * s, 2 * s); x.fill();
  x.drawImage(img, CX - w / 2, CY - h / 2 + Math.sin(t * .9) * 1.5 * s, w, h);
  x.restore();
}
function dial(x, X, Y, R, w, s, a, t, live, i) {
  if (a <= 0) return;
  x.save(); x.translate(X, Y); x.globalAlpha = a;
  x.fillStyle = 'rgba(255,255,255,.92)'; x.shadowColor = 'rgba(11,18,56,.16)'; x.shadowBlur = 16 * s; x.shadowOffsetY = 4 * s; x.beginPath(); x.arc(0, 0, R + 7 * s, 0, 7); x.fill(); x.shadowColor = 'transparent';
  x.strokeStyle = `rgba(${AMB},.22)`; x.lineWidth = 5 * s; x.beginPath(); x.arc(0, 0, R, 0, 7); x.stroke();
  const sweep = 6.283 * w; x.strokeStyle = `rgb(${AMB})`; x.lineCap = 'round'; x.beginPath(); x.arc(0, 0, R, -1.57, -1.57 + sweep); x.stroke();
  x.fillStyle = `rgb(${AMB})`; x.beginPath(); x.arc(Math.cos(-1.57 + sweep) * R, Math.sin(-1.57 + sweep) * R, 4.2 * s, 0, 7); x.fill();
  // a fine second hand: it keeps going while the work keeps waiting
  if (live > 0) { const ang = t * 1.6 + i * 1.3; x.globalAlpha = a * live; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.4 * s; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.sin(ang) * R * .62, -Math.cos(ang) * R * .62); x.stroke(); x.globalAlpha = a; }
  x.fillStyle = `rgba(${AMB},${.55 + .25 * Math.sin(t * 2 + i)})`; x.beginPath(); x.arc(0, 0, 6 * s, 0, 7); x.fill();
  x.restore();
}
function tick(x, X, Y, k, s, a) {
  if (k <= 0) return; x.save(); x.globalAlpha = a; x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.arc(X, Y, 11 * s * eo(k * 1.5), 0, 7); x.fill();
  const L = clamp(k * 1.6 - .3); if (L > 0) { x.strokeStyle = '#fff'; x.lineWidth = 2.2 * s; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(X - 4.5 * s, Y); const m = Math.min(1, L * 2); x.lineTo(X - 4.5 * s + 3.3 * s * m, Y + 3.4 * s * m); if (L > .5) { const n = (L - .5) * 2; x.lineTo(X - 1.2 * s + 6 * s * n, Y + 3.4 * s - 7.4 * s * n); } x.stroke(); }
  x.restore();
}

function drawHUD(x, bf, t, cx, cy, z, span) {
  const W = x.canvas.width, H = x.canvas.height, d = W / Math.max(1, x.canvas.clientWidth), s = Math.min(Math.max(H / 760, .8), 2.2) * (W < 700 ? .9 : 1);
  const P = (u, v) => [((u - cx) * z / span[0] + .5) * W, ((v - cy) * z / span[1] + .5) * H];
  const lp = (i) => clamp((bf - i) / PLAY);                       // a beat's picture: 0 before it, 1 once it has played
  const win = (a, b, f = .25) => clamp((bf - a) / f) * clamp((b - bf) / f); // visible between two beat marks
  x.clearRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round';

  // the landing holds for a moment: every tag located, the lock on the trolley; then they go out one by one
  const out = clamp(bf / (PLAY * .8));
  if (out < 1) drawLanding(x, P, d, (i) => 1 - clamp(out * 2.2 - (MOVERS.length - i) * .09), 1 - clamp(out * 1.8), out * .8);

  // ---- Search: the lost trolley, the walk, the calls to stores, the second walk ----
  let a = win(.1, 4.15);
  if (a > 0) {
    // the one they are looking for: we can see it, they cannot
    const [TX, TY] = P(T[0], T[1]), lost = sm(.25, .6, bf) * (1 - sm(3.6, 3.95, bf));
    if (lost > 0) { x.save(); x.globalAlpha = a * lost * .7; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.3 * s; x.setLineDash([3 * s, 5 * s]); x.lineDashOffset = -t * 6; floorRing(x, TX, TY, 26, s); x.stroke(); x.restore(); }
    const k1 = lp(1), k3 = lp(3), clock = k1 * 9.4 + lp(2) * 4.7 + k3 * 9.4;
    dotPath(x, P, WALK1, k1, s, a); if (k3 > 0) dotPath(x, P, WALK2, k3, s, a);
    [[LOOK1, k1, WALK1], [LOOK2, k3, WALK2]].forEach(([L, k, path]) => L.forEach(([u, v, at]) => { const kk = k * (path.length - 1) - at; if (kk < 0 || kk > 2.5) return; const [X, Y] = P(u, v); x.save(); x.globalAlpha = a * clamp(1 - kk * .4) * .55; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.2 * s; floorRing(x, X, Y, 16 + eo(kk) * 26, s); x.stroke(); x.restore(); }));
    // the calls to stores: rings from the person, rings at the racks, nothing comes back
    const k2 = lp(2), [WX, WY] = P(...WALK1[WALK1.length - 1]), [SX, SY] = P(...STORES);
    if (k2 > 0 && bf < 3.9) {
      const ca = a * (1 - sm(3.3, 3.8, bf));
      x.save(); x.globalAlpha = ca * .6; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.3 * s; x.setLineDash([2 * s, 6 * s]); x.lineDashOffset = -t * 14;
      const mx = (WX + SX) / 2 - 40 * s, my = (WY + SY) / 2, kk = eo(k2 * 1.6);
      x.beginPath(); x.moveTo(WX, WY); x.quadraticCurveTo(lerp(WX, mx, kk), lerp(WY, my, kk), lerp(WX, SX, kk), lerp(WY, SY, kk)); x.stroke(); x.setLineDash([]);
      for (let j = 0; j < 3; j++) { const ph = (t * .8 + j / 3) % 1; x.globalAlpha = ca * (1 - ph) * .7 * sm(.4, .6, k2); x.beginPath(); x.arc(SX, SY, (8 + ph * 34) * s, 0, 7); x.stroke(); }
      for (let j = 0; j < 2; j++) { const ph = (t * .8 + j / 2 + .25) % 1; x.globalAlpha = ca * (1 - ph) * .5; x.beginPath(); x.arc(WX, WY, (12 + ph * 22) * s, -2.4, -.7); x.stroke(); }
      x.restore();
    }
    // the person: where they are now
    const pos = k3 > 0 ? along(WALK2, k3) : along(WALK1, k1), [X, Y] = P(...pos);
    if (k1 > 0) walker(x, X, Y, s, a * sm(0, .15, k1));
    // found, at last: the ring closes on the trolley
    const f = sm(.86, 1, k3); if (f > 0) { x.save(); x.globalAlpha = a * f; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 2 * s; x.beginPath(); x.ellipse(TX, TY, 26 * s, 16 * s, -.5, -1.6, -1.6 + 6.283 * f); x.stroke(); x.restore(); }
    // time spent: one clock, always turning while they look
    clockChip(x, 40 * s, 40 * s, 20 * s, clock, s, a * sm(.6, 1, bf));
  }

  // ---- Scans: two checkpoints stamp a moment; between them, and after them, the trolley is out of sight ----
  a = win(4, 6.1);
  if (a > 0) {
    const G = GATES.map(([u, v]) => P(u, v)), [TX, TY] = P(T[0], T[1]), k4 = lp(4), k5 = lp(5);
    x.save(); x.globalAlpha = a;
    const k1 = eo((k4 - .3) / .4);
    if (k1 > 0) { x.strokeStyle = `rgba(${INK},.7)`; x.lineWidth = 2 * s; x.beginPath(); x.moveTo(G[0][0], G[0][1]); x.lineTo(lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)); x.stroke(); }
    // a moving mark: the trolley as the scans see it
    const mv = k5 > 0 ? null : k4 < .3 ? G[0] : [lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)];
    if (mv) { x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(mv[0], mv[1], 5 * s, 0, 7); x.fill(); }
    // after the last scan: the trail breaks up and the floor goes quiet
    if (k5 > 0) {
      const N = 14; for (let i = 0; i < N * eo(k5 * 1.4); i++) { const q = i / N, X = lerp(G[1][0], TX, q * .85), Y = lerp(G[1][1], TY, q * .85); x.fillStyle = `rgba(${INK},${.6 * (1 - q)})`; x.beginPath(); x.arc(X, Y, 1.8 * s, 0, 7); x.fill(); }
      const kf = sm(.35, .8, k5); const g = x.createRadialGradient(TX, TY, 0, TX, TY, 90 * s); g.addColorStop(0, `rgba(240,246,255,${.85 * kf})`); g.addColorStop(1, 'rgba(240,246,255,0)'); x.fillStyle = g; x.fillRect(TX - 90 * s, TY - 90 * s, 180 * s, 180 * s);
      x.strokeStyle = `rgba(${INK},${.45 * kf})`; x.lineWidth = 1.4 * s; x.setLineDash([3 * s, 6 * s]); x.lineDashOffset = -t * 8; floorRing(x, TX, TY, 30 + Math.sin(t * 1.4) * 3, s); x.stroke(); x.setLineDash([]);
      for (let j = 0; j < 3; j++) { const ang = t * .5 + j * 2.1; x.globalAlpha = a * kf * .35; x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(TX + Math.cos(ang) * 22 * s * kf, TY + Math.sin(ang) * 13 * s * kf, 3.4 * s, 0, 7); x.fill(); x.globalAlpha = a; }
    }
    G.forEach(([X, Y], i) => {
      const k = clamp((k4 - (i ? .7 : .15)) / .2);
      x.fillStyle = `rgb(${INK})`; for (const dd of [-1, 1]) { x.beginPath(); x.roundRect(X + dd * 14 * s - 2 * s, Y - 22 * s, 4 * s, 22 * s, 2 * s); x.fill(); }
      x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.beginPath(); x.moveTo(X - 14 * s, Y - 14 * s); x.lineTo(X + 14 * s, Y - 14 * s); x.stroke();
      if (k > 0 && k < 1) { x.globalAlpha = a * (1 - k); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.6 * s; floorRing(x, X, Y, 10 + k * 60, s); x.stroke(); x.globalAlpha = a; }
      const c = eo(k * 2); if (c > 0) clockChip(x, X + 30 * s, Y - 40 * s, 15 * s * c, i ? 2.4 : .7, s, a);
    });
    x.restore();
    // the shift on one line: two moments seen, the rest unseen
    const kt = eo(k4 * 2);
    if (kt > 0) {
      const bw = Math.min(W * .6, 520 * s), bx = (W - bw) / 2, by = H - 40 * s, bh = 6 * s;
      x.save(); x.globalAlpha = a * kt;
      x.fillStyle = 'rgba(255,255,255,.92)'; x.shadowColor = 'rgba(11,18,56,.16)'; x.shadowBlur = 18 * s; x.beginPath(); x.roundRect(bx - 20 * s, by - 17 * s, bw + 40 * s, bh + 34 * s, 20 * s); x.fill(); x.shadowColor = 'transparent';
      x.fillStyle = 'rgba(11,18,56,.08)'; x.beginPath(); x.roundRect(bx, by, bw, bh, bh / 2); x.fill();
      const head = clamp(k4 * .45 + k5 * .55);
      [.2, .45].forEach((m) => { if (head < m) return; x.fillStyle = `rgb(${BLUE})`; x.beginPath(); x.arc(bx + bw * m, by + bh / 2, 5 * s, 0, 7); x.fill(); });
      if (head > .45) { x.strokeStyle = `rgba(${INK},.35)`; x.lineWidth = 1.2 * s; x.setLineDash([2 * s, 4 * s]); x.beginPath(); x.moveTo(bx + bw * .45 + 8 * s, by + bh / 2); x.lineTo(bx + bw * head, by + bh / 2); x.stroke(); x.setLineDash([]); }
      x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(bx + bw * head, by + bh / 2, 4 * s, 0, 7); x.fill();
      x.restore();
    }
  }

  // ---- Tag: on the trolley, on a bin, on a tool; anchors on the columns; the signal; found ----
  a = win(6, 11.1);
  if (a > 0) {
    const [TX, TY] = P(T[0], T[1]), k6 = lp(6), k7 = lp(7), k8 = lp(8), k9 = lp(9), k10 = lp(10);
    const w0 = Math.min(W * .17, 150 * s);
    card(x, TAGIMG, TX, TY, clamp(TX - Math.min(W * .22, 200 * s), w0, W - w0), clamp(TY + Math.min(H * .2, 160 * s), w0, H - w0 * .8), w0, INDIGO, a * (1 - sm(7.6, 8.2, bf)), eo(k6 * 1.4), s, t);
    popDot(x, TX, TY, k6 * 1.2, s, INDIGO, a);
    popDot(x, ...P(...BIN), k7 * 1.2, s, INDIGO, a);
    popDot(x, ...P(...TOOL), k8 * 1.2, s, INDIGO, a);
    // the rest of the floor's tags join quietly
    if (k8 > .5) MOVERS.slice(4).forEach((m, i) => popDot(x, ...P(...m), clamp((k8 - .5) * 2.4 - i * .1), s * .7, INDIGO, a * .8));
    const AP = ANCH.map(([u, v]) => P(u, v));
    AP.forEach(([X, Y], i) => { const on = eo((k9 - i * .15) / .4); if (on <= 0) return; x.save(); x.globalAlpha = a * on; x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 8 * s, 0, 7); x.fill(); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.6 * s; x.stroke(); if (on < 1) { x.globalAlpha = a * (1 - on) * .6; x.lineWidth = 1.4 * s; x.beginPath(); x.arc(X, Y, (10 + on * 30) * s, 0, 7); x.stroke(); } x.restore(); });
    const [AX, AY] = AP[1];
    card(x, MOIMG, AX, AY, clamp(AX - Math.min(W * .14, 120 * s), w0, W - w0), clamp(AY + Math.min(H * .22, 180 * s), w0, H - w0), w0 * .82, BLUE, a * (1 - sm(10.3, 10.8, bf)), eo(k9 * 1.4 - .2), s, t);
    // the signal: pulses out from the tag, each anchor answers, the lock closes
    if (k10 > 0) {
      x.save(); x.globalAlpha = a * sm(0, .2, k10);
      for (let j = 0; j < 2; j++) { const ph = (t * .45 + j / 2) % 1; x.strokeStyle = `rgba(${INDIGO},${.45 * (1 - ph)})`; x.lineWidth = 1.4 * s; floorRing(x, TX, TY, 10 + ph * 46, s); x.stroke(); }
      AP.forEach(([X, Y], i) => {
        const on = eo((k10 - i * .1) / .3); if (on <= 0) return;
        const gr = x.createLinearGradient(TX, TY, X, Y); gr.addColorStop(0, `rgba(${INDIGO},.45)`); gr.addColorStop(1, `rgba(${BLUE},.45)`);
        x.strokeStyle = gr; x.lineWidth = 1.2 * s; x.beginPath(); x.moveTo(TX, TY); x.lineTo(lerp(TX, X, on), lerp(TY, Y, on)); x.stroke();
        const f = (t * .5 + i * .22) % 1, px = lerp(TX, X, f), py = lerp(TY, Y, f), al = Math.sin(f * 3.1416);
        const g = x.createRadialGradient(px, py, 0, px, py, 10 * s); g.addColorStop(0, `rgba(${INDIGO},${al})`); g.addColorStop(1, `rgba(${INDIGO},0)`); x.fillStyle = g; x.beginPath(); x.arc(px, py, 10 * s, 0, 7); x.fill();
        const hit = Math.max(0, 1 - Math.abs(f - .97) * 14); if (hit > 0) { x.strokeStyle = `rgba(${BLUE},${.6 * hit})`; x.lineWidth = 1.4 * s; x.beginPath(); x.arc(X, Y, (10 + (1 - hit) * 16) * s, 0, 7); x.stroke(); }
      });
      const lock = eo((k10 - .45) / .4); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.globalAlpha = a * lock; brackets(x, TX, TY, (60 - lock * 38) * s, 9, s);
      x.restore();
    }
  }

  // ---- Paths: where it stopped; where it went; how long it has waited ----
  a = win(11, 14.1);
  if (a > 0) {
    const [X, Y] = P(T[0], T[1]), k = lp(11), drop = 1 - eo(k * 1.6), land = clamp((k - .5) / .3);
    x.save(); x.globalAlpha = a * clamp(k * 3);
    x.fillStyle = `rgba(${RED},${.22 * (1 - drop)})`; floorRing(x, X, Y, 10 - drop * 4, s); x.fill();
    if (land > 0) for (let j = 0; j < 2; j++) { const ph = ((t * .45 + j / 2) % 1); x.strokeStyle = `rgba(${RED},${.5 * (1 - ph) * land * (1 - lp(12) * .7)})`; x.lineWidth = 1.6 * s; floorRing(x, X, Y, 10 + ph * 46, s); x.stroke(); }
    const py = Y - drop * 60 * s - 4 * s; x.fillStyle = `rgb(${RED})`; x.shadowColor = `rgba(${RED},.45)`; x.shadowBlur = 16 * s;
    x.beginPath(); x.moveTo(X, py); x.bezierCurveTo(X - 13 * s, py - 15 * s, X - 13 * s, py - 34 * s, X, py - 34 * s); x.bezierCurveTo(X + 13 * s, py - 34 * s, X + 13 * s, py - 15 * s, X, py); x.fill();
    x.shadowColor = 'transparent'; x.fillStyle = '#fff'; x.beginPath(); x.arc(X, py - 23 * s, 4.2 * s, 0, 7); x.fill();
    x.restore();
    const k13 = lp(13); if (k13 > 0) dial(x, X + 46 * s, Y - 40 * s, 22 * s, .42 * eo(k13) + (t * .002) % .01, s, a * eo(k13 * 2), t, sm(.5, 1, k13), 9);
  }

  // ---- Ask: the floor dims; only the answers stay lit ----
  a = win(17, 19.05, .3);
  if (a > 0) {
    x.save(); x.globalAlpha = a; x.fillStyle = 'rgba(232,238,248,.72)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'destination-out';
    WAITS.slice(0, 3).forEach(([u, v]) => { const [X, Y] = P(u, v), R = 110 * s; const g = x.createRadialGradient(X, Y - 10 * s, 0, X, Y - 10 * s, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(X - R, Y - R - 10 * s, R * 2, R * 2); });
    x.restore();
  }

  // ---- Waits: the amber dials, filling, then running on their own ----
  a = win(14.9, 23);
  WAITS.forEach(([u, v, w], i) => {
    const k = eo((lp(15) - i * .1) / .5); if (a * k <= 0) return; const [X, Y] = P(u, v), R = 30 * s;
    const ask = bf > 17 && bf < 19.05 ? (i < 3 ? 1 : .25) : 1, inBay = bf > 19.1 ? (i < 2 ? 1 : .2) : 1;
    dial(x, X, Y - 46 * s, R, w * k + lp(16) * ((t * .006) % .04), s, a * ask * inBay, t, lp(16), i);
  });
  // the answer draws itself around the three that match
  a = win(18, 19.05, .3);
  if (a > 0) WAITS.slice(0, 3).forEach(([u, v], i) => { const [X, Y] = P(u, v), k = eo((lp(18) - .2 - i * .1) / .4); if (k <= 0) return; x.save(); x.globalAlpha = a;
    x.strokeStyle = `rgba(${AMB},.28)`; x.lineWidth = 9 * s; x.beginPath(); x.ellipse(X, Y, 58 * s, 36 * s, -.5, -2.2, -2.2 + 6.283 * k); x.stroke();
    x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.8 * s; x.beginPath(); x.ellipse(X, Y, 58 * s, 36 * s, -.5, -2.2, -2.2 + 6.283 * k); x.stroke(); x.restore(); });

  // ---- One bay: corner marks settle around it; its waits; the numbers proved; more bays, later ----
  a = win(19, 24);
  if (a > 0) {
    const [X, Y] = P(.40, .80), k = eo(lp(19) * 1.3), rx = (.2 / .8) * z / span[0] * W, ry = (.2 / 1.25) * z / span[1] * H;
    x.save(); x.globalAlpha = a * k; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2.6 * s; const e = (1 - k) * 40 * s, L = 26 * s;
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const ccx = X + dx * (rx + e), ccy = Y + dy * (ry + e); x.beginPath(); x.moveTo(ccx, ccy - dy * L); x.lineTo(ccx, ccy); x.lineTo(ccx - dx * L, ccy); x.stroke(); }
    x.restore();
    WAITS.slice(0, 2).forEach(([u, v], i) => { const [WX, WY] = P(u, v); tick(x, WX + 34 * s, WY - 74 * s, clamp((lp(21) - i * .2) / .5), s, a); });
    const k22 = lp(22);
    // more bays, later: the same corner marks, lighter, waiting their turn
    if (k22 > 0) ZONES.forEach(([u, v, w, h], i) => { const kk = eo((k22 - i * .25) / .5); if (kk <= 0) return; const [ZX, ZY] = P(u, v), zx = w * z / span[0] * W, zy = h * z / span[1] * H, e2 = (1 - kk) * 30 * s, L2 = 18 * s;
      x.save(); x.globalAlpha = a * kk * .55; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.setLineDash([4 * s, 4 * s]);
      for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const ccx = ZX + dx * (zx + e2), ccy = ZY + dy * (zy + e2); x.beginPath(); x.moveTo(ccx, ccy - dy * L2); x.lineTo(ccx, ccy); x.lineTo(ccx - dx * L2, ccy); x.stroke(); }
      x.restore(); });
  }
}
