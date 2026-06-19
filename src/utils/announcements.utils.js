import { db } from './firebase.utils';
import { getStorage, setStorage, removeStorage } from './localStorage.utils';
import { isEmpty } from './data.utils';
import { isAfter } from './date.utils';

export const deleteOutdatedEvents = (events) => {
  const storage = getStorage('events') || [];
  const expiredUids = events.filter(({ endDate }) => endDate && isAfter(endDate)).map(({ uid }) => uid);

  if (isEmpty(expiredUids)) return;

  expiredUids.forEach((uid) => db.collection('announcements').doc(uid).delete());

  const newStorage = storage.filter(({ uid }) => !expiredUids.includes(uid));

  if (isEmpty(newStorage)) removeStorage('events');
  else setStorage('events', newStorage);
};
