# The parties, each a group under one empty at floor level (z=0), facing the camera at -Y.
import math, random
from kit import *

def boxes_on(parent, x0, y0, z0, w, d, seed=1, layers=1, wrap=False):
    random.seed(seed)
    for L in range(layers):
        z = z0 + L * .26
        nx = max(1, int(w // .38)); ny = max(1, int(d // .3))
        for i in range(nx):
            for j in range(ny):
                bw, bd = w / nx - .012, d / ny - .012; bh = .24 + random.uniform(-.015, .015)
                b = box('carton', (bw, bd, bh), (x0 - w / 2 + (i + .5) * w / nx, y0 - d / 2 + (j + .5) * d / ny, z + bh / 2), M['cardboard'], bevel=.006, parent=parent)
                b.rotation_euler.z = random.uniform(-.02, .02)
                box('tape', (bw * .2, bd + .002, .002), (b.location.x, b.location.y, z + bh + .001), mat('tape', (.55, .42, .26), rough=.25), bevel=0, parent=parent)
    if wrap:
        box('wrap', (w + .02, d + .02, layers * .26 + .02), (x0, y0, z0 + layers * .13), M['wrap'], bevel=.02, parent=parent, segs=4)

def caster(parent, x, y, r=.05):
    cyl('wheel', r, .035, (x, y, r), M['rubber'], rot=(0, math.pi / 2, 0), parent=parent)
    cyl('hub', r * .45, .04, (x, y, r), M['caster'], rot=(0, math.pi / 2, 0), parent=parent)
    box('fork', (.05, .05, .02), (x, y, 2 * r + .02), M['caster'], bevel=.003, parent=parent)
    box('forkL', (.004, .045, r * 1.2), (x - .022, y, r + .01), M['caster'], bevel=.001, parent=parent)
    box('forkR', (.004, .045, r * 1.2), (x + .022, y, r + .01), M['caster'], bevel=.001, parent=parent)

def trolley(name, loc):
    g = empty(name, loc); W, D = 1.0, .6
    for z in (.2, .78):
        box('shelf', (W, D, .025), (0, 0, z), M['powder'], bevel=.006, parent=g)
        box('lip', (W, .02, .04), (0, -D / 2 + .01, z + .02), M['powder'], bevel=.004, parent=g)
        box('lip2', (W, .02, .04), (0, D / 2 - .01, z + .02), M['powder'], bevel=.004, parent=g)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl('post', .014, .7, (sx * (W / 2 - .02), sy * (D / 2 - .02), .135 + .35), M['powder'], parent=g)
            caster(g, sx * (W / 2 - .07), sy * (D / 2 - .07))
    tube('handle', [(W / 2 - .02, -D / 2 + .03, .78), (W / 2 + .06, -D / 2 + .03, 1.05), (W / 2 + .06, D / 2 - .03, 1.05), (W / 2 - .02, D / 2 - .03, .78)], .014, M['zinc'], parent=g)
    boxes_on(g, -.05, 0, .79, .8, .5, seed=3)
    boxes_on(g, 0, 0, .21, .7, .5, seed=5)
    amigo(name + '_tag', (-.25, -D / 2 - .012, .74), '-Y', parent=g)
    return g

def totes(name, loc):
    g = empty(name, loc)
    box('dolly', (.62, .42, .05), (0, 0, .09), M['powder'], bevel=.006, parent=g)
    for sx in (-1, 1):
        for sy in (-1, 1): caster(g, sx * .25, sy * .15, .035)
    z = .115
    for i in range(3):
        h = .28
        o = box('tote', (.6, .4, h), (0, 0, z + h / 2), M['tote'], bevel=.012, parent=g)
        sol = o.modifiers.new('rib', 'BEVEL')  # keeps edges soft
        box('rim', (.62, .42, .025), (0, 0, z + h - .012), M['tote'], bevel=.008, parent=g)
        box('grip', (.16, .01, .035), (0, -.205, z + h - .06), M['amr_dark'], bevel=.006, parent=g)
        box('label', (.1, .004, .06), (.17, -.202, z + .12), mat('label', (.92, .92, .9), rough=.6), bevel=0, parent=g)
        z += h + .005
    amigo(name + '_tag', (-.17, -.205, .25), '-Y', parent=g)
    return g

def tool_chest(name, loc):
    g = empty(name, loc); W, D, H = .74, .46, .95
    box('body', (W, D, H), (0, 0, .1 + H / 2), M['chest'], bevel=.01, parent=g)
    hs = [.08, .08, .1, .12, .16, .22]; z = .1 + H - .04
    for i, h in enumerate(hs):
        z -= h
        box('drawer', (W - .05, .012, h - .012), (0, -D / 2 - .004, z + h / 2), M['chest'], bevel=.004, parent=g)
        box('pull', (W - .2, .02, .012), (0, -D / 2 - .016, z + h - .03), M['zinc'], bevel=.003, parent=g)
    box('top', (W + .02, D + .02, .03), (0, 0, .1 + H + .015), M['chest_dark'], bevel=.006, parent=g)
    for sx in (-1, 1):
        for sy in (-1, 1): caster(g, sx * (W / 2 - .06), sy * (D / 2 - .06), .045)
    # a torque wrench and a socket lying on top
    cyl('wrench', .013, .52, (-.05, .02, .1 + H + .045), M['steel'], rot=(0, math.pi / 2, .12), parent=g)
    cyl('grip', .017, .16, (-.26, -.006, .1 + H + .045), M['rubber'], rot=(0, math.pi / 2, .12), parent=g)
    cyl('head', .024, .04, (.21, .05, .1 + H + .045), M['steel'], parent=g)
    cyl('socket', .02, .05, (.25, -.1, .1 + H + .055), M['zinc'], parent=g)
    tube('handleside', [(W / 2 + .005, -.15, .1 + H - .1), (W / 2 + .06, -.15, .1 + H - .1), (W / 2 + .06, .15, .1 + H - .1), (W / 2 + .005, .15, .1 + H - .1)], .011, M['zinc'], parent=g)
    amigo(name + '_tag', (.26, -D / 2 - .012, .1 + H - .2), '-Y', parent=g)
    return g

def pallet(name, loc):
    g = empty(name, loc); W, D = 1.2, .8
    for x in (-.55, 0, .55):
        box('block', (.1, D, .078), (x, 0, .022 + .039 + .022), M['wood'], bevel=.003, parent=g)
    for y in (-.35, 0, .35):
        box('bot', (W, .1, .022), (0, y, .011), M['wood'], bevel=.002, parent=g)
    for i in range(7):
        y = -D / 2 + .06 + i * (D - .12) / 6
        box('deck', (W, .1 if i in (0, 6) else .085, .022), (0, y, .144 - .011), M['wood'], bevel=.002, parent=g)
    boxes_on(g, 0, 0, .145, 1.16, .76, seed=7, layers=3, wrap=True)
    amigo(name + '_tag', (.42, -D / 2 - .004, .08), '-Y', parent=g)
    return g

def forklift(name, loc):
    """A counterbalance forklift, forks pointing to -X (left of frame)."""
    g = empty(name, loc); P, Dk = M['fork_body'], M['fork_dark']
    box('chassis', (1.55, 1.05, .55), (.15, 0, .48), P, bevel=.05, parent=g, segs=5)
    box('cw', (.42, 1.08, .78), (.82, 0, .62), Dk, bevel=.12, parent=g, segs=6)
    box('cowl', (.5, .9, .32), (-.38, 0, .9), P, bevel=.06, parent=g, segs=5)
    box('seatbase', (.45, .6, .18), (.36, 0, .84), Dk, bevel=.04, parent=g)
    box('seat', (.42, .5, .1), (.36, 0, .98), Dk, bevel=.04, parent=g, segs=5)
    box('backrest', (.1, .5, .42), (.55, 0, 1.22), Dk, bevel=.04, parent=g, segs=5)
    cyl('column', .03, .45, (-.3, 0, 1.15), Dk, rot=(0, -.45, 0), parent=g)
    cyl('steer', .17, .03, (-.2, 0, 1.36), Dk, rot=(0, -.45 + math.pi / 2 - math.pi / 2, 0), parent=g)
    for sx, rr, wx in ((-1, .3, -.45), (1, .26, .62)):
        for sy in (-1, 1):
            cyl('tyre', rr, .24, (wx, sy * .44, rr), M['rubber'], rot=(math.pi / 2, 0, 0), parent=g, verts=48, bevel=.03)
            cyl('rim', rr * .58, .25, (wx, sy * .44, rr), mat('rim', (.75, .55, .05), rough=.4, coat=.3), rot=(math.pi / 2, 0, 0), parent=g, verts=32)
    # overhead guard
    for x in (-.5, .62):
        for sy in (-1, 1): tube('guardpost', [(x, sy * .46, .75), (x, sy * .46, 2.08)], .028, Dk, parent=g)
    for sy in (-1, 1): tube('guardrail', [(-.5, sy * .46, 2.08), (.62, sy * .46, 2.08)], .03, Dk, parent=g)
    for i in range(6): tube('slat', [(-.5 + i * .224, -.46, 2.08), (-.5 + i * .224, .46, 2.08)], .012, Dk, parent=g)
    # mast, carriage, forks
    for sy in (-1, 1):
        box('mast', (.08, .1, 2.2), (-.72, sy * .3, 1.12), M['steel'], bevel=.01, parent=g)
        box('mast2', (.06, .08, 2.1), (-.66, sy * .22, 1.08), Dk, bevel=.01, parent=g)
    box('carriage', (.06, .95, .45), (-.8, 0, .4), Dk, bevel=.01, parent=g)
    for sy in (-1, 1):
        box('fork', (1.1, .1, .045), (-1.36, sy * .26, .08), M['steel'], bevel=.008, parent=g)
        box('forkup', (.045, .1, .45), (-.83, sy * .26, .3), M['steel'], bevel=.008, parent=g)
    tube('hose', [(-.66, .12, .2), (-.66, .12, 1.9)], .012, Dk, parent=g)
    box('light', (.06, .16, .08), (.62, -.4, 2.13), Dk, bevel=.02, parent=g)
    box('beacon', (.05, .05, .05), (.62, -.4, 2.19), mat('beacon', (.95, .45, .05), rough=.2, emit=(1, .45, .05), emit_s=2), bevel=.01, parent=g)
    amigo(name + '_tag', (.2, -.47, 1.85), '-Y', parent=g)
    return g

def amr(name, loc):
    g = empty(name, loc); L, W = 1.1, .72
    box('shell', (L, W, .26), (0, 0, .17), M['amr'], bevel=.06, parent=g, segs=6)
    box('bumper', (L + .02, W + .02, .07), (0, 0, .075), M['amr_dark'], bevel=.03, parent=g, segs=4)
    box('top', (L - .2, W - .2, .02), (0, 0, .305), M['amr_dark'], bevel=.008, parent=g)
    box('lidarbox', (.1, .14, .06), (-L / 2 + .02, 0, .2), M['amr_dark'], bevel=.02, parent=g)
    box('ledstrip', (L - .3, .006, .012), (0, -W / 2 - .006, .2), M['led'], bevel=0, parent=g)
    amigo(name + '_tag', (.36, -W / 2 - .004, .19), '-Y', parent=g)
    return g

def person(name, loc, rotz=0., seed=0):
    """A worker: a real human proportion in dark workwear, a fitted hi-vis vest, helmet, boots, and a badge carrying an AmIGo."""
    import human
    ms = human.load(); g = empty(name, loc); g.rotation_euler.z = rotz
    body = bpy.data.objects.new(name + '_body', ms['body']); bpy.context.collection.objects.link(body); body.parent = g
    if not body.data.materials: body.data.materials.append(M['skin'])
    suit = bpy.data.objects.new(name + '_suit', ms['helper-tights']); bpy.context.collection.objects.link(suit); suit.parent = g
    if not suit.data.materials: suit.data.materials.append(mat('workwear', (.035, .045, .07), rough=.92, noise=.1, noise_scale=400, bump=.05))
    sm = suit.modifiers.new('thick', 'DISPLACE'); sm.strength = .008
    # the vest: the suit's torso, a little proud of it, with two reflective bands
    vest = bpy.data.objects.new(name + '_vest', ms['helper-tights'].copy()); bpy.context.collection.objects.link(vest); vest.parent = g
    vm = vest.data; import bmesh as _bm
    bm = _bm.new(); bm.from_mesh(vm)
    kill = [v for v in bm.verts if not (1.0 < v.co.z < 1.43 and abs(v.co.x) < .2)]
    _bm.ops.delete(bm, geom=kill, context='VERTS'); bm.to_mesh(vm); bm.free()
    vm.materials.clear(); vm.materials.append(vest_mat())
    d = vest.modifiers.new('off', 'DISPLACE'); d.strength = .022
    s = vest.modifiers.new('sol', 'SOLIDIFY'); s.thickness = .006
    # helmet and boots
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, .005, 1.585), segments=48, ring_count=24); hm = bpy.context.active_object
    hm.scale = (.118, .135, .1); hm.data.materials.append(M['helmet']); bpy.ops.object.shade_smooth(); hm.parent = g
    me = hm.data; bm = _bm.new(); bm.from_mesh(me); _bm.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -.05], context='VERTS'); bm.to_mesh(me); bm.free()
    box('brim', (.22, .08, .01), (0, -.135, 1.585), M['helmet'], bevel=.004, parent=g)
    for sx in (-1, 1):
        box('boot', (.12, .27, .11), (sx * .085, -.03, .055), M['rubber'], bevel=.035, parent=g, segs=4)
    # the badge on a lanyard, with its tag
    box('badge', (.07, .008, .1), (.06, -.135, 1.2), mat('badgecard', (.9, .9, .88), rough=.4), bevel=.004, parent=g)
    amigo(name + '_tag', (.06, -.145, 1.2), '-Y', parent=g)
    return g

def vest_mat():
    m = bpy.data.materials.get('hivis')
    if m: return m
    m = bpy.data.materials.new('hivis'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
    # two bands at chest and waist height
    def band(z0, z1):
        a = nt.nodes.new('ShaderNodeMath'); a.operation = 'GREATER_THAN'; a.inputs[1].default_value = z0; nt.links.new(sep.outputs['Z'], a.inputs[0])
        c = nt.nodes.new('ShaderNodeMath'); c.operation = 'LESS_THAN'; c.inputs[1].default_value = z1; nt.links.new(sep.outputs['Z'], c.inputs[0])
        mm = nt.nodes.new('ShaderNodeMath'); mm.operation = 'MULTIPLY'; nt.links.new(a.outputs[0], mm.inputs[0]); nt.links.new(c.outputs[0], mm.inputs[1]); return mm
    b1, b2 = band(1.08, 1.115), band(1.22, 1.255)
    add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'; nt.links.new(b1.outputs[0], add.inputs[0]); nt.links.new(b2.outputs[0], add.inputs[1])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.inputs['A'].default_value = (.78, .9, .05, 1); mix.inputs['B'].default_value = (.72, .73, .74, 1)
    nt.links.new(add.outputs[0], mix.inputs['Factor']); nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    rr = nt.nodes.new('ShaderNodeMapRange'); rr.inputs['To Min'].default_value = .7; rr.inputs['To Max'].default_value = .18; nt.links.new(add.outputs[0], rr.inputs['Value']); nt.links.new(rr.outputs['Result'], b.inputs['Roughness'])
    mt = nt.nodes.new('ShaderNodeMapRange'); mt.inputs['To Min'].default_value = 0; mt.inputs['To Max'].default_value = .85; nt.links.new(add.outputs[0], mt.inputs['Value']); nt.links.new(mt.outputs['Result'], b.inputs['Metallic'])
    return m
