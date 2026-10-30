const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
class Node {
  constructor(tag='div') { this.tag=tag; this.children=[]; this.attrs={}; this.listeners={}; }
  append(...nodes) { nodes.forEach(n=>{n.parent=this;this.children.push(n);}); }
  replaceChildren(...nodes) { this.children=[];this.append(...nodes); }
  setAttribute(k,v) { this.attrs[k]=v; }
  addEventListener(k,f) { this.listeners[k]=f; }
  cloneNode() { const n=new Node(this.tag); Object.assign(n,{attrs:{...this.attrs},href:this.href,target:this.target,rel:this.rel});return n; }
  querySelectorAll() { return this.children.filter(n=>/screen-(picture|link)/.test(n.className)); }
  remove() { this.parent.children=this.parent.children.filter(n=>n!==this); }
}
function run(extra=0,load=true) {
  const nodes=Object.fromEntries(['#video-billboard','#video-links','#videos-prev','#videos-next','#videos-position','.videos-pagination'].map(k=>[k,new Node()]));
  const context=vm.createContext({window:{},document:{querySelector:k=>nodes[k],createElement:t=>new Node(t)},URL,location:{href:'http://localhost/videos/'}});
  if(load) vm.runInContext(fs.readFileSync(path.join(root,'assets/js/site-data.js'),'utf8'),context);
  if(extra) for(let i=0;i<extra;i++) context.window.comedySiteData.clips.push({title:`Fixture ${i}`,thumbnailPath:'fixture.png',linkUrl:`https://example.com/test-${i}`});
  vm.runInContext(fs.readFileSync(path.join(root,'assets/js/videos.js'),'utf8'),context);
  return {nodes,data:context.window.comedySiteData};
}
run(0,false);
let {nodes,data}=run();
const boardLinks=()=>nodes['#video-billboard'].children.filter(n=>n.tag==='a');
assert.equal(boardLinks().length,4);
assert.equal(new Set(boardLinks().map(n=>n.href)).size,4);
assert.equal(nodes['.videos-pagination'].hidden,true);
assert.deepEqual(boardLinks().map(n=>n.href),[...data.clips.map(c=>c.linkUrl),data.instagramPosts[3].postUrl]);
assert.deepEqual(nodes['#video-billboard'].children.filter(n=>n.tag==='div').map(n=>n.children[0].src),[...data.clips.map(c=>c.thumbnailPath),data.instagramPosts[3].thumbnailPath]);
assert.ok(boardLinks().every(n=>n.target==='_blank'&&n.rel==='noreferrer'&&n.attrs['aria-label'].includes('opens in a new tab')));
({nodes,data}=run(5));
assert.equal(boardLinks().length,4);
assert.equal(nodes['.videos-pagination'].hidden,false);
nodes['#videos-next'].listeners.click();
assert.equal(boardLinks().length,4);
nodes['#videos-next'].listeners.click();
assert.equal(boardLinks().length,1); // No repeated clips to fill the final three openings.
assert.equal(nodes['#videos-next'].disabled,true);
assert.equal(nodes['#video-links'].children.length,1);
nodes['#videos-next'].listeners.click();
assert.equal(boardLinks().length,1);
nodes['#videos-prev'].listeners.click();nodes['#videos-prev'].listeners.click();nodes['#videos-prev'].listeners.click();
assert.equal(nodes['#videos-prev'].disabled,true);
assert.equal(boardLinks()[0].href,data.clips[0].linkUrl);
console.log('PASS: existing URLs/thumbnails, four unique reels, accessible external links, absent-data fallback, pagination boundaries and unfilled final slots.');
