#!/usr/bin/env python3
"""AmIMotion house grade ("Sky Ground"), one look for every picture and film on the site.

    python3 studio/grade/grade.py <folder>        grade every picture and film under <folder> in place (the build output)
    python3 studio/grade/grade.py --cube out.cube  write the look as a 33-point 3D LUT (for Higgsfield / Resolve / ffmpeg)
    python3 studio/grade/grade.py --compare a.jpg  write a before|after strip next to the file

The look, in a colourist's words:
  1. Balance. Each picture is first neutralised (grey world on its near-neutral mid-tones), so the yellow-green of
     factory tubes and the blue of a cold render land on the same daylight white before any look goes on.
  2. Key light. One daylight key for the whole company: highlights roll softly into a cool paper white (#F7FAFF),
     never clip to a hard 255; whites sit just below the page ground so pictures read as lit, not pasted.
  3. Shadows. Never grey, never black: the toe lifts slightly and leans into the ink indigo (#0B1238), the same
     colour as the type. Pictures and words share one darkest tone.
  4. Contrast. A gentle filmic S around mid-grey: more shape in the mid-tones, no crushed blacks.
  5. Colour. Greens and cyans (fluorescent cast, painted machinery) are quietened; yellow-orange (hi-vis, floor
     lines, the amber of waiting) and blues (located) keep their strength; skin keeps its warmth.
Renders (CAD, model hall) take the same look at lower strength; data plates (masks, line maps) are never touched.
Build output only: sources stay as shot. Results are cached by content, so a rebuild grades only new pictures.
"""
import hashlib, json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from PIL import Image

VERSION = "sky-ground-1"
INK = np.array([0x0B, 0x12, 0x38]) / 255.0      # shadow colour = the type colour
PAPER = np.array([0xF7, 0xFA, 0xFF]) / 255.0    # highlight colour = the page's light
CACHE = Path(os.environ.get("AMI_GRADE_CACHE", Path.home() / ".cache" / "amimotion-grade"))

# what gets which strength (first match wins); paths relative to the build root
RULES = [
    (r"/studio/assets/scene/", None),                                          # explainer plates: the explainer shader grades them live
    (r"mask|hall-lines|/tech/|favicon|logo|icon|/og-|apple-touch", None),   # data plates, marks: never
    (r"hub-(beam|vortex)|amimo-spot", None),                                    # light effects made for their page
    (r"/team/", "portrait"),
    (r"/hall/|/locate/|/scene/|/home/(bay|amigo|amimo|pair)|/img/|/hw/|/nav/|-cad|family-dk|pair-dk|amimo-(hero|mono|a-|side)|amigo-(page|side|macro|top|card)|turntable|/products/(amigo-covers|amigo-lower|closer)/", "render"),
    (r".*", "photo"),
]
PRESET = {   # balance: how far to neutralise the cast; look: how much of the look; sat: overall saturation
    "photo":    dict(balance=.72, look=1.0, sat=.90),
    "portrait": dict(balance=.45, look=.55, sat=.97),
    "render":   dict(balance=.30, look=.5, sat=1.0, curve=0),   # renders on the light page: tint only, whites stay white
}

def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)

def rgb2hsv(c):
    mx, mn = c.max(-1), c.min(-1); d = mx - mn
    h = np.zeros_like(mx); r, g, b = c[..., 0], c[..., 1], c[..., 2]; nz = d > 1e-6
    h = np.where(nz & (mx == r), ((g - b) / np.where(nz, d, 1)) % 6, h)
    h = np.where(nz & (mx == g), (b - r) / np.where(nz, d, 1) + 2, h)
    h = np.where(nz & (mx == b), (r - g) / np.where(nz, d, 1) + 4, h)
    return h * 60, np.where(mx > 0, d / np.where(mx > 0, mx, 1), 0), mx

def balance_gains(c, strength):
    """per-channel gains that pull the near-neutral mid-tones toward neutral grey (partial grey-world)."""
    if strength <= 0: return np.ones(3)
    px = c.reshape(-1, 3)
    if len(px) > 200000: px = px[:: len(px) // 200000 + 1]
    l = px @ [.2126, .7152, .0722]; _, s, _ = rgb2hsv(px)
    sel = (l > .18) & (l < .85) & (s < .35)
    if sel.sum() < 500: sel = (l > .1) & (l < .92)
    if sel.sum() < 100: return np.ones(3)
    m = px[sel].mean(0); g = m.mean() / np.maximum(m, 1e-4)
    g = np.clip(g, .82, 1.22)
    return 1 + (g - 1) * strength

def look(c, gains, look=1.0, sat=.9, curve=1.0):
    """the house look on float RGB in 0..1 (sRGB-encoded). Pure per-pixel, so it bakes into a LUT exactly."""
    c = np.clip(c * gains, 0, 1)
    l = c @ np.array([.2126, .7152, .0722])
    # filmic S around .45 with a lifted toe and a soft shoulder
    s = .45; k = 1 + .16 * look * curve
    lo = s * (l / s) ** k; hi = 1 - (1 - s) * ((1 - l) / (1 - s)) ** (1 + .10 * look * curve)
    l2 = np.where(l < s, lo, hi)
    c = c * np.clip(l2 / np.maximum(l, 1e-4), 0, 3)[..., None]
    c = .018 * look * curve + c * (1 - (.018 + .022) * look * curve)              # toe lift (neutral, additive), shoulder below paper
    # colour: hue-selective saturation
    h, sv, v = rgb2hsv(np.clip(c, 0, 1))
    green = smooth(70, 95, h) * (1 - smooth(165, 190, h))             # yellow-greens to cyans
    warm = smooth(18, 30, h) * (1 - smooth(55, 70, h))                # oranges, hi-vis, amber
    blue = smooth(195, 210, h) * (1 - smooth(250, 265, h))
    f = sat * (1 - .38 * look * green) * (1 + .06 * look * warm) * (1 + .05 * look * blue)
    l3 = c @ np.array([.2126, .7152, .0722])
    c = l3[..., None] + (c - l3[..., None]) * f[..., None]
    # split tone: shadows into ink, highlights into paper
    ws = smooth(.0, .07, l3) * (1 - smooth(.08, .5, l3)) * .32 * look   # mid-shadows only: deep blacks stay clean
    wh = smooth(.62, 1.0, l3) ** 2 * .35 * look
    inkn = INK / (INK @ [.2126, .7152, .0722]); inkn = 1 + (inkn - 1) * .45   # ink hue, softened so shadows lean, never go blue
    ink = inkn * l3[..., None]                                        # at the pixel's own brightness
    paper = PAPER / PAPER @ [.2126, .7152, .0722] * l3[..., None]
    c = c + (ink - c) * ws[..., None] * .55 + (paper - c) * wh[..., None] * .5
    return np.clip(c, 0, 1)

def grade_array(a, preset, gains=None):
    p = PRESET[preset]; c = a[..., :3].astype(np.float32) / 255
    if gains is None: gains = balance_gains(c, p["balance"])
    out = look(c, gains, p["look"], p["sat"], p.get("curve", 1.0))
    o = (out * 255 + np.random.default_rng(7).uniform(-.5, .5, out.shape)).round().clip(0, 255).astype(np.uint8)   # dither: no banding
    if a.shape[-1] == 4: o = np.dstack([o, a[..., 3]])
    return o

def classify(rel):
    for pat, pre in RULES:
        if re.search(pat, "/" + rel): return pre
    return None

def save_like(im_arr, src, dst):
    fmt = src.suffix.lower(); im = Image.fromarray(im_arr)
    if fmt in (".jpg", ".jpeg"): im.save(dst, "JPEG", quality=86, optimize=True, progressive=True, subsampling="4:2:0")
    elif fmt == ".webp": im.save(dst, "WEBP", quality=84, method=6)
    elif fmt == ".avif": im.save(dst, "AVIF", quality=62, speed=6)
    elif fmt == ".png": im.save(dst, "PNG", optimize=True)

def write_cube(path, gains=np.ones(3), preset="photo", n=33):
    p = PRESET[preset]; g = np.linspace(0, 1, n)
    b, gg, r = np.meshgrid(g, g, g, indexing="ij")                    # red fastest, as .cube expects
    c = np.stack([r, gg, b], -1).reshape(-1, 3)
    out = look(c, gains, p["look"], p["sat"], p.get("curve", 1.0))
    with open(path, "w") as f:
        f.write(f'TITLE "AmIMotion {VERSION} {preset}"\nLUT_3D_SIZE {n}\n')
        for row in out: f.write(f"{row[0]:.6f} {row[1]:.6f} {row[2]:.6f}\n")

def video_gains(src, preset):
    tmp = tempfile.mkdtemp()
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(src), "-vf", "fps=1,scale=480:-2", "-frames:v", "8", f"{tmp}/f%02d.png"], check=True)
    fr = [np.asarray(Image.open(f).convert("RGB"), np.float32) / 255 for f in sorted(Path(tmp).glob("*.png"))]
    shutil.rmtree(tmp)
    return balance_gains(np.concatenate([f.reshape(-1, 3) for f in fr]), PRESET[preset]["balance"])

def grade_video(src, dst, preset):
    cube = Path(tempfile.mkdtemp()) / "g.cube"; write_cube(cube, video_gains(src, preset), preset)
    codec = ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-row-mt", "1"] if src.suffix == ".webm" else \
            ["-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
             "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", f"lut3d={cube}:interp=tetrahedral", "-an", *codec, str(dst)], check=True)
    shutil.rmtree(cube.parent)

def grade_file(f, rel):
    pre = classify(rel)
    if not pre: return "skip"
    key = hashlib.sha1(f.read_bytes() + VERSION.encode() + json.dumps(PRESET[pre], sort_keys=True).encode()).hexdigest()
    cached = CACHE / (key + f.suffix)
    if not cached.exists():
        CACHE.mkdir(parents=True, exist_ok=True); tmp = cached.with_name("tmp-" + cached.name)
        if f.suffix.lower() in (".mp4", ".webm"): grade_video(f, tmp, pre)
        else:
            im = Image.open(f); mode = "RGBA" if ("A" in im.getbands() or im.mode == "P") else "RGB"
            save_like(grade_array(np.asarray(im.convert(mode)), pre), f, tmp)
        if tmp.stat().st_size > f.stat().st_size * 1.25 and f.suffix.lower() not in (".mp4", ".webm"):
            pass   # heavier than the source: still keep, a picture matters more than 25% bytes on one file
        tmp.rename(cached)
    shutil.copyfile(cached, f)
    return pre

def grade_tree(root):
    root = Path(root); n = {}
    for f in sorted(root.rglob("*")):
        if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".avif", ".mp4", ".webm") and f.is_file():
            r = grade_file(f, str(f.relative_to(root))); n[r] = n.get(r, 0) + 1
    print("grade", VERSION, n)

if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--cube"]: write_cube(a[1]); print("wrote", a[1])
    elif a[:1] == ["--compare"]:
        for p in a[1:]:
            src = Path(p); im = np.asarray(Image.open(src).convert("RGB")); pre = classify(str(src)) or "photo"
            g = grade_array(im, pre); s = np.concatenate([im, g], 1)
            Image.fromarray(s).save(src.with_name(src.stem + "-compare.jpg"), quality=88)
    else: grade_tree(a[0])
