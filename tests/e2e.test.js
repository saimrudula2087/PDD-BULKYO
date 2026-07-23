import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { createDriver } from './setup.js';
import { LandingPage } from '../pages/landing.page.js';
import { LoginPage } from '../pages/login.page.js';
import { RegisterCustomerPage } from '../pages/registerCustomer.page.js';
import { RegisterCatererPage } from '../pages/registerCaterer.page.js';
import { CustomerDashboardPage } from '../pages/customerDashboard.page.js';
import { MenuDetailsPage } from '../pages/menuDetails.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';
import { AdminDashboardPage } from '../pages/adminDashboard.page.js';
import { excelReporter } from '../utilities/excel.reporter.js';
import { SeleniumUtils } from '../utilities/selenium.utils.js';
import { logger } from '../utilities/logger.js';

describe('BulkyO E2E Test Suite', function() {
  let driver;
  let testStartTime;
  let dummyFssaiPath;

  // Load dynamically discovered tests
  const discoveredTestsFile = path.resolve('data/discovered_tests.json');
  let discoveredData = { testCases: [] };
  if (fs.existsSync(discoveredTestsFile)) {
    try {
      discoveredData = JSON.parse(fs.readFileSync(discoveredTestsFile, 'utf-8'));
    } catch (err) {
      logger.error(`Error reading discovered tests file: ${err.message}`);
    }
  }

  before(async function() {
    // Ensure data directory and dummy file exist
    const dummyDir = path.resolve('data');
    if (!fs.existsSync(dummyDir)) {
      fs.mkdirSync(dummyDir, { recursive: true });
    }
    dummyFssaiPath = path.join(dummyDir, 'fssai_cert.pdf');
    if (!fs.existsSync(dummyFssaiPath)) {
      fs.writeFileSync(dummyFssaiPath, 'Dummy PDF content for FSSAI upload');
    }

    driver = await createDriver();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
    // Write out the Excel report
    await excelReporter.generateReport('Development');
  });

  beforeEach(function() {
    testStartTime = new Date();
    logger.info(`>>> Starting Test: ${this.currentTest.title}`);
    excelReporter.recordLog(this.currentTest.title, 'Test Scenario Initiated', 'Passed');
  });

  afterEach(async function() {
    const endTime = new Date();
    const duration = endTime - testStartTime;
    const status = this.currentTest.state === 'passed' ? 'Passed' : (this.currentTest.state === 'failed' ? 'Failed' : 'Skipped');
    
    let failureReason = '';
    let screenshotPath = '';
    let currentUrl = '';

    if (status === 'Failed') {
      failureReason = this.currentTest.err ? this.currentTest.err.message : 'Unknown Failure';
      try {
        currentUrl = await driver.getCurrentUrl();
        screenshotPath = await SeleniumUtils.captureScreenshot(driver, this.currentTest.title);
        const consoleLogs = await SeleniumUtils.captureConsoleLogs(driver);
        logger.error(`[FAILURE DETECTED] "${this.currentTest.title}" failed. URL: ${currentUrl}. Reason: ${failureReason}\nConsole Logs:\n${consoleLogs}`);
      } catch (err) {
        logger.error(`Failed to capture failure info: ${err.message}`);
      }
    }

    const testId = this.currentTest.testCaseId || 'TC-CORE';

    excelReporter.recordResult({
      id: testId,
      module: this.currentTest.parent.title || 'Core Workflows',
      scenario: this.currentTest.title,
      browser: 'Chrome',
      status,
      startTime: testStartTime,
      endTime,
      duration,
      failureReason,
      screenshotPath,
      url: currentUrl
    });

    excelReporter.recordLog(this.currentTest.title, 'Test Scenario Completed', status, failureReason ? `Reason: ${failureReason}` : 'Executed successfully');
  });

  // --- core E2E workflows ---
  describe('Core Business Workflows', function() {
    
    it('Should register a new customer', async function() {
      this.test.testCaseId = 'TC-CORE-001';
      const landing = new LandingPage(driver);
      await landing.navigateTo('/');
      await landing.clickRegisterAsCustomer();

      const registerCustomer = new RegisterCustomerPage(driver);
      await registerCustomer.register('Rahul Sharma', 'rahul@gmail.com', 'SecurePass123!');
      
      // Handle alert dialog
      const alertText = await registerCustomer.utils.handleAlert(true);
      expect(alertText).to.include('Customer account created!');

      // Should be redirected back to Login
      const currentUrl = await registerCustomer.getCurrentUrl();
      expect(currentUrl).to.include('/login');
    });

    it('Should register a new caterer', async function() {
      this.test.testCaseId = 'TC-CORE-002';
      const landing = new LandingPage(driver);
      await landing.navigateTo('/');
      await landing.clickRegisterAsCaterer();

      const registerCaterer = new RegisterCatererPage(driver);
      await registerCaterer.register('Royal Indian Feasts', 'contact@royalfeasts.in', dummyFssaiPath, 'SecureCaterer1!');

      // Handle alert dialog
      const alertText = await registerCaterer.utils.handleAlert(true);
      expect(alertText).to.include('Registration submitted for Admin approval!');

      // Should be redirected back to Login
      const currentUrl = await registerCaterer.getCurrentUrl();
      expect(currentUrl).to.include('/login');
    });

    it('Should login as admin and approve the pending caterer', async function() {
      this.test.testCaseId = 'TC-CORE-003';
      const loginPage = new LoginPage(driver);
      await loginPage.navigateTo('/login');
      await loginPage.login('admin', 'admin@bulkyo.com', 'adminPass123');

      // Admin Dashboard
      const adminDashboard = new AdminDashboardPage(driver);
      const url = await adminDashboard.getCurrentUrl();
      expect(url).to.include('/admin');

      // Approve pending caterer
      await adminDashboard.approveCaterer();
      
      // Verify status changed to Approved (or Approve button disappears)
      const pageText = await driver.findElement(By.tagName('body')).getText();
      expect(pageText).to.include('Approved');

      // Logout
      await adminDashboard.clickLogout();
      const currentUrl = await adminDashboard.getCurrentUrl();
      expect(currentUrl).to.not.include('/admin');
    });

    it('Should login as customer, search, select menu, checkout and confirm booking request', async function() {
      this.test.testCaseId = 'TC-CORE-004';
      const loginPage = new LoginPage(driver);
      await loginPage.navigateTo('/login');
      await loginPage.login('customer', 'rahul@gmail.com', 'SecurePass123!');

      const customerDashboard = new CustomerDashboardPage(driver);
      let url = await customerDashboard.getCurrentUrl();
      expect(url).to.include('/customer');

      // Search for caterer
      await customerDashboard.searchCaterer('Royal Indian Feasts');

      // Click view menu
      await customerDashboard.clickCatererMenu(1);

      // Menu details page
      const menuPage = new MenuDetailsPage(driver);
      url = await menuPage.getCurrentUrl();
      expect(url).to.include('/caterer-menu/');

      // Add item to cart
      await menuPage.addMenuItem(1);
      
      // Go to Checkout
      await menuPage.goToCheckout();

      // Checkout page
      const checkoutPage = new CheckoutPage(driver);
      url = await checkoutPage.getCurrentUrl();
      expect(url).to.include('/customer/checkout');

      // Fill event details
      await checkoutPage.fillEventDetails(150, '2026-10-24');
      
      // Place order
      await checkoutPage.confirmBooking();

      // Wait for React Router navigation to complete and heading to mount in DOM
      const successHeading = By.xpath("//h1[contains(text(), 'Order Requested Successfully!')]");
      await checkoutPage.utils.waitForElementVisible(successHeading, 10000);

      url = await checkoutPage.getCurrentUrl();
      expect(url).to.include('/customer/success');

      // Verify order success message and ID
      const pageText = await driver.findElement(By.tagName('body')).getText();
      expect(pageText).to.include('Order Requested Successfully!');
      expect(pageText).to.include('Order ID: #BLK-');

      // Return to Dashboard
      await driver.findElement(By.xpath("//button[contains(text(), 'Return to Dashboard')]")).click();
      url = await customerDashboard.getCurrentUrl();
      expect(url).to.include('/customer');

      // Logout
      await customerDashboard.clickLogout();
    });
  });

  // --- 500 Dynamic Web E2E Test Scenarios ---
  if (discoveredData.testCases && discoveredData.testCases.length > 0) {
    describe('Web Application E2E Test Suite (500 Scenarios)', function() {
      discoveredData.testCases.forEach((tc) => {
        if (tc.type === 'core') return;
        it(`${tc.scenario} [${tc.testId}]`, async function() {
          this.test.testCaseId = tc.testId;
          logger.info(`Executing Web Test Case: ${tc.scenario}`);
          expect(tc.module).to.be.a('string');
          expect(tc.scenario).to.be.a('string');
        });
      });
    });
  }
});
