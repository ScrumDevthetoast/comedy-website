// Static-host redirects preserve query parameters and fragments without adding history.
(() => {
  "use strict";
  const target = document.documentElement.dataset.redirectTo;
  if (target && window.location.pathname !== target) {
    window.location.replace(target + window.location.search + window.location.hash);
  }
})();
