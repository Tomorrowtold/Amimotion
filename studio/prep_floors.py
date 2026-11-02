"""Floors band (homepage #industries): grade three Higgsfield floor stills and bake their light masks.

Source stills: /mnt/project-files/website-top/shared-assets/studio/higgsfield/stills/P-industries-*.png
Writes v1/assets/floors/:
  <scene>-1600.webp / -900.webp  the photo (light cinematic grade; the shader does the night grade)
  <scene>-mask.png               R = located light (blue), G = waiting subject (amber), B = amber floor pool
  <scene>-path.png               R = arrival along the floor path (0..1, 1 = none), G = line intensity (core + glow)
  <scene>-poster.webp            the night frame baked (first paint, low data, reduced motion)
Coordinates are authored on a 900 x 672 view of each 2400 x 1792 still.
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SRC = '/mnt/project-files/website-top/shared-assets/studio/higgsfield/stills'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'v1/assets/floors')
os.makedirs(OUT, exist_ok=True)
MW, MH = 800, 597          # mask size (4:3 like the stills)
AW, AH = 900, 672          # authoring grid

SCENES = {
  'factory': dict(src='P-industries-manufacturing',
    # the man in the aisle is the one thing that moves: soft key light on him
    located=[('ell', 322, 300, 34, 70)],
    # the queue of trolleys at inspection waits
    waiting=[('poly', [(352, 288), (470, 286), (720, 330), (712, 600), (560, 650), (410, 520), (352, 420)])],
    pool=[('poly', [(330, 420), (420, 520), (560, 640), (700, 612), (712, 560), (560, 470), (420, 400)])],
    path=[(150, 672), (190, 600), (240, 500), (285, 420), (315, 362)]),
  'warehouse': dict(src='P-industries-warehousing',
    located=[('ell', 568, 385, 70, 85)],
    waiting=[('poly', [(222, 372), (540, 372), (540, 496), (222, 496)])],
    pool=[('poly', [(170, 520), (575, 522), (560, 470), (230, 470)])],
    path=[(780, 672), (720, 600), (660, 520), (612, 462)]),
  'robots': dict(src='P-industries-robotics',
    located=[('ell', 456, 505, 135, 60)],
    waiting=[('poly', [(48, 318), (340, 318), (340, 552), (48, 552)])],
    pool=[('ell', 195, 552, 190, 34)],
    path=[(820, 672), (740, 612), (660, 565), (580, 528)]),
}


def sc(x, y):
  return x * MW / AW, y * MH / AH


def shape_mask(shapes, blur):
  im = Image.new('L', (MW, MH), 0)
  d = ImageDraw.Draw(im)
  for s in shapes:
    if s[0] == 'ell':
      _, x, y, rx, ry = s
      (cx, cy), (rx, ry) = sc(x, y), sc(rx, ry)
      d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    else:
      d.polygon([sc(*p) for p in s[1]], fill=255)
  return np.asarray(im.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255


def catmull(pts, n=400):
  P = [np.array(sc(*p)) for p in pts]
  P = [P[0] * 2 - P[1]] + P + [P[-1] * 2 - P[-2]]
  out = []
  for i in range(1, len(P) - 2):
    p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
    for t in np.linspace(0, 1, n // (len(P) - 3), endpoint=False):
      out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
  out.append(P[-2])
  return np.array(out)


def path_tex(pts):
  c = catmull(pts, 900)
  seg = np.r_[0, np.cumsum(np.hypot(*np.diff(c, axis=0).T))]
  arr = seg / seg[-1]
  core = np.zeros((MH, MW), bool)
  arrival = np.ones((MH, MW), np.float32)
  yy, xx = np.mgrid[0:MH, 0:MW]
  # the line is drawn on the floor, so it is thicker nearer the camera
  for (x, y), a in zip(c[::2], arr[::2]):
    r = .55 + 1.5 * (y / MH) ** 2
    x0, x1, y0, y1 = int(max(0, x - 4)), int(min(MW, x + 5)), int(max(0, y - 4)), int(min(MH, y + 5))
    m = (xx[y0:y1, x0:x1] - x) ** 2 + (yy[y0:y1, x0:x1] - y) ** 2 <= r * r
    sub = arrival[y0:y1, x0:x1]
    sub[m] = np.minimum(sub[m], a)
    core[y0:y1, x0:x1] |= m
  d, (iy, ix) = ndimage.distance_transform_edt(~core, return_indices=True)
  near = arrival[iy, ix]
  inten = np.clip(np.where(core, 1.0, 0) + .42 * np.exp(-d / 2.2) + .1 * np.exp(-d / 12.0), 0, 1)
  near = np.where(d < 60, near, 1.0)
  return near, inten


def grade_photo(im):
  a = np.asarray(im.convert('RGB'), np.float32) / 255
  g = a @ np.array([.2126, .7152, .0722], np.float32)
  a = g[..., None] + (a - g[..., None]) * .82           # a little less colour
  a = np.clip((a - .5) * 1.12 + .5, 0, 1)                # a little more contrast
  a = a * np.array([.97, .99, 1.03], np.float32)        # cool steel
  return np.clip(a, 0, 1)


def night(photo, mask, path):
  """numpy twin of the shader's rest state, for the poster."""
  g = photo @ np.array([.2126, .7152, .0722], np.float32)
  vy = np.linspace(.55, 1.15, photo.shape[0])[:, None, None]  # the roof falls into the dark
  base = (g[..., None] + (photo - g[..., None]) * .12) * np.array([.55, .64, .95]) * .1 * vy + np.array([.006, .008, .02])
  lit = photo
  R, G, B = mask[..., 0], mask[..., 1], mask[..., 2]
  blue = lit * np.array([.72, .88, 1.25]) * .95 + np.array([.0, .03, .12])
  gl = lit @ np.array([.2126, .7152, .0722])
  amb = (gl[..., None] * .7 + lit * .3) * np.array([1.15, .78, .42]) * .8
  out = base * (1 - R[..., None] * .9) + blue * R[..., None] * .9
  out = out * (1 - G[..., None] * .85) + amb * G[..., None] * .85
  out += np.array([1., .58, .16]) * (B * (.15 + .85 * g))[..., None] * .42
  ar, it = path
  on = (ar < 1).astype(np.float32)
  out += np.array([.2, .45, 1.]) * (it * on)[..., None] * .9
  out = 1 - np.exp(-out * 1.25)                           # soft shoulder
  return np.clip(out, 0, 1)


for name, S in SCENES.items():
  src = Image.open(os.path.join(SRC, S['src'] + '.png')).convert('RGB')
  ph = grade_photo(src)
  phim = Image.fromarray((ph * 255).astype(np.uint8))
  phim.resize((1600, 1195), Image.LANCZOS).save(f'{OUT}/{name}-1600.webp', quality=80, method=6)
  phim.resize((900, 672), Image.LANCZOS).save(f'{OUT}/{name}-900.webp', quality=76, method=6)
  R = shape_mask(S['located'], 22)
  G = shape_mask(S['waiting'], 26)
  B = shape_mask(S['pool'], 30)
  m = np.dstack([R, G, B, np.ones_like(R)])
  Image.fromarray((m * 255).astype(np.uint8), 'RGBA').save(f'{OUT}/{name}-mask.png', optimize=True)
  ar, it = path_tex(S['path'])
  Image.fromarray((np.dstack([ar, it, np.zeros_like(ar)]) * 255).astype(np.uint8), 'RGB').save(f'{OUT}/{name}-path.png', optimize=True)
  small = np.asarray(phim.resize((MW, MH), Image.LANCZOS), np.float32) / 255
  post = night(small, m, (ar, it))
  Image.fromarray((post * 255).astype(np.uint8)).save(f'{OUT}/{name}-poster.webp', quality=78, method=6)
  print(name, 'ok')
