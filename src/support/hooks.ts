import { After, Before, BeforeAll, AfterAll, Status, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium } from 'playwright';
import dotenv from 'dotenv';
import { CustomWorld } from './world';
import { LoginPage } from '../pages/login.page';
import { OpenNewAccountPage } from '../pages/openNewAccount.page';
dotenv.config({path: './.env',override: true});

let browser: Browser;

BeforeAll({ timeout: 30_000 }, async function () {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined
  });
});

Before(async function (this: CustomWorld) {
  const context: BrowserContext = await browser.newContext();
  this.page = await context.newPage();

  // Initialize page objects
  this.loginPage = new LoginPage(this.page);
  this.openNewAccountPage = new OpenNewAccountPage(this.page);
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }

  await this.page?.context().close();
});

AfterAll(async function () {
  await browser?.close();
});

setWorldConstructor(CustomWorld);
