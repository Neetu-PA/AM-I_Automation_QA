/**
 * Performance spec
 * -----------------
 * Captures real browser performance metrics.
 * Results saved to test-results/performance.json
 *
 * Tags: @smoke | @regression
 */

import { test, expect } from '../fixtures';
import { CarstockPage } from '../pages/carstock.page';
import * as fs from 'fs';

type PerfResult = {
  page:      string;
  ttfb:      number;
  domLoad:   number;
  fullLoad:  number;
  browser:   string;
  timestamp: string;
};

const results: PerfResult[] = [];

async function capturePerf(
  page: import('@playwright/test').Page,
  pageName: string,
) {
  const data = await page.evaluate(() => {
    const nav   = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const fcp   = paint.find(p => p.name === 'first-contentful-paint');
    return {
      ttfb:     Math.round(nav.responseStart - nav.requestStart),
      domLoad:  Math.round(nav.domContentLoadedEventEnd - nav.startTime),
      fullLoad: Math.round(nav.loadEventEnd - nav.startTime),
      fcp:      fcp ? Math.round(fcp.startTime) : null,
    };
  });

  const browser = page.context().browser()?.browserType().name() || 'unknown';
  console.log(`\n📊 Performance — ${pageName} [${browser}]`);
  console.log(`   TTFB:      ${data.ttfb}ms     ${data.ttfb < 800   ? '✅' : '⚠️'}`);
  console.log(`   FCP:       ${data.fcp ?? 'n/a'}ms  ${(data.fcp ?? 0) < 1800 ? '✅' : '⚠️'}`);
  console.log(`   DOM Load:  ${data.domLoad}ms   ${data.domLoad < 3000  ? '✅' : '⚠️'}`);
  console.log(`   Full Load: ${data.fullLoad}ms  ${data.fullLoad < 5000 ? '✅' : '⚠️'}`);

  results.push({
    page:      pageName,
    browser,
    ttfb:      data.ttfb,
    domLoad:   data.domLoad,
    fullLoad:  data.fullLoad,
    timestamp: new Date().toISOString(),
  });

  return data;
}

test.describe('performance — page load timings', () => {

  // Login page — no auth needed
  test('login page load time @smoke', async ({ page, loginPage }) => {
    await loginPage.navigate();
    const perf = await capturePerf(page, 'Login page');

    expect(perf.ttfb,    'TTFB under 800ms').toBeLessThan(800);
    expect(perf.domLoad, 'DOM load under 3s').toBeLessThan(3000);
    expect(perf.fullLoad,'Full load under 5s').toBeLessThan(5000);
  });

  // Carstock page — needs auth, uses loggedInPage
  test('carstock create page load time @smoke', async ({ loggedInPage }) => {
    const carstockPage = new CarstockPage(loggedInPage);
    await loggedInPage.waitForLoadState('domcontentloaded');
    await carstockPage.navigate();

    const perf = await capturePerf(loggedInPage, 'Carstock create page');

    expect(perf.ttfb,    'TTFB under 800ms').toBeLessThan(800);
    expect(perf.domLoad, 'DOM load under 3s').toBeLessThan(3000);
    expect(perf.fullLoad,'Full load under 5s').toBeLessThan(5000);
  });

  // Full E2E timing — needs auth
  test('carstock create flow — end to end timing @regression', async ({ loggedInPage }) => {
    const carstockPage = new CarstockPage(loggedInPage);
    const start        = Date.now();

    await loggedInPage.waitForLoadState('domcontentloaded');
    await carstockPage.navigate();
    const { id } = await carstockPage.createStock();
    await carstockPage.waitForDetailPage();

    const totalTime = Date.now() - start;
    console.log(`\n⏱️  CarStock create E2E: ${totalTime}ms`);

    expect(id).toBeTruthy();
    expect(totalTime, 'Full create flow under 20s').toBeLessThan(20000);
  });

});

test.afterAll(async () => {
  if (results.length === 0) return;
  const outputPath = 'test-results/performance.json';
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Performance results saved to ${outputPath}`);
});