import bpy,sys,os
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.preferences.addon_enable(module='bl_ext.blender_org.mpfb')
try:
    r=bpy.ops.mpfb.load_pack(filepath='/home/user/x3d/mh/makehuman_system_assets.zip'); print('pack',r)
except Exception as e: print('PACKERR',e)
from bl_ext.blender_org.mpfb.services.humanservice import HumanService
from bl_ext.blender_org.mpfb.services.locationservice import LocationService
print('userdata',LocationService.get_user_data())
import inspect
print([n for n in dir(HumanService) if not n.startswith('_')])
print(inspect.signature(HumanService.create_human))
print(inspect.signature(HumanService.add_mhclo_asset))
print(inspect.signature(HumanService.add_builtin_rig))
