import firebase from 'firebase/app';
// import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
// import 'firebase/storage';

// configs
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || Cypress.env('VITE_API_KEY'),
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || Cypress.env('VITE_AUTH_DOMAIN'),
  databaseURL: import.meta.env.VITE_DATABASE_URL ?? Cypress.env('VITE_DATABASE_URL'),
  projectId: import.meta.env.VITE_PROJECT_ID ?? Cypress.env('VITE_PROJECT_ID'),
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET ?? Cypress.env('VITE_STORAGE_BUCKET'),
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID ?? Cypress.env('VITE_MESSAGING_SENDER_ID'),
  // appId: import.meta.env.VITE_APP_ID ?? Cypress.env('VITE_APP_ID'),
  measurementId: import.meta.env.VITE_MEASUREMENT_ID ?? Cypress.env('VITE_MEASUREMENT_ID'),
};

console.log('firebaseConfig:', firebaseConfig);
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
export const createUser = (email, password) => auth.createUserWithEmailAndPassword(email, password);
// export const updateProfile = profile => user.updateProfile(profile);
// export const updatePassword = newPassword => user().updatePassword(newPassword);

export const signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);
export const signOut = () => auth.signOut();

// firebase data handling
/* single return of firebase doc */
export const docs = (snapshot) => snapshot.docs.map((doc) => doc.data());
/* multiple from a promise all */
export const allDocs = (snapshots) => snapshots.map((snap) => docs(snap));
