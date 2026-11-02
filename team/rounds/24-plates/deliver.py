"""Copy the plates to the shared mount, write README.md, then re-read every file after 10 s and compare checksums.

    python3 deliver.py <built_dir> /mnt/project-files/website-top/shared-assets/studio/plates/
"""
import sys, os, shutil, hashlib, time, json
from PIL import Image

DESC = {
    'after.png': 'Camera A, film frame 0 (the poster moment): blue trails and amber pads on, Sky Ground grade (same pipeline as poster-4x5-*)',
    'before.png': 'the identical frame with no blue and no amber (ink geometry hidden; nothing else moved; same render seed)',
    'path-mask.png': 'white where the blue lines are visible (occlusion by nearer objects included), black elsewhere, antialiased',
    'amber-mask.png': 'white where the amber pads are visible, black elsewhere, antialiased',
    'path-arrival.png': 'per blue-line pixel: 0..1 position along its own trail by arc length (0 = oldest end, 1 = the mover), 0 elsewhere; values run to the soft edge, so multiply by path-mask for a matte',
    'path-index.png': 'per blue-line pixel: path id * step (step in paths.json "index_png"), 0 elsewhere; no antialiasing',
    'paths.json': 'each visible path: id, index value, mover key, kind, start/end pixel coordinates (visible and projected)',
}
BITS = {'after.png': 'RGB 8-bit', 'before.png': 'RGB 8-bit', 'path-mask.png': 'greyscale 8-bit', 'amber-mask.png': 'greyscale 8-bit',
        'path-arrival.png': 'greyscale 16-bit', 'path-index.png': 'greyscale 8-bit'}
CS = {'after.png': 'sRGB', 'before.png': 'sRGB'}


def md5(p):
    """Content hash: decoded pixels for images (the project-files mount adds a C2PA 'caBX' chunk / JPEG segment on
    write, so the bytes differ while the pixels do not), raw bytes for everything else."""
    if p.endswith(('.png', '.jpg')):
        im = Image.open(p)
        return hashlib.md5(im.mode.encode() + str(im.size).encode() + im.tobytes()).hexdigest()
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def main(src, dst):
    os.makedirs(dst, exist_ok=True)
    files = []
    for sub in ('plates-2400', 'plates-1600'):
        os.makedirs(os.path.join(dst, sub), exist_ok=True)
        for n in DESC:
            files.append(os.path.join(sub, n))
    files.append('contact-sheet.jpg')
    lines = ['# Studio story-film plates: the model hall, camera A, film frame 0 (t = 0.0 s), 4:5', '',
             'Rendered with team/rounds/24-plates/render_plates.py + make_plates.py (repo amimotion). All files in one size are pixel-aligned. '
             'The 1600 set is a Lanczos cut of the 2400 set (data maps cut coverage-weighted). No text, no people, no glow.', '',
             'Index step: path-index value = id * %s (%d visible paths; id * 20 would pass 255). ' % (
                 json.load(open(os.path.join(src, 'plates-2400', 'paths.json')))['index_png'].split('* ')[1],
                 len(json.load(open(os.path.join(src, 'plates-2400', 'paths.json')))['paths'])) +
             'The ink is seen by the camera only (no bounce, no shadow), so after differs from before only under the masks; '
             'the poster has a faint blue/amber bounce on things parked on ink, these plates do not.', '']
    for sub in ('plates-2400', 'plates-1600'):
        lines += [f'## {sub}/', '']
        for n, d in DESC.items():
            p = os.path.join(src, sub, n)
            kb = os.path.getsize(p) / 1024
            if n.endswith('.png'):
                w, h = Image.open(p).size
                cs = CS.get(n, 'sRGB file, linear data values (no transfer curve applied to the data)')
                lines.append(f'- `{n}`: {d}. {w} x {h}, {BITS[n]}, colour space {cs}, {kb:.0f} KB.')
            else:
                lines.append(f'- `{n}`: {d}. {kb:.0f} KB.')
        lines.append('')
    lines.append(f'- `contact-sheet.jpg`: after, before, path mask, amber mask, arrival as heatmap (from the 1600 set). sRGB JPEG, {os.path.getsize(os.path.join(src, "contact-sheet.jpg")) / 1024:.0f} KB.')
    open(os.path.join(src, 'README.md'), 'w').write('\n'.join(lines) + '\n')
    files.append('README.md')
    sums = {}
    for f in files:
        shutil.copyfile(os.path.join(src, f), os.path.join(dst, f)); sums[f] = md5(os.path.join(src, f))
    time.sleep(10)
    bad = [f for f in files if md5(os.path.join(dst, f)) != sums[f]]
    for f in files:
        print('%-32s %9d' % (f, os.path.getsize(os.path.join(dst, f))))
    print('re-read after 10 s (decoded pixels / bytes):', 'all match' if not bad else f'MISMATCH {bad}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
