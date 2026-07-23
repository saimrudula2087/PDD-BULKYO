import { DriverFactory } from '../utilities/driver.factory.js';
import { MobileExcelReporter } from '../utilities/mobile.excel.reporter.js';
import { MobileUtils } from '../utilities/mobile.utils.js';
import { mobileLogger } from '../utilities/mobile.logger.js';

export const reporter = new MobileExcelReporter();
export let mobileDriver = null;
export let mobileUtils = null;

export const mochaHooks = {
  async beforeAll() {
    mobileLogger.info('--- STEP 1: Initializing Appium Mobile Test Session ---');
    try {
      mobileDriver = await DriverFactory.createDriver();
      mobileUtils = new MobileUtils(mobileDriver);
    } catch (e) {
      mobileLogger.warn(`Appium server or Android device not running locally: ${e.message}. Running in Mock/Simulation Mode for CI report generation.`);
      // Mock driver for standard reporting fallback
      mobileDriver = {
        isMock: true,
        deleteSession: async () => {},
        getWindowSize: async () => ({ width: 1080, height: 1920 }),
        getCurrentActivity: async () => '.MainActivity',
        getCurrentPackage: async () => 'com.example.bulkyo'
      };
      mobileUtils = new MobileUtils(mobileDriver);
    }
  },

  async afterEach() {
    const test = this.currentTest;
    const testName = test.title;
    const durationMs = test.duration || 0;
    const startTime = new Date(Date.now() - durationMs).toISOString();
    const endTime = new Date().toISOString();

    let screenshotPath = null;
    let logcatPath = null;
    let activityName = '.MainActivity';

    if (test.state === 'failed') {
      mobileLogger.error(`[FAILURE DETECTED] Test "${testName}" failed: ${test.err ? test.err.message : 'Unknown error'}`);
      if (mobileDriver && !mobileDriver.isMock) {
        screenshotPath = await mobileUtils.captureScreenshot(testName);
        logcatPath = await mobileUtils.captureDeviceLogcat(testName);
        activityName = await mobileUtils.getCurrentActivity();
      }
    }

    reporter.addTestCaseResult({
      testId: test.testCaseId || 'TC-MOB-001',
      module: test.parent ? test.parent.title : 'Mobile E2E',
      scenario: testName,
      status: test.state === 'passed' ? 'PASSED' : (test.state === 'failed' ? 'FAILED' : 'SKIPPED'),
      startTime,
      endTime,
      durationMs,
      failureReason: test.err ? test.err.message : null,
      screenshotPath,
      logcatPath,
      activity: activityName
    });

    reporter.addExecutionLog({
      timestamp: new Date().toISOString(),
      testName,
      step: `Completed execution for "${testName}"`,
      result: test.state === 'passed' ? 'PASS' : 'FAIL',
      remarks: test.err ? test.err.message : 'Executed smoothly'
    });
  },

  async afterAll() {
    mobileLogger.info('--- STEP 2: Cleaning up Appium Session & Writing Reports ---');
    if (mobileDriver && !mobileDriver.isMock && typeof mobileDriver.deleteSession === 'function') {
      try {
        await mobileDriver.deleteSession();
        mobileLogger.info('Appium session deleted cleanly.');
      } catch (e) {
        mobileLogger.error(`Error tearing down Appium session: ${e.message}`);
      }
    }

    mobileLogger.info('Generating Mobile E2E Excel Report...');
    await reporter.generateReport();
  }
};
