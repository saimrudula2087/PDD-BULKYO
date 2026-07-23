import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

const FRONTEND_DIR = path.resolve('frontend');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');
const APP_JSX_PATH = path.join(SRC_DIR, 'App.jsx');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const OUTPUT_DIR = path.resolve('data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'discovered_tests.json');

function discoverRoutes() {
  logger.info('Scanning React routes in App.jsx...');
  if (!fs.existsSync(APP_JSX_PATH)) {
    logger.warn(`App.jsx not found at ${APP_JSX_PATH}. Using mock routes fallback.`);
    return [];
  }

  const appContent = fs.readFileSync(APP_JSX_PATH, 'utf-8');
  // Match `<Route path="/some-path" element={<SomeComponent />}` or element={<SomeComponent />}
  const routeRegex = /<Route\s+path=["']([^"']+)["']\s+element={<([^/\s>]+)/g;
  const routes = [];
  let match;

  while ((match = routeRegex.exec(appContent)) !== null) {
    routes.push({
      path: match[1],
      component: match[2]
    });
  }

  logger.info(`Discovered ${routes.length} routes: ${JSON.stringify(routes.map(r => r.path))}`);
  return routes;
}

function scanComponentFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanComponentFiles(filePath, filesList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

function parseFormsInComponents() {
  logger.info('Scanning page components for form controls...');
  const files = scanComponentFiles(PAGES_DIR);
  const discoveredForms = {};

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const componentName = path.basename(file, path.extname(file));

    // Simple JSX form input detection
    // Detect <input ... />, <select ... </select>
    const inputRegex = /<(input|select)[^>]*>/g;
    const inputs = [];
    let match;

    while ((match = inputRegex.exec(content)) !== null) {
      const tagContent = match[0];
      
      // Extract attributes
      const typeMatch = tagContent.match(/type=["']([^"']+)["']/);
      const required = tagContent.includes('required');
      const minMatch = tagContent.match(/min=["']([^"']+)["']/);
      const maxMatch = tagContent.match(/max=["']([^"']+)["']/);
      const nameMatch = tagContent.match(/name=["']([^"']+)["']/);
      const placeholderMatch = tagContent.match(/placeholder=["']([^"']+)["']/);
      const acceptMatch = tagContent.match(/accept=["']([^"']+)["']/);

      const inputType = typeMatch ? typeMatch[1] : (match[1] === 'select' ? 'select' : 'text');

      inputs.push({
        tag: match[1],
        type: inputType,
        required,
        min: minMatch ? minMatch[1] : null,
        max: maxMatch ? maxMatch[1] : null,
        name: nameMatch ? nameMatch[1] : null,
        placeholder: placeholderMatch ? placeholderMatch[1] : null,
        accept: acceptMatch ? acceptMatch[1] : null,
        raw: tagContent
      });
    }

    if (inputs.length > 0) {
      discoveredForms[componentName] = {
        component: componentName,
        filePath: file,
        inputs
      };
    }
  }

  logger.info(`Discovered forms in components: ${Object.keys(discoveredForms).join(', ')}`);
  return discoveredForms;
}

function generateDynamicTestCases(routes, forms) {
  logger.info('Generating dynamic test cases from validation rules...');
  const testCases = [];
  let testIdCounter = 1;

  const nextId = () => {
    const id = `TC-DYN-${testIdCounter.toString().padStart(3, '0')}`;
    testIdCounter++;
    return id;
  };

  // 1. Generate tests for Login component forms
  if (forms['Login']) {
    const loginInputs = forms['Login'].inputs;
    
    // Required Email Validation test case
    testCases.push({
      id: nextId(),
      module: 'Authentication',
      scenarioName: 'Validate authentication with empty email',
      route: '/login',
      component: 'Login',
      actions: [
        { type: 'type', selector: 'input[type="email"]', value: '' },
        { type: 'type', selector: 'input[type="password"]', value: 'Password123' },
        { type: 'click', selector: 'button[type="submit"]' }
      ],
      expectedResult: 'Form reports missing email field validation or login stays on page',
      type: 'negative'
    });

    // Required Password Validation test case
    testCases.push({
      id: nextId(),
      module: 'Authentication',
      scenarioName: 'Validate authentication with empty password',
      route: '/login',
      component: 'Login',
      actions: [
        { type: 'type', selector: 'input[type="email"]', value: 'test@caterer.com' },
        { type: 'type', selector: 'input[type="password"]', value: '' },
        { type: 'click', selector: 'button[type="submit"]' }
      ],
      expectedResult: 'Form reports missing password field validation or login stays on page',
      type: 'negative'
    });

    // Invalid Email format test case
    testCases.push({
      id: nextId(),
      module: 'Authentication',
      scenarioName: 'Validate authentication with invalid email format',
      route: '/login',
      component: 'Login',
      actions: [
        { type: 'type', selector: 'input[type="email"]', value: 'invalid-email-format' },
        { type: 'type', selector: 'input[type="password"]', value: 'Password123' },
        { type: 'click', selector: 'button[type="submit"]' }
      ],
      expectedResult: 'HTML5 validation error or email validation message is displayed',
      type: 'negative'
    });
  }

  // 2. Generate tests for Checkout Page forms (Dynamic bounds check on guests count)
  if (forms['Checkout']) {
    const checkoutInputs = forms['Checkout'].inputs;
    const guestInput = checkoutInputs.find(i => i.type === 'number');
    
    if (guestInput && guestInput.min) {
      const minGuests = parseInt(guestInput.min, 10);
      
      // Guest count below min limit
      testCases.push({
        id: nextId(),
        module: 'Checkout',
        scenarioName: `Validate event guest count constraint under min limit (${minGuests})`,
        route: '/customer/checkout',
        component: 'Checkout',
        prerequisiteRoute: '/caterer-menu/1',
        prerequisiteActions: [
          { type: 'click', selector: '(//button[contains(., "Add")])[1]' },
          { type: 'click', selector: '//span[contains(., "Items")]' }
        ],
        actions: [
          { type: 'type', selector: 'input[type="number"]', value: (minGuests - 1).toString() },
          { type: 'click', selector: 'button[type="submit"]' }
        ],
        expectedResult: `Form submission blocked by HTML5 min constraint (${minGuests}) on input[type="number"]`,
        type: 'negative'
      });
    }
  }

  // 3. Generate generic validation cases for all fields marked required
  for (const componentName in forms) {
    const formInfo = forms[componentName];
    const targetRoute = routes.find(r => r.component === componentName);
    if (!targetRoute) continue;

    formInfo.inputs.forEach((input, index) => {
      if (input.required) {
        let selector = '';
        if (input.type === 'select') {
          selector = 'select';
        } else if (input.type) {
          selector = `input[type="${input.type}"]`;
        } else if (input.name) {
          selector = `input[name="${input.name}"]`;
        } else {
          selector = `input:nth-of-type(${index + 1})`;
        }

        const tcObj = {
          id: nextId(),
          module: componentName,
          scenarioName: `Validate required constraint on field of type ${input.type || 'text'} in ${componentName}`,
          route: targetRoute.path,
          component: componentName,
          actions: [
            { type: 'clear', selector },
            { type: 'click', selector: 'button[type="submit"]' }
          ],
          expectedResult: `Form submission blocked due to required missing field constraint on ${selector}`,
          type: 'negative'
        };

        if (componentName === 'Checkout') {
          tcObj.prerequisiteRoute = '/caterer-menu/1';
          tcObj.prerequisiteActions = [
            { type: 'click', selector: '(//button[contains(., "Add")])[1]' },
            { type: 'click', selector: '//span[contains(., "Items")]' }
          ];
        }

        testCases.push(tcObj);
      }
    });
  }

  return testCases;
}

function run() {
  const routes = discoverRoutes();
  const forms = parseFormsInComponents();
  const dynamicTests = generateDynamicTestCases(routes, forms);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ routes, forms, testCases: dynamicTests }, null, 2));
  logger.info(`Discovered routes and generated test configuration successfully at: ${OUTPUT_FILE}`);
}

run();
