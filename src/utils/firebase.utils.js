import firebase from 'firebase/app';
// import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/functions';
// import 'firebase/storage';

const cypressEnv = (key) => (typeof globalThis.Cypress !== 'undefined' ? globalThis.Cypress.env(key) : undefined);

// configs
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || cypressEnv('VITE_API_KEY'),
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || cypressEnv('VITE_AUTH_DOMAIN'),
  databaseURL: import.meta.env.VITE_DATABASE_URL ?? cypressEnv('VITE_DATABASE_URL'),
  projectId: import.meta.env.VITE_PROJECT_ID ?? cypressEnv('VITE_PROJECT_ID'),
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET ?? cypressEnv('VITE_STORAGE_BUCKET'),
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID ?? cypressEnv('VITE_MESSAGING_SENDER_ID'),
  // appId: import.meta.env.VITE_APP_ID ?? cypressEnv('VITE_APP_ID'),
  measurementId: import.meta.env.VITE_MEASUREMENT_ID ?? cypressEnv('VITE_MEASUREMENT_ID'),
};

/* *** Initialize Firebase *** */
// admin.initializeApp({ credential: admin.credential.applicationDefault() });
firebase.initializeApp(firebaseConfig);

// database
export const db = firebase.firestore();
// export const realDB = firebase.database();
// db.settings({
//   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
//   merge: true,
// });
// db.enablePersistence().catch((err) => {
//   console.log('firestore error:', err);
// });
// export const storage = firebase.storage().ref();
export const FieldValue = () => firebase.firestore.FieldValue;
export const timeStamp = firebase.firestore.Timestamp.now();
/* ** authorization ** */
export const auth = firebase.auth();
export const functions = firebase.app().functions('us-west1');

if (import.meta.env.DEV && import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
  // 127.0.0.1 avoids some localhost CORS quirks with the Functions emulator
  functions.useFunctionsEmulator('http://127.0.0.1:5001');
}

export const createUser = (email, password) => auth.createUserWithEmailAndPassword(email, password);
// export const updateProfile = profile => user.updateProfile(profile);
// export const updatePassword = newPassword => user().updatePassword(newPassword);

export const signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);
export const signOut = () => auth.signOut();

// firebase data handling
/* single return of firebase doc */
export const doc = (snapshot) => snapshot.data();
export const docs = (snapshot) => snapshot.docs.map((document) => document.data());
/* multiple from a promise all */
export const allDocs = (snapshots) => snapshots.map((snap) => docs(snap));
