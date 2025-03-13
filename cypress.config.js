import { defineConfig } from 'cypress';
// import { plugin as cypressFirebasePlugin} from "cypress-firebase";
// import admin from "firebase-admin";

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
  browser: 'chrome',
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    // setupNodeEvents(on, config) {
    //   return cypressFirebasePlugin(on, config, admin, {
    //     projectId: "springcreek-test",
    //     rules: `
    //       service cloud.firestore {
    //         match /databases/{database}/documents {
    //           match /{document=**} {
    //             allow read, write: if false;
    //           }
    //         }
    //       }
    //     `,
    //   })
    // }
  },
  env: {
    VITE_ANALYTICS: 'UA-131499754-2',
    VITE_API_KEY: 'AIzaSyCY2mZFP_ahbp6RzqkWDSuZ6exuwwkn8Gw',
    VITE_AUTH_DOMAIN: 'springcreek-test.firebaseapp.com',
    VITE_DATABASE_URL: 'https://springcreek-test.firebaseio.com',
    VITE_PROJECT_ID: 'springcreek-test',
    VITE_STORAGE_BUCKET: 'springcreek-test.appspot.com',
    VITE_MESSAGING_SENDER_ID: '588470155331',
    VITE_MEASUREMENT_ID: '693722276180',
  },
});
