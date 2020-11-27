import moment from 'moment';
import color from 'colors';

// utils
import { db } from '../utils/firebase.utils';
import { fbDocId } from '../../js/utils/date';
// configs
import hymns from '../../configs/hymns.config.json';

const programDate = fbDocId;
// const programDate = '200920_1200';
const programConfig = {
    presiding: 'Bishop Vaughn Kinghorn',
    conducting: 'Shay Rolfson',
    chorister: 'Rachel Anderson',
    organist: 'Emily Hinchey',
    opening_hymn: 241,
    invocation: 'Rachael Clegg',
    sacrament_hymn: 86,
    program: [{
        type: 'talk',
        title: 'Youth Speaker',
        topic: '',
        value: 'Brody Rolfson',
        priority: 0
    }, {
        type: 'music',
        title: '',
        topic: '',
        value: '"Praise to the Man/If You Could Hie to Kolob", performed by Nicholas Whipple',
        priority: 1
    }, {
        type: 'talk',
        title: 'Speaker',
        topic: '',
        value: 'Sister Eliza Dangerfield',
        priority: 2
    }],
    closing_hymn: 14,
    benediction: 'Jared Empey',
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

    console.log('Program', color.yellow(programDate), color.green('uploaded successfully'));
    process.exit(0);
}

makeProgramData();
