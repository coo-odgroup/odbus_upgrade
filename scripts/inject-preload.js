// Run after `ng build`: adds <link rel="preload"> for the two Lato fonts used above the fold
// (their file names contain a build hash, so they cannot be written by hand in index.html).
const fs = require('fs'), path = require('path');
const dir = path.join(process.cwd(), 'dist/consumerfenew/browser');
const file = path.join(dir, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const fonts = fs.readdirSync(dir).filter(f => /^lato-latin-(400|700)-normal\.[0-9a-f]+\.woff2$/.test(f));
const tags = fonts.map(f => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`).join('');
if (tags && !html.includes('rel="preload" href="lato-')) {
  html = html.replace('</head>', tags + '</head>');
  fs.writeFileSync(file, html);
  console.log('preload added for', fonts.join(', '));
} else {
  console.log('nothing to inject');
}

// Font Awesome icons are used in the header/top bar on every page: preload the woff2 too.
const faFonts = fs.readdirSync(dir).filter(f => /^fontawesome-webfont\.[0-9a-f]+\.woff2$/.test(f));
const faTags = faFonts.map(f => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`).join('');
if (faTags && !html.includes('rel="preload" href="fontawesome-')) {
  html = html.replace('</head>', faTags + '</head>');
  fs.writeFileSync(file, html);
  console.log('preload added for', faFonts.join(', '));
}
