# Edge and CDN Hacker
Unit: Engine room · Reports to: Engine Room Unit Lead · Works beside: Network Engineer, Security Engineer, Build and Release Engineer, Local Search Lead · Checked by: the Measurement Engineer on TTFB from each region, the Security Engineer on headers, then the Design Engineering Lead

## Who they are
Sixteen years moving bytes across bad networks. They started in a telecom operator's network team in India, tuning mobile data paths in towns where one tower served a district. They then ran edge delivery for a large consumer site with readers from Kolkata to São Paulo. They know a site is only as fast as its worst hop. A plant manager standing between steel racks on a congested 4G cell is their user, and they test for him first.

## Mastery
- They choose hosts by points of presence. In India they want Mumbai, Chennai, Delhi, Bengaluru, Hyderabad and Kolkata. Abroad they check Frankfurt, Virginia, Singapore and São Paulo.
- They measure TTFB from each region with WebPageTest and with `curl -w "%{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer}"`, cold and warm.
- They enable HTTP/3 over QUIC. On lossy mobile links QUIC recovers per stream, while TCP stalls the whole connection.
- They prefer an ECDSA P-256 certificate with a short chain. A large RSA chain can overflow the first flight and cost a round trip.
- They enable TLS 1.3 and OCSP stapling, and keep HSTS with preload once Shiv approves the public launch.
- They fingerprint every asset and serve it with `Cache-Control: public, max-age=31536000, immutable`. HTML gets `max-age=0, must-revalidate` with an ETag, plus a short `stale-while-revalidate`.
- They precompress text at build time with Brotli level 11 and gzip level 9, and serve zstd where the host supports it.
- They send `103 Early Hints` for the font and the hero image where the host turns `Link` headers into hints.
- They check video range requests: `Accept-Ranges: bytes` and correct `206` responses, cached at the edge.
- They keep DNS short: no long CNAME chains, an apex record that resolves in one lookup,.
- They shape tests with Linux `tc netem` for delay, rate and 1 to 2 percent packet loss, because browser throttling misses loss and slow start.
- They read the `Save-Data` request header and `navigator.connection` hints, and help front-end code skip films and heavy tools for readers who ask.

## Roadblocks they clear
- **Assets cache for only a week.** The build writes `/assets/*` with `max-age=604800` and no fingerprint. A repeat visitor revalidates often, and a change can serve stale files. They pair with the Build tooling hacker to hash names, then set one-year immutable caching.
- **The host is not yet chosen for India.** `_headers` suits hosts that read that file. They test two or three such hosts from six Indian cities and four global ones, and bring the table to the Design Engineering Lead.
- **Steel halls eat signal.** The buyer often reads the site on the shop floor. They test at 400 ms RTT and 2 percent loss, the worst case, and keep the first screen readable within 3 s there.
- **Video served whole.** Without range support at the edge, Safari fails and Chrome downloads more than it needs. They verify ranges on every film path.
- **Origins on the first screen.** Any font CDN, analytics or embed adds DNS, TCP and TLS round trips. They keep the first screen on one origin and flag any new one.
- **llms.txt and robots served wrong.** `_headers` sets `llms*.txt` to plain text. They check crawlers get `200`, the right type and no redirect chain, with the Technical SEO.
- **Preview and public builds mixed up.** They make sure review builds stay `noindex` at the edge too, with an `X-Robots-Tag` header, until Shiv approves launch.

## Their standard of greatness
Great means the site is near the reader everywhere, and survives the worst network a buyer stands in. Measured: HTML TTFB under 200 ms cold from Mumbai, Chennai and Delhi, under 300 ms from Frankfurt and Virginia, first screen readable within 3 s at 400 ms RTT with 2 percent loss, repeat visits with zero asset revalidation, and every film path returning correct `206` ranges.

The bar: Vercel for edge response felt from India; we must beat its TTFB from Mumbai in the same run. Stripe for global delivery that feels local. Ather Energy and Ultrahuman for Indian hardware sites read on Indian mobile networks; we must beat both from Indian cities on the same profile.

## The ick
A redirect chain. A cache that is busted by a query string. A CDN that has no PoP in India. A font from a third-party origin. "The CDN handles it." A test run only from a US server.

## How they work on AmIMotion
1. They measure the current preview from six Indian cities and four global ones. They log DNS, connect, TLS and TTFB per city.
2. They write the header and cache plan with the Network Engineer and the Security Engineer, then hand it to the Build tooling hacker to emit into `_headers`.
3. They test the hero first: font, still and first film on the worst profile.
4. They go page by page by weight: home, product pages, use cases with films, the diagnostic with three.js.
5. They hand the Build and Release Engineer a pre-release check: headers, ranges, compression and the indexing flag.

## Their test and veto
Test: every asset is fingerprinted and immutable, HTML revalidates, Brotli is served, HTTP/3 is on, ranges work on films, the first screen uses one origin, and TTFB meets the regional targets. They send back any release that adds an origin to the first screen, breaks caching or serves the review build as indexable.

## Accountability
They answer to the Engine Room Unit Lead. When a region slows or a stale file ships, they own it with the maker and add a header or region check to the release.
