"""AmIMotion shared model hall: build it, light it, and render any moment of the 9 s hero film.

One script, Blender 5.1 Python module (bpy), headless.

    /tmp/bpyenv/bin/python build_hall.py --t 0.0 --out poster.png            # one moment (display time, s)
    /tmp/bpyenv/bin/python build_hall.py --frames 0-224 --outdir frames/     # film frames, resumable (skips done)
    /tmp/bpyenv/bin/python build_hall.py --save hall.blend                   # write the scene file at t=0
    options: --res 1600x2000  --scale 1.0  --samples 32  --engine CYCLES|EEVEE|WORKBENCH  --fps 25
             --border x0,x1,y0,y1 (0..1, Blender convention: y from bottom) --time-limit 0
             --state after|before|build   (force a state for screen stills; default follows the film clock)

Raw frames are 16-bit PNG, view transform Standard. Grade with grade_film.py (system python).

The hall is a designed model (homepage-final.md, "The shared world"): one flat matte material per kind of
thing, simplified shapes, one bevel radius for the whole hall, no wear, no text, no people, no daylight.
Blue trails, blue ticks and amber tints are flat ink on the floor: matte, lit like the floor, never emitting.
Camera A is locked: three-quarter overhead, 45 deg down, 11 m up, 35 mm.

Film clock (homepage-final.md, Screen 1). Display time t in [0, 9). Simulation time tau runs continuously
from 2.0 to 11.0; the display shows tau = t + 9 for t < 2 and tau = t from 2.0. So the loop seam (9.0 -> 0.0)
is continuous motion, and the only discontinuity is the one hard cut at 2.0.
    0.0 - 2.0  after: every trail, four amber tints (the poster is t = 0.0)
    2.0        hard cut
    2.0 - 4.5  before: no colour. A short blue tick at a checkpoint desk as a trolley passes it, and it stays.
    4.5 - 9.0  after, building: the ticks join into lines, one kind at a time, 0.4 s apart. From 7.0 s
               the three queue trolleys and the staging pallet take their amber, 0.4 s apart.
"""
import sys, os, math, time

# --------------------------------------------------------------------------------------------
# look file (one place for every value the stills and the film share)
# --------------------------------------------------------------------------------------------
HEX = dict(
    floor='#f6f4ef', machine='#e4e2dc', hardware='#3a3d42',
    blue='#66a5fa', amber='#f0a43a', outline='#d6d4ce',
)
BEVEL = 0.022          # one bevel radius for the whole hall (m)
MARK_W = 0.085         # trail and tick width on the floor (m)
TICK_LEN = 1.0        # a checkpoint tick (m)
TRAIL_L = 7.0          # trail length behind each moving thing (m)
FPS = 25
CAM = dict(height=11.0, pitch=45.0, lens=35.0, yaw=34.0, target=(0.4, 9.2))   # camera A, locked

REVEAL = {  # display time each kind's lines appear (4.5 + 0.4 k)
    'trolley': 4.5, 'bin': 4.9, 'fixture': 4.9, 'toolcart': 5.3, 'forklift': 5.7, 'tugger': 5.7, 'amr': 6.1}
AMBER_AT = {'q1': 7.0, 'q2': 7.4, 'q3': 7.8, 'pallet': 8.2}


def tau_of(t):
    t = t % 9.0
    return t + 9.0 if t < 2.0 else t


def state_of(t):
    t = t % 9.0
    if t < 2.0:
        return 'after'
    if t < 4.5:
        return 'before'
    return 'build'


# --------------------------------------------------------------------------------------------
# paths and motion (pure python, no bpy)
# --------------------------------------------------------------------------------------------
def fillet(pts, r=0.9, step=0.05):
    """Polyline with rounded corners of radius r, resampled every `step` metres."""
    out = [pts[0]]
    for i in range(1, len(pts) - 1):
        p0, p1, p2 = pts[i - 1], pts[i], pts[i + 1]
        a = (p0[0] - p1[0], p0[1] - p1[1]); b = (p2[0] - p1[0], p2[1] - p1[1])
        la, lb = math.hypot(*a), math.hypot(*b)
        a = (a[0] / la, a[1] / la); b = (b[0] / lb, b[1] / lb)
        cosang = max(-1, min(1, a[0] * b[0] + a[1] * b[1]))
        ang = math.acos(cosang)
        if ang > math.pi - 1e-3:
            out.append(p1); continue
        d = min(r / math.tan(ang / 2), la * 0.49, lb * 0.49)
        q0 = (p1[0] + a[0] * d, p1[1] + a[1] * d); q2 = (p1[0] + b[0] * d, p1[1] + b[1] * d)
        n = 12
        for k in range(n + 1):   # quadratic bezier through the corner: smooth enough at this scale
            u = k / n
            out.append(((1 - u) ** 2 * q0[0] + 2 * (1 - u) * u * p1[0] + u * u * q2[0],
                        (1 - u) ** 2 * q0[1] + 2 * (1 - u) * u * p1[1] + u * u * q2[1]))
    out.append(pts[-1])
    # resample
    res = [out[0]]; acc = 0.0
    for i in range(1, len(out)):
        x0, y0 = res[-1]; x1, y1 = out[i]
        seg = math.hypot(x1 - x0, y1 - y0)
        while seg >= step:
            f = step / seg
            x0, y0 = x0 + (x1 - x0) * f, y0 + (y1 - y0) * f
            res.append((x0, y0)); seg = math.hypot(x1 - x0, y1 - y0)
    if math.hypot(res[-1][0] - out[-1][0], res[-1][1] - out[-1][1]) > 1e-6:
        res.append(out[-1])
    return res


class Path:
    def __init__(self, pts, r=0.9):
        self.p = fillet(pts, r)
        self.s = [0.0]
        for i in range(1, len(self.p)):
            self.s.append(self.s[-1] + math.hypot(self.p[i][0] - self.p[i - 1][0], self.p[i][1] - self.p[i - 1][1]))
        self.L = self.s[-1]

    def at(self, s):
        s = max(0.0, min(self.L, s))
        lo, hi = 0, len(self.s) - 1
        while hi - lo > 1:
            m = (lo + hi) // 2
            if self.s[m] <= s: lo = m
            else: hi = m
        f = 0 if self.s[hi] == self.s[lo] else (s - self.s[lo]) / (self.s[hi] - self.s[lo])
        x = self.p[lo][0] + (self.p[hi][0] - self.p[lo][0]) * f
        y = self.p[lo][1] + (self.p[hi][1] - self.p[lo][1]) * f
        return x, y

    def heading(self, s):
        a = self.at(s - 0.25); b = self.at(s + 0.25)
        if a == b:
            a = self.at(s - 0.5); b = self.at(s)
        return math.atan2(b[1] - a[1], b[0] - a[0])

    def segment(self, s0, s1):
        s0 = max(0.0, s0); s1 = min(self.L, s1)
        if s1 <= s0 + 1e-4:
            return []
        pts = [self.at(s0)]
        for i, si in enumerate(self.s):
            if s0 < si < s1:
                pts.append(self.p[i])
        pts.append(self.at(s1))
        return pts


class Motion:
    """Arc position over simulation time: a list of moves (t0, t1, s0, s1), eased in and out (cosine), and
    parked in between. Before the first move it sits at s0 of the first move."""
    def __init__(self, moves):
        self.m = sorted(moves)

    def s(self, tau):
        s = self.m[0][2]
        for t0, t1, s0, s1 in self.m:
            if tau <= t0:
                return s
            if tau < t1:
                u = (tau - t0) / (t1 - t0)
                # constant cruise with short eased ends (about 12 % of the move each side)
                e = 0.12
                if u < e: w = (u * u) / (2 * e * (1 - e))
                elif u > 1 - e: w = 1 - ((1 - u) ** 2) / (2 * e * (1 - e))
                else: w = (u - e / 2) / (1 - e)
                return s0 + (s1 - s0) * w
            s = s1
        return s


# --------------------------------------------------------------------------------------------
# the hall plan (hall metres: x right, y away; the camera stands at the near left)
# --------------------------------------------------------------------------------------------
# Areas. Main aisle runs along y at x -0.6..1.8 (lanes -0.3, 0.1, 0.5, 0.9, 1.3); the cross aisle along x at
# y 10.4..11.8; the back aisle along x at y 23..25.
INSPECT = dict(c=(-3.6, 8.7))                             # inspection station (table at the far side of its zone)
INSPECT_ZONE = (-5.6, -1.6, 7.2, 10.2)                    # x0, x1, y0, y1 (pale outline)
QUEUE = (-5.6, -0.95, 4.75, 6.05)                         # queue outline in front of inspection (toward camera)
QUEUE_SLOTS = [(-4.75, 5.4), (-3.25, 5.4), (-1.75, 5.4)]  # three trolleys nose to tail, facing the station
STAGING = (2.2, 3.6, 3.4, 8.4)                            # staging lane across the main aisle, along it
PALLET_AT = (2.9, 5.4)
PRESSES = [(-4.2, 14.6), (-4.2, 19.6)]                    # press centres (left of the aisle), mouths face +x
RACKS = [(5.4, 12.6, 21.6), (9.2, 12.6, 21.6)]            # rack rows run along y: (x centre, y0, y1)
RACK_H = 3.4
COLUMNS = [(x, y) for x in (-7.6, 4.4, 15.2) for y in (-1.0, 8.0, 17.0, 26.0)]
ANCHOR_COLS = [(x, y) for x in (-7.6, 4.4, 15.2) for y in (-1.0, 8.0, 17.0, 26.0)]
DESKS = [(-1.35, 18.0, 90.0), (-1.35, 11.4, 90.0), (5.4, 11.95, 0.0)]   # three checkpoint desks (x, y, rot)
WALLS = dict(back=30.5, left=-8.8, right=17.2)
DOOR = (-0.4, 3.0)   # the opening in the back wall the tugger and trolleys use

# Paths
P = {}
P['t1'] = Path([(-2.8, 14.6), (-1.2, 14.6), (0.1, 13.2), (0.1, -10.0)], r=1.0)          # leaves press 1 (after)
P['t2'] = Path([(-2.8, 19.6), (-1.4, 19.6), (-0.3, 18.4), (-0.3, -10.0)], r=1.0)        # desk 1, then down the aisle
P['t4'] = Path([(0.5, 34.0), (0.5, -10.0)], r=1.0)                                       # desk 2, down the aisle
P['t3'] = Path([(0.9, 30.0), (0.9, 12.4), (2.2, 11.0), (6.4, 11.0), (7.3, 12.2), (7.3, 15.4)], r=0.9)  # desk 3, hides
P['ti'] = Path([(-0.3, 16.0), (-0.3, 10.6), (-1.6, 8.7), (-3.6, 8.7)], r=1.1)           # being inspected
for i, (qx, qy) in enumerate(QUEUE_SLOTS):
    P['q%d' % (i + 1)] = Path([(0.1, 16.0), (0.1, 7.2), (-1.2, 5.4), (qx, qy)], r=1.1)  # the three that wait
P['pallet'] = Path([(7.3, 19.0), (7.3, 12.2), (6.2, 10.5), (2.9, 10.5), (2.9, 5.4)], r=1.0)
P['fork'] = Path([(11.0, 24.0), (11.0, 12.4), (9.6, 11.6), (4.4, 11.6), (2.9, 10.4), (2.9, 9.6)], r=1.4)
P['tug'] = Path([(1.3, 44.0), (1.3, -30.0)], r=1.6)   # through the back-wall door, down the aisle, out at the near end
P['amr'] = Path([(-12.0, 24.2), (20.0, 24.2)], r=1.3)
P['tool'] = Path([(-0.7, 27.0), (-0.7, 23.0), (-2.0, 22.3), (-2.6, 22.3)], r=1.0)
P['fix'] = Path([(-8.0, 12.0), (-2.4, 12.0)], r=1.0)
P['bin1'] = Path([(4.6, 22.6), (0.9, 22.6), (-0.6, 21.4), (-2.5, 21.4)], r=0.9)
P['bin2'] = Path([(4.6, 23.4), (0.9, 23.4), (-0.6, 22.5), (-2.5, 22.5)], r=0.9)

# Motion on simulation time tau (2.0 .. 11.0, continuous).
def _mv(path, t0, v, s0=0.0, s1=None):
    s1 = path.L if s1 is None else s1
    return (t0, t0 + (s1 - s0) / v * 1.06, s0, s1)


def _nearest_s(path, pt):
    i = min(range(len(path.p)), key=lambda k: (path.p[k][0] - pt[0]) ** 2 + (path.p[k][1] - pt[1]) ** 2)
    return path.s[i]


def _sched(path, v, pt, tau_at, s0=0.0, s1=None):
    """A single eased move along path at cruise speed v that passes the point nearest pt at tau_at."""
    s_m = _nearest_s(path, pt)
    lo, hi = -200.0, 200.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if Motion([_mv(path, mid, v, s0, s1)]).s(tau_at) > s_m: lo = mid
        else: hi = mid
    return _mv(path, (lo + hi) / 2, v, s0, s1)

M = {}
M['t1'] = Motion([_sched(P['t1'], 1.25, (-1.2, 14.6), 8.9)])      # just out of the press mouth at the poster
M['t2'] = Motion([_sched(P['t2'], 1.25, (-0.3, DESKS[0][1]), 2.55)])  # tick 1 at 2.5 s
M['t4'] = Motion([_sched(P['t4'], 1.25, (0.5, DESKS[1][1]), 3.15)])  # tick 2 at 3.15 s
M['t3'] = Motion([_sched(P['t3'], 1.3, (DESKS[2][0], 11.0), 3.6)])   # tick 3 at 3.6 s, then behind the racks
for k in ('ti', 'q1', 'q2', 'q3', 'pallet', 'tool', 'fix', 'bin1', 'bin2'):
    M[k] = Motion([(-50.0, -40.0, 0.0, P[k].L)])        # arrived long ago: parked at the end of its path
M['fork'] = Motion([_sched(P['fork'], 1.9, (6.0, 11.2), 9.0)])
M['tug'] = Motion([_sched(P['tug'], 2.2, (1.3, 16.5), 9.0, 0.0, P['tug'].L)])
M['amr'] = Motion([_sched(P['amr'], 1.3, (2.0, 24.2), 9.0)])

MOVERS = dict(  # key -> (kind, builder name)
    t1=('trolley', 'trolley'), t2=('trolley', 'trolley'), t3=('trolley', 'trolley'), t4=('trolley', 'trolley'),
    ti=('trolley', 'trolley'), q1=('trolley', 'trolley'), q2=('trolley', 'trolley'), q3=('trolley', 'trolley'),
    pallet=('pallet', 'pallet'), fork=('forklift', 'forklift'), tug=('tugger', 'tugger'), amr=('amr', 'amr'),
    tool=('toolcart', 'toolcart'), fix=('fixture', 'fixture'), bin1=('bin', 'bin'), bin2=('bin', 'bin'))
# pallet's line belongs to the forklift kind (it was carried); it reveals with the trolleys' queue? No: with the
# forklift and tugger, since the forklift brought it.
KIND_REVEAL = dict(trolley='trolley', pallet='forklift', forklift='forklift', tugger='tugger', amr='amr',
                   toolcart='toolcart', fixture='fixture', bin='bin')


TICK_PTS = {'t2': (-0.3, DESKS[0][1]), 't4': (0.5, DESKS[1][1]), 't3': (DESKS[2][0], 11.0)}   # path point by each desk


def tick_pass_times():
    res = {}
    for key, pt in TICK_PTS.items():
        s_d = _nearest_s(P[key], pt)
        for k in range(0, 8000):
            tt = -10 + k * 0.005
            if M[key].s(tt) >= s_d:
                res[key] = round(tt, 3); break
    return res

TICK_T = tick_pass_times()


def ticks_at(tau):
    """Checkpoint ticks laid in 'before': a tick at each desk once its trolley has passed. (path_key, s)."""
    return [(k, _nearest_s(P[k], pt)) for k, pt in TICK_PTS.items() if tau >= TICK_T[k]]


def marks_at(t, force=None):
    """What ink is on the floor at display time t: (trails, ticks, amber keys)."""
    st = force or state_of(t)
    tau = tau_of(t) if force is None else (9.0 if force == 'after' else tau_of(t))
    trails, ticks, amber = [], [], []
    if st == 'before':
        for key, s_d in ticks_at(tau):
            # the tick lies just behind the desk point, so the trolley that lays it never covers it
            ticks.append(P[key].segment(s_d - 0.75 - TICK_LEN, s_d - 0.75))
        return trails, ticks, amber
    tt = t % 9.0
    for key, (kind, _) in MOVERS.items():
        rk = KIND_REVEAL[kind]
        if st == 'build' and tt < REVEAL[rk]:
            continue
        s = M[key].s(tau)
        seg = P[key].segment(s - TRAIL_L, s)
        if seg:
            trails.append(seg)
    for key, ta in AMBER_AT.items():
        if st == 'after' or tt >= ta:
            amber.append(key)
    if st == 'build':
        # ticks of kinds not yet revealed stay until their kind joins; trolleys reveal first so none remain
        pass
    return trails, ticks, amber


# --------------------------------------------------------------------------------------------
# bpy scene
# --------------------------------------------------------------------------------------------
def opt(k, d=None):
    if k in sys.argv:
        i = sys.argv.index(k)
        return sys.argv[i + 1] if i + 1 < len(sys.argv) else True
    return d


def srgb_to_lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) for v in c) + (1.0,)


def build(engine='CYCLES', W=1600, H=2000, samples=32):
    import bpy, bmesh
    from mathutils import Vector, Euler, Matrix
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = {'CYCLES': 'CYCLES', 'EEVEE': 'BLENDER_EEVEE', 'WORKBENCH': 'BLENDER_WORKBENCH'}[engine]
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '16'
    sc.render.image_settings.color_mode = 'RGB'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.render.film_transparent = False
    if engine == 'CYCLES':
        cy = sc.cycles
        cy.device = 'CPU'
        cy.samples = samples
        cy.use_adaptive_sampling = True
        cy.adaptive_threshold = 0.02
        cy.use_denoising = True
        cy.denoiser = 'OPENIMAGEDENOISE'
        cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
        cy.denoising_prefilter = 'ACCURATE'
        cy.max_bounces = 4; cy.diffuse_bounces = 3; cy.glossy_bounces = 1
        cy.transmission_bounces = 0; cy.volume_bounces = 0; cy.transparent_max_bounces = 2
        cy.caustics_reflective = False; cy.caustics_refractive = False
        cy.use_light_tree = False
        cy.seed = 3
        sc.render.use_persistent_data = True
        try:
            cy.tile_size = 4096
        except Exception:
            pass
        tl = float(opt('--time-limit', 0))
        if tl > 0:
            cy.time_limit = tl
    elif engine == 'EEVEE':
        ee = sc.eevee
        ee.taa_render_samples = samples
        try:
            ee.use_shadows = True
            ee.use_raytracing = True
            ee.ray_tracing_options.resolution_scale = '1'
            ee.fast_gi_method = 'GLOBAL_ILLUMINATION'
            ee.use_fast_gi = True
            ee.shadow_ray_count = 2; ee.shadow_step_count = 8
        except Exception as e:
            print('eevee opt', e)
    else:
        sh = sc.display.shading
        sh.light = 'STUDIO'; sh.color_type = 'MATERIAL'
        sh.show_shadows = True; sh.show_cavity = False
        sc.display.render_aa = '8'

    # ---- materials: one per kind of thing
    def mat(name, hexcol, rough=0.88, spec=0.25):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes['Principled BSDF']
        col = srgb_to_lin(hexcol)
        b.inputs['Base Color'].default_value = col
        b.inputs['Roughness'].default_value = rough
        b.inputs['Specular IOR Level'].default_value = spec
        m.diffuse_color = col
        return m
    MAT = dict(
        floor=mat('floor', HEX['floor'], spec=0.15),
        machine=mat('machine', HEX['machine']),
        hardware=mat('hardware', HEX['hardware'], rough=0.7, spec=0.3),
        blue=mat('ink_blue', HEX['blue'], spec=0.1),
        amber=mat('ink_amber', HEX['amber'], spec=0.1),
        outline=mat('ink_outline', HEX['outline'], spec=0.1),
    )

    coll = sc.collection

    def link(o, parent=None):
        coll.objects.link(o)
        if parent is not None:
            o.parent = parent
        return o

    def boxmesh(parts, name):
        """parts: list of (sx, sy, sz, cx, cy, cz[, rz deg]) boxes; one beveled mesh."""
        bm = bmesh.new()
        for p in parts:
            sx, sy, sz, cx, cy, cz = p[:6]
            rz = math.radians(p[6]) if len(p) > 6 else 0.0
            geom = bmesh.ops.create_cube(bm, size=1.0)
            vs = geom['verts']
            for v in vs:
                v.co = Vector((v.co.x * sx, v.co.y * sy, v.co.z * sz))
                if rz:
                    v.co = Matrix.Rotation(rz, 3, 'Z') @ v.co
                v.co += Vector((cx, cy, cz))
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me); bm.free()
        return me

    def solid(name, parts, material, parent=None, bevel=BEVEL):
        me = boxmesh(parts, name)
        o = bpy.data.objects.new(name, me)
        o.data.materials.append(material)
        if bevel:
            m = o.modifiers.new('bevel', 'BEVEL')
            m.width = bevel; m.segments = 2; m.limit_method = 'ANGLE'
            m.harden_normals = False
        return link(o, parent)

    # ---- floor and the cut-away shell (an architectural model: walls and columns sectioned at 6.2 m)
    bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, 0))
    fl = bpy.context.active_object; fl.name = 'floor'; fl.data.materials.append(MAT['floor'])
    WH = 5.2
    b, l, r = WALLS['back'], WALLS['left'], WALLS['right']
    solid('walls', [
        ((DOOR[0] - l) + 0.3, 0.3, WH, (l - 0.3 + DOOR[0]) / 2, b + 0.15, WH / 2),   # back wall, left of the door
        ((r + 0.3 - DOOR[1]), 0.3, WH, (DOOR[1] + r + 0.3) / 2, b + 0.15, WH / 2),   # right of the door
        (0.3, b + 20, WH, l - 0.15, (b - 20) / 2, WH / 2),
        (0.3, b + 20, WH, r + 0.15, (b - 20) / 2, WH / 2),
    ], MAT['machine'])
    solid('columns', [(0.42, 0.42, WH, x, y, WH / 2) for x, y in COLUMNS], MAT['machine'])
    # AmIMo anchors: true size (59.0 x 28.6 x 105.6 mm), on the column face toward the floor they cover, 4.6 m up
    anc = []
    for x, y in ANCHOR_COLS:
        anc.append((0.059, 0.029, 0.106, x + 0.0, y - 0.21 - 0.0145, 4.2))
    solid('anchors', anc, MAT['hardware'], bevel=0.004)

    # ---- floor outlines (pale grey paint, not colour): inspection zone, the queue, the staging lane
    def outline(name, x0, x1, y0, y1, w=0.06, z=0.0008):
        # top face at 1.4 mm, under the ink (2.5 mm and up), so no two marks share a plane
        parts = [(x1 - x0 + w, w, 0.0012, (x0 + x1) / 2, y0, z), (x1 - x0 + w, w, 0.0012, (x0 + x1) / 2, y1, z),
                 (w, y1 - y0 - w - 0.002, 0.0012, x0, (y0 + y1) / 2, z), (w, y1 - y0 - w - 0.002, 0.0012, x1, (y0 + y1) / 2, z)]
        solid(name, parts, MAT['outline'], bevel=0)
    outline('zone_inspect', *INSPECT_ZONE)
    outline('zone_queue', *QUEUE)
    outline('zone_staging', *STAGING)

    # ---- machines
    for i, (px, py) in enumerate(PRESSES):
        solid(f'press{i}', [
            (3.0, 2.4, 0.9, px, py, 0.45),                 # bed
            (0.55, 2.0, 3.4, px - 1.15, py, 1.7),          # uprights
            (0.55, 2.0, 3.4, px + 1.15, py, 1.7),
            (3.0, 2.3, 1.1, px, py, 3.75),                 # crown
            (1.6, 1.5, 0.5, px, py, 2.6),                  # slide
            (1.8, 0.9, 0.9, px - 0.2, py + 1.85, 0.45),    # side unit
        ], MAT['machine'])
    # a long machine line along the left wall (simplified massing)
    solid('line', [(2.2, 8.0, 1.6, -9.8, 6.0, 0.8), (1.4, 3.0, 2.4, -9.8, 3.6, 1.2)], MAT['machine'])
    # inspection station: a measuring table with a gantry bridge
    ix, iy = INSPECT['c']
    solid('inspect', [
        (2.4, 1.2, 0.85, ix, iy + 0.9, 0.425),
        (0.22, 0.22, 1.1, ix - 1.05, iy + 0.9, 0.85 + 0.55),
        (0.22, 0.22, 1.1, ix + 1.05, iy + 0.9, 0.85 + 0.55),
        (2.44, 0.26, 0.26, ix, iy + 0.9, 2.08),
        (0.26, 0.3, 0.45, ix + 0.2, iy + 0.9, 1.75),
    ], MAT['machine'])
    # racks: uprights, beams and loads (boxes on pallets) on three levels
    for j, (rx, y0, y1) in enumerate(RACKS):
        parts = []
        n = int(round((y1 - y0) / 2.7))
        for k in range(n + 1):
            yy = y0 + k * (y1 - y0) / n
            for dx in (-0.55, 0.55):
                parts.append((0.1, 0.1, RACK_H, rx + dx, yy, RACK_H / 2))
        for lev in (0.15, 1.2, 2.25):
            for dx in (-0.55, 0.55):
                parts.append((0.08, y1 - y0, 0.12, rx + dx, (y0 + y1) / 2, lev + 0.1))
        import random
        rnd = random.Random(10 + j)
        for k in range(n):
            yc = y0 + (k + 0.5) * (y1 - y0) / n
            for lev in (0.15, 1.2, 2.25):
                if rnd.random() < 0.78:
                    hgt = rnd.choice((0.6, 0.75, 0.85))
                    parts.append((1.0, 1.15, hgt, rx, yc - 0.62, lev + 0.18 + hgt / 2))
                if rnd.random() < 0.78:
                    hgt = rnd.choice((0.6, 0.75, 0.85))
                    parts.append((1.0, 1.15, hgt, rx, yc + 0.62, lev + 0.18 + hgt / 2))
        solid(f'rack{j}', parts, MAT['machine'])
    # checkpoint desks: a small table with a box on it (the scan point). No screen, no sign.
    for i, (dx, dy, rz) in enumerate(DESKS):
        solid(f'desk{i}', [(1.1, 0.6, 0.08, 0, 0, 0.78), (0.08, 0.5, 0.74, -0.48, 0, 0.37), (0.08, 0.5, 0.74, 0.48, 0, 0.37),
                           (0.3, 0.24, 0.16, 0.2, 0.0, 0.9)], MAT['machine'])
        o = bpy.data.objects[f'desk{i}']
        o.location = (dx + (0.0 if rz else 0.0), dy, 0); o.rotation_euler = (0, 0, math.radians(rz))
    # a few still things for scale and calm: two parked pallets in staging, a bin rack by press 2
    solid('stillpallets', [(1.2, 1.0, 0.14, 5.6, 2.6, 0.07), (1.0, 0.8, 0.8, 5.6, 2.6, 0.54)], MAT['machine'])

    # ---- movers (built at origin facing +x, parented to an empty that the clock drives)
    def tagbox(px, py, pz):
        return (0.086, 0.059, 0.023, px, py, pz)   # AmIGo: 86 x 59 x 23.2 mm (CAD assembly)

    def trolley(root, load=True):
        # platform trolley 1.2 x 0.7: deck, top shelf, four posts, push handle at the back (-x)
        parts = [(1.2, 0.7, 0.05, 0, 0, 0.26), (1.2, 0.7, 0.04, 0, 0, 0.82)]
        for sx in (-0.56, 0.56):
            for sy in (-0.31, 0.31):
                parts.append((0.04, 0.04, 0.6, sx, sy, 0.54))
                parts.append((0.09, 0.09, 0.2, sx * 0.92, sy * 0.92, 0.1))   # casters, simplified
        parts += [(0.04, 0.04, 0.5, -0.66, -0.28, 1.05), (0.04, 0.04, 0.5, -0.66, 0.28, 1.05),
                  (0.04, 0.6, 0.04, -0.66, 0, 1.3)]
        if load:
            parts += [(0.5, 0.55, 0.3, -0.25, 0, 0.44), (0.45, 0.5, 0.3, 0.3, 0, 0.44), (0.7, 0.5, 0.22, 0.0, 0, 0.95)]
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.45, 0.2, 0.85)], MAT['hardware'], parent=root, bevel=0.004)

    def pallet(root):
        solid(root.name + '_body', [(1.2, 1.0, 0.14, 0, 0, 0.07), (1.1, 0.9, 0.55, 0, 0, 0.42), (0.8, 0.7, 0.4, 0.05, 0, 0.9)],
              MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.61, 0.0, 0.08)], MAT['hardware'], parent=root, bevel=0.004)

    def forklift(root):
        parts = [(1.7, 1.05, 0.75, 0, 0, 0.5), (0.7, 1.0, 0.55, -0.55, 0, 1.12),   # body, counterweight
                 (0.9, 0.95, 0.05, 0.1, 0, 2.05)]                                   # overhead guard roof
        for sx in (-0.3, 0.5):
            for sy in (-0.45, 0.45):
                parts.append((0.06, 0.06, 1.2, sx, sy, 1.45))
        parts += [(0.12, 0.85, 2.2, 0.95, 0, 1.15),                                 # mast
                  (1.0, 0.12, 0.05, 1.5, -0.25, 0.12), (1.0, 0.12, 0.05, 1.5, 0.25, 0.12)]  # forks
        for sx in (-0.5, 0.55):
            for sy in (-0.5, 0.5):
                parts.append((0.5, 0.18, 0.5, sx, sy, 0.25))                        # wheels as blocks
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(-0.1, 0.0, 0.89)], MAT['hardware'], parent=root, bevel=0.004)

    def tugger_unit(root):
        parts = [(1.4, 0.85, 0.7, 0, 0, 0.45), (0.5, 0.8, 0.5, -0.35, 0, 1.05), (0.04, 0.6, 0.04, 0.0, 0, 1.0)]
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.4, 0.0, 0.81)], MAT['hardware'], parent=root, bevel=0.004)

    def tugger_cart(root):
        parts = [(1.5, 0.8, 0.06, 0, 0, 0.32), (0.6, 0.38, 0.3, -0.35, -0.2, 0.5), (0.6, 0.38, 0.3, 0.35, -0.2, 0.5),
                 (0.6, 0.38, 0.3, -0.35, 0.2, 0.5), (0.6, 0.38, 0.3, 0.35, 0.2, 0.5), (0.3, 0.06, 0.06, 0.88, 0, 0.3)]
        for sx in (-0.6, 0.6):
            for sy in (-0.3, 0.3):
                parts.append((0.12, 0.12, 0.26, sx, sy, 0.13))
        solid(root.name + '_body', parts, MAT['machine'], parent=root)

    def amr(root):
        parts = [(1.0, 0.7, 0.28, 0, 0, 0.18), (0.8, 0.6, 0.04, 0, 0, 0.34),
                 (0.7, 0.55, 0.45, 0, 0, 0.6)]   # carries a closed tote stack
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.0, 0.0, 0.84)], MAT['hardware'], parent=root, bevel=0.004)

    def toolcart(root):
        parts = [(0.8, 0.5, 0.8, 0, 0, 0.5), (0.85, 0.55, 0.04, 0, 0, 0.92), (0.04, 0.4, 0.04, -0.45, 0, 1.0)]
        for sx in (-0.33, 0.33):
            for sy in (-0.2, 0.2):
                parts.append((0.08, 0.08, 0.1, sx, sy, 0.05))
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.0, 0.0, 0.95)], MAT['hardware'], parent=root, bevel=0.004)

    def fixture(root):
        parts = [(1.0, 0.8, 0.5, 0, 0, 0.25), (0.8, 0.6, 0.35, 0, 0, 0.68), (0.2, 0.6, 0.3, 0.3, 0, 1.0)]
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.0, 0.0, 0.875)], MAT['hardware'], parent=root, bevel=0.004)

    def binobj(root):
        parts = [(0.6, 0.4, 0.32, 0, 0, 0.16 + 0.42), (0.7, 0.5, 0.42, 0, 0, 0.21)]   # bin on a low stand
        solid(root.name + '_body', parts, MAT['machine'], parent=root)
        solid(root.name + '_tag', [tagbox(0.0, 0.0, 0.75)], MAT['hardware'], parent=root, bevel=0.004)

    roots = {}
    builders = dict(trolley=trolley, pallet=pallet, forklift=forklift, amr=amr, toolcart=toolcart,
                    fixture=fixture, bin=binobj)
    for key, (kind, bname) in MOVERS.items():
        if kind == 'tugger':
            for i in range(4):
                e = bpy.data.objects.new(f'tug{i}', None); link(e)
                (tugger_unit if i == 0 else tugger_cart)(e)
                roots[f'tug{i}'] = e
            continue
        e = bpy.data.objects.new(key, None); link(e)
        builders[bname](e)
        roots[key] = e

    # ---- light: a big soft key high to the left and behind, and a dome fill (a model on a light table)
    w = bpy.data.worlds.new('world'); sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (1.0, 1.0, 1.0, 1)
    bg.inputs['Strength'].default_value = float(opt('--world', 0.67))
    ld = bpy.data.lights.new('key', 'AREA')
    ld.shape = 'DISK'; ld.size = 26.0; ld.energy = float(opt('--key', 16500.0)); ld.color = (1.0, 0.995, 0.985)
    ld.use_shadow = True
    try:
        ld.cycles.max_bounces = 3
    except Exception:
        pass
    lo = bpy.data.objects.new('key', ld); link(lo)
    lo.location = (-26.0, 34.0, 38.0)
    d = Vector((0, 8, 0)) - lo.location
    lo.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

    # ---- camera A
    cd = bpy.data.cameras.new('A'); cd.lens = CAM['lens']; cd.sensor_width = 36.0; cd.sensor_fit = 'AUTO'
    cd.clip_start = 0.5; cd.clip_end = 300
    co = bpy.data.objects.new('A', cd); link(co); sc.camera = co
    yaw = math.radians(CAM['yaw']); pitch = math.radians(CAM['pitch'])
    hd = CAM['height'] / math.tan(pitch)
    tx, ty = CAM['target']
    co.location = (tx - hd * math.sin(yaw), ty - hd * math.cos(yaw), CAM['height'])
    look = Vector((tx, ty, 0)) - co.location
    co.rotation_euler = look.to_track_quat('-Z', 'Y').to_euler()
    cd.dof.use_dof = False

    # ink layer: a container mesh object rebuilt each frame
    me = bpy.data.meshes.new('ink'); ink = bpy.data.objects.new('ink', me); link(ink)
    ink.data.materials.append(MAT['blue']); ink.data.materials.append(MAT['amber'])
    return dict(roots=roots, ink=ink, MAT=MAT)


def ribbon_into(bm, pts, w, z, mat_index):
    """Flat ink ribbon of width w along pts, with round caps."""
    from mathutils import Vector
    if len(pts) < 2:
        return
    # drop near-duplicates
    q = [pts[0]]
    for p in pts[1:]:
        if math.hypot(p[0] - q[-1][0], p[1] - q[-1][1]) > 0.01:
            q.append(p)
    if len(q) < 2:
        return
    hw = w / 2
    left, right = [], []
    for i, p in enumerate(q):
        a = q[max(0, i - 1)]; b = q[min(len(q) - 1, i + 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        left.append(bm.verts.new((p[0] + nx * hw, p[1] + ny * hw, z)))
        right.append(bm.verts.new((p[0] - nx * hw, p[1] - ny * hw, z)))
    for i in range(len(q) - 1):
        f = bm.faces.new((left[i], right[i], right[i + 1], left[i + 1])); f.material_index = mat_index
    for end in (0, len(q) - 1):
        p = q[end]; nb = q[1] if end == 0 else q[-2]
        ang = math.atan2(p[1] - nb[1], p[0] - nb[0])
        c = bm.verts.new((p[0], p[1], z))
        ring = []
        for k in range(13):
            a = ang - math.pi / 2 + math.pi * k / 12
            ring.append(bm.verts.new((p[0] + math.cos(a) * hw, p[1] + math.sin(a) * hw, z)))
        for k in range(12):
            f = bm.faces.new((c, ring[k], ring[k + 1])); f.material_index = mat_index


def rounded_rect_into(bm, cx, cy, sx, sy, rot, rad, z, mat_index):
    pts = []
    for qx, qy, a0 in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        ox, oy = qx * (sx / 2 - rad), qy * (sy / 2 - rad)
        for k in range(7):
            a = math.radians(a0 + 90 * k / 6)
            pts.append((ox + math.cos(a) * rad, oy + math.sin(a) * rad))
    c, s = math.cos(rot), math.sin(rot)
    vs = [bm.verts.new((cx + x * c - y * s, cy + x * s + y * c, z)) for x, y in pts]
    f = bm.faces.new(vs); f.material_index = mat_index


def pose(rig, t, force=None):
    """Put every mover where it is at display time t, and lay the ink."""
    import bpy, bmesh
    tau = 9.0 if force == 'after' else tau_of(t)
    roots = rig['roots']
    for key, (kind, _) in MOVERS.items():
        if kind == 'tugger':
            s = M['tug'].s(tau)
            offs = [0.0, 1.75, 3.45, 5.15]
            for i, o in enumerate(offs):
                si = s - o
                x, y = P['tug'].at(si); h = P['tug'].heading(si)
                r = roots[f'tug{i}']; r.location = (x, y, 0); r.rotation_euler = (0, 0, h)
            continue
        s = M[key].s(tau)
        x, y = P[key].at(s); h = P[key].heading(s)
        r = roots[key]; r.location = (x, y, 0); r.rotation_euler = (0, 0, h)
    trails, ticks, amber = marks_at(t, force)
    bm = bmesh.new()
    for i, seg in enumerate(trails):
        ribbon_into(bm, seg, MARK_W, 0.004 + 0.0004 * i, 0)
    for seg in ticks:
        ribbon_into(bm, seg, MARK_W, 0.004, 0)
    for key in amber:
        s = M[key].s(tau)
        x, y = P[key].at(s); h = P[key].heading(s)
        if key == 'pallet':
            rounded_rect_into(bm, x, y, 1.6, 1.4, h, 0.12, 0.0025, 1)
        else:
            rounded_rect_into(bm, x, y, 1.42, 0.98, h, 0.12, 0.0025, 1)
    me = rig['ink'].data
    bm.to_mesh(me); bm.free(); me.update()


def render_to(path, border=None):
    import bpy
    sc = bpy.context.scene
    if border:
        x0, x1, y0, y1 = border
        sc.render.use_border = True; sc.render.use_crop_to_border = True
        sc.render.border_min_x, sc.render.border_max_x = x0, x1
        sc.render.border_min_y, sc.render.border_max_y = y0, y1
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    res = opt('--res', '1600x2000')
    W, H = (int(v) for v in res.split('x'))
    scale = float(opt('--scale', 1.0))
    W, H = int(W * scale), int(H * scale)
    engine = opt('--engine', 'CYCLES')
    samples = int(opt('--samples', 32))
    force = opt('--state', None)
    border = opt('--border', None)
    border = [float(v) for v in border.split(',')] if border else None
    if '--info' in sys.argv:
        print('tick pass times (tau):', tick_pass_times())
        for k, p in P.items():
            print(k, 'length %.1f m' % p.L)
        return
    rig = build(engine, W, H, samples)
    if opt('--save'):
        pose(rig, 0.0)
        import bpy
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(opt('--save')))
        print('saved', opt('--save'))
        return
    if opt('--frames'):
        a, b = (int(v) for v in opt('--frames').split('-'))
        outdir = opt('--outdir', 'frames'); os.makedirs(outdir, exist_ok=True)
        fps = int(opt('--fps', FPS))
        for f in range(a, b + 1):
            out = os.path.join(outdir, 'f%04d.png' % f)
            if os.path.exists(out) and os.path.getsize(out) > 1000:
                continue
            t0 = time.time()
            pose(rig, f / fps, force)
            render_to(out + '.tmp.png', border)
            os.replace(out + '.tmp.png', out)
            print('FRAME', f, '%.1fs' % (time.time() - t0), flush=True)
        return
    t = float(opt('--t', 0.0))
    out = opt('--out', 'still.png')
    t0 = time.time()
    pose(rig, t, force)
    render_to(os.path.abspath(out), border)
    print('STILL', out, '%.1fs' % (time.time() - t0))


if __name__ == '__main__':
    main()
