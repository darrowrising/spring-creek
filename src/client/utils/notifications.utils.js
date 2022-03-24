// utils
import { store, docs } from './firebase.utils';

export let newMembersUnsubscribe = null; // eslint-disable-line

export async function getNewMembers(set) {
  newMembersUnsubscribe = store
    .collection('members')
    .where('status', '==', 'pending')
    .onSnapshot(async (snap) => {
      const list = docs(snap) || [];

      set({
        loading: false,
        newMembers: list,
      });
    });
}
