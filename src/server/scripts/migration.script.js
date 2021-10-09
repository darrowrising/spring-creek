import shortId from 'shortid';
import { utc } from '../../client/utils/date.utils';

import { store, db, docs } from '../../client/utils/firebase.utils';
import catchify from '../../client/utils/catchify.util';

async function addYearToProgramRecord() {
    const collection = await store.collection('program').get();
    const currentRecords = docs(collection);
    const updatedRecords = currentRecords.map((record) => {
        const year = utc(record.date, 'YYYY');
        return {
            ...record,
            year,
        };
    });

    updatedRecords.forEach((record) => {
        store.collection('program').doc(record.uid).update(record);
    });
}

addYearToProgramRecord();
