/**
 * Configuration
 * Loads settings from config/environments/*.json
 * 
 * Usage:
 * - NODE_ENV=dev npm run test (uses dev.json)
 * - NODE_ENV=staging npm run test (uses staging.json)
 * - NODE_ENV=prod npm run test (uses prod.json)
 */

import { LaunchOptions } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load environment config
const environment = process.env.NODE_ENV || 'dev';
const configPath = path.join(process.cwd(), 'config', 'environments', `${environment}.json`);

let envConfig: any = {};
try {
  const configFile = fs.readFileSync(configPath, 'utf-8');
  envConfig = JSON.parse(configFile);
} catch (error) {
  console.warn(`Warning: Could not load ${configPath}. Using defaults.`);
  envConfig = {
    name: environment,
    baseUrl: 'https://webdealer.pr.dev.am-i.nl',
    loginUrl: 'https://webdealer.pr.dev.am-i.nl/login',
    auth: { username: 'test', password: 'test', language: 'English' },
    timeouts: { default: 30000, navigation: 30000 },
    browser: { headless: false }
  };
}

// Browser options
const browserOptions: LaunchOptions = {
  slowMo: envConfig.browser?.slowMo || 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
  headless: process.env.HEADLESS === 'false' ? false : (envConfig.browser?.headless ?? true),
  devtools: envConfig.browser?.devtools || false,
};

// Main config object
export const config = {
  environment: envConfig.name || environment,
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
  
  // URLs
  BASE_URL: envConfig.baseUrl,
  LOGIN_URL: envConfig.loginUrl || `${envConfig.baseUrl}/login`,
  BASE_API_URL: envConfig.apiBaseUrl,
  
  // Test credentials
  TEST_USER: {
    username: envConfig.auth?.username,
    password: envConfig.auth?.password,
    language: envConfig.auth?.language || 'English',
    email: envConfig.auth?.email || `${envConfig.auth?.username}@am-i.nl`,
  },
  
  // Timeouts
  DEFAULT_TIMEOUT: envConfig.timeouts?.default || 30000,
  NAVIGATION_TIMEOUT: envConfig.timeouts?.navigation || 30000,
  ASSERTION_TIMEOUT: envConfig.timeouts?.assertion || 5000,
  
  // Features
  ENABLE_SCREENSHOTS: envConfig.features?.enableScreenshots ?? true,
  ENABLE_VIDEOS: envConfig.features?.enableVideos ?? false,
  ENABLE_MOCKING: envConfig.features?.enableMocking ?? false,
  ENABLE_REPORTING: envConfig.features?.enableReporting ?? true,
  
  // Image comparison
  IMG_THRESHOLD: { threshold: 0.4 },
};
