import { db } from '../../../../utils/firebase.utils';
import { dayjs, utc } from '../../../../utils/date.utils';
import { programIdShort } from '../../../../configs/dateFormats';

export const filterLastPrayed = (members, tab) => {
  const eightYearsFromNow = dayjs().subtract(8, 'year').format('YYYY');
  const now = Number(utc({ format: programIdShort }));
  const sort = (list) =>
    list
      .map(({ prayerHistory = [], ...rest }) => {
        const lastPrayed = prayerHistory.at(-1) || '';
        return {
          prayerHistory,
          lastPrayed,
          ...rest,
        };
      })
      .filter(({ status }) => status !== 'deactivated')
      .filter(({ delayInPraying }) => {
        if (delayInPraying) {
          const delayDate = utc({ date: delayInPraying, format: programIdShort });
          return delayDate > now;
        }

        return true;
      })
      .filter(({ year }) => year <= eightYearsFromNow)
      .sort((a, b) => {
        if (a.lastPrayed > b.lastPrayed) return 1;
        else if (a.lastPrayed < b.lastPrayed) return -1;

        return 0;
      });

  if (tab === 'search') return sort(members);

  return sort(
    members.filter(({ ageGroup }) => ageGroup === tab).filter(({ delayInPraying }) => delayInPraying <= utc())
  );
};

export const saveNote = (docId, value = '') => {
  if (value) db.collection('members').doc(docId).update({ speakingNote: value });
};
