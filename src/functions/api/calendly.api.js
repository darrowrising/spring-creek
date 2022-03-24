import Express from 'express';
import dayjs from 'dayjs';
import shortId from 'shortid';
import utc from 'dayjs/plugin/utc';

// utils
import { db, docs } from '../utils/firebase.utils';
import catchify from '../utils/catchify.util';

dayjs.extend(utc);

const app = new Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// methods
app.post('/api/hook/calendly', async (req, res) => {
  const { body } = req;
  const startTime = dayjs(body?.payload?.event?.start_time).utc().format();
  const createdOn = dayjs(body?.payload?.invitee?.created_at).utc().format();
  const type = body?.event;
  const date = dayjs(startTime).format('YYMMDD');
  const fullDate = dayjs(body?.payload?.event?.start_time).utc().format();
  const headcount = parseInt(body?.payload?.questions_and_answers[0]?.answer, 10);
  const email = body?.payload?.invitee?.email;
  const name = body?.payload?.invitee?.name;
  const uid = shortId.generate();

  const [, snap] = await catchify(db.collection('members').where('email', '==', email).get());
  const memberData = snap ? docs(snap)[0] : {};
  const memberId = memberData?.uid || shortId.generate();

  if (type === 'invitee.created') {
    console.info(`${name} is attending ${fullDate}`);

    db.collection('attendance')
      .doc(uid)
      .set({
        uid,
        date,
        headcount,
        status: 'active',
        fullDate,
        name: memberData?.lastName ? `${memberData.firstName} ${memberData.lastName} family` : name,
        createdOn,
        memberId,
      });

    if (!memberData) {
      const nameArray = name.split(' ');

      db.collection('members')
        .doc(memberId)
        .set({
          firstName: nameArray[0],
          lastName: nameArray.length > 1 ? nameArray.pop() : '',
          email,
          createdOn,
          uid: memberId,
        });
    }
  } else {
    const [error, attSnap] = await catchify(
      db.collection('attendance').where('memberId', '==', memberId).where('status', '==', 'active').get()
    );

    if (error) {
      console.error(`Error: unable to find member ${memberId}`, error);
    } else {
      const att = docs(attSnap)[0];

      console.info(`${name} canceled`);

      db.collection('attendance').doc(att.uid).update({ status: 'canceled' });
    }
  }

  res.send();
});

export default app;
