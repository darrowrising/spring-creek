// import { db, docs, realDB } from '../../../../utils/firebase.utils';
// import { hasData } from '../../../../utils/data.utils';
// import { dayjs, utc } from '../../../../utils/date.utils';

// const getEvents = async () => {
//   let events;

//   await realDB.ref('/announcements').once('value', (snap) => {
//     const val = snap.val();
//     events = Object.values(val).filter(({ uid }) => uid);
//   });

//   return events;
// };

// export const transferEvents = async () => {
//   const realTimeEvents = await getEvents();
//   const currentEvents = docs(await db.collection('announcements').get());

//   const eventsToUpdate = realTimeEvents.filter(({ uid }) => !currentEvents.some(({ uid: id }) => id === uid));

//   if (hasData(eventsToUpdate)) {
//     const updatedEvents = eventsToUpdate.map(({ startDate, endDate, time, ...rest }) => ({
//       ...rest,
//       startDate: startDate ? utc({ date: startDate }) : '',
//       endDate: utc({ date: endDate }),
//       time: utc({ date: time }),
//     }));

//     updatedEvents.forEach((event) => {
//       db.collection('announcements').doc(event.uid).set(event);
//     });
//   }
// };
