# The AmIMotion explainer plant, built for path tracing (Blender Cycles) and for baking to three.js.
# One hall, 240 m x 96 m x 14 m. X runs the length of the hall, Y across it, Z up. The main aisle runs along X at y = 48.
# Real sources only: Poly Haven CC0 scans and textures, the founders' CAD (AmIGo tag, AmIMo anchor), a MakeHuman CC0 body.
import bpy, sys, math, random, time, os, json
from mathutils import Vector, Matrix, Euler

HERE = os.path.dirname(os.path.abspath(__file__))
PH = os.path.join(HERE, 'ph'); CAD = os.path.join(HERE, 'cad')
R = random.Random(7)
sc = None; col = None
rad = math.radians

# ------------------------------------------------------------------ helpers
def reset():
    global sc, col
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; col = sc.collection

def mat(name, base=(.5, .5, .5, 1), rough=.5, metal=0., emit=None, strength=0., coat=0.):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = base; b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    if emit: b.inputs['Emission Color'].default_value = emit; b.inputs['Emission Strength'].default_value = strength
    return m

def worn(name, base, rough=(.25, .6), metal=0., scale=6., bump=.02):
    """A material whose roughness and tone are broken up by layered noise: scuffs, wipe marks, wear."""
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord')
    n1 = N.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = scale; n1.inputs['Detail'].default_value = 8; n1.inputs['Roughness'].default_value = .65
    n2 = N.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = scale * 9; n2.inputs['Detail'].default_value = 4
    L.new(tc.outputs['Object'], n1.inputs['Vector']); L.new(tc.outputs['Object'], n2.inputs['Vector'])
    mx = N.new('ShaderNodeMix'); mx.inputs['Factor'].default_value = .35; L.new(n1.outputs['Fac'], mx.inputs[2]); L.new(n2.outputs['Fac'], mx.inputs[3])
    rr = N.new('ShaderNodeMapRange'); rr.inputs['From Min'].default_value = .3; rr.inputs['From Max'].default_value = .7
    rr.inputs['To Min'].default_value = rough[0]; rr.inputs['To Max'].default_value = rough[1]
    L.new(mx.outputs[0], rr.inputs['Value']); L.new(rr.outputs['Result'], b.inputs['Roughness'])
    cm = N.new('ShaderNodeMix'); cm.data_type = 'RGBA'; cm.inputs[6].default_value = base; cm.inputs[7].default_value = tuple(c * .55 for c in base[:3]) + (1,)
    L.new(mx.outputs[0], cm.inputs['Factor']); L.new(cm.outputs[2], b.inputs['Base Color'])
    b.inputs['Metallic'].default_value = metal
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = .01
    L.new(n2.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def link(o):
    if o.name not in col.objects: col.objects.link(o)
    return o

def box(name, size, loc, m, bevel=.008, rot=(0, 0, 0), seg=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(scale=True, location=False, rotation=False)
    o.rotation_euler = rot if isinstance(rot, (tuple, list, Euler)) else (0, 0, rot)
    if bevel:
        md = o.modifiers.new('b', 'BEVEL'); md.width = bevel; md.segments = seg; md.limit_method = 'ANGLE'
        for p in o.data.polygons: p.use_smooth = True
    if m: o.data.materials.append(m)
    return o

def cyl(name, r, depth, loc, m, axis='z', verts=32, bevel=.004):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, vertices=verts); o = bpy.context.object; o.name = name
    if axis == 'x': o.rotation_euler = (0, rad(90), 0)
    if axis == 'y': o.rotation_euler = (rad(90), 0, 0)
    if bevel:
        md = o.modifiers.new('b', 'BEVEL'); md.width = bevel; md.segments = 2; md.limit_method = 'ANGLE'
    for p in o.data.polygons: p.use_smooth = True
    if m: o.data.materials.append(m)
    return o

def tube(name, pts, r, m, verts=12):
    """A round steel tube through a list of points (a curve with a bevel)."""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts): p.co = (*q, 1)
    o = bpy.data.objects.new(name, cu); link(o); o.data.materials.append(m); return o

def join(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    objs = [o for o in objs if o]
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    for o in objs:
        if o.type == 'CURVE':
            bpy.context.view_layer.objects.active = o; bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.ops.object.convert(target='MESH')
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    for o in objs:
        bpy.context.view_layer.objects.active = o
        for md in list(o.modifiers):
            try: bpy.ops.object.modifier_apply(modifier=md.name)
            except Exception: o.modifiers.remove(md)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join(); o = bpy.context.object; o.name = name
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return o

_proto = {}
def proto(name, builder):
    """Build a prop once (hidden); place() then instances its mesh."""
    if name not in _proto:
        o = builder(); o.name = 'P_' + name; o.hide_render = True; o.hide_viewport = True; o['proto'] = name; _proto[name] = [o]
    return _proto[name]

def ph(name):
    if name not in _proto:
        before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f'{PH}/{name}/{name}_1k.gltf')
        objs = [o for o in bpy.data.objects if o not in before]
        for o in objs: o.hide_render = o.hide_viewport = True
        _proto[name] = [o for o in objs if o.type == 'MESH']
        for o in _proto[name]: o['proto'] = name
    return _proto[name]

def reopen(path):
    """Open a saved plant and find its prototypes again."""
    global sc, col
    bpy.ops.wm.open_mainfile(filepath=path); sc = bpy.context.scene; col = sc.collection; _proto.clear()
    for o in bpy.data.objects:
        if 'proto' in o.keys(): _proto.setdefault(o['proto'], []).append(o)
    THINGS[:] = json.load(open(path.replace('.blend', '.things.json')))

THINGS = []   # every tagged thing in the plant: [kind, x, y]

def place(name, loc, rot=0., s=1., builder=None, tilt=(0, 0)):
    srcs = proto(name, builder) if builder else ph(name)
    root = bpy.data.objects.new(name + '_i', None); link(root); root.location = loc; root.rotation_euler = (tilt[0], tilt[1], rot); root.scale = (s, s, s)
    for o in srcs:
        c = bpy.data.objects.new(o.name + '_c', o.data); link(c); c.matrix_world = o.matrix_world.copy(); c.parent = root
    return root

# ------------------------------------------------------------------ materials
def floor_mat():
    m = bpy.data.materials.new('floor'); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (.21, .21, .21); L.new(tc.outputs['Object'], mp.inputs['Vector'])
    def tex(f, non_color=False):
        t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(f'{PH}/hangar_concrete_floor/hangar_concrete_floor_{f}_2k.jpg')
        if non_color: t.image.colorspace_settings.name = 'Non-Color'
        L.new(mp.outputs['Vector'], t.inputs['Vector']); return t
    d = tex('diff'); r = tex('rough', True); n = tex('nor_gl', True)
    # large slow variation so the 5 m tile never reads as a repeat: worn lanes are smoother, corners duller
    big = N.new('ShaderNodeTexNoise'); big.inputs['Scale'].default_value = .09; big.inputs['Detail'].default_value = 5; L.new(tc.outputs['Object'], big.inputs['Vector'])
    dk = N.new('ShaderNodeMix'); dk.data_type = 'RGBA'; dk.blend_type = 'MULTIPLY'; dk.inputs['Factor'].default_value = 1
    L.new(d.outputs['Color'], dk.inputs[6]); tone = N.new('ShaderNodeMapRange'); tone.inputs['To Min'].default_value = .30; tone.inputs['To Max'].default_value = .55
    L.new(big.outputs['Fac'], tone.inputs['Value']); L.new(tone.outputs['Result'], dk.inputs[7]); L.new(dk.outputs[2], b.inputs['Base Color'])
    rm = N.new('ShaderNodeMapRange'); rm.inputs['To Min'].default_value = .05; rm.inputs['To Max'].default_value = .5; L.new(r.outputs['Color'], rm.inputs['Value'])
    ra = N.new('ShaderNodeMath'); ra.operation = 'ADD'; ra.use_clamp = True; rb = N.new('ShaderNodeMapRange'); rb.inputs['To Min'].default_value = -.06; rb.inputs['To Max'].default_value = .16
    L.new(big.outputs['Fac'], rb.inputs['Value']); L.new(rm.outputs['Result'], ra.inputs[0]); L.new(rb.outputs['Result'], ra.inputs[1]); L.new(ra.outputs[0], b.inputs['Roughness'])
    nm = N.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = .5; L.new(n.outputs['Color'], nm.inputs['Color']); L.new(nm.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Coat Weight'].default_value = .4; b.inputs['Coat Roughness'].default_value = .07
    return m

def M():
    return dict(
        steel=worn('steel', (.32, .33, .35, 1), (.28, .55), 1., 5),
        galv=worn('galv', (.5, .51, .52, 1), (.3, .6), 1., 9),
        dark=worn('darksteel', (.035, .037, .04, 1), (.3, .6), .6, 7),
        blue=worn('rackblue', (.03, .09, .26, 1), (.3, .6), 0., 5),
        orange=worn('beamorange', (.55, .16, .02, 1), (.3, .55), 0., 5),
        yellow=worn('yellow', (.62, .42, .03, 1), (.3, .6), 0., 6),
        paint=worn('floorpaint', (.6, .44, .05, 1), (.3, .65), 0., 2.5, .004),
        rubber=worn('rubber', (.012, .012, .013, 1), (.6, .9), 0., 14),
        wood=worn('wood', (.34, .24, .13, 1), (.6, .85), 0., 11, .03),
        wall=worn('wall', (.055, .058, .06, 1), (.6, .9), 0., .6),
        roof=worn('roof', (.03, .032, .035, 1), (.5, .8), .3, 1.),
        body=worn('body', (.5, .34, .03, 1), (.25, .5), 0., 4),
        shell=worn('amrshell', (.16, .17, .18, 1), (.28, .5), 0., 5),
        ink=mat('ink', (.006, .006, .007, 1), .6),
        tag=worn('tagtop', (.045, .047, .052, 1), (.32, .45), 0., 40, .004),
        tagb=worn('tagbottom', (.03, .031, .035, 1), (.45, .6), 0., 40, .004),
        wrap=None,
    )

# ------------------------------------------------------------------ the founders' CAD
def cad(name):
    def b():
        bpy.ops.wm.stl_import(filepath=f'{CAD}/{name}.stl'); o = bpy.context.object
        return o
    return proto('cad_' + name, b)

def amigo(loc, rot=(0, 0, 0)):
    """The real AmIGo tag (mm CAD -> m). Its own origin is the centre of its base."""
    root = bpy.data.objects.new('AmIGo', None); link(root); root.location = loc; root.rotation_euler = rot
    mm = M()
    for part, m in (('top_cover', mm['tag']), ('bottom_cover', mm['tagb'])):
        src = cad(part)[0]
        c = bpy.data.objects.new('amigo_' + part, src.data.copy()); link(c); c.parent = root
        c.matrix_parent_inverse = Matrix(); c.matrix_basis = Matrix.Scale(.001, 4) @ Matrix.Rotation(math.pi, 4, 'X') @ Matrix.Translation((-61.77, -65.98, -10.59))   # mounting plate at z = 0, the front faces +z
        c.data.materials.clear(); c.data.materials.append(m)
        for p in c.data.polygons: p.use_smooth = False
    return root

def amimo(loc, rotz=0.):
    root = bpy.data.objects.new('AmIMo', None); link(root); root.location = loc; root.rotation_euler = (0, 0, rotz)
    mm = M()
    for part in ('PCB_ENCLOUSER_main_body', 'PCB_ENCLOUSER_cap'):
        src = cad(part)[0]; c = bpy.data.objects.new('amimo_' + part, src.data); link(c); c.parent = root
        c.matrix_basis = Matrix.Scale(.001, 4); c.data.materials.clear(); c.data.materials.append(mm['tag'])
    return root

# ------------------------------------------------------------------ props modelled to real dimensions
def b_pallet():
    w = M()['wood']; g = []
    for dy in (-.35, 0, .35): g.append(box('s', (1.2, .1, .022), (0, dy, .011), w, .003))          # bottom boards
    for dx in (-.55, 0, .55):
        for dy in (-.35, 0, .35): g.append(box('b', (.1, .1, .078), (dx, dy, .061), w, .004))        # blocks
    for dx in (-.55, 0, .55): g.append(box('st', (.1, .8, .022), (dx, 0, .111), w, .003))            # stringer boards
    for dy in (-.35, -.19, 0, .19, .35): g.append(box('d', (1.2, .12 if abs(dy) < .3 else .1, .022), (0, dy, .133), w, .003))
    return join(g, 'pallet')
PAL = .144

def b_cage():
    m = M()['galv']; g = []
    for x in (-.58, .58):
        for y in (-.38, .38): g.append(box('p', (.04, .04, .95), (x, y, .62), m, .004))
    for z in (.16, .62, 1.08):
        for y in (-.38, .38): g.append(box('r', (1.2, .025, .025), (0, y, z), m, .003))
        for x in (-.58, .58): g.append(box('r', (.025, .8, .025), (x, 0, z), m, .003))
    for i in range(13):
        x = -.54 + i * .09
        for y in (-.385, .385): g.append(box('w', (.006, .006, .9), (x, y, .62), m, 0))
    for i in range(9):
        y = -.34 + i * .085
        for x in (-.585, .585): g.append(box('w', (.006, .006, .9), (x, y, .62), m, 0))
    for i in range(8):
        z = .22 + i * .115
        for y in (-.385, .385): g.append(box('w', (1.16, .006, .006), (0, y, z), m, 0))
        for x in (-.585, .585): g.append(box('w', (.006, .76, .006), (x, 0, z), m, 0))
    g.append(box('base', (1.2, .8, .03), (0, 0, .15), m, .004))
    for x in (-.5, .5):
        for y in (-.3, .3): g.append(box('f', (.1, .1, .14), (x, y, .07), m, .006))
    return join(g, 'cage')

def b_trolley():
    """The hero carrier: welded round-tube WIP trolley, two decks, a push handle, four castors."""
    mm = M(); st = worn('powder', (.09, .11, .13, 1), (.3, .6), .2, 7); g = []
    L_, W_, H_ = 1.1, .62, .95
    for x in (-L_ / 2, L_ / 2):
        for y in (-W_ / 2, W_ / 2): g.append(tube('post', [(x, y, .17), (x, y, H_)], .016, st))
    for z in (.2, .58, H_):
        g.append(tube('rim', [(-L_ / 2, -W_ / 2, z), (L_ / 2, -W_ / 2, z), (L_ / 2, W_ / 2, z), (-L_ / 2, W_ / 2, z), (-L_ / 2, -W_ / 2, z)], .013, st))
    for z in (.2, .58):
        g.append(box('deck', (L_ - .02, W_ - .02, .012), (0, 0, z + .004), mm['galv'], .003))
    # push handle, bent tube, rising behind one end
    g.append(tube('handle', [(-L_ / 2, -W_ / 2, H_), (-L_ / 2 - .12, -W_ / 2, H_ + .1), (-L_ / 2 - .12, W_ / 2, H_ + .1), (-L_ / 2, W_ / 2, H_)], .014, st))
    # label holder on the handle end
    g.append(box('label', (.004, .21, .15), (-L_ / 2 - .018, 0, .78), mat('labelcard', (.6, .6, .56, 1), .7), .002))
    g.append(box('labelf', (.008, .23, .17), (-L_ / 2 - .014, 0, .78), mm['galv'], .002))
    # castors: plate, fork, wheel, axle
    for x in (-L_ / 2 + .06, L_ / 2 - .06):
        for y in (-W_ / 2 + .05, W_ / 2 - .05):
            g.append(box('plate', (.09, .07, .006), (x, y, .168), mm['galv'], .002))
            g.append(box('fork', (.05, .006, .1), (x + .02, y - .022, .115), mm['galv'], .002)); g.append(box('fork', (.05, .006, .1), (x + .02, y + .022, .115), mm['galv'], .002))
            g.append(cyl('wheel', .062, .032, (x + .03, y, .062), mm['rubber'], 'y', 24, .006)); g.append(cyl('hub', .028, .036, (x + .03, y, .062), mm['galv'], 'y', 16, .002))
    return join(g, 'trolley')

def b_wheel(r=.27, w=.2):
    mm = M(); g = [cyl('tyre', r, w, (0, 0, 0), mm['rubber'], 'y', 40, .03), cyl('rim', r * .58, w * 1.02, (0, 0, 0), mm['galv'], 'y', 24, .01), cyl('hubc', r * .2, w * 1.1, (0, 0, 0), mm['dark'], 'y', 16, .006)]
    return g

def b_forklift():
    """Counterbalance truck, about 2.5 m long without forks. Forward = +x."""
    mm = M(); bd = mm['body']; dk = mm['dark']; g = []
    def sub(o, lv=2):
        s = o.modifiers.new('s', 'SUBSURF'); s.levels = lv; s.render_levels = lv; return o
    g.append(sub(box('chassis', (1.5, 1.08, .5), (-.05, 0, .55), bd, .06, seg=3), 1))
    g.append(sub(box('counter', (.62, 1.1, .82), (-.98, 0, .72), bd, .16, seg=4), 2))                 # the rounded counterweight
    g.append(sub(box('hood', (.78, .92, .26), (-.38, 0, .96), bd, .07, seg=3), 1))
    g.append(sub(box('seatb', (.46, .46, .1), (-.42, 0, 1.14), dk, .04, seg=3), 1)); g.append(sub(box('seatk', (.1, .46, .44), (-.64, 0, 1.38), dk, .04, seg=3), 1))
    g.append(box('dash', (.14, .8, .36), (.42, 0, 1.0), dk, .03)); g.append(tube('column', [(.4, 0, 1.1), (.22, 0, 1.36)], .018, dk))
    bpy.ops.mesh.primitive_torus_add(major_radius=.17, minor_radius=.014, location=(.2, 0, 1.38), rotation=(0, rad(62), 0)); sw = bpy.context.object; sw.data.materials.append(dk); g.append(sw)
    # overhead guard: four bent tube posts and a barred roof
    for y in (-.5, .5):
        g.append(tube('gf', [(.52, y, .8), (.5, y, 1.5), (.36, y, 2.12)], .028, dk)); g.append(tube('gr', [(-.82, y, 1.1), (-.8, y, 1.7), (-.7, y, 2.12)], .028, dk))
        g.append(tube('gs', [(.36, y, 2.12), (-.7, y, 2.12)], .028, dk))
    for i in range(7): g.append(box('bar', (.03, 1.0, .03), (.3 - i * .16, 0, 2.12), dk, .004))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.05, location=(-.66, .42, 2.2)); be = bpy.context.object; be.scale = (1, 1, 1.3)
    be.data.materials.append(mat('beacon', (.2, .08, .0, 1), .2, emit=(1, .45, .05, 1), strength=0)); g.append(be)
    # mast: two outer channels, two inner, cross members, chains, carriage, load backrest, forks
    for y in (-.36, .36):
        g.append(box('mo', (.1, .07, 2.15), (.78, y, 1.14), dk, .008)); g.append(box('mi', (.07, .05, 2.0), (.8, y * .82, 1.2), mm['steel'], .006))
    for z in (.2, 1.1, 2.18): g.append(box('mx', (.06, .78, .09), (.78, 0, z), dk, .008))
    g.append(cyl('ram', .04, 1.7, (.76, 0, 1.0), mm['galv'], 'z', 16, .004))
    for y in (-.1, .1): g.append(box('chain', (.012, .03, 1.9), (.82, y, 1.15), dk, 0))
    g.append(box('carr', (.05, .98, .42), (.9, 0, .42), dk, .008))
    for i in range(6): g.append(box('lbr', (.02, .02, .7), (.9, -.45 + i * .18, .98), dk, .003))
    g.append(box('lbrt', (.02, .98, .03), (.9, 0, 1.33), dk, .003))
    for y in (-.26, .26):
        g.append(box('forkv', (.04, .1, .5), (.94, y, .32), mm['steel'], .006))
        bpy.ops.mesh.primitive_cube_add(size=1, location=(1.5, y, .09)); f = bpy.context.object; f.scale = (1.1, .1, .04); bpy.ops.object.transform_apply(scale=True)
        for v in f.data.vertices:
            if v.co.x > 0 and v.co.z > 0: v.co.z = -.012                                               # the fork tapers to its tip
        f.data.materials.append(mm['steel']); md = f.modifiers.new('b', 'BEVEL'); md.width = .004; g.append(f)
    for x, r, w in ((.42, .3, .26), (-.72, .25, .2)):
        for y in (-.5, .5):
            for p in b_wheel(r, w): p.location = (x, y, r); g.append(p)
    for y in (-.56, .56): g.append(sub(box('fender', (.72, .1, .12), (.42, y, .66), bd, .04, seg=3), 1))
    return join(g, 'forklift')

def b_amr():
    """A generic low under-ride AMR, 1.2 x 0.8 x 0.3 m: chamfered shell, sensor slot, a light strip, a lift plate."""
    mm = M(); g = []
    sh = box('shell', (1.2, .8, .22), (0, 0, .17), mm['shell'], .05, seg=4); s = sh.modifiers.new('s', 'SUBSURF'); s.levels = 1; s.render_levels = 2; g.append(sh)
    g.append(box('skirt', (1.16, .76, .05), (0, 0, .05), mm['dark'], .01))
    g.append(box('slot', (1.215, .66, .035), (0, 0, .2), mm['ink'], .004)); g.append(box('slot2', (1.0, .815, .035), (0, 0, .2), mm['ink'], .004))
    g.append(box('plate', (.9, .6, .018), (0, 0, .29), mm['dark'], .006))
    for x in (-.5, .5):
        for y in (-.3, .3): g.append(cyl('estop', .022, .02, (x, y, .285), mat('estop', (.4, .02, .02, 1), .4), 'z', 16, .003))
    for y in (-.36, .36): g.append(cyl('drive', .075, .05, (0, y, .075), mm['rubber'], 'y', 24, .008))
    o = join(g, 'amr')
    return o

def b_strip():
    m = mat('amrstrip', (0, 0, 0, 1), .3, emit=(.4, .65, 1, 1), strength=6)
    g = [box('ls', (1.205, .805, .012), (0, 0, .115), m, .05, seg=4)]
    return join(g, 'amrstrip')

def b_hardhat():
    ink = M()['ink']
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.115, segments=32, ring_count=16); h = bpy.context.object; h.scale = (1.12, .95, .86)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT'); bpy.ops.object.mode_set(mode='OBJECT')
    for v in h.data.vertices: v.select = v.co.z < -.012
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.delete(type='VERT'); bpy.ops.object.mode_set(mode='OBJECT')
    for p in h.data.polygons: p.use_smooth = True
    h.data.materials.append(ink)
    brim = cyl('brim', .122, .008, (0.0, 0, -.012), ink, 'z', 32, .003); brim.scale = (1.08, .95, 1)
    peak = box('peak', (.09, .2, .008), (.15, 0, -.014), ink, .004); peak.rotation_euler = (0, rad(8), 0)
    ridge = box('ridge', (.2, .022, .012), (0, 0, .094), ink, .005)
    return join([h, brim, peak, ridge], 'hardhat')

# ------------------------------------------------------------------ the hall
HALL = (240., 96., 14.); X0 = 60.
COLS_X = [60 + 24 * i for i in range(8)]; COLS_Y = [12., 36., 60., 84.]
DOORS = [18., 33., 48., 63., 78.]
def lamps_xy():
    return [(66 + 12 * i, 6 + 12 * j) for i in range(15) for j in range(8)]

def hall():
    mm = M(); X, Y, Z = HALL; L_ = X - X0; cx = (X + X0) / 2
    bpy.ops.mesh.primitive_plane_add(size=1, location=(cx, Y / 2, 0)); fl = bpy.context.object; fl.name = 'floor'; fl.scale = (L_ + 120, Y + 60, 1); bpy.ops.object.transform_apply(scale=True)
    fl.data.materials.append(floor_mat())
    box('roof', (L_ + 2, Y + 2, .2), (cx, Y / 2, Z + .1), mm['roof'], 0)
    box('wS', (L_ + 2, .3, Z), (cx, -.15, Z / 2), mm['wall'], 0); box('wN', (L_ + 2, .3, Z), (cx, Y + .15, Z / 2), mm['wall'], 0)
    dw, dh = 3.6, 4.4
    edges = [0.] + [v for d in DOORS for v in (d - dw / 2, d + dw / 2)] + [Y]
    for nm, xw, s in (('wE', X, 1), ('wW', X0, -1)):          # s = +1: the wall faces +x (outside is beyond it)
        for a, b_ in zip(edges[0::2], edges[1::2]): box(nm, (.3, b_ - a, Z), (xw + s * .15, (a + b_) / 2, Z / 2), mm['wall'], 0)
        for d in DOORS:
            box(nm + 't', (.3, dw, Z - dh), (xw + s * .15, d, dh + (Z - dh) / 2), mm['wall'], 0)
            for k in (-1, 1): box('jamb', (.5, .14, dh), (xw - s * .1, d + k * (dw / 2 + .07), dh / 2), mm['yellow'], .01)
            box('bumpL', (.12, .25, .5), (xw - s * .06, d - 1.2, 1.1), mm['rubber'], .02); box('bumpR', (.12, .25, .5), (xw - s * .06, d + 1.2, 1.1), mm['rubber'], .02)
            box('lev', (2.4, 2.0, .02), (xw - s * 1.3, d, .01), mm['dark'], .004)
    def b_col():
        g = [box('web', (.02, .36, Z), (0, 0, Z / 2), mm['steel'], 0), box('fl1', (.3, .025, Z), (0, .18, Z / 2), mm['steel'], .003), box('fl2', (.3, .025, Z), (0, -.18, Z / 2), mm['steel'], .003),
             box('basepl', (.5, .5, .03), (0, 0, .015), mm['steel'], .004), box('guard', (.46, .52, 1.2), (0, 0, .6), mm['yellow'], .03)]
        return join(g, 'column')
    def b_truss():
        g = []; span = 24.; n = 8
        g.append(box('bc', (.14, span, .14), (0, 0, 11.4), mm['steel'], .01)); g.append(box('tc', (.14, span, .14), (0, 0, 13.4), mm['steel'], .01))
        for i in range(n + 1):
            y = -span / 2 + i * span / n; g.append(box('v', (.08, .08, 2.), (0, y, 12.4), mm['steel'], .006))
            if i < n:
                d = box('d', (.07, .07, math.hypot(span / n, 2.)), (0, y + span / n / 2, 12.4), mm['steel'], .006); d.rotation_euler = ((1 if i % 2 else -1) * math.atan2(span / n, 2.), 0, 0); g.append(d)
        return join(g, 'truss')
    for x in COLS_X:
        for y in COLS_Y: place('column', (x + (.4 if x == X0 else 0), y, 0), builder=b_col)
        for y in (24., 48., 72., 6., 90.): place('truss', (x + (.4 if x == X0 else 0), y, 0), builder=b_truss)
    for y in (0.5, 12, 24, 36, 48, 60, 72, 84, 95.5):
        box('purlin', (L_, .1, .2), (cx, y, 13.6), mm['steel'], 0)
    for y in (45., 51.): box('aisleline', (L_ - 8, .1, .002), (cx, y, .001), mm['paint'], 0)
    return DOORS

def cutaway():
    """For the high view: the roof, its steel and the two near walls let the camera through, but still block light."""
    for o in bpy.data.objects:
        n = o.name
        if n.startswith(('roof', 'wS', 'wW', 'purlin', 'truss')) or (o.parent and o.parent.name.startswith('truss')): o.visible_camera = False

def b_truck():
    """A cab-over tractor and a box trailer, 16 m overall. The trailer's rear is at x = 0, the truck extends to -x."""
    mm = M(); g = []; wh = worn('trailerwhite', (.52, .53, .52, 1), (.35, .6), 0., 3, .006); cabm = worn('cabyellow', (.6, .36, .02, 1), (.22, .45), 0., 4); glass = mat('glass', (.01, .012, .015, 1), .08)
    g.append(box('body', (12.4, 2.5, 2.7), (-6.2, 0, 2.65), wh, .03)); g.append(box('rearframe', (.08, 2.56, 2.78), (-.04, 0, 2.65), mm['galv'], .01))
    for y in (-.5, .5): g.append(box('rail', (11.8, .12, .3), (-6.3, y, 1.12), mm['dark'], .01))
    g.append(box('underrun', (.1, 2.3, .12), (-.2, 0, .55), mm['dark'], .02))
    for y in (-.9, .9): g.append(box('leg', (.12, .12, 1.0), (-9.6, y, .5), mm['dark'], .01))
    for x in (-1.6, -2.95, -4.3):
        for y in (-1.02, 1.02):
            for p in b_wheel(.52, .32): p.location = (x, y, .52); g.append(p)
        g.append(box('mud', (.9, 2.5, .05), (x, 0, 1.1), mm['dark'], .01))
    cab = box('cab', (2.3, 2.46, 2.5), (-14.6, 0, 2.2), cabm, .22, seg=4); s = cab.modifiers.new('s', 'SUBSURF'); s.levels = 1; s.render_levels = 2; g.append(cab)
    g.append(box('screen', (.06, 2.2, .95), (-15.76, 0, 2.75), glass, .02)); g.append(box('bumper', (.3, 2.46, .45), (-15.65, 0, .72), mm['dark'], .05))
    g.append(box('frame', (5.6, .9, .3), (-12.6, 0, .95), mm['dark'], .02)); g.append(box('fifth', (1.2, 1.0, .12), (-11.6, 0, 1.2), mm['dark'], .02))
    for x in (-14.9, -11.4, -12.7):
        for y in (-1.02, 1.02):
            for p in b_wheel(.52, .32): p.location = (x, y, .52); g.append(p)
    return join(g, 'truck')

def truck(xw, y, s=-1):
    """Backed up to a dock door in the wall at x = xw. s = -1: the truck stands on the -x side."""
    return place('truck', (xw + s * .5, y, 0), 0. if s < 0 else math.pi, builder=b_truck)

def group(l, g):
    vl = bpy.context.view_layer
    if g not in [x.name for x in vl.lightgroups]: vl.lightgroups.add(name=g)
    l.lightgroup = g

def fixtures(lamp_z=9.2):
    mm = M(); bulb = mat('bulb', (0, 0, 0, 1), 1, emit=(1, 1, 1, 1), strength=220)
    def b_lamp():
        g = [cyl('shade', .28, .22, (0, 0, .13), mm['dark'], 'z', 32, .01), cyl('neck', .07, .22, (0, 0, .34), mm['dark'], 'z', 16, .006), cyl('rod', .012, 4.2, (0, 0, 2.5), mm['dark'], 'z', 8, 0)]
        return join(g, 'lamp')
    for i, (x, y) in enumerate(lamps_xy()):
        place('lamp', (x, y, lamp_z), builder=b_lamp)
        d = cyl('glow', .22, .004, (x, y, lamp_z + .012), bulb, 'z', 24, 0); d['lamp'] = (x, y)

def spot(x, y, z, energy, size, g, blend=.65, soft=.22, vol=True):
    bpy.ops.object.light_add(type='SPOT', location=(x, y, z)); l = bpy.context.object; l.data.energy = energy
    l.data.spot_size = rad(size); l.data.spot_blend = blend; l.data.shadow_soft_size = soft; l.data.color = (1, 1, 1); group(l, g); l.visible_volume_scatter = vol; return l

def lighting(off=(), energy=9000., lamp_z=9.2, dim={}, g='lamps'):
    """Sodium high-bay lamps on a 12 m grid. Rendered neutral; the single-wavelength sodium look is a grade."""
    for (x, y) in lamps_xy():
        if (x, y) in off: continue
        spot(x, y, lamp_z - .02, energy * R.uniform(.82, 1.1) * dim.get((x, y), 1.), 118, g)
    for o in bpy.data.objects:
        if 'lamp' in o.keys():
            xy = tuple(o['lamp'])
            if xy in off: o.hide_render = True
            o.lightgroup = g

def haze(density=.0045, aniso=.55):
    X, Y, Z = HALL
    bpy.ops.mesh.primitive_cube_add(size=1, location=((X + X0) / 2, Y / 2, Z / 2)); dom = bpy.context.object; dom.name = 'haze'; dom.scale = (X - X0 + 40, Y + .5, Z)
    vm = bpy.data.materials.new('haze'); vm.use_nodes = True; nt = vm.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF'])
    pv = nt.nodes.new('ShaderNodeVolumePrincipled'); pv.inputs['Density'].default_value = density; pv.inputs['Anisotropy'].default_value = aniso; pv.inputs['Color'].default_value = (1, 1, 1, 1)
    nt.links.new(pv.outputs['Volume'], nt.nodes['Material Output'].inputs['Volume']); dom.data.materials.append(vm)
    return dom

def yard(xw, s, open_=(1, 2, 3), energy=60000., g='yard'):
    """Beyond the open dock doors: the yard at night under flood lamps, seen as a bright haze field."""
    for k in open_:
        d = DOORS[k]
        bpy.ops.object.light_add(type='AREA', location=(xw + s * 9, d, 6.5), rotation=(0, rad(-58 * s), 0)); a = bpy.context.object; a.data.shape = 'RECTANGLE'; a.data.size = 5; a.data.size_y = 6; a.data.energy = energy; group(a, g)

# ------------------------------------------------------------------ loads and buffers
def stack_boxes(x, y, layers, rot=0.):
    place('pallet', (x, y, 0), rot, builder=b_pallet)
    c, s = math.cos(rot), math.sin(rot)
    for k in range(layers):
        for i in range(3):
            for j in range(2):
                if k == layers - 1 and R.random() < .3: continue
                dx = -.38 + i * .385 + R.uniform(-.012, .012); dy = -.26 + j * .52 + R.uniform(-.012, .012)
                place('cardboard_box_01', (x + dx * c - dy * s, y + dx * s + dy * c, PAL + k * .335), rot + R.choice([0, math.pi]) + R.uniform(-.05, .05))

def stack_crates(x, y, layers, rot=0., kind='plastic_crate_01'):
    place('pallet', (x, y, 0), rot, builder=b_pallet)
    c, s = math.cos(rot), math.sin(rot); nx, ny, sx, sy, h = (4, 2, .3, .41, .26) if kind == 'plastic_crate_01' else (2, 3, .49, .27, .27)
    for k in range(layers):
        for i in range(nx):
            for j in range(ny):
                if k == layers - 1 and R.random() < .25: continue
                dx = -(nx - 1) * sx / 2 + i * sx; dy = -(ny - 1) * sy / 2 + j * sy
                place(kind, (x + dx * c - dy * s, y + dx * s + dy * c, PAL + k * h), rot + R.uniform(-.03, .03))

def wrapped(x, y, h, rot=0.):
    wm = bpy.data.materials.get('wrap')
    if not wm:
        wm = bpy.data.materials.new('wrap'); wm.use_nodes = True; nt = wm.node_tree; b = nt.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = (.3, .27, .22, 1); b.inputs['Roughness'].default_value = .16; b.inputs['Coat Weight'].default_value = .7; b.inputs['Coat Roughness'].default_value = .1
        tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 14)
        nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3; nz.inputs['Detail'].default_value = 8; nz.inputs['Distortion'].default_value = 1.2
        bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = .5; bm.inputs['Distance'].default_value = .012
        nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], nz.inputs['Vector']); nt.links.new(nz.outputs['Fac'], bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
    place('pallet', (x, y, 0), rot, builder=b_pallet)
    o = box('load', (1.16, .78, h), (x, y, PAL + h / 2), wm, .045, seg=3); o.rotation_euler = (R.uniform(-.015, .015), R.uniform(-.015, .015), rot + R.uniform(-.03, .03))
    md = o.modifiers.new('s', 'SUBSURF'); md.levels = 1; md.render_levels = 2
    return o

def trolley(x, y, rot=0., load=1, tag=True):
    """A WIP trolley with ribbed bins and cartons, and the real AmIGo on the handle-end post at waist height."""
    t = place('trolley', (x, y, 0), rot, builder=b_trolley)
    c, s = math.cos(rot), math.sin(rot)
    def at(dx, dy, z): return (x + dx * c - dy * s, y + dx * s + dy * c, z)
    if load:
        for z, n in ((.212, 3), (.592, 3 if load > 1 else 2)):
            for i in range(n):
                if R.random() < .15: continue
                k = R.choice(['plastic_crate_01', 'plastic_crate_01', 'cardboard_box_01'])
                place(k, at(-.36 + i * .36 + R.uniform(-.01, .01), R.uniform(-.03, .03), z), rot + math.pi / 2 + R.uniform(-.06, .06))
    if tag:
        a = amigo(at(-.55 - .017, -.31, .86), (0, rad(-90), rot))
    THINGS.append(['trolley', x, y])
    return t

def forklift(x, y, rot=0., tag=True, beacon=False):
    f = place('forklift', (x, y, 0), rot, builder=b_forklift)
    if tag: amigo((x - .2 * math.cos(rot), y - .2 * math.sin(rot), 2.137), (0, 0, rot))
    THINGS.append(['forklift', x, y])
    return f

def amr(x, y, rot=0., carry=True):
    a = place('amr', (x, y, 0), rot, builder=b_amr); place('amrstrip', (x, y, 0), rot, builder=b_strip)
    if carry: place('worn_metal_rack', (x, y, .3), rot)
    THINGS.append(['amr', x, y])
    return a
