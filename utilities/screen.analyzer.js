import fs from 'fs';
import path from 'path';
import { mobileLogger } from './mobile.logger.js';

export class ScreenAnalyzer {
  constructor() {
    this.screensDir = path.resolve('.kotlin', 'app', 'src', 'main', 'java', 'com', 'example', 'bulkyo', 'ui', 'screens');
    this.outputFile = path.resolve('data', 'discovered_mobile_tests.json');
  }

  analyzeScreens() {
    mobileLogger.info('Scanning Android Kotlin Compose screens for UI components & form validation rules...');

    if (!fs.existsSync(this.screensDir)) {
      mobileLogger.warn(`Screens directory not found at: ${this.screensDir}. Returning fallback test cases.`);
      return this.generateFallbackScenarios();
    }

    const files = fs.readdirSync(this.screensDir).filter(f => f.endsWith('.kt'));
    const discoveredForms = [];
    const dynamicTestCases = [];
    let tcCount = 1;

    files.forEach(file => {
      const filePath = path.join(this.screensDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const inputs = [];
      const textFields = content.match(/(?:OutlinedTextField|TextField)\s*\([\s\S]*?\)/g) || [];
      const buttons = content.match(/Button\s*\([\s\S]*?\)/g) || [];
      const checkboxes = content.match(/Checkbox\s*\([\s\S]*?\)/g) || [];

      textFields.forEach((tf, idx) => {
        let fieldType = 'text';
        let label = `Field_${idx + 1}`;
        
        if (/KeyboardType\.Email/i.test(tf) || /email/i.test(tf)) fieldType = 'email';
        else if (/KeyboardType\.Password/i.test(tf) || /PasswordVisualTransformation/i.test(tf) || /password/i.test(tf)) fieldType = 'password';
        else if (/KeyboardType\.Number|KeyboardType\.Phone/i.test(tf) || /phone|count|guests|amount/i.test(tf)) fieldType = 'number';

        const labelMatch = tf.match(/label\s*=\s*\{\s*Text\("([^"]+)"\)/);
        if (labelMatch) label = labelMatch[1];

        inputs.push({
          label,
          type: fieldType,
          required: true
        });
      });

      if (inputs.length > 0) {
        const screenName = file.replace('.kt', '');
        discoveredForms.push({ screenName, inputs, buttonCount: buttons.length, checkboxCount: checkboxes.length });

        // Generate dynamic validation rules for each discovered field
        inputs.forEach(input => {
          if (input.type === 'email') {
            dynamicTestCases.push({
              testId: `TC-MOB-DYN-${String(tcCount++).padStart(3, '0')}`,
              module: screenName,
              scenario: `Validate ${screenName} email format constraint on field "${input.label}"`,
              fieldType: 'email',
              invalidInput: 'invalid-mobile-email-format',
              expectedError: 'Invalid Email Address'
            });
          } else if (input.type === 'password') {
            dynamicTestCases.push({
              testId: `TC-MOB-DYN-${String(tcCount++).padStart(3, '0')}`,
              module: screenName,
              scenario: `Validate ${screenName} password complexity constraint on field "${input.label}"`,
              fieldType: 'password',
              invalidInput: '123',
              expectedError: 'Password must be at least 6 characters'
            });
          } else if (input.type === 'number') {
            dynamicTestCases.push({
              testId: `TC-MOB-DYN-${String(tcCount++).padStart(3, '0')}`,
              module: screenName,
              scenario: `Validate ${screenName} numeric bound constraint on field "${input.label}"`,
              fieldType: 'number',
              invalidInput: '0',
              expectedError: 'Value must be greater than 0'
            });
          }
        });
      }
    });

    const dataDir = path.resolve('data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const payload = {
      discoveredScreens: discoveredForms.length,
      forms: discoveredForms,
      testCases: dynamicTestCases
    };

    fs.writeFileSync(this.outputFile, JSON.stringify(payload, null, 2));
    mobileLogger.info(`Android Screen Analyzer complete! Discovered ${discoveredForms.length} screens and generated ${dynamicTestCases.length} dynamic test cases at: ${this.outputFile}`);
    return payload;
  }

  generateFallbackScenarios() {
    const fallback = {
      discoveredScreens: 4,
      forms: [
        { screenName: 'AuthScreens', inputs: [{ label: 'Email', type: 'email' }, { label: 'Password', type: 'password' }] },
        { screenName: 'CatererSetupScreen', inputs: [{ label: 'Business Name', type: 'text' }, { label: 'FSSAI License', type: 'text' }] }
      ],
      testCases: [
        { testId: 'TC-MOB-DYN-001', module: 'AuthScreens', scenario: 'Validate AuthScreens email format constraint on field "Email"', fieldType: 'email', invalidInput: 'invalid-email', expectedError: 'Invalid Email Address' },
        { testId: 'TC-MOB-DYN-002', module: 'AuthScreens', scenario: 'Validate AuthScreens password complexity constraint on field "Password"', fieldType: 'password', invalidInput: '123', expectedError: 'Password must be at least 6 characters' }
      ]
    };
    fs.writeFileSync(this.outputFile, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

if (process.argv[1].endsWith('screen.analyzer.js')) {
  new ScreenAnalyzer().analyzeScreens();
}
