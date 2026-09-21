import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
// Maximum wait time for page navigation and UI actions
const navigationTimeout = 15_000;

export class TransferFundsPage extends BasePage {
  // Page locators
  private readonly transferFundsLink: Locator;
  private readonly toAccount: Locator;
  private readonly amount: Locator;
  private readonly transferButton: Locator;
  private readonly transferResultPanel: Locator;
  private readonly transferSuccessPanel: Locator;
  private readonly transferErrorPanel: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize all page elements
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds', exact: true });
    this.toAccount = page.locator('#toAccountId');
    this.amount = page.locator('#amount');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.transferResultPanel = page.locator('#rightPanel');
    this.transferSuccessPanel = page.locator('#showResult');
    this.transferErrorPanel = page.locator('#showError');
  }

  // Navigate to Transfer Funds page
  async navigateToTransferFundsPage(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/transfer.htm', { timeout: navigationTimeout }),
      this.transferFundsLink.click()
    ]);

    await this.amount.waitFor({
      state: 'visible',
      timeout: navigationTimeout
    });
  }
 // Enter transfer amount
  async enterTransferAmount(amount: string): Promise<void> {
    await this.amount.fill(amount);
  }
 // Get currently entered amount
  async getAmount(): Promise<string> {
    return this.amount.inputValue();
  }
 // Select destination account using account number
  async selectDestinationAccount(accountNumber: string): Promise<void> {
    await this.page.waitForFunction(
      () => document.querySelectorAll('#toAccountId option').length > 0,
      undefined,
      { timeout: navigationTimeout }
    );
    await this.toAccount.selectOption(accountNumber);
  }
 // Check if a destination account exists in dropdown
  async hasDestinationAccount(accountNumber: string): Promise<boolean> {
    return (await this.toAccount.locator(`option[value="${accountNumber}"]`).count()) > 0;
  }
 // Get selected destination account number
  async getDestinationAccount(): Promise<string> {
    return this.toAccount.inputValue();
  }
 // Select first available account from dropdown
  async selectFirstAvailableDestinationAccount(): Promise<string> {
    await this.page.waitForFunction(
      () => document.querySelectorAll('#toAccountId option').length > 0,
      undefined,
      { timeout: navigationTimeout }
    );

    const accountNumber = await this.toAccount.locator('option').first().getAttribute('value');
    if (!accountNumber) {
      throw new Error('No destination account is available for the transfer');
    }
    await this.toAccount.selectOption(accountNumber);
    return accountNumber;
  }
 // Click Transfer button
  async clickTransferButton(): Promise<void> {
    await this.transferButton.click();
  }
 // Wait until either success or error message appears
  async waitForTransferOutcome(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const isVisible = (selector: string) => {
          const element = document.querySelector<HTMLElement>(selector);
          return Boolean(element && element.offsetParent !== null);
        };

        return isVisible('#showResult') || isVisible('#showError');
      },
      undefined,
      { timeout: navigationTimeout }
    );
  }
 // Get transfer result message (success/error)
  async getTransferResultText(): Promise<string> {
    await this.waitForTransferOutcome();

    if (await this.transferSuccessPanel.isVisible()) {
      return this.transferSuccessPanel.innerText();
    }

    if (await this.transferErrorPanel.isVisible()) {
      return this.transferErrorPanel.innerText();
    }

    return this.transferResultPanel.innerText();
  }
 // Verify success message is displayed
  async isTransferSuccessVisible(): Promise<boolean> {
    return this.transferSuccessPanel.isVisible();
  }
 // Verify transfer form is displayed
  async isTransferFormVisible(): Promise<boolean> {
    return (await this.amount.isVisible()) && (await this.transferButton.isVisible());
  }
 // Verify Transfer button is visible
  async isTransferButtonVisible(): Promise<boolean> {
    return this.transferButton.isVisible();
  }
  // Verify Transfer button is enabled
  async isTransferButtonEnabled(): Promise<boolean> {
    return this.transferButton.isEnabled();
  }
 // Get error message text
  async getTransferErrorText(): Promise<string> {
    await this.transferErrorPanel.waitFor({state: 'visible',
      timeout: navigationTimeout
    });
    return this.transferErrorPanel.innerText();
  }
}
