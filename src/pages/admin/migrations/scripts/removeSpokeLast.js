import { db, docs } from '../../../../utils/firebase.utils';
import { catchify, uniq } from '../../../../utils/data.utils';

export const removeSpokeLast = async () => {
  const [error, data] = await catchify(db.collection('members').get());

  if (error) return;

  const members = docs(data);
  members
    .map(({ speakingHistory = [], lastSpokeInSacrament, lastPrayedInSacrament, ...rest }) => {
      const update = {
        ...rest,
        speakingHistory: uniq([...speakingHistory, lastSpokeInSacrament]).sort(),
      };
      return update;
    })
    .forEach((member) => {
      db.collection('members').doc(member.uid).set(member);
    });
};
