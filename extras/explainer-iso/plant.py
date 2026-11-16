# The AmIMotion explainer plant: one large factory-warehouse, built from code in Blender (bpy 5.x), seen as a cutaway diorama.
# Real-world scale in metres. x runs right along the docks, y runs away from the camera, z up.
#   south wall (y=0, near the camera): cut low; five outbound dock doors with trucks backed in, staging lanes inside
#   west wall (x=0): cut low; one inbound door with a truck
#   north and east walls: full height, insulated panels, a clerestory window band
#   left half: six double rows of pallet racking, aisles A1..A5 between them
#   right half: two assembly lines with stations, a WIP buffer of trolleys, an AMR loop
#   back right: a glass control room on a mezzanine
# Everything that moves (forklifts, robots, trolleys in transit, people walking) is placed from MOVERS so it can be
# rendered into the plate or left out and rendered as its own layer.
import sys, os, math, random, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *
import models as MD
import bpy
from mathutils import Vector, Matrix

R = random.Random(7)

# ---------------------------------------------------------------- collections and instancing
def coll(name, parent=None):
    c = bpy.data.collections.new(name); (parent or bpy.context.scene.collection).children.link(c); return c

def set_active(c):
    def find(lc):
        if lc.collection == c: return lc
        for ch in lc.children:
            r = find(ch)
            if r: return r
    bpy.context.view_layer.active_layer_collection = find(bpy.context.view_layer.layer_collection)

SRC = {}
def src(name, fn):
    """Build a prop once, in its own collection at the origin, hidden; instances of it render."""
    if name in SRC: return SRC[name]
    c = coll('SRC_' + name, SRCROOT); set_active(c); fn(); set_active(MAIN)
    SRC[name] = c; return c

def inst(name, loc, rotz=0., parent=None, scale=1.):
    o = bpy.data.objects.new(name, None); o.instance_type = 'COLLECTION'; o.instance_collection = SRC[name]
    o.location = loc; o.rotation_euler.z = rotz; o.scale = (scale,) * 3
    (parent or bpy.context.view_layer.active_layer_collection.collection).objects.link(o); return o

# ---------------------------------------------------------------- materials beyond the kit
def plant_mats():
    M.update(
        concrete=concrete_mat(),
        panel=panel_mat(),
        upright=mat('upright', (.04, .13, .42), rough=.42, coat=.2),
        beam=mat('beam', (.85, .26, .03), rough=.4, coat=.25),
        lane=mat('lane', (.95, .66, .02), rough=.55, noise=.25, noise_scale=8),
        laneW=mat('laneW', (.85, .86, .84), rough=.55, noise=.25, noise_scale=8),
        zoneG=mat('zoneG', (.05, .45, .2), rough=.6, noise=.2, noise_scale=6),
        zoneB=mat('zoneB', (.05, .2, .55), rough=.6, noise=.2, noise_scale=6),
        door=door_mat(),
        frame=mat('frame', (.16, .17, .19), rough=.45, metal=.6),
        bollard=mat('bollard', (.95, .7, .02), rough=.35, coat=.4),
        trailer=mat('trailer', (.86, .87, .88), rough=.3, coat=.3, noise=.1, noise_scale=20),
        cab=mat('cab', (.07, .25, .62), rough=.25, coat=.8, coat_r=.05),
        cabW=mat('cabW', (.88, .89, .9), rough=.25, coat=.8, coat_r=.05),
        tint=mat('tint', (.02, .03, .04), rough=.05, metal=.2, coat=1),
        roller=mat('roller', (.7, .72, .74), rough=.2, metal=1),
        bench=mat('benchtop', (.75, .76, .74), rough=.5),
        benchF=mat('benchF', (.12, .3, .42), rough=.4, coat=.2),
        screen=mat('screen', (.02, .05, .1), rough=.2, emit=(.15, .4, .9), emit_s=3),
        glassW=mat('glassW', (.8, .9, 1.), rough=.02, transmission=1, ior=1.45),
        rail=mat('rail', (.95, .72, .03), rough=.35, coat=.3),
        office=mat('officeF', (.3, .32, .35), rough=.6),
        anchor=mat('anchor', (.045, .047, .052), rough=.38, coat=.4),
        window=mat('window', (.75, .85, 1.), rough=.1, emit=(.75, .85, 1.), emit_s=WIN),
        lightpanel=mat('lightpanel', (1, 1, 1), rough=.3, emit=(1, .97, .92), emit_s=6),
    )

def concrete_mat():
    m = bpy.data.materials.new('concrete'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    n1 = nt.nodes.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = .06; n1.inputs['Detail'].default_value = 10; n1.inputs['Roughness'].default_value = .62
    n2 = nt.nodes.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 2.2; n2.inputs['Detail'].default_value = 12
    for n in (n1, n2): nt.links.new(tc.outputs['Object'], n.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = .35; ramp.color_ramp.elements[0].color = (.09, .095, .1, 1)
    ramp.color_ramp.elements[1].position = .7; ramp.color_ramp.elements[1].color = (.16, .165, .17, 1)
    mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MULTIPLY_ADD'; mx.inputs[1].default_value = .6
    nt.links.new(n1.outputs['Fac'], mx.inputs[0]); nt.links.new(n2.outputs['Fac'], mx.inputs[2]); mx.inputs[2].default_value = .2
    nt.links.new(mx.outputs[0], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    # polished slab: glossy with patchy wear
    rr = nt.nodes.new('ShaderNodeMapRange'); rr.inputs['To Min'].default_value = .1; rr.inputs['To Max'].default_value = .38
    nt.links.new(n1.outputs['Fac'], rr.inputs['Value']); nt.links.new(rr.outputs['Result'], b.inputs['Roughness'])
    # saw-cut joints every 6 m
    br = nt.nodes.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value = 1 / 6; br.inputs['Mortar Size'].default_value = .006; br.offset = 0; br.squash = 1
    br.inputs['Brick Width'].default_value = 1; br.inputs['Row Height'].default_value = 1
    nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .25; bp.inputs['Distance'].default_value = .01; bp.invert = True
    nt.links.new(br.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def panel_mat():
    m = bpy.data.materials.new('panel'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (.42, .44, .47, 1); b.inputs['Roughness'].default_value = .42; b.inputs['Metallic'].default_value = .35
    tc = nt.nodes.new('ShaderNodeTexCoord'); w = nt.nodes.new('ShaderNodeTexWave'); w.wave_type = 'BANDS'; w.bands_direction = 'Z'
    w.inputs['Scale'].default_value = 3.0; w.wave_profile = 'SAW'
    nt.links.new(tc.outputs['Object'], w.inputs['Vector'])
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .35; bp.inputs['Distance'].default_value = .02
    nt.links.new(w.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def door_mat():
    m = bpy.data.materials.new('rolldoor'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (.55, .57, .6, 1); b.inputs['Roughness'].default_value = .35; b.inputs['Metallic'].default_value = .6
    tc = nt.nodes.new('ShaderNodeTexCoord'); w = nt.nodes.new('ShaderNodeTexWave'); w.wave_type = 'BANDS'; w.bands_direction = 'Z'; w.inputs['Scale'].default_value = 5
    nt.links.new(tc.outputs['Object'], w.inputs['Vector'])
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .5
    nt.links.new(w.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

# ---------------------------------------------------------------- props
def pallet_load(seed, layers=3):
    def f():
        R2 = random.Random(seed); W, D = 1.2, 1.0
        for x in (-.55, 0, .55): box('block', (.1, D, .078), (x, 0, .083), M['wood'], bevel=.003)
        for i in range(7):
            y = -D / 2 + .06 + i * (D - .12) / 6
            box('deck', (W, .1, .022), (0, y, .133), M['wood'], bevel=.002)
        h = .145
        nx, ny = 3, 3
        for L in range(layers):
            bh = R2.choice((.24, .3, .36))
            for i in range(nx):
                for j in range(ny):
                    if L == layers - 1 and R2.random() < .15: continue
                    bw, bd = W / nx - .012, D / ny - .012
                    b = box('carton', (bw, bd, bh), (-W / 2 + (i + .5) * W / nx, -D / 2 + (j + .5) * D / ny, h + bh / 2), M['cardboard'], bevel=.008)
                    b.rotation_euler.z = R2.uniform(-.03, .03)
            h += bh
        if R2.random() < .7: box('wrap', (W + .03, D + .03, h - .13), (0, 0, .145 + (h - .145) / 2), M['wrap'], bevel=.03, segs=4)
    return src('pallet%d_%d' % (seed, layers), f)

def rack_row(x, y0, bays, levels=4, seed=0, double=True):
    """A double-deep pallet rack along y. Bay pitch 2.8 m, beam levels 1.75 m apart."""
    def up():
        box('post', (.1, .08, 1), (0, 0, .5), M['upright'], bevel=.008)
    src('upright', lambda: [box('post', (.1, .08, 7.6), (0, 0, 3.8), M['upright'], bevel=.006),
                            box('foot', (.2, .16, .02), (0, 0, .01), M['upright'], bevel=.002)] and None)
    src('beam', lambda: box('beam', (.06, 2.7, .14), (0, 0, 0), M['beam'], bevel=.006))
    src('brace', lambda: [tube('br', [(0, -.03, .3 + k * 1.2), (0, .03, .9 + k * 1.2)], .018, M['upright']) for k in range(6)] and None)
    rr = random.Random(seed); depth = 1.1
    rows = (x - .65, x + .65) if double else (x,)
    for rx in rows:
        for i in range(bays + 1):
            yy = y0 + i * 2.8
            for dx in (-depth / 2, depth / 2): inst('upright', (rx + dx, yy, 0))
        for i in range(bays):
            yc = y0 + (i + .5) * 2.8
            for L in range(levels):
                z = 1.75 * (L + 1) - .2 if L < levels else 0
                for dx in (-depth / 2, depth / 2): inst('beam', (rx + dx, yc, z))
            for L in range(levels + 1):
                zb = 0 if L == 0 else 1.75 * L - .13
                for k in (-.68, .68):
                    if rr.random() < .86:
                        inst(pallet_load(rr.randrange(5), rr.choice((2, 3, 3))).name[4:], (rx, yc + k, zb), rotz=math.pi / 2 if False else 0)

def column(x, y, anchor=True):
    src('column', lambda: [box('web', (.3, .3, 9), (0, 0, 4.5), M['frame'], bevel=.01),
                           cyl('guard', .2, 1.1, (0, 0, .55), M['bollard'], verts=24, bevel=.01)] and None)
    inst('column', (x, y, 0))
    if anchor: anchor_on(x, y - .17, 6.2)

_anc = {}
def anchor_on(x, y, z):
    """An AmIMo anchor from the founders' CAD, on a column face, looking down into the floor."""
    if not _anc:
        meta = json.load(open(os.path.join(CAD, 'mesh.json')))
        for key in ('anc_body', 'anc_cap'):
            m = meta[key]; buf = open(os.path.join(CAD, key + '.mesh'), 'rb').read()
            q = np.frombuffer(buf, dtype=np.uint16, count=m['nv'] * 3).reshape(-1, 3).astype(np.float64)
            p = np.array(m['min']) + q * np.array(m['scale']); p *= .001
            idx = np.frombuffer(buf, dtype=np.uint16, count=m['ni'], offset=m['iOff']).reshape(-1, 3)
            me = bpy.data.meshes.new(key); me.from_pydata(p.tolist(), [], idx.tolist()); me.update()
            for poly in me.polygons: poly.use_smooth = True
            me.materials.append(M['anchor']); _anc[key] = me
        def f():
            for k, me in _anc.items():
                o = bpy.data.objects.new(k, me); bpy.context.collection.objects.link(o); o.scale = (2.2,) * 3   # shown a touch large so it reads at plant scale
                o.rotation_euler = (math.pi / 2, 0, 0)
            box('led', (.03, .01, .008), (0, -.03, .02), M['led'], bevel=0)
        src('anchor', f)
    inst('anchor', (x, y, z))

def dock_door(x, y, rotz=0.):
    def f():
        box('frameL', (.25, .3, 4.2), (-1.75, 0, 2.1), M['frame'], bevel=.01)
        box('frameR', (.25, .3, 4.2), (1.75, 0, 2.1), M['frame'], bevel=.01)
        box('head', (3.75, .5, .55), (0, 0, 4.4), M['frame'], bevel=.02)
        box('door', (3.3, .06, 1.3), (0, .05, 3.6), M['door'], bevel=.005)   # rolled most of the way up
        box('leveler', (2.4, 1.8, .06), (0, .9, .02), mat('level', (.25, .26, .27), rough=.5, metal=.7, noise=.4, noise_scale=30), bevel=.01)
        for sx in (-1, 1): box('bump', (.3, .14, .4), (sx * 1.0, -.1, 1.05), M['rubber'], bevel=.03)
        box('seal', (3.9, .5, .25), (0, -.3, 4.1), mat('sealM', (.05, .05, .055), rough=.8), bevel=.05)
        box('lamp', (.16, .1, .1), (1.95, -.08, 2.4), mat('lampG', (.1, .9, .3), rough=.2, emit=(.1, 1, .3), emit_s=4), bevel=.02)
    src('dockdoor', f); inst('dockdoor', (x, y, 0), rotz)

def truck(name, x, y, rotz=0., colour='cab', trailer_len=12.0):
    """A box trailer (rear at the origin, running away along -y) and its tractor."""
    def f():
        T = M['trailer']; L = trailer_len
        box('box', (2.55, L, 2.75), (0, -L / 2 - .1, 1.35 + 1.38), T, bevel=.04, segs=3)
        for k in range(int(L / .6)): box('rib', (2.6, .05, 2.7), (0, -.4 - k * .6, 2.73), T, bevel=.005)
        box('rearframe', (2.6, .12, 2.8), (0, -.05, 2.73), M['frame'], bevel=.01)
        box('chassis', (1.1, L - .4, .25), (0, -L / 2, 1.1), M['fork_dark'], bevel=.02)
        for yy in (-1.3, -2.6, -3.9):
            for sx in (-1, 1): cyl('tyre', .5, .32, (sx * .98, yy, .5), M['rubber'], rot=(0, math.pi / 2, 0), verts=40, bevel=.03)
        for sx in (-1, 1): box('leg', (.12, .12, 1.0), (sx * .6, -L + 2.2, .55), M['frame'], bevel=.01)
        # tractor
        cy = -L - .6
        box('cab', (2.5, 2.3, 2.6), (0, cy - 1.5, 2.3), M[colour], bevel=.18, segs=5)
        box('wind', (2.3, .05, 1.1), (0, cy - 2.66, 2.9), M['tint'], bevel=.02)
        for sx in (-1, 1): box('sidewin', (.05, 1.0, .8), (sx * 1.26, cy - 2.0, 2.9), M['tint'], bevel=.02)
        box('grille', (2.2, .05, .9), (0, cy - 2.66, 1.4), M['fork_dark'], bevel=.01)
        box('tchassis', (1.1, 4.8, .3), (0, cy - .6, .9), M['fork_dark'], bevel=.02)
        for yy in (cy - 1.9, cy + .4, cy + 1.6):
            for sx in (-1, 1): cyl('tyre', .52, .34, (sx * 1.0, yy, .52), M['rubber'], rot=(0, math.pi / 2, 0), verts=40, bevel=.03)
        box('fender', (2.5, .9, .1), (0, cy - 1.9, 1.15), M[colour], bevel=.03)
    src('truck_' + colour + str(int(trailer_len)), f); inst('truck_' + colour + str(int(trailer_len)), (x, y, 0), rotz)

def conveyor(x0, x1, y):
    def seg():
        box('railA', (2.0, .08, .16), (0, -.42, .82), M['zinc'], bevel=.005)
        box('railB', (2.0, .08, .16), (0, .42, .82), M['zinc'], bevel=.005)
        for k in range(20): cyl('roller', .035, .78, (-.95 + k * .1, 0, .82), M['roller'], rot=(math.pi / 2, 0, 0), verts=16, bevel=0)
        for sx in (-.9, .9):
            for sy in (-1, 1): box('leg', (.06, .06, .78), (sx, sy * .38, .39), M['zinc'], bevel=.004)
    src('conv', seg)
    n = int((x1 - x0) / 2)
    for i in range(n): inst('conv', (x0 + 1 + i * 2, y, 0))
    rr = random.Random(int(y))
    src('carton1', lambda: box('carton', (.5, .4, .3), (0, 0, .15), M['cardboard'], bevel=.008))
    for i in range(n):
        if rr.random() < .55: inst('carton1', (x0 + 1 + i * 2 + rr.uniform(-.5, .5), y, .86), rotz=rr.uniform(-.1, .1))

def station(x, y, rotz=0.):
    def f():
        box('top', (1.8, .9, .05), (0, 0, .92), M['bench'], bevel=.006)
        for sx in (-.85, .85):
            for sy in (-.4, .4): box('leg', (.06, .06, .9), (sx, sy, .45), M['benchF'], bevel=.004)
        box('shelf', (1.8, .3, .03), (0, .3, 1.55), M['benchF'], bevel=.004)
        for sx in (-.85, .85): box('upr', (.05, .05, .7), (sx, .42, 1.25), M['benchF'], bevel=.004)
        for k in range(4): box('bin', (.32, .26, .18), (-.6 + k * .4, .3, 1.66), M['tote'], bevel=.01)
        box('mon', (.5, .03, .32), (.5, .1, 1.25), M['screen'], bevel=.006)
        box('monarm', (.03, .03, .3), (.5, .14, 1.04), M['frame'], bevel=0)
        box('fix', (.5, .4, .12), (-.3, -.05, 1.0), M['steel'], bevel=.01)
        box('mat', (1.6, .8, .02), (0, -.85, .01), mat('antif', (.03, .03, .035), rough=.9), bevel=.005)
    src('station', f); inst('station', (x, y, 0), rotz)

def control_room(x, y):
    def f():
        W, D, H, Z = 12.0, 7.0, 3.0, 3.6
        box('deck', (W, D, .3), (0, 0, Z - .15), M['frame'], bevel=.02)
        for sx in (-1, 1):
            for sy in (-1, 1): box('post', (.25, .25, Z - .3), (sx * (W / 2 - .2), sy * (D / 2 - .2), (Z - .3) / 2), M['frame'], bevel=.01)
        box('floor2', (W - .2, D - .2, .05), (0, 0, Z + .02), M['office'], bevel=0)
        box('glassF', (W, .04, H), (0, -D / 2, Z + H / 2), M['glassW'], bevel=0)
        box('glassL', (.04, D, H), (-W / 2, 0, Z + H / 2), M['glassW'], bevel=0)
        box('roof', (W + .2, D + .2, .2), (0, 0, Z + H + .1), M['panel'], bevel=.02)
        box('backw', (W, .15, H), (0, D / 2, Z + H / 2), M['panel'], bevel=0)
        box('sidew', (.15, D, H), (W / 2, 0, Z + H / 2), M['panel'], bevel=0)
        for k in range(5): box('mull', (.06, .08, H), (-W / 2 + k * W / 4, -D / 2, Z + H / 2), M['frame'], bevel=0)
        # the video wall: the live map
        box('wall', (6.0, .06, 1.6), (0, D / 2 - .12, Z + 1.7), M['screen'], bevel=.01)
        for k in range(3):
            box('desk', (2.6, .9, .06), (-3.5 + k * 3.5, .8, Z + .75), M['bench'], bevel=.01)
            box('dmon', (.7, .04, .42), (-3.5 + k * 3.5, 1.1, Z + 1.05), M['screen'], bevel=.006)
            box('dmon2', (.7, .04, .42), (-2.7 + k * 3.5, 1.1, Z + 1.05), M['screen'], bevel=.006)
        # stair
        for k in range(14): box('step', (1.1, .3, .05), (W / 2 - .8, -D / 2 - .4 - k * .28, Z - .25 - k * .25), M['frame'], bevel=.005)
        tube('hand', [(W / 2 - .25, -D / 2 - .4, Z + .8), (W / 2 - .25, -D / 2 - 4.2, .9)], .025, M['rail'])
        tube('rail', [(-W / 2, -D / 2 - .05, Z + 1.05), (W / 2 - 1.4, -D / 2 - .05, Z + 1.05)], .025, M['rail'])
    src('control', f); inst('control', (x, y, 0))

def walls(W, D):
    Hh, stub = 9.0, .7
    box('wallN', (W + .6, .3, Hh), (W / 2, D + .15, Hh / 2), M['panel'], bevel=.01)
    box('wallE', (.3, D, Hh), (W + .15, D / 2, Hh / 2), M['panel'], bevel=.01)
    box('baseN', (W + .6, .32, .6), (W / 2, D + .15, .3), mat('plinth', (.3, .31, .32), rough=.7), bevel=.01)
    box('baseE', (.32, D, .6), (W + .15, D / 2, .3), mat('plinth', (.3, .31, .32), rough=.7), bevel=.01)
    box('winN', (W - 2, .32, 1.0), (W / 2, D + .15, 7.6), M['window'], bevel=0)
    box('winE', (.32, D - 2, 1.0), (W + .15, D / 2, 7.6), M['window'], bevel=0)
    for k in range(int(W / 4) + 1): box('pil', (.2, .36, Hh), (k * 4, D + .15, Hh / 2), M['frame'], bevel=.01)
    for k in range(int(D / 4) + 1): box('pilE', (.36, .2, Hh), (W + .15, k * 4, Hh / 2), M['frame'], bevel=.01)
    # the cut walls, near the camera, as a low stub with a clean cut face
    cut = mat('cut', (.62, .63, .65), rough=.6)
    box('wallS', (W + .6, .3, stub), (W / 2, -.15, stub / 2), cut, bevel=.01)
    box('wallW', (.3, D, stub), (-.15, D / 2, stub / 2), cut, bevel=.01)
    # roof trusses, cut back so they read as structure without hiding the floor
    pass

def floor(W, D):
    box('slab', (W + 30, D + 40, .3), (W / 2, D / 2 - 10, -.15), mat('yard', (.07, .075, .08), rough=.85, noise=.4, noise_scale=1), bevel=0)
    box('floor', (W, D, .02), (W / 2, D / 2, .005), M['concrete'], bevel=0)
    def line(x0, y0, x1, y1, m, w=.12):
        L = math.hypot(x1 - x0, y1 - y0); o = box('line', (L, w, .004), (0, 0, 0), m, bevel=0)
        o.rotation_euler.z = math.atan2(y1 - y0, x1 - x0); o.location = ((x0 + x1) / 2, (y0 + y1) / 2, .018)
    def rect(x0, y0, x1, y1, m, w=.12):
        line(x0, y0, x1, y0, m, w); line(x1, y0, x1, y1, m, w); line(x1, y1, x0, y1, m, w); line(x0, y1, x0, y0, m, w)
    Y = M['lane']; Wt = M['laneW']
    # main aisles
    for yy in (9.0, 13.0): line(1.0, yy, W - 1, yy, Y)
    for xx in (31.0, 33.5): line(xx, 13, xx, D - 1, Y)
    # racking zone and assembly zone outlines
    rect(2.5, 14.5, 30.0, D - 2.5, Wt, .08)
    # staging lanes in front of each outbound door (green)
    for k, dx in enumerate(DOORS):
        box('stage', (3.2, 5.2, .004), (dx, 4.4, .016), M['zoneG'], bevel=0)
        rect(dx - 1.6, 1.8, dx + 1.6, 7.0, Wt, .06)
    # WIP buffer (blue)
    box('wip', (9.0, 3.2, .004), (40.5, 11.0, .016), M['zoneB'], bevel=0)
    # pedestrian walkway, hatched
    for k in range(24): line(14 + k * .6, 10.4, 14.3 + k * .6, 11.6, Wt, .2)

DOORS = (38.0, 43.5, 49.0, 54.5, 60.0)

# ---------------------------------------------------------------- detail: machines, a robot cell, railings, lamps, flow racks
def machine(x, y, rotz=0.):
    def f():
        box('body', (2.6, 1.8, 2.1), (0, 0, 1.05), mat('mach', (.82, .83, .84), rough=.35, coat=.4), bevel=.04, segs=3)
        box('door', (1.3, .04, 1.1), (-.35, -.91, 1.2), M['glassW'], bevel=.01)
        box('doorF', (1.42, .03, 1.22), (-.35, -.9, 1.2), mat('machD', (.1, .11, .12), rough=.4), bevel=.01)
        box('panel', (.5, .06, .7), (.85, -.92, 1.35), mat('machD', (.1, .11, .12), rough=.4), bevel=.01)
        box('scr', (.36, .02, .26), (.85, -.96, 1.5), M['screen'], bevel=0)
        box('base', (2.7, 1.9, .12), (0, 0, .06), mat('machD', (.1, .11, .12), rough=.4), bevel=.01)
        cyl('tower', .04, .5, (1.1, .7, 2.35), M['frame'], verts=12)
        for k, c in enumerate(((.1, 1, .25), (1, .7, .05))):
            cyl('lamp', .055, .1, (1.1, .7, 2.65 + k * .1), mat('tl%d' % k, c, rough=.2, emit=c, emit_s=3), verts=16)
    src('machine', f); inst('machine', (x, y, 0), rotz)

def robot_cell(x, y):
    def f():
        fence = mat('fenceY', (.95, .75, .03), rough=.4, coat=.3)
        mesh = mat('mesh', (.1, .1, .11), rough=.5, metal=.4, alpha=1)
        for (a, b) in (((-2.5, -2), (2.5, -2)), ((2.5, -2), (2.5, 2)), ((2.5, 2), (-2.5, 2)), ((-2.5, 2), (-2.5, -2))):
            L = math.hypot(b[0] - a[0], b[1] - a[1]); n = int(L / 1.25)
            for k in range(n + 1):
                px, py = a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n
                box('fp', (.06, .06, 2.0), (px, py, 1.0), fence, bevel=.005)
            o = box('fm', (L, .02, 1.7), (0, 0, 0), mat('meshP', (.08, .08, .09), rough=.6, alpha=.35), bevel=0)
            o.rotation_euler.z = math.atan2(b[1] - a[1], b[0] - a[0]); o.location = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 1.05)
        orange = mat('robot', (.95, .42, .03), rough=.3, coat=.6)
        cyl('base', .35, .4, (0, 0, .2), M['fork_dark'], verts=32)
        cyl('j1', .3, .5, (0, 0, .65), orange, verts=32, bevel=.02)
        tube('arm1', [(0, 0, .9), (.4, .2, 1.9)], .14, orange)
        tube('arm2', [(.4, .2, 1.9), (1.4, .6, 1.7)], .11, orange)
        tube('wrist', [(1.4, .6, 1.7), (1.55, .65, 1.3)], .07, M['fork_dark'])
        box('table', (1.4, 1.0, .8), (1.4, .5, .4), M['steel'], bevel=.01)
        box('part', (.6, .5, .3), (1.4, .5, .95), M['zinc'], bevel=.02)
    src('robotcell', f); inst('robotcell', (x, y, 0))

def railing(x0, y0, x1, y1):
    src('railseg', lambda: [box('p', (.1, .1, 1.1), (0, 0, .55), M['rail'], bevel=.02), box('r1', (2.0, .08, .1), (1.0, 0, 1.05), M['rail'], bevel=.02),
                            box('r2', (2.0, .08, .1), (1.0, 0, .55), M['rail'], bevel=.02)] and None)
    L = math.hypot(x1 - x0, y1 - y0); n = int(L / 2); ang = math.atan2(y1 - y0, x1 - x0)
    for k in range(n): inst('railseg', (x0 + math.cos(ang) * 2 * k, y0 + math.sin(ang) * 2 * k, 0), ang)

def flowrack(x, y, rotz=0.):
    def f():
        for sx in (-.75, .75):
            for sy in (-.35, .35): box('p', (.04, .04, 1.9), (sx, sy, .95), M['zinc'], bevel=.003)
        for k in range(3):
            z = .55 + k * .5
            o = box('lvl', (1.5, .7, .03), (0, 0, 0), M['zinc'], bevel=.003); o.rotation_euler.x = -.12; o.location.z = z
            for j in range(4): box('bin', (.32, .5, .2), (-.54 + j * .36, 0, z + .12), M['tote'] if (j + k) % 2 else mat('binY', (.95, .7, .05), rough=.4), bevel=.01)
    src('flowrack', f); inst('flowrack', (x, y, 0), rotz)

def lamps():
    src('lamp', lambda: [cyl('hood', .45, .25, (0, 0, 0), mat('hood', (.2, .21, .22), rough=.4, metal=.6), verts=32, bevel=.02),
                         cyl('lens', .4, .02, (0, 0, -.13), M['lightpanel'], verts=32, bevel=0),
                         tube('wire', [(0, 0, .1), (0, 0, 1.2)], .01, M['frame'])] and None)
    for i in range(8):
        for j in range(5): inst('lamp', (4 + i * 8, 4 + j * 8, 8.4))

def details():
    for k in range(4): machine(37.0 + k * 6.5, 31.5, math.pi)
    robot_cell(60.0, 22.5)
    railing(1.5, 13.6, 30.5, 13.6)
    railing(34.0, 13.6, 61.0, 13.6)
    for k in range(6):
        flowrack(37.0 + k * 4.2, 14.9, 0)
        flowrack(37.0 + k * 4.2, 30.1 - 1.0, math.pi) if False else None
    lamps()
    rr = random.Random(3)
    for k in range(6): inst(pallet_load(rr.randrange(5), 2).name[4:], (34.8 + (k % 3) * 1.4, 34.5 + (k // 3) * 1.3, 0))

# ---------------------------------------------------------------- movers
def MOVERS():
    """Everything that can move, with where it stands in the 'still' plate. kind, model, x, y, rotz"""
    return [
        ('forklift', 'fl1', 24.6, 11.0, 0.0),            # idle in the cross aisle
        ('forklift', 'fl2', 12.7, 22.0, math.pi / 2),     # in aisle A2
        ('forklift', 'fl3', 21.7, 30.5, -math.pi / 2),    # queued in aisle A4
        ('forklift', 'fl4', 21.7, 33.8, -math.pi / 2),
        ('forklift', 'fl5', 47.0, 6.0, math.pi),          # loading at a dock
        ('amr', 'amr1', 36.0, 21.5, 0.0),
        ('amr', 'amr2', 52.0, 21.8, math.pi),
        ('amr', 'amr3', 58.5, 15.0, math.pi / 2),
        ('trolley', 'tr1', 41.0, 11.2, 0.0), ('trolley', 'tr2', 42.6, 11.2, 0.0), ('trolley', 'tr3', 38.0, 10.4, 0.0),
        ('trolley', 'tr4', 44.0, 10.6, 0.0), ('trolley', 'tr5', 39.4, 11.7, 0.1), ('trolley', 'tr6', 37.0, 11.8, 0.05),
        ('trolley', 'tr7', 43.4, 12.0, -.05), ('trolley', 'tr8', 45.0, 11.6, 0.0),
        ('person', 'p1', 26.5, 11.6, math.pi * .8), ('person', 'p2', 37.0, 17.0, 0.), ('person', 'p3', 45.0, 17.0, 0.),
        ('person', 'p4', 53.0, 25.0, math.pi), ('person', 'p5', 41.0, 25.0, math.pi), ('person', 'p6', 49.5, 4.0, -.5),
        ('person', 'p7', 3.5, 31.0, 1.2), ('person', 'p8', 8.4, 12.0, -.2),
    ]

def mover_src(kind):
    if kind == 'forklift': return src('m_forklift', lambda: MD.forklift('fk', (0, 0, 0)))
    if kind == 'amr':
        def f():
            MD.amr('amr', (0, 0, 0)); box('rack', (.9, .6, .04), (0, 0, .33), M['amr_dark'], bevel=.01)
            for k in range(2): box('tote', (.4, .55, .22), (-.22 + k * .44, 0, .46), M['tote'], bevel=.012)
        return src('m_amr', f)
    if kind == 'trolley': return src('m_trolley', lambda: MD.trolley('tr', (0, 0, 0)))
    if kind == 'person':
        return src('m_person', lambda: MD.person('pp', (0, 0, 0), rotz=0.))

# ---------------------------------------------------------------- build
W, D = 64.0, 40.0
WIN = 1.0
def build(movers=True, roof_lights=True):
    global MAIN, SRCROOT
    clear(); mats(); plant_mats()
    sc = bpy.context.scene
    MAIN = coll('PLANT'); SRCROOT = coll('SOURCES')
    set_active(MAIN)
    floor(W, D); walls(W, D)
    # columns with anchors, on a 16 x 13 m grid
    for cx in (16, 32, 48):
        for cy in (13.0, 26.0):
            column(cx, cy)
    for cy in (6.5, 19.5, 32.5): anchor_on(W - .05, cy, 6.6)
    for cx in (8, 24, 40, 56): anchor_on(cx, D - .05, 6.6)
    # racks: six double rows, aisles between
    for i, rx in enumerate((5.0, 9.6, 14.2, 18.8, 23.4, 28.0)):
        rack_row(rx, 15.5, 7, levels=4, seed=i + 1)
    # outbound docks and trucks
    for k, dx in enumerate(DOORS):
        dock_door(dx, .2)
        if k != 2: truck('t%d' % k, dx, -.5, 0, colour='cab' if k % 2 else 'cabW')
        # staged pallets
        rr = random.Random(k)
        for j in range(rr.randint(2, 4)):
            inst(pallet_load(rr.randrange(5), 2).name[4:], (dx + (-.65 if j % 2 else .65), 2.8 + (j // 2) * 1.4, 0))
    # inbound door on the west wall, with a truck
    dock_door(.2, 31.0, -math.pi / 2); truck('tin', -.5, 31.0, -math.pi / 2, colour='cabW', trailer_len=11.0)
    for j in range(5): inst(pallet_load(j, 3).name[4:], (3.2 + (j % 2) * 1.4, 29.5 + (j // 2) * 1.3, 0))
    # assembly: two lines with stations; parts racks behind
    for ly in (18.5, 26.5):
        conveyor(35.0, 61.0, ly)
        for k in range(6):
            station(37.0 + k * 4.2, ly - 1.6, 0)
            station(37.0 + k * 4.2, ly + 1.6, math.pi)
    control_room(55.5, 35.6)
    details()
    # movers in the still plate
    if movers:
        for kind, name, x, y, rz in MOVERS():
            mover_src(kind); inst('m_' + kind, (x, y, 0), rz)
    for c in SRCROOT.children: pass
    # hide the sources from render (instances still render)
    for lc in bpy.context.view_layer.layer_collection.children:
        if lc.collection == SRCROOT: lc.exclude = True
    return sc

# ---------------------------------------------------------------- light, camera, render
def camera(sc, w, h, ortho=82.0, target=(33.0, 15.5, 0.0), az=-38.0, el=36.0):
    t = Vector(target); d = 120
    a, e = math.radians(az), math.radians(el)
    pos = t + Vector((math.sin(a) * math.cos(e) * -1 * -1, -math.cos(a) * math.cos(e), math.sin(e))) * d
    pos = t + Vector((-math.sin(-a) * math.cos(e), -math.cos(-a) * math.cos(e), math.sin(e))) * d
    bpy.ops.object.camera_add(location=pos); cam = bpy.context.active_object
    direction = t - pos; cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = ortho; cam.data.clip_end = 400
    sc.camera = cam; sc.render.resolution_x = w; sc.render.resolution_y = h
    return cam

def light_day(sc):
    world = bpy.data.worlds.new('w'); world.use_nodes = True; bg = world.node_tree.nodes['Background']
    sky = world.node_tree.nodes.new('ShaderNodeTexSky')
    try:
        sky.sky_type = 'MULTIPLE_SCATTERING'
    except Exception:
        pass
    try: sky.sun_elevation = math.radians(38); sky.sun_rotation = math.radians(210)
    except Exception: pass
    world.node_tree.links.new(sky.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = .12
    sc.world = world
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 50)); s = bpy.context.active_object
    s.data.energy = 2.2; s.data.angle = math.radians(3); s.data.color = (1, .95, .88)
    s.rotation_euler = (math.radians(48), 0, math.radians(-32))
    # high-bay panels
    for i in range(8):
        for j in range(5):
            bpy.ops.object.light_add(type='AREA', location=(4 + i * 8, 4 + j * 8, 8.6)); l = bpy.context.active_object
            l.data.energy = 260; l.data.size = 3; l.data.color = (1, .97, .92)

def light_night(sc, pools):
    world = bpy.data.worlds.new('n'); world.use_nodes = True; bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (.03, .05, .11, 1); bg.inputs['Strength'].default_value = 1.0; sc.world = world
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 50)); s = bpy.context.active_object
    s.data.energy = .35; s.data.color = (.5, .65, 1); s.rotation_euler = (math.radians(48), 0, math.radians(-32))
    for (x, y, e) in pools:
        bpy.ops.object.light_add(type='SPOT', location=(x, y, 8.5)); l = bpy.context.active_object
        l.data.energy = e; l.data.spot_size = math.radians(42); l.data.spot_blend = .9; l.data.color = (1, .9, .78); l.data.shadow_soft_size = .4

EXPO = -1.2
def render_setup(sc, samples):
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples
    sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.max_bounces = 6; sc.cycles.diffuse_bounces = 3; sc.cycles.glossy_bounces = 3; sc.cycles.transmission_bounces = 4
    sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = .02
    sc.render.use_persistent_data = True
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = EXPO
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_depth = '8'
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 4; sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'

def project(sc, pts):
    from bpy_extras.object_utils import world_to_camera_view
    cam = sc.camera
    return [[round(v, 5) for v in (lambda c: (c.x, 1 - c.y))(world_to_camera_view(sc, cam, Vector(p)))] for p in pts]

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out, w, h, s, mode = a[0], int(a[1]), int(a[2]), int(a[3]), a[4]
    if 'night' in mode: WIN = 0.12
    sc = build(movers='nomove' not in mode)
    render_setup(sc, s); camera(sc, w, h)
    if 'night' in mode: light_night(sc, [(26.5, 11.6, 1800), (21.7, 32.0, 1400), (36.0, 21.5, 1200), (47.0, 5.0, 1600)])
    else: light_day(sc)
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('RENDERED', out)
