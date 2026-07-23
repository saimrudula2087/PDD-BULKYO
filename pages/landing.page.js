import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class LandingPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.registerCustomerLink = By.xpath("//a[contains(text(), 'Register as Customer')]");
    this.registerCatererLink = By.xpath("//a[contains(text(), 'Register as Caterer')]");
    this.loginLink = By.xpath("//a[contains(text(), 'Login')]");
  }

  async clickRegisterAsCustomer() {
    await this.click(this.registerCustomerLink);
  }

  async clickRegisterAsCaterer() {
    await this.click(this.registerCatererLink);
  }

  async clickLogin() {
    await this.click(this.loginLink);
  }
}
