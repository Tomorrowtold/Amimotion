"""R12: hairline drawing of the model hall from the id and height passes of hall_r11.py ids (top, orthographic).
    python3 lines.py <ids.png> <ids_z.png> <out.png> <width> [--ink #0b1238] [--alpha 0.30]
A line wherever the object changes or the height steps by more than 3 cm, drawn at 2x and Lanczos-downsampled
(so lines are about 1 px at the output), inked flat in one colour at one opacity on a transparent ground."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
a = sys.argv
ink = a[a.index('--ink') + 1] if '--ink' in a else '#0b1238'; al = float(a[a.index('--alpha') + 1]) if '--alpha' in a else 0.30
ids = np.asarray(Image.open(a[1]).convert('L')).astype(np.float32) / 255
z = np.asarray(Image.open(a[2])).astype(np.float32); z = (z[..., 0] if z.ndim == 3 else z) / (65535.0 if z.max() > 255 else 255.0) * 6.0
def edge(x, t):
    gx = np.abs(np.diff(x, axis=1, prepend=x[:, :1])); gy = np.abs(np.diff(x, axis=0, prepend=x[:1]))
    return (gx > t) | (gy > t)
m = edge(ids, 0.02) | edge(z, 0.03)
m = ndi.binary_opening(m, structure=np.ones((1, 1)))
m = ndi.binary_dilation(m, iterations=1).astype(np.float32)
W = int(a[4]); H = round(m.shape[0] * W / m.shape[1])
m = np.asarray(Image.fromarray(m * 255).convert('L').resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
m = np.clip(m * 1.6, 0, 1)
c = [int(ink.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)]
out = np.zeros((H, W, 4), np.uint8); out[..., :3] = c; out[..., 3] = np.round(m * al * 255)
Image.fromarray(out, 'RGBA').save(a[3], optimize=True)
print(a[3], W, H)
