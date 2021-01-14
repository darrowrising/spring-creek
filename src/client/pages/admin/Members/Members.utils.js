// utils
import { store, docs } from '../../../utils/firebase.utils';

export let unsubscribe = null; // eslint-disable-line

export async function getMembers(set) {
    unsubscribe = store.collection('members').onSnapshot((snap) => {
        const members = docs(snap) || [];
        set({ members });
    });
}
