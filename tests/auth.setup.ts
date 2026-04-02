/**
 * AUTH SETUP — runs ONCE before all tests
 * ----------------------------------------
 * Logs in, saves session to storage state.
 * All tests reuse the saved session — no repeated logins.
 *
 * Based on dev repo pattern using storageState.
 * Run order defined in playwright.config.ts under projects[setup].
 */

import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_FILE = 'tests/storage-states/auth.json';

setup('authenticate and save session', async ({ page }) => {
  // Ensure storage-states folder exists
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const loginPage = new LoginPage(page);

  await loginPage.navigate('/stock');
  await loginPage.login(
    process.env.TEST_USERNAME as string,
    process.env.TEST_PASSWORD as string,
  );

  // Wait for successful redirect away from /login
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });

  // Save the auth session — all tests load this instead of logging in again
  await loginPage.saveSession(AUTH_FILE);

  console.log(`Session saved to ${AUTH_FILE}`);
});