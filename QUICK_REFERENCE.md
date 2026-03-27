# 🚀 Quick Reference Cheat Sheet

## File Structure
```
features/ui/my-test.feature           # Test scenarios (Gherkin)
src/pages/my-page.page.ts             # Page Object (locators + actions)
src/steps/my-page.steps.ts            # Step Definitions (glue code)
src/support/world.ts                  # Register page objects
src/support/common-hooks.ts           # Initialize page objects
```

## 1️⃣ Feature File Template

```gherkin
@tag1 @tag2
Feature: Feature Name
  As a [role]
  I want to [action]
  So that [benefit]

  Background:
    Given [common setup]

  @smoke
  Scenario: Test case name
    Given [precondition]
    When [action]
    Then [expected result]
```

## 2️⃣ Page Object Template

```typescript
import { Page } from '@playwright/test';

export class MyPage {
  constructor(private page: Page) {}

  private get elements() {
    return {
      myButton: this.page.locator('button'),
      myInput: this.page.locator('input'),
    };
  }

  async navigate(): Promise<void> {
    await this.page.goto('/my-page');
  }

  async clickButton(): Promise<void> {
    await this.elements.myButton.click();
  }

  async fillInput(text: string): Promise<void> {
    await this.elements.myInput.fill(text);
  }

  async isPageLoaded(): Promise<boolean> {
    try {
      await this.elements.myButton.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
```

## 3️⃣ Step Definition Template

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';

Given('I am on my page', async function (this: ICustomWorld) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  await this.myPage.navigate();
});

When('I click the button', async function (this: ICustomWorld) {
  if (!this.myPage) throw new Error('MyPage not initialized');
  await this.myPage.clickButton();
});

Then('I should see {string}', async function (this: ICustomWorld, text: string) {
  if (!this.page) throw new Error('Page not initialized');
  await expect(this.page.getByText(text)).toBeVisible();
});
```

## 4️⃣ Register in World

```typescript
// src/support/world.ts
import { MyPage } from '../pages/my-page.page';

export interface ICustomWorld extends World {
  myPage?: MyPage;  // Add this
}

export class CustomWorld extends World implements ICustomWorld {
  myPage?: MyPage;  // Add this
}
```

## 5️⃣ Initialize in Hooks

```typescript
// src/support/common-hooks.ts
import { MyPage } from '../pages/my-page.page';

Before(async function (this: ICustomWorld, { pickle }) {
  // ... existing code ...
  this.myPage = new MyPage(this.page);  // Add this
});
```

## 📋 Common Commands

```bash
# Run tests
npm run test                           # All tests
npm run test features/ui/my.feature    # Specific feature
npm run test -- --tags "@smoke"        # By tag

# Debug
npm run test:headed                    # See browser
npm run test:debug                     # Playwright inspector

# Environments
npm run test:dev                       # Dev environment
npm run test:staging                   # Staging
npm run test:prod                      # Production

# Utilities
npm run snippets                       # Generate step snippets
npm run clean:reports                  # Clean reports
npm run report:open                    # View report
```

## 🔍 Playwright Locators

```typescript
// Best → Worst priority
this.page.getByTestId('button-id')                    // 1. Test ID (best)
this.page.getByRole('button', { name: 'Submit' })     // 2. Accessible role
this.page.getByLabel('Email')                         // 3. Label
this.page.getByPlaceholder('Enter email')             // 4. Placeholder
this.page.locator('button[type="submit"]')            // 5. CSS
this.page.getByText('Click me')                       // 6. Text (fragile)
```

## ✅ Common Assertions

```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Content
await expect(element).toHaveText('exact text')
await expect(element).toContainText('partial')

// Form
await expect(input).toHaveValue('value')
await expect(checkbox).toBeChecked()

// Count
await expect(items).toHaveCount(5)

// URL
await expect(page).toHaveURL(/dashboard/)

// Boolean
expect(result).toBe(true)
expect(text).toContain('substring')
```

## 🎯 Gherkin Parameters

```gherkin
# String
When I enter {string} in the field
# Usage: When I enter "test@email.com" in the field

# Integer
When I wait for {int} seconds
# Usage: When I wait for 5 seconds

# Float
When I scroll {float} percent
# Usage: When I scroll 50.5 percent

# Word (no spaces)
When I select {word} option
# Usage: When I select Primary option
```

## ⚡ Useful Waits

```typescript
// Wait for element
await element.waitFor({ state: 'visible', timeout: 5000 })

// Wait for page load
await this.page.waitForLoadState('domcontentloaded')
await this.page.waitForLoadState('networkidle')

// Wait for URL
await this.page.waitForURL('**/dashboard**')

// Static wait (avoid when possible)
await this.page.waitForTimeout(2000)
```

## 🏷️ Common Tags

```gherkin
@smoke           # Critical paths
@regression      # Full test suite
@critical        # Must-pass tests
@wip             # Work in progress
@ignore          # Skip test
@slow            # Long-running test
@negative        # Error cases
@validation      # Form validation
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Page object not initialized | Check `common-hooks.ts` initialization |
| Element not found | Add wait: `await element.waitFor()` |
| Step not found | Run `npm run snippets` |
| TypeScript error | Check `world.ts` registration |
| Test flaky | Add proper waits, avoid `waitForTimeout` |

## 📁 Test Data Locations

```
config/environments/dev.json          # Environment config
config/environments/staging.json      # Staging config
test-data/                            # Test data files
```

## 🎨 VS Code Snippets

**Feature snippet** (`feature`)
```gherkin
@tag
Feature: Feature Name
  
  Scenario: Test name
    Given 
    When 
    Then 
```

**Page Object snippet** (`page`)
```typescript
export class MyPage {
  constructor(private page: Page) {}
  
  private get elements() {
    return {
      
    };
  }
}
```

**Step snippet** (`step`)
```typescript
When('I do something', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');
  
});
```

## 🔥 Pro Tips

1. **Always use `async/await`** - Never forget `await` on Playwright methods
2. **Check initialization** - Always validate page objects exist
3. **Use descriptive names** - Future you will thank present you
4. **One action per step** - Keep step definitions simple
5. **Reuse common steps** - Check `common.steps.ts` first
6. **Test in headed mode first** - See what's happening
7. **Add meaningful logs** - Use `console.log()` for debugging
8. **Handle dynamic content** - Use proper waits
9. **Keep scenarios independent** - Don't rely on other tests
10. **Tag your tests** - Makes filtering easier

## 📞 Need Help?

1. Check existing examples: `features/ui/login.feature`
2. Read the full guide: `HOW_TO_WRITE_TESTS.md`
3. Generate missing steps: `npm run snippets`
4. Check Playwright docs: https://playwright.dev
5. Check Cucumber docs: https://cucumber.io

---

**Remember:** Feature → Page Object → Steps → World → Hooks

That's the complete flow! 🚀


