const commonConfig = require('./jest-common');

module.exports = {
    ...commonConfig,
    displayName: 'Client',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/client/**/__tests__/**/*.[jt]s?(x)', '**/client/**/?(*.)+(spec|test).[jt]s?(x)'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', 'jest-styled-components']
};
