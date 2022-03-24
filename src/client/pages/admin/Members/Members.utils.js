import { notification } from 'antd';
// utils
import { store, docs } from '../../../utils/firebase.utils';
import { utc } from '../../../utils/date.utils';

export let unsubscribe = null; // eslint-disable-line

export async function getMembers(set) {
  unsubscribe = store.collection('members').onSnapshot((snap) => {
    const members = (docs(snap) || [])
      .map((item) => ({
        ...item,
        displayName: `${item?.preferredName || item.firstName} ${item.lastName}`,
        callingsDisplay: (item?.callings || []).join(', '),
      }))
      .sort((a, b) => {
        if (a.lastName > b.lastName) return 1;
        if (a.lastName < b.lastName) return -1;

        return 0;
      });
    set({ members, loading: false });
  });
}

export async function deactivateMember(member) {
  try {
    await store.collection('members').doc(member.uid).update({
      updatedOn: utc(),
      status: 'deactivated',
      organizations: [],
      roles: [],
      callings: [],
    });

    notification.success({
      message: 'Member has been deactivated',
    });
  } catch (error) {
    notification.error({
      message: 'There was a problem deactivating member.',
    });
    console.error('error deactivating member', error);
  }
}

export async function combineMembers() {
  console.info('combine');
}
