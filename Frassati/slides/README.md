# Frassati Meeting Notes — slides.frassati.app

Index and slideshow viewer for the markdown meeting notes in `/Meeting Notes`.

## Commands

- **Build** (convert all Meeting Notes to HTML and generate the index):
  ```bash
  npm run build
  ```
- **Preview locally** (serve the built site at http://localhost:3000):
  ```bash
  npm run preview
  ```

## Deploy to slides.frassati.app

After running `npm run build`, deploy the contents of the **`dist/`** folder to your host (e.g. Netlify, Vercel, or any static host). Point the subdomain `slides.frassati.app` at that deployment.

- `dist/index.html` — index page with thumbnails
- `dist/manifest.json` — list of slide decks (used by the index)
- `dist/slides/*.html` — one Marp-rendered slideshow per meeting note

When you add or edit markdown files in `Meeting Notes`, run `npm run build` again and redeploy `dist/`.
