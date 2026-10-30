// Edit shows, social accounts, and video links here. Asset paths are relative to the site root.
(() => {
  "use strict";

  const socials = {
    instagram: "https://instagram.com/jasonhowellJokes",
    youtube: "https://youtube.com/@jasonhowellJokes",
    tiktok: "https://www.tiktok.com/@jasonhowelljokes1"
  };

  // Edit real bookings here. Past dates stay in the data but leave upcoming listings.
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
    },
    {
      date: "2026-11-10",
      city: "Ann Arbor, MI",
      venue: "Hear.Say Brewing & Theater",
      role: "OFF-KEY Comedy",
      details: "7:00 PM",
      ticketLabel: "Follow for Details",
      ticketUrl: socials.instagram
    }
  ];

  const clips = [
    {
      title: "Latest Reel",
      thumbnailPath: "/assets/images/clips/clip-daxgawuhitv.png",
      linkLabel: "Watch reel",
      linkUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgawUhItV/?hl=en"
    },
    {
      title: "Club Set",
      thumbnailPath: "/assets/images/clips/clip-daxgoizhx9w.png",
      linkLabel: "Watch reel",
      linkUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgOiZhX9W/?hl=en"
    },
    {
      title: "Stand-Up Snippet",
      thumbnailPath: "/assets/images/clips/clip-da7pzo-blgc.png",
      linkLabel: "Watch reel",
      linkUrl: "https://www.instagram.com/jasonhowelljokes/reel/Da7pZo-BlgC/?hl=en"
    }
  ];

  const instagramPosts = [
    {
      title: "Instagram Reel 01",
      thumbnailPath: "/assets/images/clips/clip-daxgawuhitv.png",
      postUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgawUhItV/?hl=en"
    },
    {
      title: "Instagram Reel 02",
      thumbnailPath: "/assets/images/clips/clip-daxgoizhx9w.png",
      postUrl: "https://www.instagram.com/jasonhowelljokes/reel/DaxgOiZhX9W/?hl=en"
    },
    {
      title: "Instagram Reel 03",
      thumbnailPath: "/assets/images/clips/clip-da7pzo-blgc.png",
      postUrl: "https://www.instagram.com/jasonhowelljokes/reel/Da7pZo-BlgC/?hl=en"
    },
    {
      title: "Instagram Reel 04",
      thumbnailPath: "/assets/images/clips/clip-da5jlgmbw-t.png",
      postUrl: "https://www.instagram.com/jasonhowelljokes/reel/Da5jLGMBW-T/?hl=en"
    }
  ];

  window.comedySiteData = { socials, shows, clips, instagramPosts };
})();
