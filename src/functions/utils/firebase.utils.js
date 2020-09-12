import admin from 'firebase-admin';

// import config from '../configs/firebase.configs';
import config from '../configs/service.config';

// const env = process.env.NODE_ENV || 'production';

admin.initializeApp({
    credential: admin.credential.cert(config)
});

export const timeStamp = admin.firestore.Timestamp.now();
export const db = admin.firestore();
// firebase data handling
/* single return of firebase doc */
export const docs = snapshot => snapshot.docs.map(doc => doc.data());
/* multiple docs returned from a promise all */
export const allDocs = snapshots => snapshots.map(snap => docs(snap));
