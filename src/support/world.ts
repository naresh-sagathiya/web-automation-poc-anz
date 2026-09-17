import { IWorldOptions, World } from '@cucumber/cucumber';
import { Page } from 'playwright';

export interface WorldParameters {
  baseUrl: string;
  mfaBaseUrl: string;
  paraBankBaseUrl: string;
  paraBankUsername: string;
  paraBankPassword: string;
}

export class CustomWorld extends World<WorldParameters> {
  page!: Page;
  capturedConfirmation = '';

  constructor(options: IWorldOptions<WorldParameters>) {
    super(options);
  }
}
