import { Page, Locator, FrameLocator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  readonly addItemToCart = '//div[@data-test="inventory-item-name" and (text())="{1}"]/../../..//button[contains(@id, "add-to-cart")]';
  readonly itemPrice = '//div[@data-test="inventory-item-name" and (text())="{1}"]/../../..//*[@class="inventory_item_price"]';
  readonly sortProducts: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sortProducts = this.page.locator('//*[@class="product_sort_container"]');
  }

  async navigateTo() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async addToCartByName(itemName: string): Promise<number> {
    //Build paths
    var addToCartButtonPath = await this.addItemToCart.replace('{1}', itemName);
    var itemPricePath = await this.itemPrice.replace('{1}', itemName);

    //Add the item to the cart
    await this.page.locator(addToCartButtonPath).scrollIntoViewIfNeeded();
    await this.page.locator(addToCartButtonPath).click();

    //Grab the item price
    const priceText = await this.page.locator(itemPricePath).textContent();
    if (priceText === null) throw new Error(`Price not found for ${itemName}`);
    var numericPrice = priceText.replace('$', '');
    return parseFloat(numericPrice)
  }

  async sortProductsA_Z(){
    await this.sortProducts.selectOption({value: 'za'})
  }
}