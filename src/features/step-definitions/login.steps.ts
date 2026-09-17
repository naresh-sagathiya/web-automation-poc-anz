import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { LoginPage } from '../../pages/login.page';
import { CustomWorld } from '../../support/world';

Given('I am on the parabank login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.open(this.parameters.baseUrl);
});

When(
  'I sign in with valid username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await new LoginPage(this.page).login(username, password);
  }
);

When(
  'I sign in with invalid username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await new LoginPage(this.page).login(username, password);
  }
);

Then('I should see the account services page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  const isVisible = await loginPage.isAccountServicesPageVisible();
  assert.equal(isVisible, true, 'Expected Account Services page to be visible after successful login');
});

Then('I not able to see the account services page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  const isAccountServicesVisible = await loginPage.isAccountServicesPageVisible();
  const isStillOnLoginPage = this.page.url().includes('/parabank') && !this.page.url().includes('/overview');

  assert.equal(isAccountServicesVisible, false, 'Account Services page should not be visible after invalid login');
  assert.equal(isStillOnLoginPage, true, 'Expected the user to remain on the login page after invalid credentials');
});
