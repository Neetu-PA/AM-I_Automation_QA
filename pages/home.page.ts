/**
 * HomePage - Example page object
 * Shows how to structure page objects for your application
 */

import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  // Element locators
  private get elements() {
    return {
      getStartedLink: this.page.locator('a:has-text("Get started")').first(),
      heading: this.page.locator('h1').first(),
      navigation: this.page.locator('nav').first(),
      searchBox: this.page.locator('[placeholder="Search"]').first(),
    };
  }

  // Navigate to home page
  async navigate(url?: string): Promise<void> {
    await this.page.goto(url || '/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Click Get Started link
  async clickGetStarted(): Promise<void> {
    await this.elements.getStartedLink.click();
  }

  // Get page title
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  // Search
  async search(query: string): Promise<void> {
    await this.elements.searchBox.fill(query);
    await this.elements.searchBox.press('Enter');
  }

  // Validate page loaded
  async validatePageLoaded(): Promise<boolean> {
    try {
      await this.elements.heading.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
