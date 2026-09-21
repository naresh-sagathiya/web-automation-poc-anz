import { After, Before, BeforeAll, AfterAll, Status, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, chromium } from 'playwright';
import { GitHubWorld } from './github.world';
import fs from 'node:fs';

let browser: Browser;

BeforeAll({ timeout: 30_000 }, async function () {
  const storageState = process.env.GITHUB_STORAGE_STATE;
  if (!storageState || !fs.existsSync(storageState)) {
    throw new Error(
      'GITHUB_STORAGE_STATE must point to a Playwright storage-state JSON file for an authenticated GitHub account.'
    );
  }

  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined
  });
});

Before(async function (this: GitHubWorld) {
  const context = await browser.newContext({
    storageState: process.env.GITHUB_STORAGE_STATE
  });
  this.page = await context.newPage();
});

After(async function (this: GitHubWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }

  await this.page?.context().close();
});

AfterAll(async function () {
  await browser?.close();
});

setWorldConstructor(GitHubWorld);