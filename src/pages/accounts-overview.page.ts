import { expect, Page } from '@playwright/test';
import { AccountSnapshot } from '../support/export.types';

export class AccountsOverviewPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page
      .getByRole('link', { name: 'Accounts Overview', exact: true })
      .click();

    await expect(this.page.locator('#accountTable')).toBeVisible();
  }

  async getFirstAccount(): Promise<AccountSnapshot> {
    const row = this.page.locator('#accountTable tbody tr').first();
    const cells = row.locator('td');

    return {
      accountNumber: (await cells.nth(0).innerText()).trim(),
      balance: (await cells.nth(1).innerText()).trim(),
      availableAmount: (await cells.nth(2).innerText()).trim()
    };
  }
}
