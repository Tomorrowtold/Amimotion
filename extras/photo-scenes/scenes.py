import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
NAME = argv[0]; Q = argv[1] if len(argv) > 1 else 'preview'
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)


def plant(seed=3, depth=40, warm=False, lights_s=2.2, walls=True):
    """A working floor around the origin: aisle along +Y, cells and racking either side, high bays."""
    R.seed(seed)
    floor()
    # walkway lines either side of the main aisle (x = -1.6 .. 1.6)
    for x in (-1.7, 1.7): stripe(x, -4, x, depth, w=0.09)
    # columns down the aisle
    for y in range(6, depth, 9):
        for x in (-5.0, 5.0): column((x, y))
    # racking on the right
    # machine cells on the left: enclosures with windows and a control cabinet
    enc = mat('enc', srgb('#d9dcdf'), rough=0.45, coat=0.2); noisy(enc, scale=3, amount=0.12, rough_lo=0.35, rough_hi=0.6)
    dark = mat('encd', srgb('#2b2e33'), rough=0.4)
    glass = mat('glass', (0.05, 0.07, 0.08), rough=0.05, spec=0.8)
    acc = mat('acc', srgb('#1f4e9c'), rough=0.4, coat=0.2)
    for k, y in enumerate(range(5, depth, 7)):
        x = -4.2
        box('cell', (2.6, 3.4, 2.4), (x - 1.3, y, 1.2), enc, 0.03)
        box('cellwin', (0.02, 1.4, 0.8), (x + 0.005, y - 0.4, 1.5), glass)
        box('cellroof', (2.4, 3.2, 0.25), (x - 1.3, y, 2.52), dark, 0.02)
        box('cellstripe', (0.02, 3.4, 0.08), (x + 0.006, y, 2.25), acc)
        box('cab', (0.6, 0.5, 1.9), (x - 0.4, y + 2.1, 0.95), enc, 0.01)
    for k, y0 in enumerate([10 + 2.8 * i for i in range(int((depth - 12) / 2.8))]):
        rack_bay(5.6, y0, length=2.7, depth=1.1)
    # high bays: two rows over the aisle
    for y in range(0, depth + 6, 6):
        for x in (-3.0, 3.0): high_bay(x, y, 8.6, lights_s, warm)
    # roof: dark, so it reads as a hall and not a sky
    rm = mat('roof', srgb('#1a1c1f'), rough=0.8)
    box('roof', (60, 120, 0.2), (0, depth / 2, 9.4), rm)
    for y in range(-4, depth + 8, 4): box('truss', (40, 0.12, 0.5), (0, y, 9.0), mat('tr', srgb('#3a3d42'), rough=0.6, metal=0.4))
    # far walls so the view ends in a plant, not a void
    wm = mat('wall', srgb('#b9bcbf'), rough=0.7); noisy(wm, scale=0.8, amount=0.2)
    box('farwall', (40, 0.3, 9.4), (0, depth + 6, 4.7), wm)
    for x in (-7.5, 9.5) if walls else (): box('sidewall', (0.3, depth + 20, 9.4), (x, depth / 2, 4.7), wm)


def s_tag(q):
    """AmIGo on the top rail of a loaded trolley. The floor behind runs on, out of focus."""
    reset(); world('workshop.exr', 0.45, rot=1.2)
    plant(seed=4, depth=48)
    trolley((0, 0, 0), rot=math.radians(0), paint='#5b6167', crate='#2c5688', tag=True, tag_x=-0.1)
    # a second and third trolley down the aisle, blurred
    trolley((0.4, 7.5, 0), rot=math.radians(84), paint='#5b6167', crate='#2c5688', tag=True)
    trolley((-0.6, 15, 0), rot=math.radians(95), paint='#6b4a2f', crate='#3f6f3a', tag=True)
    # soft key from the left like a window, cool fill
    area((-2.2, -1.6, 2.6), (-0.3, -0.2, 0.9), size=2.5, energy=160, color=(1.0, 0.93, 0.84))
    area((1.8, -1.8, 1.6), (0, 0, 0.9), size=3, energy=40, color=(0.8, 0.88, 1.0))
    # tag on the top shelf, front-left: (-0.3, -0.19, 0.907)
    tagp = (-0.1, -0.19, 0.92)
    cam = (-0.66, -1.02, 1.36)
    camera(cam, (0.1, -0.02, 0.9), lens=60, f=2.0, focus=(Vector(tagp) - Vector(cam)).length)
    out(q)


def s_waits(q):
    """Three loaded trolleys parked in a marked queue beside inspection, late warm light, nobody near."""
    reset(); world('workshop.exr', 0.3, rot=2.4, tint=(1.0, 0.92, 0.82))
    plant(seed=9, depth=40, warm=True, lights_s=1.6, walls=False)
    # the queue box on the floor
    for (a, b, c, d) in [(-1.3, -0.6, 1.3, -0.6), (-1.3, 3.0, 1.3, 3.0), (-1.3, -0.6, -1.3, 3.0), (1.3, -0.6, 1.3, 3.0)]:
        stripe(a, b, c, d, w=0.07)
    for i, y in enumerate((0.1, 1.15, 2.2)):
        trolley((0.05 * (i - 1), y, 0), rot=math.radians(R.uniform(-4, 4)), paint='#5b6167', crate='#2c5688', tag=True, tag_x=0.3, w=1.0, d=0.6)
    # inspection table
    tm = mat('table', srgb('#8c9196'), rough=0.3, metal=0.9); brushed(tm)
    box('table', (1.6, 0.9, 0.05), (2.6, 1.0, 0.9), tm, 0.004)
    for sx in (-1, 1):
        for sy in (-1, 1): box('tleg', (0.04, 0.04, 0.88), (2.6 + sx * 0.75, 1.0 + sy * 0.4, 0.44), tm)
    # low late sun through a high window: long warm shadows across the queue
    sun(Euler((math.radians(72), 0, math.radians(-128))), strength=2.2, color=(1.0, 0.84, 0.66), angle=1.5)
    area((-3, -4, 3), (0, 1, 0.6), size=5, energy=320, color=(0.8, 0.87, 1.0))
    camera((-2.4, -3.4, 1.35), (0.25, 1.1, 0.5), lens=42, f=4.0)
    out(q)


def s_anchor(q):
    """AmIMo on a steel column, 6 m up, seen from the aisle below; roof lights out of focus behind."""
    reset(); world('warehouse.exr', 0.7, rot=0.6)
    plant(seed=5, depth=40, lights_s=14)
    column((0, 0), h=9.2, paint='#7d858c')
    # bracket plate + anchor on the aisle-facing flange (flange at y=-0.19)
    pl = mat('bracket', srgb('#8e949a'), rough=0.35, metal=0.9)
    box('plate', (0.12, 0.006, 0.16), (0, -0.203, 6.2), pl, 0.002)
    amimo((0, -0.222, 6.15), rot=(0, 0, 0))
    # PoE cable running up the column
    cm = mat('cable', srgb('#1b1c1e'), rough=0.5)
    box('cable', (0.007, 0.007, 2.6), (0.13, -0.196, 7.5), cm)
    area((-2.5, -3.5, 4.5), (0, -0.2, 6.2), size=3, energy=70, color=(1.0, 0.95, 0.88))
    acam = (-1.5, -2.5, 5.7)
    camera(acam, (0.0, -0.24, 6.12), lens=62, f=2.0, focus=(Vector((0, -0.24, 6.15)) - Vector(acam)).length)
    bpy.data.objects['cam'].data.shift_x = -0.24
    bpy.data.objects['cam'].data.shift_y = -0.1
    out(q)


def s_aisle(q):
    """A racked warehouse aisle with pallets; a tagged tote trolley in the near foreground."""
    reset(); world('warehouse.exr', 0.45, rot=0.0)
    R.seed(11); floor(base='#77797b', gloss=0.22)
    for x in (-1.5, 1.5): stripe(x, -3, x, 50, w=0.09)
    # racks: rows run along Y, so build each bay rotated by placing along y
    for side in (-1, 1):
        for k in range(15):
            y0 = -1 + k * 2.85
            objs = rack_bay(0, 0, length=2.75, depth=1.1)
            g = group('bay', objs, loc=(side * 2.3, y0, 0), rot=(0, 0, math.pi / 2))
    for y in range(0, 52, 5): high_bay(0, y, 8.2, 2.4)
    rm = mat('roof', srgb('#1a1c1f'), rough=0.8); box('roof', (30, 120, 0.2), (0, 40, 9.2), rm)
    wm = mat('wall', srgb('#b9bcbf'), rough=0.7); box('farwall', (30, 0.3, 9.2), (0, 45, 4.6), wm)
    trolley((0.55, 1.2, 0), rot=math.radians(90), paint='#5b6167', crate='#2c5688', tag=True, tag_x=-0.2)
    trolley((-0.4, 16, 0), rot=math.radians(90), paint='#5b6167', crate='#2c5688', tag=True)
    area((-1.2, -2.0, 2.2), (0.5, 1.2, 0.9), size=2, energy=150, color=(1, 0.95, 0.88))
    camera((-0.55, -1.9, 1.35), (0.15, 6.0, 1.1), lens=35, f=2.8, focus=3.4)
    out(q)


def s_floor(q):
    """The whole floor from a mezzanine: cells, aisle, trolleys at work; the plant reads as one place."""
    reset(); world('workshop.exr', 0.4, rot=1.0)
    plant(seed=6, depth=56, lights_s=9)
    for i, (x, y) in enumerate([(0.2, 4), (-0.5, 9), (0.6, 13.5), (-0.3, 21), (0.4, 27), (-0.6, 33), (0.3, 40)]):
        trolley((x, y, 0), rot=math.radians(90 + R.uniform(-6, 6)), paint='#5b6167', crate='#2c5688', tag=True)
    camera((3.6, -6.5, 5.4), (-0.6, 14, 0.4), lens=32, f=5.6)
    out(q)


def forklift(loc, rot=0.0, body='#d9a21b'):
    """Counterbalance forklift, forks toward -Y in group space, with an AmIGo in a cradle on the overhead guard."""
    bm = mat('fk', srgb(body), rough=0.42, coat=0.25); noisy(bm, scale=6, amount=0.15, rough_lo=0.35, rough_hi=0.6, bump=0.03)
    dk = mat('fkd', srgb('#222427'), rough=0.5); st = mat('fks', srgb('#3a3d41'), rough=0.35, metal=0.85); brushed(st)
    ty = mat('tyre', srgb('#151516'), rough=0.8)
    o = []
    o.append(box('chassis', (1.1, 2.0, 0.55), (0, 0.3, 0.55), bm, 0.06))
    o.append(box('cw', (1.12, 0.5, 0.75), (0, 1.15, 0.72), dk, 0.08))
    o.append(box('hood', (1.0, 0.9, 0.18), (0, 0.75, 0.92), bm, 0.05))
    o.append(box('seat', (0.5, 0.45, 0.12), (0, 0.65, 1.08), dk, 0.04)); o.append(box('seatb', (0.5, 0.1, 0.5), (0, 0.9, 1.3), dk, 0.04))
    o.append(box('dash', (0.7, 0.25, 0.35), (0, -0.35, 1.0), dk, 0.04))
    o.append(cyl('wheel', 0.08, 0.22, (0, -0.2, 1.25), dk, rot=(math.radians(60), 0, 0)))
    for sx in (-1, 1):
        for y, r in ((-0.45, 0.33), (1.0, 0.28)):
            o.append(cyl('tyre', r, 0.26, (sx * 0.5, y, r), ty, rot=(0, math.pi / 2, 0), verts=40, bevel=0.03))
            o.append(cyl('rim', r * 0.55, 0.27, (sx * 0.5, y, r), st, rot=(0, math.pi / 2, 0), verts=32))
        # mast uprights and the overhead guard posts
        o.append(box('mast', (0.09, 0.14, 2.3), (sx * 0.36, -0.95, 1.2), dk, 0.01))
        for y in (-0.55, 0.95): o.append(box('post', (0.06, 0.06, 1.25), (sx * 0.48, y, 1.6), dk, 0.01))
        o.append(box('fork', (0.12, 1.1, 0.045), (sx * 0.25, -1.6, 0.09), st, 0.004))
        o.append(box('forkup', (0.12, 0.05, 0.6), (sx * 0.25, -1.06, 0.38), st, 0.004))
    o.append(box('carriage', (0.85, 0.06, 0.45), (0, -1.08, 0.55), dk, 0.01))
    for y in (-0.55, 0.95): o.append(box('guardx', (1.02, 0.06, 0.06), (0, y, 2.22), dk, 0.01))
    for sx in (-1, 1): o.append(box('guardy', (0.06, 1.56, 0.06), (sx * 0.48, 0.2, 2.22), dk, 0.01))
    for k in range(6): o.append(box('slat', (0.96, 0.03, 0.02), (0, -0.4 + k * 0.25, 2.24), dk))
    cr = box('cradle', (0.1, 0.13, 0.012), (0.22, -0.48, 2.256), dk, 0.003); o.append(cr)
    t = amigo((0.22, -0.48, 2.262), rot=(0, 0, math.pi / 2))
    o.append(t)
    return group('forklift', o, loc=loc, rot=(0, 0, rot))


def s_fork(q):
    """A forklift in a racked aisle, its tag in a cradle on the overhead guard."""
    reset(); world('warehouse.exr', 0.45, rot=0.4)
    R.seed(12); floor(base='#77797b', gloss=0.3)
    for x in (-1.6, 1.6): stripe(x, -6, x, 50, w=0.09)
    for side in (-1, 1):
        for k in range(16):
            group('bay', rack_bay(0, 0, length=2.75, depth=1.1), loc=(side * 2.45, -6 + k * 2.85, 0), rot=(0, 0, math.pi / 2))
    for y in range(-6, 52, 5): high_bay(0, y, 8.2, 2.6)
    rm = mat('roof', srgb('#1a1c1f'), rough=0.8); box('roof', (30, 120, 0.2), (0, 40, 9.2), rm)
    wm = mat('wall', srgb('#b9bcbf'), rough=0.7); box('farwall', (30, 0.3, 9.2), (0, 45, 4.6), wm)
    forklift((0.15, 2.2, 0), rot=math.radians(200))
    area((-1.4, -0.5, 4.2), (0.1, 2.2, 1.8), size=2.5, energy=420, color=(0.92, 0.96, 1.0))
    area((1.4, -1.5, 1.6), (0.1, 2.2, 1.2), size=2, energy=120, color=(1, 0.93, 0.85))
    tg = Vector((-0.22, 2.58, 2.27)); cam = (-0.95, 1.75, 2.62)
    camera(cam, (tg.x + 0.12, tg.y + 0.25, tg.z - 0.04), lens=70, f=2.2, focus=(tg - Vector(cam)).length)
    out(q)


def amr(loc, rot=0.0):
    """A low towing AMR with a lidar puck, hitched to a parts trolley; drives toward -Y in group space."""
    sh = mat('amr', srgb('#2f3237'), rough=0.38, coat=0.3); noisy(sh, scale=8, amount=0.1, rough_lo=0.3, rough_hi=0.5)
    lt = mat('amrl', srgb('#d6d8da'), rough=0.4)
    o = [box('amrbody', (0.62, 0.95, 0.26), (0, 0, 0.17), sh, 0.04), box('amrband', (0.63, 0.96, 0.03), (0, 0, 0.12), lt, 0.01),
         cyl('lidar', 0.05, 0.07, (0, -0.36, 0.335), mat('lid', srgb('#111214'), rough=0.2, spec=0.8), verts=32),
         box('hitch', (0.06, 0.6, 0.04), (0, 0.75, 0.2), mat('hit', srgb('#8a9096'), rough=0.3, metal=0.9))]
    for sx in (-1, 1):
        for y in (-0.35, 0.35): o.append(cyl('caster', 0.04, 0.05, (sx * 0.24, y, 0.04), mat('cst', srgb('#111111'), rough=0.7), rot=(0, math.pi / 2, 0)))
    return group('amr', o, loc=loc, rot=(0, 0, rot))


def s_amr(q):
    """An AMR towing a tagged trolley along a yellow lane, a workbench beside it, night shift light."""
    reset(); world('workshop.exr', 0.35, rot=2.0)
    plant(seed=21, depth=44, lights_s=7)
    amr((0.2, 0.0, 0), rot=math.radians(-90))
    trolley((1.35, 0.0, 0), rot=math.radians(90), paint='#5b6167', crate='#2c5688', tag=True, tag_x=0.25)
    tm = mat('bench', srgb('#8c9196'), rough=0.3, metal=0.9); brushed(tm)
    box('benchtop', (2.0, 0.75, 0.05), (0.6, 1.55, 0.9), mat('bt', srgb('#4a4e53'), rough=0.6), 0.004)
    for sx in (-1, 1):
        for sy in (-1, 1): box('bleg', (0.05, 0.05, 0.88), (0.6 + sx * 0.92, 1.55 + sy * 0.32, 0.44), tm)
    box('vice', (0.18, 0.14, 0.12), (0.1, 1.5, 0.985), mat('vc', srgb('#2b4f8f'), rough=0.4), 0.01)
    area((-1.5, 2.6, 2.6), (0.6, 0.6, 0.6), size=2, energy=180, color=(1, 0.82, 0.6))
    area((-2.0, -2.5, 2.2), (0.6, 0, 0.4), size=3, energy=160, color=(0.72, 0.82, 1.0))
    cam = (-1.6, -2.3, 0.95)
    camera(cam, (0.7, 0.2, 0.42), lens=40, f=2.8, focus=(Vector((0.3, 0, 0.3)) - Vector(cam)).length)
    out(q)


def s_bench(q):
    """AmIGo tags and AmIMo anchors laid out on a lab bench beside a laptop, a shadow board behind."""
    reset(); world('workshop.exr', 0.5, rot=0.8)
    floor(base='#5f6163', gloss=0.35)
    top = mat('lab', srgb('#cfd1d3'), rough=0.55); noisy(top, scale=6, amount=0.08)
    box('labtop', (1.8, 0.8, 0.04), (0, 0, 0.9), top, 0.003)
    board = mat('board', srgb('#2d3034'), rough=0.7); box('shadow', (1.8, 0.03, 1.0), (0, 0.42, 1.45), board)
    outl = mat('outl', srgb('#e6e7e8'), rough=0.6); st = mat('tool', srgb('#9aa0a6'), rough=0.3, metal=0.9); brushed(st)
    for k, (x, h) in enumerate([(-0.6, 0.42), (-0.4, 0.34), (-0.22, 0.5), (0.35, 0.3), (0.55, 0.38)]):
        box('ol', (0.06, 0.004, h + 0.04), (x, 0.402, 1.45), outl); box('tl', (0.035, 0.02, h), (x, 0.39, 1.45), st, 0.004)
    # laptop, half open
    lp = mat('lap', srgb('#2a2c30'), rough=0.35, metal=0.6)
    box('lapbase', (0.34, 0.24, 0.015), (0.48, -0.02, 0.928), lp, 0.004)
    scr = mat('scr', (0.02, 0.025, 0.035), rough=0.1, spec=0.7, emit=(0.08, 0.12, 0.2), emit_s=1.2)
    box('lapscr', (0.34, 0.012, 0.22), (0.48, 0.1, 1.04), scr, 0.003, rot=(math.radians(-14), 0, 0))
    # a row of tags, one turned over, and two anchors standing
    for k, (x, y, r) in enumerate([(-0.55, -0.12, 0.1), (-0.4, -0.05, -0.2), (-0.25, -0.15, 0.35), (-0.1, -0.06, 0.0)]):
        amigo((x, y, 0.92), rot=(0, 0, r))
    amimo((0.12, 0.12, 0.92), rot=(0, 0, math.radians(-18))); amimo((0.24, 0.16, 0.92), rot=(0, 0, math.radians(12)))
    gc = mat('case', srgb('#151618'), rough=0.6); box('gauge', (0.3, 0.2, 0.06), (-0.62, 0.22, 0.95), gc, 0.01)
    amigo((-0.62, 0.22, 0.981), rot=(0, 0, 0.05))
    area((-1.2, -1.0, 2.0), (0, 0, 0.9), size=1.6, energy=110, color=(1, 0.96, 0.9))
    area((1.4, -0.6, 1.4), (0, 0, 0.9), size=2, energy=40, color=(0.85, 0.9, 1.0))
    cam = (-0.42, -0.72, 1.1)
    camera(cam, (-0.1, 0.12, 0.95), lens=60, f=2.8, focus=(Vector((-0.25, -0.1, 0.93)) - Vector(cam)).length)
    out(q)


def out(q):
    w, h, s = (720, 405, 24) if q == 'preview' else (1600, 900, 72)
    render(os.path.join(OUT, f'{NAME}-{q}.png'), w, h, s)


{'tag': s_tag, 'waits': s_waits, 'anchor': s_anchor, 'aisle': s_aisle, 'floor': s_floor, 'fork': s_fork, 'amr': s_amr, 'bench': s_bench}[NAME](Q)
