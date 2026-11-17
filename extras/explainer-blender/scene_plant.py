# Scene 3, "Two plants": one plant bay seen from above at an angle. Both sides of the split use this same floor.
# Layout (metres, x right, y away from camera): press bottom-left, two pallet-rack rows mid, Line 2 conveyor right,
# stores top-left, dock doors on the back wall. The trolley's stop is behind the far rack.
import sys, math, random
sys.path.insert(0, __import__('os').path.dirname(__file__))
from kit import *
import models as MD

STOP = (8.6, 14.2)          # trolley stop, behind rack row 2
def rack_row(name, x0, x1, y, depth=1.1, levels=3, seed=0):
    random.seed(seed); g = empty(name, (0, 0, 0)); orange = mat('beam', (.75, .22, .03), rough=.45)
    blue = mat('upright', (.05, .14, .4), rough=.5)
    bays = int(round((x1 - x0) / 2.7))
    for i in range(bays + 1):
        x = x0 + i * 2.7
        for dy in (-depth / 2, depth / 2): box('up', (.09, .07, 4.2), (x, y + dy, 2.1), blue, bevel=.005, parent=g)
    for i in range(bays):
        xc = x0 + (i + .5) * 2.7
        for L in range(levels + 1):
            z = .12 + L * 1.35
            for dy in (-depth / 2, depth / 2): box('beam', (2.62, .05, .11), (xc, y + dy, z + .9 if L else .9), orange, bevel=.004, parent=g)
        for L in range(levels):
            z = (.9 if L == 0 else .9 + L * 1.35) + .06
            if L == 0: z = .02
            for k in (-.8, .5):
                if random.random() < .82:
                    p = MD.pallet('p', (xc + k * 1.05 / 1.3, y, z)); p.rotation_euler.z = math.pi / 2 if random.random() < .0 else 0; p.parent = g
    return g

def press(name, loc):
    g = empty(name, loc); body = mat('press', (.32, .34, .36), rough=.5, metal=.3); dark = M['amr_dark']
    box('base', (3.2, 2.4, .6), (0, 0, .3), dark, parent=g)
    for sx in (-1, 1): box('col', (.55, 1.9, 3.6), (sx * 1.2, 0, 2.2), body, bevel=.02, parent=g)
    box('crown', (3.3, 2.2, 1.0), (0, 0, 4.3), body, bevel=.03, parent=g)
    box('ram', (1.8, 1.6, .5), (0, 0, 2.6), dark, parent=g)
    box('bolster', (1.9, 1.7, .25), (0, 0, .73), M['zinc'], parent=g)
    box('guard', (.04, 2.6, 1.8), (-2.0, 0, .9), mat('fence', (.85, .7, .05), rough=.5), bevel=0, parent=g)
    return g

def line2(name, x, y0, y1):
    g = empty(name, (0, 0, 0)); belt = mat('belt', (.04, .04, .045), rough=.7); frame = M['zinc']
    L = y1 - y0
    box('belt', (.8, L, .06), (x, (y0 + y1) / 2, .82), belt, parent=g)
    for s in (-1, 1): box('rail', (.06, L, .14), (x + s * .43, (y0 + y1) / 2, .82), frame, parent=g)
    for i in range(int(L // 1.5) + 1):
        for s in (-1, 1): box('leg', (.05, .05, .8), (x + s * .4, y0 + i * 1.5, .4), frame, parent=g)
    for i, yy in enumerate((y0 + 1.5, y0 + 4.5, y0 + 7.5)):
        box('bench', (1.2, 1.4, .9), (x + 1.4, yy, .45), mat('bench', (.2, .3, .35), rough=.5), parent=g)
        box('board', (.9, .03, .6), (x + 1.4, yy + .7, 1.5), mat('board', (.9, .9, .88), rough=.5), parent=g)
        MD.totes('lt%d' % i, (x - .9, yy, 0)).parent = g
        MD.person('op%d' % i, (x + .75, yy - .2, 0), rotz=math.pi / 2 + .2, seed=i + 4).parent = g
    for k in range(6): box('part', (.5, .4, .25), (x, y0 + .8 + k * 1.7, .98), M['cardboard'], parent=g)
    return g

def shelving(name, x, y, n=3):
    g = empty(name, (0, 0, 0)); st = mat('shelf', (.55, .57, .6), rough=.5, metal=.4)
    for i in range(n):
        xx = x + i * 1.3
        for sx in (-1, 1):
            for sy in (-1, 1): box('post', (.04, .04, 2.2), (xx + sx * .6, y + sy * .3, 1.1), st, parent=g)
        for z in (.1, .6, 1.1, 1.6, 2.1):
            box('lvl', (1.24, .62, .02), (xx, y, z), st, parent=g)
            for k in range(3): box('bin', (.34, .5, .25), (xx - .4 + k * .4, y, z + .14), M['tote'], bevel=.01, parent=g)
    return g

def floor_line(x0, y0, x1, y1, m, w=.1):
    L = math.hypot(x1 - x0, y1 - y0); o = box('line', (L, w, .004), ((x0 + x1) / 2, (y0 + y1) / 2, .002), m, bevel=0)
    o.rotation_euler.z = math.atan2(y1 - y0, x1 - x0); return o

def build(w=1600, h=1600, samples=64, trolley=True):
    clear(); mats()
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples
    sc.cycles.use_denoising = True; sc.render.resolution_x = w; sc.render.resolution_y = h
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 4
    world = bpy.data.worlds.new('w'); world.use_nodes = True; world.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .01, .012, 1); sc.world = world
    box('floor', (22, 22, .02), (10, 10, -.01), mat('floor', (.11, .115, .12), rough=.35, noise=.6, noise_scale=3, bump=.02), bevel=0)
    wallm = mat('wall', (.07, .075, .08), rough=.8)
    box('backwall', (22, .3, 6), (10, 20.6, 3), wallm, bevel=0)
    box('leftwall', (.3, 22, 6), (-.9, 10, 3), wallm, bevel=0)
    for dx in (12.5, 16.5):   # dock doors
        box('door', (3, .05, 3.6), (dx, 20.43, 1.8), mat('door', (.45, .47, .5), rough=.4, metal=.5), bevel=0)
        box('bump', (2.6, .25, .3), (dx, 20.3, .5), M['rubber'], bevel=.01)
    yel = mat('paint', (.85, .62, .03), rough=.6); wht = mat('paintw', (.8, .8, .78), rough=.6)
    for x0, y0, x1, y1 in [(1.0, 2.0, 1.0, 19.5), (3.4, 7.2, 3.4, 15.8), (5.0, 8.4, 15.2, 8.4), (5.0, 15.6, 15.2, 15.6), (15.2, 2.0, 15.2, 19.0)]:
        floor_line(x0, y0, x1, y1, yel)
    for i in range(6): floor_line(11 + i * .6, 18.6, 11.3 + i * .6, 19.6, wht, .3)   # dock hatching
    # cells
    press('press', (3.2, 3.6, 0))
    MD.tool_chest('tools', (5.6, 2.6, 0))
    rack_row('rackA', 5.2, 14.0, 10.4, seed=1)
    rack_row('rackB', 5.2, 14.0, 12.9, seed=2)
    line2('line2', 17.0, 3.0, 14.0)
    shelving('stores', 1.6, 18.6)
    MD.forklift('forklift', (12.6, 17.0, 0)).rotation_euler.z = -math.pi / 2
    MD.amr('amr', (9.6, 6.9, 0)).rotation_euler.z = .1
    for k, (px, py) in enumerate([(12.0, 18.0), (13.4, 18.0), (16.0, 18.2)]):
        MD.pallet('dockp%d' % k, (px, py, 0))
    if trolley:
        t = MD.trolley('trolley', (STOP[0], STOP[1], 0)); t.rotation_euler.z = math.pi
    MD.person('sup', (15.9, 6.2, 0), rotz=math.pi * .75, seed=9)
    MD.person('walker', (2.3, 13.0, 0), rotz=-.3, seed=11)
    # high-bay light: a grid of soft panels, plus a cool sky fill
    for i in range(4):
        for j in range(4):
            bpy.ops.object.light_add(type='AREA', location=(2.5 + i * 5, 2.5 + j * 5, 9)); l = bpy.context.active_object
            l.data.energy = 520; l.data.size = 2.2; l.data.color = (1, .96, .9)
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 20)); s = bpy.context.active_object; s.data.energy = .6; s.data.color = (.8, .87, 1)
    s.rotation_euler = (math.radians(30), math.radians(-15), 0)
    # camera: high, from the front, 52 degrees down, sees the whole bay
    bpy.ops.object.camera_add(location=(9.6, -3.2, 21.5)); cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(31), 0, 0); cam.data.lens = 31; sc.camera = cam
    return sc

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = a[0] if a else '/tmp/plant.png'
    w, h, s = (int(x) for x in a[1:4]) if len(a) >= 4 else (800, 800, 24)
    sc = build(w, h, s, trolley=(len(a) < 5 or a[4] != 'empty')); sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
