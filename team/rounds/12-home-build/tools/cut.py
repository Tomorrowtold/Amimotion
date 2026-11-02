"""Cut homepage stand-in stills from existing Sky Ground renders (no new pixels, crops only)."""
import sys
from PIL import Image
A='/home/user/amimotion/site/src/assets/'
F='/home/user/amimotion/team/rounds/03-hero-film/frames_sky/'
def save(im, base, widths, q_avif=55, q_webp=78):
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(f'{A}{base}-{w}.avif', quality=q_avif, speed=4)
        r.save(f'{A}{base}-{w}.webp', quality=q_webp, method=6)
        print(base, w, h)
import os
os.makedirs(A+'home/find', exist_ok=True); os.makedirs(A+'home/jobs', exist_ok=True)
# S2 Find it, "Scan" state: hero film frame 95 (3.8 s, the before state: checkpoint ticks only), camera A, 4:5
save(Image.open(F+'f0095.png').convert('RGB'), 'home/find/scan-4x5', (800, 1200, 1600))
# S3 inline queue crop: the three amber trolleys of the inspection queue, from hall-waits-3840
w = Image.open(A+'hall/hall-waits-3840.webp').convert('RGB')
save(w.crop((1140, 1290, 2420, 1930)), 'home/queue-chip', (240, 480), q_avif=60)
# footer Keep exploring tiles: four camera A crops of hall-all-3840 (press, racks, inspection, staging), 4:3
a = Image.open(A+'hall/hall-all-3840.webp').convert('RGB')
for name, box in {'press': (0, 120, 1440, 1200), 'racks': (1500, 0, 2940, 1080),
                  'inspection': (1240, 1080, 2680, 2160), 'staging': (2240, 900, 3680, 1980)}.items():
    save(a.crop(box), f'home/jobs/{name}', (600, 1200))
