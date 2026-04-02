/**
 * Carstock spec — create flow E2E
 * --------------------------------
 * Based on dev repo test patterns.
 * Uses storageState (logged in via auth.setup.ts).
 *
 * Tags: @smoke = critical path | @regression = full suite
 */

import { test, expect } from '../fixtures';

test.describe('carstock create flow', () => {

  test.beforeEach(async ({ carstockPage }) => {
    await carstockPage.navigate();
  });

  // ─── Smoke ──────────────────────────────────────────────────────────────────

  test('create page loads with action block @smoke', async ({ carstockPage }) => {
    await expect(carstockPage.actionBlock).toBeVisible();
  });

  test('create stock with start blank flow @smoke', async ({ carstockPage }) => {
    const { id, vin } = await carstockPage.createStock();

    // Redirected to detail page
    expect(id).toBeTruthy();
    expect(carstockPage.page.url()).toMatch(/\/stock\/\d+$/);

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
    expect(statusDealer).toBe(dealer);
  });

  test('create stock — brand shows in specs block @regression', async ({ carstockPage }) => {
    const { brand } = await carstockPage.createStock();

    await carstockPage.waitForDetailPage();
    const specsBrand = await carstockPage.getSpecsFieldValue('brand');
    expect(specsBrand).toBe(brand);
  });

  test('create stock — imported defaults to No @regression', async ({ carstockPage }) => {
    await carstockPage.createStock();

    await carstockPage.waitForDetailPage();
    const imported = await carstockPage.getSpecsFieldValue('imported');
    expect(imported).toBe('No');
  });

  test('create stock with custom VIN @regression', async ({ carstockPage }) => {
    const customVin = `TEST${Date.now().toString().slice(-9)}`.toUpperCase();
    const { vin } = await carstockPage.createStock({ vin: customVin });

    expect(vin).toBe(customVin);
    await carstockPage.waitForDetailPage();

    const chassisNumber = await carstockPage.getChassisNumber();
    expect(chassisNumber).toContain(customVin);
  });

});