require('dotenv').config();

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/github-support/**/*.ts',
      'src/features/step-definitions/github-session-timeout.steps.ts'
    ],
    paths: ['src/features/github-session-timeout.feature'],
    format: ['progress'],
    publishQuiet: true
  }
};