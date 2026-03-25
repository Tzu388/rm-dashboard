# RM Morning Brief — Complete Setup Guide
# Works entirely from your phone. No laptop needed.
# Estimated time: 20–30 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU'LL SET UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GitHub account (free)          → hosts your dashboard files
2. Cloudflare account (free)      → fixes CORS, proxies APIs, fetches RSS
3. One edit to rm-dashboard.html  → paste your Worker URL
4. Bookmark on phone home screen  → open like an app every morning

Cost: $0. Forever.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — GITHUB (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1.1 — Create GitHub account
  → Open Safari/Chrome on your phone
  → Go to: github.com
  → Tap "Sign up"
  → Enter email, password, username
  → Verify your email

Step 1.2 — Create a new repository
  → Tap the "+" icon (top right) → "New repository"
  → Repository name: rm-dashboard
  → Set to PUBLIC (required for free GitHub Pages)
  → Tick "Add a README file"
  → Tap "Create repository"

Step 1.3 — Upload your files
  → You'll see your new repo page
  → Tap "Add file" → "Upload files"
  → Upload both files:
      • rm-dashboard.html
      • worker.js
  → Scroll down, tap "Commit changes"

Step 1.4 — Enable GitHub Pages
  → Tap "Settings" tab (in your repo)
  → Scroll to "Pages" in the left menu
  → Under "Source" → select "Deploy from a branch"
  → Branch: main  /  Folder: / (root)
  → Tap "Save"
  → Wait 2 minutes
  → Your dashboard will be live at:
      https://YOUR-USERNAME.github.io/rm-dashboard/rm-dashboard.html

  ✓ Bookmark this URL. But prices won't load yet — do Part 2 first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — CLOUDFLARE WORKER (10 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Worker is a small script that runs in Cloudflare's cloud.
It fetches Yahoo Finance, FX, and RSS feeds on your behalf,
bypassing the CORS restriction that blocked prices before.

Free tier: 100,000 requests/day — more than enough.

Step 2.1 — Create Cloudflare account
  → Go to: cloudflare.com
  → Tap "Sign up" → use your email
  → Verify email

Step 2.2 — Go to Workers
  → In the Cloudflare dashboard, tap the menu (☰)
  → Tap "Workers & Pages"
  → Tap "Create"
  → Tap "Create Worker"

Step 2.3 — Name your Worker
  → Name it: rm-proxy  (or anything you like)
  → Tap "Deploy" (deploys a placeholder first — that's fine)

Step 2.4 — Edit the Worker code
  → After deploying, tap "Edit code"
  → You'll see a code editor
  → DELETE all the existing code
  → Open the worker.js file you uploaded to GitHub
  → COPY all the code from worker.js
  → PASTE it into the Cloudflare editor
  → Tap "Save and deploy" (top right)

  ✓ Your Worker is now live! You'll see a URL like:
      https://rm-proxy.YOUR-SUBDOMAIN.workers.dev

  → Copy this URL — you'll need it in the next step.

  Quick test: Open that URL in your browser.
  You should see: {"status":"ok","service":"RM Dashboard Proxy"}
  If you see that — it's working perfectly! ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — CONNECT EVERYTHING (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now you need to tell the dashboard HTML where your Worker lives.

Step 3.1 — Edit the HTML file
  → Go back to your GitHub repository
  → Tap on "rm-dashboard.html"
  → Tap the pencil icon ✏ (Edit this file)
  → Use Ctrl+F or the browser's find function to search for:
        PROXY_BASE = ""
  → Change it to:
        PROXY_BASE = "https://rm-proxy.YOUR-SUBDOMAIN.workers.dev"
    
    (Use YOUR actual Worker URL from Step 2.4)
    
  Example of what it should look like:
        const PROXY_BASE = "https://rm-proxy.abc123.workers.dev";

  → Scroll down → tap "Commit changes"
  → Tap "Commit changes" again to confirm

Step 3.2 — Wait for GitHub Pages to update
  → Takes about 1–2 minutes to redeploy
  → Then open your dashboard URL:
        https://YOUR-USERNAME.github.io/rm-dashboard/rm-dashboard.html

  ✓ All prices should now load!
  ✓ FX rates will show
  ✓ Equities, Yields, Commodities, Crypto — all live
  ✓ News tab will show live RSS from Reuters, MAS, FT, Bloomberg

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4 — ADD TO HOME SCREEN (2 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On iPhone (Safari):
  → Open your dashboard URL in Safari
  → Tap the Share icon (box with arrow pointing up)
  → Scroll down → tap "Add to Home Screen"
  → Name it "RM Brief" → tap "Add"

On Android (Chrome):
  → Open your dashboard URL in Chrome
  → Tap the three dots menu (⋮)
  → Tap "Add to Home screen"
  → Tap "Add"

✓ It now opens like a native app, full screen, no browser bar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT WORKS WITHOUT THE PROXY (fallback)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Even without the proxy configured, these still work:
  ✓ Clock and market hours
  ✓ FOMC calendar and countdown
  ✓ All static institutional profiles (23 institutions)
  ✓ Add/drag-drop functionality
  ✓ News tab shows curated static sample stories

With proxy:
  ✓ Everything above, PLUS:
  ✓ All live prices (equities, FX, yields, commodities, crypto)
  ✓ Live RSS news from Reuters, MAS, FT, Bloomberg
  ✓ Auto-refresh every 60 seconds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: Prices still show "—" after setup
  → Check the PROXY_BASE URL has no trailing slash
  → Make sure it starts with https://
  → Open the Worker URL directly — should show {"status":"ok"}
  → Hard-refresh the dashboard: hold Shift + reload

Problem: GitHub Pages shows 404
  → Wait 5 minutes after enabling Pages
  → Check the URL format exactly as shown above
  → Make sure the repository is set to "Public"

Problem: Worker shows "Domain not allowed" error
  → This means the API being fetched isn't in the whitelist
  → It's a security feature — contact support to add new domains

Problem: News tab shows no articles
  → Reuters/FT/Bloomberg may block some regions
  → MAS feed is always reliable
  → Try adding a different RSS URL via the "+" button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIONAL UPGRADES (later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add Anthropic API key (for AI news summaries + profile generation):
  → Get a key at: console.anthropic.com (~$5 credit to start)
  → Add this line at the top of rm-dashboard.html:
        const ANTHROPIC_KEY = "sk-ant-YOUR-KEY-HERE";
  → AI news briefings cost ~$0.01 per load

Add Financial Modeling Prep (more reliable stock data):
  → Free tier at: financialmodelingprep.com (250 req/day)
  → Reduces dependency on Yahoo Finance proxy

Custom domain (e.g. rm.yourdomain.com):
  → In GitHub Pages settings → add custom domain
  → In Cloudflare DNS → point CNAME to github.io
  → Completely free

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA SOURCES USED (all free)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prices:      Yahoo Finance (delayed ~15min, free, no key needed)
FX:          Yahoo Finance (=X suffix pairs)
Crypto:      Yahoo Finance (BTC-USD, ETH-USD, etc.)
Yields:      Yahoo Finance (^TNX, ^FVX, ^TYX, etc.)
Commodities: Yahoo Finance (GC=F gold, BZ=F oil, SI=F silver)
News:        Reuters RSS · MAS RSS · FT RSS · Bloomberg RSS
FOMC Dates:  Hardcoded official calendar (published years ahead)
Profiles:    Static curated data (23 institutions, always available)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR URLS (fill in after setup)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub repo:      https://github.com/___________/rm-dashboard
Dashboard URL:    https://___________github.io/rm-dashboard/rm-dashboard.html
Worker URL:       https://rm-proxy.___________.workers.dev
