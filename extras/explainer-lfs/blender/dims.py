import sys,glob,os; sys.path.insert(0,'.')
import bpy, plant as P, mathutils
P.reset()
for d in sorted(glob.glob('ph/*/*.gltf')):
    n=os.path.basename(os.path.dirname(d)); objs=P.ph(n)
    mn=mathutils.Vector((1e9,)*3); mx=-mn
    for o in objs:
        for c in o.bound_box:
            w=o.matrix_world@mathutils.Vector(c)
            for i in range(3): mn[i]=min(mn[i],w[i]); mx[i]=max(mx[i],w[i])
    print('ASSET',n,[round(v,2) for v in (mx-mn)],'minz',round(mn.z,2))
