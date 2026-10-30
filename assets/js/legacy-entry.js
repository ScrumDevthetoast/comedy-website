// Compatibility for the old standalone filename; the site uses real HTML pages.
const legacyDestinations = {
  shows: "/shows/",
  about: "/about/",
  clips: "/videos/",
  acclaim: "/",
  contact: "/contact/"
};
const oldSection = window.location.hash.slice(1);
const destination = legacyDestinations[oldSection] || "/";
const anchor = legacyDestinations[oldSection] ? "" : window.location.hash;
window.location.replace(destination + window.location.search + anchor);
