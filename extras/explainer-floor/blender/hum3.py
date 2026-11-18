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

import plant as P
P.sc = bpy.context.scene; P.col = bpy.context.scene.collection
hat0 = P.b_hardhat(); ink = P.M()['ink']
made = []
for name, fn in (('search', pose_search), ('walk', pose_walk), ('stand', pose_stand)):
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
    for v in o.data.vertices: v.co -= Vector((cx, cy, zmin))
    o.data.materials.clear(); o.data.materials.append(ink)
    for p in o.data.polygons: p.use_smooth = True
    print(name, 'height', round(max(v.co.z for v in o.data.vertices), 3), 'verts', len(o.data.vertices)); made.append(o)
for o in list(bpy.data.objects):
    if o not in made: bpy.data.objects.remove(o)
bpy.data.libraries.write('/home/user/x3d/out/people.blend', set(made), fake_user=True)
# preview: black figures against a lit wall, four angles each
sc = bpy.context.scene
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0)); bpy.context.object.data.materials.append(P.mat('grey', (.5, .5, .5, 1), .6))
grey = P.mat('clay', (.35, .35, .36, 1), .6)
x = 0
for o in made:
    for k, ang in enumerate((0, 50, 90, 140)):
        c = bpy.data.objects.new(o.name + str(k), o.data); sc.collection.objects.link(c); c.location = (x, 0, 0); c.rotation_euler = (0, 0, math.radians(ang)); x += 1.25
        if k % 2: c.data = o.data.copy(); c.data.materials.clear(); c.data.materials.append(grey)
bpy.ops.object.light_add(type='AREA', location=(x / 2, -6, 5), rotation=(math.radians(55), 0, 0)); l = bpy.context.object; l.data.size = 10; l.data.energy = 4000
cam = bpy.data.objects.new('c', bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.type = 'ORTHO'; cam.data.ortho_scale = x + .6
cam.location = (x / 2 - .6, -12, 1.0); cam.rotation_euler = (math.radians(90), 0, 0)
sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.cycles.use_denoising = True
sc.render.resolution_x = 1800; sc.render.resolution_y = 320; sc.render.filepath = '/home/user/x3d/out/people_prev.png'; bpy.ops.render.render(write_still=True)
