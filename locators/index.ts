/**
 * LOCATORS BARREL EXPORT
 * ----------------------
 * Import all locators from here — never import individual files directly.
 *
 * Usage:
 *   import { LoginLocators, sel } from '../locators';
 *
 * Adding a new page?
 *   1. Create locators/your-page.locators.ts
 *   2. Export it here
 *   3. Import in your page object
 */

export { LoginLocators, sel as loginSel } from './login.locators';
export { ForgotPasswordLocators, sel as forgotSel } from './forgot-password.locators';

// Future pages — uncomment as you add them:
// export { CarstockLocators, sel as carstockSel } from './carstock.locators';
// export { SettingsLocators, sel as settingsSel } from './settings.locators';