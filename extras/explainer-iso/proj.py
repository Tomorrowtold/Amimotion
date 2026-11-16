"""Write the world-to-screen affine for the plate camera (ortho), so overlays line up. Usage: python3 proj.py W H out.json"""
import sys, json, math, bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, __file__.rsplit('/', 1)[0])
src = open(__file__.rsplit('/', 1)[0] + '/plant.py').read().split("if __name__ == '__main__':")[0]
g = {'__name__': 'x', '__file__': __file__}; exec(src, g)
w, h, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
sc = bpy.context.scene; cam = g['camera'](sc, w, h)
bpy.context.view_layer.update()
def P(p):
    c = world_to_camera_view(sc, cam, Vector(p)); return (c.x * w, (1 - c.y) * h)
o = P((0, 0, 0)); ex = P((1, 0, 0)); ey = P((0, 1, 0)); ez = P((0, 0, 1))
A = {'o': o, 'x': [ex[0] - o[0], ex[1] - o[1]], 'y': [ey[0] - o[0], ey[1] - o[1]], 'z': [ez[0] - o[0], ez[1] - o[1]], 'w': w, 'h': h,
     'movers': {m[1]: [m[0], m[2], m[3], m[4]] for m in g['MOVERS']()}}
json.dump(A, open(out, 'w'), indent=1); print(A['o'], A['x'], A['y'], A['z'])
