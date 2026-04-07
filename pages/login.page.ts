/**
 * LoginPage — AM-I platform login (shared)
 * ------------------------------------------
 * Entry point for all AM-I services (Webdealer, CRM, etc.).
 * Login is hosted on the Webdealer domain; CRM middleware redirects here.
 * Selectors confirmed from webdealer LoginForm.tsx using getByTestId.
 */

import { Page } from '@playwright/test';

export class LoginPage {
  constructor(public page: Page) {}

  private get elements() {
    return {
      usernameInput:      this.page.getByTestId('email'),
      continueButton:     this.page.getByTestId('continueButton'),
      passwordInput:      this.page.getByTestId('password'),
      signInButton:       this.page.getByTestId('signInButton'),
      // LoginForm.tsx: Link wraps Button — no data-testid on forgot password
      forgotPasswordLink: this.page
                            .getByRole('link', { name: /forgot|vergeten/i })
                            .first(),
      // LoginForm setError() — top FormHelperText; EN/NL copy from webdealer messages/*.json
      errorMessage:       this.page
                            .getByText(
                              /Please enter valid username and password|Voer een geldige gebruikersnaam en wachtwoord in|The action was not executed|De actie werd niet uitgevoerd/i,
                            )
                            .or(this.page.locator('form .MuiFormHelperText-root.text-primary'))
                            .or(this.page.getByTestId('error-alert'))
                            .or(this.page.locator('[role="alert"]'))
                            .first(),
    };
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate(redirectUrl = '/dashboard-v2'): Promise<void> {
    await this.page.goto(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async enterUsername(username: string): Promise<void> {
    await this.elements.usernameInput.waitFor({ timeout: 10000 });
    await this.elements.usernameInput.fill(username);
  }

  async clickContinue(): Promise<void> {
    await this.elements.continueButton.click();
    // For basic auth users, password field appears in ~2-3s after getLoginMethod API call.
    // For empty/invalid email, zod validation fails instantly — no API call, no password field.
    try {
      await this.elements.passwordInput.waitFor({ state: 'visible', timeout: 5_000 });
    } catch {
      /* password field didn't appear — invalid email or SSO redirect */
    }
  }

  async enterPassword(password: string): Promise<void> {
    await this.elements.passwordInput.waitFor({ timeout: 10000 });
    await this.elements.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.elements.signInButton.click();
  }

  // ─── Combined flow ─────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.clickContinue();
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  // ─── Forgot password ───────────────────────────────────────────────────────

  async clickForgotPassword(): Promise<void> {
    await this.elements.forgotPasswordLink.waitFor({ state: 'visible', timeout: 10_000 });
    await this.elements.forgotPasswordLink.click();
    await this.page.waitForURL(/password\/reset/, { timeout: 15_000 });
  }

  // ─── State checks ──────────────────────────────────────────────────────────

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForURL(
        url => !url.pathname.includes('/login'),
        { timeout: 15_000 },
      );
      return true;
    } catch {
      return false;
    }
  }

  async hasErrorMessage(): Promise<boolean> {
    try {
      await this.elements.errorMessage.waitFor({ state: 'visible', timeout: 20_000 });
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
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}