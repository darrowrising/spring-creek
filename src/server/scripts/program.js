/* eslint-disable */
import color from 'colors';
import moment from 'moment';
// utils
import { db } from '../utils/firebase.utils';
import { fbDocId } from '../../js/utils/date';
// configs
import hymns from '../../configs/hymns.config.json';
import csbHymns from '../../configs/csbHymns.config.json';

const programDate = fbDocId;
// const programDate = '200920_1200';
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
    conducting: 'Shay Rolfson',
    chorister: 'Brandon Andersen',
    organist: 'Emily Hinchey',
    opening_hymn: 304,
    invocation: 'Derek Wilcox',
    sacrament_hymn: 177,
    program: [
        {
            type: 'talk',
            title: 'Youth Speaker',
            topic: '',
            value: 'Jane Hunt',
            priority: 0,
        },
        {
            type: 'talk',
            title: 'Youth Speaker',
            topic: '',
            value: 'Westin Stewart',
            priority: 1,
        },
        {
            type: 'music',
            title: '',
            topic: '',
            value: '"More Than Enough", performed by Clara Petersen. Accompanied by Shawn Petersen.',
            priority: 2,
        },
        {
            type: 'talk',
            title: 'Youth Speaker',
            topic: '',
            value: 'Lydia York',
            priority: 3,
        },
        {
            type: 'talk',
            title: 'Speaker',
            topic: '',
            value: 'Josh Dyreng',
            priority: 4,
        },
    ],
    closing_hymn: 'csb_202',
    benediction: 'Kenny Frasure',
};

function getHymn(hymnRaw) {
    const isCSB = typeof hymnRaw === 'string' && hymnRaw.includes('csb');

    if (isCSB) {
        const number = Number(hymnRaw.split('_')[1]);
        const csbHymn = csbHymns.find((item) => item.number === number);
        console.log('csbHymn:', csbHymn, csbHymns, number);
        return {
            ...csbHymn,
            number: `CSB #${number}`,
            fileName: `CSB${number}`,
        };
    }

    const hymn = hymns.find((item) => item.number === hymnRaw);
    return {
        ...hymn,
        number: `#${hymn.number}`,
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

function updateDate(program) {
    const parseDate = moment(programDate, 'YYMMDD_hhmm');
    const date = moment.utc(parseDate).format();

    return {
        ...program,
        date,
    };
}

async function makeProgramData() {
    let program = updateWithHymns(programConfig);
    program = updateDate(program);

    await db.ref(`/program/${programDate}`).set(program);

    console.log('Program', color.yellow(programDate), color.green('uploaded successfully'));
    process.exit(0);
}

makeProgramData();
