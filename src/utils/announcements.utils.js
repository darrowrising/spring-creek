import { db } from './firebase.utils';
import { getStorage, setStorage, removeStorage } from './localStorage.utils';
import { isEmpty, sortEvents } from './data.utils';
import { dayjs, isAfter, utc } from './date.utils';
import { dateShort } from '../configs/dateFormats';

export const ANNOUNCEMENT_TYPES = {
  EVENT: 'event',
  ANNOUNCEMENT: 'announcement',
};

/** Existing docs without type are treated as events. */
export const resolveAnnouncementType = (event = {}) =>
  event.type === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? ANNOUNCEMENT_TYPES.ANNOUNCEMENT : ANNOUNCEMENT_TYPES.EVENT;

export const isAnnouncementType = (event = {}) =>
  resolveAnnouncementType(event) === ANNOUNCEMENT_TYPES.ANNOUNCEMENT;

/** Notices first (soonest deadline), then events stay separate for calendar grouping. */
export const partitionByAnnouncementType = (items = []) => {
  const announcements = [];
  const events = [];

  items.forEach((item) => {
    if (isAnnouncementType(item)) announcements.push(item);
    else events.push(item);
  });

  return {
    announcements: sortEvents(announcements),
    events,
  };
};

/** True when an approved announcement/event overlaps [today, today + weeks]. */
export const overlapsNextWeeks = (event = {}, { weeks = 4, now = dayjs() } = {}) => {
  const { endDate, startDate, moderate } = event;
  if (moderate !== false || !endDate) return false;

  const windowStart = dayjs(now).startOf('day');
  const windowEnd = dayjs(now).add(weeks, 'week').endOf('day');
  const itemEnd = dayjs(endDate).endOf('day');

  if (itemEnd.isBefore(windowStart, 'day')) return false;

  if (resolveAnnouncementType(event) === ANNOUNCEMENT_TYPES.ANNOUNCEMENT) {
    const itemStart = startDate ? dayjs(startDate).startOf('day') : dayjs(0);
    return !itemStart.isAfter(windowEnd, 'day');
  }

  const itemStart = dayjs(startDate || endDate).startOf('day');
  return !itemStart.isAfter(windowEnd, 'day') && !itemEnd.isBefore(windowStart, 'day');
};

export const getUpcomingWithinWeeks = (events = [], weeks = 4, now = dayjs()) =>
  sortEvents(events.filter((event) => overlapsNextWeeks(event, { weeks, now })));

export const formatAnnouncementDateLabel = (event = {}) => {
  const { startDate, endDate } = event;
  if (!endDate) return '';

  const endLabel = utc({ date: endDate, format: dateShort });

  if (resolveAnnouncementType(event) === ANNOUNCEMENT_TYPES.ANNOUNCEMENT) {
    return `Through ${endLabel}`;
  }

  if (startDate) {
    const startLabel = utc({ date: startDate, format: dateShort });
    if (startLabel !== endLabel) return `${startLabel} – ${endLabel}`;
  }

  return endLabel;
};

/** Disable only dates before today (today is allowed). */
export const isPastDate = (date) => dayjs(date).isBefore(dayjs(), 'day');

export const hasPendingEdit = (event = {}) => Boolean(event.hasPendingEdit && event.pendingEdit);

/** Form/moderation should review the proposed edit when one exists. */
export const getEditableAnnouncement = (event = {}) => {
  if (!hasPendingEdit(event)) return event;

  return {
    ...event,
    ...event.pendingEdit,
    uid: event.uid,
    moderate: event.moderate,
    hasPendingEdit: true,
    pendingEdit: event.pendingEdit,
    createdOn: event.createdOn,
    approvedOn: event.approvedOn,
    approvedBy: event.approvedBy,
  };
};

export const PENDING_EDIT_FIELDS = [
  'title',
  'group',
  'description',
  'message',
  'time',
  'startDate',
  'endDate',
  'type',
  'qrLink',
  'qrTitle',
];

export const buildPendingEdit = (announcement, { submittedBy } = {}) => {
  const pendingEdit = {
    submittedBy: submittedBy || announcement.createdBy || '',
    submittedOn: utc(),
  };

  PENDING_EDIT_FIELDS.forEach((field) => {
    pendingEdit[field] = announcement[field] ?? '';
  });

  return pendingEdit;
};

export const applyPendingEditUpdate = (event = {}) => {
  if (!hasPendingEdit(event)) return event;

  const next = { ...event };
  PENDING_EDIT_FIELDS.forEach((field) => {
    next[field] = event.pendingEdit[field] ?? '';
  });
  next.hasPendingEdit = false;
  next.pendingEdit = null;
  next.moderate = false;
  return next;
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
  const newStorage = storage.filter(({ uid }) => {
    const event = eventsByUid.get(uid);
    return event?.moderate === true || hasPendingEdit(event);
  });

  if (newStorage.length === storage.length) return storage;

  if (isEmpty(newStorage)) removeStorage('events');
  else setStorage('events', newStorage);

  return newStorage;
};
