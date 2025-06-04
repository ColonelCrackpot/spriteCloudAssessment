import { test, expect } from '@playwright/test';
import { LandingPage } from '../page-objects/landing.page';
import { LoginPage } from '../page-objects/login.page';
import { CheckoutPage } from '../page-objects/checkout.page';
import { url, loginCredentials } from '../config/ui_test.data'

test.beforeEach(async ({ page }) => {
  //Initialize pages
  const loginPage = new LoginPage(page);

  //Navigate and Login to SauceDemo
  await loginPage.login(loginCredentials.firstName, loginCredentials.lastName);
  //Assert Login was successfull
  await expect(page).toHaveURL(`${url.base}${url.inventory}`);
});

test.describe('Checkout Scenarios', () => {
  const shoppingItemLists = [
    { items: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] },
  ];
  for (const testCase of shoppingItemLists) {
    test(`1 GIVEN the sauce demo website WHEN a user attempts to checkout ${testCase.items?.length} items THEN checkout should be successful`, async ({ page }) => {
      //Initialize pages
      const landingPage = new LandingPage(page);
      const checkoutPage = new CheckoutPage(page);

      //Create a list to store items added
      const itemsAddedToCart: { name: string, price: number }[] = [];

      //Add the items to the cart, while adding their price to the list
      for (const itemName of testCase.items) {
        const price = await landingPage.addToCartByName(itemName);
        itemsAddedToCart.push({ name: itemName, price: price });
      }
      //Tally up the total
      const expectedTotalPrice = itemsAddedToCart.reduce((sum, item) => sum + item.price, 0);

      //Complete checkout
      await checkoutPage.completeCheckoutWithPaymentCheck(expectedTotalPrice);
    });
  }
});

test.describe('List Order Scenarios', () => {
  test(`2 GIVEN the landing screen WHEN the user filters by Z - A THEN the list should order correctly`, async ({ page }) => {
    //Initialize pages
    const landingPage = new LandingPage(page);

    //Grab an initial list
    const productList = await landingPage.grabProductsList();

    //Assert A-Z order first to control list
    await landingPage.sortProductsByOrderCode('az');
    expect(await landingPage.grabProductsList()).toEqual(productList.sort());

    //Assert Z-A order
    await landingPage.sortProductsByOrderCode('za');
    expect(await landingPage.grabProductsList()).toEqual(productList.sort().reverse());
  });
});

test.describe('Negative Login Scenarios', () => {
  const loginErrorValidationList = [
    { description: 'a missing password', username: 'user1', password: '', expectedError: 'Password is required' },
    { description: 'a missing user', username: '', password: 'password2', expectedError: 'Username is required' },
    { description: 'incorrect user credentials', username: 'user1', password: 'password2', expectedError: 'Username and password do not match any user in this service' },
  ];
  for (const testCase of loginErrorValidationList) {
    test(`3. GIVEN the login screen WHEN a user submits ${testCase.description} THEN the error should show ${testCase.expectedError}`, async ({ page }) => {
      //Initialize pages
      const landingPage = new LandingPage(page);
      const loginPage = new LoginPage(page);

      //Get back to the login page
      await landingPage.clickLogoutButton();

      await loginPage.login(testCase.username, testCase.password);

      await expect(await loginPage.getErrorText()).toContain(testCase.expectedError);
    });
  }
});
