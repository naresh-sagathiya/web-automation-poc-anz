import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

/**
 * Logs the user into ParaBank using credentials
 * provided through environment variables.
 */
Given('user is logged into ParaBank', async function (this: CustomWorld) {
    const baseUrl = this.parameters?.baseUrl || process.env.BASE_URL || 'https://parabank.parasoft.com/parabank';
    const username = this.parameters?.paraBankUsername || process.env.PARABANK_USERNAME || process.env.USERNAME || 'john';
    const password = this.parameters?.paraBankPassword || process.env.PARABANK_PASSWORD || process.env.PASSWORD || 'demo';

    await this.loginPage.open(baseUrl);
    await this.loginPage.login(username, password);
});

//Navigates to the specified application page
When('user navigates to the {string} page', async function (this: CustomWorld, pageName: string) {
    if (pageName === 'Open New Account') {
        await this.openNewAccountPage.navigateToOpenNewAccountPage();
    }

});
/**
 * Creates a new additional account and stores
 * the generated account ID in the test context.
 */
When('user creates a new additional account', async function (this: CustomWorld) {
    this.createdAccountId = await this.openNewAccountPage.createAdditionalAccount();
});

/**
 * Verifies that the newly created account is displayed in the specified page
 */
Then('user should see the newly created account in the {string} page', async function (this: CustomWorld, pageName: string) {
    if (pageName === 'Accounts Overview') {
        await this.openNewAccountPage.verifyAccountCreated(this.createdAccountId);
    }
});