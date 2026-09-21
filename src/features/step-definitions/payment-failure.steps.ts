import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { LoginPage } from '../../pages/login.page';
import { TransferFundsPage } from '../../pages/transferFunds.page';
import { CustomWorld } from '../../support/world';

// Maximum wait time for step execution
const navigationTimeout = 30_000;

//Creates and returns TransferFundsPage instance
function transferFundsPage(world: CustomWorld): TransferFundsPage {
  return new TransferFundsPage(world.page);
}

//Login to ParaBank using configured test credentials
Given('I am logged into ParaBank for payment failure',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.open(this.parameters.paraBankBaseUrl);
    await loginPage.login(
      this.parameters.paraBankUsername,
      this.parameters.paraBankPassword
    );
  }
);

 //Navigate to Transfer Funds page and verify transfer form is displayed
Given('I open the Transfer Funds page',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    const page = transferFundsPage(this);
    await page.navigateToTransferFundsPage();
    assert.match(this.page.url(), /\/transfer\.htm/i);
    assert.ok(await page.isTransferFormVisible());
  }
);
