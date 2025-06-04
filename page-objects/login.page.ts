import { Page, Locator } from '@playwright/test';
import { url } from '../config/ui_test.data';

export class LoginPage {
  readonly page: Page;

  readonly errorText: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.errorText = this.page.locator('//*[@data-test="error"]');
    this.usernameInput = this.page.locator('//*[@id="user-name"]');
    this.passwordInput = this.page.locator('//*[@id="password"]');
    this.loginButton = this.page.locator('//*[@id="login-button"]');
  }

  async login(userName: string, password: string) {
    this.page.goto(`${url.base}`)
    await this.inputUserName(userName);
    await this.inputPassword(password);
    await this.clickLoginButton();
  }

  async inputUserName(username: string) {
    await this.usernameInput.fill(username);
  }

  async inputPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    //Wait half a second to allow time for the error text to appear
    await this.page.waitForTimeout(500);
    //Grab the text content
    const errorText = await this.errorText.textContent();
    //Throw a warning if the text content is null
    if (errorText === null) throw new Error(`Login Error text was not found`);
    //Return the text
    return errorText;
  }
}