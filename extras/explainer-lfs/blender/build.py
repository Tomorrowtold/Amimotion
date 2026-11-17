# Build the whole plant once and save it. usage: python build.py out/plant.blend
import sys, math, os, time, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, plant as P
rad = math.radians; OUT = sys.argv[-1]; t0 = time.time()
P.reset(); R = P.R

def pal(x, y, k, tag=True):
    r = R.uniform(-.05, .05) + R.choice([0, 0, math.pi / 2])
    if k == 'b': P.stack_boxes(x, y, R.choice([2, 3, 3, 4]), r)
    elif k == 'c': P.stack_crates(x, y, R.choice([2, 3, 4]), r)
    elif k == 'w': P.wrapped(x, y, R.uniform(.9, 1.6), r)
    else: P.place('cage', (x, y, 0), r, builder=P.b_cage)
    P.THINGS.append(['pallet', x, y])

def cross(x): return 112. < x < 117.          # the cross aisle the AMR is about to enter

def buffers():
    # south of the main aisle: the trolley buffer where the story's trolley belongs
    for i in range(13):
        x = 91.5 + i * 1.75 + R.uniform(-.15, .15)
        for j, y in enumerate((43.9, 42.6, 41.2)):
            if R.random() < .22: continue
            P.trolley(x, y + R.uniform(-.12, .12), rad(90) + R.uniform(-.14, .14), R.choice([0, 1, 1, 2]), tag=False)
    for x, y, k in [(116, 43.6, 'c'), (118, 43.5, 'b'), (120.2, 43.7, 'w'), (122.4, 43.5, 'g'), (124.5, 43.6, 'b'), (127, 43.6, 'c'), (129.3, 43.4, 'w'), (131.5, 43.7, 'g'),
                    (117, 41.6, 'w'), (119.4, 41.5, 'c'), (121.8, 41.7, 'b'), (124.2, 41.4, 'w'), (126.6, 41.6, 'g'), (129, 41.5, 'b')]:
        pal(x, y, k)
    # north of the aisle: pallets waiting for the lines
    for i in range(16):
        x = 96 + i * 2.6 + R.uniform(-.2, .2)
        for y in (52.4, 54.1):
            if R.random() < .3 or cross(x): continue
            pal(x, y + R.uniform(-.1, .1), R.choice('bcg') if x < 112 else R.choice('bcwgw'))
    # deep hall: staging lanes all the way to the far doors
    for i in range(34):
        x = 140 + i * 2.7
        for y in (43.5, 41.6, 39.7, 52.5, 54.4, 56.3):
            if R.random() < .38: continue
            pal(x + R.uniform(-.2, .2), y, R.choice('bcwwg'))
    # dispatch lanes inside the near docks
    for d in (18., 33., 63., 78.):
        for i in range(7):
            for y in (d - 3.4, d + 3.4):
                if R.random() < .35: continue
                pal(63.6 + i * 1.55 + R.uniform(-.1, .1), y + R.uniform(-.1, .1), R.choice('wwbwc'))
    # trolleys coming off the lines, in twos and threes
    for x, y in [(80, 53.2), (81.3, 53.4), (84.5, 41.5), (79.5, 42.3), (86, 55.2), (135, 46.2), (104, 57.8), (105.4, 57.6), (123, 58.4), (96.5, 37.2), (97.9, 37.4), (108.5, 37.3), (74.5, 44.2), (75.9, 44.0), (72, 52.3)]:
        P.trolley(x, y, R.uniform(0, 6.3), R.choice([1, 1, 2]), tag=False)

def lines():
    for y0, s in ((33., 1), (24., 1), (63., -1), (72., -1)):
        for i in range(18):
            x = 78 + i * 5.2
            if s < 0 and cross(x): continue
            P.place('metal_office_desk', (x, y0, 0), R.uniform(-.03, .03))
            if i % 2 == 0: P.place('tool_cart', (x + 1.9, y0 + s * 1.1, 0), rad(90) + R.uniform(-.2, .2))
            if i % 3 == 0: P.place('drill_press_01', (x - .5, y0 + .1, .79), rad(180))
            if i % 4 == 1: P.place('steel_frame_shelves_03', (x + 2.4, y0 - s * 1.6, 0), 0)
            if i % 5 == 2: P.place('metal_tool_chest', (x + .6, y0 - s * .2, .79), 0)
            if i % 3 == 1: P.place('plastic_container', (x - 1.6, y0 + s * 1.2, 0), R.uniform(0, 3))

P.hall(); buffers(); lines(); P.fixtures()
# anchors: the real AmIMo, 6 m up on every column
for x in P.COLS_X:
    for y in P.COLS_Y: P.amimo((x + (.4 if x == P.X0 else 0) + .16, y, 6.0), 0)
# things that never move in the story
P.forklift(151, 49.3, rad(190)); P.forklift(203, 46.8, rad(8)); P.forklift(176, 30, rad(90)); P.forklift(143, 68, rad(0))
P.amr(134, 49.8, rad(180)); P.amr(160, 62, rad(90)); P.amr(98, 20.5, rad(0)); P.amr(189, 36, rad(180))
P.truck(P.X0, 33.); P.truck(P.X0, 63.); P.truck(P.X0, 78.)
P.place('hand_truck', (95.2, 44.7, 0), rad(200)); P.place('WetFloorSign_01', (108, 51.2, 0), .4)
P.haze(.0024, .62)
json.dump(P.THINGS, open(OUT.replace('.blend', '.things.json'), 'w'))
bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(OUT)); print('BUILD_SECONDS', round(time.time() - t0, 1), len(P.THINGS))
