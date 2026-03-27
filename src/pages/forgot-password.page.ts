/**
 * ForgotPasswordPage - Handles password reset flow
 * URL: /password/reset?email=xxx
 */

import { Page } from '@playwright/test';

export class ForgotPasswordPage {
  constructor(private page: Page) {}

  private get elements() {
    return {
      emailInput: this.page.locator('input[type="text"]').first(),
      sendLinkButton: this.page.locator('button:has-text("Link verzenden"), button:has-text("Send link")').first(),
      backLink: this.page.locator('a:has-text("Terug"), a:has-text("Back")').first(),
      successMessage: this.page.locator(':text("Binnen 5 minuten")').first(),
      toast: this.page.locator('text=/verzonden/i, text=/sent/i, [role="alert"]').first(),
      pageHeading: this.page.locator('text=/Wachtwoord vergeten/i, text=/Forgot Password/i, text=/Password forgotten/i').first(),
    };
  }

  async navigate(email?: string): Promise<void> {
    const url = email 
      ? `/password/reset?email=${encodeURIComponent(email)}`
      : '/password/reset';
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterEmail(email: string): Promise<void> {
    await this.elements.emailInput.waitFor({ timeout: 5000 });
    await this.elements.emailInput.fill(email);
  }

  async clearEmail(): Promise<void> {
    await this.elements.emailInput.clear();
  }

  async getPrefilledEmail(): Promise<string> {
    return await this.elements.emailInput.inputValue();
  }

  async clickSendLink(): Promise<void> {
    await this.elements.sendLinkButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickBack(): Promise<void> {
    await this.elements.backLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    try {
      await this.page.waitForTimeout(3000); // Wait for page to update
      await this.elements.successMessage.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    try {
      await this.page.waitForTimeout(2000);
      const text = await this.elements.successMessage.textContent();
      if (text && text.trim()) return text.trim();
      
      // Fallback: try to find any text containing the key phrases
      const bodyText = await this.page.textContent('body');
      if (bodyText?.includes('Binnen 5 minuten')) {
        return bodyText;
      }
      
      return '';
    } catch {
      return '';
    }
  }

  async isToastVisible(): Promise<boolean> {
    try {
      await this.elements.toast.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getToastMessage(): Promise<string> {
    try {
      const text = await this.elements.toast.textContent();
      return text?.trim() || '';
    } catch {
      return '';
    }
  }

  async isOnForgotPasswordPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('/password/reset');
  }

  async validatePageLoaded(): Promise<boolean> {
    try {
      await this.elements.emailInput.waitFor({ timeout: 5000 });
      await this.elements.sendLinkButton.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

