import math
def hx(h): h=h.lstrip('#'); return [int(h[i:i+2],16)/255 for i in (0,2,4)]
def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def L(h): r,g,b=[lin(c) for c in hx(h)]; return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b): la,lb=sorted([L(a),L(b)],reverse=True); return (la+0.05)/(lb+0.05)
def oklch(h):
    r,g,b=[lin(c) for c in hx(h)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b; m=0.2119034982*r+0.6806995451*g+0.1073969566*b; s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[x**(1/3) for x in (l,m,s)]
    Lk=0.2104542553*l+0.7936177850*m-0.0040720468*s; a=1.9779984951*l-2.4285922050*m+0.4505937099*s; bb=0.0259040371*l+0.7827717662*m-0.8086757660*s
    C=math.hypot(a,bb); H=math.degrees(math.atan2(bb,a))%360
    return f"oklch({Lk*100:.1f}% {C:.3f} {H:.0f})"
def apca(txt,bg):
    def Y(h):
        r,g,b=[c**2.4 for c in hx(h)]; y=0.2126729*r+0.7151522*g+0.0721750*b
        return y if y>0.022 else y+(0.022-y)**1.414
    Yt,Yb=Y(txt),Y(bg)
    if Yb>Yt: S=(Yb**0.56-Yt**0.57)*1.14; return round((S-0.027)*100,1) if S>=0.1 else 0
    S=(Yb**0.65-Yt**0.62)*1.14; return round((S+0.027)*100,1) if S<=-0.1 else 0
import sys
T={'ground':'#f6f4ef','surface':'#eceae4','pressed':'#e2e0d9','ink':'#16181b','ink-soft':'#4a4e55','link':'#1f5fb8','located':'#66a5fa','waiting':'#f0a43a','hardware':'#3a3d42','white':'#ffffff','button-hover':'#2b2e33','located-ink':'#1f5fb8','waiting-ink':'#8a5208'}
for k,v in T.items(): print(f"{k:12} {v} {oklch(v)}")
pairs=[('ink','ground'),('ink','surface'),('ink-soft','ground'),('ink-soft','surface'),('link','ground'),('link','surface'),('ground','ink'),('ground','button-hover'),('located','ground'),('waiting','ground'),('located','white'),('waiting','white'),('hardware','ground'),('hardware','surface'),('surface','ground'),('pressed','ground'),('link','ink'),('waiting-ink','ground'),('located','hardware'),('waiting','hardware'),('ink','located'),('ink','waiting')]
for a,b in pairs: print(f"{a:12} on {b:12} {cr(T[a],T[b]):5.2f}:1  APCA Lc {apca(T[a],T[b])}")
for a in sys.argv[1:]: print(a, oklch(a), 'on ground', round(cr(a,T['ground']),2), apca(a,T['ground']))
