import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('the customer pays a bill with amount {string}', async function (this: CustomWorld, amount: string,): Promise<void> {
  /*
   * Capture the account returned by the Page Object
   * and store it in World.
   */
  this.paymentAccountNumber =await this.transactionSearchPage.payBill(amount);
},
);

When('the customer navigates to Find Transactions', async function (this: CustomWorld,): Promise<void> {
  await this.transactionSearchPage.navigateToFindTransactions();
},
);

When('the customer selects the payment account', async function (this: CustomWorld,): Promise<void> {
  /*
   * Pass the stored Bill Pay account to the
   * Find Transactions page.
   */
  await this.transactionSearchPage.selectPaymentAccount(this.paymentAccountNumber,);
},
);

When('the customer searches transactions by amount {string}', async function (this: CustomWorld, amount: string,): Promise<void> {
  await this.transactionSearchPage.searchByAmount(amount);
},
);

Then('the matching transaction should be displayed with the amount {string}', async function (this: CustomWorld, expectedAmount: string,): Promise<void> {
  await this.transactionSearchPage.verifyMatchingTransaction(expectedAmount);
},
);