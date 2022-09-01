import dayjsLib from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjsLib.extend(utcPlugin);

export function utc(date, format) {
  if (!date) return dayjsLib().utc().local().format();
  if (format && date) return dayjsLib(date).utc().local().format(format);

  return dayjsLib(date).utc().local().format();
}

export function dateIdMaker(dateStr = '') {
  return dateStr.split(' ').join('');
}

export const currentYear = dayjsLib().year();
export const comingSunday = dayjsLib().day(7);
export const dayjs = dayjsLib;
