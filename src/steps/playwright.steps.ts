/**
 * Playwright-Specific Step Definitions
 * Examples for Playwright website tests
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';

// Navigation
Given('I am on the Playwright home page', async function (this: ICustomWorld) {
  if (!this.homePage) throw new Error('HomePage not initialized. Check common-hooks.ts');
  await this.homePage.navigate('https://playwright.dev');
});

// Actions
When('I click the Get Started button', async function (this: ICustomWorld) {
  if (!this.homePage) throw new Error('HomePage not initialized');
  await this.homePage.clickGetStarted();
});

When('I search for {string}', async function (this: ICustomWorld, query: string) {
  if (!this.homePage) throw new Error('HomePage not initialized');
  await this.homePage.search(query);
});

// Verifications
Then('I should be on the documentation page', async function (this: ICustomWorld) {
  const url = this.page?.url();
  expect(url).toContain('docs');
});

Then('the page title should contain {string}', async function (this: ICustomWorld, expectedText: string) {
  if (!this.homePage) throw new Error('HomePage not initialized');
  const title = await this.homePage.getTitle();
  expect(title).toContain(expectedText);
});
