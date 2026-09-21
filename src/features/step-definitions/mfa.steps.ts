import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { MfaPage } from '../../pages/mfa.page';
import { CustomWorld } from '../../support/world';
import { generateCurrentOtp, generateExpiredOtp } from '../../support/otp';

function mfaPage(world: CustomWorld): MfaPage {
  return new MfaPage(world.page);
}
// Creates and returns an instance of the MFA page object.
Given('I am on the MFA login page', async function (this: CustomWorld) {
  await mfaPage(this).open(this.parameters.mfaBaseUrl);
});

// Navigate to the MFA login page.
When('I enter MFA credentials with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await mfaPage(this).enterCredentials(username, password);
  }
);

//Enter username and password on the MFA login page.
When('I submit the current TOTP code', async function (this: CustomWorld) {
  await mfaPage(this).submitCode(generateCurrentOtp());
});

//Submit a valid, currently active TOTP code.
When('I submit an expired MFA code', async function (this: CustomWorld) {
  await mfaPage(this).submitCode(generateExpiredOtp());
});

//Submit an expired MFA code to validate error handling.
When(
  'I submit MFA code {string}',
  async function (this: CustomWorld, code: string) {
    await mfaPage(this).submitCode(code);
  }
);

//Submit a user-provided MFA code.
Then('I should see the MFA challenge', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).challengeVisible(), true);
});

//Verify that the MFA challenge screen is displayed.
Then('I should see the MFA code field', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).codeFieldVisible(), true);
});

//Verify that the MFA code input field is visible.
Then('I should see the verify button', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).verifyButtonVisible(), true);
});

//Verify that the Verify button is displayed.
Then(
  'I should see an invalid MFA code message',
  async function (this: CustomWorld) {
    assert.equal(await mfaPage(this).messageText(), 'Invalid MFA Code!');
  }
);


 //Verify that the user has successfully completed MFA and has been redirected away from the login page.
 
Then('I should be logged in successfully',async function (this: CustomWorld) {
    assert.equal(await mfaPage(this).loggedIn(this.parameters.mfaBaseUrl),true);
  }
);

//Verify that an invalid MFA code error message is displayed.
Then('I should see a required MFA code message', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).messageText(), 'The MFA Code is Required!');
});

//Verify that the user has successfully completed MFA and has been redirected away from the login page.
Then('I should see an invalid credentials message', async function (this: CustomWorld) {
  const message = await mfaPage(this).messageText();
  assert.match(message, /Invalid Username!|Invalid Password!/);
});

//Verify that a required MFA code validation message is displayed.
Then('I should remain on the MFA login form', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).challengeVisible(), true);
});

//Verify that the user remains on the MFA challenge page after submitting an invalid MFA code
Then(
  'I should remain on the MFA challenge',
  async function (this: CustomWorld) {
    assert.equal(await mfaPage(this).challengeVisible(), true);
  }
);

// Submit the MFA form without entering a code to validate required field behavior.
When(
  'I submit the login form without an MFA code',
  async function (this: CustomWorld) {
    await mfaPage(this).submitWithoutCode();
  }
);