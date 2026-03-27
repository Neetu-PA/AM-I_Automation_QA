/**
 * LoginPage - Handles AM-I two-step login flow
 * Step 1: Username + Language + Continue
 * Step 2: Password + Sign in
 */

import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // Element locators
  private get elements() {
    return {
      usernameInput: this.page.locator('input[type="text"], input[placeholder*="Username" i], input[placeholder*="Email" i]').first(),
      languageDropdown: this.page.locator('select, [role="combobox"]').first(),
      continueButton: this.page.locator('button:has-text("Continue"), button[type="submit"]').first(),
      passwordInput: this.page.locator('input[type="password"]').first(),
      signInButton: this.page.locator('button:has-text("Sign in"), button:has-text("Sign In")').first(),
      forgotPasswordLink: this.page.locator('a:has-text("vergeten"), a:has-text("forgot"), a:has-text("Forgot Password")').first(),
      errorMessage: this.page.locator('.error, .error-message, [role="alert"], .alert-danger, .text-danger, .notification, .toast, div[class*="error"], div[class*="alert"]').first(),
    };
  }

  // Navigate to login page
  async navigate(url?: string): Promise<void> {
    await this.page.goto(url || '/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Step 1: Enter username
  async enterUsername(username: string): Promise<void> {
    await this.elements.usernameInput.waitFor({ timeout: 10000 });
    await this.elements.usernameInput.fill(username);
  }

  // Step 1: Select language
  async selectLanguage(language: string): Promise<void> {
    try {
      const currentText = await this.elements.languageDropdown.textContent() || '';
      if (currentText.toLowerCase().includes(language.toLowerCase())) {
        console.log(`Language already set to ${language}`);
        return;
      }
      await this.elements.languageDropdown.selectOption({ label: language }, { timeout: 2000 });
    } catch {
      console.log(`Skipping language change - likely already correct or custom dropdown`);
    }
  }

  // Step 1: Click Continue (waits for Step 2 to appear)
  async clickContinue(): Promise<void> {
    await this.elements.continueButton.click();
    try {
      await this.elements.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      console.log('Password field did not appear after Continue');
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  // Step 2: Enter password
  async enterPassword(password: string): Promise<void> {
    await this.elements.passwordInput.waitFor({ timeout: 10000 });
    await this.elements.passwordInput.fill(password);
  }

  // Step 2: Click Sign in
  async clickLogin(): Promise<void> {
    try {
      if (await this.elements.signInButton.isVisible({ timeout: 2000 })) {
        await this.elements.signInButton.click();
      } else {
        await this.page.locator('button[type="submit"]').first().click();
      }
    } catch {
      await this.page.locator('button[type="submit"]').first().click();
    }
  }

  // Complete full login flow
  async login(username: string, password: string, language: string = 'English'): Promise<void> {
    await this.enterUsername(username);
    await this.selectLanguage(language);
    await this.clickContinue();
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Check for error message
  async hasErrorMessage(): Promise<boolean> {
    try {
      await this.elements.errorMessage.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Get error text (tries multiple methods)
  async getErrorMessage(): Promise<string> {
    try {
      await this.elements.errorMessage.waitFor({ timeout: 5000 });
      
      let text = await this.elements.errorMessage.textContent();
      if (text && text.trim()) return text.trim();
      
      text = await this.elements.errorMessage.innerText();
      if (text && text.trim()) return text.trim();
      
      const allText = await this.elements.errorMessage.allTextContents();
      if (allText && allText.length > 0) return allText.join(' ').trim();
      
      return '';
    } catch {
      return '';
    }
  }

  // Check if logged in (URL changed from /login)
  async isLoggedIn(): Promise<boolean> {
    return !this.page.url().includes('/login');
  }

  // Get current URL
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Validate page loaded
  async validatePageLoaded(): Promise<boolean> {
    try {
      await this.elements.usernameInput.waitFor({ timeout: 10000 });
      await this.elements.continueButton.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Click forgot password link (on password screen)
  async clickForgotPassword(): Promise<void> {
    await this.elements.forgotPasswordLink.waitFor({ timeout: 5000 });
    await this.elements.forgotPasswordLink.click();
    await this.page.waitForURL('**/password/reset**', { timeout: 10000 });
  }
}
