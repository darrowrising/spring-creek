import { db, docs } from '../../../../utils/firebase.utils';
import { utc } from '../../../../utils/date.utils';
import { catchify } from '../../../../utils/data.utils';

export const backup = async (collection) => {
  const [error, data] = await catchify(db.collection(collection).get());

  if (error) return false;

  await db
    .collection('backups')
    .doc(collection)
    .set({
      name: collection,
      date: utc(),
      id: `${collection}-${utc({ format: 'MMDDYY' })}`,
      data: docs(data),
    });
};

export const remove = (collection) => {
  db.collection('backups').doc(collection).delete();
};

export const restore = async (collection, backup) => {
  backup.data.forEach((item) => {
    db.collection(collection).doc(item.uid).set(item);
  });
};
