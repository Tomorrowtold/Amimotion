import bpy,sys
bpy.context.preferences.system.use_online_access=True
try:
    r=bpy.ops.extensions.repo_sync_all(); print('sync',r)
    r=bpy.ops.extensions.package_install(repo_index=0,pkg_id="mpfb"); print('install',r)
except Exception as e: print('ERR',e)
import addon_utils
print([m.__name__ for m in addon_utils.modules() if 'mpfb' in m.__name__.lower()])
