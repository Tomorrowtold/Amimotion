# The bay: one small, complete piece of a plant, lit like a studio model, seen from one fixed high angle.
# usage: python bay.py out.exr W H SPP      env CLAY=1 renders everything in one pale material ("not known")
#        env ONLY=<kind> renders only the moving things of that kind on a shadow-catching floor (sprites, see sprites.py)
import sys, math, os, json, time; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, plant as P
from mathutils import Vector, Matrix
rad = math.radians
OUT, W, H, SPP = os.path.abspath(sys.argv[-4]), int(sys.argv[-3]), int(sys.argv[-2]), int(sys.argv[-1])
CLAY = os.environ.get('CLAY') == '1'
P.reset(); sc = P.sc; R = P.R
def lin(h):   # sRGB hex -> linear
    return tuple(((int(h[i:i + 2], 16) / 255 + .055) / 1.055) ** 2.4 if int(h[i:i + 2], 16) / 255 > .04045 else int(h[i:i + 2], 16) / 255 / 12.92 for i in (1, 3, 5)) + (1,)
INK, ACT, BLUE, SKY, PALE = lin('#0b1238'), lin('#4b3df0'), lin('#1f6bff'), lin('#66a5fa'), lin('#e3eeff')
# AmIMotion's own colours on everything that is made here: ink frames, blue machines, pale lines
P.worn('body', BLUE, (.25, .5), 0., 4); P.worn('yellow', (.03, .05, .16, 1), (.3, .6), 0., 6); P.worn('floorpaint', lin('#5f9af5'), (.3, .65), 0., 2.5, .004)
P.worn('powder', (.022, .032, .1, 1), (.3, .6), .2, 7); P.worn('cabyellow', ACT, (.22, .45), 0., 4); P.worn('trailerwhite', (.8, .83, .9, 1), (.35, .6), 0., 3, .006)
P.worn('amrshell', (.8, .84, .92, 1), (.28, .5), 0., 5); P.worn('wood', (.56, .5, .43, 1), (.6, .85), 0., 11, .03)
mm = P.M()

BX, BY = 30., 20.          # the slab, metres
AZ, EL = rad(124), rad(36)  # the camera looks from the south-east corner, 36 degrees down

# ------------------------------------------------------------------ ground
def pale_floor():
    m = bpy.data.materials.new('bayfloor'); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (.25, .25, .25); L.new(tc.outputs['Object'], mp.inputs['Vector'])
    t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(f'{P.PH}/hangar_concrete_floor/hangar_concrete_floor_diff_2k.jpg'); L.new(mp.outputs['Vector'], t.inputs['Vector'])
    # the scan gives the wear; the tone is lifted to a pale, cool concrete
    hs = N.new('ShaderNodeHueSaturation'); hs.inputs['Saturation'].default_value = .25; hs.inputs['Value'].default_value = 1.0; L.new(t.outputs['Color'], hs.inputs['Color'])
    mx = N.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.inputs['Factor'].default_value = .7; mx.inputs[7].default_value = (.60, .67, .82, 1)
    L.new(hs.outputs['Color'], mx.inputs[6])
    fn = N.new('ShaderNodeTexNoise'); fn.inputs['Scale'].default_value = 900; fn.inputs['Detail'].default_value = 6; L.new(tc.outputs['Object'], fn.inputs['Vector'])
    fr = N.new('ShaderNodeMapRange'); fr.inputs['From Min'].default_value = .3; fr.inputs['From Max'].default_value = .7; fr.inputs['To Min'].default_value = .93; fr.inputs['To Max'].default_value = 1.05; L.new(fn.outputs['Fac'], fr.inputs['Value'])
    fm_ = N.new('ShaderNodeMix'); fm_.data_type = 'RGBA'; fm_.blend_type = 'MULTIPLY'; fm_.inputs['Factor'].default_value = 1; L.new(mx.outputs[2], fm_.inputs[6]); L.new(fr.outputs['Result'], fm_.inputs[7]); L.new(fm_.outputs[2], b.inputs['Base Color'])
    r = N.new('ShaderNodeTexImage'); r.image = bpy.data.images.load(f'{P.PH}/hangar_concrete_floor/hangar_concrete_floor_rough_2k.jpg'); r.image.colorspace_settings.name = 'Non-Color'; L.new(mp.outputs['Vector'], r.inputs['Vector'])
    rm = N.new('ShaderNodeMapRange'); rm.inputs['To Min'].default_value = .32; rm.inputs['To Max'].default_value = .6; L.new(r.outputs['Color'], rm.inputs['Value']); L.new(rm.outputs['Result'], b.inputs['Roughness'])
    return m
fm = pale_floor()
edge = P.mat('slabedge', (.42, .49, .66, 1), .7)
slab = P.box('slab', (BX, BY, .5), (BX / 2, BY / 2, -.25), fm, .02); slab.data.materials.append(edge)
for p in slab.data.polygons:
    if abs(p.normal.z) < .5: p.material_index = 1
apron = P.box('apron', (9, 7, .5), (-4.5, 10, -.25), fm, .02); apron.data.materials.append(edge)
for p in apron.data.polygons:
    if abs(p.normal.z) < .5: p.material_index = 1
paint = mm['paint']; white = P.mat('linewhite', (.9, .92, .97, 1), .6)
def line(x0, y0, x1, y1, w=.1, m=None):
    L = math.hypot(x1 - x0, y1 - y0); P.box('line', (L, w, .004), ((x0 + x1) / 2, (y0 + y1) / 2, .002), m or paint, 0, rot=math.atan2(y1 - y0, x1 - x0))
def bayrect(x0, y0, x1, y1, m=None):
    for a in ((x0, y0, x1, y0), (x1, y0, x1, y1), (x1, y1, x0, y1), (x0, y1, x0, y0)): line(*a, .07, m)
# the main aisle (along x at y = 8..11) and the cross aisle (along y at x = 17..19.5)
for y in (8.0, 11.0):
    line(1.2, y, 16.6, y); line(19.9, y, 29, y)
for x in (17.0, 19.5):
    line(x, 11.4, x, 19); line(x, .9, x, 7.6)
# walls: low stubs on the two far sides, so the model reads as a cut-away
wallm = P.mat('baywall', (.84, .87, .94, 1), .6)
P.box('wallN', (BX, .22, 1.3), (BX / 2, BY - .11, .65), wallm, .01)
P.box('wallW1', (.22, 7.3, 1.3), (.11, 3.65, .65), wallm, .01); P.box('wallW2', (.22, 7.3, 1.3), (.11, BY - 3.65, .65), wallm, .01)
# the dock door frame and the truck backed up to it
P.box('doorL', (.3, .3, 4.2), (.15, 7.45, 2.1), mm['yellow'], .01); P.box('doorR', (.3, .3, 4.2), (.15, 12.55, 2.1), mm['yellow'], .01); P.box('doorT', (.3, 5.4, .35), (.15, 10, 4.2), mm['dark'], .01)
P.truck(0., 10.)
# columns with the real anchors
ANCH = []
for x, y in ((6., 13.), (16.5, 2.2), (25.5, 13.)):
    P.box('col', (.28, .28, 5.6), (x, y, 2.8), mm['galv'], .01); P.box('colbase', (.5, .5, .35), (x, y, .175), mm['yellow'], .01)
    P.amimo((x, y - .2, 5.2), rad(0)); ANCH.append((x, y - .2, 5.25))

# ------------------------------------------------------------------ the static things
def pal(x, y, k, r=None):
    r = (R.uniform(-.04, .04) if r is None else r)
    if k == 'b': P.stack_boxes(x, y, R.choice([2, 3, 3]), r)
    elif k == 'c': P.stack_crates(x, y, R.choice([2, 3]), r)
    elif k == 'w': P.wrapped(x, y, R.uniform(.9, 1.4), r)
    else: P.place('cage', (x, y, 0), r, builder=P.b_cage)
    P.THINGS.append(['pallet', x, y])
# line 4: along the north wall, four stations and their line-side bays
for i, x in enumerate((3.6, 7.4, 11.2, 15.0)):
    P.place('metal_office_desk', (x, 18.6, 0), rad(180)); P.place('metal_tool_chest', (x + 1.45, 18.75, 0), rad(180))
    if i % 2 == 0: P.place('drill_press_01', (x - 1.3, 18.7, 0), rad(180))
    bayrect(x - 1.0, 15.4, x + 1.0, 17.2, white)
DUE = (11.2, 16.3)                                        # the empty line-side bay the trolley is due in
for x in (3.6, 7.4, 15.0): P.trolley(x, 16.3, rad(90) + R.uniform(-.06, .06), R.choice([1, 2]), tag=True)
# racks: along the north wall, east of the cross aisle
for i in range(4):
    x = 21.2 + i * 2.1
    P.place('steel_frame_shelves_03', (x, 18.9, 0), rad(0))
for i in range(3):
    P.place('steel_frame_shelves_03', (21.9 + i * 2.5, 15.6, 0), rad(0))
for (x, y, z) in ((21.4, 15.6, .12), (22.4, 15.6, 1.0), (24.6, 15.6, .12), (26.6, 15.6, 1.0), (27.3, 15.6, .12), (21.4, 18.9, 1.0), (23.6, 18.9, .12), (25.5, 18.9, 1.0), (27.6, 18.9, .12)):
    P.place(R.choice(['plastic_container', 'industrial_pastic_container', 'cardboard_box_01']), (x, y, z), R.uniform(-.1, .1))
# staging by the dock: pallet lanes
for j, y in enumerate((12.6, 14.2)):
    for i in range(4):
        if (i, j) in ((3, 1),): continue
        pal(2.4 + i * 1.7, y, 'bcwg'[(i + j) % 4])
bayrect(1.4, 11.8, 8.6, 15.0)
PALLET = (13.0, 12.9); P.wrapped(*PALLET, 1.3, rad(4)); P.THINGS.append(['pallet', *PALLET])   # the pallet the truck waits for
# the trolley buffer, south of the main aisle
for i in range(5):
    for j, y in enumerate((5.6, 3.9)):
        if (i, j) in ((1, 1), (4, 0)): continue
        P.trolley(3.0 + i * 1.8 + R.uniform(-.1, .1), y, rad(90) + R.uniform(-.1, .1), R.choice([0, 1, 2]), tag=True)
bayrect(1.6, 2.8, 11.6, 6.8)
# east of the cross aisle, south: mixed pallets and the story's trolley, left among them
for (x, y, k) in ((21.4, 5.9, 'w'), (23.2, 5.8, 'c'), (25.1, 5.7, 'b'), (21.5, 3.6, 'g'), (23.4, 3.5, 'b'), (25.2, 3.4, 'c')): pal(x, y, k)
bayrect(20.4, 2.6, 28.2, 6.9)
HERO = (27.0, 4.5); HROT = rad(112); P.trolley(*HERO, HROT, 2, tag=True)      # 19.7 m from the bay it is due in
_c, _s = math.cos(HROT), math.sin(HROT); TAG = (HERO[0] + (-.567) * _c - (-.31) * _s, HERO[1] + (-.567) * _s + (-.31) * _c, .86)
FREE = (14.2, 3.6); P.forklift(*FREE, rad(180))          # a free forklift, parked, two aisles from the line
P.place('WetFloorSign_01', (16.3, 11.7, 0), rad(20)); P.place('korean_fire_extinguisher_01', (.5, 6.6, 0), 0); P.place('power_box_01', (29.4, 12, 0), rad(-90))
# people: scale figures in ink, never tagged
import people
people.add([((4.9, 17.6), rad(90), 'stand'), ((22.6, 14.6), rad(60), 'stand')])

# ------------------------------------------------------------------ light: a soft studio, like the hero's product picture
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (.86, .91, 1.0, 1); bg.inputs['Strength'].default_value = .85
bpy.ops.object.light_add(type='SUN'); sun = bpy.context.object; sun.data.energy = 5.6; sun.data.angle = rad(6); sun.data.color = (1, .97, .92)
sun.rotation_euler = (rad(54), 0, rad(-38))
def grade(proto, col, fac, gain=1.6):
    # a scan keeps its wear and print; its hue moves to one of AmIMotion's colours
    for o in P._proto.get(proto, []):
        for sl in o.material_slots:
            m = sl.material
            if not m or m.get('graded'): continue
            nt = m.node_tree; b = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if not b or not b.inputs['Base Color'].links: continue
            src = b.inputs['Base Color'].links[0].from_socket
            bw = nt.nodes.new('ShaderNodeRGBToBW'); nt.links.new(src, bw.inputs[0]); mu = nt.nodes.new('ShaderNodeMix'); mu.data_type = 'RGBA'; mu.blend_type = 'MULTIPLY'; mu.inputs['Factor'].default_value = 1
            g = nt.nodes.new('ShaderNodeMath'); g.operation = 'MULTIPLY'; g.inputs[1].default_value = gain; g.use_clamp = True; nt.links.new(bw.outputs[0], g.inputs[0])
            cc = nt.nodes.new('ShaderNodeCombineColor'); [nt.links.new(g.outputs[0], cc.inputs[k]) for k in range(3)]
            nt.links.new(cc.outputs[0], mu.inputs[6]); mu.inputs[7].default_value = col
            mx2 = nt.nodes.new('ShaderNodeMix'); mx2.data_type = 'RGBA'; mx2.inputs['Factor'].default_value = fac; nt.links.new(src, mx2.inputs[6]); nt.links.new(mu.outputs[2], mx2.inputs[7]); nt.links.new(mx2.outputs[2], b.inputs['Base Color']); m['graded'] = 1
grade('plastic_crate_01', ACT, .92, 3.2); grade('plastic_container', SKY, .9, 2.2); grade('industrial_pastic_container', BLUE, .9, 2.4)
grade('cardboard_box_01', (.86, .84, .86, 1), .62, 2.0); grade('steel_frame_shelves_03', (.62, .7, .88, 1), .8, 2.6); grade('worn_metal_rack', (.7, .76, .9, 1), .75, 2.2)
grade('metal_tool_chest', (.05, .07, .22, 1), .9, 3.0); grade('metal_office_desk', (.72, .77, .88, 1), .6, 1.8)

# the real tag and anchor: moulded graphite ABS. Edges are rounded at render time, the skin has a fine moulded grain.
def moulded(m, base, r0, r1):
    nt = m.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    for l in list(b.inputs['Base Color'].links) + list(b.inputs['Roughness'].links) + list(b.inputs['Normal'].links): L.remove(l)
    b.inputs['Base Color'].default_value = base; tc = N.new('ShaderNodeTexCoord')
    n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 2600; n.inputs['Detail'].default_value = 3; L.new(tc.outputs['Object'], n.inputs['Vector'])
    n2 = N.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 60; n2.inputs['Detail'].default_value = 5; L.new(tc.outputs['Object'], n2.inputs['Vector'])
    rr = N.new('ShaderNodeMapRange'); rr.inputs['From Min'].default_value = .35; rr.inputs['From Max'].default_value = .65; rr.inputs['To Min'].default_value = r0; rr.inputs['To Max'].default_value = r1
    L.new(n2.outputs['Fac'], rr.inputs['Value']); L.new(rr.outputs['Result'], b.inputs['Roughness'])
    bv = N.new('ShaderNodeBevel'); bv.samples = 12; bv.inputs['Radius'].default_value = .0007
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .16; bp.inputs['Distance'].default_value = .00012
    L.new(n.outputs['Fac'], bp.inputs['Height']); L.new(bv.outputs['Normal'], bp.inputs['Normal']); L.new(bp.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Specular IOR Level'].default_value = .55; b.inputs['Coat Weight'].default_value = .08; b.inputs['Coat Roughness'].default_value = .35
moulded(mm['tag'], (.026, .028, .035, 1), .3, .42); moulded(mm['tagb'], (.03, .032, .039, 1), .42, .56)
if CLAY:
    for o in bpy.data.objects:                         # not known yet: no tags, no anchors
        if o.name.startswith(('amigo_', 'amimo_')): o.hide_render = True
    clay = P.mat('clay', (.86, .885, .93, 1), .55); nt = clay.node_tree; b_ = nt.nodes['Principled BSDF']
    ao = nt.nodes.new('ShaderNodeAmbientOcclusion'); ao.samples = 8; ao.inputs['Distance'].default_value = .35
    cr = nt.nodes.new('ShaderNodeMix'); cr.data_type = 'RGBA'; cr.inputs[6].default_value = (.42, .50, .70, 1); cr.inputs[7].default_value = (.86, .885, .93, 1)
    nt.links.new(ao.outputs['AO'], cr.inputs['Factor']); nt.links.new(cr.outputs[2], b_.inputs['Base Color'])
    for o in bpy.data.objects:
        if o.type == 'MESH' and not o.name.startswith(('person', 'slab', 'apron')) and not o.hide_render:
            for i in range(len(o.material_slots)): o.material_slots[i].link = 'OBJECT'; o.material_slots[i].material = clay

# ------------------------------------------------------------------ camera: orthographic, fixed
d = Vector((math.cos(EL) * math.cos(AZ), math.cos(EL) * math.sin(AZ), -math.sin(EL)))   # view direction
FOC = os.environ.get('FOCUS'); fc = dict(hero=(*HERO, .7), tag=TAG).get(FOC, (BX / 2 - 1.2, BY / 2, 1.0))
ctr = Vector((float(os.environ.get('CX', fc[0])), float(os.environ.get('CY', fc[1])), fc[2])); cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
CD = float(os.environ.get('CD', 120)); cam.location = ctr - d * CD; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.type = 'ORTHO'; cam.data.clip_end = 400
cam.data.ortho_scale = float(os.environ.get('SCALE', 42.5))
if os.environ.get('FSTOP'): cam.data.dof.use_dof = True; cam.data.dof.focus_distance = CD; cam.data.dof.aperture_fstop = float(os.environ['FSTOP'])
# one soft strip of light that belongs to the story's tag alone: it draws the bevels and the name
bpy.ops.object.light_add(type='AREA'); kl = bpy.context.object; kl.data.shape = 'RECTANGLE'; kl.data.size = .5; kl.data.size_y = .12; kl.data.energy = float(os.environ.get('KEY', 9)) * .55
_n = Vector((-math.sin(HROT + 0), math.cos(HROT + 0), 0))
kl.location = Vector(TAG) - d * .55 + Vector((0, 0, .5)); kl.rotation_euler = (Vector(TAG) - kl.location).to_track_quat('-Z', 'Y').to_euler()
if CLAY: kl.hide_render = True
sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6; sc.cycles.diffuse_bounces = 3; sc.cycles.glossy_bounces = 3
sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = .02
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.resolution_percentage = 100; sc.render.film_transparent = True
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'None'; sc.view_settings.exposure = float(os.environ.get('EXP', 0.1))
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'; sc.render.filepath = OUT
vl = bpy.context.view_layer; vl.update()
from bpy_extras.object_utils import world_to_camera_view as w2c
def px(p): v = w2c(sc, cam, Vector(p)); return [round(v.x, 5), round(1 - v.y, 5)]
pts = dict(tag=px(TAG), hero=px((*HERO, .9)), herofloor=px((*HERO, 0)), due=px((*DUE, 0)), free=px((*FREE, 1.6)), pallet=px((*PALLET, 1.2)), dock=px((0.4, 10, 1.4)), 
           o=px((0, 0, 0)), x=px((1, 0, 0)), y=px((0, 1, 0)), z=px((0, 0, 1)), **{f'a{i}': px(a) for i, a in enumerate(ANCH)})
json.dump(dict(w=W, h=H, scale=cam.data.ortho_scale, pts=pts, things=P.THINGS, anch=ANCH, hero=[*HERO, HROT], tag=TAG, due=DUE, pallet=PALLET, free=FREE, view=[d.x, d.y, d.z], cam=list(cam.location)), open(OUT.replace('.png', '.json'), 'w'))
if os.environ.get('JSONONLY'): sys.exit(0)
if os.environ.get('IDS') == '1':
    # a matte: which located thing each pixel belongs to. 1..n = the things in order, 240+k = anchor k, 250 = the story's tag, 0 = everything else
    def root(o):
        while o.parent: o = o.parent
        return o
    def idof(o):
        r = root(o); n = r.name
        if n.startswith('AmIMo'):
            return 240 + min(range(len(ANCH)), key=lambda k: (r.location.x - ANCH[k][0]) ** 2 + (r.location.y - ANCH[k][1]) ** 2)
        p = r.matrix_world.translation if r is not o else o.matrix_world.translation
        if o.type == 'MESH' and r is o and not o.parent: p = sum((o.matrix_world @ Vector(c) for c in o.bound_box), Vector()) / 8
        if n.startswith('AmIGo') and (p.x - TAG[0]) ** 2 + (p.y - TAG[1]) ** 2 < .01: return 250
        best, bd = 0, 1e9
        for i, (k, x, y) in enumerate(P.THINGS):
            dd = math.hypot(p.x - x, p.y - y); lim = 1.9 if k == 'forklift' else 1.0
            if dd < lim and dd < bd: best, bd = i + 1, dd
        if o.name.startswith(('line', 'slab', 'apron', 'wall', 'col', 'door')): best = 0
        return best
    mats = {}
    def em(i):
        if i not in mats:
            m = bpy.data.materials.new('id%d' % i); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (i / 255., 0, 0, 1); out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], out.inputs[0]); mats[i] = m
        return mats[i]
    cnt = {}
    for o in bpy.data.objects:
        if o.type != 'MESH' or o.hide_render: continue
        i = idof(o); cnt[i] = cnt.get(i, 0) + 1
        if not o.material_slots: o.data.materials.append(None)
        for k in range(len(o.material_slots)): o.material_slots[k].link = 'OBJECT'; o.material_slots[k].material = em(i)
    print('IDS', sorted(cnt.items()))
    bg.inputs['Strength'].default_value = 0; sun.hide_render = True
    sc.cycles.samples = 1; sc.cycles.use_denoising = False; sc.cycles.use_adaptive_sampling = False; sc.cycles.max_bounces = 0; sc.cycles.pixel_filter_type = 'BOX'; sc.render.film_transparent = False
    sc.view_settings.view_transform = 'Raw'; sc.render.image_settings.file_format = 'OPEN_EXR'; sc.render.image_settings.color_depth = '32'; sc.render.filepath = OUT.replace('.png', '_id.exr')
    bpy.ops.render.render(write_still=True); sys.exit(0)
t0 = time.time()
if os.environ.get('DEPTH') == '1':
    sc.cycles.samples = 1; sc.cycles.use_denoising = False; sc.cycles.use_adaptive_sampling = False; sc.cycles.max_bounces = 0; vl.use_pass_z = True; sc.render.film_transparent = False
    sc.render.image_settings.media_type = 'MULTI_LAYER_IMAGE'; sc.render.image_settings.file_format = 'OPEN_EXR_MULTILAYER'; sc.render.filepath = OUT.replace('.png', '_z.exr')
bpy.ops.render.render(write_still=True); print('RENDER_SECONDS', round(time.time() - t0, 1))
