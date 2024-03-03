import { defineConfig } from 'cypress';

// const baseUrl = 'https://springcreek-test.firebaseapp.com';
const baseUrl = 'http://localhost:3010';

export default defineConfig({
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      on('before:run', (details) => {
        if (details.specs && details.browser) {
          // details.specs and details.browser will be undefined in interactive mode
          // console.log('Running', details.specs.length, 'specs in', details.browser.name);
        }
      });
    },
  },
});
