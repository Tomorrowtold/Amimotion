"""Content-Security-Policy with script hashes: every inline script the built site runs is allowed by its SHA-256, so an
injected script cannot run. ('unsafe-inline' stays only for browsers too old to read hashes; modern ones ignore it.)
  python3 studio/csp.py save   -> writes the hashes into vercel.json (and studio/out/_headers when present)
  python3 studio/csp.py check  -> fails if the built site has an inline script vercel.json does not allow (CI)"""
import base64, hashlib, json, re, sys
from pathlib import Path
REPO = Path(__file__).resolve().parent.parent; OUT = REPO / "studio" / "out"; VJ = REPO / "vercel.json"
def hashes():
    hs = set()
    for f in OUT.rglob("*.html"):
        for m in re.finditer(r"<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>", f.read_text(errors="ignore"), re.S):
            if "ld+json" in m.group(1): continue
            hs.add("'sha256-" + base64.b64encode(hashlib.sha256(m.group(2).encode()).digest()).decode() + "'")
    return sorted(hs)
def policy(old, hs):
    return re.sub(r"script-src [^;]*", "script-src 'self' " + " ".join(hs) + " 'unsafe-inline'", old)
v = json.loads(VJ.read_text())
csp = next(h for blk in v["headers"] for h in blk["headers"] if h["key"] == "Content-Security-Policy")
hs = hashes()
if sys.argv[1:] == ["save"]:
    csp["value"] = policy(csp["value"], hs); VJ.write_text(json.dumps(v, indent=2) + "\n")
    hd = OUT / "_headers"
    if hd.exists(): hd.write_text(re.sub(r"script-src [^;]*", "script-src 'self' " + " ".join(hs) + " 'unsafe-inline'", hd.read_text()))
    print(f"csp: {len(hs)} inline script hashes saved")
else:
    missing = [h for h in hs if h not in csp["value"]]
    print("csp:", "OK" if not missing else f"{len(missing)} inline script(s) not allowed: run python3 studio/csp.py save"); sys.exit(1 if missing else 0)
