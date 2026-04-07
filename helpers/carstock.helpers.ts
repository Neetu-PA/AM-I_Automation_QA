/**
 * CARSTOCK HELPERS
 * ----------------
 * Ported from dev repo — exact same implementation.
 */

import { Locator, Page } from '@playwright/test';

/** BrowserStack / Automate runs need longer waits (RSC Suspense, slower VMs). */
export function isBrowserStackLikeEnv(): boolean {
  return Boolean(
    process.env.BS_ACCESS_KEY ||
      process.env.BS_USERNAME ||
      process.env.BROWSERSTACK_ACCESS_KEY ||
      process.env.BROWSERSTACK_ACCESSKEY ||
      process.env.BROWSERSTACK_USERNAME ||
      process.env.BROWSERSTACK_USER ||
      process.env.BROWSERSTACK_TESTHUB_UUID ||
      process.env.BROWSERSTACK_BUILD_NAME,
  );
}

export function carstockCreatePageReadyTimeoutMs(): number {
  return isBrowserStackLikeEnv() ? 120_000 : 60_000;
}
import { faker } from '@faker-js/faker';

// ─── VIN Generator ────────────────────────────────────────────────────────────

const VIN_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';

export function generateTestVin(): string {
  let vin = 'TEST';
  for (let i = 0; i < 13; i++) {
    vin += VIN_CHARS.charAt(Math.floor(Math.random() * VIN_CHARS.length));
  }
  return vin.toUpperCase();
}

// ─── Random Dropdown Option ───────────────────────────────────────────────────
// Options often render in a portal (document body), so we open via `field` but pick
// options with `page.getByRole('option')`.

export async function selectRandomDropdownOption(
  page: Page,
  name: string,
  comboBoxTestId = '',
): Promise<string> {
  if (comboBoxTestId) {
    await page.getByTestId(comboBoxTestId).click();
  } else {
    await page.getByRole('combobox', { name }).click();
  }

  return pickRandomListboxOption(page);
}

/**
 * Opens a dropdown inside a field wrapper (e.g. [name="brand"]) and selects a random option.
 * Use when the trigger has no stable global accessible name (common on dashboard → create flows).
 */
export async function selectRandomDropdownInField(page: Page, field: Locator): Promise<string> {
  await field.waitFor({ state: 'visible', timeout: 20_000 });

  const combobox = field.getByRole('combobox');
  if ((await combobox.count()) > 0) {
    await combobox.first().click();
  } else {
    const native = field.locator('select');
    if ((await native.count()) > 0) {
      const sel = native.first();
      const opts = sel.locator('option');
      const n = await opts.count();
      if (n < 2) return '';
      const idx = faker.number.int({ min: 1, max: n - 1 });
      const label = (await opts.nth(idx).textContent())?.trim() || '';
      await sel.selectOption({ index: idx });
      return label;
    }
    const trigger = field
      .locator('button[aria-haspopup="listbox"], button[aria-haspopup="menu"], [role="button"]')
      .first();
    await trigger.click();
  }

  return pickRandomListboxOption(page);
}

async function pickRandomListboxOption(page: Page): Promise<string> {
  const options = page.getByRole('option');
  await options.first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});

  const optionsCount = await options.count();
  if (optionsCount <= 0) return '';

  const randomIndex = faker.number.int({
    min: 0,
    max: optionsCount - 1,
  });
  const selectedOption = options.nth(randomIndex);
  const text = (await selectedOption.textContent())?.trim() || '';
  await selectedOption.click();
  return text;
}

// ─── Locale Cookies ───────────────────────────────────────────────────────────

// NEW — sets cookies on both domains
export async function setLocaleCookies(page: Page): Promise<void> {
  const domains = [
    new URL(process.env.WEBDEALER_BASE_URL
      || 'https://webdealer.pr.dev.am-i.nl').hostname,
    new URL(process.env.WEBDEALER_CLASSIC_BASE_URL
      || 'https://webdealer-classic.pr.dev.am-i.nl').hostname,
  ];

  const cookies = domains.flatMap(domain => [
    { name: 'locale',   value: 'en', domain, path: '/' },
    { name: 'language', value: 'en', domain, path: '/' },
  ]);

  await page.context().addCookies(cookies);
}

// ─── Get Attribute Element Value ──────────────────────────────────────────────
// Matches webdealer `AttributeView`: wrapper `data-testid={id}`, value `data-testid={id}-value`
// (see webdealer/tests/e2e/lib/getAttributeElementValue.ts).

export async function getAttributeElementValue(
  block: Locator,
  testId: string,
): Promise<string> {
  const row = block.getByTestId(testId).first();
  const valueCell = row.getByTestId(`${testId}-value`).first();
  if ((await valueCell.count()) > 0) {
    const text = await valueCell.textContent();
    return text?.trim() || '';
  }
  const legacy = block.locator(`[name="${testId}"], [data-field="${testId}"]`).first();
  const fallback = await legacy.textContent().catch(() => null);
  return fallback?.trim() || '';
}