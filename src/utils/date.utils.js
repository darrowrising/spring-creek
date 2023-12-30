import dayjsLib from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { meetingTime } from '../configs/unit';
import { time, programIdShort } from '../configs/dateFormats';

dayjsLib.extend(utcPlugin);
dayjsLib.extend(customParseFormat);

// export function utc(date, format = '') {
//   if (!date) return dayjsLib().utc().local().format(format);
//   if (format && date) return dayjsLib(date).utc().local().format(format);

//   return dayjsLib(date).utc().local().format();
// }

export function utc({ date, format } = {}) {
  return dayjsLib(date).utc().local().format(format);
}

export const dateIdMaker = (dateStr = '') => dateStr.split(' ').join('');

export const currentYear = dayjsLib().year();

export const comingSunday = () => {
  const [meetingHour, meetingMinute] = meetingTime.split(':');

  const today = dayjsLib().format(programIdShort);
  const day = today === dayjsLib().day(0).format(programIdShort) ? 0 : 7;

  const date = dayjsLib().day(day).set('hour', meetingHour).set('minute', meetingMinute).set('second', '00');

  return date;
};

export const sacramentMeetingTime = dayjsLib(meetingTime, 'hh:mm').format(time);

export const getMonth = (date) => dayjsLib(date).format('MMMM');

export const dayjs = dayjsLib;
