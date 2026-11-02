// The hero's world: the plant before AmIMotion, grey and still; then the tag lands and the world changes outward from it.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const FS = `precision highp float;varying vec2 v;
uniform sampler2D tA,tB,tM;uniform vec2 res,tagS,anchor;uniform float scale,change,draw,amber,time,phone,lens;uniform vec2 mouse;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vec2(v.x,1.-v.y); float ar=res.x/res.y;
  // image coords: the trolley the tag rides on sits right under the tag
  vec2 d=(uv-tagS)*vec2(ar,1.)/scale; vec2 iu=anchor+d*vec2(1.,.8);
  vec3 A=texture2D(tA,iu).rgb,B=texture2D(tB,iu).rgb,M=texture2D(tM,iu).rgb;
  // before: grey, cool, a little lost in haze
  float g=dot(B,vec3(.299,.587,.114)); vec3 before=mix(vec3(g),B,.15)*vec3(.95,.97,1.01);
  // after: the same floor, paths drawing on, waits in amber
  float onPath=step(.004,M.g)*M.r; float line=onPath*(1.-smoothstep(draw-.02,draw+.02,M.g));
  float front=onPath*exp(-pow((M.g-draw)/.025,2.))*step(.01,draw)*step(draw,1.02);
  float am=step(.02,M.b)*amber;
  vec3 after=mix(B,A,max(line,am)); after=mix(after,vec3(.45,.68,1.),front*.7);
  // the change travels outward from the tag as a soft front of light
  float r=length((uv-tagS)*vec2(ar,1.));
  float R=change*(1.6+ar*.4);
  float k=1.-smoothstep(R-.05,R+.01,r);
  float edge=exp(-pow((r-R)/.012,2.))*step(.001,change)*(1.-smoothstep(.9,1.,change/1.0));
  // a quiet lens: under the hand, the old world shows through
  float lr=length((uv-mouse)*vec2(ar,1.)); float lk=(1.-smoothstep(.085,.095,lr))*lens;
  k*=1.-lk;
  vec3 col=mix(before,after,k);
  col+=vec3(.55,.75,1.)*edge*.5;
  col=mix(col,vec3(.12,.42,1.),exp(-pow((lr-.09)/.0018,2.))*lens*.6);
  // haze: heavier before; always a clean wash where the words sit
  vec3 ground=vec3(.941,.965,1.);
  float haze=mix(.46,.18,k);
  float words=phone>.5? smoothstep(.42,.1,uv.y)*.86+smoothstep(.62,.98,uv.y)*.9 : smoothstep(.62,.08,uv.x)*.88;
  col=mix(col,ground,clamp(haze+words*(1.-haze),0.,.97));
  col=mix(col,ground,smoothstep(.55,1.2,length((uv-tagS)*vec2(ar,1.)*.9))*.5);
  col+=(h(uv*res+time)-.5)*.012;
  gl_FragColor=vec4(col,1.);}`;

export function world(canvas, hero) {
  const gl = canvas.getContext('webgl', { antialias: false });
  if (!gl) return;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['tA', 'tB', 'tM', 'res', 'tagS', 'anchor', 'scale', 'change', 'draw', 'amber', 'time', 'phone', 'lens', 'mouse'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const big = Math.max(innerWidth, innerHeight) * Math.min(devicePixelRatio, 2) > 1700 ? 2400 : 1600;
  const tex = (src, unit) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); res(); }; im.src = src; });
  const size = () => { const d = Math.min(devicePixelRatio, 1.5); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); };
  size(); addEventListener('resize', size);
  let mx = .5, my = .5, lens = 0, lensT = 0, landed = 0, on = true, ready = false, t0 = 0;
  addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; lensT = matchMedia('(hover: hover)').matches ? 1 : 0; }, { passive: true });
  hero.addEventListener('pointerleave', () => { lensT = 0; });
  hero.addEventListener('landed', () => { if (!landed) landed = performance.now(); });
  setTimeout(() => { if (!landed) landed = performance.now(); }, 4200);
  new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on && ready) requestAnimationFrame(loop); }).observe(hero);
  Promise.all([tex(`assets/scene/hall-after-${big}.webp`, 0), tex(`assets/scene/hall-before-${big}.webp`, 1), tex(`assets/scene/hall-masks-${big}.png`, 2)]).then(() => {
    gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); ready = true; t0 = performance.now(); canvas.classList.add('ready'); requestAnimationFrame(loop);
  });
  function loop(now) {
    if (!on) return;
    const phone = innerWidth < 900, fx = +hero.dataset.fx || (phone ? .5 : .69), fy = +hero.dataset.fy || (phone ? .5 : .52);
    const s = landed ? (now - landed) / 1000 : 0, sp = clamp(-hero.getBoundingClientRect().top / hero.offsetHeight);
    const change = landed ? clamp(1 - Math.pow(1 - clamp(s / 2.6), 3)) : 0;
    lens = lerp(lens, change >= 1 && sp < .2 ? lensT : 0, .08);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.tagS, fx, fy - sp * .08); gl.uniform2f(U.anchor, .481, .484);
    gl.uniform1f(U.scale, phone ? 1.5 : 1.45); gl.uniform1f(U.change, change);
    gl.uniform1f(U.draw, clamp((s - .5) / 2.2) * 1.03); gl.uniform1f(U.amber, clamp((s - 2.4) / .8));
    gl.uniform1f(U.time, now * .001); gl.uniform1f(U.phone, phone ? 1 : 0); gl.uniform1f(U.lens, lens); gl.uniform2f(U.mouse, mx, my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(loop);
  }
}
