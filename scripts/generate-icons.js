// Generate PWA icons as PNG using Canvas API (node with canvas not available)
// Instead, we generate an SVG favicon and use a data-URI approach for PNGs
// This script creates the SVG source files

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Flame/map-pin icon with "NYC" — dark background + gold accent
function makeSVG(size, padding = 0) {
  const p = padding;
  const s = size - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#0a0a0c"/>
  <g transform="translate(${p}, ${p})">
    <!-- Outer glow -->
    <defs>
      <radialGradient id="glow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stop-color="#c4952e" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${s}" height="${s}" fill="url(#glow)"/>
    <!-- Flame icon -->
    <g transform="translate(${s * 0.5}, ${s * 0.32}) scale(${s / 512})">
      <path d="M0-120 C-15-90-60-40-60 20 C-60 55-35 85-10 100 C-20 70-15 30 0 10 C15 30 20 70 10 100 C35 85 60 55 60 20 C60-40 15-90 0-120Z" 
            fill="#c4952e" opacity="0.9"/>
      <path d="M0-60 C-10-40-35-10-35 30 C-35 55-18 72 0 80 C-8 60-5 30 0 18 C5 30 8 60 0 80 C18 72 35 55 35 30 C35-10 10-40 0-60Z" 
            fill="#dbb042" opacity="0.95"/>
      <path d="M0-20 C-6-8-18 8-18 28 C-18 42-8 52 0 56 C-4 44-2 28 0 22 C2 28 4 44 0 56 C8 52 18 42 18 28 C18 8 6-8 0-20Z" 
            fill="#f0d060"/>
    </g>
    <!-- "NYC" text -->
    <text x="${s * 0.5}" y="${s * 0.82}" text-anchor="middle" 
          font-family="'SF Pro Display','Helvetica Neue',Arial,sans-serif" 
          font-weight="800" font-size="${Math.round(s * 0.18)}" 
          fill="#c4952e" letter-spacing="${Math.round(s * 0.015)}">NYC</text>
    <!-- "HOT SPOT" smaller text -->
    <text x="${s * 0.5}" y="${s * 0.93}" text-anchor="middle" 
          font-family="'SF Pro Display','Helvetica Neue',Arial,sans-serif" 
          font-weight="600" font-size="${Math.round(s * 0.08)}" 
          fill="#9a7420" letter-spacing="${Math.round(s * 0.01)}">HOT SPOT</text>
  </g>
</svg>`;
}

// Favicon SVG (simple, crisp at small sizes — just flame, no text)
function makeFaviconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0a0a0c"/>
  <g transform="translate(16, 13) scale(0.052)">
    <path d="M0-120 C-15-90-60-40-60 20 C-60 55-35 85-10 100 C-20 70-15 30 0 10 C15 30 20 70 10 100 C35 85 60 55 60 20 C60-40 15-90 0-120Z" fill="#c4952e"/>
    <path d="M0-60 C-10-40-35-10-35 30 C-35 55-18 72 0 80 C-8 60-5 30 0 18 C5 30 8 60 0 80 C18 72 35 55 35 30 C35-10 10-40 0-60Z" fill="#dbb042"/>
    <path d="M0-20 C-6-8-18 8-18 28 C-18 42-8 52 0 56 C-4 44-2 28 0 22 C2 28 4 44 0 56 C8 52 18 42 18 28 C18 8 6-8 0-20Z" fill="#f0d060"/>
  </g>
</svg>`;
}

// Write files
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), makeFaviconSVG());
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), makeSVG(192, 10));
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), makeSVG(512, 24));

console.log('Icons generated in public/');
