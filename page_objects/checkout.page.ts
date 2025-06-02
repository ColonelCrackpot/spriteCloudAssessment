import { Page, Locator} from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  readonly p1FirstName: Locator;
  readonly p1LastName: Locator;
  readonly p1ZipCode: Locator;
  readonly p1ContinueButton: Locator;

  readonly p3ThankYouText: Locator;
  readonly p3BackHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.p1FirstName = this.page.locator('//*[@id="first-name"]');
    this.p1LastName = this.page.locator('//*[@id="last-name"]');
    this.p1ZipCode = this.page.locator('//*[@id="postal-code"]');
    this.p1ContinueButton = this.page.locator('//*[@id="continue"]');

    this.p3ThankYouText = this.page.locator('//*[@id="checkout_complete_container"]');
    this.p3BackHomeButton = this.page.locator('//*[@id="back-to-products"]');
  }

  async navigateTo(){
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
  }

  async CompletePage1(){
    await this.inputFirstName('John');
    await this.inputLastName('Doe');
    await this.inputZipCode('1811GL');
    await this.clickContinueButton();
  }

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
}