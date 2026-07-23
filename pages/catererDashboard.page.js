import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class CatererDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.menuTab = By.xpath("//li[contains(text(), 'My Menu')]");
    this.ordersTab = By.xpath("//li[contains(text(), 'Orders')]");
    this.logoutBtn = By.xpath("//button[contains(., 'Logout')]");
  }

  async selectMenuTab() {
    await this.click(this.menuTab);
  }

  async selectOrdersTab() {
    await this.click(this.ordersTab);
  }

  async clickLogout() {
    await this.click(this.logoutBtn);
  }
}
