import shortId from 'shortid';
// utils
import { store as db, docs } from '../../../../utils/firebase.utils';
import catchify from '../../../../utils/catchify.util';

export async function getMembers(set) {
  const [error, members] = await catchify(db.collection('members').get());

  if (error) console.error(error);

  set({ members: docs(members), filteredMembers: [] });
}

export function searchMembers(value, members, set) {
  let list = members.filter((item) => {
    const firstName = (item?.firstName || '').toLowerCase().includes(value.toLowerCase());
    const lastName = (item?.lastName || '').toLowerCase().includes(value.toLowerCase());
    return firstName || lastName;
  });

  if (list.length === 0) {
    const name = value.split(' ');
    list = [
      {
        firstName: name[0],
        lastName: name[1] || '',
        id: shortId.generate(),
      },
    ];
  }

  set({
    members,
    filteredMembers: list,
  });
}
