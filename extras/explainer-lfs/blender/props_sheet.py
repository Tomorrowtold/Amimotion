import sys,math; sys.path.insert(0,'.')
import bpy, plant as P
P.reset(); sc=P.sc
bpy.ops.mesh.primitive_plane_add(size=60); bpy.context.object.data.materials.append(P.mat('g',(.25,.25,.25,1),.5))
P.trolley(0,0,math.radians(20),2); P.forklift(3.5,0,math.radians(-25)); P.amr(7,0,math.radians(30))
P.place('pallet',(9.5,0,0),builder=P.b_pallet); P.place('cage',(11.5,0,0),.3,builder=P.b_cage); P.wrapped(13.5,0,1.3,.2)
P.place('hardhat',(-1.5,0,1.0),builder=P.b_hardhat); P.amimo((-2.5,0,1.0)); P.amigo((-3.2,0,1.0))
P.stack_boxes(15.5,0,3,.1); P.stack_crates(17.5,0,3,-.1)
for n,x in (('hand_truck',19),('industrial_pastic_container',20.5),('plastic_container',22),('steel_frame_shelves_03',23.5),('tool_cart',25.5),('metal_tool_chest',27),('rollershutter_door',30),('drill_press_01',33),('power_box_01',34.5),('barrel_03',35.5),('metal_office_desk',37.5),('portable_welding_cart',39.5),('korean_fire_extinguisher_01',41)):
    try: P.place(n,(x,3,0))
    except Exception as e: print('FAIL',n,e)
import mathutils
for o in bpy.data.objects:
    if o.name.startswith('Am'):
        print(o.name,[ (c.name,[round(v,3) for v in c.dimensions]) for c in o.children])
bpy.ops.object.light_add(type='AREA',location=(8,-6,7),rotation=(math.radians(45),0,0)); l=bpy.context.object; l.data.size=14; l.data.energy=9000
def shot(name,loc,tgt,lens=35,w=1600,h=600):
    cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
    cam.location=loc; cam.rotation_euler=(mathutils.Vector(tgt)-mathutils.Vector(loc)).to_track_quat('-Z','Y').to_euler(); cam.data.lens=lens
    sc.render.engine='CYCLES'; sc.cycles.samples=24; sc.cycles.use_denoising=True
    sc.render.resolution_x=w; sc.render.resolution_y=h; sc.render.filepath=f'/home/user/x3d/out/{name}.png'; bpy.ops.render.render(write_still=True)
shot('props_a',(6,-9,3),(6.5,0,.8)); shot('props_b',(30,-9,4),(30,3,.8),28); shot('props_c',(-2.4,-1.0,1.25),(-2.6,0,1.02),60,1200,600); shot('props_d',(-1.2,-1.6,1.3),(-.3,0,.75),50,1200,700)
