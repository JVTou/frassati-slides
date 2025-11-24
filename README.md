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
├── add-presentation.js    # Helper script to add new presentations
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

### Method 1: Using the Helper Script (Recommended)

1. Create a new folder for your presentation
2. Add your `index.html` and other files
3. Run the helper script:
   ```bash
   node add-presentation.js "Presentation Name" "Description" "folder-name"
   ```

### Method 2: Manual Addition

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
