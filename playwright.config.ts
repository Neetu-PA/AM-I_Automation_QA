/**
 * Default Playwright config — used for:
 * - Local: `npx playwright test`
 * - BrowserStack: `browserstack-node-sdk playwright test`
 *
 * WHAT CHANGED:
 *   ✅ Project names now descriptive — shows in BS session name
 *   ✅ Added mobile device projects for local emulation testing
 *   ✅ Retries bumped to 2 for CI stability
 *   ✅ JSON + JUnit reporters for Slack integration
 */
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const browserstackLike = Boolean(
  process.env.BS_ACCESS_KEY ||
    process.env.BS_USERNAME ||
    process.env.BROWSERSTACK_ACCESS_KEY ||
    process.env.BROWSERSTACK_ACCESSKEY ||
    process.env.BROWSERSTACK_USERNAME ||
    process.env.BROWSERSTACK_USER ||
    process.env.BROWSERSTACK_TESTHUB_UUID ||
    process.env.BROWSERSTACK_BUILD_NAME,
);

export default defineConfig({
  testDir: './tests',
  testIgnore:
    process.env.RUN_PERFORMANCE_TESTS === '1' ? [] : ['**/performance.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Flaky RSC / network on Automate — same retries as CI when BS env is present.
  retries: process.env.CI || browserstackLike ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line'],
  ],

  use: {
    baseURL: process.env.WEBDEALER_BASE_URL || 'https://webdealer.pr.dev.am-i.nl',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ── Desktop Browsers ────────────────────────────────
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'Desktop Edge',
      use: {
        ...devices['Desktop Edge'],
      },
    },

    // ── Mobile Emulation (local only — BS uses real devices) ──
    {
      name: 'iPhone 15 Pro',
      use: {
        ...devices['iPhone 15 Pro'],
      },
    },
    {
      name: 'Galaxy S24',
      use: {
        ...devices['Pixel 7'],  // closest Playwright emulation to S24
      },
    },
  ],

  outputDir: 'test-results/',
  timeout: 30_000,
  expect: { timeout: 5_000 },
});