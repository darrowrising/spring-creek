import dayjs from 'dayjs';

// utils
import { store, docs } from '../../utils/firebase.utils';
// configs
import { meetingTimes as currentTimes } from '../../../configs/unit.config';

export let unsubscribe = null; // eslint-disable-line

function calcStats(meetingTimes, data) {
    const statsTableData = {};

    meetingTimes.forEach((time) => {
        const session = data[time];

        if (!session) {
            statsTableData[time] = [{
                households: 0,
                headcount: 0
            }];
        } else {
            statsTableData[time] = [{
                households: session.length,
                headcount: session
                    .map(item => item.headcount)
                    .reduce((a, b) => a + b)
            }];
        }
    });

    return {
        statsTableData,
        totalHouseholds: Object.values(statsTableData).map(session => session.map(item => item.households)[0]).reduce((a, b) => { console.log(a, b); return a + b; }),
        totalHeadcount: Object.values(statsTableData).map(session => session.map(item => item.headcount)[0]).reduce((a, b) => a + b)
    };
}

export async function getData(date, set) { // eslint-disable-line
    unsubscribe = store
        .collection('attendance')
        .where('date', '==', dayjs(date).format('YYMMDD'))
        .onSnapshot((snap) => {
            const doc = docs(snap);
            let meetingTimes = [];
            const data = {};

            if (dayjs().unix() <= dayjs(date, 'MMMM D, YYYY').unix()) {
                meetingTimes = currentTimes
                    .map((item) => {
                        const time = item.split(':');
                        return dayjs().hour(time[0]).minute(time[1]).format('h:mm');
                    });
            }

            doc.forEach((item) => {
                const sessionTime = dayjs(item.fullDate).format('h:mm');
                const exist = meetingTimes.some(time => time === sessionTime);
                const sesh = data[sessionTime] || [];

                if (!exist) meetingTimes.push(sessionTime);

                data[sessionTime] = [
                    ...sesh,
                    {
                        ...item,
                        session: sessionTime,
                    }
                ];
            });

            set({
                data,
                sessions: meetingTimes,
                loading: false,
                stats: calcStats(meetingTimes, data)
            });
        });
}
