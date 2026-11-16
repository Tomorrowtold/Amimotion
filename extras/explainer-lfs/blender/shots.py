# Key frames for the explainer. usage: python shots.py <shot> <out.png> <w> <h> <spp> [extra]
import sys, math, os, time; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, plant as P
from mathutils import Vector
rad = math.radians
a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
SHOT, OUT, W, H, SPP = a[0], a[1], int(a[2]), int(a[3]), int(a[4])
P.reset(); sc = P.sc; R = P.R

def camera(loc, tgt, lens, focus=None, fstop=4.):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = loc; cam.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens; cam.data.clip_end = 600
    if H > W: cam.data.sensor_fit = 'VERTICAL'
    if focus: cam.data.dof.use_dof = True; cam.data.dof.focus_distance = (Vector(focus) - Vector(loc)).length; cam.data.dof.aperture_fstop = fstop
    return cam

def buffers():
    """WIP buffers both sides of the main aisle, dense near the camera zone, thinning into the hall."""
    # right of the aisle (y < 45): the trolley buffer where the story's trolley stands
    for i in range(13):
        x = 91.5 + i * 1.75 + R.uniform(-.15, .15)
        for j, y in enumerate((43.9, 42.6, 41.2)):
            if R.random() < .22: continue
            P.trolley(x, y + R.uniform(-.12, .12), rad(90) + R.uniform(-.14, .14), R.choice([0, 1, 1, 2]), tag=False)
    for x, y, k in [(116, 43.6, 'c'), (118, 43.5, 'b'), (120.2, 43.7, 'w'), (122.4, 43.5, 'g'), (124.5, 43.6, 'b'), (127, 43.6, 'c'), (129.3, 43.4, 'w'), (131.5, 43.7, 'g'),
                    (117, 41.6, 'w'), (119.4, 41.5, 'c'), (121.8, 41.7, 'b'), (124.2, 41.4, 'w'), (126.6, 41.6, 'g'), (129, 41.5, 'b')]:
        pal(x, y, k)
    # left of the aisle (y > 51): pallets waiting for the line, lower and sparser so that side of the frame stays quiet
    for i in range(16):
        x = 96 + i * 2.6 + R.uniform(-.2, .2)
        for y in (52.4, 54.1):
            if R.random() < .3: continue
            pal(x, y + R.uniform(-.1, .1), R.choice('bcg') if x < 112 else R.choice('bcwgw'))
    # deep hall: staging lanes all the way to the docks
    for i in range(34):
        x = 140 + i * 2.7
        for y in (43.5, 41.6, 39.7, 52.5, 54.4, 56.3):
            if R.random() < .38: continue
            pal(x + R.uniform(-.2, .2), y, R.choice('bcwwg'))

def pal(x, y, k):
    r = R.uniform(-.05, .05) + R.choice([0, 0, math.pi / 2])
    if k == 'b': P.stack_boxes(x, y, R.choice([2, 3, 3, 4]), r)
    elif k == 'c': P.stack_crates(x, y, R.choice([2, 3, 4]), r)
    elif k == 'w': P.wrapped(x, y, R.uniform(.9, 1.6), r)
    else: P.place('cage', (x, y, 0), r, builder=P.b_cage)

def lines():
    """Assembly lines either side: benches, tool carts, presses, racks, seen dim and deep."""
    for y0, s in ((33., 1), (24., 1), (63., -1), (72., -1)):
        for i in range(18):
            x = 78 + i * 5.2
            P.place('metal_office_desk', (x, y0, 0), R.uniform(-.03, .03))
            if i % 2 == 0: P.place('tool_cart', (x + 1.9, y0 + s * 1.1, 0), rad(90) + R.uniform(-.2, .2))
            if i % 3 == 0: P.place('drill_press_01', (x - .5, y0 + .1, .79), rad(180))
            if i % 4 == 1: P.place('steel_frame_shelves_03', (x + 2.4, y0 - s * 1.6, 0), 0)
            if i % 5 == 2: P.place('metal_tool_chest', (x + .6, y0 - s * .2, .79), 0)
            if i % 3 == 1: P.place('plastic_container', (x - 1.6, y0 + s * 1.2, 0), R.uniform(0, 3))

if SHOT == 'lost_eye':
    doors = P.hall(); buffers(); lines()
    # the story's trolley: parked just inside the aisle line, apart from the rest, the real AmIGo on its handle post
    P.trolley(88.5, 46.45, rad(64), 2, tag=True)
    P.forklift(151, 49.3, rad(190)); P.forklift(203, 46.8, rad(8)); P.amr(134, 49.8, rad(180))
    P.place('hand_truck', (95.2, 44.7, 0), rad(200)); P.place('WetFloorSign_01', (108, 51.2, 0), .4)
    P.lighting(off={(102, 42), (78, 54), (90, 54), (102, 54)}, dim={(78, 42): .9, (90, 42): .55})
    P.yard(doors); P.haze(float(os.environ.get('HAZE', '.0024')), .62)
    PEOPLE = [((93.0, 48.0), rad(-57), 'search'), ((126, 47.6), rad(12), 'walk'), ((171, 50.2), rad(170), 'stand')]
    import people; people.add(PEOPLE)
    camera((83.6, 49.4, 1.56), (113.4, 45.6, 2.5), 32, focus=(93.0, 48.0, 1.4), fstop=5.6)

c = sc.cycles; sc.render.engine = 'CYCLES'; c.device = 'CPU'; c.samples = SPP; c.use_adaptive_sampling = True; c.adaptive_threshold = .03
c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'; c.max_bounces = 6; c.diffuse_bounces = 3; c.glossy_bounces = 3; c.volume_bounces = 1; c.transmission_bounces = 2
c.volume_step_rate = 4.0; c.volume_max_steps = 128; c.use_light_tree = True; c.sample_clamp_indirect = 6.; c.caustics_reflective = False; c.caustics_refractive = False
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.resolution_percentage = 100; sc.render.threads_mode = 'AUTO'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Base Contrast'; sc.view_settings.exposure = float(os.environ.get('EXPO', '0'))
sc.render.filepath = OUT; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_depth = '16'
t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS', round(time.time() - t0, 1))
if os.environ.get('SAVE'): bpy.ops.wm.save_as_mainfile(filepath=OUT.replace('.png', '.blend'))
