import { BaseMobilePage } from './base.mobile.page.js';

export class AdminDashboardMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.approveCatererButton = '~approve_caterer_button';
    this.logoutButton = '~admin_logout_button';
  }

  async approvePendingCaterer() {
    await this.clickElement(this.approveCatererButton);
  }

  async clickLogout() {
    await this.clickElement(this.logoutButton);
  }
}
