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
import restaurantData from "./restaurants.json";
const RESTAURANTS = restaurantData.map(r => ({
  ...r,
  openedDate: r.openedDate ? new Date(r.openedDate) : undefined,
}));

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

// Neighborhood center coordinates for restaurants without specific addresses
const HOOD_COORDS = {
  "Greenwich Village":[40.7336,-74.0027],"NoMad":[40.7454,-73.9880],"Flatiron":[40.7410,-73.9896],
  "Murray Hill":[40.7488,-73.9774],"Lower East Side":[40.7185,-73.9868],"East Village":[40.7265,-73.9818],
  "Union Square":[40.7359,-73.9911],"West Village":[40.7338,-74.0030],"Chelsea":[40.7465,-74.0014],
  "Midtown":[40.7549,-73.9840],"SoHo":[40.7233,-73.9985],"Lower Manhattan":[40.7075,-74.0113],
  "Tribeca":[40.7163,-74.0086],"Harlem":[40.8116,-73.9465],"Upper West Side":[40.7870,-73.9754],
  "Upper East Side":[40.7736,-73.9566],"Hell's Kitchen":[40.7638,-73.9918],
};

// Specific lat/lng for restaurants with known addresses
const RESTAURANT_COORDS = {
  17:[40.7562,-73.9845],  // Seventy Seven Alley - Midtown
  4:[40.7494,-73.9765],   // Kjun - 334 Lexington Ave
  3:[40.7405,-73.9920],   // Kidilum - 31 W 21st St
  12:[40.7340,-74.0040],  // Kees - West Village
  2:[40.7454,-73.9880],   // Ambassadors Clubhouse - 1245 Broadway
  13:[40.7348,-74.0050],  // Cleo Downtown - West Village
  7:[40.7240,-73.9845],   // Odo East Village - 536 E 5th St
  5:[40.7188,-73.9840],   // Beto's Carnitas - 69 Clinton St
  11:[40.7330,-74.0060],  // Umeko - West Village
  14:[40.7342,-74.0055],  // Aperitivo by CARTA - West Village
  9:[40.7291,-73.9876],   // Pizza Studio Tamaki - St. Marks Place
  15:[40.7424,-73.9992],  // Seirēn - 94 7th Ave
  8:[40.7247,-73.9793],   // Much Obliged - Alphabet City
  1:[40.7322,-73.9970],   // Golden Steer - 1 Fifth Ave
  16:[40.7544,-73.9890],  // Tacos La 36 - Midtown West
  10:[40.7346,-73.9929],  // Rulin - 15 E 13th St
  6:[40.7185,-73.9912],   // Bistrot Ha - 137 Eldridge St
  24:[40.7321,-73.9989],  // Babbo - 1 Waverly Place
  25:[40.7315,-74.0042],  // Wild Cherry - 38 Commerce St
  26:[40.7190,-74.0096],  // Meadow Lane - 355 Greenwich St
  27:[40.7253,-73.9780],  // Salumeria Rosi East Village - Avenue B
  28:[40.7725,-73.9530],  // Kaia Wine Bar - 1446 First Ave
  29:[40.7558,-73.9820],  // Double Knot - Midtown
  30:[40.7364,-73.9890],  // Seahorse - 201 Park Ave S
  31:[40.7609,-73.9886],  // Hwaro - 776 8th Ave
  32:[40.7256,-73.9998],  // Or'esh - 450 West Broadway
  33:[40.7310,-74.0040],  // The Eighty Six - 86 Bedford St
  34:[40.7270,-73.9845],  // Adda - 107 1st Ave
  35:[40.7261,-73.9899],  // Kabawa - 8 Extra Place
  36:[40.7272,-74.0050],  // Cove - 299 W Houston St
  40:[40.7540,-73.9994],  // Saverne - 531 W 34th St
  41:[40.7565,-73.9812],  // Da Toscano - 49 W 44th St
  42:[40.7354,-74.0000],  // Shin Takumi - 44 Greenwich Ave
  43:[40.7260,-73.9870],  // Chubby Tan - 239 E 5th St
  44:[40.7601,-73.9880],  // Bar Lola - 346 W 46th St
  45:[40.7330,-74.0005],  // Birdie's - 152 7th Ave S
  37:[40.7233,-73.9955],  // Oriana - 174 Mott St
  38:[40.7238,-73.9960],  // Jeju Noodle Bar Nolita - 204 Elizabeth St
  39:[40.7300,-74.0005],  // Dean's - 213 6th Ave
  46:[40.7268,-73.9844],  // Good Time Country Buffet - 166 1st Ave
  18:[40.7238,-74.0030],  // Straker's NYC - SoHo
  19:[40.7075,-74.0113],  // Dishoom - Lower Manhattan
  20:[40.7558,-73.9830],  // Uovo - Midtown
  21:[40.7480,-73.9780],  // Oyatte - Murray Hill
  22:[40.7620,-73.9870],  // Carver 48 - 305 W 48th St
  23:[40.7233,-73.9965],  // RYE by Martin Auer - 285 Lafayette St
  47:[40.7195,-73.9885],  // Bufón - 78 Rivington St
  48:[40.7527,-73.9772],  // Giulietta - 200 Park Ave (MetLife)
  49:[40.7430,-74.0070],  // Verde - 85 10th Ave
  50:[40.7184,-73.9880],  // Anbā - 92 Ludlow St
  51:[40.7390,-74.0010],  // Dahla - 202 W 14th St
  52:[40.7580,-73.9810],  // Delos - 1185 6th Ave
  53:[40.7345,-74.0055],  // Lily Pond - 183 W 10th St
  54:[40.7265,-73.9855],  // Nounou - 71 1st Ave
  55:[40.7415,-73.9895],  // Piadi - 18 E 23rd St
  56:[40.7265,-74.0055],  // Bar Maeda - 70 Charlton St
  57:[40.7252,-73.9820],  // Cô Lạc - 234 E 4th St
  58:[40.7419,-73.9830],  // Skëwr - 127 E 27th St
  59:[40.7238,-73.9958],  // Sushi Yukimi - 247A Elizabeth St
  60:[40.7170,-74.0070],  // Lumo Ombro - 78 Leonard St
  61:[40.7470,-73.9850],  // Salt Bread Ko - 4 E 32nd St
  62:[40.7590,-73.9790],  // Hi Dozo - Near Rockefeller Center
  63:[40.6890,-73.9960],  // Lou & Bev's - Brooklyn Heights
  64:[40.7527,-73.9772],  // Giardino at Giulietta - MetLife
};

function getRestaurantCoords(r) {
  if (RESTAURANT_COORDS[r.id]) return RESTAURANT_COORDS[r.id];
  if (HOOD_COORDS[r.neighborhood]) return HOOD_COORDS[r.neighborhood];
  return [40.7400, -73.9950]; // Manhattan fallback
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
let leafletLoaded = false;
function loadLeaflet() {
  if (leafletLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if (window.L) { leafletLoaded = true; resolve(); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = LEAFLET_CSS;
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.onload = () => { leafletLoaded = true; resolve(); };
    document.head.appendChild(script);
  });
}

function MapView({ restaurants, onSelect, selected }) {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const [ready, setReady] = React.useState(false);

  // Load Leaflet on mount
  useEffect(() => {
    loadLeaflet().then(() => setReady(true));
  }, []);

  // Initialize map once Leaflet + DOM are ready
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [40.7380, -73.9950],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>')
      .addTo(map);
    mapInstanceRef.current = map;
    // Fix tiles not loading in hidden/resized containers
    setTimeout(() => map.invalidateSize(), 200);
  }, [ready]);

  // Update markers when restaurants change
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    restaurants.forEach(r => {
      const [lat, lng] = getRestaurantCoords(r);
      const isSoon = r.status === "coming_soon";
      const isBar = r.isBar;
      const pinColor = isSoon ? "#8c64c8" : "#d4b050";
      const borderColor = isSoon ? "#a080d0" : "#c4952e";
      const icon = L.divIcon({
        className: "",
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36],
        html: `<div style="
          width:28px;height:36px;position:relative;cursor:pointer;
          filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        ">
          <svg viewBox="0 0 28 36" width="28" height="36">
            <path d="M14,34 C14,34 3,22 3,13 A11,11 0 1,1 25,13 C25,22 14,34 14,34Z"
              fill="${pinColor}" stroke="${borderColor}" stroke-width="1.5"/>
            <circle cx="14" cy="13" r="5" fill="rgba(8,6,14,0.6)"/>
            ${isBar ? '<text x="14" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="sans-serif">🍸</text>'
              : isSoon ? '<text x="14" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="sans-serif">⏳</text>'
              : '<circle cx="14" cy="13" r="2.5" fill="rgba(237,220,216,0.9)"/>'}
          </svg>
        </div>`,
      });
      const marker = L.marker([lat, lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:160px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:4px;font-family:'DM Serif Display',Georgia,serif;">${r.name}</div>
          <div style="font-size:11px;color:#666;margin-bottom:2px;">${r.neighborhood} · ${r.cuisine}</div>
          <div style="font-size:11px;color:#888;">${"$".repeat(r.price)} · ${isSoon ? `Opening ${r.openingMonth}` : "Open now"}</div>
          ${r.address ? `<div style="font-size:10px;color:#999;margin-top:4px;">${r.address}</div>` : ""}
        </div>
      `, { className: "nyc-popup" });
      marker.on("click", () => onSelect(r));
      markersRef.current.push(marker);
    });
  }, [ready, restaurants, onSelect]);

  // Pan to selected restaurant
  useEffect(() => {
    if (!ready || !mapInstanceRef.current || !selected) return;
    const [lat, lng] = getRestaurantCoords(selected);
    mapInstanceRef.current.setView([lat, lng], 15, { animate: true, duration: 0.5 });
    // Open the popup for the selected marker
    const idx = restaurants.findIndex(r => r.id === selected.id);
    if (idx >= 0 && markersRef.current[idx]) {
      markersRef.current[idx].openPopup();
    }
  }, [ready, selected]);

  return (
    <div style={{ borderRadius:16, overflow:"hidden", background:"#04030a", position:"relative" }}>
      {/* Legend bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:20,
        padding:"8px 16px",
        background:"linear-gradient(180deg,rgba(20,12,28,0.98),rgba(16,10,22,0.92))",
        borderBottom:"1px solid rgba(237,220,216,0.08)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:"#d4b050", display:"inline-block" }}/>
          <span style={{ fontSize:10, color:"rgba(237,220,216,0.5)", fontFamily:"'DM Sans',sans-serif" }}>Open</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:"#8c64c8", display:"inline-block" }}/>
          <span style={{ fontSize:10, color:"rgba(237,220,216,0.5)", fontFamily:"'DM Sans',sans-serif" }}>Coming Soon</span>
        </div>
        <span style={{ fontSize:10, color:"rgba(237,220,216,0.25)", fontFamily:"'DM Sans',sans-serif" }}>
          {restaurants.length} spots
        </span>
      </div>
      <div ref={mapRef} style={{ width:"100%", height:640, background:"#0a0a0c" }}/>
      <style>{`
        .nyc-popup .leaflet-popup-content-wrapper {
          background: rgba(20,14,30,0.96);
          color: #ede0d8;
          border: 1px solid rgba(212,176,80,0.3);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        }
        .nyc-popup .leaflet-popup-tip {
          background: rgba(20,14,30,0.96);
          border: 1px solid rgba(212,176,80,0.2);
        }
        .nyc-popup .leaflet-popup-close-button {
          color: rgba(237,220,216,0.4);
        }
        .leaflet-control-zoom a {
          background: rgba(20,14,30,0.9) !important;
          color: rgba(237,220,216,0.7) !important;
          border-color: rgba(237,220,216,0.1) !important;
        }
      `}</style>
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

function RestaurantCard({ r, selected, onClick, wishlist, toggleWishlist, notifs=[], saveNotif=()=>{}, removeNotif=()=>{}, compact=false }) {
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
            <div style={{ marginTop:12, borderTop:"1px solid rgba(237,220,216,0.07)", paddingTop:22, display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
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
              {notifs.includes(r.id)?(
                <button onClick={e=>{e.stopPropagation();removeNotif(r.id);}} style={{
                  display:"flex", alignItems:"center", gap:7,
                  background:"rgba(180,80,90,0.15)",
                  border:"1px solid rgba(180,80,90,0.4)",
                  borderRadius:24, padding:"8px 20px",
                  fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  color:"rgba(210,130,145,0.9)",
                  cursor:"pointer", transition:"all 0.2s",
                }}>
                  <span>🔕</span>Remove from Reminders
                </button>
                </button>
              ):(
                <button onClick={e=>{e.stopPropagation();saveNotif(r.id);}} style={{
                  display:"flex", alignItems:"center", gap:7,
                  background:"rgba(237,220,216,0.05)",
                  border:"1px solid rgba(237,220,216,0.15)",
                  borderRadius:24, padding:"8px 20px",
                  fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  color:"rgba(237,220,216,0.6)",
                  cursor:"pointer", transition:"all 0.2s",
                }}>
                  <span>🔔</span>Add to Reminders
                </button>
              )}
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
                <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1, border:"none", padding:"12px 20px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif", background:tab===t.key?"linear-gradient(135deg,rgba(160,50,65,0.45),rgba(100,25,38,0.38))":"transparent", color:tab===t.key?CREAM:CREAM_SUB, borderRight:i===0?`1px solid rgba(237,220,216,0.08)`:"none", whiteSpace:"nowrap" }}>
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
              {sorted.length===0?<div style={{ textAlign:"center", padding:"40px", color:CREAM_SUB }}>No results</div>:sorted.map(r=><RestaurantCard key={r.id} r={r} selected={selected} onClick={setSelected} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif} removeNotif={removeNotif}/>)}
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
                :sorted.map(r=><RestaurantCard key={r.id} r={r} selected={selected} onClick={setSelected} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif} removeNotif={removeNotif}/>)
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
                  <RestaurantCard r={r} selected={null} onClick={()=>{}} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif} removeNotif={removeNotif} compact={true}/>
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
                  <RestaurantCard r={r} selected={null} onClick={()=>{}} wishlist={wishlist} toggleWishlist={toggleWishlist} notifs={store.notifs||[]} saveNotif={saveNotif} removeNotif={removeNotif} compact={true}/>
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
        <button onClick={()=>setMainView("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:3, padding:"4px 20px", position:"relative", minHeight:50 }}>
          <svg width="24" height="24" viewBox="0 0 110 110" style={{ transition:"opacity 0.2s" }}>

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
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:3,
            padding:"4px 20px", position:"relative", minHeight:50,
          }}>
            <span style={{ fontSize:22, lineHeight:1, filter:mainView===key?"none":"grayscale(1) opacity(0.4)", display:"flex", alignItems:"center", justifyContent:"center", height:24 }}>{icon}</span>
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
