import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./firebase.utils', () => ({
  db: {
    collection: vi.fn(),
  },
}));

vi.mock('./localStorage.utils', () => ({
  getStorage: vi.fn(() => []),
  setStorage: vi.fn(),
  removeStorage: vi.fn(),
}));

const importFresh = async () => {
  vi.resetModules();
  return import('./announcements.utils.js'); // eslint-disable-line import/extensions
};

describe('announcements.utils upcoming helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-10T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('includes approved events that occur within the next 4 weeks', async () => {
    const { getUpcomingWithinWeeks } = await importFresh();
    const events = [
      { uid: '1', moderate: false, endDate: '2026-03-20' },
      { uid: '2', moderate: false, endDate: '2026-05-01' },
      { uid: '3', moderate: true, endDate: '2026-03-15' },
      { uid: '4', moderate: false, startDate: '2026-03-01', endDate: '2026-03-25' },
    ];

    const upcoming = getUpcomingWithinWeeks(events, 4);
    expect(upcoming.map(({ uid }) => uid)).toEqual(['4', '1']);
  });

  it('includes active announcements whose end date is after the window', async () => {
    const { overlapsNextWeeks } = await importFresh();
    expect(
      overlapsNextWeeks({
        moderate: false,
        type: 'announcement',
        endDate: '2026-05-31',
      })
    ).toBe(true);
  });

  it('excludes expired items and unapproved items', async () => {
    const { overlapsNextWeeks } = await importFresh();
    expect(overlapsNextWeeks({ moderate: false, endDate: '2026-03-01' })).toBe(false);
    expect(overlapsNextWeeks({ moderate: true, endDate: '2026-03-15' })).toBe(false);
  });

  it('formats event and announcement date labels', async () => {
    const { formatAnnouncementDateLabel } = await importFresh();
    expect(formatAnnouncementDateLabel({ endDate: '2026-03-14' })).toMatch(/Mar 14/);
    expect(formatAnnouncementDateLabel({ startDate: '2026-03-10', endDate: '2026-03-14' })).toContain('–');
    expect(formatAnnouncementDateLabel({ type: 'announcement', endDate: '2026-05-31' })).toMatch(/^Through /);
  });

  it('treats missing type as event', async () => {
    const { resolveAnnouncementType, ANNOUNCEMENT_TYPES } = await importFresh();
    expect(resolveAnnouncementType({})).toBe(ANNOUNCEMENT_TYPES.EVENT);
    expect(resolveAnnouncementType({ type: 'announcement' })).toBe(ANNOUNCEMENT_TYPES.ANNOUNCEMENT);
  });

  it('partitions announcements above events and sorts notices by date', async () => {
    const { partitionByAnnouncementType } = await importFresh();
    const items = [
      { uid: 'e1', type: 'event', endDate: '2026-03-20' },
      { uid: 'a2', type: 'announcement', endDate: '2026-05-01' },
      { uid: 'a1', type: 'announcement', endDate: '2026-03-15' },
      { uid: 'e2', endDate: '2026-04-01' },
    ];

    const { announcements, events } = partitionByAnnouncementType(items);
    expect(announcements.map(({ uid }) => uid)).toEqual(['a1', 'a2']);
    expect(events.map(({ uid }) => uid)).toEqual(['e1', 'e2']);
  });

  it('merges and applies pending edits', async () => {
    const { getEditableAnnouncement, applyPendingEditUpdate, hasPendingEdit } = await importFresh();
    const live = {
      uid: 'a1',
      title: 'Old',
      message: '<p>Old</p>',
      description: 'Old blurb',
      moderate: false,
      hasPendingEdit: true,
      pendingEdit: {
        title: 'New',
        message: '<p>New</p>',
        description: 'New blurb',
        group: 'Ward',
        endDate: '2026-12-06',
        startDate: '',
        time: '',
        type: 'event',
        qrLink: '',
        qrTitle: '',
        submittedBy: 'Ben Ellis',
      },
    };

    expect(hasPendingEdit(live)).toBe(true);
    expect(getEditableAnnouncement(live).title).toBe('New');
    expect(applyPendingEditUpdate(live)).toMatchObject({
      title: 'New',
      description: 'New blurb',
      hasPendingEdit: false,
      pendingEdit: null,
      moderate: false,
    });
  });
});
