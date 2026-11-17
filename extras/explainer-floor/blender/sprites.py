# The moving things, each alone on a shadow-catching floor, seen from the bay's own camera direction and in its light.
# usage: python sprites.py outdir [test]
import sys, math, os, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, plant as P, people
from mathutils import Vector
rad = math.radians
OUT = os.path.abspath(sys.argv[-2] if sys.argv[-1] == 'test' else sys.argv[-1]); TEST = sys.argv[-1] == 'test'; os.makedirs(OUT, exist_ok=True)
P.reset(); sc = P.sc; mm = P.M()
AZ, EL = rad(124), rad(36); CELL = 384
fl = P.box('catch', (40, 40, .2), (0, 0, -.1), P.mat('catch', (.55, .6, .68, 1), .5), 0); fl.is_shadow_catcher = True
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (.86, .91, 1.0, 1); bg.inputs['Strength'].default_value = .85
bpy.ops.object.light_add(type='SUN'); sun = bpy.context.object; sun.data.energy = 5.6; sun.data.angle = rad(6); sun.data.color = (1, .97, .92); sun.rotation_euler = (rad(54), 0, rad(-38))
d = Vector((math.cos(EL) * math.cos(AZ), math.cos(EL) * math.sin(AZ), -math.sin(EL)))
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.type = 'ORTHO'; cam.data.clip_end = 400
sc.render.engine = 'CYCLES'; sc.cycles.samples = 64; sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6; sc.cycles.diffuse_bounces = 3; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = .02
sc.render.resolution_x = sc.render.resolution_y = CELL; sc.render.film_transparent = True
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'None'; sc.view_settings.exposure = .1
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
from bpy_extras.object_utils import world_to_camera_view as w2c
meta = {}
rt = d.cross(Vector((0, 0, 1))).normalized()
def frame(size, zc, off=0.):
    cam.data.ortho_scale = size; cam.location = Vector((0, 0, zc)) + rt * off - d * 120; bpy.context.view_layer.update()
    v = w2c(sc, cam, Vector((0, 0, 0))); return [round(v.x, 5), round(1 - v.y, 5)]
def shot(name):
    sc.render.filepath = f'{OUT}/{name}.png'; bpy.ops.render.render(write_still=True)
clay = P.mat('clay', (.78, .81, .87, 1), .55)
def kids(o):
    out = [o]
    for c in o.children: out += kids(c)
    return out
# ---- the AMR, carrying a rack
master = bpy.data.objects.new('master', None); P.link(master)
before = set(bpy.data.objects); P.amr(0, 0, 0, True)
roots = [o for o in bpy.data.objects if o not in before and o.parent is None and not o.hide_render]
for o in roots: o.parent = master
meshes = [o for r in roots for o in kids(r) if o.type == 'MESH']
meta['amr'] = dict(size=3.4, anchor=frame(3.4, .75, .5), n=16)
for st in ('col', 'clay'):
    if st == 'clay':
        for o in meshes:
            for i in range(len(o.material_slots)): o.material_slots[i].link = 'OBJECT'; o.material_slots[i].material = clay
    for k in range(16):
        master.rotation_euler = (0, 0, k * math.pi / 8)
        if not os.path.exists(f'{OUT}/amr_{st}_{k:02d}.png'): shot(f'amr_{st}_{k:02d}')
        if TEST: break
for o in meshes: o.hide_render = True
# ---- the walker: 8 frames, 4 headings (east, north, west, south)
with bpy.data.libraries.load('/home/user/x3d/out/people.blend') as (src, dst): dst.objects = [n for n in src.objects if n.startswith('worker_')]
LIB = {o.name: o for o in dst.objects}
meta['walk'] = dict(size=2.6, anchor=frame(2.6, .78, .45), n=4, f=8, stride=1.58)
for h in range(4):
    for f in range(8):
        o = bpy.data.objects.new('person', LIB['worker_w%d' % f].data); sc.collection.objects.link(o); o.rotation_euler = (0, 0, h * math.pi / 2 + math.pi / 2); shot(f'walk_{h}_{f}'); o.hide_render = True
        if TEST: break
    if TEST: break
json.dump(meta, open(f'{OUT}/sprites.json', 'w'))
