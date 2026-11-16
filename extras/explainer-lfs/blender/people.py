import bpy, math
def add(lst, path='/home/user/x3d/out/people.blend'):
    with bpy.data.libraries.load(path) as (src, dst): dst.objects = [n for n in src.objects if n.startswith('worker_')]
    lib = {o.name: o for o in dst.objects}
    out = []
    for (x, y), heading, pose in lst:
        o = bpy.data.objects.new('person_' + pose, lib['worker_' + pose].data); bpy.context.scene.collection.objects.link(o)
        o.location = (x, y, 0); o.rotation_euler = (0, 0, heading + math.pi / 2); out.append(o)
    return out
