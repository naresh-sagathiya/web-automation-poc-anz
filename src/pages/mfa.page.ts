import { Page } from 'playwright';
/// import .env ----use url mfa 
export class MfaPage {
  constructor(private readonly page: Page) {}

  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly codeInput = '#totpcode';
  private readonly loginButton = '#log-in';
  private readonly message = '#top_message';

  async open(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
  }

  async challengeVisible(): Promise<boolean> {
    return this.page.locator(this.codeInput).isVisible();
  }

  async codeFieldVisible(): Promise<boolean> {
    return this.page.locator(this.codeInput).isVisible();
  }

  async submitCode(code: string): Promise<void> {
    await this.page.locator(this.codeInput).fill(code);
    await this.page.locator(this.loginButton).click();
  }

  async submitWithoutCode(): Promise<void> {
    await this.page.locator(this.loginButton).click();
  }

  async verifyButtonVisible(): Promise<boolean> {
    return this.page.locator(this.loginButton).isVisible();
  }

  async messageText(): Promise<string> {
    return this.page.locator(this.message).innerText();
  }

  // async loggedIn(): Promise<boolean> {
  //   await this.page.waitForURL('https://seleniumbase.github.io/realworld/');
  //   return this.page.url() === 'https://seleniumbase.github.io/realworld/';
  // }
//   async loggedIn(expectedUrl: string): Promise<boolean> {
//   await this.page.waitForURL(expectedUrl, { timeout: 10000 });
//   return this.page.url() === expectedUrl;
// }
//   async loggedIn(): Promise<boolean> {
//   console.log('Current URL:', this.page.url());
//   await this.page.waitForTimeout(2000);
//   return !this.page.url().includes('/login');
// }
// async loggedIn(expectedUrl: string): Promise<boolean> {
//   await this.page.waitForTimeout(3000);

//   console.log('Current URL:', this.page.url());

//   return !this.page.url().includes('/login');
// }

async loggedIn(expectedUrl: string): Promise<boolean> {
  await this.page.waitForTimeout(3000);
  return !this.page.url().includes('/login');
}
}