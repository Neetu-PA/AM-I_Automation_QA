/**
 * Auth spec — login + forgot password flows
 * ------------------------------------------
 * Login flow tests intentionally bypass storageState
 * because they ARE testing the login UI itself.
 *
 * Tags: @smoke = critical path | @regression = full suite
 */

import { test, expect } from '../fixtures';

const VALID_USER = process.env.TEST_USERNAME as string;
const VALID_PASS = process.env.TEST_PASSWORD as string;

// ─── Override storageState for login tests — they need a fresh session ────────
// These tests test the login page itself, so they must start unauthenticated.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('login flow', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.validatePageLoaded();
  });

  test('login page loads correctly @smoke', async ({ loginPage }) => {
    const isLoaded = await loginPage.validatePageLoaded();
    expect(isLoaded).toBe(true);
  });

  test('login succeeds with valid credentials @smoke', async ({ loginPage }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  test('login fails with wrong password @regression', async ({ loginPage }) => {
    await loginPage.enterUsername(VALID_USER);
    await loginPage.clickContinue();
    await loginPage.enterPassword('WrongPassword!');
    await loginPage.clickSignIn();

    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).toBe(true);
  });

  test('login fails with unknown username @regression', async ({ loginPage }) => {
    await loginPage.enterUsername('unknown@notexist.com');
    await loginPage.clickContinue();
    await loginPage.enterPassword('AnyPassword!');
    await loginPage.clickSignIn();

    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).toBe(true);
  });

  test('login page stays visible with empty username @regression', async ({ loginPage }) => {
    await loginPage.enterUsername('');
    await loginPage.clickContinue();

    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('login');
  });

});

test.describe('forgot password flow', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.validatePageLoaded();
    // Navigate to password step first
    await loginPage.enterUsername(VALID_USER);
    await loginPage.clickContinue();
  });

  test('forgot password link is visible on password step @smoke', async ({ page }) => {
    const forgotLink = page.getByTestId('forgot-password-link')
      .or(page.locator('a:has-text("vergeten"), a:has-text("Forgot")'))
      .first();
    await expect(forgotLink).toBeVisible();
  });

  test('clicking forgot password navigates to reset page @smoke', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();
    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('password/reset');
  });

});