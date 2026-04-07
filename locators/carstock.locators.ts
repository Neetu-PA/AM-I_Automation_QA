/**
 * CARSTOCK LOCATORS
 * -----------------
 * Confirmed from dev repo — all data-testid and role-based selectors.
 */

export const CarstockLocators = {

  // ─── Create page ──────────────────────────────────────────────────────────
  takeActionBlock: '[data-testid="takeActionBlock"]',
  vinInput: '[placeholder*="VIN"], input[name="vin"]',  // via getByRole textbox VIN
  startBlankButton: 'button:has-text("Start blank")',            // via getByRole button
  dealerField: '[name="dealer"]',
  brandField: '[name="brand"]',

  // ─── Post-create detail page ───────────────────────────────────────────────
  stockDetailsHeader: '[data-testid="stockDetailsHeader"]',
  chassisNumber: '[data-testid="chassisNumber"]',
  statusDetails: '[data-testid="statusDetails"]',
  specificationsDetails: '[data-testid="specificationsDetails"]',

  // ─── Validation messages ───────────────────────────────────────────────────
  requiredFieldError: 'text=Please fill this required field',
  vinMandatoryError: 'text=VIN, license plate number or Brand with Order Id are mandatory',

} as const;