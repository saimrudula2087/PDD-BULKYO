import { BaseMobilePage } from './base.mobile.page.js';

export class CustomerDashboardMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.searchInput = '~search_input';
    this.firstCatererCard = '~caterer_card_0';
    this.viewMenuButton = '~view_menu_button_0';
    this.cartButton = '~cart_button';
    this.homeTab = '~tab_home';
    this.ordersTab = '~tab_orders';
    this.profileTab = '~tab_profile';
    this.logoutButton = '~logout_button';
  }

  async searchCaterer(query) {
    await this.typeText(this.searchInput, query);
  }

  async selectFirstCaterer() {
    await this.clickElement(this.viewMenuButton);
  }

  async openCart() {
    await this.clickElement(this.cartButton);
  }

  async clickLogout() {
    await this.clickElement(this.logoutButton);
  }
}
