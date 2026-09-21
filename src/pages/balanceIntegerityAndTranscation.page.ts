import { expect, Locator, Page } from '@playwright/test';

export class BalanceIntegrityAndTransactionPage {
    private readonly page: Page;

    readonly accountsOverviewLink: Locator;
    readonly billPayLink: Locator;
    readonly accountTable: Locator;

    readonly payeeNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneInput: Locator;
    readonly accountNumberInput: Locator;
    readonly verifyAccountInput: Locator;
    readonly amountInput: Locator;
    readonly fromAccountDropdown: Locator;
    readonly sendPaymentButton: Locator;

    readonly billPaymentCompleteHeading: Locator;
    readonly paymentResultContainer: Locator;

    constructor(page: Page) {
        this.page = page;

        this.accountsOverviewLink = page.getByRole('link', {name: 'Accounts Overview'});

        this.billPayLink = page.getByRole('link', {name: 'Bill Pay'});

        this.accountTable = page.locator('#accountTable');

        this.payeeNameInput = page.locator('input[name="payee.name"]');

        this.addressInput = page.locator('input[name="payee.address.street"]');

        this.cityInput = page.locator('input[name="payee.address.city"]');

        this.stateInput = page.locator('input[name="payee.address.state"]');

        this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');

        this.phoneInput = page.locator('input[name="payee.phoneNumber"]');

        this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');

        this.verifyAccountInput = page.locator('input[name="verifyAccount"]');

        this.amountInput = page.locator('input[name="amount"]');

        this.fromAccountDropdown = page.locator('select[name="fromAccountId"]');

        this.sendPaymentButton = page.getByRole('button', {name: 'Send Payment'});

        this.billPaymentCompleteHeading = page.getByRole('heading', {name: /Bill Payment Complete/i});

        this.paymentResultContainer = page.locator('#billpayResult');
    }

    /**
     * Opens the Accounts Overview page and records the first account's
     * account number and available balance.
     */
    async getCurrentAccountDetails(): Promise<{accountNumber: string;balance: number;}> 
    {
        await this.accountsOverviewLink.click();

        await expect(this.accountTable).toBeVisible();

        const firstAccountRow = this.accountTable.locator('tbody tr').first();

        await expect(firstAccountRow).toBeVisible();

        const accountNumber = (await firstAccountRow.locator('td').nth(0).innerText()).trim();

        const balanceText = (await firstAccountRow.locator('td').nth(1).innerText()).trim();

        const balance = this.convertCurrencyToNumber(balanceText);

        if (!accountNumber) {
            throw new Error(
                'Unable to capture the account number from Accounts Overview.'
            );
        }

        if (Number.isNaN(balance)) {
            throw new Error(
                `Unable to convert account balance "${balanceText}" to a number.`
            );
        }

        return {
            accountNumber,
            balance
        };
    }

    /**
     * Opens the Bill Pay page.
     */
    async navigateToBillPay(): Promise<void> {
        await this.billPayLink.click();

        await expect(this.page).toHaveURL(/billpay/i);
        await expect(this.payeeNameInput).toBeVisible();
    }

    /**
     * Selects the account captured from Accounts Overview.
     */
    async selectFromAccount(accountNumber: string): Promise<void> {
        const accountOption = this.fromAccountDropdown.locator(
            `option[value="${accountNumber}"]`
        );

        if (await accountOption.count()) {
            await this.fromAccountDropdown.selectOption(accountNumber);
            return;
        }

        /*
         * Fallback for environments where the option's label contains
         * the account number but the value differs.
         */
        await this.fromAccountDropdown.selectOption({
            label: accountNumber
        });
    }

    /**
     * Completes and submits a valid Bill Pay transaction.
     */
    async submitValidBillPayment(
        amount: string,
        fromAccountNumber: string
    ): Promise<void> {
        const numericAmount = Number(amount);

        if (
            !amount.trim() ||
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {
            throw new Error(
                `Payment amount must be greater than zero. Received: "${amount}".`
            );
        }

        await expect(this.payeeNameInput).toBeVisible();

        await this.payeeNameInput.fill(
            process.env.PAYEE_NAME ?? 'Electricity Utility'
        );

        await this.addressInput.fill(
            process.env.PAYEE_ADDRESS ?? '100 Main Street'
        );

        await this.cityInput.fill(
            process.env.PAYEE_CITY ?? 'Hyderabad'
        );

        await this.stateInput.fill(
            process.env.PAYEE_STATE ?? 'Telangana'
        );

        await this.zipCodeInput.fill(
            process.env.PAYEE_ZIP_CODE ?? '500081'
        );

        await this.phoneInput.fill(
            process.env.PAYEE_PHONE ?? '9876543210'
        );

        const payeeAccountNumber =
            process.env.PAYEE_ACCOUNT_NUMBER ?? '123456789';

        await this.accountNumberInput.fill(payeeAccountNumber);
        await this.verifyAccountInput.fill(payeeAccountNumber);
        await this.amountInput.fill(amount);

        await this.selectFromAccount(fromAccountNumber);

        await this.sendPaymentButton.click();
    }

    /**
     * Confirms that the Bill Pay confirmation is displayed.
     */
    async verifyBillPaymentCompleted(): Promise<void> {
        await expect(this.paymentResultContainer).toBeVisible();

        await expect(this.billPaymentCompleteHeading).toBeVisible();

        await expect(this.paymentResultContainer).toContainText(
            /Bill Payment Complete/i
        );
    }

    /**
     * Returns to Accounts Overview and reads the balance for the
     * specified account.
     */
    async getBalanceForAccount(accountNumber: string): Promise<number> 
    {
        await this.accountsOverviewLink.click();

        await expect(this.accountTable).toBeVisible();

        const accountRow = this.accountTable.locator('tbody tr').filter({has: this.page.getByRole('link', {name: accountNumber,exact: true})});

        await expect(accountRow,`Account ${accountNumber} was not found in Accounts Overview.`).toBeVisible();

        const balanceText = (await accountRow.locator('td').nth(1).innerText()).trim();

        const currentBalance =this.convertCurrencyToNumber(balanceText);

        if (Number.isNaN(currentBalance)) {
            throw new Error(
                `Unable to convert updated balance "${balanceText}" to a number.`
            );
        }

        return currentBalance;
    }

    /**
     * Converts values such as "$500.00" or "-$40.00" into numbers.
     */
    private convertCurrencyToNumber(value: string): number {
        const normalizedValue = value
            .replace(/[$,\s]/g, '')
            .replace(/^\((.*)\)$/, '-$1');

        return Number.parseFloat(normalizedValue);
    }
}