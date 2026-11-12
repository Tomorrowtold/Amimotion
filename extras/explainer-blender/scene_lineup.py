# Scene 1, "Before the shift": every party in one row under one long light, on a polished dark floor.
import sys, math
sys.path.insert(0, __import__('os').path.dirname(__file__))
from kit import *
import models as MD

def build(w=1920, h=1080, samples=96):
    clear(); mats()
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples
    sc.cycles.use_denoising = True; sc.render.resolution_x = w; sc.render.resolution_y = h
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 4
    world = bpy.data.worlds.new('w'); world.use_nodes = True; world.node_tree.nodes['Background'].inputs['Color'].default_value = (.002, .002, .003, 1); sc.world = world
    # floor: polished, slightly worn concrete
    fl = box('floor', (60, 40, .02), (0, 6, -.01), mat('floor', (.05, .052, .056), rough=.3, noise=.6, noise_scale=5, bump=.03), bevel=0)
    wall = box('wall', (60, .2, 14), (0, 13, 7), mat('wall', (.02, .021, .024), rough=.8), bevel=0)
    # the light: one long softbox overhead, framed, two mullions
    LZ = 3.7
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 1.0, LZ)); lp = bpy.context.active_object; lp.scale = (5.6, 1.8, 1)
    em = bpy.data.materials.new('soft'); em.use_nodes = True; nt = em.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF'])
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Strength'].default_value = 14; e.inputs['Color'].default_value = (1, .98, .95, 1)
    nt.links.new(e.outputs[0], nt.nodes['Material Output'].inputs[0]); lp.data.materials.append(em); lp.rotation_euler.x = math.pi
    for x in (-.9, .9): box('mullion', (.04, 1.72, .03), (x, 1.0, LZ - .02), M['amr_dark'], bevel=0)
    box('frame', (5.8, 2.0, .12), (0, 1.0, LZ + .07), M['amr_dark'], bevel=.01)
    # a faint cool fill from behind the camera and a rim from behind, so edges read
    bpy.ops.object.light_add(type='AREA', location=(0, -9, 2.2)); f = bpy.context.active_object; f.data.energy = 120; f.data.size = 6; f.data.color = (.8, .87, 1); f.rotation_euler = (math.radians(80), 0, 0)
    bpy.ops.object.light_add(type='AREA', location=(0, 6, 2.5)); r = bpy.context.active_object; r.data.energy = 220; r.data.size = 8; r.data.color = (.75, .85, 1); r.rotation_euler = (math.radians(-75), 0, 0)
    # the row: left to right
    y = 1.0
    MD.trolley('trolley', (-3.55, y, 0))
    MD.totes('totes', (-2.45, y, 0))
    MD.tool_chest('tools', (-1.55, y, 0))
    MD.pallet('pallet', (-.35, y, 0))
    MD.forklift('forklift', (1.95, y + .1, 0))
    MD.amr('amr', (3.85, y - .05, 0))
    # the crew, a step behind, half in the dark
    MD.person('crewA', (-2.95, y + 1.25, 0), rotz=.15)
    MD.person('crewB', (.75, y + 1.35, 0), rotz=-.1)
    MD.person('crewC', (3.2, y + 1.3, 0), rotz=.2)
    # camera: low, long lens, square on to the row
    bpy.ops.object.camera_add(location=(0, -9.0, 1.0)); cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(94.5), 0, 0); cam.data.lens = 35; sc.camera = cam
    cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 10; cam.data.dof.aperture_fstop = 5.6
    return sc

if __name__ == '__main__':
    out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/tmp/lineup.png'
    w, h, s = (int(x) for x in (sys.argv[sys.argv.index('--') + 2:sys.argv.index('--') + 5] if len(sys.argv) > sys.argv.index('--') + 4 else (960, 540, 32)))
    sc = build(w, h, s); sc.render.filepath = out
    bpy.ops.wm.save_as_mainfile(filepath=out.rsplit('.', 1)[0] + '.blend')
    bpy.ops.render.render(write_still=True)
