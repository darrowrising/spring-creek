import moment from 'moment';
import dateFormat from '../configs/dateFormats';
import { meetingTimes } from '../../configs/unit.config';

function parseMeetingTime(time) {
    return time.split(':').join('');
}

export function sundayFunc(nextSunday) {
    const { fbDocId, fbDocId_long } = dateFormat; // eslint-disable-line
    const today = moment().format(dateFormat.fbDocId);
    const sunday = today === moment().day(0).format(dateFormat.fbDocId) ? moment().day(0) : nextSunday;
    const sunId = moment(sunday).add(1, 'hour').format(fbDocId);
    const id = today < `${sunId}_${parseMeetingTime(meetingTimes[0])}` ? `${sunId}_${parseMeetingTime(meetingTimes[0])}` : `${sunId}_${parseMeetingTime(meetingTimes[1])}`;

    return id;
}

export const comingSunday = moment().day(7);
export const fbDocId = sundayFunc(comingSunday);
