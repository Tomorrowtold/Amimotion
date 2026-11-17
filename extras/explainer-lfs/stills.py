import sys, glob, os
from PIL import Image
for f in glob.glob(sys.argv[1] + '/*/s_*.png'):
    Image.open(f).convert('RGB').save(f[:-4] + '.webp', 'WEBP', quality=int(sys.argv[2]) if len(sys.argv) > 2 else 74, method=6); os.remove(f); print(f[:-4] + '.webp', os.path.getsize(f[:-4] + '.webp') // 1024, 'KB')
