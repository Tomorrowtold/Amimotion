"""Photographic scenes for the AmIMotion site, built from the real AmIGo / AmIMo CAD in Blender Cycles.
Units: metres, Z up. Everything procedural so it renders in the cloud with no downloaded assets."""
import bpy, bmesh, math, random, os, sys
from mathutils import Vector, Euler

HERE = os.path.dirname(os.path.abspath(__file__))
R = random.Random(7)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.max_bounces = 8
    sc.cycles.glossy_bounces = 4
    sc.cycles.transparent_max_bounces = 4
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.image_settings.file_format = 'PNG'
    sc.render.film_transparent = False
    return sc


def world(hdri='workshop.exr', strength=0.35, rot=0.0, tint=(1, 1, 1)):
    w = bpy.data.worlds.new('W'); bpy.context.scene.world = w; w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground')
    env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(os.path.join(HERE, hdri))
    mp = nt.nodes.new('ShaderNodeMapping'); tc = nt.nodes.new('ShaderNodeTexCoord'); mp.inputs['Rotation'].default_value[2] = rot
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 1
    mix.inputs[7].default_value = (*tint, 1)
    nt.links.new(tc.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], env.inputs['Vector'])
    nt.links.new(env.outputs['Color'], mix.inputs[6]); nt.links.new(mix.outputs[2], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = strength; nt.links.new(bg.outputs['Background'], out.inputs['Surface'])


# ---------------- materials ----------------
def mat(name, color, rough=0.5, metal=0.0, coat=0.0, spec=0.5, emit=None, emit_s=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal; b.inputs['Coat Weight'].default_value = coat
    b.inputs['Specular IOR Level'].default_value = spec
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = emit_s
    if alpha < 1: b.inputs['Alpha'].default_value = alpha
    return m


def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def noisy(m, scale=40.0, amount=0.25, rough_lo=None, rough_hi=None, bump=0.0, bscale=200.0):
    """Break up a flat material: colour and roughness variation from noise, optional fine bump."""
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = 8
    nt.links.new(tc.outputs['Object'], n.inputs['Vector'])
    base = b.inputs['Base Color'].default_value[:]
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = amount
    mx.inputs[6].default_value = base; nt.links.new(n.outputs['Fac'], mx.inputs[7])
    cr = nt.nodes.new('ShaderNodeMapRange'); nt.links.new(n.outputs['Fac'], cr.inputs['Value'])
    cr.inputs['To Min'].default_value = 0.55; cr.inputs['To Max'].default_value = 1.25
    mul = nt.nodes.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1
    mul.inputs[6].default_value = base; nt.links.new(cr.outputs['Result'], mul.inputs[7])
    mix2 = nt.nodes.new('ShaderNodeMix'); mix2.data_type = 'RGBA'; mix2.inputs['Factor'].default_value = amount
    mix2.inputs[6].default_value = base; nt.links.new(mul.outputs[2], mix2.inputs[7])
    nt.links.new(mix2.outputs[2], b.inputs['Base Color'])
    if rough_lo is not None:
        rr = nt.nodes.new('ShaderNodeMapRange'); nt.links.new(n.outputs['Fac'], rr.inputs['Value'])
        rr.inputs['To Min'].default_value = rough_lo; rr.inputs['To Max'].default_value = rough_hi
        nt.links.new(rr.outputs['Result'], b.inputs['Roughness'])
    if bump:
        n2 = nt.nodes.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = bscale; n2.inputs['Detail'].default_value = 4
        nt.links.new(tc.outputs['Object'], n2.inputs['Vector'])
        bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = 0.002
        nt.links.new(n2.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m


def brushed(m, scale=(1, 1, 400)):
    """Anisotropic-looking brushed metal: stretched noise into roughness."""
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = scale
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 6; n.inputs['Detail'].default_value = 12
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], n.inputs['Vector'])
    rr = nt.nodes.new('ShaderNodeMapRange'); rr.inputs['To Min'].default_value = 0.18; rr.inputs['To Max'].default_value = 0.42
    nt.links.new(n.outputs['Fac'], rr.inputs['Value']); nt.links.new(rr.outputs['Result'], b.inputs['Roughness'])
    return m


def floor_mat(base='#6d6f70', gloss=0.28):
    """Epoxy-coated plant floor: mottled grey, scuffs, glossy in patches."""
    m = mat('floor', srgb(base), rough=gloss, spec=0.5)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    big = nt.nodes.new('ShaderNodeTexNoise'); big.inputs['Scale'].default_value = 0.35; big.inputs['Detail'].default_value = 6
    fine = nt.nodes.new('ShaderNodeTexNoise'); fine.inputs['Scale'].default_value = 60; fine.inputs['Detail'].default_value = 10
    scuff = nt.nodes.new('ShaderNodeTexWave'); scuff.inputs['Scale'].default_value = 1.2; scuff.inputs['Distortion'].default_value = 6; scuff.inputs['Detail'].default_value = 6
    for t in (big, fine, scuff): nt.links.new(tc.outputs['Object'], t.inputs['Vector'])
    c1 = nt.nodes.new('ShaderNodeMapRange'); c1.inputs['To Min'].default_value = 0.72; c1.inputs['To Max'].default_value = 1.18; nt.links.new(big.outputs['Fac'], c1.inputs['Value'])
    c2 = nt.nodes.new('ShaderNodeMapRange'); c2.inputs['To Min'].default_value = 0.9; c2.inputs['To Max'].default_value = 1.06; nt.links.new(fine.outputs['Fac'], c2.inputs['Value'])
    m1 = nt.nodes.new('ShaderNodeMath'); m1.operation = 'MULTIPLY'; nt.links.new(c1.outputs['Result'], m1.inputs[0]); nt.links.new(c2.outputs['Result'], m1.inputs[1])
    col = nt.nodes.new('ShaderNodeMix'); col.data_type = 'RGBA'; col.blend_type = 'MULTIPLY'; col.inputs['Factor'].default_value = 1
    col.inputs[6].default_value = (*srgb(base), 1); nt.links.new(m1.outputs[0], col.inputs[7]); nt.links.new(col.outputs[2], b.inputs['Base Color'])
    rr = nt.nodes.new('ShaderNodeMapRange'); rr.inputs['To Min'].default_value = gloss * 0.8; rr.inputs['To Max'].default_value = min(0.7, gloss * 1.6)
    sm = nt.nodes.new('ShaderNodeMath'); sm.operation = 'ADD'; nt.links.new(big.outputs['Fac'], sm.inputs[0]); nt.links.new(scuff.outputs['Fac'], sm.inputs[1])
    sm2 = nt.nodes.new('ShaderNodeMath'); sm2.operation = 'MULTIPLY'; sm2.inputs[1].default_value = 0.5; nt.links.new(sm.outputs[0], sm2.inputs[0])
    nt.links.new(sm2.outputs[0], rr.inputs['Value']); nt.links.new(rr.outputs['Result'], b.inputs['Roughness'])
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.06; nt.links.new(fine.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m


# ---------------- geometry helpers ----------------
def link(o):
    bpy.context.scene.collection.objects.link(o); return o


def box(name, size, loc, m, bevel=0.0, rot=(0, 0, 0)):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    bm.to_mesh(me); bm.free(); o = link(bpy.data.objects.new(name, me)); o.location = loc; o.rotation_euler = rot
    me.materials.append(m)
    if bevel:
        bv = o.modifiers.new('b', 'BEVEL'); bv.width = bevel; bv.segments = 3; bv.limit_method = 'ANGLE'
    for p in me.polygons: p.use_smooth = True
    return o


def cyl(name, r, h, loc, m, rot=(0, 0, 0), verts=48, bevel=0.0, hole=0.0):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=h)
    bm.to_mesh(me); bm.free(); o = link(bpy.data.objects.new(name, me)); o.location = loc; o.rotation_euler = rot
    me.materials.append(m)
    if hole:
        hc = cyl(name + '_h', hole, h * 3, loc, m, rot, verts)
        bo = o.modifiers.new('hole', 'BOOLEAN'); bo.object = hc; bo.operation = 'DIFFERENCE'; hc.hide_render = True; hc.hide_viewport = True
    if bevel:
        bv = o.modifiers.new('b', 'BEVEL'); bv.width = bevel; bv.segments = 2; bv.limit_method = 'ANGLE'
    for p in me.polygons: p.use_smooth = True
    o.data.shade_auto_smooth if hasattr(o.data, 'shade_auto_smooth') else None
    return o


def autosmooth(o, deg=35):
    try:
        bpy.context.view_layer.objects.active = o; o.select_set(True)
        bpy.ops.object.shade_auto_smooth(angle=math.radians(deg))
        o.select_set(False)
    except Exception:
        pass


def stl(name, m):
    bpy.ops.wm.stl_import(filepath=os.path.join(HERE, name + '.stl'))
    o = bpy.context.selected_objects[0]; o.data.materials.clear(); o.data.materials.append(m)
    autosmooth(o, 32); o.select_set(False); return o


def group(name, objs, loc=(0, 0, 0), rot=(0, 0, 0), scale=1.0):
    e = link(bpy.data.objects.new(name, None)); e.location = loc; e.rotation_euler = rot; e.scale = (scale,) * 3
    for o in objs: o.parent = e
    return e


# ---------------- AmIMotion hardware (real CAD) ----------------
TAG_M = None


def tag_mats():
    top = mat('tag_top', srgb('#4b4f55'), rough=0.42, coat=0.15)
    noisy(top, scale=900, amount=0.08, rough_lo=0.36, rough_hi=0.5, bump=0.08, bscale=1400)
    bot = mat('tag_bot', srgb('#36393d'), rough=0.5)
    return top, bot


def amigo(loc, rot=(0, 0, 0), led=False):
    """AmIGo tag, top face up, centred on its footprint, base on z=0 of the group. ~59 x 86 x 23 mm."""
    top, bot = tag_mats()
    a = stl('top_cover', top); b = stl('bottom_cover', bot)
    inner = group('amigo_inner', [a, b], loc=(-61.7, 66.0, 10.6), rot=(math.pi, 0, 0))  # flip: top face (-z in CAD) up
    objs = [inner]
    if led:
        lm = mat('tag_led', (0.02, 0.05, 0.12), rough=0.3, emit=srgb('#66a5fa'), emit_s=6.0)
        d = cyl('tag_led', 1.1, 0.6, (0, -30.0, 23.4), lm, verts=24); objs.append(d)
    g = group('amigo', objs, loc=loc, rot=rot, scale=0.001)
    return g


def amimo(loc, rot=(0, 0, 0), led=False):
    """AmIMo anchor, front cap facing -Y in group space, standing up. ~59 x 30 x 106 mm."""
    m = mat('anc', srgb('#575b61'), rough=0.44, coat=0.12)
    noisy(m, scale=700, amount=0.07, rough_lo=0.38, rough_hi=0.52, bump=0.06, bscale=1200)
    a = stl('PCB_ENCLOUSER_main_body', m); b = stl('PCB_ENCLOUSER_cap', m)
    inner = group('amimo_inner', [a, b], loc=(3.3, -6.2, 0), rot=(0, 0, math.pi))
    objs = [inner]
    if led:
        lm = mat('anc_led', (0.02, 0.05, 0.12), rough=0.3, emit=srgb('#66a5fa'), emit_s=8.0)
        objs.append(box('anc_led', (2.2, 1.0, 6.0), (30.0, -14.6, 30.0), lm))
    return group('amimo', objs, loc=loc, rot=rot, scale=0.001)


# ---------------- plant furniture ----------------
def trolley(loc, rot=0.0, paint='#3b4f6b', crate='#2f5d9e', load='parts', shelves=(0.18, 0.55, 0.9), w=1.0, d=0.6, tag=True, tag_x=0.18):
    """Three-shelf shop-floor trolley in powder-coated square tube, castors, crates of machined parts."""
    pm = mat('paint', srgb(paint), rough=0.42, coat=0.15); noisy(pm, scale=14, amount=0.3, rough_lo=0.32, rough_hi=0.7, bump=0.08)
    sm = mat('shelf', srgb(paint), rough=0.5); noisy(sm, scale=6, amount=0.4, rough_lo=0.35, rough_hi=0.8, bump=0.12, bscale=90)
    rub = mat('rubber', srgb('#151515'), rough=0.7); zinc = mat('zinc', srgb('#9aa0a6'), rough=0.3, metal=1.0)
    objs = []; t = 0.025
    for sx in (-1, 1):
        for sy in (-1, 1):
            objs.append(box('post', (t, t, 0.98), (sx * (w / 2 - t / 2), sy * (d / 2 - t / 2), 0.11 + 0.49), pm, 0.003))
            objs.append(cyl('castor', 0.05, 0.03, (sx * (w / 2 - 0.06), sy * (d / 2 - 0.06), 0.05), rub, rot=(math.pi / 2, 0, 0), verts=32, bevel=0.006))
            objs.append(box('fork', (0.04, 0.05, 0.05), (sx * (w / 2 - 0.06), sy * (d / 2 - 0.06), 0.1), zinc, 0.004))
    for z in shelves:
        objs.append(box('shelf', (w - 0.01, d - 0.01, 0.012), (0, 0, z), sm, 0.003))
        for sy in (-1, 1): objs.append(box('rail', (w, t, t), (0, sy * (d / 2 - t / 2), z - 0.018), pm, 0.003))
        for sx in (-1, 1): objs.append(box('rail', (t, d, t), (sx * (w / 2 - t / 2), 0, z - 0.018), pm, 0.003))
    # push handle
    objs.append(cyl('handle', 0.014, d - 0.04, (w / 2 + 0.05, 0, 1.0), pm, rot=(math.pi / 2, 0, 0), verts=24))
    for sy in (-1, 1): objs.append(box('hbr', (0.07, 0.022, 0.022), (w / 2 + 0.02, sy * (d / 2 - 0.04), 1.0), pm, 0.003))
    # load
    cm = mat('crate', srgb(crate), rough=0.6, spec=0.35); noisy(cm, scale=9, amount=0.35, rough_lo=0.5, rough_hi=0.8, bump=0.25, bscale=300)
    steel = brushed(mat('steel', srgb('#b9bcc0'), rough=0.28, metal=1.0))
    oily = mat('oily', srgb('#8f9397'), rough=0.22, metal=1.0)
    for zi, z in enumerate(shelves if load else ()):
        for cx in (-0.24, 0.24):
            if zi == len(shelves) - 1 and cx < 0: continue  # leave room for the tag on the top shelf
            if R.random() < 0.12: continue
            ch = 0.15 + R.random() * 0.03
            objs += crate_box((cx, 0, z + 0.006), (0.44, 0.52, ch), cm)
            if load == 'parts':
                objs += parts((cx, 0, z + 0.006 + 0.012), (0.38, 0.46), ch, steel if R.random() > 0.3 else oily)
    if tag:
        objs.append(amigo((tag_x, -d / 2 + 0.11, shelves[-1] + 0.007), rot=(0, 0, math.pi / 2)))
    return group('trolley', objs, loc=loc, rot=(0, 0, rot))


def crate_box(c, s, m):
    """Open-top plastic crate with ribbed walls (five slabs + ribs)."""
    x, y, z = c; w, d, h = s; t = 0.008; o = []
    o.append(box('cb', (w, d, t), (x, y, z + t / 2), m, 0.002))
    for sy in (-1, 1): o.append(box('cw', (w, t, h), (x, y + sy * (d / 2 - t / 2), z + h / 2), m, 0.003))
    for sx in (-1, 1): o.append(box('cw', (t, d, h), (x + sx * (w / 2 - t / 2), y, z + h / 2), m, 0.003))
    for i in range(6):
        px = x - w / 2 + (i + 0.5) * w / 6
        for sy in (-1, 1): o.append(box('rib', (0.012, 0.006, h * 0.86), (px, y + sy * (d / 2 + 0.002), z + h * 0.47), m, 0.002))
    for sy in (-1, 1): o.append(box('lip', (w + 0.014, 0.022, 0.012), (x, y + sy * (d / 2 - 0.004), z + h - 0.006), m, 0.004))
    for sx in (-1, 1): o.append(box('lip', (0.022, d + 0.014, 0.012), (x + sx * (w / 2 - 0.004), y, z + h - 0.006), m, 0.004))
    # handle cut look: dark slot
    dk = mat('slot', (0.01, 0.01, 0.012), rough=0.8)
    for sx in (-1, 1): o.append(box('slot', (0.004, 0.11, 0.03), (x + sx * (w / 2 + 0.0005), y, z + h - 0.045), dk))
    return o


def parts(c, area, h, m):
    """Machined flanges stacked in a crate: rings with chamfers, slightly irregular."""
    x, y, z = c; aw, ad = area; o = []
    r = 0.055; nx = int(aw / (2 * r + 0.01)); ny = int(ad / (2 * r + 0.01))
    for i in range(nx):
        for j in range(ny):
            px = x - aw / 2 + r + i * (aw - 2 * r) / max(1, nx - 1) + R.uniform(-0.006, 0.006)
            py = y - ad / 2 + r + j * (ad - 2 * r) / max(1, ny - 1) + R.uniform(-0.006, 0.006)
            layers = 4 if R.random() > 0.25 else 3
            for k in range(layers):
                zz = z + 0.03 * k + 0.016
                ob = cyl('flange', r, 0.028, (px, py, zz), m, rot=(R.uniform(-0.04, 0.04), R.uniform(-0.04, 0.04), R.uniform(0, 3)), verts=56, bevel=0.003, hole=0.022)
                o.append(ob)
    return o


def column(loc, h=9.0, paint='#c9ccce', size=0.4):
    """Steel I-section column, painted, with a yellow/black hazard wrap at the foot."""
    pm = mat('col', srgb(paint), rough=0.5, coat=0.1); noisy(pm, scale=4, amount=0.2, rough_lo=0.4, rough_hi=0.65, bump=0.05)
    x, y = loc; o = []
    fl = 0.02; web = 0.014
    for sy in (-1, 1): o.append(box('flange', (size, fl, h), (x, y + sy * (size / 2 - fl / 2), h / 2), pm, 0.002))
    o.append(box('web', (web, size - 2 * fl, h), (x, y, h / 2), pm))
    hz = mat('hazard', srgb('#e2b007'), rough=0.5); noisy(hz, scale=20, amount=0.25, rough_lo=0.4, rough_hi=0.8)
    o.append(box('guard', (size + 0.08, size + 0.08, 1.0), (x, y, 0.5), hz, 0.01))
    return o


def high_bay(x, y, z=8.5, s=2.2, warm=False):
    lm = mat('hb', (0.9, 0.9, 0.9), emit=(1.0, 0.86, 0.68) if warm else (0.92, 0.96, 1.0), emit_s=s * 18)
    o = cyl('hb_lens', 0.22, 0.03, (x, y, z), lm, verts=48)
    hm = mat('hbh', srgb('#5d6166'), rough=0.4, metal=0.8)
    cyl('hb_body', 0.24, 0.16, (x, y, z + 0.1), hm, verts=48)
    return o


def floor(size=80, base='#6d6f70', gloss=0.28):
    return box('floor', (size, size, 0.02), (0, 0, -0.01), floor_mat(base, gloss))


def stripe(x0, y0, x1, y1, w=0.1, color='#e0b10a', dash=None):
    m = mat('tape', srgb(color), rough=0.55); noisy(m, scale=40, amount=0.25, rough_lo=0.45, rough_hi=0.85, bump=0.05)
    L = math.hypot(x1 - x0, y1 - y0); a = math.atan2(y1 - y0, x1 - x0)
    if not dash:
        return box('tape', (L, w, 0.002), ((x0 + x1) / 2, (y0 + y1) / 2, 0.001), m, rot=(0, 0, a))
    o = []; n = int(L / dash[0])
    for i in range(n):
        if i % 2: continue
        t = (i + 0.5) / n
        o.append(box('tape', (dash[0], w, 0.002), (x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 0.001), m, rot=(0, 0, a)))
    return o


def rack_bay(x, y, length=2.7, depth=1.1, levels=(0.15, 1.7, 3.25, 4.8), h=6.4, loads='crates', upright='#1f4e9c', beam='#e06a1b'):
    """Selective pallet racking: blue uprights, orange beams, loads per level."""
    um = mat('upright', srgb(upright), rough=0.45, coat=0.15); noisy(um, scale=8, amount=0.15, rough_lo=0.35, rough_hi=0.6)
    bm_ = mat('beam', srgb(beam), rough=0.42, coat=0.15); noisy(bm_, scale=8, amount=0.15, rough_lo=0.35, rough_hi=0.6)
    o = []
    for sx in (0, 1):
        for sy in (-1, 1):
            o.append(box('up', (0.09, 0.07, h), (x + sx * length, y + sy * depth / 2, h / 2), um, 0.004))
        for z in range(1, int(h / 0.6)):
            o.append(box('brace', (0.03, depth, 0.03), (x + sx * length, y, z * 0.6), um, rot=(0.5 if z % 2 else -0.5, 0, 0)))
    for z in levels[1:]:
        for sy in (-1, 1): o.append(box('beam', (length, 0.05, 0.12), (x + length / 2, y + sy * depth / 2, z), bm_, 0.006))
    card = mat('card', srgb('#a37a4c'), rough=0.85, spec=0.3); noisy(card, scale=6, amount=0.3, rough_lo=0.75, rough_hi=0.95, bump=0.15, bscale=80)
    pal = mat('pallet', srgb('#9b7a52'), rough=0.85); noisy(pal, scale=20, amount=0.35, bump=0.2, bscale=60)
    wrap = mat('wrap', (0.85, 0.87, 0.9), rough=0.08, spec=0.9, alpha=0.35)
    for z in levels:
        for k in range(2):
            if R.random() < 0.12: continue
            px = x + length * (0.26 + 0.48 * k)
            o.append(box('pal', (1.0, 1.0, 0.14), (px, y, z + 0.13 if z > 0.2 else 0.07), pal, 0.004))
            hh = 0.8 + R.random() * 0.55; zb = (z + 0.2 if z > 0.2 else 0.14)
            if loads == 'crates':
                for i in range(2):
                    for j in range(2):
                        for l in range(int(hh / 0.3)):
                            o.append(box('cbox', (0.46, 0.46, 0.28), (px - 0.24 + i * 0.48, y - 0.24 + j * 0.48, zb + 0.14 + l * 0.29), card, 0.008))
            else:
                o.append(box('load', (0.96, 0.96, hh), (px, y, zb + hh / 2), card, 0.02))
    return o


def camera(loc, look, lens=50, f=2.8, focus=None, sensor=36):
    cd = bpy.data.cameras.new('cam'); cd.lens = lens; cd.sensor_width = sensor
    c = link(bpy.data.objects.new('cam', cd)); c.location = loc
    d = Vector(look) - Vector(loc); c.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cd.dof.use_dof = True; cd.dof.aperture_fstop = f; cd.dof.focus_distance = (focus if focus else d.length)
    cd.dof.aperture_blades = 7; cd.dof.aperture_rotation = 0.3
    bpy.context.scene.camera = c
    return c


def sun(rot, strength=3.0, color=(1, 0.9, 0.78), angle=1.5):
    ld = bpy.data.lights.new('sun', 'SUN'); ld.energy = strength; ld.color = color; ld.angle = math.radians(angle)
    s = link(bpy.data.objects.new('sun', ld)); s.rotation_euler = rot; return s


def area(loc, look, size=2.0, energy=200, color=(1, 1, 1)):
    ld = bpy.data.lights.new('area', 'AREA'); ld.energy = energy; ld.size = size; ld.color = color
    a = link(bpy.data.objects.new('area', ld)); a.location = loc
    d = Vector(look) - Vector(loc); a.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return a


def point(loc, energy=50, color=(1, 1, 1), radius=0.1):
    ld = bpy.data.lights.new('pt', 'POINT'); ld.energy = energy; ld.color = color; ld.shadow_soft_size = radius
    p = link(bpy.data.objects.new('pt', ld)); p.location = loc; return p


def render(out, w=1600, h=900, samples=128):
    sc = bpy.context.scene; sc.render.resolution_x = w; sc.render.resolution_y = h; sc.render.resolution_percentage = 100
    sc.cycles.samples = samples; sc.cycles.adaptive_threshold = 0.02
    sc.render.filepath = out; bpy.ops.render.render(write_still=True)
