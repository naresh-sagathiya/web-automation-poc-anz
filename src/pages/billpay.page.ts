import { Page } from 'playwright';

export class billPayPage {
  constructor(private readonly page: Page) {}

  // Form fields for the bill payment screen.
  private payeeName = '[name="payee.name"]';
  private address = '[name="payee.address.street"]';
  private city = '[name="payee.address.city"]';
  private state = '[name="payee.address.state"]';
  private zipCode = '[name="payee.address.zipCode"]';
  private phone = '[name="payee.phoneNumber"]';

  private accountNumber = '[name="payee.accountNumber"]';
  private verifyAccount = '[name="verifyAccount"]';

  private amount = '[name="amount"]';
  private fromAccount = '[name="fromAccountId"]';

  private sendPaymentButton = '[value="Send Payment"]';

  // Login to ParaBank using the configured username and password before payment actions.
  async login(
    baseUrl: string,
    username: string,
    password: string
  ): Promise<void> {

    await this.page.goto(
      `${baseUrl}/index.htm`
    );

    await this.page.fill(
      '[name="username"]',
      username
    );

    await this.page.fill(
      '[name="password"]',
      password
    );

    await this.page.click(
      '[value="Log In"]'
    );
  }

  // Open the Bill Pay page and wait until the payee form is visible.
  async openBillPayPage(
    baseUrl: string
  ): Promise<void> {

    await this.page.goto(
      `${baseUrl}/billpay.htm`,
      { waitUntil: 'domcontentloaded' }
    );

    await this.page
      .locator(this.payeeName)
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  // Fill all required payee details for a valid payment submission.
  async fillPayee(details: any): Promise<void> {

    await this.page.locator(this.payeeName).fill(details.name);

    await this.page.locator(this.address).fill(details.address);

    await this.page.locator(this.city).fill(details.city);

    await this.page.locator(this.state).fill(details.state);

    await this.page.locator(this.zipCode).fill(details.zipCode);

    await this.page.locator(this.phone).fill(details.phone);

    await this.page.locator(this.accountNumber).fill(details.accountNumber);

    await this.page.locator(this.verifyAccount).fill(details.verifyAccount);

    await this.page.locator(this.amount).fill(details.amount);
  }

  // Pick the available source account, falling back to the first valid option if needed.
  async selectAccount(
    accountNumber: string
  ): Promise<void> {

    const accountSelect = this.page.locator(this.fromAccount);
    const accountValues = await accountSelect.locator('option').evaluateAll(
      (options) => options.map((option) => option.getAttribute('value') || '')
    );
    const accountToUse = accountValues.includes(accountNumber)
      ? accountNumber
      : accountValues[0];

    if (!accountToUse) {
      throw new Error('No payment account is available');
    }

    await accountSelect.selectOption(accountToUse, { timeout: 5_000 });
  }

  // Submit the Bill Pay form and wait briefly for confirmation to render.
  async clickSendPayment(): Promise<void> {

    await this.page.click(
      this.sendPaymentButton
    );

    await this.page.waitForTimeout(500);
  }

  // Read the whole page text to validate confirmation or validation messages.
  async getPageText(): Promise<string> {

    return await this.page
      .locator('body')
      .innerText();
  }

  // Read the receipt panel after a successful payment.
  async getReceiptText(): Promise<string> {

    return await this.page
      .locator('#rightPanel')
      .innerText();
  }

  // Check whether the account number field is visible before validation errors are shown.
  async isAccountNumberVisible(): Promise<boolean> {

    return await this.page
      .locator(this.accountNumber)
      .isVisible();
  }

  // Check whether the verify account field is visible on the form.
  async isVerifyAccountVisible(): Promise<boolean> {

    return await this.page
      .locator(this.verifyAccount)
      .isVisible();
  }
}