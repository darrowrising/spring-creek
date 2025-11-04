import { db } from '../../../../../../utils/firebase.utils';
import { dayjs } from '../../../../../../utils/date.utils';
import { DELAY_TIMES_OPTIONS } from './config';

const getDelayDate = (months) => dayjs().add(months, 'month').format();

export const updateMember = (member) => db.collection('members').doc(member.uid).update(member);

export const saveMember = async (months, reason, member) => {
  const updatedMember = {
    uid: member.uid,
    delayInPraying: getDelayDate(months),
    delayInPrayingReason: {
      reason,
      time: DELAY_TIMES_OPTIONS.find((option) => option.months === months)?.display,
    },
  };

  try {
    await updateMember(updatedMember);
  } catch (error) {
    console.error(`Unable to update ${member.preferredName ?? member.firstName}`, error);
  }
};
