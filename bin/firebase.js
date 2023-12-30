#!/bin/node
/* eslint-disable import/no-extraneous-dependencies */

import admin from 'firebase-admin';
// import cert from '../tmp/fb-cert_prod.json';

// const cert = {
//   type: Bun.env.FB_TYPE,
//   project_id: Bun.env.FB_PROJECT_ID,
//   private_key_id: Bun.env.FB_PRIVATE_KEY_ID,
//   private_key: Bun.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   client_email: Bun.env.FB_CLIENT_EMAIL,
//   client_id: Bun.env.FB_CLIENT_ID,
//   auth_uri: Bun.env.FB_AUTH_URI,
//   token_uri: Bun.env.FB_TOKEN_URI,
//   auth_provider_x509_cert_url: Bun.env.FB_AUTH_PROVIDER,
//   client_x509_cert_url: Bun.env.FB_CLIENT_CERT,
//   universe_domain: Bun.env.FB_UNIVERSE_DOMAIN,
// };

const serviceAccount = {
  projectId: process.env.FB_PRIVATE_KEY_ID,
  clientEmail: process.env.FB_CLIENT_EMAIL,
  privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// console.log('cert:', cert);
// admin.initializeApp({
//   credential: admin.credential.cert(cert),
//   // databaseURL: 'https://springcreeklds.firebaseio.com',
// });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_DATABASE_URL,
});

export const db = admin.firestore();
