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
    conducting: 'Bishop Vaughn Kinghorn',
    chorister: 'Brandon Andersen',
    organist: 'Erin Dangerfield',
    opening_hymn: 210,
    invocation: 'Charles Andersen',
    sacrament_hymn: 175,
    program: [
        {
            type: 'talk',
            title: '',
            topic: '',
            value: 'Kylee Dickamore',
            priority: 0
        },
        {
            type: 'music',
            title: 'In the Bleak Midwinter',
            topic: '',
            value: 'Performed by Nora Davidson (viola). Accompanied by Emily Hinchey',
            priority: 1
        },
        {
            type: 'talk',
            title: '',
            topic: '',
            value: 'Ken Coxey',
            priority: 2
        },
    ],
    closing_hymn: 212,
    benediction: 'Rachel Anderson'
};

function updateWithHymns(program) {
    const { opening_hymn, sacrament_hymn, closing_hymn } = program;
    const getHymn = number => hymns.find(item => item.number === number);
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
        closing_hymn_title: close.title || ''
    };
}

function updateDate(program) {
    const parseDate = moment(programDate, 'YYMMDD_hhmm');
    const date = moment.utc(parseDate).format();

    return {
        ...program,
        date
    };
}

async function makeProgramData() {
    let program = updateWithHymns(programConfig);
    program = updateDate(program);

    await db.ref(`/program/${programDate}`).set(program);

    console.log(
        'Program',
        color.yellow(programDate),
        color.green('uploaded successfully')
    );
    process.exit(0);
}

makeProgramData();
