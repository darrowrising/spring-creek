import moment from 'moment';
import dateFormat from '../configs/dateFormats';
// import { meetingTimes } from '../../configs/unit.config';

// function parseMeetingTime(time = '') {
//     return time.split(':').join('');
// }

export function sundayFunc(nextSunday) {
    // const compareTime = 'YYMMDDhhmm';
    const { fbDocId } = dateFormat;
    const today = moment().format(fbDocId);
    // const now = moment().format(compareTime);
    const sunday = today === moment().day(0).format(fbDocId) ? moment().day(0) : nextSunday;
    const sunId = moment(sunday).format(fbDocId);
    // const session = meetingTimes.find((item) => {
    //     const formatedTime = parseMeetingTime(item);
    //
    //     if (meetingTimes.length === 1) return item;
    //
    //     const compare = moment(`${sunId}_${formatedTime}`, compareTime).add(1, 'hour').format(compareTime);
    //     if (now < compare) return item;
    //
    //     return item;
    // });
    return sunId;
}

export const comingSunday = moment().day(7);
export const fbDocId = sundayFunc(comingSunday);
