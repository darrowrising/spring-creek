import { db } from '../../../../utils/firebase.utils';
import { dayjs, utc } from '../../../../utils/date.utils';
import { programIdShort } from '../../../../configs/dateFormats';

export const filterLastSpoke = (members, tab) => {
  const eightYearsFromNow = dayjs().subtract(8, 'year').format('YYYY');
  const now = Number(utc({ format: programIdShort }));
  const sort = (list) =>
    list
      .map(({ speakingHistory = [], ...rest }) => {
        const lastSpoke = speakingHistory.at(-1) || '';
        return {
          speakingHistory,
          lastSpoke,
          ...rest,
        };
      })
      .filter(({ status }) => status !== 'deactivated')
      .filter(({ delayInSpeaking }) => {
        if (delayInSpeaking) {
          const delayDate = utc({ date: delayInSpeaking, format: programIdShort });
          return delayDate > now;
        }

        return true;
      })
      .filter(({ year }) => year <= eightYearsFromNow)
      .sort((a, b) => {
        if (a.lastSpoke > b.lastSpoke) return 1;
        else if (a.lastSpoke < b.lastSpoke) return -1;

        return 0;
      });

  if (tab === 'search') return sort(members);

  return sort(
    members.filter(({ ageGroup }) => ageGroup === tab).filter(({ delayInSpeaking }) => delayInSpeaking <= utc())
  );
};

export const saveNote = (docId, value = '') => {
  if (value) db.collection('members').doc(docId).update({ speakingNote: value });
};
