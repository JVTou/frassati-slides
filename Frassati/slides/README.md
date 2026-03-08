# Frassati Meeting Notes — slides.frassati.app

Index and slideshow viewer for the markdown meeting notes in `/Meeting Notes`. Slides are built with **reveal.js**. All images should be placed in the **`Attachments`** folder (at the workspace root); the build copies them into `dist/Attachments` and links them from the slides.

## Commands

- **Build** (convert all Meeting Notes to reveal.js HTML and generate the index):
  ```bash
  npm run build
  ```
- **Preview locally** (serve the built site at http://localhost:3000):
  ```bash
  npm run preview
  ```

## Deploy to slides.frassati.app

After running `npm run build`, deploy the contents of the **`dist/`** folder to your host (e.g. Netlify, Vercel, or any static host). Point the subdomain `slides.frassati.app` at that deployment.

- `dist/index.html` — index page (list of slide decks)
- `dist/manifest.json` — list of slide decks (used by the index)
- `dist/slides/*.html` — one reveal.js slideshow per meeting note
- `dist/Attachments/` — images used by the slides (copied from `Attachments`)

When you add or edit markdown files in `Meeting Notes` or add images to `Attachments`, run `npm run build` again and redeploy `dist/`.

### AI-generated card titles (Gemini)

Set `GEMINI_API_KEY` to generate short, descriptive card titles from each deck’s content with the Gemini API. Get a key at [Google AI Studio](https://aistudio.google.com/app/apikey). Default model is `gemini-3.1-flash-lite-preview`; override with `GEMINI_MODEL` if needed.

Without `GEMINI_API_KEY`, card titles use the first heading in each note.

```bash
GEMINI_API_KEY=... npm run build
```

On Netlify, add `GEMINI_API_KEY` in Site settings → Environment variables.
