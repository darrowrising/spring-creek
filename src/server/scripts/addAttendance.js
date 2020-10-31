import shortId from 'shortid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// utils
import catchify from '../../client/utils/catchify.util';
// import { db, docs } from '../../functions/utils/firebase.utils';
import { store as db, docs } from '../utils/firebase.utils';

dayjs.extend(utc);

const calendlyConfig = {
    event: 'invitee.created',
    payload: {
        event: {
            start_time: 'September 27, 2020 12:00 PM',
        },
        invitee: {
            name: 'Andersen',
            email: 'charlesnandersen@gmail.com',
        },
        questions_and_answers: [{
            answer: '4'
        }],
    },
};

async function addAttendance(body) {
    const startTime = dayjs(body?.payload?.event.start_time, 'MMM D, YYYY H:mm A').utc().format();
    const createdOn = dayjs().utc().format();
    const type = body?.event;
    const date = dayjs(startTime).format('YYMMDD');
    const fullDate = dayjs(body?.payload?.event?.start_time).utc().format();
    const headcount = parseInt(body?.payload?.questions_and_answers[0]?.answer, 10);
    const email = body?.payload?.invitee?.email;
    const name = body?.payload?.invitee?.name;
    const uid = shortId.generate();

    const [, snap] = await catchify(db.collection('members')
        .where('email', '==', email)
        .get());
    const memberData = docs(snap)[0];
    const memberId = memberData?.uid || shortId.generate();

    if (type === 'invitee.created') {
        console.info(`${name} is attending ${fullDate}`);

        await db.collection('attendance').doc(uid).set({
            uid,
            date,
            headcount,
            status: 'active',
            fullDate,
            name: memberData?.lastName ? `${memberData.firstName} ${memberData.lastName} family` : name,
            createdOn,
            memberId
        });

        if (!memberData) {
            const [firstName, lastName] = name.split(' ');

            await db.collection('members').doc(memberId).set({
                firstName,
                lastName,
                email,
                createdOn,
                uid: memberId
            });
        }

        process.exit(0);
    } else {
        const [error, attSnap] = await catchify(db.collection('attendance')
            .where('memberId', '==', memberId)
            .where('status', '==', 'active')
            .get());

        if (error) {
            console.error(`Error: unable to find member ${memberId}`, error);
        } else {
            const att = docs(attSnap)[0];

            console.info(`${name} canceled`);

            await db.collection('attendance').doc(att.uid).update({ status: 'canceled' });
        }

        process.exit(0);
    }
}

addAttendance(calendlyConfig);
