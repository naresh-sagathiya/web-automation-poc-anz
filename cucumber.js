require('dotenv').config();
const common = {
  requireModule: ['ts-node/register'],
  require: ['src/features/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  paths: ['src/features/**/*.feature'],
  format: ['progress'],
  publishQuiet: true,
  worldParameters: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
    mfaBaseUrl: process.env.MFA_BASE_URL || 'https://seleniumbase.github.io/realworld/login',
    paraBankBaseUrl: process.env.PARABANK_BASE_URL || 'https://parabank.parasoft.com/parabank',
    paraBankUsername: process.env.PARABANK_USERNAME || 'john',
    paraBankPassword: process.env.PARABANK_PASSWORD || 'demo'
  }
};

module.exports = {
  default: common
};
