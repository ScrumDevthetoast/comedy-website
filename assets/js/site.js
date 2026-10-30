(() => {
  "use strict";

  const data = window.comedySiteData;
  if (!data) return;
  const { socials, shows, clips, instagramPosts } = data;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function externalLink(className, label, href) {
    const link = element("a", className, label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    return link;
  }

  function formatDate(value, options) {
    return new Intl.DateTimeFormat("en-US", options).format(new Date(`${value}T12:00:00`));
  }

  function localDateKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function renderShows(now = new Date()) {
    const grid = document.querySelector("#shows-grid");
    const dateNode = document.querySelector("#next-show-date");
    const title = document.querySelector("#next-show-title");
    const meta = document.querySelector("#next-show-meta");
    const link = document.querySelector("#next-show-link");
    if (!grid || !dateNode || !title || !meta || !link) return;

    const today = localDateKey(now);
    const upcoming = shows.filter((show) => {
      const parsed = new Date(`${show.date}T12:00:00`);
      return !Number.isNaN(parsed.getTime()) && localDateKey(parsed) === show.date && show.date >= today;
    }).sort((a, b) => a.date.localeCompare(b.date));

    grid.replaceChildren();
    grid.hidden = upcoming.length < 2;
    const next = upcoming[0];
    if (!next) {
      dateNode.textContent = "Dates coming soon";
      title.textContent = "More shows on the horizon.";
      meta.textContent = "For the latest announcements, find me on Instagram.";
      link.textContent = "Follow for updates \u2192";
      link.href = socials.instagram;
      return;
    }

    dateNode.textContent = formatDate(next.date, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    title.textContent = next.venue;
    meta.textContent = `${next.city} | ${next.role} | ${next.details}`;
    link.textContent = `${next.ticketLabel} \u2192`;
    link.href = next.ticketUrl;
    const pagination = document.querySelector("#shows-pagination");
    const previous = document.querySelector("#shows-prev");
    const forward = document.querySelector("#shows-next");
    const position = document.querySelector("#shows-position");
    if (pagination && previous && forward && position) {
      // Keep every real listing available without growing the desktop composition.
      let current = 0;
      grid.hidden = true;
      pagination.hidden = upcoming.length < 2;
      function selectShow(index) {
        current = index;
        const show = upcoming[current];
        dateNode.textContent = formatDate(show.date, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
        title.textContent = show.venue;
        meta.textContent = `${show.city} | ${show.role} | ${show.details}`;
        link.textContent = `${show.ticketLabel} \u2192`;
        link.href = show.ticketUrl;
        previous.disabled = current === 0;
        forward.disabled = current === upcoming.length - 1;
        position.textContent = `Show ${current + 1} of ${upcoming.length}`;
      }
      previous.addEventListener("click", () => selectShow(Math.max(0, current - 1)));
      forward.addEventListener("click", () => selectShow(Math.min(upcoming.length - 1, current + 1)));
      selectShow(0);
      return;
    }
    upcoming.slice(1).forEach((show) => {
      const item = element("article", "show-item");
      const date = element("time", "show-item-date", formatDate(show.date, { month: "short", day: "numeric", year: "numeric" }));
      date.dateTime = show.date;
      item.append(date, element("h2", "", show.venue), element("p", "show-meta", `${show.city} | ${show.role} | ${show.details}`), externalLink("ink-link", show.ticketLabel, show.ticketUrl));
      grid.append(item);
    });
  }

  function renderClips() {
    const grid = document.querySelector("#clips-grid");
    if (!grid) return;
    const items = clips.map((clip) => {
      const link = externalLink("video-print", "", clip.linkUrl);
      const frame = element("div", "clip-frame");
      const image = element("img");
      image.src = clip.thumbnailPath;
      image.alt = `${clip.title}: Jason performing stand-up`;
      image.width = 400;
      image.height = 300;
      image.loading = "lazy";
      const play = element("span", "play-icon");
      play.setAttribute("aria-hidden", "true");
      frame.append(image, play);
      link.append(frame, element("span", "clip-title", clip.title));
      return link;
    });
    grid.replaceChildren(...items);
  }

  function renderInstagramCarousel() {
    const track = document.querySelector("#instagram-carousel");
    if (!track) return;
    track.replaceChildren(...instagramPosts.map((post) => {
      const link = externalLink("carousel-item", "", post.postUrl);
      const image = element("img");
      image.src = post.thumbnailPath;
      image.alt = "";
      image.loading = "lazy";
      image.width = 200;
      image.height = 100;
      link.append(image, element("span", "", post.title));
      return link;
    }));
  }

  function setupCarouselControls() {
    const track = document.querySelector("#instagram-carousel");
    const prev = document.querySelector("#carousel-prev");
    const next = document.querySelector("#carousel-next");
    if (!track || !prev || !next) return;
    function update() {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }
    function move(direction) {
      const card = track.querySelector(".carousel-item");
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: (card.getBoundingClientRect().width + gap) * direction, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("scroll", update, { passive: true });
    track.addEventListener("keydown", (event) => {
      if (event.target !== track || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    });
    window.addEventListener("resize", update);
    track.closest("details")?.addEventListener("toggle", update);
    update();
  }

  // Run only enhancements that have a corresponding region on this document.
  const enhancements = [];
  if (document.querySelector("#shows-grid")) enhancements.push(renderShows);
  if (document.querySelector("#clips-grid")) enhancements.push(renderClips);
  if (document.querySelector("#instagram-carousel")) {
    enhancements.push(renderInstagramCarousel, setupCarouselControls);
  }
  for (const setup of enhancements) {
    try { setup(); } catch (error) { console.error("Could not enhance site section:", error); }
  }
})();
