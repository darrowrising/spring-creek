/* eslint-disable import/no-extraneous-dependencies */
import color from 'colors';
// import moment from 'moment';
// import shortId from 'shortid';
// utils
import { db, docs, FieldValue } from '../src/utils/firebase.utils';
import { comingSunday, utc } from '../src/utils/date.utils';
import { catchify, uuid } from '../src/utils/data.utils';
// configs
import { hymns } from '../src/configs/hymns';
// import csbHymns from '../../configs/csbHymns.config.json';
import { meetingTimes } from '../src/configs/unit';
import dateFormats from '../src/configs/dateFormats';

const programDate = null;
// const programDate = '171217';
/* Program Options
 * talk
 * music
 * meeting
 * hymn
 */
/* Hymn Options
 * [number] = reqular hymns
 * csb_[number] = children song book
 */
const programConfig = {
  printLayout: 'simple',
  coverImage: '',
  presiding: 'Bishop Jake York',
  conducting: 'Steve Hunt',
  chorister: 'Libby Anderson',
  organist: 'Shawn Petersen',
  opening_hymn: 67,
  invocation: 'Drew Hancock',
  sacrament_hymn: 171,
  topic: '',
  program: [
    {
      type: 'meeting',
      title: '',
      value: 'Bearing of Testimonies',
      priority: 0,
    },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Emery Dyreng',
    //   priority: 0,
    // },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Jace Carroll',
    //   priority: 1,
    // },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Tyler Judkins',
    //   priority: 3,
    // },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Keri Kadri',
    //   priority: 4,
    // },
    // {
    //   type: 'hymn',
    //   priority: 1,
    // },
    // {
    //   type: 'music',
    //   title: 'Gloria',
    //   value: 'Performed by Grace Davidson. Accompanied by Shawn Petersen.',
    //   priority: 2,
    //   // lyrics: true,
    // },
  ],
  // intermediate_hymn: 19,
  closing_hymn: 231,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation please stand to sing. Accompanied by Nicholas Whipple and Shawn Petersen.',
  benediction: 'Omar Kadri',
  lyrics: {
    title: '',
    words: '',
  },
};

function getHymn(hymnRaw) {
  const isCSB = typeof hymnRaw === 'string' && hymnRaw.includes('csb');

  if (!hymnRaw)
    return {
      number: 'TBA',
    };

  if (hymnRaw?.title) return hymnRaw;

  if (isCSB) {
    const number = Number(hymnRaw.split('_')[1]);
    const csbHymn = csbHymns.find((item) => item.number === number);

    return {
      ...csbHymn,
      number: `CSB #${number}`,
      fileName: `CSB${number}`,
    };
  }

  const hymn = hymns.find((item) => item.number === hymnRaw);

  return {
    ...hymn,
    number: hymn.number,
  };
}

function updateWithHymns(program) {
  const { opening_hymn, sacrament_hymn, closing_hymn, intermediate_hymn = null } = program;
  const open = getHymn(opening_hymn);
  const sacrament = getHymn(sacrament_hymn);
  const intermediate = getHymn(intermediate_hymn);
  const close = getHymn(closing_hymn);

  return {
    ...program,
    opening_hymn: open?.number || '',
    opening_hymn_title: open?.title || '',
    opening_hymn_fileName: open?.fileName || '',
    sacrament_hymn: sacrament?.number || '',
    sacrament_hymn_title: sacrament?.title || '',
    sacrament_hymn_fileName: sacrament?.fileName || '',
    intermediate_hymn_title: intermediate?.title || null,
    closing_hymn: close?.number || '',
    closing_hymn_title: close?.title || '',
    closing_hymn_fileName: close?.fileName || '',
  };
}

function updateDate(program, dateTime = '09:00') {
  const { fbDocId_long } = dateFormats;
  const dateValue = programDate ?? fbDocId;

  const parseDate = utc({ date: `${dateValue}_${dateTime}`, format: fbDocId_long });
  const date = utc.parseZone(parseDate).utc().format();

  return {
    ...program,
    date,
  };
}

async function doesProgramExist(date) {
  const program = await store.collection('program').where('date', '==', date).get();
  const doc = docs(program)[0];

  if (doc?.id) return doc;
  return false;
}

async function getMember(name, lastName) {
  const [error, memberSnap] = await catchify(store.collection('members').where('lastName', '==', lastName).get());

  if (error) console.error('Error: getting member', name, LastName);

  return docs(memberSnap).find(({ preferredName, firstName }) => [preferredName, firstName].includes(name));
}

function getName(displayName) {
  const names = displayName.split(' ');
  const firstName = names.shift();
  return [firstName, names.join(' ')];
}

async function saveLastSpokedInSacrament(data) {
  for (let index = 0; index < data.program.length; index += 1) {
    const { type, value } = data.program[index];

    if (type === 'talk') {
      const [firstName, lastName] = getName(value);
      const member = (await getMember(firstName, lastName)) ?? {};
      let updatedMember = { ...member };
      const date = data.date;

      if (!member.lastSpokeInSacrament) {
        updatedMember.lastSpokeInSacrament = date;
      } else if (member.lastSpokeInSacrament === date) {
        console.info(color.yellow(`${member.firstName} speaking date has already been added.`));
      } else if (member.lastSpokeInSacrament < date) {
        console.log(color.red(`${member.firstName} has spoken before`));
        updatedMember.lastSpokeInSacrament = date;
        updatedMember.speakingHistory = FieldValue().arrayUnion(member.lastSpokeInSacrament);
      } else if (!member.speakingHistory.includes(date)) {
        console.log(color.cyan(`${member.firstName} has spoken before`));
        updatedMember.speakingHistory = FieldValue().arrayUnion(date);
      }

      if (member?.uid) {
        try {
          await store.collection('members').doc(member.uid).update(updatedMember);
        } catch (error) {
          console.error(color.red(`Error saving ${member.firstName} last spoke data`));
          process.exit(1);
        }
      }
    }
  }
}

async function makeProgramData() {
  const time = meetingTimes[0];
  let program = updateWithHymns(programConfig);
  program = updateDate(program, time);

  const collection = await db.collection('program');
  const doc = await doesProgramExist(program.date);

  if (doc) {
    await collection.doc(doc.uid).update({
      ...doc,
      ...program,
    });
  } else {
    const uid = uuid();
    await collection.doc(uid).set({
      ...program,
      time,
      id: programDate ?? fbDocId,
      year: utc({ date: program.date, format: 'YYYY' }),
      uid,
    });
  }
  await saveLastSpokedInSacrament(program);

  console.log('Program', color.yellow(programDate ?? fbDocId), color.green('uploaded successfully'));
  process.exit(0);
}

makeProgramData();
