# 🎭 Playwright-Cucumber Automation Framework

> **Beginner-Friendly Test Automation Framework** 🎓

A modern, easy-to-learn test automation framework combining **Playwright** and **Cucumber**. Perfect for beginners and teams new to automation!

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.41-green)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber-10.3-brightgreen)](https://cucumber.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## ✨ Features

- 🎭 **Playwright** - Fast, reliable end-to-end testing
- 🥒 **Cucumber** - BDD with Gherkin syntax (plain English)
- 📊 **Multiple Reporters** - HTML, Allure, JSON
- 🌍 **Multi-Environment** - Dev, Staging, Production configs
- 🚀 **CI/CD Ready** - GitHub Actions & Jenkins support
- 📝 **TypeScript** - Type-safe, maintainable code
- 🎯 **Page Object Model** - Clean, reusable architecture
- 🔒 **Secure Configuration** - Credentials in separate config files

---

## 🎯 Perfect For Beginners!

- ✅ **Clear Structure** - Every file has comments explaining its purpose
- ✅ **Simple Examples** - Working login test included
- ✅ **Plain English Tests** - Write tests like user stories
- ✅ **Easy to Understand** - No complex patterns, just clean code
- ✅ **Complete Guide** - [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) has everything you need

👉 **New to automation?** Start with [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) 📚

---

## 🏗️ Project Structure

```
automation_typescript_playwright/
├── config/
│   └── environments/          # Environment-specific configs
│       ├── dev.json          # Development settings
│       ├── staging.json      # Staging settings
│       └── prod.json         # Production settings
├── features/
│   └── ui/
│       └── login.feature     # Test scenarios (plain English)
├── src/
│   ├── pages/               # Page Object Models
│   │   ├── login.page.ts    # Login page elements & actions
│   │   └── home.page.ts     # Home page elements & actions
│   ├── steps/               # Step definitions (code)
│   │   ├── login.steps.ts   # Login step implementations
│   │   └── common.steps.ts  # Common reusable steps
│   ├── support/             # Framework setup
│   │   ├── common-hooks.ts  # Before/After test setup
│   │   ├── config.ts        # Load environment configs
│   │   └── world.ts         # Cucumber context
│   └── utils/               # Helper functions
├── reports/                 # Test results (auto-generated)
├── .gitignore              # Protected files (credentials)
├── package.json            # Dependencies & scripts
└── cucumber.mjs            # Cucumber configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 16.x
- **npm** (comes with Node.js)

### 1. Install Dependencies

```bash
npm install
npm run playwright:install
```

### 2. Setup Configuration

```bash
# Copy example config
cp config/environments/dev.json.example config/environments/dev.json

# Edit with your credentials
nano config/environments/dev.json
```

Update the credentials in `config/environments/dev.json`:

```json
{
  "baseUrl": "https://your-app-url.com",
  "loginUrl": "https://your-app-url.com/login",
  "auth": {
    "username": "your_username",
    "password": "your_password",
    "language": "English"
  }
}
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific scenarios
npm run test:dev -- --tags @smoke
npm run test:dev -- --tags @negative

# Run with visible browser (for debugging)
HEADLESS=false npm run test:dev -- --tags @smoke
```

---

## 📝 Example Test

Our framework includes a working **login test** as an example:

### Feature File (`features/ui/login.feature`):

```gherkin
@login @ui
Feature: User Login
  As a user
  I want to login to the application 
  So I can access my account

  @smoke @critical
  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I enter valid username
    And I select valid language
    And I click Continue
    When I enter valid password
    And I click Sign in
    Then I should be logged in successfully
    And I should see the dashboard

  @negative
  Scenario: Failed login with invalid credentials
    Given I navigate to the login page
    When I enter invalid username
    And I select valid language
    And I click Continue
    When I enter invalid password
    And I click Sign in
    Then I should not be logged in
    And I should still be on the login page
```

**Key Points:**
- ✅ No hardcoded credentials (uses config files)
- ✅ Supports two-step login flow
- ✅ Tests both positive and negative scenarios
- ✅ Easy to read and understand

---

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run all tests in dev environment
npm run test:dev

# Run with visible browser
HEADLESS=false npm run test:dev

# Run specific tags
npm run test:dev -- --tags @smoke
npm run test:dev -- --tags @negative
npm run test:dev -- --tags @validation
```

### Environment-Specific

```bash
# Development
NODE_ENV=dev npm run test
npm run test:dev

# Staging
NODE_ENV=staging npm run test
npm run test:staging

# Production
NODE_ENV=prod npm run test
npm run test:prod
```

### With Reports

```bash
# Generate Allure report
npm run test:allure
npm run report:allure

# View HTML report
npm run report:open
```

---

## 🔧 Configuration

### Environment Files

All settings are in `config/environments/*.json`:

```
config/environments/
├── dev.json          ← Your credentials here (NOT in Git)
├── staging.json      ← Staging settings
├── prod.json         ← Production settings
└── dev.json.example  ← Template for new team members
```

### What's in the Config Files?

```json
{
  "name": "development",
  "baseUrl": "https://your-app.com",
  "loginUrl": "https://your-app.com/login",
  "auth": {
    "username": "your_username",
    "password": "your_password",
    "language": "English"
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

### Important Security Note

⚠️ **The `config/environments/*.json` files are in `.gitignore`**

- Never commit real credentials to Git
- Each team member creates their own local config files
- Use the `.example` files as templates

---

## 📊 Test Reports

### HTML Report (Default)

```bash
# Tests auto-generate HTML report
npm test

# Open report
npm run report:open
```

### Allure Report (Detailed)

```bash
# Run tests with Allure
npm run test:allure

# Generate and open Allure report
npm run report:allure
```

Reports are saved in the `reports/` folder.

---

## 🎓 Learning Resources

### For Beginners

1. **Start Here:** [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)
   - Complete guide with examples
   - Step-by-step tutorials
   - Common patterns explained

2. **Study the Login Example:**
   - Feature file: `features/ui/login.feature`
   - Page object: `src/pages/login.page.ts`
   - Steps: `src/steps/login.steps.ts`

3. **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
   - How to add new tests
   - Code style guidelines
   - Pull request process

### Key Concepts

| Concept | File | What it Does |
|---------|------|--------------|
| **Feature Files** | `features/*.feature` | Test scenarios in plain English |
| **Page Objects** | `src/pages/*.page.ts` | Page elements and actions |
| **Step Definitions** | `src/steps/*.steps.ts` | Code that runs the steps |
| **Hooks** | `src/support/common-hooks.ts` | Setup/teardown for tests |
| **Config** | `src/support/config.ts` | Load environment settings |

---

## 📦 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Test** | `npm test` | Run all tests (development) |
| **Dev** | `npm run test:dev` | Run in dev environment |
| **Staging** | `npm run test:staging` | Run in staging environment |
| **Prod** | `npm run test:prod` | Run in production environment |
| **Smoke** | `npm run test:smoke` | Run smoke tests only |
| **Headed** | `npm run test:headed` | Run with visible browser |
| **Debug** | `npm run test:debug` | Run in debug mode |
| **Parallel** | `npm run test:parallel` | Run tests in parallel |
| **Allure** | `npm run test:allure` | Run with Allure reporting |
| **Report** | `npm run report:open` | Open HTML report |
| **Allure Report** | `npm run report:allure` | Generate Allure report |
| **Lint** | `npm run lint` | Check code quality |
| **Format** | `npm run format` | Format code |
| **Clean** | `npm run clean` | Remove generated files |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick Steps:**
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-test`
3. Add your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add new login test'`
6. Push: `git push origin feature/my-new-test`
7. Create a Pull Request

---

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot find module" errors**
```bash
npm install
```

**2. "Browser not found" errors**
```bash
npm run playwright:install
```

**3. Tests fail with timeout**
- Increase timeout in `config/environments/dev.json`
- Check your network connection
- Run with `HEADLESS=false` to see what's happening

**4. Config file not found**
```bash
# Create from example
cp config/environments/dev.json.example config/environments/dev.json
# Edit with your settings
```

---

## 📚 Documentation

- **[README.md](README.md)** - This file (project overview)
- **[BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)** - Complete guide for beginners ⭐
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Browser automation framework
- [Cucumber](https://cucumber.io/) - BDD testing framework
- [Allure](https://allurereport.org/) - Test reporting tool

---

**Made with ❤️ for reliable test automation**

**Questions?** Check [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) or create an issue!
