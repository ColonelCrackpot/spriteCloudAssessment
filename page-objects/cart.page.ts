import { Page, Locator } from '@playwright/test';
import { ui_url } from '../config/ui_test.data'

export class CartPage {
  readonly page: Page;

  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.checkoutButton = this.page.locator('//*[@id="checkout"]');
  }

  async navigateTo() {
    await this.page.goto(`${ui_url}/cart.html`);
  }

  async clickCheckout(){
    await this.checkoutButton.click();
  }
}