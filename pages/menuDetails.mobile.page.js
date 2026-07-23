import { BaseMobilePage } from './base.mobile.page.js';

export class MenuDetailsMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.addItemButton = '~add_item_button_0';
    this.goToCheckoutButton = '~go_to_checkout_button';
  }

  async addFirstItemToCart() {
    await this.clickElement(this.addItemButton);
  }

  async proceedToCheckout() {
    await this.clickElement(this.goToCheckoutButton);
  }
}
