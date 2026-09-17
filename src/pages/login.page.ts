import { Page, Locator } from 'playwright';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {

  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly accountsOverviewLink: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview', exact: true });
    this.loginErrorMessage = page.locator('p.error');
  }

  async open(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.username.waitFor({ state: 'visible' });
  }

  /**
   * Login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.username, username);
    await this.fill(this.password, password);
    await this.click(this.loginButton);
  }

  async isAccountServicesPageVisible(): Promise<boolean> {
    try {
      return await this.accountsOverviewLink.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  async isLoginErrorVisible(): Promise<boolean> {
    try {
      return await this.loginErrorMessage.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}
