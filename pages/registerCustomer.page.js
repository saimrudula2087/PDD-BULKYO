import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class RegisterCustomerPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.nameInput = By.xpath("//input[@placeholder='e.g. Rahul Sharma']");
    this.emailInput = By.xpath("//input[@type='email']");
    this.passwordInput = By.xpath("//input[@type='password']");
    this.submitBtn = By.xpath("//button[@type='submit']");
  }

  async register(name, email, password) {
    await this.type(this.nameInput, name);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitBtn);
  }
}
