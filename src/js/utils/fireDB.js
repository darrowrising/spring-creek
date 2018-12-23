import firebase from 'firebase/app';
import 'firebase/database';

import fireConfig from '../configs/firebase';

firebase.initializeApp(fireConfig);

export default firebase.database();
