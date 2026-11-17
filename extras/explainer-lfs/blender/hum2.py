import bpy,sys,os,math
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.preferences.addon_enable(module='bl_ext.blender_org.mpfb')
from bl_ext.blender_org.mpfb.services.humanservice import HumanService
from bl_ext.blender_org.mpfb.services.targetservice import TargetService
D='/root/.config/blender/5.3/extensions/.user/blender_org/mpfb/data'
md=TargetService.get_default_macro_info_dict(); print('default',md)
md['gender']=1.0; md['age']=.55; md['muscle']=.62; md['weight']=.62; md['height']=.55
md['race']={'asian':.6,'caucasian':.2,'african':.2}
bm=HumanService.create_human(scale=0.1,macro_detail_dict=md)
print('base',bm.name,bm.dimensions)
rig=HumanService.add_builtin_rig(bm,'default_no_toes'); print('rig',rig.name,len(rig.data.bones))
for c in ('male_worksuit01','shoes04'):
    try:
        o=HumanService.add_mhclo_asset(f'{D}/clothes/{c}/{c}.mhclo',bm,material_type='MAKESKIN'); print('clothes',c,o.name if o else o)
    except Exception as e: print('CLERR',c,e)
print([b.name for b in rig.data.bones])
print([(o.name,o.type,[m.type for m in o.modifiers]) for o in bpy.data.objects])
bpy.ops.wm.save_as_mainfile(filepath='/home/user/x3d/out/human_base.blend')
