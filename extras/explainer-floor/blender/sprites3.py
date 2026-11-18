# The supervisor's still poses (sprites3), from sprites2. The moving things, each alone on a shadow-catching floor, seen from the bay's own camera direction and in its light.
# usage: python sprites.py outdir [test]
import sys, math, os, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, plant as P, people
from mathutils import Vector
rad = math.radians
OUT = os.path.abspath(sys.argv[-2] if sys.argv[-1] == 'test' else sys.argv[-1]); TEST = sys.argv[-1] == 'test'; os.makedirs(OUT, exist_ok=True)
P.reset(); sc = P.sc
P.worn('amrshell', (.022, .032, .1, 1), (.28, .5), 0., 5); P.worn('body', (.013, .147, 1., 1), (.25, .5), 0., 4); P.worn('powder', (.022, .032, .1, 1), (.3, .6), .2, 7)
mm = P.M()
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
clay = P.mat('clay', (.86, .885, .93, 1), .55)
def kids(o):
    out = [o]
    for c in o.children: out += kids(c)
    return out
PN = ['stand', 'lookL', 'lookR', 'hips', 'search', 'tab0', 'tab1']
# ---- the walker: 8 frames, 4 headings (east, north, west, south)
with bpy.data.libraries.load('/home/user/x3d/out/people.blend') as (src, dst): dst.objects = [n for n in src.objects if n.startswith('worker_')]
LIB = {o.name: o for o in dst.objects}
meta['pose'] = dict(size=2.6, anchor=frame(2.6, .78, .45), n=4, names=PN)
for h in (range(4) if not TEST else [3]):
    for f, pn in enumerate(PN):
        if os.path.exists(f'{OUT}/pose_{h}_{f}.png'): continue
        o = bpy.data.objects.new('person', LIB['worker_' + pn].data); sc.collection.objects.link(o); o.rotation_euler = (0, 0, h * math.pi / 2 + math.pi / 2); shot(f'pose_{h}_{f}'); o.hide_render = True
json.dump(meta, open(f'{OUT}/sprites.json', 'w'))
