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

## Deployment

- Any standard Next.js hosting works. Ensure `NEXT_PUBLIC_WEBHOOK_URL` is set in the hosting environment.
