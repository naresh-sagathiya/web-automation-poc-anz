
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';


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
        this.updateProfileButton = page.locator('input[value="Update Profile"]');   }

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
        const contact = {
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '1234567890'
        };

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
    async submitProfileUpdate(): Promise<void> {
        await this.click(this.updateProfileButton);
    }

  /**
   * Verifies that the contact information update request
   * is processed successfully and confirmation message is displayed.
  */
    async verifyProfileUpdated(): Promise<void> {
        await expect(this.page.locator('#rightPanel')).toContainText('Profile Updated'); 
    }
}  