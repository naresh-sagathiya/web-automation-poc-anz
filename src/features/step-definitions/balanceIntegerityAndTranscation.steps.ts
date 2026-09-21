import {Given,When,Then} from '@cucumber/cucumber';

import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

/**
 * Logs the customer into ParaBank.
 *
 * If this exact Cucumber expression is already present in another
 * step-definition file, do not define it again.
 */
Given('the customer is logged into ParaBank',async function (this: CustomWorld) {
        //await this.loginPage.open(process.env.BASE_URL!);
           // await this.loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);

        if (!process.env.BASE_URL) {
            throw new Error(
                'BASE_URL is not defined in the .env file.'
            );
        }

        if (!process.env.USERNAME) {
            throw new Error(
                'USERNAME is not defined in the .env file.'
            );
        }

        if (!process.env.PASSWORD) {
            throw new Error(
                'PASSWORD is not defined in the .env file.'
            );
        }

        await this.loginPage.open(process.env.BASE_URL!);
        await this.loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);

        /*
         * Replace isAccountServicesVisible() only if your LoginPage
         * uses a different method for confirming successful login.
         */
        

    }
);

/**
 * Captures the account number and the balance before payment.
 */
When(
    'the customer records the current account balance',
    async function (this: CustomWorld) {
        const accountDetails =
            await this.balanceIntegrityAndTransactionPage
                .getCurrentAccountDetails();

        this.transactionAccountNumber =
            accountDetails.accountNumber;

        this.initialAccountBalance =
            accountDetails.balance;

        console.log(
            `Transaction account: ${this.transactionAccountNumber}`
        );

        console.log(
            `Balance before payment: ${this.initialAccountBalance}`
        );
    }
);

/**
 * Opens the Bill Pay page.
 */
When(
    'the customer navigates to Bill Pay',
    async function (this: CustomWorld) {
        await this.balanceIntegrityAndTransactionPage
            .navigateToBillPay();
    }
);

/**
 * Submits the requested payment amount.
 */
When(
    'the customer submits a valid bill payment with the amount of {string}',
    async function (
        this: CustomWorld,
        amount: string
    ) {
        if (!this.transactionAccountNumber) {
            throw new Error(
                'The source account number was not recorded before Bill Pay.'
            );
        }

        this.paymentAmount = Number(amount);

        if (
            Number.isNaN(this.paymentAmount) ||
            this.paymentAmount <= 0
        ) {
            throw new Error(
                `Invalid payment amount received: "${amount}".`
            );
        }

        await this.balanceIntegrityAndTransactionPage
            .submitValidBillPayment(
                amount,
                this.transactionAccountNumber
            );
    }
);

/**
 * Validates the Bill Pay success confirmation.
 */
Then(
    'the bill payment should be completed successfully',
    async function (this: CustomWorld) {
        await this.balanceIntegrityAndTransactionPage
            .verifyBillPaymentCompleted();
    }
);

/**
 * Confirms that the account balance was reduced by the payment amount.
 */
Then(
    'the account balance should be decreased by {string}',
    async function (
        this: CustomWorld,
        expectedDecrease: string
    ) {
        if (!this.transactionAccountNumber) {
            throw new Error(
                'The transaction account number is missing from CustomWorld.'
            );
        }

        if (this.initialAccountBalance === undefined) {
            throw new Error(
                'The initial account balance is missing from CustomWorld.'
            );
        }

        const decreaseAmount = Number(expectedDecrease);

        if (Number.isNaN(decreaseAmount)) {
            throw new Error(
                `Expected balance decrease is invalid: "${expectedDecrease}".`
            );
        }

        const actualBalance =
            await this.balanceIntegrityAndTransactionPage
                .getBalanceForAccount(
                    this.transactionAccountNumber
                );

        const expectedBalance =
            Number(
                (
                    this.initialAccountBalance -
                    decreaseAmount
                ).toFixed(2)
            );

        console.log(
            `Balance before payment: ${this.initialAccountBalance}`
        );

        console.log(
            `Expected balance after payment: ${expectedBalance}`
        );

        console.log(
            `Actual balance after payment: ${actualBalance}`
        );

        expect(
            actualBalance,
            [
                'Account balance validation failed.',
                `Account: ${this.transactionAccountNumber}`,
                `Initial balance: ${this.initialAccountBalance}`,
                `Payment amount: ${decreaseAmount}`,
                `Expected balance: ${expectedBalance}`,
                `Actual balance: ${actualBalance}`
            ].join('\n')
        ).toBeCloseTo(expectedBalance, 2);
    }
);