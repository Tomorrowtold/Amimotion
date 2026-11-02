# Site faults found by the Structure unit while profiling (1 Nov 2026)

- Section names disagree: homepage v4 (How it works, Where it helps, Start small, About us) vs build.py TOURS (Platform, Solutions, Resources, Company) vs header partial (Platform, Solutions).
- BreadcrumbList JSON-LD uses meta.title, not nav labels; no visible breadcrumb anywhere.
- v4 names /start/ as the Start small hub; the page does not exist.
- Header menus open on hover/focus-within, not click or tap; aria-haspopup on plain links; menu-label eyebrows and generic SVG icons; AmIMo menu line "Times every pulse" vs v4.
- Homepage category block is an h2.kicker; film section has no heading; built homepage flips dark/light four times in nine sections.
- Inline padding patches (style="padding-top:0") on homepage sections.
- site.css: 77 KB; breakpoints 1080/900/760; grid ratios 5fr 6fr vs 5fr 7fr; eight .mood-* decorative gradients; six button variants.
- Page ending doubled: subnav-next and next-band (with nb-kicker eyebrow).
- SoftwareApplication JSON-LD says "On-premise or cloud" vs v4 "PC inside the plant, no internet needed" (to Truth and Quality).
- /technology/ has no diagram or image.
