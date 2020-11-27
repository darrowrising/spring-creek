import shortId from 'shortid';
// utils
import { store, docs } from '../../../../utils/firebase.utils';
import catchify from '../../../../utils/catchify.util';
import { dayjs } from '../../../../utils/date.utils';
// configs
import { meetingTimes as currentTimes } from '../../../../../configs/unit.config';
import {
    dateKey,
    dateLong,
    dateLongTime
} from '../../../../../configs/dateFormats.configs';

export let unsubscribe = null; // eslint-disable-line

function calcStats(meetingTimes, data) {
    const statsTableData = {};

    meetingTimes.forEach((time) => {
        const session = data[time];

        if (!session) {
            statsTableData[time] = [
                {
                    households: 0,
                    headcount: 0
                }
            ];
        } else {
            statsTableData[time] = [
                {
                    households: session.length,
                    headcount: session
                        .map(item => item.headcount)
                        .reduce((a, b) => a + b)
                }
            ];
        }
    });

    return {
        statsTableData,
        totalHouseholds: Object.values(statsTableData)
            .map(session => session.map(item => item.households)[0])
            .reduce((a, b) => a + b),
        totalHeadcount: Object.values(statsTableData)
            .map(session => session.map(item => item.headcount)[0])
            .reduce((a, b) => a + b)
    };
}

function parseStatsData(doc, date) {
    return doc[date];
}

export async function getData(date, set) {
    // eslint-disable-line
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
                meetingTimes = currentTimes.map((item) => {
                    const time = item.split(':');
                    return dayjs()
                        .hour(time[0])
                        .minute(time[1])
                        .format('h:mm');
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
                        session: sessionTime
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

    store
        .collection('attendance')
        .doc('stats')
        .update({
            [dateVar]: {
                actualAttendance: Number(value)
            }
        });
}

export function setAttendance(data, type, set) {
    const { firstName, lastName, headcount, date, uid, family } = data;
    const newDate = `${date} ${currentTimes[0]}`;
    const name =        family !== uid ? family : `${firstName} ${lastName}`.trim() + ' family'; // eslint-disable-line
    const document = {
        createdOn: dayjs.utc().format(),
        date: dayjs(date, dateLong).format(dateKey),
        fullDate: dayjs(newDate, dateLongTime)
            .utc()
            .format(),
        headcount,
        memberId: uid || '',
        name,
        status: 'active',
        uid: shortId.generate()
    };

    const doc = store.collection('attendance').doc(uid || document.uid); // eslint-disable-line

    if (type === 'update') {
        doc.update({
            headcount,
            name,
            memberId: document.uid
        });
    } else {
        doc.set(document);
    }
    set({
        showModal: false,
        modalContent: {}
    });
}
