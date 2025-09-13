# Next Redditor (Next.js + Chakra UI)

A Next.js web UI for the Reddit Trend Analyzer using Chakra UI. It preserves existing functionality:

- Form with Keywords and optional Subreddit
- Sends POST to your n8n webhook
- Parses array response shape `[ { success, timestamp, totalPosts, posts, summary } ]`
- Displays results grid and an analysis summary
- Light/Dark mode toggle

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment

Create `.env.local` in the project root with your n8n webhook URL:

```bash
NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-instance/webhook/reddit-analyze
```

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

- `pages/_app.js`: Chakra provider and theme setup
- `pages/index.js`: Main page (form, results, summary)

## Notes

- The webhook response from n8n may be wrapped in an array. The page normalizes with `const payload = Array.isArray(parsed) ? parsed[0] : parsed;`.
- Titles with HTML entities are decoded for display.
- Image links are previewed when the `url` ends with an image extension.

## Deployment (Vercel)

Deploying to Vercel is recommended.

1. Push this repo to GitHub.
2. Go to https://vercel.com and import the project.
3. In Vercel Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_WEBHOOK_URL` = `https://your-n8n-instance/webhook/reddit-analyze`
4. Build Command: `next build` (auto-detected).
5. Output: default Next.js (managed by Vercel). No extra config required.
6. Deploy.

Notes:
- GitHub Pages config was removed. If you still see `.github/workflows/deploy.yml`, it’s disabled; you can delete it safely.
- For local dev, keep `.env.local` with `NEXT_PUBLIC_WEBHOOK_URL`.
