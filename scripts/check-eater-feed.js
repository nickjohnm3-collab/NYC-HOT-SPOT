const https = require("https");
const http = require("http");
const fs = require("fs");

// Feed sources to monitor
// NOTE: Time Out New York has no public RSS feed — cannot be automated
const FEEDS = [
  { name: "Eater NY", url: "https://ny.eater.com/rss/index.xml", format: "atom" },
  { name: "Grub Street", url: "https://feeds.feedburner.com/nymag/grubstreet", format: "rss" },
  { name: "Resy (New on Resy)", url: "https://blog.resy.com/category/new-on-resy/feed/", format: "rss" },
  { name: "Gothamist Food", url: "https://gothamist.com/food/feed", format: "rss" },
  { name: "The Infatuation NYC", url: "https://www.theinfatuation.com/new-york/feed", format: "rss" },
  { name: "NY Post Dining", url: "https://nypost.com/tag/restaurants/feed/", format: "rss" },
];

// Keywords that signal a restaurant opening article
const OPENING_KEYWORDS = [
  "opening", "opens", "opened", "debut", "debuted", "debuts",
  "coming soon", "anticipated", "first look", "new restaurant",
  "new bar", "now open", "just opened", "coming to",
];

// Path to track already-seen articles
const SEEN_FILE = ".github/seen-articles.json";

function fetchFeed(url) {
  return new Promise((resolve, reject) => {
    const follow = (u, depth = 0) => {
      if (depth > 5) return reject(new Error("Too many redirects"));
      const client = u.startsWith("https") ? https : http;
      client.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return follow(res.headers.location, depth + 1);
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }).on("error", reject);
    };
    follow(url);
  });
}

function parseItems(xml, format) {
  const items = [];
  if (format === "atom") {
    // Atom feed format (Eater NY)
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const block = match[1];
      const title = (block.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]>/) || block.match(/<title[^>]*>(.*?)<\/title>/) || [])[1] || "";
      const link = (block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]*)"/) || [])[1] || "";
      const pubDate = (block.match(/<published>(.*?)<\/published>/) || block.match(/<updated>(.*?)<\/updated>/) || [])[1] || "";
      const description = (block.match(/<summary[^>]*><!\[CDATA\[(.*?)\]\]>/) || block.match(/<summary[^>]*>(.*?)<\/summary>/) || [])[1] || "";
      const category = (block.match(/<category[^>]*term="([^"]*)"/) || [])[1] || "";
      items.push({ title, link, pubDate, description, category });
    }
  } else {
    // RSS 2.0 format (Grub Street)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]>/) || block.match(/<title>(.*?)<\/title>/) || [])[1] || "";
      const link = (block.match(/<link>(.*?)<\/link>/) || [])[1] || "";
      const pubDate = (block.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
      const description = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>/) || block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || "";
      const categories = [];
      const catRegex = /<category>(.*?)<\/category>/g;
      let cm;
      while ((cm = catRegex.exec(block)) !== null) categories.push(cm[1]);
      items.push({ title, link, pubDate, description, category: categories.join(", ") });
    }
  }
  return items;
}

function isOpeningArticle(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return OPENING_KEYWORDS.some((kw) => text.includes(kw));
}

function loadSeen() {
  try {
    return JSON.parse(fs.readFileSync(SEEN_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveSeen(seen) {
  fs.mkdirSync(".github", { recursive: true });
  fs.writeFileSync(SEEN_FILE, JSON.stringify(seen, null, 2));
}

function setOutput(name, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `${name}=${value}\n`);
  } else {
    // Fallback for local testing
    console.log(`Output: ${name}=${value}`);
  }
}

async function main() {
  const seen = loadSeen();
  let allNewItems = [];

  for (const feed of FEEDS) {
    console.log(`Fetching ${feed.name} feed...`);
    try {
      const xml = await fetchFeed(feed.url);
      const items = parseItems(xml, feed.format);
      console.log(`  ${items.length} total items from ${feed.name}`);

      const openingItems = items.filter(isOpeningArticle);
      console.log(`  ${openingItems.length} match opening keywords`);

      const newItems = openingItems.filter((item) => !seen.includes(item.link));
      console.log(`  ${newItems.length} are new (not seen before)`);

      newItems.forEach((item) => (item.source = feed.name));
      allNewItems.push(...newItems);
    } catch (err) {
      console.error(`  Error fetching ${feed.name}: ${err.message}`);
    }
  }

  console.log(`\nTotal new opening articles across all feeds: ${allNewItems.length}`);

  if (allNewItems.length === 0) {
    console.log("No new opening articles found.");
    setOutput("has_new", "false");
    return;
  }

  // Build issue body
  let body = "## New NYC Restaurant Opening Articles\n\n";
  body += `Found **${allNewItems.length}** new article(s) about NYC restaurant openings:\n\n`;

  // Group by source
  for (const feed of FEEDS) {
    const items = allNewItems.filter((i) => i.source === feed.name);
    if (items.length === 0) continue;
    body += `### 📰 ${feed.name}\n\n`;
    for (const item of items) {
      const date = item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-US") : "Unknown date";
      body += `#### [${item.title}](${item.link})\n`;
      body += `**Published:** ${date}\n\n`;
      const desc = item.description.replace(/<[^>]*>/g, "").slice(0, 300);
      if (desc) body += `> ${desc}...\n\n`;
      body += "---\n\n";
    }
  }

  body += "\n**Action needed:** Review these articles and add any noteworthy restaurants to `src/App.jsx`.\n";
  body += "\n*Sources monitored daily: Eater NY, Grub Street (NY Mag), Resy (New on Resy), Gothamist Food, The Infatuation NYC, NY Post Dining. Time Out NY has no RSS feed.*\n";

  // Write issue body to file for the GitHub Action to use
  fs.writeFileSync("/tmp/issue-body.md", body);
  console.log("Issue body written to /tmp/issue-body.md");

  // Mark as seen
  const updatedSeen = [...seen, ...allNewItems.map((i) => i.link)];
  saveSeen(updatedSeen);
  console.log(`Updated seen list (${updatedSeen.length} total)`);

  // Output for GitHub Actions
  setOutput("has_new", "true");
  setOutput("count", String(allNewItems.length));
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
