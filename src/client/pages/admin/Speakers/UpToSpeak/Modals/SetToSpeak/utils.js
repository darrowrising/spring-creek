/* eslint-disable */
import { generate as uid } from 'shortid';
// utils
import { store, docs, FieldValue } from '../../../../../../utils/firebase.utils';
import catchify from '../../../../../../utils/catchify.util';
import { utc } from '../../../../../../utils/date.utils';
// configs
import { dateKey } from '../../../../../../../configs/dateFormats.configs';
// factory
import { createMemberName } from '../../../../../../factories/member.factory';
import { createProgram, createTalk } from '../../../../../../factories/program.factory';

export const getProgram = async (id) => store.collection('program').where('id', '==', id).get();
export const saveProgram = async (date, position, speaker) => {
  const id = utc(date, dateKey);
  const [programError, programSnap] = await catchify(getProgram(id));

  if (programError) throw programError;

  const program = docs(programSnap)[0];
  const programUid = uid();
  const programRef = store.collection('program').doc(program?.uid ?? programUid);
  const updatedProgram = {
    date,
    program: FieldValue().arrayUnion(
      createTalk({ position, speaker: createMemberName(speaker), isYouth: speaker?.ageGroup === 'youth' })
    ),
  };

  if (program) {
    await programRef.update({
      ...program,
      ...updatedProgram,
    });
  } else {
    const newRecord = createProgram(updatedProgram);
    await programRef.set({
      ...newRecord,
      ...updatedProgram,
    });
  }
};

export const updateMember = (member) => store.collection('members').doc(member.uid).update(member);

export const saveMember = async (date, member) => {
  const speakingHistory = member?.speakingHistory ?? [];
  const updatedMember = {
    uid: member.uid,
    lastSpokeInSacrament: utc(date),
    speakingHistory: member?.lastSpokeInSacrament
      ? FieldValue().arrayUnion(member?.lastSpokeInSacrament)
      : speakingHistory,
  };

  if (member?.uid) {
    await updateMember(updatedMember);
  }
};
