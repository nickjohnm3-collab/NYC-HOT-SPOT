const fs = require("fs");

// Parse GitHub issue form body into structured data
function parseIssueBody(body) {
  const data = {};
  const lines = body.split("\n");
  let currentLabel = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Form fields appear as ### Label followed by the value
    if (trimmed.startsWith("### ")) {
      currentLabel = trimmed.slice(4).trim();
    } else if (currentLabel && trimmed && trimmed !== "_No response_") {
      data[currentLabel] = trimmed;
      currentLabel = null;
    }
  }
  return data;
}

function main() {
  const issueBody = process.env.ISSUE_BODY;
  if (!issueBody) {
    console.error("ISSUE_BODY environment variable not set");
    process.exit(1);
  }

  const parsed = parseIssueBody(issueBody);
  console.log("Parsed fields:", JSON.stringify(parsed, null, 2));

  // Validate required fields
  const name = parsed["Restaurant Name"];
  const status = parsed["Status"];
  const neighborhood = parsed["Neighborhood"];
  const cuisine = parsed["Cuisine"];
  const priceRaw = parsed["Price Level"];
  const address = parsed["Address"];
  const opened = parsed["Opened Date (or expected)"];
  const vibe = parsed["Vibe"];
  const chef = parsed["Chef / Description"];

  if (!name || !neighborhood || !cuisine || !priceRaw || !chef) {
    console.error("Missing required fields");
    process.exit(1);
  }

  // Load existing data
  const jsonPath = "src/restaurants.json";
  const restaurants = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  // Generate next ID
  const maxId = Math.max(...restaurants.map((r) => r.id));
  const newId = maxId + 1;

  // Parse price from dropdown
  const price = parseInt(priceRaw.charAt(0)) || 2;

  // Parse meal periods
  const mealPeriodsRaw = parsed["Meal Periods (comma-separated)"] || "Dinner";
  const mealPeriods = mealPeriodsRaw.split(",").map((s) => s.trim()).filter(Boolean);

  // Build booking links
  const bookingLinks = [];
  const resyUrl = parsed["Resy URL (optional)"];
  if (resyUrl && resyUrl !== "_No response_") {
    bookingLinks.push({ name: "Resy", url: resyUrl });
  }
  bookingLinks.push({
    name: "Google",
    url: `https://www.google.com/search?q=${encodeURIComponent(name + " NYC reservation")}`,
  });

  // Build the restaurant entry
  const entry = {
    id: newId,
    name,
    neighborhood,
    cuisine,
    price,
    difficulty: Math.min(price + 1, 5),
    opened: opened || "",
    status: status || "open",
    address: address || neighborhood,
    vibe: vibe || "",
    isBar: (parsed["Is this primarily a bar?"] || "No") === "Yes",
    reservation: parsed["Reservation Info"] || "Walk-in Friendly",
    dressCode: parsed["Dress Code"] || "Casual",
    mealPeriods,
    homepage: parsed["Website URL"] || `https://www.google.com/search?q=${encodeURIComponent(name + " NYC")}`,
    chef: chef || "",
    bookingLinks,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    lastVerified: new Date().toISOString().split("T")[0],
  };

  // Add openedDate for open restaurants
  if (status === "open" && opened) {
    const d = new Date(opened);
    if (!isNaN(d.getTime())) {
      entry.openedDate = d.toISOString().split("T")[0];
    }
  }

  // Add opening month for coming_soon
  if (status === "coming_soon") {
    const openingMonth = parsed["Opening Month (coming soon only)"] || opened;
    if (openingMonth) {
      entry.openingMonth = openingMonth;
      entry.timelineProgress = 0.4;
    }
  }

  restaurants.push(entry);
  fs.writeFileSync(jsonPath, JSON.stringify(restaurants, null, 2));

  console.log(`Added restaurant: ${name} (id: ${newId})`);
  console.log(JSON.stringify(entry, null, 2));
}

main();
