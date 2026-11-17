# Render one view of the plant as light layers. usage: python shot.py <A|B|C|D> <out.exr> W H SPP
import sys, math, os, time, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, plant as P
from mathutils import Vector
rad = math.radians
SHOT, OUT, W, H, SPP = sys.argv[1], os.path.abspath(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
TALL = H > W
P.reopen(os.path.join(P.HERE, 'out/plant.blend')); sc = P.sc; R = P.R

def camera(loc, tgt, lens, focus=None, fstop=4., shift=(0, 0)):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = loc; cam.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens; cam.data.clip_end = 600
    cam.data.sensor_fit = 'HORIZONTAL'; cam.data.shift_x, cam.data.shift_y = shift
    if focus: cam.data.dof.use_dof = True; cam.data.dof.focus_distance = (Vector(focus) - Vector(loc)).length; cam.data.dof.aperture_fstop = fstop
    return cam

# ---- the story, the same in every view
HERO = (88.5, 46.45); HROT = rad(-50)
WORKER = (93.0, 48.0); FREE = (100.0, 28.5); AMR = (114.5, 57.6); QUEUE = [(119.2, 67.6), (122.9, 67.7), (126.6, 67.5)]; DOCK = (61.8, 33.0); PALLET = (86.5, 58.2)
P.trolley(*HERO, HROT, 2, tag=True)
P.forklift(*FREE, rad(0)); P.amr(*AMR, rad(90))
for q in QUEUE: P.forklift(*q, rad(180) + R.uniform(-.04, .04))
P.wrapped(*PALLET, 1.35, rad(8)); P.THINGS.append(['pallet', *PALLET])
import people
people.add([(WORKER, rad(-57), 'search'), ((126, 47.6), rad(12), 'walk'), ((171, 50.2), rad(170), 'stand'), ((68.5, 30.4), rad(200), 'stand'), ((109, 69), rad(-80), 'walk')])
c, s = math.cos(HROT), math.sin(HROT)
TAG = (HERO[0] + (-.567) * c - (-.31) * s, HERO[1] + (-.567) * s + (-.31) * c, .86)
tagn = Vector((-c, -s, 0))                                   # the way the tag faces
ANCH = [(108.16, 36., 6.0), (132.16, 36., 6.0), (132.16, 60., 6.0)]

# ---- light, every kind on its own layer
off = {(102, 42), (78, 54), (90, 54), (102, 54)}; dim = {(78, 42): .9, (90, 42): .55}
P.lighting(off=off, dim=dim, g='lamps')
P.yard(P.HALL[0], 1, g='lamps')
for (x, y, e) in [(WORKER[0] - 1.6, WORKER[1] - .4, 1.), (FREE[0], FREE[1], .8), (AMR[0], AMR[1] - .6, .8), (DOCK[0] + .6, DOCK[1], .9)]: P.spot(x, y, 9.2, 9000 * e, 64, 'isl', .7)
P.spot(54, 33, 9.5, 9000, 80, 'isl', .7)
P.spot(HERO[0], HERO[1], 9.2, 7000, 30, 'cone', .35, .1)
bpy.ops.object.light_add(type='AREA', location=(142, 48, 13.7)); a = bpy.context.object; a.data.shape = 'RECTANGLE'; a.data.size = 160; a.data.size_y = 1.4; a.data.energy = 30000; a.data.spread = rad(70); P.group(a, 'slot')
P.yard(P.X0, -1, open_=(0, 1, 3, 4), energy=9000, g='slot')
waited = [FREE] + QUEUE + [PALLET]
if SHOT == 'B':
    for k, x, y in P.THINGS:
        if x > 172 or (x, y) == HERO: continue
        if (x, y) in waited: P.spot(x, y, 6.5, 26000, 40, 'amber', .6, .15, vol=False)
        else: P.spot(x, y, 6.0, 18000 if k != 'pallet' else 12000, 36, 'pools', .7, .15, vol=False)
for i, (x, y, z) in enumerate(ANCH):
    bpy.ops.object.light_add(type='POINT', location=(x + .22, y, z)); l = bpy.context.object; l.data.energy = 260; l.data.shadow_soft_size = .03; P.group(l, 'anc')
led = Vector(TAG) + tagn * .0236 + Vector((0, 0, .019))
bpy.ops.mesh.primitive_uv_sphere_add(radius=.0013, location=led, segments=12, ring_count=6); lo = bpy.context.object
lo.data.materials.append(P.mat('led', (0, 0, 0, 1), .3, emit=(1, 1, 1, 1), strength=500)); lo.lightgroup = 'led'; P.group(lo, 'led')

if SHOT == 'D':                      # a soft raking key so the pressed wordmark reads
    kp = Vector(TAG) + tagn * .45 + Vector((s * .5, -c * .5, .38))
    bpy.ops.object.light_add(type='AREA', location=kp); k = bpy.context.object; k.data.size = .3; k.data.energy = 7
    k.rotation_euler = (Vector(TAG) - kp).to_track_quat('-Z', 'Y').to_euler(); P.group(k, 'cone')

# ---- the four views
if SHOT == 'A':
    cam = camera((83.6, 49.4, 1.56), (113.4, 45.0, 2.5), 32 if not TALL else 22, focus=(93.0, 48.0, 1.4), fstop=5.6) if not TALL else camera((85.2, 49.0, 1.56), (113.4, 46.6, 3.6), 21, focus=(93.0, 48.0, 1.4), fstop=5.6)
elif SHOT == 'B':
    P.cutaway()
    for o in bpy.data.objects:   # from above, the unlit tops of the lamp shades read as dirt on the floor: the camera looks through them
        if o.name.startswith('glow') or (o.parent and o.parent.name.startswith('lamp')): o.visible_camera = False
    cam = camera((70, -24, 50), (91, 46.5, 0), 34) if not TALL else camera((152, 49, 58), (92, 47.5, 0), 20)
elif SHOT == 'C':
    cam = camera((85.12, 47.68, 1.38), (108, 47.2, 1.9), 20 if not TALL else 12)
elif SHOT == 'D':
    p = Vector(TAG) + tagn * .30 + Vector((-s * .17, c * .17, .09))
    cam = camera(p, Vector(TAG) + tagn * .01, 58 if not TALL else 42, focus=Vector(TAG) + tagn * .02, fstop=5.6)
if TALL: cam.data.sensor_fit = 'VERTICAL'
# keep the subject clear of the words: left third on wide screens, bottom third on tall ones
SHIFT = {('D', False): (-.17, 0), ('D', True): (0, -.13), ('C', True): (0, -.2), ('A', True): (0, -.08), ('B', True): (0, -.11)}
cam.data.shift_x, cam.data.shift_y = SHIFT.get((SHOT, TALL), (0, 0))

c = sc.cycles; sc.render.engine = 'CYCLES'; c.device = 'CPU'; c.samples = SPP; c.use_adaptive_sampling = True; c.adaptive_threshold = .02
c.use_denoising = False; c.max_bounces = 6; c.diffuse_bounces = 3; c.glossy_bounces = 3; c.volume_bounces = 1; c.transmission_bounces = 2
c.volume_step_rate = 4.0; c.volume_max_steps = 128; c.use_light_tree = True; c.sample_clamp_indirect = 6.; c.caustics_reflective = False; c.caustics_refractive = False
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.resolution_percentage = 100
vl = bpy.context.view_layer; vl.cycles.denoising_store_passes = True; vl.use_pass_z = True
sc.render.image_settings.media_type = 'MULTI_LAYER_IMAGE'; sc.render.image_settings.file_format = 'OPEN_EXR_MULTILAYER'; sc.render.image_settings.color_depth = '16'; sc.render.filepath = OUT
t0 = time.time()
if not os.environ.get('ZONLY'): bpy.ops.render.render(write_still=True)
# a second, tiny render for geometry only: no haze, no lens blur, so the depth of every pixel is exact
hz = bpy.data.objects.get('haze'); hz.hide_render = True; cam.data.dof.use_dof = False
c.samples = 4; c.use_adaptive_sampling = False; c.max_bounces = 0; vl.cycles.denoising_store_passes = False
sc.render.filepath = OUT.replace('.exr', '_z.exr'); bpy.ops.render.render(write_still=True)
bpy.context.view_layer.update()
mw = cam.matrix_world; fr = cam.data.view_frame(scene=sc)
def proj(p):
    from bpy_extras.object_utils import world_to_camera_view as w2c
    v = w2c(sc, cam, Vector(p)); return [round(v.x, 5), round(1 - v.y, 5), round(v.z, 3)]
pts = dict(tag=TAG, hero=(*HERO, .6), worker=(*WORKER, 1.5), free=(*FREE, 1.6), amr=(*AMR, .9), queue=(QUEUE[1][0], QUEUE[1][1], 1.6), dock=(DOCK[0] - 1.5, DOCK[1], 1.2), dockfloor=(DOCK[0], DOCK[1], 0), pallet=(*PALLET, 1.2), led=tuple(led),
           workerfloor=(*WORKER, 0), freefloor=(*FREE, 0), palletfloor=(*PALLET, 0), herofloor=(*HERO, 0), a0=ANCH[0], a1=ANCH[1], a2=ANCH[2])
meta = dict(shot=SHOT, w=W, h=H, shift=[cam.data.shift_x, cam.data.shift_y], lens=cam.data.lens, sensor=36, fit=cam.data.sensor_fit, pos=list(mw.translation), mat=[list(r) for r in mw], pts={k: proj(v) for k, v in pts.items()}, world={k: list(v) for k, v in pts.items()},
            counts={k: sum(1 for t in P.THINGS if t[0] == k) for k in ('trolley', 'pallet', 'forklift', 'amr')}, seconds=round(time.time() - t0, 1))
json.dump(meta, open(OUT.replace('.exr', '.json'), 'w')); print('RENDER_SECONDS', meta['seconds'])
