"""Round 11 hall helpers on the one model hall (03-hero-film/build_hall.py, Sky Ground palette). Runs under the
bpy python; build_hall.py is imported, never edited, so the hall is the film's hall to the millimetre.

    /tmp/bpyenv/bin/python hall_r11.py info  --cam C --res WxH                      # project zones to pixels
    /tmp/bpyenv/bin/python hall_r11.py masks --cam C --res WxH --out DIR             # R4 zone masks (PNG alpha)
    /tmp/bpyenv/bin/python hall_r11.py trail --cam C --res WxH --crop x0,y0,x1,y1 --key t3 --out f.json  # R5 path
    /tmp/bpyenv/bin/python hall_r11.py ids   --cam C --res WxH [--ortho S] --out f.png   # R12 object-id pass

Masks: every surface of the hall renders black (it occludes), the zone's own things and a floor patch over the
zone render white; flat emission, no light, so the mask is exactly the zone as the camera sees it, with racks and
machines in front of it cutting it as they do in the still. Zones are the hall's own floor areas
(build_hall.py constants) with a 0.35 m margin."""
import sys, os, math, json
HERE = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.abspath(os.path.join(HERE, '../../03-hero-film'))
A = sys.argv[1:]
mode = A[0]
def opt(k, d=None): return A[A.index(k) + 1] if k in A else d
W, H = (int(v) for v in opt('--res', '1920x1080').split('x'))
# build_hall reads its own flags from sys.argv at import: give it the still's flags
extra = ['--palette', os.path.join(FILM, 'sky/palette.json'), '--state', opt('--state', 'after'), '--cam', opt('--cam')]
if opt('--ortho'): extra += ['--ortho', opt('--ortho')]
for k in ('--trails', '--amber', '--hide'):
    if opt(k): extra += [k, opt(k)]
sys.argv = [sys.argv[0]] + extra
sys.path.insert(0, FILM)
import build_hall as BH
import bpy, bmesh
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

M = 0.35
ZONES = {   # name: (floor rect x0, x1, y0, y1 in hall metres, object name prefixes that belong to it)
    'inspection-queue': ((BH.QUEUE[0] - M, BH.QUEUE[1] + M, BH.QUEUE[2] - M, BH.QUEUE[3] + M), ('q1', 'q2', 'q3', 'zone_queue')),
    'staging-lane': ((BH.STAGING[0] - M, BH.STAGING[1] + M, BH.STAGING[2] - M, BH.STAGING[3] + M), ('pallet', 'zone_staging')),
    'press-line': ((-5.7 - M, -2.7 + M, BH.PRESSES[0][1] - 1.2 - M, BH.PRESSES[1][1] + 2.3 + M), ('press',)),
    'racks': ((BH.RACKS[0][0] - 0.6 - M, BH.RACKS[1][0] + 0.6 + M, BH.RACKS[0][1] - M, BH.RACKS[0][2] + M), ('rack',)),
}

rig = BH.build('CYCLES', W, H, 16)
t = float(opt('--t', 0.0))
BH.pose(rig, t, opt('--state', 'after'))
sc = bpy.context.scene; cam = sc.camera; bpy.context.view_layer.update()
sc.render.resolution_x, sc.render.resolution_y = W, H


def px(p):
    v = world_to_camera_view(sc, cam, Vector(p)); return (v.x * W, (1 - v.y) * H)


def rect_px(r, z=0.0):
    pts = [px((x, y, z)) for x in (r[0], r[1]) for y in (r[2], r[3])]
    return [round(min(p[0] for p in pts)), round(min(p[1] for p in pts)), round(max(p[0] for p in pts)), round(max(p[1] for p in pts))]


def owned(o, prefixes):
    n = o.name
    while o.parent is not None: o = o.parent
    return any(n.startswith(p) or o.name == p or o.name.startswith(p) for p in prefixes)


def emit_mat(name, v):
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; N.clear()
    e = N.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (v, v, v, 1); e.inputs['Strength'].default_value = 1
    o = N.new('ShaderNodeOutputMaterial'); m.node_tree.links.new(e.outputs[0], o.inputs[0]); return m


def flat_setup():
    sc.cycles.samples = int(opt('--samples', 16)); sc.cycles.use_denoising = False; sc.cycles.use_adaptive_sampling = False
    sc.cycles.max_bounces = 0; sc.view_settings.view_transform = 'Standard'
    sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.0
    for o in list(bpy.data.objects):
        if o.type == 'LIGHT': bpy.data.objects.remove(o)


def assign(o, m):
    if o.type != 'MESH': return
    o.data.materials.clear(); o.data.materials.append(m)


if mode == 'info':
    out = {z: rect_px(r) for z, (r, _) in ZONES.items()}
    out['t3_stop'] = [round(v) for v in px((*BH.P['t3'].at(BH.M['t3'].s(9.0)), 0))]
    out['presses'] = [[round(v) for v in px((x, y, 0))] for x, y in BH.PRESSES]
    out['inspect'] = [round(v) for v in px((*BH.INSPECT['c'], 0))]
    out['queue_slots'] = [[round(v) for v in px((x, y, 0))] for x, y in BH.QUEUE_SLOTS]
    out['pallet'] = [round(v) for v in px((*BH.PALLET_AT, 0))]
    out['anchors'] = [[round(v) for v in px((x, y - 0.22, 4.2))] for x, y in BH.ANCHOR_COLS]
    print(json.dumps(out))

elif mode == 'masks':
    flat_setup(); black, white = emit_mat('k', 0.0), emit_mat('w', 1.0)
    outdir = opt('--out'); os.makedirs(outdir, exist_ok=True)
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    for zname, (r, prefixes) in ZONES.items():
        for o in meshes: assign(o, black)
        for o in meshes:
            if owned(o, prefixes): assign(o, white)
        bm = bmesh.new()
        vs = [bm.verts.new((x, y, 0.006)) for x, y in ((r[0], r[2]), (r[1], r[2]), (r[1], r[3]), (r[0], r[3]))]
        bm.faces.new(vs); me = bpy.data.meshes.new('patch'); bm.to_mesh(me); bm.free()
        patch = bpy.data.objects.new('patch', me); sc.collection.objects.link(patch); patch.data.materials.append(white)
        sc.render.filepath = os.path.join(outdir, zname + '_raw.png'); bpy.ops.render.render(write_still=True)
        bpy.data.objects.remove(patch)
        print('MASK', zname, flush=True)

elif mode == 'trail':
    key = opt('--key', 't3'); x0, y0, x1, y1 = (float(v) for v in opt('--crop').split(','))
    tau = 9.0; s = BH.M[key].s(tau)
    seg = BH.P[key].segment(s - BH.TRAIL_L, s)
    pts = [px((x, y, 0.004)) for x, y in seg]
    pts = [((p[0] - x0), (p[1] - y0)) for p in pts]
    # the ribbon's width in pixels at its two ends (perspective)
    def wpx(pt):
        a = px((pt[0] - BH.MARK_W / 2, pt[1], 0)); b = px((pt[0] + BH.MARK_W / 2, pt[1], 0))
        c = px((pt[0], pt[1] - BH.MARK_W / 2, 0)); d = px((pt[0], pt[1] + BH.MARK_W / 2, 0))
        return max(math.dist(a, b), math.dist(c, d))
    json.dump(dict(points=pts, width_start=wpx(seg[0]), width_end=wpx(seg[-1]), crop=[x0, y0, x1, y1], res=[W, H]),
              open(opt('--out'), 'w'))
    print('TRAIL', len(pts), 'points')

elif mode == 'ids':
    # one flat grey per object (by hashed name), so the line drawing can take edges where objects or faces meet
    flat_setup(); import random
    for o in [o for o in bpy.data.objects if o.type == 'MESH']:
        top = o
        while top.parent is not None: top = top.parent
        v = random.Random(top.name + o.name).random() * 0.9 + 0.05
        if o.name == 'floor': v = 0.0
        if o.name == 'ink': v = 0.0
        assign(o, emit_mat('id_' + o.name, v))
    sc.render.filepath = os.path.abspath(opt('--out')); bpy.ops.render.render(write_still=True)
    # second pass: height (z / 6 m) as flat emission, so steps on one object (press bed to crown) draw a line too
    hm = bpy.data.materials.new('height'); hm.use_nodes = True; N = hm.node_tree.nodes; N.clear()
    g = N.new('ShaderNodeNewGeometry'); sp = N.new('ShaderNodeSeparateXYZ'); mu = N.new('ShaderNodeMath')
    mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = 1 / 6.0
    e = N.new('ShaderNodeEmission'); o = N.new('ShaderNodeOutputMaterial'); Lk = hm.node_tree.links.new
    Lk(g.outputs['Position'], sp.inputs[0]); Lk(sp.outputs['Z'], mu.inputs[0]); Lk(mu.outputs[0], e.inputs['Color']); Lk(e.outputs[0], o.inputs[0])
    for ob in [o_ for o_ in bpy.data.objects if o_.type == 'MESH']: assign(ob, hm)
    sc.render.image_settings.color_depth = '16'
    sc.render.filepath = os.path.abspath(opt('--out')).replace('.png', '_z.png'); bpy.ops.render.render(write_still=True)
