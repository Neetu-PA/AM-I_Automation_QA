/**
 * LOGIN LOCATORS
 * --------------
 * Primary selectors confirmed from dev repo — data-testid attributes in use.
 * Set USE_PRIMARY_SELECTORS=true in .env to activate.
 *
 * Dev repo reference: page.getByTestId('email') etc.
 */

export const LoginLocators = {

  // ─── Step 1: Username screen ───────────────────────────────────────────────
  usernameInput: {
    primary: '[data-testid="email"]',               // ✅ confirmed from dev repo
    fallback: 'input[type="text"], input[placeholder*="Username" i], input[placeholder*="Email" i]',
  },

  continueButton: {
    primary: '[data-testid="continueButton"]',       // ✅ confirmed from dev repo
    fallback: 'button:has-text("Continue"), button[type="submit"]',
  },

  languageDropdown: {
    primary: '[data-testid="language-dropdown"]',   // ← ask dev to confirm
    fallback: 'select, [role="combobox"]',
  },

  // ─── Step 2: Password screen ───────────────────────────────────────────────
  passwordInput: {
    primary: '[data-testid="password"]',            // ✅ confirmed from dev repo
    fallback: 'input[type="password"]',
  },

  signInButton: {
    primary: '[data-testid="signInButton"]',        // ✅ confirmed from dev repo
    fallback: 'button:has-text("Sign in"), button:has-text("Sign In")',
  },

  forgotPasswordLink: {
    primary: '[data-testid="forgot-password-link"]', // ← ask dev to confirm
    fallback: 'a:has-text("vergeten"), a:has-text("forgot"), a:has-text("Forgot Password")',
  },

  // ─── Feedback ──────────────────────────────────────────────────────────────
  errorMessage: {
    primary: '[data-testid="error-alert"]',         // ← ask dev to confirm
    fallback: '[role="alert"], .error, .alert-danger, div[class*="error"]',
  },

  successToast: {
    primary: '[data-testid="success-toast"]',       // ← ask dev to confirm
    fallback: '.toast, [role="status"]',
  },

} as const;

export function loginSel(locator: { primary: string; fallback: string }): string {
  return process.env.USE_PRIMARY_SELECTORS === 'true'
    ? locator.primary
    : locator.fallback;
}