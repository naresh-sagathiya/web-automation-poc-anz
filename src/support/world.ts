import { IWorldOptions, World } from '@cucumber/cucumber';
import { Page } from 'playwright';
import { LoginPage } from '../pages/login.page';
import { OpenNewAccountPage } from '../pages/openNewAccount.page';
import { BalanceIntegrityAndTransactionPage } from '../pages/balanceIntegerityAndTranscation.page';
import { TransactionSearchPage } from '../pages/transcationSearch.page';

/**
 * Defines custom parameters that can be passed to the Cucumber World.
 */
export interface WorldParameters {
  // Base application URLs and credentials used across the BDD suite
  baseUrl: string;
  paraBankBaseUrl: string;
  mfaBaseUrl: string;
  paraBankUsername: string;
  paraBankPassword: string;
  
}

/**
 * Custom World class used to store and share test data,
 * page objects, and browser context between step definitions.
 */
export class CustomWorld extends World<WorldParameters> {
  // Playwright page instance used for browser automation
  page!: Page;
  capturedConfirmation = '';
  loginPage!: LoginPage;
  openNewAccountPage!: OpenNewAccountPage;
  balanceIntegrityAndTransactionPage!: BalanceIntegrityAndTransactionPage;
  transactionAccountNumber?: string;
  initialAccountBalance?: number;
  paymentAmount?: number;
  transactionSearchPage!: TransactionSearchPage;
  paymentAccountNumber = '';


  // Stores the account ID created during test execution
  createdAccountId!: string;

  transferAmount = '';
  transferDestinationAccount = '';

  mockedNow?: Date;
  selectedPaymentDate?: string;
  expectedEffectiveDate?: string;

  constructor(options: IWorldOptions<WorldParameters>) {
    super(options);
  }
}
