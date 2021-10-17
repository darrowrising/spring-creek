/* eslint-disable */
import color from 'colors';
import moment from 'moment';
import shortId from 'shortid';
// utils
import { db, store, docs } from '../utils/firebase.utils';
import { fbDocId } from '../../js/utils/date';
import { utc } from '../../client/utils/date.utils';
// configs
import hymns from '../../configs/hymns.config.json';
import csbHymns from '../../configs/csbHymns.config.json';
import { meetingTimes } from '../../configs/unit.config';
import dateFormats from '../../js/configs/dateFormats';

const programDate = null;
// const programDate = '200112';
/* Program Options
 * talk
 * music
 * meeting
 */
/* Hymn Options
 * [number] = reqular hymns
 * csb_[number] = children song book
 */
const programConfig = {
    presiding: 'Bishop Vaughn Kinghorn',
    conducting: 'Tim Crowther',
    chorister: 'Lydia York',
    organist: 'Emily Hinchey',
    opening_hymn: 92,
    invocation: 'Jonny Anderson',
    sacrament_hymn: 192,
    topic: '',
    program: [
        {
            type: 'talk',
            title: 'Youth Speaker',
            value: 'Mitch Milne',
            priority: 0,
        },
        {
            type: 'talk',
            title: 'Speaker',
            value: 'Vanessa Taylor',
            priority: 1,
        },
        {
            type: 'talk',
            title: 'Speaker',
            value: 'Rob Wiser',
            priority: 2,
        },
    ],
    // intermediant_hymn: ,
    closing_hymn: 299,
    benediction: 'Megan Rolfson',
};

function getHymn(hymnRaw) {
    const isCSB = typeof hymnRaw === 'string' && hymnRaw.includes('csb');

    if (!hymnRaw)
        return {
            number: 'TBA',
        };

    if (isCSB) {
        const number = Number(hymnRaw.split('_')[1]);
        const csbHymn = csbHymns.find((item) => item.number === number);

        return {
            ...csbHymn,
            number: `CSB #${number}`,
            fileName: `CSB${number}`,
        };
    }

    const hymn = hymns.find((item) => item.number === hymnRaw);
    return {
        ...hymn,
        number: hymn.number,
    };
}

function updateWithHymns(program) {
    const { opening_hymn, sacrament_hymn, closing_hymn } = program;
    const open = getHymn(opening_hymn);
    const sacrament = getHymn(sacrament_hymn);
    const close = getHymn(closing_hymn);

    return {
        ...program,
        opening_hymn: open?.number || '',
        opening_hymn_title: open?.title || '',
        opening_hymn_fileName: open?.fileName || '',
        sacrament_hymn: sacrament?.number || '',
        sacrament_hymn_title: sacrament?.title || '',
        sacrament_hymn_fileName: sacrament?.fileName || '',
        closing_hymn: close?.number || '',
        closing_hymn_title: close?.title || '',
        closing_hymn_fileName: close?.fileName || '',
    };
}

function updateDate(program, dateTime = '09:00') {
    const { fbDocId_long } = dateFormats;
    const dateValue = programDate ?? fbDocId;

    const parseDate = moment(`${dateValue}_${dateTime}`, fbDocId_long);
    const date = moment.parseZone(parseDate).utc().format();

    return {
        ...program,
        date,
    };
}

async function doesProgramExist(date) {
    const program = await store.collection('program').where('date', '==', date).get();
    const doc = docs(program)[0];

    if (doc?.id) return doc;
    return false;
}

async function makeProgramData() {
    const uid = shortId.generate();
    const time = meetingTimes[0];
    let program = updateWithHymns(programConfig);
    program = updateDate(program, time);

    const collection = await store.collection('program');
    const doc = await doesProgramExist(program.date);

    if (doc) {
        await collection.doc(doc.uid).update({
            ...doc,
            ...program,
        });
    } else {
        await collection.doc(uid).set({
            ...program,
            time,
            id: programDate ?? fbDocId,
            year: utc(program.date, 'YYYY'),
            uid,
        });
    }

    console.log('Program', color.yellow(fbDocId), color.green('uploaded successfully'));
    process.exit(0);
}

makeProgramData();
