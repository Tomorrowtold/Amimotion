"""Turn render_plates.py output into the story-film plates. System python (numpy, PIL, scipy) plus ffmpeg (img16).

    python3 make_plates.py <raw_dir> <out_dir>        # writes out_dir/plates-2400/, plates-1600/, contact sheet, README

Look = the current Sky Ground poster (site/src/assets/home/hero-film/poster-4x5-*), step for step:
  the white-hall grade as it stood when master/poster-6400x8000.png was graded (commit 94a4957: page ground #f5f5f2,
  gain 0.9973 / 1.0172 / 1.0470, page shoulder, no ground-hue step; today's grade_film.py and gain.txt carry the
  later Sky Ground render's gain and hue step, which the poster never went through), then
  08-pictures/tools/recolor_film.recolor with the film's fixed reference (measured on frames/f0000.png), which turns
  the white hall into Sky Ground (floor #f0f6ff, located #1f6bff, waiting #ffb020, sky-grey shadow).
The 1600 plates are Lanczos cuts of the 2400 ones (data maps are cut coverage-weighted, see below).
"""
import sys, os, json, shutil
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
ROUNDS = os.path.abspath(os.path.join(HERE, '..'))
FILM = os.path.join(ROUNDS, '03-hero-film')
sys.path.insert(0, FILM); sys.path.insert(0, os.path.join(ROUNDS, '08-pictures', 'tools'))
import img16, recolor_film                       # noqa: E402

# the film's recolour reference, as recolor_film measures it on 03-hero-film/frames/f0000.png (one for every frame)
REF = dict(br=150.0, ar=180.0, yb=161.6028, ya=173.074)
GAIN = np.array([9.973012804985046387e-01, 1.017187237739562988e+00, 1.046952605247497559e+00], np.float32)
GROUND = np.array([0xf5, 0xf5, 0xf2], np.float32) / 255.0
LUM = np.array([0.2126, 0.7152, 0.0722], np.float32)


def lin(a):
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def enc(a):
    a = np.clip(a, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * np.power(a, 1 / 2.4) - 0.055)


def poster_grade(raw):
    """grade_film.grade at commit 94a4957, as the 6400 poster master was graded. Returns 8-bit RGB."""
    l = lin(img16.read(raw)) * GAIN
    Y = l @ LUM; Yg = float(lin(GROUND) @ LUM)
    l = l / (np.maximum(Y / Yg, 1.0) ** 0.85)[..., None]
    return (enc(l) * 255 + 0.5).clip(0, 255).astype(np.uint8)


def look(raw, tmp=None):
    a = poster_grade(raw).astype(np.float64)
    return Image.fromarray(recolor_film.recolor(a, REF).round().astype(np.uint8))


def save16(a, path):
    Image.fromarray(np.round(np.clip(a, 0, 1) * 65535).astype(np.uint16)).save(path)


def save8(a, path):
    Image.fromarray(np.round(np.clip(a, 0, 1) * 255).astype(np.uint8), 'L').save(path)


def down(a, size):
    return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize(size, Image.LANCZOS))


def heat(a, m):
    """arrival 0..1 as a heatmap (dark blue -> teal -> yellow), black where there is no line."""
    cp = np.array([[48, 18, 130], [33, 120, 190], [40, 180, 140], [170, 220, 60], [253, 231, 37]], float)
    x = np.clip(a, 0, 1) * (len(cp) - 1)
    rgb = np.stack([np.interp(x, np.arange(len(cp)), cp[:, c]) for c in range(3)], -1)
    return (rgb * np.clip(m, 0, 1)[..., None]).astype(np.uint8)


def main(raw, out):
    o24, o16 = os.path.join(out, 'plates-2400'), os.path.join(out, 'plates-1600')
    os.makedirs(o24, exist_ok=True); os.makedirs(o16, exist_ok=True)
    tmp = os.path.join(raw, '_graded.png')
    after, before = look(os.path.join(raw, 'raw-after.png'), tmp), look(os.path.join(raw, 'raw-before.png'), tmp)
    W, H = after.size; S = (W * 2 // 3, H * 2 // 3)
    after.save(os.path.join(o24, 'after.png')); before.save(os.path.join(o24, 'before.png'))
    after.resize(S, Image.LANCZOS).save(os.path.join(o16, 'after.png'))
    before.resize(S, Image.LANCZOS).save(os.path.join(o16, 'before.png'))

    blue = img16.read(os.path.join(raw, 'pass-blue.png'))[..., 0]
    amber = img16.read(os.path.join(raw, 'pass-amber.png'))[..., 0]
    pp = img16.read(os.path.join(raw, 'pass-path.png'))
    save8(blue, os.path.join(o24, 'path-mask.png')); save8(amber, os.path.join(o24, 'amber-mask.png'))
    blue16, amber16 = np.clip(down(blue, S), 0, 1), np.clip(down(amber, S), 0, 1)
    save8(blue16, os.path.join(o16, 'path-mask.png')); save8(amber16, os.path.join(o16, 'amber-mask.png'))

    # arrival and index: point samples at pixel centres (pp), spread to every pixel the antialiased mask touches
    # (edge pixels whose centre misses the line take the value of the nearest centre that hits it), so the value
    # is the line's own value right to its soft edge: never darkened by coverage.
    cov = pp[..., 2] > 0.5
    dom = (np.round(blue * 255) >= 1) | cov
    _, (iy, ix) = ndimage.distance_transform_edt(~cov, return_indices=True)
    arr = np.where(dom, pp[..., 0][iy, ix], 0.0)
    tri = np.where(dom, np.round(pp[..., 1][iy, ix] * 64) - 1, -1).astype(int)   # trail index, -1 = none

    info = json.load(open(os.path.join(raw, 'paths-raw.json')))
    vis = [p for p in info['paths'] if (tri == p['index']).sum() >= 12]
    STEP = min(20, 255 // max(1, len(vis)))   # id * 20 as asked; 13 or more visible paths would overflow 8 bits, so id * 17 etc.
    idmap = {p['index']: k + 1 for k, p in enumerate(vis)}
    pid = np.zeros_like(tri)
    for i, k in idmap.items():
        pid[tri == i] = k
    save16(arr, os.path.join(o24, 'path-arrival.png'))
    Image.fromarray((pid * STEP).astype(np.uint8), 'L').save(os.path.join(o24, 'path-index.png'))

    # 1600: arrival cut premultiplied by coverage and divided back; index = the id with the most coverage
    w = dom.astype(np.float32) * np.maximum(blue, 1 / 255)
    num, den = down(arr * w, S), down(w, S)
    m16 = (np.round(blue16 * 255) >= 1)
    arr16 = np.where(m16 & (den > 1e-4), np.clip(num / np.maximum(den, 1e-6), 0, 1), 0.0)
    best = np.zeros(S[::-1], np.float32); pid16 = np.zeros(S[::-1], int)
    for k in range(1, len(vis) + 1):
        c = down((pid == k).astype(np.float32), S)
        pick = c > best; best[pick] = c[pick]; pid16[pick] = k
    pid16[~m16] = 0
    arr16[pid16 == 0] = 0
    save16(arr16, os.path.join(o16, 'path-arrival.png'))
    Image.fromarray((pid16 * STEP).astype(np.uint8), 'L').save(os.path.join(o16, 'path-index.png'))

    # paths.json per size
    def ends(pidm, arrm, k, scale):
        ys, xs = np.nonzero(pidm == k); a = arrm[ys, xs]
        lo, hi = a.min(), a.max()
        s0 = a <= lo + 0.01; s1 = a >= hi - 0.01
        c = lambda sel: [round(float(xs[sel].mean() + 0.5), 1), round(float(ys[sel].mean() + 0.5), 1)]
        return dict(pixels=int(len(xs)), arrival_visible=[round(float(lo), 4), round(float(hi), 4)],
                    start_px=c(s0), end_px=c(s1))
    for od, pm_, am_, sc in ((o24, pid, arr, 1.0), (o16, pid16, arr16, 2 / 3)):
        rows = []
        for p in vis:
            k = idmap[p['index']]
            r = dict(id=k, index_value=k * STEP, mover=p['mover'], kind=p['kind'], length_m=p['length_m'])
            r.update(ends(pm_, am_, k, sc))
            r['start_px_projected'] = [round(v * sc, 1) for v in p['start_px_projected']]
            r['end_px_projected'] = [round(v * sc, 1) for v in p['end_px_projected']]
            rows.append(r)
        hidden = [p['mover'] for p in info['paths'] if p['index'] not in idmap]
        json.dump(dict(size=[round(W * sc), round(H * sc)], moment='film frame 0, t = 0.0 s (the poster)',
                       arrival='0 = the oldest end of the trail, 1 = the mover (direction of travel), by arc length',
                       coords='pixels from the top left, x right, y down, pixel centres at +0.5',
                       start_px_end_px='centroid of the visible pixels at the lowest / highest arrival',
                       projected='the trail end points projected through camera A (may be occluded or off frame)',
                       index_png='value = id * %d' % STEP, amber_pads=info['amber'], trails_not_visible=hidden, paths=rows),
                  open(os.path.join(od, 'paths.json'), 'w'), indent=1)

    # alignment: after vs before outside the masks
    A = np.asarray(after).astype(int); B = np.asarray(before).astype(int)
    d = np.abs(A - B).max(-1) > 4
    mk = (blue > 0) | (amber > 0)
    out_strict = d & ~mk
    mk2 = ndimage.binary_dilation(mk, iterations=3)
    rep = dict(diff_gt4_pixels=int(d.sum()), diff_gt4_inside_masks=int((d & mk).sum()),
               diff_gt4_outside_masks_pct=round(100 * out_strict.sum() / d.size, 4),
               diff_gt4_outside_masks_dilated3_pct=round(100 * (d & ~mk2).sum() / d.size, 4),
               mask_pixels_blue_pct=round(100 * (blue > 0).mean(), 3), mask_pixels_amber_pct=round(100 * (amber > 0).mean(), 3),
               visible_paths=len(vis))
    print(json.dumps(rep, indent=1))
    json.dump(rep, open(os.path.join(raw, 'alignment.json'), 'w'), indent=1)
    Image.fromarray((out_strict * 255).astype(np.uint8)).save(os.path.join(raw, 'diff-outside-masks.png'))

    # contact sheet: after, before, path mask, amber mask, arrival heatmap (from the 1600 set, 400 px tiles)
    t = (480, 600)
    tiles = [Image.open(os.path.join(o16, n)).convert('RGB').resize(t, Image.LANCZOS) for n in ('after.png', 'before.png', 'path-mask.png', 'amber-mask.png')]
    tiles.append(Image.fromarray(heat(arr16, blue16)).resize(t, Image.LANCZOS))
    sh = Image.new('RGB', (len(tiles) * t[0] + (len(tiles) + 1) * 12, t[1] + 24), (128, 128, 128))
    for i, im in enumerate(tiles):
        sh.paste(im, (12 + i * (t[0] + 12), 12))
    sh.save(os.path.join(out, 'contact-sheet.jpg'), quality=88)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
