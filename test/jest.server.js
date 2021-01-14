const commonConfig = require('./jest-common');

module.exports = {
    ...commonConfig,
    displayName: 'Server',
    testEnvironment: 'jest-environment-node',
    testMatch: ['**/server/**/__tests__/**/*.[jt]s?(x)', '**/server/**/?(*.)+(spec|test).[jt]s?(x)']
};
