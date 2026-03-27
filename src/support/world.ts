/**
 * Custom World - Shared test context
 * Contains page objects, browser context, and test data
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';

// Interface: defines what's available in tests
export interface ICustomWorld extends World {
  page?: Page;
  context?: BrowserContext;
  homePage?: HomePage;
  loginPage?: LoginPage;
  forgotPasswordPage?: ForgotPasswordPage;
  testData?: any;
  currentUser?: string;
  testName?: string;
  startTime?: Date;
}

// Implementation: Cucumber creates one instance per scenario
export class CustomWorld extends World implements ICustomWorld {
  page?: Page;
  context?: BrowserContext;
  homePage?: HomePage;
  loginPage?: LoginPage;
  forgotPasswordPage?: ForgotPasswordPage;
  testData?: any;
  currentUser?: string;
  testName?: string;
  startTime?: Date;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
