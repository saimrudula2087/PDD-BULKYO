import { By, until } from 'selenium-webdriver';
import { SeleniumUtils } from '../utilities/selenium.utils.js';
import { config } from '../config/config.js';
import { logger } from '../utilities/logger.js';

export class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.utils = new SeleniumUtils(driver, config.timeouts.explicit);
  }

  // Common navigation
  async navigateTo(path = '') {
    const url = `${config.baseUrl}${path}`;
    logger.info(`Navigating to URL: ${url}`);
    await this.driver.get(url);
  }

  // Get Page Title
  async getTitle() {
    const title = await this.driver.getTitle();
    logger.info(`Retrieved page title: "${title}"`);
    return title;
  }

  // Get Current URL
  async getCurrentUrl() {
    const url = await this.driver.getCurrentUrl();
    logger.info(`Retrieved current URL: "${url}"`);
    return url;
  }

  // Find single element
  async findElement(locator) {
    return await this.utils.waitForElementVisible(locator);
  }

  // Find multiple elements
  async findElements(locator) {
    logger.info(`Finding all elements matching: ${locator}`);
    return await this.driver.findElements(locator);
  }

  // Safe Click
  async click(locator) {
    await this.utils.click(locator);
  }

  // Safe Type
  async type(locator, text) {
    await this.utils.type(locator, text);
  }

  // Wait for page load by checking document.readyState
  async waitForPageToLoad() {
    await this.driver.wait(async () => {
      const state = await this.driver.executeScript('return document.readyState;');
      return state === 'complete';
    }, config.timeouts.explicit);
  }
}
