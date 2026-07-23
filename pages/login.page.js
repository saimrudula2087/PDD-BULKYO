import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.roleSelect = By.xpath("//select");
    this.emailInput = By.xpath("//input[@type='email']");
    this.passwordInput = By.xpath("//input[@type='password']");
    this.submitBtn = By.xpath("//button[@type='submit']");
  }

  async login(role, email, password) {
    await this.utils.selectOption(this.roleSelect, role);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitBtn);
  }
}
