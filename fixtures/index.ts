/**
 * FIXTURES
 * --------
 * Wires all page objects into Playwright's test context.
 * Import { test, expect } from '../fixtures' in every spec file.
 * Never import from @playwright/test directly in spec files.
 *
 * loggedInPage         — platform-level auth; lands on dashboard-v2 (neutral)
 * webdealerStockPage   — loggedInPage + navigate to Stock via navbar
 * loginPage            — unauthenticated; use only in auth.spec.ts
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { NavigationPage } from '../pages/navigation.page';
import { CarstockPage } from '../pages/carstock.page';

type Pages = {
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  navigationPage: NavigationPage;
  carstockPage: CarstockPage;
  loggedInPage: import('@playwright/test').Page;
  webdealerStockPage: import('@playwright/test').Page;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },

  carstockPage: async ({ page }, use) => {
    await use(new CarstockPage(page));
  },

  // ── Platform login — shared across Webdealer, CRM, and all AM-I services ──
  // Logs in fresh every time — works locally AND on BrowserStack.
  loggedInPage: async ({ page, baseURL }, use) => {
    const loginPage = new LoginPage(page);
    const domain = new URL(baseURL!).hostname;

    await page.context().addCookies([
      { name: 'locale', value: 'en', domain, path: '/' },
      { name: 'language', value: 'en', domain, path: '/' },
    ]);

    await page.goto(`${baseURL}/login?redirectUrl=%2Fdashboard-v2`);
    await loginPage.validatePageLoaded();

    await loginPage.login(
      process.env.TEST_USERNAME as string,
      process.env.TEST_PASSWORD as string,
    );

    await page.waitForURL(
      url => !url.pathname.includes('/login'),
      { timeout: 30_000 },
    );

    await use(page);
  },

  // ── Webdealer Carstock — authenticated + navigated to /stock via navbar ─────
  webdealerStockPage: async ({ loggedInPage }, use) => {
    const nav = new NavigationPage(loggedInPage);
    await nav.navigateToCarstock();
    await use(loggedInPage);
  },
});

export { expect } from '@playwright/test';
 