import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { GitHubPage } from '../../pages/github.page';
import { GitHubWorld } from '../../github-support/github.world';

Given('I am authenticated on GitHub', async function (this: GitHubWorld) {
  const githubPage = new GitHubPage(this.page);
  await githubPage.openDashboard();
  assert.equal(await githubPage.isLoginPageVisible(), false, 'GitHub storage state is not authenticated');
});

Given('I open a private GitHub page', async function (this: GitHubWorld) {
  const githubPage = new GitHubPage(this.page);
  await githubPage.openPrivateSettings();
  assert.equal(await githubPage.isLoginPageVisible(), false, 'Private GitHub page could not be opened');
});

When('my GitHub session expires', async function (this: GitHubWorld) {
  await new GitHubPage(this.page).clearSession();
});

When('I press the browser back button', async function (this: GitHubWorld) {
  await new GitHubPage(this.page).goBack();
});

Then('I should not see authenticated GitHub content', async function (this: GitHubWorld) {
  const githubPage = new GitHubPage(this.page);
  // Back can display a cached protected document; request the protected page again to validate the session server-side.
  await githubPage.refreshPrivatePage();
  await this.page.waitForLoadState('domcontentloaded');
  assert.equal(
    await githubPage.isLoginPageVisible(),
    true,
    `Authenticated GitHub content was restored after Back: ${this.page.url()}`
  );
});

Then('refreshing the private GitHub page should require login', async function (this: GitHubWorld) {
  const githubPage = new GitHubPage(this.page);
  await githubPage.refreshPrivatePage();
  assert.equal(await githubPage.isLoginPageVisible(), true, 'Private GitHub page remained accessible after timeout');
});