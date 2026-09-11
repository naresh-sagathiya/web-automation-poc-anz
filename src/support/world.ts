import { IWorldOptions, World } from '@cucumber/cucumber';
import { Page } from 'playwright';

export interface WorldParameters {
  baseUrl: string;
}

export class CustomWorld extends World<WorldParameters> {
  page!: Page;

  constructor(options: IWorldOptions<WorldParameters>) {
    super(options);
  }
}
