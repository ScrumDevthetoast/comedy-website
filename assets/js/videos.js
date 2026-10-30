/* The drive-in consumes existing data; never creates clips or repeats them to fill slots. */
(() => {
  'use strict';
  const board = document.querySelector('#video-billboard');
  const links = document.querySelector('#video-links');
  const data = window.comedySiteData;
  if (!board || !links || !data) return; // Four real static links remain without JS.
  const seen = new Set();
  const clips = [...data.clips, ...data.instagramPosts.map(post => ({
    title: post.title, thumbnailPath: post.thumbnailPath, linkUrl: post.postUrl
  }))].filter(clip => {
    const key = new URL(clip.linkUrl, location.href).pathname.replace(/\/$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const previous = document.querySelector('#videos-prev');
  const next = document.querySelector('#videos-next');
  const position = document.querySelector('#videos-position');
  const pagination = document.querySelector('.videos-pagination');
  let page = 0;
  function render() {
    board.querySelectorAll('.screen-picture, .screen-link').forEach(node => node.remove());
    links.replaceChildren();
    clips.slice(page * 4, page * 4 + 4).forEach((clip, slot) => {
      const picture = document.createElement('div');
      picture.className = `screen-picture screen-slot-${slot}`;
      picture.setAttribute('aria-hidden', 'true');
      const image = document.createElement('img');
      image.src = clip.thumbnailPath;
      image.alt = '';
      image.width = 400;
      image.height = 300;
      picture.append(image);
      const link = document.createElement('a');
      link.className = `screen-link screen-slot-${slot}`;
      link.href = clip.linkUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.setAttribute('aria-label', `Watch ${clip.title} on Instagram (opens in a new tab)`);
      const play = document.createElement('span');
      play.className = 'screen-play';
      play.setAttribute('aria-hidden', 'true');
      link.append(play);
      board.append(picture, link);
      const mobile = link.cloneNode(false);
      mobile.className = '';
      mobile.textContent = `Watch ${clip.title} →`;
      links.append(mobile);
    });
    previous.disabled = page === 0;
    next.disabled = (page + 1) * 4 >= clips.length;
    position.textContent = `Videos ${page * 4 + 1}–${Math.min((page + 1) * 4, clips.length)} of ${clips.length}`;
    pagination.hidden = clips.length <= 4;
  }
  previous.addEventListener('click', () => { page = Math.max(0, page - 1); render(); });
  next.addEventListener('click', () => { page = Math.min(Math.max(0, Math.ceil(clips.length / 4) - 1), page + 1); render(); });
  render();
})();
