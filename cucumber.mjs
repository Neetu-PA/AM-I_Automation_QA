import fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const getWorldParams = () => {
  return {
    environment: process.env.NODE_ENV || 'dev',
    baseUrl: process.env.BASE_URL || 'https://playwright.dev',
    apiBaseUrl: process.env.API_BASE_URL || 'https://catfact.ninja/',
    headless: process.env.HEADLESS !== 'false',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  };
};

const config = {
  requireModule: ['ts-node/register'],
  require: [
    'src/**/*.ts'  // Keep it simple - your existing structure
  ],
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    'summary',
    'progress-bar',
  ],
  formatOptions: { 
    snippetInterface: 'async-await'
  },
  worldParameters: getWorldParams(),
  publishQuiet: true,
  parallel: parseInt(process.env.PARALLEL_WORKERS || '1'),
  retry: parseInt(process.env.RETRY_COUNT || '0'),
  tags: process.env.CUCUMBER_TAGS || 'not @ignore',
  dryRun: process.env.DRY_RUN === 'true',
};

// Allure reporting (optional - install allure-cucumberjs if needed)
// if (process.env.USE_ALLURE === 'true') {
//   config.format.push('node_modules/allure-cucumberjs:reports/allure-results');
// }

// Environment-specific configurations
const environment = process.env.NODE_ENV || 'dev';
if (environment === 'ci') {
  config.format.push('junit:reports/junit-results.xml');
}

// Clean up old reports
const cleanupReports = () => {
  const reportPaths = [
    'reports/cucumber-report.json',
    'reports/cucumber-report.html',
    'reports/junit-results.xml'
  ];
  
  reportPaths.forEach(reportPath => {
    if (fs.existsSync(reportPath)) {
      try {
        fs.unlinkSync(reportPath);
        console.log(`Cleaned up old report: ${reportPath}`);
      } catch (err) {
        console.warn(`Failed to cleanup report ${reportPath}:`, err.message);
      }
    }
  });
};

// Cleanup reports if not in CI
if (!process.env.CI) {
  cleanupReports();
}

export default config;
