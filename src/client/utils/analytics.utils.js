// utils
import { store as db } from './firebase.utils'; // eslint-disable-line
import { dayjs, utc } from './date.utils';
// configs
import { dateSimple } from '../../configs/dateFormats.configs';

export function updateMemberStats(memberId, currentStats, page) {
    const statPage = currentStats?.stats[page] || {};
    const data = { lastVisited: utc() };

    if (page) {
        const today = dayjs().format(dateSimple);
        const lastStatVisit = (statPage.dates || []).find((item) => utc(item, dateSimple) === today);
        data.stats = {
            [page]: {
                visted: (statPage?.visted || 0) + 1,
            },
        };
        if (!lastStatVisit) {
            const dates = data.stats[page].dates || [];
            data.stats[page].dates = [...dates, utc()];
        }
    }
    // console.log('data:', data);
    db.collection('members').doc(memberId).update(data);
}
