/**
 * FORGOT PASSWORD LOCATORS
 * ------------------------
 * Owner: QA team (temporary) → Dev team (permanent)
 *
 * DEV TEAM REQUEST:
 * Please add data-testid attributes and update PRIMARY selectors below.
 */

export const ForgotPasswordLocators = {

  // ─── Reset request screen ─────────────────────────────────────────────────

  emailInput: {
    primary: 'input[data-testid="reset-email-input"]',      // ← dev to confirm
    fallback: 'input[type="email"], input[type="text"]',
  },

  submitButton: {
    primary: 'button[data-testid="reset-submit-btn"]',      // ← dev to confirm
    fallback: 'button[type="submit"], button:has-text("Reset"), button:has-text("Send")',
  },

  backToLoginLink: {
    primary: 'a[data-testid="back-to-login"]',              // ← dev to confirm
    fallback: 'a:has-text("Back"), a:has-text("Login"), a:has-text("Sign in")',
  },

  // ─── Confirmation screen ───────────────────────────────────────────────────

  confirmationMessage: {
    primary: '[data-testid="reset-confirmation"]',          // ← dev to confirm
    fallback: '.confirmation, [role="alert"], .success-message, div:has-text("email sent")',
  },

  errorMessage: {
    primary: '[data-testid="reset-error"]',                 // ← dev to confirm
    fallback: '.error, [role="alert"], div[class*="error"]',
  },

} as const;

export function sel(locator: { primary: string; fallback: string }): string {
  return process.env.USE_PRIMARY_SELECTORS === 'true'
    ? locator.primary
    : locator.fallback;
}