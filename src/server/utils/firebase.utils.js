import firebase from 'firebase/app';
// import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

// utils
import envHandler from './environmentHandler.utils';
// configs
import firebaseConfig from '../../js/configs/firebase';

const env = envHandler();

/* *** Initialize Firebase *** */
// admin.initializeApp({ credential: admin.credential.applicationDefault() });
firebase.initializeApp(firebaseConfig[env.dbEnv]);

// database
export const db = firebase.database();
// export const timeStamp = firebase.database.ServerValue.TIMESTAMP;
// firestore
export const store = firebase.firestore();
export const FieldValue = () => firebase.firestore.FieldValue;
// export const storeTimeStamp = firebase.firestore.Timestamp.now();
/* ** authorization ** */
// export const auth = firebase.auth();
// export const user = () => auth.currentUser;
// export const updateProfile = profile => user.updateProfile(profile);
// export const createMember = (email, password) => auth.createUserWithEmailAndPassword(email, password);
// export const updatePassword = newPassword => user().updatePassword(newPassword);

// export const signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);
// export const signOut = () => auth.signOut();

// export const emailLink = link => auth.isSignInWithEmailLink(link);

// storage
export const storage = firebase.storage().ref();

// firebase data handling
/* single return of firebase doc */
export const docs = snapshot => snapshot.docs.map(doc => doc.data());
/* multilpe from a promise all */
export const allDocs = snapshots => snapshots.map(snap => docs(snap));
