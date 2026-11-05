// GA4 for the public site only; previews and redirect-only visits are excluded.
(() => {
  "use strict";
  const measurementId = "G-6F1Z733F9V";
  if (!["jasonhowelljokes.com", "www.jasonhowelljokes.com"].includes(window.location.hostname)) return;
  const redirectTo = document.documentElement.dataset.redirectTo;
  if (redirectTo && window.location.pathname !== redirectTo) return;
  if (window.jhAnalyticsLoaded) return;
  window.jhAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.append(tag);
})();
