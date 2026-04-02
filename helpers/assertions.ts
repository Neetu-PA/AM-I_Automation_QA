import { expect } from '@playwright/test';
import { logger } from './helpers/logger'

export default class AssertionHelper {
  isTrue(actual: boolean, message?: string): void {
    logger.info(`${message} : ${actual}`)
    expect(actual, message).toBeTruthy()
  }
  equals(actual: string | number, expected: string | number, message?: string): void {
    logger.info(`Assertion Message : ${message}`)
    logger.debug(`Comparing '${actual}' and '${expected}'`)
    expect(actual, message).toBe(expected)
  }
  notEquals(actual: string | number, expected: string | number, message?: string): void {
    logger.info(`Assertion Message : ${message}`)
    logger.debug(`Comparing '${actual}' and '${expected}'`)
    expect(actual, message).not.toBe(expected)
  }
  isFalse(actual: boolean, message?: string): void {
    logger.info(`${message} : ${actual}`)
    expect(actual, message).toBeFalsy()
  }
  isNotNullOrEmpty(value: any, message?: string): void {
    logger.info(`${message} : ${value}`)

    // Check if the value is not null, undefined, or empty (for strings and arrays)
    expect(value, message).not.toBeNull()
    expect(value, message).not.toBeUndefined()

    if (typeof value === 'string' || Array.isArray(value)) {
      expect(value, message).not.toHaveLength(0)
    }
  }
  isGreaterThan(actual: number, expected: number, message?: string): void {
    logger.info(`Assertion Message : ${message}`)
    logger.debug(`Checking if '${actual}' is greater than '${expected}'`)
    expect(actual, message).toBeGreaterThan(expected)
  }
}