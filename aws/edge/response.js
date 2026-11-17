// CloudFront viewer-response: the rules vercel.json gives the tested build, for the AWS site.
var TYPES = { md: 'text/markdown; charset=utf-8', txt: 'text/plain; charset=utf-8', webmanifest: 'application/manifest+json', avif: 'image/avif', webp: 'image/webp', woff2: 'font/woff2', mjs: 'text/javascript; charset=utf-8', xml: 'application/xml; charset=utf-8' };
function handler(event) {
  var r = event.request, res = event.response, h = res.headers, host = r.headers.host ? r.headers.host.value : '', uri = r.uri;
  var dot = uri.lastIndexOf('.'), ext = dot > uri.lastIndexOf('/') ? uri.slice(dot + 1).toLowerCase() : '';
  // the test address, the desk and the Markdown twins stay out of search engines; the real domain is indexable
  if (/\.cloudfront\.net$/.test(host)) h['x-robots-tag'] = { value: 'noindex, nofollow' };
  else if (uri.indexOf('/desk/') === 0) h['x-robots-tag'] = { value: 'noindex, nofollow' };
  else if (ext === 'md') h['x-robots-tag'] = { value: 'noindex' };
  if (TYPES[ext] && res.statusCode < 300) h['content-type'] = { value: TYPES[ext] };
  // a file whose link carries ?v=<hash of its content> can be kept for a year; fonts too
  if (uri.indexOf('/assets/') === 0 && res.statusCode === 200) {
    if (r.querystring && r.querystring.v) h['cache-control'] = { value: 'public, max-age=31536000, immutable' };
    else if (ext === 'woff2' || ext === 'woff') h['cache-control'] = { value: 'public, max-age=31536000' };
  }
  return res;
}
