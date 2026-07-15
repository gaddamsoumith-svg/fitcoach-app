# FitCoach — Deploy to the Real World

This is a ready-to-deploy project. It has already been installed and test-built successfully — you don't need Node.js, npm, or any coding tools on your own computer. You only need a free **GitHub** account and a free **Vercel** account.

## Step 1 — Put the code on GitHub

1. Go to [github.com](https://github.com) and sign up (free) if you don't have an account.
2. Click the **+** icon (top right) → **New repository**.
3. Name it `fitcoach-app`, keep it **Public** or **Private** (either works), click **Create repository**.
4. On the new repo page, click **uploading an existing file**.
5. Unzip the file you downloaded from this chat, then drag the **entire contents** of the folder (not the zip itself) into the GitHub upload box.
6. Scroll down, click **Commit changes**.

## Step 2 — Deploy it live with Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free) using your GitHub account — this connects them automatically.
2. Click **Add New... → Project**.
3. Find and select your `fitcoach-app` repository, click **Import**.
4. Vercel auto-detects it's a Vite project — leave all settings as default.
5. Click **Deploy**. Wait ~1 minute.
6. You'll get a live URL like `https://fitcoach-app-yourname.vercel.app` — this is your real, working web app, live on the internet.

## Step 3 — Install it on your iPhone like a real app

1. Open your live Vercel URL in **Safari** on your iPhone (must be Safari, not Chrome, for this to work).
2. Tap the **Share** icon (square with an arrow) at the bottom.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**.

You'll now have a FitCoach icon on your home screen. Opening it launches full-screen, with no browser bar — indistinguishable from a native app for daily use. It also works offline for the interface itself, since it's a PWA (Progressive Web App).

## Updating it later

Any time you want to change the app, edit the files in your GitHub repo (or ask Claude to give you an updated version of `src/App.jsx` to re-upload) — Vercel automatically rebuilds and redeploys within about a minute of any change to the repo, no extra steps needed.

## What this does *not* do (yet)

- No Apple Health / Watch / HealthKit sync — that's iOS-only and requires the native app path (Xcode or a cloud build service).
- No permanent account/cloud storage — data is currently kept in memory during your session. Ask Claude to wire up simple persistent storage if you want your logs to survive closing the app.
