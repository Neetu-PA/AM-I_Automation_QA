/**
 * Carstock spec — create flow E2E
 * --------------------------------
 * Based on dev repo test patterns.
 * Uses storageState (logged in via auth.setup.ts).
 *
 * Tags: @smoke = critical path | @regression = full suite
 */

import { test, expect } from '../fixtures';
import { CarstockPage } from '../pages/carstock.page';
import { carstockCreatePageReadyTimeoutMs, isBrowserStackLikeEnv } from '../helpers/carstock.helpers';

test.describe('carstock create flow', () => {

  // Serial: if one test fails, Playwright skips the rest in this block (shown as "-" in the report).
  test.describe.configure({ mode: 'serial' });
  // BrowserStack: login + RSC create page + actions need headroom beyond 60s on slow platforms.
  test.setTimeout(
    isBrowserStackLikeEnv() ? carstockCreatePageReadyTimeoutMs() + 90_000 : 90_000,
  );


  test.beforeEach(async ({ loggedInPage }) => {
    await loggedInPage.waitForLoadState('domcontentloaded');
    const carstockPage = new CarstockPage(loggedInPage);
    await carstockPage.navigate();
  });


  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.waitForLoadState('domcontentloaded');
  });


  // ─── Smoke ──────────────────────────────────────────────────────────────────

  test('create page loads with action block @smoke', async ({ loggedInPage }) => {
    const carstockPage = new CarstockPage(loggedInPage);
    await expect(carstockPage.actionBlock).toBeVisible({
      timeout: carstockCreatePageReadyTimeoutMs(),
    });
  });


  test('create stock with start blank flow @smoke', async ({ loggedInPage }) => {
    const carstockPage = new CarstockPage(loggedInPage);
    const { id, vin } = await carstockPage.createStock();
    // Redirected to detail page
    expect(id).toBeTruthy();
    expect(loggedInPage.url()).toMatch(/\/stock\/\d+$/);

    // Header visible with correct VIN
    await carstockPage.waitForDetailPage();
    await expect(carstockPage.stockDetailsHeader).toBeVisible();

    const chassisNumber = await carstockPage.getChassisNumber();
    expect(chassisNumber).toContain(vin);
  });

  // ─── Regression ─────────────────────────────────────────────────────────────

  test('required field validation — dealer and brand @regression', async ({ carstockPage }) => {
    await carstockPage.triggerValidation();

    const dealerError = await carstockPage.isDealerErrorVisible();
    const brandError = await carstockPage.isBrandErrorVisible();
    const vinError = await carstockPage.isVinMandatoryErrorVisible();

    expect(dealerError).toBe(true);
    expect(brandError).toBe(true);
    expect(vinError).toBe(true);
  });

  test('create stock — dealer shows in status block @regression', async ({ carstockPage }) => {
    const { dealer } = await carstockPage.createStock();

    await carstockPage.waitForDetailPage();
    const statusDealer = await carstockPage.getStatusFieldValue('dealer');
    // Dropdown label vs API `financialOwnerDisplayValue` can differ by case/spacing
    expect(statusDealer.replace(/\s+/g, ' ').trim().toLowerCase()).toBe(
      dealer.replace(/\s+/g, ' ').trim().toLowerCase(),
    );
  });

  test('create stock — brand shows in specs block @regression', async ({ carstockPage }) => {
    const { brand } = await carstockPage.createStock();

    await carstockPage.waitForDetailPage();
    await carstockPage.waitForSpecsFieldResolved('brand');
    const specsBrand = await carstockPage.getSpecsFieldValue('brand');
    // Create form label vs specs `brandDescription` (nl_NL) can differ slightly; "-" was async placeholder
    expect(specsBrand.replace(/\s+/g, ' ').trim().toLowerCase()).toBe(
      brand.replace(/\s+/g, ' ').trim().toLowerCase(),
    );
  });

  test('create stock — imported defaults to No @regression', async ({ carstockPage }) => {
    await carstockPage.createStock();

    await carstockPage.waitForDetailPage();
    const imported = await carstockPage.getSpecsFieldValue('imported');
    expect(imported).toBe('No');
  });

  test('create stock with custom VIN @regression', async ({ carstockPage }) => {
    // Webdealer BlankSchema requires chassisNo length === 17 (TakeActionSchema CHASSIS_NO_LENGTH)
    const customVin = `TEST${Date.now().toString().padStart(13, '0').slice(-13)}`.toUpperCase();
    expect(customVin).toHaveLength(17);

    const { vin } = await carstockPage.createStock({ vin: customVin });

    expect(vin).toBe(customVin);
    await carstockPage.waitForDetailPage();

    const chassisNumber = await carstockPage.getChassisNumber();
    expect(chassisNumber).toContain(customVin);
  });

});