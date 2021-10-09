import moment from 'moment';

// configs
import { meetingTimes } from '../../../configs/unit.config';
import dateFormats from '../../configs/dateFormats';
// utils
import { comingSunday, fbDocId as sudayId } from '../../utils/date';
import { store, docs } from '../../utils/fireDB';

const { fbDocId, fbDocId_long, dateTime } = dateFormats;
const timeFormat = 'h:mm A';

export let unsubscribe = null; // eslint-disable-line

export function sessionLinks() {
    return meetingTimes.map((item) => {
        const today = moment().format(fbDocId);
        const sunday = today === moment().day(0).format(fbDocId) ? moment().day(0) : comingSunday;
        const date = `${moment(sunday).format(fbDocId)}_${item.split(':').join('')}`;

        return {
            display: moment(date, fbDocId_long).format(timeFormat),
            link: `/program/${date}`,
        };
    });
}

export function isSessionActive(date, session) {
    const time = moment(date).format(timeFormat);
    return time === session;
}

export function getProgramData(set, programDate) {
    const programId = programDate || sudayId;

    unsubscribe = store
        .collection('program')
        .where('id', '==', programId)
        .onSnapshot((programSnap) => {
            const program = docs(programSnap)[0];
            let state = {};

            if (program) {
                return set({ ...program, date: moment.utc(program.date).format(dateTime), loading: false });
            }

            if (programDate) {
                state = {
                    ...state,
                    errorMessage: 'No program can be found',
                };
            }
            return set({ loading: false, ...state });
        });
}
