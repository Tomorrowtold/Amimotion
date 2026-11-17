// Runs the two rendered CloudFront functions against every redirect in vercel.json and the site's own rules.
//   node aws/test_edge.mjs            (renders the template itself)
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const out = join(mkdtempSync(join(tmpdir(), 'edge-')), 't.yaml');
execFileSync('python3', ['aws/render.py', out], { stdio: 'inherit' });
const y = readFileSync(out, 'utf8');
const cut = (a, b) => { const i = y.indexOf(a) + a.length, j = y.indexOf(b, i); return y.slice(i, j); };
const reqSrc = cut("FunctionCode: !Sub\n        - |\n", "        - Apex:").replace("'${Apex}'", "'amimotion.com'");
const resSrc = cut("FunctionCode: |\n", "\n  Headers:");
const req = new Function(reqSrc + '\nreturn handler;')(), res = new Function(resSrc + '\nreturn handler;')();
let bad = 0; const ok = (name, got, want) => { if (got !== want) { bad++; console.log('FAIL', name, '\n   got ', got, '\n   want', want); } };
const R = (uri, host = 'www.amimotion.com', q = {}) => req({ request: { uri, querystring: q, headers: { host: { value: host } } } });
const loc = (x) => x.statusCode === 301 ? x.headers.location.value : 'pass:' + x.uri;
const v = JSON.parse(readFileSync('vercel.json', 'utf8'));
for (const r of v.redirects) {
  if (r.source.includes(':path*/index.html')) { ok(r.source, loc(R('/products/amigo/index.html')), '/products/amigo/'); continue; }
  const src = r.source.replace(':path*', 'anything/deep');
  ok(src, loc(R(src)), r.destination);
  if (!src.includes('.') && !src.endsWith('/')) ok(src + '/', loc(R(src + '/')), r.destination);
}
ok('apex', loc(R('/products/', 'amimotion.com', { a: { value: '1' } })), 'https://www.amimotion.com/products/?a=1');
ok('dir', loc(R('/products/amigo/')), 'pass:/products/amigo/index.html');
ok('home', loc(R('/')), 'pass:/index.html');
ok('no slash', loc(R('/products/amigo')), '/products/amigo/');
ok('file', loc(R('/assets/css/site.css')), 'pass:/assets/css/site.css');
ok('security.txt', loc(R('/.well-known/security.txt')), 'pass:/.well-known/security.txt');
ok('twin', loc(R('/products/amigo/index.md')), 'pass:/products/amigo/index.md');
ok('api', loc(R('/api/health/')), 'pass:/api/health/');
ok('api host', R('/api/lead').headers['x-site-host'].value, 'www.amimotion.com');
const S = (uri, host = 'www.amimotion.com', q = {}, status = 200) => res({ request: { uri, querystring: q, headers: { host: { value: host } } }, response: { statusCode: status, headers: {} } }).headers;
const hv = (h, k) => h[k] ? h[k].value : undefined;
ok('page indexable', hv(S('/products/amigo/index.html'), 'x-robots-tag'), undefined);
ok('test address hidden', hv(S('/index.html', 'd123.cloudfront.net'), 'x-robots-tag'), 'noindex, nofollow');
ok('desk hidden', hv(S('/desk/index.html'), 'x-robots-tag'), 'noindex, nofollow');
ok('twin hidden', hv(S('/index.md'), 'x-robots-tag'), 'noindex');
ok('twin type', hv(S('/index.md'), 'content-type'), 'text/markdown; charset=utf-8');
ok('llms type', hv(S('/llms.txt'), 'content-type'), 'text/plain; charset=utf-8');
ok('manifest type', hv(S('/site.webmanifest'), 'content-type'), 'application/manifest+json');
ok('stamped', hv(S('/assets/studio/js/lfs.js', undefined, { v: { value: 'abc' } }), 'cache-control'), 'public, max-age=31536000, immutable');
ok('unstamped', hv(S('/assets/studio/js/lfs.js'), 'cache-control'), undefined);
ok('font', hv(S('/assets/fonts/a.woff2'), 'cache-control'), 'public, max-age=31536000');
ok('404 keeps type', hv(S('/nope.md', undefined, {}, 404), 'content-type'), undefined);
console.log(bad ? bad + ' edge checks FAILED' : 'edge checks OK (' + v.redirects.length + ' redirects, rules)');
process.exit(bad ? 1 : 0);
