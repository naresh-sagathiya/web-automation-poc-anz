const common = {
  requireModule: ['ts-node/register'],
  require: ['src/features/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  paths: ['src/features/**/*.feature'],
  format: ['progress'],
  publishQuiet: true,
  worldParameters: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com'
  }
};

module.exports = {
  default: common
};
