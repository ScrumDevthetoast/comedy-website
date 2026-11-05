"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "assets/js/analytics.js"), "utf8");
const pages = ["index.html", "shows/index.html", "about/index.html", "videos/index.html", "contact/index.html"];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  assert.equal((html.match(/src="\/assets\/js\/analytics\.js\?v=20261105" defer/g) || []).length, 1, page);
}
for (const page of ["shows.html", "about.html", "videos.html", "contact.html", "reviews.html", "reviews/index.html", "index-sticker.html"]) {
  assert.ok(!fs.readFileSync(path.join(root, page), "utf8").includes("analytics.js"), page);
}
function run(hostname, pathname, redirectTo) {
  const tags = [];
  const context = vm.createContext({
    window: {location: {hostname, pathname}},
    document: {documentElement: {dataset: {redirectTo}}, createElement: () => ({}), head: {append: tag => tags.push(tag)}}
  });
  vm.runInContext(source, context);
  vm.runInContext(source, context);
  return {context, tags};
}
for (const hostname of ["jasonhowelljokes.com", "www.jasonhowelljokes.com"]) {
  for (const pathname of ["/", "/shows/", "/about/", "/videos/", "/contact/"]) {
    const {context, tags} = run(hostname, pathname, pathname === "/" ? "/" : undefined);
    assert.equal(tags.length, 1);
    assert.equal(tags[0].src, "https://www.googletagmanager.com/gtag/js?id=G-6F1Z733F9V");
    assert.equal(tags[0].async, true);
    assert.equal(context.window.dataLayer.length, 2);
    assert.deepEqual(Array.from(context.window.dataLayer[1]), ["config", "G-6F1Z733F9V"]);
  }
}
for (const hostname of ["localhost", "127.0.0.1", "scrumdevthetoast.github.io", "unrelated.example"]) {
  const {context, tags} = run(hostname, "/");
  assert.equal(tags.length, 0);
  assert.equal(context.window.dataLayer, undefined);
}
assert.equal(run("jasonhowelljokes.com", "/index.html", "/").tags.length, 0);
console.log("PASS: GA4 on all five pages, correct ID, single initialization, no preview/redirect hits, and asynchronous Google tag.");
