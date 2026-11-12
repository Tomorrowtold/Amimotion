(() => {
  // studio skin, every page. Site audit (12 Nov 2026): the custom locating cursor (a loop that never idled) and the
  // scroll reveals that left headings and pictures at opacity 0 are retired: every page is complete at rest.
  const top = document.querySelector('header.top');
  if (top) { const on = () => top.classList.toggle('sk-scrolled', scrollY > 8); addEventListener('scroll', on, { passive: true }); on(); }
})();
