import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
export class OpenNewAccountPage extends BasePage {

    readonly openNewAccountLink: Locator;
    readonly accountTypeDropdown: Locator;
    readonly existingAccountDropdown: Locator;
    readonly openNewAccountButton: Locator;
    readonly accountOpenedMessage: Locator;
    readonly newAccountId: Locator;


    constructor(page: Page) {
        super(page);

        this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account', exact: true });
        this.accountTypeDropdown = page.locator('#type');
        this.existingAccountDropdown = page.locator('#fromAccountId');
        this.openNewAccountButton = page.locator('input[value="Open New Account"]');
        this.accountOpenedMessage = page.getByRole('heading', { name: 'Account Opened!', exact: true });
        this.newAccountId = page.locator('#newAccountId');
    }

    /**
     * Navigates to the Open New Account page
     * and waits for the URL to be loaded.
     */

    async navigateToOpenNewAccountPage(): Promise<void> {
        await Promise.all([this.page.waitForURL('**/openaccount*', { timeout: 15_000 }), this.click(this.openNewAccountLink)]);

    }

    /**
     * Creates an additional Savings account and returns Newly created account ID.
     */
    async createAdditionalAccount(): Promise<string> {
        await this.selectDropdownByLabel(this.accountTypeDropdown, 'SAVINGS');
        const accountValue = await this.existingAccountDropdown.locator('option').first().getAttribute('value');
        if (!accountValue) {
            throw new Error('Account not available');
        }
        await this.selectOption(this.existingAccountDropdown, accountValue);
        await this.click(this.openNewAccountButton);
        await expect(this.accountOpenedMessage).toContainText('Account Opened');
        const accountId = await this.getText(this.newAccountId);
        return accountId;
    }
    /**
     * Verifies that the newly created account
     * appears in the Accounts Overview page.
     */

    async verifyAccountCreated(accountId: string): Promise<void> {
        await this.page.getByRole('link', { name: 'Accounts Overview' }).click();
        const createdAccount = this.page.getByRole('link', { name: accountId });
        await expect(createdAccount).toBeVisible();
    }

} 