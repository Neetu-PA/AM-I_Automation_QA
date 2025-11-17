/**
 * Login Step Definitions
 * Connects Gherkin steps to LoginPage actions
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';
import { config } from '../support/config';

// ============================================
// NAVIGATION
// ============================================

Given('I navigate to the login page', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.navigate(config.LOGIN_URL);
  const isLoaded = await this.loginPage.validatePageLoaded();
  if (!isLoaded) throw new Error('Login page did not load');
});

Given('I navigate to the login page {string}', async function (this: ICustomWorld, url: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.navigate(url);
  const isLoaded = await this.loginPage.validatePageLoaded();
  if (!isLoaded) throw new Error('Login page did not load');
});

// ============================================
// ENTER CREDENTIALS (Generic - uses config)
// ============================================

When('I enter valid username', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterUsername(config.TEST_USER.username);
});

When('I enter invalid username', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterUsername('invalid_user_' + Date.now());
});

When('I enter valid password', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterPassword(config.TEST_USER.password);
});

When('I enter invalid password', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterPassword('WrongPassword123!');
});

When('I leave username empty', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterUsername('');
});

When('I leave password empty', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterPassword('');
});

// ============================================
// ENTER CREDENTIALS (Specific values)
// ============================================

When('I enter username {string}', async function (this: ICustomWorld, username: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterUsername(username);
});

When('I enter password {string}', async function (this: ICustomWorld, password: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterPassword(password);
});

When('I enter username {string} and password {string}', 
  async function (this: ICustomWorld, username: string, password: string) {
    if (!this.loginPage) throw new Error('LoginPage not initialized');
    await this.loginPage.enterUsername(username);
    await this.loginPage.enterPassword(password);
  }
);

// ============================================
// LANGUAGE SELECTION
// ============================================

When('I select valid language', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.selectLanguage(config.TEST_USER.language);
});

When('I select language {string}', async function (this: ICustomWorld, language: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.selectLanguage(language);
});

// ============================================
// BUTTON CLICKS
// ============================================

When('I click Continue', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.clickContinue();
});

When('I click Sign in', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.clickLogin();
});

When('I click the login button', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.clickLogin();
});

// ============================================
// FULL LOGIN FLOW
// ============================================

When('I login with username {string} and password {string}', 
  async function (this: ICustomWorld, username: string, password: string) {
    if (!this.loginPage) throw new Error('LoginPage not initialized');
    await this.loginPage.login(username, password);
  }
);

When('I login with valid credentials', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.login(
    config.TEST_USER.username,
    config.TEST_USER.password,
    config.TEST_USER.language
  );
});

// ============================================
// VERIFICATION - SUCCESS
// ============================================

Then('I should be logged in successfully', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  
  // Wait for redirect
  await this.page?.waitForTimeout(3000);
  
  const currentUrl = await this.loginPage.getCurrentUrl();
  console.log(`Current URL after login: ${currentUrl}`);
  
  // Check if we're no longer on login page
  const isLoggedIn = await this.loginPage.isLoggedIn();
  if (!isLoggedIn) {
    const errorMsg = await this.loginPage.getErrorMessage();
    if (errorMsg) console.log(`Error message on page: ${errorMsg}`);
    throw new Error('Login failed - still on login page. Check credentials.');
  }
  
  console.log('✅ Login successful - navigated away from login page');
});

Then('I should see the dashboard', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');
  
  // Wait for dashboard to load
  await this.page.waitForTimeout(2000);
  
  const currentUrl = await this.page.url();
  console.log(`Dashboard URL: ${currentUrl}`);
  
  // Check if URL contains "dashboard"
  expect(currentUrl).toContain('dashboard');
  console.log('✅ Dashboard loaded successfully');
});

// ============================================
// VERIFICATION - FAILURE
// ============================================

Then('I should not be logged in', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  
  await this.page?.waitForTimeout(2000);
  
  const isLoggedIn = await this.loginPage.isLoggedIn();
  console.log(`🔍 Is logged in: ${isLoggedIn}`);
  expect(isLoggedIn).toBe(false);
});

Then('I should still be on the login page', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');
  
  const currentUrl = await this.page.url();
  console.log(`🔍 Current URL: ${currentUrl}`);
  
  expect(currentUrl).toContain('/login');
  console.log('✅ Still on login page - login failed as expected');
});

// ============================================
// VERIFICATION - ERROR MESSAGES
// ============================================

Then('I should see an error message', async function (this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  
  const hasError = await this.loginPage.hasErrorMessage();
  expect(hasError).toBe(true);
});

Then('I should see an error message {string}', async function (this: ICustomWorld, expectedMessage: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage.toLowerCase()).toContain(expectedMessage.toLowerCase());
});

Then('the error message should contain {string}', async function (this: ICustomWorld, expectedText: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  
  const errorMessage = await this.loginPage.getErrorMessage();
  console.log(`\n🔍 Looking for: "${expectedText}"`);
  console.log(`📝 Found error text: "${errorMessage}"`);
  
  if (!errorMessage || errorMessage.length === 0) {
    console.log('⚠️  Error element found but text is empty. Checking page content...');
    const pageText = await this.page?.textContent('body') || '';
    
    if (pageText.toLowerCase().includes(expectedText.toLowerCase())) {
      console.log(`✅ Text "${expectedText}" found somewhere on page. Test passes.`);
      return;
    }
    
    const visibleText = pageText.substring(0, 500);
    console.log(`Page content preview: ${visibleText}...`);
  }
  
  expect(errorMessage.toLowerCase()).toContain(expectedText.toLowerCase());
});

// ============================================
// VERIFICATION - VALIDATION ERRORS
// ============================================

Then('I should see a validation error for username', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');
  
  const usernameError = this.page.locator('#username-error, [data-testid="username-error"], .username-error, [role="alert"]');
  await expect(usernameError.first()).toBeVisible({ timeout: 5000 });
});

Then('I should see a validation error for password', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');
  
  const passwordError = this.page.locator('#password-error, [data-testid="password-error"], .password-error, [role="alert"]');
  await expect(passwordError.first()).toBeVisible({ timeout: 5000 });
});

// ============================================
// SCENARIO OUTLINE SUPPORT
// ============================================

Then('I should see {string}', async function (this: ICustomWorld, expectedResult: string) {
  if (expectedResult.toLowerCase().includes('logged in')) {
    await this.page?.waitForLoadState('networkidle');
    const hasError = await this.loginPage?.hasErrorMessage();
    expect(hasError).toBe(false);
  } else if (expectedResult.toLowerCase().includes('error')) {
    const hasError = await this.loginPage?.hasErrorMessage();
    expect(hasError).toBe(true);
  }
});

