import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import testData from '../../test-data/billpay.data.json';
import { billPayPage } from '../../pages/billpay.page';
import { CustomWorld } from '../../support/world';

Given('I am logged into ParaBank',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.login(
      this.parameters.paraBankBaseUrl,
      this.parameters.paraBankUsername,
      this.parameters.paraBankPassword
    );

  }
);

Given('I open the Bill Pay page',async function (this: CustomWorld) {
    const pageObj = new billPayPage(this.page);
    await pageObj.openBillPayPage(this.parameters.paraBankBaseUrl);
  }
);

When('I enter valid bill payment details',{ timeout: 30_000 },async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.fillPayee(testData.payments.valid);

    await pageObj.selectAccount(
      testData.accounts.defaultPaymentAccount
    );
  }
);

When('I enter mismatched account numbers',{ timeout: 30_000 }, async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.fillPayee(testData.payments.invalidCrnEquivalent);

    await pageObj.selectAccount(testData.accounts.defaultPaymentAccount);
  }
);

When('I submit the payment',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.clickSendPayment();
  }
);

When('I submit the payment form without entering details', async function (this: CustomWorld) {
 
    const pageObj = new billPayPage(this.page);

    await pageObj.clickSendPayment();
  }
);

Then('payment should be successful',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const text = await pageObj.getPageText();

    assert.match(text,/Bill Payment Complete/i);
  }
);

Then('I capture the receipt details',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const confirmation = await pageObj.getReceiptText();

    this.capturedConfirmation = confirmation;

    console.log('Payment Confirmation:',confirmation);

    assert.notEqual(confirmation,'');
  }
);

Then('validation errors should be displayed',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const text = await pageObj.getPageText();

    assert.match(text,/required|error|invalid/i);
  }
);

Then('the payment should be rejected',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const text = await pageObj.getPageText();

    assert.match(text,/account|verify|match|invalid/i);
  }
);

Then('the bill payment form should be displayed',async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);
      assert.equal(
        await pageObj.isAccountNumberVisible(),
        true
      );

    assert.equal(
        await pageObj.isVerifyAccountVisible(),
        true
      );
  }
);