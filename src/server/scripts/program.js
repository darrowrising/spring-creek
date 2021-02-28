import color from 'colors';
// utils
import { db } from '../utils/firebase.utils';
import { dayjs } from '../../client/utils/date.utils';
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
    conducting: 'Shay Rolfson',
    chorister: 'Brandon Andersen',
    organist: 'Emily Hinchey',
    opening_hymn: 105,
    invocation: 'Collin Davidson',
    sacrament_hymn: 172,
    program: [
        {
            type: 'speaker',
            title: 'Youth Speaker',
            topic: '',
            value: 'Hannah Frasure',
            priority: 0,
        },
        {
            type: 'speaker',
            title: 'Speaker',
            topic: '',
            value: 'Chad Milne',
            priority: 1,
        },
    ],
    closing_hymn: 270,
    benediction: 'Megan Dyreng',
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
    const parseDate = dayjs(programDate, 'YYMMDD_hhmm');
    const date = dayjs.utc(parseDate).format();

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
