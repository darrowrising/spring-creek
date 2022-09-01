import color from 'colors';

import { utc } from '../../client/utils/date.utils';

import { store, docs, FieldValue } from '../../client/utils/firebase.utils';
import { dateKey } from '../../configs/dateFormats.configs';
import catchify from '../../client/utils/catchify.util';

/* eslint-disable no-else-return */
function updateMember(member, date) {
  const newMember = { ...member };
  if (!member.lastSpokeInSacrament) {
    console.info(color.green(`${member.firstName}'s first time speaking`));
    newMember.lastSpokeInSacrament = date;
    return newMember;
  } else if (member.lastSpokeInSacrament === date) {
    console.info(color.yellow(`${member.firstName} speaking date has already been added.`));
    return newMember;
  } else if (member.lastSpokeInSacrament < date) {
    console.log(color.red(`Updating ${member.firstName}'s last spoke in sacrament date`));
    newMember.lastSpokeInSacrament = date;
    newMember.speakingHistory = FieldValue().arrayUnion(member.lastSpokeInSacrament);
    return newMember;
  } else if (!member.speakingHistory.includes(date)) {
    console.log(color.cyan(`${member.firstName} has spoken before. History may update`));
    newMember.speakingHistory = FieldValue().arrayUnion(date);
    return newMember;
  }
}

async function addLastSpokeToMember() {
  const programSnapshots = await store.collection('program').get();
  const memberSnapshots = await store.collection('members').get();
  const allPrograms = docs(programSnapshots);
  const allMembers = docs(memberSnapshots);

  for (let i = 0; allPrograms.length > i; i += 1) {
    const { program, date } = allPrograms[i];
    // console.log('program', program);
    for (let p = 0; program.length > p; p += 1) {
      const { type, value } = program[p];

      if (type === 'talk' && !!value) {
        const memberId = allMembers.find(({ lastName, preferredName, firstName }) => {
          const displayName1 = `${preferredName} ${lastName}`;
          const displayName2 = `${firstName} ${lastName}`;

          return displayName1 === value || displayName2 === value;
        })?.uid;

        if (!memberId) continue;

        const memberSnap = await store.collection('members').doc(memberId).get();
        let member = docs(memberSnap);

        member = {
          ...member,
          ...updateMember(member, date),
        };

        try {
          await store.collection('members').doc(member.uid).update({
            lastSpokeInSacrament: member.lastSpokeInSacrament,
            speakingHistory: member.speakingHistory,
          });
        } catch (error) {
          console.error(color.red(error));
          process.exit(1);
        }
      }
    }
  }
  process.exit(0);
}

addLastSpokeToMember();

// async function addNewFields() {
//   const memberSnapshots = await store.collection('members').get();
//   const allMembers = docs(memberSnapshots);

//   for (let i = 0; allMembers.length > i; i += 1) {
//     const { uid } = allMembers[i];

//     try {
//       await store.collection('members').doc(uid).update({
//         speakingNotes: FieldValue().delete(),
//         prayingNotes: FieldValue().delete(),
//         speakingNote: '',
//         prayingNote: '',
//       });
//     } catch (error) {
//       console.error(error);
//       process.exit(1);
//     }
//   }
//   process.exit(0);
// }

// addNewFields();
