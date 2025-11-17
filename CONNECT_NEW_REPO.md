# 🔗 Connect to New Repository

Follow these steps to connect this clean framework to your new repo.

---

## 📋 **Prerequisites**

Make sure you've created your new repository on GitHub (empty, no README or .gitignore).

Example: `https://github.com/your-username/your-new-repo.git`

---

## 🔄 **Option 1: Fresh Start (Recommended)**

Complete fresh Git initialization:

```bash
cd /home/neetu/Documents/AM-I_UI/automation_typescript_playwright

# 1. Remove old Git history
rm -rf .git

# 2. Initialize fresh Git
git init

# 3. Add all files
git add .

# 4. Create first commit
git commit -m "Initial commit: Clean Playwright-Cucumber automation framework

- Working login test example (2-step flow)
- Beginner-friendly documentation
- Secure configuration management
- Simplified, maintainable code
- Ready for team collaboration"

# 5. Rename branch to main (if needed)
git branch -M main

# 6. Add your NEW repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-NEW-REPO.git

# 7. Push to new repo
git push -u origin main
```

---

## 🔄 **Option 2: Change Remote Only**

Keep Git history but change remote:

```bash
cd /home/neetu/Documents/AM-I_UI/automation_typescript_playwright

# 1. Remove old remote
git remote remove origin

# 2. Add NEW remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-NEW-REPO.git

# 3. Stage all changes
git add .

# 4. Commit
git commit -m "Clean framework: Simplified code and documentation"

# 5. Push to new repo
git push -u origin main
```

---

## ✅ **Verify Connection**

After pushing:

```bash
# Check remote is correct
git remote -v

# Should show your NEW repo URL:
# origin  https://github.com/YOUR-USERNAME/YOUR-NEW-REPO.git (fetch)
# origin  https://github.com/YOUR-USERNAME/YOUR-NEW-REPO.git (push)
```

---

## 🎯 **What Will Be Pushed**

### ✅ **Will be pushed:**

- All source code (`src/`)
- Feature files (`features/`)
- Documentation (`*.md`)
- Config template (`dev.json.example`)
- Configuration files (`.gitignore`, `tsconfig.json`, etc.)

### ❌ **Will NOT be pushed:**

- Your credentials (`config/environments/*.json` - in .gitignore)
- `node_modules/` (in .gitignore)
- Test reports (`reports/` - in .gitignore)
- Screenshots (in .gitignore)

---

## 📧 **After Pushing**

1. **Verify on GitHub:**

   - Go to your new repo URL
   - Check files are there
   - Verify no credentials visible

2. **Share with team:**

   - Send repo URL
   - Point to `SETUP.md`
   - Share test credentials securely (not in Git!)

3. **Clean up this file:**
   ```bash
   rm CONNECT_NEW_REPO.md
   ```

---

## 🆘 **Troubleshooting**

**Error: "remote origin already exists"**

```bash
git remote remove origin
git remote add origin <your-new-repo-url>
```

**Error: "failed to push"**

```bash
# If new repo has README, pull first
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**Want to see what will be committed?**

```bash
git status
git diff --cached
```

---

**Ready? Follow the steps above and your clean framework will be in the new repo! 🚀**
