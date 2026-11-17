import sys,math; sys.path.insert(0,'.')
import bpy, plant as P, mathutils
P.reset(); sc=P.sc
bpy.ops.mesh.primitive_plane_add(size=60); bpy.context.object.data.materials.append(P.mat('g',(.25,.25,.25,1),.5))
P.forklift(0,0,math.radians(-30)); P.amr(3.2,-.5,math.radians(25)); P.place('cage',(5.2,0,0),.3,builder=P.b_cage); P.wrapped(6.8,0,1.3,.2); P.stack_crates(8.4,0,3,-.1)
P.place('hardhat',(3.2,-2.2,.2),builder=P.b_hardhat)
bpy.ops.object.light_add(type='AREA',location=(3,-6,7),rotation=(math.radians(45),0,0)); l=bpy.context.object; l.data.size=10; l.data.energy=6000
bpy.ops.object.light_add(type='AREA',location=(-6,3,4),rotation=(math.radians(60),0,math.radians(-120))); l=bpy.context.object; l.data.size=6; l.data.energy=1500
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.location=(3.6,-8.5,2.6); cam.rotation_euler=(mathutils.Vector((3.8,0,.9))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.lens=32
sc.render.engine='CYCLES'; sc.cycles.samples=32; sc.cycles.use_denoising=True
sc.render.resolution_x=1600; sc.render.resolution_y=640; sc.render.filepath='/home/user/x3d/out/props2.png'; bpy.ops.render.render(write_still=True)
