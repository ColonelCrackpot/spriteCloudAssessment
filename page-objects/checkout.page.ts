import { Page, Locator, expect } from '@playwright/test';
import { url, checkoutCredentials } from '../config/ui_test.data'

export class CheckoutPage {
  readonly page: Page;

  //First page
  readonly p1FirstName: Locator;
  readonly p1LastName: Locator;
  readonly p1ZipCode: Locator;
  readonly p1ContinueButton: Locator;

  //Second page
  readonly p2PriceTotalText: Locator;
  readonly p2FinishButton: Locator;

  //Third page
  readonly p3ThankYouText: Locator;
  readonly p3BackHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    //First page
    this.p1FirstName = this.page.locator('//*[@id="first-name"]');
    this.p1LastName = this.page.locator('//*[@id="last-name"]');
    this.p1ZipCode = this.page.locator('//*[@id="postal-code"]');
    this.p1ContinueButton = this.page.locator('//*[@id="continue"]');

    //Second page
    this.p2PriceTotalText = this.page.locator('//*[@class="summary_subtotal_label"]')
    this.p2FinishButton = this.page.locator('//*[@id="finish"]')

    //Third page
    this.p3ThankYouText = this.page.locator('//*[@id="checkout_complete_container"]');
    this.p3BackHomeButton = this.page.locator('//*[@id="back-to-products"]');
  }

  async navigateTo() {
    await this.page.goto(`${url.base}${url.checkout}`);
  }

  //Combined Methods

  async completeCheckoutWithPaymentCheck(expectedTotalPrice: number) {
    //Navigate to checkout and complete the first page
    //The below could be turned into a method, however, given we are including a specific check for the price total, I have left this in the test
    await this.navigateTo();
    await this.completePage1();

    //Grab the total price from the second page
    const actualTotalPriceFromPage = await this.getTotalPrice();

    //Assert the prices are correct
    expect(actualTotalPriceFromPage).toEqual(expectedTotalPrice);

    //Complete checkout
    await this.clickFinishButton();
    await this.clickBackHomeButton();

    //Assert the landing page reloads
    await expect(this.page).toHaveURL(`${url.base}${url.inventory}`);
  }

  async completePage1() {
    await this.inputFirstName(checkoutCredentials.firstName);
    await this.inputLastName(checkoutCredentials.firstName);
    await this.inputZipCode(checkoutCredentials.firstName);
    await this.clickContinueButton();
  }

  //Base Methods

  async inputFirstName(firstName: string) {
    await this.p1FirstName.fill(firstName);
  }

  async inputLastName(lastName: string) {
    await this.p1LastName.fill(lastName);
  }

  async inputZipCode(zipCode: string) {
    await this.p1ZipCode.fill(zipCode);
  }

  async clickContinueButton() {
    await this.p1ContinueButton.click();
  }

  async getTotalPrice(): Promise<number> {
    //Grab the total price
    const totalPrice = await this.p2PriceTotalText.textContent();
    //Throw an error if price is null
    if (totalPrice === null) throw new Error(`Price Total not found!`);
    //Remove unnessessary text
    let numericTotal = totalPrice.replace('Item total: $', '').trim();
    //Return the price as a float
    return parseFloat(numericTotal)
  }

  async clickFinishButton() {
    await this.p2FinishButton.click();
  }

  async clickBackHomeButton() {
    await this.p3BackHomeButton.click();
  }
}