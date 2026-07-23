import { MobileUtils } from '../utilities/mobile.utils.js';
import { MobileGestures } from '../utilities/gestures.js';
import { mobileLogger } from '../utilities/mobile.logger.js';

export class BaseMobilePage {
  constructor(driver) {
    this.driver = driver;
    this.utils = new MobileUtils(driver);
    this.gestures = new MobileGestures(driver);
  }

  // Get current package name
  async getPackageName() {
    return await this.utils.getCurrentPackage();
  }

  // Get current screen activity
  async getActivityName() {
    return await this.utils.getCurrentActivity();
  }

  // Find element by Accessibility ID, Resource ID, or XPath
  async findElement(selector) {
    return await this.utils.waitForDisplayed(selector);
  }

  // Click element
  async clickElement(selector) {
    await this.utils.click(selector);
  }

  // Type text
  async typeText(selector, text) {
    await this.utils.setValue(selector, text);
  }

  // Scroll down until element is visible
  async scrollToElement(selector) {
    return await this.gestures.scrollUntilVisible(selector);
  }
}
