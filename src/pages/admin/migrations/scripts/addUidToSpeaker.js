import { db, docs } from '../../../../utils/firebase.utils';
import { uuid } from '../../../../utils/data.utils';

export const addUidToSpeaker = async () => {
  const programsSnap = await db.collection('program').get();
  const programs = docs(programsSnap);

  programs.forEach(({ uid, program = [] }) => {
    const newProgram = program.map((items) => ({
      ...items,
      uid: uuid(),
    }));

    db.collection('program').doc(uid).update({ program: newProgram });
  });
};
