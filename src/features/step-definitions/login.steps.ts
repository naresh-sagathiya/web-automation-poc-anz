import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { CustomWorld } from '../../support/world';

Given('I am on the login page', async function (this: CustomWorld) {
  await new LoginPage(this.page).open(this.parameters.baseUrl);
});

When(
  'I sign in with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await new LoginPage(this.page).login(username, password);
  }
);

Then('I should see the inventory page', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  assert.equal(await inventoryPage.isLoaded(), true);
});
