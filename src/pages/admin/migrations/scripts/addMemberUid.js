import { db, docs } from '../../../../utils/firebase.utils';
import { catchify, uniq } from '../../../../utils/data.utils';

export const addMemberUid = async () => {
  const membersDB = db.collection('members').get();
  const programsDB = db.collection('program').get();

  Promise.allSettled([membersDB, programsDB]).then(([{ value: m }, { value: p }]) => {
    const members = docs(m);
    const programs = docs(p);

    const findMember = (name) =>
      members.find(
        ({ firstName, lastName, preferred }) =>
          (name.includes(preferred) || name.includes(firstName)) && name.includes(lastName)
      );

    programs.forEach(({ program, uid: programUid }) => {
      program.forEach(({ type, value, ...rest }, index) => {
        if (type === 'talk') {
          const { uid } = findMember(value) ?? {};
          if (uid) {
            const newProgram = [...program];
            const newTalk = {
              type,
              value,
              memberUid: uid,
              ...rest,
            };
            newProgram.splice(index, 1, newTalk);
            console.log('programUid:', programUid, newProgram);
            db.collection('program')
              .doc(programUid)
              .update({
                program: newProgram,
              })
              .catch((err) => {
                console.log('err:', err);
                console.log('programUid:', programUid);
              });
          }
        }
      });
    });
  });
};
