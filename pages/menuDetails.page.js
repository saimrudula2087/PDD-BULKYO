import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class MenuDetailsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.addBtns = By.xpath("//button[contains(., 'Add')]");
    this.cartBtn = By.xpath("//span[contains(., 'Items')]");
  }

  async addMenuItem(index = 1) {
    const specificAddBtn = By.xpath(`(//button[contains(., 'Add')])[${index}]`);
    await this.click(specificAddBtn);
  }

  async goToCheckout() {
    await this.click(this.cartBtn);
  }
}
