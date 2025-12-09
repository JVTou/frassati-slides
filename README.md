# Frassati Slides

A collection of Reveal.js presentations for the Frassati group, with a centralized index page for easy navigation.

## 🚀 Quick Start

1. **View the main index**: Open `index.html` in your browser
2. **Browse presentations**: Click on any presentation card to view the slides
3. **Deploy to Netlify**: See `DEPLOYMENT.md` for detailed instructions

## 📁 Structure

```
frassati-slides/
├── index.html              # Main landing page with presentation links
├── netlify.toml           # Netlify deployment configuration
├── import-presentation.js # Script to import from Obsidian export
├── auto-import.js         # Script to auto-import all new presentations
├── .github/workflows/     # GitHub Actions for automatic imports
├── DEPLOYMENT.md          # Detailed deployment instructions
├── README.md              # This file
├── dist/                  # Shared Reveal.js library files
├── plugin/                # Shared Reveal.js plugins
├── css/                   # Shared CSS files (layout, themes)
└── September 2nd/         # Individual presentation folder
    ├── index.html         # Presentation slides
    └── Attachments/       # Presentation-specific assets
```

## ➕ Adding New Presentations

### Automatic Import (Recommended) ✨

**Presentations are automatically imported from your Obsidian-Vault repository!**

When you push new exports to your Obsidian-Vault repository's `export/` directory, a GitHub Action will:
- ✅ Automatically detect new date-named folders (e.g., "December 15th")
- ✅ Import them to frassati-slides
- ✅ Fix all paths to reference parent stylesheets
- ✅ Add them to the main index.html
- ✅ Commit and push the changes

The workflow runs every hour, or you can trigger it manually from the Actions tab.

**Setup:** See `.github/workflows/README.md` for detailed configuration instructions.

> **Note for Private Repositories:** If your Obsidian-Vault repository is private, you'll need to create a Personal Access Token and add it as a secret. See `.github/workflows/README.md` for step-by-step instructions.

### Manual Import (Local Development)

If you want to import locally before pushing:

1. Export your presentation from Obsidian. The export should create a folder named like "December 15th" inside: `C:\Users\mctou\OneDrive\Documents\GitHub\Obsidian-Vault\export`
2. Run the import script:
   ```bash
   node import-presentation.js "December 15th" "Weekly meeting updates"
   ```
   
   Or run auto-import to import all new presentations:
   ```bash
   node auto-import.js
   ```

### Manual Addition

1. Create your presentation folder with all necessary files
2. Edit `index.html` and add a new card above the template comment
3. Follow the existing card structure

## 🎨 Customization

- **Main page styling**: Edit the CSS in `index.html`
- **Shared CSS files**: Edit files in the root `css/` folder to affect all presentations
- **Reveal.js options**: Configure in each presentation's `index.html`
- **Reveal.js library**: Shared in the root `dist/` folder (update once, affects all)
- **Plugins**: Shared in the root `plugin/` folder (update once, affects all)

## 🌐 Deployment

The site is configured for easy deployment on Netlify. See `DEPLOYMENT.md` for complete instructions.

### Quick Deploy
1. Drag your entire workspace folder to Netlify
2. Your site will be live instantly
3. The main index page will be your homepage

## 🔧 Requirements

- Each presentation folder needs its own `index.html`
- Presentations use shared `dist/`, `plugin/`, and `css/` folders at the root level
- Presentation HTML files reference shared resources using `../dist/`, `../plugin/`, and `../css/` paths
- Presentations should use relative paths for assets
- The main `index.html` serves as the landing page

## 📱 Features

- **Responsive design**: Works on all devices
- **Modern UI**: Clean, professional appearance
- **Easy navigation**: One-click access to all presentations
- **Auto-updating**: Helper script keeps the index current
- **Netlify ready**: Optimized for static hosting

## 🤝 Contributing

1. Create your presentation folder
2. Use the helper script to add it to the index
3. Ensure all file paths are relative
4. Test locally before deploying

---

Built with ❤️ using Reveal.js and designed for the Frassati group.
