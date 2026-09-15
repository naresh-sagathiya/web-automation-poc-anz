import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { MfaPage } from '../../pages/mfa.page';
import { CustomWorld } from '../../support/world';
import { generateCurrentOtp } from '../../support/otp';

function mfaPage(world: CustomWorld): MfaPage {
  return new MfaPage(world.page);
}

Given('I am on the MFA login page', async function (this: CustomWorld) {
  await mfaPage(this).open(this.parameters.mfaBaseUrl);
});

When(
  'I enter MFA credentials with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await mfaPage(this).enterCredentials(username, password);
  }
);

When('I submit the current TOTP code', async function (this: CustomWorld) {
  await mfaPage(this).submitCode(generateCurrentOtp());
});

When(
  'I submit MFA code {string}',
  async function (this: CustomWorld, code: string) {
    await mfaPage(this).submitCode(code);
  }
);

Then('I should see the MFA challenge', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).challengeVisible(), true);
});

Then('I should see the MFA code field', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).codeFieldVisible(), true);
});

Then('I should see the verify button', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).verifyButtonVisible(), true);
});

Then(
  'I should see an invalid MFA code message',
  async function (this: CustomWorld) {
    assert.equal(await mfaPage(this).messageText(), 'Invalid MFA Code!');
  }
);

Then('I should be logged in successfully', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).loggedIn(), true);
});

Then('I should see a required MFA code message', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).messageText(), 'The MFA Code is Required!');
});

Then('I should see an invalid credentials message', async function (this: CustomWorld) {
  const message = await mfaPage(this).messageText();
  assert.match(message, /Invalid Username!|Invalid Password!/);
});

Then('I should remain on the MFA login form', async function (this: CustomWorld) {
  assert.equal(await mfaPage(this).challengeVisible(), true);
});

Then(
  'I should remain on the MFA challenge',
  async function (this: CustomWorld) {
    assert.equal(await mfaPage(this).challengeVisible(), true);
  }
);

When(
  'I submit the login form without an MFA code',
  async function (this: CustomWorld) {
    await mfaPage(this).submitWithoutCode();
  }
);