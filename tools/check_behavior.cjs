/* Optional Node-only regression checks; not loaded by the website. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, 'assets/js', name), 'utf8');

class Node {
  constructor(tag = 'div') {
    this.tagName = tag;
    this.children = [];
    this.listeners = {};
    this.scrollLeft = 0;
    this.scrollWidth = 900;
    this.clientWidth = 500;
  }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(key, value) { this[key] = value; }
  addEventListener(key, fn) { this.listeners[key] = fn; }
  closest() { return null; }
  querySelector() { return this.children[0]; }
  getBoundingClientRect() { return { width: 200 }; }
  scrollBy({ left }) { this.scrollLeft += left; }
}

function run(selectors = [], day = '2026-10-29', loadData = true, mutate, currentSchedule = false) {
  const nodes = Object.fromEntries(selectors.map(key => [key, new Node()]));
  const context = vm.createContext({
    window: { addEventListener() {} },
    document: { querySelector: key => nodes[key] || null, createElement: tag => new Node(tag) },
    console: { error: (...args) => { throw new Error(args.join(' ')); } },
    Intl,
    Date: class extends Date { constructor(...args) { super(...(args.length ? args : [day + 'T23:59:00'])); } },
    getComputedStyle: () => ({ columnGap: '18px' }),
    matchMedia: () => ({ matches: true })
  });
  if (loadData) vm.runInContext(source('site-data.js'), context);
  // Keep the original two archived bookings as stable historical boundary fixtures.
  if (loadData && !currentSchedule) context.window.comedySiteData.shows = context.window.comedySiteData.shows.filter(show => show.date < '2026-10-01');
  if (mutate) mutate(context.window.comedySiteData);
  vm.runInContext(source('site.js'), context);
  return { nodes, data: context.window.comedySiteData };
}

// Ordinary pages need neither the data bundle nor any page-specific elements.
run([], undefined, false);
run([]);
const showSelectors = ['#shows-grid', '#next-show-date', '#next-show-title', '#next-show-meta', '#next-show-link'];
let result = run(showSelectors, '2026-08-01');
assert.equal(result.nodes['#next-show-title'].textContent, result.data.shows[0].venue);
assert.equal(result.nodes['#next-show-link'].href, result.data.shows[0].ticketUrl);
assert.equal(result.nodes['#shows-grid'].children.length, 1);
assert.equal(result.nodes['#shows-grid'].children[0].children[1].tagName, 'h2');
result = run(showSelectors, '2026-08-28');
assert.equal(result.nodes['#next-show-title'].textContent, result.data.shows[0].venue);
result = run(showSelectors, '2026-08-29');
assert.equal(result.nodes['#next-show-title'].textContent, result.data.shows[1].venue);
assert.equal(result.nodes['#shows-grid'].hidden, true);
result = run(showSelectors);
assert.equal(result.nodes['#next-show-date'].textContent, 'Dates coming soon');
assert.equal(result.nodes['#next-show-link'].href, result.data.socials.instagram);
result = run(showSelectors, '2026-08-01', true, data => {
  data.shows = [...data.shows].reverse();
  data.shows.unshift({ date: 'not-a-date' });
});
assert.equal(result.nodes['#next-show-title'].textContent, 'Toledo Sprits');

const pagedShows = [...showSelectors, '#shows-pagination', '#shows-prev', '#shows-next', '#shows-position'];
result = run(pagedShows, '2026-08-01');
assert.equal(result.nodes['#shows-grid'].hidden, true);
assert.equal(result.nodes['#shows-grid'].children.length, 0);
assert.equal(result.nodes['#shows-pagination'].hidden, false);
assert.equal(result.nodes['#shows-position'].textContent, 'Show 1 of 2');
assert.equal(result.nodes['#shows-prev'].disabled, true);
assert.equal(result.nodes['#shows-next'].disabled, false);
result.nodes['#shows-next'].listeners.click();
assert.equal(result.nodes['#shows-position'].textContent, 'Show 2 of 2');
assert.equal(result.nodes['#next-show-title'].textContent, result.data.shows[1].venue);
assert.equal(result.nodes['#next-show-link'].href, result.data.shows[1].ticketUrl);
assert.equal(result.nodes['#shows-next'].disabled, true);
result.nodes['#shows-next'].listeners.click();
assert.equal(result.nodes['#shows-position'].textContent, 'Show 2 of 2');
result.nodes['#shows-prev'].listeners.click();
assert.equal(result.nodes['#next-show-title'].textContent, result.data.shows[0].venue);
assert.equal(result.nodes['#next-show-link'].href, result.data.shows[0].ticketUrl);
result = run(pagedShows, '2026-08-29');
assert.equal(result.nodes['#shows-pagination'].hidden, true);
assert.equal(result.nodes['#next-show-title'].textContent, result.data.shows[1].venue);
result = run(pagedShows);
assert.equal(result.nodes['#next-show-date'].textContent, 'Dates coming soon');
assert.equal(result.nodes['#next-show-link'].href, result.data.socials.instagram);

// Current real booking: visible now and on the show date, expired the next day.
for (const day of ['2026-10-30', '2026-11-10']) {
  result = run(pagedShows, day, true, undefined, true);
  assert.equal(result.nodes['#next-show-title'].textContent, 'Hear.Say Brewing & Theater');
  assert.equal(result.nodes['#next-show-meta'].textContent, 'Ann Arbor, MI | OFF-KEY Comedy | 7:00 PM');
  assert.equal(result.nodes['#shows-pagination'].hidden, true);
  assert.equal(result.nodes['#next-show-link'].href, result.data.socials.instagram);
}
result = run(pagedShows, '2026-11-11', true, undefined, true);
assert.equal(result.nodes['#next-show-date'].textContent, 'Dates coming soon');

result = run(['#clips-grid', '#instagram-carousel', '#carousel-prev', '#carousel-next']);
assert.equal(result.nodes['#clips-grid'].children.length, result.data.clips.length);
assert.equal(result.nodes['#instagram-carousel'].children.length, result.data.instagramPosts.length);
assert.equal(result.nodes['#carousel-prev'].disabled, true);
result.nodes['#carousel-next'].listeners.click();
assert.equal(result.nodes['#instagram-carousel'].scrollLeft, 218);
result.nodes['#carousel-prev'].listeners.click();
assert.equal(result.nodes['#instagram-carousel'].scrollLeft, 0);
let prevented = false;
const track = result.nodes['#instagram-carousel'];
track.listeners.keydown({ target: track, key: 'ArrowRight', preventDefault() { prevented = true; } });
assert.equal(prevented, true);
assert.equal(track.scrollLeft, 218);

for (const [fragment, file] of Object.entries({ '': 'index.html', shows: 'shows.html', about: 'about.html', clips: 'videos.html', acclaim: 'index.html', contact: 'contact.html' })) {
  let destination;
  const context = vm.createContext({ window: { location: { hash: fragment ? '#' + fragment : '', search: '?portrait=b', replace: value => { destination = value; } } } });
  vm.runInContext(source('legacy-entry.js'), context);
  assert.equal(destination, file + '?portrait=b');
}
console.log('PASS: absent DOM/data guards, real show sorting/date boundaries/expiry/tickets, pagination/bounds, invalid dates, clips, carousel buttons/keyboard, and legacy entries.');
