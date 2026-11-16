# The vast hall: one 240 x 96 m plant under a single roof, lit the way James Turrell lights a room.
# Light comes from apertures (a long slot down the main aisle, square sky oculi) and from hidden coves,
# so the space itself reads as a field of colour. Props are reused from plant.py.
#   x: 0..240 along the hall (racks west, assembly middle, dispatch east), y: 0..96 across, z up. Roof at 14 m.
# Usage: python3 hall.py -- OUT W H SAMPLES MOOD SHOT     MOOD: dusk | pulse | lit     SHOT: low | high | top
import sys, os, math, random, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
_src = open(os.path.join(HERE, 'plant.py')).read().split("if __name__ == '__main__':")[0]
P = {'__name__': 'plantlib', '__file__': os.path.join(HERE, 'plant.py')}; exec(_src, P)
import bpy
from mathutils import Vector
box, cyl, mat, M, inst, src = P['box'], P['cyl'], P['mat'], P['M'], P['inst'], P['src']

L, Wd, H = 240.0, 96.0, 14.0
SLOT_Y, SLOT_W = 48.0, 3.2
MIRROR = False
OCULI = [(x, 48.0) for x in (36, 84, 132, 180, 222)]
COLS_X = [24 * k for k in range(1, 10)]
COLS_Y = [24.0, 72.0]

def emit_mat(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (*col, 1); e.inputs['Strength'].default_value = s
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m

MOODS = {
    #        aperture sky colour, strength     cove colour, strength       far-wall field             tag glow
    'dusk':  dict(sky=((.18, .2, .62), 9),   cove=((.10, .16, .55), 6),   field=((.32, .12, .55), 900),  tag=0.0,  work=0),
    'pulse': dict(sky=((.10, .12, .42), 5),  cove=((.06, .1, .38), 4),    field=((.22, .08, .42), 600),  tag=40.0, work=0),
    'lit':   dict(sky=((.92, .9, .86), 28),  cove=((.75, .85, 1.0), 10),  field=((.95, .62, .38), 1400), tag=25.0, work=1),
}

def shell(mood='lit'):
    md = MOODS['lit']
    # floor: the polished slab
    f = box('floor', (L, Wd, .2), (L / 2, Wd / 2, -.1), M['concrete'], bevel=0)
    # roof: matte white underside, with a slot and oculi cut by leaving gaps between roof tiles
    roofm = mat('roofM', (.96, .96, .97), rough=.015, metal=1.0) if MIRROR else P['M']['panel']
    tiles = []
    ys = [(0, SLOT_Y - SLOT_W / 2), (SLOT_Y + SLOT_W / 2, Wd)]
    for (y0, y1) in ys:
        box('roof', (L, y1 - y0, .4), (L / 2, (y0 + y1) / 2, H + .2), roofm, bevel=0)
    # the slot and oculi glow from above: emission planes set back into the roof
    skym = emit_mat('sky', (.92, .93, 1.0), 16)
    o = box('slotSky', (L, SLOT_W + .4, .05), (L / 2, SLOT_Y, H + 2.4), skym, bevel=0); o.lightgroup = 'sky'
    for (x, y) in OCULI:
        # an oculus is a deep square well; its sides catch the light and grade it, as in a skyspace
        s = 9.0
        for (dx, dy, sx, sy) in ((-s / 2, 0, .3, s), (s / 2, 0, .3, s), (0, -s / 2, s, .3), (0, s / 2, s, .3)):
            box('well', (sx, sy, 2.2), (x + dx, y + dy, H + 1.3), roofm, bevel=0)
        o = box('ocSky', (s, s, .05), (x, y, H + 2.4), skym, bevel=0); o.lightgroup = 'sky'
    # roof trusses: long, quiet lines
    tm = mat('truss', (.7, .71, .73), rough=.5, metal=.5)
    # open-web steel trusses: two chords and a zig-zag web, one module instanced across the hall
    def truss_mod():
        box('chT', (.18, 12.0, .14), (0, 0, 0), tm, bevel=.004); box('chB', (.18, 12.0, .14), (0, 0, -1.3), tm, bevel=.004)
        for k in range(10):
            y0 = -6 + k * 1.2
            P['tube']('web', [(0, y0, -1.25), (0, y0 + .6, -.05)], .03, tm); P['tube']('web', [(0, y0 + .6, -.05), (0, y0 + 1.2, -1.25)], .03, tm)
    src('trussM', truss_mod)
    if not MIRROR:
        for x in range(12, int(L), 12):
            for k in range(8):
                yc = 6 + k * 12
                if abs(yc - SLOT_Y) < 6: continue
                inst('trussM', (x, yc, H - .12))
        # purlins between trusses, and the services every real roof carries
        for y in range(3, int(Wd), 3):
            if abs(y - SLOT_Y) < 3: continue
            box('purlin', (L, .08, .2), (L / 2, y, H - .12), tm, bevel=0)
        red = mat('sprink', (.55, .03, .02), rough=.45, coat=.3); yel = mat('gas', (.85, .62, .02), rough=.4, coat=.3)
        tray = mat('tray', (.55, .56, .58), rough=.35, metal=.8)
        for y in range(9, int(Wd), 12):
            if abs(y - SLOT_Y) < 6: continue
            P['tube']('spr', [(0, y, H - 1.9), (L, y, H - 1.9)], .06, red)
        for y in (20.0, 76.0):
            P['tube']('gasp', [(0, y + 1, H - 2.3), (L, y + 1, H - 2.3)], .05, yel)
            box('tray', (L, .5, .08), (L / 2, y - 1, H - 2.6), tray, bevel=0)
    # floor: walkway and aisle markings
    lane = M['lane']; laneW = M['laneW']; walk = mat('walkG', (.05, .38, .16), rough=.6, noise=.2, noise_scale=6)
    for yy in (SLOT_Y - 4.2, SLOT_Y + 4.2): box('aisleL', (L - 8, .14, .004), (L / 2, yy, .006), lane, bevel=0)
    box('walk', (L - 8, 1.4, .004), (L / 2, SLOT_Y - 5.4, .005), walk, bevel=0)
    for x in range(8, int(L) - 4, 3): box('zebra', (.5, 1.2, .005), (x, SLOT_Y - 5.4, .007), laneW, bevel=0)
    # walls: tall planes. The west (far) wall is the colour field, lit by grazers you never see
    wm = mat('wallW', (.86, .86, .87), rough=.92)
    box('wallW', (.4, Wd, H), (-.2, Wd / 2, H / 2), wm, bevel=0)
    box('wallN', (L, .4, H), (L / 2, Wd + .2, H / 2), P['M']['panel'], bevel=0)
    box('wallS', (L, .4, H), (L / 2, -.2, H / 2), P['M']['panel'], bevel=0)
    box('wallE', (.4, Wd, H), (L + .2, Wd / 2, H / 2), P['M']['panel'], bevel=0)
    # coves: a thin hidden strip of light where wall meets floor, running the full length
    covem = emit_mat('cove', (.75, .85, 1.0), 10)
    for y in (.3, Wd - .3):
        o = box('cove', (L, .05, .08), (L / 2, y, .06), covem, bevel=0); o.lightgroup = 'cove'
    # the field on the far wall: wide area lights washing it from below and above, out of sight
    col, e = (1.0, 1.0, 1.0), 1200
    for zz, rot in ((.3, 0), (H - .3, math.pi)):
        bpy.ops.object.light_add(type='AREA', location=(3.0, Wd / 2, zz)); l = bpy.context.active_object
        l.data.shape = 'RECTANGLE'; l.data.size = Wd - 4; l.data.size_y = .4; l.data.energy = e * 40; l.data.color = col
        l.rotation_euler = (0, math.radians(-90 + (20 if zz < 1 else -20)) * (1 if rot == 0 else 1), 0)
        l.rotation_euler = (0, math.radians(-70 if zz < 1 else -110), 0); l.lightgroup = 'field'

def layout(seed=1):
    rr = random.Random(seed)
    # columns with AmIMo anchors (from CAD)
    for x in COLS_X:
        for y in COLS_Y:
            P['column'](x, y)
    # west: racking in two blocks either side of the main aisle
    for blk_y in (6.0, 56.0):
        for i in range(10):
            P['rack_row'](10.0 + i * 5.2, blk_y, 12, levels=4, seed=seed * 50 + i + int(blk_y))
    # middle: four assembly lines with stations
    for ly in (16.0, 32.0, 64.0, 80.0):
        P['conveyor'](90.0, 168.0, ly)
        for k in range(12):
            P['station'](93.0 + k * 6.2, ly - 1.6, 0); P['station'](93.0 + k * 6.2, ly + 1.6, math.pi)
    for k in range(5): P['machine'](95.0 + k * 14, 41.0, math.pi); P['machine'](95.0 + k * 14, 55.0, 0)
    # east: dispatch, staged pallets in lanes
    for lane in range(8):
        for j in range(14):
            if rr.random() < .8:
                inst(P['pallet_load'](rr.randrange(5), rr.choice((2, 3))).name[4:], (186.0 + lane * 6.0, 10.0 + j * 2.0, 0))
                inst(P['pallet_load'](rr.randrange(5), rr.choice((2, 3))).name[4:], (186.0 + lane * 6.0, 58.0 + j * 2.0, 0))
    for k in range(6): P['dock_door'](186.0 + k * 9.0, Wd - .2, math.pi)

def movers(seed=2):
    """Everything with a tag. Returns [(kind, x, y, waiting)]."""
    rr = random.Random(seed); out = []
    def add(kind, x, y, rz, waiting=False):
        P['mover_src'](kind); inst('m_' + kind, (x, y, 0), rz); out.append((kind, x, y, waiting))
    # WIP buffers beside the lines: many trolleys, some long waiting
    for (bx, by) in ((100, 24), (130, 24), (160, 24), (100, 72), (130, 72), (160, 72)):
        for k in range(10):
            add('trolley', bx + (k % 5) * 1.5, by - 1.5 + (k // 5) * 1.6, rr.uniform(-.06, .06), waiting=rr.random() < .18)
    # forklifts in the rack aisles and the main aisle
    for k in range(10): add('forklift', 12.6 + rr.randrange(10) * 5.2, rr.choice((20.0, 30.0, 66.0, 76.0)), math.pi / 2 * rr.choice((1, -1)))
    for k in range(6): add('forklift', rr.uniform(70, 230), SLOT_Y + rr.uniform(-2.5, 2.5), rr.choice((0, math.pi)))
    # robots on the loop between lines
    for k in range(10): add('amr', rr.uniform(92, 166), rr.choice((24.0, 48.0, 72.0)) + rr.uniform(-.4, .4), rr.choice((0, math.pi)))
    # people: at stations and walking
    for k in range(36):
        ly = rr.choice((16.0, 32.0, 64.0, 80.0)); x = 93.0 + rr.randrange(12) * 6.2
        add('person', x + rr.uniform(-.4, .4), ly + rr.choice((-2.5, 2.5)), rr.uniform(0, 6.28))
    for k in range(12): add('person', rr.uniform(20, 230), SLOT_Y + rr.uniform(-4, 4), rr.uniform(0, 6.28))
    return out

def tags(ms, strength):
    blue = emit_mat('tagB', (.25, .55, 1.0), 40); amber = emit_mat('tagA', (1.0, .55, .12), 48)
    SPH = {}
    for k, m in (('b', blue), ('a', amber)):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.09, segments=12, ring_count=8); t = bpy.context.active_object
        SPH[k] = t.data.copy(); SPH[k].materials.append(m); bpy.data.objects.remove(t)
    for kind, x, y, w in ms:
        z = {'person': 1.95, 'forklift': 2.3, 'amr': .7, 'trolley': 1.2}[kind]
        me = SPH['a' if w else 'b']; o = bpy.data.objects.new('tag', me); o.location = (x, y, z); bpy.context.collection.objects.link(o); o.lightgroup = 'wait' if w else ('ptag' if kind == 'person' else 'tag'); o.visible_shadow = False

def haze(density=.0011):
    m = bpy.data.materials.new('haze'); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    v = nt.nodes.new('ShaderNodeVolumePrincipled'); v.inputs['Density'].default_value = density; v.inputs['Anisotropy'].default_value = .55
    v.inputs['Color'].default_value = (.9, .92, 1, 1)
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(v.outputs[0], o.inputs['Volume'])
    b = box('haze', (L - 1, Wd - 1, H - .5), (L / 2, Wd / 2, (H - .5) / 2), m, bevel=0)
    b.visible_shadow = False

def sun(mood):
    # low sun through the oculi makes shafts in the haze
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 80)); s = bpy.context.active_object
    s.data.angle = math.radians(1.5)
    s.data.energy = 5.0; s.data.color = (1, .92, .82); s.lightgroup = 'sky'
    s.rotation_euler = (math.radians(32), 0, math.radians(-110))


def mklight(kind, loc, group, energy, color=(1, 1, 1)):
    ld = bpy.data.lights.new('L', kind); ld.energy = energy; ld.color = color
    o = bpy.data.objects.new('L', ld); o.location = loc; bpy.context.collection.objects.link(o); o.lightgroup = group
    return o

def lamps():
    """High-bay lamps on a 12 x 12 m grid. In scroll 1 the page turns their light into one sodium frequency."""
    hood = mat('hood', (.15, .16, .17), rough=.4, metal=.6)
    src('hood', lambda: P['cyl']('hood', .5, .3, (0, 0, 0), hood, verts=24, bevel=.01))
    for x in range(6, int(L), 12):
        for y in range(6, int(Wd), 12):
            if abs(y - SLOT_Y) < 4: continue
            inst('hood', (x, y, H - 1.6))
            l = mklight('AREA', (x, y, H - 1.8), 'lamps', 1500, (1, .96, .9)); l.data.shape = 'DISK'; l.data.size = .8

TARGET = (131.5, 25.7, 1.2)   # the trolley that has waited, in the second WIP buffer
def ranging():
    """Three AmIMo anchors each throw a coloured cone of light at the tag; where all three cross they mix to white."""
    for (x, y), col, g in (((120.0, 24.0), (1, .05, .05), 'r'), ((144.0, 24.0), (.05, 1, .1), 'g'), ((144.0, 72.0), (.1, .2, 1), 'b')):
        z = 6.2
        bpy.ops.object.light_add(type='SPOT', location=(x, y - .4, z)); l = bpy.context.active_object
        d = Vector(TARGET) - Vector((x, y - .4, z)); l.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        l.data.energy = 60000 if g != 'b' else 90000; l.data.color = col; l.data.spot_size = math.radians(9 if g != 'b' else 4); l.data.spot_blend = .35
        l.data.shadow_soft_size = .05; l.lightgroup = g

SHOTS = {
    # name: camera location, look-at, lens mm
    'low':  ((236.0, 40.0, 4.2), (60.0, 52.0, 3.0), 24),
    'high': ((234.0, 16.0, 9.0), (80.0, 58.0, 1.0), 22),
    'pulse': ((146.0, 9.0, 6.0), (131.5, 25.7, 1.6), 28),
    'mirror': ((200.0, 30.0, 2.0), (120.0, 52.0, 14.0), 16),
    'top':  ((120.0, 48.0, 260.0), (120.0, 48.0, 0.0), 0),
}

# The film: one continuous camera move in four parts. Each part is 60 frames; the page scrubs them with scroll.
FILM = {
    1: [((234.0, 16.0, 9.0), (80.0, 58.0, 1.0), 22), ((206.0, 22.0, 7.5), (110.0, 50.0, 1.5), 24)],
    2: [((206.0, 22.0, 7.5), (110.0, 50.0, 1.5), 24), ((146.0, 9.0, 6.0), (131.5, 25.7, 1.4), 32)],
    3: [((146.0, 9.0, 6.0), (131.5, 25.7, 1.4), 32), ((172.0, 30.0, 11.0), (90.0, 52.0, 2.0), 20)],
    4: [((172.0, 30.0, 11.0), (90.0, 52.0, 2.0), 20), ((176.0, 48.0, 3.0), (110.0, 48.0, 14.0), 16)],
}
def ease(t): return t * t * (3 - 2 * t)
def film_cam(c, seg, t):
    (l0, a0, f0), (l1, a1, f1) = FILM[seg]; e = ease(t)
    loc = Vector(l0).lerp(Vector(l1), e); at = Vector(a0).lerp(Vector(a1), e)
    c.location = loc; c.rotation_euler = (at - loc).to_track_quat('-Z', 'Y').to_euler(); c.data.lens = f0 + (f1 - f0) * e

def use_gpu(sc):
    kind = os.environ.get('CYCLES_GPU')
    if not kind: return
    pr = bpy.context.preferences.addons['cycles'].preferences
    pr.compute_device_type = kind; pr.get_devices()
    for d in pr.devices: d.use = d.type != 'CPU'
    sc.cycles.device = 'GPU'; sc.render.threads_mode = 'AUTO'
    print('GPU', [(d.name, d.type, d.use) for d in pr.devices])

def camera(sc, w, h, shot):
    loc, at, lens = SHOTS[shot]
    bpy.ops.object.camera_add(location=loc); c = bpy.context.active_object
    c.rotation_euler = (Vector(at) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    if lens: c.data.lens = lens
    else: c.data.type = 'ORTHO'; c.data.ortho_scale = L * 1.02
    c.data.clip_end = 2000; sc.camera = c; sc.render.resolution_x = w; sc.render.resolution_y = h
    return c

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]
    MIRROR = a[5] == 'mirror' or (a[4] == 'film' and a[5] == '4')
    out, w, h, s, mood, shot = a[0], int(a[1]), int(a[2]), int(a[3]), a[4], a[5]
    P['clear'](); P['mats'](); P['plant_mats']()
    sc = bpy.context.scene
    P['MAIN'] = P['coll']('PLANT'); P['SRCROOT'] = P['coll']('SOURCES'); P['set_active'](P['MAIN'])
    shell(); layout(); ms = movers(); tags(ms, 1); lamps(); ranging()
    vl = bpy.context.view_layer
    for g in ('sky', 'cove', 'field', 'lamps', 'tag', 'ptag', 'wait', 'r', 'g', 'b', 'amb'): vl.lightgroups.add(name=g)
    vl.cycles.denoising_store_passes = True; vl.use_pass_mist = True
    if 'haze' in a: haze()
    if shot == 'top':  # the roof comes off for the map view
        for o in list(bpy.data.objects):
            if o.name.startswith(('roof', 'truss', 'well', 'slotSky', 'ocSky')): bpy.data.objects.remove(o)
    sun(mood)
    for lc in bpy.context.view_layer.layer_collection.children:
        if lc.collection == P['SRCROOT']: lc.exclude = True
    world = bpy.data.worlds.new('w'); world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .012, .03, 1); sc.world = world; world.lightgroup = 'amb'; world.mist_settings.start = 0; world.mist_settings.depth = 300; world.mist_settings.falloff = 'LINEAR'
    P['render_setup'](sc, s); sc.render.film_transparent = False; sc.render.image_settings.color_mode = 'RGB'
    sc.view_settings.exposure = 0.0
    sc.cycles.volume_bounces = 1; sc.cycles.volume_step_rate = 4
    use_gpu(sc)
    if out.endswith('.exr') or mood == 'film':
        sc.render.image_settings.media_type = 'MULTI_LAYER_IMAGE'; sc.render.image_settings.file_format = 'OPEN_EXR_MULTILAYER'; sc.render.image_settings.color_depth = '16'
    if mood == 'film':
        seg = int(shot); c = camera(sc, w, h, 'high')
        f0, f1 = (int(a[6]), int(a[7])) if len(a) > 7 else (0, 60)
        st = int(a[8]) if len(a) > 8 else 1
        os.makedirs(out, exist_ok=True)
        json.dump({'film': FILM, 'w': w, 'h': h, 'movers': ms, 'target': TARGET, 'sensor': c.data.sensor_width}, open(os.path.join(out, 'meta.json'), 'w'))
        for f in list(range(f0, f1, st)) + ([59] if st > 1 else []):
            fp = os.path.join(out, 's%d_%03d.exr' % (seg, f))
            if os.path.exists(fp): continue
            film_cam(c, seg, f / 59.0); sc.render.filepath = fp
            bpy.ops.render.render(write_still=True); print('FRAME', fp, flush=True)
        sys.exit(0)
    camera(sc, w, h, shot)
    json.dump({'shot': shot, 'w': w, 'h': h, 'movers': ms, 'target': TARGET, 'cam': [list(sc.camera.matrix_world.col[i]) for i in range(4)],
               'lens': sc.camera.data.lens, 'sensor': sc.camera.data.sensor_width, 'type': sc.camera.data.type, 'ortho': sc.camera.data.ortho_scale},
              open(out.rsplit('.', 1)[0] + '.json', 'w'))
    sc.render.filepath = out
    if 'norender' in a: print('BUILT'); sys.exit(0)
    bpy.ops.render.render(write_still=True); print('RENDERED', out)
