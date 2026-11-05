# Google Analytics 4

Measurement ID: `G-6F1Z733F9V` (public web tag, not a secret).

The five public pages load `/assets/js/analytics.js?v=20261105`. It queues the standard Google tag initialization and config once, then loads gtag.js asynchronously. GA4 sends the normal page view; no extra manual page-view event is added. Google Analytics stream settings control Enhanced Measurement.

Tracking is limited to `jasonhowelljokes.com` and `www.jasonhowelljokes.com`. Local previews, the GitHub hostname and redirect-only documents do not initialize tracking. `/index.html` waits for the canonical home redirect, avoiding an extra page view.

Check the website in GA4 Realtime after publication. Ad blockers or browser privacy controls can prevent a visitor from being measured. No custom ad tags, user IDs or custom video/email events were added. Existing Google account and stream settings remain unchanged.

Validation: `node tools/check_analytics.cjs`, plus the existing site and behavior checks. This code change does not modify CSS, artwork, links, or hosting configuration.
