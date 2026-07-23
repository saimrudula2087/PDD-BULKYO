import { BaseMobilePage } from './base.mobile.page.js';

export class RegisterCatererMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.businessNameInput = '~business_name_input';
    this.emailInput = '~email_input';
    this.passwordInput = '~password_input';
    this.uploadCertButton = '~upload_cert_button';
    this.submitButton = '~submit_button';
  }

  async registerCaterer(businessName, email, password) {
    if (businessName) await this.typeText(this.businessNameInput, businessName);
    if (email) await this.typeText(this.emailInput, email);
    if (password) await this.typeText(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }
}
