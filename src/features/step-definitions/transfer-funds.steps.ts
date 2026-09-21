import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { CustomWorld } from '../../support/world';
import { TransferFundsPage } from '../../pages/transferFunds.page';

// Maximum timeout used for navigation and page validations
const navigationTimeout = 30_000;

//Creates and returns TransferFundsPage objec
function transferFundsPage(world: CustomWorld): TransferFundsPage {
  return new TransferFundsPage(world.page);
}
 
//Open ParaBank application
Given('user navigates to ParaBank application for transfer',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    await this.loginPage.open(this.parameters.paraBankBaseUrl);
    assert.match(this.page.url(), /parabank/i);
  }
);
//Login using valid credentials
When('user logs in with valid credentials for transfer funds',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    await this.loginPage.login(
      this.parameters.paraBankUsername,
      this.parameters.paraBankPassword
    );

    await this.loginPage.accountsOverviewLink.waitFor({
      state: 'visible',
      timeout: navigationTimeout
    });
    assert.ok(await this.loginPage.accountsOverviewLink.isVisible());
  }
);

//Navigate to Transfer Funds page
Given('user navigates to Transfer Funds page',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    const page = transferFundsPage(this);
    await page.navigateToTransferFundsPage();
    assert.match(this.page.url(), /\/transfer\.htm/i);
    assert.ok(await page.isTransferFormVisible());
  }
);
//Enter transfer amount
When('user enters {string} as transfer amount',async function (this: CustomWorld, amount: string) {
    const page = transferFundsPage(this);
    await page.enterTransferAmount(amount);
    this.transferAmount = amount;
    assert.equal(await page.getAmount(), amount);
  }
);

//Select destination account
When('user selects destination account {string}',{ timeout: navigationTimeout },async function (this: CustomWorld, accountNumber: string) {
    const page = transferFundsPage(this);
    if (await page.hasDestinationAccount(accountNumber)) {
      await page.selectDestinationAccount(accountNumber);
    } else {
      await page.selectFirstAvailableDestinationAccount();
    }
    this.transferDestinationAccount = await page.getDestinationAccount();
    assert.ok(this.transferDestinationAccount);
  }
);

//Clear transfer amount field
When('user leaves the amount field empty',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    const page = transferFundsPage(this);
    await page.enterTransferAmount('');
    this.transferAmount = '';
    assert.equal(await page.getAmount(), '');
  }
);

//Submit transfer request
When('user clicks Transfer',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    const page = transferFundsPage(this);
    assert.ok(await page.isTransferButtonVisible());
    assert.ok(await page.isTransferButtonEnabled());
    await page.clickTransferButton();
    await page.waitForTransferOutcome();
  }
);

//Validate transfer result for success or failure
async function assertTransferOutcome(world: CustomWorld): Promise<void> {
  const page = transferFundsPage(world);
  await page.waitForTransferOutcome();
  const resultText = await page.getTransferResultText();

  if (await page.isTransferSuccessVisible()) {
    const numericAmount = Number(world.transferAmount);
    const expectedAmount = Math.abs(numericAmount).toFixed(2);
    const currencyPrefix = numericAmount < 0 ? '-\\$' : '\\$';
    assert.match(resultText, /Transfer Complete!/i);
    assert.match(
      resultText,
      new RegExp(
        `${currencyPrefix}${expectedAmount} has been transferred from account #\\d+ to account #${world.transferDestinationAccount}\\.`,
        'i'
      )
    );
    assert.match(resultText, /See Account Activity for more details\./i);
    return;
  }

  assert.match(resultText, /Error!/i);
  assert.match(
    resultText,
    /An internal error has occurred and has been logged\./i 
  );
}
//Verify validation message for transfer
Then('transfer validation message should be displayed',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    await assertTransferOutcome(this);
  }
);
//Verify successful transfer completion message
Then('transfer completion message should be displayed',{ timeout: navigationTimeout },async function (this: CustomWorld) {
   await assertTransferOutcome(this);
  }
);
//Verify blank amount error message
Then('blank transfer error message should be displayed',{ timeout: navigationTimeout },async function (this: CustomWorld) {
    const errorText = await transferFundsPage(this).getTransferErrorText();
    assert.match(errorText, /Error!/i);
    assert.match(errorText, /An internal error has occurred and has been logged\./i);
  }
);
