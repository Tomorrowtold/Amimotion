# Renders AmIHub's light: a vertical beam that flares into a horn and lands on the dashboard's top edge,
# blue haze with a fine dot screen, and a vortex for the bento. Rendered on black, used with mix-blend-mode:screen.
import numpy as np
from PIL import Image
rng=np.random.default_rng(7)
def fbm(h,w,octaves=6,base=4,seed=0):
    r=np.random.default_rng(seed); out=np.zeros((h,w))
    amp=1.0; tot=0
    for o in range(octaves):
        n=base*2**o
        g=r.random((n+1,int(n*w/h)+1))
        im=Image.fromarray((g*255).astype(np.uint8)).resize((w,h),Image.BICUBIC)
        out+=amp*np.asarray(im,dtype=np.float32)/255; tot+=amp; amp*=.5
    return out/tot
def tone(acc,exp=1.0):
    return 1-np.exp(-acc*exp)
def save(rgb,path,q=82,grain=.012,seed=1):
    r=np.random.default_rng(seed)
    rgb=rgb+r.normal(0,grain,rgb.shape[:2])[...,None]
    rgb=np.clip(rgb,0,1)**(1/1.0)
    Image.fromarray((rgb*255).astype(np.uint8)).save(path,quality=q,method=6)

def beam(W=2400,H=1150,base=1030,x0=1200,path='beam.webp',haze=1.0):
    y,x=np.mgrid[0:H,0:W].astype(np.float32)
    d=np.clip(base-y,0,None)            # distance above the landing line
    below=np.clip(y-base,0,None)
    acc=np.zeros((H,W,3),np.float32)
    dx=x-x0
    # core: a hairline at the top, a horn at the base
    s=1.1+2600/(d+52)
    I=(0.55+ 9.0/(1+d/90))*np.exp(-dx**2/(2*s**2))*(y<=base)
    acc+=I[...,None]*np.array([.92,.95,1.0])
    # inner glow
    s2=7+5200/(d+120)
    I2=(0.30+1.6/(1+d/160))*np.exp(-dx**2/(2*s2**2))*(y<=base)
    acc+=I2[...,None]*np.array([.42,.56,1.0])
    # outer glow (wide, faint)
    s3=60+9000/(d+260)
    I3=(0.10+0.55/(1+d/240))*np.exp(-dx**2/(2*s3**2))*np.exp(-below/30)
    acc+=I3[...,None]*np.array([.22,.30,.95])
    # landing burst: violet-blue ellipse sitting on the edge, a white-hot centre
    e=np.exp(-(dx**2/(2*520**2)+(y-base)**2/(2*70**2)))
    acc+=1.10*e[...,None]*np.array([.42,.36,1.0])
    e2=np.exp(-(dx**2/(2*150**2)+(y-base)**2/(2*26**2)))
    acc+=2.4*e2[...,None]*np.array([1.0,.97,.95])
    # the lit edge: a hairline running along the dashboard top, fading out to the sides
    rim=np.exp(-(y-base)**2/(2*1.6**2))*np.exp(-dx**2/(2*640**2))
    acc+=2.0*rim[...,None]*np.array([.85,.9,1.0])
    rim2=np.exp(-(y-base)**2/(2*9**2))*np.exp(-dx**2/(2*800**2))
    acc+=.45*rim2[...,None]*np.array([.4,.5,1.0])
    # haze: clouds of deep blue, denser near the beam and to its right, with a fine dot screen
    if haze:
        n=fbm(H,W,7,3,seed=3); n2=fbm(H,W,5,2,seed=9)
        cloud=np.clip((n-.42)*2.6,0,1)**1.6
        mask=np.exp(-(dx-150)**2/(2*620**2))*np.clip(1-np.abs(y-base*0.45)/(base*0.85),0,1)
        mask+= .6*np.exp(-(dx**2/(2*700**2)+(y-base+160)**2/(2*220**2)))
        dots=((np.sin(x*np.pi/2.0)*np.sin(y*np.pi/2.0))>.35).astype(np.float32)
        hz=cloud*mask*(0.55+0.45*dots)*(0.7+.6*n2)
        acc+=haze*1.25*hz[...,None]*np.array([.16,.26,.82])
        acc+=haze*0.5*(cloud*mask)[...,None]*np.array([.30,.24,.70])*np.clip((dx+200)/900,0,1)[...,None]
    acc*=np.exp(-below/22)[...,None]*0.85+0.15*np.exp(-below/60)[...,None]
    rgb=tone(acc,1.15)
    save(rgb,path)

def vortex(S=1200,path='vortex.webp',warm=True):
    y,x=np.mgrid[0:S,0:S].astype(np.float32); c=S/2
    dx,dy=x-c,y-c; r=np.hypot(dx,dy)+1e-3; a=np.arctan2(dy,dx)
    acc=np.zeros((S,S,3),np.float32)
    # swirling rings: angle-dependent streaks, brightest at r0
    n=fbm(S,S,6,3,seed=11)
    swirl=0.5+0.5*np.sin(a*3+r/38+n*6)
    streak=0.5+0.5*np.sin(a*28+r/16+n*9)
    ring=np.exp(-(r-S*0.30)**2/(2*(S*0.075)**2))
    inner=np.exp(-(r-S*0.17)**2/(2*(S*0.04)**2))
    col_b=np.array([.12,.30,1.0]); col_v=np.array([.55,.40,1.0]); col_w=np.array([1.0,.62,.30])
    mixw=(0.5+0.5*np.cos(a-2.4))**3 if warm else 0*a
    base=(ring*(0.45+0.55*swirl)*(0.75+0.25*streak))[...,None]
    acc+=1.3*base*(col_b*(1-mixw[...,None])+col_w*mixw[...,None])
    acc+=0.6*(ring*swirl*(1-swirl))[...,None]*col_v
    acc+=0.8*inner[...,None]*np.array([.6,.7,1.0])
    dots=((np.sin(x*np.pi/2.2)*np.sin(y*np.pi/2.2))>.2).astype(np.float32)
    acc*=(0.86+0.14*dots)[...,None]
    hole=np.clip((r-S*0.11)/(S*0.03),0,1)
    acc*=hole[...,None]
    acc*=np.clip(1-(r-S*0.38)/(S*0.12),0,1)[...,None]
    rgb=tone(acc,0.95); save(rgb,path,grain=.01)

import sys,os
out=sys.argv[1]; os.makedirs(out,exist_ok=True)
beam(path=f'{out}/hub-beam.webp')
beam(W=2000,H=800,base=700,x0=1000,path=f'{out}/hub-beam-low.webp',haze=.7)
vortex(path=f'{out}/hub-vortex.webp')
vortex(path=f'{out}/hub-vortex-cool.webp',warm=False)
