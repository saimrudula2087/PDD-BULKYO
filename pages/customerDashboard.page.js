import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class CustomerDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.searchInput = By.xpath("//input[@placeholder='Search caterers by name or cuisine...']");
    this.logoutBtn = By.xpath("//button[contains(., 'Logout')]");
  }

  async searchCaterer(name) {
    await this.type(this.searchInput, name);
  }

  async clickCatererMenu(index = 1) {
    // Click View Menu button for a specific index (1-based)
    const viewMenuBtn = By.xpath(`(//button[contains(text(), 'View Menu')])[${index}]`);
    await this.click(viewMenuBtn);
  }

  async clickLogout() {
    await this.click(this.logoutBtn);
  }
}
