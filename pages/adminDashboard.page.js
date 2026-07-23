import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class AdminDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.approveBtn = By.xpath("//button[contains(., 'Approve')]");
    this.rejectBtn = By.xpath("//button[contains(., 'Reject')]");
    this.logoutBtn = By.xpath("//button[contains(., 'Logout')]");
  }

  async approveCaterer() {
    await this.click(this.approveBtn);
  }

  async rejectCaterer() {
    await this.click(this.rejectBtn);
  }

  async clickLogout() {
    await this.click(this.logoutBtn);
  }
}
