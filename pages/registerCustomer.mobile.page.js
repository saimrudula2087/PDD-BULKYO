import { BaseMobilePage } from './base.mobile.page.js';

export class RegisterCustomerMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.nameInput = '~name_input';
    this.emailInput = '~email_input';
    this.passwordInput = '~password_input';
    this.submitButton = '~submit_button';
  }

  async registerCustomer(name, email, password) {
    if (name) await this.typeText(this.nameInput, name);
    if (email) await this.typeText(this.emailInput, email);
    if (password) await this.typeText(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }
}
