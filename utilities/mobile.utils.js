import fs from 'fs';
import path from 'path';
import { mobileLogger } from './mobile.logger.js';
import { appiumConfig } from '../config/appium.config.js';

export class MobileUtils {
  constructor(driver) {
    this.driver = driver;
  }

  // Explicit Wait for Element Displayed
  async waitForDisplayed(selector, timeoutMs = appiumConfig.timeouts.explicit) {
    mobileLogger.info(`Waiting for element to be displayed: "${selector}"`);
    const el = typeof selector === 'string' ? await this.driver.$(selector) : selector;
    await el.waitForDisplayed({ timeout: timeoutMs });
    return el;
  }

  // Explicit Wait for Element Clickable
  async waitForClickable(selector, timeoutMs = appiumConfig.timeouts.explicit) {
    mobileLogger.info(`Waiting for element to be clickable: "${selector}"`);
    const el = typeof selector === 'string' ? await this.driver.$(selector) : selector;
    await el.waitForClickable({ timeout: timeoutMs });
    return el;
  }

  // Type into input field with optional keyboard hiding
  async setValue(selector, text, hideKeyboard = true) {
    mobileLogger.info(`Typing text into "${selector}"`);
    const el = await this.waitForDisplayed(selector);
    await el.clearValue();
    await el.setValue(text);
    if (hideKeyboard) {
      await this.hideKeyboardSafely();
    }
  }

  // Click element
  async click(selector) {
    mobileLogger.info(`Clicking element "${selector}"`);
    const el = await this.waitForClickable(selector);
    await el.click();
  }

  // Hide Keyboard safely
  async hideKeyboardSafely() {
    try {
      if (await this.driver.isKeyboardShown()) {
        await this.driver.hideKeyboard();
        mobileLogger.info('Soft keyboard hidden.');
      }
    } catch (e) {
      // Keyboard already hidden or not supported
    }
  }

  // Get Current Activity Name
  async getCurrentActivity() {
    try {
      const activity = await this.driver.getCurrentActivity();
      mobileLogger.info(`Current Android Activity: ${activity}`);
      return activity;
    } catch (e) {
      return 'UnknownActivity';
    }
  }

  // Get Current Package Name
  async getCurrentPackage() {
    try {
      const pkg = await this.driver.getCurrentPackage();
      return pkg;
    } catch (e) {
      return 'com.example.bulkyo';
    }
  }

  // Handle JavaScript / Native Android Alert Dialogs
  async acceptAlertIfPresent() {
    try {
      if (await this.driver.isAlertOpen()) {
        const alertText = await this.driver.getAlertText();
        mobileLogger.info(`Alert present with text: "${alertText}". Accepting...`);
        await this.driver.acceptAlert();
        return alertText;
      }
    } catch (e) {
      // No alert
    }
    return null;
  }

  // Capture Failure Screenshot
  async captureScreenshot(testName) {
    const failuresDir = path.resolve('reports', 'failures');
    if (!fs.existsSync(failuresDir)) {
      fs.mkdirSync(failuresDir, { recursive: true });
    }

    const sanitizedName = testName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const fileName = `${sanitizedName}_${Date.now()}.png`;
    const filePath = path.join(failuresDir, fileName);

    try {
      await this.driver.saveScreenshot(filePath);
      mobileLogger.info(`Screenshot captured for failed test: ${filePath}`);
      return filePath;
    } catch (err) {
      mobileLogger.error(`Failed to capture screenshot: ${err.message}`);
      return null;
    }
  }

  // Capture Device Logcat Logs
  async captureDeviceLogcat(testName) {
    const failuresDir = path.resolve('reports', 'failures');
    if (!fs.existsSync(failuresDir)) {
      fs.mkdirSync(failuresDir, { recursive: true });
    }

    const sanitizedName = testName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const logPath = path.join(failuresDir, `logcat_${sanitizedName}_${Date.now()}.log`);

    try {
      const logs = await this.driver.getLogs('logcat');
      const logContent = logs.map(entry => `[${new Date(entry.timestamp).toISOString()}] [${entry.level}] ${entry.message}`).join('\n');
      fs.writeFileSync(logPath, logContent, 'utf-8');
      mobileLogger.info(`Device Logcat log saved at: ${logPath}`);
      return logPath;
    } catch (err) {
      // Fallback if logcat log type isn't directly exposed
      fs.writeFileSync(logPath, `Logcat capture fallback: ${err.message}`, 'utf-8');
      return logPath;
    }
  }

  // Retry Mechanism Helper
  async retryAction(actionFn, retries = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await actionFn();
      } catch (error) {
        if (attempt === retries) throw error;
        mobileLogger.warn(`Action failed on attempt ${attempt}/${retries}. Retrying in ${delayMs}ms... Error: ${error.message}`);
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
  }
}
