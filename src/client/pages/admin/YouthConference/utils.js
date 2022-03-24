// utils
import { store as db, docs } from '../../../utils/firebase.utils';

export let unsubscribe = null; // eslint-disable-line

const totalEvents = (allEvents) =>
  allEvents.reduce(
    (acc, curr) => ({
      devotionalTotal: acc?.devotionalTotal + curr?.devotional.length,
      activityTotal: acc?.activityTotal + curr?.activity.length,
      overnightTotal: acc?.overnightTotal + curr?.overnight.length,
    }),
    {
      devotionalTotal: 0,
      activityTotal: 0,
      overnightTotal: 0,
    }
  );

export function getSignups(set) {
  unsubscribe = db.collection('youthConference').onSnapshot((snap) => {
    const values = docs(snap);
    const totals = totalEvents(values);

    set({ loading: false, data: values, totals });
  });
}
