import { Locator, Page } from '@playwright/test';
import { logger } from './helpers/logger'

export default class ActionHelper {
  async launchBrowserUrl(page: Page, url: string) {
    logger.debug(`Launching Browser URL: ${url}`)
    await page.goto(url)
  }
  async click(element: Locator): Promise<void> {
    logger.debug("clicked  on :" + element)
    await element.click()
  }
  async getCssStyle(element: Locator, property: any) {
    logger.debug(`Getting Css property '${property}' from element '${element}'`)
    return await element.evaluate((element, property) => {
      const computedStyle = window.getComputedStyle(element);
      return computedStyle[property];
    }, property);
  }
  async check(element: Locator): Promise<void> {
    logger.debug("checked  on :" + element)
    await element.check();
  }
  async uncheck(element: Locator): Promise<void> {
    logger.debug("unchecked  on :" + element)
    await element.uncheck();
  }
  async getAttribute(element: Locator, attribute: string): Promise<string> {
    let attributeValue = await element.getAttribute(attribute) ?? ""
    return attributeValue;
  }
  async fill(element: Locator, value: string): Promise<void> {
    logger.debug(`fill value '${value}' in ${element}`)
    await element.fill(value)
  }
  public async focus(element: Locator): Promise<void> {
    await element.focus();
  }
  async waitForElement(element: Locator, options?: { state?: "attached" | "detached" | "visible" | "hidden"; }): Promise<void> {
    logger.debug(`Waiting for Element : ${element}`)
    await element.waitFor(options)
  }

  async scrollIntoViewIfNeeded(element: Locator): Promise<void> {
    await element.scrollIntoViewIfNeeded()
  }
  async setInputFiles(element: Locator, filePath: string): Promise<void> {
    await element.setInputFiles(filePath)
  }
  async isVisible(element: Locator, options?: { state?: "attached" | "detached" | "visible" | "hidden", timeout?: number }): Promise<boolean> {
    try {
      let timeoutValue = options?.timeout ?? 2000;
      await element.waitFor({ state: options?.state, timeout: timeoutValue });
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
    logger.debug(`Checking if Element is Visible : ${element}`)
    return await element.isVisible()
  }
  async hover(element: Locator): Promise<void> {
    logger.debug(`hovering on : ${element}`)
    await element.hover()
  }
  async clear(element: Locator): Promise<void> {
    await element.clear()
  }
  async isDisabled(element: Locator): Promise<boolean> {
    return await element.isDisabled()
  }
  async isEnabled(element: Locator): Promise<boolean> {
    return await element.isEnabled()
  }
  async textContent(element: Locator): Promise<string> {
    logger.debug(`get textContent of ${element}`)
    let textContent = await element.textContent() ?? ""
    return textContent
  }
  async focusAndType(page: Page, element: Locator, value: string): Promise<void> {
    logger.debug(`fill value '${value}' in ${element}`)
    await element.focus()
    await page.keyboard.type(value)
  }
  async focusAndClear(page: Page, element: Locator): Promise<void> {
    logger.debug(`Clear the value in ${element}`)
    await element.focus()
    await page.keyboard.press('Home')
    await page.keyboard.press('Shift+End')
    await page.keyboard.press('Backspace')
  }
  async count(element: Locator): Promise<number> {
    return await element.count()
  }
}