import { Page } from 'playwright';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async isLoaded(): Promise<boolean> {
    await this.page.locator('[data-test="inventory-container"]').waitFor();
    return this.page.url().includes('/inventory.html');
  }
}
