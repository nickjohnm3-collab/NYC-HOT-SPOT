# How to Deploy NYC Hot Spot to GitHub Pages

## One-time setup (do this once)

### Step 1 — Install Node.js
Download from https://nodejs.org (choose the LTS version) and install it.

### Step 2 — Create the GitHub repo
1. Go to github.com and sign in as nickjohnm3-collab
2. Click + → New repository
3. Name it exactly: nyc-hotspot
4. Set to Public
5. Do NOT check "Initialize with README"
6. Click Create repository

### Step 3 — Open Terminal (Mac) or Command Prompt (Windows)
On Mac: press Cmd+Space, type "Terminal", hit Enter
On Windows: press Win+R, type "cmd", hit Enter

### Step 4 — Navigate to this folder
Drag this folder into your Terminal window after typing "cd " (with a space), then hit Enter.
Or type:
  cd ~/Downloads/nyc-hotspot-deploy

### Step 5 — Run these commands one at a time:
  npm install
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/nickjohnm3-collab/nyc-hotspot.git
  git push -u origin main
  npm run deploy

### Step 6 — Enable GitHub Pages
1. Go to your repo on github.com
2. Click Settings → Pages
3. Under "Branch" select: gh-pages
4. Click Save

## Your app will be live at:
https://nickjohnm3-collab.github.io/nyc-hotspot

(Takes 1–2 minutes after deploy to go live)
