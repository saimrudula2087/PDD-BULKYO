import { remote } from 'webdriverio';
import { execSync } from 'child_process';
import { appiumConfig } from '../config/appium.config.js';
import { mobileLogger } from './mobile.logger.js';

export class DriverFactory {
  // Dynamically detect connected ADB devices
  static detectConnectedDevices() {
    mobileLogger.info('Scanning for connected Android devices via ADB...');
    try {
      const output = execSync('adb devices').toString();
      const lines = output.split('\n').map(l => l.trim()).filter(Boolean);
      const devices = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(/\s+/);
        if (parts.length >= 2 && parts[1] === 'device') {
          devices.push({ udid: parts[0], type: parts[0].includes('emulator') ? 'Emulator' : 'Real Device' });
        }
      }

      mobileLogger.info(`ADB Device Scan Result: Found ${devices.length} device(s). ${JSON.stringify(devices)}`);
      return devices;
    } catch (error) {
      mobileLogger.warn(`ADB device scan skipped or ADB not available: ${error.message}`);
      return [];
    }
  }

  // Create Appium Driver Session
  static async createDriver() {
    const devices = this.detectConnectedDevices();
    const capabilities = { ...appiumConfig.capabilities };

    if (devices.length > 0) {
      capabilities['appium:udid'] = devices[0].udid;
      mobileLogger.info(`Targeting detected Android device: ${devices[0].udid} (${devices[0].type})`);
    }

    const options = {
      hostname: appiumConfig.server.host,
      port: appiumConfig.server.port,
      path: appiumConfig.server.path,
      capabilities
    };

    mobileLogger.info(`Connecting to Appium server at http://${appiumConfig.server.host}:${appiumConfig.server.port}${appiumConfig.server.path}`);
    try {
      const driver = await remote(options);
      mobileLogger.info('Appium UiAutomator2 driver session initialized successfully.');
      return driver;
    } catch (error) {
      mobileLogger.error(`Failed to initialize Appium session: ${error.message}`);
      throw error;
    }
  }
}
