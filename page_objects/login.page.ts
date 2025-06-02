import { Page, Locator} from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.usernameInput = this.page.locator('//*[@id="user-name"]');
    this.passwordInput = this.page.locator('//*[@id="password"]');
    this.loginButton = this.page.locator('//*[@id="login-button"]');
    this.logoutButton = this.page.locator('//*[@id="logout_sidebar_link"]');
  }

  async login(){
    await this.inputUserName('standard_user');
    await this.inputPassword();
    await this.clickLoginButton();
  }

  async inputUserName(username: string) {
    await this.usernameInput.fill(username);
  }

  async inputPassword() {
    await this.passwordInput.fill('secret_sauce');
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}