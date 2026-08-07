const socials = {
  instagram: "https://instagram.com/jasonhowellJokes",
  youtube: "https://youtube.com/@jasonhowellJokes",
  tiktok: "https://www.tiktok.com/@jasonhowelljokes"
};

const shows = [
  {
    date: "2026-08-28",
    city: "Toledo, OH",
    venue: "Toledo Sprits",
    role: "Crumbley Comedy Cup",
    details: "7:00 PM",
    ticketLabel: "Follow for Details",
    ticketUrl: socials.instagram
  },
  {
    date: "2026-09-24",
    city: "Livonia, MI",
    venue: "Super Natural Brewery",
    role: "Comedy Night",
    details: "7:30 PM to 9:00 PM | $10 tickets",
    ticketLabel: "Get Tickets",
    ticketUrl: "https://www.supernaturalbrewing.com/comedy-night-tickets"
  }
];

const clips = [
  {
    title: "Latest Reel",
    thumbnailPath: "clip-daxgawuhitv.png",
    linkLabel: "Watch reel",
    linkUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgawUhItV/?hl=en"
  },
  {
    title: "Club Set",
    thumbnailPath: "clip-daxgoizhx9w.png",
    linkLabel: "Watch reel",
    linkUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgOiZhX9W/?hl=en"
  },
  {
    title: "Stand-Up Snippet",
    thumbnailPath: "clip-da7pzo-blgc.png",
    linkLabel: "Watch reel",
    linkUrl: "https://www.instagram.com/jasonhowelljokes/reel/Da7pZo-BlgC/?hl=en"
  }
];

const instagramPosts = [
  {
    title: "Instagram Reel 01",
    thumbnailPath: "clip-daxgawuhitv.png",
    postUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgawUhItV/?hl=en"
  },
  {
    title: "Instagram Reel 02",
    thumbnailPath: "clip-daxgoizhx9w.png",
    postUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgOiZhX9W/?hl=en"
  },
  {
    title: "Instagram Reel 03",
    thumbnailPath: "clip-da7pzo-blgc.png",
    postUrl: "https://www.instagram.com/jasonhowelljokes/reel/Da7pZo-BlgC/?hl=en"
  },
  {
    title: "Instagram Reel 04",
    thumbnailPath: "clip-da5jlgmbw-t.png",
    postUrl: "https://www.instagram.com/jasonhowelljokes/reel/Da5jLGMBW-T/?hl=en"
  }
];

const showGrid = document.querySelector("#shows-grid");
const clipsGrid = document.querySelector("#clips-grid");
const nextShowDate = document.querySelector("#next-show-date");
const nextShowTitle = document.querySelector("#next-show-title");
const nextShowMeta = document.querySelector("#next-show-meta");
const nextShowLink = document.querySelector("#next-show-link");
const instagramCarousel = document.querySelector("#instagram-carousel");
const carouselPrev = document.querySelector("#carousel-prev");
const carouselNext = document.querySelector("#carousel-next");

function formatDate(dateString, options) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function renderShows() {
  const sortedShows = [...shows].sort((a, b) => a.date.localeCompare(b.date));
  const nextShow = sortedShows[0];

  if (nextShow) {
    nextShowDate.textContent = formatDate(nextShow.date, {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    nextShowTitle.textContent = nextShow.venue;
    nextShowMeta.textContent = `${nextShow.city} | ${nextShow.role} | ${nextShow.details}`;
    nextShowLink.href = nextShow.ticketUrl;
    nextShowLink.textContent = nextShow.ticketLabel;
  }

  const remainingShows = sortedShows.slice(1);

  showGrid.innerHTML = remainingShows
    .map(
      (show) => `
        <article class="show-item">
          <p class="show-item-date">
            ${formatDate(show.date, {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </p>
          <div>
            <h3>${show.venue}</h3>
            <p class="show-meta">${show.city} | ${show.role} | ${show.details}</p>
          </div>
          <a class="text-link" href="${show.ticketUrl}" target="_blank" rel="noreferrer">${show.ticketLabel}</a>
        </article>
      `
    )
    .join("");

  showGrid.hidden = remainingShows.length === 0;
}

function renderClips() {
  clipsGrid.innerHTML = clips
    .map(
      (clip) => `
        <a class="clip-item" href="${clip.linkUrl}" target="_blank" rel="noreferrer">
          <div class="clip-frame">
            <img class="clip-thumb" src="${clip.thumbnailPath}" alt="${clip.title} thumbnail">
          </div>
          <div class="clip-copy">
            <h3 class="clip-title">${clip.title}</h3>
            <span class="clip-action">${clip.linkLabel}</span>
          </div>
        </a>
      `
    )
    .join("");
}

function renderInstagramCarousel() {
  instagramCarousel.innerHTML = instagramPosts
    .map(
      (post) => `
        <a class="carousel-item" href="${post.postUrl}" target="_blank" rel="noreferrer" aria-label="${post.title}">
          <img class="carousel-thumb" src="${post.thumbnailPath}" alt="${post.title} thumbnail">
        </a>
      `
    )
    .join("");
}

function setupCarouselControls() {
  if (!instagramCarousel || !carouselPrev || !carouselNext) {
    return;
  }

  const scrollByCard = (direction) => {
    const firstCard = instagramCarousel.querySelector(".carousel-item");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 18 : 320;

    instagramCarousel.scrollBy({
      left: cardWidth * direction,
      behavior: "smooth"
    });
  };

  carouselPrev.addEventListener("click", () => scrollByCard(-1));
  carouselNext.addEventListener("click", () => scrollByCard(1));
}

renderShows();
renderClips();
renderInstagramCarousel();
setupCarouselControls();
