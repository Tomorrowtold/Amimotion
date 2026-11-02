"""Cut the hero film and its posters from graded frames. System python + ffmpeg.

    python3 make_film.py film   <graded_dir> <out_dir>          # 4:5 and 1:1, AV1 and H.264
    python3 make_film.py poster <graded_master.png> <out_dir>   # AVIF + WebP ladders (4:5 and 1:1) from one master
    python3 make_film.py sheet  <graded_dir> <out.jpg>          # contact sheet of 6 moments

Frames are display order, 25 fps, f0000 = 0.0 s (the poster) ... f0224 = 8.96 s. Frame 225 would equal frame 0, so
the loop seam is continuous motion. The only cut is the scripted one at 2.0 s.
"""
import sys, os, subprocess
import numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

FPS = 25
CROP_1x1 = (0, 300, 1600, 1600)   # x, y, w, h in the 1600x2000 master: the inspection queue and the racks


def run(cmd):
    print(' '.join(cmd)); subprocess.run(cmd, check=True)


def film(src, out):
    os.makedirs(out, exist_ok=True)
    inp = ['-framerate', str(FPS), '-i', os.path.join(src, 'f%04d.png')]
    tags = ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv']
    for name, vf in (('hall-4x5', 'scale=1600:2000:flags=lanczos'),
                     ('hall-1x1', 'crop=%d:%d:%d:%d,scale=1080:1080:flags=lanczos' % (CROP_1x1[2], CROP_1x1[3], CROP_1x1[0], CROP_1x1[1]))):
        vf = vf + ',format=yuv420p'
        av1 = os.path.join(out, name + '-av1.mp4')
        run(['ffmpeg', '-y', '-v', 'error'] + inp + ['-vf', vf, '-c:v', 'libsvtav1', '-preset', '4',
             '-crf', os.environ.get('AV1_CRF_' + name[-3:], '24'), '-g', '225',
             '-svtav1-params', 'tune=0:enable-overlays=1:scd=0', '-pix_fmt', 'yuv420p'] + tags +
            ['-an', '-movflags', '+faststart', av1])
        h264 = os.path.join(out, name + '-h264.mp4')
        run(['ffmpeg', '-y', '-v', 'error'] + inp + ['-vf', vf, '-c:v', 'libx264', '-preset', 'veryslow',
             '-crf', os.environ.get('H264_CRF_' + name[-3:], '16'), '-profile:v', 'high', '-level', '5.0', '-g', '225',
             '-tune', 'animation', '-pix_fmt', 'yuv420p'] + tags + ['-an', '-movflags', '+faststart', h264])
        for f in (av1, h264):
            print('%-40s %7.0f KB' % (os.path.basename(f), os.path.getsize(f) / 1024))


def ladder(im, name, widths, out, q_avif=60, q_webp=80):
    rows = []
    for w in widths:
        if w > im.width:
            print('skip', name, w, '(master is', im.width, ')'); continue
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        pa = os.path.join(out, f'{name}-{w}.avif'); pw = os.path.join(out, f'{name}-{w}.webp')
        r.save(pa, quality=q_avif, subsampling='4:4:4', speed=4)
        r.save(pw, quality=q_webp, method=6, use_sharp_yuv=True)
        rows.append((w, h, os.path.getsize(pa) / 1024, os.path.getsize(pw) / 1024))
        print(f'{name}-{w}: {w}x{h}  avif {rows[-1][2]:.1f} KB  webp {rows[-1][3]:.1f} KB')
    return rows


def poster(master, out):
    os.makedirs(out, exist_ok=True)
    im = Image.open(master).convert('RGB')
    k = im.width / 1600
    ladder(im, 'poster-4x5', (800, 1200, 1600, 2400, 3200, 4800, 6400), out)
    x, y, w, h = (round(v * k) for v in CROP_1x1)
    sq = im.crop((x, y, x + w, y + h))
    ladder(sq, 'poster-1x1', (600, 1080, 1600, 2400), out)
    # share image 1200 x 630, centred on the queue and the staging lane
    sh = im.crop((0, round(1060 * k), im.width, round(1060 * k + im.width * 630 / 1200))).resize((1200, 630), Image.LANCZOS)
    sh.save(os.path.join(out, 'share-1200x630.jpg'), quality=86, optimize=True, progressive=True)


def sheet(src, out):
    times = [0.0, 1.0, 2.0, 3.8, 5.5, 7.9]
    ims = [Image.open(os.path.join(src, 'f%04d.png' % round(t * FPS))).convert('RGB').resize((400, 500), Image.LANCZOS) for t in times]
    pad = 12
    c = Image.new('RGB', (3 * 400 + 4 * pad, 2 * 500 + 3 * pad), (245, 245, 242))
    for i, im in enumerate(ims):
        c.paste(im, (pad + (i % 3) * (400 + pad), pad + (i // 3) * (500 + pad)))
    c.save(out, quality=88)
    print('sheet at', times)


if __name__ == '__main__':
    {'film': film, 'poster': poster, 'sheet': sheet}[sys.argv[1]](*sys.argv[2:])
