import { BaseMobilePage } from './base.mobile.page.js';

export class LoginMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.emailInput = '~email_input';
    this.passwordInput = '~password_input';
    this.roleDropdown = '~role_dropdown';
    this.loginButton = '~login_button';
    this.registerCustomerLink = '~register_customer_link';
    this.registerCatererLink = '~register_caterer_link';
    this.errorMessage = '~error_message';
  }

  async login(email, password, role = 'Customer') {
    if (email) await this.typeText(this.emailInput, email);
    if (password) await this.typeText(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async clickRegisterAsCustomer() {
    await this.clickElement(this.registerCustomerLink);
  }

  async clickRegisterAsCaterer() {
    await this.clickElement(this.registerCatererLink);
  }
}
