import bpy, math, os
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; vl=sc.view_layers[0]
bpy.ops.mesh.primitive_plane_add(size=20); bpy.ops.mesh.primitive_monkey_add(location=(0,0,1))
for n,loc,colr in (('a',(3,-3,4),(1,.5,.2)),('b',(-3,-3,4),(.2,.5,1))):
    bpy.ops.object.light_add(type='POINT',location=loc); l=bpy.context.object; l.data.energy=2000; l.data.color=colr
    vl.lightgroups.add(name=n); l.lightgroup=n
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.location=(0,-8,3); cam.rotation_euler=(math.radians(72),0,0)
sc.render.engine='CYCLES'; sc.cycles.samples=16; sc.cycles.use_denoising=False; sc.render.resolution_x=320; sc.render.resolution_y=180
vl.use_pass_z=True; vl.cycles.denoising_store_passes=True; vl.use_pass_position=True
print([p.identifier for p in sc.render.image_settings.bl_rna.properties]);
try: sc.render.image_settings.media_type='MULTI_LAYER_IMAGE'
except Exception as e: print('mt',e)
sc.render.image_settings.file_format='OPEN_EXR_MULTILAYER'; sc.render.image_settings.color_depth='32'; sc.render.filepath='/home/user/x3d/out/lg_test.exr'
bpy.ops.render.render(write_still=True)
print('nodegroup attr', hasattr(sc,'compositing_node_group'), hasattr(sc,'node_tree'))
try:
    import OpenImageIO as oiio; print('oiio ok', oiio.VERSION_STRING)
    i=oiio.ImageInput.open('/home/user/x3d/out/lg_test.exr'); 
    k=0
    while True:
        sp=i.spec(k,0)
        if sp.width==0 or not i.seek_subimage(k,0): break
        print(k, sp.channelnames[:40]); k+=1
except Exception as e: print('oiio err',e)
try:
    import oidn; print('oidn ok')
except Exception as e: print('oidn err',e)
