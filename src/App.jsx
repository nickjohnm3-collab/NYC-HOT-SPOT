import { useState, useCallback, useEffect } from "react";
import React from "react";

// Single unified card accent — antique gold
const CARD_ACCENT = "#9a7420";
const hoodColor = () => CARD_ACCENT;

// Zone labels removed — using unified gold accent

// ── Cuisine-specific SVG art ───────────────────────────────────────────────
function makeCuisineSVG(cuisine, color) {
  const c = (cuisine||"").toLowerCase();
  const hex2rgb = h => ({ r:parseInt(h.slice(1,3),16), g:parseInt(h.slice(3,5),16), b:parseInt(h.slice(5,7),16) });
  const {r,g,b} = hex2rgb(color);
  const hi  = `rgba(${r},${g},${b},0.75)`;
  const mid = `rgba(${r},${g},${b},0.42)`;
  const lo  = `rgba(${r},${g},${b},0.18)`;
  const bg  = `rgba(${Math.max(0,r-25)},${Math.max(0,g-25)},${Math.max(0,b-25)},0.32)`;

  let art = "";

  // ── STEAKHOUSE ──
  if (c.includes("steak")) {
    art = `
      <!-- Steak cut silhouette -->
      <path d="M80 55 C75 35, 85 20, 105 18 C125 16, 155 22, 175 20 C200 17, 220 15, 235 25 C252 36, 248 52, 240 58 C225 65, 195 62, 170 64 C148 66, 118 65, 100 60 Z" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Marbling lines on steak -->
      <path d="M105 35 Q130 28, 155 38 Q175 45, 195 36" stroke="${hi}" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M110 48 Q140 42, 165 50 Q185 55, 210 46" stroke="${hi}" stroke-width="0.8" fill="none" opacity="0.6"/>
      <!-- Bone end -->
      <circle cx="87" cy="55" r="7" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <!-- Fork -->
      <line x1="270" y1="12" x2="270" y2="68" stroke="${mid}" stroke-width="2" stroke-linecap="round"/>
      <line x1="264" y1="12" x2="264" y2="32" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="276" y1="12" x2="276" y2="32" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Knife -->
      <line x1="295" y1="12" x2="295" y2="68" stroke="${mid}" stroke-width="2" stroke-linecap="round"/>
      <path d="M295 12 C302 18, 304 30, 300 40 L295 40 Z" fill="${mid}"/>
      <!-- Flame under plate -->
      <path d="M155 68 C152 60, 148 52, 151 44 C152 40, 156 42, 154 50 C157 44, 163 41, 160 54 C163 46, 169 44, 166 58 Z" fill="${hi}" opacity="0.5"/>
      <path d="M170 68 C167 61, 164 54, 167 47 C168 43, 172 45, 170 52 C173 46, 178 44, 175 56 Z" fill="${mid}" opacity="0.5"/>`;

  // ── AMERICAN / ROTISSERIE / AMERICAN BAR ──
  } else if (c.includes("american rotisserie") || c.includes("american bar") || c.includes("american")) {
    art = `
      <!-- Whole roast chicken silhouette -->
      <ellipse cx="160" cy="44" rx="65" ry="28" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Drumstick left -->
      <path d="M98 50 C85 55, 72 60, 68 70 L78 72 C82 64, 92 58, 103 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <!-- Drumstick right -->
      <path d="M222 50 C235 55, 248 60, 252 70 L242 72 C238 64, 228 58, 217 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <!-- Wing -->
      <path d="M130 22 C120 14, 105 12, 100 20 C105 22, 118 20, 125 28 Z" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <!-- Roast skin lines -->
      <path d="M130 38 C145 33, 165 35, 185 32" stroke="${hi}" stroke-width="1" fill="none" opacity="0.7" stroke-dasharray="5,3"/>
      <path d="M140 50 C155 46, 175 48, 190 44" stroke="${hi}" stroke-width="1" fill="none" opacity="0.7" stroke-dasharray="4,3"/>
      <!-- Herbs garnish -->
      <line x1="160" y1="16" x2="155" y2="8" stroke="${hi}" stroke-width="1.2"/>
      <ellipse cx="153" cy="7" rx="3" ry="5" fill="${mid}" transform="rotate(-20 153 7)"/>
      <line x1="165" y1="14" x2="168" y2="6" stroke="${hi}" stroke-width="1.2"/>
      <ellipse cx="169" cy="5" rx="3" ry="5" fill="${mid}" transform="rotate(15 169 5)"/>
      <!-- Plate -->
      <ellipse cx="160" cy="66" rx="80" ry="8" fill="none" stroke="${lo}" stroke-width="1.5"/>`;

  // ── ITALIAN / PASTA ──
  } else if (c.includes("italian pasta") || c === "italian") {
    art = `
      <!-- Pasta bowl -->
      <ellipse cx="160" cy="58" rx="75" ry="12" fill="${lo}" stroke="${mid}" stroke-width="1.2"/>
      <path d="M85 58 C85 40, 100 25, 160 25 C220 25, 235 40, 235 58" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Pasta noodle swirls in bowl -->
      <path d="M110 50 C120 38, 135 52, 145 40 C155 28, 165 48, 175 38 C185 28, 195 44, 205 36" stroke="${hi}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M115 56 C125 46, 138 58, 150 48 C162 38, 172 54, 182 44 C192 34, 200 50, 208 44" stroke="${hi}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.8"/>
      <!-- Fork twirling pasta -->
      <line x1="280" y1="10" x2="275" y2="50" stroke="${mid}" stroke-width="2" stroke-linecap="round"/>
      <path d="M270 10 L270 30 M275 10 L275 30 M280 10 L280 30 M285 10 L285 30" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Tomato sauce splash -->
      <circle cx="155" cy="42" r="5" fill="${hi}" opacity="0.6"/>
      <circle cx="170" cy="35" r="3" fill="${hi}" opacity="0.5"/>
      <circle cx="140" cy="38" r="3.5" fill="${hi}" opacity="0.5"/>
      <!-- Basil leaves -->
      <ellipse cx="160" cy="26" rx="8" ry="4" fill="${mid}" transform="rotate(-30 160 26)" opacity="0.8"/>
      <ellipse cx="170" cy="22" rx="6" ry="3" fill="${mid}" transform="rotate(20 170 22)" opacity="0.7"/>`;

  // ── NEAPOLITAN PIZZA ──
  } else if (c.includes("pizza")) {
    art = `
      <!-- Pizza circle -->
      <circle cx="160" cy="42" r="36" fill="${mid}" stroke="${hi}" stroke-width="1.5"/>
      <!-- Crust ring -->
      <circle cx="160" cy="42" r="36" fill="none" stroke="${hi}" stroke-width="5" opacity="0.4"/>
      <!-- Pizza slices dividers -->
      <line x1="160" y1="6" x2="160" y2="78" stroke="${lo}" stroke-width="1"/>
      <line x1="124" y1="14" x2="196" y2="70" stroke="${lo}" stroke-width="1"/>
      <line x1="196" y1="14" x2="124" y2="70" stroke="${lo}" stroke-width="1"/>
      <line x1="127" y1="42" x2="193" y2="42" stroke="${lo}" stroke-width="1"/>
      <!-- Tomato sauce base -->
      <circle cx="160" cy="42" r="30" fill="${hi}" opacity="0.3"/>
      <!-- Toppings: mozzarella blobs -->
      <circle cx="152" cy="35" r="6" fill="${hi}" opacity="0.7"/>
      <circle cx="168" cy="48" r="5" fill="${hi}" opacity="0.7"/>
      <circle cx="145" cy="52" r="4" fill="${hi}" opacity="0.6"/>
      <circle cx="172" cy="30" r="5" fill="${hi}" opacity="0.7"/>
      <!-- Basil leaves -->
      <ellipse cx="158" cy="42" rx="5" ry="3" fill="${mid}" transform="rotate(-40 158 42)"/>
      <ellipse cx="163" cy="36" rx="4" ry="2.5" fill="${mid}" transform="rotate(30 163 36)"/>
      <!-- Steam -->
      <path d="M310 55 C308 45, 312 38, 309 28" stroke="${lo}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M320 58 C318 46, 323 38, 320 26" stroke="${lo}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;

  // ── BAKERY / CAFÉ ──
  } else if (c.includes("bakery") || c.includes("café") || c.includes("cafe")) {
    art = `
      <!-- Bread loaf -->
      <path d="M70 60 C70 38, 85 22, 120 20 C155 18, 175 22, 190 30 C205 38, 205 55, 200 62 C185 68, 155 70, 120 70 C90 70, 70 66, 70 60 Z" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Score marks on bread -->
      <path d="M100 25 C105 35, 100 50, 102 62" stroke="${hi}" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M130 22 C133 34, 130 50, 131 64" stroke="${hi}" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M158 24 C160 36, 158 52, 158 64" stroke="${hi}" stroke-width="1.5" fill="none" opacity="0.6"/>
      <!-- Wheat stalk left -->
      <line x1="265" y1="72" x2="268" y2="15" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="268" cy="15" rx="4" ry="7" fill="${hi}" opacity="0.7"/>
      <ellipse cx="264" cy="28" rx="3" ry="6" fill="${mid}" opacity="0.6" transform="rotate(-25 264 28)"/>
      <ellipse cx="272" cy="26" rx="3" ry="6" fill="${mid}" opacity="0.6" transform="rotate(25 272 26)"/>
      <ellipse cx="263" cy="40" rx="3" ry="5" fill="${mid}" opacity="0.5" transform="rotate(-20 263 40)"/>
      <ellipse cx="273" cy="38" rx="3" ry="5" fill="${mid}" opacity="0.5" transform="rotate(20 273 38)"/>
      <!-- Wheat stalk right -->
      <line x1="285" y1="72" x2="288" y2="20" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="288" cy="20" rx="4" ry="7" fill="${hi}" opacity="0.6"/>
      <ellipse cx="284" cy="33" rx="3" ry="5" fill="${mid}" opacity="0.5" transform="rotate(-22 284 33)"/>
      <ellipse cx="292" cy="31" rx="3" ry="5" fill="${mid}" opacity="0.5" transform="rotate(22 292 31)"/>
      <!-- Steam -->
      <path d="M220 50 C218 40, 222 33, 219 22" stroke="${lo}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M230 52 C228 42, 232 35, 229 24" stroke="${lo}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;

  // ── INDIAN / SOUTH INDIAN ──
  } else if (c.includes("indian") || c.includes("south indian")) {
    art = `
      <!-- Thali plate outer ring -->
      <circle cx="160" cy="44" r="38" fill="none" stroke="${hi}" stroke-width="2"/>
      <circle cx="160" cy="44" r="34" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <!-- Small katori bowls around the thali -->
      <circle cx="130" cy="30" r="9" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <circle cx="160" cy="24" r="9" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <circle cx="190" cy="30" r="9" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <circle cx="196" cy="56" r="9" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <circle cx="124" cy="56" r="9" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <!-- Curry / sauce in bowls -->
      <circle cx="130" cy="30" r="6" fill="${hi}" opacity="0.5"/>
      <circle cx="160" cy="24" r="6" fill="${hi}" opacity="0.6"/>
      <circle cx="190" cy="30" r="6" fill="${hi}" opacity="0.4"/>
      <circle cx="196" cy="56" r="6" fill="${hi}" opacity="0.55"/>
      <circle cx="124" cy="56" r="6" fill="${hi}" opacity="0.45"/>
      <!-- Rice mound center of thali -->
      <ellipse cx="160" cy="46" rx="16" ry="12" fill="${hi}" opacity="0.5"/>
      <!-- Spice dots: cardamom, clove icons -->
      <circle cx="50" cy="20" r="3" fill="${hi}" opacity="0.6"/>
      <circle cx="58" cy="30" r="2.5" fill="${mid}" opacity="0.6"/>
      <circle cx="46" cy="35" r="2" fill="${hi}" opacity="0.5"/>
      <!-- Spice sticks (cinnamon) -->
      <rect x="42" y="44" width="3" height="16" rx="1.5" fill="${mid}" transform="rotate(-15 43 52)"/>
      <rect x="50" y="46" width="3" height="14" rx="1.5" fill="${mid}" transform="rotate(10 51 53)"/>
      <!-- Naan bread right side -->
      <ellipse cx="310" cy="44" rx="22" ry="30" fill="${mid}" stroke="${hi}" stroke-width="1" transform="rotate(-10 310 44)"/>
      <path d="M302 28 C308 32, 310 40, 306 52" stroke="${hi}" stroke-width="0.8" fill="none" opacity="0.5"/>`;

  // ── JAPANESE / KAISEKI / IZAKAYA ──
  } else if (c.includes("japanese") || c.includes("kaiseki") || c.includes("izakaya") || c.includes("sushi") || c.includes("omakase")) {
    art = `
      <!-- Sushi nigiri pieces -->
      <!-- Piece 1 -->
      <path d="M55 55 C55 47, 60 42, 75 42 C90 42, 95 47, 95 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <ellipse cx="75" cy="42" rx="20" ry="6" fill="${hi}" opacity="0.6"/>
      <!-- Piece 2 -->
      <path d="M110 55 C110 47, 115 42, 130 42 C145 42, 150 47, 150 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <ellipse cx="130" cy="42" rx="20" ry="6" fill="${hi}" opacity="0.55"/>
      <!-- Piece 3 -->
      <path d="M165 55 C165 47, 170 42, 185 42 C200 42, 205 47, 205 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <ellipse cx="185" cy="42" rx="20" ry="6" fill="${hi}" opacity="0.65"/>
      <!-- Piece 4 -->
      <path d="M218 55 C218 47, 223 42, 238 42 C253 42, 258 47, 258 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <ellipse cx="238" cy="42" rx="20" ry="6" fill="${hi}" opacity="0.5"/>
      <!-- Sushi base line / board -->
      <rect x="48" y="55" width="218" height="6" rx="3" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <!-- Chopsticks -->
      <line x1="295" y1="10" x2="310" y2="70" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="310" y1="10" x2="320" y2="70" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Wasabi dollop -->
      <ellipse cx="48" cy="38" rx="8" ry="5" fill="${hi}" opacity="0.55"/>
      <!-- Ginger slices -->
      <path d="M28 50 C22 46, 20 38, 26 35 C30 33, 34 37, 32 42 Z" fill="${mid}" opacity="0.6"/>
      <path d="M35 55 C29 51, 27 43, 33 40 C37 38, 41 42, 39 47 Z" fill="${mid}" opacity="0.5"/>`;

  // ── KOREAN / KOREAN BBQ / KOREAN-CAJUN ──
  } else if (c.includes("korean")) {
    art = `
      <!-- Korean BBQ grill grate -->
      <ellipse cx="160" cy="50" rx="70" ry="20" fill="${lo}" stroke="${mid}" stroke-width="1.5"/>
      <!-- Grate grid lines -->
      <line x1="110" y1="38" x2="95" y2="62" stroke="${mid}" stroke-width="1.2" opacity="0.7"/>
      <line x1="130" y1="33" x2="118" y2="67" stroke="${mid}" stroke-width="1.2" opacity="0.7"/>
      <line x1="152" y1="30" x2="143" y2="70" stroke="${mid}" stroke-width="1.2" opacity="0.7"/>
      <line x1="173" y1="30" x2="168" y2="70" stroke="${mid}" stroke-width="1.2" opacity="0.7"/>
      <line x1="193" y1="33" x2="192" y2="68" stroke="${mid}" stroke-width="1.2" opacity="0.7"/>
      <line x1="210" y1="38" x2="215" y2="63" stroke="${mid}" stroke-width="1.2" opacity="0.7"/>
      <line x1="95" y1="44" x2="225" y2="44" stroke="${mid}" stroke-width="1" opacity="0.5"/>
      <line x1="92" y1="52" x2="228" y2="52" stroke="${mid}" stroke-width="1" opacity="0.5"/>
      <!-- Meat slices on grill -->
      <ellipse cx="135" cy="43" rx="16" ry="7" fill="${hi}" opacity="0.65" transform="rotate(-15 135 43)"/>
      <ellipse cx="165" cy="40" rx="14" ry="6" fill="${hi}" opacity="0.7" transform="rotate(10 165 40)"/>
      <ellipse cx="192" cy="44" rx="15" ry="6" fill="${hi}" opacity="0.6" transform="rotate(-8 192 44)"/>
      <!-- Fire / flame below grill -->
      <path d="M140 68 C138 60, 134 52, 137 44 C139 39, 143 41, 141 50 C144 43, 150 40, 147 54 C150 45, 157 43, 153 58 Z" fill="${hi}" opacity="0.55"/>
      <path d="M172 68 C170 61, 167 54, 170 46 C172 41, 176 43, 174 51 Z" fill="${mid}" opacity="0.5"/>
      <!-- Banchan small bowls top left -->
      <circle cx="45" cy="28" r="10" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <circle cx="45" cy="28" r="7" fill="${mid}" opacity="0.5"/>
      <circle cx="68" cy="20" r="8" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <circle cx="68" cy="20" r="5" fill="${hi}" opacity="0.4"/>`;

  // ── CHINESE NOODLES ──
  } else if (c.includes("chinese") || c.includes("noodle") || c.includes("pan-chinese")) {
    art = `
      <!-- Noodle bowl -->
      <path d="M88 62 C82 44, 90 25, 160 24 C230 23, 238 44, 232 62 Z" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <ellipse cx="160" cy="62" rx="72" ry="10" fill="${lo}" stroke="${mid}" stroke-width="1.2"/>
      <!-- Broth surface -->
      <ellipse cx="160" cy="40" rx="62" ry="14" fill="${hi}" opacity="0.25"/>
      <!-- Noodle strands cascading -->
      <path d="M115 55 C120 42, 132 52, 138 38 C144 24, 155 40, 162 30 C169 20, 178 38, 185 28 C192 18, 198 38, 205 30" stroke="${hi}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M118 62 C124 50, 136 58, 142 46 C148 34, 158 50, 165 40 C172 30, 180 46, 186 38" stroke="${hi}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>
      <!-- Egg halves floating in bowl -->
      <path d="M130 42 C125 36, 135 30, 142 36 Z" fill="${hi}" opacity="0.5"/>
      <circle cx="136" cy="34" r="3" fill="${lo}" opacity="0.8"/>
      <!-- Scallion greens -->
      <line x1="168" y1="28" x2="162" y2="14" stroke="${hi}" stroke-width="1.2"/>
      <line x1="172" y1="26" x2="168" y2="12" stroke="${hi}" stroke-width="1.2"/>
      <!-- Chopsticks resting on bowl -->
      <line x1="95" y1="18" x2="230" y2="22" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="95" y1="24" x2="230" y2="28" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>`;

  // ── MEXICAN ──
  } else if (c.includes("mexican") || c.includes("taqueria")) {
    art = `
      <!-- Taco shell 1 -->
      <path d="M60 65 C55 50, 60 32, 75 28 C90 24, 100 32, 108 42 C100 56, 88 65, 60 65 Z" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Taco shell 2 -->
      <path d="M85 65 C80 50, 85 32, 100 28 C115 24, 125 32, 133 42 C125 56, 113 65, 85 65 Z" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <!-- Filling: meat -->
      <path d="M65 55 C72 48, 85 46, 98 50 C90 58, 78 62, 65 55 Z" fill="${hi}" opacity="0.65"/>
      <!-- Filling: lettuce shreds -->
      <path d="M68 50 C75 44, 88 42, 100 46" stroke="${hi}" stroke-width="1.5" fill="none" opacity="0.7" stroke-linecap="round"/>
      <path d="M70 44 C78 40, 88 38, 96 42" stroke="${hi}" stroke-width="1.2" fill="none" opacity="0.6" stroke-linecap="round"/>
      <!-- Lime wedge -->
      <path d="M155 55 C150 45, 158 35, 168 38 C173 40, 172 48, 165 55 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <line x1="155" y1="55" x2="168" y2="38" stroke="${lo}" stroke-width="1"/>
      <!-- Chili pepper -->
      <path d="M200 30 C210 25, 225 28, 230 38 C228 48, 218 52, 208 46 C200 40, 196 32, 200 30 Z" fill="${hi}" opacity="0.6" stroke="${mid}" stroke-width="1"/>
      <line x1="200" y1="30" x2="198" y2="18" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Second chili -->
      <path d="M240 45 C248 38, 260 40, 263 50 C262 58, 254 62, 246 57 C240 53, 237 47, 240 45 Z" fill="${hi}" opacity="0.5" stroke="${mid}" stroke-width="1"/>
      <line x1="240" y1="45" x2="238" y2="35" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Cilantro dots -->
      <circle cx="290" cy="25" r="3" fill="${mid}" opacity="0.6"/>
      <circle cx="298" cy="32" r="2.5" fill="${mid}" opacity="0.5"/>
      <circle cx="286" cy="35" r="2" fill="${hi}" opacity="0.5"/>
      <circle cx="295" cy="40" r="3" fill="${mid}" opacity="0.6"/>`;

  // ── FRENCH / FRENCH-VIETNAMESE ──
  } else if (c.includes("french")) {
    art = `
      <!-- Classic dome cloche -->
      <path d="M85 58 C85 35, 100 18, 160 16 C220 18, 235 35, 235 58 Z" fill="${mid}" stroke="${hi}" stroke-width="1.5"/>
      <!-- Cloche handle -->
      <circle cx="160" cy="16" r="6" fill="${hi}" opacity="0.8"/>
      <!-- Plate under cloche -->
      <ellipse cx="160" cy="58" rx="82" ry="10" fill="${lo}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Food visible at base (steak/sauce) -->
      <ellipse cx="160" cy="56" rx="55" ry="7" fill="${hi}" opacity="0.35"/>
      <!-- Sauce drizzle -->
      <path d="M125 55 C135 48, 148 52, 160 50 C172 48, 182 52, 192 50" stroke="${hi}" stroke-width="1.2" fill="none" opacity="0.6"/>
      <!-- Baguette slices right -->
      <ellipse cx="275" cy="38" rx="12" ry="16" fill="${mid}" stroke="${hi}" stroke-width="1" transform="rotate(-20 275 38)"/>
      <ellipse cx="290" cy="32" rx="12" ry="16" fill="${lo}" stroke="${mid}" stroke-width="1" transform="rotate(-15 290 32)"/>
      <ellipse cx="305" cy="28" rx="12" ry="16" fill="${mid}" stroke="${hi}" stroke-width="1" transform="rotate(-10 305 28)"/>
      <!-- Cross-section on bread -->
      <ellipse cx="275" cy="38" rx="8" ry="11" fill="${hi}" opacity="0.3" transform="rotate(-20 275 38)"/>
      <!-- Herb sprig -->
      <line x1="50" y1="65" x2="48" y2="30" stroke="${mid}" stroke-width="1.2"/>
      <ellipse cx="44" cy="40" rx="5" ry="3" fill="${mid}" opacity="0.6" transform="rotate(-30 44 40)"/>
      <ellipse cx="52" cy="36" rx="5" ry="3" fill="${mid}" opacity="0.6" transform="rotate(20 52 36)"/>
      <ellipse cx="46" cy="30" rx="5" ry="3" fill="${hi}" opacity="0.55" transform="rotate(-15 46 30)"/>`;

  // ── COCKTAIL BAR / WINE BAR ──
  } else if (c.includes("cocktail") || c.includes("wine bar") || c.includes("wine")) {
    art = `
      <!-- Coupe/cocktail glass -->
      <path d="M145 68 L155 68 L160 55 L165 68 L175 68" stroke="${mid}" stroke-width="1.5" fill="none"/>
      <line x1="160" y1="55" x2="160" y2="35" stroke="${hi}" stroke-width="2"/>
      <path d="M128 12 C128 30, 135 35, 160 35 C185 35, 192 30, 192 12 Z" fill="${mid}" stroke="${hi}" stroke-width="1.5"/>
      <!-- Liquid in glass -->
      <path d="M132 18 C132 28, 138 33, 160 33 C182 33, 188 28, 188 18 Z" fill="${hi}" opacity="0.45"/>
      <!-- Citrus wheel garnish on rim -->
      <circle cx="192" cy="12" r="10" fill="${lo}" stroke="${hi}" stroke-width="1.2"/>
      <circle cx="192" cy="12" r="6" fill="${mid}" opacity="0.5"/>
      <line x1="186" y1="6" x2="198" y2="18" stroke="${hi}" stroke-width="0.8" opacity="0.6"/>
      <line x1="198" y1="6" x2="186" y2="18" stroke="${hi}" stroke-width="0.8" opacity="0.6"/>
      <line x1="192" y1="2" x2="192" y2="22" stroke="${hi}" stroke-width="0.8" opacity="0.6"/>
      <!-- Wine bottle left -->
      <rect x="50" y="15" width="16" height="45" rx="4" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <rect x="54" y="8" width="8" height="12" rx="2" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <rect x="56" y="4" width="4" height="8" rx="2" fill="${mid}"/>
      <!-- Wine label detail -->
      <rect x="52" y="28" width="12" height="16" rx="1" fill="${hi}" opacity="0.2" stroke="${hi}" stroke-width="0.8"/>
      <!-- Ice cubes -->
      <rect x="265" y="30" width="14" height="14" rx="2" fill="${lo}" stroke="${mid}" stroke-width="1" transform="rotate(15 272 37)"/>
      <rect x="280" y="22" width="14" height="14" rx="2" fill="${lo}" stroke="${mid}" stroke-width="1" transform="rotate(-10 287 29)"/>
      <rect x="272" y="44" width="12" height="12" rx="2" fill="${lo}" stroke="${mid}" stroke-width="1" transform="rotate(5 278 50)"/>`;

  // ── SEAFOOD ──
  } else if (c.includes("seafood") || c.includes("fish")) {
    art = `
      <!-- Fish body -->
      <path d="M60 44 C60 30, 80 20, 130 20 C180 20, 220 28, 240 44 C220 60, 180 68, 130 68 C80 68, 60 58, 60 44 Z" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Fish tail fin -->
      <path d="M60 44 C40 32, 25 28, 28 44 C25 60, 40 56, 60 44 Z" fill="${hi}" opacity="0.55" stroke="${mid}" stroke-width="1"/>
      <!-- Fish scales pattern -->
      <path d="M160 25 C155 32, 148 30, 148 25" stroke="${hi}" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M180 27 C175 34, 168 32, 168 27" stroke="${hi}" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M200 32 C195 39, 188 37, 188 32" stroke="${hi}" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M140 30 C135 37, 128 35, 128 30" stroke="${hi}" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M165 40 C160 47, 153 45, 153 40" stroke="${hi}" stroke-width="1" fill="none" opacity="0.4"/>
      <path d="M185 42 C180 49, 173 47, 173 42" stroke="${hi}" stroke-width="1" fill="none" opacity="0.4"/>
      <!-- Fish eye -->
      <circle cx="215" cy="36" r="6" fill="${lo}" stroke="${hi}" stroke-width="1.2"/>
      <circle cx="216" cy="35" r="3" fill="${hi}" opacity="0.7"/>
      <!-- Fin on top -->
      <path d="M130 20 C135 10, 155 8, 175 12 C170 18, 155 18, 130 20 Z" fill="${hi}" opacity="0.4" stroke="${mid}" stroke-width="1"/>
      <!-- Oyster/shell -->
      <path d="M275 42 C270 35, 278 28, 290 30 C302 32, 308 40, 305 50 C295 56, 278 52, 275 42 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <path d="M278 42 C280 38, 288 35, 296 38 C298 44, 292 50, 284 48 Z" fill="${hi}" opacity="0.35"/>
      <circle cx="287" cy="43" r="4" fill="${hi}" opacity="0.6"/>`;

  // ── BBQ / SOUTHERN ──
  } else if (c.includes("bbq") || c.includes("southern") || c.includes("bar")) {
    art = `
      <!-- Smoker / grill barrel -->
      <rect x="70" y="38" width="160" height="32" rx="16" fill="${mid}" stroke="${hi}" stroke-width="1.5"/>
      <ellipse cx="70" cy="54" rx="16" ry="16" fill="${mid}" stroke="${hi}" stroke-width="1.5"/>
      <ellipse cx="230" cy="54" rx="16" ry="16" fill="${lo}" stroke="${mid}" stroke-width="1.5"/>
      <!-- Smokestack -->
      <rect x="195" y="14" width="10" height="28" rx="4" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <!-- Smoke puffs from stack -->
      <circle cx="200" cy="10" r="6" fill="${lo}" opacity="0.5"/>
      <circle cx="208" cy="6" r="5" fill="${lo}" opacity="0.4"/>
      <circle cx="196" cy="4" r="4" fill="${lo}" opacity="0.35"/>
      <!-- Ribs on grill surface -->
      <rect x="90" y="44" width="4" height="22" rx="2" fill="${hi}" opacity="0.65"/>
      <rect x="100" y="44" width="4" height="22" rx="2" fill="${hi}" opacity="0.65"/>
      <rect x="110" y="44" width="4" height="22" rx="2" fill="${hi}" opacity="0.65"/>
      <rect x="120" y="44" width="4" height="22" rx="2" fill="${hi}" opacity="0.65"/>
      <rect x="130" y="44" width="4" height="22" rx="2" fill="${hi}" opacity="0.65"/>
      <path d="M88 44 C92 40, 130 38, 138 44" stroke="${hi}" stroke-width="2" fill="none"/>
      <!-- Sauce brush -->
      <line x1="265" y1="18" x2="255" y2="58" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M247 55 C252 50, 262 52, 263 60 L250 65 Z" fill="${hi}" opacity="0.6"/>
      <!-- Flame underneath -->
      <path d="M115 72 C113 65, 110 58, 113 50 C114 46, 118 48, 116 56 C119 49, 125 47, 122 59 Z" fill="${hi}" opacity="0.5"/>
      <path d="M150 72 C148 64, 146 57, 149 50 C150 46, 154 48, 152 56 Z" fill="${mid}" opacity="0.5"/>`;

  // ── TASTING MENU / SEASONAL ──
  } else if (c.includes("tasting") || c.includes("seasonal") || c.includes("kaiseki")) {
    art = `
      <!-- Fine dining plate with negative space composition -->
      <circle cx="160" cy="44" r="36" fill="none" stroke="${hi}" stroke-width="1.8"/>
      <circle cx="160" cy="44" r="30" fill="${lo}" stroke="${mid}" stroke-width="0.8"/>
      <!-- Protein medallion center-left -->
      <ellipse cx="145" cy="44" rx="14" ry="10" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <ellipse cx="145" cy="44" rx="9" ry="6" fill="${hi}" opacity="0.45"/>
      <!-- Sauce pool -->
      <path d="M155 50 C162 54, 176 52, 180 46 C178 58, 168 62, 155 58 Z" fill="${hi}" opacity="0.35"/>
      <!-- Micro herb dots -->
      <circle cx="172" cy="38" r="2.5" fill="${hi}" opacity="0.7"/>
      <circle cx="176" cy="42" r="2" fill="${mid}" opacity="0.7"/>
      <circle cx="169" cy="43" r="1.8" fill="${hi}" opacity="0.6"/>
      <circle cx="174" cy="46" r="2.2" fill="${mid}" opacity="0.6"/>
      <!-- Edible flower -->
      <circle cx="168" cy="32" r="3" fill="${hi}" opacity="0.5"/>
      <circle cx="162" cy="28" r="3" fill="${mid}" opacity="0.5"/>
      <circle cx="174" cy="28" r="3" fill="${hi}" opacity="0.45"/>
      <circle cx="168" cy="24" r="3" fill="${mid}" opacity="0.5"/>
      <circle cx="168" cy="32" r="2" fill="${hi}" opacity="0.7"/>
      <!-- Quenelle garnish -->
      <path d="M152 34 C155 29, 163 29, 166 34 C163 39, 155 39, 152 34 Z" fill="${mid}" stroke="${hi}" stroke-width="0.8"/>
      <!-- Sauce brush stroke -->
      <path d="M128 56 C140 60, 160 61, 175 58" stroke="${hi}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      <!-- Twin spoons on right -->
      <ellipse cx="290" cy="22" rx="8" ry="5" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <line x1="290" y1="27" x2="292" y2="62" stroke="${mid}" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="310" cy="28" rx="7" ry="4.5" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <line x1="310" y1="32" x2="311" y2="62" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>`;

  // ── SOUTH AFRICAN / WINE ──
  } else if (c.includes("south african")) {
    art = `
      <!-- Wine glass -->
      <path d="M145 68 L155 68 L160 55 L165 68 L175 68" stroke="${mid}" stroke-width="1.5" fill="none"/>
      <line x1="160" y1="55" x2="160" y2="38" stroke="${hi}" stroke-width="2"/>
      <path d="M132 12 C132 28, 138 34, 160 34 C182 34, 188 28, 188 12 Z" fill="${mid}" stroke="${hi}" stroke-width="1.5"/>
      <path d="M135 18 C135 26, 140 32, 160 32 C180 32, 185 26, 185 18 Z" fill="${hi}" opacity="0.4"/>
      <!-- Vine leaf -->
      <path d="M55 44 C48 35, 52 22, 62 20 C70 18, 78 24, 76 34 C74 44, 64 50, 55 44 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <line x1="55" y1="44" x2="62" y2="20" stroke="${hi}" stroke-width="0.8"/>
      <line x1="62" y1="30" x2="55" y2="24" stroke="${hi}" stroke-width="0.7" opacity="0.6"/>
      <line x1="62" y1="30" x2="70" y2="24" stroke="${hi}" stroke-width="0.7" opacity="0.6"/>
      <!-- Grapes cluster -->
      <circle cx="52" cy="58" r="5" fill="${hi}" opacity="0.65"/>
      <circle cx="60" cy="56" r="5" fill="${hi}" opacity="0.7"/>
      <circle cx="68" cy="57" r="5" fill="${hi}" opacity="0.6"/>
      <circle cx="55" cy="65" r="5" fill="${hi}" opacity="0.6"/>
      <circle cx="63" cy="64" r="5" fill="${hi}" opacity="0.65"/>
      <circle cx="59" cy="60" r="4" fill="${mid}" opacity="0.5"/>
      <!-- Cheese wedge -->
      <path d="M250 40 L300 30 L310 60 L240 65 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <circle cx="265" cy="52" r="4" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <circle cx="280" cy="48" r="3" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <circle cx="290" cy="55" r="3.5" fill="${lo}" stroke="${mid}" stroke-width="1"/>`;

  // ── ISRAELI ──
  } else if (c.includes("israeli") || c.includes("middle east")) {
    art = `
      <!-- Hummus plate -->
      <ellipse cx="140" cy="50" rx="55" ry="22" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Hummus swirl -->
      <path d="M130 50 C128 43, 132 38, 140 38 C148 38, 155 43, 155 50 C155 57, 148 62, 140 62 C133 62, 128 57, 128 52" stroke="${hi}" stroke-width="1.5" fill="none"/>
      <!-- Olive oil pool center -->
      <circle cx="140" cy="50" r="8" fill="${hi}" opacity="0.4"/>
      <!-- Chickpeas on plate -->
      <circle cx="165" cy="45" r="4" fill="${hi}" opacity="0.6"/>
      <circle cx="172" cy="52" r="4" fill="${mid}" opacity="0.6"/>
      <circle cx="162" cy="56" r="3.5" fill="${hi}" opacity="0.5"/>
      <!-- Za'atar herbs dots -->
      <circle cx="145" cy="40" r="2" fill="${hi}" opacity="0.6"/>
      <circle cx="152" cy="42" r="1.8" fill="${mid}" opacity="0.5"/>
      <circle cx="148" cy="44" r="2" fill="${hi}" opacity="0.55"/>
      <!-- Pita bread right -->
      <ellipse cx="255" cy="42" rx="32" ry="22" fill="${lo}" stroke="${mid}" stroke-width="1.2"/>
      <ellipse cx="255" cy="42" rx="24" ry="15" fill="${mid}" opacity="0.3"/>
      <!-- Char marks on pita -->
      <path d="M238 36 C243 38, 252 36, 258 38" stroke="${hi}" stroke-width="1.5" fill="none" opacity="0.5" stroke-linecap="round"/>
      <path d="M240 44 C246 46, 255 44, 262 46" stroke="${hi}" stroke-width="1.5" fill="none" opacity="0.5" stroke-linecap="round"/>
      <!-- Lemon half -->
      <path d="M310 38 C305 30, 318 26, 325 34 C330 40, 326 50, 318 52 C310 50, 306 44, 310 38 Z" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <path d="M313 40 C316 34, 322 33, 324 38" fill="none" stroke="${hi}" stroke-width="0.8" opacity="0.6"/>`;

  } else if (c.includes("caribbean")) {
    // Tropical fruit, palm leaf, and wave
    art = `
      <!-- Pineapple body -->
      <ellipse cx="80" cy="42" rx="18" ry="24" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <!-- Pineapple texture diamonds -->
      <line x1="68" y1="30" x2="80" y2="66" stroke="${hi}" stroke-width="0.8" opacity="0.5"/>
      <line x1="75" y1="28" x2="80" y2="66" stroke="${hi}" stroke-width="0.8" opacity="0.5"/>
      <line x1="82" y1="28" x2="80" y2="66" stroke="${hi}" stroke-width="0.8" opacity="0.5"/>
      <line x1="62" y1="38" x2="98" y2="38" stroke="${hi}" stroke-width="0.8" opacity="0.5"/>
      <line x1="62" y1="46" x2="98" y2="46" stroke="${hi}" stroke-width="0.8" opacity="0.5"/>
      <line x1="62" y1="54" x2="98" y2="54" stroke="${hi}" stroke-width="0.8" opacity="0.5"/>
      <!-- Pineapple crown leaves -->
      <path d="M72 18 C68 8, 76 4, 80 16" fill="${hi}" opacity="0.7"/>
      <path d="M80 16 C78 6, 86 4, 88 16" fill="${mid}" opacity="0.7"/>
      <path d="M85 20 C84 10, 92 8, 92 20" fill="${hi}" opacity="0.6"/>
      <!-- Half coconut -->
      <path d="M135 58 C130 45, 138 35, 155 35 C172 35, 178 45, 175 58 Z" fill="${mid}" stroke="${hi}" stroke-width="1.2"/>
      <path d="M138 55 C136 46, 142 40, 155 40 C168 40, 172 46, 170 55 Z" fill="${hi}" opacity="0.35"/>
      <!-- Coconut water ripple -->
      <ellipse cx="155" cy="55" rx="16" ry="5" fill="${hi}" opacity="0.4"/>
      <!-- Tropical waves -->
      <path d="M210 55 C230 45, 250 65, 270 52 C290 39, 310 58, 340 50 C360 44, 375 52, 385 48" stroke="${hi}" stroke-width="1.8" fill="none"/>
      <path d="M210 65 C230 55, 250 72, 270 62 C290 52, 310 68, 340 60" stroke="${mid}" stroke-width="1.2" fill="none"/>
      <!-- Rum bottle outline -->
      <rect x="295" y="18" width="14" height="40" rx="4" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <rect x="298" y="10" width="8" height="12" rx="2" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <rect x="299" y="6" width="6" height="7" rx="2" fill="${mid}"/>
      <rect x="297" y="30" width="10" height="14" rx="1" fill="${hi}" opacity="0.2" stroke="${hi}" stroke-width="0.8"/>`;

  } else if (c.includes("seasonal american") || c.includes("california")) {
    // Fine dining plate with seasonal produce: radish, herbs, clean composition
    art = `
      <!-- Clean white plate -->
      <circle cx="160" cy="44" r="34" fill="none" stroke="${hi}" stroke-width="1.8"/>
      <circle cx="160" cy="44" r="28" fill="${lo}" stroke="${mid}" stroke-width="0.8"/>
      <!-- Protein: seared piece center left -->
      <ellipse cx="148" cy="46" rx="14" ry="9" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <ellipse cx="148" cy="45" rx="9" ry="5" fill="${hi}" opacity="0.4"/>
      <!-- Sauce pool curving right -->
      <path d="M158 52 C166 56, 178 54, 182 47 C180 58, 170 64, 158 60 Z" fill="${hi}" opacity="0.3"/>
      <!-- Micro herb cluster -->
      <circle cx="170" cy="36" r="2.2" fill="${hi}" opacity="0.7"/>
      <circle cx="174" cy="40" r="1.8" fill="${mid}" opacity="0.65"/>
      <circle cx="167" cy="40" r="2" fill="${hi}" opacity="0.6"/>
      <circle cx="172" cy="44" r="1.6" fill="${mid}" opacity="0.6"/>
      <!-- Radish slice -->
      <circle cx="175" cy="52" r="5" fill="${lo}" stroke="${hi}" stroke-width="1"/>
      <line x1="175" y1="47" x2="175" y2="57" stroke="${hi}" stroke-width="0.7" opacity="0.5"/>
      <line x1="170" y1="52" x2="180" y2="52" stroke="${hi}" stroke-width="0.7" opacity="0.5"/>
      <!-- Droplet garnish -->
      <circle cx="138" cy="38" r="2.5" fill="${hi}" opacity="0.6"/>
      <circle cx="133" cy="44" r="2" fill="${mid}" opacity="0.6"/>
      <!-- Sauce brush stroke -->
      <path d="M128 56 C140 60, 160 61, 174 58" stroke="${hi}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.5"/>
      <!-- Spoon right -->
      <ellipse cx="295" cy="22" rx="8" ry="5" fill="${mid}" stroke="${hi}" stroke-width="1"/>
      <line x1="295" y1="27" x2="297" y2="62" stroke="${mid}" stroke-width="2" stroke-linecap="round"/>`;

  } else {
    // Default elegant abstract
    art = `
      <circle cx="160" cy="42" r="34" fill="none" stroke="${hi}" stroke-width="1.5"/>
      <circle cx="160" cy="42" r="24" fill="${lo}" stroke="${mid}" stroke-width="1"/>
      <circle cx="160" cy="42" r="8" fill="${hi}" opacity="0.5"/>
      <path d="M160 8 L160 18 M160 66 L160 76 M126 42 L136 42 M184 42 L194 42" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M136 18 L142 24 M178 60 L184 66 M136 66 L142 60 M178 24 L184 18" stroke="${lo}" stroke-width="1" stroke-linecap="round"/>
      <line x1="295" y1="12" x2="310" y2="68" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="310" y1="12" x2="320" y2="68" stroke="${mid}" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="80" viewBox="0 0 380 80">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg}"/>
          <stop offset="100%" stop-color="rgba(6,4,8,0.95)"/>
        </linearGradient>
      </defs>
      <rect width="380" height="80" fill="rgba(8,5,10,0.98)"/>
      <rect width="380" height="80" fill="url(#bg)"/>
      ${art}
    </svg>`
  )}`;
}

// ── Six-month window ───────────────────────────────────────────────────────
const TODAY = new Date();
const SIX_MONTHS_AGO = new Date(new Date().setMonth(new Date().getMonth() - 6));
const isWithin6Months = r =>
  r.status === "open" && r.openedDate &&
  r.openedDate >= SIX_MONTHS_AGO && r.openedDate <= new Date(TODAY.getTime() + 30 * 24 * 60 * 60 * 1000);

// ── Data ───────────────────────────────────────────────────────────────────
const RESTAURANTS = [
  { id:17, name:"Seventy Seven Alley",        neighborhood:"Midtown",           cuisine:"Seafood Tasting Menu",    price:4, difficulty:4, opened:"March 6, 2026",  openedDate:new Date("2026-03-06"), status:"open", address:"Midtown",                vibe:"Refined & Theatrical",    isBar:false, reservation:"Booking 2–3 weeks out",     dressCode:"Smart Casual to Formal",  mealPeriods:["Dinner"],                               homepage:"https://www.seventysevenalley.com",         chef:"Chef London Chase (formerly of Essential by Christophe and Mango Bay) commands a sleek hotel dining room. Precisely plated seafood delicacies served at the tasting counter or à la carte.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/seventy-seven-alley"},{name:"OpenTable",url:"https://www.opentable.com/seventy-seven-alley"},{name:"Google",url:"https://www.google.com/search?q=Seventy+Seven+Alley+NYC+reservation"}] },
  { id:4,  name:"Kjun",                       neighborhood:"Murray Hill",       cuisine:"Korean-Cajun",            price:3, difficulty:4, opened:"Feb 25, 2026",   openedDate:new Date("2026-02-25"), status:"open", address:"334 Lexington Ave",      vibe:"Lively & Inventive",      isBar:false, reservation:"Booking 2 weeks out",       dressCode:"Casual",                  mealPeriods:["Dinner","Late Night"],                   homepage:"https://www.kjunnyc.com",                  chef:"Chef Jenny Kwak, a pioneer of Korean-Cajun fusion, returns with a bold bi-level space. Named one of The Infatuation's Best New Restaurants of 2022, the new space adds a full bar and formal tasting menu upstairs.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/kjun"},{name:"Google",url:"https://www.google.com/search?q=Kjun+NYC+reservation"}] },
  { id:3,  name:"Kidilum",                    neighborhood:"Flatiron",          cuisine:"South Indian",            price:3, difficulty:3, opened:"Feb 20, 2026",   openedDate:new Date("2026-02-20"), status:"open", address:"31 W 21st St",           vibe:"Warm & Immersive",        isBar:false, reservation:"Booking 1–2 weeks out",     dressCode:"Casual to Smart Casual",  mealPeriods:["Dinner"],                               homepage:"https://www.kidilumnyc.com",               chef:"Chef Vinu Raveendran, formerly of Dubai's Carnival by Trèsind, leads the kitchen. Celebrating Kerala's coastal cuisine with spice-rich seafood, meats, and seasonal produce.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/kidilum"},{name:"OpenTable",url:"https://www.opentable.com/kidilum"},{name:"Google",url:"https://www.google.com/search?q=Kidilum+NYC+reservation"}] },
  { id:12, name:"Kees",                       neighborhood:"West Village",      cuisine:"Cocktail Bar",            price:4, difficulty:4, opened:"Feb 15, 2026",   openedDate:new Date("2026-02-15"), status:"open", address:"West Village",           vibe:"Sophisticated & Dark",    isBar:true,  reservation:"Booking 2 weeks out",       dressCode:"Smart Casual",            mealPeriods:["Evening","Late Night"],                  homepage:"https://www.keesnyc.com",                  chef:"From the legendary PDT (Please Don't Tell) team, creators of New York's most celebrated speakeasy. Kees applies the same obsessive craft to classic cocktail formats — martinis, Negronis, and sours.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/kees"},{name:"Google",url:"https://www.google.com/search?q=Kees+bar+NYC"}] },
  { id:2,  name:"Ambassadors Clubhouse",      neighborhood:"NoMad",             cuisine:"Indian",                  price:4, difficulty:5, opened:"Feb 10, 2026",   openedDate:new Date("2026-02-10"), status:"open", address:"1245 Broadway",          vibe:"Regal & Buzzy",           isBar:false, reservation:"Booking 3–4 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Lunch","Dinner"],                        homepage:"https://www.ambassadorsclubhousenyc.com",  chef:"From the team behind London Mayfair's Gymkhana and Brigadiers. Executive Chef Dhruv Mittal's butter chicken chops, prawn curry, and a bi-level space draped in regal decor.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/ambassadors-clubhouse"},{name:"Google",url:"https://www.google.com/search?q=Ambassadors+Clubhouse+NYC+reservation"}] },
  { id:13, name:"Cleo Downtown",              neighborhood:"West Village",      cuisine:"American Rotisserie",     price:3, difficulty:3, opened:"Feb 8, 2026",    openedDate:new Date("2026-02-08"), status:"open", address:"West Village",           vibe:"Convivial & Polished",    isBar:false, reservation:"Booking 1–2 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Lunch","Dinner"],                        homepage:"https://www.cleodowntown.com",              chef:"Halley Chambers and Kip Gleize of Three Top Hospitality open their first Manhattan restaurant. Golden rotisserie chickens, herb sauces, market salads with natural wine and optional caviar.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/cleo-downtown"},{name:"OpenTable",url:"https://www.opentable.com/cleo-downtown"},{name:"Google",url:"https://www.google.com/search?q=Cleo+Downtown+NYC+reservation"}] },
  { id:7,  name:"Odo East Village",           neighborhood:"East Village",      cuisine:"Japanese Kaiseki",        price:2, difficulty:3, opened:"Feb 1, 2026",    openedDate:new Date("2026-02-01"), status:"open", address:"536 E 5th St",           vibe:"Serene & Precise",        isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual to Smart Casual",  mealPeriods:["Dinner"],                               homepage:"https://www.odorestaurant.com",             chef:"Chef Hiroki Odo, whose Flatiron flagship earned Michelin recognition, opens this more accessible 24-seat counter sibling. An izakaya-meets-kaiseki experience with à la carte seasonal bites.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/odo-east-village"},{name:"Google",url:"https://www.google.com/search?q=Odo+East+Village+reservation"}] },
  { id:5,  name:"Beto's Carnitas",            neighborhood:"Lower East Side",   cuisine:"Mexican",                 price:1, difficulty:1, opened:"Feb 5, 2026",    openedDate:new Date("2026-02-05"), status:"open", address:"69 Clinton St",          vibe:"Casual & Soulful",        isBar:false, reservation:"Walk-in Friendly",          dressCode:"Come as you are",         mealPeriods:["Lunch","Dinner"],                        homepage:"https://www.google.com/search?q=Beto%27s+Carnitas+NYC", chef:"A beloved NYC pop-up turned permanent fast-casual. Beto's earned cult status for its slow-cooked carnitas and rotating guisados. The Clinton Street brick-and-mortar is founder Beto Gutierrez's first permanent home.", bookingLinks:[{name:"Walk-ins Only",url:"https://www.google.com/search?q=Beto%27s+Carnitas+NYC"}] },
  { id:11, name:"Umeko",                      neighborhood:"West Village",      cuisine:"Japanese",                price:3, difficulty:3, opened:"Jan 30, 2026",   openedDate:new Date("2026-01-30"), status:"open", address:"West Village",           vibe:"Quiet Elegance",          isBar:false, reservation:"Booking 1 week out",        dressCode:"Smart Casual",            mealPeriods:["Dinner"],                               homepage:"https://www.umekowestvillage.com",          chef:"The team behind Ume expands to Manhattan with this West Village counter. A $48 prix-fixe don menu of seasonal chirashi and tuna sets alongside overflowing maki rolls.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/umeko"},{name:"Google",url:"https://www.google.com/search?q=Umeko+NYC+reservation"}] },
  { id:14, name:"Aperitivo by CARTA",         neighborhood:"West Village",      cuisine:"Wine Bar",                price:2, difficulty:2, opened:"Jan 28, 2026",   openedDate:new Date("2026-01-28"), status:"open", address:"West Village",           vibe:"Breezy & Social",         isBar:true,  reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Breakfast","Lunch","Dinner","Late Night"],homepage:"https://www.cartanyc.com",                 chef:"The all-day café and wine bar concept from the CARTA team brings Italian aperitivo culture to the West Village. Natural wine program, spritz service, and light bites from morning through late night.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/aperitivo-by-carta"},{name:"Walk-ins",url:"https://www.google.com/search?q=Aperitivo+CARTA+NYC"}] },
  { id:9,  name:"Pizza Studio Tamaki",        neighborhood:"East Village",      cuisine:"Neapolitan Pizza",        price:2, difficulty:2, opened:"Jan 25, 2026",   openedDate:new Date("2026-01-25"), status:"open", address:"St. Marks Place",        vibe:"Focused & Artisanal",     isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Lunch","Dinner"],                        homepage:"https://www.google.com/search?q=Pizza+Studio+Tamaki+NYC", chef:"Chef Tamaki, a Japanese-trained Neapolitan pizzaiolo, brings a perfectionist approach to St. Marks Place. Pre-opening pop-ups generated significant buzz for the classic margherita and egg-and-sausage pie.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/pizza-studio-tamaki"},{name:"Walk-ins",url:"https://www.google.com/search?q=Pizza+Studio+Tamaki+NYC"}] },
  { id:15, name:"Seirēn",                    neighborhood:"Chelsea",           cuisine:"Cocktail Bar",            price:3, difficulty:3, opened:"Jan 22, 2026",   openedDate:new Date("2026-01-22"), status:"open", address:"94 7th Ave",             vibe:"Edgy & Atmospheric",      isBar:true,  reservation:"Walk-in Friendly",          dressCode:"Come as you are",         mealPeriods:["Evening","Late Night"],                  homepage:"https://www.seirennyc.com",                chef:"A Portugal-and-Spain-inspired conservas and cocktail bar. Notable for inventive drinks using MSG and parmesan tequila, plus preserved seafood on sourdough. The space doubles as a tattoo studio during daytime.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/seiren-nyc"},{name:"Walk-ins",url:"https://www.google.com/search?q=Seiren+NYC+bar"}] },
  { id:8,  name:"Much Obliged",               neighborhood:"East Village",      cuisine:"Cocktail Bar",            price:2, difficulty:2, opened:"Jan 20, 2026",   openedDate:new Date("2026-01-20"), status:"open", address:"Alphabet City",          vibe:"Laid-Back & Cool",        isBar:true,  reservation:"Walk-in Only",              dressCode:"Come as you are",         mealPeriods:["Dinner","Late Night"],                   homepage:"https://www.google.com/search?q=Much+Obliged+NYC+bar", chef:"From the team behind Greenpoint's beloved Gator bar. Much Obliged brings their low-key neighborhood spirit to Alphabet City — Corsican wines, fried fish sandwiches, and inventive house cocktails.", bookingLinks:[{name:"Walk-ins Only",url:"https://www.google.com/search?q=Much+Obliged+NYC+bar"}] },
  { id:1,  name:"Golden Steer",               neighborhood:"Greenwich Village", cuisine:"Steakhouse",              price:4, difficulty:3, opened:"Jan 15, 2026",   openedDate:new Date("2026-01-15"), status:"open", address:"1 Fifth Ave",            vibe:"Old-World Glamour",       isBar:false, reservation:"Booking 2–3 weeks out",     dressCode:"Smart Casual to Formal",  mealPeriods:["Dinner"],                               homepage:"https://www.goldensteernyc.com",           chef:"Helmed by the team behind the legendary Las Vegas original open since 1958. The NYC outpost preserves tableside service traditions and Rat Pack-era grandeur at the storied 1 Fifth Ave address.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/golden-steer"},{name:"OpenTable",url:"https://www.opentable.com/golden-steer-nyc"},{name:"Google",url:"https://www.google.com/search?q=Golden+Steer+NYC+reservation"}] },
  { id:16, name:"Tacos La 36",                neighborhood:"Midtown",           cuisine:"Mexican",                 price:1, difficulty:1, opened:"Jan 12, 2026",   openedDate:new Date("2026-01-12"), status:"open", address:"Midtown West",           vibe:"Quick & Festive",         isBar:false, reservation:"Walk-in Only",              dressCode:"Casual",                  mealPeriods:["Lunch","Dinner"],                        homepage:"https://www.google.com/search?q=Tacos+La+36+NYC",       chef:"A taqueria bringing six rotating taco varieties to Midtown including vegetarian options, ceviche, beer, and cocktails. A happy hour program makes it a rare casual value destination.", bookingLinks:[{name:"Walk-ins Only",url:"https://www.google.com/search?q=Tacos+La+36+NYC"}] },
  { id:10, name:"Rulin",                      neighborhood:"Union Square",      cuisine:"Chinese Noodles",         price:2, difficulty:2, opened:"Jan 10, 2026",   openedDate:new Date("2026-01-10"), status:"open", address:"15 E 13th St",           vibe:"Understated & Cozy",      isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Dinner"],                               homepage:"https://www.google.com/search?q=Rulin+NYC+restaurant",  chef:"The husband-and-wife team behind Brooklyn's Noodle Lane bring pan-Chinese noodle expertise to Manhattan. The intimate Union Square room spotlights hand-pulled Lanzhou beef noodle soup and dan dan noodles.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/rulin"},{name:"Google",url:"https://www.google.com/search?q=Rulin+NYC+reservation"}] },
  { id:6,  name:"Bistrot Ha",                 neighborhood:"Lower East Side",   cuisine:"French-Vietnamese",       price:3, difficulty:5, opened:"Dec 10, 2025",   openedDate:new Date("2025-12-10"), status:"open", address:"137 Eldridge St",        vibe:"Intimate & Electric",     isBar:false, reservation:"Booking 3–4 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Dinner"],                               homepage:"https://www.bistrotha.com",                chef:"The team behind LES phenomenon Ha's Snack Bar expands with this larger sibling. The kitchen blends French technique with Vietnamese soul — fried yuba with crab, curried lobster, and sweetbreads vol au vent.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/bistrot-ha"},{name:"Google",url:"https://www.google.com/search?q=Bistrot+Ha+NYC+reservation"}] },
  { id:24, name:"Babbo",                      neighborhood:"Greenwich Village", cuisine:"Italian",                 price:3, difficulty:4, opened:"Dec 5, 2025",    openedDate:new Date("2025-12-05"), status:"open", address:"1 Waverly Place",        vibe:"Classic Reborn",          isBar:false, reservation:"Booking 2–3 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Dinner"],                               homepage:"https://www.babbonyc.com",                 chef:"Stephen Starr acquired the iconic Mario Batali restaurant and brought in Mark Ladner (formerly of Del Posto) to revitalize the kitchen. Beloved Italian classics alongside Del Posto's legendary 100-layer lasagna.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/babbo"},{name:"OpenTable",url:"https://www.opentable.com/babbo"},{name:"Google",url:"https://www.google.com/search?q=Babbo+NYC+reservation"}] },
  { id:25, name:"Wild Cherry",                neighborhood:"West Village",      cuisine:"American",                price:3, difficulty:3, opened:"Oct 3, 2025",    openedDate:new Date("2025-10-03"), status:"open", address:"38 Commerce St",         vibe:"Cinematic & Romantic",    isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Dinner","Late Night"],                   homepage:"https://www.google.com/search?q=Wild+Cherry+NYC+restaurant", chef:"From James Beard Award–winning chefs Lee Hanson and Riad Nasr (Frenchette, Le Rock, Le Veau d'Or), in partnership with indie film studio A24 inside the restored Cherry Lane Theatre. A 45-seat supper club with a horseshoe bar, green banquettes, and a menu running from oysters and tuna crudo to kielbasa with kraut, a standout cheeseburger, and steak for two. One of the buzziest downtown openings of fall 2025.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/wild-cherry"},{name:"Walk-ins",url:"https://www.google.com/search?q=Wild+Cherry+NYC"}] },
  { id:26, name:"Meadow Lane",                neighborhood:"Tribeca",           cuisine:"American",                price:2, difficulty:2, opened:"Nov 14, 2025",   openedDate:new Date("2025-11-14"), status:"open", address:"355 Greenwich St",       vibe:"Gourmet & Scene-y",      isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Breakfast","Lunch","Dinner"],            homepage:"https://www.google.com/search?q=Meadow+Lane+NYC+restaurant", chef:"A wellness-forward counter-service spot serving artisanal chicken nuggets, cauliflower dishes, and market-driven bowls. The West Village location draws health-conscious diners seeking clean ingredients.", bookingLinks:[{name:"Walk-ins Only",url:"https://www.google.com/search?q=Meadow+Lane+NYC"}] },
  { id:27, name:"Salumeria Rosi East Village",neighborhood:"East Village",      cuisine:"Italian",                 price:2, difficulty:2, opened:"Nov 10, 2025",   openedDate:new Date("2025-11-10"), status:"open", address:"Avenue B, East Village", vibe:"Rustic & Generous",       isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Breakfast","Lunch","Dinner"],            homepage:"https://www.salumeriarosi.com",             chef:"The beloved Upper West Side Italian restaurant and grocer expands to the East Village, with breakfast, lunch, and dinner plus panini stuffed with imported mortadella and bresaola all day.", bookingLinks:[{name:"Walk-ins Only",url:"https://www.google.com/search?q=Salumeria+Rosi+East+Village+NYC"}] },
  { id:28, name:"Kaia Wine Bar",              neighborhood:"Upper East Side",   cuisine:"South African / Wine Bar",price:3, difficulty:2, opened:"Nov 5, 2025",    openedDate:new Date("2025-11-05"), status:"open", address:"1446 First Ave",         vibe:"Sophisticated & Global",  isBar:true,  reservation:"Walk-in Friendly",          dressCode:"Smart Casual",            mealPeriods:["Dinner","Late Night"],                   homepage:"https://www.kaiawinebarnyc.com",            chef:"One of New York's only South African restaurants relocated 10 blocks south on the Upper East Side. Over 50 South African wines by the glass complement peri-peri deviled eggs, lamb burgers, and a globally-inspired menu.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/kaia-wine-bar"},{name:"Google",url:"https://www.google.com/search?q=Kaia+Wine+Bar+NYC+reservation"}] },
  { id:29, name:"Double Knot",                neighborhood:"Midtown",           cuisine:"Japanese Izakaya",        price:3, difficulty:3, opened:"Oct 20, 2025",   openedDate:new Date("2025-10-20"), status:"open", address:"Midtown",                vibe:"Inventive & Layered",     isBar:false, reservation:"Booking 1 week out",        dressCode:"Smart Casual",            mealPeriods:["Dinner","Late Night"],                   homepage:"https://www.doubleknot.nyc",               chef:"The Philadelphia import brings its chef's tasting and izakaya-style format to Midtown — 10 courses of small bites and sushi plus soft serve for under $100. The à la carte menu shines with handrolls and robatayaki.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/double-knot"},{name:"Google",url:"https://www.google.com/search?q=Double+Knot+NYC+reservation"}] },
  { id:30, name:"Seahorse",                   neighborhood:"Union Square",      cuisine:"Seafood",                 price:4, difficulty:3, opened:"Oct 2025",       openedDate:new Date("2025-10-01"), status:"open", address:"201 Park Ave S (W Hotel)",  vibe:"Coastal & Cinematic",     isBar:false, reservation:"Booking 1–2 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Lunch","Dinner"],                        homepage:"https://www.seahorsenyc.com", chef:"From restaurateur John McDonald (Lure Fishbar, Bowery Meat Company) and Executive Chef John Villa. Located in the W Hotel Union Square lobby, the meticulously designed room features a blue-tiled raw bar, a sweeping 40-foot Rhapsody in Blue mural, and a seafood-forward menu of crudos, grilled prawns, tuna au poivre, and lobster pasta.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/seahorse-nyc"},{name:"Google",url:"https://www.google.com/search?q=Seahorse+NYC+reservation"}] },
  { id:31, name:"Hwaro",                      neighborhood:"Hell's Kitchen",   cuisine:"Korean Tasting Menu",     price:4, difficulty:5, opened:"Sep 2025",       openedDate:new Date("2025-09-09"), status:"open", address:"776 8th Ave (inside Gui)", vibe:"Intimate Chef's Counter",isBar:false, reservation:"Booking via Tock",          dressCode:"Smart Casual",            mealPeriods:["Dinner"],                                homepage:"https://hwaronyc.com",                     chef:"Chef Sungchul Shim (Michelin-starred Kochi, Mari) opens this 22-seat circular chef's counter hidden inside Gui Steakhouse. Named after the traditional Korean 화로 charcoal brazier, Hwaro serves a 13-course tasting menu at $295, blending Korean heritage with New York's creative pulse. One of the city's most intimate and transportive dining experiences.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/hwaro"},{name:"Google",url:"https://www.google.com/search?q=Hwaro+NYC+reservation"}] },
  { id:32, name:"Or'esh",                     neighborhood:"SoHo",              cuisine:"Mediterranean / Levantine",price:4, difficulty:5, opened:"Feb 10, 2026",  openedDate:new Date("2026-02-10"), status:"open", address:"450 West Broadway",      vibe:"Clubstaurant & On Fire",  isBar:false, reservation:"Booking 3–4 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Dinner"],                                homepage:"https://www.oresh.com",                     chef:"Michelin-starred Chef Nadav Greenberg (formerly of Shmoné) leads the kitchen at this Catch Hospitality Group (Corner Store, Eighty Six) production. A live-fire Mediterranean concept centered on a custom charcoal grill — handcrafted Jerusalem bagels, dry-aged hamachi, wagyu strip, and spicy spinach gomiti, all kissed by coal. Already one of the hardest reservations in NYC.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/oresh"},{name:"Google",url:"https://www.google.com/search?q=Or%27esh+NYC+reservation"}] },
  { id:33, name:"The Eighty Six",              neighborhood:"West Village",      cuisine:"Steakhouse",              price:4, difficulty:5, opened:"Sep 9, 2025",    openedDate:new Date("2025-09-09"), status:"open", address:"86 Bedford St",          vibe:"Intimate & Iconic",       isBar:false, reservation:"Booking 3–4 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Dinner"],                                homepage:"https://www.the86.nyc",                     chef:"From Catch Hospitality Group (Corner Store, Catch), co-owners Eugene Remm and Tilman Fertitta, with Chef Michael Vignola. Set in the former Chumley's speakeasy at 86 Bedford Street — a Prohibition-era literary haunt where Hemingway once drank. Only 35 seats, Art Deco interiors by Rockwell Group, and one of the hardest reservations in the city.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/the-eighty-six"},{name:"Google",url:"https://www.google.com/search?q=The+Eighty+Six+NYC+reservation"}] },
  { id:34, name:"Adda",                       neighborhood:"East Village",      cuisine:"Indian",                  price:2, difficulty:4, opened:"Apr 2025",       openedDate:new Date("2025-04-15"), status:"open", address:"107 1st Ave",            vibe:"Unapologetic & Joyful",   isBar:false, reservation:"Booking 2–3 weeks out",     dressCode:"Casual",                  mealPeriods:["Dinner"],                               homepage:"https://www.addanyc.com",                  chef:"Chef Chintan Pandya and restaurateur Roni Mazumdar (Dhamaka, Semma) reopen their groundbreaking Queens Indian canteen in a larger East Village home. Named Time Out NYC's #1 restaurant of 2025. The tableside Butter Chicken Experience — prepared by the chef — is the main event, alongside chaatwala servers roaming the room and cult classics like bheja masala, goat biryani, and Nagaland pork fry.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/adda"},{name:"OpenTable",url:"https://www.opentable.com/adda-nyc"},{name:"Google",url:"https://www.google.com/search?q=Adda+NYC+East+Village+reservation"}] },
  { id:35, name:"Kabawa",                     neighborhood:"East Village",      cuisine:"Caribbean",               price:3, difficulty:4, opened:"Apr 2025",       openedDate:new Date("2025-04-08"), status:"open", address:"8 Extra Place",          vibe:"Warm & Caribbean Soul",   isBar:false, reservation:"Booking 2–3 weeks out",     dressCode:"Casual to Smart Casual",  mealPeriods:["Dinner"],                               homepage:"https://www.momofuku.com/restaurants/kabawa", chef:"Chef Paul Carmichael and Momofuku transform the former Ko space in East Village's Extra Place alley into a celebration of Caribbean cuisine. Named Eater NYC's Best New Restaurant of 2025. A $145 three-course prix fixe rooted in Carmichael's Barbadian childhood — pepper shrimp with sorrel, braised goat, breadfruit toston, and coconut cream cheese turnovers. The adjacent Bar Kabawa pours daiquiris and West Indies patties.", bookingLinks:[{name:"OpenTable",url:"https://www.opentable.com/r/kabawa-new-york"},{name:"Google",url:"https://www.google.com/search?q=Kabawa+NYC+reservation"}] },
  { id:36, name:"Cove",                       neighborhood:"SoHo",              cuisine:"Seasonal American",       price:4, difficulty:5, opened:"Oct 7, 2025",    openedDate:new Date("2025-10-07"), status:"open", address:"299 W Houston St",       vibe:"California-Meets-NYC",    isBar:false, reservation:"Booking 3–4 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Dinner"],                               homepage:"https://www.cove-nyc.com",                 chef:"Chef Flynn McGarry (Gem, Eleven Madison Park, Alinea) opens his most personal restaurant in Hudson Square. A 90-seat room McGarry designed himself — Douglas fir floors, custom ceramics, West Coast modernism — offering an eight-course kitchen counter tasting and an à la carte main dining room. Menus change with the seasons: lobster with chanterelles, grilled eggplant with truffle, tomato consommé. Wine Director Paris McGarry curates 400 low-intervention bottles.", bookingLinks:[{name:"OpenTable",url:"https://www.opentable.com/r/cove-new-york"},{name:"Google",url:"https://www.google.com/search?q=Cove+Flynn+McGarry+NYC+reservation"}] },

  { id:40, name:"Saverne",                    neighborhood:"Midtown",           cuisine:"French Wood-Fired",       price:4, difficulty:4, opened:"Mar 2026",       openedDate:new Date("2026-03-01"), status:"open", address:"531 W 34th St",          vibe:"Elemental & Refined",     isBar:false, reservation:"Booking 2–3 weeks out",     dressCode:"Smart Casual",            mealPeriods:["Dinner"],                               homepage:"https://www.savernenyc.com",               chef:"Two-Michelin-starred Chef Gabriel Kreuther — who held two stars at his eponymous Midtown restaurant for years, and before that at The Modern inside MoMA — opens this wood-fired brasserie as a more elemental sibling concept. Named for the Alsatian town where he grew up. Open kitchen burning applewood, oak, and cherry. Seafood, meats, and vegetables cooked over fire.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/saverne"},{name:"Google",url:"https://www.google.com/search?q=Saverne+NYC+Gabriel+Kreuther+reservation"}] },
  { id:41, name:"Da Toscano",                 neighborhood:"Midtown",           cuisine:"Italian",                 price:3, difficulty:2, opened:"Mar 2, 2026",    openedDate:new Date("2026-03-02"), status:"open", address:"49 W 44th St (Iroquois)", vibe:"Classic & Comfortable",   isBar:false, reservation:"Walk-in Friendly",          dressCode:"Smart Casual",            mealPeriods:["Breakfast","Lunch","Dinner"],            homepage:"https://www.datoscano.com",                chef:"The Greenwich Village Italian fixture — beloved for its octopus carpaccio and lamb neck agnolotti — relocated from Minetta Lane to the Iroquois Hotel in Midtown. Chef Riccardo Orfino adds all-day breakfast and lunch service alongside the full Italian dinner menu plus a full Italian coffee bar.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/da-toscano"},{name:"Google",url:"https://www.google.com/search?q=Da+Toscano+NYC+reservation"}] },
  { id:42, name:"Shin Takumi",                neighborhood:"West Village",      cuisine:"Japanese Omakase",        price:2, difficulty:3, opened:"Mar 2026",       openedDate:new Date("2026-03-01"), status:"open", address:"44 Greenwich Ave",        vibe:"Intimate & Accessible",   isBar:false, reservation:"Booking 1 week out",        dressCode:"Casual",                  mealPeriods:["Dinner"],                               homepage:"https://shintakuminyc.com",                chef:"The most approachable sibling in the Takumi family — which includes Sushi YOLO and Takumi Omakase — opens in the West Village. The $58 12-course format (10 nigiri, one handroll, dessert) varies daily based on available fish, offering serious omakase craft at a fraction of the usual price point.", bookingLinks:[{name:"Resy",url:"https://resy.com/cities/new-york-ny/venues/shin-takumi"},{name:"Google",url:"https://www.google.com/search?q=Shin+Takumi+NYC+reservation"}] },
  { id:43, name:"Chubby Tan",                 neighborhood:"East Village",      cuisine:"Japanese Beef Tongue",    price:2, difficulty:2, opened:"Mar 7, 2026",    openedDate:new Date("2026-03-07"), status:"open", address:"239 E 5th St",           vibe:"Focused & Authentic",     isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Lunch","Dinner"],                        homepage:"https://chubbytan.com",                    chef:"The first US outpost of Tokyo-founded Gyutan no Lemon, bringing Sendai-style gyutan-yaki (grilled beef tongue) to the East Village. Sendai is Japan's undisputed capital of beef tongue — a regional obsession dating back to post-WWII, elevated into a civic institution. The signature Beef Tongue Rice is the main event.", bookingLinks:[{name:"Walk-ins",url:"https://chubbytan.com"},{name:"Google",url:"https://www.google.com/search?q=Chubby+Tan+NYC+East+Village"}] },
  { id:44, name:"Bar Lola",                   neighborhood:"Hell's Kitchen",    cuisine:"Cocktail Bar",            price:2, difficulty:1, opened:"Mid-Mar 2026",   openedDate:new Date("2026-03-15"), status:"open", address:"346 W 46th St",          vibe:"Warm & European",         isBar:true,  reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Dinner","Late Night"],                   homepage:"https://www.barlolanyc.com",               chef:"Named for Irish actress and dancer Lola Montez, this 125-seat two-floor café and cocktail bar on Restaurant Row channels Spanish wine bars and French bistros through a New York lens. Crème Brûlée Espresso Martinis, Breakfast Martinis, Hot Amaro Lattes, natural wine, and a strong coffee program.", bookingLinks:[{name:"Walk-ins",url:"https://www.barlolanyc.com"},{name:"Google",url:"https://www.google.com/search?q=Bar+Lola+NYC+Hell%27s+Kitchen"}] },
  { id:45, name:"Birdie's",                   neighborhood:"West Village",      cuisine:"Frozen Yogurt / Dessert", price:1, difficulty:1, opened:"Jan 2026",       openedDate:new Date("2026-01-10"), status:"open", address:"152 7th Ave S",          vibe:"Sweet & Playful",         isBar:false, reservation:"Walk-in Only",              dressCode:"Casual",                  mealPeriods:["Breakfast","Lunch","Dinner"],            homepage:"https://www.birdiesnyc.com",               chef:"A solo venture from industry veteran Arianna Tettamanzi. Six rotating flavors of frozen yogurt with unconventional toppings — olive oil, Cinnamon Toast Crunch, seasonal fruit — in a tiny 7th Avenue South storefront. The Infatuation called it the anchor of NYC's 2026 fro-yo renaissance.", bookingLinks:[{name:"Walk-ins Only",url:"https://www.birdiesnyc.com"},{name:"Google",url:"https://www.google.com/search?q=Birdie%27s+frozen+yogurt+West+Village+NYC"}] },
  { id:37, name:"Oriana",                     neighborhood:"SoHo",              cuisine:"American Live-Fire",      price:4, difficulty:5, opened:"Spring 2026",    status:"coming_soon", address:"174 Mott St",          vibe:"Refined & Elemental",     isBar:false, reservation:"Not yet open",              dressCode:"Smart Casual",            mealPeriods:["Dinner"],                openingMonth:"Spring 2026", timelineProgress:0.55, homepage:"https://www.oriananewyork.com", chef:"From Chef Andy Quinn and Sommelier Cedric Nicaise — the Eleven Madison Park veterans who opened The Noortwyck in 2022. A wood-fired American restaurant with a 7,000-bottle old-world wine cellar. Oysters, caviar service, grilled fish, coal-roasted chicken, beef ribs, dry-aged duck.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com"},{name:"Google",url:"https://www.google.com/search?q=Oriana+NYC+restaurant+reservation"}] },
  { id:38, name:"Jeju Noodle Bar Nolita",     neighborhood:"SoHo",              cuisine:"Korean Noodles",          price:3, difficulty:5, opened:"Spring 2026",    status:"coming_soon", address:"204 Elizabeth St",      vibe:"Precise & Minimalist",    isBar:false, reservation:"Not yet open",              dressCode:"Smart Casual",            mealPeriods:["Dinner"],                openingMonth:"Spring 2026", timelineProgress:0.45, homepage:"https://jejunoodlebar.com", chef:"Chef Douglas Kim — who trained at Bouley and Per Se before opening the original Jeju Noodle Bar in the West Village in 2017, earning it the first-ever Michelin star awarded to a noodle restaurant in the US, a distinction held for seven consecutive years — opens this Nolita second location with new exclusive dishes.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com/cities/new-york-ny/venues/jeju-noodle-bar"},{name:"Google",url:"https://www.google.com/search?q=Jeju+Noodle+Bar+Nolita+reservation"}] },
  { id:39, name:"Dean's",                     neighborhood:"SoHo",              cuisine:"British Seafood",         price:3, difficulty:4, opened:"Apr 2026",       status:"coming_soon", address:"213 6th Ave",           vibe:"Coastal & Convivial",     isBar:false, reservation:"Not yet open",              dressCode:"Casual to Smart Casual",  mealPeriods:["Lunch","Dinner"],        openingMonth:"April 2026",  timelineProgress:0.60, homepage:"https://www.google.com/search?q=Dean%27s+restaurant+SoHo+NYC", chef:"From the team behind King — the beloved SoHo Italian from chefs Annie Shi and Clare de Boer — comes this British seafood companion opening next door. Fish pie, roasted Scottish langoustines, potted shrimp on hot buttered crumpets, and Guinness on draft.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com"},{name:"Google",url:"https://www.google.com/search?q=Dean%27s+SoHo+NYC+reservation"}] },
  { id:46, name:"Good Time Country Buffet",   neighborhood:"East Village",      cuisine:"Southern Buffet",         price:2, difficulty:2, opened:"Spring 2026",    status:"coming_soon", address:"166 1st Ave",           vibe:"Joyful & Communal",       isBar:false, reservation:"Walk-in Friendly",          dressCode:"Casual",                  mealPeriods:["Lunch","Dinner"],        openingMonth:"Spring 2026", timelineProgress:0.42, homepage:"https://www.google.com/search?q=Good+Time+Country+Buffet+NYC", chef:"From the team behind Kisa — the acclaimed Korean prix-fixe on the Lower East Side — comes this wildly unexpected genre switch: a Southern country buffet inspired by the Korean-American founders' childhood in Atlanta. Fried chicken, cornbread, collard greens, served buffet-style in the former Moody Tongue Pizza space.", bookingLinks:[{name:"Walk-ins",url:"https://www.google.com/search?q=Good+Time+Country+Buffet+NYC"}] },
    // COMING SOON
  { id:18, name:"Straker's NYC",              neighborhood:"SoHo",              cuisine:"British-Italian",         price:4, difficulty:5, opened:"April 2026",     status:"coming_soon", address:"Former Lucky Strike",  vibe:"Chic & Influencer-Lit",   isBar:false, reservation:"Opening soon",              dressCode:"Smart Casual",            mealPeriods:["Lunch","Dinner"],        openingMonth:"April 2026",    timelineProgress:0.65, homepage:"https://www.strakersnyc.com",              chef:"Chef-owner Thomas Straker brings his British-by-way-of-Italy concept into Keith McNally's former Lucky Strike space in SoHo. Seasonal flatbreads, seabass tartare, and wood-fired meats.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com"},{name:"Google",url:"https://www.google.com/search?q=Straker%27s+NYC"}] },
  { id:19, name:"Dishoom",                    neighborhood:"Lower Manhattan",   cuisine:"Indian",                  price:3, difficulty:5, opened:"May 2026",       status:"coming_soon", address:"Lower Manhattan",      vibe:"Nostalgic & Vivid",       isBar:false, reservation:"Not yet open",              dressCode:"Casual to Smart Casual",  mealPeriods:["Breakfast","Lunch","Dinner"], openingMonth:"May 2026", timelineProgress:0.45, homepage:"https://www.dishoom.com", chef:"The beloved London institution finally arrives in New York. Dishoom's Bombay café concept — iconic black daal, breakfast naan rolls, and chai — has sold out every UK location since 2010.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com"},{name:"Google",url:"https://www.google.com/search?q=Dishoom+NYC"}] },
  { id:20, name:"Uovo",                       neighborhood:"Midtown",           cuisine:"Italian Pasta",           price:3, difficulty:4, opened:"May 2026",       status:"coming_soon", address:"TBD",                  vibe:"Minimalist & Pure",       isBar:false, reservation:"Not yet open",              dressCode:"Casual",                  mealPeriods:["Lunch","Dinner"],        openingMonth:"May 2026",    timelineProgress:0.40, homepage:"https://www.loveuovo.com", chef:"The LA pasta phenomenon built on fresh pasta overnighted daily from Bologna — a 1950s bolognese recipe, each order made individually. Growing from one to five LA locations in rapid succession.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com"},{name:"Google",url:"https://www.google.com/search?q=Uovo+NYC"}] },
  { id:21, name:"Oyatte",                     neighborhood:"Murray Hill",       cuisine:"Seasonal Tasting Menu",   price:4, difficulty:5, opened:"Spring 2026",    status:"coming_soon", address:"Murray Hill",          vibe:"Contemplative & Rare",    isBar:false, reservation:"Not yet open",              dressCode:"Smart Casual to Formal",  mealPeriods:["Dinner"],                openingMonth:"Spring 2026", timelineProgress:0.50, homepage:"https://www.google.com/search?q=Oyatte+NYC+restaurant", chef:"Chef Hasung Lee's debut fine-dining venture — pedigree spanning The French Laundry, Atomix, Gramercy Tavern, and Geranium Copenhagen. A seasonal tasting menu guided by restraint and clarity.", bookingLinks:[{name:"Resy (Opening Soon)",url:"https://resy.com"},{name:"Google",url:"https://www.google.com/search?q=Oyatte+NYC+reservation"}] },
  { id:22, name:"Carver 48",                  neighborhood:"Midtown",           cuisine:"Steakhouse",              price:4, difficulty:3, opened:"June 2026",      status:"coming_soon", address:"305 W 48th St",        vibe:"Bold & Classic",          isBar:false, reservation:"Not yet open",              dressCode:"Smart Casual",            mealPeriods:["Dinner","Late Night"],   openingMonth:"June 2026",   timelineProgress:0.28, homepage:"https://www.carverroadhospitality.com", chef:"From Carver Road Hospitality CEO Sean Christie and Executive Chef Daniel Ontiveros (Joël Robuchon at The Mansion, MGM Grand). Spinoff of award-winning Carversteak Las Vegas.", bookingLinks:[{name:"OpenTable (Opening Soon)",url:"https://www.opentable.com"},{name:"Google",url:"https://www.google.com/search?q=Carver+48+NYC+reservation"}] },
  { id:23, name:"RYE by Martin Auer",         neighborhood:"SoHo",              cuisine:"Bakery / Café",           price:2, difficulty:1, opened:"Summer 2026",    status:"coming_soon", address:"285 Lafayette St",     vibe:"Artisan & Tranquil",      isBar:false, reservation:"Walk-in",                   dressCode:"Casual",                  mealPeriods:["Breakfast","Lunch"],     openingMonth:"Summer 2026", timelineProgress:0.20, homepage:"https://www.martinauer.at", chef:"Austria's celebrated Auer baking family brings their generational craft to SoHo. The concept centers on a 100% rye sourdough loaf — hand-shaped, naturally leavened, 24-hour fermented.", bookingLinks:[{name:"Walk-ins",url:"https://www.google.com/search?q=RYE+Martin+Auer+NYC"}] },
];

// Runtime dedup guard — prevents duplicate IDs from ever rendering
const _seen = new Set();
const RESTAURANTS_DEDUPED = RESTAURANTS.filter(r => {
  if (_seen.has(r.id)) return false;
  _seen.add(r.id);
  return true;
});

const NEIGHBORHOODS = ["All",...Array.from(new Set(RESTAURANTS_DEDUPED.map(r=>r.neighborhood))).sort()];
const CUISINES      = ["All",...Array.from(new Set(RESTAURANTS_DEDUPED.map(r=>r.cuisine))).sort()];
const priceDollar = n => "$".repeat(n);
const priceLabel  = p => ["","Under $30","$30–60","$60–100","$100+"][p];
const diffLabel   = d => ["","Easy","Moderate","Tricky","Hard","Very Hard"][d];
const diffColor   = d => ["","#7dd3a8","#a8c96e","#e0b84a","#e08855","#d96060"][d];
const priceClr    = p => ["","#a8d5b5","#7ec8a0","#4ea87a","#2d8a5a"][p];

const CREAM="#ede0d8", CREAM_DIM="rgba(237,220,216,0.65)", CREAM_MID="rgba(237,220,216,0.46)",
      CREAM_SUB="rgba(237,220,216,0.28)", CREAM_FAINT="rgba(237,220,216,0.09)",
      ROSE_DIM="rgba(180,80,90,0.55)", ROSE_SUB="rgba(180,80,90,0.13)", ROSE_BDR="rgba(180,80,90,0.22)";

function OpeningTimeline({ progress, openingMonth, color }) {
  const pct = Math.max(0.06, Math.min(progress, 0.94));
  return (
    <div style={{ padding:"10px 16px 14px", borderTop:`1px solid rgba(237,220,216,0.08)` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:CREAM_SUB, fontFamily:"'DM Sans',sans-serif" }}>Opening Timeline</span>
        <span style={{ fontSize:11, fontWeight:600, color, fontFamily:"'DM Sans',sans-serif", background:`${color}18`, border:`1px solid ${color}40`, padding:"2px 10px", borderRadius:20 }}>{openingMonth}</span>
      </div>
      <div style={{ position:"relative", height:5, background:"rgba(237,220,216,0.08)", borderRadius:3 }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${pct*100}%`, background:`linear-gradient(90deg,${color}44,${color})`, borderRadius:3 }}/>
        <div style={{ position:"absolute", top:"50%", left:`${pct*100}%`, transform:"translate(-50%,-50%)", width:11, height:11, borderRadius:"50%", background:color, border:"2px solid rgba(237,220,216,0.45)", boxShadow:`0 0 7px ${color}` }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
        <span style={{ fontSize:9, color:CREAM_SUB, fontFamily:"'DM Sans',sans-serif" }}>Today</span>
        <span style={{ fontSize:9, color:CREAM_SUB, fontFamily:"'DM Sans',sans-serif" }}>Opening ↑</span>
      </div>
    </div>
  );
}

const MAP_PINS = {
  "Greenwich Village":{x:226,y:394},"NoMad":{x:264,y:298},"Flatiron":{x:250,y:318},
  "Murray Hill":{x:282,y:294},"Lower East Side":{x:286,y:442},"East Village":{x:274,y:413},
  "Union Square":{x:254,y:358},"West Village":{x:207,y:398},"Chelsea":{x:214,y:341},
  "Midtown":{x:252,y:245},"SoHo":{x:238,y:458},"Lower Manhattan":{x:240,y:526},
  "Tribeca":{x:230,y:487},"Harlem":{x:258,y:120},"Upper West Side":{x:206,y:182},
  "Upper East Side":{x:303,y:182},"Hell's Kitchen":{x:209,y:245},
};

function MapView({ restaurants, onSelect, selected }) {
  const [pinVisible, setPinVisible] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const byHood={};
  restaurants.forEach(r=>{const key=MAP_PINS[r.neighborhood]?r.neighborhood:"Midtown";if(!byHood[key])byHood[key]=[];byHood[key].push(r);});
  const hoodList = Object.keys(byHood);
  const totalSpots = hoodList.length;

  // Animate pins dropping in on mount
  useEffect(()=>{
    hoodList.forEach((hood, i)=>{
      setTimeout(()=>{
        setPinVisible(prev=>({...prev,[hood]:true}));
      }, i * 80 + 100);
    });
  },[restaurants.length]);

  const handlePinClick = (hood, rests, pos) => {
    if (activeCard?.hood === hood) { setActiveCard(null); return; }
    setActiveCard({ hood, rests, x: pos.x, y: pos.y });
    setActiveIdx(hoodList.indexOf(hood));
    onSelect(rests[0]);
  };

  const goTo = (dir) => {
    const next = (activeIdx + dir + totalSpots) % totalSpots;
    setActiveIdx(next);
    const hood = hoodList[next];
    const pos = MAP_PINS[hood] || {x:252,y:372};
    const rests = byHood[hood];
    setActiveCard({ hood, rests, x: pos.x, y: pos.y });
    onSelect(rests[0]);
  };

  const activeHood = hoodList[activeIdx];

  return (
    <div style={{ borderRadius:16, background:"#04030a", position:"relative" }}>

      {/* ── Navigation arrows bar ── */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px 8px",
        background:"linear-gradient(180deg,rgba(20,12,28,0.98),rgba(16,10,22,0.92))",
        borderBottom:"1px solid rgba(192,50,88,0.15)",
        borderRadius:"14px 14px 0 0",
      }}>
        {/* Prev arrow */}
        <button onClick={()=>goTo(-1)} style={{
          background:"linear-gradient(135deg,rgba(192,50,88,0.15),rgba(120,20,40,0.2))",
          border:"1px solid rgba(192,50,88,0.3)", borderRadius:10,
          width:38, height:38, cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", color:"#e8a8b8", fontSize:18, flexShrink:0,
          transition:"all 0.2s",
        }}>‹</button>

        {/* Center: spot counter + name */}
        <div style={{ flex:1, textAlign:"center", padding:"0 12px" }}>
          {activeCard ? (<>
            <div style={{
              fontSize:9, fontWeight:700, letterSpacing:3, textTransform:"uppercase",
              color:"rgba(192,50,88,0.7)", fontFamily:"'DM Sans',sans-serif", marginBottom:2,
            }}>
              {activeIdx+1} of {totalSpots} · {activeHood}
            </div>
            <div style={{
              display:"flex", justifyContent:"center", gap:4, flexWrap:"wrap",
            }}>
              {(byHood[activeHood]||[]).slice(0,3).map((r,i)=>(
                <span key={r.id} style={{
                  fontSize:10, color:"rgba(237,220,216,0.6)",
                  fontFamily:"'DM Serif Display',Georgia,serif",
                }}>{i>0?"· ":""}{r.name}</span>
              ))}
              {(byHood[activeHood]||[]).length>3 && (
                <span style={{fontSize:10,color:"rgba(237,220,216,0.3)",fontFamily:"'DM Sans',sans-serif"}}>
                  +{(byHood[activeHood]||[]).length-3} more
                </span>
              )}
            </div>
          </>) : (
            <div style={{
              fontSize:10, color:"rgba(237,220,216,0.3)",
              fontFamily:"'DM Sans',sans-serif", letterSpacing:1,
            }}>Tap a pin · or use arrows to browse {totalSpots} neighborhoods</div>
          )}
        </div>

        {/* Next arrow */}
        <button onClick={()=>goTo(1)} style={{
          background:"linear-gradient(135deg,rgba(192,50,88,0.15),rgba(120,20,40,0.2))",
          border:"1px solid rgba(192,50,88,0.3)", borderRadius:10,
          width:38, height:38, cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", color:"#e8a8b8", fontSize:18, flexShrink:0,
          transition:"all 0.2s",
        }}>›</button>
      </div>
      <svg viewBox="130 30 260 580" style={{ width:"100%", display:"block", height:"auto", aspectRatio:"260/580", minHeight:"700px", border:"1px solid rgba(237,220,216,0.08)", borderRadius:14 }}>
        <defs>
          <radialGradient id="mapbg" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1a1228"/>
            <stop offset="100%" stopColor="#060410"/>
          </radialGradient>
          <radialGradient id="glowgold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9a7420" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#9a7420" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="glowpink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c03258" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#c03258" stopOpacity="0"/>
          </radialGradient>
          <filter id="pinblur"><feGaussianBlur stdDeviation="2.5"/></filter>
          <filter id="softglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Background */}
        <rect width="500" height="640" fill="url(#mapbg)"/>

        {/* Subtle grid */}
        {[80,130,180,230,280,330,380,430,480,530,580].map(y=>(
          <line key={`h${y}`} x1="140" y1={y} x2="360" y2={y} stroke="rgba(237,220,216,0.025)" strokeWidth="0.6"/>
        ))}
        {[160,190,220,250,280,310,340].map(x=>(
          <line key={`v${x}`} x1={x} y1="50" x2={x} y2="590" stroke="rgba(237,220,216,0.025)" strokeWidth="0.6"/>
        ))}

        {/* Hudson River glow */}
        <ellipse cx="145" cy="340" rx="38" ry="200" fill="rgba(30,50,90,0.18)"/>
        <ellipse cx="145" cy="340" rx="18" ry="180" fill="rgba(40,70,120,0.12)"/>

        {/* East River glow */}
        <ellipse cx="358" cy="350" rx="28" ry="190" fill="rgba(30,50,90,0.14)"/>

        {/* Manhattan island — detailed outline */}
        <path d="
          M228 42 L248 38 L268 40 L288 50 L300 64 L306 82 L308 102
          L304 122 L306 142 L308 162 L310 182 L308 202 L312 222
          L314 242 L312 262 L316 282 L314 302 L312 322
          L308 342 L306 362 L302 382 L296 402 L288 422
          L278 442 L266 458 L254 472 L242 482 L230 490
          L218 494 L208 488 L198 476 L190 460 L184 442
          L178 422 L174 402 L170 382 L168 362 L166 342
          L164 322 L162 302 L160 282 L158 262 L156 242
          L154 222 L152 202 L150 182 L150 162 L148 142
          L148 122 L148 102 L150 82 L154 64 L162 50
          L176 42 L200 38 Z
        " fill="rgba(22,16,36,0.95)" stroke="rgba(237,220,216,0.14)" strokeWidth="1.4"/>

        {/* Parks — Central Park */}
        <rect x="212" y="138" width="90" height="82" rx="8"
          fill="rgba(30,55,32,0.45)" stroke="rgba(60,100,60,0.2)" strokeWidth="0.8"/>
        <text x="257" y="183" fontSize="11" fill="rgba(80,140,80,0.65)"
          textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontStyle="italic">Central Park</text>

        {/* Riverside Park */}
        <rect x="152" y="138" width="14" height="110" rx="4"
          fill="rgba(30,55,32,0.3)" stroke="rgba(60,100,60,0.15)" strokeWidth="0.6"/>

        {/* Streets — a few iconic ones */}
        {/* 5th Ave */}
        <line x1="260" y1="232" x2="245" y2="490" stroke="rgba(237,220,216,0.06)" strokeWidth="1"/>
        <text x="273" y="350" fontSize="9" fill="rgba(237,220,216,0.18)" textAnchor="middle"
          fontFamily="'DM Sans',sans-serif" transform="rotate(-3,273,350)">5th Ave</text>
        {/* Broadway diagonal */}
        <line x1="252" y1="224" x2="218" y2="490" stroke="rgba(237,220,216,0.05)" strokeWidth="0.8" strokeDasharray="4,4"/>

        {/* Neighborhood labels */}
        {[
          ["Harlem",258,110],["Upper West Side",193,192],["Upper East Side",308,192],
          ["Hell's Kitchen",196,256],["Midtown",264,236],
          ["Chelsea",200,350],["Flatiron",264,308],["NoMad",272,288],
          ["West Village",194,408],["Greenwich Village",224,383],
          ["East Village",280,402],["Lower East Side",292,432],
          ["SoHo",234,448],["Tribeca",224,478],["Lower Manhattan",238,516],
          ["Murray Hill",286,284],["Union Square",256,348],
        ].map(([lbl,x,y])=>(
          <text key={lbl} x={x} y={y} fontSize="6.2" fill="rgba(237,220,216,0.13)"
            textAnchor="middle" fontFamily="'DM Serif Display',Georgia,serif" fontStyle="italic">{lbl}</text>
        ))}

        {/* Landmark dots */}
        {[
          {name:"Empire State",x:262,y:302},{name:"Chrysler",x:278,y:274},
          {name:"One WTC",x:236,y:506},{name:"Flatiron Bldg",x:254,y:326},
        ].map(lm=>(
          <g key={lm.name}>
            <circle cx={lm.x} cy={lm.y} r={2} fill="rgba(237,220,216,0.2)"/>
          </g>
        ))}

        {/* Pins */}
        {Object.entries(byHood).map(([hood,rests])=>{
          const pos=MAP_PINS[hood]||{x:252,y:372};
          const isSel = activeCard?.hood === hood;
          const soon = rests.every(r=>r.status==="coming_soon");
          const cnt = rests.length;
          const visible = pinVisible[hood];
          const pinY = visible ? pos.y : pos.y - 28;
          const pinOpacity = visible ? 1 : 0;
          const glowColor = soon ? "glowpink" : "glowgold";
          const pinColor = soon ? "rgba(140,100,200,0.9)" : isSel ? "#e8c86a" : "rgba(212,176,80,0.92)";
          const pinStroke = isSel ? "#fff" : "rgba(237,220,216,0.35)";

          return (
            <g key={hood}
              onClick={()=>handlePinClick(hood, rests, pos)}
              style={{cursor:"pointer", transition:"opacity 0.4s", opacity:pinOpacity}}
            >
              {/* Glow halo */}
              {isSel && <circle cx={pos.x} cy={pos.y} r={32} fill={`url(#${glowColor})`} filter="url(#pinblur)"/>}
              <circle cx={pos.x} cy={pos.y} r={isSel?26:18} fill={`url(#${glowColor})`} opacity={0.6}/>

              {/* Pin shadow */}
              <ellipse cx={pos.x} cy={pinY+20} rx={cnt>1?13:9} ry={3.5}
                fill="rgba(0,0,0,0.45)" filter="url(#pinblur)"
                style={{transform:`translateY(0)`, transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}/>

              {/* Pin body */}
              <g transform={`translate(0,${visible ? 0 : -28})`} style={{
                opacity: pinOpacity,
                transition:"opacity 0.3s ease",
              }}>
                {/* Teardrop pin shape */}
                <path
                  d={`M${pos.x},${pinY+17} C${pos.x-11},${pinY+6} ${pos.x-11},${pinY-10} ${pos.x},${pinY-16} C${pos.x+11},${pinY-10} ${pos.x+11},${pinY+6} ${pos.x},${pinY+17}Z`}
                  fill={pinColor}
                  stroke={pinStroke}
                  strokeWidth={isSel?1.8:1}
                  filter={isSel?"url(#softglow)":undefined}
                />
                {/* Count or icon */}
                {cnt>1
                  ? <text x={pos.x} y={pinY+4} fontSize="11" fill="#110c18" textAnchor="middle"
                      fontWeight="800" fontFamily="'DM Sans',sans-serif">{cnt}</text>
                  : <circle cx={pos.x} cy={pinY} r={4} fill="rgba(8,6,14,0.7)"/>
                }
              </g>
            </g>
          );
        })}

        {/* Legend */}
        <rect x="148" y="602" width="210" height="28" rx="7" fill="rgba(8,6,14,0.7)" stroke="rgba(237,220,216,0.08)" strokeWidth="0.8"/>
        <circle cx="166" cy="616" r="5" fill="rgba(212,176,80,0.9)"/>
        <text x="176" y="620" fontSize="12" fill="rgba(237,220,216,0.5)" fontFamily="'DM Sans',sans-serif">Recently Opened</text>
        <circle cx="270" cy="616" r="5" fill="rgba(140,100,200,0.85)"/>
        <text x="278" y="620" fontSize="12" fill="rgba(237,220,216,0.5)" fontFamily="'DM Sans',sans-serif">Coming Soon</text>
      </svg>

      {/* Floating tap card */}
      {activeCard && (()=>{
        const card = activeCard;
        const isRight = card.x < 260;
        return (
          <div style={{
            position:"absolute",
            top: `${(card.y / 640) * 100}%`,
            left: isRight ? `${(card.x / 500)*100 + 8}%` : "auto",
            right: isRight ? "auto" : `${((500 - card.x) / 500)*100 + 8}%`,
            transform:"translateY(-50%)",
            background:"linear-gradient(135deg,rgba(24,16,36,0.97),rgba(14,10,22,0.97))",
            border:"1px solid rgba(212,176,80,0.3)",
            borderRadius:12,
            padding:"12px 14px",
            minWidth:148,
            maxWidth:180,
            boxShadow:"0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,176,80,0.1)",
            zIndex:10,
            pointerEvents:"auto",
          }}>
            {/* Close button */}
            <button onClick={(e)=>{e.stopPropagation();setActiveCard(null);}} style={{
              position:"absolute",top:6,right:8,background:"none",border:"none",
              color:"rgba(237,220,216,0.35)",fontSize:13,cursor:"pointer",lineHeight:1,padding:0
            }}>✕</button>
            {/* Hood name */}
            <div style={{fontSize:8,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
              color:"rgba(212,176,80,0.7)",fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>
              {card.hood}
            </div>
            {/* Restaurant list */}
            {card.rests.slice(0,5).map((r,i)=>(
              <div key={r.id} onClick={()=>{onSelect(r);}}
                style={{
                  padding:"5px 0",
                  borderBottom: i<Math.min(card.rests.length,5)-1 ? "1px solid rgba(237,220,216,0.06)" : "none",
                  cursor:"pointer",
                }}>
                <div style={{fontSize:11.5,fontWeight:600,color:"rgba(237,220,216,0.9)",
                  fontFamily:"'DM Serif Display',Georgia,serif"}}>{r.name}</div>
                <div style={{fontSize:9,color:"rgba(237,220,216,0.38)",fontFamily:"'DM Sans',sans-serif",marginTop:1}}>
                  {r.cuisine} · {r.status==="coming_soon"
                    ? <span style={{color:"rgba(160,130,210,0.8)"}}>{r.openingMonth}</span>
                    : <span style={{color:"rgba(154,116,32,0.8)"}}>Open now</span>}
                </div>
              </div>
            ))}
            {card.rests.length>5 && (
              <div style={{fontSize:9,color:"rgba(237,220,216,0.25)",marginTop:6,fontFamily:"'DM Sans',sans-serif"}}>
                +{card.rests.length-5} more
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}


function NotifyMe({ restaurant, saved, onSave }) {
  const handleNotify = () => {
    if (saved) return;
    const name = restaurant.name;
    const month = restaurant.openingMonth || restaurant.opened || "soon";
    const reminderTitle = encodeURIComponent(`${name} opens ${month} — check Resy`);
    const reminderNotes = encodeURIComponent(`NYC Hot Spot: ${name} in ${restaurant.neighborhood} opens ${month}. Check ${restaurant.homepage}`);
    const iosReminderUrl = `x-apple-reminderkit://REMCDReminder/?title=${reminderTitle}&notes=${reminderNotes}`;
    const gcalTitle = encodeURIComponent(`${name} opens — make reservation`);
    const gcalDetails = encodeURIComponent(`${name} in ${restaurant.neighborhood} opens ${month}. Book at: ${restaurant.homepage}`);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&details=${gcalDetails}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.location.href = iosReminderUrl;
      setTimeout(() => { if (navigator.share) { navigator.share({ title: `Remind me: ${name} opens ${month}`, text: `${name} opens ${month}. Don't forget to book!`, url: restaurant.homepage }).catch(()=>{}); } }, 800);
    } else { window.open(gcalUrl, "_blank"); }
    if (onSave) onSave(restaurant.id);
  };

  return (
    <button onClick={handleNotify} style={{
      display:"flex", alignItems:"center", gap:7,
      background: saved ? "rgba(154,116,32,0.2)" : "rgba(237,220,216,0.05)",
      border: `1px solid ${saved ? "rgba(154,116,32,0.6)" : "rgba(237,220,216,0.15)"}`,
      borderRadius:24, padding:"8px 18px",
      fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
      color: saved ? "rgba(212,176,80,0.95)" : "rgba(237,220,216,0.6)",
      cursor:"default", transition:"all 0.25s", whiteSpace:"nowrap",
    }}>
      <span style={{ fontSize:14 }}>{saved ? "✓" : "🔔"}</span>
      {saved ? "Notification enabled" : "Notify me when open"}
    </button>
  );
}

function RestaurantCard({ r, selected, onClick, wishlist, toggleWishlist, notifs=[], saveNotif=()=>{}, compact=false }) {
  const [flipped, setFlipped] = useState(false);
  const isSel = selected?.id === r.id;
  const color = hoodColor(r.neighborhood);
  const svgSrc = makeCuisineSVG(r.cuisine, color);

  return (
    <div style={{ position:"relative", display:"flex", flexDirection:"column", height:"100%" }}>
      {/* FRONT */}
      <div style={{ visibility:flipped?"hidden":"visible", pointerEvents:flipped?"none":"auto", position:flipped?"absolute":"relative", inset:0, borderRadius:14, overflow:"hidden", cursor:"pointer", background:"linear-gradient(180deg,rgba(8,5,10,0.97) 0%,rgba(6,4,8,0.99) 100%)", border:`1px solid ${isSel?"rgba(180,80,90,0.45)":"rgba(237,220,216,0.09)"}`, borderLeft:`3px solid ${color}` }} onClick={()=>{ if(!flipped) onClick(isSel?null:r); }}>
        <div style={{ position:"relative", height:72, overflow:"hidden" }}>
          <img src={svgSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg,transparent 0%,rgba(8,5,10,0.88) 75%,rgba(8,5,10,1) 100%)` }}/>

          {!compact&&r.status==="coming_soon"&&<div style={{ position:"absolute", top:8, right:12, fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"#c8b8f0", fontFamily:"'DM Sans',sans-serif", background:"rgba(80,60,140,0.7)", border:`1px solid rgba(160,140,200,0.4)`, padding:"2px 9px", borderRadius:20 }}>Opening Soon</div>}
          <div style={{ position:"absolute", bottom:7, right:12, fontSize:9, fontWeight:600, color:CREAM_SUB, fontFamily:"'DM Sans',sans-serif", background:"rgba(8,5,10,0.7)", padding:"2px 8px", borderRadius:20, border:`1px solid rgba(237,220,216,0.1)` }}>{r.opened}</div>
        </div>
        {isSel&&<div style={{ position:"absolute", top:0, left:14, right:14, height:1, background:`linear-gradient(90deg,transparent,rgba(237,220,216,0.3),transparent)` }}/>}
        <div style={{ padding:"12px 14px 14px" }}>
          <div style={{ position:"relative", marginBottom:8, textAlign:"center", paddingRight:52 }}>
            <div style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:22, fontWeight:400, color:isSel?CREAM:"rgba(237,220,216,0.92)", lineHeight:1.2, marginBottom:5 }}>{r.isBar?"🍸 ":""}{r.name}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:11, fontWeight:500, color:CREAM_MID, fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" }}>📍 {r.neighborhood}</span>
              <span style={{ width:1, height:11, background:"rgba(237,220,216,0.15)", margin:"0 7px", flexShrink:0, display:"inline-block" }}/>
              <span style={{ fontSize:11, color:CREAM_SUB, fontFamily:"'DM Sans',sans-serif" }}>{r.cuisine}</span>
            </div>
            <div style={{ position:"absolute", top:0, right:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:priceClr(r.price), letterSpacing:1.3 }}>{priceDollar(r.price)}</span>
              <div style={{ display:"flex", gap:3 }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:i<=r.difficulty?diffColor(r.difficulty):"rgba(237,220,216,0.1)" }}/>)}</div>
              <span style={{ fontSize:10, fontWeight:600, color:diffColor(r.difficulty), fontFamily:"'DM Sans',sans-serif" }}>{diffLabel(r.difficulty)}</span>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:10, letterSpacing:0.5, color:ROSE_DIM, background:ROSE_SUB, border:`1px solid ${ROSE_BDR}`, padding:"3px 10px", borderRadius:20, display:"inline-block", flexShrink:0 }}>✦ {r.vibe}</span>
            <button onClick={e=>{e.stopPropagation();setFlipped(true);}} style={{ background:"linear-gradient(135deg,rgba(160,55,68,0.5),rgba(100,28,40,0.62))", border:`1px solid rgba(180,80,90,0.45)`, borderRadius:20, color:CREAM_DIM, padding:"5px 13px", fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:0.5, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>More Info ›</button>
          </div>
          {isSel&&<div style={{ marginTop:12, paddingTop:22, borderTop:`1px solid rgba(237,220,216,0.09)`, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[["Opened",r.opened],["Address",r.address],["Per Person",priceLabel(r.price)]].map(([lbl,val])=>(
              <div key={lbl}><div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:CREAM_SUB, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>{lbl}</div><div style={{ fontSize:12, fontWeight:500, color:CREAM_DIM, fontFamily:"'DM Sans',sans-serif" }}>{val}</div></div>
            ))}
          </div>}
        </div>
        {!compact&&r.status==="coming_soon"&&r.timelineProgress!==undefined&&(
          <>
            <OpeningTimeline progress={r.timelineProgress} openingMonth={r.openingMonth} color={color}/>
            <div style={{ padding:"0 16px 14px", display:"flex", justifyContent:"center" }}>
              <NotifyMe restaurant={r} saved={notifs.includes(r.id)} onSave={saveNotif}/>
            </div>
          </>
        )}
      </div>

      {/* BACK */}
      <div style={{ visibility:flipped?"visible":"hidden", pointerEvents:flipped?"auto":"none", position:flipped?"relative":"absolute", inset:0, borderRadius:14, overflow:"hidden", background:"linear-gradient(145deg,rgba(100,28,42,0.42) 0%,rgba(10,5,12,0.98) 100%)", border:`1px solid rgba(237,220,216,0.12)`, borderLeft:`3px solid ${color}` }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:36, overflow:"hidden" }}>
          <img src={svgSrc} alt="" style={{ width:"100%", height:"36px", objectFit:"cover", display:"block", filter:"brightness(0.3) saturate(0.4)" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(10,5,12,0.98))" }}/>
        </div>
        <div style={{ position:"relative", zIndex:1, padding:"16px 18px" }}>
          <div style={{ position:"absolute", top:0, left:16, right:16, height:1, background:`linear-gradient(90deg,transparent,rgba(237,220,216,0.2),transparent)` }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.2, textTransform:"uppercase", color:CREAM_SUB, marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>The Story</div>
              <div style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:21, fontWeight:400, color:CREAM, lineHeight:1.2 }}>{r.name}</div>
            </div>
            <button onClick={e=>{e.stopPropagation();setFlipped(false);}} style={{ background:CREAM_FAINT, border:`1px solid rgba(237,220,216,0.16)`, borderRadius:"50%", width:30, height:30, color:CREAM_MID, fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>‹</button>
          </div>
          <div style={{ height:1, background:`linear-gradient(90deg,rgba(237,220,216,0.1),transparent)`, marginBottom:12 }}/>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:13, lineHeight:1.75, color:CREAM_DIM, margin:"0 0 14px 0" }}>{r.chef}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
            {[["Reservations",r.reservation],["Dress Code",r.dressCode],["Service",r.mealPeriods?.join(", ")]].map(([lbl,val])=>(
              <div key={lbl} style={{ background:"rgba(237,220,216,0.04)", border:`1px solid rgba(237,220,216,0.08)`, borderRadius:10, padding:"8px 10px" }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", color:CREAM_SUB, marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>{lbl}</div>
                <div style={{ fontSize:11, fontWeight:500, color:CREAM_DIM, fontFamily:"'DM Sans',sans-serif", lineHeight:1.4 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid rgba(237,220,216,0.08)`, paddingTop:12 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.2, textTransform:"uppercase", color:CREAM_SUB, marginBottom:9, fontFamily:"'DM Sans',sans-serif" }}>Reserve a Table</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              {r.homepage&&<a href={r.homepage} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ background:"linear-gradient(135deg,rgba(80,60,100,0.45),rgba(50,35,70,0.6))", border:`1px solid rgba(160,140,200,0.35)`, borderRadius:20, color:"rgba(200,185,240,0.85)", padding:"6px 15px", fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:0.4, textDecoration:"none", display:"inline-block" }}>Homepage ↗</a>}
              {r.bookingLinks.map(link=><a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ background:"linear-gradient(135deg,rgba(150,48,62,0.44),rgba(90,20,32,0.6))", border:`1px solid rgba(180,80,90,0.4)`, borderRadius:20, color:CREAM_DIM, padding:"6px 15px", fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:0.4, textDecoration:"none", display:"inline-block" }}>{link.name} ↗</a>)}
            </div>
            <div style={{ marginTop:12, borderTop:"1px solid rgba(237,220,216,0.07)", paddingTop:22, display:"flex", justifyContent:"center" }}>
              <button onClick={e=>{e.stopPropagation();toggleWishlist(r.id);}} style={{
                display:"flex", alignItems:"center", gap:7,
                background:wishlist.includes(r.id)?"rgba(154,116,32,0.18)":"rgba(237,220,216,0.05)",
                border:`1px solid ${wishlist.includes(r.id)?"rgba(154,116,32,0.55)":"rgba(237,220,216,0.15)"}`,
                borderRadius:24, padding:"8px 20px",
                fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                color:wishlist.includes(r.id)?"rgba(212,176,80,0.95)":"rgba(237,220,216,0.6)",
                cursor:"pointer", transition:"all 0.2s",
              }}>
                <span>{wishlist.includes(r.id)?"★":"☆"}</span>
                {wishlist.includes(r.id)?"On Your Wish List":"Add to Wish List"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // ── Persistent storage using artifact storage API ──────────────────────
  const [store, setStore] = React.useState({});
  const [storeReady, setStoreReady] = React.useState(false);

  useEffect(() => {
    const load = async () => {
      // Try artifact persistent storage first, then localStorage fallback
      try {
        const wResult = await window.storage.get("hotspot_wishlist");
        const nResult = await window.storage.get("hotspot_notifs");
        const wishIds = wResult ? JSON.parse(wResult.value) : [];
        const notifIds = nResult ? JSON.parse(nResult.value) : [];
        setStore({ wishlist: wishIds, notifs: notifIds });
        setStoreReady(true);
        return;
      } catch {}
      // localStorage fallback
      try {
        const wishIds = JSON.parse(localStorage.getItem("hotspot_wishlist") || "[]");
        const notifIds = JSON.parse(localStorage.getItem("hotspot_notifs") || "[]");
        setStore({ wishlist: wishIds, notifs: notifIds });
      } catch {
        setStore({ wishlist: [], notifs: [] });
      }
      setStoreReady(true);
    };
    load();
  }, []);

  const persist = async (key, value) => {
    const str = JSON.stringify(value);
    try { await window.storage.set(key, str); } catch {}
    try { localStorage.setItem(key, str); } catch {}
  };

  const saveWishlist = async (ids) => {
    await persist("hotspot_wishlist", ids);
    setStore(prev => ({ ...prev, wishlist: ids }));
  };

  const saveNotif = async (id) => {
    const current = store.notifs || [];
    if (current.includes(id)) return;
    const next = [...current, id];
    await persist("hotspot_notifs", next);
    setStore(prev => ({ ...prev, notifs: next }));
  };

  const removeNotif = async (id) => {
    const next = (store.notifs || []).filter(x => x !== id);
    await persist("hotspot_notifs", next);
    setStore(prev => ({ ...prev, notifs: next }));
  };

  const [tab,          setTab]          = useState("open");
  const [neighborhood, setNeighborhood] = useState("All");
  const [cuisine,      setCuisine]      = useState("All");
  
  const [selected,     setSelected]     = useState(null);
  const [viewMode,     setViewMode]     = useState("list");
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiResults,    setAiResults]    = useState(null);
  const [aiError,      setAiError]      = useState(null);
  const [showAI,       setShowAI]       = useState(false);
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [mainView,     setMainView]     = useState("home");
  const wishlist = store.wishlist || [];

  const lastUpdated = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const recentCount = RESTAURANTS_DEDUPED.filter(r=>isWithin6Months(r)).length;
  const soonCnt     = RESTAURANTS_DEDUPED.filter(r=>r.status==="coming_soon").length;

  const filtered = RESTAURANTS_DEDUPED.filter(r=>{
    if(tab==="open"){if(!isWithin6Months(r))return false;}
    else{if(r.status!=="coming_soon")return false;}
    if(neighborhood!=="All"&&r.neighborhood!==neighborhood)return false;
    if(cuisine!=="All"&&r.cuisine!==cuisine)return false;
    if(searchQuery.trim()){
      const q=searchQuery.toLowerCase();
      if(!r.name.toLowerCase().includes(q)&&!r.cuisine.toLowerCase().includes(q)&&!r.neighborhood.toLowerCase().includes(q))return false;
    }
    return true;
  });

  const sorted = tab==="open"
    ? [...filtered].sort((a,b)=>(b.openedDate||new Date(0))-(a.openedDate||new Date(0)))
    : [...filtered].sort((a,b)=>(a.timelineProgress||0)<(b.timelineProgress||0)?1:-1);

  const activeFilters = (neighborhood!=="All"?1:0)+(cuisine!=="All"?1:0);

  const toggleWishlist = (id) => {
    const current = store.wishlist || [];
    const next = current.includes(id) ? current.filter(x=>x!==id) : [...current, id];
    saveWishlist(next);
  };
  const wishlistRestaurants = RESTAURANTS_DEDUPED.filter(r => wishlist.includes(r.id));
  const reminderRestaurants = RESTAURANTS_DEDUPED.filter(r => (store.notifs || []).includes(r.id));

  const handleAIUpdate = useCallback(async()=>{
    setAiLoading(true);setAiResults(null);setAiError(null);setShowAI(true);
    try{
      const today=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Today is ${today}. Search for new Manhattan restaurant and bar openings from the past six months, plus confirmed openings in the next 3 months. For each: name, neighborhood, cuisine, price range, booking difficulty 1-5, opening date, vibe, chef/team, reservation availability, dress code, meal periods. ONLY Manhattan. Concise list.`}]})
      });
      const data=await res.json();
      setAiResults(data.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"No updates found.");
    }catch{setAiError("Search failed — please try again.");}
    finally{setAiLoading(false);}
  },[]);

  const selStyle={background:"rgba(237,220,216,0.06)",border:`1px solid rgba(237,220,216,0.14)`,borderRadius:10,color:CREAM_MID,padding:"9px 32px 9px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500,outline:"none",appearance:"none",width:"100%",cursor:"pointer"};

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 20% 0%,#160a10 0%,#080509 50%,#050308 100%)", color:CREAM, fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── STICKY TITLE ── */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,5,10,0.94)", backdropFilter:"blur(14px)", borderBottom:`1px solid rgba(237,220,216,0.08)`, padding:"8px 12px 20px", overflow:"visible", clipPath:"none" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", textAlign:"center", overflow:"visible" }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:4, textTransform:"uppercase", color:CREAM_SUB, marginBottom:1 }}>Manhattan · 2026</div>
          <h1 style={{
            fontFamily:"'Playfair Display SC', Georgia, serif",
            fontSize:"clamp(44px,11vw,96px)",
            fontWeight:700,
            margin:"2px 0 0 0", lineHeight:1.1, paddingBottom:"14px",
            background:"linear-gradient(135deg,#f8ede6 0%,#e8a8b8 30%,#c03258 65%,#7a1025 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:2,
            fontStyle:"italic",
            display:"block", width:"100%", textAlign:"center",
            whiteSpace:"nowrap",
            transform:"scaleX(0.92)",
            transformOrigin:"center",
            filter:"drop-shadow(0 3px 16px rgba(192,50,88,0.3))",
          }}>NYC Hot Spot</h1>
        </div>
      </div>

      {/* ── SUB-HEADER (scrolls) ── */}
      {mainView==="home"&&<div style={{ background:"linear-gradient(180deg,rgba(180,80,90,0.07) 0%,transparent 100%)", padding:"22px 24px 20px" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", textAlign:"center" }}>
          <p style={{ margin:"0 0 16px 0", fontSize:15, fontWeight:400, color:CREAM_MID }}>Manhattan's newest restaurants &amp; bars, curated daily</p>
          <div style={{ width:50, height:1, background:`linear-gradient(90deg,transparent,rgba(237,220,216,0.28),transparent)`, margin:"0 auto 16px" }}/>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <button onClick={handleAIUpdate} disabled={aiLoading} style={{ background:aiLoading?"rgba(237,220,216,0.05)":"linear-gradient(135deg,rgba(160,50,65,0.55),rgba(100,25,38,0.72))", color:aiLoading?CREAM_SUB:CREAM_DIM, border:`1px solid rgba(237,220,216,0.18)`, borderRadius:24, padding:"10px 24px", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:0.5, cursor:aiLoading?"not-allowed":"pointer" }}>{aiLoading?"⏳  Searching…":"✦  AI Daily Update"}</button>
            <span style={{ fontSize:11, fontWeight:500, color:CREAM_SUB }}>Updated {lastUpdated}</span>
          </div>
        </div>
      </div>}

      <div style={{ maxWidth:1080, margin:"0 auto", padding:"0 20px 90px" }}>

        {showAI&&(
          <div style={{ background:"linear-gradient(145deg,rgba(22,8,14,0.98),rgba(10,5,9,0.99))", border:`1px solid rgba(237,220,216,0.1)`, borderRadius:16, padding:"18px 22px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:CREAM_SUB }}>✦ AI Intelligence Feed</span>
              <button onClick={()=>setShowAI(false)} style={{ background:"none", border:"none", color:CREAM_SUB, cursor:"pointer", fontSize:20, lineHeight:1 }}>×</button>
            </div>
            {aiLoading&&<div style={{ color:CREAM_MID, fontSize:14 }}><span style={{ display:"inline-block", animation:"spin 1.4s linear infinite", marginRight:8 }}>◌</span>Scanning…</div>}
            {aiError&&<div style={{ color:"#e07080", fontSize:13 }}>{aiError}</div>}
            {aiResults&&<div style={{ color:CREAM_DIM, fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", maxHeight:260, overflowY:"auto" }}>{aiResults}</div>}
          </div>
        )}

        {mainView==="home"&&<>
        {/* ── SEARCH BAR ── */}
        <div style={{ maxWidth:700, margin:"0 auto 10px", position:"relative" }}>
          <input
            type="text"
            placeholder="Search by name, cuisine, or neighborhood…"
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            style={{
              width:"100%", boxSizing:"border-box",
              background:"rgba(237,220,216,0.05)",
              border:`1px solid ${searchQuery?"rgba(154,116,32,0.55)":"rgba(237,220,216,0.13)"}`,
              borderRadius:12, padding:"11px 40px 11px 16px",
              fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:400,
              color:"rgba(237,220,216,0.85)", outline:"none",
              transition:"border-color 0.2s",
            }}
          />
          {searchQuery
            ? <button onClick={()=>setSearchQuery("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(237,220,216,0.4)", fontSize:18, cursor:"pointer", lineHeight:1, padding:0 }}>×</button>
            : <span style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", color:"rgba(237,220,216,0.2)", fontSize:14, pointerEvents:"none" }}>⌕</span>
          }
        </div>

        {/* ── UNIFIED CONTROLS PANEL ── */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20 }}>
          <div style={{ background:"rgba(237,220,216,0.04)", border:`1px solid rgba(237,220,216,0.11)`, borderRadius:16, overflow:"hidden", width:"100%", maxWidth:700 }}>
            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:`1px solid rgba(237,220,216,0.08)` }}>
              {[{key:"open",label:"Recently Opened",cnt:recentCount},{key:"coming_soon",label:"Coming Soon",cnt:soonCnt}].map((t,i)=>(
                <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1, border:"none", padding:"12px 20px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif", background:tab===t.key?"linear-gradient(135deg,rgba(160,50,65,0.45),rgba(100,25,38,0.38))":"transparent", color:tab===t.key?CREAM:CREAM_SUB, borderRight:i===0?`1px solid rgba(237,220,216,0.08)`:"none" }}>
                  {t.label}<span style={{ marginLeft:6, fontSize:10, fontWeight:700, background:"rgba(237,220,216,0.08)", padding:"1px 6px", borderRadius:8, color:tab===t.key?CREAM_MID:"rgba(237,220,216,0.22)" }}>{t.cnt}</span>
                </button>
              ))}
            </div>

            {/* Filter + List/Map — uniform bordered row */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 14px" }}>
              {[
                { label: activeFilters>0 ? `⊞ Filter (${activeFilters})` : "⊞ Filter", onClick: ()=>setFiltersOpen(o=>!o), active: filtersOpen||activeFilters>0 },
                { label: "☰  List", onClick: ()=>setViewMode("list"), active: viewMode==="list" },
                { label: "◈  Map",  onClick: ()=>setViewMode("map"),  active: viewMode==="map"  },
              ].map(({label, onClick, active})=>(
                <button key={label} onClick={onClick} style={{
                  border:`1px solid ${active?"rgba(180,80,90,0.5)":"rgba(237,220,216,0.15)"}`,
                  borderRadius:10, padding:"7px 16px", fontSize:12, fontWeight:600,
                  cursor:"pointer", transition:"all 0.2s",
                  fontFamily:"'DM Sans',sans-serif",
                  background:active?"rgba(180,80,90,0.18)":"rgba(237,220,216,0.05)",
                  color:active?"rgba(210,130,145,0.95)":CREAM_SUB,
                  whiteSpace:"nowrap",
                }}>{label}</button>
              ))}
            </div>
          </div>
          {filtersOpen&&(
            <div style={{ display:"flex", gap:10, marginTop:8, padding:"12px 14px", background:"rgba(237,220,216,0.04)", border:`1px solid rgba(237,220,216,0.1)`, borderRadius:12, flexWrap:"wrap", alignItems:"center", width:"100%", maxWidth:700 }}>
              <div style={{ flex:1, minWidth:130, position:"relative" }}>
                <select value={neighborhood} onChange={e=>{setNeighborhood(e.target.value);}} style={selStyle}>
                  <option value="All" style={{ background:"#100810" }}>Neighborhood</option>
                  {NEIGHBORHOODS.filter(n=>n!=="All").map(n=><option key={n} value={n} style={{ background:"#100810" }}>{n}</option>)}
                </select>
                <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:CREAM_SUB, pointerEvents:"none", fontSize:10 }}>▾</span>
              </div>
              <div style={{ flex:1, minWidth:130, position:"relative" }}>
                <select value={cuisine} onChange={e=>setCuisine(e.target.value)} style={selStyle}>
                  <option value="All" style={{ background:"#100810" }}>Cuisine</option>
                  {CUISINES.filter(c=>c!=="All").map(c=><option key={c} value={c} style={{ background:"#100810" }}>{c}</option>)}
                </select>
                <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:CREAM_SUB, pointerEvents:"none", fontSize:10 }}>▾</span>
              </div>
              {activeFilters>0&&<button onClick={()=>{setNeighborhood("All");setCuisine("All");}} style={{ background:"none", border:`1px solid rgba(237,220,216,0.14)`, borderRadius:8, color:CREAM_SUB, padding:"8px 12px", fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:"pointer" }}>Clear ×</button>}
            </div>
          )}
        </div>

        <div style={{ textAlign:"center", marginBottom:18 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:CREAM_SUB }}>
            {sorted.length} Establishment{sorted.length!==1?"s":""}
          </span>
          {tab==="open"&&<span style={{ fontWeight:400, letterSpacing:1, marginLeft:8, fontSize:9, color:"rgba(237,220,216,0.2)" }}>— newest first · Sep 2025 – present</span>}
          {tab==="coming_soon"&&<span style={{ fontWeight:400, letterSpacing:1, marginLeft:8, fontSize:9, color:"rgba(237,220,216,0.2)" }}>— confirmed openings</span>}
        </div>

        {viewMode==="map"?(
          <div style={{ display:"grid", gridTemplateColumns:"minmax(260px,1fr) minmax(300px,1.1fr)", gap:20, alignItems:"start" }}>
            <MapView restaurants={sorted} onSelect={r=>setSelected(selected?.id===r.id?null:r)} selected={selected}/>
            <div style={{ display:"flex", flexDirection:"column", gap:12, maxHeight:640, overflowY:"auto", paddingRight:4 }}>
              {sorted.length===0?<div style={{ textAlign:"center", padding:"40px", color:CREAM_SUB }}>No results</div>:sorted.map(r=><RestaurantCard key={r.id} r={r} selected={selected} onClick={setSelected} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif}/>)}
            </div>
          </div>
        ):(
          <>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))",
              gap:14,
              alignItems:"stretch",
            }}>
              {sorted.length===0
                ?<div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px", color:CREAM_SUB, fontSize:16 }}>No establishments match your selection</div>
                :sorted.map(r=><RestaurantCard key={r.id} r={r} selected={selected} onClick={setSelected} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif}/>)
              }
            </div>
          </>
        )}

        </>
        }
        <div style={{ marginTop:48, paddingTop:18, borderTop:`1px solid rgba(237,220,216,0.07)`, textAlign:"center", fontSize:10, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:CREAM_SUB }}>
          Sources: Eater NY · The Infatuation · Resy · AI-Powered Daily Updates
        </div>
      </div>

      {/* ── MY REMINDERS VIEW ── */}
      {mainView==="reminders"&&(
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"radial-gradient(ellipse at 20% 0%,#160a10 0%,#080509 50%,#050308 100%)", overflowY:"auto", zIndex:50, paddingTop:120, paddingBottom:90 }}>
        <div style={{ maxWidth:1080, margin:"0 auto", padding:"0 20px" }}>
          <h2 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:24, fontWeight:400, color:"#ede0d8", marginBottom:4, marginTop:0 }}>My Reminders</h2>
          <p style={{ fontSize:13, color:"rgba(237,220,216,0.46)", marginBottom:16, fontFamily:"'DM Sans',sans-serif" }}>Restaurants you've set opening notifications for.</p>
          {reminderRestaurants.length===0
            ?<div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(237,220,216,0.28)", fontSize:15, fontFamily:"'DM Sans',sans-serif" }}>No reminders set yet. Hit "Notify me" on any Coming Soon card.</div>
            :<div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {reminderRestaurants.map(r=>(
                <div key={r.id}>
                  <RestaurantCard r={r} selected={null} onClick={()=>{}} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif} compact={true}/>
                </div>
              ))}
            </div>
          }
        </div>
        </div>
      )}

      {/* ── WISH LIST VIEW ── */}
      {mainView==="wishlist"&&(
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"radial-gradient(ellipse at 20% 0%,#160a10 0%,#080509 50%,#050308 100%)", overflowY:"auto", zIndex:50, paddingTop:120, paddingBottom:90 }}>
        <div style={{ maxWidth:1080, margin:"0 auto", padding:"0 20px" }}>
          <h2 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:24, fontWeight:400, color:"#ede0d8", marginBottom:4, marginTop:0 }}>Wish List</h2>
          <p style={{ fontSize:13, color:"rgba(237,220,216,0.46)", marginBottom:16, fontFamily:"'DM Sans',sans-serif" }}>Restaurants you want to try. Add them from the back of any card.</p>
          {wishlistRestaurants.length===0
            ?<div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(237,220,216,0.28)", fontSize:15, fontFamily:"'DM Sans',sans-serif" }}>Your wish list is empty. Flip any card and tap "Add to Wish List".</div>
            :<div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {wishlistRestaurants.map(r=>(
                <div key={r.id}>
                  <RestaurantCard r={r} selected={null} onClick={()=>{}} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif} compact={true}/>
                </div>
              ))}
            </div>
          }
        </div>
        </div>
      )}

      {/* ── SOURCES FOOTER — always visible above nav ── */}
      <div style={{ position:"fixed", bottom:58, left:0, right:0, textAlign:"center", pointerEvents:"none", zIndex:199 }}>
        <span style={{ fontSize:8, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(237,220,216,0.15)", fontFamily:"'DM Sans',sans-serif" }}>Sources: Eater NY · The Infatuation · Resy · AI-Powered Daily Updates</span>
      </div>

      {/* ── BOTTOM NAV BAR ── */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:200,
        background:"rgba(6,4,8,0.97)", backdropFilter:"blur(16px)",
        borderTop:"1px solid rgba(237,220,216,0.1)",
        display:"flex", justifyContent:"space-around", alignItems:"stretch",
        padding:"10px 0 max(10px,env(safe-area-inset-bottom))",
      }}>
        {/* Home tab — custom SVG logo */}
        <button onClick={()=>setMainView("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"4px 20px", position:"relative" }}>
          <svg width="34" height="34" viewBox="0 0 110 110" style={{ transition:"opacity 0.2s" }}>

            <text x="55" y="68" fontFamily="Georgia,serif" fontSize="52" fontStyle="italic" fontWeight="700" fill={mainView==="home"?"#e8a8b8":"rgba(237,220,216,0.65)"} textAnchor="middle" letterSpacing="-3">HS</text>
            <path d="M79 12 C78 7, 75 5, 76 2 C74 4, 72 8, 73 12 C73 15, 75 17, 74 20 C76 18, 79 15, 79 12 Z" fill={mainView==="home"?"#ff6020":"rgba(237,220,216,0.55)"} opacity="0.95"/>
            <line x1="22" y1="76" x2="88" y2="76" stroke={mainView==="home"?"rgba(192,50,88,0.6)":"rgba(237,220,216,0.3)"} strokeWidth="1.5"/>
            <text x="55" y="92" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill={mainView==="home"?"#e8a8b8":"rgba(237,220,216,0.65)"} textAnchor="middle" letterSpacing="6">NYC</text>
          </svg>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:0.8, fontFamily:"'DM Sans',sans-serif", color:mainView==="home"?"rgba(212,176,80,0.95)":"rgba(237,220,216,0.3)", transition:"color 0.2s" }}>Home</span>
        </button>

        {/* Reminders + Wish List tabs */}
        {[
          { key:"reminders", icon:"🔔", label:"Reminders", badge:reminderRestaurants.length },
          { key:"wishlist",  icon:"★",  label:"Wish List", badge:wishlist.length },
        ].map(({key,icon,label,badge})=>(
          <button key={key} onClick={()=>setMainView(key)} style={{
            background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
            padding:"4px 20px", position:"relative",
          }}>
            <span style={{ fontSize:22, lineHeight:1, filter:mainView===key?"none":"grayscale(1) opacity(0.4)" }}>{icon}</span>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:0.8, fontFamily:"'DM Sans',sans-serif", color:mainView===key?"rgba(212,176,80,0.95)":"rgba(237,220,216,0.3)", transition:"color 0.2s" }}>{label}</span>
            {badge>0&&<span style={{ position:"absolute", top:0, right:10, background:"rgba(180,80,90,0.9)", color:"#fff", fontSize:9, fontWeight:700, borderRadius:"50%", width:14, height:14, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>{badge}</span>}
          </button>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display+SC:ital,wght@0,700;1,700&family=Playfair+Display:wght@700;800;900&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:rgba(237,220,216,0.03); }
        ::-webkit-scrollbar-thumb { background:rgba(237,220,216,0.14); border-radius:2px; }
        select option { background:#100810; color:#ede0d8; }
        select:focus { border-color:rgba(237,220,216,0.28)!important; outline:none; }
        a:hover { opacity:0.82; } button:hover { opacity:0.88; }
        @media(max-width:640px){ div[style*="grid-template-columns: minmax(260px"]{grid-template-columns:1fr!important;} }
      `}</style>
    </div>
  );
}
