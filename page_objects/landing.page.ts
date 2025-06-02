import { Page, Locator, FrameLocator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  readonly addItemToCart = "//div[@data-test='inventory-item-name' and (text())='{1}']/../../..//button[contains(@id, 'add-to-cart')]";
  readonly itemPrice = "//div[@data-test='inventory-item-name' and (text())='{1}']/../../..//*[@class='inventory_item_price']";

  constructor(page: Page) {
    this.page = page;

  }

  async navigateTo() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async addToCartByName(itemName: string) {
    //Build paths
    var addToCartButtonPath = await this.addItemToCart.replace('{1}', itemName);
    var itemPricePath = await this.itemPrice.replace('{1}', itemName);

    //Add the item to the cart
    await this.page.locator(addToCartButtonPath).scrollIntoViewIfNeeded();
    await this.page.locator(addToCartButtonPath).click();
  }
}