import moment from 'moment';
import dateFormat from '../configs/dateFormats';
import { meetingTimes } from '../../configs/unit.config';

function parseMeetingTime(time) {
    return time.split(':').join('');
}

export function sundayFunc(nextSunday) {
    const compareTime = 'YYMMDDhhmm';
    const { fbDocId } = dateFormat;
    const today = moment().format(fbDocId);
    const now = moment().format(compareTime);
    const sunday = today === moment().day(0).format(fbDocId) ? moment().day(0) : nextSunday;
    const sunId = moment(sunday).format(fbDocId);
    const afterFirstSession = moment(`${sunId}_${parseMeetingTime(meetingTimes[0])}`, compareTime).add(1, 'hour').format(compareTime);
    const session = now < afterFirstSession ? `${sunId}_${parseMeetingTime(meetingTimes[0])}` : `${sunId}_${parseMeetingTime(meetingTimes[1])}`;
    console.log('now > afterFirstSession:', now > afterFirstSession, now, afterFirstSession);
    return session;
}

export const comingSunday = moment().day(7);
export const fbDocId = sundayFunc(comingSunday);
