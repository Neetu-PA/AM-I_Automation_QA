/**
 * Common Step Definitions
 * Reusable steps for any feature
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';

// Navigation
Given('I am on the home page', async function (this: ICustomWorld) {
  if (!this.homePage) throw new Error('HomePage not initialized');
  await this.homePage.navigate();
});

Given('I navigate to {string}', async function (this: ICustomWorld, url: string) {
  await this.page?.goto(url);
});

// Page interactions
When('I wait for {int} seconds', async function (this: ICustomWorld, seconds: number) {
  await this.page?.waitForTimeout(seconds * 1000);
});

When('I reload the page', async function (this: ICustomWorld) {
  await this.page?.reload();
});

When('I go back', async function (this: ICustomWorld) {
  await this.page?.goBack();
});

// Verifications
Then('the page title should be {string}', async function (this: ICustomWorld, expectedTitle: string) {
  const title = await this.page?.title();
  expect(title).toBe(expectedTitle);
});

Then('the URL should contain {string}', async function (this: ICustomWorld, expectedUrl: string) {
  const currentUrl = this.page?.url();
  expect(currentUrl).toContain(expectedUrl);
});

Then('the page should be loaded', async function (this: ICustomWorld) {
  await this.page?.waitForLoadState('networkidle');
});

// Element interactions
When('I click on {string}', async function (this: ICustomWorld, text: string) {
  await this.page?.getByText(text).click();
});

When('I fill {string} with {string}', async function (this: ICustomWorld, field: string, value: string) {
  await this.page?.getByLabel(field).fill(value);
});

Then('I should see {string} on the page', async function (this: ICustomWorld, text: string) {
  if (!this.page) throw new Error('Page not initialized');
  await expect(this.page.getByText(text).first()).toBeVisible();
});

Then('{string} should be visible', async function (this: ICustomWorld, text: string) {
  if (!this.page) throw new Error('Page not initialized');
  await expect(this.page.getByText(text).first()).toBeVisible();
});
