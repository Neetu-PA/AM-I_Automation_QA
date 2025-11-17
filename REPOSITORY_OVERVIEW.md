# 📦 Repository Overview

Welcome to the **Playwright-Cucumber Test Automation Framework**!

This document provides a quick overview of the repository structure and how to get started.

---

## 📚 Documentation

Your teammates should read these files in order:

1. **[README.md](README.md)** - Project overview and quick start
2. **[SETUP.md](SETUP.md)** - Complete setup instructions (start here!)
3. **[BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)** - How to write tests
4. **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

---

## 🏗️ Repository Structure

```
automation_typescript_playwright/
│
├── 📚 Documentation
│   ├── README.md              # Project overview
│   ├── SETUP.md               # Setup guide
│   ├── BEGINNER_GUIDE.md      # Learning guide
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── REPOSITORY_OVERVIEW.md # This file
│
├── ⚙️ Configuration
│   ├── config/environments/
│   │   ├── dev.json.example  # Template (copy this!)
│   │   ├── dev.json          # Your local config (not in Git)
│   │   ├── staging.json      # Staging config (not in Git)
│   │   └── prod.json         # Prod config (not in Git)
│   ├── cucumber.mjs          # Cucumber settings
│   ├── playwright.config.ts  # Playwright settings
│   ├── tsconfig.json         # TypeScript settings
│   └── env.example           # Environment variables template
│
├── 🧪 Tests
│   └── features/ui/
│       └── login.feature     # Example: Login test scenarios
│
├── 💻 Source Code
│   ├── src/pages/            # Page Object Models
│   │   ├── login.page.ts     # Login page actions
│   │   └── home.page.ts      # Home page actions
│   ├── src/steps/            # Step Definitions
│   │   ├── login.steps.ts    # Login step implementations
│   │   ├── common.steps.ts   # Common reusable steps
│   │   └── playwright.steps.ts # Additional steps
│   ├── src/support/          # Framework Setup
│   │   ├── common-hooks.ts   # Before/After test hooks
│   │   ├── config.ts         # Load configurations
│   │   ├── world.ts          # Cucumber context
│   │   └── reporters/        # Test reporters
│   └── src/utils/            # Helper Functions
│       ├── actions.ts        # Common actions
│       ├── Wait.ts           # Wait utilities
│       └── helpers/logger.ts # Logging utility
│
├── 📊 Generated (Not in Git)
│   ├── reports/              # Test reports
│   ├── screenshots/          # Test screenshots
│   └── node_modules/         # Dependencies
│
└── 🔧 Other
    ├── package.json          # Dependencies & scripts
    ├── .gitignore            # Protected files
    └── LICENSE               # MIT License
```

---

## 🚀 Quick Start for New Team Members

```bash
# 1. Clone
git clone <repository-url>
cd automation_typescript_playwright

# 2. Install
npm install
npm run playwright:install

# 3. Setup Config
cp config/environments/dev.json.example config/environments/dev.json
# Edit dev.json with your credentials

# 4. Run Tests
npm run test:dev -- --tags @smoke
```

**Full instructions:** See [SETUP.md](SETUP.md)

---

## 🎯 What's Included

### ✅ Working Example Test
- **Feature:** User login (two-step flow)
- **Scenarios:** 
  - Successful login (@smoke)
  - Failed login (@negative)
  - Validation tests (@validation)
- **Location:** `features/ui/login.feature`

### ✅ Page Objects
- `LoginPage` - Login page elements and actions
- `HomePage` - Home page elements and actions

### ✅ Configuration
- Multi-environment support (dev, staging, prod)
- Secure credential management
- All settings in JSON files

### ✅ Reporting
- HTML reports
- Allure reports
- JSON reports
- Screenshots on failure

---

## 📦 Available NPM Scripts

```bash
# Testing
npm test                    # Run all tests
npm run test:dev           # Run in dev environment
npm run test:staging       # Run in staging
npm run test:prod          # Run in production

# With Options
npm run test:headed        # Run with visible browser
npm run test:smoke         # Run smoke tests only
npm run test:parallel      # Run tests in parallel

# Reporting
npm run report:open        # Open HTML report
npm run test:allure        # Run with Allure
npm run report:allure      # Generate Allure report

# Development
npm run lint              # Check code quality
npm run format            # Format code
npm run clean             # Remove generated files
```

---

## 🔒 Security & Git

### Protected Files (Not in Git)

These files contain sensitive data and are **ignored by Git**:

```
config/environments/dev.json       # Your credentials
config/environments/staging.json   # Staging credentials
config/environments/prod.json      # Production credentials
.env                              # Environment variables
reports/                          # Test reports
screenshots/                      # Screenshots
node_modules/                     # Dependencies
```

### Safe to Commit

```
config/environments/dev.json.example  # Template with dummy data
src/                                 # All source code
features/                            # Feature files
*.md                                 # Documentation
```

---

## 🎓 Learning Path

### For Beginners

1. **Setup** → [SETUP.md](SETUP.md)
   - Get the framework running
   - Understand the structure

2. **Study the Example** → `features/ui/login.feature`
   - See how tests are written
   - Run the test and observe

3. **Learn** → [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)
   - Understand concepts
   - Learn to write tests

4. **Contribute** → [CONTRIBUTING.md](CONTRIBUTING.md)
   - Add your own tests
   - Follow best practices

---

## 🤝 Getting Help

- **Setup Issues?** → See [SETUP.md](SETUP.md) Troubleshooting section
- **How to write tests?** → See [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)
- **General questions?** → Create a GitHub issue
- **Bug found?** → Create a GitHub issue with details

---

## ✨ Key Features

- 🎭 **Playwright** - Fast, reliable browser automation
- 🥒 **Cucumber** - Write tests in plain English
- 📝 **TypeScript** - Type-safe code
- 🎯 **Page Object Model** - Maintainable test structure
- 🌍 **Multi-Environment** - Dev, staging, production configs
- 📊 **Multiple Reporters** - HTML, Allure, JSON
- 🚀 **CI/CD Ready** - GitHub Actions & Jenkins support
- 🔒 **Secure** - Credentials never in Git

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Ready to start?** Head over to [SETUP.md](SETUP.md)! 🚀

