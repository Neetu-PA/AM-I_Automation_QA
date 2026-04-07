import { Page } from '@playwright/test'
import { logger } from './helpers/logger'

export default class WaitHelper {
  async waitForTimeout(page: Page,timeout:number): Promise<void> {
    logger.info(`Delayed for ${timeout}ms!!`)
    await page.waitForTimeout(timeout)
  }
}