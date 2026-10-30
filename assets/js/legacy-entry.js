// Compatibility for the old standalone filename; the site uses real HTML pages.
const legacyDestinations = {
  shows: "shows.html",
  about: "about.html",
  clips: "videos.html",
  acclaim: "index.html",
  contact: "contact.html"
};
const oldSection = window.location.hash.slice(1);
const destination = legacyDestinations[oldSection] || "index.html";
const anchor = legacyDestinations[oldSection] ? "" : window.location.hash;
window.location.replace(destination + window.location.search + anchor);
