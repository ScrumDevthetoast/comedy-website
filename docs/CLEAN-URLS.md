# Clean URLs on GitHub Pages

Home stays at `/`. Public pages are `/shows/`, `/about/`, `/videos/` and `/contact/`, each served by a real directory `index.html`. Navigation, static resources and dynamically assigned image paths use site-root URLs for the existing custom domain. CSS-relative URLs are unchanged.

Reviews remains removed per the owner: `/reviews/` and `/reviews.html` redirect to `/`.

The old `.html` documents redirect with an external script using `location.replace`, retaining query strings and fragments. Meta refresh and a visible link provide a JavaScript-disabled fallback (the meta fallback cannot retain arbitrary query strings/fragments). `/index.html` normalizes to `/` when JavaScript is enabled. Legacy `index-sticker.html` section links route directly to clean URLs.

GitHub Pages static hosting does not support configurable HTTP 301 rules here; compatibility redirects are client-side HTML redirects. Directory slash normalization is provided by the static server. Canonical links identify the production URLs.

The existing Pages source (`main`, repository root), CNAME and `.nojekyll` are unchanged. No rewrite server, SPA fallback, build dependency or hosting migration is required. Root URLs intentionally target the custom-domain root, rather than a GitHub project subdirectory.

Validated locally: all six entry points (five pages plus Reviews redirect), direct loads, eight old URL/fragment cases, all runtime assets, desktop at 1440x900 and 1366x768, mobile at 390x844, show data/expiry, video thumbnails/targets, and unchanged body markup except URL attributes. CSS and artwork bytes remain unchanged.
