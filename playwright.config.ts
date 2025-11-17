import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration with MCP Integration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './features',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration with MCP support
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    // MCP Reporter for enhanced context
    ['./src/support/reporters/mcp-reporter.ts'],
    // Allure integration
    process.env.USE_ALLURE ? ['allure-playwright'] : null,
  ].filter(Boolean),
  
  // Global setup and teardown
  globalSetup: './src/support/global-setup.ts',
  globalTeardown: './src/support/global-teardown.ts',
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'https://playwright.dev',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: process.env.PWVIDEO ? 'on' : 'retain-on-failure',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // MCP Context Protocol settings
    extraHTTPHeaders: {
      'X-Test-Framework': 'Playwright-Cucumber-MCP',
      'X-Test-Session': process.env.TEST_SESSION_ID || 'default',
    },
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // MCP specific settings for Chrome
        launchOptions: {
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
        },
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true,
          },
        },
      },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // API testing project
    {
      name: 'api',
      testDir: './src/api/tests',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://catfact.ninja/',
      },
    },
  ],
  
  // Web server configuration for local development
  webServer: process.env.START_LOCAL_SERVER ? {
    command: 'npm run start:dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  } : undefined,
  
  // Output directory
  outputDir: 'test-results/',
  
  // Test timeout
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
});


