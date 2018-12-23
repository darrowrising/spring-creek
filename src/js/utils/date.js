import moment from 'moment';
import dateFormat from '../configs/dateFormats';

function sundayFunc(nextSunday) {
    const today = moment().format(dateFormat.fbDocId);
    const sunday = today === moment().day(0).format(dateFormat.fbDocId) ? moment().day(0) : nextSunday;
    return sunday.format(dateFormat.fbDocId);
}

export const comingSunday = moment().day(7);
export const fbDocId = sundayFunc(comingSunday);
