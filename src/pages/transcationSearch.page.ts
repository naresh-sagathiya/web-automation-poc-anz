import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class TransactionSearchPage extends BasePage {
  // Navigation links
  private readonly billPayLink: Locator;
  private readonly findTransactionsLink: Locator;

  // Bill Pay locators
  private readonly payeeNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly payeeAccountInput: Locator;
  private readonly verifyAccountInput: Locator;
  private readonly paymentAmountInput: Locator;
  private readonly fromAccountDropdown: Locator;
  private readonly sendPaymentButton: Locator;
  private readonly paymentCompleteMessage: Locator;

  // Find Transactions locators
  private readonly transactionAccountDropdown: Locator;
  private readonly transactionAmountInput: Locator;
  private readonly findByAmountButton: Locator;
  private readonly transactionRows: Locator;

  constructor(page: Page) {
    super(page);

    // Left-side navigation
    this.billPayLink = page.getByRole('link', {
      name: 'Bill Pay',
      exact: true,
    });

    this.findTransactionsLink = page.getByRole('link', {
      name: 'Find Transactions',
      exact: true,
    });

    // Bill Pay fields
    this.payeeNameInput = page.locator(
      'input[name="payee.name"]',
    );

    this.addressInput = page.locator(
      'input[name="payee.address.street"]',
    );

    this.cityInput = page.locator(
      'input[name="payee.address.city"]',
    );

    this.stateInput = page.locator(
      'input[name="payee.address.state"]',
    );

    this.zipCodeInput = page.locator(
      'input[name="payee.address.zipCode"]',
    );

    this.phoneInput = page.locator(
      'input[name="payee.phoneNumber"]',
    );

    this.payeeAccountInput = page.locator(
      'input[name="payee.accountNumber"]',
    );

    this.verifyAccountInput = page.locator(
      'input[name="verifyAccount"]',
    );

    this.paymentAmountInput = page.locator(
      'input[name="amount"]',
    );

    this.fromAccountDropdown = page.locator(
      'select[name="fromAccountId"]',
    );

    this.sendPaymentButton = page.locator(
      'input[value="Send Payment"]',
    );

    this.paymentCompleteMessage = page.getByText(
      /bill payment complete/i,
    );

    // Find Transactions account dropdown
    this.transactionAccountDropdown = page.locator(
      'select#accountId',
    );

    /*
     * ParaBank uses the actual field ids on the Find Transactions page.
     * The older criteria.amount selector does not exist in the live DOM.
     */
    this.transactionAmountInput = page
      .locator('#amount, input[name="criteria.amount"], input[name="amount"]')
      .first();

    this.findByAmountButton = page
      .locator('#findByAmount, input[value="Find Transactions"]')
      .first();

    // Transaction results
    this.transactionRows = page.locator(
      '#transactionTable tbody tr',
    );
  }

  /**
   * Pays the bill and returns the account used for payment.
   */
  async payBill(amount: string): Promise<string> {
    await this.billPayLink.click();

    await expect(this.payeeNameInput).toBeVisible({
      timeout: 15_000,
    });

    // Fill the Bill Pay form
    await this.payeeNameInput.fill('Test Payee');
    await this.addressInput.fill('1 Test Street');
    await this.cityInput.fill('Hyderabad');
    await this.stateInput.fill('Telangana');
    await this.zipCodeInput.fill('500001');
    await this.phoneInput.fill('9999999999');
    await this.payeeAccountInput.fill('12345678');
    await this.verifyAccountInput.fill('12345678');
    await this.paymentAmountInput.fill(amount);

    // Wait for source accounts to load
    await expect(
      this.fromAccountDropdown.locator('option').first(),
    ).toBeAttached({
      timeout: 15_000,
    });

    // Capture the currently selected Bill Pay account
    const paymentAccount =
      await this.fromAccountDropdown.inputValue();

    if (!paymentAccount) {
      throw new Error(
        'The account used for Bill Pay could not be captured',
      );
    }

    console.log(
      `Captured Bill Pay account: ${paymentAccount}`,
    );

    // Submit the payment
    await this.sendPaymentButton.click();

    // Confirm successful payment
    await expect(this.paymentCompleteMessage).toBeVisible({
      timeout: 15_000,
    });

    // Return account so step definition can store it in World
    return paymentAccount;
  }

  /**
   * Opens the Find Transactions page.
   */
  async navigateToFindTransactions(): Promise<void> {
    await this.findTransactionsLink.click();

    await expect(
      this.transactionAccountDropdown,
    ).toBeVisible({
      timeout: 15_000,
    });

    // Confirm that account options are available
    await expect(
      this.transactionAccountDropdown
        .locator('option')
        .first(),
    ).toBeAttached({
      timeout: 15_000,
    });
  }

  /**
   * Selects the same account used for Bill Pay.
   */
  async selectPaymentAccount(
    paymentAccount: string,
  ): Promise<void> {
    if (!paymentAccount) {
      throw new Error(
        'No Bill Pay account was stored in World',
      );
    }

    // Find the account in the transaction dropdown
    const matchingAccountOption =
      this.transactionAccountDropdown.locator(
        `option[value="${paymentAccount}"]`,
      );

    await expect(matchingAccountOption).toBeAttached({
      timeout: 15_000,
    });

    // Select the Bill Pay account
    await this.transactionAccountDropdown.selectOption(
      paymentAccount,
    );

    // Confirm the correct account is selected
    await expect(
      this.transactionAccountDropdown,
    ).toHaveValue(paymentAccount);

    console.log(
      `Selected Find Transactions account: ${paymentAccount}`,
    );
  }

  /**
   * Searches transactions by amount.
   */
  async searchByAmount(amount: string): Promise<void> {
    // The locator now uses name="criteria.amount"
    await expect(this.transactionAmountInput).toBeVisible({
      timeout: 15_000,
    });

    await this.transactionAmountInput.scrollIntoViewIfNeeded();
    await this.transactionAmountInput.fill(amount);

    await expect(this.transactionAmountInput).toHaveValue(
      amount,
    );

    await expect(this.findByAmountButton).toBeVisible({
      timeout: 15_000,
    });

    await this.findByAmountButton.click();

    console.log(
      `Transaction search completed for amount: ${amount}`,
    );
  }

  /**
   * Verifies that a transaction containing the amount exists.
   */
  async verifyMatchingTransaction(
    expectedAmount: string,
  ): Promise<void> {
    await expect(this.transactionRows.first()).toBeVisible({
      timeout: 20_000,
    });

    const rowCount = await this.transactionRows.count();

    expect(
      rowCount,
      'At least one transaction should be displayed',
    ).toBeGreaterThan(0);

    let matchingTransactionFound = false;

    for (let index = 0; index < rowCount; index++) {
      const rowText =
        await this.transactionRows.nth(index).innerText();

      console.log(
        `Transaction row ${index + 1}: ${rowText}`,
      );

      if (rowText.includes(expectedAmount)) {
        matchingTransactionFound = true;
        break;
      }
    }

    expect(
      matchingTransactionFound,
      `No transaction was displayed with amount "${expectedAmount}"`,
    ).toBeTruthy();
  }
}