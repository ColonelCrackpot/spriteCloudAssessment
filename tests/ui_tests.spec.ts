import { test, expect } from '@playwright/test';
import { LandingPage } from '../page_objects/landing.page';
import { LoginPage } from '../page_objects/login.page';
import { CartPage } from '../page_objects/cart.page';
import { CheckoutPage } from '../page_objects/checkout.page';

test.beforeEach(async ({ page }) => {
  //Initialize pages
  let landingPage = new LandingPage(page);
  let loginPage = new LoginPage(page);

  //Navigate and Login to SauceDemo
  await landingPage.navigateTo();
  await loginPage.login();

  //Assert Login was successfull
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('1_Full_Checkout', async ({ page }) => {
  //Initialize pages
  let landingPage = new LandingPage(page);
  let cartPage = new CartPage(page);
  let checkoutPage = new CheckoutPage(page);

  //List items to add to cart
  const itemNamesToAdd = [
    'Sauce Labs Backpack', 
    'Sauce Labs Bike Light'
  ];

  //Create a list to store items added
  const itemsAddedToCart: { name: string, price: number }[] = [];

  //Add the items to the cart, while adding their price to the list
  for (const itemName of itemNamesToAdd) {
    const price = await landingPage.addToCartByName(itemName);
    itemsAddedToCart.push({ name: itemName, price: price });
  }
  const expectedTotalPrice = itemsAddedToCart.reduce((sum, item) => sum + item.price, 0);

  await cartPage.navigateTo();
  await cartPage.clickCheckout();

  await checkoutPage.CompletePage1();

  const actualTotalPriceFromPage = await checkoutPage.getTotalPrice();

  // Log for debugging (optional)
  console.log(`Expected Total Price: ${expectedTotalPrice}`);
  console.log(`Actual Total Price from Page: ${actualTotalPriceFromPage}`);

  expect(actualTotalPriceFromPage).toEqual(expectedTotalPrice);
  
  await checkoutPage.clickFinishButton();

  await checkoutPage.clickBackHomeButton();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('2_List_Assertion', async ({ page }) => {
  //Initialize pages
  let landingPage = new LandingPage(page);

  landingPage.sortProductsA_Z();
});