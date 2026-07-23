import { mobileLogger } from './mobile.logger.js';

export class MobileGestures {
  constructor(driver) {
    this.driver = driver;
  }

  // Get window size with safe fallback
  async getWindowSize() {
    if (this.driver && typeof this.driver.getWindowSize === 'function') {
      try {
        return await this.driver.getWindowSize();
      } catch (e) {
        // Fallback
      }
    }
    return { width: 1080, height: 1920 };
  }

  // Tap action
  async tap(element) {
    mobileLogger.info('Performing Tap gesture');
    if (element && typeof element.click === 'function') {
      await element.click();
    }
  }

  // Double Tap action
  async doubleTap(element) {
    mobileLogger.info('Performing Double Tap gesture');
    if (!this.driver || typeof this.driver.action !== 'function') return;
    const location = await element.getLocation();
    const size = await element.getSize();
    const x = Math.round(location.x + size.width / 2);
    const y = Math.round(location.y + size.height / 2);

    await this.driver.action('pointer', { pointerType: 'touch' })
      .move({ x, y })
      .down()
      .up()
      .pause(100)
      .down()
      .up()
      .perform();
  }

  // Long Press action
  async longPress(element, durationMs = 1500) {
    mobileLogger.info(`Performing Long Press gesture (${durationMs}ms)`);
    if (!this.driver || typeof this.driver.action !== 'function') return;
    const location = await element.getLocation();
    const size = await element.getSize();
    const x = Math.round(location.x + size.width / 2);
    const y = Math.round(location.y + size.height / 2);

    await this.driver.action('pointer', { pointerType: 'touch' })
      .move({ x, y })
      .down()
      .pause(durationMs)
      .up()
      .perform();
  }

  // Swipe Action Generator (W3C Actions)
  async swipe({ startX, startY, endX, endY, duration = 800 }) {
    mobileLogger.info(`Swiping from (${startX}, ${startY}) to (${endX}, ${endY})`);
    if (!this.driver || typeof this.driver.action !== 'function') return;
    await this.driver.action('pointer', { pointerType: 'touch' })
      .move({ x: startX, y: startY })
      .down()
      .pause(duration)
      .move({ x: endX, y: endY })
      .up()
      .perform();
  }

  // Swipe Left
  async swipeLeft(distancePercent = 0.7) {
    const { width, height } = await this.getWindowSize();
    const startX = Math.round(width * 0.85);
    const endX = Math.round(width * (0.85 - distancePercent * 0.7));
    const y = Math.round(height * 0.5);
    await this.swipe({ startX, startY: y, endX, endY: y });
  }

  // Swipe Right
  async swipeRight(distancePercent = 0.7) {
    const { width, height } = await this.getWindowSize();
    const startX = Math.round(width * 0.15);
    const endX = Math.round(width * (0.15 + distancePercent * 0.7));
    const y = Math.round(height * 0.5);
    await this.swipe({ startX, startY: y, endX, endY: y });
  }

  // Swipe Up
  async swipeUp(distancePercent = 0.6) {
    const { width, height } = await this.getWindowSize();
    const x = Math.round(width * 0.5);
    const startY = Math.round(height * 0.8);
    const endY = Math.round(height * (0.8 - distancePercent * 0.6));
    await this.swipe({ startX: x, startY, endX: x, endY });
  }

  // Swipe Down
  async swipeDown(distancePercent = 0.6) {
    const { width, height } = await this.getWindowSize();
    const x = Math.round(width * 0.5);
    const startY = Math.round(height * 0.2);
    const endY = Math.round(height * (0.2 + distancePercent * 0.6));
    await this.swipe({ startX: x, startY, endX: x, endY });
  }

  // Scroll Until Visible using Android UiScrollable or Swipe Loop
  async scrollUntilVisible(selector, maxSwipes = 5) {
    mobileLogger.info(`Scrolling until element matching "${selector}" is visible...`);
    for (let i = 0; i < maxSwipes; i++) {
      if (this.driver && typeof this.driver.$ === 'function') {
        try {
          const el = await this.driver.$(selector);
          if (await el.isDisplayed()) {
            mobileLogger.info('Target element is visible!');
            return el;
          }
        } catch (err) {
          // Element not yet visible
        }
      }
      await this.swipeUp();
    }
    return null;
  }

  // Drag and Drop
  async dragAndDrop(sourceEl, targetEl) {
    mobileLogger.info('Performing Drag and Drop gesture');
    if (!sourceEl || !targetEl || typeof sourceEl.getLocation !== 'function') return;
    const sourceLoc = await sourceEl.getLocation();
    const sourceSize = await sourceEl.getSize();
    const targetLoc = await targetEl.getLocation();
    const targetSize = await targetEl.getSize();

    const startX = Math.round(sourceLoc.x + sourceSize.width / 2);
    const startY = Math.round(sourceLoc.y + sourceSize.height / 2);
    const endX = Math.round(targetLoc.x + targetSize.width / 2);
    const endY = Math.round(targetLoc.y + targetSize.height / 2);

    await this.swipe({ startX, startY, endX, endY, duration: 1200 });
  }

  // Pinch gesture
  async pinch() {
    mobileLogger.info('Performing Pinch gesture');
    if (!this.driver || typeof this.driver.performActions !== 'function') return;
    const { width, height } = await this.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 200, y: centerY - 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX - 50, y: centerY - 50 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 200, y: centerY + 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX + 50, y: centerY + 50 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  // Zoom gesture
  async zoom() {
    mobileLogger.info('Performing Zoom gesture');
    if (!this.driver || typeof this.driver.performActions !== 'function') return;
    const { width, height } = await this.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 50, y: centerY - 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX - 250, y: centerY - 250 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 50, y: centerY + 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX + 250, y: centerY + 250 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}
