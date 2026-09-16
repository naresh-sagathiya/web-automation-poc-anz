import { Page, Locator } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async click(locator: Locator): Promise<void> {
        await locator.click();
    }

    async fill(locator: Locator, value: string): Promise<void> {
        await locator.fill(value);
    }

    async selectOption(locator: Locator, value: string): Promise<void> {
        await locator.selectOption(value);
    }

    async selectDropdownByLabel(locator: Locator, label: string): Promise<void> {
        await locator.selectOption({ label });
    }

    async getText(locator: Locator): Promise<string> {
        return (await locator.textContent()) ?? '';
    }

    async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

}