require('dotenv').config();
const common = {
  requireModule: ['ts-node/register'],
  require: ['src/features/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  format: ['progress'],
  publishQuiet: true,
  worldParameters: {
    baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank',
    paraBankBaseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank',
    mfaBaseUrl: process.env.MFA_BASE_URL || 'https://seleniumbase.github.io/realworld/login',
    paraBankUsername: process.env.PARABANK_USERNAME || 'john',
    paraBankPassword: process.env.PARABANK_PASSWORD || 'demo'
  }
};

module.exports = {
  default: common
};
