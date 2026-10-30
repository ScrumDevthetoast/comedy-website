# Jason Howell Comedy

Live site: https://jasonhowelljokes.com/

Approved western-punk redesign with five public pages: Home, Shows, About, Videos and Contact. Reviews and the shared footer were removed at the owner's request. The design, portraits and artwork are preserved.

## Publishing

The existing GitHub Pages configuration publishes `main` from the repository root. Keep `CNAME` set to `jasonhowelljokes.com` and retain `.nojekyll`. No framework, build service, GIMP, Inkscape or local Windows paths are required at runtime.

All production artwork, local fonts, scripts and editable show data are under `assets/`. The homepage's lossless WebP portrait preserves every visible pixel and alpha value, reduces the request by 64%, and retains the approved original PNG. The optional `?portrait=a` / `?portrait=b` previews still work.

Complete editable artwork masters and historical QA captures are preserved in the local authoring repository snapshot; they are not website payload. Original flat asset URLs from the previous website remain available for compatibility. `index-sticker.html` supports older standalone links.

## Content

Edit shows and video links in `assets/js/site-data.js`. OFF-KEY Comedy is listed for November 10, 2026 at 7:00 PM at Hear.Say Brewing & Theater in Ann Arbor. Expired shows automatically leave the upcoming list. No ticket URL was supplied, so the existing Instagram details link is retained.

Booking email: `jasonhowelljokes@gmail.com`. TikTok: `@jasonhowelljokes1`. Instagram and YouTube: `@jasonhowellJokes`.

## Checks

```
python tools/check_site.py
node tools/check_behavior.cjs
node design/videos-phase2/check-videos.cjs
```

The five pages use directory-based navigation, a shared 78px desktop header and flexible main area. Narrow/zoomed layouts allow document scrolling. Public pages use clean directory URLs and assets use site-root paths for the existing custom domain. See [clean URL notes](docs/CLEAN-URLS.md).
