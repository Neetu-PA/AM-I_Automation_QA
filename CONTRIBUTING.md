# Contributing to Playwright-Cucumber-MCP Framework

Thank you for your interest in contributing! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## 💻 Development Process

### Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm run test:smoke

# Run with debugging
npm run test:debug
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Validate before commit
npm run validate
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript strict mode
- Add type annotations
- Use interfaces for object shapes
- Prefer `const` over `let`
- Use async/await over promises

### Naming Conventions

- **Files:** kebab-case (`home-page.ts`)
- **Classes:** PascalCase (`HomePage`)
- **Functions:** camelCase (`clickButton`)
- **Constants:** UPPER_SNAKE_CASE (`BASE_URL`)

### Page Objects

```typescript
// ✅ Good
export class HomePage extends BasePage {
  private locators = {
    button: this.page.locator('button')
  };
  
  async clickButton(): Promise<void> {
    await this.click(this.locators.button);
  }
}

// ❌ Bad
export class homePage {
  async click() {
    await this.page.click('button');
  }
}
```

### Step Definitions

```typescript
// ✅ Good - Clear, descriptive
Given('I am on the home page', async function (this: ICustomWorld) {
  await this.homePage.navigate();
});

// ❌ Bad - Vague, unclear
Given('go home', async function (this: ICustomWorld) {
  await this.page.goto('/');
});
```

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```
feat(pages): add login page object

Add comprehensive login page with validation methods

Closes #123
```

```
fix(hooks): resolve browser context issue

Fix browser context not being properly closed after tests
```

## 🔄 Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update examples

2. **Run Tests**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

3. **Create PR**
   - Clear title and description
   - Reference related issues
   - Add screenshots if UI changes

4. **Review Process**
   - Address review comments
   - Keep PR focused (one feature/fix)
   - Update PR description if needed

## 🧪 Writing Tests

### Feature Files

```gherkin
Feature: User Login
  Scenario: Valid user can login
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in
```

### Step Definitions

```typescript
Given('I am on the login page', async function (this: ICustomWorld) {
  await this.loginPage.navigate();
  await this.loginPage.validatePage();
});
```

## 📚 Documentation

- Add JSDoc comments to public methods
- Update README for new features
- Include usage examples
- Document breaking changes

## ✅ Checklist

Before submitting PR:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Commit messages follow guidelines

## 🙏 Thank You!

Your contributions make this project better! 🚀
