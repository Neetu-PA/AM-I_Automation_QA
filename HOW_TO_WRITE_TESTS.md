# 📚 Complete Guide: How to Write Test Cases in This Framework

## Table of Contents
1. [Framework Architecture](#framework-architecture)
2. [Complete Test Writing Process](#complete-test-writing-process)
3. [Detailed Component Breakdown](#detailed-component-breakdown)
4. [Step-by-Step Example](#step-by-step-example)
5. [Best Practices](#best-practices)
6. [Running Tests](#running-tests)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Framework Architecture

This framework follows **Page Object Model (POM)** with **Cucumber BDD** pattern using **Playwright** and **TypeScript**.

```
automation_typescript_playwright/
├── features/              # Test scenarios (Gherkin)
│   └── ui/
│       └── *.feature     # Cucumber feature files
├── src/
│   ├── pages/            # Page Objects (element locators + actions)
│   │   └── *.page.ts
│   ├── steps/            # Step Definitions (connects Gherkin to Page Objects)
│   │   └── *.steps.ts
│   └── support/          # Test infrastructure
│       ├── world.ts      # Shared test context
│       ├── config.ts     # Configuration
│       └── common-hooks.ts  # Setup/teardown
├── config/
│   └── environments/     # Environment configs
│       ├── dev.json
│       ├── staging.json
│       └── prod.json
└── reports/              # Test results
```

### Architecture Flow:
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Feature   │ -> │     Steps    │ -> │  Page Object │ -> │   Browser    │
│   (BDD)     │    │(Definitions) │    │    (POM)     │    │  (Playwright)│
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
     User             Glue Code          Element/Actions      Automation
   Readable                               Encapsulation
```

---

## 📝 Complete Test Writing Process

### The 4-Step Process:

1. **Write Feature File** (`.feature`) - What to test (Gherkin)
2. **Create Page Object** (`.page.ts`) - How to interact with page
3. **Write Step Definitions** (`.steps.ts`) - Connect feature to page object
4. **Configure Environment** (Optional) - Add test data/config

---

## 🔍 Detailed Component Breakdown

### Component 1: Feature File (`.feature`)

**Location:** `features/ui/`  
**Language:** Gherkin (Given-When-Then)  
**Purpose:** Describe test scenarios in plain English

**Structure:**
```gherkin
@tag1 @tag2
Feature: Feature Name
  As a [user role]
  I want to [action]
  So that [benefit]

  Background:
    Given [precondition for all scenarios]

  @tag3
  Scenario: Test scenario name
    Given [initial context]
    When [action/event]
    And [another action]
    Then [expected outcome]
    And [another verification]
```

**Gherkin Keywords:**
- `Feature:` - High-level description
- `Background:` - Steps that run before each scenario
- `Scenario:` - Individual test case
- `Given` - Preconditions/setup
- `When` - Actions/events
- `Then` - Expected results/assertions
- `And`/`But` - Additional steps

---

### Component 2: Page Object (`.page.ts`)

**Location:** `src/pages/`  
**Language:** TypeScript  
**Purpose:** Encapsulate page elements and interactions

**Structure:**
```typescript
import { Page } from '@playwright/test';

export class MyPage {
  constructor(private page: Page) {}

  // 1. Element Locators (private getter)
  private get elements() {
    return {
      myButton: this.page.locator('button[type="submit"]'),
      myInput: this.page.locator('input[name="username"]'),
      myDropdown: this.page.locator('select#language'),
      errorMessage: this.page.locator('.error-message'),
    };
  }

  // 2. Navigation Methods
  async navigate(url?: string): Promise<void> {
    await this.page.goto(url || '/my-page');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // 3. Action Methods
  async fillInput(text: string): Promise<void> {
    await this.elements.myInput.waitFor({ timeout: 5000 });
    await this.elements.myInput.fill(text);
  }

  async clickButton(): Promise<void> {
    await this.elements.myButton.click();
  }

  async selectOption(option: string): Promise<void> {
    await this.elements.myDropdown.selectOption({ label: option });
  }

  // 4. Verification Methods
  async hasError(): Promise<boolean> {
    try {
      await this.elements.errorMessage.waitFor({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    const text = await this.elements.errorMessage.textContent();
    return text?.trim() || '';
  }

  // 5. Validation Methods
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.elements.myInput.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
```

---

### Component 3: Step Definitions (`.steps.ts`)

**Location:** `src/steps/`  
**Language:** TypeScript with Cucumber decorators  
**Purpose:** Connect Gherkin steps to Page Object actions

**Structure:**
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';
import { config } from '../support/config';

// GIVEN - Preconditions/Setup
Given('I am on the my page', async function (this: ICustomWorld) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  await this.myPage.navigate();
});

// WHEN - Actions
When('I enter {string} in the input', async function (this: ICustomWorld, text: string) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  await this.myPage.fillInput(text);
});

When('I click the submit button', async function (this: ICustomWorld) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  await this.myPage.clickButton();
});

// THEN - Assertions
Then('I should see an error message', async function (this: ICustomWorld) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  const hasError = await this.myPage.hasError();
  expect(hasError).toBe(true);
});

Then('the error message should be {string}', async function (this: ICustomWorld, expectedMsg: string) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  const actualMsg = await this.myPage.getErrorMessage();
  expect(actualMsg).toContain(expectedMsg);
});
```

**Key Patterns:**
- Use `this: ICustomWorld` to access page objects
- Always check if page object is initialized
- Use `async function` (not arrow functions)
- Parameters match Gherkin placeholders: `{string}`, `{int}`, `{float}`

---

### Component 4: World Configuration (`world.ts`)

**Location:** `src/support/world.ts`  
**Purpose:** Shared context across all steps (like a global state)

**When to update:**
- Adding new page objects
- Adding shared test data
- Adding custom properties

```typescript
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { MyPage } from '../pages/my.page';

// 1. Define Interface (what's available)
export interface ICustomWorld extends World {
  page?: Page;
  context?: BrowserContext;
  myPage?: MyPage;  // <-- Add your page object here
  testData?: any;
}

// 2. Implement Class
export class CustomWorld extends World implements ICustomWorld {
  page?: Page;
  context?: BrowserContext;
  myPage?: MyPage;  // <-- Add your page object here
  testData?: any;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
```

---

### Component 5: Hooks (`common-hooks.ts`)

**Location:** `src/support/common-hooks.ts`  
**Purpose:** Initialize/cleanup resources before/after tests

**When to update:**
- Adding new page objects (initialize in `Before` hook)

```typescript
Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  // ... existing code ...
  
  // Initialize your new page object
  this.myPage = new MyPage(this.page);
});
```

---

## 🚀 Step-by-Step Example: Creating a "User Profile" Test

Let's create a complete test for a User Profile page from scratch!

### Step 1: Create Feature File

**File:** `features/ui/user-profile.feature`

```gherkin
@profile @ui
Feature: User Profile Management
  As a logged-in user
  I want to manage my profile
  So that I can keep my information up to date

  Background:
    Given I am logged in
    And I navigate to the profile page

  @smoke @critical
  Scenario: View profile information
    Then I should see my username
    And I should see my email address
    And the profile picture should be visible

  @edit
  Scenario: Update profile name
    When I click edit profile button
    And I change my name to "John Doe"
    And I click save changes
    Then I should see success message "Profile updated"
    And my name should be "John Doe"

  @validation
  Scenario: Prevent saving empty name
    When I click edit profile button
    And I clear the name field
    And I click save changes
    Then I should see validation error "Name is required"

  @negative
  Scenario: Upload invalid profile picture
    When I click edit profile button
    And I upload a file "document.pdf"
    Then I should see error "Only images are allowed"
```

---

### Step 2: Create Page Object

**File:** `src/pages/user-profile.page.ts`

```typescript
/**
 * UserProfilePage - Handles user profile viewing and editing
 */

import { Page } from '@playwright/test';

export class UserProfilePage {
  constructor(private page: Page) {}

  // Element Locators
  private get elements() {
    return {
      // View mode elements
      username: this.page.locator('[data-testid="profile-username"]'),
      email: this.page.locator('[data-testid="profile-email"]'),
      profilePicture: this.page.locator('img[alt="Profile picture"]'),
      
      // Action buttons
      editButton: this.page.locator('button:has-text("Edit Profile")'),
      saveButton: this.page.locator('button:has-text("Save Changes")'),
      cancelButton: this.page.locator('button:has-text("Cancel")'),
      
      // Edit mode fields
      nameInput: this.page.locator('input[name="name"]'),
      emailInput: this.page.locator('input[name="email"]'),
      uploadInput: this.page.locator('input[type="file"]'),
      
      // Messages
      successMessage: this.page.locator('.success-message, [role="alert"].success'),
      errorMessage: this.page.locator('.error-message, [role="alert"].error'),
      validationError: this.page.locator('.field-error, .validation-error'),
    };
  }

  // ============================================
  // NAVIGATION
  // ============================================
  
  async navigate(): Promise<void> {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ============================================
  // VIEW ACTIONS
  // ============================================
  
  async getUsername(): Promise<string> {
    await this.elements.username.waitFor({ timeout: 5000 });
    return await this.elements.username.textContent() || '';
  }

  async getEmail(): Promise<string> {
    return await this.elements.email.textContent() || '';
  }

  async isProfilePictureVisible(): Promise<boolean> {
    try {
      await this.elements.profilePicture.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // ============================================
  // EDIT ACTIONS
  // ============================================
  
  async clickEditProfile(): Promise<void> {
    await this.elements.editButton.click();
    await this.elements.nameInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  async changeName(newName: string): Promise<void> {
    await this.elements.nameInput.waitFor({ timeout: 5000 });
    await this.elements.nameInput.fill(newName);
  }

  async clearName(): Promise<void> {
    await this.elements.nameInput.clear();
  }

  async changeEmail(newEmail: string): Promise<void> {
    await this.elements.emailInput.fill(newEmail);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.elements.uploadInput.setInputFiles(filePath);
  }

  async clickSave(): Promise<void> {
    await this.elements.saveButton.click();
    await this.page.waitForTimeout(1000); // Wait for save operation
  }

  async clickCancel(): Promise<void> {
    await this.elements.cancelButton.click();
  }

  // ============================================
  // VERIFICATION
  // ============================================
  
  async getSuccessMessage(): Promise<string> {
    try {
      await this.elements.successMessage.waitFor({ timeout: 5000 });
      return await this.elements.successMessage.textContent() || '';
    } catch {
      return '';
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.elements.errorMessage.waitFor({ timeout: 5000 });
      return await this.elements.errorMessage.textContent() || '';
    } catch {
      return '';
    }
  }

  async getValidationError(): Promise<string> {
    try {
      await this.elements.validationError.waitFor({ timeout: 3000 });
      return await this.elements.validationError.textContent() || '';
    } catch {
      return '';
    }
  }

  async hasSuccessMessage(): Promise<boolean> {
    try {
      await this.elements.successMessage.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasErrorMessage(): Promise<boolean> {
    try {
      await this.elements.errorMessage.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasValidationError(): Promise<boolean> {
    try {
      await this.elements.validationError.waitFor({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // ============================================
  // PAGE VALIDATION
  // ============================================
  
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.elements.username.waitFor({ timeout: 10000 });
      await this.elements.editButton.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
```

---

### Step 3: Create Step Definitions

**File:** `src/steps/user-profile.steps.ts`

```typescript
/**
 * User Profile Step Definitions
 * Connects Gherkin steps to UserProfilePage actions
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';

// ============================================
// NAVIGATION
// ============================================

Given('I navigate to the profile page', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  await this.userProfilePage.navigate();
  
  const isLoaded = await this.userProfilePage.isPageLoaded();
  if (!isLoaded) throw new Error('Profile page did not load');
  
  console.log('✅ Profile page loaded');
});

// ============================================
// VIEW ASSERTIONS
// ============================================

Then('I should see my username', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const username = await this.userProfilePage.getUsername();
  expect(username).not.toBe('');
  expect(username.length).toBeGreaterThan(0);
  
  console.log(`✅ Username visible: ${username}`);
});

Then('I should see my email address', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const email = await this.userProfilePage.getEmail();
  expect(email).toContain('@');
  
  console.log(`✅ Email visible: ${email}`);
});

Then('the profile picture should be visible', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const isVisible = await this.userProfilePage.isProfilePictureVisible();
  expect(isVisible).toBe(true);
  
  console.log('✅ Profile picture is visible');
});

// ============================================
// EDIT ACTIONS
// ============================================

When('I click edit profile button', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  await this.userProfilePage.clickEditProfile();
  console.log('✅ Clicked edit profile button');
});

When('I change my name to {string}', async function (this: ICustomWorld, newName: string) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  await this.userProfilePage.changeName(newName);
  console.log(`✅ Changed name to: ${newName}`);
});

When('I clear the name field', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  await this.userProfilePage.clearName();
  console.log('✅ Cleared name field');
});

When('I click save changes', async function (this: ICustomWorld) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  await this.userProfilePage.clickSave();
  console.log('✅ Clicked save changes');
});

When('I upload a file {string}', async function (this: ICustomWorld, fileName: string) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const filePath = `test-data/files/${fileName}`;
  await this.userProfilePage.uploadFile(filePath);
  
  console.log(`✅ Uploaded file: ${fileName}`);
});

// ============================================
// VERIFICATION - SUCCESS
// ============================================

Then('I should see success message {string}', async function (this: ICustomWorld, expectedMessage: string) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const hasSuccess = await this.userProfilePage.hasSuccessMessage();
  expect(hasSuccess).toBe(true);
  
  const successMessage = await this.userProfilePage.getSuccessMessage();
  expect(successMessage.toLowerCase()).toContain(expectedMessage.toLowerCase());
  
  console.log(`✅ Success message: ${successMessage}`);
});

Then('my name should be {string}', async function (this: ICustomWorld, expectedName: string) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const actualName = await this.userProfilePage.getUsername();
  expect(actualName).toBe(expectedName);
  
  console.log(`✅ Name verified: ${actualName}`);
});

// ============================================
// VERIFICATION - ERRORS
// ============================================

Then('I should see validation error {string}', async function (this: ICustomWorld, expectedError: string) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const hasError = await this.userProfilePage.hasValidationError();
  expect(hasError).toBe(true);
  
  const errorMessage = await this.userProfilePage.getValidationError();
  expect(errorMessage).toContain(expectedError);
  
  console.log(`✅ Validation error: ${errorMessage}`);
});

Then('I should see error {string}', async function (this: ICustomWorld, expectedError: string) {
  if (!this.userProfilePage) throw new Error('UserProfilePage not initialized');
  
  const hasError = await this.userProfilePage.hasErrorMessage();
  expect(hasError).toBe(true);
  
  const errorMessage = await this.userProfilePage.getErrorMessage();
  expect(errorMessage.toLowerCase()).toContain(expectedError.toLowerCase());
  
  console.log(`✅ Error message: ${errorMessage}`);
});
```

---

### Step 4: Update World Configuration

**File:** `src/support/world.ts` (add these lines)

```typescript
import { UserProfilePage } from '../pages/user-profile.page';

export interface ICustomWorld extends World {
  // ... existing properties ...
  userProfilePage?: UserProfilePage;  // <-- Add this
}

export class CustomWorld extends World implements ICustomWorld {
  // ... existing properties ...
  userProfilePage?: UserProfilePage;  // <-- Add this

  constructor(options: IWorldOptions) {
    super(options);
  }
}
```

---

### Step 5: Update Hooks

**File:** `src/support/common-hooks.ts` (add to Before hook)

```typescript
import { UserProfilePage } from '../pages/user-profile.page';

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  // ... existing code ...
  
  // Initialize page objects
  this.homePage = new HomePage(this.page);
  this.loginPage = new LoginPage(this.page);
  this.forgotPasswordPage = new ForgotPasswordPage(this.page);
  this.userProfilePage = new UserProfilePage(this.page);  // <-- Add this
  
  // ... rest of code ...
});
```

---

### Step 6: Run Your Tests

```bash
# Run all profile tests
npm run test -- features/ui/user-profile.feature

# Run only smoke tests
npm run test -- --tags "@profile and @smoke"

# Run in headed mode (see browser)
npm run test:headed -- features/ui/user-profile.feature

# Run specific scenario
npm run test -- features/ui/user-profile.feature:15
```

---

## ✅ Best Practices

### 1. Feature File Best Practices

```gherkin
✅ GOOD:
  When I enter "john@example.com" in the email field
  Then I should see "Welcome back, John"

❌ BAD:
  When I fill the email input with john@example.com
  Then the welcome message John appears
```

**Tips:**
- Use descriptive scenario names
- One scenario = one test case
- Use tags for organization (@smoke, @critical, @regression)
- Keep scenarios independent
- Use Background for common setup

### 2. Page Object Best Practices

```typescript
✅ GOOD:
export class LoginPage {
  private get elements() {
    return {
      usernameInput: this.page.locator('input[name="username"]'),
    };
  }
  
  async enterUsername(username: string): Promise<void> {
    await this.elements.usernameInput.fill(username);
  }
}

❌ BAD:
export class LoginPage {
  async enterUsername(username: string): Promise<void> {
    await this.page.locator('input[name="username"]').fill(username);
  }
}
```

**Tips:**
- Centralize locators in `elements` getter
- Use descriptive method names
- Return meaningful types (boolean, string, etc.)
- Add waits for dynamic elements
- Handle errors gracefully

### 3. Step Definition Best Practices

```typescript
✅ GOOD:
When('I enter username {string}', async function (this: ICustomWorld, username: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterUsername(username);
});

❌ BAD:
When('I enter username {string}', async (username: string) => {
  // Arrow function - can't access 'this'!
  await page.locator('input').fill(username);
});
```

**Tips:**
- Use `async function` (not arrow functions)
- Always check page object initialization
- Keep steps simple (1 action per step)
- Use meaningful console.log for debugging
- Reuse common steps from `common.steps.ts`

### 4. Locator Best Practices

**Priority Order:**
1. ✅ `data-testid` attributes: `this.page.locator('[data-testid="login-btn"]')`
2. ✅ Accessible roles: `this.page.getByRole('button', { name: 'Login' })`
3. ✅ Accessible labels: `this.page.getByLabel('Email')`
4. ✅ Placeholder: `this.page.getByPlaceholder('Enter email')`
5. ⚠️ CSS/ID: `this.page.locator('#login-button')`
6. ⚠️ Text content: `this.page.getByText('Login')`
7. ❌ XPath: Avoid if possible

### 5. Test Data Management

**Option 1: Environment Config**
```json
// config/environments/dev.json
{
  "auth": {
    "username": "test@am-i.nl",
    "password": "Test123!"
  }
}
```

**Option 2: Feature File Tables**
```gherkin
Scenario Outline: Login with multiple users
  When I login with "<username>" and "<password>"
  Then I should see "<result>"

  Examples:
    | username        | password  | result         |
    | valid@email.com | Pass123!  | Dashboard      |
    | invalid@test    | wrong     | Invalid login  |
```

### 6. Common Patterns

**Pattern 1: Parameterized Steps**
```typescript
When('I enter {string} in {string} field', 
  async function (this: ICustomWorld, value: string, fieldName: string) {
    await this.page?.getByLabel(fieldName).fill(value);
  }
);
```

**Pattern 2: Dynamic Waits**
```typescript
async waitForSuccess(): Promise<void> {
  await this.page.waitForSelector('.success-message', {
    state: 'visible',
    timeout: 10000
  });
}
```

**Pattern 3: Error Handling**
```typescript
async clickButton(): Promise<void> {
  try {
    await this.elements.button.click();
  } catch (error) {
    console.error('Failed to click button:', error);
    throw new Error('Button not found or not clickable');
  }
}
```

---

## 🚦 Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run specific feature
npm run test features/ui/login.feature

# Run specific scenario (by line number)
npm run test features/ui/login.feature:18

# Run with tags
npm run test -- --tags "@smoke"
npm run test -- --tags "@smoke and @critical"
npm run test -- --tags "@login or @profile"
npm run test -- --tags "not @ignore"
```

### Environment-Specific

```bash
# Run on dev environment
npm run test:dev

# Run on staging
npm run test:staging

# Run on production (careful!)
npm run test:prod
```

### Debugging

```bash
# Headed mode (see browser)
npm run test:headed

# Debug mode (Playwright Inspector)
npm run test:debug

# With video recording
npm run test:video
```

### CI/CD

```bash
# Headless mode for CI
npm run test:headless

# Full CI command
npm run test:ci
```

---

## 🔧 Troubleshooting

### Issue 1: "Page object not initialized"
**Error:** `Error: LoginPage not initialized`

**Solution:** Check `common-hooks.ts` - ensure page object is initialized in `Before` hook:
```typescript
this.loginPage = new LoginPage(this.page);
```

### Issue 2: "Element not found"
**Error:** `Timeout waiting for selector`

**Solutions:**
1. Check element exists on page
2. Wait for page load: `await this.page.waitForLoadState('domcontentloaded');`
3. Increase timeout: `await element.waitFor({ timeout: 10000 });`
4. Check if element is dynamic/lazy-loaded

### Issue 3: "Step definition not found"
**Error:** `Undefined step: "I click the button"`

**Solution:** 
1. Check step definition exists in `*.steps.ts` file
2. Ensure step text matches exactly (case-sensitive)
3. Run `npm run snippets` to generate missing steps

### Issue 4: "TypeScript errors"
**Error:** `Cannot find name 'myPage'`

**Solution:**
1. Check `world.ts` has the property
2. Check import statement is correct
3. Run `npm run build` to check TypeScript compilation

### Issue 5: "Tests pass but shouldn't"
**Problem:** Assertion not working

**Solutions:**
1. Check you're using `expect()` from `@playwright/test`
2. Add `await` before async operations
3. Add explicit waits before assertions
4. Use `.waitFor()` on elements

---

## 📋 Quick Reference Checklist

When creating a new test:

- [ ] Create `.feature` file with scenario
- [ ] Create `.page.ts` with page object
  - [ ] Add element locators
  - [ ] Add action methods
  - [ ] Add verification methods
- [ ] Create `.steps.ts` with step definitions
  - [ ] Given steps (setup)
  - [ ] When steps (actions)
  - [ ] Then steps (assertions)
- [ ] Update `world.ts`
  - [ ] Add to interface
  - [ ] Add to class
- [ ] Update `common-hooks.ts`
  - [ ] Initialize in Before hook
- [ ] Run and verify test
  - [ ] Test passes in headed mode
  - [ ] Test passes in headless mode
  - [ ] Add to CI/CD pipeline

---

## 📚 Additional Resources

### Useful Commands

```bash
# Generate step snippets for undefined steps
npm run snippets

# Check which steps are used
npm run steps-usage

# Dry run (validate without executing)
cucumber-js --dry-run

# Clean reports
npm run clean:reports

# View test report
npm run report:open
```

### Playwright Locator Methods

```typescript
// By role
this.page.getByRole('button', { name: 'Submit' })
this.page.getByRole('textbox', { name: 'Email' })

// By label
this.page.getByLabel('Username')

// By placeholder
this.page.getByPlaceholder('Enter your email')

// By text
this.page.getByText('Welcome')

// By test ID
this.page.getByTestId('login-button')

// CSS selector
this.page.locator('.submit-button')
this.page.locator('#username-input')
this.page.locator('button[type="submit"]')
```

### Useful Assertions

```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Text content
await expect(element).toHaveText('Expected text')
await expect(element).toContainText('partial')

// Value
await expect(input).toHaveValue('username')

// Count
await expect(elements).toHaveCount(5)

// URL
await expect(page).toHaveURL(/dashboard/)

// Boolean
expect(result).toBe(true)
expect(value).toContain('substring')
expect(number).toBeGreaterThan(10)
```

---

## 🎯 Summary

**To write a test case:**

1. **Think in layers:**
   - Feature (WHAT) → Steps (GLUE) → Page Object (HOW) → Browser (DO)

2. **Follow the pattern:**
   - Every feature needs a page object
   - Every page object needs step definitions
   - All page objects must be registered in world.ts

3. **Test your test:**
   - Run in headed mode first
   - Verify all assertions work
   - Check error handling

4. **Maintain quality:**
   - Use descriptive names
   - Keep methods focused
   - Write reusable steps
   - Document complex logic

---

**Happy Testing! 🚀**

Need help? Check existing examples in `features/ui/login.feature` and `src/pages/login.page.ts`


