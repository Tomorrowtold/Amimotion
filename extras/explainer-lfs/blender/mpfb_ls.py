import bpy
r=bpy.ops.preferences.addon_enable(module='bl_ext.blender_org.mpfb'); print(r)
print([o for o in dir(bpy.ops.mpfb)])
