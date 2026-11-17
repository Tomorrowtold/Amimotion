// CloudFront viewer-request. APEX and REDIRECTS are filled in by aws/render.py (REDIRECTS comes from vercel.json).
var APEX = '${Apex}';
var EXACT = __EXACT__;
var PREFIX = __PREFIX__;
function qs(q) {
  var out = [];
  for (var k in q) {
    var v = q[k];
    if (v.multiValue) { for (var i = 0; i < v.multiValue.length; i++) out.push(k + '=' + v.multiValue[i].value); }
    else out.push(v.value === '' ? k : k + '=' + v.value);
  }
  return out.length ? '?' + out.join('&') : '';
}
function go(loc) { return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: loc }, 'cache-control': { value: 'public, max-age=3600' } } }; }
function handler(event) {
  var r = event.request, host = r.headers.host ? r.headers.host.value : '', uri = r.uri;
  if (APEX && host === APEX) return go('https://www.' + APEX + uri + qs(r.querystring));
  if (uri === '/api' || uri.indexOf('/api/') === 0) { r.headers['x-site-host'] = { value: host }; return r; }
  // addresses of the old site and of moved pages
  var bare = uri.length > 1 && uri.slice(-1) === '/' ? uri.slice(0, -1) : uri;
  if (EXACT[bare]) return go(EXACT[bare]);
  for (var i = 0; i < PREFIX.length; i++) if (uri.indexOf(PREFIX[i][0]) === 0) return go(PREFIX[i][1]);
  if (uri === '/index.html') return go('/' + qs(r.querystring));
  if (uri.length > 11 && uri.slice(-11) === '/index.html') return go(uri.slice(0, -10) + qs(r.querystring));
  if (uri.slice(-1) === '/') { r.uri = uri + 'index.html'; return r; }
  if (uri.lastIndexOf('.') < uri.lastIndexOf('/')) return go(uri + '/' + qs(r.querystring));
  return r;
}
