# The truck at the dock, built to read from above: a 40 ft container on a skeletal trailer, coupled to a cab-over tractor.
# Container x 0 .. -12.19 (its doors face the dock), tractor to about -16.6. Corrugation runs across the length, as on a real box.
import bpy, math
import plant as P
rad = math.radians

def corrugated(name, base, grime=(.42, .45, .5, 1)):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord')
    wv = N.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.bands_direction = 'X'; wv.wave_profile = 'SIN'; wv.inputs['Scale'].default_value = 1.12
    L.new(tc.outputs['Object'], wv.inputs['Vector'])
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .55; bp.inputs['Distance'].default_value = .03; L.new(wv.outputs['Fac'], bp.inputs['Height'])
    # weather: large soft grime, finer streaks running down the sides, a darker band where the roof collects dirt
    n1 = N.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = .7; n1.inputs['Detail'].default_value = 7; n1.inputs['Roughness'].default_value = .62; L.new(tc.outputs['Object'], n1.inputs['Vector'])
    mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (6, 6, .35); L.new(tc.outputs['Object'], mp.inputs['Vector'])
    n2 = N.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 3; n2.inputs['Detail'].default_value = 4; L.new(mp.outputs['Vector'], n2.inputs['Vector'])
    g1 = N.new('ShaderNodeMapRange'); g1.inputs['From Min'].default_value = .42; g1.inputs['From Max'].default_value = .72; L.new(n1.outputs['Fac'], g1.inputs['Value'])
    g2 = N.new('ShaderNodeMapRange'); g2.inputs['From Min'].default_value = .5; g2.inputs['From Max'].default_value = .8; g2.inputs['To Max'].default_value = .55; L.new(n2.outputs['Fac'], g2.inputs['Value'])
    gs = N.new('ShaderNodeMath'); gs.operation = 'ADD'; gs.use_clamp = True; L.new(g1.outputs['Result'], gs.inputs[0]); L.new(g2.outputs['Result'], gs.inputs[1])
    gk = N.new('ShaderNodeMath'); gk.operation = 'MULTIPLY'; gk.inputs[1].default_value = .55; L.new(gs.outputs[0], gk.inputs[0])
    cm = N.new('ShaderNodeMix'); cm.data_type = 'RGBA'; cm.inputs[6].default_value = base; cm.inputs[7].default_value = grime; L.new(gk.outputs[0], cm.inputs['Factor'])
    # the crests of the corrugation catch a little less dirt
    cw = N.new('ShaderNodeMix'); cw.data_type = 'RGBA'; cw.blend_type = 'MULTIPLY'; cw.inputs['Factor'].default_value = .1; L.new(cm.outputs[2], cw.inputs[6]); L.new(wv.outputs['Color'], cw.inputs[7])
    L.new(cw.outputs[2], b.inputs['Base Color'])
    rr = N.new('ShaderNodeMapRange'); rr.inputs['To Min'].default_value = .38; rr.inputs['To Max'].default_value = .7; L.new(gs.outputs[0], rr.inputs['Value']); L.new(rr.outputs['Result'], b.inputs['Roughness'])
    L.new(bp.outputs['Normal'], b.inputs['Normal']); b.inputs['Metallic'].default_value = .25
    return m

def b_truck2():
    mm = P.M(); g = []; box = P.box; cyl = P.cyl; dk = mm['dark']; galv = mm['galv']
    LC, WC, HC, DECK = 12.19, 2.44, 2.59, 1.32
    cont = corrugated('container', (.70, .75, .83, 1))
    paint = P.worn('cabink', (.035, .06, .17, 1), (.18, .4), 0., 4)          # the tractor in AmIMotion's ink
    glass = P.mat('glass2', (.01, .012, .016, 1), .06, coat=1.)
    steel = P.worn('chassis', (.05, .055, .06, 1), (.35, .7), .6, 6)
    # the box and its frame: corner posts, top and bottom rails, corner castings
    g.append(box('cont', (LC - .12, WC - .1, HC - .1), (-LC / 2, 0, DECK + HC / 2), cont, .01))
    for x in (-.06, -LC + .06):
        for y in (-WC / 2 + .05, WC / 2 - .05):
            g.append(box('post', (.12, .1, HC), (x, y, DECK + HC / 2), cont, .008))
            for z in (DECK + .06, DECK + HC - .06): g.append(box('cast', (.18, .16, .12), (x, y, z), steel, .01))
    for y in (-WC / 2 + .03, WC / 2 - .03):
        for z in (DECK + .07, DECK + HC - .04): g.append(box('rail', (LC, .07, .09), (-LC / 2, y, z), cont, .006))
    # doors on the dock end: two leaves and four locking bars
    for y in (-.6, .6): g.append(box('door', (.03, 1.16, HC - .2), (.005, y, DECK + HC / 2), cont, .006))
    for y in (-1.0, -.25, .25, 1.0): g.append(cyl('bar', .025, HC - .3, (.035, y, DECK + HC / 2), galv, 'z', 10, 0))
    # skeletal trailer: two main beams, cross members, gooseneck, underrun, landing legs, three axles
    for y in (-.48, .48): g.append(box('beam', (LC - .2, .14, .32), (-LC / 2 - .1, y, DECK - .2), steel, .01))
    for x in [-.4 - k * 1.45 for k in range(9)]: g.append(box('xmem', (.1, 2.3, .12), (x, 0, DECK - .08), steel, .006))
    g.append(box('goose', (2.6, 1.0, .22), (-LC + 1.0, 0, DECK - .36), steel, .01))
    g.append(box('underrun', (.12, 2.3, .14), (-.25, 0, .58), steel, .02)); g.append(box('lamps', (.08, 2.36, .1), (-.18, 0, .84), P.mat('lampred', (.5, .03, .02, 1), .3), .01))
    for y in (-.9, .9): g.append(box('leg', (.12, .12, 1.0), (-9.4, y, .55), steel, .01)); g.append(box('foot', (.3, .3, .04), (-9.4, y, .04), steel, .005))
    for x in (-1.7, -3.05, -4.4):
        for y in (-1.02, 1.02):
            for p_ in P.b_wheel(.52, .32): p_.location = (x, y, .52); g.append(p_)
    g.append(box('guard', (4.2, 2.48, .04), (-3.05, 0, 1.12), steel, .01))
    # the tractor: cab-over, air deflector on the roof, mirrors, a fuel tank, the exhaust stack behind the cab
    CX = -15.45
    g.append(box('cab', (2.25, 2.46, 2.45), (CX, 0, 2.3), paint, .1, seg=3))
    g.append(box('deflector', (1.4, 2.16, .5), (CX + .25, 0, 3.74), paint, .12, seg=3, rot=(0, rad(-9), 0)))
    g.append(box('screen', (.05, 2.2, .92), (CX - 1.13, 0, 2.85), glass, .03)); g.append(box('visor', (.36, 2.3, .06), (CX - 1.12, 0, 3.4), paint, .02))
    g.append(box('grille', (.04, 1.6, .5), (CX - 1.14, 0, 1.75), steel, .01)); g.append(box('bumper', (.32, 2.48, .42), (CX - 1.12, 0, .72), steel, .05))
    for y in (-1.38, 1.38):
        g.append(box('mirror', (.06, .2, .55), (CX - 1.0, y, 2.85), steel, .02)); g.append(box('arm', (.04, .2, .04), (CX - 1.0, y * .93, 3.0), steel, .005))
        g.append(box('step', (.5, .22, .06), (CX - .4, y * .82, .95), galv, .005))
    for y in (-1.25, 1.25): g.append(box('sidewin', (1.0, .02, .7), (CX - .3, y, 2.95), glass, .01))
    g.append(box('frame', (6.4, .9, .3), (-13.3, 0, .95), steel, .02)); g.append(box('fifth', (1.3, 1.1, .12), (-11.55, 0, 1.18), dk, .02))
    g.append(cyl('tank', .3, 1.2, (-13.62, -1.0, .78), mm['galv'], 'x', 24, .01)); g.append(box('battery', (.7, .5, .5), (-13.62, 1.0, .8), steel, .02))
    g.append(cyl('stack', .085, 2.3, (-14.25, .95, 2.7), galv, 'z', 16, .004)); g.append(box('catwalk', (.6, 1.6, .05), (-13.9, 0, 1.28), mm['galv'], .005))
    for x in (-14.95, -12.25, -10.95):
        for y in (-1.02, 1.02):
            for p_ in P.b_wheel(.52, .32): p_.location = (x, y, .52); g.append(p_)
    return P.join(g, 'truck')
