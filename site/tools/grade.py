"""AmIMotion inner-page grade: one shared base + six family looks.
Usage: python3 grade.py in.png out.jpg FAMILY [width]
Shared base (every still): orange beams -> steel grey, filmic curve, indigo-tinted blacks,
sky-tinted whites, one saturation ceiling, yellow floor lines kept as the amber accent, fine grain.
Family = highlight tint, shadow tint, contrast, exposure, saturation."""
import sys, numpy as np
from PIL import Image

def rgb2hsv(c):
    r,g,b=c[...,0],c[...,1],c[...,2]; mx=c.max(-1); mn=c.min(-1); d=mx-mn+1e-8
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))/6
    s=np.where(mx>0,(mx-mn)/(mx+1e-8),0); return np.stack([h,s,mx],-1)
def hsv2rgb(x):
    h,s,v=x[...,0]*6,x[...,1],x[...,2]; i=np.floor(h).astype(int)%6; f=h-np.floor(h)
    p=v*(1-s);q=v*(1-s*f);t=v*(1-s*(1-f))
    r=np.choose(i,[v,q,p,p,t,v]);g=np.choose(i,[t,v,v,q,p,p]);b=np.choose(i,[p,p,t,v,v,q])
    return np.stack([r,g,b],-1)
hexc=lambda h:np.array([int(h[i:i+2],16) for i in (1,3,5)])/255
INK=hexc('#0b1238'); SKY=hexc('#f4f8ff')

FAM={ # exposure EV, contrast, saturation, lift RGB (shadow tint), gain RGB (highlight tint), black lift into ink
 'steel':  (0.00,1.14,0.50,(-0.010,0.010,0.060),(0.93,0.98,1.07),0.030),  # products, platform, technology: cold blue metal
 'shift':  (0.08,1.06,0.80,( 0.000,0.010,0.030),(1.06,1.00,0.90),0.035),  # solutions, industries: warm working daylight
 'floor':  (-0.06,1.22,0.78,( 0.010,0.035,0.030),(1.07,1.00,0.88),0.020), # use cases: grey-green shadows, warm highs, deep
 'paper':  (0.10,0.86,0.58,( 0.065,0.058,0.048),(1.00,0.97,0.91),0.060),  # learn: matte print, warm paper
 'morning':(0.38,0.92,0.68,( 0.030,0.045,0.085),(0.96,1.00,1.06),0.040),  # start, pilot, buying, tools: airy sky
 'studio': (0.00,1.10,0.76,( 0.025,0.000,0.045),(1.06,1.00,0.91),0.030),  # company, trust, films: golden, plum shadows
}
def grade(img,fam,seed=7):
    ev,con,sat,lift,gain,blk=FAM[fam]
    x=np.asarray(img.convert('RGB')).astype(np.float32)/255
    x=np.clip((x**2.2)*(2**ev),0,1)**(1/2.2)
    hsv=rgb2hsv(x); h,s=hsv[...,0]*360,hsv[...,1]
    # shared: orange rack beams and forklifts -> steel grey
    orange=np.clip(1-np.abs(h-22)/20,0,1)*np.clip((s-0.18)/0.2,0,1)
    # shared: yellow floor lines and hi-vis = the amber 'waiting' accent, kept and unified to #ffb020
    yel=np.clip(1-np.abs(h-52)/14,0,1)*np.clip((s-0.30)/0.2,0,1)
    s2=s*sat*(1-0.95*orange)
    s2=s2*(1-yel)+np.minimum(s*1.0,0.92)*yel
    h2=h*(1-0.7*yel)+39*0.7*yel
    hsv[...,0],hsv[...,1]=h2/360,s2
    y=hsv2rgb(hsv)
    # shared filmic curve
    y=np.clip(0.5+(y-0.5)*con,0,1); y=y*y*(3-2*y)*0.4+y*0.6
    # family lift/gain
    L=np.array(lift,np.float32); Gn=np.array(gain,np.float32)
    y=np.clip((y+L*(1-y))*Gn,0,1)
    # shared: blacks sit in AmIMotion ink, whites in sky
    y=INK*blk+y*(1-blk)
    lum=(0.2126*y[...,0]+0.7152*y[...,1]+0.0722*y[...,2])[...,None]
    y=y*(1-0.02*lum)+SKY*0.02*lum
    H,W=y.shape[:2]; yy,xx=np.mgrid[0:H,0:W]; r=np.sqrt(((xx-W/2)/(W/2))**2+((yy-H/2)/(H/2))**2)
    y=y*(1-0.10*np.clip(r-0.5,0,1)[...,None])
    rng=np.random.default_rng(seed); g=rng.normal(0,0.016,(H,W,1)).astype(np.float32)
    y=y+g*(0.5+0.5*(1-lum))
    return Image.fromarray((np.clip(y,0,1)*255).astype(np.uint8))

if __name__=='__main__':
    src,dst,fam=sys.argv[1:4]; w=int(sys.argv[4]) if len(sys.argv)>4 else 1600
    im=Image.open(src); im.thumbnail((w,w*2)); grade(im,fam).save(dst,quality=86)
