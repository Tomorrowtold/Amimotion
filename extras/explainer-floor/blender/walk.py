# Pose the MakeHuman worker (CC0 body, worksuit and shoes) and save each pose as one mesh in out/people.blend.
import bpy, sys, math, os
from mathutils import Vector, Matrix, Quaternion
sys.path.insert(0, '/home/user/x3d')
bpy.ops.wm.open_mainfile(filepath='/home/user/x3d/out/human_base.blend')
rig = bpy.data.objects['Human.rig']; vl = bpy.context.view_layer
def reset():
    for pb in rig.pose.bones: pb.matrix_basis = Matrix()
    vl.update()
def aim(name, d):
    pb = rig.pose.bones[name]; cur = (pb.tail - pb.head).normalized(); q = cur.rotation_difference(Vector(d).normalized())
    h = pb.head.copy(); pb.matrix = Matrix.Translation(h) @ q.to_matrix().to_4x4() @ Matrix.Translation(-h) @ pb.matrix; vl.update()
def turn(name, deg, axis=(0, 0, 1)):
    pb = rig.pose.bones[name]; h = pb.head.copy(); q = Quaternion(Vector(axis), math.radians(deg))
    pb.matrix = Matrix.Translation(h) @ q.to_matrix().to_4x4() @ Matrix.Translation(-h) @ pb.matrix; vl.update()
def chain(names, d):
    for n in names: aim(n, d)
LEG = lambda s: ([f'upperleg01.{s}', f'upperleg02.{s}'], [f'lowerleg01.{s}', f'lowerleg02.{s}'])
ARM = lambda s: ([f'upperarm01.{s}', f'upperarm02.{s}'], [f'lowerarm01.{s}', f'lowerarm02.{s}'])

def pose_search():
    reset()
    turn('root', 3.5, (0, 1, 0))                                  # hips tilt: weight on the right leg
    u, l = LEG('R'); chain(u, (.07, .015, -1)); chain(l, (.0, .035, -1)); aim('foot.R', (-.12, -.95, -.3))
    u, l = LEG('L'); chain(u, (.13, -.2, -1)); chain(l, (.05, .16, -1)); aim('foot.L', (.3, -.9, -.32))
    turn('spine05', -3, (0, 1, 0)); turn('spine04', -3, (0, 1, 0)); turn('spine03', 3, (1, 0, 0)); turn('spine02', -2, (0, 1, 0))
    turn('spine03', 7); turn('spine02', 7); turn('neck01', 9); turn('head', 16); turn('head', -4, (1, 0, 0))
    u, l = ARM('R'); aim('clavicle.R', (-1, -.08, .3)); chain(u, (-.74, -.5, .22)); chain(l, (.78, -.12, .6)); aim('wrist.R', (.85, -.3, .12))
    u, l = ARM('L'); chain(u, (.16, .03, -1)); chain(l, (.1, -.2, -1)); aim('wrist.L', (.04, -.22, -1))
def pose_walk():
    reset()
    turn('root', -2, (1, 0, 0))
    u, l = LEG('R'); chain(u, (.03, -.36, -1)); chain(l, (.0, -.06, -1)); aim('foot.R', (-.08, -.96, -.1))
    u, l = LEG('L'); chain(u, (-.02, .2, -1)); chain(l, (.0, .62, -1)); aim('foot.L', (.05, -.35, -.9))
    turn('spine03', -5); turn('spine02', -4); turn('head', 4)
    u, l = ARM('L'); chain(u, (.14, -.3, -1)); chain(l, (.06, -.6, -1)); aim('wrist.L', (0, -.6, -1))
    u, l = ARM('R'); chain(u, (-.14, .28, -1)); chain(l, (-.1, .05, -1)); aim('wrist.R', (-.05, .0, -1))
def pose_stand():
    reset()
    turn('root', -3, (0, 1, 0))
    u, l = LEG('L'); chain(u, (-.06, .01, -1)); chain(l, (.0, .03, -1)); aim('foot.L', (.15, -.95, -.3))
    u, l = LEG('R'); chain(u, (-.12, -.12, -1)); chain(l, (-.04, .12, -1)); aim('foot.R', (-.3, -.9, -.3))
    turn('spine04', 3, (0, 1, 0)); turn('head', -12); turn('head', 6, (1, 0, 0))
    u, l = ARM('L'); chain(u, (.2, .1, -1)); chain(l, (-.25, -.5, -.6)); aim('wrist.L', (-.5, -.5, -.3))   # hand on hip-ish / holding a tablet
    u, l = ARM('R'); chain(u, (-.16, -.05, -1)); chain(l, (-.02, -.75, -.55)); aim('wrist.R', (.1, -.9, -.2))

def pose_look(sd):
    """Stopped, weight on one leg, head and shoulders turned to scan an aisle. sd = +1 left, -1 right."""
    pose_stand(); turn('head', 12)                         # undo the stand's glance down-left
    turn('spine03', 9 * sd); turn('spine04', 6 * sd); turn('neck01', 13 * sd); turn('head', 24 * sd); turn('head', -5, (1, 0, 0))
    u, l = ARM('L'); chain(u, (.16, .02, -1)); chain(l, (.12, -.15, -1)); aim('wrist.L', (.05, -.2, -1))
    u, l = ARM('R'); chain(u, (-.16, .02, -1)); chain(l, (-.12, -.15, -1)); aim('wrist.R', (-.05, -.2, -1))
def pose_hips():
    """Hands on hips, head dropped: the dead end."""
    pose_stand(); turn('head', 12); turn('head', 14, (1, 0, 0)); turn('neck01', 6, (1, 0, 0))
    u, l = ARM('L'); chain(u, (.45, .15, -.9)); chain(l, (-.5, -.35, -.25)); aim('wrist.L', (-.5, -.3, -.3))
    u, l = ARM('R'); chain(u, (-.45, .15, -.9)); chain(l, (.5, -.35, -.25)); aim('wrist.R', (.5, -.3, -.3))
def pose_tablet(nod):
    """At his station, a tablet held in both hands; nod tips the head down to read it."""
    pose_stand(); turn('head', 12); turn('head', 14 + nod * 14, (1, 0, 0))
    u, l = ARM('L'); chain(u, (.2, -.15, -1)); chain(l, (-.3, -.85, -.1)); aim('wrist.L', (-.4, -.8, .1))
    u, l = ARM('R'); chain(u, (-.2, -.15, -1)); chain(l, (.3, -.85, -.1)); aim('wrist.R', (.4, -.8, .1))
import math as _m
def pose_w(ph):
    """One frame of a plain walk. ph in 0..1; the right leg leads at ph = 0."""
    reset(); turn('root', -3, (1, 0, 0))
    for s, off in (('R', 0.), ('L', .5)):
        a = 2 * _m.pi * (ph + off)
        th = _m.radians(26) * _m.sin(a)                                   # thigh swing, + is forward (-Y)
        kn = _m.radians(8) + _m.radians(48) * max(0., _m.sin(a + _m.pi * .75)) ** 1.5   # the knee folds as the leg comes through
        sx = .05 if s == 'L' else -.05
        u, l = LEG(s); chain(u, (sx, -_m.sin(th), -_m.cos(th))); chain(l, (sx * .3, -_m.sin(th - kn), -_m.cos(th - kn)))
        ft = th - kn * .5; aim('foot.' + s, (sx * 2, -_m.cos(ft) * .95, -_m.sin(ft) * .95 - .25))
        ar = -_m.radians(20) * _m.sin(a); sx = .13 if s == 'L' else -.13
        u, l = ARM(s); chain(u, (sx, -_m.sin(ar), -_m.cos(ar))); chain(l, (sx * .6, -_m.sin(ar + .35), -_m.cos(ar + .35))); aim('wrist.' + s, (sx * .3, -_m.sin(ar + .4), -_m.cos(ar + .4)))
    tw = 4 * _m.sin(2 * _m.pi * ph); turn('spine03', tw); turn('spine02', tw * .6); turn('head', -tw)
import plant as P
P.sc = bpy.context.scene; P.col = bpy.context.scene.collection
hat0 = P.b_hardhat(); ink = P.M()['ink']
made = []
POSES = [('search', pose_search), ('stand', pose_stand), ('lookL', lambda: pose_look(1)), ('lookR', lambda: pose_look(-1)), ('hips', pose_hips), ('tab0', lambda: pose_tablet(0)), ('tab1', lambda: pose_tablet(1))] + [('w%d' % k, (lambda k=k: pose_w(k / 8.))) for k in range(8)]
rb = rig.matrix_world @ rig.pose.bones['root'].head; CXY = None
for name, fn in POSES:
    fn(); dg = bpy.context.evaluated_depsgraph_get(); parts = []
    for on in ('Human', 'Human.male_worksuit01', 'Human.shoes04'):
        ev = bpy.data.objects[on].evaluated_get(dg); me = bpy.data.meshes.new_from_object(ev); o = bpy.data.objects.new(name + '_' + on, me); o.matrix_world = bpy.data.objects[on].matrix_world.copy(); P.col.objects.link(o); parts.append(o)
    hb = rig.pose.bones['head']; hm = rig.matrix_world @ hb.matrix
    hat = bpy.data.objects.new(name + '_hat', hat0.data.copy()); P.col.objects.link(hat)
    # hat frame: x forward (character front = -Y), z up along the head bone
    up = (hm.to_3x3() @ Vector((0, 1, 0))).normalized(); fwd = (hm.to_3x3() @ Vector((0, 0, 1))).normalized()
    if fwd.y > 0: fwd = -fwd
    side = up.cross(fwd).normalized(); fwd = side.cross(up).normalized()
    top = max((parts[0].matrix_world @ v.co for v in parts[0].data.vertices), key=lambda v: v.dot(up))
    centre = hm.translation + up * ((top - hm.translation).dot(up) - .1) + fwd * .012
    hat.matrix_world = Matrix.Translation(centre) @ Matrix((fwd, side, up)).transposed().to_4x4()
    parts.append(hat)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts: o.select_set(True)
    vl.objects.active = parts[0]; bpy.ops.object.join(); o = bpy.context.object; o.name = 'worker_' + name
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    zmin = min(v.co.z for v in o.data.vertices); cx = sum(v.co.x for v in o.data.vertices) / len(o.data.vertices); cy = sum(v.co.y for v in o.data.vertices) / len(o.data.vertices)
    if name.startswith('w'):
        if name == 'w0': W0 = (cx, cy)
        cx, cy = W0
    for v in o.data.vertices: v.co -= Vector((cx, cy, zmin))
    o.data.materials.clear(); o.data.materials.append(ink)
    for p in o.data.polygons: p.use_smooth = True
    print(name, 'height', round(max(v.co.z for v in o.data.vertices), 3), 'verts', len(o.data.vertices)); made.append(o)
for o in list(bpy.data.objects):
    if o not in made: bpy.data.objects.remove(o)
bpy.data.libraries.write('/home/user/x3d/out/people.blend', set(made), fake_user=True)

print('saved', [o.name for o in made])
