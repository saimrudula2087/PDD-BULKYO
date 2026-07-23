import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const appiumConfig = {
  server: {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT || '4723', 10),
    path: process.env.APPIUM_PATH || '/',
  },
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
    'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '13.0',
    'appium:appPackage': process.env.APP_PACKAGE || 'com.example.bulkyo',
    'appium:appActivity': process.env.APP_ACTIVITY || '.MainActivity',
    'appium:app': process.env.APK_PATH ? path.resolve(process.env.APK_PATH) : undefined,
    'appium:noReset': process.env.NO_RESET === 'true',
    'appium:fullReset': process.env.FULL_RESET === 'true',
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 180,
  },
  timeouts: {
    implicit: parseInt(process.env.MOBILE_IMPLICIT_TIMEOUT || '7000', 10),
    explicit: parseInt(process.env.MOBILE_EXPLICIT_TIMEOUT || '15000', 10),
  }
};
