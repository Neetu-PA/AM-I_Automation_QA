# AGENTS.md — E2E Test Repo Guide

> This file is read by AI tools (Claude, Copilot, Cursor) and humans alike.
> Follow these rules when writing or generating any test code in this repo.

---

## Stack
- Playwright + TypeScript (no Cucumber, no Gherkin, no step files)
- BrowserStack for cross-browser + performance runs
- Pure spec files — readable without any framework knowledge

---

## Folder structure
```
e2e-tests/
├── tests/          ← spec files only (*spec.ts)
├── pages/          ← page objects (*page.ts)
├── fixtures/       ← index.ts wires all page objects
├── helpers/        ← shared utils (actions, wait, assertions)
├── playwright.config.ts
├── playwright.bs.config.ts   ← BrowserStack config
├── .env.example
└── AGENTS.md
```

---

## Rules for writing tests

### Always
- Import `test` and `expect` from `'../fixtures'` — never from `@playwright/test`
- Group tests with `test.describe('feature name')`
- Use `test.beforeEach` for navigation and page load check
- Tag every test: `@sanity` (critical path) or `@regression` (full suite)
- Use page object methods — never write raw locators inside spec files

### Never
- `page.waitForTimeout()` — use Playwright auto-wait or explicit waitFor
- Raw `page.locator()` calls inside spec files — that belongs in page objects
- `test.only` committed to any branch
- Hardcoded credentials — use `process.env.TEST_USERNAME` etc.

---

## Rules for writing page objects

```typescript
export class FeaturePage {
  constructor(private page: Page) {}

  // 1. All locators as private getters at the top
  private get elements() {
    return {
      submitButton: this.page.locator('button[type="submit"]'),
    };
  }

  // 2. Actions return void
  async clickSubmit(): Promise<void> {
    await this.elements.submitButton.click();
  }

  // 3. Assertions return Locator — let test assert
  get successBanner() {
    return this.page.locator('.success-banner');
  }
}
```

---

## Adding a new test — step by step

1. Check if a page object exists in `pages/` for your feature
2. If not — create `pages/feature-name.page.ts` first
3. Register it in `fixtures/index.ts`
4. Create `tests/feature-name.spec.ts`
5. Import from `'../fixtures'`, write tests, tag them
6. Run locally: `npx playwright test tests/feature-name.spec.ts`

---

## Running tests

```bash
# All tests
npx playwright test

# Smoke only
npx playwright test --grep @smoke

# Specific file
npx playwright test tests/auth.spec.ts

# Headed (see the browser)
npx playwright test --headed

# With trace
npx playwright test --trace on

# BrowserStack
npx playwright test --config=playwright.bs.config.ts
```

---

## Environment variables (.env)

```
BASE_URL=https://your-app.com
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=Test@1234
BS_USERNAME=your_browserstack_username
BS_ACCESS_KEY=your_browserstack_key
```

Never commit `.env`. Always update `.env.example` when adding new vars.

---

## Branch rules

| Branch | Purpose |
|---|---|
| `main` | Always runnable. PRs only. Client-facing. |
| `develop` | Integration. Nightly BrowserStack run. |
| `feature/<name>` | Your daily work. Merge to develop via PR. |
| `archive/*` | Old code preserved. Never merge. |

---

## When UI changes

1. Update the **page object only** — locators live there
2. Spec files should not need changes for locator updates
3. Run affected spec to confirm: `npx playwright test tests/auth.spec.ts`
4. Commit with message: `fix: update login locators after UI change`

---

## Adding BrowserStack (coming soon)
- Config: `playwright.bs.config.ts`
- Tags for cross-browser: `@browserstack`
- Performance logs enabled via `browserstack.networkLogs: true`


## Updated rule for AGENTS.md

Add this one line to your AGENTS.md so the whole team knows when to use which approach:
```
## Selectors
- If dev has confirmed data-testid → use page.getByTestId() directly in page object
- If testids are missing or unconfirmed → create a locators file with primary + fallback
- Never write raw CSS selectors inside spec files