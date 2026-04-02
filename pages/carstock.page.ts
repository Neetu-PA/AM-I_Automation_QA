/**
 * CarstockPage — Stock creation and detail flows
 * -----------------------------------------------
 * Based on dev repo test patterns.
 * Selectors from locators/carstock.locators.ts
 */

import { Page, Locator } from '@playwright/test';
import {
  generateTestVin,
  selectRandomDropdownOption,
  setLocaleCookies,
  getAttributeElementValue,
} from '../helpers/carstock.helpers';

export class CarstockPage {
  constructor(private page: Page) { }

  // ─── Locators ──────────────────────────────────────────────────────────────

  // Main action block (the create form container)
  get actionBlock(): Locator {
    return this.page.getByTestId('takeActionBlock').first();
  }

  // Create form elements
  get vinInput(): Locator {
    return this.actionBlock.getByRole('textbox', { name: 'VIN' });
  }

  get startBlankButton(): Locator {
    return this.actionBlock.getByRole('button', { name: 'Start blank' });
  }

  get dealerField(): Locator {
    return this.actionBlock.locator('[name="dealer"]');
  }

  get brandField(): Locator {
    return this.actionBlock.locator('[name="brand"]');
  }

  // Post-create detail page
  get stockDetailsHeader(): Locator {
    return this.page.getByTestId('stockDetailsHeader');
  }

  get chassisNumber(): Locator {
    return this.stockDetailsHeader.getByTestId('chassisNumber');
  }

  get statusDetails(): Locator {
    return this.page.getByTestId('statusDetails').first();
  }

  get specificationsDetails(): Locator {
    return this.page.getByTestId('specificationsDetails').first();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await setLocaleCookies(this.page);
    await this.page.goto('/en/stock/create', { waitUntil: 'networkidle' });
    await this.actionBlock.waitFor({ timeout: 15000 });
  }

  // ─── Create flow actions ───────────────────────────────────────────────────

  async fillVin(vin: string): Promise<void> {
    await this.vinInput.fill(vin);
  }

  async clickStartBlank(): Promise<void> {
    await this.startBlankButton.click();
  }

  async selectBrand(): Promise<string> {
    return selectRandomDropdownOption(this.page, 'Brand');
  }

  async selectDealer(): Promise<string> {
    return selectRandomDropdownOption(this.page, 'Financial owner');
  }

  // ─── Full create flow ─────────────────────────────────────────────────────
  // Returns the created stock id extracted from URL

  async createStock(options?: { vin?: string }): Promise<{ id: string; vin: string; brand: string; dealer: string }> {
    const vin = options?.vin || generateTestVin();
    const brand = await this.selectBrand();
    const dealer = await this.selectDealer();

    await this.fillVin(vin);
    await this.clickStartBlank();

    // Wait for redirect to detail page: /stock/123
    await this.page.waitForURL(/.*stock\/\d+$/, { timeout: 15000 });

    const urlParts = this.page.url().split('/');
    const id = urlParts[urlParts.length - 1];

    return { id, vin, brand, dealer };
  }

  // ─── Validation helpers ────────────────────────────────────────────────────

  async triggerValidation(): Promise<void> {
    await this.vinInput.click();
    await this.startBlankButton.click();
  }

  async isDealerErrorVisible(): Promise<boolean> {
    const error = this.dealerField.getByText('Please fill this required field');
    return error.isVisible();
  }

  async isBrandErrorVisible(): Promise<boolean> {
    const error = this.brandField.getByText('Please fill this required field');
    return error.isVisible();
  }

  async isVinMandatoryErrorVisible(): Promise<boolean> {
    const error = this.page.getByText(
      'VIN, license plate number or Brand with Order Id are mandatory'
    );
    return error.isVisible();
  }

  // ─── Detail page helpers ───────────────────────────────────────────────────

  async waitForDetailPage(): Promise<void> {
    await this.stockDetailsHeader.waitFor({ timeout: 15000 });
  }

  async getChassisNumber(): Promise<string> {
    const text = await this.chassisNumber.textContent();
    return text?.trim() || '';
  }

  async getStatusFieldValue(fieldName: string): Promise<string> {
    await this.statusDetails.waitFor();
    return getAttributeElementValue(this.statusDetails, fieldName);
  }

  async getSpecsFieldValue(fieldName: string): Promise<string> {
    await this.specificationsDetails.waitFor();
    return getAttributeElementValue(this.specificationsDetails, fieldName);
  }
}