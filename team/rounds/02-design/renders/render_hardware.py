"""AmIMotion studio hardware renders from the founders' CAD (AmIGo tag, AmIMo anchor).

Blender 5.1 Python module, Cycles CPU, headless.
    /tmp/bpyenv/bin/python render_hardware.py <shot> [--scale 0.5] [--samples 384] [--out DIR]
shots: amigo_hero, amigo_logo, amimo_rj45, pair_scale, all
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
    # 1. lens falloff: cos^4-like, very gentle (an 85-100 mm lens at f/8 shows ~0.15 stop at corners)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (w / 2))
    a *= (1 - 0.07 * r ** 2)[..., None]
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
SAMPLES = opt('--samples', 384)
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
    sc.cycles.adaptive_threshold = 0.006
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
    sc.cycles.denoising_prefilter = 'ACCURATE'
    sc.cycles.max_bounces = 10
    sc.cycles.diffuse_bounces = 4
    sc.cycles.glossy_bounces = 6
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 0.5
    sc.cycles.use_light_tree = True
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 4
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Base Contrast'
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
    n1.inputs['W'].default_value = seed; n1.inputs['Scale'].default_value = 11000; n1.inputs['Detail'].default_value = 3
    n1.inputs['Roughness'].default_value = 0.55
    # sparse pits (voronoi) to break the noise into an EDM-like crater texture
    v1 = N.new('ShaderNodeTexVoronoi'); v1.voronoi_dimensions = '4D'; v1.feature = 'F1'
    v1.inputs['W'].default_value = seed; v1.inputs['Scale'].default_value = 7000
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
    r1.inputs['To Min'].default_value = 0.50; r1.inputs['To Max'].default_value = 0.56
    r2 = N.new('ShaderNodeMath'); r2.operation = 'MULTIPLY_ADD'
    L.new(hmix.outputs[0], r2.inputs[0]); r2.inputs[1].default_value = -0.06; L.new(r1.outputs['Result'], r2.inputs[2])
    L.new(r2.outputs[0], b.inputs['Roughness'])
    # edges: bevel normal (0.25 mm) so moulded edges catch light; grain bump on top of it
    bev = N.new('ShaderNodeBevel'); bev.samples = 8; bev.inputs['Radius'].default_value = 0.00028
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 1.0
    bump.inputs['Distance'].default_value = 0.000012 * grain
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
    b.inputs['Base Color'].default_value = (*srgb('#d9d7d3'), 1)
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
def sweep(w=3.0, depth=1.6, radius=0.45, height=1.4, back=-0.55):
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
    o.data.materials.append(sweep_mat())
    return o


def area(name, loc, look, size, energy, kelvin=5400, shape='RECTANGLE', size_y=None, spread=180):
    ld = bpy.data.lights.new(name, 'AREA'); ld.shape = shape
    ld.size = size; ld.size_y = size_y if size_y else size
    ld.energy = energy * EXPO; ld.spread = math.radians(spread)
    ld.use_temperature = True if hasattr(ld, 'use_temperature') else False
    if hasattr(ld, 'temperature'):
        ld.temperature = kelvin
    else:
        ld.color = kelvin_rgb(kelvin)
    o = link(bpy.data.objects.new(name, ld)); o.location = loc
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o


def kelvin_rgb(k):
    # coarse blackbody approximation, normalised
    t = k / 100.0
    r = 255 if t <= 66 else 329.7 * (t - 60) ** -0.1332
    g = 99.47 * math.log(t) - 161.1 if t <= 66 else 288.1 * (t - 60) ** -0.0755
    b = 255 if t >= 66 else (0 if t <= 19 else 138.5 * math.log(t - 10) - 305.0)
    c = [max(0, min(255, x)) / 255 for x in (r, g, b)]
    return tuple(srgb('#%02x%02x%02x' % tuple(int(x * 255) for x in c)))


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


def rig(target=(0, 0, 0.01), key_az=150, key=1.0, rake_az=None, rake_el=14, rake=0.0, cam_az=-35):
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
    area('scrim', pol(cam_az + 180, 62, 0.9), t, 1.3, 260 * key, 5400, size_y=1.0)
    area('strip_L', pol(cam_az + 118, 22, 0.55), t, 0.18, 55 * key, 5300, size_y=0.9)
    area('strip_R', pol(cam_az - 118, 24, 0.6), t, 0.18, 45 * key, 5300, size_y=0.9)
    area('front_soft', pol(cam_az + 25, 38, 1.4), t, 1.0, 70 * key, 5500, size_y=0.8)
    area('bg', (0, -0.1, 1.2), (0, -0.5, 0.2), 1.6, 380, 5300, size_y=1.0)
    if rake > 0:
        area('rake', pol(rake_az if rake_az is not None else cam_az + 95, rake_el, 0.5), t, 0.08, rake, 5200, size_y=0.6)
    card('bounce', pol(cam_az - 20, 8, 0.45), t, 0.4, 0.25, 0.85)


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
EXPO = 0.045        # global light level: one number to set exposure, ratios stay physical
PLASTIC = '#45484d'   # dark grey, not black: holds L* 18-25 on the shadow side


def shot_amigo_hero():
    sc = reset(); world(0.30, rot=0.6); sweep()
    root, top, bot = amigo()
    m_top = plastic('tag_top', PLASTIC, seed=0.0); m_bot = plastic('tag_bot', PLASTIC, seed=5.0)
    top.data.materials.append(m_top); bot.data.materials.append(m_bot)
    place(root, rz=math.radians(TAG_RZ))
    tgt = (0, 0, 0.012)
    rig(tgt, cam_az=-62, rake=6.0, rake_az=-62 + 100, rake_el=16)
    camera(look_from((0, 0, 0.010), -62, 30, 0.47), (0, 0.004, 0.008), lens=90, fstop=8.0, focus=(0, -0.006, 0.020))
    render('amigo_hero')


def shot_amigo_logo():
    sc = reset(); world(0.30, rot=0.6); sweep()
    root, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    place(root, rz=math.radians(TAG_RZ))
    tgt = (0, 0, 0.023)
    rig(tgt, cam_az=-90, rake=9.0, rake_az=165, rake_el=12)
    # near top-down, a few degrees off axis so it reads photographed, not orthographic
    camera(look_from((0, 0, 0.023), -90, 78, 0.40), (0, 0, 0.018), lens=100, fstop=8.0, focus=(0, 0, 0.0232))
    render('amigo_logo')


def shot_amimo_rj45():
    sc = reset(); world(0.30, rot=0.6); sweep()
    root, body, cap = amimo()
    m = plastic('anchor', PLASTIC, 2.0)
    body.data.materials.append(m); cap.data.materials.append(plastic('anchor_cap', PLASTIC, 7.0))
    place(root, rz=math.radians(ANC_RZ))
    rig((0, 0, 0.015), cam_az=-55, rake=0.0)
    camera(look_from((0, 0, 0.012), -55, 24, 0.55), (0, 0.004, 0.012), lens=90, fstop=8.0, focus=(0, -0.03, 0.02))
    render('amimo_rj45')


def shot_pair_scale():
    sc = reset(); world(0.30, rot=0.6); sweep()
    r1, top, bot = amigo()
    top.data.materials.append(plastic('tag_top', PLASTIC, 0.0)); bot.data.materials.append(plastic('tag_bot', PLASTIC, 5.0))
    place(r1, loc=(0.052, 0.006, 0), rz=math.radians(TAG_RZ + 8))
    r2, body, cap = amimo()
    body.data.materials.append(plastic('anchor', PLASTIC, 2.0)); cap.data.materials.append(plastic('anchor_cap', PLASTIC, 7.0))
    place(r2, loc=(-0.045, 0.012, 0), rz=math.radians(ANC_RZ - 6))
    rig((0, 0, 0.012), cam_az=-70, rake=0.0)
    camera(look_from((0, 0.01, 0.012), -70, 26, 0.80), (0, 0.006, 0.010), lens=90, fstop=8.0, focus=(0, -0.01, 0.015))
    render('pair_scale')


TAG_RZ = 90.0     # long axis across frame
ANC_RZ = 0.0

if __name__ == '__main__':
    shots = {'amigo_hero': shot_amigo_hero, 'amigo_logo': shot_amigo_logo,
             'amimo_rj45': shot_amimo_rj45, 'pair_scale': shot_pair_scale}
    for s in (shots if SHOT == 'all' else [SHOT]):
        shots[s]()
