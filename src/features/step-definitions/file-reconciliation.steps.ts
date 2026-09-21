import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import path from 'node:path';
import { AccountsOverviewPage } from '../../pages/accounts-overview.page';
import {
  createCsvExport,
  createPdfExport,
  parseCsv,
  parsePdf
} from '../../support/export-files';
import { AccountSnapshot } from '../../support/export.types';
import { CustomWorld } from '../../support/world';

interface FileReconciliationWorld extends CustomWorld {
  accountSnapshot?: AccountSnapshot;
  exportedAccount?: AccountSnapshot;
  exportFilePath?: string;
}

Given(
  'I capture the first account details from the ParaBank UI',
  async function (this: FileReconciliationWorld) {
    const accountsPage = new AccountsOverviewPage(this.page);
    await accountsPage.open();
    this.accountSnapshot = await accountsPage.getFirstAccount();
  }
);

When(
  'I create a CSV export from the captured account details',
  async function (this: FileReconciliationWorld) {
    assert.ok(this.accountSnapshot, 'Account details were not captured from the UI');
    const outputDirectory = path.join(process.cwd(), 'test-results', 'downloads');

    this.exportFilePath = await createCsvExport(this.accountSnapshot, outputDirectory);
    this.exportedAccount = await parseCsv(this.exportFilePath);
  }
);

When(
  'I create a PDF export from the captured account details',
  async function (this: FileReconciliationWorld) {
    assert.ok(this.accountSnapshot, 'Account details were not captured from the UI');
    const outputDirectory = path.join(process.cwd(), 'test-results', 'downloads');

    this.exportFilePath = await createPdfExport(this.accountSnapshot, outputDirectory);
    this.exportedAccount = await parsePdf(this.exportFilePath);
  }
);

Then(
  'the CSV account details should match the ParaBank UI',
  async function (this: FileReconciliationWorld) {
    assert.deepEqual(
      this.exportedAccount,
      this.accountSnapshot,
      'CSV account data does not match ParaBank UI data'
    );
  }
);

Then(
  'the PDF account details should match the ParaBank UI',
  async function (this: FileReconciliationWorld) {
    assert.deepEqual(
      this.exportedAccount,
      this.accountSnapshot,
      'PDF account data does not match ParaBank UI data'
    );
  }
);
