import { Page } from 'playwright';

export class GitHubPage {
  constructor(private readonly page: Page) {}

  async openDashboard(): Promise<void> {
    await this.page.goto('https://github.com/dashboard', { waitUntil: 'domcontentloaded' });
  }

  async openPrivateSettings(): Promise<void> {
    await this.page.goto('https://github.com/settings/profile', { waitUntil: 'domcontentloaded' });
  }

  async clearSession(): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  async refreshPrivatePage(): Promise<void> {
    await this.page.goto('https://github.com/settings/profile', { waitUntil: 'domcontentloaded' });
  }

  async isLoginPageVisible(): Promise<boolean> {
    return this.page.url().includes('/login') || await this.page.locator('input[name="login"]').isVisible().catch(() => false);
  }
}