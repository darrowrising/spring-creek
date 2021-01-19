import moment from 'moment';
import color from 'colors';

// utils
import { db } from '../utils/firebase.utils';
import { fbDocId } from '../../js/utils/date';
// configs
import hymns from '../../configs/hymns.config.json';

const programDate = fbDocId;
// const programDate = '200920_1200';
/* Program Options
 * talk
 * music
 * meeting
 */
const programConfig = {
    presiding: 'Bishop Vaughn Kinghorn',
    conducting: 'Peyton Smith',
    chorister: 'Lydia York',
    organist: 'Shawn Petersen',
    opening_hymn: 259,
    invocation: 'Mark Robbins',
    sacrament_hymn: 176,
    program: [
        {
            type: 'speaker',
            title: 'Speaker',
            topic: '',
            value: 'Abby Hansen',
            priority: 0,
        },
        {
            type: 'speaker',
            title: 'Speaker',
            topic: '',
            value: 'Josh Cowdin',
            priority: 1,
        },
    ],
    closing_hymn: 220,
    benediction: 'Taryn Lichfield',
};

function updateWithHymns(program) {
    const { opening_hymn, sacrament_hymn, closing_hymn } = program;
    const getHymn = (number) => hymns.find((item) => item.number === number);
    const open = getHymn(opening_hymn);
    const sacrament = getHymn(sacrament_hymn);
    const close = getHymn(closing_hymn);

    return {
        ...program,
        opening_hymn: open ? `#${open.number}` : '',
        opening_hymn_title: open?.title || '',
        sacrament_hymn: sacrament ? `#${sacrament.number}` : '',
        sacrament_hymn_title: sacrament.title || '',
        closing_hymn: close ? `#${close.number}` : '',
        closing_hymn_title: close.title || '',
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
