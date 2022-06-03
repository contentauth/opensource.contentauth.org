(function () {
  // Check if window/document is defined because build fails on
  // server on client modules.
  // See: https://github.com/facebook/docusaurus/issues/4268
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  function manageScrollClass() {
    var className = 'is-scrolling';
    var scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollTop > 0) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  }

  manageScrollClass();
  window.addEventListener('scroll', manageScrollClass);
})();
