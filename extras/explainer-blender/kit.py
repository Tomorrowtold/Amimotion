# Our own models for the explainer, built in Blender from code (bpy 5.x). Real-world scale in metres.
# AmIGo comes from the founders' CAD (studio/v1/assets/cad/*.mesh), never redrawn.
import bpy, bmesh, json, math, os, numpy as np
from mathutils import Vector

ROOT = os.path.dirname(os.path.abspath(__file__))
CAD = os.path.join(ROOT, '..', '..', 'studio', 'v1', 'assets', 'cad')

def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)

# ---------- materials ----------
def mat(name, color, rough=.5, metal=0., coat=0., coat_r=.1, transmission=0., ior=1.45, noise=0., noise_scale=40., bump=0., emit=None, emit_s=0., alpha=1.):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = coat_r
    b.inputs['Transmission Weight'].default_value = transmission
    b.inputs['IOR'].default_value = ior
    b.inputs['Alpha'].default_value = alpha
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = emit_s
    tc = None
    if noise or bump:
        tc = nt.nodes.new('ShaderNodeTexCoord')
        n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = noise_scale; n.inputs['Detail'].default_value = 8
        nt.links.new(tc.outputs['Object'], n.inputs['Vector'])
        if noise:
            r = nt.nodes.new('ShaderNodeMapRange'); r.inputs['To Min'].default_value = rough * (1 - noise); r.inputs['To Max'].default_value = min(1, rough * (1 + noise))
            nt.links.new(n.outputs['Fac'], r.inputs['Value']); nt.links.new(r.outputs['Result'], b.inputs['Roughness'])
        if bump:
            bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = .002
            nt.links.new(n.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def wood_mat():
    m = bpy.data.materials.get('wood')
    if m: return m
    m = bpy.data.materials.new('wood'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 18, 1)
    w = nt.nodes.new('ShaderNodeTexWave'); w.inputs['Scale'].default_value = 3; w.inputs['Distortion'].default_value = 6; w.inputs['Detail'].default_value = 6
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 60
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = (.36, .25, .15, 1); ramp.color_ramp.elements[1].color = (.62, .49, .33, 1)
    mix = nt.nodes.new('ShaderNodeMath'); mix.operation = 'MULTIPLY_ADD'; mix.inputs[1].default_value = .7
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], w.inputs['Vector']); nt.links.new(tc.outputs['Object'], n.inputs['Vector'])
    nt.links.new(w.outputs['Fac'], mix.inputs[0]); nt.links.new(n.outputs['Fac'], mix.inputs[2]); mix.inputs[2].default_value = .3
    nt.links.new(mix.outputs[0], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = .78
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .25; nt.links.new(w.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def cardboard_mat():
    return mat('cardboard', (.42, .29, .17), rough=.85, noise=.15, noise_scale=120, bump=.08)

M = {}
def mats():
    M.update(
        steel=mat('steel', (.62, .63, .65), rough=.32, metal=1, noise=.3, noise_scale=80),
        zinc=mat('zinc', (.72, .73, .75), rough=.22, metal=1, noise=.2),
        powder=mat('powder', (.12, .15, .19), rough=.45, noise=.15, noise_scale=200),        # trolley frame, powder coat
        rubber=mat('rubber', (.018, .018, .02), rough=.75),
        caster=mat('caster', (.55, .57, .6), rough=.35, metal=1),
        tote=mat('tote', (.06, .19, .48), rough=.42, coat=.2, noise=.1, noise_scale=300),
        chest=mat('chest', (.55, .06, .05), rough=.32, coat=.5, coat_r=.15),                    # tool cabinet, enamel red
        chest_dark=mat('chest_dark', (.05, .05, .055), rough=.4),
        fork_body=mat('fork_body', (.62, .4, .03), rough=.36, coat=.5, coat_r=.2, noise=.25, noise_scale=30),            # forklift paint
        fork_dark=mat('fork_dark', (.03, .03, .033), rough=.55),
        amr=mat('amr', (.80, .81, .83), rough=.28, coat=.4, coat_r=.1),
        amr_dark=mat('amr_dark', (.02, .022, .025), rough=.35),
        led=mat('led', (.2, .5, 1.), rough=.3, emit=(.25, .55, 1.), emit_s=6),
        glass=mat('glass', (.9, .92, .95), rough=.05, transmission=1),
        wrap=mat('wrap', (.92, .94, .96), rough=.08, transmission=.92, ior=1.4, alpha=1),
        amigo_top=mat('amigo_top', (.042, .044, .05), rough=.4, coat=.45, coat_r=.18),
        amigo_bot=mat('amigo_bot', (.03, .031, .036), rough=.5, coat=.25, coat_r=.3),
        cardboard=cardboard_mat(), wood=wood_mat(),
        vest=mat('vest', (.85, .95, .08), rough=.6),
        reflect=mat('reflect', (.75, .76, .78), rough=.2, metal=.8),
        cloth=mat('cloth', (.05, .06, .08), rough=.9),
        skin=mat('skin', (.36, .22, .16), rough=.55),
        helmet=mat('helmet', (.9, .9, .88), rough=.3, coat=.5),
    )

# ---------- primitives ----------
def link(o, parent=None):
    if parent: o.parent = parent
    return o

def box(name, size, loc, m, bevel=.004, parent=None, segs=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = segs; md.limit_method = 'ANGLE'
        o.modifiers.new('wn', 'WEIGHTED_NORMAL')
    o.data.materials.append(m); bpy.ops.object.shade_smooth()
    return link(o, parent)

def cyl(name, r, h, loc, m, rot=(0, 0, 0), verts=32, bevel=.002, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object; o.name = name
    if bevel:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = 2; md.limit_method = 'ANGLE'
    o.data.materials.append(m); bpy.ops.object.shade_smooth()
    return link(o, parent)

def tube(name, pts, r, m, parent=None):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 4; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts): p.co = (*c, 1)
    o = bpy.data.objects.new(name, cu); bpy.context.collection.objects.link(o); o.data.materials.append(m)
    return link(o, parent)

def empty(name, loc=(0, 0, 0)):
    o = bpy.data.objects.new(name, None); o.location = loc; bpy.context.collection.objects.link(o); return o

# ---------- AmIGo from CAD ----------
_amigo = {}
def amigo_meshes():
    if _amigo: return _amigo
    meta = json.load(open(os.path.join(CAD, 'mesh.json')))
    for key in ('top_cover', 'bottom_cover'):
        m = meta[key]; buf = open(os.path.join(CAD, key + '.mesh'), 'rb').read()
        q = np.frombuffer(buf, dtype=np.uint16, count=m['nv'] * 3).reshape(-1, 3).astype(np.float64)
        p = np.array(m['min']) + q * np.array(m['scale'])
        p -= np.array([61.77, 65.98, -1.0]); p *= .001
        idx = np.frombuffer(buf, dtype=np.uint16, count=m['ni'], offset=m['iOff']).reshape(-1, 3)
        me = bpy.data.meshes.new(key); me.from_pydata(p.tolist(), [], idx.tolist()); me.update()
        for poly in me.polygons: poly.use_smooth = True
        me.materials.append(M['amigo_top' if key == 'top_cover' else 'amigo_bot'])
        _amigo[key] = me
    return _amigo

def amigo(name, loc, face='-Y', parent=None, rotz=0.):
    """An AmIGo tag, its lid facing `face` (the direction the lid looks)."""
    ms = amigo_meshes(); root = empty(name, loc)
    # the CAD lid looks down its own -Z
    h = math.pi / 2
    rot = {'-Y': (-h, 0, rotz), '+Z': (math.pi, 0, rotz), '+X': (-h, 0, h + rotz), '-X': (-h, 0, -h + rotz)}[face]
    root.rotation_euler = rot
    for k, me in ms.items():
        o = bpy.data.objects.new(f'{name}_{k}', me); bpy.context.collection.objects.link(o); o.parent = root
    return link(root, parent)
