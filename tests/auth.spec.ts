/**
 * Auth spec — AM-I platform login flows
 * ----------------------------------------
 * Platform-level tests for the shared login UI.
 * Login is the single entry point for all AM-I services
 * (Webdealer, CRM, etc.). These tests do NOT use loggedInPage —
 * they test the login UI itself, starting unauthenticated.
 *
 * Tags: @smoke | @regression
 */

import { test, expect } from '../fixtures';

const VALID_USER = process.env.TEST_USERNAME as string;
const VALID_PASS = process.env.TEST_PASSWORD as string;

// ─── Platform login flow ──────────────────────────────────────────────────────

test.describe('platform login flow', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.validatePageLoaded();
  });

  test('login page loads correctly @smoke', async ({ loginPage }) => {
    expect(await loginPage.validatePageLoaded()).toBe(true);
  });

  test('login succeeds with valid credentials @smoke', async ({ loginPage }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    expect(await loginPage.isLoggedIn()).toBe(true);
  });

  test('login fails with wrong password @regression', async ({ loginPage }) => {
    test.setTimeout(60_000);
    await loginPage.enterUsername(VALID_USER);
    await loginPage.clickContinue();
    await loginPage.enterPassword('WrongPassword!');
    await loginPage.clickSignIn();
    expect(await loginPage.hasErrorMessage()).toBe(true);
  });

  test('login fails with unknown username @regression', async ({ loginPage }) => {
    test.setTimeout(60_000);
    await loginPage.enterUsername('unknown@notexist.com');
    await loginPage.clickContinue();
    await loginPage.enterPassword('AnyPassword!');
    await loginPage.clickSignIn();
    expect(await loginPage.hasErrorMessage()).toBe(true);
  });

  test('login stays on login page with empty username @regression', async ({ loginPage }) => {
    await loginPage.enterUsername('');
    await loginPage.clickContinue();
    expect(await loginPage.getCurrentUrl()).toContain('login');
  });

});

// ─── Forgot password flow (skipped — FE uses Link+Button without stable testid; re-enable when agreed) ──

test.describe.skip('forgot password flow', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.validatePageLoaded();
    await loginPage.enterUsername(VALID_USER);
    await loginPage.clickContinue();
  });

  test('forgot password link is visible on password step @smoke', async ({ page }) => {
    const forgotLink = page
      .getByRole('link', { name: /forgot|vergeten/i })
      .first();
    await expect(forgotLink).toBeVisible();
  });

  test('clicking forgot password navigates to reset page @smoke', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();
    expect(await loginPage.getCurrentUrl()).toContain('password/reset');
  });

});