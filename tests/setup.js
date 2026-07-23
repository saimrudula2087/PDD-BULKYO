import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import edge from 'selenium-webdriver/edge.js';
import { config } from '../config/config.js';
import { logger } from '../utilities/logger.js';

export async function createDriver() {
  const browser = config.browserName.toLowerCase();
  logger.info(`Initializing WebDriver for browser: ${browser} (headless=${config.headless})`);
  const builder = new Builder().forBrowser(browser);

  if (browser === 'chrome') {
    const options = new chrome.Options();
    if (config.headless) {
      options.addArguments('--headless=new');
      options.addArguments('--disable-gpu');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--window-size=1280,1024');
    }
    builder.setChromeOptions(options);
  } else if (browser === 'firefox') {
    const options = new firefox.Options();
    if (config.headless) {
      options.addArguments('-headless');
    }
    builder.setFirefoxOptions(options);
  } else if (browser === 'edge') {
    const options = new edge.Options();
    if (config.headless) {
      options.addArguments('--headless=new');
      options.addArguments('--disable-gpu');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
    }
    builder.setEdgeOptions(options);
  } else {
    throw new Error(`Unsupported browser: ${config.browserName}`);
  }

  const driver = await builder.build();
  await driver.manage().setTimeouts({ implicit: config.timeouts.implicit });
  await driver.manage().window().setRect({ width: 1280, height: 1024 });
  return driver;
}
