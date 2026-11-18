# Puts section.html into the studio homepage in place of the current explainer section. usage: python3 extras/explainer-floor/merge.py
import pathlib
root = pathlib.Path(__file__).resolve().parents[2]; page = root / 'studio/v1/index.html'
t = page.read_text(); new = (root / 'extras/explainer-floor/section.html').read_text().rstrip('\n')
a = t.index('<!-- 1b. LOST. FOUND. SEEN'); b = t.index('</section>', a) + len('</section>')
page.write_text(t[:a] + new + t[b:]); print('merged', len(new), 'bytes')
