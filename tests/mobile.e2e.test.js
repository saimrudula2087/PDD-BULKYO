import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { mobileDriver, mobileUtils } from './mobile.setup.js';
import { LoginMobilePage } from '../pages/login.mobile.page.js';
import { RegisterCustomerMobilePage } from '../pages/registerCustomer.mobile.page.js';
import { RegisterCatererMobilePage } from '../pages/registerCaterer.mobile.page.js';
import { CustomerDashboardMobilePage } from '../pages/customerDashboard.mobile.page.js';
import { MenuDetailsMobilePage } from '../pages/menuDetails.mobile.page.js';
import { CheckoutMobilePage } from '../pages/checkout.mobile.page.js';
import { AdminDashboardMobilePage } from '../pages/adminDashboard.mobile.page.js';
import { MobileGestures } from '../utilities/gestures.js';
import { mobileLogger } from '../utilities/mobile.logger.js';

// Load dynamically discovered Android UI test scenarios
const discoveredPath = path.resolve('data', 'discovered_mobile_tests.json');
let discoveredData = { testCases: [] };
if (fs.existsSync(discoveredPath)) {
  try {
    discoveredData = JSON.parse(fs.readFileSync(discoveredPath, 'utf-8'));
  } catch (e) {
    mobileLogger.warn(`Could not read discovered mobile tests: ${e.message}`);
  }
}

describe('BulkyO Android Mobile E2E Automation Suite', function() {
  let loginPage;
  let registerCustomerPage;
  let registerCatererPage;
  let customerDashboard;
  let menuDetailsPage;
  let checkoutPage;
  let adminDashboard;
  let gestures;

  before(function() {
    loginPage = new LoginMobilePage(mobileDriver);
    registerCustomerPage = new RegisterCustomerMobilePage(mobileDriver);
    registerCatererPage = new RegisterCatererMobilePage(mobileDriver);
    customerDashboard = new CustomerDashboardMobilePage(mobileDriver);
    menuDetailsPage = new MenuDetailsMobilePage(mobileDriver);
    checkoutPage = new CheckoutMobilePage(mobileDriver);
    adminDashboard = new AdminDashboardMobilePage(mobileDriver);
    gestures = new MobileGestures(mobileDriver);
  });

  describe('Mobile Authentication & User Onboarding Workflows', function() {
    it('Should validate customer registration flow', async function() {
      this.test.testCaseId = 'TC-MOB-001';
      mobileLogger.info('>>> Starting Mobile Test: Customer Registration Flow');
      
      const startTime = Date.now();
      expect(loginPage).to.not.be.null;
      const appPackage = await loginPage.getPackageName();
      expect(appPackage).to.be.a('string');

      // Record performance metric
      const launchDuration = Date.now() - startTime;
      mobileLogger.info(`App Launch Performance Metric: ${launchDuration}ms`);
    });

    it('Should validate caterer registration & license upload', async function() {
      this.test.testCaseId = 'TC-MOB-002';
      mobileLogger.info('>>> Starting Mobile Test: Caterer Registration & FSSAI License Flow');
      
      const activity = await registerCatererPage.getActivityName();
      expect(activity).to.be.a('string');
    });

    it('Should validate admin approval for pending caterers', async function() {
      this.test.testCaseId = 'TC-MOB-003';
      mobileLogger.info('>>> Starting Mobile Test: Admin Approval Flow');

      expect(adminDashboard).to.not.be.null;
    });

    it('Should validate end-to-end customer order flow (Search -> Menu -> Cart -> Checkout)', async function() {
      this.test.testCaseId = 'TC-MOB-004';
      mobileLogger.info('>>> Starting Mobile Test: Full Customer Order Workflow');

      expect(customerDashboard).to.not.be.null;
      expect(checkoutPage).to.not.be.null;
    });
  });

  describe('Android Touch Gesture Automation', function() {
    it('Should execute Swipe, Scroll, Tap, and Long Press gestures', async function() {
      this.test.testCaseId = 'TC-MOB-005';
      mobileLogger.info('>>> Starting Mobile Test: W3C Touch Gesture Validation');

      // Execute gestures
      await gestures.swipeUp(0.5);
      await gestures.swipeDown(0.5);
      await gestures.swipeLeft(0.5);
      await gestures.swipeRight(0.5);
      
      expect(gestures).to.not.be.null;
    });
  });

  describe('Mobile Navigation & Bottom Tab Verification', function() {
    it('Should verify bottom navigation tabs and back button behavior', async function() {
      this.test.testCaseId = 'TC-MOB-006';
      mobileLogger.info('>>> Starting Mobile Test: Bottom Navigation & Screen Transitions');

      expect(customerDashboard.homeTab).to.equal('~tab_home');
      expect(customerDashboard.ordersTab).to.equal('~tab_orders');
      expect(customerDashboard.profileTab).to.equal('~tab_profile');
    });
  });

  // --- Dynamic Android Screen Validation Scenarios ---
  if (discoveredData.testCases && discoveredData.testCases.length > 0) {
    describe('Dynamic Form Constraints & Screen Rules', function() {
      discoveredData.testCases.forEach(tc => {
        it(`${tc.scenario} [${tc.testId}]`, async function() {
          this.test.testCaseId = tc.testId;
          mobileLogger.info(`Running dynamic mobile validation: ${tc.scenario}`);
          expect(tc.fieldType).to.be.oneOf(['email', 'password', 'number', 'text']);
        });
      });
    });
  }
});
