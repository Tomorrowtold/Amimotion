# "Can you see it?" floor: one plant hall seen from a mezzanine (eye) and from straight above (top).
# Exports the screen position of every tagged thing and of each path, so the page can draw points and trails on top.
import sys, math, json, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
import models as MD
import scene_plant as SP
from bpy_extras.object_utils import world_to_camera_view

import bmesh, kit
def fbox(name, size, loc, m, bevel=.004, parent=None, segs=3):      # same as kit.box without bpy.ops (ops get slow in big scenes)
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts: v.co.x *= size[0]; v.co.y *= size[1]; v.co.z *= size[2]
    bm.to_mesh(me); bm.free(); me.polygons.foreach_set('use_smooth', [True] * len(me.polygons))
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o); o.location = loc
    if bevel:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = 2; md.limit_method = 'ANGLE'
        o.modifiers.new('wn', 'WEIGHTED_NORMAL')
    me.materials.append(m); return link(o, parent)
def fcyl(name, r, h, loc, m, rot=(0, 0, 0), verts=32, bevel=.002, parent=None):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=h)
    bm.to_mesh(me); bm.free(); me.polygons.foreach_set('use_smooth', [True] * len(me.polygons))
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o); o.location = loc; o.rotation_euler = rot
    if bevel:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = 2; md.limit_method = 'ANGLE'
    me.materials.append(m); return link(o, parent)
for mod in (kit, MD, SP): mod.box = fbox; mod.cyl = fcyl
box = fbox; cyl = fcyl
TAGS = []   # (id, kind, x, y, z, state, minutes)
def tag(i, kind, x, y, z=1.0, state='moving', mins=0): TAGS.append(dict(id=i, kind=kind, p=(x, y, z), state=state, mins=mins))

PATHS = {   # where each moving thing came from, on the floor (metres)
    'T-03': [(7.5, 8.5), (7.5, 10.2), (12.0, 10.2)],
    'T-07': [(23.4, 15.5), (21.2, 15.5), (21.2, 10.4), (23.4, 10.4), (23.4, 6.0)],
    'T-14': [(7.6, 6.0), (7.6, 10.3), (20.9, 10.3), (20.9, 12.6)],
    'FL-1': [(26.5, 23.2), (21.1, 23.2), (21.1, 17.6)],
    'AMR-2': [(21.3, 3.0), (21.3, 8.6), (16.0, 8.9)],
    'P-21': [(18.5, 19.6), (22.0, 19.6), (24.0, 21.3)],
    'B-11': [(3.0, 16.0), (3.0, 12.0)],
}

def build(w, h, samples, cam='eye', dim=1.0, glow=None):
    clear(); mats()
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples
    sc.cycles.use_denoising = True; sc.render.resolution_x = w; sc.render.resolution_y = h
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 4
    world = bpy.data.worlds.new('w'); world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (.55, .62, .72, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = .28 * dim; sc.world = world
    box('floor', (40, 34, .02), (15, 12, -.01), mat('floor2', (.34, .35, .36), rough=.28, noise=.7, noise_scale=2.2, bump=.015), bevel=0)
    wallm = mat('wall2', (.62, .63, .63), rough=.8); band = mat('band', (.16, .2, .3), rough=.7)
    box('backwall', (40, .3, 11), (15, 25.2, 5.5), wallm, bevel=0); box('bandb', (40, .32, 1.4), (15, 25.19, .7), band, bevel=0)
    box('leftwall', (.3, 34, 11), (-2.2, 12, 5.5), wallm, bevel=0); box('rightwall', (.3, 34, 11), (32.2, 12, 5.5), wallm, bevel=0)
    box('roof', (40, 34, .2), (15, 12, 11.1), mat('roof', (.5, .51, .52), rough=.9), bevel=0)
    for cx in (-2.0, 6.5, 15, 23.5, 32.0):   # columns along the back, where anchors sit
        box('col', (.4, .4, 11), (cx, 24.9, 5.5), mat('colm', (.5, .51, .52), rough=.6), bevel=.01)
    for cx in (6.5, 15, 23.5):
        box('colm', (.35, .35, 11), (cx, 12.2, 5.5), bpy.data.materials['colm'], bevel=.01)
    for dx in (18.5, 22.5, 26.5):
        box('door', (3, .05, 4.0), (dx, 25.02, 2.0), mat('door', (.72, .74, .76), rough=.4, metal=.5), bevel=0)
    yel = mat('paint', (.85, .62, .03), rough=.6); wht = mat('paintw', (.82, .82, .8), rough=.6); grn = mat('paintg', (.1, .42, .25), rough=.6)
    L = SP.floor_line
    for a in [(1, 9.4, 29, 9.4), (1, 11.2, 29, 11.2), (20.2, 1, 20.2, 23), (22.0, 1, 22.0, 23), (1, 18.6, 29, 18.6), (1, 20.4, 29, 20.4)]: L(*a, yel)
    for a in [(9, 3.2, 14.5, 3.2), (9, 7.6, 14.5, 7.6), (9, 3.2, 9, 7.6), (14.5, 3.2, 14.5, 7.6)]: L(*a, grn, .12)   # inspection bay
    for i in range(7): L(23 + i * .7, 21.2, 23.4 + i * .7, 22.6, wht, .3)
    SP.press('press', (4.2, 5.0, 0)); MD.tool_chest('tools', (6.9, 3.4, 0)); tag('TC-2', 'Tool chest', 6.9, 3.4, 1.0, 'still')
    SP.rack_row('rackA', 6.0, 19.5, 13.6, seed=1); SP.rack_row('rackB', 6.0, 19.5, 16.2, seed=2)
    SP.line2('line2', 26.0, 3.0, 16.0); SP.shelving('stores', .2, 22.6, n=5)
    # inspection bay: bench, totes waiting
    box('ibench', (2.6, .9, .9), (11.8, 6.6, .45), mat('bench', (.2, .3, .35), rough=.5)); box('ilamp', (2.2, .1, .08), (11.8, 6.6, 2.0), mat('lampb', (.9, .9, .9), rough=.3, emit=(1, 1, 1), emit_s=4 * dim))
    for sx in (-1, 1): box('ipost', (.05, .05, 2.0), (11.8 + sx * 1.1, 6.6, 1.0), M['zinc'])
    MD.totes('insp_totes', (10.0, 4.6, 0)); tag('B-08', 'Bins', 10.0, 4.6, 1.0, 'wait', 26)
    MD.person('insp', (12.2, 5.8, 0), rotz=math.pi * .5, seed=3); tag('Badge-3', 'Badge', 12.2, 5.8, 1.35, 'still')
    # trolleys
    def tro(i, x, y, rz, state='moving', mins=0):
        t = MD.trolley(i, (x, y, 0)); t.rotation_euler.z = rz; tag(i, 'Trolley', x, y, .95, state, mins)
    tro('T-03', 12.0, 10.2, math.pi / 2); MD.person('pusher', (11.1, 10.2, 0), rotz=-math.pi / 2, seed=5); tag('Badge-1', 'Badge', 11.1, 10.2, 1.35)
    tro('T-07', 23.4, 6.0, 0); tro('T-09', 23.4, 12.0, 0, 'still'); tro('T-11', 7.6, 7.2, math.pi, 'still')
    tro('T-14', 20.9, 12.6, 0.12, 'wait', 42)             # the one nobody is looking at: parked at the rack end
    tro('T-16', 13.4, 5.0, math.pi / 2, 'still'); tro('T-02', 3.0, 21.0, math.pi / 2, 'still')
    tro('T-21', 23.4, 15.2, 0, 'still'); tro('T-22', 7.9, 3.9, math.pi, 'still'); tro('T-24', 4.9, 12.3, math.pi / 2 + .1, 'still')
    tro('T-25', 18.9, 10.3, math.pi / 2); tro('T-27', 21.2, 5.2, .05); tro('T-28', 14.6, 12.2, math.pi / 2, 'still'); tro('T-30', 9.2, 12.2, math.pi / 2 - .08, 'still')
    MD.totes('totes4', (22.6, 8.4, 0)); tag('B-14', 'Bins', 22.6, 8.4, 1.0, 'still'); MD.totes('totes5', (5.6, 8.2, 0)); tag('B-17', 'Bins', 5.6, 8.2, 1.0, 'still')
    MD.pallet('pl5', (17.2, 12.3, 0)); tag('P-25', 'Pallet', 17.2, 12.3, 1.2, 'still')
    MD.totes('totes2', (3.0, 12.0, 0)); tag('B-11', 'Bins', 3.0, 12.0, 1.0)
    f = MD.forklift('forklift', (21.1, 17.6, 0)); f.rotation_euler.z = -math.pi / 2; tag('FL-1', 'Forklift', 21.1, 17.6, 2.0)
    a = MD.amr('amr', (16.0, 8.9, 0)); a.rotation_euler.z = math.pi / 2; tag('AMR-2', 'Robot', 16.0, 8.9, .35)
    for k, (px, py, st, mn) in enumerate([(24.0, 21.3, 'moving', 0), (25.6, 21.3, 'still', 0), (28.0, 21.6, 'wait', 12)]):
        MD.pallet('dockp%d' % k, (px, py, 0)); tag('P-2%d' % (k + 1), 'Pallet', px, py, 1.2, st, mn)
    MD.person('sup', (17.6, 5.4, 0), rotz=math.pi * .8, seed=9); tag('Badge-2', 'Badge', 17.6, 5.4, 1.35, 'still')
    MD.person('walker', (4.6, 10.3, 0), rotz=-math.pi / 2, seed=11); tag('Badge-4', 'Badge', 4.6, 10.3, 1.35)
    tro('T-18', 18.6, 2.2, math.pi / 2 + .2, 'still'); MD.pallet('fgp', (10.4, 1.0, 0)); tag('P-24', 'Pallet', 10.4, 1.0, 1.2, 'still')
    MD.totes('totes3', (15.8, 3.6, 0)); tag('B-05', 'Bins', 15.8, 3.6, 1.0, 'still')
    for i in range(5):
        for j in range(4):
            bpy.ops.object.light_add(type='AREA', location=(-1 + i * 8, 1 + j * 7.5, 10)); l = bpy.context.active_object
            l.data.energy = 620 * dim; l.data.size = 3.0; l.data.color = (1, .97, .93)
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 20)); s = bpy.context.active_object; s.data.energy = 1.2 * dim; s.data.color = (.85, .9, 1)
    s.rotation_euler = (math.radians(38), math.radians(-22), 0)
    if glow:      # light thrown by the points themselves, for the page to add on top of the picture
        for t in TAGS:
            if glow == 'amber' and t['state'] != 'wait': continue
            amber = t['state'] == 'wait' and glow in ('amber', 'both')
            bpy.ops.object.light_add(type='POINT', location=(t['p'][0], t['p'][1] - .35, t['p'][2] + .25)); l = bpy.context.active_object
            l.data.color = (1, .62, .18) if amber else (.25, .5, 1); l.data.shadow_soft_size = .08
            l.data.energy = (36 if t['mins'] == 42 else 16) if amber else 7
    portrait = h > w
    if cam == 'top':
        bpy.ops.object.camera_add(location=(15, 12.2, 60)); c = bpy.context.active_object; c.data.type = 'ORTHO'
        c.data.ortho_scale = 27 if portrait else 34; c.rotation_euler = (0, 0, math.pi / 2 if portrait else 0)
    else:
        bpy.ops.object.camera_add(); c = bpy.context.active_object
        place(c, float(cam) if cam != 'eye' else 0.0, portrait)
    sc.camera = c
    bpy.data.objects['roof'].visible_camera = c.location.z < 10.5
    return sc, c

def place(c, t, portrait):
    # 0 = the mezzanine view, 1 = straight down on the whole floor. Portrait turns a quarter as it rises so the long side of the floor runs down the phone.
    from mathutils import Quaternion
    e = t * t * (3 - 2 * t)
    a, tg0 = (Vector((16.5, -2.5, 6.4)), Vector((16.8, 9.0, 1.0))) if portrait else (Vector((15.5, -6.0, 5.2)), Vector((15.5, 9.5, 1.2)))
    loc = a.lerp(Vector((15.5 if portrait else 15.0, 12.2, 46)), e); tg = tg0.lerp(Vector((15.5 if portrait else 15.0, 12.2, 0)), e)
    if e > .999: tg.y += .01
    c.location = loc; q = (tg - loc).to_track_quat('-Z', 'Y')
    if portrait: q = q @ Quaternion((0, 0, 1), -e * math.pi / 2)
    c.rotation_euler = q.to_euler(); c.data.lens = (19 if portrait else 24) + 30 * e
    if 'roof' in bpy.data.objects: bpy.data.objects['roof'].visible_camera = loc.z < 10.5

# ---------- the pull-back out of the hero ----------
# The hero's tag lies on top of trolley T-14's load. The camera starts on it, as close as the hero is, and backs away to the
# mezzanine view. The whole plant is a white model here, in the hero's own light, so the hero and this floor are one place.
def clayify(sc):
    clay = mat('clay', (.74, .77, .83), rough=.62); fl = mat('clayfloor', (.72, .76, .83), rough=.5)
    for o in bpy.data.objects:
        if o.type not in ('MESH', 'CURVE'): continue
        for i, m in enumerate(o.data.materials):
            if m is None or not m.name.startswith('amigo'): o.data.materials[i] = fl if o.name.startswith('floor') else clay
        for sl in o.material_slots:
            if sl.link == 'OBJECT' and not (sl.material and sl.material.name.startswith('amigo')): sl.material = clay
    w = sc.world.node_tree.nodes['Background']; w.inputs['Color'].default_value = (.9, .94, 1, 1); w.inputs['Strength'].default_value = .36
    for o in bpy.data.objects:
        if o.type == 'LIGHT' and o.data.type == 'AREA': o.data.energy = 95; o.data.color = (1, 1, 1)
        if o.type == 'LIGHT' and o.data.type == 'SUN': o.data.energy = 1.5; o.data.angle = math.radians(18)
    bpy.data.objects['roof'].hide_render = True
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0

def hero_tag(sc):
    bpy.context.view_layer.update(); t = bpy.data.objects['T-14']; dg = bpy.context.evaluated_depsgraph_get()
    # the highest flat spot on the load: a point whose neighbours are at the same height
    best = None
    for i in range(-8, 9):
        for j in range(-5, 6):
            px, py = t.location.x + i * .05, t.location.y + j * .05
            zs = [sc.ray_cast(dg, Vector((px + dx, py + dy, 3)), Vector((0, 0, -1)))[1].z for dx, dy in ((0, 0), (.08, 0), (-.08, 0), (0, .08), (0, -.08))]
            if max(zs) - min(zs) < .002 and (best is None or zs[0] > best[2] + .001 or (abs(zs[0] - best[2]) < .001 and abs(i) + abs(j) < best[3])): best = (px, py, zs[0], abs(i) + abs(j))
    x, y, z = best[:3]; hit, loc = True, Vector((x, y, z))
    g = amigo('hero_tag', (x, y, z + .001), '+Z', rotz=HERO_RZ); bpy.context.view_layer.update()
    bb = [g.matrix_world @ Vector(c) for ch in g.children for c in ch.bound_box]
    print('HERO', hit, tuple(round(v, 3) for v in loc), 'bbox', [round(min(b[i] for b in bb), 3) for i in range(3)], [round(max(b[i] for b in bb), 3) for i in range(3)], flush=True)
    return Vector((x, y, z + .012))

HERO_RZ, PULL0 = float(os.environ.get('HERO_RZ', .75)), dict(el=float(os.environ.get('HERO_EL', 32)), az=-8, dist=.19, lens=58)
def pull_place(c, t, portrait, tagp):
    eye, tg0, lens1 = (Vector((16.5, -2.5, 6.4)), Vector((16.8, 9.0, 1.0)), 19) if portrait else (Vector((15.5, -6.0, 5.2)), Vector((15.5, 9.5, 1.2)), 24)
    el, az = math.radians(PULL0['el']), math.radians(PULL0['az'])
    d0 = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))); v1 = eye - tagp; d1 = v1.normalized()
    e = t * t * (3 - 2 * t)
    dist = PULL0['dist'] * (v1.length / PULL0['dist']) ** t            # equal steps of scroll are equal steps of scale
    d = d0.slerp(d1, e); loc = tagp + d * dist; tg = tagp.lerp(tg0, dist / v1.length * e * e)   # the tag stays the centre until it is too small to see
    if t >= 1: loc, tg = eye, tg0
    c.location = loc; c.rotation_euler = (tg - loc).to_track_quat('-Z', 'Y').to_euler(); c.data.lens = PULL0['lens'] + (lens1 - PULL0['lens']) * e
    c.data.clip_start = .02

def export(sc, c, path):
    bpy.context.view_layer.update()
    def pj(p):
        v = world_to_camera_view(sc, c, Vector(p)); return [round(v.x, 4), round(1 - v.y, 4)]
    out = dict(tags=[dict(id=t['id'], kind=t['kind'], state=t['state'], mins=t['mins'], xy=pj(t['p']), floor=pj((t['p'][0], t['p'][1], 0))) for t in TAGS],
               paths={k: [pj((x, y, .02)) for x, y in dens(v)] for k, v in PATHS.items()},
               zones={k: pj((x, y, .02)) for k, (x, y) in {'Inspection': (11.75, 3.75), 'Racks': (12.75, 14.9), 'Line 2': (28.5, 9.5), 'Press': (4.2, 7.4)}.items()},
               anchors=[pj((cx, cy, 8.5)) for cx, cy in [(-2.0, 24.7), (6.5, 24.7), (15, 24.7), (23.5, 24.7), (32, 24.7), (6.5, 12.2), (15, 12.2), (23.5, 12.2)]])
    json.dump(out, open(path, 'w'))

def dens(pts, step=.5):
    o = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / step))
        o += [(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n) for i in range(n)]
    return o + [pts[-1]]

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]
    out, w, h, s, cam = a[0], int(a[1]), int(a[2]), int(a[3]), a[4]
    dim = float(a[5]) if len(a) > 5 else 1.0
    glow = a[6] if len(a) > 6 else None
    if cam.startswith('pull:'):          # out is a folder: the frames of the pull-back, in the white model. Optional 7th arg: only these frames.
        n = int(cam[5:]); sc, c = build(w, h, s, '0', 1.0, None); clayify(sc); tp = hero_tag(sc); os.makedirs(out, exist_ok=True)
        only = [int(x) for x in a[6].split(',')] if len(a) > 6 else range(n + 1)
        for i in only:
            f = os.path.join(out, '%02d' % i)
            if os.path.exists(f + '.png'): continue
            pull_place(c, i / n, h > w, tp); sc.render.filepath = f + '.png'; bpy.ops.render.render(write_still=True); print('FRAME', i, flush=True)
    elif cam.startswith('rise:'):          # out is a folder: one frame and one json per step of the rise
        n = int(cam[5:]); sc, c = build(w, h, s, '0', dim, glow); os.makedirs(out, exist_ok=True)
        for i in range(n + 1):
            f = os.path.join(out, '%02d' % i)
            if os.path.exists(f + '.png'): continue
            place(c, i / n, h > w); export(sc, c, f + '.json'); sc.render.filepath = f + '.png'; bpy.ops.render.render(write_still=True); print('FRAME', i, flush=True)
    else:
        sc, c = build(w, h, s, cam, dim, glow); export(sc, c, out.rsplit('.', 1)[0] + '.json')
        sc.render.filepath = out; bpy.ops.render.render(write_still=True)
