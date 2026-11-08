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

  it('includes approved items that occur within the next 4 weeks', async () => {
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

  it('excludes expired items and unapproved items', async () => {
    const { overlapsNextWeeks } = await importFresh();
    expect(overlapsNextWeeks({ moderate: false, endDate: '2026-03-01' })).toBe(false);
    expect(overlapsNextWeeks({ moderate: true, endDate: '2026-03-15' })).toBe(false);
  });

  it('formats single and range date labels', async () => {
    const { formatAnnouncementDateLabel } = await importFresh();
    expect(formatAnnouncementDateLabel({ endDate: '2026-03-14' })).toMatch(/Mar 14/);
    expect(formatAnnouncementDateLabel({ startDate: '2026-03-10', endDate: '2026-03-14' })).toContain('–');
  });
});
