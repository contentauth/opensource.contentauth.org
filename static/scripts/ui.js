(function () {
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

  document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('scroll', manageScrollClass);
  });
})();
