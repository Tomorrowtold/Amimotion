"""Read a 16-bit PNG into float32 0..1 (PIL drops 16-bit RGB to 8-bit; ffmpeg does not)."""
import subprocess, numpy as np, json

def size(path):
    o = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                        '-of', 'json', path], capture_output=True, text=True).stdout
    s = json.loads(o)['streams'][0]
    return s['width'], s['height']

def read(path):
    w, h = size(path)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb48le', '-'],
                         capture_output=True).stdout
    return np.frombuffer(raw, '<u2').reshape(h, w, 3).astype(np.float32) / 65535.0
