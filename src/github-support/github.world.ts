import { IWorldOptions, World } from '@cucumber/cucumber';
import { Page } from 'playwright';

export class GitHubWorld extends World {
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}