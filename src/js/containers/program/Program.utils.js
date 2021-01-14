import moment from 'moment';

// configs
import { meetingTimes } from '../../../configs/unit.config';
import dateFormats from '../../configs/dateFormats';
// utils
import { comingSunday } from '../../utils/date';

const { fbDocId, fbDocId_long } = dateFormats;
const timeFormat = 'h:mm A';

export function sessionLinks() {
    return meetingTimes.map((item) => {
        const today = moment().format(fbDocId);
        const sunday = today === moment().day(0).format(fbDocId) ? moment().day(0) : comingSunday;
        const date = `${moment(sunday).format(fbDocId)}_${item.split(':').join('')}`;

        return {
            display: moment(date, fbDocId_long).format(timeFormat),
            link: `/program/${date}`,
        };
    });
}

export function isSessionActive(date, session) {
    const time = moment(date).format(timeFormat);
    return time === session;
}
