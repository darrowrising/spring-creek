// utils
import { store as db, docs } from '../../../utils/firebase.utils';

export let unsubscribe = null; // eslint-disable-line

const totalEvents = (allEvents) =>
    allEvents.reduce((acc, curr) => {
        if (!acc?.devotionalTotal)
            return {
                devotionalTotal: acc.devotional.length + curr.devotional.length,
                activityTotal: acc.activity.length + curr.activity.length,
                overnightTotal: acc.overnight.length + curr.overnight.length,
                grandTotal:
                    acc.devotional.length +
                    curr.devotional.length +
                    acc.activity.length +
                    curr.activity.length +
                    acc.overnight.length +
                    curr.overnight.length,
            };

        return {
            ...acc,
            devotionalTotal: acc.devotionalTotal + curr.devotional.length,
            activityTotal: acc.activityTotal + curr.activity.length,
            overnightTotal: acc.overnightTotal + curr.overnight.length,
            grandTotal:
                acc.devotionalTotal +
                curr.devotional.length +
                acc.activityTotal +
                curr.activity.length +
                acc.overnightTotal +
                curr.overnight.length,
        };
    });

export function getSignups(set) {
    unsubscribe = db.collection('youthConference').onSnapshot((snap) => {
        const values = docs(snap);
        const totals = totalEvents(values);

        set({ loading: false, data: values, totals });
    });
}
