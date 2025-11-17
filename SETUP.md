# 🚀 Setup Guide for New Team Members

Welcome to the team! This guide will help you get the test automation framework up and running on your machine.

---

## ✅ Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 16 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/
- **Git** (for cloning the repository)
  - Check: `git --version`
  - Download: https://git-scm.com/
- **Code Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com/

---

## 📥 Step 1: Clone the Repository

```bash
# Clone the repo
git clone <repository-url>

# Navigate to the project
cd automation_typescript_playwright
```

---

## 📦 Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# Install Playwright browsers (required!)
npm run playwright:install
```

**Note:** This might take a few minutes. The Playwright install downloads Chrome, Firefox, and Safari browsers.

---

## 🔧 Step 3: Setup Configuration

### Create Your Config File

```bash
# Copy the example config
cp config/environments/dev.json.example config/environments/dev.json
```

### Edit Your Config

Open `config/environments/dev.json` and update with your credentials:

```json
{
  "name": "development",
  "baseUrl": "https://your-app-url.com",
  "loginUrl": "https://your-app-url.com/login",
  "apiBaseUrl": "https://your-api-url.com/",
  "auth": {
    "username": "your_username",      ← Update this
    "password": "your_password",      ← Update this
    "language": "English"
  },
  "features": {
    "enableMocking": true,
    "enableReporting": true,
    "enableScreenshots": true,
    "enableVideos": false
  },
  "timeouts": {
    "default": 30000,
    "navigation": 30000,
    "assertion": 5000
  },
  "browser": {
    "headless": false,
    "slowMo": 0,
    "devtools": false
  }
}
```

**Important:**

- ⚠️ Never commit your `dev.json` file to Git (it's already in `.gitignore`)
- ✅ Only commit the `.example` files
- 🔒 Keep your credentials safe!

---

## 🧪 Step 4: Run Your First Test

### Test with Visible Browser (Recommended for First Time)

```bash
HEADLESS=false npm run test:dev -- --tags @smoke
```

You should see:

- ✅ A browser window opens
- ✅ The test navigates to the login page
- ✅ Test logs in successfully
- ✅ Console shows "1 scenario (1 passed)"

### Test in Headless Mode (No Browser Window)

```bash
npm run test:dev -- --tags @smoke
```

---

## 📊 Step 5: View Test Reports

After running tests, you can view the results:

```bash
# Open HTML report
npm run report:open
```

This will open the test report in your default browser showing:

- Which tests passed/failed
- Screenshots (if any test failed)
- Execution time
- Error details

---

## 🎯 What to Do Next

### 1. **Read the Documentation**

- [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) - Learn how to write tests
- [CONTRIBUTING.md](CONTRIBUTING.md) - Learn how to contribute
- [README.md](README.md) - Project overview

### 2. **Explore the Code**

```
automation_typescript_playwright/
├── features/ui/login.feature      ← Start here! Read the test scenarios
├── src/pages/login.page.ts        ← See how pages are structured
├── src/steps/login.steps.ts       ← See how steps are implemented
└── config/environments/dev.json   ← Your local config
```

### 3. **Run All Tests**

```bash
# Run all tests
npm test

# Run specific tags
npm run test:dev -- --tags @smoke
npm run test:dev -- --tags @negative
npm run test:dev -- --tags @validation

# Run with Allure report
npm run test:allure
npm run report:allure
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:**

```bash
npm install
```

### Issue: "Browser executable not found"

**Solution:**

```bash
npm run playwright:install
```

### Issue: "Cannot read config file"

**Solution:**

```bash
# Make sure you created dev.json from the example
cp config/environments/dev.json.example config/environments/dev.json

# Edit it with your credentials
```

### Issue: Tests timeout or fail

**Solutions:**

1. **Check your internet connection**
2. **Increase timeout in config:**
   ```json
   "timeouts": {
     "default": 60000,    // Increase to 60 seconds
     "navigation": 60000
   }
   ```
3. **Run with visible browser to see what's happening:**
   ```bash
   HEADLESS=false npm run test:dev -- --tags @smoke
   ```

### Issue: "Port already in use" or "Address already in use"

**Solution:**

```bash
# Kill any running Playwright processes
pkill -f playwright

# Or restart your terminal
```

---

## 💡 Pro Tips

### Use VS Code Extensions

Install these for better experience:

- **Cucumber (Gherkin)** - Syntax highlighting for `.feature` files
- **Prettier** - Code formatting
- **ESLint** - Code quality checks

### Environment Variables

You can override config settings:

```bash
# Run in headless mode
HEADLESS=true npm run test:dev

# Use different browser
BROWSER=firefox npm run test:dev

# Change environment
NODE_ENV=staging npm run test
```

### Quick Commands Reference

```bash
# Run smoke tests (critical tests)
npm run test:dev -- --tags @smoke

# Run negative tests (error scenarios)
npm run test:dev -- --tags @negative

# Run with visible browser (for debugging)
HEADLESS=false npm run test:dev

# Run specific feature file
npm run test:dev features/ui/login.feature

# Run specific scenario by line number
npm run test:dev features/ui/login.feature:18
```

---

## ✅ Verification Checklist

Before you start working, make sure:

- [ ] Node.js is installed (`node --version` shows v16+)
- [ ] Dependencies are installed (`node_modules` folder exists)
- [ ] Playwright browsers are installed (`npm run playwright:install` completed)
- [ ] Config file is created (`config/environments/dev.json` exists)
- [ ] Config has your credentials (username, password updated)
- [ ] Smoke test passes (`npm run test:dev -- --tags @smoke` ✅)
- [ ] You can view reports (`npm run report:open` opens browser)

---

## 🤝 Need Help?

- **Check documentation:** [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)
- **Ask the team:** Create a GitHub issue or reach out on Slack
- **Common issues:** See Troubleshooting section above

---

## 🎉 You're Ready!

Congratulations! You now have:

- ✅ Framework installed and running
- ✅ Tests passing locally
- ✅ Configuration setup
- ✅ Knowledge of how to run tests

**Next steps:**

1. Read [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) to learn how to write tests
2. Study the existing login test in `features/ui/login.feature`
3. Try creating your own test!

Happy testing! 🚀
