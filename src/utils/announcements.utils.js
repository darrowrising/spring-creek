import { db } from './firebase.utils';
import { getStorage, setStorage, removeStorage } from './localStorage.utils';
import { isEmpty, sortEvents } from './data.utils';
import { dayjs, isAfter, utc } from './date.utils';
import { dateShort } from '../configs/dateFormats';

/** True when an approved announcement/event overlaps [today, today + weeks]. */
export const overlapsNextWeeks = (event = {}, { weeks = 4, now = dayjs() } = {}) => {
  const { endDate, startDate, moderate } = event;
  if (moderate !== false || !endDate) return false;

  const windowStart = dayjs(now).startOf('day');
  const windowEnd = dayjs(now).add(weeks, 'week').endOf('day');
  const itemStart = dayjs(startDate || endDate).startOf('day');
  const itemEnd = dayjs(endDate).endOf('day');

  return !itemStart.isAfter(windowEnd, 'day') && !itemEnd.isBefore(windowStart, 'day');
};

export const getUpcomingWithinWeeks = (events = [], weeks = 4, now = dayjs()) =>
  sortEvents(events.filter((event) => overlapsNextWeeks(event, { weeks, now })));

export const formatAnnouncementDateLabel = ({ startDate, endDate } = {}) => {
  if (!endDate) return '';

  const endLabel = utc({ date: endDate, format: dateShort });
  if (startDate) {
    const startLabel = utc({ date: startDate, format: dateShort });
    if (startLabel !== endLabel) return `${startLabel} – ${endLabel}`;
  }

  return endLabel;
};

export const deleteOutdatedEvents = (events) => {
  const storage = getStorage('events') || [];
  const expiredUids = events.filter(({ endDate }) => endDate && isAfter(endDate)).map(({ uid }) => uid);

  if (isEmpty(expiredUids)) return;

  expiredUids.forEach((uid) => db.collection('announcements').doc(uid).delete());

  const newStorage = storage.filter(({ uid }) => !expiredUids.includes(uid));

  if (isEmpty(newStorage)) removeStorage('events');
  else setStorage('events', newStorage);
};

export const syncStorageEvents = (events) => {
  const storage = getStorage('events') || [];

  if (isEmpty(storage)) return storage;

  const eventsByUid = new Map(events.map((event) => [event.uid, event]));
  const newStorage = storage.filter(({ uid }) => eventsByUid.get(uid)?.moderate === true);

  if (newStorage.length === storage.length) return storage;

  if (isEmpty(newStorage)) removeStorage('events');
  else setStorage('events', newStorage);

  return newStorage;
};
