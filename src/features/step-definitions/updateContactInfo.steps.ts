import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../pages/login.page';
import { UpdateContactInfoPage } from '../../pages/updateContactInfo.page';
import { CustomWorld } from '../../support/world';

let loginPage: LoginPage;
let updateContactPage: UpdateContactInfoPage;

/**
* Retrieves ParaBank login credentials from environment variables.
* Falls back to default test credentials when environment values are unavailable.
* @returns Object containing username and password for authentication.
*/
function getParaBankCredentials(): { username: string; password: string } {
  return {
    username: process.env.PARABANK_USERNAME?.trim() || 'john',
    password: process.env.PARABANK_PASSWORD?.trim() || 'demo'
  };
}

/**
* Launches the ParaBank application and navigates to the login page.
* @param this - CustomWorld instance containing page and test context.
*/
async function openParaBankLoginPage(this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.open(this.parameters.baseUrl);
}

/**
* Performs user authentication using configured credentials.
* Initializes LoginPage instance if not already available.
* @param this - CustomWorld instance containing page and test context.
*/
async function loginToParaBank(this: CustomWorld) {
  const { username, password } = getParaBankCredentials(); 
  if (!loginPage) {
    loginPage = new LoginPage(this.page);
  }
  await loginPage.login(username, password);
}

/**
* Navigates the user to the ParaBank application login page.
*/
Given('user navigates to ParaBank application', { timeout: 30_000 }, async function (this: CustomWorld) {
  await openParaBankLoginPage.call(this);
});

/**
* Logs in to the application with valid user credentials.
*/
When('user logs in with valid credentials', async function (this: CustomWorld) {
  await loginToParaBank.call(this);
});

/**
* Navigates to the Update Contact Information page.
*/
When('user navigates to Update Contact Info page', async function (this: CustomWorld) {
  updateContactPage = new UpdateContactInfoPage(this.page);
  await updateContactPage.navigateToUpdateProfile();
});


/**
* Updates customer contact information with valid test data.
*/
When('user updates contact details with valid information', async function () {
  await updateContactPage.updateContactInformation();
});


/**
* Submits the updated profile information and verifies
* that the update operation completes successfully.
*/
Then('contact information should be updated successfully', async function () {
  await updateContactPage.submitProfileUpdate();
  await updateContactPage.verifyProfileUpdated();
});
