// Generate PWA icons matching the "HS" bottom toolbar home icon
// Dark background with italic Georgia-style "HS" monogram in pink
// Requires: sharp (npm install --save-dev sharp)

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

// "HS" monogram icon — matches the bottom toolbar home icon
function makeIconSVG(size) {
  const rx = Math.round(size * 0.2);
  const fontSize = Math.round(size * 0.52);
  const cy = Math.round(size * 0.635);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1a0a12"/>
      <stop offset="100%" stop-color="#080509"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bg)"/>
  <text x="${size * 0.5}" y="${cy}" text-anchor="middle"
        font-family="Georgia,serif"
        font-size="${fontSize}"
        font-style="italic"
        font-weight="700"
        fill="#e8a8b8"
        letter-spacing="-${Math.round(size * 0.028)}">HS</text>
</svg>`;
}

// Favicon SVG — "HS" monogram, crisp at small sizes
function makeFaviconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#080509"/>
  <text x="16" y="23" text-anchor="middle"
        font-family="Georgia,serif"
        font-size="18"
        font-style="italic"
        font-weight="700"
        fill="#e8a8b8"
        letter-spacing="-1">HS</text>
</svg>`;
}

async function generatePNG(svgString, outputPath) {
  await sharp(Buffer.from(svgString)).png().toFile(outputPath);
  console.log('Written:', outputPath);
}

async function main() {
  // SVG favicon
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), makeFaviconSVG());
  console.log('Written: favicon.svg');

  // PNG icons
  await generatePNG(makeIconSVG(180), path.join(publicDir, 'apple-touch-icon.png'));
  await generatePNG(makeIconSVG(192), path.join(publicDir, 'icon-192.png'));
  await generatePNG(makeIconSVG(512), path.join(publicDir, 'icon-512.png'));

  console.log('Icons generated in public/');
}

main().catch(err => { console.error(err); process.exit(1); });
