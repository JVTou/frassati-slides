# GitHub Actions Workflows

## Auto-Import Presentations

This workflow automatically imports new presentations from your Obsidian-Vault repository whenever they're exported.

### Quick Setup Guide

**For immediate imports on push:**
1. See [Trigger on Push to Obsidian-Vault](#trigger-on-push-to-obsidian-vault-immediate-import) section below
2. Add the workflow to your Obsidian-Vault repository
3. Set up the required secrets

**For scheduled imports:**
- The workflow no longer runs on a schedule. It only runs when triggered manually or via push to Obsidian-Vault.

**For private repositories:**
- See [For Private Repositories](#for-private-repositories-step-by-step) section below

### Setup Instructions

#### For Public Repositories

1. **If Obsidian-Vault is in the same GitHub organization/user:**
   - No additional setup needed! The workflow will automatically find it.

2. **If Obsidian-Vault is in a different repository:**
   - Go to your **frassati-slides** repository Settings → Secrets and variables → Actions
   - Add a new secret named `OBSIDIAN_VAULT_REPO` with the value: `username/Obsidian-Vault` (or your actual repo name)

#### For Private Repositories (Step-by-Step)

If your Obsidian-Vault repository is **private**, you need to create a Personal Access Token (PAT) and add it as a secret:

**Step 1: Create a Personal Access Token (PAT)**

1. Go to GitHub.com and click your profile picture (top right) → **Settings**
2. Scroll down to **Developer settings** (bottom left sidebar)
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token** → **Generate new token (classic)**
5. Give it a name like: `frassati-slides-auto-import`
6. Set an expiration (or leave as "No expiration" if you prefer)
7. Select the following scopes:
   - ✅ **repo** (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
8. Click **Generate token**
9. **IMPORTANT:** Copy the token immediately (you won't be able to see it again!)
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Step 2: Add the Token as a Secret**

1. Go to your **frassati-slides** repository on GitHub
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Name: `OBSIDIAN_VAULT_TOKEN`
6. Value: Paste the Personal Access Token you copied in Step 1
7. Click **Add secret**

**Step 3: Set the Repository Name (if different)**

1. Still in **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `OBSIDIAN_VAULT_REPO`
4. Value: `your-username/Obsidian-Vault` (replace with your actual username and repo name)
5. Click **Add secret**

**Step 4: Verify Setup**

1. Go to the **Actions** tab in your frassati-slides repository
2. Click **Auto-Import Presentations** in the left sidebar
3. Click **Run workflow** → **Run workflow** (green button)
4. Wait a few moments, then check if the workflow runs successfully
5. If it fails, check the logs to see what went wrong

### Trigger on Push to Obsidian-Vault (Immediate Import)

To trigger the import **immediately** when you push to Obsidian-Vault (instead of waiting for the hourly schedule), set up a workflow in your Obsidian-Vault repository:

**Step 1: Create the Workflow in Obsidian-Vault**

1. In your **Obsidian-Vault** repository, create the directory `.github/workflows/` if it doesn't exist
2. Create a new file: `.github/workflows/trigger-frassati-import.yml`
3. Copy the contents from `frassati-slides/.github/workflows/trigger-frassati-import.yml.example` (or use the template below)

**Step 2: Create a Personal Access Token for Obsidian-Vault**

You need a token that can trigger workflows in the frassati-slides repository:

1. Go to GitHub.com → Your profile → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name it: `trigger-frassati-import`
4. Select scope: ✅ **repo** (Full control of private repositories)
5. Click **Generate token** and **copy it**

**Step 3: Add Secrets to Obsidian-Vault Repository**

1. Go to your **Obsidian-Vault** repository → **Settings** → **Secrets and variables** → **Actions**
2. Add secret `FRASSATI_SLIDES_TOKEN`:
   - Name: `FRASSATI_SLIDES_TOKEN`
   - Value: The Personal Access Token you just created
3. Add secret `FRASSATI_SLIDES_REPO`:
   - Name: `FRASSATI_SLIDES_REPO`
   - Value: `your-username/frassati-slides` (replace with your actual username and repo name)

**Step 4: Copy the Workflow File**

Copy this workflow to your Obsidian-Vault repository at `.github/workflows/trigger-frassati-import.yml`:

```yaml
name: Trigger Frassati Slides Import

on:
  push:
    paths:
      - 'export/**'  # Only trigger when export directory changes

jobs:
  trigger-import:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger frassati-slides import
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.FRASSATI_SLIDES_TOKEN }}
          repository: ${{ secrets.FRASSATI_SLIDES_REPO }}
          event-type: obsidian-export-updated
          client-payload: |
            {
              "ref": "${{ github.ref }}",
              "sha": "${{ github.sha }}",
              "message": "${{ github.event.head_commit.message }}"
            }
```

**Step 5: Test It**

1. Make a change in your Obsidian-Vault `export/` directory
2. Commit and push the changes
3. Check the Actions tab in **Obsidian-Vault** - you should see "Trigger Frassati Slides Import" run
4. Check the Actions tab in **frassati-slides** - you should see "Auto-Import Presentations" triggered automatically

**How It Works:**

- When you push changes to `export/` in Obsidian-Vault, the workflow triggers
- It sends a `repository_dispatch` event to frassati-slides
- The frassati-slides workflow receives the event and runs the import immediately
- No more waiting for the hourly schedule! 🎉

### How It Works

- **On Push (if configured):** When you push to Obsidian-Vault's `export/` directory, it triggers immediately
- **Manual:** You can also trigger it manually from the Actions tab
- It checks the `export/` directory in Obsidian-Vault for new date-named folders
- Any folders that don't exist in frassati-slides are automatically imported
- Changes are committed and pushed automatically

### Manual Trigger

You can also trigger the workflow manually:
1. Go to the **Actions** tab in your repository
2. Select **"Auto-Import Presentations"** in the left sidebar
3. Click **"Run workflow"** dropdown → **"Run workflow"** (green button)

### Troubleshooting

**Problem: Workflow fails with "Repository not found" or "Permission denied"**

- ✅ Make sure you've added the `OBSIDIAN_VAULT_TOKEN` secret (for private repos)
- ✅ Make sure you've added the `OBSIDIAN_VAULT_REPO` secret with the correct format: `username/repo-name`
- ✅ Verify the Personal Access Token has the `repo` scope enabled
- ✅ Make sure the token hasn't expired

**Problem: Workflow runs but finds no new presentations**

- ✅ Check that your Obsidian-Vault repository has been pushed to GitHub
- ✅ Verify the export folder structure: `export/December 15th/index.html` (with date-named folders)
- ✅ Check the workflow logs to see what folders it found

**Problem: Workflow runs but commits fail**

- ✅ Make sure the workflow has write permissions:
  - Go to **Settings** → **Actions** → **General**
  - Under **Workflow permissions**, select **"Read and write permissions"**
  - Check **"Allow GitHub Actions to create and approve pull requests"**
  - Click **Save**

**Problem: Push trigger not working**

- ✅ Make sure you've added the workflow file to Obsidian-Vault: `.github/workflows/trigger-frassati-import.yml`
- ✅ Verify the secrets are set in Obsidian-Vault: `FRASSATI_SLIDES_TOKEN` and `FRASSATI_SLIDES_REPO`
- ✅ Check that the token has the `repo` scope
- ✅ Make sure you're pushing to the `export/` directory (the workflow only triggers on changes to `export/**`)
- ✅ Check the Actions tab in Obsidian-Vault to see if the trigger workflow ran
- ✅ Check the Actions tab in frassati-slides to see if it received the dispatch event

**Problem: I want to test locally first**

You can test the import locally before relying on GitHub Actions:
```bash
# Set the export directory (adjust path as needed)
export OBSIDIAN_EXPORT_DIR="/path/to/Obsidian-Vault/export"

# Run auto-import
node auto-import.js
```

