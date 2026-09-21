import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import testData from '../../test-data/billpay.data.json';
import { billPayPage } from '../../pages/billpay.page';
import { CustomWorld } from '../../support/world';

function getScenarioCredentials(): { username: string; password: string } {
  const credentialsPath = path.resolve(__dirname, '../../test-data/parabank-credentials.json');
  const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8')) as { username: string; password: string };
  return credentials;
}

// Login to ParaBank before any bill payment scenario runs.
Given('I am logged into ParaBank', async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const { username, password } = getScenarioCredentials();

    await pageObj.login(
      this.parameters.baseUrl,
      username,
      password
    );

  }
);

// Navigate to the Bill Pay page for the actual transaction flow.
Given('I open the Bill Pay page', async function (this: CustomWorld) {
    const pageObj = new billPayPage(this.page);
    await pageObj.openBillPayPage(this.parameters.baseUrl);
  }
);

// Populate a valid payee form and select the default account for successful payment.
When('I enter valid bill payment details', { timeout: 30_000 }, async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.fillPayee(testData.payments.valid);

    await pageObj.selectAccount(
      testData.accounts.defaultPaymentAccount
    );
  }
);

// Populate the payment form with mismatched account numbers to verify validation.
When('I enter mismatched account numbers', { timeout: 30_000 }, async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.fillPayee(testData.payments.invalidCrnEquivalent);

    await pageObj.selectAccount(testData.accounts.defaultPaymentAccount);
  }
);

// Submit the Bill Pay form after data entry.
When('I submit the payment', async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    await pageObj.clickSendPayment();
  }
);

// Attempt to submit the form without completing required fields.
When('I submit the payment form without entering details', async function (this: CustomWorld) {
 
    const pageObj = new billPayPage(this.page);

    await pageObj.clickSendPayment();
  }
);

// Assert the successful confirmation is displayed after a valid payment.
Then('payment should be successful', async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const text = await pageObj.getPageText();

    assert.match(text,/Bill Payment Complete/i);
  }
);

// Capture the generated payment receipt for verification/reporting.
Then('I capture the receipt details', async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const confirmation = await pageObj.getReceiptText();

    this.capturedConfirmation = confirmation;

    console.log('Payment Confirmation:', confirmation);

    assert.notEqual(confirmation, '');
  }
);

// Verify that validation messages appear when the form is incomplete.
Then('validation errors should be displayed', async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const text = await pageObj.getPageText();

    assert.match(text,/required|error|invalid/i);
  }
);

// Ensure the system rejects invalid account number combinations.
Then('the payment should be rejected', async function (this: CustomWorld) {

    const pageObj = new billPayPage(this.page);

    const text = await pageObj.getPageText();

    assert.match(text,/account|verify|match|invalid/i);
  }
);

// Confirm that the payee account details fields are visible on the form.
Then('the bill payment form should be displayed', async function (this: CustomWorld) {

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