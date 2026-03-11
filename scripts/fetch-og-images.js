const https = require("https");
const http = require("http");
const fs = require("fs");

const jsonPath = "src/restaurants.json";
const restaurants = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const follow = (u, depth = 0) => {
      if (depth > 5) return resolve("");
      const reqLib = u.startsWith("https") ? https : http;
      reqLib.get(u, { headers: { "User-Agent": "Mozilla/5.0 NYC-Hot-Spot-Bot" }, timeout: 4000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, u).href;
          return follow(next, depth + 1);
        }
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
          // Only need the first ~20KB to find OG tags in <head>
          if (data.length > 20000) res.destroy();
        });
        res.on("end", () => resolve(data));
        res.on("error", () => resolve(""));
      }).on("error", () => resolve("")).on("timeout", function() { this.destroy(); resolve(""); });
    };
    follow(url);
  });
}

function extractOgImage(html) {
  // Try og:image first
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (ogMatch) return ogMatch[1];

  // Try twitter:image
  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
  if (twMatch) return twMatch[1];

  return null;
}

async function main() {
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const r of restaurants) {
    // Skip if already has an image, or no homepage, or homepage is a Google search
    if (r.image) { skipped++; continue; }
    if (!r.homepage || r.homepage.includes("google.com/search")) {
      skipped++;
      continue;
    }

    process.stdout.write(`Fetching OG image for ${r.name}... `);
    try {
      const html = await fetchUrl(r.homepage);
      const image = extractOgImage(html);
      if (image) {
        r.image = image;
        updated++;
        console.log(`✓ ${image.slice(0, 80)}...`);
      } else {
        failed++;
        console.log("✗ No OG image found");
      }
    } catch (err) {
      failed++;
      console.log(`✗ Error: ${err.message}`);
    }

    // Small delay to be polite
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  fs.writeFileSync(jsonPath, JSON.stringify(restaurants, null, 2));
  console.log(`\nDone: ${updated} images found, ${failed} failed, ${skipped} skipped`);
}

main();
