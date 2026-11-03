// One continuous scroll film over the model hall, told in beats: every scroll plays one picture,
// and the words on the left light up as the picture says them.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
// The plant as a lit 2.5D set: the render, a depth map of the same frame (depth, height above the floor, contact shadow),
// and the masks. The camera orbits on the depth (parallax), the lens pulls focus on real depth, a low mist lies on the floor
// at the height of the trolleys, and the light lands on the shapes (normals from depth), not on a flat picture.
export const FS = `precision highp float;varying vec2 v;
uniform sampler2D tA,tB,tM,tD,tN;uniform vec2 res,span,tagPos,bayC,waveC,foc,fog;uniform vec3 cam,par,clr;uniform vec4 vr;
uniform float draw,dash,amber,onlyQ,hidePaths,bay,tagOn,time,grey,wave,dof,sky,dOn,glow,warm,relit,lat,stop,mv,swp;
uniform vec4 spot,lpos;uniform vec3 ltgt;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n2(p);p=p*2.03+vec2(17.,9.);a*=.5;}return s;}
float lineAt(vec2 q){vec3 m=texture2D(tM,q).rgb;return step(.004,m.g)*m.r*(1.-smoothstep(draw-.015,draw+.015,m.g));}
void main(){
  vec2 uv=vec2(v.x,1.-v.y);
  vec2 iu=cam.xy+(uv-.5)*span/cam.z;
  // the orbit: find the point of the plant this moved camera sees here (the near things move more than the far)
  if(dOn>.5){vec2 s0=iu;for(int i=0;i<6;i++){float d=texture2D(tD,iu).r;iu=s0-par.xy*(d-par.z);}}
  vec3 G=dOn>.5?texture2D(tD,iu).rgb:vec3(.5,0.,1.);
  vec2 fu=(uv-vr.xy)/vr.zw; float tilt=smoothstep(.2,.56,abs(fu.y-.5))*1.6+smoothstep(.3,.62,abs(fu.x-.5))*.7;
  float sd0=length((iu-spot.xy)*vec2(.8,1.));float out0=smoothstep(spot.z,spot.z*1.9+.02,sd0)*spot.w;
  vec2 ld=(uv-lpos.xy)*res/res.y;float lr=length(ld);float inL=(1.-smoothstep(lpos.z-.0015,lpos.z,lr))*step(.001,lpos.w);
  vec2 liu=ltgt.xy+(uv-lpos.xy)*span/(cam.z*ltgt.z);
  iu=mix(iu,liu,inL);
  // the lens on real depth: what is nearer or farther than the focus goes soft
  float dz=abs(G.r-foc.x);float lb=mix(dOn>.5?clamp(dz*foc.y-.15,0.,2.4)+out0*1.1+mv*(.5+dz*1.5):tilt*dof+out0*1.6,0.,inL);
  vec3 A=texture2D(tA,iu,lb).rgb,B=texture2D(tB,iu,lb).rgb,M=texture2D(tM,iu).rgb;
  // crisp: where the lens is sharp, lift the plate's own fine detail (an unsharp mask against its softer mip)
  float shp=(1.-clamp(lb,0.,1.))*.55;A+=(A-texture2D(tA,iu,1.6).rgb)*shp;B+=(B-texture2D(tB,iu,1.6).rgb)*shp;
  float wd=length((iu-waveC)*vec2(.8,1.));
  float inW=(1.-smoothstep(wave-.05,wave,wd))*step(.001,wave);
  float onPath=step(.004,M.g)*M.r;
  float line=onPath*max(1.-smoothstep(draw-.015,draw+.015,M.g),inW)*(1.-hidePaths);
  float scans=onPath*(1.-smoothstep(.0,.035,abs(fract(M.g*5.+.5)-.5)))*dash*(1.-line);
  float am=step(.02,M.b)*max(amber,inW)*(onlyQ>.5?step(iu.x,.62):1.);
  float k=max(max(line,scans),am);
  vec3 col=mix(B,A,k);
  float front=onPath*exp(-pow((M.g-draw)/.02,2.))*(1.-hidePaths)*step(.01,draw)*step(draw,1.02);
  col=mix(col,vec3(.35,.62,1.),front*.8);
  float band=exp(-pow((wd-wave)/.018,2.))*step(.001,wave)*(1.-smoothstep(1.,1.25,wave));
  col=mix(col,vec3(.86,.92,1.),band*.55);col=mix(col,vec3(.3,.55,1.),band*onPath*.6);
  vec2 bd=(iu-bayC)*vec2(.8,1.25);float bl=length(bd);
  float inBay=(1.-smoothstep(bay-.035,bay+.02,bl))*step(.001,bay);
  col=mix(col,A,inBay);
  vec2 tp=(tagPos-cam.xy)/span*cam.z+.5; vec2 dp=(uv-tp)*res; float dd=length(dp)/(res.y*.001);
  float pulse=fract(time*.55);
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(8.,9.5,dd)));
  col=mix(col,vec3(.12,.42,1.),tagOn*(1.-smoothstep(0.,2.,abs(dd-(12.+pulse*60.))))*(1.-pulse)*.6);
  // light on the shapes: normals from the depth map; a high key from the roof, turning slowly with the film
  if(dOn>.5){
    vec3 N=normalize(texture2D(tN,iu).rgb*2.-1.);
    vec3 L=normalize(vec3(cos(relit)*.7,sin(relit)*.5-.35,.8));
    float df=clamp(dot(N,L),0.,1.),rim=pow(1.-clamp(N.z,0.,1.),2.);
    float lit=clamp(df*(.55+.45*G.b),0.,1.);
    // coloured light, like a studio model: sky-blue fill in the shade, a clean warm key on the faces turned to the roof
    vec3 shadeT=mix(vec3(.78,.84,1.),vec3(.86,.89,.97),grey),keyT=vec3(1.035,1.012,.985);
    col*=mix(shadeT,keyT,smoothstep(.15,.95,lit));col+=vec3(.75,.85,1.)*rim*.05*(1.-grey*.5);
    // Sky Ground: the floor takes a pale sky, the things standing on it stay white, so every shape stands out
    float up=smoothstep(.015,.11,G.g);col*=mix(mix(vec3(.885,.925,1.02),vec3(.93,.945,.985),grey),vec3(1.012,1.008,1.),up);
    // where the tag is known, a soft pool of located blue lies on the floor around it
    float pd=length((iu-tagPos)*vec2(.8,1.));float pool=step(.001,clr.z)*smoothstep(0.,.25,clr.z)*exp(-pow(pd/.06,2.))*(1.-up*.6);col=mix(col,col*vec3(.78,.87,1.12),pool*.7);
    // the plate's own contact shadows, a little deeper and cool: things sit on the floor
    col*=mix(vec3(.6,.66,.86),vec3(1.),.35+.65*G.b);
    // the focus light is a real light: it lands on the tops and faces turned to it
    float ins=1.-smoothstep(spot.z*.6,spot.z*1.3+.02,sd0);col+=vec3(1.,.97,.92)*ins*spot.w*(.03+.06*df)*(1.-inL);
  }
  // daylight through the roof: soft panes drift across the plant
  vec2 fl=mat2(.72,.69,-.62,.79)*(iu*vec2(1.,1.25));
  vec2 sq=fl+vec2(time*.004,time*.0012); vec2 sc=vec2(.3,.22); vec2 sl=mod(sq+sc*.5,sc)-sc*.5;
  vec2 sd=abs(sl)-vec2(.085,.03)+.03; float pane=1.-smoothstep(-.03,.05,length(max(sd,0.))+min(max(sd.x,sd.y),0.)-.03);
  col*=mix(vec3(1.),mix(vec3(.955,.968,1.0),vec3(1.025,1.012,.985),pane),sky);
  // the plant made legible: a fine coordinate lattice on the floor, spreading from the tag
  if(lat>.001&&dOn>.5){vec2 gq=.5-abs(fract(fl*42.)-.5);float th=.03*cam.z;float ln=1.-smoothstep(0.,th,gq.x)*smoothstep(0.,th,gq.y);
    float fd=length((iu-tagPos)*vec2(.8,1.)),reach=lat*1.4,onF=1.-smoothstep(.015,.06,G.g);
    float a=ln*onF*(1.-smoothstep(reach-.08,reach,fd))*(.2+.55*exp(-pow((fd-reach+.03)/.03,2.)));
    vec2 cq=.5-abs(fract(fl*42.)-.5);float node=(1.-smoothstep(0.,th*2.2,length(cq)))*onF*(1.-smoothstep(reach-.08,reach,fd));
    col=mix(col,vec3(.18,.42,1.),a*.7+node*.5);}
  // the paths are light: a soft bloom around each drawn line, its front brightest
  if(glow>.001){float gs=0.;for(int i=0;i<8;i++){float a=float(i)*.785+.39;vec2 o=vec2(cos(a),sin(a));gs+=lineAt(iu+o*.0035)+lineAt(iu+o*.008)*.6;}
    gs/=12.8;col+=vec3(.16,.38,1.)*gs*glow*.42*(1.-line*.6);col+=vec3(.3,.55,1.)*front*glow*.25;}
  // what waits glows warm on the floor and on the trolleys beside it
  if(warm>.001){float ws=0.;for(int i=0;i<8;i++){float a=float(i)*.785;vec2 o=vec2(cos(a),sin(a)*1.2);ws+=step(.02,texture2D(tM,iu+o*.012).b)+step(.02,texture2D(tM,iu+o*.026).b)*.7;}
    ws/=13.6;float wm=onlyQ>.5?step(iu.x,.62):1.;col=mix(col,col*vec3(1.08,.97,.84)+vec3(.06,.03,0.),ws*warm*wm*(.6+.4*G.g));}
  // cooler, quieter grade for "before"
  float g=dot(col,vec3(.299,.587,.114));col=mix(col,mix(vec3(g),col,.2)*vec3(.94,.955,.99),grey*(1.-k)*(1.-inBay)*.7);
  // a low mist lies on the floor at the height of the trolleys; the tag clears it from where it is
  if(fog.x>.001){
    float mist=fbm(iu*vec2(7.,9.)+vec2(time*.035,-time*.02))*.6+fbm(iu*vec2(19.,23.)-vec2(time*.05,0.))*.4;
    float lvl=fog.y*(.75+.5*mist);float f=fog.x*(1.-smoothstep(lvl*.35,lvl,G.g));
    float cd=length((iu-clr.xy)*vec2(.8,1.));f*=smoothstep(clr.z-.06,clr.z+.04,cd)+step(clr.z,.001);
    col=mix(col,mix(vec3(.84,.88,.97),vec3(.96,.97,1.),mist),clamp(f*(.55+.6*mist),0.,.86));
    float edge=exp(-pow((cd-clr.z)/.025,2.))*step(.001,clr.z)*fog.x;col=mix(col,vec3(.55,.68,1.),edge*.35);
  }
  // it stopped: the plant goes still and cool, one warm-red light falls on the trolley that stopped
  if(stop>.001){float sd=length((iu-tagPos)*vec2(.8,1.));float sp=exp(-pow(sd/.075,2.));float lum=dot(col,vec3(.299,.587,.114));
    col=mix(col,mix(vec3(lum),col,.35)*vec3(.9,.93,1.)*.94,stop*(1.-sp)*.75);
    col=mix(col,col*vec3(1.16,.8,.82)+vec3(.05,0.,0.),stop*sp*.8);
    float rr=exp(-pow((sd-.05-fract(time*.45)*.09)/.006,2.))*(1.-fract(time*.45));col=mix(col,vec3(.937,.231,.31),rr*stop*.5);}
  // the sheet of light that travels with each move, across the floor's own axis, catching the tops of things
  if(mv>.001){float bx=fl.x*1.15-mix(-.35,1.25,swp);float sh=exp(-bx*bx/.012)*mv;col+=vec3(.07,.09,.14)*sh*(.6+.8*G.g);}
  // waiting work warms the whole air a little
  col*=mix(vec3(1.),vec3(1.02,1.0,.965),warm*.6);
  float gq=dot(col,vec3(.299,.587,.114));col=mix(col,mix(vec3(gq),col,.25)*.42+vec3(.93,.95,.99)*.58,out0*(1.-inL)*.9);
  // the grade: a gentle S, cool in the shade, clean in the light
  col=mix(col,col*col*(3.-2.*col),.2);float lu=dot(col,vec3(.299,.587,.114));col*=mix(vec3(.93,.95,1.05),vec3(1.012,1.004,.99),smoothstep(.35,.85,lu));
  col=mix(col,col*1.03,inL);col*=1.-inL*smoothstep(lpos.z*.7,lpos.z,lr)*.07;
  float lsh=(1.-inL)*exp(-pow(max(0.,lr-lpos.z)/(.03),2.))*step(.001,lpos.w)*lpos.w;col*=1.-lsh*.12;
  col=mix(col,vec3(.93,.955,1.),smoothstep(.01,-.06,iu.y));
  vec2 pu=(uv-vr.xy)/vr.zw;float vg=smoothstep(.5,1.2,length((pu-.5)*vec2(1.2,1.)));col*=mix(vec3(1.),vec3(.94,.955,.995),vg);col+=vec3(.014,.016,.02)*(1.-smoothstep(0.,.9,length((pu-vec2(.18,.08))*vec2(1.,1.2))));
  col+=(h(floor(uv*res)+fract(time)*7.)-.5)*.014;
  gl_FragColor=vec4(col,1.);}`;

// ---------- the floor: everything found in the render itself ----------
export const T = [0.4792, 0.4848];      // the AmIGo rendered on the lone trolley's deck: the hero's tag lands here
export const LAND_Z = () => innerWidth > 900 ? 2.2 : 3.0;   // how close the landing is
export const WIDE = [0.5, 0.5, 1.0];                         // the whole plant, where the film opens
export const plateSize = () => { const px = Math.max(innerWidth, innerHeight * .8) * Math.min(devicePixelRatio, 2); return innerWidth > 900 ? (px > 1200 ? 2400 : 1600) : (px > 900 ? 1600 : 800); };
export const LOCK = { r: 15, len: 6, w: 2 };
// the plates, loaded to power-of-two sizes with mipmaps so the lens can soften them; the masks stay exact
export function plateTex(gl, src, unit, mip = true) {
  // decode and resize off the main thread (createImageBitmap), then upload one plate per frame, so the scroll never stalls
  const P2 = (n) => Math.min(4096, Math.pow(2, Math.round(Math.log2(n))));
  const upload = (el) => new Promise((res) => requestAnimationFrame(() => {
    const tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, el);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    if (el.close) el.close(); res();
  }));
  const viaImage = () => new Promise((res) => {
    const im = new Image(); im.decoding = 'async'; im.crossOrigin = 'anonymous';
    im.onload = () => { let el = im; if (mip) { const c = document.createElement('canvas'); c.width = P2(im.naturalWidth); c.height = P2(im.naturalHeight); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height); el = c; } upload(el).then(res); };
    im.src = src;
  });
  if (!globalThis.createImageBitmap) return viaImage();
  return fetch(src).then((r) => r.blob()).then((b) => createImageBitmap(b, { colorSpaceConversion: 'none' }).then((bm) => mip && (bm.width !== P2(bm.width) || bm.height !== P2(bm.height))
    ? createImageBitmap(b, { resizeWidth: P2(bm.width), resizeHeight: P2(bm.height), resizeQuality: 'high', colorSpaceConversion: 'none' }).then((r2) => { bm.close(); return r2; })
    : bm)).then(upload).catch(viaImage);
}
// the depth of the same frame: r = depth (near is bright), g = height above the floor, b = contact shadow.
// One image feeds the GPU (parallax, focus, mist, light) and the HUD (so every mark sits on the moved floor).
let depthP = null;
export function loadDepth(gl, unit) {
  if (!depthP) depthP = new Promise((res) => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => {
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
      const px = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height;
      const at = (u, v) => { const X = Math.max(0, Math.min(W - 1, Math.round(u * W - .5))), Y = Math.max(0, Math.min(H - 1, Math.round(v * H - .5))), i = (Y * W + X) * 4; return px[i] / 255; };
      res({ im, at });
    };
    im.onerror = () => res(null);
    im.src = `assets/scene/hall-depth-${innerWidth > 900 ? 1024 : 512}.png`;
  });
  return depthP.then((d) => {
    if (!d) return null;
    const tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, d.im);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    return new Promise((ok) => { const n = new Image(); n.decoding = 'async'; n.onload = () => { const tn = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit + 1); gl.bindTexture(gl.TEXTURE_2D, tn); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, n);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); ok(d.at); };
      n.onerror = () => ok(null); n.src = `assets/scene/hall-normal-${innerWidth > 900 ? 1024 : 512}.png`; });
  });
}
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

// ---------- the beats: one picture per scroll; each plays on its own clock once you reach it, then holds ----------
// sp = where the light falls [u, v, radius], sk = how far the rest falls back, lz = the lens on, lt = what it magnifies
// orbit = how the camera swings on the depth [x, y]; fd = what the lens focuses on; ap = how shallow the focus is;
// fog = the mist on the floor [amount, height]; clr = how far the tag has cleared it; glow = paths as light; warm = waits as light
const S0 = { cam: WIDE, draw: 1.03, dash: 0, amber: 1, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 0, sp: [T[0], T[1], .5], sk: 0, lz: 0, lt: [T[0], T[1]], orbit: [0, 0], fd: [T[0], T[1]], ap: 0, fog: [0, .2], clr: 0, glow: 0, warm: 0, lat: 0, stop: 0, lift: 0 };
const st = (o) => Object.assign({ draw: 0, dash: 0, amber: 0, onlyQ: 0, hide: 0, bay: 0, dot: 0, grey: 1, sp: [.5, .5, .6], sk: 0, lz: 0, lt: [T[0], T[1]], orbit: [0, 0], fd: [T[0], T[1]], ap: 2.2, fog: [.3, .2], clr: 0, glow: 0, warm: 0, lat: 0, stop: 0, lift: 0 }, o);
const WC = [.44, .82];
export const BEATS = [
  st({ ch: 0, cam: [.52, .55, 1.06], hide: 1, sp: [T[0], T[1], .09], sk: .55, orbit: [0.018, -0.007], ap: 2.4, fog: [.14, .2] }),          // Think of the last time someone went looking for a trolley.
  st({ ch: 0, cam: [.66, .6, 1.16], sp: [.8, .7, .14], sk: .5, orbit: [-0.021, -0.004], ap: 2.8, fog: [.16, .22] }),                     // The walk.
  st({ ch: 0, cam: [.6, .4, 1.16], sp: [.65, .3, .17], sk: .5, orbit: [0.000, 0.018], fd: STORES, ap: 3.2, fog: [.16, .22] }),              // The calls to stores.
  st({ ch: 0, cam: [.4, .5, 1.12], sp: [.3, .5, .15], sk: .5, orbit: [0.021, -0.006], ap: 2.8, fog: [.18, .22] }),                       // The second walk.
  st({ ch: 1, cam: [.4, .36, 1.22], sp: [.29, .26, .17], sk: .45, orbit: [-0.015, 0.011], fd: GATES[1], ap: 2.6, fog: [.22, .24] }),      // A scan tells you where it last passed.
  st({ ch: 1, cam: [.44, .42, 1.3], sp: [.29, .26, .13], sk: .6, orbit: [0.012, 0.015], fd: GATES[1], ap: 1.6, fog: [.96, .46] }),        // Between scans ... out of sight.
  st({ ch: 2, cam: [.48, .5, 1.9], sp: [T[0], T[1], .05], sk: .6, lz: 1, lt: T, orbit: [-0.011, -0.007], ap: 3, fog: [.96, .46], clr: .17 }),  // A small tag rides on each trolley,
  st({ ch: 2, cam: [.34, .46, 1.5], sp: [BIN[0], BIN[1], .05], sk: .6, lz: 1, lt: BIN, orbit: [0.013, -0.006], fd: BIN, ap: 3, fog: [.96, .46], clr: .32 }), // bin
  st({ ch: 2, cam: [.58, .36, 1.4], sp: [TOOL[0], TOOL[1], .05], sk: .6, lz: 1, lt: TOOL, orbit: [-0.012, 0.008], fd: TOOL, ap: 3, fog: [.96, .46], clr: .5 }), // and tool.
  st({ ch: 2, lift: 1, cam: [.56, .28, .82], sp: [.6, .17, .2], sk: .35, lz: 1, lt: [.8745, .2287], orbit: [0.012, 0.006], fd: [.8745, .2287], ap: 1.2, fog: [.96, .46], clr: .8, lat: .35 }), // Anchors on your columns
  st({ ch: 2, lift: 1, cam: [.55, .29, .8], sp: [.55, .3, .3], sk: .3, orbit: [0.000, 0.007], ap: .7, fog: [.96, .46], clr: 1.4, lat: 1 }),             // hear its signal.
  st({ ch: 3, cam: [.5, .5, 1.3], sp: [T[0], T[1], .07], sk: .6, orbit: [-0.014, -0.007], ap: 2.2, fog: [0, .46], clr: 1.4, lat: .5, stop: 1 }),         // A tag tells you where it stopped.
  st({ ch: 3, cam: [.5, .5, 1.0], draw: 1.03, grey: 0, sp: [.5, .5, .7], sk: 0, orbit: [0.021, 0.000], ap: .8, fog: [0, .2], glow: 1 }),  // One live map shows where it went
  st({ ch: 3, cam: [.48, .5, 1.36], draw: 1.03, grey: 0, sp: [T[0], T[1], .09], sk: .4, orbit: [-0.012, -0.009], ap: 2.2, fog: [0, .2], glow: 1 }), // and how long it has waited.
  st({ ch: 4, cam: [.55, .74, 1.3], draw: 1.03, amber: 1, grey: 0, sp: [WC[0], WC[1], .3], sk: .35, orbit: [0.018, -0.006], fd: WC, ap: 1.8, fog: [0, .2], glow: .5, warm: 1 }),  // See where work waits.
  st({ ch: 4, cam: [.55, .74, 1.3], draw: 1.03, amber: 1, grey: 0, sp: [WC[0], WC[1], .3], sk: .35, orbit: [-0.015, -0.010], fd: WC, ap: 2.2, fog: [0, .2], glow: .5, warm: 1 }),  // You see how long each one has waited,
  st({ ch: 4, cam: [.55, .74, 1.36], draw: 1.03, amber: 1, grey: 0, sp: [WC[0], WC[1], .3], sk: .35, orbit: [0.006, -0.014], fd: WC, ap: 2.4, fog: [0, .2], glow: .5, warm: 1 }), // while it is still waiting.
  st({ ch: 5, cam: [.48, .74, 1.2], draw: 1.03, amber: 1, onlyQ: 1, hide: 1, sp: [.41, .84, .17], sk: .85, orbit: [-0.018, -0.006], fd: [.42, .825], ap: 2.4, fog: [0, .2], warm: 1 }), // Ask your floor a question.
  st({ ch: 5, cam: [.48, .74, 1.2], draw: 1.03, amber: 1, onlyQ: 1, hide: 1, sp: [.41, .84, .17], sk: .85, orbit: [0.012, -0.011], fd: [.42, .825], ap: 2.4, fog: [0, .2], warm: 1 }), // Which trolleys ...?
];
export const NB = BEATS.length;
const SNAP = /[?&]still\b/.test(location.search); // screenshots: no easing lag
const FILM = /[?&]film\b/.test(location.search);  // recordings: the scroll position is the film's clock
const PLAY = .92;
export const REST = BEATS.map((_, i) => (i + .78) / NB);
export const CH_FIRST = [0, 1, 2, 3, 4, 5].map((c) => BEATS.findIndex((b) => b.ch === c));
const KEYS = ['cam', 'draw', 'dash', 'amber', 'onlyQ', 'hide', 'bay', 'dot', 'grey', 'sp', 'sk', 'lz', 'lt', 'orbit', 'fd', 'ap', 'fog', 'clr', 'glow', 'warm', 'lat', 'stop', 'lift'];

function sample(bf) {
  const b = Math.min(NB - 1, Math.floor(bf)), u = clamp(bf - b), a = b ? BEATS[b - 1] : S0, z = BEATS[b], k = sm(0, 1, u / PLAY);
  const o = {}; for (const key of KEYS) o[key] = Array.isArray(a[key]) ? a[key].map((x, j) => lerp(x, z[key][j], k)) : lerp(a[key], z[key], k);
  if (b === 12) o.draw = clamp(u / PLAY) * 1.03;    // the paths draw on a steady clock so their fronts read
  if (b === 0) { o.draw = 1.03; o.hide = sm(0, PLAY * .7, u); }
  // the light walks with the person
  if (b === 1 || b === 3) { const w = along(b === 1 ? WALK1 : WALK2, clamp(u / PLAY)); o.sp = [lerp(o.sp[0], w[0], k), lerp(o.sp[1], w[1], k), o.sp[2]]; o.fd = [lerp(o.fd[0], w[0], k), lerp(o.fd[1], w[1], k)]; }
  // the mist rises slowly between the scans, and the tag clears it in one widening ring
  if (b === 5) o.fog = [lerp(a.fog[0], z.fog[0], sm(0, 1, u / PLAY * .9)), lerp(a.fog[1], z.fog[1], sm(0, 1, u / PLAY))];
  return o;
}
// what each beat's words point at on the floor
function targetOf(b, k) {
  switch (b) {
    case 0: case 5: case 6: case 10: case 11: case 13: return T;
    case 1: return along(WALK1, k); case 3: return along(WALK2, k);
    case 2: return STORES; case 4: return GATES[1];
    case 7: return BIN; case 8: return TOOL; case 9: return ANCH[1];
    case 14: return WAITS[0]; case 15: return WAITS[1]; case 16: return WAITS[2];
    default: return null;
  }
}

export function story(section, canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['vr', 'tA', 'tB', 'tM', 'res', 'span', 'tagPos', 'bayC', 'waveC', 'cam', 'draw', 'dash', 'amber', 'onlyQ', 'hidePaths', 'bay', 'tagOn', 'time', 'grey', 'wave', 'dof', 'sky', 'spot', 'lpos', 'ltgt', 'tD', 'tN', 'par', 'foc', 'fog', 'clr', 'dOn', 'glow', 'warm', 'relit', 'lat', 'stop', 'mv', 'swp'].forEach((k) => U[k] = gl.getUniformLocation(pr, k));
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const big = plateSize();
  let ready = false, depthAt = null;
  Promise.all([plateTex(gl, `assets/scene/hall-after-${big}.webp`, 0), plateTex(gl, `assets/scene/hall-before-${big}.webp`, 1), plateTex(gl, `assets/scene/hall-masks-${big}.png`, 2, false), loadDepth(gl, 3).then((f) => { depthAt = f; })]).then(() => {
    gl.uniform1i(U.tD, 3); gl.uniform1i(U.tN, 4); gl.uniform1f(U.dOn, depthAt ? 1 : 0);
    gl.uniform1f(U.sky, 1); gl.uniform1i(U.tA, 0); gl.uniform1i(U.tB, 1); gl.uniform1i(U.tM, 2); gl.uniform4f(U.vr, 0, 0, 1, 1); gl.uniform1f(U.wave, 0); gl.uniform2f(U.waveC, T[0], T[1]); ready = true; canvas.classList.add('ready'); requestAnimationFrame(() => { gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]); gl.uniform3f(U.cam, .5, .5, 1); gl.drawArrays(gl.TRIANGLES, 0, 3); });
  });
  let span = [1, 1];
  const hud = section.querySelector('#storyHUD'), hctx = hud && hud.getContext('2d');
  // the film fills the screen on a desk: the light work is soft, so the GPU draws it a little under device resolution; the HUD stays sharp
  const size = () => { const d = Math.min(devicePixelRatio, 2), dh = Math.min(devicePixelRatio, 2); canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); const ra = canvas.width / canvas.height, ia = .8; span = ra > ia ? [1, ia / ra] : [ra / ia, 1]; if (hud) { hud.width = canvas.clientWidth * dh; hud.height = canvas.clientHeight * dh; } };
  section.classList.add('x3');   // the full-screen stage: set before the first measure, so the canvas is sized to it
  size(); addEventListener('resize', size);
  section.dataset.beats = NB;

  // the threads: a hairline from the words being read to the thing they name on the floor
  const sticky = section.querySelector('.story-sticky'), qEl = section.querySelector('.q-big');
  const NS = 'http://www.w3.org/2000/svg', thread = document.createElementNS(NS, 'svg'); thread.setAttribute('class', 'q-thread'); thread.setAttribute('aria-hidden', 'true');
  const tps = [0, 1, 2].map(() => { const g = document.createElementNS(NS, 'path'); g.setAttribute('pathLength', '1'); thread.appendChild(g); return g; });
  const tds = [0, 1, 2].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '3.5'); thread.appendChild(c); return c; });
  sticky.appendChild(thread);
  const wire = document.createElementNS(NS, 'svg'); wire.setAttribute('class', 'w-thread'); wire.setAttribute('aria-hidden', 'true');
  const wp = document.createElementNS(NS, 'path'); wp.setAttribute('pathLength', '1'); const wd = document.createElementNS(NS, 'circle'); wd.setAttribute('r', '2.6'); const ws = document.createElementNS(NS, 'circle'); ws.setAttribute('r', '2'); ws.setAttribute('class', 'ws');
  wire.append(wp, wd, ws); sticky.appendChild(wire);
  const caps = [...section.querySelectorAll('.cap')], links = [...section.querySelectorAll('.rail a')];
  const frags = [...section.querySelectorAll('[data-b]')].map((el) => [el, +el.dataset.b]);
  // each line of words carries a small key in the colour and shape of what it names on the floor
  const KEYS_OF = ['ink', 'ink', 'ink', 'ink', 'scan', 'scan', 'tag', 'tag', 'tag', 'anchor', 'tag', 'stop', 'map', 'wait', 'wait', 'wait', 'wait', 'wait', 'wait'];
  frags.forEach(([el, i]) => { el.dataset.k = KEYS_OF[i] || 'ink'; });
  const fragAt = (i) => { let el = null; for (const [e, j] of frags) if (j === i) el = e; return el; };
  links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); const top = section.getBoundingClientRect().top + scrollY + (section.offsetHeight - innerHeight) * REST[CH_FIRST[i]]; scrollTo({ top, behavior: 'smooth' }); }));
  let smooth = null, mx = 0, my = 0, qx = 0, qy = 0, beat = -1, lit = -1, disp = 0, last = 0, wk = 0, wb = -1;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  // ---- the haptic scroll: one gesture is one beat. A flick, a wheel notch, a swipe or a key moves the film exactly one
  // moment on, with a weighted ease (fast away, long soft landing); the momentum after it is absorbed so the film never
  // skips a moment. A short tick on phones that can feel it. At either end the page scrolls on natively.
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let anim = null, hold = 0, acc = 0, accT = 0;
  let geoC = null; const geo = () => { const top = section.getBoundingClientRect().top + scrollY; return (geoC = { top, len: section.offsetHeight - innerHeight }); };
  const G = () => geoC || geo(); addEventListener('resize', () => { geoC = null; }); if (document.fonts) document.fonts.ready.then(() => { geoC = null; });
  const restY = (i, g) => Math.round(g.top + g.len * REST[i]);
  const nearest = (g) => { const y = scrollY; let bi = 0, bd = 1e9; REST.forEach((_, i) => { const d = Math.abs(restY(i, g) - y); if (d < bd) { bd = d; bi = i; } }); return bi; };
  const inside = (g) => scrollY >= g.top - 2 && scrollY <= g.top + g.len + 2;
  const easeW = (x) => { const e = (1 - Math.pow(2, -8.5 * x)) / (1 - Math.pow(2, -8.5)); return e * (1 - Math.pow(1 - Math.min(1, x / .12), 2) * .0) * Math.min(1, .55 + x * 4.5) + (1 - Math.min(1, .55 + x * 4.5)) * e * e; };   // fast away, a long soft landing
  const glide = (y0, y1, ms) => { const t0 = performance.now(); anim = { y1 }; const tick = (now) => { if (!anim) return; const k = Math.min(1, (now - t0) / ms); scrollTo({ top: y0 + (y1 - y0) * easeW(k), behavior: 'instant' }); if (k < 1) requestAnimationFrame(tick); else { anim = null; hold = performance.now() + 260; } }; requestAnimationFrame(tick); };
  const stepBy = (dir) => {
    const g = G(), cur = anim ? REST.findIndex((_, i) => restY(i, g) === anim.y1) : nearest(g), nx = cur + dir;
    if (nx < 0 || nx >= NB) return false;   // the ends: let the page carry on
    const y0 = scrollY, y1 = restY(nx, g);
    glide(y0, y1, Math.min(1500, 900 + Math.abs(y1 - y0) * .35));
    if (navigator.vibrate) try { navigator.vibrate(9); } catch (e) {}
    return true;
  };
  // a new gesture is a wheel event after a quiet gap, or one clearly stronger than the momentum still arriving
  let lastAbs = 0, lastT = 0, armed = false, used = false;
  const onWheel = (e) => {
    const g = G(); if (!inside(g) || e.ctrlKey) return;
    const dir = Math.sign(e.deltaY); if (!dir) return;
    const cur = nearest(g); if ((dir < 0 && cur === 0 && scrollY <= restY(0, g) + 2) || (dir > 0 && cur === NB - 1 && scrollY >= restY(NB - 1, g) - 2)) return;
    e.preventDefault();
    const now = performance.now(), ab = Math.abs(e.deltaY), fresh = now - lastT > 260 || (ab > lastAbs * 1.6 && ab > 14);
    lastAbs = ab; lastT = now;
    if (fresh) { used = false; acc = 0; }
    if (anim || used) return;            // during the move, and the rest of the same gesture: absorbed
    acc += e.deltaY;
    if (Math.abs(acc) > 24) { used = true; stepBy(dir); }
  };
  let ty = null;
  const onTS = (e) => { ty = inside(G()) ? e.touches[0].clientY : null; };
  const onTM = (e) => { if (ty === null) return; const g = G(), dy = ty - e.touches[0].clientY, cur = nearest(g); if ((dy < 0 && cur === 0) || (dy > 0 && cur === NB - 1)) { ty = null; return; } e.preventDefault(); };
  const onTE = (e) => { if (ty === null) return; const dy = ty - (e.changedTouches[0] || {}).clientY; ty = null; if (Math.abs(dy) > 28 && !anim) stepBy(Math.sign(dy)); };
  const onKey = (e) => { const g = G(); if (!inside(g) || anim || e.target.closest('input,textarea,select')) return; const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? (e.shiftKey && e.key === ' ' ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0; if (dir && stepBy(dir)) e.preventDefault(); };
  // the listeners that can hold the page are attached only while the film is on screen, so the rest of the page scrolls free
  const arm = (on) => {
    if (on === armed || REDUCE || SNAP || FILM) return; armed = on; const f = on ? addEventListener : removeEventListener;
    f('wheel', onWheel, { passive: false }); f('touchstart', onTS, { passive: true }); f('touchmove', onTM, { passive: false }); f('touchend', onTE); f('keydown', onKey);
  };
  return (t) => {
    const dt = Math.min(.1, last ? (t - last) / 1000 : 0); last = t;
    const r = section.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight)), sf = Math.min(NB - .0001, p * NB), pinned = r.top <= 1 || section.classList.contains('pre-on');
    // the scroll only chooses the moment; once a moment is reached it plays out on its own clock and then stops
    const sb = Math.floor(sf), target = Math.min(NB - .0001, sb + clamp((sf - sb) / .1) * .999);
    if (FILM) disp = Math.max(0, Math.min(NB - .0001, sf)); else if (SNAP || !pinned) disp = target; else { const dd = target - disp, rate = Math.max(.45, Math.abs(dd) * 1.5); disp += Math.sign(dd) * Math.min(Math.abs(dd), rate * dt); }
    arm(r.top < innerHeight * .5 && r.bottom > innerHeight * .5);
    const bf = disp, bNow = Math.floor(bf), ch = BEATS[bNow].ch;
    // the words: the chapter shows, and its words light up as their picture starts
    const lb = pinned ? bNow : -1;
    if (bNow !== beat || lb !== lit) {
      beat = bNow; lit = lb;
      caps.forEach((c, i) => { const on = pinned && i === ch; c.classList.toggle('on', on); links[i] && links[i].classList.toggle('on', on); });
      frags.forEach(([el, i]) => { el.classList.toggle('lit', i <= lb); el.classList.toggle('now', i === lb); el.classList.toggle('past', i < lb); });
    }
    // the chapter bar: each chapter fills as its moments play
    links.forEach((a, i) => { const f0 = CH_FIRST[i], f1 = i + 1 < CH_FIRST.length ? CH_FIRST[i + 1] : NB; a.style.setProperty('--f', clamp((bf - f0) / (f1 - f0)).toFixed(3)); });
    if (!ready) return;
    const s = sample(bf);
    if (!smooth || SNAP) smooth = JSON.parse(JSON.stringify(s)); else for (const k in s) smooth[k] = Array.isArray(s[k]) ? s[k].map((x, j) => lerp(smooth[k][j], x, .065)) : lerp(smooth[k], s[k], .065);
    const desk = innerWidth > 900, full = desk && section.classList.contains('x3');
    // a full screen is wider than the old panel: the camera comes in closer so each beat frames the same thing
    // every move between two moments is one camera move with weight: it swings on the depth, breathes out and back in,
    // softens while it travels and lands sharp; a sheet of light crosses the floor with it
    const kk = clamp((bf - Math.floor(bf)) / PLAY), swing = bf > .5 ? Math.sin(Math.PI * sm(0, 1, kk)) : 0, sdir = Math.floor(bf) % 2 ? 1 : -1;
    const z = smooth.cam[2] * (full ? lerp(1, 1.12, sm(0, .7, bf)) : 1) * (1 - .075 * swing), hx = span[0] / z / 2, hy = span[1] / z / 2;
    const pk = clamp(bf / .5); qx = lerp(qx, mx * pk, .05); qy = lerp(qy, my * pk, .05);
    // on a desk the film fills the screen and the words sit on the left: the subject is framed right of centre
    const FX = full ? .15 * sm(0, .7, bf) : 0;
    const cx = clamp(smooth.cam[0] - FX * span[0] / z + qx * .008 / z, hx, 1 - hx), cy = clamp(smooth.cam[1] + qy * .008 / z, hy - .1 * smooth.lift, 1 - hy);
    // the orbit: the camera swings on the plant's depth around what it looks at; it breathes, and leans with the hand
    const pz = depthAt ? depthAt(smooth.fd[0], smooth.fd[1]) : .5;
    const ox = sdir * .032 * swing + smooth.orbit[0] * sm(0, .6, bf) + Math.sin(t * .00023) * .006 + qx * .03, oy = .014 * swing + smooth.orbit[1] * sm(0, .6, bf) + Math.cos(t * .00019) * .004 + qy * .02;
    const pj = (u, v) => { const dz = depthAt ? depthAt(u, v) - pz : 0; return [(u + ox * dz - cx) * z / span[0] + .5, (v + oy * dz - cy) * z / span[1] + .5]; };
    // the lens: it sits in the emptier side of the frame, away from what it magnifies
    const toUV = pj;
    const [lu, lv] = toUV(...smooth.lt), asp = canvas.width / canvas.height, LR = desk ? .15 : .13;
    const LP = [clamp(lu + (lu > .5 ? -.3 : .3) / asp * 1.25, LR / asp + .04, 1 - LR / asp - .04), clamp(lv + (lv > .45 ? -.26 : .26), LR + .05, 1 - LR - .05)];
    const lzk = sm(.05, .95, smooth.lz);
    gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.span, span[0], span[1]);
    gl.uniform3f(U.cam, cx, cy, z); gl.uniform2f(U.tagPos, T[0], T[1]); gl.uniform2f(U.bayC, .40, .80);
    gl.uniform1f(U.draw, smooth.draw); gl.uniform1f(U.dash, smooth.dash); gl.uniform1f(U.amber, smooth.amber); gl.uniform1f(U.onlyQ, smooth.onlyQ > .5 ? 1 : 0);
    gl.uniform1f(U.hidePaths, smooth.hide); gl.uniform1f(U.bay, 0); gl.uniform1f(U.tagOn, 0); gl.uniform1f(U.grey, smooth.grey); gl.uniform1f(U.time, t * .001); gl.uniform1f(U.dof, desk ? 1 : .6);
    gl.uniform4f(U.spot, smooth.sp[0], smooth.sp[1], smooth.sp[2], smooth.sk);
    gl.uniform4f(U.lpos, LP[0], LP[1], LR * eo(lzk), lzk); gl.uniform3f(U.ltgt, smooth.lt[0], smooth.lt[1], 2.4);
    gl.uniform3f(U.par, ox, oy, pz); gl.uniform2f(U.foc, pz, smooth.ap * (desk ? 1 : .7) * 1.8);
    gl.uniform2f(U.fog, smooth.fog[0], smooth.fog[1]); gl.uniform3f(U.clr, T[0], T[1], smooth.clr);
    gl.uniform1f(U.lat, smooth.lat); gl.uniform1f(U.stop, smooth.stop); gl.uniform1f(U.mv, swing); gl.uniform1f(U.swp, sm(0, 1, kk)); gl.uniform1f(U.glow, smooth.glow); gl.uniform1f(U.warm, smooth.warm); gl.uniform1f(U.relit, 2.2 + bf * .09 + Math.sin(t * .0002) * .15);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (hctx) drawHUD(hctx, bf, t * .001, cx, cy, z, span, { lp: LP, lr: LR * eo(lzk), lz: lzk, lt: smooth.lt, sp: smooth.sp }, pj);

    // the thread from the words to the floor
    const cr = canvas.getBoundingClientRect(), sr = sticky.getBoundingClientRect(), sc = cr.width / canvas.width;
    const Pc = (u, v) => { const q = pj(u, v); return [q[0] * canvas.width * sc + cr.left - sr.left, q[1] * canvas.height * sc + cr.top - sr.top]; };
    const u0 = clamp(bf - bNow), tg = desk && pinned ? targetOf(bNow, clamp(u0 / PLAY)) : null, el = tg && fragAt(lb);
    if (bNow !== wb) { wb = bNow; wk = 0; }
    wk = SNAP ? 1 : Math.min(1, wk + dt / .7);
    if (!el) wire.style.opacity = 0; else {
      const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter((o) => o.width > 1), q = rs[rs.length - 1] || el.getBoundingClientRect();
      const sx = q.right - sr.left + 14, sy = q.top - sr.top + q.height * .56, [ex, ey] = Pc(tg[0], tg[1]);
      const gx = cr.left - sr.left - 18, kx = Math.max(sx + 20, gx);
      wp.setAttribute('d', `M ${sx} ${sy} L ${kx} ${sy} C ${kx + (ex - kx) * .45} ${sy}, ${ex - (ex - kx) * .2} ${ey}, ${ex} ${ey}`);
      const k = eo(wk); wp.style.strokeDashoffset = 1 - k; wd.setAttribute('cx', ex); wd.setAttribute('cy', ey); wd.style.opacity = k > .97 ? 1 : 0; ws.setAttribute('cx', sx - 6); ws.setAttribute('cy', sy);
      wire.style.opacity = sm(.02, .25, u0) * (bNow >= 17 ? 0 : 1);
    }
    // the question's threads, from the words to the three answers
    const ta = clamp((bf - 18.02) / .1);
    if (ta <= 0 || !qEl || !desk) thread.style.opacity = 0; else {
      const k = eo((bf - 18.05) / .5);
      const q = qEl.getBoundingClientRect(), sx = q.right - sr.left + 18, sy = q.top - sr.top + q.height * .45;
      WAITS.slice(0, 3).forEach(([u, v], i) => {
        const [ex, ey] = Pc(u, v), mx = sx + (ex - sx) * .55;
        tps[i].setAttribute('d', `M ${sx} ${sy} C ${mx} ${sy}, ${ex - 60} ${ey}, ${ex} ${ey}`);
        const ki = clamp(k * 1.25 - i * .12); tps[i].style.strokeDashoffset = 1 - ki; tds[i].setAttribute('cx', ex); tds[i].setAttribute('cy', ey); tds[i].style.opacity = ki > .98 ? 1 : 0;
      });
      thread.style.opacity = ta;
    }
  };
}

/* ---------- shared with the landing: every tag located, and the lock on the trolley ---------- */
const RED = '239,59,79', INDIGO = '75,61,240', INK = '11,18,56', BLUE = '31,107,255', AMB = '255,176,32';
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

/* ---------- the story layer: no words, no numbers; only fine light, line and motion ---------- */
function along(path, k) { const n = path.length - 1, u = clamp(k) * n, i = Math.min(n - 1, Math.floor(u)), f = u - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; }
function floorRing(x, X, Y, r, s) { x.beginPath(); x.ellipse(X, Y, r * s, r * .62 * s, -.5, 0, 7); }
function brackets(x, X, Y, r, len, s) {
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const cx = X + dx * r, cy = Y + dy * r; x.beginPath(); x.moveTo(cx, cy - dy * len * s); x.lineTo(cx, cy); x.lineTo(cx - dx * len * s, cy); x.stroke(); }
}
// a precise reticle: a fine ring in four arcs, ticks outside it, a point at its centre; it closes in as it arrives
function reticle(x, X, Y, r, k, s, col, a = 1, spin = 0) {
  if (k <= 0 || a <= 0) return; const e = eo(k), R = r * s * (1 + (1 - e) * .9);
  x.save(); x.globalAlpha = a * e; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1.15 * s;
  for (let i = 0; i < 4; i++) { const a0 = spin + i * 1.5708 + .2; x.beginPath(); x.arc(X, Y, R, a0, a0 + 1.17); x.stroke(); }
  x.lineWidth = 1 * s; for (let i = 0; i < 4; i++) { const an = spin + i * 1.5708 - .19; x.beginPath(); x.moveTo(X + Math.cos(an) * (R + 3 * s), Y + Math.sin(an) * (R + 3 * s)); x.lineTo(X + Math.cos(an) * (R + 8 * s), Y + Math.sin(an) * (R + 8 * s)); x.stroke(); }
  x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(X, Y, 1.6 * s, 0, 7); x.fill(); x.restore();
}
// a located point: small, exact, with a hairline halo
function point(x, X, Y, k, s, col, a = 1, big = 1) {
  if (k <= 0 || a <= 0) return; const e = eo(Math.min(1, k * 1.8));
  x.save(); x.globalAlpha = a;
  if (k < 1) { x.globalAlpha = a * (1 - k) * .5; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1 * s; floorRing(x, X, Y, 6 + k * 30, s); x.stroke(); x.globalAlpha = a; }
  x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.arc(X, Y, 4.6 * s * e * big, 0, 7); x.fill();
  x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(X, Y, 2.9 * s * e * big, 0, 7); x.fill(); x.restore();
}
// a comet: the last stretch of a path in fading light, its head a soft point
function comet(x, P, path, k, s, a, col, tail = .4) {
  if (k <= 0 || a <= 0) return; const N = 90, k0 = Math.max(0, k - tail);
  x.save(); x.lineCap = 'round';
  // the whole way so far, very faint
  x.globalAlpha = a * .22; x.strokeStyle = `rgb(${col})`; x.lineWidth = 1 * s; x.setLineDash([1.5 * s, 4 * s]); x.beginPath();
  for (let i = 0; i <= N; i++) { const [X, Y] = P(...along(path, k * i / N)); i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); x.setLineDash([]);
  // every step of the way so far, pressed into the floor as a soft worn track
  x.globalAlpha = a * .2; x.lineWidth = 12 * s; x.beginPath(); for (let i = 0; i <= N; i++) { const [X, Y] = P(...along(path, k * i / N)); i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke();
  // footsteps: small marks every stride
  x.fillStyle = `rgb(${col})`; for (let q = 0; q < k; q += .018) { const [X, Y] = P(...along(path, q)); x.globalAlpha = a * .55 * (q > k0 ? 1 : .6); x.beginPath(); x.arc(X, Y, 2.1 * s, 0, 7); x.fill(); }
  for (let i = 1; i <= N; i++) { const q0 = lerp(k0, k, (i - 1) / N), q1 = lerp(k0, k, i / N), [X0, Y0] = P(...along(path, q0)), [X1, Y1] = P(...along(path, q1)); x.globalAlpha = a * Math.pow(i / N, 1.6) * .95; x.lineWidth = (1 + 2.6 * i / N) * s; x.beginPath(); x.moveTo(X0, Y0); x.lineTo(X1, Y1); x.stroke(); }
  const [HX, HY] = P(...along(path, k)); const g = x.createRadialGradient(HX, HY, 0, HX, HY, 14 * s); g.addColorStop(0, `rgba(${col},.32)`); g.addColorStop(1, `rgba(${col},0)`);
  x.globalAlpha = a; x.fillStyle = g; x.beginPath(); x.arc(HX, HY, 14 * s, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.arc(HX, HY, 4.4 * s, 0, 7); x.fill(); x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(HX, HY, 2.8 * s, 0, 7); x.fill();
  x.restore();
}
// a person looking: a soft fan of sight on the floor that sweeps once across the aisle and finds nothing
function gaze(x, X, Y, dir, k, s, a, col) {
  if (k <= 0 || k >= 1 || a <= 0) return; const R = 90 * s * eo(k * 1.6), sw = .55, an = dir + Math.sin(k * 6.283) * .9;
  x.save(); x.globalAlpha = a * Math.sin(k * 3.1416) * .8;
  const g = x.createRadialGradient(X, Y, 0, X, Y, R); g.addColorStop(0, `rgba(${col},.28)`); g.addColorStop(1, `rgba(${col},0)`);
  x.fillStyle = g; x.beginPath(); x.moveTo(X, Y); x.ellipse(X, Y, R, R * .62, 0, an - sw, an + sw); x.closePath(); x.fill();
  x.strokeStyle = `rgba(${col},.35)`; x.lineWidth = 1 * s; x.beginPath(); x.ellipse(X, Y, R, R * .62, 0, an - sw, an + sw); x.stroke();
  x.restore();
}
// waiting: a fine amber ring on the floor, its arc filling with the time
function waitRing(x, X, Y, R, w, s, a, t, live, i) {
  if (a <= 0) return; x.save(); x.globalAlpha = a;
  const g = x.createRadialGradient(X, Y, 0, X, Y, R * 1.3); g.addColorStop(0, `rgba(${AMB},${.16 + .05 * Math.sin(t * 1.6 + i)})`); g.addColorStop(1, `rgba(${AMB},0)`);
  x.fillStyle = g; x.beginPath(); x.ellipse(X, Y, R * 1.3, R * .8, -.5, 0, 7); x.fill();
  x.strokeStyle = `rgba(${AMB},.28)`; x.lineWidth = 1 * s; x.beginPath(); x.ellipse(X, Y, R, R * .62, -.5, 0, 7); x.stroke();
  const a0 = -1.9, sw = 6.283 * clamp(w); x.strokeStyle = `rgb(${AMB})`; x.lineWidth = 2 * s; x.lineCap = 'round'; x.beginPath(); x.ellipse(X, Y, R, R * .62, -.5, a0, a0 + sw); x.stroke();
  // the arc's leading end keeps creeping while the work keeps waiting
  const ex = X + Math.cos(a0 + sw) * R * Math.cos(-.5) - Math.sin(a0 + sw) * R * .62 * Math.sin(-.5), ey = Y + Math.cos(a0 + sw) * R * Math.sin(-.5) + Math.sin(a0 + sw) * R * .62 * Math.cos(-.5);
  x.fillStyle = `rgb(${AMB})`; x.beginPath(); x.arc(ex, ey, (2.6 + live * .8 * (1 + Math.sin(t * 3 + i))) * s, 0, 7); x.fill();
  x.restore();
}

// how long it has waited, as a structure: a column of amber glass rising from the floor where the work stands,
// its height the time, fine ticks up its edge, a lit cap that keeps creeping while the work still waits
function pillar(x, X, Y, h, s, a, t, live, i) {
  if (a <= 0) return; const w = 22 * s, H = Math.max(2 * s, h); x.save(); x.globalAlpha = a;
  const g0 = x.createRadialGradient(X, Y, 0, X, Y, w * 2.6); g0.addColorStop(0, `rgba(${AMB},.34)`); g0.addColorStop(1, `rgba(${AMB},0)`);
  x.fillStyle = g0; x.beginPath(); x.ellipse(X, Y, w * 2.6, w * 1.4, 0, 0, 7); x.fill();
  // two faces of the column, lit from the roof: the left a touch brighter
  const gl = x.createLinearGradient(0, Y, 0, Y - H); gl.addColorStop(0, `rgba(${AMB},.62)`); gl.addColorStop(.7, `rgba(${AMB},.22)`); gl.addColorStop(1, `rgba(${AMB},.08)`);
  const gr = x.createLinearGradient(0, Y, 0, Y - H); gr.addColorStop(0, 'rgba(232,140,10,.55)'); gr.addColorStop(.7, 'rgba(232,140,10,.18)'); gr.addColorStop(1, 'rgba(232,140,10,.06)');
  x.fillStyle = gl; x.beginPath(); x.moveTo(X - w, Y - w * .5); x.lineTo(X, Y); x.lineTo(X, Y - H); x.lineTo(X - w, Y - H - w * .5); x.closePath(); x.fill();
  x.fillStyle = gr; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + w, Y - w * .5); x.lineTo(X + w, Y - H - w * .5); x.lineTo(X, Y - H); x.closePath(); x.fill();
  // the cap: a lit lozenge
  x.fillStyle = 'rgba(255,236,190,.95)'; x.beginPath(); x.moveTo(X - w, Y - H - w * .5); x.lineTo(X, Y - H); x.lineTo(X + w, Y - H - w * .5); x.lineTo(X, Y - H - w); x.closePath(); x.fill();
  x.strokeStyle = `rgb(${AMB})`; x.lineWidth = 1 * s; x.stroke();
  // edges and the time scale
  x.strokeStyle = 'rgba(214,128,0,.7)'; x.lineWidth = .9 * s; x.beginPath(); x.moveTo(X, Y); x.lineTo(X, Y - H); x.moveTo(X - w, Y - w * .5); x.lineTo(X - w, Y - H - w * .5); x.moveTo(X + w, Y - w * .5); x.lineTo(X + w, Y - H - w * .5); x.stroke();
  x.strokeStyle = 'rgba(214,128,0,.55)'; for (let k = 10 * s, j = 1; k < H; k += 10 * s, j++) { const L = (j % 6 ? 3 : 7) * s; x.beginPath(); x.moveTo(X - w, Y - k - w * .5); x.lineTo(X - w - L, Y - k - w * .5 + L * .5); x.stroke(); }
  // still waiting: the cap breathes
  if (live > 0) { x.globalAlpha = a * live * (.35 + .35 * Math.sin(t * 2.4 + i)); x.strokeStyle = `rgb(${AMB})`; x.lineWidth = 1 * s; x.beginPath(); x.ellipse(X, Y - H - w * .5, w * 1.6, w * .8, 0, 0, 7); x.stroke(); }
  x.restore();
}

function drawHUD(x, bf, t, cx, cy, z, span, L, pj) {
  const W = x.canvas.width, H = x.canvas.height, d = W / Math.max(1, x.canvas.clientWidth), s = Math.min(Math.max(H / 760, .8), 2.2) * (W < 700 ? .9 : 1);
  const P = pj ? (u, v) => { const q = pj(u, v); return [q[0] * W, q[1] * H]; } : (u, v) => [((u - cx) * z / span[0] + .5) * W, ((v - cy) * z / span[1] + .5) * H];
  const lp = (i) => clamp((bf - i) / PLAY);
  const win = (a, b, f = .25) => clamp((bf - a) / f) * clamp((b - bf) / f);
  x.clearRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round';

  // the landing holds for a moment: every tag located, the lock on the trolley; then they go out one by one
  const out = clamp(bf / (PLAY * .7));
  if (out < 1) drawLanding(x, P, d, (i) => 1 - clamp(out * 2.2 - (MOVERS.length - i) * .09), 1 - clamp(out * 1.8), out * .8);
  const [TX, TY] = P(T[0], T[1]);

  // ---- Search ----
  let a = win(.1, 4.1);
  if (a > 0) {
    // the one they are looking for: we can see it, they cannot
    const lost = sm(.3, .8, bf) * (1 - sm(3.7, 4, bf));
    if (lost > 0) { x.save(); x.globalAlpha = a * lost * .75; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s; x.setLineDash([2 * s, 5 * s]); x.lineDashOffset = -t * 5; floorRing(x, TX, TY, 24, s); x.stroke(); x.setLineDash([]); x.restore(); }
    const k1 = lp(1), k3 = lp(3);
    if (k1 > 0 && k3 <= 0) comet(x, P, WALK1, k1, s, a * (1 - sm(1.85, 2.2, bf) * .6), INK, .35);
    if (k3 > 0) comet(x, P, WALK2, k3, s, a, INK, .3);
    // where they stop and look: a quick hairline ripple, nothing found
    [[LOOK1, k1, WALK1, 2.1], [LOOK2, k3, WALK2, 4.1]].forEach(([Lk, k, path, end]) => { if (bf > end) return; Lk.forEach(([u, v, at]) => { const kk = k * (path.length - 1) - at; if (kk < 0 || kk > 1.6) return; const [X, Y] = P(u, v); const [NX, NY] = P(...path[Math.min(path.length - 1, at + 1)]); gaze(x, X, Y, Math.atan2(NY - Y, NX - X) + 1.2, kk / 1.6, s, a, INK); x.save(); x.globalAlpha = a * (1 - kk / 1.6) * .6; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s; floorRing(x, X, Y, 10 + eo(kk / 1.6) * 30, s); x.stroke(); x.restore(); }); });
    // the calls to stores: a fine arc out, rings at the racks, nothing comes back
    const k2 = lp(2), [WX, WY] = P(...WALK1[WALK1.length - 1]), [SX, SY] = P(...STORES);
    if (k2 > 0 && bf < 3.8) {
      const ca = a * (1 - sm(3.2, 3.7, bf)), kk = eo(k2 * 1.4), mx = (WX + SX) / 2 - 50 * s, my = Math.min(WY, SY) - 30 * s;
      x.save(); x.globalAlpha = ca * .7; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s;
      x.beginPath(); for (let i = 0; i <= 40 * kk; i++) { const q = i / 40, X = (1 - q) * (1 - q) * WX + 2 * (1 - q) * q * mx + q * q * SX, Y = (1 - q) * (1 - q) * WY + 2 * (1 - q) * q * my + q * q * SY; i ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke();
      for (let j = 0; j < 3; j++) { const q = ((t * .55 + j / 3) % 1) * kk, X = (1 - q) * (1 - q) * WX + 2 * (1 - q) * q * mx + q * q * SX, Y = (1 - q) * (1 - q) * WY + 2 * (1 - q) * q * my + q * q * SY; x.globalAlpha = ca * Math.sin(q / kk * 3.14); x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(X, Y, 2 * s, 0, 7); x.fill(); }
      for (let j = 0; j < 3; j++) { const ph = (t * .7 + j / 3) % 1; x.globalAlpha = ca * (1 - ph) * .55 * sm(.5, .8, k2); x.beginPath(); floorRing(x, SX, SY, 8 + ph * 42, s); x.stroke(); }
      point(x, WX, WY, 1, s, INK, ca * (k3 > 0 ? 0 : 1));
      x.restore();
    }
    // found, at last: the ring closes on the trolley
    const f = sm(.8, 1, k3); if (f > 0) { x.save(); x.globalAlpha = a * f; x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1.4 * s; x.beginPath(); x.ellipse(TX, TY, 24 * s, 15 * s, -.5, -1.6, -1.6 + 6.283 * f); x.stroke(); x.restore(); }
  }

  // ---- Scans: two checkpoints catch a moment each; after them, the trolley is out of sight ----
  a = win(4, 6.1);
  if (a > 0) {
    const G = GATES.map(([u, v]) => P(u, v)), k4 = lp(4), k5 = lp(5);
    x.save(); x.globalAlpha = a;
    const k1 = eo((k4 - .25) / .5);
    // the gates: two fine posts and a curtain of light between them
    G.forEach(([X, Y], i) => {
      const hit = clamp((k4 - (i ? .72 : .2)) / .25), flash = hit > 0 && hit < 1 ? Math.sin(hit * 3.14) : 0;
      const gr = x.createLinearGradient(X, Y - 74 * s, X, Y); gr.addColorStop(0, `rgba(${BLUE},0)`); gr.addColorStop(1, `rgba(${BLUE},${.22 + flash * .45 + (hit >= 1 ? .1 : 0)})`);
      x.fillStyle = gr; x.beginPath(); x.moveTo(X - 15 * s, Y - 9 * s - 70 * s); x.lineTo(X + 15 * s, Y + 9 * s - 70 * s); x.lineTo(X + 15 * s, Y + 9 * s); x.lineTo(X - 15 * s, Y - 9 * s); x.closePath(); x.fill();
      x.strokeStyle = `rgba(${INK},.75)`; x.lineWidth = 1.2 * s; for (const dd of [-1, 1]) { x.beginPath(); x.moveTo(X + dd * 15 * s, Y + dd * 9 * s); x.lineTo(X + dd * 15 * s, Y + dd * 9 * s - 70 * s); x.stroke(); }
      x.strokeStyle = `rgba(${BLUE},${.6 + flash * .4})`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(X - 15 * s, Y - 9 * s); x.lineTo(X + 15 * s, Y + 9 * s); x.stroke();
      if (flash > 0) { x.globalAlpha = a * (1 - hit) * .7; x.strokeStyle = `rgb(${BLUE})`; floorRing(x, X, Y, 10 + hit * 50, s); x.stroke(); x.globalAlpha = a; }
    });
    // the trolley as the scans see it: a point that moves only between the gates
    if (k1 > 0) { x.strokeStyle = `rgba(${INK},.55)`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(G[0][0], G[0][1]); x.lineTo(lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)); x.stroke(); }
    if (k5 <= 0) { const mv = k4 < .25 ? G[0] : [lerp(G[0][0], G[1][0], k1), lerp(G[0][1], G[1][1], k1)]; point(x, mv[0], mv[1], 1, s, INK, a); }
    // after the last scan: its trace thins out and is lost in the haze
    if (k5 > 0) {
      const N = 22, ke = eo(k5 * 1.3); x.strokeStyle = `rgb(${INK})`; x.lineWidth = 1 * s;
      for (let i = 0; i < N * ke; i++) { const q0 = i / N, q1 = (i + .5) / N; x.globalAlpha = a * .6 * Math.pow(1 - q0, 2); x.beginPath(); x.moveTo(lerp(G[1][0], TX, q0 * .8), lerp(G[1][1], TY, q0 * .8)); x.lineTo(lerp(G[1][0], TX, q1 * .8), lerp(G[1][1], TY, q1 * .8)); x.stroke(); }
      x.globalAlpha = a * sm(.4, .9, k5) * .5; x.setLineDash([2 * s, 5 * s]); x.lineDashOffset = -t * 5; floorRing(x, TX, TY, 30 + Math.sin(t * 1.3) * 3, s); x.stroke(); x.setLineDash([]);
    }
    x.restore();
    // the shift as one hairline: two moments seen, the rest unseen
    const kt = eo(k4 * 1.6);
    if (kt > 0) {
      const bw = W * .56, bx = (W - bw) / 2, by = H - 34 * s, head = clamp(k4 * .45 + k5 * .55);
      x.save(); x.globalAlpha = a * kt;
      x.strokeStyle = `rgba(${INK},.16)`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + bw, by); x.stroke();
      for (let i = 0; i <= 24; i++) { const X = bx + bw * i / 24; x.beginPath(); x.moveTo(X, by - (i % 6 ? 2 : 5) * s); x.lineTo(X, by); x.stroke(); }
      x.strokeStyle = `rgba(${INK},.55)`; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + bw * Math.min(head, .45), by); x.stroke();
      if (head > .45) { x.setLineDash([2 * s, 5 * s]); x.strokeStyle = `rgba(${INK},.3)`; x.beginPath(); x.moveTo(bx + bw * .45, by); x.lineTo(bx + bw * head, by); x.stroke(); x.setLineDash([]); }
      [.2, .45].forEach((m) => { if (head < m) return; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.6 * s; x.beginPath(); x.moveTo(bx + bw * m, by - 9 * s); x.lineTo(bx + bw * m, by + 3 * s); x.stroke(); });
      x.fillStyle = `rgb(${INK})`; x.beginPath(); x.arc(bx + bw * head, by, 2.4 * s, 0, 7); x.fill();
      x.restore();
    }
  }

  // ---- Tag: on the trolley, a bin, a tool; anchors on the columns; the signal; found ----
  a = win(6, 11.1);
  if (a > 0) {
    const k6 = lp(6), k7 = lp(7), k8 = lp(8), k9 = lp(9), k10 = lp(10), AP = ANCH.map(([u, v]) => P(u, v));
    const tagged = [[T, k6], [BIN, k7], [TOOL, k8]];
    tagged.forEach(([m, k], i) => { const [X, Y] = P(...m), cur = Math.floor(bf) === 6 + i; reticle(x, X, Y, 13, k, s, INDIGO, a * (cur ? 1 : .0), t * .2); point(x, X, Y, k * 1.2, s, INDIGO, a); });
    if (k8 > .4) MOVERS.slice(4).forEach((m, i) => point(x, ...P(...m), clamp((k8 - .4) * 2.4 - i * .1), s * .8, INDIGO, a * .8));
    // ---- the anchors and the tag, step by step ----
    // 1. the anchors: a small device high on each column, a plumb line to the floor so you see it hangs up there, listening
    const AF = AP.map(([X, Y]) => [X, Y + 64 * s]);   // where its column meets the floor, on screen
    AP.forEach(([X, Y], i) => {
      const on = eo((k9 - i * .18) / .45); if (on <= 0) return; const [FX, FY] = AF[i];
      x.save(); x.globalAlpha = a * on;
      const pl = x.createLinearGradient(X, Y, FX, FY); pl.addColorStop(0, `rgba(${INDIGO},.5)`); pl.addColorStop(1, `rgba(${INDIGO},0)`);
      x.strokeStyle = pl; x.lineWidth = 1 * s; x.setLineDash([2 * s, 3 * s]); x.beginPath(); x.moveTo(X, Y + 9 * s); x.lineTo(FX, FY * on + Y * (1 - on)); x.stroke(); x.setLineDash([]);
      x.globalAlpha = a * on * .5; x.fillStyle = `rgb(${INDIGO})`; x.beginPath(); x.ellipse(FX, FY, 9 * s, 4 * s, 0, 0, 7); x.fill();
      // the device: a dark rounded body with a lit indigo face and a status light
      x.globalAlpha = a * on; const w = 22 * s, h = 15 * s;
      x.shadowColor = 'rgba(11,18,56,.35)'; x.shadowBlur = 10 * s; x.shadowOffsetY = 3 * s;
      x.fillStyle = '#1b2036'; x.beginPath(); x.roundRect(X - w / 2, Y - h / 2, w, h, 4 * s); x.fill(); x.shadowColor = 'transparent';
      const fg = x.createLinearGradient(X, Y - h / 2, X, Y + h / 2); fg.addColorStop(0, 'rgba(255,255,255,.22)'); fg.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = fg; x.beginPath(); x.roundRect(X - w / 2 + 1.5 * s, Y - h / 2 + 1.5 * s, w - 3 * s, h * .45, 3 * s); x.fill();
      const blink = .55 + .45 * Math.sin(t * 3 + i * 2);
      x.fillStyle = `rgba(${BLUE},${blink})`; x.beginPath(); x.arc(X + w / 2 - 5 * s, Y + h / 2 - 5 * s, 1.8 * s, 0, 7); x.fill();
      // listening: a slow, faint arc opening downward toward the floor
      for (let j = 0; j < 2; j++) { const ph = (t * .35 + j / 2 + i * .3) % 1; x.globalAlpha = a * on * (1 - ph) * .4; x.strokeStyle = `rgb(${INDIGO})`; x.lineWidth = 1 * s; x.beginPath(); x.arc(X, Y, (14 + ph * 26) * s, .35, 2.8); x.stroke(); }
      x.restore();
    });
    // 2. the tag sends one short pulse; it spreads as a sphere of light; it reaches the nearest anchor first
    if (k10 > 0) {
      const D = AP.map(([X, Y]) => Math.hypot(X - TX, Y - TY)), Dm = Math.max(...D);
      // a sequence that plays once as you arrive, then repeats slowly while you stay: pulse, answers, ranges, the fix
      const cyc = k10 < 1 ? k10 : 1 + ((t * .16) % 1), q = cyc % 1 || (cyc >= 1 ? 1 : 0), first = k10 < 1;
      const R = (first ? sm(.02, .42, k10) : sm(0, .4, q)) * Dm * 1.08;
      x.save();
      if (R > 0 && R < Dm * 1.07) {
        x.globalAlpha = a * (1 - R / (Dm * 1.1)) * .9;
        const rg = x.createRadialGradient(TX, TY, Math.max(0, R - 26 * s), TX, TY, R); rg.addColorStop(0, `rgba(${BLUE},0)`); rg.addColorStop(1, `rgba(${BLUE},.16)`);
        x.fillStyle = rg; x.beginPath(); x.arc(TX, TY, R, 0, 7); x.fill();
        x.strokeStyle = `rgba(${BLUE},.75)`; x.lineWidth = 1.3 * s; x.beginPath(); x.arc(TX, TY, R, 0, 7); x.stroke();
        x.globalAlpha = a * .7; x.strokeStyle = `rgba(${BLUE},.6)`; floorRing(x, TX, TY, Math.min(R / s * .5, 60), s); x.stroke();
      }
      // 3. each anchor hears it the moment the sphere arrives: it lights, and the line between them is drawn
      AP.forEach(([X, Y], i) => {
        const hitR = D[i] / (Dm * 1.08), hk = first ? sm(.02, .42, k10) : sm(0, .4, q), heard = hk >= hitR, since = heard ? (hk - hitR) : 0;
        const lineK = first ? clamp((k10 - .1 - hitR * .4) / .25) : (cyc >= 1 ? 1 : 0);
        if (lineK > 0) {
          const gr = x.createLinearGradient(TX, TY, X, Y); gr.addColorStop(0, `rgba(${BLUE},.85)`); gr.addColorStop(1, `rgba(${INDIGO},.85)`);
          x.globalAlpha = a; x.strokeStyle = gr; x.lineWidth = 1.4 * s; x.beginPath(); x.moveTo(TX, TY); x.lineTo(lerp(TX, X, eo(lineK)), lerp(TY, Y, eo(lineK))); x.stroke();
          // the time of flight, as fine ticks along the line: farther anchor, more ticks
          const n = Math.round(D[i] / (26 * s)); x.lineWidth = 1 * s; x.strokeStyle = `rgba(${INDIGO},.55)`;
          const nx = -(Y - TY) / D[i], ny = (X - TX) / D[i];
          for (let j = 1; j < n * eo(lineK); j++) { const f = j / n, px = lerp(TX, X, f), py = lerp(TY, Y, f), L = (j % 5 ? 2.5 : 5) * s; x.beginPath(); x.moveTo(px - nx * L, py - ny * L); x.lineTo(px + nx * L, py + ny * L); x.stroke(); }
        }
        if (heard && since < .25) { x.globalAlpha = a * (1 - since / .25); x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 2 * s; x.beginPath(); x.arc(X, Y, (12 + since * 120) * s, 0, 7); x.stroke(); }
      });
      // 4. three distances, three arcs: where they cross, the tag is; the fix closes on it
      const ak = first ? sm(.5, .78, k10) : 1;
      if (ak > 0) AP.forEach(([X, Y], i) => {
        const an = Math.atan2(TY - Y, TX - X), sp = Math.min(.3, 70 * s / D[i]) * ak;
        x.globalAlpha = a * .85; x.strokeStyle = `rgba(${INDIGO},.75)`; x.lineWidth = 1.2 * s;
        x.beginPath(); x.arc(X, Y, D[i], an - sp, an + sp); x.stroke();
        x.globalAlpha = a * .25; x.lineWidth = 6 * s; x.strokeStyle = `rgba(${BLUE},.5)`; x.beginPath(); x.arc(X, Y, D[i], an - sp * .5, an + sp * .5); x.stroke();
      });
      const fix = first ? eo((k10 - .78) / .2) : 1;
      if (fix > 0) {
        x.globalAlpha = a * fix; x.strokeStyle = `rgb(${BLUE})`; x.lineWidth = 1.8 * s; brackets(x, TX, TY, (40 - fix * 24) * s, 6, s);
        const g = x.createRadialGradient(TX, TY, 0, TX, TY, 22 * s); g.addColorStop(0, `rgba(${BLUE},.45)`); g.addColorStop(1, `rgba(${BLUE},0)`); x.fillStyle = g; x.beginPath(); x.arc(TX, TY, 22 * s, 0, 7); x.fill();
        point(x, TX, TY, 1, s, BLUE, a * fix, 1.3);
      }
      x.restore();
    }
  }
  // the lens's rim and its leader to what it magnifies
  if (L && L.lz > .01) {
    const lx = L.lp[0] * W, ly = L.lp[1] * H, lr = L.lr * H, [GX, GY] = P(...L.lt), an = Math.atan2(GY - ly, GX - lx);
    x.save(); x.globalAlpha = L.lz;
    x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 3 * s; x.beginPath(); x.arc(lx, ly, lr, 0, 7); x.stroke();
    x.strokeStyle = `rgba(${INK},.22)`; x.lineWidth = 1 * s; x.beginPath(); x.arc(lx, ly, lr + 2 * s, 0, 7); x.stroke();
    x.strokeStyle = `rgba(${INDIGO},.9)`; x.lineWidth = 1.4 * s; x.beginPath(); x.arc(lx, ly, lr + 2 * s, an - .35, an + .35); x.stroke();
    x.strokeStyle = `rgba(${INK},.35)`; x.lineWidth = 1 * s; x.beginPath(); x.moveTo(lx + Math.cos(an) * (lr + 2 * s), ly + Math.sin(an) * (lr + 2 * s)); x.lineTo(GX - Math.cos(an) * 16 * s, GY - Math.sin(an) * 16 * s); x.stroke();
    x.restore();
  }

  // ---- Paths: where it stopped; where it went; how long it has waited ----
  a = win(11, 14.1);
  if (a > 0) {
    const k = lp(11), land = clamp((k - .35) / .4);
    x.save(); x.globalAlpha = a;
    if (land > 0) for (let j = 0; j < 2; j++) { const ph = ((t * .4 + j / 2) % 1); x.strokeStyle = `rgba(${RED},${.45 * (1 - ph) * land * (1 - lp(12) * .7)})`; x.lineWidth = 1 * s; floorRing(x, TX, TY, 10 + ph * 50, s); x.stroke(); }
    x.restore();
    reticle(x, TX, TY, 22, k, s, RED, a * (1 - lp(12) * .5), 0);
    point(x, TX, TY, clamp(k * 1.4), s, RED, a, 1.15);
    const k13 = lp(13); if (k13 > 0 && bf < 14.2) pillar(x, TX, TY, 110 * s * eo(k13), s, a * eo(k13 * 2) * (1 - sm(13.9, 14.2, bf)), t, sm(.5, 1, k13), 9);
  }

  // ---- Waits: fine amber rings on the floor, filling, then creeping on while the work still waits ----
  a = win(13.9, 19.2);
  WAITS.forEach(([u, v, w], i) => {
    const k = eo((lp(14) - i * .12) / .5); if (a * k <= 0) return; const [X, Y] = P(u, v);
    const ask = bf > 17 ? (i < 3 ? 1 : .2) : 1, grow = eo(lp(15));
    pillar(x, X, Y, 260 * s * (w * k * (.55 + .45 * grow) + lp(16) * ((t * .004) % .06)), s, a * ask, t, lp(16), i);
  });
  // the answer: a reticle settles on each of the three that match
  a = win(18, 19.2, .3);
  if (a > 0) WAITS.slice(0, 3).forEach(([u, v], i) => { const [X, Y] = P(u, v); reticle(x, X, Y, 40, clamp((lp(18) - .15 - i * .12) / .45), s, AMB, a, t * .15 + i); });
}
