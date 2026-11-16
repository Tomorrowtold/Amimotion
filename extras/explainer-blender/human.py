# A real human proportion for the crew: the MakeHuman base mesh (CC0), body plus its fitted tights as workwear.
import numpy as np, os, bpy
MH = os.environ.get('MH_OBJ', '/tmp/claude-0/-home-user/cc04908f-6d8b-54c4-8c9e-e7765bee3797/scratchpad/mh/base.obj')
_cache = {}
def load():
    if _cache: return _cache
    V = []; F = {}; cur = None
    for l in open(MH):
        if l.startswith('v '): V.append([float(x) for x in l.split()[1:4]])
        elif l.startswith('g '): cur = l.split()[1]
        elif l.startswith('f '): F.setdefault(cur, []).append([int(t.split('/')[0]) - 1 for t in l.split()[1:]])
    V = np.array(V)
    V = np.stack([V[:, 0], -V[:, 2], V[:, 1]], 1) * .1   # Y-up decimetres -> Z-up metres
    V[:, 2] -= V[:, 2].min() - .0
    # bring the arms down from the A-pose to hang at the sides (rotate about each shoulder, blended in from the armpit)
    ax = np.abs(V[:, 0]); up = V[:, 2] > 1.05
    w = np.clip((ax - .1) / .16, 0, 1) ** 1.5 * up * np.clip((V[:, 2] - 1.05) / .15, 0, 1)
    w = np.maximum(w, ((ax > .2) & (V[:, 2] > .7)).astype(float))
    for sgn in (1, -1):
        sel = (np.sign(V[:, 0]) == sgn) & (w > 0)
        px, pz = sgn * .17, 1.38
        th = -np.radians(38) * sgn * w[sel]
        dx, dz = V[sel, 0] - px, V[sel, 2] - pz
        V[sel, 0] = px + dx * np.cos(th) - dz * np.sin(th)
        V[sel, 2] = pz + dx * np.sin(th) + dz * np.cos(th)
    # stand the feet closer: each leg turns in about its hip
    leg = V[:, 2] < .95
    for sgn in (1, -1):
        sel = leg & (np.sign(V[:, 0]) == sgn) & (np.abs(V[:, 0]) > .01)
        k = np.clip((.95 - V[sel, 2]) / .25, 0, 1); th = np.radians(4.5) * sgn * k
        dx, dz = V[sel, 0] - sgn * .09, V[sel, 2] - .95
        V[sel, 0] = sgn * .09 + dx * np.cos(th) - dz * np.sin(th); V[sel, 2] = .95 + dx * np.sin(th) + dz * np.cos(th)
    V[:, 2] -= V[:, 2].min()
    for g in ('body', 'helper-tights'):
        f = F[g]; used = np.unique(np.concatenate([np.array(x) for x in f]))
        remap = -np.ones(len(V), int); remap[used] = np.arange(len(used))
        me = bpy.data.meshes.new(g); me.from_pydata(V[used].tolist(), [], [[remap[i] for i in x] for x in f]); me.update()
        for p in me.polygons: p.use_smooth = True
        _cache[g] = me
    return _cache
