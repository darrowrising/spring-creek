import dayjs from 'dayjs';

// utils
import { store, docs } from '../../../../utils/firebase.utils';
import catchify from '../../../../utils/catchify.util';
// configs
import { meetingTimes as currentTimes } from '../../../../../configs/unit.config';
import { dateKey } from '../../../../../configs/dateFormats.configs';

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
        totalHouseholds: Object.values(statsTableData).map(session => session.map(item => item.households)[0]).reduce((a, b) => a + b),
        totalHeadcount: Object.values(statsTableData).map(session => session.map(item => item.headcount)[0]).reduce((a, b) => a + b)
    };
}

function parseStatsData(doc, date) {
    return doc[date];
}

export async function getData(date, set) { // eslint-disable-line
    const dateVar = dayjs(date).format(dateKey);

    unsubscribe = store
        .collection('attendance')
        .where('date', '==', dateVar)
        .where('status', '==', 'active')
        .onSnapshot(async (snap) => {
            const statsRef = store.collection('attendance').doc('stats');
            const [, statsSnap] = await catchify(statsRef.get());
            let stats;

            if (statsSnap.exists) {
                stats = parseStatsData(docs(statsSnap), dateVar);
                if (!stats) {
                    statsRef.update({ [dateVar]: { actualAttendance: 0 } });
                    stats = { actualAttendance: 0 };
                }
            } else {
                statsRef.set({ [dateVar]: { actualAttendance: 0 } });
            }

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
                ].sort((a, b) => {
                    if (a.createdOn > b.createdOn) return 1;
                    if (a.createdOn < b.createdOn) return -1;
                    return 0;
                });
            });

            set({
                data,
                sessions: meetingTimes,
                loading: false,
                stats: {
                    ...calcStats(meetingTimes, data),
                    ...stats
                }
            });
        });
}

export function updateActualAttendance(date, value) {
    const dateVar = dayjs(date).format(dateKey);

    store.collection('attendance').doc('stats').update({
        [dateVar]: {
            actualAttendance: Number(value)
        }
    });
}
