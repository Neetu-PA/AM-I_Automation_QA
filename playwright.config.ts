import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line'],

  ],

  use: {
    baseURL: process.env.WEBDEALER_BASE_URL || 'https://your-app.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ── 1. Auth setup — runs FIRST, once, saves session ──────────────────────
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // ── 2. Chromium — uses saved session ─────────────────────────────────────
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/storage-states/auth.json', // ← logged in already
      },
      dependencies: ['setup'], // waits for setup to finish first
    },

    // ── 3. Firefox — uses saved session ──────────────────────────────────────
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'tests/storage-states/auth.json',
      },
      dependencies: ['setup'],
    },

    // ── 4. WebKit — uses saved session ───────────────────────────────────────
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'tests/storage-states/auth.json',
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
  timeout: 30_000,
  expect: { timeout: 5_000 },
});