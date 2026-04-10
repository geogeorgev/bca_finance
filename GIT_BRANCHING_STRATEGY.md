# Git Branching Strategy - BCA Finance

**Date**: April 9, 2026  
**Setup**: Main as stable base, Dev for new features  
**Status**: ✅ CONFIGURED

---

## Branch Structure

### Main Branch (Stable Base)
- **URL**: `https://geogeorgev.github.io/bca_finance/`
- **Current Version**: Without URL routing (clean, stable)
- **Purpose**: Production-ready, stable base version
- **Deploy To**: GitHub Pages (main domain)
- **Status**: ✅ Clean and stable

### Dev Branch (New Features)
- **URL**: Deploy separately (subdomain or test site)
- **Current Version**: With URL routing (new features)
- **Purpose**: Development, testing new features
- **Commits**: All new feature development
- **Status**: ✅ Ready with URL routing

---

## Current Status

```
Main Branch:
  ✅ Clean (no uncommitted changes)
  ✅ Stable (original working version)
  ✅ Last commit: 7bd06b8

Dev Branch:
  ✅ Contains URL routing changes
  ✅ Last commit: bcf7d5f "feat: Add professional URL routing..."
  ✅ Ready for deployment
```

---

## How to Switch Between Branches

### Switch to Main (Stable Version)
```bash
git checkout main
```

### Switch to Dev (New Features)
```bash
git checkout dev
```

### Check Current Branch
```bash
git branch
```

### View All Branches
```bash
git branch -a
```

---

## Workflow Examples

### Working on Dev (New Features)

```bash
# 1. Switch to dev
git checkout dev

# 2. Make changes
# ... edit files ...

# 3. Stage and commit
git add .
git commit -m "feat: describe your changes"

# 4. Push to GitHub
git push origin dev
```

### Back to Main (Stable)

```bash
# Switch to main
git checkout main

# View the stable version without routing
# Main still has all other features but no URL routing
```

### Merge Dev to Main (When Ready)

```bash
# 1. Switch to main
git checkout main

# 2. Merge dev into main
git merge dev

# 3. Push to GitHub
git push origin main
```

---

## Deployment Strategy

### Current Setup

| Branch | Purpose | Deploy To | URL |
|--------|---------|-----------|-----|
| `main` | Stable version (no routing) | GitHub Pages Main | `https://geogeorgev.github.io/bca_finance/` |
| `dev` | New features (with routing) | GitHub Pages Dev | Need to configure |

### Option 1: Deploy Dev to Subdomain

GitHub Pages can deploy dev branch to:
```
https://dev.geogeorgev.github.io/bca_finance/
```

**Setup**:
1. Go to GitHub repo settings
2. Pages → Build and deployment
3. Add dev branch deployment
4. Access via dev subdomain

### Option 2: Deploy Dev to Subfolder

Deploy dev to subfolder:
```
https://geogeorgev.github.io/bca_finance-dev/
```

**Setup**:
1. Create separate repository: `bca_finance-dev`
2. Deploy dev branch there
3. Point DNS accordingly

### Option 3: Test Dev Locally

```bash
# Switch to dev
git checkout dev

# Run local server to test
# View on localhost before pushing
```

---

## Common Commands

### Check Which Branch You're On
```bash
git branch
```

### Push Dev to GitHub
```bash
git push origin dev
```

### Pull Latest Dev Changes
```bash
git pull origin dev
```

### View Commit History
```bash
git log --oneline
```

### View Differences Between Branches
```bash
git diff main dev
```

### Create Feature Branch from Dev
```bash
git checkout -b feature/my-feature dev
# Make changes
git push origin feature/my-feature
```

---

## Branch Comparison

### Main Branch (Current)
```
✅ Stable, working version
✅ No URL routing
✅ All other features working
✅ Production-ready
✅ Safe for daily use
❌ Doesn't show URLs in address bar
```

### Dev Branch (With Routing)
```
✅ Professional URL routing (#/page)
✅ Bookmarkable pages
✅ Browser history support
✅ Shareable links
⚠️ New feature (needs testing)
✅ All other features still work
```

---

## Switching Between Versions

### Use Stable Main
```bash
git checkout main
# See original working version
```

### Use Dev with Routing
```bash
git checkout dev
# See new URL routing feature
# Clear cache: Ctrl+Shift+Delete
# Refresh: Ctrl+F5
```

---

## Files in Each Branch

### Main Branch
```
index.html (original - no router)
js/login.js (original - no navigateTo)
MASTER_DOCUMENTATION.md (original)
```

### Dev Branch
```
index.html (updated - with router)
js/login.js (updated - with navigateTo)
MASTER_DOCUMENTATION.md (updated with routing)
URL_ROUTING_IMPLEMENTATION.md (new file)
```

---

## Future Workflow

### Adding More Features

```bash
# 1. Always work on dev
git checkout dev

# 2. Create feature branch (optional)
git checkout -b feature/new-feature

# 3. Make changes and commit
git add .
git commit -m "feat: describe feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. When done, merge back to dev
git checkout dev
git merge feature/new-feature

# 6. When ready for production, merge to main
git checkout main
git merge dev
git push origin main
```

---

## Safety Tips

### Never Push Directly to Main
```bash
# ❌ Don't do this
git push origin main

# ✅ Do this instead
git checkout dev
# make changes
git push origin dev
```

### Always Test Dev First
```bash
# Test on dev locally
git checkout dev
# Test features
# Commit when stable
git push origin dev

# Only merge to main when tested
```

### Create Backups
```bash
# Before major changes
git tag backup-before-feature
git push origin backup-before-feature
```

---

## Undoing Changes

### If You Accidentally Changed Main

```bash
# Go back to last commit
git reset --hard HEAD

# Verify you're on stable version
git log --oneline | head -5
```

### If You Need to Recover Deleted Changes

```bash
# See all past commits
git reflog

# Restore to specific commit
git reset --hard <commit-hash>
```

---

## GitHub Pages Deployment

### Deploy Main (Stable)
1. Push to main: `git push origin main`
2. GitHub automatically deploys to `https://geogeorgev.github.io/bca_finance/`

### Deploy Dev (Optional)
1. Configure GitHub Pages for dev branch
2. Access at configured URL (subdomain or separate site)

---

## Status Summary

```
✅ Main Branch: Stable, clean, no routing
✅ Dev Branch: Has URL routing, ready for testing
✅ Both branches synced with GitHub
✅ Ready for deployment strategy
```

---

## Next Steps

1. **Test Dev Locally**
   ```bash
   git checkout dev
   # Clear cache: Ctrl+Shift+Delete
   # Refresh: Ctrl+F5
   # Test URL routing
   ```

2. **Decide on Deployment**
   - Option A: Deploy dev to separate subdomain
   - Option B: Test dev locally, merge to main when ready
   - Option C: Keep dev and main separate for A/B testing

3. **Configure GitHub Pages**
   - If deploying both branches, set up dual deployment
   - Or use main as production, dev as staging

---

**Branch Setup**: ✅ COMPLETE  
**Workflow**: ✅ CONFIGURED  
**Ready**: ✅ YES

You now have a professional Git workflow with:
- Main as stable base
- Dev for new features  
- Ability to test and deploy separately

