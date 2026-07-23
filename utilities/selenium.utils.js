import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

export class SeleniumUtils {
  constructor(driver, defaultTimeout = 10000) {
    this.driver = driver;
    this.defaultTimeout = defaultTimeout;
  }

  // Explicit Wait for element visibility
  async waitForElementVisible(locator, timeout = this.defaultTimeout) {
    logger.info(`Waiting for element to be visible: ${locator}`);
    try {
      const element = await this.driver.wait(until.elementLocated(locator), timeout);
      await this.driver.wait(until.elementIsVisible(element), timeout);
      return element;
    } catch (error) {
      logger.error(`Element not visible: ${locator} - ${error.message}`);
      throw error;
    }
  }

  // Explicit Wait for element clickability
  async waitForElementClickable(locator, timeout = this.defaultTimeout) {
    logger.info(`Waiting for element to be clickable: ${locator}`);
    try {
      const element = await this.waitForElementVisible(locator, timeout);
      await this.driver.wait(until.elementIsEnabled(element), timeout);
      return element;
    } catch (error) {
      logger.error(`Element not clickable: ${locator} - ${error.message}`);
      throw error;
    }
  }

  // Click an element with waits
  async click(locator, timeout = this.defaultTimeout) {
    const element = await this.waitForElementClickable(locator, timeout);
    logger.info(`Clicking element: ${locator}`);
    await element.click();
  }

  // Send keys to an input with wait and clearing it first
  async type(locator, text, timeout = this.defaultTimeout) {
    const element = await this.waitForElementVisible(locator, timeout);
    logger.info(`Typing "${text}" into element: ${locator}`);
    await element.clear();
    await element.sendKeys(text);
  }

  // Select value in standard HTML select dropdown by visible text or value
  async selectOption(locator, optionValue, timeout = this.defaultTimeout) {
    const element = await this.waitForElementVisible(locator, timeout);
    logger.info(`Selecting option "${optionValue}" in dropdown: ${locator}`);
    const option = await element.findElement(By.xpath(`.//option[@value='${optionValue}' or text()='${optionValue}']`));
    await option.click();
  }

  // JavaScript Executor click
  async jsClick(element) {
    logger.info('Executing JavaScript click');
    await this.driver.executeScript('arguments[0].click();', element);
  }

  // Scroll to element
  async scrollToElement(element) {
    logger.info('Scrolling to element');
    await this.driver.executeScript('arguments[0].scrollIntoView({ behavior: "smooth", block: "center" });', element);
  }

  // Handle JavaScript Alert
  async handleAlert(accept = true) {
    try {
      logger.info('Waiting for JavaScript Alert');
      await this.driver.wait(until.alertIsPresent(), 5000);
      const alert = await this.driver.switchTo().alert();
      const text = await alert.getText();
      logger.info(`Alert present with text: "${text}"`);
      if (accept) {
        await alert.accept();
        logger.info('Alert accepted');
      } else {
        await alert.dismiss();
        logger.info('Alert dismissed');
      }
      return text;
    } catch (error) {
      logger.error(`Failed to handle alert: ${error.message}`);
      throw error;
    }
  }

  // Capture Screenshot on Failure
  static async captureScreenshot(driver, testName) {
    try {
      const screenshotDir = path.join('reports', 'failures');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const cleanName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${cleanName}_${Date.now()}.png`;
      const filepath = path.join(screenshotDir, filename);

      const screenshotData = await driver.takeScreenshot();
      fs.writeFileSync(filepath, screenshotData, 'base64');
      logger.info(`Screenshot captured for failed test: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error(`Failed to capture screenshot: ${error.message}`);
      return null;
    }
  }

  // Capture Browser Console Logs
  static async captureConsoleLogs(driver) {
    try {
      const logs = await driver.manage().logs().get('browser');
      return logs.map(log => `[${log.level.name}] ${log.message}`).join('\n');
    } catch (error) {
      // Some drivers or headless environments may not support logs capture
      return `Console logs capture unsupported: ${error.message}`;
    }
  }

  // Retry execution for flaky operations
  static async retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        logger.warn(`flaky action failed, retrying (${i + 1}/${retries})... Error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
