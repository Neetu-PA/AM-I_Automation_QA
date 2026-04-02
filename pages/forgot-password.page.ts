/**
 * ForgotPasswordPage — Password reset flow
 * -----------------------------------------
 * Selectors are managed in locators/forgot-password.locators.ts
 * Do NOT write any raw selectors in this file.
 */

import { Page } from '@playwright/test';
import { ForgotPasswordLocators, forgotSel } from '../locators';

export class ForgotPasswordPage {
  constructor(private page: Page) { }

  private get elements() {
    return {
      emailInput: this.page.locator(forgotSel(ForgotPasswordLocators.emailInput)).first(),
      submitButton: this.page.locator(forgotSel(ForgotPasswordLocators.submitButton)).first(),
      backToLoginLink: this.page.locator(forgotSel(ForgotPasswordLocators.backToLoginLink)).first(),
      confirmationMessage: this.page.locator(forgotSel(ForgotPasswordLocators.confirmationMessage)).first(),
      errorMessage: this.page.locator(forgotSel(ForgotPasswordLocators.errorMessage)).first(),
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

  // ─── Assertions / state checks ─────────────────────────────────────────────

  async isConfirmationVisible(): Promise<boolean> {
    try {
      await this.elements.confirmationMessage.waitFor({ timeout: 8000 });
      return await this.elements.confirmationMessage.isVisible();
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