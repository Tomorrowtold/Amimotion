"""Story-film plates of the model hall: camera A, film frame 0 (t = 0, the poster moment), 4:5. bpy, headless.

    /tmp/bpyenv/bin/python render_plates.py <outdir> [--res 2400x3000] [--samples 48] [--only all|beauty|after|before|passes]  (before = before + passes)

One process builds the hall once (03-hero-film/build_hall.py, default white-hall palette and light, exactly as the
poster master was rendered) and writes, all from the same camera and the same pose:
    raw-after.png    16-bit, Standard view: every trail and the four amber pads (the poster state)
    raw-before.png   the same frame, same seed, with the ink object hidden (no blue, no amber). Nothing else moves.
    pass-blue.png    16-bit Raw: blue ink emits white, everything else (incl. amber, floor, nearer objects) black.
                     Antialiased (Blackman-Harris 1.5 px, 64 samples, no denoise), so occlusion is exact.
    pass-amber.png   the same for the amber pads (blue ink sits above amber and hides it, as in the picture).
    pass-path.png    16-bit Raw, point-sampled at pixel centres (filter 0.01 px): R = arc fraction along the trail
                     (0 = oldest end, 1 = the mover), G = (trail index + 1) / 64, B = 1 on blue ink.
    paths-raw.json   per trail: index, mover key, 3D end points and their projected pixel coordinates.
Grade, recolour to Sky Ground and the 1600 cut happen in make_plates.py (system python).
"""
import sys, os, json, math
HERE = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.abspath(os.path.join(HERE, '..', '03-hero-film'))

argv = sys.argv[1:]
OUTDIR = os.path.abspath(argv[0])
def _o(k, d):
    return argv[argv.index(k) + 1] if k in argv else d
RES = _o('--res', '2400x3000'); SAMPLES = int(_o('--samples', 48)); ONLY = _o('--only', 'all')
os.makedirs(OUTDIR, exist_ok=True)

# build_hall reads its own flags from sys.argv at import: give it the film's (none = the poster: t 0, after).
sys.argv = ['build_hall.py']
sys.path.insert(0, FILM)
import build_hall as bh   # noqa: E402
import bpy, bmesh          # noqa: E402

W, H = (int(v) for v in RES.split('x'))
rig = bh.build('CYCLES', W, H, SAMPLES)
bh.pose(rig, 0.0, None)    # exactly what --frames writes for f0000 (t 0: state after, tau 9.0)
sc = bpy.context.scene
ink = rig['ink']

# the trails as pose() laid them, with their mover keys (same order and same z as pose(): 0.004 + 0.0004 i)
tau = bh.tau_of(0.0)
TR = []
for key, (kind, _) in bh.MOVERS.items():
    s = bh.M[key].s(tau)
    seg = bh.P[key].segment(s - bh.TRAIL_L, s)
    if seg:
        TR.append((key, seg))
chk, _, amber_keys = bh.marks_at(0.0, None)
assert len(chk) == len(TR) and all(a == b for a, b in zip(chk, [t[1] for t in TR])), 'trail list drifted from pose()'


def render(path):
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print('wrote', path, flush=True)


# ---------------------------------------------------------------- beauty: after and before (same seed)
# Ink is seen by the camera only: it casts no bounce and no shadow, so the after frame differs from the before frame
# only where ink is visible. (Lit by the same light as the floor it lies on, so it reads exactly as before. Without
# this, the darker blue ink and the amber pads tint the bounce on the bins, pallet and trolleys parked on them by up to
# 5 levels, which the Sky Ground recolour then amplifies: about 1 % of the frame off-mask. --ink-gi keeps that.)
if '--ink-gi' not in argv:
    for a in ('visible_diffuse', 'visible_glossy', 'visible_transmission', 'visible_volume_scatter', 'visible_shadow'):
        setattr(ink, a, False)

# (--only after / before / beauty / passes / all; a separate process gives the same pixels: fixed seed, same scene)
if ONLY in ('all', 'beauty', 'after'):
    ink.hide_render = False
    render(os.path.join(OUTDIR, 'raw-after.png'))
if ONLY in ('all', 'beauty', 'before'):
    ink.hide_render = True
    render(os.path.join(OUTDIR, 'raw-before.png'))
    ink.hide_render = False

if ONLY not in ('all', 'passes', 'before'):
    sys.exit(0)

# ---------------------------------------------------------------- emission-only passes
def emit_mat(m, rgb=(0, 0, 0), attr=None):
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Strength'].default_value = 1.0
    em.inputs['Color'].default_value = (*rgb, 1.0)
    if attr:
        at = nt.nodes.new('ShaderNodeAttribute'); at.attribute_type = 'GEOMETRY'; at.attribute_name = attr
        nt.links.new(at.outputs['Color'], em.inputs['Color'])
    nt.links.new(em.outputs['Emission'], out.inputs['Surface'])


MAT = rig['MAT']
for k in ('floor', 'machine', 'hardware', 'outline'):
    emit_mat(MAT[k])
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.0
bpy.data.objects['key'].hide_render = True
cy = sc.cycles
cy.max_bounces = 0; cy.diffuse_bounces = 0; cy.glossy_bounces = 0
cy.use_adaptive_sampling = False; cy.use_denoising = False
sc.render.dither_intensity = 0.0
sc.view_settings.view_transform = 'Raw'
sc.render.use_persistent_data = False

# blue and amber coverage, antialiased
cy.samples = 64; cy.filter_width = 1.5
emit_mat(MAT['blue'], (1, 1, 1)); emit_mat(MAT['amber'], (0, 0, 0))
render(os.path.join(OUTDIR, 'pass-blue.png'))
emit_mat(MAT['blue'], (0, 0, 0)); emit_mat(MAT['amber'], (1, 1, 1))
render(os.path.join(OUTDIR, 'pass-amber.png'))

# per-trail ribbons carrying (arc fraction, index, 1); same geometry as build_hall.ribbon_into
pm = bpy.data.materials.new('pathdata'); pm.use_nodes = True
emit_mat(pm, attr='pd')


def ribbon_attr(pts, w, z, idx):
    q = [pts[0]]
    for p in pts[1:]:
        if math.hypot(p[0] - q[-1][0], p[1] - q[-1][1]) > 0.01:
            q.append(p)
    if len(q) < 2:
        return None
    s = [0.0]
    for i in range(1, len(q)):
        s.append(s[-1] + math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]))
    L = s[-1]
    bm = bmesh.new()
    vals = {}
    hw = w / 2; left, right = [], []
    for i, p in enumerate(q):
        a = q[max(0, i - 1)]; b = q[min(len(q) - 1, i + 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]; Ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / Ln, dx / Ln
        for lst, sg in ((left, 1), (right, -1)):
            v = bm.verts.new((p[0] + sg * nx * hw, p[1] + sg * ny * hw, z)); lst.append(v); vals[v] = s[i] / L
    for i in range(len(q) - 1):
        bm.faces.new((left[i], right[i], right[i + 1], left[i + 1]))
    for end in (0, len(q) - 1):
        p = q[end]; nb = q[1] if end == 0 else q[-2]; f = 0.0 if end == 0 else 1.0
        ang = math.atan2(p[1] - nb[1], p[0] - nb[0])
        c = bm.verts.new((p[0], p[1], z)); vals[c] = f
        ring = []
        for k in range(13):
            a = ang - math.pi / 2 + math.pi * k / 12
            v = bm.verts.new((p[0] + math.cos(a) * hw, p[1] + math.sin(a) * hw, z)); vals[v] = f; ring.append(v)
        for k in range(12):
            bm.faces.new((c, ring[k], ring[k + 1]))
    me = bpy.data.meshes.new(f'path{idx}')
    bm.verts.index_update()
    order = list(bm.verts)
    bm.to_mesh(me); bm.free()
    at = me.color_attributes.new('pd', 'FLOAT_COLOR', 'POINT')
    for i, v in enumerate(order):
        at.data[i].color = (vals[v], (idx + 1) / 64.0, 1.0, 1.0)
    o = bpy.data.objects.new(f'path{idx}', me); sc.collection.objects.link(o)
    o.data.materials.append(pm)
    return o


for i, (key, seg) in enumerate(TR):
    ribbon_attr(seg, bh.MARK_W, 0.004 + 0.0004 * i, i)
ink.hide_render = True
cy.samples = 1; cy.filter_width = 0.01
render(os.path.join(OUTDIR, 'pass-path.png'))

# projected end points
from bpy_extras.object_utils import world_to_camera_view  # noqa: E402
from mathutils import Vector  # noqa: E402
cam = sc.camera
def px(p):
    v = world_to_camera_view(sc, cam, Vector((p[0], p[1], 0.004)))
    return [round(v.x * W, 2), round((1 - v.y) * H, 2)]
info = dict(res=[W, H], t=0.0, tau=tau, amber=amber_keys, paths=[])
for i, (key, seg) in enumerate(TR):
    L = sum(math.hypot(seg[j][0] - seg[j - 1][0], seg[j][1] - seg[j - 1][1]) for j in range(1, len(seg)))
    info['paths'].append(dict(index=i, mover=key, kind=bh.MOVERS[key][0], length_m=round(L, 3),
                              start_xy_m=[round(c, 3) for c in seg[0]], end_xy_m=[round(c, 3) for c in seg[-1]],
                              start_px_projected=px(seg[0]), end_px_projected=px(seg[-1])))
json.dump(info, open(os.path.join(OUTDIR, 'paths-raw.json'), 'w'), indent=1)
print('paths', [(p['index'], p['mover']) for p in info['paths']])
