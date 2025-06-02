import { Page, Locator, FrameLocator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  readonly addItemToCart = '//div[@data-test="inventory-item-name" and (text())="{1}"]/../../..//button[contains(@id, "add-to-cart")]';
  readonly itemPrice = '//div[@data-test="inventory-item-name" and (text())="{1}"]/../../..//*[@class="inventory_item_price"]';
  
  readonly hamburgerMenuButton: Locator;
  readonly logoutButton: Locator;
  readonly products: Locator
  readonly sortProducts: Locator;

  constructor(page: Page) {
    this.page = page;

    this.hamburgerMenuButton = this.page.locator('//*[@id="react-burger-menu-btn"]')
    this.logoutButton = this.page.locator('//*[@id="logout_sidebar_link"]');
    this.products = this.page.locator('//div[contains(@class, "item_name")]');
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

  async grabProductsList(): Promise<string[]> {
    const names = await this.products.allTextContents();
    return names.map(name => name.trim());
  }

  async sortProductsByOrderCode(orderCode: string){
    await this.sortProducts.selectOption({value: orderCode})
    await this.page.waitForTimeout(500);
  }

  async clickLogoutButton(){
    await this.hamburgerMenuButton.click();
    await this.logoutButton.click();
  }

}