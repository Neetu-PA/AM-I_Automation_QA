/**
 * NavigationPage — AM-I platform sidebar
 * ----------------------------------------
 * Shared navbar from @AM-i-B-V/wd-ui-core, rendered in both Webdealer and CRM.
 * Handles service switching after login.
 *
 * Selectors sourced via Playwright codegen against the running app.
 * Add new nav items here as they are confirmed.
 */

import { Page, Locator } from '@playwright/test';

export class NavigationPage {
  constructor(private page: Page) {}

  private get elements() {
    return {
      // Confirmed via codegen: getByRole('link', { name: 'Carstock', exact: true })
      carstockNav: this.page.getByRole('link', { name: 'Carstock', exact: true }),
      // Add more nav items here as codegen / inspection confirms them
    };
  }

  // ─── Webdealer ──────────────────────────────────────────────────────────────

  get carstockNavItem(): Locator {
    return this.elements.carstockNav;
  }

  async navigateToCarstock(): Promise<void> {
    await this.elements.carstockNav.waitFor({ state: 'visible', timeout: 15_000 });
    await this.elements.carstockNav.click();
    await this.page.waitForURL(/\/stock/, { timeout: 15_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── CRM (future — add when confirmed via codegen) ─────────────────────────
  // async navigateToCRM(): Promise<void> { ... }
}
