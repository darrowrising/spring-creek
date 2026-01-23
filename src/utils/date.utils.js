import dayjsLib from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

import { meetingTime } from '../configs/unit';
import { time, programIdShort } from '../configs/dateFormats';

dayjsLib.extend(utcPlugin);
dayjsLib.extend(customParseFormat);
dayjsLib.extend(isBetweenPlugin);

export function utc({ date, format } = {}) {
  if (!date) return '';
  if (!format) return dayjsLib(date).utc().local().format();
  return dayjsLib(date).utc().local().format(format);
}

export const isBetween = ({ start, end }) => dayjsLib().isBetween(start, end, 'day', '[]');
export const isAfter = (endDate) => dayjsLib().isAfter(endDate, 'day');

export const dateIdMaker = (dateStr = '') => dateStr.split(' ').join('');

export const currentYear = dayjsLib().year();

export const comingSunday = (unitTime = '10:30') => {
  const [meetingHour, meetingMinute] = unitTime?.split(':') ?? [];

  const today = dayjsLib().format(programIdShort);
  const day = today === dayjsLib().day(0).format(programIdShort) ? 0 : 7;

  const date = dayjsLib().day(day).set('hour', meetingHour).set('minute', meetingMinute).set('second', '00');

  return date;
};

export const sacramentMeetingTime = dayjsLib(meetingTime, 'hh:mm').format(time);

export const getMonth = (date) => dayjsLib(date).format('MMMM');

export const dayjs = dayjsLib;
