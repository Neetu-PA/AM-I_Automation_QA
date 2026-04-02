/**
 * FIXTURES
 * --------
 * Wires all page objects into Playwright's test context.
 * Import { test, expect } from '../fixtures' in every spec file.
 * Never import from @playwright/test directly in spec files.
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { CarstockPage } from '../pages/carstock.page';

type Pages = {
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  carstockPage: CarstockPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  carstockPage: async ({ page }, use) => {
    await use(new CarstockPage(page));
  },
});

export { expect } from '@playwright/test';