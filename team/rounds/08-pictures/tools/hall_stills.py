"""Sky Ground hall stills for the homepage screens and the inner-page slots. One model hall (03-hero-film/build_hall.py),
one palette (03-hero-film/sky/palette.json), one light, one grade (the film's gain, sky/gain-sky.txt, floor = #f0f6ff).

    python3 hall_stills.py preview [name ...]     # 640 px, 8 samples, into raw/pv/
    python3 hall_stills.py render  [name ...]     # full size, 24 samples, into raw/ (resumable: skips finished)
    python3 hall_stills.py cut     [name ...]     # grade, crop, AVIF + WebP ladders into site/src/assets/hall/

Camera: height, pitch, lens, yaw, target x, target y[, target z] (hall metres; see build_hall.py --cam).
Marks: trails / amber are comma lists of movers ('none' = no marks of that kind); omitted = everything after-state.
"""
import sys, os, subprocess
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../../..'))
FILM = os.path.join(ROOT, 'team/rounds/03-hero-film')
RAW = os.path.join(HERE, '..', 'raw')
OUT = os.path.join(ROOT, 'site/src/assets/hall')
BPY = '/tmp/bpyenv/bin/python'

W169, W43 = (800, 1600, 2400, 3840), (800, 1600, 2400)

# name: (render WxH, cam, trails, amber, cuts: [(out name, crop (x0,y0,x1,y1) as fractions or None, widths)])
A169 = '11,45,26,34,0.6,10.0'          # camera A position and angle; lens 30 so the 16:9 frame holds the hall
C43, C169, C32 = (0.125, 0, 0.875, 1), None, (0.0833, 0, 0.9167, 1)   # 4:3 and 3:2 centre crops of a 16:9 render
def A(lens, tx, ty): return f'11,45,{lens},34,{tx},{ty}'
# name: (render WxH, cam, trails, amber, cuts [(out base, crop fractions or None, widths)], extra build_hall args)
V = {
    'a-all':     ('3840x2160', A169, None, None, [('hall-all', None, W169)], []),
    'a-ask':     ('3840x2160', A169, 'none', 'q1,q2,q3', [('hall-ask', None, W169), ('hall-ask-43', (0.0, 0.2, 0.6, 1.0), W43)], []),
    'a-bay':     ('3840x2160', A169, 'ti,q1,q2,q3', 'q1,q2,q3', [('hall-bay', None, W169), ('hall-bay-32', C32, W43)], []),
    'a-find':    ('3840x2160', '11,45,40,34,3.0,13.6', 't3', 'none', [('hall-find', None, W169), ('hall-find-43', C43, W43)], []),
    'a-waits':   ('3840x2160', A(35, -1.2, 7.6), None, None, [('hall-waits', None, W169), ('hall-waits-43', C43, W43), ('hall-waits-32', C32, W43)], []),
    'a-inspect': ('2880x2160', A(40, -1.6, 7.8), 'ti,q1,q2,q3', 'q1,q2,q3', [('hall-inspect-43', None, W43)], []),
    'a-wip':     ('3840x2160', A(30, -1.2, 9.6), 't1,ti', 'q1,q2,q3', [('hall-wip', None, W169)], []),
    'a-mfg':     ('3840x2160', A(30, -1.2, 9.6), 't1,fix', 'q1,q2,q3', [('hall-mfg', None, W169), ('hall-mfg-43', C43, W43)], []),
    'a-wh':      ('3840x2160', A(30, 4.0, 10.0), 'fork,pallet,tug', 'pallet', [('hall-wh', None, W169), ('hall-wh-43', C43, W43)], []),
    'a-assets':  ('3840x2160', A(26, 0.2, 15.0), 'tool,fix,fork', 'none', [('hall-assets', None, W169)], []),
    'a-back':    ('2880x2160', A(35, -0.5, 21.5), 'amr,bin1,bin2,tool,fix', 'none', [('hall-back-43', None, W43)], []),
    'a-robot':   ('3840x2160', A(35, 0.0, 22.5), 'amr,tow,tug,bin1,bin2,tool', 'none', [('hall-robot', None, W169)], ['--tow', '--dropoff']),
    'a-drop':    ('2880x2160', '11,45,40,-20,13.5,22.5', 'none', 'd1,d2', [('hall-dropoff-43', None, W43)], ['--dropoff', '--drop-trolleys']),
    'a-handoff': ('3840x2160', '11,45,32,-20,11.5,22.0', 'amr,tow', 'none', [('hall-handoff', None, W169)], ['--tow', '--dropoff', '--amr-s', '27.6']),
    'a-build':   ('3840x2160', A169, None, None, [('hall-build', None, W169)], ['--state', 'build', '--t', '6.2']),
    'a-before':  ('3840x2160', A169, None, None, [('hall-before', None, W169)], ['--state', 'before', '--t', '3.7']),
    'a-path':    ('2880x2160', A(32, -1.2, 12.0), 'q3', 'none', [('hall-path-43', None, W43)], ['--q3-press', '--trail-len', '40']),
    'a-racks':   ('2880x2160', A(35, 6.5, 15.5), 'none', 'none', [('hall-racks-43', None, W43)], []),
    'c-trolley': ('2400x1800', '2.5,30,50,-120,-1.2,14.6', None, None, [('hall-trolley-43', None, W43)], []),
    'p-plan':    ('3840x2160', '20,89.9,50,0,-1.6,8.2', 'none', 'none', [('hall-plan', None, W169)], ['--ortho', '14', '--links']),
}


def args(name, w, h, samples, out):
    res, cam, tr, am, _, extra = V[name]
    st = [] if '--state' in extra else ['--state', 'after']
    a = [BPY, 'build_hall.py', '--palette', 'sky/palette.json', '--world-color', '#dfeaff'] + st + extra + [
         '--samples', str(samples), '--res', f'{w}x{h}', '--cam', cam, '--out', out]
    if tr: a += ['--trails', tr]
    if am: a += ['--amber', am]
    return a


def run(name, preview):
    res = V[name][0]; w, h = (int(v) for v in res.split('x'))
    if preview:
        k = 640 / w; w, h = 640, round(h * k); out = os.path.join(RAW, 'pv', name + '.png'); s = 8
    else:
        out = os.path.join(RAW, name + '.png'); s = 16
        if os.path.exists(out): return
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(args(name, w, h, s, out), cwd=FILM, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('rendered', out, flush=True)


def cut(name):
    sys.path.insert(0, FILM)
    os.environ['HALL_GROUND'] = '#f0f6ff'
    import grade_film
    g = np.loadtxt(os.path.join(FILM, 'sky/gain-sky.txt')).astype(np.float32)
    raw = os.path.join(RAW, name + '.png'); graded = os.path.join(RAW, name + '-graded.png')
    grade_film.grade(raw, graded, g)
    im = Image.open(graded).convert('RGB')
    os.makedirs(OUT, exist_ok=True)
    for oname, box, widths in V[name][4]:
        c = im if box is None else im.crop(tuple(round(v * s) for v, s in zip(box, (im.width, im.height, im.width, im.height))))
        for w in widths:
            if w > c.width: continue
            r = c if w == c.width else c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
            r.save(os.path.join(OUT, f'{oname}-{w}.avif'), quality=60, subsampling='4:4:4', speed=4)
            r.save(os.path.join(OUT, f'{oname}-{w}.webp'), quality=80, method=6, use_sharp_yuv=True)
        print(oname, c.size, [w for w in widths if w <= c.width], flush=True)


if __name__ == '__main__':
    cmd, names = sys.argv[1], sys.argv[2:] or list(V)
    for n in names:
        {'preview': lambda n: run(n, True), 'render': lambda n: run(n, False), 'cut': cut}[cmd](n)
