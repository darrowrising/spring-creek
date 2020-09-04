// utils
import { db } from '../utils/firebase.utils';
// configs
import hymns from '../../configs/hymns.config.json';

// const programDate = '200906';
const programDate = '200830';

function makeProgramData() {
    const refPath = `/program/${programDate}`;
    db.ref(refPath).once('value', snap => console.log(snap.val()));
}

makeProgramData();
