
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import billPayData from '../test-data/billpay.data.json';


/**
* Page Object Model implementation for Update Contact Information page.
* Encapsulates all page locators and user actions related to updating
* customer profile information in the ParaBank application.
*/ 
export class UpdateContactInfoPage extends BasePage {
    readonly updateContactInfoLink: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly address: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly zipCode: Locator;
    readonly phoneNumber: Locator;
    readonly updateProfileButton: Locator;
     
    /**
9
   * Initializes page locators required for Update Contact Info functionality.
   * @param page - Playwright page instance
   */
    constructor(page: Page) {
        super(page);

        this.updateContactInfoLink =page.getByRole('link', { name: 'Update Contact Info', exact: true});
        this.firstName = page.locator('#customer\\.firstName');
        this.lastName = page.locator('#customer\\.lastName');
        this.address = page.locator('#customer\\.address\\.street');
        this.city = page.locator('#customer\\.address\\.city');
        this.state = page.locator('#customer\\.address\\.state');
        this.zipCode = page.locator('#customer\\.address\\.zipCode');
        this.phoneNumber = page.locator('#customer\\.phoneNumber');
        this.updateProfileButton = page.locator('input[type="button"][value="Update Profile"]');
    }

     /**
     * Verifies that the user is successfully navigated
     * to the Accounts Overview page after login.
     */
    async verifyAccountsOverviewPage(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
    }

    /**
     * Navigates the authenticated user to the
     * Update Contact Information page and validates page loading.
     */
    async navigateToUpdateProfile(): Promise<void> {
        await this.click(this.updateContactInfoLink);
        await expect( this.page.getByRole('heading', { name: 'Update Profile' })).toBeVisible();
    }

    
    
    /**
    * Updates customer contact details using predefined
    * test data to validate profile update functionality.
    */
    async updateContactInformation(): Promise<void> {
        const contact = billPayData.contactInfo;

        await expect
            .poll(() => this.firstName.inputValue(), {
                timeout: 30_000,
                message: 'Expected ParaBank to load the existing customer profile before editing',
            })
            .not.toBe('');

        await this.fill(this.firstName, contact.firstName);
        await this.fill(this.lastName, contact.lastName);
        await this.fill(this.address, contact.address);
        await this.fill(this.city, contact.city);
        await this.fill(this.state, contact.state);
        await this.fill(this.zipCode, contact.zipCode);
        await this.fill(this.phoneNumber, contact.phone);
    }

   /**
   * Submits the updated profile information by clicking
   * the Update Profile button.
   */
    async submitProfileUpdate(username: string, password: string): Promise<void> {
        await this.updateProfileButton.waitFor({ state: 'visible', timeout: 30_000 });
        await expect(this.updateProfileButton).toBeEnabled();
        await this.page.route('**/services_proxy/bank/customers/update/**', async route => {
            const updateUrl = new URL(route.request().url());
            updateUrl.searchParams.set('username', username);
            updateUrl.searchParams.set('password', password);
            await route.continue({ url: updateUrl.toString() });
        });
        try {
            await this.updateProfileButton.click();
        } finally {
            await this.page.unroute('**/services_proxy/bank/customers/update/**');
        }
    }

  /**
   * Verifies that the contact information update request
   * is processed successfully and confirmation message is displayed.
  */
  async verifyProfileUpdated(): Promise<void> {
    const resultSection = this.page.locator('#updateProfileResult');
    const errorSection = this.page.locator('#updateProfileError');

    await expect
        .poll(
            async () => ({
                successVisible: await resultSection.isVisible(),
                errorVisible: await errorSection.isVisible(),
            }),
            {
                timeout: 30_000,
                message: 'Expected ParaBank to display either a profile-update success or error result',
            },
        )
        .toEqual({ successVisible: true, errorVisible: false });

    await expect(resultSection).toContainText('Profile Updated');
    await expect(resultSection).toContainText(
        'Your updated address and phone number have been added to the system.',
    );
 }
}