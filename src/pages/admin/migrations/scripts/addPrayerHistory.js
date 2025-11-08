import { db, docs, FieldValue } from '../../../../utils/firebase.utils';
import { hasData } from '../../../../utils/data.utils';
import { calendlyDate } from '../../../../configs/dateFormats';
import { utc } from '../../../../utils/date.utils';

export const addPrayerHistory = async () => {
  const membersDB = db.collection('members').get();
  const programsDB = db.collection('program').orderBy('date', 'asc').get();

  Promise.allSettled([membersDB, programsDB]).then(([{ value: m }, { value: p }]) => {
    const members = docs(m);
    const programs = docs(p);

    const findMember = (name) =>
      members.find(
        ({ firstName, lastName, preferred }) =>
          (name.includes(preferred) || name.includes(firstName)) && name.includes(lastName)
      );

    members.forEach(({ uid, prayingHistory }) => {
      if (prayingHistory) {
        db.collection('members').doc(uid).update({
          prayingHistory: [],
        });
      }
    });

    const addDate = (date) => (name, type) => {
      const { uid: memberUid, prayingHistory = [] } = findMember(name) ?? {};
      const createPrayingHistory = { date, type };

      if (memberUid) {
        db.collection('members')
          .doc(memberUid)
          .update({
            prayingHistory: hasData(prayingHistory)
              ? FieldValue().arrayUnion(createPrayingHistory)
              : [createPrayingHistory],
          });
      }
    };

    programs.forEach(({ invocation, benediction, date }) => {
      const addDateToMember = addDate(date);
      if (invocation) addDateToMember(invocation, 'invocation');
      if (benediction) addDateToMember(benediction, 'benediction');
    });
  });
};
