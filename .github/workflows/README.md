# GitHub Actions Workflows

## Auto-Import Presentations

This workflow automatically imports new presentations from your Obsidian-Vault repository whenever they're exported.

### Setup Instructions

1. **If Obsidian-Vault is in the same GitHub organization/user:**
   - No additional setup needed! The workflow will automatically find it.

2. **If Obsidian-Vault is in a different repository:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add a new secret named `OBSIDIAN_VAULT_REPO` with the value: `username/Obsidian-Vault` (or your actual repo name)
   - If the repo is private, add `OBSIDIAN_VAULT_TOKEN` with a Personal Access Token that has access to that repo

3. **Optional: Set up webhook from Obsidian-Vault (for immediate imports)**
   - In your Obsidian-Vault repository, go to Settings → Webhooks
   - Add a webhook that triggers on push events
   - Payload URL: `https://api.github.com/repos/YOUR_USERNAME/frassati-slides/dispatches`
   - Content type: `application/json`
   - Secret: (optional, but recommended)
   - Events: Select "Just the push event"
   - Add this to your Obsidian-Vault repository as a GitHub Action or use a webhook service

### How It Works

- The workflow runs every hour automatically
- It checks the `export/` directory in Obsidian-Vault for new date-named folders
- Any folders that don't exist in frassati-slides are automatically imported
- Changes are committed and pushed automatically

### Manual Trigger

You can also trigger the workflow manually:
1. Go to the Actions tab in your repository
2. Select "Auto-Import Presentations"
3. Click "Run workflow"

