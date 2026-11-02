"""AmIMotion studio hardware renders from the founders' CAD (AmIGo tag, AmIMo anchor).

Blender 5.1 Python module, Cycles CPU, headless.
    /tmp/bpyenv/bin/python render_hardware.py <shot> [--scale 0.5] [--samples 384] [--out DIR]
shots: amigo_hero, amigo_logo, amimo_rj45, pair_scale, amigo_page, all
    amigo_page takes [--dist 0.35] [--el 30] [--fstop 8] [--border x0,x1,y0,y1]; finish it with --page (see page_grade)
Outputs <out>/<shot>_raw.png (16-bit, AgX). Finish with:
    python3 render_hardware.py --grade <raw.png> <final.png>   (system python with numpy + PIL)

Inputs: CAD STLs in CAD_DIR (mm), a CC0 studio HDRI from Poly Haven in HDRI (fetched if missing).
Only the four CAD parts appear. No LEDs, no labels, no added parts.
"""
import sys, os, math

CAD_DIR = '/mnt/project-files/website-ultra/cad/'
HDRI = '/tmp/claude-0/hdri/studio_small_09.exr'
HDRI_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/2k/studio_small_09_2k.exr'


# --------------------------------------------------------------------------------------------
# post grade (runs under system python, no bpy)
# --------------------------------------------------------------------------------------------
def grade(src, dst, seed=7):
    """Photographic finish: target the sweep, gentle shoulder, fine sensor grain, slight lens falloff.
    Grain is added at full resolution AFTER any resize so it reads as sensor noise, not texture."""
    import numpy as np
    from PIL import Image
    im = Image.open(src)
    a = np.asarray(im).astype(np.float32)
    a = a / (65535.0 if a.max() > 255 else 255.0)
    a = a[..., :3]
    h, w = a.shape[:2]
    # 0. levels: put the brightest paper at ~#efeeec, not clipped white (the site ground is #e9ebee-ish)
    a = a * 0.95
    # 0b. veiling glare: every real lens scatters ~1-2 % of the mean scene light into the shadows, so a photo of
    #     a white sweep never holds pure-black holes. Done in linear light; lifts the RJ45 void to about L* 9.
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    lin = lin + 0.015 * float((lin @ np.array([0.2126, 0.7152, 0.0722], np.float32)).mean())
    a = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * np.power(np.clip(lin, 0, None), 1 / 2.4) - 0.055).astype(np.float32)
    # 1. lens falloff: cos^4-like, very gentle (an 85-100 mm lens at f/8 shows ~0.15 stop at corners)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (w / 2))
    a *= (1 - 0.035 * r ** 2)[..., None]
    # 2. lateral chromatic aberration, sub-pixel: scale R up and B down around centre by ~0.25 px at the corner
    def rescale(ch, k):
        from PIL import Image as I
        c = I.fromarray(ch.astype(np.float32), mode='F')
        W2, H2 = round(w * k), round(h * k)
        c = c.resize((W2, H2), I.BICUBIC)
        c = np.asarray(c)
        oy, ox = (H2 - h) // 2, (W2 - w) // 2
        return c[oy:oy + h, ox:ox + w]
    k = 1 + 0.35 / (w / 2)
    a[..., 0] = rescale(a[..., 0], k)
    # 3. sensor grain: luminance-weighted (more in mids/shadows), ISO-100-like, plus a whisper of chroma
    rng = np.random.default_rng(seed)
    L = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    amp = (0.0055 + 0.006 * (1 - L))[..., None]
    g = rng.normal(0, 1, (h, w, 1)).astype(np.float32)
    gc = rng.normal(0, 0.25, (h, w, 3)).astype(np.float32)
    a = a + amp * (g + gc)
    a = np.clip(a, 0, 1)
    Image.fromarray((a * 255 + rng.random(a.shape)).clip(0, 255).astype(np.uint8)).save(dst, optimize=True)


def page_grade(src, dst, ground='#f5f5f2', seed=11):
    """Round 5: put the tag on the page itself. A photographer's flat-field: fit the paper's light fall-off (sweep
    gradient, cove, lens falloff) with a smooth surface on the paper pixels only, divide it out, and scale so the
    paper lands exactly on the site ground. The tag and its contact shadow keep their true ratios to the paper,
    so nothing is painted or cut out by hand. Paper far from the tag is set to the ground value exactly, so the
    picture has no edge on the page. Then the photographic finish of grade(): veiling glare, sub-pixel lateral CA,
    luminance-weighted sensor grain, but only where the picture differs from the page (no grain on the ground).
    Works on a raw 16-bit render or a graded PNG, and on a border (region) render: black outside the region
    is treated as unrendered paper."""
    import numpy as np
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    if src.endswith('.npy'):
        a = np.load(src); raw = True       # a stitched raw render, 0..1, see stitch_tiles
    else:
        im = Image.open(src)
        a = np.asarray(im).astype(np.float32)
        raw = a.max() > 255
        a = a / (65535.0 if raw else 255.0)
    a = a[..., :3]
    h, w = a.shape[:2]
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4).astype(np.float32)
    del a
    if raw:
        # levels and veiling glare as in grade(): x0.95, then ~1.5 % of the mean scene light into the shadows
        lin *= 0.95 ** 2.2
        Yr = lin @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        lin += np.where(Yr > 1e-6, 0.015 * float(Yr[Yr > 1e-6].mean()), 0)[..., None]
        del Yr
    g = np.array([int(ground.lstrip('#')[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)
    g_lin = np.where(g <= 0.04045, g / 12.92, ((g + 0.055) / 1.055) ** 2.4).astype(np.float32)
    Y = lin @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    unrendered = Y <= 1e-6
    # --- fit the paper on a coarse grid: 4th-order surface per channel, two passes to drop the shadow
    st = max(1, w // 600)
    ys, xs = np.mgrid[0:h:st, 0:w:st]
    u = (xs / w * 2 - 1).ravel(); v = (ys / h * 2 - 1).ravel()
    terms = [u ** i * v ** j for i in range(5) for j in range(5 - i)]
    A = np.stack(terms, 1)
    from scipy import ndimage as ndi
    # sample a blurred copy so grain and noise do not read as shadow
    Yb = ndi.gaussian_filter(Y, st * 1.5)
    Ys = Yb[::st, ::st].ravel()
    Ls = np.stack([ndi.gaussian_filter(lin[..., c], st * 1.5)[::st, ::st] for c in range(3)], -1).reshape(-1, 3)
    del Yb
    ok = (Ys > 0.6 * np.median(Ys[Ys > 1e-6])) & (Ys > 1e-6)
    for _ in range(3):
        coef, *_ = np.linalg.lstsq(A[ok], Ys[ok], rcond=None)
        fitY = A @ coef
        ok = (Ys > 1e-6) & (Ys / np.maximum(fitY, 1e-4) > 0.99)
        # grow the exclusion around the dark object so its soft shadow is not taken as paper
        m = (~ok).reshape(ys.shape) & ~unrendered[::st, ::st]
        m = ndi.binary_opening(m, iterations=2)
        m = ndi.binary_dilation(m, iterations=max(2, 24 // st))
        ok = ok & ~m.ravel()
        assert ok.sum() > 0.2 * ok.size, ok.sum()
    fits = []
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A[ok], Ls[ok, c], rcond=None)
        fits.append((A @ coef).reshape(ys.shape))
    paper = np.stack([np.asarray(Image.fromarray(f.astype(np.float32), mode='F').resize((w, h), Image.BICUBIC)) for f in fits], -1)
    out = lin / np.maximum(paper, 1e-4) * g_lin
    out[unrendered] = g_lin
    # nothing on a lit sweep is brighter than the sweep itself next to a dark object (it only occludes), so any
    # residual of the fit above the ground is fit error: clamp it, or it reads as a halo (a glow) round the tag
    out = np.minimum(out, g_lin)
    del paper, lin
    # --- veiling glare, as in grade(): a real lens never holds a pure-black hole
    # --- where the picture is the page: weight from the blurred difference to the ground
    from scipy import ndimage as ndi
    dY = np.abs((out @ np.array([0.2126, 0.7152, 0.0722], np.float32)) / float(g_lin @ np.array([0.2126, 0.7152, 0.0722], np.float32)) - 1)
    sm = max(2.0, w / 900)
    dY = ndi.gaussian_filter(dY, sm)
    wgt = np.clip((dY - 0.004) / 0.02, 0, 1)
    wgt = ndi.gaussian_filter(ndi.maximum_filter(wgt, size=int(sm * 3) | 1), sm * 2)
    # hard guarantee: the outer 4 % of the frame is the ground, feathered
    yy = np.minimum(np.arange(h), np.arange(h)[::-1])[:, None] / h
    xx = np.minimum(np.arange(w), np.arange(w)[::-1])[None, :] / w
    edge = np.clip(np.minimum(yy, xx) / 0.04, 0, 1)
    wgt = np.clip(wgt, 0, 1) * edge
    out = g_lin + (out - g_lin) * wgt[..., None]
    # --- back to sRGB, sub-pixel lateral CA on red, grain only inside the picture
    o = np.where(out <= 0.0031308, out * 12.92, 1.055 * np.power(np.clip(out, 0, None), 1 / 2.4) - 0.055).astype(np.float32)
    del out
    k = 1 + 0.35 / (w / 2) * (w / 2400)
    c = Image.fromarray(o[..., 0].copy(), mode='F'); W2, H2 = round(w * k), round(h * k)
    c = np.asarray(c.resize((W2, H2), Image.BICUBIC)); oy, ox = (H2 - h) // 2, (W2 - w) // 2
    o[..., 0] = o[..., 0] * (1 - wgt) + c[oy:oy + h, ox:ox + w] * wgt
    rng = np.random.default_rng(seed)
    L = o @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    amp = ((0.0050 + 0.006 * (1 - L)) * wgt)[..., None]
    o = o + amp * rng.standard_normal((h, w, 1), dtype=np.float32)
    o = np.clip(o, 0, 1)
    # dither only where the picture is; the ground stays the exact token value
    d = rng.random(o.shape, dtype=np.float32) * wgt[..., None] + 0.5 * (1 - wgt[..., None])
    Image.fromarray((o * 255 + d).clip(0, 255).astype(np.uint8)).save(dst, optimize=False, compress_level=3)


def stitch_tiles(dst, W, H, *tiles):
    """Join border tiles of one frame (each 'path:x0,x1,y0,y1', fractions as passed to --border, y from the
    bottom as Blender counts it) into one W x H raw frame, saved as float .npy for page_grade. Overlaps are
    cross-faded linearly, so each tile's own denoise cannot leave a seam. Unrendered pixels stay 0."""
    import numpy as np
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    acc = np.zeros((H, W, 3), np.float32); wsum = np.zeros((H, W), np.float32)
    for t in tiles:
        path, b = t.split(':'); x0, x1, y0, y1 = [float(v) for v in b.split(',')]
        a = np.asarray(Image.open(path)).astype(np.float32)[..., :3]
        a /= 65535.0 if a.max() > 255 else 255.0      # PIL opens Blender's 16-bit RGBA PNG as 8-bit RGBA
        th, tw = a.shape[:2]
        px, py = int(x0 * W), H - int(y0 * H) - th          # Blender: border min rounds down, rows from the bottom
        ramp = lambda n: np.minimum(1, np.minimum(np.arange(n) + 1, n - np.arange(n)) / 160.0)
        wt = ramp(th)[:, None] * ramp(tw)[None, :]
        acc[py:py + th, px:px + tw] += a * wt[..., None]; wsum[py:py + th, px:px + tw] += wt
    out = np.where(wsum[..., None] > 0, acc / np.maximum(wsum, 1e-6)[..., None], 0).astype(np.float32)
    np.save(dst, out)
    print('stitched', W, H, 'covered', float((wsum > 0).mean()))


if len(sys.argv) > 1 and sys.argv[1] == '--stitch':
    stitch_tiles(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), *sys.argv[5:])
    sys.exit(0)

if len(sys.argv) > 1 and sys.argv[1] == '--page':
    page_grade(sys.argv[2], sys.argv[3], *(sys.argv[4:5]))
    sys.exit(0)


if len(sys.argv) > 1 and sys.argv[1] == '--grade':
    grade(sys.argv[2], sys.argv[3])
    sys.exit(0)

# --------------------------------------------------------------------------------------------
# scene (bpy)
# --------------------------------------------------------------------------------------------
import bpy, bmesh
from mathutils import Vector, Matrix, Euler

args = sys.argv[1:]
SHOT = args[0] if args else 'amigo_hero'
def opt(k, d):
    return type(d)(args[args.index(k) + 1]) if k in args else d
SCALE = opt('--scale', 1.0)
SAMPLES = opt('--samples', 128)
TIME_LIMIT = opt('--time', 300.0)   # seconds of path tracing per still; keeps each render under ~6 min on 4 cores
OUT = opt('--out', os.path.dirname(os.path.abspath(__file__)))
WIDTH = 2400


def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.015
    sc.cycles.samples = SAMPLES
    sc.cycles.time_limit = TIME_LIMIT
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
    sc.cycles.denoising_prefilter = 'ACCURATE'
    sc.cycles.max_bounces = 6
    sc.cycles.diffuse_bounces = 3
    sc.cycles.glossy_bounces = 3
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 0.5
    sc.cycles.use_light_tree = True
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 4
    # one tile: Cycles applies time_limit per tile, so an 8K frame in 2048 px tiles would take time_limit x tiles
    sc.cycles.use_auto_tile = False
    sc.view_settings.view_transform = 'Khronos PBR Neutral'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0.0
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '16'
    sc.render.film_transparent = False
    sc.render.filter_size = 1.2
    return sc


def link(o):
    bpy.context.scene.collection.objects.link(o); return o


# ---------------- CAD import and cleanup ----------------
def import_part(name):
    bpy.ops.wm.stl_import(filepath=os.path.join(CAD_DIR, name + '.stl'))
    o = bpy.context.selected_objects[0]; o.select_set(False); o.name = name
    me = o.data
    # mm -> m, baked into the mesh so texture space is true scale
    me.transform(Matrix.Scale(0.001, 4))
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # smooth shading with real creases: an edge sharper than 28 deg stays a crease, softer ones are fillets
    for f in bm.faces: f.smooth = True
    sharp = []
    for e in bm.edges:
        if len(e.link_faces) == 2:
            sharp.append(e.calc_face_angle(0.0) > math.radians(28))
        else:
            sharp.append(True)
    bm.to_mesh(me); bm.free()
    attr = me.attributes.get('sharp_edge') or me.attributes.new('sharp_edge', 'BOOLEAN', 'EDGE')
    attr.data.foreach_set('value', sharp)
    # weighted normals: big flat faces stay dead flat, thin fillet strips take the curvature
    wn = o.modifiers.new('wn', 'WEIGHTED_NORMAL'); wn.keep_sharp = True; wn.mode = 'FACE_AREA'; wn.weight = 60
    return o


def amigo():
    """Tag: top cover (logo face is CAD -Z) on bottom cover. Flip so the logo faces up, base on z=0."""
    top = import_part('top_cover'); bot = import_part('bottom_cover')
    root = link(bpy.data.objects.new('amigo', None))
    for o in (top, bot):
        o.parent = root
    # CAD: x 32.1..91.2, y 22.9..109.0, z -12.6..10.6 (mm). Rx(180) puts -Z up.
    root.rotation_euler = (math.pi, 0, 0)
    bpy.context.view_layer.update()
    rest_on_floor(root, (top, bot))
    return root, top, bot


def amimo():
    """Anchor: body + cap (cap is the flanged mounting plate at CAD +Y). Lie it on its plate, RJ45 end at world -Y."""
    body = import_part('PCB_ENCLOUSER_main_body'); cap = import_part('PCB_ENCLOUSER_cap')
    root = link(bpy.data.objects.new('amimo', None))
    for o in (body, cap):
        o.parent = root
    root.rotation_euler = (-math.pi / 2, 0, 0)
    bpy.context.view_layer.update()
    rest_on_floor(root, (body, cap))
    return root, body, cap


def rest_on_floor(root, parts):
    """Centre the footprint on the origin and put the lowest vertex exactly on z=0 (true contact)."""
    vs = [p.matrix_world @ v.co for p in parts for v in p.data.vertices]
    mn = Vector([min(v[i] for v in vs) for i in range(3)]); mx = Vector([max(v[i] for v in vs) for i in range(3)])
    c = (mn + mx) / 2
    root.location = (-c.x, -c.y, -mn.z)
    bpy.context.view_layer.update()


def place(root, loc=(0, 0, 0), rz=0.0):
    """Rotate the assembled product about world Z through its own footprint centre, then move it."""
    m = Matrix.Translation(Vector(loc)) @ Matrix.Rotation(rz, 4, 'Z') @ root.matrix_world
    root.matrix_world = m
    bpy.context.view_layer.update()


# ---------------- materials ----------------
def plastic(name, hexcol, seed=0.0, grain=1.0):
    """Dark grey textured ABS/PC. Spark-erosion grain (VDI ~27) as a fine bump in object space at true scale,
    roughness tied to the grain (peaks a touch glossier), 3-5 % low-frequency roughness drift, rounded edges via Bevel."""
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb(hexcol), 1)
    b.inputs['IOR'].default_value = 1.54
    b.inputs['Specular IOR Level'].default_value = 0.5
    tc = N.new('ShaderNodeTexCoord')
    # Object coords are metres (scale baked into mesh). W offsets decorrelate parts.
    # fine grain ~60-120 um
    n1 = N.new('ShaderNodeTexNoise'); n1.noise_dimensions = '4D'
    n1.inputs['W'].default_value = seed; n1.inputs['Scale'].default_value = GRAIN_SCALE; n1.inputs['Detail'].default_value = 6
    n1.inputs['Roughness'].default_value = 0.62
    # sparse pits (voronoi) to break the noise into an EDM-like crater texture
    v1 = N.new('ShaderNodeTexVoronoi'); v1.voronoi_dimensions = '4D'; v1.feature = 'F1'
    v1.inputs['W'].default_value = seed; v1.inputs['Scale'].default_value = GRAIN_SCALE * 0.65
    L.new(tc.outputs['Object'], n1.inputs['Vector']); L.new(tc.outputs['Object'], v1.inputs['Vector'])
    hmix = N.new('ShaderNodeMath'); hmix.operation = 'MULTIPLY_ADD'
    L.new(v1.outputs['Distance'], hmix.inputs[0]); hmix.inputs[1].default_value = 0.6; L.new(n1.outputs['Fac'], hmix.inputs[2])
    # low-frequency drift (handling, mould polish variation) ~ 2-4 cm features
    n2 = N.new('ShaderNodeTexNoise'); n2.noise_dimensions = '4D'
    n2.inputs['W'].default_value = seed + 3.1; n2.inputs['Scale'].default_value = 45; n2.inputs['Detail'].default_value = 2
    L.new(tc.outputs['Object'], n2.inputs['Vector'])
    # roughness = base + drift - k*height
    r1 = N.new('ShaderNodeMapRange'); L.new(n2.outputs['Fac'], r1.inputs['Value'])
    r1.inputs['From Min'].default_value = 0.3; r1.inputs['From Max'].default_value = 0.7
    r1.inputs['To Min'].default_value = 0.42; r1.inputs['To Max'].default_value = 0.47
    r2 = N.new('ShaderNodeMath'); r2.operation = 'MULTIPLY_ADD'
    L.new(hmix.outputs[0], r2.inputs[0]); r2.inputs[1].default_value = -0.06; L.new(r1.outputs['Result'], r2.inputs[2])
    L.new(r2.outputs[0], b.inputs['Roughness'])
    # edges: bevel normal (0.25 mm) so moulded edges catch light; grain bump on top of it
    bev = N.new('ShaderNodeBevel'); bev.samples = BEVEL_SAMPLES; bev.inputs['Radius'].default_value = BEVEL
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 1.0
    bump.inputs['Distance'].default_value = GRAIN_DEPTH * grain
    L.new(hmix.outputs[0], bump.inputs['Height']); L.new(bev.outputs['Normal'], bump.inputs['Normal'])
    L.new(bump.outputs['Normal'], b.inputs['Normal'])
    # tiny base colour variation (same tool, but no moulded part is a flat sRGB value)
    hsv = N.new('ShaderNodeHueSaturation'); hsv.inputs['Color'].default_value = (*srgb(hexcol), 1)
    vr = N.new('ShaderNodeMapRange'); L.new(n2.outputs['Fac'], vr.inputs['Value'])
    vr.inputs['To Min'].default_value = 0.97; vr.inputs['To Max'].default_value = 1.03
    L.new(vr.outputs['Result'], hsv.inputs['Value']); L.new(hsv.outputs['Color'], b.inputs['Base Color'])
    return m


def sweep_mat():
    """Seamless paper: matte, faint fibre, very slightly warm near-white."""
    m = bpy.data.materials.new('paper'); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb('#e0e0df'), 1)
    b.inputs['Roughness'].default_value = 0.85
    b.inputs['Specular IOR Level'].default_value = 0.25
    tc = N.new('ShaderNodeTexCoord')
    n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 900; n.inputs['Detail'].default_value = 6
    L.new(tc.outputs['Object'], n.inputs['Vector'])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.08; bump.inputs['Distance'].default_value = 0.0002
    L.new(n.outputs['Fac'], bump.inputs['Height']); L.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m


def card_mat(name, val, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (val, val, val, 1); b.inputs['Roughness'].default_value = 0.9
    return m


# ---------------- studio ----------------
def sweep(cam_az=-90.0, w=3.0, depth=1.6, radius=0.30, height=1.4, back=-0.42):
    """Cyclorama: flat floor to y=back, quarter-circle cove, wall up. Built along -Y toward camera."""
    bm = bmesh.new()
    prof = []
    prof.append((depth, 0.0))
    steps = 24
    yc = back + radius
    prof.append((yc, 0.0))
    for i in range(1, steps + 1):
        a = (math.pi / 2) * i / steps
        prof.append((yc - radius * math.sin(a), radius - radius * math.cos(a)))
    prof.append((back, height))
    rows = []
    for (y, z) in prof:
        rows.append((bm.verts.new((-w / 2, y, z)), bm.verts.new((w / 2, y, z))))
    for i in range(len(rows) - 1):
        a0, a1 = rows[i]; b0, b1 = rows[i + 1]
        bm.faces.new((a0, a1, b1, b0))
    me = bpy.data.meshes.new('sweep'); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = link(bpy.data.objects.new('sweep', me))
    o.rotation_euler = (0, 0, math.radians(cam_az + 180 + 90))
    o.data.materials.append(sweep_mat())
    return o


def area(name, loc, look, size, energy, kelvin=5400, shape='RECTANGLE', size_y=None, spread=180):
    ld = bpy.data.lights.new(name, 'AREA'); ld.shape = shape
    ld.size = size; ld.size_y = size_y if size_y else size
    ld.energy = energy * EXPO; ld.spread = math.radians(spread)
    ld.color = tint(kelvin)
    if hasattr(ld, 'use_temperature'):
        ld.use_temperature = False
    o = link(bpy.data.objects.new(name, ld)); o.location = loc
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o


def tint(k):
    """Light colour as a plain linear RGB tint: 6500 K is neutral, lower is warmer. Blender's blackbody at 6500 K
    leaned magenta under Khronos PBR Neutral in round 2, so the rig sets colours directly."""
    w = max(0.0, min(1.5, (6500 - k) / 1500))
    return (1.0, 1.0 - 0.030 * w, 1.0 - 0.085 * w)


def kelvin_rgb(k):
    # coarse blackbody approximation, normalised
    t = k / 100.0
    r = 255 if t <= 66 else 329.7 * (t - 60) ** -0.1332
    g = 99.47 * math.log(t) - 161.1 if t <= 66 else 288.1 * (t - 60) ** -0.0755
    b = 255 if t >= 66 else (0 if t <= 19 else 138.5 * math.log(t - 10) - 305.0)
    c = [max(0, min(255, x)) / 255 for x in (r, g, b)]
    return tuple(srgb('#%02x%02x%02x' % tuple(int(x * 255) for x in c)))


def grad_scrim(name, loc, look, sx, sy, strength, kelvin=5400, falloff=1.6):
    """Graduated scrim: a diffusion panel whose brightness falls from its top edge to zero at its bottom edge,
    as a photographer feathers a softbox. Its reflection lays a real gradient across a dark top face."""
    bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me)); o.location = loc; o.scale = (sx, sy, 1)
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links
    N.remove(N['Principled BSDF'])
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sep.inputs[0])
    pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; L.new(sep.outputs['Y'], pw.inputs[0]); pw.inputs[1].default_value = falloff
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; L.new(pw.outputs[0], mul.inputs[0])
    mul.inputs[1].default_value = strength * EXPO
    em = N.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (*tint(kelvin), 1)
    L.new(mul.outputs[0], em.inputs['Strength'])
    L.new(em.outputs[0], N['Material Output'].inputs['Surface'])
    o.data.materials.append(m)
    o.visible_camera = False; o.visible_shadow = False
    return o


def card(name, loc, look, sx, sy, val):
    bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me)); o.location = loc; o.scale = (sx, sy, 1)
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    o.data.materials.append(card_mat(name, val))
    o.visible_camera = False
    return o


def world(strength=0.25, rot=0.0):
    if not os.path.exists(HDRI):
        os.makedirs(os.path.dirname(HDRI), exist_ok=True)
        os.system(f'curl -sSfL -o {HDRI} {HDRI_URL}')
    w = bpy.data.worlds.new('W'); bpy.context.scene.world = w; w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground')
    env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(HDRI)
    mp = nt.nodes.new('ShaderNodeMapping'); tc = nt.nodes.new('ShaderNodeTexCoord')
    mp.inputs['Rotation'].default_value[2] = rot
    # desaturate the HDRI: it is only there for soft, believable reflections, not colour
    hs = nt.nodes.new('ShaderNodeHueSaturation'); hs.inputs['Saturation'].default_value = 0.3
    nt.links.new(tc.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], env.inputs['Vector'])
    nt.links.new(env.outputs['Color'], hs.inputs['Color']); nt.links.new(hs.outputs['Color'], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = strength
    nt.links.new(bg.outputs['Background'], out.inputs['Surface'])


def rig(target=(0, 0, 0.01), key_az=150, key=1.0, bg=1.0, fill=1.0, fill_az=20, rake_az=None, rake_el=14, rake=0.0, cam_az=-35):
    """One light plan for every still (photographer's rig, all in metres, azimuth in degrees from +X, CCW).
    - overhead scrim: 1.2 x 1.2 m at 0.9 m, tilted to the back, lays the soft gradient on top faces
    - two tall strips ~120 deg either side of camera: edge highlights
    - background light: lights the cove so the sweep reads near-white independent of the product
    - white bounce card low on the camera side, black flags at the sides (negative fill)
    - optional rake: a small soft strip at 10-20 deg elevation across the logo"""
    t = Vector(target)
    def pol(az, el, r):
        a, e = math.radians(az), math.radians(el)
        return t + Vector((math.cos(a) * math.cos(e), math.sin(a) * math.cos(e), math.sin(e))) * r
    back = cam_az + 180
    # key: graduated scrim above and behind, just out of frame; bright edge up, feathered to nothing at the bottom
    grad_scrim('scrim', pol(back, 52, 0.38), t, 0.50, 0.36, 9.0 * key, 5900)
    # edge strips ~120 deg either side of camera
    area('strip_L', pol(cam_az + 115, 20, 0.45), t, 0.10, 55 * key, 5900, size_y=0.7)
    area('strip_R', pol(cam_az - 120, 26, 0.5), t, 0.10, 40 * key, 5900, size_y=0.7)
    # soft frontal fill, big and far: opens the shadow side without flattening
    area('fill', pol(cam_az + fill_az, 30, 1.1), t, 1.2, 220 * fill, 5900, size_y=0.7)
    # background light: hung over the cove behind the product, aimed down at the wall, narrow spread
    a = math.radians(back)
    bgp = t + Vector((math.cos(a) * 0.28, math.sin(a) * 0.28, 0.75))
    bgt = Vector((math.cos(a) * 0.45, math.sin(a) * 0.45, 0.22))
    area('bg', bgp, bgt, 0.7, 300 * bg, 5900, size_y=0.6, spread=55)
    if rake > 0:
        area('rake', pol(rake_az if rake_az is not None else cam_az + 95, rake_el, 0.5), t, 0.06, rake, 5200, size_y=0.5)
    # negative fill: black flags just outside frame on both sides and above the lens
    card('flag_L', pol(cam_az + 62, 18, 0.30), t, 0.25, 0.18, 0.02)
    card('flag_R', pol(cam_az - 62, 18, 0.30), t, 0.25, 0.18, 0.02)
    card('flag_T', pol(cam_az, 62, 0.40), t, 0.30, 0.20, 0.02)
    card('bounce', pol(cam_az - 15, 6, 0.40), t, 0.30, 0.10 * fill, 0.80)


def camera(loc, look, lens=90, fstop=8.0, focus=None, sensor=36):
    cd = bpy.data.cameras.new('cam'); cd.lens = lens; cd.sensor_width = sensor; cd.sensor_fit = 'HORIZONTAL'
    c = link(bpy.data.objects.new('cam', cd)); c.location = loc
    d = Vector(look) - Vector(loc); c.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cd.dof.use_dof = True; cd.dof.aperture_fstop = fstop; cd.dof.aperture_blades = 9; cd.dof.aperture_rotation = 0.2
    cd.dof.focus_distance = (Vector(focus if focus else look) - Vector(loc)).length
    cd.clip_start = 0.01; cd.clip_end = 50
    bpy.context.scene.camera = c
    return c


def look_from(target, az, el, dist):
    a, e = math.radians(az), math.radians(el)
    return tuple(Vector(target) + Vector((math.cos(a) * math.cos(e), math.sin(a) * math.cos(e), math.sin(e))) * dist)


def render(name, w=WIDTH, h=1600):
    sc = bpy.context.scene
    sc.render.resolution_x = int(w * SCALE); sc.render.resolution_y = int(h * SCALE)
    sc.render.resolution_percentage = 100
    sc.render.filepath = os.path.join(OUT, f'{name}_raw.png')
    bpy.ops.render.render(write_still=True)


# ---------------- shots ----------------
BEVEL = 0.00015       # 0.15 mm: edge catch-light without bending the 0.75 mm deboss walls into the letter floor
BEVEL_SAMPLES = 4
GRAIN_SCALE = 9000    # spark-erosion grain ~0.1 mm in object space (metres)
GRAIN_DEPTH = 0.000013
EXPO = 0.045        # global light level: one number to set exposure, ratios stay physical
PLASTIC = '#404143'   # dark grey, not black: holds L* 18-25 on the shadow side


def shot_amigo_hero():
    sc = reset(); world(0.30, rot=0.6); sweep(-62)
    root, top, bot = amigo()
    m_top = plastic('tag_top', PLASTIC, seed=0.0); m_bot = plastic('tag_bot', PLASTIC, seed=5.0)
    top.data.materials.append(m_top); bot.data.materials.append(m_bot)
    place(root, rz=math.radians(TAG_RZ))
    tgt = (0, 0, 0.012)
    rig(tgt, cam_az=-62, fill=1.2, rake=6.0, rake_az=-62 + 100, rake_el=16)
    camera(look_from((0, 0, 0.010), -62, 30, 0.47), (0, 0.004, 0.008), lens=90, fstop=8.0, focus=(0, -0.006, 0.020))
    render('amigo_hero')


def shot_amigo_logo():
    sc = reset(); world(0.22, rot=0.6); sweep(-90)
    root, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    place(root, loc=(0.001, -0.002, 0), rz=math.radians(TAG_RZ - 4.0))
    tgt = (0, 0, 0.023)
    rig(tgt, cam_az=-90, key=0.6, bg=0.5, rake=14.0, rake_az=165, rake_el=12)
    # macro, near top-down: a few degrees off axis so it reads photographed, not orthographic; the far edge falls soft
    camera(look_from((0, 0.005, 0.023), -90, 74, 0.27), (0, 0.006, 0.021), lens=100, fstop=8.0, focus=(0, 0, 0.0232))
    render('amigo_logo')


def shot_amimo_rj45():
    sc = reset(); world(0.30, rot=0.6); sweep(-128)
    root, body, cap = amimo()
    m = plastic('anchor', PLASTIC, 2.0)
    body.data.materials.append(m); cap.data.materials.append(plastic('anchor_cap', PLASTIC, 7.0))
    place(root, rz=math.radians(ANC_RZ))
    rig((0, 0, 0.015), cam_az=-128, fill=2.2, fill_az=42, rake=5.0, rake_az=-128 - 95, rake_el=14)
    camera(look_from((0, 0, 0.012), -128, 24, 0.44), (0.0, 0.0, 0.012), lens=90, fstop=8.0, focus=(0.0, -0.043, 0.014))   # focus on the RJ45 end face
    render('amimo_rj45')


def shot_amigo_page():
    """Round 5 hero still: the hero angle, closer, so the tag fills the frame and the paper can be flattened into
    the page ground (#f5f5f2) by --page. Same rig, same light, same lens; only distance and framing change."""
    sc = reset(); world(0.30, rot=0.6); sweep(-62)
    root, top, bot = amigo()
    m_top = plastic('tag_top', PLASTIC, seed=0.0); m_bot = plastic('tag_bot', PLASTIC, seed=5.0)
    top.data.materials.append(m_top); bot.data.materials.append(m_bot)
    place(root, rz=math.radians(TAG_RZ))
    tgt = (0, 0, 0.012)
    rig(tgt, cam_az=-62, fill=1.2, rake=6.0, rake_az=-62 + 100, rake_el=16)
    camera(look_from((0, 0, 0.010), -62, PAGE_EL, PAGE_DIST), (0, 0.004, 0.006), lens=90, fstop=PAGE_F, focus=(0, -0.006, 0.020))
    if BORDER:
        x0, x1, y0, y1 = BORDER
        sc.render.use_border = True; sc.render.use_crop_to_border = CROP
        sc.render.border_min_x, sc.render.border_max_x = x0, x1
        sc.render.border_min_y, sc.render.border_max_y = y0, y1
    render('amigo_page' + (opt('--tag', '') and '_' + opt('--tag', '')))


def shot_pair_scale():
    sc = reset(); world(0.30, rot=0.6); sweep(-70)
    r1, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    place(r1, loc=(0.050, 0.004, 0), rz=math.radians(TAG_RZ - 14))
    r2, body, cap = amimo()
    body.data.materials.append(plastic('anchor', PLASTIC, 2.0)); cap.data.materials.append(plastic('anchor_cap', PLASTIC, 7.0))
    place(r2, loc=(-0.045, 0.012, 0), rz=math.radians(ANC_RZ - 6))
    rig((0, 0, 0.012), cam_az=-70, fill=1.6, rake=4.0, rake_az=-70 + 100, rake_el=16)
    camera(look_from((0, 0.01, 0.012), -70, 26, 0.63), (0, 0.004, 0.014), lens=90, fstop=8.0, focus=(0, -0.01, 0.015))
    render('pair_scale')


# ---------------- round 11 (realism lab, harvest plan render jobs) ----------------
# Sequences render many frames in one Blender session (scene built once, persistent data) and are resumable:
# a frame whose PNG exists is skipped. '--plate' renders the same studio with the products hidden: the empty
# sweep is the exact flat-field for that camera, so tools/plate_grade.py divides it out (no per-frame fit, so
# the paper cannot flicker between frames). Fixed seed, adaptive sampling with a sample cap and no time limit,
# so a frame's noise does not depend on how busy the machine is.
def _seq_settings(sc, samples):
    sc.cycles.samples = samples; sc.cycles.time_limit = 0; sc.cycles.seed = 11
    sc.cycles.use_animated_seed = False; sc.cycles.adaptive_threshold = 0.02
    sc.render.use_persistent_data = True
    if '--fast' in args:   # web sequences: frames shown at <= 1440 px under AVIF; fewer bounces, cheaper bevel
        sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 2
        for m in bpy.data.materials:
            if m.node_tree:
                for n in m.node_tree.nodes:
                    if n.bl_idname == 'ShaderNodeBevel': n.samples = 2


def _frames(default):
    s = opt('--frames', default); a, b = (int(v) for v in s.split('-')); return range(a, b + 1)


def _hide(objs):
    for o in objs:
        for c in [o] + list(o.children_recursive):
            c.hide_render = True


def _render_seq(path, w, h):
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = w, h; sc.render.resolution_percentage = 100
    sc.render.filepath = path + '.tmp.png'
    bpy.ops.render.render(write_still=True)
    os.replace(path + '.tmp.png', path)


def shot_turntable():
    """R1: AmIGo turntable for the homepage hero. The tag turns on a fixed studio (as on a real turntable),
    so the light and the sweep stay put and only the product moves. 85 mm, camera el 22 deg at 0.35 m.
    The camera stands at az -30 so the rig's graduated scrim key sits at az 150, el 52 (plan: key az 150 el 55).
        render_hardware.py turntable --res 1440 --steps 96 --frames 0-95 [--plate] [--samples 48] --out DIR"""
    res = opt('--res', 1440); steps = opt('--steps', 96)
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.30, rot=0.6); sweep(-30)
    root, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    base = root.matrix_world.copy(); _seq_settings(sc, SAMPLES)
    rig((0, 0, 0.012), cam_az=-30, fill=1.2, rake=6.0, rake_az=-30 + 100, rake_el=16)
    camera(look_from((0, 0, 0.010), -30, 22, 0.35), (0, 0, 0.009), lens=85, fstop=8.0, focus=(0, 0, 0.012))
    os.makedirs(OUT, exist_ok=True)
    if '--plate' in args:
        _hide([root]); _render_seq(os.path.join(OUT, 'plate.png'), res // 4, res // 4); return   # smooth: a quarter size is enough
    # only the region the turning tag and its contact shadow can reach is path traced (measured on a 480 px
    # test: x 0.12-0.80, y 0.29-0.66 of the frame); outside it the frame is the plate, so it is left black here
    # and plate_grade.py takes the plate there. About 36 % of the pixels, so about 3x faster.
    sc.render.use_border = True; sc.render.use_crop_to_border = False
    sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = 0.07, 0.87, 0.23, 0.71
    for f in _frames(f'0-{steps - 1}'):
        p = os.path.join(OUT, 'f%04d.png' % f)
        if os.path.exists(p): continue
        # frame 0 is the poster: logo face toward the camera, turned ~30 deg off square (the hero three-quarter); the tag turns CCW seen from above
        root.matrix_world = Matrix.Rotation(math.radians(TAG_RZ + 50 + 360.0 * f / steps), 4, 'Z') @ base
        bpy.context.view_layer.update()
        t0 = __import__('time').time(); _render_seq(p, res, res); print('FRAME', f, '%.1fs' % (__import__('time').time() - t0), flush=True)


def _still_or_plate(name, w, h, products):
    """Render <OUT>/<name>.png, or with --plate the same frame with the products hidden at a quarter size (the
    empty sweep is smooth, so plate_grade.py upsamples it). --border x0,x1,y0,y1 limits path tracing to a region
    (the rest is left black and plate_grade.py takes the plate there)."""
    sc = bpy.context.scene; os.makedirs(OUT, exist_ok=True)
    if '--plate' in args:
        _hide(products); _render_seq(os.path.join(OUT, name + '_plate.png'), max(64, w // 4), max(64, h // 4)); return
    if BORDER:
        sc.render.use_border = True; sc.render.use_crop_to_border = False
        sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = BORDER
    t0 = __import__('time').time(); _render_seq(os.path.join(OUT, name + '.png'), w, h)
    print('STILL', name, '%.1fs' % (__import__('time').time() - t0), flush=True)


def _tag(rz=0.0, loc=(0, 0, 0)):
    root, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    place(root, loc=loc, rz=math.radians(rz)); return root


def _anchor(rz=0.0, loc=(0, 0, 0)):
    root, body, cap = amimo()
    body.data.materials.append(plastic('anchor', PLASTIC, 2.0)); cap.data.materials.append(plastic('anchor_cap', PLASTIC, 7.0))
    place(root, loc=loc, rz=math.radians(rz)); return root


def shot_family():
    """R3 / R3b: AmIGo front-left and AmIMo back-right on one sweep at true CAD scale, 85 mm, el 30, 3:1.
    Still: camera 0.35 m above the target at el 30 (0.70 m away). --frames a-b renders the R3b lateral dolly
    instead: --dolly-dist 0.5, the camera and its look point track along the frame's horizontal from the tag's
    centre to the anchor's (--track -0.07,0.075), studio fixed; --steps 24. --res WxH."""
    W, H = (int(v) for v in opt('--res', '3840x1280').split('x'))
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.30, rot=0.6)
    CAZ = -80.0
    sweep(CAZ)
    t = _tag(TAG_RZ - 14, (-0.060, -0.018, 0)); a = _anchor(ANC_RZ - 8, (0.066, 0.022, 0))
    _seq_settings(sc, SAMPLES)
    rig((0, 0, 0.012), cam_az=CAZ, fill=1.6, rake=4.0, rake_az=CAZ + 100, rake_el=16)
    ca, sa = math.cos(math.radians(CAZ + 90)), math.sin(math.radians(CAZ + 90))   # frame-right in world xy
    if '--frames' not in args:
        camera(look_from((0.003, 0.002, 0.020), CAZ, 30, opt('--dist', 1.0)), (0.003, 0.002, 0.020), lens=85, fstop=11.0, focus=(0, 0, 0.016))
        _still_or_plate('family', W, H, [t, a]); return
    d = opt('--dolly-dist', 0.8); x0, x1 = (float(v) for v in opt('--track', '-0.075,0.085').split(','))
    steps = opt('--steps', 24)
    for f in _frames(f'0-{steps - 1}'):
        u = f / (steps - 1); u = u * u * (3 - 2 * u) * 0.0 + u     # linear in frame: the page's scroll sets the ease
        off = x0 + (x1 - x0) * u
        tgt = (0.003 + ca * off, 0.002 + sa * off, 0.020)
        for o in [o for o in bpy.data.objects if o.name == 'cam']: bpy.data.objects.remove(o)
        camera(look_from(tgt, CAZ, 30, d), tgt, lens=85, fstop=11.0, focus=(tgt[0], tgt[1], 0.016))
        name = 'dolly_f%04d' % f
        if '--plate' in args:
            p = os.path.join(OUT, name + '_plate.png')
            if not os.path.exists(p): _hide([t, a]); _render_seq(p, W // 4, H // 4)
            continue
        if os.path.exists(os.path.join(OUT, name + '.png')): continue
        _still_or_plate(name, W, H, [t, a])


def shot_macro():
    """R2: AmIGo macro for the giant spec screen. Logo face and the left screw ear, the tag's right end running
    off the frame's right edge (the page bleeds it off the viewport). 100 mm, f/8, focus on the logo plane."""
    W, H = (int(v) for v in opt('--res', '2400x1600').split('x'))
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.22, rot=0.6); sweep(-90)
    t = _tag(TAG_RZ - 4.0, (0.030, 0.003, 0)); _seq_settings(sc, SAMPLES)
    rig((0, 0, 0.023), cam_az=-90, key=0.7, bg=0.6, rake=12.0, rake_az=165, rake_el=12)
    el = opt('--el', 58.0); dist = opt('--dist', 0.29)
    camera(look_from((0.0, -0.007, 0.020), -90, el, dist), (0.0, -0.007, 0.020), lens=100, fstop=8.0, focus=(0.0, 0.0, 0.0232))
    _still_or_plate('macro', W, H, [t])


def shot_closer():
    """R9: closer-look angles on the turntable rig (camera az -30, 85 mm): --product amigo|amimo --az A --el E.
    The product turns by --az (0 = the turntable's poster pose) and the camera rises to --el."""
    W, H = (int(v) for v in opt('--res', '1600x1600').split('x'))
    prod = opt('--product', 'amigo'); az = opt('--az', 0.0); el = opt('--el', 30.0)
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.30, rot=0.6); sweep(-30)
    if prod == 'amigo':
        p = _tag(TAG_RZ + 50 + az); dist = 0.33; tz = 0.010
    else:
        p = _anchor(ANC_RZ + 40 + az); dist = 0.38; tz = 0.014
    _seq_settings(sc, SAMPLES)
    rig((0, 0, 0.012), cam_az=-30, fill=1.6 if prod == 'amimo' else 1.2, rake=6.0, rake_az=-30 + 100, rake_el=16)
    camera(look_from((0, 0, tz), -30, el, dist), (0, 0, tz), lens=85, fstop=8.0, focus=(0, 0, tz + 0.004))
    _still_or_plate(f'closer_{prod}_az{int(az)}_el{int(el)}', W, H, [p])


def _seq_static(name, W, H, steps, movable, pose_fn):
    """A sequence with a locked camera and studio: one plate (the movable CAD parts hidden), then each frame."""
    if '--plate' in args:
        p = os.path.join(OUT, name + '_plate.png')
        if not os.path.exists(p): _hide(movable); _render_seq(p, max(64, W // 4), max(64, H // 4))
        return
    for f in _frames(f'0-{steps - 1}'):
        p = os.path.join(OUT, '%s_f%04d.png' % (name, f))
        if os.path.exists(p): continue
        pose_fn(f / (steps - 1)); bpy.context.view_layer.update()
        t0 = __import__('time').time(); _render_seq(p, W, H); print('FRAME', name, f, '%.1fs' % (__import__('time').time() - t0), flush=True)


def shot_lower():
    """R10: AmIGo lowering onto a trolley rail, tag z 120 mm -> 0 over 12 frames (ease-out, as a hand sets it down).
    The rail is a plain 30 x 30 mm square steel tube (an environment prop, not hardware: the trolley's rail) lying
    across the sweep; the tag lands on its top face. Nothing is added to the tag: no screw is drawn."""
    W, H = (int(v) for v in opt('--res', '1600x1000').split('x'))
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.30, rot=0.6); sweep(-62)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    me = bpy.data.meshes.new('rail'); bm.to_mesh(me); bm.free()
    rail = link(bpy.data.objects.new('rail', me)); rail.scale = (0.24, 0.030, 0.030); rail.location = (0, 0, 0.015); rail.rotation_euler = (0, 0, math.radians(-62 + 90 + 20))
    bv = rail.modifiers.new('bv', 'BEVEL'); bv.width = 0.0015; bv.segments = 3
    m = bpy.data.materials.new('steel'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb('#b9bcc0'), 1); b.inputs['Metallic'].default_value = 1.0
    b.inputs['Roughness'].default_value = 0.42; rail.data.materials.append(m)
    t = _tag(-62 + 90 + 20 + 90, (0, 0, 0.030)); base = t.matrix_world.copy()
    _seq_settings(sc, SAMPLES)
    rig((0, 0, 0.05), cam_az=-62, fill=1.2, rake=6.0, rake_az=-62 + 100, rake_el=16)
    camera(look_from((0, 0, 0.078), -62, 16, 0.80), (0, 0, 0.078), lens=85, fstop=11.0, focus=(0, 0, 0.045))
    def pose(u):
        z = 0.120 * (1 - u) ** 2   # ease out: fast at first, settling onto the rail
        t.matrix_world = Matrix.Translation((0, 0, z)) @ base
    _seq_static('lower', W, H, opt('--steps', 12), [t, rail], pose)   # the plate is the bare sweep: the rail must stay in the picture


def shot_covers():
    """R11: the two AmIGo covers part: the top cover (the logo face) lifts 18 mm straight off the bottom cover over
    24 frames, camera el 25. CAD parts only; the CAD holds no electronics, so none are shown."""
    W, H = (int(v) for v in opt('--res', '1200x1200').split('x'))
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.30, rot=0.6); sweep(-30)
    root, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    place(root, rz=math.radians(TAG_RZ + 50)); tb = top.matrix_world.copy()
    _seq_settings(sc, SAMPLES)
    rig((0, 0, 0.02), cam_az=-30, fill=1.4, rake=6.0, rake_az=-30 + 100, rake_el=16)
    camera(look_from((0, 0, 0.020), -30, 25, 0.36), (0, 0, 0.020), lens=85, fstop=11.0, focus=(0, 0, 0.022))
    def pose(u):
        e = u * u * (3 - 2 * u)
        top.matrix_world = Matrix.Translation((0, 0, 0.018 * e)) @ tb
    _seq_static('covers', W, H, opt('--steps', 24), [top, bot], pose)


def shot_amimo_column():
    """R13: AmIMo on a column, from below. The anchor as the CAD gives it: the flanged plate flat on the column
    face, the RJ45 opening facing down. 70 mm, camera ~0.33 m out and below; key from above at el 60, fill 1:6.
    The column is a plain painted steel face (environment). No cable: the CAD has no DC jack, and a cable or plug
    would be a part that is not in the CAD (homepage-final.md asks for one; see the manifest)."""
    W, H = (int(v) for v in opt('--res', '2400x1600').split('x'))
    sc = reset(); _seq_settings(sc, SAMPLES); world(0.35, rot=0.6)
    body = import_part('PCB_ENCLOUSER_main_body'); cap = import_part('PCB_ENCLOUSER_cap')
    root = link(bpy.data.objects.new('amimo', None))
    for o in (body, cap): o.parent = root
    body.data.materials.append(plastic('anchor', PLASTIC, 2.0)); cap.data.materials.append(plastic('anchor_cap', PLASTIC, 7.0))
    bpy.context.view_layer.update()
    vs = [p.matrix_world @ v.co for p in (body, cap) for v in p.data.vertices]
    mx = Vector([max(v[i] for v in vs) for i in range(3)]); mn = Vector([min(v[i] for v in vs) for i in range(3)])
    root.location = (-(mn.x + mx.x) / 2, -mx.y, -(mn.z + mx.z) / 2)   # plate (CAD +Y) on the face y = 0, centred
    bpy.context.view_layer.update()
    # the column: a 0.30 m painted steel box behind the face y = 0, standing tall
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); me = bpy.data.meshes.new('col'); bm.to_mesh(me); bm.free()
    col = link(bpy.data.objects.new('column', me)); col.scale = (0.40, 0.30, 3.0); col.location = (-0.07, 0.15, 0)
    bv = col.modifiers.new('bv', 'BEVEL'); bv.width = 0.004; bv.segments = 3
    m = bpy.data.materials.new('paint'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb('#d9dde3'), 1); b.inputs['Roughness'].default_value = 0.55
    tc = m.node_tree.nodes.new('ShaderNodeTexCoord'); n = m.node_tree.nodes.new('ShaderNodeTexNoise')
    n.inputs['Scale'].default_value = 400; bp = m.node_tree.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.05
    m.node_tree.links.new(tc.outputs['Object'], n.inputs['Vector']); m.node_tree.links.new(n.outputs['Fac'], bp.inputs['Height'])
    m.node_tree.links.new(bp.outputs['Normal'], b.inputs['Normal']); col.data.materials.append(m)
    _seq_settings(sc, SAMPLES)
    area('key', (0.10, -0.30, 0.55), (0, 0, 0), 0.5, 300, 5900, size_y=0.4)            # el ~60 from the front-right
    area('fill', (-0.45, -0.55, -0.15), (0, 0, 0), 1.0, 50, 5900, size_y=0.7)         # about 1:6 to the key, from the left, low
    area('rim', (-0.25, -0.05, 0.35), (0, 0, 0), 0.08, 30, 5900, size_y=0.5)
    camera((0.20, -0.38, -0.15), (0.0, -0.012, -0.002), lens=70, fstop=8.0, focus=(0.0, -0.02, -0.03))
    os.makedirs(OUT, exist_ok=True)
    t0 = __import__('time').time(); _render_seq(os.path.join(OUT, 'amimo_column.png'), W, H)
    print('STILL amimo_column', '%.1fs' % (__import__('time').time() - t0), flush=True)


TAG_RZ = 90.0     # long axis across frame
PAGE_EL = opt('--el', 30.0)
PAGE_DIST = opt('--dist', 0.35)
PAGE_F = opt('--fstop', 8.0)
CROP = '--crop' in args   # write only the border region (8K masters are rendered as overlapping tiles, see stitch_tiles)
BORDER = [float(x) for x in opt('--border', '').split(',')] if opt('--border', '') else None
ANC_RZ = 0.0

if __name__ == '__main__':
    shots = {'amigo_hero': shot_amigo_hero, 'amigo_logo': shot_amigo_logo,
             'amimo_rj45': shot_amimo_rj45, 'pair_scale': shot_pair_scale, 'amigo_page': shot_amigo_page,
             'turntable': shot_turntable, 'family': shot_family, 'macro': shot_macro, 'closer': shot_closer,
             'lower': shot_lower, 'covers': shot_covers, 'amimo_column': shot_amimo_column}
    for s in (shots if SHOT == 'all' else [SHOT]):
        shots[s]()
