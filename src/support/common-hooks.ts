/**
 * Cucumber Hooks - Test setup & cleanup
 * Handles browser lifecycle and test preparation
 */

import { ICustomWorld } from './world';
import { config } from './config';
import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, firefox, webkit, ConsoleMessage } from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';

let browser: Browser;
const tracesDir = 'reports/traces';

const contextOptions = {
  acceptDownloads: true,
  recordVideo: process.env.PWVIDEO ? { dir: 'videos/' } : undefined,
  viewport: { width: 1280, height: 720 },
};

setDefaultTimeout(5 * 60 * 1000);

// Launch browser once before all tests
BeforeAll(async function () {
  console.log('🚀 Starting test execution...');
  await ensureDir(tracesDir);
  
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }
  
  console.log(`✅ Browser launched: ${config.browser}`);
});

// Skip tests with @ignore tag
Before({ tags: '@ignore' }, async function () {
  return 'skipped' as any;
});

// Setup before each test
Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  console.log(`📝 Setting up test: ${pickle.name}`);
  
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  
  // Create new context & page
  this.context = await browser.newContext(contextOptions);
  this.page = await this.context.newPage();
  
  // Initialize page objects
  this.homePage = new HomePage(this.page);
  this.loginPage = new LoginPage(this.page);
  this.forgotPasswordPage = new ForgotPasswordPage(this.page);
  
  // Log console errors
  this.page.on('console', async (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      console.error(`Console error: ${msg.text()}`);
    }
  });
  
  console.log('✅ Test setup complete');
});

// Cleanup after each test
After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (!this.page || !this.context) return;
  
  const duration = ((new Date().getTime() - (this.startTime?.getTime() || 0)) / 1000).toFixed(2);
  console.log(`⏱️  Test duration: ${duration}s`);
  
  // Attach info
  this.attach(`Status: ${result?.status.toUpperCase()}. Duration: ${duration}s`, 'text/plain');
  
  // Screenshot on failure
  if (result?.status === Status.FAILED && config.ENABLE_SCREENSHOTS) {
    const screenshot = await this.page.screenshot({
      path: `reports/screenshots/${this.testName}.png`,
      fullPage: true,
    });
    this.attach(screenshot, 'image/png');
  }
  
  // Close browser context
  await this.context.close();
  console.log('🧹 Test cleanup complete');
});

// Close browser after all tests
AfterAll(async function () {
  console.log('🏁 All tests completed');
  if (browser) {
    await browser.close();
    console.log('✅ Browser closed');
  }
  console.log('📊 Check reports/ folder for test results');
});
