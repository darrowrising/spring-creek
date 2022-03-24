import { utc } from '../../client/utils/date.utils';

import { store, docs, FieldValue } from '../../client/utils/firebase.utils';
import { dateKey } from '../../configs/dateFormats.configs';
import catchify from '../../client/utils/catchify.util';

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
        const member = allMembers.find(
          ({ lastName, preferredName, firstName }) =>
            value.includes(lastName) && (value.includes(preferredName) || value.includes(firstName))
        );
        if (member) {
          const { uid, lastSpokeInSacrament } = member;
          let obj = {};

          if (lastSpokeInSacrament < date) {
            obj = { ...obj, lastSpokeInSacrament: date };
            if (lastSpokeInSacrament) {
              obj = { ...obj, speakingHistory: FieldValue().arrayUnion(lastSpokeInSacrament) };
            }
          }
          await store.collection('members').doc(uid).update(obj);
        }
      }
    }
  }
  process.exit(0);
}

addLastSpokeToMember();

// async function addNewFields() {
//     const memberSnapshots = await store.collection('members').get();
//     const allMembers = docs(memberSnapshots);

//     for (let i = 0; allMembers.length > i; i += 1) {
//         const { uid } = allMembers[i];
//         await store.collection('members').doc(uid).update({
//             lastPrayedInSacrament: '',
//             lastSpokeInSacrament: '',
//             speakingHistory: [],
//         });
//     }
//     process.exit(0);
// }

// addNewFields();
