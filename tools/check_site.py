"""Check the buildless Pages site's paths and asset organization using stdlib only."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from hashlib import sha256
import re

ROOT = Path(__file__).resolve().parents[1]
errors = []
PAGES = ['index.html', 'shows.html', 'about.html', 'videos.html', 'contact.html']

def check_path(reference, relative_to):
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return
    if parsed.path.startswith('/'):
        errors.append(f'Root-relative path breaks project sites: {reference}')
        return
    target = (relative_to / unquote(parsed.path)).resolve()
    if not target.is_relative_to(ROOT):
        errors.append(f'Path leaves the website: {reference}')
        return
    current = ROOT
    for part in target.relative_to(ROOT).parts:
        names = {item.name for item in current.iterdir()} if current.is_dir() else set()
        if part not in names:
            errors.append(f'Missing path or wrong filename case: {reference}')
            return
        current /= part

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file = file
        self.ids = set()
        self.anchors = []
        self.headings = 0
        self.sections = 0
        self.in_nav = False
        self.navigation = []
        self.current = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'nav': self.in_nav = True
        if tag == 'a' and self.in_nav:
            self.navigation.append(attrs.get('href'))
            if attrs.get('aria-current') == 'page': self.current.append(attrs.get('href'))
        if tag == 'h1': self.headings += 1
        if tag == 'section': self.sections += 1
        if tag == 'style' or tag == 'script' and 'src' not in attrs:
            errors.append(f'Embedded code in {self.file.name}: {tag}')
        if 'id' in attrs:
            if attrs['id'] in self.ids: errors.append(f'Duplicate id: {attrs["id"]}')
            self.ids.add(attrs['id'])
        for key in ['src','href']:
            if key in attrs:
                check_path(attrs[key], self.file.parent)
        if attrs.get('href','').startswith('#'):
            self.anchors.append(attrs['href'][1:])
    def handle_endtag(self, tag):
        if tag == 'nav': self.in_nav = False

# The portrait comparison is a local authoring aid, not required in the production payload.
for filename in [*PAGES, 'index-sticker.html'] + (['portrait-review.html'] if (ROOT / 'portrait-review.html').exists() else []):
    file = ROOT / filename
    parser = Page(file)
    parser.feed(file.read_text(encoding='utf-8'))
    for anchor in parser.anchors:
        if anchor not in parser.ids: errors.append(f'Missing section anchor: {anchor}')
    if filename in PAGES:
        if parser.navigation != PAGES: errors.append(f'Inconsistent real-file navigation: {filename}')
        if parser.current != [filename]: errors.append(f'Incorrect active page: {filename}')
        if parser.headings != 1: errors.append(f'Expected one main heading: {filename}')
        if parser.sections != 1: errors.append(f'Expected one distinct composition: {filename}')
        if parser.anchors != ['main']: errors.append(f'Unexpected section routing: {filename}')

for file in [*ROOT.glob('*.html'), *ROOT.glob('assets/css/*.css'), *ROOT.glob('assets/js/*.js')]:
    text = file.read_text(encoding='utf-8')
    if ';base64,' in text: errors.append(f'Embedded Base64 asset: {file.relative_to(ROOT)}')
    if file.suffix == '.css':
        for reference in re.findall(r'url\(["\x27]([^"\x27]+)["\x27]\)', text):
            check_path(reference,file.parent)
    if file.suffix == '.js':
        for reference in re.findall(r'["\x27`]((?:assets/)[^"\x27`]+)["\x27`]',text):
            if '${' not in reference: check_path(reference,ROOT)

hashes = {}
for file in (ROOT / 'assets').rglob('*'):
    if not file.is_file(): continue
    digest = sha256(file.read_bytes()).hexdigest()
    if digest in hashes:
        errors.append(f'Duplicate asset bytes: {file.relative_to(ROOT)} and {hashes[digest]}')
    hashes[digest] = file.relative_to(ROOT)

if not (ROOT / '.nojekyll').exists(): errors.append('Missing .nojekyll')
if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: five standalone pages, real-file navigation, active pages, headings, skip links, relative paths/case, external CSS/JS, deduplicated assets, no Base64, .nojekyll.')
