import { test, expect } from '@playwright/test';
import { LandingPage } from '../page_objects/landing.page';
import { LoginPage } from '../page_objects/login.page';
import { CartPage } from '../page_objects/cart.page';

let landingPage: LandingPage;
let loginPage: LoginPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  loginPage = new LoginPage(page);

  await landingPage.navigateTo();
  await loginPage.login();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('1_Full_Checkout', async ({ page }) => {
  landingPage = new LandingPage(page);
  cartPage = new CartPage(page);

  await landingPage.addToCartByName('Sauce Labs Backpack');
  await landingPage.addToCartByName('Sauce Labs Bike Light');

  await cartPage.navigateTo();
  await cartPage.clickCheckout();
});