# Workspace Rules

## Server Hosting & URL Handling Rule
- Whenever the user asks for `hosturl`, `host url`, or requests the app URL:
  1. Always start/verify the Vite development server (`npm run dev`) as a background task.
  2. Ensure `http://localhost:5173/` is actively serving before returning the response.
  3. Never just print static URL strings without starting the background server process first.
## Automatic GitHub & Vercel Push Rule
- Every time any code changes or features are added/modified in the project:
  1. Automatically test/verify the build (`npm run build`).
  2. Commit and push the changes to GitHub (`git add .`, `git commit -m "..."`, `git push origin main`).
  3. Ensure Vercel auto-deploys the latest commit automatically without waiting for explicit user prompts.
