/**
 * ForgotPasswordPage — Password reset flow
 * -----------------------------------------
 * Uses getByTestId directly — ask dev to confirm testids marked with ← below.
 */

import { Page } from '@playwright/test';

export class ForgotPasswordPage {
  constructor(public page: Page) {}

  private get elements() {
    return {
      emailInput: this.page.getByTestId('reset-email-input')
                    .or(this.page.locator('input[type="email"], input[type="text"]')).first(),
      submitButton: this.page.getByTestId('reset-submit-btn')
                    .or(this.page.locator('button[type="submit"]')).first(),
      backToLoginLink: this.page.getByTestId('back-to-login')
                    .or(this.page.locator('a:has-text("Back"), a:has-text("Login")')).first(),
      confirmationMessage: this.page.getByTestId('reset-confirmation')
                    .or(this.page.locator('.confirmation, [role="alert"]')).first(),
      errorMessage: this.page.getByTestId('reset-error')
                    .or(this.page.locator('[role="alert"], .error')).first(),
    };
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async enterEmail(email: string): Promise<void> {
    await this.elements.emailInput.waitFor({ timeout: 10000 });
    await this.elements.emailInput.fill(email);
  }

  async submitReset(): Promise<void> {
    await this.elements.submitButton.click();
  }

  async requestReset(email: string): Promise<void> {
    await this.enterEmail(email);
    await this.submitReset();
  }

  async clickBackToLogin(): Promise<void> {
    await this.elements.backToLoginLink.click();
    await this.page.waitForURL('**/login**', { timeout: 10000 });
  }

  // ─── State checks ──────────────────────────────────────────────────────────

  async isConfirmationVisible(): Promise<boolean> {
    try {
      await this.elements.confirmationMessage.waitFor({ timeout: 8000 });
      return this.elements.confirmationMessage.isVisible();
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

  async getErrorMessage(): Promise<string> {
    try {
      const text = await this.elements.errorMessage.textContent();
      return text?.trim() || '';
    } catch {
      return '';
    }
  }
}