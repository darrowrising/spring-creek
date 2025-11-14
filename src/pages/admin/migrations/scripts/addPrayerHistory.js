import { db, docs, FieldValue } from '../../../../utils/firebase.utils';
import { hasData } from '../../../../utils/data.utils';

export const addPrayerHistory = async () => {
  const membersDB = db.collection('members').get();
  const programsDB = db.collection('program').orderBy('date', 'asc').get();

  Promise.allSettled([membersDB, programsDB]).then(async ([{ value: m }, { value: p }]) => {
    const members = docs(m);
    const programs = docs(p);
    console.log('program:', programs.length);
    const findMember = (name) =>
      members.find(({ firstName, lastName, preferredName }) => {
        const first = preferredName || firstName;
        return `${first} ${lastName}` === name;
      });

    // Clear existing praying history
    for (const { uid, prayingHistory } of members) {
      if (prayingHistory) {
        await db.collection('members').doc(uid).update({
          prayingHistory: [],
        });
      }
    }

    const addDate = (date) => async (name, type) => {
      const { uid: memberUid, prayingHistory = [], ...rest } = findMember(name) ?? {};
      const createPrayingHistory = { date, type };

      if (memberUid) {
        await db
          .collection('members')
          .doc(memberUid)
          .update({
            prayingHistory: hasData(prayingHistory)
              ? FieldValue().arrayUnion(createPrayingHistory)
              : [createPrayingHistory],
          });
      } else {
        // console.group('no memberUid');
        // console.log('name:', name);
        // console.groupEnd();
      }
    };

    // Add prayer history for all programs
    for (const { invocation, benediction, date } of programs) {
      const addDateToMember = addDate(date);

      if (invocation) await addDateToMember(invocation, 'invocation');
      if (benediction) await addDateToMember(benediction, 'benediction');
    }

    // All loops complete - log completion
    console.info(
      '%cDONE',
      'color:white;font-size:12px;font-family:arial;font-weight:100;background-color:#23c13e;padding:5px 10px;border-radius:4px'
    );
  });
};
