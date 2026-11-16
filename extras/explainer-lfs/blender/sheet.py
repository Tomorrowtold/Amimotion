import bpy,sys,math,glob,os,mathutils
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
x=0
for d in sorted(glob.glob('ph/*/*.gltf')):
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=d)
    objs=[o for o in bpy.data.objects if o not in before and o.type=='MESH']
    mn=mathutils.Vector((1e9,)*3); mx=-mn
    for o in objs:
        for c in o.bound_box:
            w=o.matrix_world@mathutils.Vector(c)
            for i in range(3): mn[i]=min(mn[i],w[i]); mx[i]=max(mx[i],w[i])
    print('ASSET',os.path.basename(d),[round(v,2) for v in (mx-mn)],'min',[round(v,2) for v in mn])
    for o in bpy.data.objects:
        if o not in before and o.parent is None: o.location.x+=x-mn.x
    x+=(mx-mn).x+.4
bpy.ops.mesh.primitive_plane_add(size=40)
bpy.ops.object.light_add(type='AREA',location=(x/2,-4,5),rotation=(math.radians(50),0,0)); l=bpy.context.object; l.data.size=6; l.data.energy=3000
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.location=(x/2,-9,3); cam.rotation_euler=(math.radians(74),0,0); cam.data.lens=35
sc.render.engine='CYCLES'; sc.cycles.samples=32; sc.cycles.use_denoising=True
sc.render.resolution_x=1600; sc.render.resolution_y=600; sc.render.filepath='/home/user/x3d/out/sheet.png'
bpy.ops.render.render(write_still=True)
