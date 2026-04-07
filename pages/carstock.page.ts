/**
 * CarstockPage — Stock creation and detail flows
 * -----------------------------------------------
 * Locale set in loggedInPage fixture before navigation.
 * No setLocaleCookies here — avoids overwriting auth cookies.
 */

import { Page, Locator, expect } from '@playwright/test';
import {
  generateTestVin,
  selectRandomDropdownOption,
  selectRandomDropdownInField,
  setLocaleCookies,
  getAttributeElementValue,
  carstockCreatePageReadyTimeoutMs,
} from '../helpers/carstock.helpers';

export class CarstockPage {
  constructor(public page: Page) {}

  // ─── Locators ──────────────────────────────────────────────────────────────

  get actionBlock(): Locator {
    return this.page.getByTestId('takeActionBlock').first();
  }

  get vinInput(): Locator {
    // EN label = "VIN" (addNewVehicle.chassisNo), NL = "Chassisnummer"
    // register('chassisNo') → DOM name="chassisNo", NOT "vin"
    return this.actionBlock.getByRole('textbox', { name: /VIN|Chassis/i });
  }

  /** Webdealer `addNewVehicle.startBlank`; EN route uses exact "Start blank" (see TakeAction.client.tsx). */
  get startBlankButton(): Locator {
    return this.actionBlock.getByRole('button', {
      name: /Start blank|start blanco|vanaf leeg/i,
    });
  }

  get dealerField(): Locator {
    return this.actionBlock.locator('[name="dealer"]');
  }

  get brandField(): Locator {
    return this.actionBlock.locator('[name="brand"]');
  }

  /** Detail shell: prefer testid; classic NL UI uses “Neem … actie”, not “Take action”. */
  get stockDetailsHeader(): Locator {
    return this.page
      .getByTestId('stockDetailsHeader')
      .or(
        this.page
          .locator('.MuiBox-root, main, [class*="detail"], [class*="header"]')
          .filter({
            hasText: /Take action|Neem direct actie|Neem actie|Actie uitvoeren/i,
          })
          .first(),
      )
      .first();
  }



  get chassisNumber(): Locator {
    return this.page.getByTestId('chassisNumber').first();
  }

  get statusDetails(): Locator {
    return this.page.getByTestId('statusDetails').first();
  }

  get specificationsDetails(): Locator {
    return this.page.getByTestId('specificationsDetails').first();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────
  // Locale cookie set in loggedInPage fixture before this runs — do NOT call
  // setLocaleCookies here as it can overwrite auth session cookies.

  async navigate(): Promise<void> {
    await setLocaleCookies(this.page);
    // Same origin as the authenticated session (see webdealer tests/e2e/setup/create.setup.ts).
    // Do not use WEBDEALER_BASE_URL here — it can differ from playwright baseURL after redirect (e.g. classic host).
    const readyMs = carstockCreatePageReadyTimeoutMs();

    // domcontentloaded: SPAs / long-lived connections may never reach `load` on remote VMs.
    await this.page.goto('/en/stock/create', {
      waitUntil: 'domcontentloaded',
      timeout: readyMs,
    });

    // RCA (e.g. BS test 3135472680): `takeActionBlock` only exists after RSC Suspense resolves —
    // TakeAction.server fetches selectables; until then the fallback skeleton has no testid.
    // Slow Windows 11 / Automate VMs can exceed a 60s budget; extend on BS-like env (helpers).
    await this.actionBlock.waitFor({ state: 'visible', timeout: readyMs });

    await this.page
      .waitForLoadState('networkidle', { timeout: 20_000 })
      .catch(() => {});
  }
  // ─── Create flow ───────────────────────────────────────────────────────────

  async fillVin(vin: string): Promise<void> {
    await this.vinInput.fill(vin);
  }

  async clickStartBlank(): Promise<void> {
    await this.startBlankButton.click();
  }

  // Dev pattern: getByRole('combobox', { name }) — see webdealer tests/e2e/setup/create.setup.ts
  // EN labels from messages/en.json → addNewVehicle.brand = "Brand", addNewVehicle.location = "Financial owner"
  async selectBrand(): Promise<string> {
    return selectRandomDropdownOption(this.page, 'Brand');
  }

  async selectDealer(): Promise<string> {
    return selectRandomDropdownOption(this.page, 'Financial owner');
  }

  async createStock(options?: { vin?: string }): Promise<{
    id: string; vin: string; brand: string; dealer: string;
  }> {
    const vin    = options?.vin || generateTestVin();
    const brand  = await this.selectBrand();
    const dealer = await this.selectDealer();

    await this.fillVin(vin);
    await this.clickStartBlank();

    // Next.js client navigation — avoid strict "load"; URL may include ?query after id
    await this.page.waitForURL(/\/stock\/\d+/, {
      timeout: 45_000,
      waitUntil: 'domcontentloaded',
    });

    const id =
      new URL(this.page.url()).pathname.match(/\/stock\/(\d+)/)?.[1] ?? '';

    return { id, vin, brand, dealer };
  }

  // ─── Validation ────────────────────────────────────────────────────────────

  async triggerValidation(): Promise<void> {
    await this.vinInput.click();
    await this.startBlankButton.click();
  }

  /** EN + NL — see webdealer `messages/en.json` / `messages/nl.json` (TakeAction validation). */
  private static readonly requiredFieldError =
    /Please fill this required field|Vul dit verplichte veld in/i;

  private static readonly vinOrBrandMandatory =
    /VIN, license plate number or Brand with Order Id are mandatory|Het VIN, kenteken of het merk met bestel-id zijn verplicht/i;

  async isDealerErrorVisible(): Promise<boolean> {
    const msg = this.dealerField.getByText(CarstockPage.requiredFieldError);
    try {
      await msg.first().waitFor({ state: 'visible', timeout: 10_000 });
      return true;
    } catch {
      return false;
    }
  }

  async isBrandErrorVisible(): Promise<boolean> {
    const msg = this.brandField.getByText(CarstockPage.requiredFieldError);
    try {
      await msg.first().waitFor({ state: 'visible', timeout: 10_000 });
      return true;
    } catch {
      return false;
    }
  }

  async isVinMandatoryErrorVisible(): Promise<boolean> {
    const msg = this.page.getByText(CarstockPage.vinOrBrandMandatory);
    try {
      await msg.first().waitFor({ state: 'visible', timeout: 10_000 });
      return true;
    } catch {
      return false;
    }
  }

  // ─── Detail page ───────────────────────────────────────────────────────────

  async waitForDetailPage(): Promise<void> {
    await this.page.waitForURL(/\/stock\/\d+/, {
      timeout: 30_000,
      waitUntil: 'domcontentloaded',
    });
    await this.stockDetailsHeader.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async getChassisNumber(): Promise<string> {
    const byTestId = this.page.getByTestId('chassisNumber');
    if ((await byTestId.count()) > 0) {
      const text = await byTestId.first().textContent();
      return text?.trim() || '';
    }
    // EN/NL summary lines often include km + 17-char VIN
    const summaryLine = this.page.locator('text=/km.*[A-Z0-9]{9,17}/i').first();
    const text = await summaryLine.textContent().catch(() => '');
    const vinMatch = text?.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
    if (vinMatch) return vinMatch[1];
    const loose = text?.match(/[A-Z0-9]{9,17}/i);
    return loose ? loose[0].toUpperCase() : '';
  }
 

  async getStatusFieldValue(fieldName: string): Promise<string> {
    await this.statusDetails.waitFor({ state: 'visible', timeout: 30_000 });
    return getAttributeElementValue(this.statusDetails, fieldName);
  }

  async getSpecsFieldValue(fieldName: string): Promise<string> {
    await this.specificationsDetails.waitFor({ state: 'visible', timeout: 30_000 });
    return getAttributeElementValue(this.specificationsDetails, fieldName);
  }

  /**
   * Specs block loads from `/api/carstock/{id}/specifications`; brand uses
   * `brandDescription` (localized nl_NL) — UI shows "-" until data is ready
   * (see webdealer SpecsBlock.tsx AttributeView brand).
   */
  async waitForSpecsFieldResolved(
    fieldTestId: string,
    timeout = 25_000,
  ): Promise<void> {
    await this.specificationsDetails.waitFor({ state: 'visible', timeout });
    const valueCell = this.specificationsDetails
      .getByTestId(`${fieldTestId}-value`)
      .first();
    await expect(valueCell).not.toHaveText(/^[\s-]+$/, { timeout });
  }

  
}