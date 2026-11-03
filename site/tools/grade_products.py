import numpy as np, sys, subprocess
from PIL import Image, ImageFilter
H='/mnt/project-files/website-10x/asset-team/'
ST=H+'studio/higgsfield/stills/'; HG=H+'higgsfield/'
OUT='/home/user/amimotion/site/src/assets/products/'
def lin(a): return a/255.
def curve(x, lift=0., gain=1., gamma=1., contrast=0.):
    x=np.clip(x,0,1)
    if contrast: x=x+contrast*(x-x*x)*(2*x-1)*-1  # s-curve-ish
    x=np.clip(lift+(gain-lift)*x,0,1)**gamma
    return x
def scurve(x,k):
    return np.clip(0.5+(x-0.5)*(1+k)-k*4*(x-0.5)**3,0,1)
def sat(a,s):
    l=(a*[.2126,.7152,.0722]).sum(-1,keepdims=True); return np.clip(l+(a-l)*s,0,1)
def vignette(a,k):
    h,w=a.shape[:2]; y,x=np.ogrid[:h,:w]; r=np.sqrt(((x-w/2)/(w/2))**2+((y-h/2)/(h/2))**2)/1.414
    return a*(1-k*r[...,None]**2)
def amigo(a):  # Sky Ground: airy, cool, lifted, indigo-touched shadows, warm-free
    a=sat(a,.62); l=(a*[.2126,.7152,.0722]).sum(-1,keepdims=True)
    sh=np.array([.30,.33,.62]); hi=np.array([.97,.985,1.0])
    a=a*.55+ (sh*(1-l)+hi*l)*.45*l + sh*(1-l)*.08
    a=scurve(a,.18); a=curve(a,lift=.06,gain=1.0,gamma=.92)
    return a
def amimo(a):  # black & white, rich, deep blacks
    l=(a*[.25,.68,.07]).sum(-1,keepdims=True); l=scurve(l,.55); l=curve(l,lift=0.0,gamma=1.12)
    l=vignette(l,.35); return np.repeat(l,3,-1)
def amihub(a):  # near-black graphite, cool, a hint of blue in the light
    l=(a*[.2126,.7152,.0722]).sum(-1,keepdims=True)
    l=np.clip(scurve(l,.35),0,1)**1.45*.82
    base=np.repeat(l,3,-1)*np.array([.86,.92,1.0])
    blue=np.array([.35,.55,1.0])*np.clip(l-.45,0,1)**1.2*.55
    c=np.clip(base+blue,0,1); c=sat(c*0+c,.9); c=vignette(c,.55); return np.clip(c,0,1)
def isi(a):  # technical: cool steel, desaturated, slight teal-blue, clean
    a=sat(a,.35); a=a*[.94,.98,1.06]; a=scurve(a,.25); a=curve(a,lift=.03,gamma=1.0); return np.clip(a,0,1)
G={'amigo':amigo,'amimo':amimo,'amihub':amihub,'isi':isi}
def save(img,name,sizes):
    for w in sizes:
        im=img if img.width<=w else img.resize((w,round(img.height*w/img.width)),Image.LANCZOS)
        im.save(f'{OUT}{name}-{w}.webp',quality=80,method=6)
        im.save(f'{OUT}{name}-{w}.avif',quality=58)
def still(src,grade,name,sizes=(800,1600,2400),crop=None):
    im=Image.open(src).convert('RGB')
    if crop: W,Hh=im.size; im=im.crop((int(crop[0]*W),int(crop[1]*Hh),int(crop[2]*W),int(crop[3]*Hh)))
    a=np.asarray(im).astype(np.float32)/255; a=G[grade](a) if grade else a
    save(Image.fromarray((np.clip(a,0,1)*255+.5).astype(np.uint8)),name,sizes)
JOBS=[
 (ST+'P-products-amigo-take2.png','amigo','amigo-trolley'),
 (HG+'C5-trolley-plate.png','amigo','amigo-plate'),
 (ST+'M-solutions-wip.png','amigo','amigo-hand'),
 (ST+'P-use-cases-find-the-asset.png','amigo','amigo-find'),
 (ST+'P-industries-warehousing.png','amigo','amigo-vehicle'),
 (ST+'M-industries.png','amigo','amigo-tool'),
 (ST+'M-products-amimo.png','amimo','amimo-column'),
 (ST+'P-products-amimo.png','amimo','amimo-floor'),
 (ST+'P-tools-anchors.png','amimo','amimo-survey'),
 (ST+'P-products-amihub.png','amihub','hub-cabinet'),
 (ST+'P-use-cases-ask-your-plant.png','amihub','hub-ask'),
 (ST+'F1-T-kf-take2.png','amihub','hub-top'),
 (ST+'P-industrial-spatial-intelligence.png','isi','isi-plant'),
 (ST+'F1-T-kf-take2.png','isi','isi-top'),
 (ST+'P-learn-wip-visibility.png','isi','isi-wip'),
]
import os; os.makedirs(OUT,exist_ok=True)
only=sys.argv[1:]
for s,g,n in JOBS:
    if only and n not in only: continue
    still(s,g,n); print(n)
# Shiv's still (anchor hero), ungraded
if not only or 'amimo-hero' in only:
    still('/root/.claude/uploads/e261a963-f42e-536a-9acb-10721e35857f/3f2e5cb7-hf_20261102_054140_f950a3e7-5729-4428-a85c-5cba1121e9fe.png',None,'amimo-hero',(1200,2000,2688)); print('hero')
