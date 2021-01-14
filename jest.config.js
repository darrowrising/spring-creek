const commonConfig = require('./test/jest-common');

module.exports = {
    ...commonConfig,
    coverageReporters: ['lcov'],
    collectCoverageFrom: [
        './src/**/*.js',
        '!./src/generated_files/**',
        '!./src/**/*.styles.js',
        '!./src/**/*.style.js',
        '!./src/server/utils/webpack_middleware.js',
        '!./src/server/index.js',
        '!./src/configs/**',
        '!./src/server/utils/__fixtures__/**'
    ],
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'node'
    ],
    projects: [
        './test/jest.client.js',
        './test/jest.server.js'
    ]
};
