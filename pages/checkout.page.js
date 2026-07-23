import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class CheckoutPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.guestsInput = By.xpath("//input[@type='number']");
    this.dateInput = By.xpath("//input[@type='date']");
    this.submitBtn = By.xpath("//button[@type='submit']");
  }

  async fillEventDetails(guestCount, date) {
    const guestEl = await this.findElement(this.guestsInput);
    const dateEl = await this.findElement(this.dateInput);

    const setReactValueScript = `
      function setReactValue(el, val) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setReactValue(arguments[0], arguments[1]);
      setReactValue(arguments[2], arguments[3]);
    `;

    await this.driver.executeScript(setReactValueScript, guestEl, guestCount.toString(), dateEl, date);
  }

  async confirmBooking() {
    await this.click(this.submitBtn);
  }
}
