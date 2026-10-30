(() => {
  "use strict";

  // Review the saved portraits without changing any other section of the site.
  const portraitVariant = new URLSearchParams(window.location.search).get("portrait");
  const heroPortrait = document.querySelector("#hero-portrait");
  if (heroPortrait && ["a", "b"].includes(portraitVariant)) {
    heroPortrait.src = `/assets/images/portraits/jason-portrait-vintage-${portraitVariant}.png`;
    heroPortrait.width = 912;
    heroPortrait.height = 1104;
    heroPortrait.closest(".portrait-print")?.classList.remove("paper-c");
  }
})();
