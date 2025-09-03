# Deploying to Netlify

This Reveal.js presentation can be deployed to Netlify in several ways:

## Option 1: Drag & Drop (Quickest)

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag your entire workspace folder (containing the main index.html and all presentation folders) to the Netlify dashboard
3. Wait for deployment to complete
4. Your site will be live at a random URL (e.g., `https://amazing-name-123456.netlify.app`)
5. You can customize the URL in Site Settings > Domain Management

## Option 2: Git-based Deployment (Recommended)

### Prerequisites
- Git repository (GitHub, GitLab, or Bitbucket)
- Netlify account

### Steps
1. Push your code to a Git repository
2. In Netlify dashboard, click "New site from Git"
3. Choose your repository
4. Set build settings:
   - Build command: (leave empty)
   - Publish directory: `.` (root directory)
5. Click "Deploy site"

### Automatic Deployments
- Every push to your main branch will trigger a new deployment
- You can set up branch deployments for previews

## Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --dir="." --prod
```

## Custom Domain

1. Go to Site Settings > Domain Management
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

- **404 errors**: The `netlify.toml` file includes redirects to handle client-side routing
- **Assets not loading**: Ensure all file paths in your HTML are relative
- **Build failures**: Check that the root directory contains all necessary files including the main index.html

## Managing Presentations

### Adding New Presentations

1. Create a new folder for your presentation (e.g., `October-meeting/`)
2. Add your `index.html` and other files to that folder
3. Use the helper script to add it to the main index:
   ```bash
   node add-presentation.js "October Meeting" "Monthly updates and announcements" "October-meeting"
   ```

### File Structure
```
your-workspace/
├── index.html (main landing page)
├── netlify.toml
├── add-presentation.js
├── September 2nd/
│   ├── index.html (presentation)
│   ├── css/
│   ├── dist/
│   └── ...
└── October-meeting/
    ├── index.html (presentation)
    ├── css/
    └── ...
```

## Performance Tips

- Your site is already optimized with minified CSS/JS files
- Netlify automatically serves assets with proper caching headers
- Consider enabling Netlify's image optimization features if you add more images
