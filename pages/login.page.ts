/**
 * LoginPage — AM-I two-step login flow
 * -------------------------------------
 * Uses data-testid selectors confirmed from dev repo.
 * Supports storageState session reuse for faster E2E tests.
 */

import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) { }

  // ─── Locators via getByTestId (matches dev repo pattern) ──────────────────
  private get elements() {
    return {
      usernameInput: this.page.getByTestId('email'),
      continueButton: this.page.getByTestId('continueButton'),
      passwordInput: this.page.getByTestId('password'),
      signInButton: this.page.getByTestId('signInButton'),
      // fallback for unconfirmed testids:
      forgotPasswordLink: this.page.getByTestId('forgot-password-link')
        .or(this.page.locator('a:has-text("vergeten"), a:has-text("Forgot")')).first(),
      errorMessage: this.page.getByTestId('error-alert')
        .or(this.page.locator('[role="alert"]')).first(),
      languageDropdown: this.page.getByTestId('language-dropdown')
        .or(this.page.locator('select, [role="combobox"]')).first(),
    };
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate(redirectUrl = '/stock'): Promise<void> {
    await this.page.goto(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── Step 1 actions ────────────────────────────────────────────────────────

  async enterUsername(username: string): Promise<void> {
    await this.elements.usernameInput.waitFor({ timeout: 10000 });
    await this.elements.usernameInput.fill(username);
  }

  async clickContinue(): Promise<void> {
    await this.elements.continueButton.click();
    try {
      await this.elements.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  // ─── Step 2 actions ────────────────────────────────────────────────────────

  async enterPassword(password: string): Promise<void> {
    await this.elements.passwordInput.waitFor({ timeout: 10000 });
    await this.elements.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.elements.signInButton.click();
  }

  // ─── Combined flows ────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.clickContinue();
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  async loginAs(role: 'admin' | 'user' | 'readonly' = 'user'): Promise<void> {
    const credentials: Record<string, { user: string; pass: string }> = {
      admin: { user: process.env.ADMIN_USERNAME!, pass: process.env.ADMIN_PASSWORD! },
      user: { user: process.env.TEST_USERNAME!, pass: process.env.TEST_PASSWORD! },
      readonly: { user: process.env.RO_USERNAME!, pass: process.env.RO_PASSWORD! },
    };
    const { user, pass } = credentials[role];
    await this.login(user, pass);
  }

  // ─── Save session after login (dev repo pattern) ───────────────────────────

  async saveSession(path = 'tests/storage-states/auth.json'): Promise<void> {
    await this.page.context().storageState({ path });
  }

  // ─── Forgot password ───────────────────────────────────────────────────────

  async clickForgotPassword(): Promise<void> {
    await this.elements.forgotPasswordLink.waitFor({ timeout: 5000 });
    await this.elements.forgotPasswordLink.click();
    await this.page.waitForURL('**/password/reset**', { timeout: 10000 });
  }

  // ─── State checks ──────────────────────────────────────────────────────────

  async isLoggedIn(): Promise<boolean> {
    return !this.page.url().includes('/login');
  }

  async hasErrorMessage(): Promise<boolean> {
    try {
      await this.elements.errorMessage.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      const text = await this.elements.errorMessage.textContent();
      return text?.trim() || '';
    } catch {
      return '';
    }
  }

  async validatePageLoaded(): Promise<boolean> {
    try {
      await this.elements.usernameInput.waitFor({ timeout: 10000 });
      await this.elements.continueButton.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}