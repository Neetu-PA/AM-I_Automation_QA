export const constants = {
  reportPath: "./reports/report.html",
  headlessMode: false,
  BASE_URL: 'https://playwright.dev',
  isTestRailRun: process.env.isTestRailRun === "true" ?? false,
};
