import moment from 'moment';
import color from 'colors';

// utils
import { db } from '../utils/firebase.utils';
// configs
import hymns from '../../configs/hymns.config.json';

const programDate = '200906_1300';
const programConfig = {
    presiding: 'Bishop Vaughn Kinghorn',
    conducting: 'Bishop Vaughn Kinghorn',
    chorister: 'Lydia York',
    organist: 'Emily Hinchey',
    opening_hymn: 116,
    invocation: 'Laura York',
    sacrament_hymn: 191,
    program: [{
        type: 'talk',
        title: 'Speaker',
        topic: '',
        value: 'Mark Robbins',
        priority: 0
    }],
    closing_hymn: 141,
    benediction: 'Shane Moss',
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
    const date = moment.parseZone(`${programDate} -6:00`, 'YYMMDD_hhmm ZZ').format();

    return {
        ...program,
        date
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
