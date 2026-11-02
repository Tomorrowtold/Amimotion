# mk.py: grade one Higgsfield still in a world look, crop, and write AVIF+WebP sizes into assets/worlds
# usage: python3 mk.py out-name STILL family x0,y0,x1,y1 w1,w2,...   (crop in fractions of the image)
import sys, subprocess, os
from PIL import Image
S='/tmp/claude-0/-home-user-amimotion/8b097efb-53ac-5a96-a52a-383fd66ce4a0/scratchpad'
H='/mnt/project-files/website-top/shared-assets/studio/higgsfield/stills/'
name,still,fam,crop,ws=sys.argv[1:6]
tmp=f'{S}/g/{still}-{fam}.jpg'
if not os.path.exists(tmp): subprocess.run(['python3',f'{S}/lg/site/tools/grade.py',H+still+'.png',tmp,fam,'2752'],check=True)
im=Image.open(tmp).convert('RGB'); W,Hh=im.size
x0,y0,x1,y1=[float(v) for v in crop.split(',')]
c=im.crop((int(x0*W),int(y0*Hh),int(x1*W),int(y1*Hh)))
out=f'{S}/lg/site/src/assets/worlds/'
for w in [int(v) for v in ws.split(',')]:
    r=c.resize((w,round(c.height*w/c.width)),Image.LANCZOS) if w<c.width else c
    r.save(out+f'{name}-{w}.webp',quality=80,method=6); r.save(out+f'{name}-{w}.avif',quality=55)
print(name,c.size,'ratio',round(c.width/c.height,3))
