import { db, docs, FieldValue } from '../../../../utils/firebase.utils';
import { dayjs, utc, comingSunday } from '../../../../utils/date.utils';
import { uuid, catchify, isEmpty } from '../../../../utils/data.utils';
import { createProgramId } from '../../../../factories/program';
import { hymns, csbHymns } from '../../../../configs/hymns';
import { meetingTime } from '../../../../configs/unit';
import { programIdShort, dateTime } from '../../../../configs/dateFormats';
import { programConfig, programDate } from '../../../../configs/makeProgram';

console.clear();

export function Result(result) {
  const { error, ...rest } = result;

  Result.Err = () => error;
  return { ...rest };
}

export const getHymn = (hymnNumber) => {
  if (!hymnNumber) return { number: 'TBA' };

  const hymn = hymns.find((item) => item.number === hymnNumber);

  if (!hymn) return { error: `Hymn number ${hymnNumber} does not exist.` };

  const isCSB = typeof hymnNumber === 'string' && hymnNumber.includes('csb');

  if (isCSB) {
    const number = Number(hymnNumber.split('_')[1]);
    const csbHymn = csbHymns.find((item) => item.number === number);

    return {
      ...csbHymn,
      number: `CSB #${number}`,
      fileName: `CSB${number}`,
    };
  }

  return {
    ...hymn,
    number: hymn.number,
  };
};

export function updateWithHymns({ opening_hymn = '', sacrament_hymn = '', closing_hymn = '', program = [] } = {}) {
  const buildHymns = (hymnNumber, name) => {
    const { number, title } = Result(getHymn(hymnNumber));

    return {
      [name]: number,
      [`${name}_title`]: title ?? '',
    };
  };

  return {
    ...buildHymns(opening_hymn, 'opening_hymn'),
    ...buildHymns(sacrament_hymn, 'sacrament_hymn'),
    program: program.map((item) => {
      const { type, value } = item;
      return type === 'hymn' ? { ...item, title: Result(getHymn(value))?.title } : item;
    }),
    ...buildHymns(program.find(({ type }) => type === 'hymn').value, 'intermediate_hymn'),
    ...buildHymns(closing_hymn, 'closing_hymn'),
  };
}

export function updateDate(programDateId) {
  const date = programDateId ? dayjs(programDateId, programIdShort).local().format() : utc({ date: comingSunday() });

  return {
    date,
    id: programDateId ?? createProgramId(),
  };
}

export async function doesProgramExist(id) {
  const program = await db.collection('program').where('id', '==', id).get();
  const doc = docs(program)[0];

  return doc?.id ? doc : false;
}

export async function getMember(name, lastName) {
  const [error, memberSnap] = await catchify(db.collection('members').where('lastName', '==', lastName).get());

  if (error) {
    memberSnap.error = 'No member records could be found at this time';
    return Result(memberSnap);
  }

  const findMember =
    docs(memberSnap).find(({ preferredName, firstName }) => [preferredName, firstName].includes(name)) ?? {};

  if (!findMember) findMember.error = `member ${name} ${lastName} could not be found.`;

  return Result(findMember);
}

export function parseName(displayName) {
  const names = displayName.split(' ');
  const firstName = names.shift();
  return [firstName, names.join(' ')];
}

export async function saveLastSpokedInSacrament(data) {
  for (let index = 0; index < data.program.length; index += 1) {
    const { type, value } = data.program[index];

    if (type === 'talk') {
      const [firstName, lastName] = parseName(value);
      const member = (await getMember(firstName, lastName)) ?? {}; // eslint-disable-line
      const updatedMember = { ...member };
      const { date } = data;

      const lastSpokeInSacrament = member.speakingHistory?.at(-1);

      if (isEmpty(member)) {
        console.info(`%c${firstName} is not a member of this ward`, 'color:lightpink');
      } else if (!lastSpokeInSacrament) {
        updatedMember.speakingHistory = FieldValue().arrayUnion(date);
        console.info(`%c${member.firstName} is speaking for the first time`, 'color:green');
      } else if (lastSpokeInSacrament === date) {
        console.info(`%c${member.firstName} speaking date has already been added`, 'color:yellow');
      } else if (lastSpokeInSacrament < date) {
        console.info(`%c${member.firstName} has spoken before`, 'color:red');
        updatedMember.speakingHistory = FieldValue().arrayUnion(date);
      } else if (!member?.speakingHistory?.includes(date)) {
        console.info(`%cUpdating a past date for ${member.firstName} in the speaking`, 'color:cyan');
        updatedMember.speakingHistory = FieldValue().arrayUnion(date);
      }

      if (member?.uid) {
        try {
          await db.collection('members').doc(member.uid).update(updatedMember); // eslint-disable-line
        } catch (error) {
          console.error(
            `%cError saving ${member.firstName} last spoke data`,
            'color:white;font-size:12px;font-family:arial;font-weight:100;background-color:red;padding:5px 10px;border-radius:4px'
          );
        }
      }
    }
  }
}

export async function buildProgram(config, programDateId) {
  const program = {
    ...config,
    ...updateWithHymns(config),
    ...updateDate(programDateId),
  };

  const existingProgram = await doesProgramExist(program.id);

  if (existingProgram) {
    return {
      ...existingProgram,
      program: {
        ...existingProgram,
        ...program,
      },
      programExist: true,
    };
  }
  return {
    program: {
      ...program,
      time: meetingTime,
      year: utc({ date: program.date, format: 'YYYY' }),
      uid: uuid(),
    },
    programExist: false,
  };
}

export async function makeProgram() {
  const { program, programExist } = await buildProgram(programConfig, programDate);

  const collection = await db.collection('program').doc(program?.uid);

  if (programExist) {
    await collection.update(program);
  } else {
    await collection.set(program);
  }

  await saveLastSpokedInSacrament(program);

  console.group('%cuploaded successfully', 'color:darkorange');
  console.log(`%c${utc({ date: program.date, format: dateTime })}`, 'color:gold');
  console.groupEnd();
  console.log('program:', program);
}
