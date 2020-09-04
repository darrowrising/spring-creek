import moment from 'moment';

// utils
import { db } from '../utils/firebase.utils';
// configs
import hymns from '../../configs/hymns.config.json';

const programDate = '200906_1200';
const programConfig = {
    presiding: 'Bishop Vaughn Kinghorn',
    conducting: 'Bishop Vaughn Kinghorn',
    chorister: 'Nora Davidson',
    organist: 'Emily Hinchey',
    opening_hymn: 116,
    invocation: '',
    sacrament_hymn: 191,
    program: [{
        type: 'talk',
        title: 'Testimony',
        topic: '',
        name: 'Eva Davidson',
        priority: '0'
    }, {
        type: 'talk',
        title: 'Speaker',
        topic: '',
        name: 'Mark Robbins',
        priority: '1'
    }],
    closing_hymn: 141,
    benediction: 'Sara Judkins',

    conference: false,
    date: '',
    fast_sunday: false,
    intermediate_hymn: '',
    musical_number: [],
    year: 2020
};

function updateWithHymns(program) {
    const { opening_hymn, sacrament_hymn, closing_hymn } = program;
    const getHymn = number => hymns.find(item => item.number === number);
    const open = getHymn(opening_hymn);
    const sacrament = getHymn(sacrament_hymn);
    const close = getHymn(closing_hymn);

    return {
        ...program,
        opening_hymn: `#${open.number}`,
        opening_hymn_title: open.title,
        sacrament_hymn: `#${sacrament.number}`,
        sacrament_hymn_title: sacrament.title,
        closing_hymn: `#${close.number}`,
        closing_hymn_title: close.title
    };
}

function updateDate(program) {
    const date = moment.parseZone(`${programDate} -6:00`, 'YYMMDD_hhmm ZZ').format();

    return {
        ...program,
        date
    };
}

function makeProgramData() {
    const refPath = `/program/${programDate}`;
    let program = updateWithHymns(programConfig);
    program = updateDate(program);

    db.ref(refPath).set(program);
}

makeProgramData();
