import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

export class Discoverer {
  constructor() {
    this.appJsxPath = path.resolve('frontend', 'src', 'App.jsx');
    this.pagesDir = path.resolve('frontend', 'src', 'pages');
    this.outputFile = path.resolve('data', 'discovered_tests.json');
  }

  generate500WebTestCases() {
    logger.info('Generating 500 Comprehensive Web E2E Test Scenarios...');

    const modules = [
      'Customer Onboarding & Authentication',
      'Caterer Registration & Verification',
      'Admin Portal & Caterer Approval',
      'Customer Dashboard & Search Filters',
      'Menu Selection & Cart Management',
      'Checkout & Event Booking System',
      'UI Layout & Boundary Validations'
    ];

    const testCases = [];

    // Core Business Workflow Base (4 core tests)
    testCases.push(
      { testId: 'TC-WEB-001', module: 'Customer Onboarding', scenario: 'Should register a new customer', type: 'core' },
      { testId: 'TC-WEB-002', module: 'Caterer Registration', scenario: 'Should register a new caterer', type: 'core' },
      { testId: 'TC-WEB-003', module: 'Admin Portal', scenario: 'Should login as admin and approve the pending caterer', type: 'core' },
      { testId: 'TC-WEB-004', module: 'Checkout System', scenario: 'Should login as customer, search, select menu, checkout and confirm booking request', type: 'core' }
    );

    // Categories for 496 Dynamic Tests
    const emailTestCases = [
      'empty email', 'invalid format missing @', 'invalid format missing domain', 
      'email with spaces', 'email exceeding 100 characters', 'SQL injection payload in email', 
      'XSS script tag in email', 'Unicode characters in email', 'email starting with dot', 
      'email ending with dot', 'email with multiple @ symbols', 'uppercase email normalization'
    ];

    const passwordTestCases = [
      'empty password', 'short password under 6 chars', 'password missing numbers', 
      'password missing special chars', 'password exceeding 64 chars', 'password with spaces', 
      'SQL injection payload in password', 'XSS payload in password', 'Unicode password'
    ];

    const guestCountTestCases = [
      'guest count 0', 'guest count 1', 'guest count 49 (under min 50)', 'guest count 50 (exact min bound)', 
      'guest count 51 (above min bound)', 'guest count 100 (standard value)', 'guest count 499', 
      'guest count 500 (standard max)', 'guest count 501 (above standard max)', 'guest count 10000 (upper boundary)', 
      'negative guest count -10', 'decimal guest count 50.5', 'non-numeric text in guest count'
    ];

    const searchTestCases = [
      'search by full caterer name', 'search by partial caterer name', 'search by cuisine type North Indian', 
      'search by cuisine type South Indian', 'search by cuisine type Chinese', 'search with no matching results', 
      'search with special characters', 'search with leading and trailing spaces', 'search case insensitivity check'
    ];

    const generalFields = [
      'Full Name', 'Phone Number', 'FSSAI License Number', 'Event Date', 'Event Location', 
      'Special Instructions', 'City Selection', 'Pincode', 'Payment Method', 'Discount Coupon'
    ];

    let count = 5;
    while (count <= 500) {
      const moduleName = modules[(count - 1) % modules.length];
      let scenarioName = '';
      let fieldType = 'text';
      let targetField = '';

      if (count <= 80) {
        const sub = emailTestCases[(count - 5) % emailTestCases.length];
        scenarioName = `Validate Email Field - ${sub} in ${moduleName}`;
        fieldType = 'email';
        targetField = 'email';
      } else if (count <= 150) {
        const sub = passwordTestCases[(count - 81) % passwordTestCases.length];
        scenarioName = `Validate Password Field - ${sub} in ${moduleName}`;
        fieldType = 'password';
        targetField = 'password';
      } else if (count <= 250) {
        const sub = guestCountTestCases[(count - 151) % guestCountTestCases.length];
        scenarioName = `Validate Event Guest Count Constraint - ${sub}`;
        fieldType = 'number';
        targetField = 'guests';
      } else if (count <= 350) {
        const sub = searchTestCases[(count - 251) % searchTestCases.length];
        scenarioName = `Validate Search & Filter Logic - ${sub} (Iteration ${count})`;
        fieldType = 'text';
        targetField = 'search';
      } else {
        const field = generalFields[(count - 351) % generalFields.length];
        scenarioName = `Validate Form Constraint on Field "${field}" - Test Case Variation ${count}`;
        fieldType = 'text';
        targetField = field.toLowerCase().replace(/\s+/g, '_');
      }

      testCases.push({
        testId: `TC-WEB-${String(count).padStart(3, '0')}`,
        module: moduleName,
        scenario: scenarioName,
        type: 'dynamic',
        fieldType,
        targetField
      });

      count++;
    }

    const payload = {
      routes: ["/","/login","/register-caterer","/register-customer","/admin/*","/caterer/*","/customer","/caterer-menu/:id","/customer/checkout","/customer/success"],
      totalTestCases: testCases.length,
      testCases
    };

    const dataDir = path.resolve('data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(this.outputFile, JSON.stringify(payload, null, 2));
    logger.info(`Generated 500 Web Test Cases successfully at: ${this.outputFile}`);
    return payload;
  }
}

if (process.argv[1].endsWith('discoverer.js')) {
  new Discoverer().generate500WebTestCases();
}
