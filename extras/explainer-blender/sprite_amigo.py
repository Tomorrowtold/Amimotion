# The AmIGo, lid to camera, lit from a long light overhead: a cut-out to place on photographs.
import sys, math
sys.path.insert(0, __import__('os').path.dirname(__file__))
from kit import *
out = sys.argv[-1]
clear(); mats()
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 128; sc.cycles.use_denoising = True
sc.render.resolution_x = 640; sc.render.resolution_y = 480; sc.render.film_transparent = True
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .01, .012, 1); sc.world = w
t = amigo('tag', (0, 0, 0), '-Y'); t.rotation_euler.y = math.pi / 2
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -.05, .5)); lp = bpy.context.active_object; lp.scale = (1.5, .6, 1); lp.rotation_euler.x = math.pi
em = bpy.data.materials.new('soft'); em.use_nodes = True; nt = em.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF'])
e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Strength'].default_value = 8; nt.links.new(e.outputs[0], nt.nodes['Material Output'].inputs[0]); lp.data.materials.append(em)
lp.visible_camera = False
bpy.ops.object.light_add(type='AREA', location=(0, -.6, .05)); f = bpy.context.active_object; f.data.energy = 1.2; f.data.size = .8; f.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.camera_add(location=(0, -.5, -.016)); c = bpy.context.active_object; c.rotation_euler = (math.radians(92), 0, 0)
c.data.type = 'ORTHO'; c.data.ortho_scale = .105; sc.camera = c
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
