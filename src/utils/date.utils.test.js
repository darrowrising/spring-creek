import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Keep config-driven exports deterministic in tests.
vi.mock('../configs/unit', () => ({
  meetingTime: '10:30',
}));

vi.mock('../configs/dateFormats', () => ({
  time: 'h:mm A',
  programIdShort: 'MMDDYY',
}));

const importFresh = async () => {
  vi.resetModules();
  return import('./date.utils.js'); // eslint-disable-line import/extensions
};

describe('date.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dateIdMaker removes spaces', async () => {
    const { dateIdMaker } = await importFresh();
    expect(dateIdMaker('Jan 26 2026')).toBe('Jan262026');
  });

  describe('utc', () => {
    it('returns a utc date string if no date or format is provided', async () => {
      vi.setSystemTime(new Date('2026-01-26T12:00:00Z'));
      const { utc, dayjs } = await importFresh();
      // utc() converts to UTC then back to local; default format includes local offset.
      expect(utc()).toBe(dayjs().utc().local().format());
    });

    it('returns a formatted date string if a date is provided', async () => {
      vi.setSystemTime(new Date('2026-01-26T12:00:00Z'));
      const { utc, dayjs } = await importFresh();
      expect(utc({ date: '2026-01-26' })).toBe(dayjs('2026-01-26').utc().local().format());
    });

    it('returns a formatted date string if a format is provided', async () => {
      const { utc } = await importFresh();
      vi.setSystemTime(new Date('2026-01-26T12:00:00Z'));
      expect(utc({ date: '2026-01-26', format: 'YYYY-MM-DD' })).toBe('2026-01-26');
    });

    it('returns a formatted date string', async () => {
      const { utc } = await importFresh();
      expect(utc({ date: '2026-01-26', format: 'YYYY-MM-DD' })).toBe('2026-01-26');
    });
  });

  it('isBetween is inclusive by day', async () => {
    const { isBetween } = await importFresh();

    vi.setSystemTime(new Date('2026-01-10T12:00:00Z'));
    expect(isBetween({ start: '2026-01-10', end: '2026-01-20' })).toBe(true);

    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
    expect(isBetween({ start: '2026-01-10', end: '2026-01-20' })).toBe(true);

    vi.setSystemTime(new Date('2026-01-09T12:00:00Z'));
    expect(isBetween({ start: '2026-01-10', end: '2026-01-20' })).toBe(false);
  });

  it('isAfter compares by day', async () => {
    const { isAfter } = await importFresh();

    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    expect(isAfter('2026-01-14')).toBe(true);
    expect(isAfter('2026-01-16')).toBe(false);
  });

  it('comingSunday returns the next Sunday (or today if already Sunday) with meeting time', async () => {
    const { comingSunday } = await importFresh();

    // Monday -> next Sunday
    vi.setSystemTime(new Date('2026-01-26T12:00:00Z')); // Monday
    const nextSunday = comingSunday('10:30');
    expect(nextSunday.day()).toBe(0);
    expect(nextSunday.format('YYYY-MM-DD')).toBe('2026-02-01');
    expect(nextSunday.format('HH:mm:ss')).toBe('10:30:00');

    // Sunday -> same day
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z')); // Sunday
    const thisSunday = comingSunday('10:30');
    expect(thisSunday.day()).toBe(0);
    expect(thisSunday.format('YYYY-MM-DD')).toBe('2026-02-01');
    expect(thisSunday.format('HH:mm:ss')).toBe('10:30:00');
  });

  it('sacramentMeetingTime uses meetingTime and time format', async () => {
    const { sacramentMeetingTime } = await importFresh();
    expect(sacramentMeetingTime).toBe('10:30 AM');
  });

  it('getMonth returns month name', async () => {
    const { getMonth } = await importFresh();
    expect(getMonth('2026-02-01')).toBe('February');
  });

  it('currentYear is computed from now at import time', async () => {
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
    const { currentYear } = await importFresh();
    expect(currentYear).toBe(2026);
  });
});
