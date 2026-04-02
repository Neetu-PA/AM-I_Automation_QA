/**
 * CARSTOCK HELPERS
 * ----------------
 * Ported from dev repo lib/ utilities.
 * generateTestVin, selectRandomDropdownOption, setLocaleCookies
 */

import { Page } from '@playwright/test';

// ─── VIN Generator ────────────────────────────────────────────────────────────
// Generates a valid-format 17-char test VIN
// Mirrors dev repo: generateTestVin()

const VIN_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';

export function generateTestVin(): string {
  let vin = 'TEST';  // prefix makes it easy to identify in DB
  for (let i = 0; i < 13; i++) {
    vin += VIN_CHARS.charAt(Math.floor(Math.random() * VIN_CHARS.length));
  }
  return vin.toUpperCase();
}



export default generateTestVin;

// ─── Random Dropdown Option ───────────────────────────────────────────────────
// Mirrors dev repo: selectRandomDropdownOption(page, label)
// Clicks a dropdown by its label, picks a random visible option, returns selected value

export async function selectRandomDropdownOption(
  page: Page,
  label: string,
): Promise<string> {
  // Find the dropdown trigger by its label text
  const dropdown = page.locator(`[aria-label="${label}"], label:has-text("${label}") + *, *:has(> label:has-text("${label}"))`)
    .or(page.getByRole('combobox', { name: label }))
    .first();

  await dropdown.waitFor({ timeout: 10000 });
  await dropdown.click();

  // Wait for options to appear
  const options = page.locator('[role="option"], [role="listbox"] li, .dropdown-option').filter({ hasNotText: 'Select' });
  await options.first().waitFor({ timeout: 5000 });

  const count = await options.count();
  if (count === 0) throw new Error(`No options found for dropdown: ${label}`);

  // Pick random option (not first — first is often blank/placeholder)
  const randomIndex = Math.floor(Math.random() * count);
  const selected = options.nth(randomIndex);
  const text = await selected.textContent();
  await selected.click();

  return text?.trim() || '';
}

// ─── Locale Cookies ───────────────────────────────────────────────────────────
// Mirrors dev repo: setLocaleCookies(page)
// Sets language + locale cookies so the app renders in correct language

export async function setLocaleCookies(page: Page): Promise<void> {
  await page.context().addCookies([
    {
      name: 'locale',
      value: 'en',
      domain: new URL(process.env.WEBDEALER_BASE_URL || 'http://localhost').hostname,
      path: '/',
    },
    {
      name: 'language',
      value: 'en',
      domain: new URL(process.env.WEBDEALER_BASE_URL || 'http://localhost').hostname,
      path: '/',
    },
  ]);
}

// ─── Get Attribute Element Value ──────────────────────────────────────────────
// Mirrors dev repo: getAttributeElementValue(block, fieldName)
// Reads the displayed value of a named field inside a block

export async function getAttributeElementValue(
  block: import('@playwright/test').Locator,
  fieldName: string,
): Promise<string> {
  const field = block.locator(`[name="${fieldName}"], [data-field="${fieldName}"], *[class*="${fieldName}"]`).first();
  const text = await field.textContent();
  return text?.trim() || '';
}