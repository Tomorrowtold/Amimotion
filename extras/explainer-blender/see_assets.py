"""Turn the renders and the photoreal stills into the web assets for the "Can you see it?" section.
usage: python see_assets.py <renders dir> <ai dir> <out assets/see dir> [L|P ...]
renders dir holds eye{,P}.png, eye{,P}_dim.png, eye{,P}_blue.png, eye{,P}_amber.png, eye{,P}.json, rise{L,P}/NN.png+json
ai dir holds eye_ai.png and eyeP_ai.png (the photoreal finish of eye.png / eyeP.png)."""
import sys, os, json, glob
import numpy as np
from PIL import Image, ImageFilter

R, A, OUT = sys.argv[1:4]
VAR = sys.argv[4:] or ['L', 'P']
lin = lambda im: (np.asarray(im.convert('RGB'), np.float32) / 255) ** 2.2
srgb = lambda a: Image.fromarray((np.clip(a, 0, 1) ** (1 / 2.2) * 255 + .5).astype(np.uint8))
blur = lambda a, r: lin(srgb(a).filter(ImageFilter.GaussianBlur(r)))

for v in VAR:
    sfx = '' if v == 'L' else 'P'
    size = (1920, 1080) if v == 'L' else (1080, 1920)
    rsize = (1280, 720) if v == 'L' else (608, 1080)
    o = os.path.join(OUT, v); os.makedirs(o + '/rise', exist_ok=True)
    ai = Image.open(f'{A}/eye{sfx}_ai.png').convert('RGB').resize(size, Image.LANCZOS)
    ai.save(f'{o}/lit.webp', quality=82, method=6)
    lit, dim = lin(Image.open(f'{R}/eye{sfx}.png').resize(size)), lin(Image.open(f'{R}/eye{sfx}_dim.png').resize(size))
    # the light falloff of the dark render, as a ratio to the lit one
    ratio = blur(dim, 14) / (blur(lit, 14) + .02)
    # shipped as a soft multiply layer over the sharp photograph, so the dark floor keeps every detail and the file stays tiny
    shade = np.clip(ratio, 0, 1) * np.array([.80, .92, 1.12], np.float32)          # night reads a little cool
    srgb(shade).resize((size[0] // 2, size[1] // 2), Image.LANCZOS).save(f'{o}/dim.webp', quality=80, method=6)
    for g, gain in (('blue', 1.0), ('amber', 1.0)):
        a = lin(Image.open(f'{R}/eye{sfx}_{g}.png').resize(size))
        srgb(blur(a, 3) * gain).save(f'{o}/{g}.webp', quality=70, method=6)
    eye = json.load(open(f'{R}/eye{sfx}_dim.json'))
    ids = [t['id'] for t in eye['tags']]
    rise = []
    jfs = sorted(j for j in glob.glob(f'{R}/rise{v}/*.json') if os.path.exists(j[:-4] + 'png'))
    for n, jf in enumerate(jfs):
        d = json.load(open(jf)); m = {t['id']: t['xy'] for t in d['tags']}
        rise.append({'tags': [m[i] for i in ids], 'paths': d['paths'], 'zones': d['zones']})
        # grade: starts as dark as the dimmed photograph, and cools into a map as the camera goes up
        t = n / max(1, len(jfs) - 1); a = lin(Image.open(jf[:-4] + 'png'))
        g = a.mean(2, keepdims=True); a = g + (a - g) * (1 - .4 * t)
        a = a * (.6 + .5 * t) * np.array([.86, .95, 1.12], np.float32)
        srgb(a).save(f"{o}/rise/{os.path.basename(jf)[:-4]}webp", quality=74, method=6)
    if not rise:   # no rise frames yet: stand in with the eye view so the page still runs
        rise = [{'tags': [t['xy'] for t in eye['tags']], 'paths': eye['paths'], 'zones': eye.get('zones', {})}]
        Image.open(f'{R}/eye{sfx}_dim.png').convert('RGB').resize(rsize).save(f'{o}/rise/00.webp', quality=72)
    for t in eye['tags']: t.pop('floor', None)
    eye.pop('zones', None)
    data = {'frame': list(rsize), 'eye': eye, 'zones': rise[-1]['zones'] if rise else {}, 'rise': rise}
    json.dump(data, open(f'{o}/data.json', 'w'), separators=(',', ':'))
    print(v, len(rise), 'frames', sum(os.path.getsize(f) for f in glob.glob(o + '/**/*', recursive=True) if os.path.isfile(f)) // 1024, 'KB')
