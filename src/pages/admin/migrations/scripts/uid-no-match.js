import { db, docs } from '../../../../utils/firebase.utils';

export const uidNoMatch = async () => {
  const snapshot = await db.collection('members').get();
  const members = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  const nonMatching = [];

  members.forEach(({ id, data }) => {
    const { uid } = data;

    if (id !== uid) nonMatching.push({ id, data });
  });

  console.log('members:', nonMatching);
};
